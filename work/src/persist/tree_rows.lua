-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Hierarchy paths and relation populations under a command snapshot.
local sql = require("sql")
local store = require("store")
local tables = require("tables")
local domain = require("domain")
local storage = require("storage")
local M = {}

-- The generated ancestor key follows the materialized path even if a parent is no longer live.
function M.live_subtree(db: sql.Transaction, root: domain.Item, limit: integer, dialect: string): ({ storage.SubtreeMember }?, error?)
    local ancestors = tables.names(root.board_id).set
    local prefix = "SELECT i.item_id, i.parent_id, length(i.path) AS path_length FROM " .. ancestors .. " s CROSS JOIN "
    local item = "i.board_id = $1 AND i.item_id = s.item_id AND i.life = 'live'"
    local ancestor = "s.col = 'path_under' AND s.value_key = $2"
    local statement = prefix .. "kickside_work_item i WHERE " .. item .. " AND " .. ancestor
    if dialect == sql.type.POSTGRES then
        -- Keep item lookups inside the ordered ancestor range so the limit can stop the walk.
        statement = prefix .. "LATERAL (SELECT i.item_id, i.parent_id, i.path FROM kickside_work_item i WHERE "
            .. item .. " LIMIT 1) i WHERE " .. ancestor
    end
    local descendants, err = db:query(statement .. " ORDER BY s.item_id LIMIT $3", { root.board_id, root.item_id, limit - 1 })
    if err or not descendants then return nil, err end

    -- The index supplies ID order. Append complete layers to keep parents before their children.
    local layers: { [integer]: { storage.SubtreeMember } } = {}
    local last = #root.path
    for _, row in ipairs(descendants) do
        local length = row.path_length :: integer
        local layer = layers[length] or {}
        layer[#layer + 1] = { item_id = row.item_id :: string, parent_id = row.parent_id :: string? }
        layers[length] = layer
        last = math.max(last, length)
    end
    local rows: { storage.SubtreeMember } = { { item_id = root.item_id, parent_id = root.parent_id } }
    for length = #root.path + 1, last do
        for _, row in ipairs(layers[length] or {}) do rows[#rows + 1] = row end
    end
    return rows, nil
end

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

function M.outgoing(tx: sql.Transaction, board_id: string, sources: { string }, limit: integer): ({ domain.Row }?, error?)
    local args: domain.SqlParams = { board_id }
    local marks: { string } = {}
    for i, source in ipairs(sources) do
        args[i + 1] = source
        marks[i] = "$" .. (i + 1)
    end
    args[#args + 1] = limit
    return tx:query([[SELECT from_id, type, to_board_id, to_id FROM kickside_work_link
        WHERE board_id = $1 AND from_id IN (]] .. table.concat(marks, ",") .. [[)
        ORDER BY from_id, type, to_board_id, to_id LIMIT $]] .. #args, args)
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
