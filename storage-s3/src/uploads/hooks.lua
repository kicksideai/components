local policy = require("policy")
local time = require("time")
local jobs = require("jobs")
local offload = require("offload")
local M = {}
function M.prepare(_output: any): (any?, any?) return policy.current() end
function M.completed(tx: any, dbtype: string, job: any, output: any, trace: any, configured: any): (boolean?, any?)
    if not configured or configured.mode ~= "s3" then return true, nil end
    local _, err = jobs.enqueue_tx(tx, dbtype, {
        namespace = "storage_s3", scope = tostring(output.upload_id), key = "offload",
        owner_locator = job.owner_locator or {kind="user",id=tostring(output.owner_actor_id)},
        thread_id = tostring(job.thread_id or ""), job_type = "kickside.storage_s3.service:offload_job",
        queue_tier = "live", priority = 5, max_attempts = 8,
        concurrency_key = "storage_s3:" .. tostring(output.upload_id),
        immutable_payload = {upload_id=output.upload_id,policy=configured,max_execution_ms=600000},
        trace_context = trace,
    })
    if err then return nil, err end
    return true, nil
end
function M.prune(_cutoff: string, limit: integer): (number?, any?)
    local cutoff = time.now():utc():add(-24 * time.HOUR):format_rfc3339()
    return offload.prune(cutoff,limit)
end
return M
