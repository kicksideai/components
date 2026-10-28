-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Evaluations: every case of an extractor runs through the extraction contract
-- as its own durable job, under the identity of the person who started the
-- evaluation, resolved again when the job runs. The last case to finish writes
-- the per-field accuracy.
local json = require("json")
local jobs = require("jobs")
local execution_identity = require("execution_identity")
local repository = require("repository")
local extractors = require("extractors")
local scoring = require("scoring")
local config = require("config")

local M = {}

local WORKER = "kickside.docscout.evals:case_worker"
-- Attempts per case job: settling a case is idempotent, so a retry after a
-- transient failure finishes it instead of leaving the evaluation running.
local ATTEMPTS = 3
local HISTORY = 20

local function invalid(message: string): error return errors.new({ kind = errors.INVALID, message = message }) end

-- Queues one job per case. Job keys derive from the evaluation and case, so
-- enrolling again reuses existing jobs and only adds missing ones.
local function enroll(id: string, eval_id: string, case_ids: { string }): error?
    for _, case_id in ipairs(case_ids) do
        local _, err = jobs.enqueue({
            namespace = "docscout", scope = id, key = "eval:" .. eval_id .. ":" .. case_id,
            owner_locator = { kind = "component", id = id }, job_type = WORKER, max_attempts = ATTEMPTS,
            immutable_payload = { component_id = id, eval_id = eval_id, case_id = case_id },
        })
        if err then return err end
    end
    return nil
end

