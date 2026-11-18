-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Generated item tables (spec 5.4): per catalog, one row of typed index values
-- per item, a set table for multi-value columns, and the dialect's full-text
-- structure. Derived state only; always rebuildable. Every item row keeps the
-- system columns; the catalog's layout declares the indexed attributes.
local hash = require("hash")
local sql = require("sql")
local bulk = require("bulk")
local types = require("types")
local search = require("search")

local M = {}

local SYSTEM: { types.SystemColumn } = {
    { name = "root_id", kind = "text" }, { name = "family", kind = "text" }, { name = "status", kind = "text" },
    { name = "version", kind = "int" }, { name = "updated_seq", kind = "int" }, { name = "findings", kind = "text" },
    { name = "sku_fold", kind = "text" },
}
local INDEXES: { { string } } = { { "root_id" }, { "family", "status" } }

local function ident(name: string): string
    if not name:match("^[a-z][a-z0-9_]*$") or #name > 63 then error(errors.new({ details = { code = "internal" }, kind = errors.INTERNAL, message = "invalid generated identifier: " .. name })) end
    return name
end

local function is_pg(dialect: string): boolean
    return dialect == sql.type.POSTGRES
end

local function exec(db: types.Executor, statement: string): error?
    local _, err = db:execute(statement, {})
    return err
end

-- Each layout replacement builds under a fresh base.
function M.names(catalog_id: string, generation: integer?): types.Names
    local token = tostring(hash.sha256(catalog_id)):gsub("[^a-fA-F0-9]", ""):lower():sub(1, 16)
    local suffix = generation and ("_g" .. generation) or ""
    return M.from_base("pim_" .. token .. suffix)
end

-- from_base derives the table names of a stored table-set base.
function M.from_base(base: string): types.Names
    return { base = ident(base), item = ident(base .. "_item"), set = ident(base .. "_set"), fts = ident(base .. "_fts") }
end

-- of returns the descriptor of a catalog's generated tables at base with layout l.
function M.of(base: string, l: types.Layout): types.Table
    return { names = M.from_base(base), layout = l }
end

local function column_type(kind: string, pg: boolean): string
    if kind == "number" or kind == "flag" or kind == "int" then return pg and "bigint" or "INTEGER" end
    return pg and "text" or "TEXT"
end

