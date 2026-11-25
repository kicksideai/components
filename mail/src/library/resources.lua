-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local types = require("types")
local declarations = require("originals")
local resource = require("resource")
local database = require("database")
local store = require("store")

local M = {
    error = resource.error,
    key = resource.subject,
    check_key = resource.check_key,
    check_input_key = resource.check_input_key,
    check_filter = resource.check_filter,
    check_note = resource.check_note,
    check_content = resource.check_content,
    normalize = resource.normalize,
    names = resource.names,
    visible_messages = resource.visible_messages,
    MAX_EDITS = resource.MAX_EDITS,
}

function M.match_origin(item: types.Resource, declared: types.Original?): error?
    local err = resource.match_origin(item, declared)
    if err then return err end
    item.origin_label = declared and declared.resource.origin_label or nil
    return nil
end

local function merge(db: types.Executor, originals: types.OriginalMap, rows: {types.Resource}): (types.ResourceMap?, error?)
    local revisions, err = store.original_revisions(db)
    if err then return nil, err end
    for _, declared in pairs(originals) do
        local item = declared.resource
        local by_name = revisions[item.kind]
        item.revision = by_name and by_name[item.name] or 0
    end
    return resource.merge(rows, originals)
end

function M.load(db: types.Executor): (types.ResourceMap?, error?, types.OriginalMap?)
    local originals, err = declarations.list()
    if err then return nil, err end
    local rows, read_err = store.find(db, {})
    if read_err then return nil, read_err end
    local items, merge_err = merge(db, originals :: types.OriginalMap, rows :: {types.Resource})
    return items, merge_err, originals
end

function M.get(key: types.ResourceKey): (types.Resource?, error?, types.Original?)
    local bad_key = M.check_key(key)
    if bad_key then return nil, bad_key end
    local originals, err = declarations.list()
    if err then return nil, err end
    local item, read_err = store.read(key)
    if read_err then return nil, read_err end
    local declared = originals[M.key(key)]
    if item and item.state == "original" then
        if declared then declared.resource.revision = item.revision end
    elseif item then
        return item, M.match_origin(item, declared), declared
    end
    if declared then return declared.resource, nil, declared end
    return nil, M.error(errors.NOT_FOUND, "mail_resource_not_found", "Mail library resource was not found", key)
end

function M.page(filter: types.ResourceFilter, after: types.ResourceKey?, limit: integer): (types.LibraryPage?, error?)
    local originals, err = declarations.list()
    if err then return nil, err end
    local declarations: {types.LibraryDeclaration} = {}
    for _, declared in pairs(originals) do
        local item = declared.resource
        local selected = (not filter.kind or item.kind == filter.kind) and (not filter.base or item.base == filter.base)
            and resource.matches(item, filter.q and filter.q:lower())
        declarations[#declarations + 1] = {kind = item.kind, name = item.name, base = item.base, selected = selected and 1 or 0}
    end
    return database.with_db(function(db: types.DB, dialect: string): (types.LibraryPage?, error?)
        local page, read_err = store.summary(db, dialect, declarations, originals :: types.OriginalMap, filter, after, limit)
        if read_err then return nil, read_err end
        for _, row in ipairs(page.items) do
            local original = originals[M.key(row)]
            if row.state == "original" then
                local item = original.resource
                row.title, row.description, row.origin = item.title, item.description, item.origin
                row.origin_label = item.origin_label
            else
                local origin_err = M.match_origin((row :: unknown) :: types.Resource, original)
                if origin_err then return nil, origin_err end
            end
        end
        return page, nil
    end)
end

function M.list(filter: types.ResourceFilter): ({types.Resource}?, error?)
    local q = filter.q and filter.q:lower()
    return database.with_db(function(db: types.DB): ({types.Resource}?, error?)
        local originals, err = declarations.list()
        if err then return nil, err end
        local stored_only = filter.state == "created" or filter.state == "customized"
        local rows, read_err = store.find(db, stored_only and filter or {kind = filter.kind})
        if read_err then return nil, read_err end
        if stored_only then
            local selected: {types.Resource} = {}
            for _, row in ipairs(rows) do
                local origin_err = M.match_origin(row, originals[M.key(row)])
                if origin_err then return nil, origin_err end
                if resource.matches(row, q) then selected[#selected + 1] = row end
            end
            return selected, nil
        end
        local items, merge_err = merge(db, originals :: types.OriginalMap, rows :: {types.Resource})
        if merge_err then return nil, merge_err end
        local selected = {}
        for _, item in pairs(items) do
            if (not filter.kind or item.kind == filter.kind) and (not filter.state or item.state == filter.state)
                and (not filter.base or item.base == filter.base) and resource.matches(item, q) then
                selected[#selected + 1] = item
            end
        end
        table.sort(selected, function(a, b) return M.key(a) < M.key(b) end)
        return selected, nil
    end)
end

return M
