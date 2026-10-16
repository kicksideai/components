-- Read-model persistence for kickside_research_run. The run projection writes here
-- (apply, one event at a time); the API reads here (list_by_actor / get). The thread
-- is the source of truth -- this table is the materialized projection of its events,
-- kept in sync by projection.lua and torn down with the component by delete_by_thread.
local sql = require("sql")
local json = require("json")
local time = require("time")
local consts = require("research_consts")

local M = {}

local function now(): string
    return time.now():format(time.RFC3339)
end

local COLUMNS = {
    "research_id", "thread_id", "actor_id", "title", "prompt", "agent_id",
    "status", "latest_step", "result_md", "urls", "created_at", "updated_at",
}

local function open(): (any?, error?)
    local db_id, id_err = consts.db_id()
    if not db_id then return nil, id_err end
    local db, err = sql.get(db_id)
    if err then return nil, errors.wrap(err, "research db unavailable") end
    if not db then return nil, errors.new({ kind = errors.UNAVAILABLE, message = "research db unavailable" }) end
    return db, nil
end

local function invalid(message: string): error
    return errors.new({ kind = errors.INVALID, message = message })
end

local function trim(value: any): string
    if type(value) ~= "string" then return "" end
    return (value:gsub("^%s*(.-)%s*$", "%1"))
end

-- An event body arrives as a table or as its JSON-encoded string; normalize to a table.
local function as_table(value: any): any
    if type(value) == "table" then return value end
    if type(value) == "string" and value ~= "" then
        local decoded, _ = json.decode(value :: string)
        if type(decoded) == "table" then return decoded end
    end
    return {}
end

