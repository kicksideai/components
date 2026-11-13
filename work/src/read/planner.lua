-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Native planning reports selected indexes without executing the item query.
local sql = require("sql")
local json = require("json")
local types = require("types")
local M = {}

local function malformed(): error
    return errors.new({ kind = errors.INTERNAL, message = "database planner response is malformed", details = { code = "planner_response" } })
end

local function collect(raw: unknown, names: { [string]: boolean }): error?
    if type(raw) ~= "table" then return malformed() end
    local node = raw :: { [string]: unknown }
    local name = node["Index Name"]
    if name ~= nil then
        if type(name) ~= "string" or name == "" then return malformed() end
        names[name] = true
    end
    if node.Plans ~= nil then
        if type(node.Plans) ~= "table" then return malformed() end
        for _, child in ipairs(node.Plans :: { unknown }) do
            local err = collect(child, names)
            if err then return err end
        end
    end
    return nil
end

function M.indexes(tx: types.Executor, dialect: string, statement: string, args: { unknown }): ({ string }?, error?)
    local prefix = dialect == sql.type.POSTGRES and "EXPLAIN (FORMAT JSON) " or "EXPLAIN QUERY PLAN "
    local rows, err = tx:query(prefix .. statement, args)
    if err then return nil, errors.wrap(err, "query planning failed") end
    if not rows or #rows == 0 then return nil, malformed() end
    local names: { [string]: boolean } = {}
    if dialect == sql.type.POSTGRES then
        local raw = rows[1]["QUERY PLAN"]
        if type(raw) == "string" then
            local decoded, derr = json.decode(raw)
            if derr then return nil, errors.wrap(derr, "query plan decoding failed") end
            raw = decoded
        end
        if type(raw) ~= "table" then return nil, malformed() end
        local plans = raw :: { { Plan: unknown } }
        if #plans ~= 1 then return nil, malformed() end
        local cerr = collect(plans[1].Plan, names)
        if cerr then return nil, cerr end
    else
        for _, row in ipairs(rows) do
            if type(row.detail) ~= "string" then return nil, malformed() end
            local detail = row.detail :: string
            local name = detail:match("USING COVERING INDEX ([%w_]+)") or detail:match("USING INDEX ([%w_]+)")
            if name then names[name] = true end
        end
    end
    local indexes: { string } = {}
    for name in pairs(names) do indexes[#indexes + 1] = name end
    table.sort(indexes)
    return indexes, nil
end
return M
