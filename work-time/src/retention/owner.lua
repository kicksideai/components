-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local sql = require("sql")
local time = require("time")
local storage = require("storage")
local rows = require("rows")
local types = require("types")
local dates = require("dates")
local work_store = require("work_store")
local comparison = require("comparison")

local BATCH = 50
local SCOPE_BATCH = 4
local DAY = 24 * time.HOUR
local DATE = "2006-01-02"

type Result = { success: boolean, deleted: integer, needs_continue: boolean?, deadline_ms: integer?, error: error? }
type Key = { attachment_id: string, entry_id: string }
type Scope = { attachment_id: string, item_id: string? }

local ATTACHMENTS = [[SELECT attachment_id FROM kickside_work_time_attachment
    WHERE retired_at_ms IS NOT NULL AND drained = 0 ORDER BY retired_at_ms, attachment_id]]
local ITEMS = [[SELECT attachment_id, item_id FROM kickside_work_time_item
    WHERE retired_at_ms IS NOT NULL AND drained = 0 ORDER BY retired_at_ms, attachment_id, item_id]]

-- The first write serializes us with mutation, projection and teardown, including on SQLite.
local function locked(db: sql.DB, attachment: string,
    apply: (sql.Transaction, types.Position) -> (integer?, error?)): (integer?, error?)
    return rows.transaction(db, function(tx: sql.Transaction): (integer?, error?)
        local held, err = tx:query([[UPDATE kickside_work_time_attachment SET board_id = board_id
            WHERE attachment_id = $1 RETURNING board_id]], { attachment })
        if err then return nil, err end
        if not held[1] then return 0, nil end
        return apply(tx, { board_id = held[1].board_id, attachment_id = attachment })
    end)
end

local function remove_log(tx: sql.Transaction, position: types.Position, entry: types.Entry, expired: boolean): (integer?, error?)
    local attachment = position.attachment_id
    local total, err = rows.total(tx, attachment, entry.item_id)
    if err or not total then return nil, err end
    total.minutes = total.minutes - entry.minutes
    total.entry_count = total.entry_count - 1
    total.over_estimate = false
    if expired and total.entry_count > 0 then
        local board, board_err = work_store.board(tx, position.board_id)
        if board_err then return nil, board_err end
        local item, item_err = work_store.item(tx, position.board_id, entry.item_id)
        if item_err then return nil, item_err end
        total.over_estimate = board ~= nil and item ~= nil and item.life ~= "purged"
            and comparison.over_estimate(board, item, total.minutes)
    end
    local failure = rows.remove(tx, attachment, entry.id)
        or rows.remove_daily(tx, attachment, entry)
        or rows.replace_total(tx, position, entry.item_id, total)
    if failure then return nil, failure end
    local receipt, receipt_err = tx:execute([[DELETE FROM kickside_work_time_receipt
        WHERE attachment_id = $1 AND entry_id = $2]], { attachment, entry.id })
    if receipt_err then return nil, receipt_err end
    return 1 + receipt.rows_affected, nil
end

local function expire_log(tx: sql.Transaction, position: types.Position, entry_id: string, cutoff: string): (integer?, error?)
    local candidates, err = tx:query([[SELECT entry_id FROM kickside_work_time_worklog
        WHERE attachment_id = $1 AND entry_id = $2 AND work_date < $3]], { position.attachment_id, entry_id, cutoff })
    if err then return nil, err end
    if not candidates[1] then return 0, nil end
    local entry, read_err = rows.entry(tx, position, entry_id)
    if read_err or not entry then return nil, read_err end
    return remove_log(tx, position, entry, true)
end

local function expire_receipt(tx: sql.Transaction, position: types.Position, entry_id: string, today: string): (integer?, error?)
    local deleted, err = tx:execute([[DELETE FROM kickside_work_time_receipt
        WHERE attachment_id = $1 AND entry_id = $2 AND expires_on < $3]], { position.attachment_id, entry_id, today })
    if err then return nil, err end
    return deleted.rows_affected, nil
end

