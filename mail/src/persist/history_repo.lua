-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local sql = require("sql")
local database = require("database")
local types = require("types")

local M = {}

function M.insert(tx: database.Transaction, row: types.HistoryRow): (boolean?, error?)
    local _, err = tx:execute([[INSERT INTO mail_library_history
        (seq,kind,name,version,action,author,note,restored_from,at)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) ON CONFLICT (seq) DO NOTHING]],
        {row.seq, row.kind, row.name, row.version, row.action, row.author, row.note or sql.NULL,
            row.restored_from or sql.NULL, row.at})
    if err then return nil, err end
    return true, nil
end

function M.page(ex: database.Executor, key: types.ResourceKey, limit: integer, boundary: integer,
    before: integer?): ({types.HistoryRow}?, error?)
    local columns = "SELECT seq,kind,name,version,action,author,note,restored_from,at FROM mail_library_history"
    if before then
        local rows, err = ex:query(columns .. [[ WHERE kind=$1 AND name=$2 AND seq>$3 AND seq<$4
            ORDER BY seq DESC LIMIT $5]], {key.kind, key.name, boundary, before, limit})
        return rows :: {types.HistoryRow}?, err
    end
    local rows, err = ex:query(columns .. [[ WHERE kind=$1 AND name=$2 AND seq>$3
        ORDER BY seq DESC LIMIT $4]], {key.kind, key.name, boundary, limit})
    return rows :: {types.HistoryRow}?, err
end

function M.get(ex: database.Executor, key: types.ResourceKey, seq: integer): (types.HistoryRow?, error?)
    local rows, err = ex:query("SELECT * FROM mail_library_history WHERE seq=$1 AND kind=$2 AND name=$3",
        {seq, key.kind, key.name})
    if err then return nil, err end
    return rows[1] :: types.HistoryRow?, nil
end

function M.sequence(ex: database.Executor, key: types.ResourceKey, version: integer): (integer?, error?)
    local rows, err = ex:query("SELECT seq FROM mail_library_history WHERE kind=$1 AND name=$2 AND version=$3",
        {key.kind, key.name, version})
    if err then return nil, err end
    return rows[1] and rows[1].seq :: integer, nil
end

function M.prune_below(tx: database.Transaction, boundary: integer, limit: integer): (integer?, error?)
    local result, err = tx:execute([[DELETE FROM mail_library_history WHERE seq IN (
        SELECT seq FROM mail_library_history WHERE seq<=$1 ORDER BY seq LIMIT $2)]], {boundary, limit})
    if err then return nil, err end
    return result.rows_affected, nil
end

return M
