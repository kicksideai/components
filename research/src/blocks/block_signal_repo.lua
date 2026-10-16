-- SQL correlation store for kickside_research_block_signal. arm inserts one
-- waiting row per armed Block Signal (keyed by deterministic research_id);
-- resume_from_event reads it to recover dataflow_id/signal_id and
-- idempotently marks it resumed/failed. Same target_db as kickside_research_run
-- (research's db_config, rewritten by the root target_db requirement).
local sql = require("sql")
local time = require("time")
local consts = require("research_consts")

local M = {}

local function now(): string
    return time.now():format(time.RFC3339)
end

local COLUMNS = {
    "research_id", "thread_id", "dataflow_id", "signal_id", "status",
    "terminal_event_id", "created_at", "updated_at",
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

local function row_to_correlation(row: any): any
    return {
        research_id = trim((row :: any).research_id),
        thread_id = trim((row :: any).thread_id),
        dataflow_id = trim((row :: any).dataflow_id),
        signal_id = trim((row :: any).signal_id),
        status = trim((row :: any).status),
        terminal_event_id = trim((row :: any).terminal_event_id),
        created_at = (row :: any).created_at,
        updated_at = (row :: any).updated_at,
    }
end

-- get_by_research_id returns the correlation row, or (nil, nil) when absent.
function M.get_by_research_id(research_id: string): (any?, error?)
    research_id = trim(research_id)
    if research_id == "" then return nil, invalid("research_id is required") end
    local db, derr = open()
    if not db then return nil, derr end
    local rows, qerr = sql.builder.select(table.unpack(COLUMNS))
        :from("kickside_research_block_signal")
        :where(sql.builder.eq({ research_id = research_id }))
        :limit(1)
        :run_with(db):query()
    db:release()
    if qerr then return nil, errors.wrap(qerr, "read Block Signal correlation") end
    if not rows or #rows == 0 then return nil, nil end
    return row_to_correlation(rows[1]), nil
end

-- insert creates the waiting row for a newly armed Block Signal. Idempotent on research_id
-- (ON CONFLICT DO NOTHING) so a racing re-arm of the same Signal never duplicates
-- or clobbers the row the winner already wrote.
function M.insert(row: any): error?
    local r = type(row) == "table" and row or {}
    local research_id = trim((r :: any).research_id)
    if research_id == "" then return invalid("research_id is required") end
    local thread_id = trim((r :: any).thread_id)
    if thread_id == "" then return invalid("thread_id is required") end
    local db, derr = open()
    if not db then return derr end
    local stamp = now()
    local status = trim((r :: any).status) ~= "" and trim((r :: any).status) or consts.BLOCK_SIGNAL_STATUS.WAITING
    local _, xerr = db:execute(
        "INSERT INTO kickside_research_block_signal" ..
        " (research_id, thread_id, dataflow_id, signal_id, status, terminal_event_id, created_at, updated_at)" ..
        " VALUES ($1, $2, $3, $4, $5, $6, $7, $8)" ..
        " ON CONFLICT (research_id) DO NOTHING",
        { research_id, thread_id, trim((r :: any).dataflow_id), trim((r :: any).signal_id),
          status, "", stamp, stamp })
    db:release()
    if xerr then return errors.wrap(xerr, "write Block Signal correlation") end
    return nil
end

-- mark_resumed transitions a waiting row to a terminal status. Returns updated = true
-- only when THIS call performed the transition (guarded on status = waiting), so a
-- duplicate terminal event or a losing race with a concurrent dispatch is a no-op.
function M.mark_resumed(research_id: string, status: string, terminal_event_id: string): (boolean, error?)
    research_id = trim(research_id)
    if research_id == "" then return false, invalid("research_id is required") end
    local db, derr = open()
    if not db then return false, derr end
    local res, uerr = sql.builder.update("kickside_research_block_signal")
        :set_map({ status = status, terminal_event_id = trim(terminal_event_id), updated_at = now() })
        :where(sql.builder.eq({ research_id = research_id, status = consts.BLOCK_SIGNAL_STATUS.WAITING }))
        :run_with(db):exec()
    db:release()
    if uerr then return false, errors.wrap(uerr, "update Block Signal correlation") end
    local affected = type(res) == "table" and tonumber((res :: any).rows_affected) or 0
    return (affected or 0) > 0, nil
end

return M