local function string_list(value: any): { string }
    local out: { string } = {}
    if type(value) ~= "table" then return out end
    for _, v in ipairs(value :: { any }) do
        if type(v) == "string" and v ~= "" then out[#out + 1] = v end
    end
    return out
end

-- A raw row -> the run shape the API/UI speak. urls is decoded from its JSON column.
local function row_to_run(row: any): any
    local urls: { string } = {}
    local decoded, derr = json.decode(trim((row :: any).urls))
    if not derr and type(decoded) == "table" then urls = string_list(decoded) end
    local title = trim((row :: any).title)
    if title == "" then title = trim((row :: any).prompt) end
    return {
        research_id = trim((row :: any).research_id),
        thread_id = trim((row :: any).thread_id),
        actor_id = trim((row :: any).actor_id),
        title = title,
        prompt = trim((row :: any).prompt),
        agent_id = trim((row :: any).agent_id),
        status = trim((row :: any).status) ~= "" and trim((row :: any).status) or consts.STATUS.RUNNING,
        latest_step = trim((row :: any).latest_step),
        result_md = type((row :: any).result_md) == "string" and (row :: any).result_md or "",
        urls = urls,
        created_at = (row :: any).created_at,
        updated_at = (row :: any).updated_at,
    }
end

-- get_run returns one run by research_id, or (nil, nil) when absent.
function M.get_run(research_id: string): (any?, error?)
    research_id = trim(research_id)
    if research_id == "" then return nil, invalid("research_id is required") end
    local db, derr = open()
    if not db then return nil, derr end
    local rows, qerr = sql.builder.select(table.unpack(COLUMNS))
        :from("kickside_research_run")
        :where(sql.builder.eq({ research_id = research_id }))
        :limit(1)
        :run_with(db):query()
    db:release()
    if qerr then return nil, errors.wrap(qerr, "read research run") end
    if not rows or #rows == 0 then return nil, nil end
    return row_to_run(rows[1]), nil
end

-- get_by_thread returns one run by thread_id, or (nil, nil) when absent.
function M.get_by_thread(thread_id: string): (any?, error?)
    thread_id = trim(thread_id)
    if thread_id == "" then return nil, invalid("thread_id is required") end
    local db, derr = open()
    if not db then return nil, derr end
    local rows, qerr = sql.builder.select(table.unpack(COLUMNS))
        :from("kickside_research_run")
        :where(sql.builder.eq({ thread_id = thread_id }))
        :limit(1)
        :run_with(db):query()
    db:release()
    if qerr then return nil, errors.wrap(qerr, "read research run") end
    if not rows or #rows == 0 then return nil, nil end
    return row_to_run(rows[1]), nil
end

-- resolve_thread_id maps a research id to its thread id (nil when the run is absent).
function M.resolve_thread_id(research_id: string): (string?, error?)
    local run, err = M.get_run(research_id)
    if err then return nil, err end
    if not run then return nil, nil end
    return trim((run :: any).thread_id), nil
end

-- list_by_actor returns the actor's runs, newest first, with offset/limit paging.
function M.list_by_actor(actor_id: string, limit: number, offset: number): ({ any }, error?)
    actor_id = trim(actor_id)
    if actor_id == "" then return {}, nil end
    local lim = math.max(1, math.min(math.floor(tonumber(limit) or 50), 200))
    local off = math.max(0, math.floor(tonumber(offset) or 0))
    local db, derr = open()
    if not db then return {}, derr end
    local rows, qerr = sql.builder.select(table.unpack(COLUMNS))
        :from("kickside_research_run")
        :where(sql.builder.eq({ actor_id = actor_id }))
        :order_by("updated_at DESC")
        :order_by("research_id DESC")
        :limit(lim):offset(off)
        :run_with(db):query()
    db:release()
    if qerr then return {}, errors.wrap(qerr, "list research runs") end
    local runs: { any } = {}
    for _, row in ipairs(rows or {}) do runs[#runs + 1] = row_to_run(row) end
    return runs, nil
end

-- apply folds one thread event into the read-model row for thread_id. It is the
-- single writer: REQUEST upserts the genesis row (title/prompt/actor), the rest patch
-- status / latest_step / result_md / urls. Idempotent on research_id so a re-dispatch
-- of the same event leaves the row unchanged.
function M.apply(thread_id: string, event: any): error?
    thread_id = trim(thread_id)
    if thread_id == "" then return invalid("thread_id is required") end
    local etype = trim((event :: any).type)
    local body: any = as_table((event :: any).body)
    local stamp = trim((event :: any).created_at)
    if stamp == "" then stamp = now() end

    local db, derr = open()
    if not db then return derr end

    local err: error? = nil
    if etype == consts.EVENT.REQUEST then
        local research_id = trim(body.research_id)
        if research_id == "" then db:release(); return invalid("request event missing research_id") end
        local prompt = type(body.prompt) == "string" and body.prompt or ""
        local title = prompt
        -- Genesis upsert: insert the run, or refresh its descriptive fields if a prior
        -- event already created the row. status only moves to a terminal on result/failed,
        -- so the conflict path never downgrades it back to running.
        local _, xerr = db:execute(
            "INSERT INTO kickside_research_run" ..
            " (research_id, thread_id, actor_id, title, prompt, agent_id, status, created_at, updated_at)" ..
            " VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)" ..
            " ON CONFLICT (research_id) DO UPDATE SET" ..
            " thread_id = excluded.thread_id, actor_id = excluded.actor_id," ..
            " title = excluded.title, prompt = excluded.prompt, agent_id = excluded.agent_id," ..
            " updated_at = excluded.updated_at",
            { research_id, thread_id, trim(body.actor_id), title, prompt, trim(body.agent_id),
              consts.STATUS.RUNNING, stamp, stamp })
        if xerr then err = errors.wrap(xerr, "write research run") end
    else
        -- Non-genesis events patch the row located by thread_id. status only advances to
        -- a terminal on result/failed; progress keeps it running.
        local set: { [string]: any } = { updated_at = stamp }
        if etype == consts.EVENT.PROGRESS then
            local step = trim(body.step)
            if step ~= "" then set.latest_step = step end
            local urls = string_list(body.urls)
            if #urls > 0 then set.urls = json.encode(urls) end
            set.status = consts.STATUS.RUNNING
        elseif etype == consts.EVENT.RESULT then
            set.status = consts.STATUS.COMPLETE
            set.latest_step = "complete"
            if type(body.markdown) == "string" then set.result_md = body.markdown end
            local urls = string_list(body.urls)
            if #urls > 0 then set.urls = json.encode(urls) end
        elseif etype == consts.EVENT.FAILED then
            set.status = consts.STATUS.FAILED
            local e = trim(body.error)
            if e ~= "" then set.latest_step = e end
        end
        local update = sql.builder.update("kickside_research_run")
            :set_map(set)
            :where(sql.builder.eq({ thread_id = thread_id }))
        if etype == consts.EVENT.PROGRESS then
            update = update:where(sql.builder.eq({ status = consts.STATUS.RUNNING }))
        end
        local _, uerr = update:run_with(db):exec()
        if uerr then err = errors.wrap(uerr, "update research run") end
    end
    db:release()
    return err
end

-- delete_by_thread tears down a run's row(s) for a thread. The deletable contract
-- calls this when the research component is deleted, so no row outlives its component.
function M.delete_by_thread(thread_id: string): (number, error?)
    thread_id = trim(thread_id)
    if thread_id == "" then return 0, invalid("thread_id is required") end
    local db, derr = open()
    if not db then return 0, derr end
    local res, eerr = sql.builder.delete("kickside_research_run")
        :where(sql.builder.eq({ thread_id = thread_id }))
        :run_with(db):exec()
    db:release()
    if eerr then return 0, errors.wrap(eerr, "delete research run") end
    local affected = type(res) == "table" and tonumber((res :: any).rows_affected) or 0
    return affected or 0, nil
end

return M
