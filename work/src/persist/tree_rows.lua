-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Hierarchy paths and relation populations under a command snapshot.
local sql = require("sql")
local store = require("store")
local domain = require("domain")
local M = {}

function M.subtree(db: sql.DB | sql.Transaction, board_id: string, moves: { domain.PathMove }, path: string, depth: integer): (domain.SubtreeStats?, error?)
    local params: domain.SqlParams = { board_id }
    local clauses = { "p0 AS (SELECT path FROM kickside_work_item WHERE board_id = $1)" }
    local current = "p0"
    for i, move in ipairs(moves) do
        local at = #params
        params[at + 1], params[at + 2], params[at + 3] = move.previous .. "%", move.path, #move.previous + 1
        local name = "p" .. i
        clauses[#clauses + 1] = name .. " AS (SELECT CASE WHEN path LIKE $" .. (at + 1) .. " THEN $" .. (at + 2)
            .. " || substr(path, $" .. (at + 3) .. ") ELSE path END AS path FROM " .. current .. ")"
        current = name
    end
    params[#params + 1] = path .. "%"
    local rows, err = db:query("WITH " .. table.concat(clauses, ", ") .. " SELECT COUNT(*) AS n, "
        .. "MAX(length(path) - length(replace(path, '/', '')) - 1) AS depth FROM " .. current .. " WHERE path LIKE $" .. #params, params)
    if err then return nil, err end
    local row = rows and rows[1]
    if not row then return nil, errors.new({ kind = errors.INTERNAL, message = "subtree count has no row", details = { code = "row_corrupt" } }) end
    local decoded_2, decode_err = store.need_int(row, "n")
    if decode_err then return nil, decode_err end
    local decoded_2 = decoded_2 :: integer
    return { size = decoded_2, depth = store.int(row.depth) or depth }, nil
end

function M.descendants(db: sql.DB | sql.Transaction, board_id: string, moves: { domain.PathMove }, path: string, limit: integer): ({ domain.Item }?, error?)
    local params: domain.SqlParams = { board_id }
    local clauses = { "p0 AS (SELECT item_id, path FROM kickside_work_item WHERE board_id = $1)" }
    local current = "p0"
    for i, move in ipairs(moves) do
        local at = #params
        params[at + 1], params[at + 2], params[at + 3] = move.previous .. "%", move.path, #move.previous + 1
        local name = "p" .. i
        clauses[#clauses + 1] = name .. " AS (SELECT item_id, CASE WHEN path LIKE $" .. (at + 1) .. " THEN $" .. (at + 2)
            .. " || substr(path, $" .. (at + 3) .. ") ELSE path END AS path FROM " .. current .. ")"
        current = name
    end
    params[#params + 1] = path .. "%"
    params[#params + 1] = limit
    local rows, err = db:query("WITH " .. table.concat(clauses, ", ") .. " SELECT item_id FROM " .. current .. " WHERE path LIKE $" .. (#params - 1)
        .. " ORDER BY path, item_id LIMIT $" .. #params, params)
    if err then return nil, err end
    local ids: { string } = {}
    for _, row in ipairs(rows or {}) do
        local decoded_1, decode_err = store.need(row, "item_id")
        if decode_err then return nil, decode_err end
        local decoded_1 = decoded_1 :: string
        ids[#ids + 1] = decoded_1
    end
    return store.items(db, board_id, ids)
end

function M.link(db: sql.DB | sql.Transaction, board_id: string, from: string, type_id: string, to_board: string, to_id: string): ({ domain.Row }?, error?)
    return db:query([[SELECT 1 AS present FROM kickside_work_link WHERE board_id = $1 AND from_id = $2 AND type = $3
        AND to_board_id = $4 AND to_id = $5]], { board_id, from, type_id, to_board, to_id })
end

function M.outgoing_count(db: sql.DB | sql.Transaction, board_id: string, item_id: string, type_id: string): ({ domain.Row }?, error?)
    return db:query("SELECT COUNT(*) AS n FROM kickside_work_link WHERE board_id = $1 AND from_id = $2 AND type = $3", { board_id, item_id, type_id })
end

function M.children(db: sql.DB | sql.Transaction, board_id: string, parent_id: string): (integer?, error?)
    return store.count(db, "SELECT COUNT(*) AS n FROM kickside_work_item WHERE board_id = $1 AND parent_id = $2", { board_id, parent_id })
end

function M.incident(db: sql.DB | sql.Transaction, board_id: string, type_id: string, holder: string): (integer?, error?)
    return store.count(db, [[SELECT COUNT(*) AS n FROM kickside_work_link WHERE board_id = $1 AND type = $2
        AND (from_id = $3 OR (to_board_id = $1 AND to_id = $3))]], { board_id, type_id, holder })
end

return M