local function expire(db: sql.DB, table_name: string, date_column: string, cutoff: string,
    remove: (sql.Transaction, types.Position, string, string) -> (integer?, error?)): (integer?, error?)
    local eligible, err = db:query("SELECT attachment_id, entry_id FROM " .. table_name .. " WHERE " .. date_column ..
        " < $1 ORDER BY " .. date_column .. ", attachment_id, entry_id LIMIT $2", { cutoff, BATCH })
    if err then return nil, err end
    local grouped: { [string]: { Key } } = {}
    for _, key in ipairs(eligible :: { Key }) do
        local keys = grouped[key.attachment_id] or {}
        keys[#keys + 1], grouped[key.attachment_id] = key, keys
    end
    local deleted = 0
    for attachment, keys in pairs(grouped) do
        local count, write_err = locked(db, attachment, function(tx: sql.Transaction, position: types.Position): (integer?, error?)
            local removed = 0
            for _, key in ipairs(keys) do
                local n, remove_err = remove(tx, position, key.entry_id, cutoff)
                if remove_err or n == nil then return nil, remove_err end
                removed = removed + n
            end
            return removed, nil
        end)
        if write_err or count == nil then return nil, write_err end
        deleted = deleted + count
    end
    return deleted, nil
end

local function drain_scope(tx: sql.Transaction, position: types.Position, item: string?): (integer?, error?)
    local args: { unknown } = item and { position.attachment_id, item, BATCH } or { position.attachment_id, BATCH }
    local where = " WHERE attachment_id = $1" .. (item and " AND item_id = $2" or "")
    local limit = " LIMIT $" .. #args
    local logs, err = tx:query("SELECT entry_id FROM kickside_work_time_worklog" .. where ..
        " ORDER BY work_date, entry_id" .. limit, args)
    if err then return nil, err end
    local deleted = 0
    for _, log in ipairs(logs) do
        local entry, read_err = rows.entry(tx, position, log.entry_id)
        if read_err or not entry then return nil, read_err end
        local n, remove_err = remove_log(tx, position, entry, false)
        if remove_err or n == nil then return nil, remove_err end
        deleted = deleted + n
    end
    if #logs == BATCH then return deleted, nil end

    local receipts, receipt_err = tx:query("SELECT entry_id FROM kickside_work_time_receipt" .. where ..
        " ORDER BY item_id, entry_id" .. limit, args)
    if receipt_err then return nil, receipt_err end
    for _, receipt in ipairs(receipts) do
        local _, remove_err = tx:execute([[DELETE FROM kickside_work_time_receipt
            WHERE attachment_id = $1 AND entry_id = $2]], { position.attachment_id, receipt.entry_id })
        if remove_err then return nil, remove_err end
    end
    deleted = deleted + #receipts
    if #receipts == BATCH then return deleted, nil end

    if not item then
        local keys, key_err = tx:query([[SELECT item_id FROM kickside_work_time_item
            WHERE attachment_id = $1 ORDER BY item_id LIMIT $2]], args)
        if key_err then return nil, key_err end
        for _, key in ipairs(keys) do
            local _, remove_err = tx:execute([[DELETE FROM kickside_work_time_item
                WHERE attachment_id = $1 AND item_id = $2]], { position.attachment_id, key.item_id })
            if remove_err then return nil, remove_err end
        end
        deleted = deleted + #keys
        if #keys == BATCH then return deleted, nil end
    end
    local fence = item and "item" or "attachment"
    local bind = { position.attachment_id }
    if item then bind[2] = item end
    local _, finish_err = tx:execute("UPDATE kickside_work_time_" .. fence ..
        " SET drained = 1 WHERE attachment_id = $1" .. (item and " AND item_id = $2" or ""), bind)
    if finish_err then return nil, finish_err end
    return deleted, nil
end

local function retire(db: sql.DB, selection: string): (integer?, error?)
    local scopes, err = db:query(selection .. " LIMIT $1", { SCOPE_BATCH })
    if err then return nil, err end
    local deleted = 0
    for _, scope in ipairs(scopes :: { Scope }) do
        local count, failure = locked(db, scope.attachment_id, function(tx: sql.Transaction, position: types.Position): (integer?, error?)
            return drain_scope(tx, position, scope.item_id)
        end)
        if failure or count == nil then return nil, failure end
        deleted = deleted + count
    end
    return deleted, nil
end

local function deadline(db: sql.DB, table_name: string, date_column: string, days: integer): (integer?, error?)
    local dated, err = db:query("SELECT " .. date_column .. " AS day FROM " .. table_name ..
        " WHERE " .. date_column .. " IS NOT NULL ORDER BY " .. date_column .. " LIMIT 1")
    if err or not dated[1] then return nil, err end
    local day, parse_err = time.parse(DATE, dated[1].day)
    if parse_err or not day then return nil, parse_err end
    return day:add(days * DAY):unix_nano() // 1000000, nil
end

local LOG = "kickside_work_time_worklog"
local RECEIPT = "kickside_work_time_receipt"

local function pass(db: sql.DB, now: time.Time): Result
    local today, cutoff = dates.dates(now)
    local retired, err = retire(db, ATTACHMENTS)
    if err or retired == nil then return { success = false, deleted = 0, error = err } end
    local items, item_err = retire(db, ITEMS)
    if item_err or items == nil then return { success = false, deleted = retired, error = item_err } end
    local expired, log_err = expire(db, LOG, "work_date", cutoff, expire_log)
    local deleted = retired + items
    if log_err or expired == nil then return { success = false, deleted = deleted, error = log_err } end
    local receipts, receipt_err = expire(db, RECEIPT, "expires_on", today, expire_receipt)
    deleted = deleted + expired
    if receipt_err or receipts == nil then return { success = false, deleted = deleted, error = receipt_err } end
    deleted = deleted + receipts

    local left, left_err = db:query("SELECT EXISTS(" .. ATTACHMENTS .. " LIMIT 1) OR EXISTS(" ..
        ITEMS .. " LIMIT 1) AS due")
    if left_err then return { success = false, deleted = deleted, error = left_err } end
    if left[1].due == true or tonumber(left[1].due) == 1 then return { success = true, deleted = deleted, needs_continue = true } end

    local log_deadline, deadline_err = deadline(db, LOG, "work_date", 365)
    if deadline_err then return { success = false, deleted = deleted, error = deadline_err } end
    local receipt_deadline, next_err = deadline(db, RECEIPT, "expires_on", 1)
    if next_err then return { success = false, deleted = deleted, error = next_err } end
    local next_ms = log_deadline and receipt_deadline and math.min(log_deadline, receipt_deadline)
        or log_deadline or receipt_deadline
    local due = next_ms ~= nil and next_ms <= now:unix_nano() // 1000000
    return { success = true, deleted = deleted, needs_continue = due, deadline_ms = not due and next_ms or nil }
end

local function run(_input: unknown): Result
    local db, err = storage.open()
    if err or not db then return { success = false, deleted = 0, error = err } end
    local result = pass(db, time.now())
    local _, release_err = db:release()
    if release_err and result.success then return { success = false, deleted = result.deleted, error = release_err } end
    return result
end

return { run = run }
