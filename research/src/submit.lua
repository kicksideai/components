-- POST /research { prompt | topic, agent_id, ctx? } — the HTTP entry to the
-- canonical research request contract. It does no orchestration itself: it parses
-- the request and calls kickside.research:request under the caller's identity,
-- which ensures the thread + request event and starts the agent dataflow. Returns
-- the research + thread ids; progress and the result arrive on the thread (live).
-- agent_id is required: a research with no agent is a 400, not a default.

local http = require("http")
local json = require("json")
local security = require("security")
local contract = require("contract")

local function handler()
    local req = http.request()
    local res = http.response()
    if not req or not res then return nil, "no http context" end
    res:set_content_type(http.CONTENT.JSON)

    if not security.actor() then
        res:set_status(http.STATUS.UNAUTHORIZED)
        res:write_json({ success = false, error = "authentication required" })
        return
    end

    local body, perr = json.decode(req:body() or "")
    if perr or type(body) ~= "table" then
        res:set_status(http.STATUS.BAD_REQUEST)
        res:write_json({ success = false, error = "invalid json" })
        return
    end
    local b = body :: { prompt: any, topic: any, agent_id: any, ctx: any, max_iterations: any, research_id: any }
    local prompt = type(b.prompt) == "string" and b.prompt or (type(b.topic) == "string" and b.topic or "")
    local agent_id = type(b.agent_id) == "string" and b.agent_id or ""
    if prompt == "" then
        res:set_status(http.STATUS.BAD_REQUEST)
        res:write_json({ success = false, error = "prompt is required" })
        return
    end
    if agent_id == "" then
        res:set_status(http.STATUS.BAD_REQUEST)
        res:write_json({ success = false, error = "agent_id is required" })
        return
    end

    local def, get_err = contract.get("kickside.research:request")
    if get_err or not def then
        res:set_status(http.STATUS.INTERNAL_ERROR)
        res:write_json({ success = false, error = "research request contract unavailable" })
        return
    end
    local inst, open_err = (def :: any):with_actor(security.actor()):with_scope(security.scope()):open()
    if open_err or not inst then
        res:set_status(http.STATUS.INTERNAL_ERROR)
        res:write_json({ success = false, error = "research request open failed" })
        return
    end

    local result, rerr = inst:request({
        prompt = prompt,
        agent_id = agent_id,
        max_iterations = tonumber(b.max_iterations),
        ctx = type(b.ctx) == "table" and b.ctx or {},
        research_id = type(b.research_id) == "string" and b.research_id or nil,
    })
    if rerr or type(result) ~= "table" or not (result :: { ok: any }).ok then
        res:set_status(http.STATUS.BAD_REQUEST)
        res:write_json({ success = false, error = tostring(rerr or "research request failed") })
        return
    end

    res:set_status(http.STATUS.OK)
    res:write_json({
        success = true,
        research_id = (result :: { research_id: any }).research_id,
        thread_id = (result :: { thread_id: any }).thread_id,
        status = (result :: { status: any }).status,
    })
end

return { handler = handler }
