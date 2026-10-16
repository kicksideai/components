-- Research-owned implementation of the canonical wait Block. arm starts a
-- research run and registers a core-thread projection for its terminal event;
-- resume_from_event resumes the parked Dataflow Signal through Blocks. Visual
-- Workflows is not part of this protocol.
--
-- Every externally-callable module is resolved through mod() so tests can swap in
-- stubs via M._modules for the duration of a case (mirrors
-- platform/automation/src/automation.lua's _modules/mod() seam).
local research_consts = require("research_consts")
local block_signal_repo = require("block_signal_repo")

local M = {}

M._modules = {} :: { [string]: any }

local _declared: { [string]: any } = {
    contract = require("contract"),
    security = require("security"),
    funcs = require("funcs"),
    json = require("json"),
    repo = block_signal_repo,
}

local function mod(name: string): any
    return M._modules[name] or _declared[name]
end

local RESUME_TARGET = "kickside.blocks:resume"

-- The projection worker THIS module registers on an armed research thread.
local RESUME_WORKER_REF = "func://kickside.research:resume_research_block_signal"

local function str(v: any): string
    if type(v) == "string" then return v end
    return ""
end

local function trim(v: any): string
    return (str(v):gsub("^%s*(.-)%s*$", "%1"))
end

local function content_value(v: any): string
    if type(v) == "string" then return v end
    if type(v) == "number" or type(v) == "boolean" then return tostring(v) end
    if type(v) == "table" then
        local json_mod = mod("json")
        local encoded = json_mod and select(1, json_mod.encode(v)) or nil
        return type(encoded) == "string" and encoded or "{}"
    end
    return ""
end

-- render_context flattens the Block's typed upstream input into a stable context
-- section appended to the configured prompt.
local function render_context(context: any): string
    if context == nil then return "" end
    if type(context) == "string" then return context end
    if type(context) ~= "table" then return tostring(context) end
    local ctx = context :: { [string]: any }
    local keys: { string } = {}
    for k in pairs(ctx) do keys[#keys + 1] = tostring(k) end
    table.sort(keys)
    local lines: { string } = {}
    for _, k in ipairs(keys) do
        lines[#lines + 1] = "- " .. k .. ": " .. content_value(ctx[k])
    end
    return table.concat(lines, "\n")
end

-- arm receives the canonical Blocks wait ABI:
-- { dataflow_id, node_id, signal_id, input, config, run_context }. Returns
-- { ok=true, research_id, thread_id } or (nil, err); a nil/err return fails the
-- Block, which is correct if research cannot even start.
function M.arm(args: any): (any?, string?)
    args = type(args) == "table" and args or {}
    local dataflow_id = str(args.dataflow_id)
    local signal_id = str(args.signal_id)
    if dataflow_id == "" then return nil, "dataflow_id is required" end
    if signal_id == "" then return nil, "signal_id is required" end

    local repo = mod("repo")
    local research_id = "block:" .. dataflow_id .. ":" .. signal_id

    -- Idempotent re-entry: an engine retry of the arm step must not start a
    -- second research run for the same Block instance.
    local existing, gerr = repo.get_by_research_id(research_id)
    if gerr then return nil, "Block Signal lookup failed: " .. gerr end
    if existing then
        return { ok = true, research_id = existing.research_id, thread_id = existing.thread_id }
    end

    local config = type(args.config) == "table" and (args.config :: { [string]: any }) or {}
    local agent_id = trim(config.agent_id)
    if agent_id == "" then return nil, "config.agent_id is required" end
    local prompt = trim(config.prompt)
    if prompt == "" then return nil, "config.prompt is required" end
    local max_iterations = tonumber(config.max_iterations)

    local rendered_context = render_context(args.input)
    local full_prompt = prompt
    if rendered_context ~= "" then full_prompt = prompt .. "\n\n" .. rendered_context end

    local run_context = type(args.run_context) == "table" and (args.run_context :: { [string]: any }) or {}
    local ctx: { [string]: any } = {
        block_signal = {
            dataflow_id = dataflow_id,
            signal_id = signal_id,
            node_id = str(args.node_id),
            run_context = run_context,
        },
    }

    local contract_mod = mod("contract")
    local security_mod = mod("security")
    local contract_id = "kickside.research:request"
    local def, get_err = contract_mod.get(contract_id)
    if get_err or not def then return nil, "research request contract unavailable: " .. tostring(get_err) end
    local inst, open_err = (def :: any):with_actor(security_mod.actor()):with_scope(security_mod.scope()):open()
    if open_err or not inst then return nil, "research request open failed: " .. tostring(open_err) end

    local result, rerr = (inst :: any):request({
        prompt = full_prompt,
        agent_id = agent_id,
        ctx = ctx,
        max_iterations = max_iterations,
        research_id = research_id,
    })
    if rerr or type(result) ~= "table" or not (result :: any).ok then
        return nil, "research request failed: " .. tostring(rerr or "unknown error")
    end
    local thread_id = trim((result :: any).thread_id)
    if thread_id == "" then return nil, "research request returned no thread_id" end

    local ins_err = repo.insert({
        research_id = research_id,
        thread_id = thread_id,
        dataflow_id = dataflow_id,
        signal_id = signal_id,
        status = research_consts.BLOCK_SIGNAL_STATUS.WAITING,
    })
    if ins_err then return nil, "could not persist Block Signal correlation: " .. ins_err end

    local funcs_mod = mod("funcs")
    local _, proj_err = funcs_mod.new():call(research_consts.THREADS_REGISTER_PROJECTION, {
        thread_id = thread_id,
        kind = "kickside.research.block_signal:" .. research_id,
        projection_key = research_id,
        cursor_key = research_id,
        worker_ref = RESUME_WORKER_REF,
        worker_input_mode = "prefetch_events",
        worker_config = { research_id = research_id },
        -- start_at_head omitted (defaults false): the cursor replays from the thread's
        -- first event, so a research result that lands before this registration commits
        -- is still folded instead of lost to the race.
    })
    if proj_err then return nil, "could not register Block Signal projection: " .. tostring(proj_err) end

    return { ok = true, research_id = research_id, thread_id = thread_id }, nil
end

-- build_payload shapes the reference-only resume payload for a terminal event. Never
-- copies the report/markdown -- downstream nodes dereference thread_id via
-- GET /research/{id}/events or the kickside_research_run projection.
local function build_payload(etype: string, research_id: string, thread_id: string, event: any): any
    local e = type(event) == "table" and (event :: { [string]: any }) or {}
    if etype == research_consts.EVENT.RESULT then
        return {
            outcome = "result",
            status = "complete",
            research_id = research_id,
            thread_id = thread_id,
            result_ref = {
                kind = "kickside.research.thread_event",
                event_type = research_consts.EVENT.RESULT,
                thread_id = thread_id,
                event_id = e.id,
                seq = e.seq,
            },
            run_ref = {
                kind = "kickside.research.run",
                research_id = research_id,
                thread_id = thread_id,
                projection = "kickside_research_run",
                api = "/research/" .. research_id .. "/events",
            },
        }
    end
    return {
        outcome = "failed",
        status = "failed",
        research_id = research_id,
        thread_id = thread_id,
        failed_ref = {
            kind = "kickside.research.thread_event",
            event_type = research_consts.EVENT.FAILED,
            thread_id = thread_id,
            event_id = e.id,
            seq = e.seq,
        },
    }
end

-- resume_one resumes the parked Block for one terminal event, idempotently.
-- The external signal is sent BEFORE the local status commit: if the resume call
-- fails, the row is still "waiting" and the projection's cursor retry will try again;
-- if the local commit fails after a successful signal, at most a redundant resume
-- call is made on retry (Dataflow Signal resume is idempotent once consumed).
local function resume_one(research_id: string, etype: string, event: any): string?
    local repo = mod("repo")
    local row, gerr = repo.get_by_research_id(research_id)
    if gerr then return gerr end
    if not row then return nil end
    if (row :: any).status ~= research_consts.BLOCK_SIGNAL_STATUS.WAITING then return nil end

    local payload = build_payload(etype, research_id, str((row :: any).thread_id), event)

    local funcs_mod = mod("funcs")
    local executor, executor_err = funcs_mod.new()
    if not executor then return "Block resume executor unavailable: " .. tostring(executor_err) end
    local _, rerr = executor:call(RESUME_TARGET, {
        dataflow_id = (row :: any).dataflow_id,
        signal_id = (row :: any).signal_id,
        payload = payload,
    })
    if rerr then return "could not resume Block: " .. tostring(rerr) end

    local new_status = etype == research_consts.EVENT.RESULT
        and research_consts.BLOCK_SIGNAL_STATUS.RESUMED
        or research_consts.BLOCK_SIGNAL_STATUS.FAILED
    local event_id = type(event) == "table" and str((event :: any).id) or ""
    local _, merr = repo.mark_resumed(research_id, new_status, event_id)
    if merr then return merr end
    return nil
end

-- resume_from_event(input) -- the registered projection's worker (prefetch_events).
-- input: { thread_id, events, range={to_seq}, projection={body} }, the same shape
-- projection.lua (the run read-model worker) receives. Filters for the research
-- terminal events and resumes the correlated Block exactly once.
function M.resume_from_event(input: any): any
    input = type(input) == "table" and input or {}
    local projection = type(input.projection) == "table" and (input.projection :: { [string]: any }) or {}
    local body = type(projection.body) == "table" and (projection.body :: { [string]: any }) or {}
    local worker_config = type(body.worker_config) == "table" and (body.worker_config :: { [string]: any }) or {}
    local research_id = trim(worker_config.research_id)

    local events = type(input.events) == "table" and (input.events :: { any }) or {}
    if research_id ~= "" then
        for _, e in ipairs(events) do
            local etype = str((e :: any).type)
            if etype == research_consts.EVENT.RESULT or etype == research_consts.EVENT.FAILED then
                local err = resume_one(research_id, etype, e)
                if err then error("Block Signal resume: " .. tostring(err)) end
            end
        end
    end

    local range = type(input.range) == "table" and (input.range :: { [string]: any }) or {}
    return { body = body, last_seq = tonumber(range.to_seq) or nil }
end

return M
