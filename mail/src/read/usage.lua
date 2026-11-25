-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local types = require("types")
local database = require("database")
local resource = require("resource")
local originals_reader = require("originals")
local library_reader = require("library_reader")
local reference_repo = require("reference_repo")
local references = require("references")
local settings = require("settings")
local policy = require("policy")
local time = require("time")
local messages = require("message_reader")
local config = require("config")

local M = {}
local RECENT_SENDER_LIMIT = 100

local function original_referrers(originals: types.OriginalMap): {[string]: {types.ResourceKey}}
    local incoming: {[string]: {types.ResourceKey}} = {}
    for _, original in pairs(originals) do
        local item = original.resource
        if item.kind ~= "asset" then
            for _, target in ipairs(references.keys(item)) do
                local id = resource.subject(target)
                local keys = incoming[id] or {}
                keys[#keys + 1] = {kind = item.kind, name = item.name}
                incoming[id] = keys
            end
        end
    end
    return incoming
end

local function referrers(ex: database.Executor, key: types.ResourceKey,
    packaged: {[string]: {types.ResourceKey}}): ({types.ResourceKey}?, error?)
    local queue: {types.ResourceKey} = {key}
    local seen: {[string]: boolean} = {[resource.subject(key)] = true}
    local function add(source: types.ResourceKey)
        local id = resource.subject(source)
        if seen[id] then return end
        seen[id] = true
        queue[#queue + 1] = source
    end
    for _, target in ipairs(queue) do
        local stored, err = reference_repo.referrers(ex, target)
        if err then return nil, err end
        for _, source in ipairs(stored) do add(source) end
        for _, source in ipairs(packaged[resource.subject(target)] or {}) do
            if not seen[resource.subject(source)] then
                local current, read_err = library_reader.get(ex, source)
                if read_err then return nil, read_err end
                if not current or current.state == "original" then add(source) end
            end
        end
    end
    local result: {types.ResourceKey} = {}
    for i = 2, #queue do result[#result + 1] = queue[i] end
    table.sort(result, function(a, b) return resource.subject(a) < resource.subject(b) end)
    return result, nil
end

function M.referrers(ex: database.Executor, key: types.ResourceKey, originals: types.OriginalMap): ({types.ResourceKey}?, error?)
    return referrers(ex, key, original_referrers(originals))
end

function M.message_names(keys: {types.ResourceKey}): {string}
    local names: {string} = {}
    for _, key in ipairs(keys) do
        if key.kind == "message" then names[#names + 1] = key.name end
    end
    return names
end

function M.summaries(db: database.Executor, items: {types.LibraryListRow}, originals: types.OriginalMap): error?
    local packaged = original_referrers(originals)
    for _, item in ipairs(items) do
        if item.kind == "asset" or item.kind == "base" then
            local sources, read_err = referrers(db, item :: types.ResourceKey, packaged)
            if read_err then return read_err end
            item.used_by = {messages = #M.message_names(sources :: {types.ResourceKey})}
        end
    end
    return nil
end

local function recent_since(): (integer?, error?)
    local values, err = settings.mail()
    if err then return nil, err end
    local days = policy.retention_days(values.log_retention_days)
    if not days then return nil, config.setup_error("Mail delivery log retention days are invalid") end
    local now = time.now():unix_nano() // 1000000
    return now - days * policy.DAY_MS, nil
end

function M.used_by(item: types.Resource): (types.UsedBy?, error?)
    if item.kind == "asset" or item.kind == "base" then
        local declarations, err = originals_reader.list()
        if err then return nil, err end
        return database.with_db(function(db: database.DB): (types.UsedBy?, error?)
            local keys, read_err = M.referrers(db, item, declarations :: types.OriginalMap)
            if read_err then return nil, read_err end
            return {messages = M.message_names(keys :: {types.ResourceKey})}, nil
        end)
    elseif item.kind == "message" then
        local since, since_err = recent_since()
        if since_err then return nil, since_err end
        return database.with_db(function(ex: database.Executor): (types.UsedBy?, error?)
            local page, read_err = messages.recent_senders(ex, item.name, since :: integer, RECENT_SENDER_LIMIT)
            if read_err then return nil, read_err end
            return {recent_senders = page.items}, nil
        end)
    end
    return nil, nil
end

return M
