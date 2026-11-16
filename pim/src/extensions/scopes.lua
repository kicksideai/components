-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Scope declarations: a kickside.pim.scope registry entry names a plugin table
-- in PIM's database and the columns products may be filtered by. Declarations
-- hold identifiers only; the query compiler writes the SQL.
local failure = require("failure")
local registry = require("registry")
local types = require("types")

local M = {}

M.TYPE = "kickside.pim.scope"

-- Value types a scope filter column may declare, and the ops each may take.
local OPS: { [string]: boolean } = { eq = true, ["in"] = true, lt = true, lte = true, gt = true, gte = true }
local VALUE_TYPES: { [string]: boolean } = { text = true, integer = true }
local ACCESS: { [string]: boolean } = { read = true, write = true, admin = true }

local invalid = failure.invalid

local function identifier(v: unknown): string?
    if type(v) ~= "string" then return nil end
    if not v:match("^[a-z_][a-z0-9_]*$") or #v > 63 then return nil end
    return v
end

-- load reads and checks the scope entry id.
function M.load(id: string): (types.Scope?, error?)
    local entry, err = registry.get(id)
    if err and err:kind() ~= errors.NOT_FOUND then return nil, errors.wrap(err, "scope lookup " .. id) end
    if not entry then return nil, invalid("unknown scope " .. id, { code = "unknown_scope", entry = id }) end
    local meta = entry.meta
    if type(meta) ~= "table" then return nil, invalid(id .. " is not a product scope") end
    local m = meta :: { [string]: unknown }
    if m.type ~= M.TYPE then return nil, invalid(id .. " is not a product scope") end
    local table_name, catalog_column, product_column = identifier(m.table), identifier(m.catalog_column), identifier(m.product_column)
    if not table_name or not catalog_column or not product_column then
        return nil, invalid(id .. " declares table, catalog_column and product_column as identifiers")
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
    return { id = id, table = table_name, catalog_column = catalog_column, product_column = product_column, filters = filters,
        access = access }, nil
end

-- find lists every declared product scope the caller may read, in id order.
function M.find(): ({ types.ScopeOption }?, error?)
    local entries, err = registry.find({ [".kind"] = "registry.entry", ["meta.type"] = M.TYPE })
    if err then return nil, errors.wrap(err, "scope lookup failed") end
    local out: { types.ScopeOption } = {}
    for _, e in ipairs(entries or {}) do
        local id = tostring(e.id)
        local raw = type(e.meta) == "table" and e.meta :: { [string]: unknown } or {}
        local scope, lerr = M.load(id)
        if lerr and lerr:kind() ~= errors.INVALID then return nil, lerr end
        if lerr or not scope then
            out[#out + 1] = { id = id, title = type(raw.title) == "string" and raw.title :: string or nil, access = "", filters = {}, problem = tostring(lerr) }
        else
            local filters: { [string]: types.ScopeFilterOption } = {}
            for name, f in pairs(scope.filters) do
                local ops: { string } = {}
                for op in pairs(f.ops) do ops[#ops + 1] = op end
                table.sort(ops)
                filters[name] = { type = f.type, ops = ops }
            end
            out[#out + 1] = { id = id, title = type(raw.title) == "string" and raw.title :: string or nil, access = scope.access, filters = filters }
        end
    end
    table.sort(out, function(a: types.ScopeOption, b: types.ScopeOption): boolean return a.id < b.id end)
    return out, nil
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
            return nil, errors.new({ kind = errors.PERMISSION_DENIED, message = "scope " .. scope.id .. " needs " .. scope.access .. " access", details = { code = "scope_access_denied", scope = scope.id } })
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
