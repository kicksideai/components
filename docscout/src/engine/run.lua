-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Runs one extraction: read the upload, then the stages in graph order, and
-- records the run with its per-step trace. Every caller — the Test tab,
-- agents, evals and Workflow Blocks — reaches the engine through here.
local time = require("time")
local security = require("security")
local extractors = require("extractors")
local repository = require("repository")
local retention = require("retention")
local process = require("process")
local stages = require("stages")
local ai = require("ai")
local shapes = require("shapes")
local error_envelope = require("error_envelope")
local execution_identity = require("execution_identity")

local M = {}

local CALLERS = { ui = true, agent = true, eval = true, workflow = true }

-- One stage of a run as the trace records it.
type TraceStep = { kind: string, status: string, scope: string, model: string?, duration_ms: integer,
    input_tokens: number, output_tokens: number, queries: { string }?, message: string? }

local function invalid(message: string): error return errors.new({ kind = errors.INVALID, message = message }) end
local function millis(): integer return math.floor(time.now():unix_nano() / 1000000) end

-- input: { id, upload_id, caller, deadline? } where deadline is an RFC3339
-- instant the run must finish by.
function M.run(input: any): (any?, error?)
    if type(input) ~= "table" or type(input.id) ~= "string" or input.id == "" then return nil, invalid("Choose an extractor") end
    if type(input.upload_id) ~= "string" or input.upload_id == "" then return nil, invalid("Choose an upload") end
    local caller = input.caller or "ui"
    if not CALLERS[caller] then return nil, invalid("Unknown caller " .. tostring(caller)) end
    local deadline = nil
    if input.deadline ~= nil then
        local parsed, parse_err = time.parse(time.RFC3339, tostring(input.deadline))
        if parse_err or not parsed then return nil, invalid("deadline must be an RFC3339 instant") end
        deadline = parsed
    end
    local actor = security.actor()
    if not actor then return nil, errors.new({ kind = errors.UNAUTHENTICATED, message = "authentication required" }) end
    local extractor, access_err = extractors.for_run(input.id)
    if access_err then return nil, access_err end
    if caller == "eval" then
        if type(input.evaluation_id) ~= "string" or type(input.case_id) ~= "string" then return nil, invalid("Evaluation and case references are required") end
        local evaluation, eval_err = repository.get_eval(input.evaluation_id, true)
        if eval_err then return nil, eval_err end
        local current, current_err = execution_identity.capture()
        if current_err then return nil, current_err end
        local row, row_err = execution_identity.to_row(current)
        if row_err then return nil, row_err end
        if evaluation.component_id ~= input.id or evaluation.identity.actor_id ~= row.actor_id then
            return nil, errors.new({ kind = errors.PERMISSION_DENIED, retryable = false, message = "Evaluation snapshot access denied" })
        end
        local admitted = nil
        for _, case in ipairs(evaluation.results) do if case.case_id == input.case_id then admitted = case end end
        if not admitted or admitted.upload_id ~= input.upload_id then return nil, invalid("Upload does not match the admitted case") end
        extractor = { config = evaluation.config_snapshot, revision = evaluation.config_revision }
    elseif input.evaluation_id ~= nil or input.case_id ~= nil then
        return nil, invalid("Snapshot references require an evaluation caller")
    end
    local config = extractor.config
    if #config.fields == 0 then return nil, invalid("Add at least one field before running") end

    local run: any = {
        config = config, regions = {}, notes = {}, analyses = {}, values = {}, confidence = 0,
        pool = shapes.pool(),
    }
    local trace: { TraceStep } = {}
    local started = millis()
    local failure: error? = nil

    local function step(kind: string, scope: string, model: string?, fn: (any) -> error?): boolean
        local record: any = { kind = kind, scope = scope, model = model, meter = ai.meter(deadline) }
        local t0 = millis()
        local err = ai.check_deadline(record.meter, "the " .. kind .. " step") or fn(record)
        trace[#trace + 1] = {
            kind = kind, status = err and "failed" or "completed", scope = scope, model = model,
            duration_ms = millis() - t0, input_tokens = record.meter.input_tokens, output_tokens = record.meter.output_tokens,
            queries = record.queries, message = err and tostring(err) or record.message,
        }
        if err then failure = err end
        return err == nil
    end

    local s = config.stages
    local ok = step("read", "document", config.retrieval.embedding_model, function(record: any): error?
        local document, err = process.ensure(input.id, actor:id(), input.upload_id, config.retrieval, record)
        if err then return err end
        run.document = document
        return nil
    end)
    if ok and s.map.enabled then ok = step("map", "outline", s.map.model, function(r: any): error? return stages.map(run, r) end) end
    if ok and s.prefetch.enabled then ok = step("prefetch", "chunk", nil, function(r: any): error? return stages.prefetch(run, r) end) end
    if ok and s.scout.enabled then ok = step("scout", "chunk", s.scout.model, function(r: any): error? return stages.scout(run, r) end) end
    local has_deep = false
    for _, f in ipairs(config.fields) do if f.strategy == "deep" then has_deep = true end end
    if ok and s.deep.enabled and has_deep then ok = step("deep", s.deep.read == "sections" and "section" or "chunk", s.deep.model, function(r: any): error? return stages.deep(run, r) end) end
    if ok and config.retrieval.highlighter then ok = step("highlight", "chunk", config.retrieval.highlighter_model, function(r: any): error? return stages.highlight(run, r) end) end
    if ok then ok = step("extract", "chunk", s.extract.model, function(r: any): error? return stages.extract(run, r) end) end
    if ok and s.verify.enabled then ok = step("verify", "chunk", s.verify.check_support and s.verify.model or nil, function(r: any): error? return stages.verify(run, r) end) end

    local tokens = 0
    for _, t in ipairs(trace) do tokens = tokens + t.input_tokens + t.output_tokens end
    local fields = {}
    for _, v in ipairs(run.values) do
        local evidence = {}
        for _, e in ipairs(v.evidence) do
            evidence[#evidence + 1] = { quote = e.quote, section = e.section, page = e.page, page_start = e.page_start, page_end = e.page_end, chunk_id = e.chunk_id, found = e.found }
        end
        fields[#fields + 1] = { name = v.name, value = v.value, confidence = v.confidence, verified = v.verified, missing = v.missing, reason = v.reason, evidence = evidence }
    end
    local result = {
        upload_id = input.upload_id, config_revision = extractor.revision, fields = fields, trace = trace,
        duration_ms = millis() - started, tokens = tokens, status = failure and "failed" or "completed",
        error = failure and error_envelope.encode(failure) or nil,
        pages = run.document and run.document.page_count or 0,
    }
    local expires_at, expiry_err = retention.expires_at()
    if expiry_err then
        if failure then return nil, error_envelope.wrap_secondary(expiry_err, failure, "run retention failed") end
        return nil, expiry_err
    end
    local run_id, record_err = repository.add_run(input.id, {
        user_id = actor:id(), upload_id = input.upload_id, caller = caller, status = result.status,
        config_revision = extractor.revision, result = { fields = fields, error = result.error }, trace = trace,
        duration_ms = result.duration_ms, tokens = tokens, expires_at = expires_at,
    })
    if record_err then
        if failure then return nil, error_envelope.wrap_secondary(record_err, failure, "run recording failed") end
        return nil, record_err
    end
    result.run_id = run_id
    if failure then
        return nil, error_envelope.wrap(failure, "extraction failed", { run_id = run_id, trace = trace })
    end
    return result, nil
end

return M