-- typed lists the generated scalar columns: index values, then flags.
local function typed(layout: types.Layout): { types.Column }
    local out: { types.Column } = {}
    for _, c in ipairs(layout.columns) do out[#out + 1] = c end
    for _, c in ipairs(layout.flags) do out[#out + 1] = c end
    return out
end

local function fts_create(names: types.Names): string
    return "CREATE VIRTUAL TABLE " .. names.fts .. " USING fts5(body, tokenize = 'ascii')"
end

local function scalar_indexes(stmts: { string }, item: string, column: types.Column)
    local name = ident(item .. "_" .. column.column)
    local key = ident(column.column)
    stmts[#stmts + 1] = "CREATE INDEX " .. name .. " ON " .. item .. " (" .. key .. ", product_id)"
    -- Descending values still break ties by ascending product ID.
    if column.kind ~= "flag" then
        stmts[#stmts + 1] = "CREATE INDEX " .. ident(name .. "_desc") .. " ON " .. item .. " (" .. key
            .. " DESC, product_id) WHERE " .. key .. " IS NOT NULL"
    end
end

-- create builds the generated tables of t.
function M.create(db: types.Executor, dialect: string, t: types.Table): error?
    local pg = is_pg(dialect)
    local names, layout = t.names, t.layout
    local text_t = pg and "text" or "TEXT"
    local cols: { string } = { "product_id " .. text_t .. " NOT NULL PRIMARY KEY" }
    for _, s in ipairs(SYSTEM) do cols[#cols + 1] = ident(s.name) .. " " .. column_type(s.kind, pg) .. " NOT NULL" end
    for _, c in ipairs(typed(layout)) do cols[#cols + 1] = ident(c.column) .. " " .. column_type(c.kind, pg) end
    if pg and #layout.search > 0 then cols[#cols + 1] = "search text[]" end
    local stmts: { string } = {
        "CREATE TABLE " .. names.item .. " (" .. table.concat(cols, ", ") .. ")" .. (pg and "" or " STRICT"),
        "CREATE TABLE " .. names.set .. " (product_id " .. text_t .. " NOT NULL, col " .. text_t .. " NOT NULL, value_key "
            .. text_t .. " NOT NULL, PRIMARY KEY (product_id, col, value_key))" .. (pg and "" or " STRICT"),
        "CREATE INDEX " .. names.set .. "_lookup ON " .. names.set .. " (col, value_key, product_id)",
    }
    for n, index in ipairs(INDEXES) do
        local parts: { string } = {}
        for i, name in ipairs(index) do parts[i] = ident(name) end
        stmts[#stmts + 1] = "CREATE INDEX " .. ident(names.item .. "_s" .. n) .. " ON " .. names.item .. " (" .. table.concat(parts, ", ") .. ")"
    end
    for _, c in ipairs(typed(layout)) do
        scalar_indexes(stmts, names.item, c)
    end
    if #layout.search > 0 then
        stmts[#stmts + 1] = pg and ("CREATE INDEX " .. names.item .. "_search ON " .. names.item .. " USING GIN (search)") or fts_create(names)
    end
    for _, s in ipairs(stmts) do
        local err = exec(db, s)
        if err then return errors.wrap(err, "generated table create failed") end
    end
    return nil
end

local function by_column(list: { types.Column }): { [string]: types.Column }
    local out: { [string]: types.Column } = {}
    for _, c in ipairs(list) do out[c.column] = c end
    return out
end

local function same_column(previous: types.Column?, current: types.Column): boolean
    return previous ~= nil and previous.kind == current.kind
        and previous.attribute_id == current.attribute_id and previous.ctx == current.ctx
end

local function same_columns(before: { types.Column }, after: { types.Column }): boolean
    if #before ~= #after then return false end
    local previous = by_column(before)
    for _, column in ipairs(after) do
        if not same_column(previous[column.column], column) then return false end
    end
    return true
end

function M.same(before: types.Layout, after: types.Layout): boolean
    return same_columns(before.columns, after.columns) and same_columns(before.sets, after.sets)
        and same_columns(before.search, after.search) and same_columns(before.flags, after.flags)
end

function M.active(catalog: types.Catalog): types.Table
    local storage = catalog.rebuild_storage
    return M.of(catalog.item_table, storage and storage.active or catalog.compiled.layout)
end

-- A shared text index must be rebuilt even when a contributor is removed.
-- The other index types are matched by their logical identity and storage.
function M.pending_columns(before: types.Layout, after: types.Layout, pending: { string },
    changed_readiness: { [string]: boolean }): { string }
    local owed: { [string]: boolean } = {}
    for _, name in ipairs(pending) do owed[name] = true end
    local out: { string } = {}
    for _, pair in ipairs({ { before.columns, after.columns }, { before.sets, after.sets }, { before.flags, after.flags } }) do
        local previous = by_column(pair[1])
        for _, column in ipairs(pair[2]) do
            local name = column.column
            if owed[name] or not same_column(previous[name], column) or (column.kind == "flag" and changed_readiness[column.ctx]) then
                out[#out + 1] = name
            end
        end
    end
    local search_changed = not same_columns(before.search, after.search)
    for _, column in ipairs(after.search) do
        if search_changed or owed[column.column] then out[#out + 1] = column.column end
    end
    table.sort(out)
    return out
end

-- drop removes a catalog's generated tables.
function M.drop(db: types.Executor, names: types.Names): error?
    for _, name in ipairs({ names.fts, names.set, names.item }) do
        local err = exec(db, "DROP TABLE IF EXISTS " .. name)
        if err then return errors.wrap(err, "generated table drop failed") end
    end
    return nil
end

-- read_row returns the generated row of one item, or nil when it has none.
function M.read_row(db: types.Executor, t: types.Table, id: string): (types.Row?, error?)
    local rows, err = db:query("SELECT * FROM " .. t.names.item .. " WHERE product_id = $1", { id })
    if err then return nil, errors.wrap(err, "generated row read failed") end
    return rows and rows[1] or nil, nil
end

-- delete_rows removes the generated rows of the given items.
function M.delete_rows(db: types.Executor, dialect: string, t: types.Table, ids: { string }): error?
    local names = t.names
    if not is_pg(dialect) and #t.layout.search > 0 then
        for first=1,#ids,1000 do
            local params:types.SqlParams={}
            local marks:{string}={}
            for n=first,math.min(first+999,#ids) do
                params[#params+1]=ids[n];marks[#marks+1]="$"..#params
            end
            local _,err=db:execute("DELETE FROM "..names.fts.." WHERE rowid IN (SELECT rowid FROM "..names.item.." WHERE product_id IN ("..table.concat(marks,",").."))",params)
            if err then return err end
        end
    end
    local err = bulk.delete_in(db, names.item, nil, {}, "product_id", ids)
    if not err then err = bulk.delete_in(db, names.set, nil, {}, "product_id", ids) end
    return err
end

-- write_rows replaces the generated rows of a batch of items: one bulk
-- delete, then bulk inserts of item, set and search rows.
function M.write_rows(db: types.Executor, dialect: string, t: types.Table, rows: { types.ItemRow },
    computed: types.Layout?): error?
    local ids: { string } = {}
    for i, row in ipairs(rows) do ids[i] = row.id end
    local err = M.delete_rows(db, dialect, t, ids)
    if err then return err end
    local pg = is_pg(dialect)
    local names, physical = t.names, t.layout
    local desired = computed or physical
    local columns: { bulk.Column } = { { name = "product_id" } }
    for _, s in ipairs(SYSTEM) do columns[#columns + 1] = { name = s.name } end
    local typed_columns: { types.Column } = {}
    local available = by_column(typed(desired))
    for _, c in ipairs(typed(physical)) do
        if same_column(available[c.column], c) then
            typed_columns[#typed_columns + 1] = c
            columns[#columns + 1] = { name = c.column }
        end
    end
    local set_columns = by_column(physical.sets)
    local desired_sets = by_column(desired.sets)
    local searchable = #physical.search > 0 and same_columns(physical.search, desired.search)
    if pg and searchable then columns[#columns + 1] = { name = "search", expr = "string_to_array(%s, ' ')" } end
    local item_rows: { types.SqlParams } = {}
    local set_rows: { types.SqlParams } = {}
    local fts_rows: { types.SqlParams } = {}
    for _, row in ipairs(rows) do
        local params: types.SqlParams = { row.id }
        for _, s in ipairs(SYSTEM) do
            local v = row.system[s.name]
            if v == nil then return errors.new({ details = { code = "internal" }, kind = errors.INTERNAL, message = "generated row lacks system column " .. s.name }) end
            params[#params + 1] = v
        end
        for _, c in ipairs(typed_columns) do
            local v: types.ColumnValue?
            if c.kind == "flag" then v = row.flags[c.column] else v = row.values[c.column] end
            if v == nil then params[#params + 1] = sql.NULL else params[#params + 1] = v end
        end
        local body = searchable and search.body(row.text or "") or ""
        if pg and searchable then params[#params + 1] = body end
        item_rows[#item_rows + 1] = params
        for column, keys in pairs(row.sets) do
            if desired_sets[column] and same_column(set_columns[column], desired_sets[column]) then
                for _, key in ipairs(keys) do set_rows[#set_rows + 1] = { row.id, column, key } end
            end
        end
        if not pg and searchable and body ~= "" then fts_rows[#fts_rows + 1] = { row.id, body } end
    end
    err = bulk.insert(db, names.item, columns, item_rows)
    if not err then err = bulk.insert(db, names.set, { { name = "product_id" }, { name = "col" }, { name = "value_key" } }, set_rows) end
    if not err then err = bulk.insert(db, names.fts, { { name="rowid",expr="(SELECT rowid FROM "..names.item.." WHERE product_id=%s)" }, { name = "body" } }, fts_rows) end
    return err
end

return M
