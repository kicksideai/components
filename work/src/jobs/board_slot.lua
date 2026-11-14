-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Board slots share identity validation, leases, dispatch and immediate rearm.
local jobs = require("jobs")
local component = require("component")
local execution_identity = require("execution_identity")
local clock = require("clock")
local job_rows = require("job_rows")
local failures = require("failures")
local config = require("config")
local types = require("types")
local domain = require("domain")
local M = {}

function M.run(input: types.SlotInput): (types.MigrationResult?, error?)
    local job, board_id = input.job, input.payload and input.payload.board_id
    local migration = config.kind == "migration"
    local retryable: boolean? = nil
    if migration then retryable = false end
    if not job or type(board_id) ~= "string" then
        return nil, errors.new({ details = { code = "invalid_request" }, kind = errors.INVALID,
            retryable = retryable, message = config.kind .. " job is malformed" })
    end
    local context, cerr = component.get_private_context(board_id)
    local identity = context and (context :: domain.JsonObject)[execution_identity.CONTEXT_KEY]
    local ierr: error? = cerr :: error?
    if migration and (cerr or not context) then
        ierr = errors.wrap(cerr or errors.new({ kind = errors.INTERNAL, retryable = false,
            message = "operation returned no result", details = { code = "internal" } }), "board identity read failed")
    elseif not ierr then
        if identity == nil then
            ierr = errors.new({ details = { code = "invalid_request" }, kind = errors.INVALID,
                retryable = retryable, message = "board holds no execution identity" })
        else
            local _, verr = execution_identity.validate(identity)
            ierr = verr :: error?
            if migration and ierr then ierr = errors.wrap(ierr, "board execution identity is invalid") end
        end
    end
    if ierr then return nil, failures.record(board_id, job.id, ierr) end
    local rerr = job_rows.record(board_id, job.id, "running", nil)
    if rerr then return nil, rerr end
    local lease: types.JobLease = { token = job.lease_token, execution_seq = job.execution_seq }
    for _ = 1, config.batches do
        local valid, lerr = jobs.lease_valid(job.id, lease)
        if lerr then return nil, lerr end
        if not valid then return { self_completed = true }, nil end
        local out, berr = execution_identity.run_as(identity, config.batch_id,
            { board_id = board_id, deadline = job.deadline, trace_context = input.payload and input.payload.trace_context },
            { deferred_owner = config.owner, execution_root = board_id })
        if berr then return nil, failures.record(board_id, job.id, berr :: error) end
        local batch = out :: types.BoardBatchResult
        if migration and batch.candidates == 0 then
            if (batch.stranded or 0) > 0 then
                local err = errors.new({ kind = errors.INVALID, retryable = false,
                    message = batch.stranded .. " items hold a state the process neither declares nor maps",
                    details = { code = "migration_stranded", count = batch.stranded } })
                return nil, failures.record(board_id, job.id, err)
            end
            local werr = job_rows.record(board_id, job.id, "done", nil)
            if werr then return nil, werr end
            return { migrated = true }, nil
        elseif not migration and batch.done then
            if config.kind == "rebalance" then
                local werr = job_rows.record(board_id, job.id, "done", nil)
                return {}, werr
            end
            return {}, nil
        end
    end
    local completion, err = jobs.complete(job.id, lease, { rearm = clock.now() })
    if err then return nil, err end
    return { self_completed = true, completion = completion }, nil
end
return M
