-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- A bounded candidate sort uses the database's own comparison and collation.
local sql = require("sql")
local domain = require("domain")
local M = {}
function M.order(db: sql.DB, keys: { unknown }, numeric: boolean, desc: boolean, limit: integer): ({ integer }?, error?)
    if #keys == 0 then return {}, nil end
    local rows: { string } = {}
    local args: domain.SqlParams = {}
    for i, raw in ipairs(keys) do
        if raw == false then rows[i] = "(" .. i .. ",NULL)"
        else
            args[#args + 1] = raw
            rows[i] = "(" .. i .. ",CAST($" .. #args .. " AS " .. (numeric and "BIGINT" or "TEXT") .. "))"
        end
    end
    local found, err = db:query("WITH candidates(ordinal, value) AS (VALUES " .. table.concat(rows, ",") .. ") SELECT ordinal FROM candidates ORDER BY CASE WHEN value IS NULL THEN 1 ELSE 0 END, value "
        .. (desc and "DESC" or "ASC") .. ", ordinal LIMIT " .. limit, args)
    if err then return nil, err end
    local out: { integer } = {}
    for _, row in ipairs(found or {}) do out[#out + 1] = math.tointeger(tonumber(row.ordinal)) :: integer end
    return out, nil
end
return M
