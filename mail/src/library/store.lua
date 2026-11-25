-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local types = require("types")
local database = require("database")
local library_reader = require("library_reader")
local library_repo = require("library_repo")
local reference_repo = require("reference_repo")
local references = require("references")
local resource = require("resource")
local asset_store = require("asset_store")

local M = {
    find = library_reader.rows,
    get = library_reader.get,
    history = library_reader.history,
    original_revisions = library_reader.original_revisions,
    live_rows = library_reader.live_rows,
}

local function targets(item: types.ResourceContent): {types.ResourceKey}
    local refs = references.refs(item)
    local keys: {types.ResourceKey} = {}
    for _, name in ipairs(refs.bases) do keys[#keys + 1] = {kind = "base", name = name} end
    for _, name in ipairs(refs.parts) do keys[#keys + 1] = {kind = "part", name = name} end
    for _, name in ipairs(refs.assets) do keys[#keys + 1] = {kind = "asset", name = name} end
    return keys
end

local function original_referrers(originals: types.OriginalMap): {[string]: {types.ResourceKey}}
    local incoming: {[string]: {types.ResourceKey}} = {}
    for _, original in pairs(originals) do
        local item = original.resource
        if item.kind ~= "asset" then
            for _, target in ipairs(targets(item)) do
                local id = resource.subject(target)
                local keys = incoming[id] or {}
                keys[#keys + 1] = {kind = item.kind, name = item.name}
                incoming[id] = keys
            end
        end
    end
    return incoming
end

local function referrers(ex: types.Executor, key: types.ResourceKey,
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

function M.referrers(ex: types.Executor, key: types.ResourceKey, originals: types.OriginalMap): ({types.ResourceKey}?, error?)
    return referrers(ex, key, original_referrers(originals))
end

function M.message_names(keys: {types.ResourceKey}): {string}
    local names: {string} = {}
    for _, key in ipairs(keys) do
        if key.kind == "message" then names[#names + 1] = key.name end
    end
    return names
end

function M.summary(db: types.Executor, dialect: string, declarations: {types.LibraryDeclaration},
    originals: types.OriginalMap, filter: types.ResourceFilter, after: types.ResourceKey?, limit: integer): (types.LibraryPage?, error?)
    local page, err = library_reader.summary_page(db, dialect, declarations, filter, after, limit)
    if err then return nil, err end
    local packaged = original_referrers(originals)
    for _, item in ipairs(page.items) do
        if item.kind == "asset" or item.kind == "base" then
            local sources, read_err = referrers(db, item :: types.ResourceKey, packaged)
            if read_err then return nil, read_err end
            item.used_by = {messages = #M.message_names(sources :: {types.ResourceKey})}
        end
    end
    return page, nil
end

function M.read(key: types.ResourceKey): (types.Resource?, error?)
    return database.with_db(function(db: types.DB): (types.Resource?, error?) return M.get(db, key) end)
end

function M.lock(tx: types.Transaction, dialect: string): error?
    local _, err = library_repo.lock(tx, dialect)
    return err
end

function M.write(tx: types.Transaction, item: types.Resource, change: types.RevisionChange): (types.Resource?, error?)
    local written, err = library_repo.write(tx, item, change)
    if err then return nil, err end
    local release_err = asset_store.release(tx, written.released)
    if release_err then return nil, release_err end
    if item.kind ~= "asset" and not item.archived and change.state ~= "original" then
        local _, ref_err = reference_repo.replace(tx, item, targets(item))
        if ref_err then return nil, ref_err end
    end
    return written.item, nil
end

function M.remove(tx: types.Transaction, key: types.ResourceKey, deleting: boolean): error?
    local released, err = library_repo.remove(tx, key, deleting)
    if err then return err end
    if key.kind ~= "asset" then
        local _, ref_err = reference_repo.delete_from(tx, key)
        if ref_err then return ref_err end
    end
    return asset_store.release(tx, released :: {types.Record})
end

return M
