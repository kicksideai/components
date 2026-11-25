-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local types = require("types")
local json = require("json")

local M = {}

function M.insert(ex: types.Executor, row: types.PreviewRow): (string?, error?)
    local expected, encode_err = json.encode(row.expected)
    if encode_err then return nil, encode_err end
    local _, err = ex:execute([[INSERT INTO mail_library_preview (id,actor,operation,digest,expected_json,expires_at)
        VALUES ($1,$2,$3,$4,$5,$6)]], {row.id, row.actor, row.operation, row.digest, expected, row.expires_at})
    if err then return nil, err end
    return row.id, nil
end

function M.get(ex: types.Executor, id: string): (types.PreviewRow?, error?)
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

function M.prune(tx: types.Transaction, now: integer, limit: integer): (integer?, error?)
    local result, err = tx:execute([[DELETE FROM mail_library_preview WHERE id IN (
        SELECT id FROM mail_library_preview WHERE expires_at<=$1 ORDER BY expires_at,id LIMIT $2
    )]], {now, limit})
    if err then return nil, err end
    return result.rows_affected, nil
end

function M.next_expiry(ex: types.Executor): (integer?, error?)
    local rows, err = ex:query("SELECT expires_at FROM mail_library_preview ORDER BY expires_at,id LIMIT 1")
    if err then return nil, err end
    return rows[1] and rows[1].expires_at :: integer?, nil
end

function M.delete_all(tx: types.Transaction): (integer?, error?)
    local result, err = tx:execute("DELETE FROM mail_library_preview")
    if err then return nil, err end
    return result.rows_affected, nil
end

return M
