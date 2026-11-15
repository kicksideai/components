-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- A leased Jobs slot runs bounded lifecycle batches under the live catalog identity.
local jobs = require("jobs")
local budget = require("budget")
local clock = require("clock")
local component = require("component")
local execution_identity = require("execution_identity")
local types = require("types")
local defaults = require("defaults")
local M = {}
type Job = { id: string, lease_token: string, execution_seq: integer, deadline: string? }
function M.run(input: { job: Job?, payload: { catalog_id: string }? }): (unknown, error?)
    local job, payload = input.job, input.payload
    if not job or not payload then return nil, errors.new({ kind = errors.INVALID, message = "plugin job is malformed", details = { code = "plugin_job_invalid" } }) end
    local deadline, derr = budget.deadline(job.deadline)
    if derr or not deadline then return nil, derr end
    local context, cerr = component.get_private_context(payload.catalog_id)
    if cerr then return nil, cerr end
    local identity = context and (context :: types.JsonObject)[execution_identity.CONTEXT_KEY]
    local _, ierr = execution_identity.validate(identity)
    if ierr then return nil, ierr :: error end
    local operating,oerr=defaults.catalog(payload.catalog_id)
    if oerr or not operating then return nil,oerr end
    for _ = 1, operating.job_batches do
        if not budget.enough(deadline, operating.command_deadline_ms) then break end
        local valid, verr = jobs.lease_valid(job.id, budget.lease(job))
        if verr then return nil, verr end
        if not valid then return { self_completed = true }, nil end
        local result, err = execution_identity.run_as(identity, "kickside.pim.extensions:plugin_batch", payload,
            { deferred_owner = "kickside.pim.jobs:plugins", execution_root = payload.catalog_id })
        if err then return nil, err :: error end
        if (result :: {done: boolean}).done then
            if (result :: {reconcile: boolean?}).reconcile then
                local completed,cerr=jobs.complete(job.id,budget.lease(job),{rearm=clock.offset(300)})
                if cerr then return nil,cerr end
                return {self_completed=true,completion=completed},nil
            end
            return {done=true},nil
        end
    end
    local completed, err = jobs.complete(job.id, budget.lease(job), { rearm = clock.now() })
    if err then return nil, err :: error end
    return { self_completed = true, completion = completed }, nil
end
return M
