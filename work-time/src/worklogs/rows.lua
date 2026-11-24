-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local sql = require("sql")
local types = require("types")
local access = require("access")

local M = {}
type Total = { minutes: integer, entry_count: integer, over_estimate: boolean }
M.Total = Total

function M.transaction<T>(db: sql.DB, run: (sql.Transaction) -> (T?, error?)): (T?, error?)
    local tx, err = db:begin()
    if err or not tx then return nil, err end
    local value, failure = run(tx)
    if failure or value == nil then
        local _, cleanup_err = tx:rollback()
        return nil, failure or cleanup_err
    end
    local _, commit_err = tx:commit()
    if commit_err then return nil, commit_err end
    return value, nil
end

-- Take the attachment fence as the first statement in a writer transaction.
-- Teardown and item retirement use the same attachment then item lock order.
function M.lock_attachment(tx: sql.Transaction, position: types.Position): error?
    local row, err = tx:execute([[INSERT INTO kickside_work_time_attachment (attachment_id, board_id) VALUES ($1,$2)
        ON CONFLICT (attachment_id) DO UPDATE SET board_id = excluded.board_id
        WHERE kickside_work_time_attachment.board_id = excluded.board_id AND kickside_work_time_attachment.retired_at_ms IS NULL]],
        { position.attachment_id, position.board_id })
    if err then return err end
    if row.rows_affected == 0 then return access.missing() end
    return nil
end

function M.lock_item(tx: sql.Transaction, attachment: string, item: string): error?
    local row, err = tx:execute([[INSERT INTO kickside_work_time_item (attachment_id, item_id) VALUES ($1,$2)
        ON CONFLICT (attachment_id, item_id) DO UPDATE SET item_id = excluded.item_id
        WHERE kickside_work_time_item.retired_at_ms IS NULL]], { attachment, item })
    if err then return err end
    if row.rows_affected == 0 then return access.missing() end
    return nil
end

function M.entry(tx: sql.Transaction, position: types.Position, id: string): (types.Entry?, error?)
    local rows, err = tx:query([[SELECT entry_id, item_id, person_id, version, minutes, work_date, sprint_id, note
        FROM kickside_work_time_worklog WHERE attachment_id = $1 AND entry_id = $2 AND board_id = $3]],
        { position.attachment_id, id, position.board_id })
    if err then return nil, err end
    local row = rows[1]
    if not row then return nil, access.missing() end
    return { id = row.entry_id, item_id = row.item_id, person_id = row.person_id,
        version = tonumber(row.version) :: integer, minutes = tonumber(row.minutes) :: integer,
        work_date = row.work_date, sprint_id = row.sprint_id, note = row.note }, nil
end

function M.receipt(tx: sql.Transaction, attachment: string, person: string, key: string, today: string): (types.Receipt?, error?)
    local rows, err = tx:query([[SELECT entry_id, item_id, creation_version, request_hash FROM kickside_work_time_receipt
        WHERE attachment_id = $1 AND person_id = $2 AND request_key = $3 AND (expires_on IS NULL OR expires_on >= $4)]],
        { attachment, person, key, today })
    if err or not rows[1] then return nil, err end
    local row = rows[1]
    return { id = row.entry_id, hash = row.request_hash, item_id = row.item_id, version = tonumber(row.creation_version) :: integer }, nil
end

function M.insert(tx: sql.Transaction, position: types.Position, entry: types.Entry, key: string, digest: string, today: string): error?
    local _, err = tx:execute([[INSERT INTO kickside_work_time_worklog
        (attachment_id, board_id, item_id, person_id, entry_id, version, minutes, work_date, sprint_id, note)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)]],
        { position.attachment_id, position.board_id, entry.item_id, entry.person_id, entry.id, entry.version, entry.minutes,
            entry.work_date, entry.sprint_id or sql.NULL, entry.note or sql.NULL })
    if err then return err end
    -- An expired explicit-delete receipt can still await the retention sweep.
    local _, receipt_err = tx:execute([[INSERT INTO kickside_work_time_receipt
        (attachment_id, person_id, request_key, request_hash, item_id, entry_id, creation_version, created_on)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
        ON CONFLICT (attachment_id, person_id, request_key) DO UPDATE SET request_hash = excluded.request_hash,
        item_id = excluded.item_id, entry_id = excluded.entry_id, creation_version = excluded.creation_version,
        created_on = excluded.created_on, expires_on = NULL]],
        { position.attachment_id, entry.person_id, key, digest, entry.item_id, entry.id, entry.version, today })
    return receipt_err
end

