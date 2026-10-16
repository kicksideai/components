local production_security = require("security")
local production_funcs = require("funcs")
local uuid = require("uuid")
local production_flow = require("flow")
local consts = require("research_consts")
local format = require("deliver_format")

-- kickside.research:request -- the canonical seam to request a research. Runs
-- under the requester's actor (ambient). It ensures a canonical kickside.core
-- thread (one per run, actor-scoped), appends the request EVENT (prompt + ambient
-- ctx + agent_id), and starts the agent dataflow -- which captures the ambient
-- actor, so the run executes AS the requester with no identity reconstruction.
-- agent_id is REQUIRED: a research with no agent is an error, not a default. The
-- thread events are the source of truth (request / progress / result / failed); the
-- run projection materializes them into kickside_research_run, which state.lua reads.
local function construct(deps: any): any
local security = deps.security
local funcs = deps.funcs
local flow = deps.flow
local M = {}

-- Append a thread event under the caller; used for the request and for a failed
-- start (so a run that never launches still shows as failed in the folded log).
local function append_event(exec: any, thread_id: string, etype: string, role: string, body: any, text: string): (number?, string?)
    local appended, aerr = exec:call(consts.THREADS_APPEND_EVENT, {
        thread_id = thread_id,
        event = {
            type = etype,
            role = role,
            body = body,
            content = { content_type = "text/plain", content_mode = "inline", content_bytes = #text },
        },
    })
    if aerr then return nil, tostring(aerr) end
    local seq = type(appended) == "table" and tonumber(appended.max_seq) or nil
    if not seq or seq < 1 then return nil, "thread append returns no committed sequence" end
    return seq, nil
end

local function trim(value: any): string
    if type(value) ~= "string" then return "" end
    return (value:gsub("^%s*(.-)%s*$", "%1"))
end

local function executor(): (any?, any?, string?)
    local actor = security.actor()
    if not actor or trim(actor:id()) == "" then return nil, nil, "an authenticated actor is required" end
    local scope = security.scope()
    if not scope then return nil, nil, "a security scope is required" end
    return funcs.new():with_actor(actor):with_scope(scope), actor, nil
end

local function current_actor_id(actor: any): string
    return trim(actor:id())
end

-- graph(builder, spec) -> builder. The research Dataflow: the agent node feeds
-- deliver on its normal edge and deliver_error on its error edge; deliver itself
-- routes its own failure (a blank report, a rejected thread append) to
-- deliver_error too, so every terminal outcome lands on the research thread as
-- RESULT or FAILED. spec: { prompt, agent_id, max_iterations, research_id,
-- thread_id, ctx }. The system instruction drives the report_progress tool so the
-- run streams a live log; the actual task is the input (the user's prompt).
function M.graph(builder: any, spec: any): any
    local progress_prompt = "You are a research agent. As you work, call the ReportProgress tool"
        .. " between steps to report what you are doing now, key findings so far, and the next step."
        .. " Then produce a final structured report (title, summary, key_points, sources)."
    local meta = { research_id = spec.research_id, thread_id = spec.thread_id }
    return builder
        :with_title("Research: " .. spec.prompt)
        :with_metadata({ type = "research", research_id = spec.research_id, thread_id = spec.thread_id })
        :with_input({ prompt = spec.prompt })
        :agent(spec.agent_id, { arena = {
            prompt = progress_prompt,
            tool_calling = "any",
            exit_schema = format.REPORT_SCHEMA,
            max_iterations = spec.max_iterations,
            context = { research_id = spec.research_id, research_thread_id = spec.thread_id, ctx = spec.ctx },
            tools = { "kickside.research:report_progress" },
        } }):as("research"):error_to("deliver_error", "error")
        :to("deliver", "report")
        :with_data(meta):as("meta"):to("deliver", "meta"):to("deliver_error", "meta")
        :func("kickside.research:deliver", { inputs = { required = { "report", "meta" } } }):as("deliver")
        :error_to("deliver_error", "error")
        :to("@success")
        -- deliver_error requires "error" so a successful run (meta-only) never
        -- triggers a spurious failure.
        :func("kickside.research:deliver_error", { inputs = { required = { "error", "meta" } } }):as("deliver_error"):to("@fail")
end

-- request(input) -> (result, err). input: { prompt, ctx?, agent_id, research_id? }.
function M.request(input: any): (any, string?)
    input = type(input) == "table" and input or {}
    local prompt = type(input.prompt) == "string" and input.prompt or ""
    if trim(prompt) == "" then return { ok = false }, "prompt is required" end
    local agent_id = trim(input.agent_id)
    if agent_id == "" then return { ok = false }, "agent_id is required (research will not run without an agent)" end
    local ctx = type(input.ctx) == "table" and input.ctx or {}
    -- Run depth: caller-tunable, clamped to a sane ceiling.
    local max_iterations = math.floor(tonumber(input.max_iterations) or 20)
    if max_iterations < 1 then max_iterations = 1 end
    if max_iterations > 50 then max_iterations = 50 end

    local exec, actor, eerr = executor()
    if eerr or not exec or not actor then return { ok = false }, eerr end
    local actor_id = current_actor_id(actor)

    local research_id = trim(input.research_id) ~= "" and trim(input.research_id) or uuid.v7()
    local external_ref = consts.external_ref(actor_id, research_id)

    -- 1. Ensure the canonical thread (actor-scoped, one per run), registered as the
    -- research-run KIND. The engine reads that binding on create and auto-applies its
    -- declared read-model projection -- no register_projection call here.
    local thread_res, terr = exec:call(consts.THREADS_UPSERT, {
        thread_class = consts.THREAD_CLASS,
        impl_id = consts.KIND_IMPL,
        external_ref = external_ref,
        title = "Research: " .. prompt,
        attrs = {
            managed_by = "kickside.research",
            role = "research",
            user_ids = { actor_id },
            actor_id = actor_id,
            research_id = research_id,
            agent_id = agent_id,
        },
    })
    local thread_id = type(thread_res) == "table" and trim((thread_res :: any).thread_id) or ""
    if terr or thread_id == "" then return { ok = false }, "could not establish research thread: " .. tostring(terr) end

    -- 2. Append the request event (prompt + ambient ctx + agent_id). This is the
    -- run's genesis event -- the projection reads it as RUNNING until a terminal.
    local request_seq, aerr = append_event(exec, thread_id, consts.EVENT.REQUEST, "user",
        { research_id = research_id, prompt = prompt, ctx = ctx, agent_id = agent_id, actor_id = actor_id }, prompt)
    if aerr then return { ok = false, thread_id = thread_id }, "could not append research request: " .. aerr end

    local projected, projection_err = exec:call(consts.THREADS_CATCH_UP_PROJECTION, {
        thread_id = thread_id,
        kind = consts.PROJECTION_KIND,
    })
    if projection_err then
        return { ok = false, thread_id = thread_id, research_id = research_id }, "research request projection failed: " .. tostring(projection_err)
    end
    local last_seq = type(projected) == "table" and tonumber(projected.last_seq) or nil
    if not last_seq or not request_seq or last_seq < request_seq then
        return { ok = false, thread_id = thread_id, research_id = research_id }, "research request projection does not reach the committed event"
    end

    -- 3. Start the agent dataflow. flow:start() is async and captures the ambient
    -- actor, so the run is durable and executes as the requester -- no identity
    -- reconstruction. The agent reports progress + result back as thread events via
    -- the report_progress tool and the deliver node, which carry the research
    -- correlation through arena.context; the projection folds them into the body.
    local dataflow_id, ferr = M.graph(flow.create(), {
        prompt = prompt,
        agent_id = agent_id,
        max_iterations = max_iterations,
        research_id = research_id,
        thread_id = thread_id,
        ctx = ctx,
    }):start()

    if ferr or not dataflow_id then
        -- A run that never launched is recorded as failed on its own thread, so it
        -- surfaces in the folded log instead of hanging as perpetually RUNNING.
        local _, failed_append_err = append_event(exec, thread_id, consts.EVENT.FAILED, "assistant",
            { error = "could not start research" }, "could not start research")
        if failed_append_err then
            return { ok = false, thread_id = thread_id, research_id = research_id },
                "research start failed: " .. tostring(ferr) .. "; could not record failure: " .. failed_append_err
        end
        return { ok = false, thread_id = thread_id, research_id = research_id }, "research start failed: " .. tostring(ferr)
    end

    return { ok = true, research_id = research_id, thread_id = thread_id, dataflow_id = dataflow_id, status = consts.STATUS.RUNNING }, nil
end

M.new = construct
return M
end

return construct({ security = production_security, funcs = production_funcs, flow = production_flow })
