-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local database = require("database")
local types = require("types")
local json = require("json")

local M = {}

function M.reserve(ex: database.Executor, id: string, expires_at: integer): (boolean?, error?)
    local _, err = ex:execute([[INSERT INTO mail_library_preview (id,actor,operation,digest,expected_json,expires_at)
        VALUES ($1,'','scratch','','{}',$2)]], {id, expires_at})
    if err then return nil, err end
    return true, nil
end

function M.complete(tx: database.Transaction, row: types.PreviewRow): (boolean?, error?)
    local expected, encode_err = json.encode(row.expected)
    if encode_err then return nil, encode_err end
    local result, err = tx:execute([[UPDATE mail_library_preview SET actor=$1,operation=$2,digest=$3,expected_json=$4
        WHERE id=$5 AND operation='scratch']], {row.actor, row.operation, row.digest, expected, row.id})
    if err then return nil, err end
    return result.rows_affected == 1, nil
end

function M.discard(tx: database.Transaction, id: string): (boolean?, error?)
    local _, err = tx:execute("DELETE FROM mail_library_preview WHERE id=$1 AND operation='scratch'", {id})
    if err then return nil, err end
    return true, nil
end

function M.get(ex: database.Executor, id: string): (types.PreviewRow?, error?)
    local rows, err = ex:query([[SELECT actor,operation,digest,expected_json,expires_at
        FROM mail_library_preview WHERE id=$1]], {id})
    if err then return nil, err end
    local row = rows[1]
    if not row then return nil, nil end
    local expected, decode_err = json.decode(row.expected_json :: string)
    if decode_err then return nil, decode_err end
    return {id = id, actor = row.actor :: string, operation = row.operation :: string,
        digest = row.digest :: string, expected = expected :: {[string]: integer}, expires_at = row.expires_at :: integer}, nil
end

function M.expired(ex: database.Executor, now: integer, limit: integer): ({string}?, error?)
    local rows, err = ex:query("SELECT id FROM mail_library_preview WHERE expires_at<=$1 ORDER BY expires_at,id LIMIT $2",
        {now, limit})
    if err then return nil, err end
    local ids: {string} = {}
    for index, row in ipairs(rows) do ids[index] = row.id :: string end
    return ids, nil
end

function M.prune(tx: database.Transaction, ids: {string}): (boolean?, error?)
    local markers: {string} = {}
    for index in ipairs(ids) do markers[index] = "$" .. index end
    local _, err = tx:execute("DELETE FROM mail_library_preview WHERE id IN (" .. table.concat(markers, ",") .. ")", ids)
    if err then return nil, err end
    return true, nil
end

function M.next_expiry(ex: database.Executor): (integer?, error?)
    local rows, err = ex:query("SELECT expires_at FROM mail_library_preview ORDER BY expires_at,id LIMIT 1")
    if err then return nil, err end
    return rows[1] and rows[1].expires_at :: integer?, nil
end

function M.delete_all(tx: database.Transaction): (integer?, error?)
    local result, err = tx:execute("DELETE FROM mail_library_preview")
    if err then return nil, err end
    return result.rows_affected, nil
end

return M
