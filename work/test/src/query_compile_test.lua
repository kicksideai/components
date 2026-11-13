-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Generated tables and the query compiler on both engines: create a table set from a
-- layout, write rows, filter by key, number and set columns, sort with nulls last and
-- keyset paging, add conditions, apply scopes, and alter the layout in place.
local test = require("test")
local sql = require("sql")
local generated = require("generated")
local select = require("select")
local scopes = require("scopes")
local tables = require("tables")
local fixtures = require("filter_fixture")
local types = require("types")

type Map = { [string]: unknown }

local OWNER = "00000000-0000-0000-0000-00000000000d"

local LAYOUT: types.Layout = {
    columns = {
        { field_id = 1, kind = "key", column = "f1" },
        { field_id = 2, kind = "number", column = "f2" },
    },
    sets = { { field_id = 3, kind = "key", column = "f3" } },
}

local FIELDS: { [string]: types.ColumnTarget } = {
    color = { column = "f1", kind = "key", set = false, shape = { form = "text", cardinality = "one", config = {} } },
    size = { column = "f2", kind = "number", set = false, shape = { form = "int", cardinality = "one", config = {} } },
    tags = { column = "f3", kind = "key", set = true, shape = { form = "text", cardinality = "one", config = {} } },
    shade = { column = "f1", kind = "key", set = false, shape = { form = "text", cardinality = "one", config = {} },
        coerce = function(raw: unknown): (unknown, error?) return type(raw) == "string" and raw:lower() or raw, nil end },
}

local function resolve(code: string, _ctx: { [string]: string }?): (types.ColumnTarget?, error?)
    local t = FIELDS[code]
    if not t then return nil, errors.new({ kind = errors.INVALID, message = "unknown field " .. code }) end
    return t, nil
end

local function reader(level: string): types.Reader
    return { board_id = OWNER, allows = function(wanted: string): boolean
        return wanted == "read" or wanted == level
    end }
end

local function db(): sql.DB
    local h, err = sql.get("app:db")
    assert(h, tostring(err))
    return h
end

local function exec(h: sql.DB, statement: string, params: { unknown }?)
    local _, err = h:execute(statement, params or {})
    assert(not err, tostring(err))
end

-- fixture builds a fresh table set and ten items r01..r10.
local function fixture(h: sql.DB): types.GeneratedTable
    local t: types.GeneratedTable = { names = tables.names(OWNER), layout = LAYOUT, system = { { name = "life", kind = "text" }, { name = "version", kind = "int" } },
        indexes = { { "life" } }, relations = {} }
    assert(not generated.drop(h, t.names))
    fixtures.reset(h, OWNER)
    exec(h, "DELETE FROM kickside_work_item WHERE board_id = $1", { "00000000-0000-0000-0000-00000000000c" })
    assert(not generated.create(h, h:type(), t))
    local rows: { types.IndexRow } = {}
    for i = 1, 10 do
        local id = string.format("r%02d", i)
        fixtures.item(h, OWNER, id, i)
        local values: { [string]: types.ColumnValue } = { f1 = i % 2 == 0 and "moss" or "slate" }
        if i <= 8 then values.f2 = 100 - i * 10 end
        rows[#rows + 1] = { id = id, system = { life = i == 10 and "draft" or "live", version = 1 }, values = values,
            sets = { f3 = i <= 3 and { "a", "b" } or { "c" } } }
    end
    assert(not generated.write_rows(h, t, rows))
    return t
end

