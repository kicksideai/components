-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Keyset boundaries use the same ordering for result pages and scan windows.
local sql = require("sql")
local domain = require("domain")
local M = {}
function M.cursor(row: domain.Row, order: { domain.Sort }): domain.Cursor
    local keys: { { v: domain.ColumnValue? } } = {}
    for i = 1, #order do
        local raw = row[i == 1 and "sort_value" or "sort_value_" .. i]
        keys[i] = { v = type(raw) == "number" and math.tointeger(raw) or type(raw) == "string" and raw or nil }
    end
    return { id = row.item_id :: string, v = keys[1] and keys[1].v, keys = #keys > 1 and keys or nil }
end
function M.after(columns: { string }, order: { domain.Sort }, cursor: domain.Cursor): (domain.Condition?, error?)
    local branches: { string } = {}
    local args: { unknown } = {}
    local function held(index: integer): domain.ColumnValue?
        if cursor.keys then return cursor.keys[index] and cursor.keys[index].v end
        return index == 1 and cursor.v or nil
    end
    local function prefix(through: integer): { string }
        local parts: { string } = {}
        for j = 1, through do
            local value = held(j)
            if value == nil then parts[#parts + 1] = columns[j] .. " IS NULL"
            else parts[#parts + 1] = columns[j] .. " = ?"; args[#args + 1] = value end
        end
        return parts
    end
    if #columns > 1 and (not cursor.keys or #cursor.keys ~= #columns) then
        return nil, errors.new({ kind = errors.INVALID, message = "cursor carries every order key", details = { code = "invalid_query" } })
    end
    for i, column in ipairs(columns) do
        local value = held(i)
        if value ~= nil then
            local parts = prefix(i - 1)
            parts[#parts + 1] = "(" .. column .. (order[i].dir == "desc" and " < ?" or " > ?") .. " OR " .. column .. " IS NULL)"
            args[#args + 1] = value
            branches[#branches + 1] = "(" .. table.concat(parts, " AND ") .. ")"
        end
    end
    local parts = prefix(#columns)
    parts[#parts + 1] = "i.item_id > ?"
    args[#args + 1] = cursor.id
    branches[#branches + 1] = "(" .. table.concat(parts, " AND ") .. ")"
    return { sql = "(" .. table.concat(branches, " OR ") .. ")", args = args }, nil
end

-- These disjoint ranges follow the index's order. Nulls occupy their own
-- range, and a descending key still uses ascending item IDs within each tie.
function M.ranges(column: string, descending: boolean, cursor: domain.Cursor, required: boolean): { domain.Condition }
    local value = cursor.v
    if value == nil then
        return { { sql = column .. " IS NULL AND i.item_id > ?", args = { cursor.id } } }
    end
    local ranges: { domain.Condition }
    if descending then
        ranges = {
            { sql = column .. " = ? AND i.item_id > ?", args = { value, cursor.id } },
            { sql = column .. " < ?", args = { value } },
        }
    else
        ranges = { { sql = "(" .. column .. ", i.item_id) > (?, ?)", args = { value, cursor.id } } }
    end
    if not required then ranges[#ranges + 1] = { sql = column .. " IS NULL", args = {} } end
    return ranges
end
function M.order(query: sql.SelectBuilder, columns: { string }, order: { domain.Sort }, keys: boolean?): sql.SelectBuilder
    local out = query
    for i, column in ipairs(columns) do
        if keys ~= false then out = out:columns(column .. (i == 1 and " AS sort_value" or " AS sort_value_" .. i)) end
        out = out:order_by(column .. (order[i].dir == "desc" and " DESC NULLS LAST" or " ASC NULLS LAST"))
    end
    return out:order_by("i.item_id")
end
return M
