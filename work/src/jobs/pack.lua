-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local schema_commands = require("schema_commands")
local apply_ops = require("apply_ops")
local views = require("views")
local automations = require("automations")
local component = require("component")
local registry = require("registry")
local identifiers = require("identifiers")
local rows = require("rows")
local types = require("types")
local commands = require("commands")
local values = require("values")
local clock = require("clock")
local guard = require("guard")
local M = {}
function M.batch(owner: commands.Owner): (boolean?, error?)
    if owner.status == "done" then return true, nil end
    local plan = owner.data.plan :: types.Plan
    local total = 1 + #plan.views + #plan.automations + 1 + (owner.data.starter and 1 or 0)
    local through = math.min(owner.processed + 20, total)
    while owner.processed < through do
        if owner.deadline and clock.passed(owner.deadline) then return false, nil end
        local aerr = guard.require_access(owner.board_id, guard.admin_access())
        if aerr then return nil, aerr end
        local step = owner.processed
        local err: error? = nil
        if step == 0 then
            local applied, aerr = schema_commands.apply_schema({ board_id = owner.board_id, declaration = plan.declaration,
                expected_generation = owner.data.expected_generation :: integer, key = "pack/" .. owner.operation_id,
                source = "pack", plugin_configs = plan.plugin_configs, trace_context = owner.data.trace_context, pack = { id = plan.pack, version = plan.version, digest = plan.digest, base = plan.base } } :: commands.SchemaRequest, plan.prepared, owner.deadline)
            if aerr or not applied then return nil, aerr end
        elseif step <= #plan.views then
            local entry = plan.views[step]
            local id, ierr = identifiers.resource(owner.board_id, "view", entry.id)
            if ierr or not id then return nil, ierr end
            local _, verr = views.install(id, { board_id = owner.board_id, title = entry.title, view = entry.view }, entry.revision)
            err = verr
        elseif step <= #plan.views + #plan.automations then
            local entry = plan.automations[step - #plan.views]
            local id, ierr = identifiers.resource(owner.board_id, "automation", entry.id)
            if ierr or not id then return nil, ierr end
            local existing, eerr = component.query({ component_ids = { id }, include = { meta = true }, limit = 1 })
            if eerr then return nil, eerr :: error end
            if existing and existing[1] then
                local context, cerr = component.get_context(id, component.ACCESS.ADMIN)
                if cerr then return nil, cerr :: error end
                if not context then return nil, errors.new({ kind = errors.INTERNAL, message = "pack automation context is absent", details = { code = "row_corrupt" } }) end
                if existing[1].impl_id ~= entry.type then
                    return nil, errors.new({ kind = errors.INVALID, message = "automation type change requires replacement", details = { code = "pack_automation_type_changed" } })
                end
                if not values.equal((context :: types.Map)._portable_input, entry.input) then
                    local _, aerr = automations.reconfigure(id, entry.input)
                    err = aerr :: error?
                end
            else
                local _, aerr = automations.install_type_selected(entry.type, entry.input, { component_id = id,
                    request_id = "pack/" .. owner.operation_id .. "/" .. entry.id, parent_id = owner.board_id,
                    principal = { kind = "user", id = owner.actor_id } })
                err = aerr :: error?
            end
        elseif step == 1 + #plan.views + #plan.automations then
            for _, id in ipairs(plan.traits) do
                local entry, rerr = registry.get(id)
                if rerr then return nil, rerr end
                if not entry or entry.kind ~= "registry.entry" or entry.meta.type ~= "agent.trait" then
                    return nil, errors.new({ kind = errors.INVALID, message = "pack trait is unavailable", details = { code = "pack_trait_unavailable", trait = id } })
                end
            end
            local _, terr = component.update(owner.board_id, { { type = "PATCH_CONTEXT", payload = { patch = { traits = plan.traits } } } })
            err = terr :: error?
        else
            if #plan.base.starter.items > 0 then
                local applied, aerr = apply_ops.apply({ board_id = owner.board_id, ops = plan.base.starter.items, mode = "atomic",
                    source = "pack", key = "pack/" .. owner.operation_id .. "/starter", trace_context = owner.data.trace_context } :: commands.ApplyRequest, owner.deadline)
                if aerr or not applied then return nil, aerr end
                if not applied.applied then return nil, errors.new({ kind = errors.INVALID, message = "pack starter items are refused", details = { code = "pack_starter_refused", outcomes = applied.outcomes } }) end
            end
        end
        if err then return nil, err end
        owner.processed = step + 1
        local uerr = rows.update(owner, owner.processed == total and "done" or "running", nil)
        if uerr then return nil, uerr end
    end
    return owner.processed == total, nil
end
return M
