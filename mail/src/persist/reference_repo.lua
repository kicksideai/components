-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local database = require("database")
local types = require("types")

local M = {}

function M.delete_from(tx: database.Transaction, from: types.ResourceKey): (boolean?, error?)
    local _, err = tx:execute([[DELETE FROM mail_library_reference WHERE from_kind=$1 AND from_name=$2]],
        {from.kind, from.name})
    if err then return nil, err end
    return true, nil
end

function M.replace(tx: database.Transaction, from: types.ResourceKey, refs: {types.ResourceKey}): (boolean?, error?)
    local _, delete_err = M.delete_from(tx, from)
    if delete_err then return nil, delete_err end
    for _, target in ipairs(refs) do
        local _, err = tx:execute([[INSERT INTO mail_library_reference (from_kind,from_name,to_kind,to_name)
            VALUES ($1,$2,$3,$4) ON CONFLICT DO NOTHING]], {from.kind, from.name, target.kind, target.name})
        if err then return nil, err end
    end
    return true, nil
end

local ACTIVE_REFERRERS = [[ FROM mail_library_reference r
    JOIN mail_library l ON l.kind=r.from_kind AND l.name=r.from_name AND l.archived=FALSE
    WHERE r.to_kind=$1 AND r.to_name=$2]]

function M.referrers(ex: database.Executor, to: types.ResourceKey, limit: integer?): ({types.ResourceKey}?, error?)
    local args: {string | integer} = {to.kind, to.name}
    local query = "SELECT r.from_kind AS kind,r.from_name AS name" .. ACTIVE_REFERRERS .. " ORDER BY r.from_kind,r.from_name"
    if limit then
        query = query .. " LIMIT $3"
        args[3] = limit
    end
    local rows, err = ex:query(query, args)
    return rows :: {types.ResourceKey}?, err
end

return M
