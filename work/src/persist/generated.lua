-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Generated item tables: per board, one row of typed index values per item and a
-- set table for multi-value columns. Derived state only; always rebuildable. The
-- table descriptor names the system columns and composite indexes; the layout names
-- the indexed fields.
local sql = require("sql")
local bulk = require("bulk")
local storage = require("storage")
local types = require("types")

local M = {}

local function identifier(name: string): error?
    if not name:match("^[a-z][a-z0-9_]*$") or #name > 63 then
        return errors.new({ kind = errors.INTERNAL, message = "invalid generated identifier: " .. name, details = { code = "internal" } })
    end
    return nil
end

local function validate(t: types.GeneratedTable, before: types.Layout?): error?
    local names: { string } = { t.names.item, t.names.set, t.names.set .. "_lookup" }
    for _, system in ipairs(t.system) do names[#names + 1] = system.name end
    for n, index in ipairs(t.indexes) do
        names[#names + 1] = t.names.item .. "_s" .. n
        for _, column in ipairs(index) do names[#names + 1] = column end
    end
    for _, layout in ipairs({ t.layout, before }) do
        for _, list in ipairs({ layout.columns, layout.sets }) do
            for _, column in ipairs(list) do
                names[#names + 1] = column.column
                names[#names + 1] = t.names.item .. "_" .. column.column
            end
        end
    end
    for _, name in ipairs(names) do
        local err = identifier(name)
        if err then return err end
    end
    return nil
end

local function is_pg(dialect: string): boolean
    return dialect == sql.type.POSTGRES
end

local function exec(db: storage.Executor, statement: string): error?
    local _, err = db:execute(statement, {})
    return err
end

local function column_type(kind: string, pg: boolean): string
    if kind == "number" or kind == "int" then return pg and "bigint" or "INTEGER" end
    return pg and "text" or "TEXT"
end

-- create builds the generated tables of t.
function M.create(db: storage.Executor, dialect: string, t: types.GeneratedTable): error?
    local verr = validate(t)
    if verr then return verr end
    local pg = is_pg(dialect)
    local names, layout = t.names, t.layout
    local text_t = pg and "text" or "TEXT"
    local cols: { string } = { "item_id " .. text_t .. " NOT NULL PRIMARY KEY" }
    for _, s in ipairs(t.system) do cols[#cols + 1] = s.name .. " " .. column_type(s.kind, pg) .. " NOT NULL" end
    for _, c in ipairs(layout.columns) do cols[#cols + 1] = c.column .. " " .. column_type(c.kind, pg) end
    local stmts: { string } = {
        "CREATE TABLE " .. names.item .. " (" .. table.concat(cols, ", ") .. ")" .. (pg and "" or " STRICT"),
        "CREATE TABLE " .. names.set .. " (item_id " .. text_t .. " NOT NULL, col " .. text_t .. " NOT NULL, value_key "
            .. text_t .. " NOT NULL, PRIMARY KEY (item_id, col, value_key))" .. (pg and "" or " STRICT"),
        "CREATE INDEX " .. names.set .. "_lookup ON " .. names.set .. " (col, value_key)",
    }
    for n, index in ipairs(t.indexes) do
        local parts: { string } = {}
        for i, name in ipairs(index) do parts[i] = name end
        stmts[#stmts + 1] = "CREATE INDEX " .. (names.item .. "_s" .. n) .. " ON " .. names.item .. " (" .. table.concat(parts, ", ") .. ")"
    end
    for _, c in ipairs(layout.columns) do
        stmts[#stmts + 1] = "CREATE INDEX " .. (names.item .. "_" .. c.column) .. " ON " .. names.item .. " (" .. c.column .. ", item_id)"
    end
    for _, s in ipairs(stmts) do
        local err = exec(db, s)
        if err then return errors.wrap(err, "generated table create failed") end
    end
    return nil
end

local function by_column(list: { types.LayoutColumn }): { [string]: types.LayoutColumn }
    local out: { [string]: types.LayoutColumn } = {}
    for _, c in ipairs(list) do out[c.column] = c end
    return out
end

-- alter moves the generated tables of t from layout before to t.layout in
-- place. New columns start empty; the caller schedules the rebuild that fills them.
function M.alter(db: storage.Executor, dialect: string, t: types.GeneratedTable, before: types.Layout): error?
    local verr = validate(t, before)
    if verr then return verr end
    local pg = is_pg(dialect)
    local names, after = t.names, t.layout
    local stmts: { string } = {}
    local old, new = by_column(before.columns), by_column(after.columns)
    for name, c in pairs(old) do
        if not new[name] or new[name].kind ~= c.kind then
            stmts[#stmts + 1] = "DROP INDEX IF EXISTS " .. (names.item .. "_" .. name)
            stmts[#stmts + 1] = "ALTER TABLE " .. names.item .. " DROP COLUMN " .. name
        end
    end
    for name, c in pairs(new) do
        if not old[name] or old[name].kind ~= c.kind then
            stmts[#stmts + 1] = "ALTER TABLE " .. names.item .. " ADD COLUMN " .. name .. " " .. column_type(c.kind, pg)
            stmts[#stmts + 1] = "CREATE INDEX " .. (names.item .. "_" .. name) .. " ON " .. names.item .. " (" .. name .. ", item_id)"
        end
    end
    local new_sets = by_column(after.sets)
    for name in pairs(by_column(before.sets)) do
        if not new_sets[name] then stmts[#stmts + 1] = "DELETE FROM " .. names.set .. " WHERE col = '" .. name .. "'" end
    end
    for _, statement in ipairs(stmts) do
        local err = exec(db, statement)
        if err then return errors.wrap(err, "generated table alter failed") end
    end
    return nil
end

-- drop removes a board's generated tables.
function M.drop(db: storage.Executor, names: types.GeneratedNames): error?
    for _, name in ipairs({ names.set, names.item }) do
        local verr = identifier(name)
        if verr then return verr end
    end
    for _, name in ipairs({ names.set, names.item }) do
        local err = exec(db, "DROP TABLE IF EXISTS " .. name)
        if err then return errors.wrap(err, "generated table drop failed") end
    end
    return nil
end

-- delete_rows removes the generated rows of the given items.
function M.delete_rows(db: storage.Executor, t: types.GeneratedTable, ids: { string }): error?
    local verr = validate(t)
    if verr then return verr end
    local names = t.names
    local err = bulk.delete_in(db, names.item, nil, {}, "item_id", ids)
    if not err then err = bulk.delete_in(db, names.set, nil, {}, "item_id", ids) end
    return err
end

-- write_rows replaces the generated rows of a batch of items: one bulk
-- delete, then bulk inserts of item and set rows.
function M.write_rows(db: storage.Executor, t: types.GeneratedTable, rows: { types.IndexRow }): error?
    local ids: { string } = {}
    for i, row in ipairs(rows) do ids[i] = row.id end
    local err = M.delete_rows(db, t, ids)
    if err then return err end
    local names, layout = t.names, t.layout
    local columns: { storage.Column } = { { name = "item_id" } }
    for _, s in ipairs(t.system) do columns[#columns + 1] = { name = s.name } end
    for _, c in ipairs(layout.columns) do columns[#columns + 1] = { name = c.column } end
    local item_rows: { types.SqlParams } = {}
    local set_rows: { types.SqlParams } = {}
    for _, row in ipairs(rows) do
        local params: types.SqlParams = { row.id }
        for _, s in ipairs(t.system) do
            local v = row.system[s.name]
            if v == nil then return errors.new({ details = { code = "row_corrupt" }, kind = errors.INTERNAL, message = "generated row lacks system column " .. s.name }) end
            params[#params + 1] = v
        end
        for _, c in ipairs(layout.columns) do
            local v = row.values[c.column]
            if v == nil then params[#params + 1] = sql.NULL else params[#params + 1] = v end
        end
        item_rows[#item_rows + 1] = params
        for column, keys in pairs(row.sets) do
            for _, key in ipairs(keys) do set_rows[#set_rows + 1] = { row.id, column, key } end
        end
    end
    err = bulk.insert(db, names.item, columns, item_rows)
    if not err then err = bulk.insert(db, names.set, { { name = "item_id" }, { name = "col" }, { name = "value_key" } }, set_rows) end
    return err
end

return M