function M.update(tx: sql.Transaction, attachment: string, entry: types.Entry): error?
    local _, err = tx:execute([[UPDATE kickside_work_time_worklog SET version = $1, minutes = $2, work_date = $3, sprint_id = $4, note = $5
        WHERE attachment_id = $6 AND entry_id = $7]],
        { entry.version, entry.minutes, entry.work_date, entry.sprint_id or sql.NULL, entry.note or sql.NULL, attachment, entry.id })
    return err
end

function M.remove(tx: sql.Transaction, attachment: string, id: string): error?
    local _, err = tx:execute("DELETE FROM kickside_work_time_worklog WHERE attachment_id = $1 AND entry_id = $2", { attachment, id })
    return err
end

function M.receipt_created(tx: sql.Transaction, attachment: string, id: string): (string?, error?)
    local result, err = tx:query([[SELECT created_on FROM kickside_work_time_receipt
        WHERE attachment_id = $1 AND entry_id = $2]], { attachment, id })
    if err then return nil, err end
    if not result[1] then
        return nil, access.problem(errors.INTERNAL, "worklog_receipt_missing", "Worklog creation receipt is missing")
    end
    return result[1].created_on, nil
end

function M.expire_receipt(tx: sql.Transaction, attachment: string, id: string, deadline: string, today: string): error?
    if deadline < today then
        local _, err = tx:execute("DELETE FROM kickside_work_time_receipt WHERE attachment_id = $1 AND entry_id = $2", { attachment, id })
        return err
    end
    local _, err = tx:execute("UPDATE kickside_work_time_receipt SET expires_on = $1 WHERE attachment_id = $2 AND entry_id = $3",
        { deadline, attachment, id })
    return err
end

function M.total(tx: sql.Transaction, attachment: string, item: string): (Total?, error?)
    local rows, err = tx:query([[SELECT minutes, entry_count, over_estimate FROM kickside_work_time_total
        WHERE attachment_id = $1 AND item_id = $2]], { attachment, item })
    if err then return nil, err end
    local row = rows[1]
    if not row then return { minutes = 0, entry_count = 0, over_estimate = false }, nil end
    return { minutes = tonumber(row.minutes) :: integer, entry_count = tonumber(row.entry_count) :: integer,
        over_estimate = tonumber(row.over_estimate) == 1 }, nil
end

function M.replace_total(tx: sql.Transaction, position: types.Position, item: string, total: Total): error?
    if total.entry_count == 0 then
        local _, err = tx:execute("DELETE FROM kickside_work_time_total WHERE attachment_id = $1 AND item_id = $2", { position.attachment_id, item })
        return err
    end
    local _, err = tx:execute([[INSERT INTO kickside_work_time_total (attachment_id, board_id, item_id, minutes, entry_count, over_estimate)
        VALUES ($1,$2,$3,$4,$5,$6) ON CONFLICT (attachment_id, item_id) DO UPDATE
        SET minutes = excluded.minutes, entry_count = excluded.entry_count, over_estimate = excluded.over_estimate]],
        { position.attachment_id, position.board_id, item, total.minutes, total.entry_count, total.over_estimate and 1 or 0 })
    return err
end

function M.add_daily(tx: sql.Transaction, attachment: string, entry: types.Entry): error?
    local _, err = tx:execute([[INSERT INTO kickside_work_time_daily (attachment_id, item_id, work_date, person_id, sprint_id, minutes, entry_count)
        VALUES ($1,$2,$3,$4,$5,$6,1) ON CONFLICT (attachment_id, item_id, work_date, person_id, sprint_id) DO UPDATE
        SET minutes = kickside_work_time_daily.minutes + excluded.minutes, entry_count = kickside_work_time_daily.entry_count + 1]],
        { attachment, entry.item_id, entry.work_date, entry.person_id, entry.sprint_id or "", entry.minutes })
    return err
end

function M.remove_daily(tx: sql.Transaction, attachment: string, entry: types.Entry): error?
    local key = { attachment, entry.item_id, entry.work_date, entry.person_id, entry.sprint_id or "" }
    local where = " WHERE attachment_id = $1 AND item_id = $2 AND work_date = $3 AND person_id = $4 AND sprint_id = $5"
    local deleted, err = tx:execute("DELETE FROM kickside_work_time_daily" .. where .. " AND entry_count = 1", key)
    if err or deleted.rows_affected == 1 then return err end
    local updated, update_err = tx:execute([[UPDATE kickside_work_time_daily SET minutes = minutes - $1, entry_count = entry_count - 1
        WHERE attachment_id = $2 AND item_id = $3 AND work_date = $4 AND person_id = $5 AND sprint_id = $6]],
        { entry.minutes, attachment, entry.item_id, entry.work_date, entry.person_id, entry.sprint_id or "" })
    if update_err then return update_err end
    if updated.rows_affected ~= 1 then
        return access.problem(errors.INTERNAL, "worklog_daily_missing", "Worklog daily subtotal is missing")
    end
    return nil
end

return M
