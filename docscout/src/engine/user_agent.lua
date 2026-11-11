-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Selected agents use the platform resolver and the native Dataflow agent node.
local component = require("component")
local component_envelope = require("component_envelope")
local agent_types = require("agent_types")
local agent_ref = require("agent_ref")
local compiler = require("compiler")
local client = require("flow_client")
local data_reader = require("data_reader")
local json = require("json")
local doctools = require("doctools")
local shapes = require("shapes")
local ai = require("ai")
local error_envelope = require("error_envelope")

local M = {}
local DOCUMENT_TOOL = "kickside.docscout.engine:document_tool"
-- Each document-tool result gets one quarter of the available model input.
-- The selected agent owns its prompt and subsequent conversation assembly.
local TOOL_RESULT_SHARE = 4
local function runtime_error(operation: string, err: any): error
    if type(err) == "userdata" then return errors.wrap(err, operation) end
    return errors.new({ kind = errors.INTERNAL, message = operation .. ": " .. tostring(err), retryable = false,
        details = { code = "docscout_agent_runtime" } })
end

local function access(id: string, include_context: boolean): (any?, error?)
    local service, err = component.get_service()
    if err then return nil, err end
    if not service then return nil, errors.new({ kind = errors.INTERNAL, message = "Agent component service is unavailable" }) end
    local result, access_err = service:get_access_context({ component_id = id, access_mask = component.ACCESS.READ, include_context = include_context })
    local failure = access_err or component_envelope.error_of(result, "Agent access")
    if failure then
        return nil, error_envelope.wrap(failure, "Selected agent is unavailable", { code = "docscout_agent_access", agent_id = id })
    end
    if result.impl_id ~= agent_types.USER_AGENT_IMPL then
        return nil, errors.new({ kind = errors.INVALID, message = "Selected component is not an agent", retryable = false,
            details = { code = "docscout_agent_type", agent_id = id } })
    end
    return result, nil
end

function M.validate(id: string): error?
    local _, err = access(id, false)
    return err
end

local function positive(value: any): integer?
    local n = math.tointeger(tonumber(value))
    return n and n > 0 and n or nil
end

-- A zero or absent card limit is unknown, so this leaves the existing handoff
-- untouched. The selected agent's configured output never exceeds its card.
local function handoff_budget(agent: any): (any?, error?)
    local context = agent.context
    local model = type(context) == "table" and context.model or nil
    if type(model) ~= "string" or model == "" then return nil end
    local available, _, budget_err = ai.input_budget(model, positive(context.max_tokens))
    if budget_err then return nil, budget_err end
    if not available then return nil end
    return { model = model, available = available, share = math.floor(available / TOOL_RESULT_SHARE) }, nil
end

local function mark_budget_dropped(run: any, fields: { string }?)
    run.budget_dropped = run.budget_dropped or {}
    for _, path in ipairs(fields or {}) do run.budget_dropped[path] = true end
end

local function content(row: any): (any?, error?)
    if row.content_type == "application/json" and type(row.content) == "string" then return json.decode(row.content) end
    return row.content, nil
end

