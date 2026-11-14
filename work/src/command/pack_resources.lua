-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local component = require("component")
local envelope = require("envelope")
local component_types = require("component_types")
local identifiers = require("identifiers")
local declaration = require("declaration")
local merge = require("merge")
local types = require("types")
local domain = require("domain")
local M = {}
local function bind(value: domain.Json, board_id: string): domain.Json
    if value == "$board" then return board_id end
    if type(value) ~= "table" then return value end
    local out: { [string | integer]: domain.Json } = {}
    for key, item in pairs(value :: { [string | integer]: domain.Json }) do out[key] = bind(item, board_id) end
    return out :: domain.Json
end
function M.bind(data: types.Data, board_id: string): types.Data
    local out = declaration.copy(data)
    for _, automation in ipairs(out.automations) do automation.input = bind(automation.input, board_id) :: domain.JsonObject end
    return out
end
local function stamp_revisions(data: types.Data, revisions: { [string]: integer })
    for _, entry in ipairs(data.views) do entry.revision = revisions["view/" .. entry.id] end
    for _, entry in ipairs(data.automations) do entry.revision = revisions["automation/" .. entry.id] end
end
-- Managed resources read their local copy through the caller's component authority.
function M.plan(board_id: string, base: types.Data?, incoming: types.Data, resolutions: { [string]: string }?): (types.Data?, { types.Conflict }?, { domain.SchemaChange }?, error?)
    local next = M.bind(incoming, board_id)
    local context, cerr = component.get_context(board_id, component.ACCESS.ADMIN)
    if cerr then return nil, nil, nil, cerr :: error end
    local attached = ((context or {}) :: { traits: { string }? }).traits or {}
    next.traits = merge.entries("traits", function(id: string): string return id end, base and base.traits, attached, next.traits, resolutions)
    local revisions: { [string]: integer } = {}
    for _, section in ipairs({ "views", "automations" }) do
        for _, entry in ipairs(next[section] :: { { id: string } }) do
            local kind = section == "views" and "view" or "automation"
            local id, ierr = identifiers.resource(board_id, kind, entry.id)
            if ierr or not id then return nil, nil, nil, ierr end
            local rows, rerr = component.query({ component_ids = { id }, include = { meta = true }, access_mask = component.ACCESS.ADMIN :: integer, limit = 1 })
            if rerr then return nil, nil, nil, rerr :: error end
            local row = rows and rows[1]
            local revision = 0
            if row then
                local service, serr = component.get_service()
                if serr or not service then return nil, nil, nil, serr :: error? end
                local context, cerr = service:get_access_context({ component_id = id, access_mask = component.ACCESS.ADMIN, include_context = true })
                if cerr or not context then return nil, nil, nil, cerr :: error? end
                local eerr = envelope.error_of(context :: component_types.ServiceEnvelope, "get_access_context")
                if eerr then return nil, nil, nil, eerr end
                revision = (context :: component_types.AccessContextResult).context_revision :: integer
            end
            revisions[kind .. "/" .. entry.id] = revision
        end
    end
    if not base then stamp_revisions(next, revisions); return next, {}, {}, nil end
    local before = M.bind(base, board_id)
    local local_views: { types.PackView } = {}
    for _, entry in ipairs(before.views) do
        local id, ierr = identifiers.resource(board_id, "view", entry.id)
        if ierr or not id then return nil, nil, nil, ierr end
        local found, ferr = component.query({ component_ids = { id }, include = { meta = true }, access_mask = component.ACCESS.ADMIN :: integer, limit = 1 })
        if ferr then return nil, nil, nil, ferr :: error end
        if found and found[1] then
            local context, cerr = component.get_context(id, component.ACCESS.ADMIN)
            if cerr then return nil, nil, nil, cerr :: error end
            if not context then return nil, nil, nil, errors.new({ kind = errors.INTERNAL, message = "pack resource has no context", details = { code = "row_corrupt" } }) end
            local view = context :: { view: types.View }
            local_views[#local_views + 1] = { id = entry.id, title = (found[1].meta or {}).title :: string, view = view.view }
        end
    end
    local local_automations: { types.Automation } = {}
    for _, entry in ipairs(before.automations) do
        local id, ierr = identifiers.resource(board_id, "automation", entry.id)
        if ierr or not id then return nil, nil, nil, ierr end
        local found, ferr = component.query({ component_ids = { id }, include = { meta = true }, access_mask = component.ACCESS.ADMIN :: integer, limit = 1 })
        if ferr then return nil, nil, nil, ferr :: error end
        if found and found[1] then
            local context, cerr = component.get_context(id, component.ACCESS.ADMIN)
            if cerr then return nil, nil, nil, cerr :: error end
            if not context then return nil, nil, nil, errors.new({ kind = errors.INTERNAL, message = "pack resource has no context", details = { code = "row_corrupt" } }) end
            local input = (context :: { _portable_input: domain.Json })._portable_input
            if type(input) ~= "table" then return nil, nil, nil, errors.new({ kind = errors.INTERNAL, message = "pack automation has no stored declaration", details = { code = "row_corrupt" } }) end
            local_automations[#local_automations + 1] = { id = entry.id, type = found[1].impl_id, input = input :: domain.JsonObject }
        end
    end
    local views, removed_views, view_conflicts = merge.entries("views", function(v: types.PackView): string return v.id end, before.views, local_views, next.views, resolutions)
    local automations, removed_automations, automation_conflicts = merge.entries("automations", function(v: types.Automation): string return v.id end, before.automations, local_automations, next.automations, resolutions)
    next.views, next.automations = views, automations
    stamp_revisions(next, revisions)
    local conflicts: { types.Conflict } = {}
    for _, conflict in ipairs(view_conflicts) do conflicts[#conflicts + 1] = conflict end
    for _, conflict in ipairs(automation_conflicts) do conflicts[#conflicts + 1] = conflict end
    local refused: { domain.SchemaChange } = {}
    for _, id in ipairs(removed_views) do
        refused[#refused + 1] = { code = "views." .. id, what = "views.remove", class = "refused",
            detail = "delete the managed component through its owning contract before upgrading" }
    end
    for _, id in ipairs(removed_automations) do
        refused[#refused + 1] = { code = "automations." .. id, what = "automations.remove", class = "refused",
            detail = "delete the managed component through its owning contract before upgrading" }
    end
    local current: { [string]: types.Automation } = {}
    for _, entry in ipairs(local_automations) do current[entry.id] = entry end
    for _, entry in ipairs(automations) do
        local held = current[entry.id]
        if held and held.type ~= entry.type then
            refused[#refused + 1] = { code = entry.id, what = "automation.type", class = "refused",
                detail = "install a new named automation and remove the old automation" }
        end
    end
    return next, conflicts, refused, nil
end
return M
