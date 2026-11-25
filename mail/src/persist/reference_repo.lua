-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local types = require("types")
local resource = require("resource")

local M = {}

function M.delete_from(tx: types.Transaction, from: types.ResourceKey): (boolean?, error?)
    local _, err = tx:execute([[DELETE FROM mail_library_reference WHERE from_kind=$1 AND from_name=$2]],
        {from.kind, from.name})
    if err then return nil, err end
    return true, nil
end

function M.replace(tx: types.Transaction, from: types.ResourceKey, refs: {types.ResourceKey}): (boolean?, error?)
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

function M.referrers(ex: types.Executor, to: types.ResourceKey, limit: integer?): ({types.ResourceKey}?, error?)
    local args: {string | integer} = {to.kind, to.name}
    local query = "SELECT r.from_kind AS kind,r.from_name AS name" .. ACTIVE_REFERRERS .. " ORDER BY r.from_kind,r.from_name"
    if limit then
        query = query .. " LIMIT $3"
        args[3] = limit
    end
    local rows, err = ex:query(query, args)
    return rows :: {types.ResourceKey}?, err
end

function M.use_counts(ex: types.Executor, keys: {types.ResourceKey}): ({[string]: integer}?, error?)
    local counts: {[string]: integer} = {}
    for _, key in ipairs(keys) do
        local rows, err = ex:query("SELECT COUNT(*) AS uses" .. ACTIVE_REFERRERS, {key.kind, key.name})
        if err then return nil, err end
        counts[resource.subject(key)] = rows[1].uses :: integer
    end
    return counts, nil
end

local function walk(ex: types.Executor, keys: {types.ResourceKey}, query: string): ({types.ResourceKey}?, error?)
    local queue: {types.ResourceKey} = {}
    local seen: {[string]: boolean} = {}
    local function add(key: types.ResourceKey)
        local id = resource.subject(key)
        if seen[id] then return end
        seen[id] = true
        queue[#queue + 1] = key
    end
    for _, key in ipairs(keys) do add(key) end
    local first = #queue
    for _, key in ipairs(queue) do
        local rows, err = ex:query(query, {key.kind, key.name})
        if err then return nil, err end
        for _, row in ipairs(rows) do add(row :: types.ResourceKey) end
    end
    local result: {types.ResourceKey} = {}
    for i = first + 1, #queue do result[#result + 1] = queue[i] end
    table.sort(result, function(a, b) return resource.subject(a) < resource.subject(b) end)
    return result, nil
end

function M.closure(ex: types.Executor, keys: {types.ResourceKey}): (types.ReferenceClosure?, error?)
    local dependencies, err = walk(ex, keys, [[SELECT to_kind AS kind,to_name AS name FROM mail_library_reference
        WHERE from_kind=$1 AND from_name=$2]])
    if err then return nil, err end
    local dependants, read_err = walk(ex, keys, "SELECT r.from_kind AS kind,r.from_name AS name" .. ACTIVE_REFERRERS)
    if read_err then return nil, read_err end
    return {dependencies = dependencies :: {types.ResourceKey}, dependants = dependants :: {types.ResourceKey}}, nil
end

function M.delete_all(tx: types.Transaction): (integer?, error?)
    local result, err = tx:execute("DELETE FROM mail_library_reference")
    if err then return nil, err end
    return result.rows_affected, nil
end

return M
