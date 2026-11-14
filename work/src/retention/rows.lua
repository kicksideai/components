-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local types = require("types")
-- Retention positions and bounded collection of board-owned rows.
local sql = require("sql")
local time = require("time")
local store = require("store")
local lifecycle = require("lifecycle")
local clock = require("clock")
local policy = require("policy")
local domain = require("domain")
local tables = require("tables")
local operation_expiry = require("operation_expiry")
local M = {}


function M.position(db: sql.DB): (types.Position?, error?)
    local rows, err = db:query("SELECT board_after, inclusive, item_after, deadline_ms FROM kickside_work_retention WHERE owner_id = 'work'", {})
    if err then return nil, err end
    if not rows or not rows[1] then return nil, errors.new({ kind = errors.INTERNAL, message = "retention position is missing", details = { code = "row_corrupt" } }) end
    local board_after, berr = store.need(rows[1], "board_after")
    if berr or not board_after then return nil, berr end
    local inclusive, ierr = store.need_int(rows[1], "inclusive")
    if ierr or not inclusive then return nil, ierr end
    local item_after, aerr = store.need(rows[1], "item_after")
    if aerr or not item_after then return nil, aerr end
    return { board_after = board_after, inclusive = inclusive, item_after = item_after, deadline_ms = store.int(rows[1].deadline_ms) }, nil
end

function M.advance(position: types.Position): error?
    local _, err = lifecycle.transaction(function(tx: sql.Transaction, _dialect: string): (boolean?, error?)
        local _, err = tx:execute("UPDATE kickside_work_retention SET board_after = $1, inclusive = $2, item_after = $3, deadline_ms = $4 WHERE owner_id = 'work'",
            { position.board_after, position.inclusive, position.item_after, position.deadline_ms or sql.NULL })
        return true, err
    end)
    return err
end

function M.boards(db: sql.DB, position: types.Position, limit: integer): ({ domain.Row }?, error?)
    return db:query([[SELECT b.board_id FROM kickside_work_board b
        WHERE (b.board_id > $1 OR (b.board_id = $1 AND $2 = 1))
        ORDER BY b.board_id LIMIT $3]], { position.board_after, position.inclusive, limit })
end

function M.trash(db: sql.DB, board_id: string, days: integer, limit: integer, after: string): ({ domain.Row }?, error?)
    return db:query([[SELECT item_id, version FROM kickside_work_item WHERE board_id = $1 AND life <> 'live' AND life = 'trashed'
        AND life_at < $2 AND item_id > $3 ORDER BY item_id LIMIT $4]], { board_id, clock.offset(-days * 86400), after, limit })
end


