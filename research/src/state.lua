local security = require("security")
local repo = require("research_repo")
local component = require("component")
local consts = require("research_consts")

-- Read model for research. A run IS its thread (class = THREAD_CLASS, one per run,
-- actor-scoped); request / progress / result / failed events are the source of
-- truth. The run projection (projection.lua) folds those events into research's own
-- kickside_research_run table -- the materialized read model. This module reads that
-- table: summary reads one run, list enumerates runs the caller can READ.
-- There is no fold here -- the projection worker owns it; the UI loads a run then
-- folds the same live thread events for freshness.
local M = {}

local function trim(value: any): string
    if type(value) ~= "string" then return "" end
    return (value:gsub("^%s*(.-)%s*$", "%1"))
end

-- The acting actor id the run is keyed to.
local function current_actor_id(): (string?, error?)
    local actor = security.actor()
    if not actor or trim(actor:id()) == "" then
        return nil, errors.new({ kind = errors.PERMISSION_DENIED, message = "an authenticated actor is required" })
    end
    return trim(actor:id()), nil
end

local function readable(thread_id: string): (boolean, error?)
    local rows, err = component.query({ component_ids = { thread_id }, access_mask = component.ACCESS.READ, limit = 1 })
    if err then return false, err end
    return rows ~= nil and #rows == 1, nil
end

-- summary(thread_id) -> (run|nil, err). One run's read model by its thread.
function M.summary(thread_id: string): (any?, error?)
    thread_id = trim(thread_id)
    if thread_id == "" then return nil, errors.new({ kind = errors.INVALID, message = "thread_id is required" }) end
    local allowed, access_err = readable(thread_id)
    if access_err then return nil, access_err end
    if not allowed then return nil, nil end
    local run, err = repo.get_by_thread(thread_id)
    if err then return nil, err end
    if not run then return { thread_id = thread_id }, nil end
    return run, nil
end

-- resolve_thread_id(research_id) -> (thread_id|nil, err). Returns nil without READ.
function M.resolve_thread_id(research_id: string): (string?, error?)
    research_id = trim(research_id)
    if research_id == "" then return nil, errors.new({ kind = errors.INVALID, message = "research_id is required" }) end
    local actor_id, oerr = current_actor_id()
    if not actor_id then return nil, oerr end
    local run, gerr = repo.get_run(research_id)
    if gerr then return nil, gerr end
    if not run then return nil, nil end
    local allowed, access_err = readable(trim((run :: any).thread_id))
    if access_err then return nil, access_err end
    if not allowed then return nil, nil end
    return trim((run :: any).thread_id), nil
end

-- list(limit, offset) -> (rows, err). The caller's runs, newest first.
function M.list(limit: number, offset: number): ({ any }, error?, number?)
    local actor_id, oerr = current_actor_id()
    if not actor_id then return {}, oerr end
    local runs: { any } = {}
    local page_offset = 0
    while true do
        local rows, query_err = component.query({ impl_ids = { consts.KIND_IMPL },
            access_mask = component.ACCESS.READ, limit = 200, offset = page_offset })
        if query_err then return {}, query_err end
        for _, row in ipairs(rows or {}) do
            local run, read_err = repo.get_by_thread(row.component_id)
            if read_err then return {}, read_err end
            if run then runs[#runs + 1] = run end
        end
        if not rows or #rows < 200 then break end
        page_offset = page_offset + #rows
    end
    table.sort(runs, function(a: any, b: any): boolean
        if a.updated_at == b.updated_at then return a.research_id > b.research_id end
        return tostring(a.updated_at) > tostring(b.updated_at)
    end)
    local lim = math.max(1, math.min(math.floor(tonumber(limit) or 50), 200))
    local off = math.max(0, math.floor(tonumber(offset) or 0))
    local page: { any } = {}
    for i = off + 1, math.min(off + lim, #runs) do
        local run = runs[i]
        page[#page + 1] = {research_id = run.research_id, thread_id = run.thread_id, actor_id = run.actor_id,
            title = run.title, agent_id = run.agent_id, status = run.status, created_at = run.created_at, updated_at = run.updated_at}
    end
    return page, nil, off + #page < #runs and off + #page or nil
end

-- get(research_id) -> (run|nil, err). One run's read model, or nil when the caller
-- cannot READ it.
function M.get(research_id: string): (any?, error?)
    research_id = trim(research_id)
    if research_id == "" then return nil, errors.new({ kind = errors.INVALID, message = "research_id is required" }) end
    local actor_id, oerr = current_actor_id()
    if not actor_id then return nil, oerr end
    local run, gerr = repo.get_run(research_id)
    if gerr then return nil, gerr end
    if not run then return nil, nil end
    local allowed, access_err = readable(trim((run :: any).thread_id))
    if access_err then return nil, access_err end
    if not allowed then return nil, nil end
    return run, nil
end

return M
