-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local local_types = require("local_types")
-- Board cleanup uses one shared row budget and removes the board shell last.
local sql = require("sql")
local store = require("store")
local generated = require("generated")
local tables = require("tables")
local types = require("types")
local M = {}


local TABLES: { local_types.OwnedTable } = {
    { name = "kickside_work_board_meta", keys = "board_id" },
    { name = "kickside_work_stage_run", keys = "item_id, visit, attempt" },
    { name = "kickside_work_approval", keys = "item_id, visit, actor" },
    { name = "kickside_work_receipt", keys = "command_key" },
    { name = "kickside_work_visibility", keys = "item_id, seq" },
    { name = "kickside_work_plugin", keys = "plugin" },
    { name = "kickside_work_job", keys = "job_id" },
    { name = "kickside_work_operation", keys = "operation_id" },
    { name = "kickside_work_key_alias", keys = "key" },
    { name = "kickside_work_comment", keys = "comment_id" },
    { name = "kickside_work_change", keys = "seq, n" },
    { name = "kickside_work_interval", keys = "item_id, field_id, start_seq" },
    { name = "kickside_work_link", keys = "from_id, type, to_board_id, to_id" },
    { name = "kickside_work_field_usage", keys = "field_id" },
    { name = "kickside_work_item", keys = "item_id" },
    { name = "kickside_work_generation", keys = "generation" },
}

function M.transaction<T>(fn: (sql.Transaction, string) -> (T?, error?)): (T?, error?)
    local db, err = store.open()
    if not db then return nil, err end
    local tx, berr = db:begin()
    if berr or not tx then db:release(); return nil, berr end
    local result, ferr = fn(tx, db:type())
    if ferr then tx:rollback(); db:release(); return nil, ferr end
    local _, cerr = tx:commit()
    db:release()
    if cerr then return nil, cerr end
    return result, nil
end

-- page deletes at most limit rows identified by their complete primary key.
function M.page(tx: sql.DB | sql.Transaction, name: string, keys: string, where: string, args: types.SqlParams, limit: integer): (integer?, boolean?, error?)
    local params: types.SqlParams = {}
    for i, value in ipairs(args) do params[i] = value end
    params[#params + 1] = math.max(1, limit)
    local selection = "SELECT " .. keys .. " FROM " .. name .. " WHERE " .. where .. " ORDER BY " .. keys .. " LIMIT $" .. #params
    local rows, err = tx:query(selection, params)
    if err then return nil, nil, err end
    local n = #(rows or {})
    if limit == 0 then return 0, n > 0, nil end
    if n > 0 then
        local _, derr = tx:execute("DELETE FROM " .. name .. " WHERE " .. where .. " AND (" .. keys .. ") IN (" .. selection .. ")", params)
        if derr then return nil, nil, derr end
    end
    return n, n == limit, nil
end


function M.delete(board_id: string): (local_types.Cleanup?, error?)
    return M.transaction(function(tx: sql.Transaction, dialect: string): (local_types.Cleanup?, error?)
        local board, berr = store.board(tx, board_id, dialect)
        if berr then return nil, berr end
        local left = 100
        local owned: { local_types.OwnedTable } = {}
        local names = tables.names(board_id)
        if board then
            owned[#owned + 1] = { name = names.set, keys = "item_id, col, value_key" }
            owned[#owned + 1] = { name = names.item, keys = "item_id" }
        end
        for _, entry in ipairs(TABLES) do owned[#owned + 1] = entry end
        for _, entry in ipairs(owned) do
            local where = entry.name == names.set or entry.name == names.item
            local n, more, err = M.page(tx, entry.name, entry.keys, where and "1 = 1" or "board_id = $1", where and {} or { board_id }, left)
            if err or not n then return nil, err end
            left = left - n
            if more then return { success = false, needs_continue = true, deleted = 100 - left }, nil end
        end
        if left == 0 then return { success = false, needs_continue = true, deleted = 100 }, nil end
        local derr = generated.drop(tx, names)
        if derr then return nil, derr end
        local _, err = tx:execute("DELETE FROM kickside_work_board WHERE board_id = $1", { board_id })
        if err then return nil, err end
        return { success = true, needs_continue = false, deleted = 100 - left + (board and 1 or 0) }, nil
    end)
end

function M.orphans(db: sql.DB, limit: integer): ({ { prefix: string, board_id: string, claim_version: integer } }?, error?)
    local rows, err = db:query([[SELECT p.prefix, p.board_id, p.claim_version FROM kickside_work_prefix p
        WHERE p.prefix > (SELECT orphan_after FROM kickside_work_retention WHERE owner_id = 'work')
        AND NOT EXISTS (SELECT 1 FROM kickside_work_board b WHERE b.board_id = p.board_id)
        ORDER BY p.prefix LIMIT $1]], { limit })
    if err then return nil, err end
    local out: { { prefix: string, board_id: string, claim_version: integer } } = {}
    for _, row in ipairs(rows or {}) do
        local prefix, perr = store.need(row, "prefix")
        if perr or not prefix then return nil, perr end
        local board_id, berr = store.need(row, "board_id")
        if berr or not board_id then return nil, berr end
        local version, verr = store.need_int(row, "claim_version")
        if verr or not version then return nil, verr end
        out[#out + 1] = { prefix = prefix, board_id = board_id, claim_version = version }
    end
    return out, nil
end

function M.advance_orphans(after: string): error?
    local _, err = M.transaction(function(tx: sql.Transaction, _dialect: string): (boolean?, error?)
        local _, err = tx:execute("UPDATE kickside_work_retention SET orphan_after = $1 WHERE owner_id = 'work'", { after })
        return true, err
    end)
    return err
end

function M.remove_prefix(db: sql.DB, prefix: string, board_id: string): error?
    local drop_err = generated.drop(db, tables.names(board_id))
    if drop_err then return drop_err end
    local _, err = db:execute("DELETE FROM kickside_work_prefix WHERE prefix = $1 AND board_id = $2", { prefix, board_id })
    return err
end
return M
