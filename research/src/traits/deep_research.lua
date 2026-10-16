local contract = require("contract")
local time = require("time")
local state = require("research_state")
local consts = require("research_consts")

-- Agent tool: DeepResearch. Lets ANY agent trigger a research run and wait for the
-- result in one call. It triggers the canonical kickside.research:request contract
-- (which creates the actor thread + request event + the agent dataflow, running as
-- the calling agent's identity), then folds the run's thread until it reaches a
-- terminal status, and returns the markdown report. The research runs canonically
-- (thread events + live progress are still produced); this tool just blocks the
-- caller until it finishes, like a Wait* tool. agent_id defaults to the bundled
-- research agent when the caller does not name one.
local M = {}

local REQUEST_CONTRACT = "kickside.research:request"
local DEFAULT_AGENT = "kickside.research.agents:researcher"
local POLL_MS = 2000
local MAX_WAIT_MS = 240000 -- 4 minutes

local function trim(value: any): string
    if type(value) ~= "string" then return "" end
    return (value:gsub("^%s*(.-)%s*$", "%1"))
end

function M.handle(input: any): (any?, error?)
    input = type(input) == "table" and input or {}
    local prompt = trim(input.prompt) ~= "" and trim(input.prompt) or trim(input.topic)
    if prompt == "" then return { success = false, error = "prompt is required" } end
    local agent_id = trim(input.agent_id) ~= "" and trim(input.agent_id) or DEFAULT_AGENT
    local max_iterations = tonumber(input.max_iterations)

    -- Trigger via the canonical contract, under the calling agent's identity.
    local def, gerr = contract.get(REQUEST_CONTRACT)
    if not def then return nil, gerr end
    local inst, oerr = (def :: any):open()
    if not inst then return nil, oerr end
    local res, rerr = inst:request({ prompt = prompt, agent_id = agent_id, max_iterations = max_iterations })
    if rerr then return nil, rerr end
    if (res :: any).ok ~= true then
        local refused: any = {}
        for key, value in pairs(res :: any) do refused[key] = value end
        refused.success = false
        refused.error = tostring((res :: any).error)
        return refused
    end
    local research_id = trim((res :: any).research_id)
    local thread_id = trim((res :: any).thread_id)

    -- Fold the run's thread until terminal. The dataflow runs in parallel and the
    -- deliver node appends the result / failed event the fold reads.
    local waited = 0
    local events = process.events()
    while waited <= MAX_WAIT_MS do
        local row, read_err = state.summary(thread_id)
        if read_err then return nil, read_err end
        if type(row) == "table" then
            local status = trim((row :: any).status)
            if status == consts.STATUS.COMPLETE then
                local report = (row :: any).result_md
                if trim(report) == "" then
                    return {
                        success = false, research_id = research_id, thread_id = thread_id,
                        status = status, error = "research completed without a report",
                    }
                end
                return {
                    success = true, research_id = research_id, thread_id = thread_id,
                    status = status, report = report,
                }
            end
            if status == consts.STATUS.FAILED then
                return {
                    success = false, research_id = research_id, thread_id = thread_id,
                    status = status, error = trim((row :: any).latest_step) ~= "" and (row :: any).latest_step or "research failed",
                }
            end
        end

        local remaining = (MAX_WAIT_MS :: number) - waited
        if remaining <= 0 then break end
        local delay = math.min(POLL_MS, remaining)
        local tick = time.after(tostring(delay) .. "ms")
        local result = channel.select({
            events:case_receive(),
            tick:case_receive(),
        })
        if result.channel == events then
            local event = result.value
            local kind = type(event) == "table" and event.kind or nil
            if kind == process.event.CANCEL or kind == process.event.EXIT or kind == process.event.LINK_DOWN then
                return {
                    success = false, research_id = research_id, thread_id = thread_id,
                    status = "cancelled", error = "research wait cancelled",
                }
            end
        else
            waited = waited + delay
        end
    end
    return {
        success = false, research_id = research_id, thread_id = thread_id,
        status = "timeout", error = "research did not complete within the wait window",
    }
end

return M
