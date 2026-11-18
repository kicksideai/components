-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- A generated table set with eight items for filter tree tests: each column
-- holds a value, a different value and no value.
local sql = require("sql")
local layout = require("layout")
local select = require("select")
local values = require("values")
local types = require("types")

type Map = { [string]: unknown }

local M = {}

M.ALL = 8

local CATALOG = "catalog-tree"

local LAYOUT: types.Layout = {
    columns = {
        { attribute_id = 1, ctx = "", kind = "key", column = "f1" },
        { attribute_id = 2, ctx = "", kind = "number", column = "f2" },
        { attribute_id = 5, ctx = "", kind = "key", column = "f5" },
    },
    sets = { { attribute_id = 3, ctx = "", kind = "key", column = "f3" } },
    search = {},
    flags = {},
}

local FIELDS: { [string]: types.Target } = {
    color = { column = "f1", kind = "key", set = false, shape = { form = "text", cardinality = "one", config = {} } },
    size = { column = "f2", kind = "number", set = false, shape = { form = "int", cardinality = "one", config = {} } },
    at = { column = "f5", kind = "key", set = false, shape = { form = "time", cardinality = "one", config = {} } },
    folded = { column = "f1", kind = "key", set = false, shape = { form = "text", cardinality = "one", config = { case = "insensitive" } } },
    tags = { column = "f3", kind = "key", set = true, shape = { form = "text", cardinality = "one", config = {} } },
}

local function resolve(code: string, _ctx: { [string]: string }?): (types.Target?, error?)
    local t = FIELDS[code]
    if not t then return nil, errors.new({ kind = errors.INVALID, message = "unknown field " .. code }) end
    return t, nil
end
M.resolve = resolve

M.READER = { catalog_id = CATALOG, actor = "u1", allows = function(wanted: string): boolean return wanted == "read" end }

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

function M.table(h: sql.DB): types.Table
    local t: types.Table = { names = layout.names(CATALOG), layout = LAYOUT }
    assert(not layout.drop(h, t.names))
    exec(h, "DELETE FROM kickside_pim_product WHERE catalog_id = $1", { CATALOG })
    assert(not layout.create(h, h:type(), t))
    local rows: { types.ItemRow } = {}
    for i, r in ipairs(ROWS) do
        local id = "r" .. i
        exec(h, [[INSERT INTO kickside_pim_product (catalog_id, product_id, sku, family, root_id, level, is_item, version, status, state,
            document, source_seq, created_seq, updated_seq) VALUES ($1, $2, $3, 'f', $4, 0, 1, 1, 'active', 'live', '{}', '{}', 1, 1)]],
            { CATALOG, id, "C-" .. i, id })
        rows[i] = { id = id, system = { root_id = id, family = "f", status = "active", version = 1, updated_seq = 1, findings = "{}", sku_fold = "c-" .. i },
            values = { f1 = r.color :: string?, f2 = r.size :: integer?,
                f5 = r.at and (assert((values.key("time", r.at :: string, {})))) or nil },
            sets = { f3 = r.tags :: { string } }, flags = {} }
    end
    assert(not layout.write_rows(h, h:type(), t, rows))
    return t
end

-- run_as answers where for a reader with the given actor.
function M.run_as(h: sql.DB, t: types.Table, where: Map, actor: string?): (string?, error?)
    local reader: types.Reader = { catalog_id = CATALOG, actor = actor, allows = M.READER.allows }
    local plan, err = select.items(reader, t, h:type(), { where = where }, resolve, {}, {}, { "status" })
    if err or not plan then return nil, err end
    local rows, _, qerr = select.rows(h, plan, 50)
    if qerr or not rows then return nil, qerr end
    local out: { string } = {}
    for i, r in ipairs(rows) do out[i] = tostring(r.product_id) end
    table.sort(out)
    return table.concat(out, ","), nil
end

function M.run(h: sql.DB, t: types.Table, where: Map): (string?, error?)
    return M.run_as(h, t, where, M.READER.actor)
end

-- reindex rewrites one item's time column through the value's key form.
function M.reindex(h: sql.DB, t: types.Table, id: string, at: string): error?
    local key, kerr = values.key("time", at, {})
    if kerr then return kerr end
    local _, err = h:execute("UPDATE " .. t.names.item .. " SET f5 = $1 WHERE product_id = $2", { key, id })
    return err
end

function M.ids(h: sql.DB, t: types.Table, where: Map): string
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
