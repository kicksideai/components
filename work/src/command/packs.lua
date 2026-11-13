-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local planner = require("planner")
local receipts = require("receipts")
local rows = require("rows")
local store = require("store")
local guard = require("guard")
local funcs = require("funcs")
local jobs = require("jobs")
local types = require("types")
local operations = require("operations")
local M = {}
function M.apply(request: types.Request): (types.Result?, error?)
    local aerr = guard.require_access(request.board_id, guard.admin_access())
    if aerr then return nil, aerr end
    if not request.key or request.key == "" then return nil, guard.invalid("pack key is required") end
    local hashed = receipts.request_hash({ board_id = request.board_id, pack = request.pack, version = request.version,
        expected_generation = request.expected_generation, starter = request.starter, maps = request.maps,
        resolutions = request.resolutions, declaration = request.declaration, plugin_configs = request.plugin_configs })
    local db, derr = store.open()
    if not db then return nil, derr end
    local owner, oerr = rows.get(db, request.board_id, nil, "pack", request.key)
    db:release()
    if oerr then return nil, oerr end
    local replayed = owner ~= nil
    if owner and owner.request_hash ~= hashed then return nil, receipts.conflict_of() end
    if not owner then
        local plan, perr = planner.plan(request)
        if perr or not plan then return nil, perr end
        local known: { [string]: boolean } = {}
        local unresolved: { string } = {}
        for _, conflict in ipairs(plan.conflicts) do
            known[conflict.path] = true
            if not (request.resolutions or {})[conflict.path] then unresolved[#unresolved + 1] = conflict.path end
        end
        for path, choice in pairs(request.resolutions or {}) do
            if not known[path] or (choice ~= "local" and choice ~= "incoming") then
                return nil, guard.invalid("pack resolution names a conflict and selects local or incoming", { code = "invalid_pack_resolution" })
            end
        end
        if #unresolved > 0 then return nil, errors.new({ kind = errors.CONFLICT, message = "pack conflicts require explicit resolutions", details = { code = "pack_conflicts", conflicts = unresolved } }) end
        if #plan.refused > 0 then return nil, guard.invalid("pack changes require migration", { code = "migration_required", changes = plan.refused :: { operations.Map }, migration = plan.migration }) end
        local starter = plan.initial and (request.starter == true or (request.starter == nil and plan.base.starter.default))
        owner, oerr = rows.create(request.board_id, "pack", request.key, hashed, { plan = plan, starter = starter,
            expected_generation = request.expected_generation, trace_context = request.trace_context }, true)
        if oerr or not owner then return nil, oerr end
    end
    if owner.actor_id ~= guard.actor_id() then return nil, errors.new({ kind = errors.PERMISSION_DENIED, message = "pack installation belongs to its installing admin", details = { code = "operation_identity_mismatch" } }) end
    if owner.status ~= "done" then
        local _, err = funcs.call("kickside.work.jobs:operation_batch", { board_id = request.board_id, operation_id = owner.operation_id })
        local _, werr = jobs.wake_job(owner.job_id, { control = true, ensure_due = true })
        if werr then return nil, werr end
        if err then return nil, err end
    end
    local current_db, cerr = store.open()
    if not current_db then return nil, cerr end
    local current, rerr = rows.get(current_db, request.board_id, owner.operation_id, nil, nil)
    current_db:release()
    if rerr or not current then return nil, rerr end
    local plan = current.data.plan :: types.Plan
    return { operation_id = current.operation_id, job_id = current.job_id, status = current.status, generation = plan.generation, replayed = replayed or nil }, nil
end
return M
