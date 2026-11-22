-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local defaults=require("defaults")
-- A model release issues frozen, version-checked release commands as its actor.
local jobs = require("jobs")
local execution_identity = require("execution_identity")
local release_jobs = require("release_jobs")
local store = require("store")
local writer = require("writer")
local consts = require("consts")
local budget = require("budget")
local error_envelope = require("error_envelope")
local clock = require("clock")
local types = require("types")
local component = require("component")
local failure = require("failure")
local job_types = require("job_types")
local M = {}
type Input = job_types.Input<{ catalog_id: string?, request_id: string? }>
type BatchInput = { catalog_id: string, request_id: string, deadline: string? }
type Result = job_types.SelfCompleted | { released: boolean }

function M.batch(input: BatchInput): (job_types.BatchResult?, error?)
    local _, access_err = component.validate_access(input.catalog_id, component.ACCESS.WRITE)
    if access_err then return nil, failure.coded(errors.wrap(access_err, "model release catalog access"), "component_access_denied") end
    local deadline, derr = budget.deadline(input.deadline)
    if derr or not deadline then return nil, derr end
    local task, terr = release_jobs.prepare(input.catalog_id, input.request_id)
    if terr or not task then return nil, terr end
    if task.done == 1 then return { done = true }, nil end
    local batch = task.batch :: types.ReleaseRequest
    local out, err = writer.release(input.catalog_id, batch, deadline)
    if err or not out then return nil, err :: error end
    for _, outcome in ipairs(out.outcomes) do
        if outcome.outcome ~= "released" and outcome.outcome ~= "unchanged" and outcome.outcome ~= "not_ready" then
            return nil, errors.new({ kind = errors.CONFLICT, message = "model release item is refused",
                details = { code = "model_release_item_refused", outcome = outcome } })
        end
    end
    local _, aerr = store.transaction("model release position", function(tx: types.Executor, _dialect: string): (boolean?, error?)
        local saved = release_jobs.advance(tx, input.catalog_id, input.request_id, batch.items[#batch.items].product.id :: string)
        if saved then return nil, saved end
        return true, nil
    end)
    if aerr then return nil, aerr end
    return { done = false }, nil
end

function M.run(input: Input): (Result?, error?)
    local job, payload = input.job, input.payload
    if not job or not payload or type(payload.catalog_id) ~= "string" or type(payload.request_id) ~= "string" then
        return nil, errors.new({ kind = errors.INVALID, message = "model release job is malformed", details = { code = "release_model_job_invalid" } })
    end
    local operating,oerr=defaults.catalog(payload.catalog_id)
    if oerr or not operating then return nil,oerr end
    local deadline, derr = budget.deadline(job.deadline)
    if derr or not deadline then return nil, derr end
    local db, oerr = store.open()
    if oerr or not db then return nil, oerr end
    local task, terr = release_jobs.get(db, payload.catalog_id, payload.request_id)
    terr = error_envelope.cleanup(function() return db:release() end, terr, "model release state database release")
    if terr then return nil, terr end
    local lease = budget.lease(job)
    for _ = 1, operating.job_batches do
        if not budget.enough(deadline, operating.command_deadline_ms) then break end
        local valid, lerr = jobs.lease_valid(job.id, lease)
        if lerr then return nil, lerr end
        if not valid then return { self_completed = true }, nil end
        local out, err = execution_identity.run_as((task :: release_jobs.Task).identity, consts.RELEASE_BATCH,
            { catalog_id = payload.catalog_id, request_id = payload.request_id, deadline = job.deadline },
            { deferred_owner = consts.RELEASE_OWNER, execution_root = payload.catalog_id })
        if err then return nil, err :: error end
        if (out :: job_types.BatchResult).done then return { released = true }, nil end
    end
    local completion, cerr = jobs.complete(job.id, lease, { rearm = clock.now() })
    if cerr then return nil, cerr end
    return { self_completed = true, completion = completion :: job_types.Completion? }, nil
end
return M