-- Native action and observation records supply tool history, evidence and usage.
local function collect(run: any, step: any, flow_id: string): error?
    local rows, err = data_reader.with_dataflow(flow_id):with_data_types("agent.action", "agent.observation", "agent.error"):all()
    if err then return runtime_error("Agent trace lookup", err) end
    local calls, observed, fields = {}, {}, {}
    for _, field in ipairs(run.config.fields) do
        if field.strategy ~= "deep" or not run.config.stages.deep.enabled then fields[#fields + 1] = shapes.path(field) end
    end
    for _, row in ipairs(rows) do
        local value, decode_err = content(row)
        if decode_err then return decode_err end
        local meta = row.metadata or {}
        if row.type == "agent.action" or row.type == "agent.error" then
            step.model = meta.model or step.model
            ai.add_call(step.meter, "scout", tostring(meta.model or step.model or ""), meta.tokens,
                {finish_reason=meta.finish_reason, latency_ms=meta.latency_ms, error_code=meta.error_code,
                    sources=meta.sources, fields=meta.fields or fields})
            for _, tc in ipairs(value.tool_calls or {}) do
                calls[#calls + 1] = { id = tc.id, name = tc.name, registry_id = tc.registry_id, arguments = tc.arguments, iteration = meta.iteration }
            end
        elseif meta.tool_call_id then observed[meta.tool_call_id] = { value = value, is_error = meta.is_error } end
    end
    table.sort(calls, function(a: any, b: any): boolean
        if a.iteration ~= b.iteration then return a.iteration < b.iteration end
        return a.id < b.id
    end)
    local failure: error? = nil
    for _, call in ipairs(calls) do
        local result = observed[call.id]
        if result then
            call.result = result.value
            if result.is_error then
                call.error = { kind = errors.UNAVAILABLE, message = tostring(result.value), retryable = false }
                failure = failure or errors.new(call.error)
            elseif call.registry_id == DOCUMENT_TOOL and type(result.value) == "table" then
                local document = result.value.docscout
                shapes.add(run.pool, result.value.chunks or {})
                for _, code in ipairs(document.codes or {}) do
                    if code == "context_budget_partial" then mark_budget_dropped(run, fields) end
                end
                for _, c in ipairs(document.calls or {}) do
                    local usage = c.prompt_tokens and { prompt_tokens = c.prompt_tokens, completion_tokens = c.completion_tokens } or nil
                    ai.add_call(step.meter, c.stage, c.model, usage, c)
                end
                if document.error then call.error = document.error; failure = failure or errors.new(document.error) end
            end
        end
    end
    step.tool_calls = calls
    return failure
end

function M.run(run: any, step: any, system: string, user: string): (string?, integer, error?)
    local cfg = run.config.stages.scout
    local agent, access_err = access(cfg.agent_id, true)
    if access_err then return nil, 0, access_err end
    local agent_model = type(agent.context) == "table" and agent.context.model or nil
    local budget, budget_err = handoff_budget(agent)
    if budget_err then return nil, 0, budget_err end
    local message = system .. "\n\n" .. user
    if budget then
        local estimated = ai.estimate_value({ message = message })
        if estimated > budget.available then
            return nil, 0, ai.budget_error(budget.model, estimated, budget.available)
        end
    end
    local tools = {}
    for _, name in ipairs(cfg.tools) do
        local definition = doctools.TOOLS[name]
        tools[#tools + 1] = { id = DOCUMENT_TOOL, alias = name,
            schema = definition.schema, description = definition.description,
            context = { docscout = { component_id = run.component_id, document_id = run.document.id,
                tool = name, outline = run.document.outline, embedding_model = run.document.embedding_model, deadline = run.deadline,
                fields = shapes.paths(run.config.fields),
                context_budget = budget } } }
    end
    local compiled, compile_err = compiler.compile({
        { type = compiler.OP_TYPES.WITH_INPUT, config = { data = { message = message } } },
        { type = compiler.OP_TYPES.AGENT, config = { agent_id = agent_ref.user(cfg.agent_id),
            arena = { tools = tools, max_iterations = cfg.max_rounds * cfg.max_extra_queries + 1, tool_calling = "auto" },
            show_tool_calls = false } },
    }, {})
    if compile_err then return nil, 0, runtime_error("Agent compilation", compile_err) end
    local executor, client_err = client.new()
    if client_err then return nil, 0, runtime_error("Agent execution client", client_err) end
    local flow_id, create_err = executor:create_workflow(compiled.commands, { metadata = { title = "Document scout" } })
    if create_err then return nil, 0, runtime_error("Agent admission", create_err) end
    step.agent_id, step.dataflow_id = cfg.agent_id, flow_id
    local result, run_err = executor:execute(flow_id)
    local trace_err = collect(run, step, flow_id)
    if trace_err then return nil, #(step.tool_calls or {}), trace_err end
    if run_err then
        local context_err = ai.context_error(agent_model, run_err)
        if context_err then return nil, #(step.tool_calls or {}), context_err end
        return nil, #(step.tool_calls or {}), runtime_error("Selected agent execution", run_err)
    end
    if result.pending or result.passivated then
        return nil, #(step.tool_calls or {}), errors.new({ kind = errors.INVALID, retryable = false,
            message = "Document scouting requires an agent that completes without waiting", details = { code = "docscout_agent_pending", dataflow_id = flow_id } })
    end
    local answer = result.data
    if type(answer) == "table" then answer = answer.answer or answer.result or answer.text end
    if type(answer) ~= "string" then
        return nil, #(step.tool_calls or {}), errors.new({ kind = errors.UNAVAILABLE, retryable = false,
            message = "Selected agent returns no scouting notes", details = { code = "docscout_agent_output" } })
    end
    return answer, #(step.tool_calls or {}), nil
end

return M
