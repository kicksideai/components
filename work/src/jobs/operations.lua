-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local jobs = require("jobs")
local identity = require("identity")
local rows = require("rows")
local store = require("store")
local clock = require("clock")
local deadline = require("deadline")
local bulk = require("bulk")
local move = require("move")
local pack = require("pack")
local types = require("types")
local guard = require("guard")
local job_types = require("job_types")
local M = {}
local function owner(input: types.Locator): (types.Owner?, error?)
    local db, err = store.open()
    if not db then return nil, err end
    local out, oerr = rows.get(db, input.board_id, input.operation_id, nil, nil)
    db:release()
    if oerr then return nil, oerr end
    if not out then return nil, errors.new({ kind = errors.NOT_FOUND, message = "operation owner is absent", details = { code = "operation_not_found" } }) end
    return out, nil
end
function M.batch(input: types.Locator): (boolean?, error?)
    local until_at, derr = deadline.bound(input.deadline)
    if derr or not until_at then return nil, derr end
    local out, err = owner(input)
    if err or not out then return nil, err end
    if guard.actor_id() ~= out.actor_id then
        return nil, errors.new({ kind = errors.PERMISSION_DENIED, message = "operation executes under its captured identity", details = { code = "operation_identity_mismatch" } })
    end
    out.deadline = until_at
    if out.kind == "bulk" then return bulk.batch(out) end
    if out.kind == "pack" then return pack.batch(out) end
    return move.batch(out)
end
function M.run(input: types.Input): (unknown, error?)
    local until_at, derr = deadline.bound(input.job.deadline)
    if derr or not until_at then return nil, derr end
    for _ = 1, 20 do
        if clock.passed(until_at) then break end
        local valid, lerr = jobs.lease_valid(input.job.id, { token = input.job.lease_token, execution_seq = input.job.execution_seq })
        if lerr then return nil, lerr end
        if not valid then return { self_completed = true }, nil end
        local out, err = owner(input.payload)
        if err or not out then return nil, err end
        local selected, ierr = identity.from_row(out.actor_id, out.actor_context)
        if ierr then return nil, ierr :: error end
        input.payload.deadline = input.job.deadline
        local done, berr = identity.run_as(selected, "kickside.work.jobs:operation_batch", input.payload,
            { deferred_owner = "kickside.work.jobs:" .. out.kind })
        if berr then
            local permanent = job_types.is_deterministic_kind(berr:kind()) or (berr:kind() == errors.INTERNAL and berr:retryable() == false)
            local current, cerr = owner(input.payload)
            if cerr or not current then return nil, cerr end
            local rerr = rows.update(current, permanent and "failed" or "running", (berr:details() or {}).code :: string?)
            if rerr then return nil, rerr end
            return nil, berr :: error
        end
        if done then return { record = { status = "completed" } }, nil end
    end
    local completion, err = jobs.complete(input.job.id, { token = input.job.lease_token, execution_seq = input.job.execution_seq }, { rearm = clock.now() })
    if err then return nil, err end
    return { self_completed = true, completion = completion }, nil
end
return M
