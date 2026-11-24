-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local types = require("types")
local client = require("client")
local database = require("database")
local resources = require("resources")
local store = require("store")
local settings = require("settings")
local policy = require("policy")
local outbox = require("outbox")
local keyset = require("keyset")
local asset_refs = require("asset_refs")
local funcs = require("funcs")

local M = {}

local function read_asset_usage(name: string?): (types.AssetUsage?, error?)
    local usage, err = database.read(function(db: sql.DB): (types.AssetUsage?, error?)
        return store.asset_usage(db, name)
    end)
    if err then return nil, err end
    local messages, list_err = resources.list({kind = "message"})
    if list_err then return nil, list_err end
    local visible: types.ResourceMap = {}
    for _, item in ipairs(messages) do visible[resources.key(item)] = item end
    for asset, names in pairs(usage) do usage[asset] = resources.visible_messages(names, visible) end
    return usage, nil
end

local function recent_since(): (integer?, error?)
    local config, err = settings.read("kickside.mail")
    if err then return nil, err end
    local days = policy.retention_days(config.log_retention_days)
    if not days then return nil, settings.missing("Mail delivery log retention days are invalid") end
    return policy.now() - days * policy.DAY_MS, nil
end

local function used_by(item: types.Resource): (types.UsedBy?, error?)
    if item.kind == "asset" then
        local usage, err = read_asset_usage(item.name)
        if err then return nil, err end
        return {messages = usage[item.name] or {}}, nil
    elseif item.kind == "base" then
        local messages, read_err = resources.list({kind = "message", base = item.name})
        if read_err then return nil, read_err end
        return {messages = resources.names(messages)}, nil
    elseif item.kind == "message" then
        local since, since_err = recent_since()
        if since_err then return nil, since_err end
        local senders, read_err = outbox.recent_senders(item.name, since :: integer)
        if read_err then return nil, read_err end
        return {recent_senders = senders}, nil
    end
    return nil, nil
end

function M.get(input: types.ResourceKey): (types.Resource?, error?)
    local denied = client.require_library()
    if denied then return nil, denied end
    local found, err, declared = resources.get(input)
    if err then return nil, err end
    local item = found :: types.Resource
    if declared and item.kind ~= "asset" then
        local source = declared.resource
        item.original = {html = source.html, text = source.text, subject = source.subject,
            base = source.base, schema = source.schema, samples = source.samples}
    end
    local usage, usage_err = used_by(item)
    if usage_err then return nil, usage_err end
    item.used_by = usage
    return item, nil
end

function M.asset_content(name: string): (types.AssetContent?, error?)
    local denied = client.require_library()
    if denied then return nil, denied end
    local found, err = resources.get({kind = "asset", name = name})
    if err then return nil, err end
    local item = found :: types.Resource
    local ref = asset_refs.reference(item, asset_refs.cid(item.name))
    local file, read_err = funcs.call("kickside.mail.library:read_asset_file", {ref = ref, bytes = true})
    if read_err then return nil, read_err end
    local part = file :: types.AssetPart
    return {revision = item.revision, content_type = part.content_type, bytes = part.content :: string}, nil
end

function M.list(input: types.ResourceFilter?): ({types.Resource}?, error?)
    local denied = client.require_library()
    if denied then return nil, denied end
    if input == nil then input = {} end
    local invalid = resources.check_filter(input)
    if invalid then return nil, invalid end
    return resources.list(input)
end

function M.list_page(input: types.LibraryPageRequest): (types.LibraryPage?, error?)
    local denied = client.require_library()
    if denied then return nil, denied end
    local invalid = resources.check_filter(input)
    if invalid then return nil, invalid end
    local limit, cursor, page_err = keyset.args(input)
    if page_err then return nil, page_err end
    local after: types.ResourceKey?
    if cursor then
        local kind, name = cursor:match("^([a-z]+)/([a-z0-9][a-z0-9_%-]*)$")
        if not kind or not name then
            return nil, resources.error(errors.INVALID, "invalid_mail_filter", "Use the next cursor from a library page")
        end
        after = {kind = kind, name = name}
        if resources.check_key(after) then
            return nil, resources.error(errors.INVALID, "invalid_mail_filter", "Use the next cursor from a library page")
        end
    end
    local page, err = resources.page(input, after, limit :: integer)
    if err then return nil, err end
    local names: {string} = {}
    for _, row in ipairs(page.items) do
        if row.kind == "message" then names[#names + 1] = row.name end
    end
    if #names > 0 then
        local since, since_err = recent_since()
        if since_err then return nil, since_err end
        local counts, counts_err = outbox.recent_sender_counts(names, since :: integer)
        if counts_err then return nil, counts_err end
        for _, row in ipairs(page.items) do
            if row.kind == "message" then row.used_by = {recent_sources = counts[row.name] or 0} end
        end
    end
    return page, nil
end

function M.history(input: types.ResourceKey): ({types.Revision}?, error?)
    local denied = client.require_library()
    if denied then return nil, denied end
    local bad_key = resources.check_key(input)
    if bad_key then return nil, bad_key end
    local _, err = resources.get(input)
    if err then return nil, err end
    return database.read(function(db: sql.DB): ({types.Revision}?, error?)
        return store.history(db, input)
    end)
end

return M
