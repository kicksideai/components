-- GET /research/list — the caller's research runs, newest first, folded on read
-- from their research threads (state.list; access-filtered by the threads
-- contract). The page loads this once for the "past researches" list; live
-- progress + results arrive over the actor's thread realtime stream, not by
-- polling this endpoint.

local http = require("http")
local security = require("security")
local state = require("research_state")

local function trim(value: any): string
    if type(value) ~= "string" then return "" end
    return (value:gsub("^%s*(.-)%s*$", "%1"))
end

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

    local limit = math.max(1, math.min(math.floor(tonumber(req:query("limit")) or 50), 200))
    local offset = math.max(0, math.floor(tonumber(req:query("offset")) or 0))
    local rows, err, next_offset = state.list(limit, offset)
    if err then
        res:set_status(http.STATUS.INTERNAL_ERROR)
        res:write_json({ success = false, error = tostring(err) })
        return
    end

    res:set_status(http.STATUS.OK)
    res:write_json({ success = true, items = rows, count = #rows, limit = limit, offset = offset, next_offset = next_offset })
end

return { handler = handler }
