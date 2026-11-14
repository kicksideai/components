-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- A generated table set with eight items for filter tree tests: each column holds a
-- value, a different value and no value. Items live in the fixed item table under a
-- board of their own.
local sql = require("sql")
local uuid = require("uuid")
local generated = require("generated")
local select = require("select")
local tables = require("tables")
local values = require("values")
local types = require("types")

type Map = { [string]: unknown }

local M = {}

M.ALL = 8

local BOARD = (uuid.v4()) :: string
M.BOARD = BOARD

local LAYOUT: types.Layout = {
    columns = {
        { field_id = 1, kind = "key", column = "f1" },
        { field_id = 2, kind = "number", column = "f2" },
        { field_id = 5, kind = "key", column = "f5" },
    },
    sets = { { field_id = 3, kind = "key", column = "f3" } },
}

local FIELDS: { [string]: types.ColumnTarget } = {
    color = { column = "f1", kind = "key", set = false, field_id = 1, shape = { form = "text", cardinality = "one", config = {} } },
    size = { column = "f2", kind = "number", set = false, field_id = 2, shape = { form = "int", cardinality = "one", config = {} } },
    at = { column = "f5", kind = "key", set = false, field_id = 5, shape = { form = "time", cardinality = "one", config = {} } },
    folded = { column = "f1", kind = "key", set = false, field_id = 1, shape = { form = "text", cardinality = "one", config = { case = "insensitive" } } },
    tags = { column = "f3", kind = "key", set = true, field_id = 3, shape = { form = "text", cardinality = "one", config = {} } },
}

local function resolve(code: string, _ctx: { [string]: string }?): (types.ColumnTarget?, error?)
    local t = FIELDS[code]
    if not t then return nil, errors.new({ kind = errors.INVALID, message = "unknown field " .. code }) end
    return t, nil
end
M.resolve = resolve

M.READER = { board_id = BOARD, actor = "u1", allows = function(wanted: string): boolean return wanted == "read" end }

local function exec(h: sql.DB, statement: string, params: { unknown }?)
    local _, err = h:execute(statement, params or {})
    assert(not err, tostring(err))
end

-- ROWS holds a value, a different value and no value for each column:
-- r1..r3 are moss, r4..r6 slate, r7 and r8 empty.
local ROWS: { Map } = {
    { color = "moss", size = 10, at = "2026-01-01T00:00:00Z", tags = { "a", "b" } },
    { color = "moss", size = 20, at = "2026-02-01T00:00:00Z", tags = { "a" } },
    { color = "moss-green", size = 30, at = "2026-03-01T00:00:00Z", tags = { "c" } },
    { color = "slate", size = 40, at = "2026-04-01T00:00:00Z", tags = { "c" } },
    { color = "slate", size = 50, tags = { "d" } },
    { color = "dark 100% _slate", size = 60, tags = {} },
    { tags = { "a" } },
    { tags = {} },
}

-- reset clears a board's rows from the fixed tables.
function M.reset(h: sql.DB, board: string)
    for _, name in ipairs({ "kickside_work_item", "kickside_work_link", "kickside_work_change" }) do
        exec(h, "DELETE FROM " .. name .. " WHERE board_id = $1", { board })
    end
end

-- item writes the fixed row of one item.
function M.item(h: sql.DB, board: string, id: string, number: integer)
    exec(h, [[INSERT INTO kickside_work_item (board_id, item_id, number, type, state, category, process_generation, visit, path, version, life,
        document, created_seq, updated_seq, created_at, updated_at) VALUES ($1, $2, $3, 'task', 'open', 'started', 1, 1, $4, 1, 'live', '{}', 1, 1, '', '')]],
        { board, id, number, "/" .. id .. "/" })
end

function M.table(h: sql.DB): types.GeneratedTable
    local t: types.GeneratedTable = { names = tables.names(BOARD), layout = LAYOUT, system = { { name = "life", kind = "text" } }, indexes = {}, relations = {} }
    assert(not generated.drop(h, t.names))
    M.reset(h, BOARD)
    assert(not generated.create(h, h:type(), t))
    local rows: { types.IndexRow } = {}
    for i, r in ipairs(ROWS) do
        local id = "r" .. i
        M.item(h, BOARD, id, i)
        rows[i] = { id = id, system = { life = "live" },
            values = { f1 = r.color :: string?, f2 = r.size :: integer?,
                f5 = r.at and (assert((values.key("time", r.at :: string, {})))) or nil },
            sets = { f3 = r.tags :: { string } } }
    end
    assert(not generated.write_rows(h, t, rows))
    return t
end

-- run_as answers where for a reader with the given actor.
function M.run_as(h: sql.DB, t: types.GeneratedTable, where: Map, actor: string?): (string?, error?)
    local reader: types.Reader = { board_id = BOARD, actor = actor, allows = M.READER.allows }
    local plan, err = select.items(reader, t, h:type(), { where = where }, resolve, {}, {}, 50)
    if err or not plan then return nil, err end
    local executor = assert(plan.query:run_with(h))
    local rows = assert(executor:query())
    local out: { string } = {}
    for i, r in ipairs(rows) do out[i] = tostring(r.item_id) end
    table.sort(out)
    return table.concat(out, ","), nil
end

function M.run(h: sql.DB, t: types.GeneratedTable, where: Map): (string?, error?)
    return M.run_as(h, t, where, M.READER.actor)
end

-- reindex rewrites one item's time column through the value's key form.
function M.reindex(h: sql.DB, t: types.GeneratedTable, id: string, at: string): error?
    local key, kerr = values.key("time", at, {})
    if kerr then return kerr end
    local _, err = h:execute("UPDATE " .. t.names.item .. " SET f5 = $1 WHERE item_id = $2", { key, id })
    return err
end

function M.ids(h: sql.DB, t: types.GeneratedTable, where: Map): string
    local out, err = M.run(h, t, where)
    assert(out, tostring(err))
    return out
end

function M.leaf(field: string, op: string, value: unknown): Map
    return { field = field, op = op, value = value }
end

function M.db(): sql.DB
    local h, err = sql.get("app:db")
    assert(h, tostring(err))
    return h
end


return M
