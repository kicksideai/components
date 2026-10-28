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

local M = {}

local CALLERS = { ui = true, agent = true, eval = true, workflow = true }

local function invalid(message: string): error return errors.new({ kind = errors.INVALID, message = message }) end
local function millis(): integer return math.floor(time.now():unix_nano() / 1000000) end

-- input: { id, upload_id, caller }
function M.run(input: any): (any?, error?)
    if type(input) ~= "table" or type(input.id) ~= "string" or input.id == "" then return nil, invalid("Choose an extractor") end
    if type(input.upload_id) ~= "string" or input.upload_id == "" then return nil, invalid("Choose an upload") end
    local caller = input.caller or "ui"
    if not CALLERS[caller] then return nil, invalid("Unknown caller " .. tostring(caller)) end
    local actor = security.actor()
    if not actor then return nil, errors.new({ kind = errors.UNAUTHENTICATED, message = "authentication required" }) end
    local extractor, access_err = extractors.for_run(input.id)
    if access_err then return nil, access_err end
    local config = extractor.config
    if #config.fields == 0 then return nil, invalid("Add at least one field before running") end

    local run: any = {
        config = config, regions = {}, notes = {}, analyses = {}, values = {}, confidence = 0,
        pool = shapes.pool(),
    }
    local trace: { any } = {}
    local started = millis()
    local failure: error? = nil

    local function step(kind: string, scope: string, model: string?, fn: (any) -> error?): boolean
        local record: any = { kind = kind, scope = scope, model = model, meter = ai.meter() }
        local t0 = millis()
        local err = fn(record)
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
        local document, err = process.ensure(actor:id(), input.upload_id, config.retrieval, record)
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
            evidence[#evidence + 1] = { quote = e.quote, section = e.section, page = e.page, chunk_id = e.chunk_id, found = e.found }
        end
        fields[#fields + 1] = { name = v.name, value = v.value, confidence = v.confidence, verified = v.verified, missing = v.missing, reason = v.reason, evidence = evidence }
    end
    local result = {
        upload_id = input.upload_id, config_revision = extractor.revision, fields = fields, trace = trace,
        duration_ms = millis() - started, tokens = tokens, status = failure and "failed" or "completed",
        error = failure and tostring(failure) or nil,
        pages = run.document and run.document.page_count or 0,
    }
    local expires_at, expiry_err = retention.expires_at()
    if expiry_err then return nil, expiry_err end
    local run_id, record_err = repository.add_run(input.id, {
        user_id = actor:id(), upload_id = input.upload_id, caller = caller, status = result.status,
        config_revision = extractor.revision, result = { fields = fields, error = result.error }, trace = trace,
        duration_ms = result.duration_ms, tokens = tokens, expires_at = expires_at,
    })
    if record_err then return nil, record_err end
    result.run_id = run_id
    if failure then
        return nil, errors.new({ kind = (failure :: any):kind() or errors.INTERNAL, message = tostring(failure), details = { run_id = run_id, trace = trace } })
    end
    return result, nil
end

return M
