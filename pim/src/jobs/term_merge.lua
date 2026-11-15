-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local defaults=require("defaults")
-- Term merge job: finishes a merge whose references outnumbered what its
-- command rewrote. It repeats the merge command as the actor who asked, with
-- that actor's source, in batches until no value references the retired
-- term, then drops the pending merge row.
local jobs = require("jobs")
local budget = require("budget")
local error_envelope = require("error_envelope")
local execution_identity = require("execution_identity")
local consts = require("consts")
local clock = require("clock")
local store = require("store")
local merge_rows = require("merge_rows")
local writer = require("writer")
local types = require("types")

local M = {}

type Job = { id: string, lease_token: string, execution_seq: integer, deadline: string? }
type Payload = { catalog_id: string?, vocabulary: string?, from: string?, into: string? }
type Input = { job: Job?, payload: Payload? }
type BatchInput = { catalog_id: string, vocabulary: string, from: string, into: string, source: string?, deadline: string?,trace_context: types.TraceContext? }
type BatchResult = { remaining: integer }
type RunResult = { self_completed: boolean?, merged: boolean?, completion: unknown }





-- batch issues one merge command as the asking actor and answers how many
-- products still reference the term.
function M.batch(input: BatchInput): (BatchResult?, error?)
    local deadline, derr = budget.deadline(input.deadline)
    if derr then return nil, derr end
    local out, err = writer.apply(input.catalog_id, { source = input.source,trace_context=input.trace_context,
        items = { { term_merge = { vocabulary = input.vocabulary, from = input.from, into = input.into } } } }, deadline)
    if err or not out then return nil, err end
    local first = out.outcomes[1]
    if not first or first.outcome ~= "updated" then
        local message = first and first.findings and first.findings[1] and first.findings[1].message or "merge command refused"
        return nil, errors.new({ kind = errors.INVALID, retryable = false, message = "term merge stopped: " .. tostring(message), details = { code = "term_merge_refused", findings = first and first.findings } })
    end
    return { remaining = first.deferred or 0 }, nil
end

function M.run(input: Input): (RunResult?, error?)
    local job = input.job
    local payload = input.payload or {}
    local catalog_id, vocabulary, from = payload.catalog_id, payload.vocabulary, payload.from
    if not job or type(catalog_id) ~= "string" or type(vocabulary) ~= "string" or type(from) ~= "string" then
        return nil, errors.new({ kind = errors.INVALID, retryable = false, message = "term merge job is malformed", details = { code = "term_merge_job_invalid" } })
    end
    local operating,oerr=defaults.catalog(catalog_id)
    if oerr or not operating then return nil,oerr end
    local db, derr = store.open()
    if not db then return nil, derr end
    local pending, perr = merge_rows.get(db, catalog_id, vocabulary, from)
    perr = error_envelope.cleanup(function() return db:release() end, perr, "merge state database release")
    if perr then return nil, perr end
    if not pending then return { merged = true }, nil end
    local deadline, deadline_err = budget.deadline(job.deadline)
    if deadline_err or not deadline then return nil, deadline_err end
    for _ = 1, operating.job_batches do
        if not budget.enough(deadline, operating.command_deadline_ms) then break end
        local valid, lerr = jobs.lease_valid(job.id, budget.lease(job))
        if lerr then return nil, lerr end
        if not valid then return { self_completed = true }, nil end
        local out, berr = execution_identity.run_as(pending.identity, consts.MERGE_BATCH,
            { catalog_id = catalog_id, vocabulary = vocabulary, from = from, into = pending.into, source = pending.source, trace_context=pending.trace_context,deadline = job.deadline },
            { deferred_owner = consts.MERGE_OWNER, execution_root = catalog_id })
        if berr then return nil, berr :: error end
        if (out :: BatchResult).remaining == 0 then
            local done_db, oerr = store.open()
            if not done_db then return nil, oerr end
            local merr = merge_rows.delete(done_db, catalog_id, vocabulary, from)
            merr = error_envelope.cleanup(function() return done_db:release() end, merr, "merge completion database release")
            if merr then return nil, merr end
            return { merged = true }, nil
        end
    end
    local completion, cerr = jobs.complete(job.id, budget.lease(job), { rearm = clock.now() })
    if cerr then return nil, cerr end
    return { self_completed = true, completion = completion }, nil
end

return M
