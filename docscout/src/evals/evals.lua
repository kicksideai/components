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

local M = {}

local WORKER = "kickside.docscout.evals:case_worker"
local HISTORY = 20

local function invalid(message: string): error return errors.new({ kind = errors.INVALID, message = message }) end

-- Starts an evaluation of every case at the current configuration.
function M.start(id: string): (any?, error?)
    local snapshot, err = extractors.get(id)
    if err then return nil, err end
    if not snapshot.can_edit then return nil, errors.new({ kind = errors.PERMISSION_DENIED, message = "Evaluating an extractor needs edit access" }) end
    if #snapshot.cases == 0 then return nil, invalid("Add an evaluation case first") end
    if #snapshot.config.fields == 0 then return nil, invalid("Add at least one field first") end
    local identity, capture_err = execution_identity.capture({ component_id = id })
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
    for _, case in ipairs(snapshot.cases) do
        local _, enqueue_err = jobs.enqueue({
            namespace = "docscout", scope = id, key = "eval:" .. queued .. ":" .. case.id,
            owner_locator = { kind = "component", id = id }, job_type = WORKER, max_attempts = 1,
            immutable_payload = { component_id = id, eval_id = queued, case_id = case.id },
        })
        if enqueue_err then
            local _, mark_err = repository.mark_eval(queued, "failed", "Cases could not be queued: " .. tostring(enqueue_err))
            return nil, mark_err or enqueue_err
        end
    end
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
    if not case or case.status ~= "queued" then return { ok = true, record = { status = "completed" } } end
    local _, mark_err = repository.mark_eval(eval.id, "running")
    if mark_err then return { ok = false, job_error = tostring(mark_err) } end
    local expected, case_err = repository.get_case(eval.component_id, payload.case_id)
    if case_err then return finish(eval, payload.case_id, { status = "failed", error = tostring(case_err) }) end
    local stored, row_err = execution_identity.from_row(eval.identity.actor_id, eval.identity.actor_context)
    if row_err then return finish(eval, payload.case_id, { status = "failed", error = tostring(row_err) }) end
    local executor, bind_err = execution_identity.bind(stored, { deferred_owner = WORKER })
    if bind_err then return finish(eval, payload.case_id, { status = "failed", error = tostring(bind_err) }) end
    local result, run_err = executor:call("kickside.docscout.callers:contract_run",
        { extractor_id = eval.component_id, upload_id = expected.upload_id, caller = "eval" })
    if run_err then
        local details = (run_err :: any):details() or {}
        return finish(eval, payload.case_id, { status = "failed", error = (run_err :: any):message(), run_id = details.run_id })
    end
    if result.config_revision ~= eval.config_revision then
        return finish(eval, payload.case_id, { status = "failed", run_id = result.run_id,
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
