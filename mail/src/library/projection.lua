-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local types = require("types")
local registry = require("registry")
local security = require("security")
local database = require("database")
local store = require("store")
local resources = require("resources")
local jet = require("jet")
local draft = require("draft")

local M = {}

function M.check_shadow(declared: types.Original): error?
    for _, id in pairs(declared.entries) do
        if not security.can("registry.overlay.shadow", id) or not security.can("registry.overlay.update.template.jet", id)
            or not security.can("registry.overlay.delete.template.jet", id) then
            return resources.error(errors.PERMISSION_DENIED, "mail_original_not_editable",
                "The installed module does not grant projection access to this original", declared.resource)
        end
    end
    return nil
end

local function desired(tx: sql.Transaction): ({[string]: types.JetEntry}?, error?)
    local originals, declaration_err = resources.originals()
    if declaration_err then return nil, declaration_err end
    local rows, err = store.find(tx, {})
    if err then return nil, err end
    local entries: {[string]: types.JetEntry} = {}
    for _, item in ipairs(rows) do
        local original = originals[resources.key(item)]
        local origin_err = resources.match_origin(item, original)
        if origin_err then return nil, origin_err end
        for _, entry in ipairs(jet.entries(item, jet.live_namespace, jet.html, jet.text, original and original.entries)) do
            entries[entry.id] = entry
        end
    end
    return entries, nil
end

local function reconcile(tx: sql.Transaction, dialect: string): (boolean?, error?)
    local lock_err = store.lock(tx, dialect)
    if lock_err then return nil, lock_err end
    local _, clear_err = draft.clear_workspace()
    if clear_err then return nil, clear_err end
    local entries, err = desired(tx)
    if err then return nil, err end

    local overlay, open_err = registry.overlay(jet.owner)
    if open_err then return nil, open_err end
    local existing, list_err = overlay:entries()
    if list_err then return nil, list_err end
    local changes = overlay:changes()
    local count = 0
    for _, old in ipairs(existing) do
        local entry = entries[old.id]
        if not entry then
            local _, stage_err = changes:delete(old.id)
            if stage_err then return nil, stage_err end
            count = count + 1
        elseif old.meta.name ~= entry.meta.name or old.data.set ~= entry.data.set or old.data.source ~= entry.data.source then
            local _, stage_err = changes:update(entry)
            if stage_err then return nil, stage_err end
            count = count + 1
        end
        entries[old.id] = nil
    end
    for id, entry in pairs(entries) do
        local _, stage_err
        if id:sub(1, #jet.live_namespace) == jet.live_namespace then
            _, stage_err = changes:create(entry)
        else
            _, stage_err = changes:update(entry)
        end
        if stage_err then return nil, stage_err end
        count = count + 1
    end
    if count ~= 0 then
        local _, apply_err = changes:apply()
        if apply_err then return nil, apply_err end
    end
    return true, nil
end

function M.reconcile(): (boolean?, error?)
    return database.transaction(reconcile)
end

function M.boot(): {status: string, message: string?}
    local _, err = M.reconcile()
    if err then return {status = "error", message = err:message()} end
    return {status = "success"}
end

return M
