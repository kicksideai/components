-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local registry_values = require("registry_values")
-- Scope declarations: a kickside.work.scope registry entry names a plugin table in
-- the board database and the columns items may be filtered by. Declarations hold
-- identifiers only; Work writes the SQL.
local registry = require("registry")
local types = require("types")

local M = {}

M.TYPE = "kickside.work.scope"

-- Value types a scope filter column may declare, and the ops each may take.
local OPS: { [string]: boolean } = { eq = true, ["in"] = true, lt = true, lte = true, gt = true, gte = true }
local VALUE_TYPES: { [string]: boolean } = { text = true, integer = true }
local ACCESS: { [string]: boolean } = { read = true, write = true, admin = true }

local function invalid(message: string): error
    return errors.new({ details = { code = "unknown_scope" }, kind = errors.INVALID, message = message })
end

local function identifier(v: unknown): string?
    if type(v) ~= "string" then return nil end
    if not v:match("^[a-z_][a-z0-9_]*$") or #v > 63 then return nil end
    return v
end

M.identifier = identifier

-- load reads and checks the scope entry id.
function M.load(id: string): (types.Scope?, error?)
    local entry, err = registry.get(id)
    if err and err:kind() ~= errors.NOT_FOUND then return nil, err end
    if not entry then return nil, invalid("unknown scope " .. id) end
    local meta = registry_values.canonical(entry.meta)
    if type(meta) ~= "table" then return nil, invalid(id .. " is not a work scope") end
    local m = meta :: { [string]: unknown }
    if m.type ~= M.TYPE then return nil, invalid(id .. " is not a work scope") end
    local table_name, board_column, item_column = identifier(m.table), identifier(m.board_column), identifier(m.item_column)
    if not table_name or not board_column or not item_column then
        return nil, invalid(id .. " declares table, board_column and item_column as identifiers")
    end
    local access = m.access == nil and "read" or m.access
    if type(access) ~= "string" or not ACCESS[access] then return nil, invalid(id .. " access is read, write or admin") end
    if type(m.filters) ~= "table" then return nil, invalid(id .. " declares no filters") end
    local filters: { [string]: types.ScopeFilter } = {}
    for name, raw in pairs(m.filters :: { [unknown]: unknown }) do
        local key = identifier(name)
        if not key or type(raw) ~= "table" then return nil, invalid(id .. " filter " .. tostring(name) .. " is malformed") end
        local f = raw :: { [string]: unknown }
        local column = identifier(f.column)
        local value_type = f.type
        if not column or type(value_type) ~= "string" or not VALUE_TYPES[value_type] or type(f.ops) ~= "table" then
            return nil, invalid(id .. " filter " .. key .. " needs a column, a type of text or integer, and ops")
        end
        local ops: { [string]: boolean } = {}
        for _, op in ipairs(f.ops :: { unknown }) do
            if type(op) ~= "string" or not OPS[op] then return nil, invalid(id .. " filter " .. key .. " names unknown op " .. tostring(op)) end
            ops[op] = true
        end
        filters[key] = { column = column, type = value_type, ops = ops }
    end
    return { id = id, table = table_name, board_column = board_column, item_column = item_column, filters = filters,
        access = access }, nil
end

-- admit loads every scope a query names and checks the reader's access to
-- each. Callers admit before opening a read transaction, keeping security calls
-- outside it.
function M.admit(r: types.Reader, queries: { types.ScopeQuery }?): ({ types.AdmittedScope }?, error?)
    local out: { types.AdmittedScope } = {}
    for _, sq in ipairs(queries or {}) do
        if type(sq) ~= "table" or type(sq.id) ~= "string" then return nil, invalid("a scope query names its scope id") end
        local scope, err = M.load(sq.id)
        if err or not scope then return nil, err end
        if not r.allows(scope.access) then
            return nil, errors.new({ details = { code = "scope_access_denied" }, kind = errors.PERMISSION_DENIED, message = "scope " .. scope.id .. " needs " .. scope.access .. " access" })
        end
        out[#out + 1] = { scope = scope, where = sq.where or {} }
    end
    return out, nil
end

-- value checks one filter value against the column's declared type.
function M.value(f: types.ScopeFilter, raw: unknown): types.ColumnValue?
    if f.type == "integer" then
        if type(raw) == "number" then return math.tointeger(raw) end
        return nil
    end
    if type(raw) == "string" then return raw end
    return nil
end

return M
