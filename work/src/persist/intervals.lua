-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local storage = require("storage")
-- Value intervals (spec 6.7): each period an item held a state, a category or the value of a field declared
-- intervals. The fold opens an interval when a value starts and closes it when the value changes, the item
-- is deleted or the event is a restore; ended_at is NULL while a period is open.
local sql = require("sql")
local values = require("values")
local bulk = require("bulk")
local types = require("types")

local M = {}

M.STATE = "state"
M.CATEGORY = "category"

local function exec(tx: storage.Executor, statement: string, params: types.SqlParams): error?
    local _, err = tx:execute(statement, params)
    if err then return errors.wrap(err, "interval write failed") end
    return nil
end

-- field_key names the interval of a declared field.
function M.field_key(field_id: integer): string
    return tostring(field_id)
end

-- value_key is the text an interval of a field value is filed under.
function M.value_key(value: types.Value): string
    return values.canonical(value)
end

local COLUMNS: { storage.Column } = {}
for _, name in ipairs({ "board_id", "item_id", "field_id", "start_seq", "value_key", "started_at", "actor", "changed", "before_key" }) do
    COLUMNS[#COLUMNS + 1] = { name = name }
end

local function flush_opens(tx: storage.Executor, batch: types.FoldBatch): error?
    local err = bulk.insert(tx, "kickside_work_interval", COLUMNS, batch.intervals or {})
    if not err then batch.intervals = {} end
    return err
end

local function flush_ends(tx: storage.Executor, batch: types.FoldBatch): error?
    local rows = batch.interval_ends or {}
    for first = 1, #rows, 1000 do
        local params: types.SqlParams = {}
        local tuples: { string } = {}
        for i = first, math.min(first + 999, #rows) do
            params[#params + 1] = rows[i][1]
            local id = "$" .. #params
            params[#params + 1] = rows[i][2]
            tuples[#tuples + 1] = "(" .. id .. ", $" .. #params .. ")"
        end
        params[#params + 1] = batch.board_id
        local owner = "$" .. #params
        local err = exec(tx, "WITH closing(item_id, ended_at) AS (VALUES " .. table.concat(tuples, ", ") .. [[)
            UPDATE kickside_work_interval SET ended_at =
                (SELECT c.ended_at FROM closing c WHERE c.item_id = kickside_work_interval.item_id)
            WHERE board_id = ]] .. owner .. [[ AND ended_at IS NULL AND item_id IN (SELECT item_id FROM closing)]], params)
        if err then return err end
    end
    batch.interval_ends = {}
    return nil
end

-- flush makes pending intervals visible before a predicate reads them.
function M.flush(tx: storage.Executor, batch: types.FoldBatch): error?
    local err = flush_opens(tx, batch)
    if not err then err = flush_ends(tx, batch) end
    return err
end

-- open starts an interval for item at seq in the fold's shared batch.
function M.open(tx: storage.Executor, batch: types.FoldBatch, board_id: string, item_id: string, interval: string, seq: integer, value_key: string, at: string, actor: string, change: { before: string }?): error?
    local err = flush_ends(tx, batch)
    if err then return err end
    batch.intervals = batch.intervals or {}
    batch.intervals[#batch.intervals + 1] = { board_id, item_id, interval, seq, value_key, at, actor,
        change and 1 or 0, change and change.before or sql.NULL }
    return nil
end

-- close ends the open interval of an item, when it has one.
function M.close(tx: storage.Executor, batch: types.FoldBatch, board_id: string, item_id: string, interval: string, at: string, change: { seq: integer, actor: string }?): error?
    local err = M.flush(tx, batch)
    if err then return err end
    if change then
        return exec(tx, [[UPDATE kickside_work_interval SET end_seq=$1, ended_by=$2, end_value='null', ended_at=$3
            WHERE board_id=$4 AND item_id=$5 AND field_id=$6 AND ended_at IS NULL]],
            { change.seq, change.actor, at, board_id, item_id, interval })
    end
    return exec(tx, "UPDATE kickside_work_interval SET ended_at = $1 WHERE board_id = $2 AND item_id = $3 AND field_id = $4 AND ended_at IS NULL",
        { at, board_id, item_id, interval })
end

-- shift ends the open interval and starts the next one.
function M.shift(tx: storage.Executor, batch: types.FoldBatch, board_id: string, item_id: string, interval: string, seq: integer, value_key: string, at: string, actor: string, before: string): error?
    local err = M.close(tx, batch, board_id, item_id, interval, at)
    if err then return err end
    return M.open(tx, batch, board_id, item_id, interval, seq, value_key, at, actor, { before = before })
end

-- close_item ends every open interval of the item's lifecycle event.
function M.close_item(tx: storage.Executor, batch: types.FoldBatch, item_id: string, at: string): error?
    local err = flush_opens(tx, batch)
    if err then return err end
    batch.interval_ends = batch.interval_ends or {}
    batch.interval_ends[#batch.interval_ends + 1] = { item_id, at }
    return nil
end

return M