local function run(h: sql.DB, t: types.GeneratedTable, q: types.ItemQuery, opts: Map?): ({ string }?, types.Cursor?, error?)
    local o: Map = opts or {}
    local plan, err = select.items(reader(o.level :: string? or "read"), t, h:type(), q, resolve,
        (o.admitted :: { types.AdmittedScope }?) or {}, (o.conditions :: { types.Condition }?) or {}, (o.limit :: integer?) or 50)
    if err or not plan then return nil, nil, err end
    local executor = assert(plan.query:run_with(h))
    local rows = assert(executor:query())
    local limit: integer = (o.limit :: integer?) or 50
    local out: { string } = {}
    for i = 1, math.min(#rows, limit) do out[i] = tostring(rows[i].item_id) end
    local after: types.Cursor? = nil
    if #rows > limit then
        local last = rows[limit]
        local v: types.ColumnValue? = nil
        local raw = last.sort_value
        if type(raw) == "number" then v = math.tointeger(raw) elseif type(raw) == "string" then v = raw end
        after = { id = tostring(last.item_id), v = v }
    end
    return out, after, nil
end

local function ids(h: sql.DB, t: types.GeneratedTable, q: types.ItemQuery, opts: Map?): { string }
    local out, _, err = run(h, t, q, opts)
    assert(out, tostring(err))
    return out
end

local function drain(h: sql.DB, t: types.GeneratedTable, q: types.ItemQuery, limit: integer): { string }
    local out: { string } = {}
    local after: types.Cursor? = nil
    for _ = 1, 30 do
        local page_q: types.ItemQuery = { where = q.where, sorts = q.sorts, after = after }
        local page, next_after, err = run(h, t, page_q, { limit = limit })
        assert(page, tostring(err))
        for _, id in ipairs(page) do out[#out + 1] = id end
        after = next_after
        if not after then return out end
    end
    error("paging did not end")
end

local function define()
    test.describe("checked generated layout", function()
        test.it("returns malformed identifiers through the result protocol before SQL", function()
            local fake: unknown = { execute = function(_self: unknown, _statement: string, _args: unknown): (unknown, error?)
                error("invalid layout reaches SQL")
            end }
            local layout: types.Layout = { columns = { { field_id = 1, kind = "key", column = "not-a-column" } }, sets = {} }
            local err = generated.create(fake :: sql.DB, sql.type.SQLITE, tables.of(OWNER, layout))
            test.not_nil(err)
            test.eq(err:kind(), errors.INTERNAL)
            test.eq(err:details().code, "internal")
        end)
    end)

    test.describe("generated tables and queries", function()
        test.it("filters key, number and set columns and refuses bad requests", function()
            local h = db()
            local t = fixture(h)
            test.eq(#ids(h, t, { where = { field = "color", op = "eq", value = "moss" } }), 5)
            test.eq(#ids(h, t, { where = { field = "size", op = "gte", value = 50 } }), 5)
            test.eq(#ids(h, t, { where = { field = "size", op = "in", value = { 90, 20 } } }), 2)
            test.eq(#ids(h, t, { where = { field = "tags", op = "in", value = { "b", "z" } } }), 3)
            test.eq(#ids(h, t, { where = { field = "shade", op = "eq", value = "MOSS" } }), 5)
            test.eq(#ids(h, t, { where = { ["and"] = { { field = "color", op = "eq", value = "moss" }, { field = "size", op = "lt", value = 50 } } } }), 2)
            for _, bad in ipairs({
                { where = { field = "nope", op = "eq", value = 1 } },
                { where = { field = "size", op = "ne", value = 1 } },
                { where = { field = "size", op = "eq", value = "x" } },
                { where = { field = "size", op = "in", value = {} } },
                { where = { field = "tags", op = "lt", value = "a" } },
                { sorts = { { field = "tags" } } },
            } :: { types.ItemQuery }) do
                local _, _, err = run(h, t, bad)
                test.not_nil(err)
            end
            h:release()
        end)

        test.it("applies conditions over both aliases", function()
            local h = db()
            local t = fixture(h)
            test.eq(#ids(h, t, {}, { conditions = { { sql = "i.life = ?", args = { "draft" } } } }), 1)
            test.eq(#ids(h, t, {}, { conditions = { { sql = "i.life = ?", args = { "live" } }, { sql = "r.number <> ?", args = { 3 } } } }), 8)
            h:release()
        end)

        test.it("sorts nulls last in both directions and pages without overlap", function()
            local h = db()
            local t = fixture(h)
            local up = drain(h, t, { sorts = { { field = "size" } } }, 3)
            test.eq(#up, 10)
            test.eq(up[1], "r08")
            test.eq(up[8], "r01")
            local down = drain(h, t, { sorts = { { field = "size", dir = "desc" } } }, 3)
            test.eq(down[1], "r01")
            test.eq(down[8], "r08")
            test.is_true((down[9] == "r09" or down[9] == "r10") and (down[10] == "r09" or down[10] == "r10"))
            local plain = drain(h, t, {}, 4)
            test.eq(#plain, 10)
            test.eq(plain[1], "r01")
            local ties = drain(h, t, { sorts = { { field = "color" } } }, 2)
            local seen: { [string]: boolean } = {}
            for _, id in ipairs(ties) do
                test.is_nil(seen[id])
                seen[id] = true
            end
            test.eq(#ties, 10)
            h:release()
        end)

        test.it("applies admitted scopes and refuses scopes above the reader's access", function()
            local h = db()
            local t = fixture(h)
            exec(h, "DROP TABLE IF EXISTS rt_stock")
            exec(h, "CREATE TABLE rt_stock (board_id TEXT NOT NULL, item_id TEXT NOT NULL, available INTEGER NOT NULL)")
            exec(h, "INSERT INTO rt_stock (board_id, item_id, available) VALUES ($1, $2, $3), ($4, $5, $6), ($7, $8, $9)",
                { OWNER, "r01", 4, OWNER, "r02", 0, "other", "r03", 9 })
            local admitted = assert(scopes.admit(reader("read"), { { id = "app:stock", where = { available = { gt = 0 } } } }))
            local found = ids(h, t, {}, { admitted = admitted })
            test.eq(#found, 1)
            test.eq(found[1], "r01")
            local _, denied = scopes.admit(reader("read"), { { id = "app:stock_admin", where = {} } })
            test.not_nil(denied)
            test.not_nil((scopes.admit(reader("admin"), { { id = "app:stock_admin", where = {} } })))
            for _, bad in ipairs({ { id = "app:nope", where = {} }, { id = "app:hostile", where = {} } } :: { types.ScopeQuery }) do
                local _, err = scopes.admit(reader("admin"), { bad })
                test.not_nil(err)
            end
            local wrong_op = assert(scopes.admit(reader("read"), { { id = "app:stock", where = { available = { lt = 3 } } } }))
            local _, _, err = run(h, t, {}, { admitted = wrong_op })
            test.not_nil(err)
            h:release()
        end)

        test.it("alters a layout in place and drops the table set", function()
            local h = db()
            local t = fixture(h)
            local after: types.Layout = {
                columns = { { field_id = 1, kind = "key", column = "f1" }, { field_id = 5, kind = "number", column = "f5" } },
                sets = {},
            }
            local before = t.layout
            t.layout = after
            assert(not generated.alter(h, h:type(), t, before))
            test.eq(#ids(h, t, { where = { field = "color", op = "eq", value = "moss" } }), 5)
            local _, gone = h:query("SELECT f2 FROM " .. t.names.item, {})
            test.not_nil(gone)
            exec(h, "UPDATE " .. t.names.item .. " SET f5 = 7")
            assert(not generated.delete_rows(h, t, { "r01", "r02" }))
            local rows = assert(h:query("SELECT COUNT(*) AS n FROM " .. t.names.item, {}))
            test.eq(math.tointeger(tonumber(rows[1].n)), 8)
            assert(not generated.drop(h, t.names))
            local _, dropped = h:query("SELECT 1 FROM " .. t.names.item, {})
            test.not_nil(dropped)
            h:release()
        end)
    end)
    test.describe("generated table edges", function()
        test.it("derives stable names per board", function()
            test.is_false(tables.names("o1").item == tables.names("o2").item)
        end)

        test.it("replaces an item's rows on rewrite", function()
            local h = db()
            local t = fixture(h)
            assert(not generated.write_rows(h, t, { { id = "r01", system = { life = "live", version = 2 }, values = { f1 = "clay" },
                sets = { f3 = { "z" } } } }))
            test.eq(#ids(h, t, { where = { field = "color", op = "eq", value = "clay" } }), 1)
            test.eq(#ids(h, t, { where = { field = "tags", op = "has", value = "a" } }), 2)
            test.eq(#ids(h, t, { where = { field = "tags", op = "has", value = "z" } }), 1)
            h:release()
        end)

        test.it("refuses a row without a system value", function()
            local h = db()
            local t = fixture(h)
            local err = generated.write_rows(h, t, { { id = "x", system = { life = "live" }, values = {}, sets = {} } })
            test.not_nil(err)
            test.eq((err :: error):kind(), errors.INTERNAL)
            h:release()
        end)

        test.it("removes an item's set rows with its row", function()
            local h = db()
            local t = fixture(h)
            assert(not generated.delete_rows(h, t, { "r05", "r01" }))
            test.eq(#ids(h, t, { where = { field = "tags", op = "has", value = "a" } }), 2)
            h:release()
        end)

        test.it("keeps a column whose kind stays and rebuilds one whose kind changes", function()
            local h = db()
            local t = fixture(h)
            local before = t.layout
            t.layout = { columns = { { field_id = 1, kind = "number", column = "f1" }, before.columns[2] }, sets = before.sets }
            assert(not generated.alter(h, h:type(), t, before))
            local rows = assert(h:query("SELECT COUNT(*) AS n FROM " .. t.names.item .. " WHERE f1 IS NOT NULL", {}))
            test.eq(math.tointeger(tonumber(rows[1].n)), 0)
            local kept = assert(h:query("SELECT COUNT(*) AS n FROM " .. t.names.item .. " WHERE f2 IS NOT NULL", {}))
            test.eq(math.tointeger(tonumber(kept[1].n)), 8)
            h:release()
        end)
    end)

    test.describe("compiler edges", function()
        test.it("binds hostile values everywhere", function()
            local h = db()
            local t = fixture(h)
            local hostile = "x' OR '1'='1"
            test.eq(#ids(h, t, { where = { field = "color", op = "eq", value = hostile } }), 0)
            test.eq(#ids(h, t, { where = { field = "tags", op = "in", value = { hostile } } }), 0)
            test.eq(#ids(h, t, { after = { id = hostile } }), 0)
            test.eq(#ids(h, t, {}, { conditions = { { sql = "i.life = ?", args = { hostile } } } }), 0)
            test.eq(#ids(h, t, {}), 10)
            h:release()
        end)

        test.it("pages a text sort with a text cursor", function()
            local h = db()
            local t = fixture(h)
            local first, after = run(h, t, { sorts = { { field = "color" } } }, { limit = 3 })
            test.eq(#(first :: { string }), 3)
            test.eq((after :: types.Cursor).v, "moss")
            local second = assert((run(h, t, { sorts = { { field = "color" } }, after = after }, { limit = 20 })))
            test.eq(#second, 7)
            h:release()
        end)

        test.it("walks nulls from a null cursor", function()
            local h = db()
            local t = fixture(h)
            local out = assert((run(h, t, { sorts = { { field = "size" } }, after = { id = "r09" } })))
            test.eq(#out, 1)
            test.eq(out[1], "r10")
            h:release()
        end)

        test.it("leaves other boards' items out of the join", function()
            local h = db()
            local t = fixture(h)
            exec(h, "UPDATE kickside_work_item SET board_id = $1 WHERE board_id = $2 AND item_id = $3", { "00000000-0000-0000-0000-00000000000c", OWNER, "r01" })
            local out = assert((run(h, t, {})))
            test.eq(#out, 9)
            h:release()
        end)

        test.it("refuses scope queries without an id", function()
            local bad: { types.ScopeQuery } = { { where = {} } :: types.ScopeQuery }
            local _, err = scopes.admit(reader("read"), bad)
            test.eq((err :: error):kind(), errors.INVALID)
            test.eq(#assert(scopes.admit(reader("read"), nil)), 0)
        end)

        test.it("reads scope values strictly by declared type", function()
            local int: types.ScopeFilter = { column = "c", type = "integer", ops = {} }
            local text: types.ScopeFilter = { column = "c", type = "text", ops = {} }
            test.eq(scopes.value(int, 5), 5)
            test.is_nil(scopes.value(int, 5.5))
            test.is_nil(scopes.value(int, "5"))
            test.eq(scopes.value(text, "x"), "x")
            test.is_nil(scopes.value(text, 5))
        end)
    end)
end

return { run = test.run_cases(define) }
