local funcs = require("funcs")
local logger = require("logger"):named("kickside.research.deliver")
local consts = require("research_consts")
local format = require("deliver_format")

-- Dataflow terminal nodes for a research run. The research agent's final answer
-- is validated as a report, rendered to markdown (with source URLs), and appended
-- to the canonical research thread as a RESULT event -- the source of truth the
-- folded read model (state.lua) reads as complete. A run whose rendered report is
-- blank never produces a RESULT: it fails closed so the Dataflow routes it to
-- deliver_error, which appends the FAILED event. Both run under the dataflow's
-- ambient (requester) identity and carry the research correlation through `meta`.
--
-- The funcs seam is resolved through mod() so tests can record the exact
-- thread-append payload via M._modules (same seam shape as blocks/block_signal.lua).
local M = {}

M._modules = {} :: { [string]: any }

local _declared: { [string]: any } = {
    funcs = funcs,
}

local function mod(name: string): any
    return M._modules[name] or _declared[name]
end

local function trim(value: any): string
    if type(value) ~= "string" then return "" end
    return (value:gsub("^%s*(.-)%s*$", "%1"))
end

local function append_event(thread_id: string, event_type: string, body: any, text: string): string?
    local _, aerr = mod("funcs").new():call(consts.THREADS_APPEND_EVENT, {
        thread_id = thread_id,
        event = {
            type = event_type,
            role = "assistant",
            body = body,
            content = { content_type = "text/markdown", content_mode = "inline", content_bytes = #text },
        },
    })
    if aerr then return tostring(aerr) end
    return nil
end

-- Extract a human error from a dataflow error input or an agent output, which
-- arrives as a string OR a structured { code, message } / { error } (e.g.
-- AGENT_EXEC_FAILED / "OpenAI API key is required"). Without this the real cause
-- is lost behind a generic fallback.
local function err_text(e: any): string
    if type(e) == "string" and trim(e) ~= "" then return trim(e) end
    if type(e) == "table" then
        local et = e :: { message: any, error: any, code: any }
        if type(et.message) == "string" and trim(et.message) ~= "" then return trim(et.message) end
        if type(et.error) == "string" and trim(et.error) ~= "" then return trim(et.error) end
        if type(et.code) == "string" and trim(et.code) ~= "" then return trim(et.code) end
    end
    return ""
end

M.NO_REPORT = "research agent produced no report"

-- handler(args): the success terminal. args.report = agent output, args.meta =
-- { research_id, thread_id }. Returns (nil, err) when no usable report exists, so
-- the Dataflow takes the error edge instead of recording a blank success.
local function handler(args: any): any
    args = type(args) == "table" and args or {}
    local meta = type(args.meta) == "table" and args.meta or {}
    local thread_id = trim((meta :: any).thread_id)
    if thread_id == "" then return nil, "research result has no thread_id" end

    local report, report_err = format.to_report(args.report)
    if not report then
        local detail = err_text(args.report)
        return nil, M.NO_REPORT .. ": " .. (detail ~= "" and detail or tostring(report_err))
    end
    local markdown = format.render_markdown(report)
    local urls = format.urls_of(report)

    local aerr = append_event(thread_id, consts.EVENT.RESULT, { markdown = markdown, urls = urls }, markdown)
    if aerr then return nil, "could not append research result: " .. aerr end
    return { delivered = true, thread_id = thread_id }
end

-- error_handler(args): the failure terminal for both the agent's error edge and
-- deliver's own error edge. Appends a FAILED event to the thread (the folded log
-- reads it as failed). When that append itself fails the error is returned so the
-- Dataflow records the node failure instead of a silent loss.
local function error_handler(args: any): any
    args = type(args) == "table" and args or {}
    local meta = type(args.meta) == "table" and args.meta or {}
    local thread_id = trim((meta :: any).thread_id)
    local research_id = trim((meta :: any).research_id)
    local reason = err_text(args.error)
    if reason == "" then reason = "research failed" end
    logger:warn("research failed", { research_id = research_id, thread_id = thread_id, reason = reason })

    if thread_id == "" then return nil, "research failure has no thread_id: " .. reason end

    local aerr = append_event(thread_id, consts.EVENT.FAILED, { error = reason }, reason)
    if aerr then return nil, "could not append research failure (" .. reason .. "): " .. aerr end
    return { delivered = false, failed = true, thread_id = thread_id, error = reason }
end

M.handler = handler
M.error_handler = error_handler
M.to_report = format.to_report
M.render_markdown = format.render_markdown
M.urls_of = format.urls_of

return M
