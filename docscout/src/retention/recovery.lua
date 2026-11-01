-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local jobs = require("jobs")
local job_types = require("job_types")
local repository = require("repository")
local evals = require("evals")
local error_envelope = require("error_envelope")

local M = {}
local WORKER = "kickside.docscout.evals:case_worker"

local function terminal_failure(receipt: table, job: table?): error
    local status = job and job.status or "missing"
    return errors.new({kind = status == job_types.JOB_STATE.CANCELLED and errors.CANCELED or errors.INTERNAL,
        retryable = false, message = "Evaluation worker ended without a case result: " .. tostring(status),
        details = {code = "docscout_job_terminal", job_id = receipt.job_id, status = status,
            attempts = job and tonumber(job.attempts) or nil, job_error = job and job.last_error or nil}})
end

function M.run(change: table?): (table?, error?)
    local hinted_job = change and change.kind == "lease_released" and change.job_id or nil
    if hinted_job ~= nil and (type(hinted_job) ~= "string" or hinted_job == "") then
        return nil, errors.new({kind = errors.INVALID, retryable = false, message = "job release hint has no job id"})
    end
    local pending, claim_err, more = repository.claim_eval_checks(hinted_job)
    if claim_err then return nil, claim_err end
    local result = {settled = 0, needs_continue = more == true, blocked = {}}
    if #pending == 0 then return result, nil end
    local ids = {}
    for _, row in ipairs(pending) do ids[#ids + 1] = row.job_id end
    local statuses, status_err = jobs.get_job_statuses(ids)
    if status_err then return nil, status_err end
    for _, row in ipairs(pending) do
        local state = statuses[row.job_id]
        if state ~= job_types.JOB_STATE.PENDING and state ~= job_types.JOB_STATE.RUNNING then
            local job, read_err = jobs.get_job(row.job_id)
            if read_err then return nil, read_err end
            if job and (job.id ~= row.job_id or job.owner_kind ~= "component"
                or job.owner_id ~= row.component_id or job.job_type ~= WORKER) then
                return nil, errors.new({kind = errors.INTERNAL, retryable = false,
                    message = "Evaluation job receipt does not match its owner",
                    details = {code = "docscout_job_owner", job_id = row.job_id}})
            end
            local status = job and job.status or nil
            if status == nil or status == job_types.JOB_STATE.DONE or status == job_types.JOB_STATE.DEAD
                or status == job_types.JOB_STATE.CANCELLED then
                -- Missing receipts may have left Jobs' terminal-history retention.
                -- They cannot establish a successful extraction result.
                local _, finish_err = repository.finish_case(row.component_id, row.eval_id, row.case_id,
                    {status = "failed", error = error_envelope.encode(terminal_failure(row, job))},
                    function(finished: {any}, fields: {any}): any return evals.summarize(fields, finished) end)
                if finish_err then
                    if not errors.is(finish_err, errors.NOT_FOUND) then return nil, finish_err end
                    result.blocked[#result.blocked + 1] = {component_id = row.component_id, error = finish_err}
                else
                    result.settled = result.settled + 1
                end
            elseif status ~= job_types.JOB_STATE.PENDING and status ~= job_types.JOB_STATE.RUNNING then
                return nil, errors.new({kind = errors.INTERNAL, retryable = false,
                    message = "Evaluation job has an unknown state", details = {code = "docscout_job_state", job_id = row.job_id}})
            end
        end
    end
    return result, nil
end

return M
