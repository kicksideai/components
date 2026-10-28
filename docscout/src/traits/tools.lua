-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Agent tools: list, run, read and configure extractors, and evaluate them.
-- Each runs under the calling agent's identity.
local engine = require("engine")
local extractors = require("extractors")
local evals = require("evals")
local config = require("config")
local shapes = require("shapes")

local function invalid(message: string): error return errors.new({ kind = errors.INVALID, message = message }) end

-- Tool failures carry the error's kind so an agent can tell its own mistake
-- from an outage.
local function failure(err: any): any
    if type(err) == "userdata" then
        return { success = false, error = (err :: any):message(), kind = (err :: any):kind(), retryable = (err :: any):retryable() }
    end
    return { success = false, error = tostring(err) }
end

local function tool_run(args: any): any
    local result, err = engine.run({ id = args.extractor_id, upload_id = args.upload_id, caller = "agent" })
    if err then return failure(err) end
    local fields = {}
    for _, f in ipairs(result.fields) do
        local quote = f.evidence[1]
        fields[#fields + 1] = { name = f.name, value = f.value, found = not f.missing, verified = f.verified, confidence = f.confidence,
            reason = f.reason, quote = quote and quote.quote or nil, section = quote and quote.section or nil, page = quote and quote.page or nil }
    end
    return { success = true, run_id = result.run_id, verified = shapes.verified(result), fields = fields }
end

local function tool_list(args: any): any
    local listed, err = extractors.list()
    if err then return failure(err) end
    local filter = type(args) == "table" and type(args.filter) == "string" and args.filter:lower() or ""
    local items = {}
    for _, row in ipairs(listed.items) do
        if filter == "" or tostring(row.meta.title or ""):lower():find(filter, 1, true) then
            items[#items + 1] = { extractor_id = row.component_id, title = row.meta.title, description = row.meta.description, fields = tonumber(row.meta.field_count) or 0 }
        end
    end
    return { success = true, extractors = items, truncated = listed.truncated }
end

local function tool_get(args: any): any
    local snapshot, err = extractors.get(args.extractor_id)
    if err then return failure(err) end
    if not snapshot.can_edit then return failure(errors.new({ kind = errors.PERMISSION_DENIED, message = "Reading the configuration needs edit access" })) end
    local schema, schema_err = config.schema()
    if schema_err then return failure(schema_err) end
    return { success = true, title = snapshot.title, description = snapshot.description, expected_revision = snapshot.expected_revision,
        config = snapshot.config, config_schema = schema, cases = #snapshot.cases }
end

local function tool_configure(args: any): any
    local result, err = extractors.update(args.extractor_id, { title = args.title, description = args.description or "", config = args.config,
        expected_revision = args.expected_revision })
    if err then return failure(err) end
    return { success = true, revision = result and result.context_revision }
end

local function tool_evaluate(args: any): any
    local started, err = evals.start(args.extractor_id)
    if err then return failure(err) end
    return { success = true, eval_id = started.eval_id }
end

-- The latest evaluation, or the one asked for, with per-field accuracy and per-case scores.
local function tool_evaluation(args: any): any
    local listed, err = evals.list(args.extractor_id)
    if err then return failure(err) end
    local eval_id = args.eval_id or (listed.items[1] and listed.items[1].id)
    if not eval_id then return failure(invalid("This extractor has no evaluations yet")) end
    local found, get_err = evals.get(args.extractor_id, eval_id)
    if get_err then return failure(get_err) end
    local e = found.evaluation
    local cases = {}
    for _, r in ipairs(e.results) do
        cases[#cases + 1] = { document = r.upload_name, status = r.status, error = r.error, scores = r.scores }
    end
    return { success = true, eval_id = e.id, status = e.status, revision = e.config_revision, error = e.error,
        accuracy = e.metrics, cases = cases }
end

return {
    run = tool_run, list = tool_list, get = tool_get, configure = tool_configure, evaluate = tool_evaluate, evaluation = tool_evaluation,
}