-- Starts an evaluation of every case at the saved configuration. While one is
-- active, starting again returns it and enrolls any case that lacks its job.
function M.start(id: string): (any?, error?)
    local snapshot, err = extractors.get(id)
    if err then return nil, err end
    if not snapshot.can_edit then return nil, errors.new({ kind = errors.PERMISSION_DENIED, message = "Evaluating an extractor needs edit access" }) end
    local active, active_err = repository.active_eval(id)
    if active_err then return nil, active_err end
    if active then
        local enroll_err = enroll(id, active.id, active.queued)
        if enroll_err then return nil, enroll_err end
        return { success = true, eval_id = active.id, existing = true }, nil
    end
    if #snapshot.cases == 0 then return nil, invalid("Add an evaluation case first") end
    if #snapshot.config.fields == 0 then return nil, invalid("Add at least one field first") end
    for _, case in ipairs(snapshot.cases) do
        local case_err = config.validate_expected(snapshot.config.fields :: { any }, case.expected)
        if case_err then return nil, invalid("Case " .. case.upload_name .. " no longer matches the fields: " .. tostring(case_err) .. ". Update or remove it.") end
    end
    local identity, capture_err = execution_identity.capture()
    if capture_err then return nil, capture_err end
    local row, row_err = execution_identity.to_row(identity)
    if row_err then return nil, row_err end
    local fields, encode_err = json.encode(snapshot.config.fields)
    if encode_err then return nil, encode_err end
    local eval_id, add_err = repository.add_eval(id, {
        config_revision = snapshot.expected_revision, actor_id = row.actor_id, actor_context = row.actor_context, fields = fields,
    }, snapshot.cases)
    if add_err then return nil, add_err end
    local queued = eval_id :: string
    local case_ids = {}
    for _, case in ipairs(snapshot.cases) do case_ids[#case_ids + 1] = case.id end
    local enroll_err = enroll(id, queued, case_ids)
    if enroll_err then return nil, enroll_err end
    return { success = true, eval_id = queued }, nil
end

-- Evaluations of an extractor, newest first; editors only, like its cases.
function M.list(id: string): (any?, error?)
    local snapshot, err = extractors.get(id)
    if err then return nil, err end
    if not snapshot.can_edit then return nil, errors.new({ kind = errors.PERMISSION_DENIED, message = "Evaluations need edit access" }) end
    local items, list_err = repository.list_evals(id, HISTORY)
    if list_err then return nil, list_err end
    return { success = true, items = items }, nil
end

function M.get(id: string, eval_id: string): (any?, error?)
    local listed, err = M.list(id)
    if err then return nil, err end
    local item, get_err = repository.get_eval(eval_id)
    if get_err then return nil, get_err end
    if item.component_id ~= id then return nil, errors.new({ kind = errors.NOT_FOUND, message = "no evaluation " .. eval_id }) end
    return { success = true, evaluation = item, history = listed.items }, nil
end

-- Evaluation totals from finished cases: per-field accuracy over completed
-- cases, tokens and time over all of them.
function M.summarize(fields: { any }, finished: { any }): any
    local scored, tokens, duration, failed = {}, 0, 0, 0
    for _, r in ipairs(finished) do
        tokens, duration = tokens + r.tokens, duration + r.duration_ms
        if r.status == "completed" then scored[#scored + 1] = r.scores else failed = failed + 1 end
    end
    local totals: any = { tokens = tokens, duration_ms = duration, metrics = scoring.metrics(fields, scored) }
    if #scored == 0 then
        totals.status, totals.error = "failed", "Every case failed"
    else
        totals.status = "completed"
        if failed > 0 then totals.error = failed .. (failed == 1 and " case" or " cases") .. " failed" end
    end
    return totals
end

local function finish(eval: any, case_id: string, outcome: any): any
    local totals, err = repository.finish_case(eval.component_id, eval.id, case_id, outcome, function(finished: { any }): any
        return M.summarize(eval.fields, finished)
    end)
    if err then return { ok = false, job_error = tostring(err) } end
    return { ok = true, record = { status = totals and totals.status or outcome.status } }
end

-- Job worker for one case.
function M.run_case(input: any): any
    local payload = input.payload
    local eval, err = repository.get_eval(payload.eval_id, true)
    if err then return { ok = false, job_error = tostring(err) } end
    local case = nil
    for _, r in ipairs(eval.results) do if r.case_id == payload.case_id then case = r end end
    local active = eval.status == "queued" or eval.status == "running"
    if not active or not case or case.status ~= "queued" then return { ok = true, record = { status = "completed" } } end
    local _, mark_err = repository.mark_eval(eval.id, "running")
    if mark_err then return { ok = false, job_error = tostring(mark_err) } end
    local expected, case_err = repository.get_case(eval.component_id, payload.case_id)
    if case_err then return finish(eval, payload.case_id, { status = "failed", error = tostring(case_err) }) end
    local stored, row_err = execution_identity.from_row(eval.identity.actor_id, eval.identity.actor_context)
    if row_err then return finish(eval, payload.case_id, { status = "failed", error = tostring(row_err) }) end
    local executor, bind_err = execution_identity.bind(stored, { deferred_owner = WORKER })
    if bind_err then return finish(eval, payload.case_id, { status = "failed", error = tostring(bind_err) }) end
    local result, run_err = executor:call("kickside.docscout:extraction_run",
        { extractor_id = eval.component_id, upload_id = expected.upload_id, caller = "eval", deadline = input.job and input.job.deadline })
    if run_err then
        -- A run that stopped partway still spent time and tokens; its trace says how much.
        local details = (run_err :: any):details() or {}
        local tokens, duration = 0, 0
        for _, step in ipairs(details.trace or {}) do
            tokens = tokens + step.input_tokens + step.output_tokens
            duration = duration + step.duration_ms
        end
        local failed_step = details.trace and details.trace[#details.trace]
        local where = failed_step and (failed_step.kind .. ": ") or ""
        return finish(eval, payload.case_id, { status = "failed", error = where .. tostring(run_err), run_id = details.run_id,
            tokens = tokens, duration_ms = duration })
    end
    if result.config_revision ~= eval.config_revision then
        return finish(eval, payload.case_id, { status = "failed", run_id = result.run_id, tokens = result.tokens, duration_ms = result.duration_ms,
            error = "The configuration changed during the evaluation" })
    end
    local values = {}
    for _, f in ipairs(result.fields) do values[f.name] = f end
    return finish(eval, payload.case_id, {
        status = "completed", run_id = result.run_id, tokens = result.tokens, duration_ms = result.duration_ms,
        scores = scoring.case(eval.fields, expected.expected, values),
    })
end

return M
