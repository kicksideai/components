-- GET /research/{id}/events — the live progress log for one run: the canonical
-- thread's research events (request / progress / result / failed) in order, plus
-- the folded run summary. The page loads this when a run is expanded and refetches
-- it on the actor's realtime thread nudge, so the log streams as the agent reports
-- -- no polling. Ownership falls out of resolution: state.resolve_thread_id scans
-- only the caller's research threads (access-filtered), so a run the caller does
-- not own resolves to nil -> 404. The thread read is READ-gated by the contract.

local http = require("http")
local security = require("security")
local funcs = require("funcs")
local json = require("json")
local state = require("research_state")
local consts = require("research_consts")

local function trim(value: any): string
    if type(value) ~= "string" then return "" end
    return (value:gsub("^%s*(.-)%s*$", "%1"))
end

-- The research event types, in case other event kinds ever share the thread.
local RESEARCH_TYPES: { [string]: boolean } = {}
RESEARCH_TYPES[consts.EVENT.REQUEST] = true
RESEARCH_TYPES[consts.EVENT.PROGRESS] = true
RESEARCH_TYPES[consts.EVENT.RESULT] = true
RESEARCH_TYPES[consts.EVENT.FAILED] = true

local function handler()
    local req = http.request()
    local res = http.response()
    if not req or not res then return nil, "no http context" end
    res:set_content_type(http.CONTENT.JSON)

    local actor = security.actor()
    if not actor or trim(actor:id()) == "" then
        res:set_status(http.STATUS.UNAUTHORIZED)
        res:write_json({ success = false, error = "authentication required" })
        return
    end

    local research_id = trim(req:param("id"))
    if research_id == "" then
        res:set_status(http.STATUS.BAD_REQUEST)
        res:write_json({ success = false, error = "research id is required" })
        return
    end

    local thread_id, rerr = state.resolve_thread_id(research_id)
    if rerr then
        res:set_status(http.STATUS.INTERNAL_ERROR)
        res:write_json({ success = false, error = tostring(rerr) })
        return
    end
    if not thread_id or thread_id == "" then
        res:set_status(http.STATUS.NOT_FOUND)
        res:write_json({ success = false, error = "research not found" })
        return
    end

    -- Read the canonical thread log through the threads contract (READ-gated under
    -- the caller). Oldest-first so the log reads top-to-bottom and the fold is in
    -- order.
    local listed, lerr = funcs.new():call(consts.THREADS_LIST_EVENTS, {
        thread_id = thread_id,
        ascending = true,
        limit = 500,
    })
    if lerr then
        res:set_status(http.STATUS.INTERNAL_ERROR)
        res:write_json({ success = false, error = tostring(lerr) })
        return
    end
    local raw = type(listed) == "table" and (listed :: any).events or {}

    -- The run summary is the projection's read model; the events are the live log
    -- the UI also folds. Both come off the same thread.
    local run = state.summary(thread_id) or { thread_id = thread_id }

    local events = {}
    for _, e in ipairs(raw :: { any }) do
        local etype = trim((e :: any).type)
        if RESEARCH_TYPES[etype] then
            local body: any = {}
            local raw_body = (e :: any).body
            if type(raw_body) == "table" then
                body = raw_body
            elseif type(raw_body) == "string" and raw_body ~= "" then
                local decoded, _ = json.decode(raw_body :: string)
                if type(decoded) == "table" then body = decoded end
            end
            events[#events + 1] = { type = etype, seq = (e :: any).seq, body = body }
        end
    end

    res:set_status(http.STATUS.OK)
    res:write_json({ success = true, run = run, events = events })
end

return { handler = handler }