function M.prune(board_id: string, defaults: domain.Policy, limit: integer): (types.Pruned?, error?)
    return lifecycle.transaction(function(tx: sql.Transaction, dialect: string): (types.Pruned?, error?)
        local board, err = store.board(tx, board_id, dialect)
        if err then return nil, err end
        if not board then return { removed = 0, more = false }, nil end
        local effective, perr = policy.effective(defaults :: domain.JsonObject, board.compiled.policy_overrides)
        if perr or not effective then return nil, perr end
        local event_days, event_err = policy.event_days()
        if event_err or not event_days then return nil, event_err end
        local left = limit
        local function page(name: string, keys: string, where: string, params: domain.SqlParams): (boolean, error?)
            local n, more, err = lifecycle.page(tx, name, keys, where, params, left)
            if err or not n then return false, err end
            left = left - n
            return more == true, nil
        end
        local legacy_more, legacy_err = page("kickside_work_change", "seq, n", "board_id = $1 AND kind = 'query_value'", { board_id })
        if legacy_err then return nil, legacy_err end
        if legacy_more then return { removed = limit - left, more = true }, nil end
        local pages = {
            { name = "kickside_work_receipt", keys = "command_key", where = "board_id = $1 AND at < $2", days = event_days },
            { name = "kickside_work_key_alias", keys = "key", where = "board_id = $1 AND at < $2", days = effective.tombstone_days },
            { name = "kickside_work_change", keys = "seq, n", where = "board_id = $1 AND at < $2", days = effective.audit_days, keep = effective.audit_days == 0 },
            { name = "kickside_work_interval", keys = "item_id, field_id, start_seq", where = "board_id = $1 AND ended_at < $2", days = effective.interval_days, keep = effective.interval_days == 0 },
            { name = "kickside_work_generation", keys = "generation", where = [[board_id = $1 AND applied_at < $2
                AND generation < (SELECT generation FROM kickside_work_board WHERE board_id = $1)
                AND NOT EXISTS (SELECT 1 FROM kickside_work_item i WHERE i.board_id = $1 AND i.life <> 'purged' AND i.process_generation <= kickside_work_generation.generation)
                AND NOT EXISTS (SELECT 1 FROM kickside_work_job j WHERE j.board_id = $1 AND j.status NOT IN ('done', 'failed'))]], days = effective.audit_days, keep = effective.audit_days == 0 },
        }
        for _, entry in ipairs(pages) do
            if not entry.keep then
                local more, err = page(entry.name, entry.keys, entry.where, { board_id, clock.offset(-entry.days * 86400) })
                if err then return nil, err end
                if more then return { removed = limit - left, more = true }, nil end
            end
        end
        -- Purge-associated rows use independent pages; a large attachment cannot expand a purge event.
        local names = tables.names(board_id)
        local generated_more, generated_err = page(names.set, "item_id, col, value_key",
            "NOT EXISTS (SELECT 1 FROM kickside_work_item i WHERE i.board_id = $1 AND i.item_id = " .. names.set .. ".item_id AND i.life <> 'purged')", { board_id })
        if generated_err then return nil, generated_err end
        if generated_more then return { removed = limit - left, more = true }, nil end
        local dead = "NOT EXISTS (SELECT 1 FROM kickside_work_item i WHERE i.board_id = $1 AND i.item_id = %s AND i.life <> 'purged')"
        local associated = {
            { name = "kickside_work_stage_run", keys = "item_id, visit, attempt", where = string.format(dead, "kickside_work_stage_run.item_id") },
            { name = "kickside_work_approval", keys = "item_id, visit, actor", where = string.format(dead, "kickside_work_approval.item_id") },
            { name = "kickside_work_comment", keys = "comment_id", where = string.format(dead, "kickside_work_comment.item_id") },
            { name = "kickside_work_link", keys = "from_id, type, to_board_id, to_id", where = string.format(dead, "kickside_work_link.from_id") .. " OR (to_board_id = $1 AND " .. string.format(dead, "kickside_work_link.to_id") .. ")" },
            { name = "kickside_work_field_usage", keys = "field_id", where = "items = 0" },
            { name = "kickside_work_plugin", keys = "plugin", where = "active = 0 AND revision = applied_revision" },
            { name = "kickside_work_job", keys = "job_id", where = "status = 'done'" },
            { name = "kickside_work_visibility", keys = "item_id, seq", where = [[seq <= (SELECT tombstone_floor_seq FROM kickside_work_board WHERE board_id = $1)
                AND (NOT EXISTS (SELECT 1 FROM kickside_work_item i WHERE i.board_id = $1 AND i.item_id = kickside_work_visibility.item_id)
                OR seq < (SELECT MAX(v.seq) FROM kickside_work_visibility v WHERE v.board_id = $1 AND v.item_id = kickside_work_visibility.item_id
                    AND v.seq <= (SELECT tombstone_floor_seq FROM kickside_work_board WHERE board_id = $1)))]] },
        }
        for _, entry in ipairs(associated) do
            local more, err = page(entry.name, entry.keys, "board_id = $1 AND (" .. entry.where .. ")", { board_id })
            if err then return nil, err end
            if more then return { removed = limit - left, more = true }, nil end
        end
        local tombs, terr = tx:query([[SELECT item_id, updated_seq FROM kickside_work_item WHERE board_id = $1 AND life <> 'live' AND life = 'purged'
            AND life_at < $2 ORDER BY updated_seq, item_id LIMIT $3]], { board_id, clock.offset(-(effective.tombstone_days :: integer) * 86400), left })
        if terr then return nil, terr end
        local floor = board.tombstone_floor_seq
        for _, tomb in ipairs(tombs or {}) do
            local id, ierr = store.need(tomb, "item_id")
            if ierr then return nil, ierr end
            local seq, serr = store.need_int(tomb, "updated_seq")
            if serr or not seq then return nil, serr end
            local _, derr = tx:execute("DELETE FROM kickside_work_item WHERE board_id = $1 AND item_id = $2", { board_id, id })
            if derr then return nil, derr end
            floor = math.max(floor, seq)
        end
        if floor > board.tombstone_floor_seq then
            local _, uerr = tx:execute("UPDATE kickside_work_board SET tombstone_floor_seq = $1 WHERE board_id = $2", { floor, board_id })
            if uerr then return nil, uerr end
        end
        local n = #(tombs or {})
        return { removed = limit - left + n, more = left > 0 and n == left }, nil
    end)
end
-- deadline reads the earliest future eligibility for each retained row class.
function M.deadline(db: sql.DB, board_id: string, effective: domain.Policy): (integer?, error?)
    local event_days, event_err = policy.event_days()
    if event_err or not event_days then return nil, event_err end
    local classes = {
        { name = "kickside_work_item", column = "life_at", state = "trashed", days = effective.trash_days },
        { name = "kickside_work_item", column = "life_at", state = "purged", days = effective.tombstone_days },
        { name = "kickside_work_key_alias", column = "at", days = effective.tombstone_days },
        { name = "kickside_work_change", column = "at", days = effective.audit_days, keep = effective.audit_days == 0 },
        { name = "kickside_work_interval", column = "ended_at", where = " AND ended_at IS NOT NULL", days = effective.interval_days, keep = effective.interval_days == 0 },
        { name = "kickside_work_generation", column = "applied_at", days = effective.audit_days, keep = effective.audit_days == 0,
            where = " AND generation < (SELECT generation FROM kickside_work_board WHERE board_id = $1)" },
        { name = "kickside_work_receipt", column = "at", days = event_days },
        { name = "kickside_work_operation", column = operation_expiry.at(db:type()), where = " AND " .. operation_expiry.RETIRABLE, days = event_days },
    }
    local earliest: integer? = nil
    for _, class in ipairs(classes) do
        if not class.keep then
            local params: domain.SqlParams = { board_id, clock.offset(-(class.days :: integer) * 86400) }
            if class.state then params[3] = class.state end
            local filter = class.state and " AND life <> 'live' AND life = $3" or (class.where or "")
            local rows, err = db:query("SELECT " .. class.column .. " AS at FROM " .. class.name ..
                " WHERE board_id = $1 AND " .. class.column .. " >= $2" .. filter .. " ORDER BY " .. class.column .. " LIMIT 1", params)
            if err then return nil, err end
            local at = rows and rows[1] and store.text(rows[1].at)
            if at then
                local instant, perr = time.parse(time.RFC3339, at)
                if perr or not instant then return nil, perr end
                local due = math.floor(instant:unix_nano() / 1000000) + (class.days :: integer) * 86400000 + 1
                earliest = earliest and math.min(earliest, due) or due
            end
        end
    end
    return earliest, nil
end

return M
