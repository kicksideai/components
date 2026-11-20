-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local registry_values = require("registry_values")
-- Scope declarations: a kickside.work.scope registry entry names a plugin table in
-- the board database and the columns items may be filtered by. Declarations hold
-- identifiers only; Work writes the SQL.
local registry = require("registry")
local sql = require("sql")
local search_text = require("search_text")
local types = require("types")
local cursor_reader = require("cursor_reader")

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

function M.projection(id: string, meta: { [string]: unknown }): (types.ScopeProjection?, error?)
    if meta.projection == nil then return nil, nil end
    if type(meta.projection) ~= "string" or meta.projection == "" or type(meta.plugin) ~= "string" or meta.plugin == "" then
        return nil, invalid(id .. " projection names a kind on its owning plugin")
    end
    return { plugin = meta.plugin, kind = meta.projection }, nil
end

-- Read the cursor in the same snapshot as the index it fences.
function M.fence(tx: sql.DB | sql.Transaction, board_id: string, projection: types.ScopeProjection, min_seq: integer): error?
    local pair, err = cursor_reader.find_projection_cursor(tx, board_id, {
        kind = projection.kind, projection_key = "kickside.work.plugin:" .. projection.plugin,
    })
    if err and not errors.is(err, errors.NOT_FOUND) then return err end
    local last_seq = pair and (pair :: { cursor: { last_seq: integer } }).cursor.last_seq or 0
    if last_seq < min_seq then
        return errors.new({ kind = errors.UNAVAILABLE, retryable = true, message = "plugin projection has not reached seq " .. min_seq,
            details = { code = "projection_pending", min_seq = min_seq, applied_seq = last_seq } })
    end
    return nil
end

-- load reads and checks the scope entry id.
function M.load(id: string): (types.Scope?, error?)
    local entry, err = registry.get(id)
    if err and err:kind() ~= errors.NOT_FOUND then return nil, err end
    if not entry then return nil, invalid("unknown scope " .. id) end
    local meta = registry_values.canonical(entry.meta)
    if type(meta) ~= "table" then return nil, invalid(id .. " is not a work scope") end
    local m = meta :: { [string]: unknown }
    if m.type ~= M.TYPE then return nil, invalid(id .. " is not a work scope") end
    local projection, perr = M.projection(id, m)
    if perr then return nil, perr end
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
    local match: { string } = {}
    if m.match ~= nil then
        if type(m.match) ~= "table" or #m.match == 0 or #m.match > 16 then
            return nil, invalid("match declares 1..16 text columns")
        end
        local seen: { [string]: boolean } = {}
        for _, raw in ipairs(m.match) do
            local column = identifier(raw)
            if not column or seen[column] then return nil, invalid("match columns are distinct identifiers") end
            match[#match + 1], seen[column] = column, true
        end
    end
    return { id = id, table = table_name, board_column = board_column, item_column = item_column, filters = filters,
        access = access, match = match, projection = projection }, nil
end

-- write_search replaces one plugin-owned search projection row. The plugin
-- owns the table and supplies its transaction and original text.
function M.write_search(tx: sql.DB | sql.Transaction, id: string, board_id: string, item_id: string,
    text: { [string]: string }): error?
    local scope, err = M.load(id)
    if err or not scope then return err end
    if #scope.match == 0 then return invalid(id .. " has no SQL search columns") end
    local columns = { scope.board_column, scope.item_column }
    local bindings: { unknown } = { board_id, item_id }
    local marks = { "$1", "$2" }
    local assignments: { string } = {}
    for _, column in ipairs(scope.match) do
        if column == scope.board_column or column == scope.item_column then return invalid("search projection text uses separate columns") end
        local raw = text[column]
        local folded = type(raw) == "string" and search_text.fold(raw) or nil
        if not folded then return invalid(column .. " takes UTF-8 text without NUL bytes") end
        columns[#columns + 1], bindings[#bindings + 1] = column, folded
        marks[#marks + 1] = "$" .. #bindings
        assignments[#assignments + 1] = column .. " = excluded." .. column
    end
    local _, write_err = tx:execute("INSERT INTO " .. scope.table .. " (" .. table.concat(columns, ", ") .. ") VALUES ("
        .. table.concat(marks, ", ") .. ") ON CONFLICT (" .. scope.board_column .. ", " .. scope.item_column
        .. ") DO UPDATE SET " .. table.concat(assignments, ", "), bindings)
    return write_err
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
        if scope.projection and r.scope_fence then
            local pending = r.scope_fence(scope.projection)
            if pending then return nil, pending end
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
