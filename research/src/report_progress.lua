local ctx = require("ctx")
local funcs = require("funcs")
local consts = require("research_consts")

-- Agent tool: report_progress. The research agent calls this between steps to post
-- an intermediary update -- what it is doing, findings so far, the next step + a
-- rough ETA. The update is appended as a PROGRESS event to the canonical research
-- thread: the thread is the source of truth, the actor's live UI gets it for free
-- via the thread realtime fan-out, and the folded read model (state.lua) picks it
-- up as latest_step. The thread id is carried in the agent's arena.context. Runs
-- under the dataflow's ambient (requester) identity.
local M = {}

local function trim(value: any): string
    if type(value) ~= "string" then return "" end
    return (value:gsub("^%s*(.-)%s*$", "%1"))
end

local function ctx_get(key: string): string
    local v, _ = ctx.get(key)
    return trim(v)
end

local function string_list(value: any): { string }
    local out: { string } = {}
    if type(value) ~= "table" then return out end
    for _, v in ipairs(value :: { any }) do
        if type(v) == "string" and v ~= "" then out[#out + 1] = v end
    end
    return out
end

function M.handle(input: any): (any?, error?)
    input = type(input) == "table" and input or {}
    local thread_id = ctx_get("research_thread_id")
    if thread_id == "" then return { success = false, error = "no research thread in context" } end

    local step = trim(input.step)
    local status = trim(input.status)
    local eta = trim(input.eta)
    local findings = string_list(input.findings)
    local urls = string_list(input.urls)

    local _, aerr = funcs.new():call(consts.THREADS_APPEND_EVENT, {
        thread_id = thread_id,
        event = {
            type = consts.EVENT.PROGRESS,
            role = "assistant",
            body = { status = status, step = step, findings = findings, eta = eta, urls = urls },
            content = { content_type = "text/plain", content_mode = "inline", content_bytes = #step },
        },
    })
    if aerr then return nil, aerr end

    return { success = true, recorded = true }
end

return M
