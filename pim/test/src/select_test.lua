-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Generated tables and the query compiler on both engines: create a table set
-- from a layout, write rows, filter by key, number and set columns, search
-- text, sort with nulls last and keyset paging, add conditions, apply
-- scopes, and build a replacement table set.
local test = require("test")
local sql = require("sql")
local layout = require("layout")
local select = require("select")
local scopes = require("scopes")
local types = require("types")
local narrow = require("narrow")

type Map = { [string]: unknown }

local CATALOG = "catalog-select"

local LAYOUT: types.Layout = {
    columns = {
        { attribute_id = 1, ctx = "", kind = "key", column = "f1" },
        { attribute_id = 2, ctx = "", kind = "number", column = "f2" },
    },
    sets = { { attribute_id = 3, ctx = "", kind = "key", column = "f3" } },
    search = { { attribute_id = 4, ctx = "", kind = "text", column = "f4" } },
    flags = { { attribute_id = 0, ctx = "ready", kind = "flag", column = "g1" } },
}

local FIELDS: { [string]: types.Target } = {
    color = { column = "f1", kind = "key", set = false, shape = { form = "text", cardinality = "one", config = {} } },
    size = { column = "f2", kind = "number", set = false, shape = { form = "int", cardinality = "one", config = {} } },
    tags = { column = "f3", kind = "key", set = true, shape = { form = "text", cardinality = "one", config = {} } },
    shade = { column = "f1", kind = "key", set = false, shape = { form = "text", cardinality = "one", config = {} },
        coerce = function(raw: unknown): unknown return type(raw) == "string" and raw:lower() or raw end },
}

local function resolve(code: string, _ctx: { [string]: string }?): (types.Target?, error?)
    local t = FIELDS[code]
    if not t then return nil, errors.new({ kind = errors.INVALID, message = "unknown field " .. code }) end
    return t, nil
end

local function reader(level: string): types.Reader
    return { catalog_id = CATALOG, allows = function(wanted: string): boolean
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

local function system(status: string, version: integer, sku_fold: string): { [string]: types.ColumnValue }
    return { root_id = "r", family = "f", status = status, version = version, updated_seq = 1, findings = "{}", sku_fold = sku_fold }
end

-- fixture builds a fresh table set and ten items r01..r10.
local function fixture(h: sql.DB): types.Table
    local t: types.Table = { names = layout.names(CATALOG), layout = LAYOUT }
    assert(not layout.drop(h, t.names))
    exec(h, "DELETE FROM kickside_pim_product WHERE catalog_id = $1 OR catalog_id = $2", { CATALOG, "stranger" })
    assert(not layout.create(h, h:type(), t))
    local rows: { types.ItemRow } = {}
    for i = 1, 10 do
        local id = string.format("r%02d", i)
        exec(h, [[INSERT INTO kickside_pim_product (catalog_id, product_id, sku, family, root_id, level, is_item, version, status, state,
            document, source_seq, created_seq, updated_seq) VALUES ($1, $2, $3, 'f', $4, 0, 1, 1, 'active', 'live', '{}', '{}', 1, 1)]],
            { CATALOG, id, "C-" .. i, id })
        local values: { [string]: types.ColumnValue } = { f1 = i % 2 == 0 and "moss" or "slate" }
        if i <= 8 then values.f2 = 100 - i * 10 end
        rows[#rows + 1] = { id = id, system = system(i == 10 and "draft" or "active", 1, "c-" .. i), values = values,
            sets = { f3 = i <= 3 and { "a", "b" } or { "c" } }, text = i == 5 and "red hiking boot" or "plain item",
            flags = { g1 = i % 3 == 0 and 1 or 0 } }
    end
    assert(not layout.write_rows(h, h:type(), t, rows))
    return t
end

local function run(h: sql.DB, t: types.Table, q: types.ItemQuery, opts: Map?): ({ string }?, types.Cursor?, error?)
    local o: Map = opts or {}
    local plan, err = select.items(reader(o.level :: string? or "read"), t, h:type(), q, resolve,
        (o.admitted :: { types.AdmittedScope }?) or {}, (o.conditions :: { types.Condition }?) or {}, { "status" })
    if err or not plan then return nil, nil, err end
    local limit: integer = (o.limit :: integer?) or 50
    local rows, _, qerr = select.rows(h, plan, limit)
    assert(rows, tostring(qerr))
    local out: { string } = {}
    for i = 1, math.min(#rows, limit) do out[i] = tostring(rows[i].product_id) end
    local after: types.Cursor? = nil
    if #rows > limit then
        local last = rows[limit]
        local v: types.ColumnValue? = nil
        if plan.sort_column then
            local raw = last.sort_value
            if type(raw) == "number" then v = math.tointeger(raw) elseif type(raw) == "string" then v = raw end
        end
        after = { id = tostring(last.product_id), v = v }
    end
    return out, after, nil
end

local function ids(h: sql.DB, t: types.Table, q: types.ItemQuery, opts: Map?): { string }
    local out, _, err = run(h, t, q, opts)
    assert(out, tostring(err))
    return out
end

local function drain(h: sql.DB, t: types.Table, q: types.ItemQuery, limit: integer): { string }
    local out: { string } = {}
    local after: types.Cursor? = nil
    for _ = 1, 30 do
        local page_q: types.ItemQuery = { where = q.where, sort = q.sort, after = after }
        local page, next_after, err = run(h, t, page_q, { limit = limit })
        assert(page, tostring(err))
        for _, id in ipairs(page) do out[#out + 1] = id end
        after = next_after
        if not after then return out end
    end
    error("paging did not end")
end

local function define()
    test.describe("generated tables and queries", function()
        test.it("seeks SQLite FTS deletes through the product row mapping",function()
            local h=db()
            local t=fixture(h)
            if h:type()~="sqlite" then h:release();return end
            local plans=""
            local measured={execute=function(_self:unknown,statement:string,params:types.SqlParams)
                if statement:find("DELETE FROM "..t.names.fts,1,true) then
                    for _,row in ipairs(assert(h:query("EXPLAIN QUERY PLAN "..statement,params))) do plans=plans..tostring(row.detail).."\n" end
                end
                return h:execute(statement,params)
            end} :: types.Executor
            local err=layout.delete_rows(measured,h:type(),t,{"r05"})
            assert(h:release())
            test.is_nil(err,tostring(err))
            test.not_nil(plans:find("VIRTUAL TABLE INDEX 0:=",1,true),plans)
        end)
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
                { sort = { field = "tags" } },
            } :: { types.ItemQuery }) do
                local _, _, err = run(h, t, bad)
                test.not_nil(err)
            end
            h:release()
        end)

        test.it("searches text and applies conditions over both aliases", function()
            local h = db()
            local t = fixture(h)
            local found = ids(h, t, { text = "hiking" })
            test.eq(#found, 1)
            test.eq(found[1], "r05")
            test.eq(#ids(h, t, { text = "say \"it\"" }), 0)
            test.eq(#ids(h, t, { text = "C-1" }), 2)
            test.eq(#ids(h, t, { text = "c-10" }), 1)
            test.eq(#ids(h, t, { text = "C-1%" }), 0)
            test.eq(#ids(h, t, {}, { conditions = { { sql = "i.status = ?", args = { "draft" } } } }), 1)
            test.eq(#ids(h, t, {}, { conditions = { { sql = "i.g1 = ?", args = { 1 } }, { sql = "r.sku <> ?", args = { "C-3" } } } }), 2)
            h:release()
        end)

        test.it("sorts nulls last in both directions and pages without overlap", function()
            local h = db()
            local t = fixture(h)
            local up = drain(h, t, { sort = { field = "size" } }, 3)
            test.eq(#up, 10)
            test.eq(up[1], "r08")
            test.eq(up[8], "r01")
            local down = drain(h, t, { sort = { field = "size", dir = "desc" } }, 3)
            test.eq(down[1], "r01")
            test.eq(down[8], "r08")
            test.is_true((down[9] == "r09" or down[9] == "r10") and (down[10] == "r09" or down[10] == "r10"))
            local plain = drain(h, t, {}, 4)
            test.eq(#plain, 10)
            test.eq(plain[1], "r01")
            local ties = drain(h, t, { sort = { field = "color" } }, 2)
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
            exec(h, "CREATE TABLE rt_stock (catalog_id TEXT NOT NULL, product_id TEXT NOT NULL, available INTEGER NOT NULL)")
            exec(h, "INSERT INTO rt_stock (catalog_id, product_id, available) VALUES ($1, $2, $3), ($4, $5, $6), ($7, $8, $9)",
                { CATALOG, "r01", 4, CATALOG, "r02", 0, "other", "r03", 9 })
            local admitted = assert(scopes.admit(reader("read"), { { id = "app:probe_stock", where = { available = { gt = 0 } } } }))
            local found = ids(h, t, {}, { admitted = admitted })
            test.eq(#found, 1)
            test.eq(found[1], "r01")
            local _, denied = scopes.admit(reader("read"), { { id = "app:probe_stock_admin", where = {} } })
            test.not_nil(denied)
            test.not_nil((scopes.admit(reader("admin"), { { id = "app:probe_stock_admin", where = {} } })))
            for _, bad in ipairs({ { id = "app:probe_nope", where = {} }, { id = "app:probe_hostile", where = {} } } :: { types.ScopeQuery }) do
                local _, err = scopes.admit(reader("admin"), { bad })
                test.not_nil(err)
            end
            local wrong_op = assert(scopes.admit(reader("read"), { { id = "app:probe_stock", where = { available = { lt = 3 } } } }))
            local _, _, err = run(h, t, {}, { admitted = wrong_op })
            test.not_nil(err)
            h:release()
        end)

        test.it("creates an empty replacement and drops the old table set independently", function()
            local h = db()
            local t = fixture(h)
            local next_table = layout.of(layout.names(CATALOG, 2).base, {
                columns = { LAYOUT.columns[1], { attribute_id = 5, ctx = "", kind = "number", column = "f5" } },
                sets = {}, search = {}, flags = {},
            })
            assert(not layout.create(h, h:type(), next_table))
            test.eq(#ids(h, t, { where = { field = "color", op = "eq", value = "moss" } }), 5)
            test.eq(#ids(h, next_table, {}), 0)
            local _, gone = h:query("SELECT f2 FROM " .. next_table.names.item, {})
            test.not_nil(gone)
            assert(not layout.write_rows(h, h:type(), next_table, { { id = "r02", system = system("active", 1, "c-2"),
                values = { f1 = "moss", f5 = 7 }, sets = {}, flags = {} } }))
            assert(not layout.drop(h, t.names))
            local _, dropped = h:query("SELECT 1 FROM " .. t.names.item, {})
            test.not_nil(dropped)
            test.eq(#ids(h, next_table, { where = { field = "color", op = "eq", value = "moss" } }), 1)
            assert(not layout.drop(h, next_table.names))
            h:release()
        end)
    end)
    test.describe("generated table edges", function()
        test.it("derives stable names per catalog", function()
            test.eq(layout.names("o1").item, layout.names("o1").item)
            test.is_false(layout.names("o1").item == layout.names("o2").item)
        end)

        test.it("reads one row back and answers nil for an item without one", function()
            local h = db()
            local t = fixture(h)
            local row = assert(layout.read_row(h, t, "r02"))
            test.eq(row.f1, "moss")
            test.eq(row.status, "active")
            local none, err = layout.read_row(h, t, "nope")
            test.is_nil(none)
            test.is_nil(err)
            h:release()
        end)

        test.it("replaces an item's rows on rewrite", function()
            local h = db()
            local t = fixture(h)
            assert(not layout.write_rows(h, h:type(), t, { { id = "r01", system = system("active", 2, "c-1"), values = { f1 = "clay" },
                sets = { f3 = { "z" } }, text = "fresh words", flags = { g1 = 1 } } }))
            test.eq(#ids(h, t, { where = { field = "color", op = "eq", value = "clay" } }), 1)
            test.eq(#ids(h, t, { where = { field = "tags", op = "has", value = "a" } }), 2)
            test.eq(#ids(h, t, { where = { field = "tags", op = "has", value = "z" } }), 1)
            test.eq(#ids(h, t, { text = "fresh" }), 1)
            h:release()
        end)

        test.it("refuses a row without a system value", function()
            local h = db()
            local t = fixture(h)
            local err = layout.write_rows(h, h:type(), t, { { id = "x", system = { status = "active" }, values = {}, sets = {}, flags = {} } })
            test.not_nil(err)
            test.eq((err :: error):kind(), errors.INTERNAL)
            h:release()
        end)

        test.it("removes an item's set and search rows with its row", function()
            local h = db()
            local t = fixture(h)
            assert(not layout.delete_rows(h, h:type(), t, { "r05", "r01" }))
            test.eq(#ids(h, t, { text = "hiking" }), 0)
            test.eq(#ids(h, t, { where = { field = "tags", op = "has", value = "a" } }), 2)
            h:release()
        end)

        test.it("creates replacement search storage only when the layout needs it", function()
            local h = db()
            local t = fixture(h)
            local before: types.Layout = t.layout
            local without: types.Layout = { columns = before.columns, sets = before.sets, search = {}, flags = before.flags }
            local off = layout.of(layout.names(CATALOG, 2).base, without)
            assert(not layout.create(h, h:type(), off))
            assert(not layout.write_rows(h, h:type(), off, { { id = "r05", system = system("active", 1, "c-5"),
                values = {}, sets = {}, text = "hiking", flags = {} } }))
            test.eq(#ids(h, off, { text = "hiking" }), 0)
            test.eq(#ids(h, off, { text = "C-5" }), 1)
            test.eq(#ids(h, t, { text = "hiking" }), 1)
            assert(not layout.drop(h, off.names))
            h:release()
        end)

        test.it("writes compatible values to active storage while a changed kind is pending", function()
            local h = db()
            local t = fixture(h)
            local before = t.layout
            local after: types.Layout = { columns = { { attribute_id = 1, ctx = "", kind = "number", column = "f1" }, before.columns[2] },
                sets = before.sets, search = before.search, flags = before.flags }
            local pending = layout.pending_columns(before, after, {}, {})
            test.eq(#pending, 1)
            test.eq(pending[1], "f1")
            local rows: { types.ItemRow } = { { id = "r01", system = system("active", 1, "c-1"),
                values = { f1 = 7, f2 = 8 }, sets = {}, flags = {} } }
            assert(not layout.write_rows(h, h:type(), t, rows, after))
            local active = assert(layout.read_row(h, t, "r01"))
            test.is_nil(active.f1)
            test.eq(tonumber(active.f2), 8)
            local replacement = layout.of(layout.names(CATALOG, 2).base, after)
            assert(not layout.create(h, h:type(), replacement))
            assert(not layout.write_rows(h, h:type(), replacement, rows))
            test.eq(tonumber(assert(layout.read_row(h, replacement, "r01")).f1), 7)
            assert(not layout.drop(h, replacement.names))
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
            test.eq(#ids(h, t, { text = hostile }), 0)
            test.eq(#ids(h, t, { after = { id = hostile } }), 0)
            test.eq(#ids(h, t, {}, { conditions = { { sql = "i.status = ?", args = { hostile } } } }), 0)
            test.eq(#ids(h, t, {}), 10)
            h:release()
        end)

        test.it("pages a text sort with a text cursor", function()
            local h = db()
            local t = fixture(h)
            local first, after = run(h, t, { sort = { field = "color" } }, { limit = 3 })
            test.eq(#(first :: { string }), 3)
            test.eq((after :: types.Cursor).v, "moss")
            local second = assert((run(h, t, { sort = { field = "color" }, after = after }, { limit = 20 })))
            test.eq(#second, 7)
            h:release()
        end)

        test.it("walks nulls from a null cursor", function()
            local h = db()
            local t = fixture(h)
            local out = assert((run(h, t, { sort = { field = "size" }, after = { id = "r09" } })))
            test.eq(#out, 1)
            test.eq(out[1], "r10")
            h:release()
        end)

        test.it("selects the sku and named system columns", function()
            local h = db()
            local t = fixture(h)
            local plan = assert(select.items(reader("read"), t, h:type(), {}, resolve, {}, {}, { "status", "version" }))
            local rows = assert((select.rows(h, plan, 1)))
            test.eq(rows[1].sku, "C-1")
            test.eq(rows[1].status, "active")
            test.eq(narrow.int(rows[1].version), 1)
            test.eq(#rows, 2)
            h:release()
        end)

        test.it("leaves other catalogs' products out of the join", function()
            local h = db()
            local t = fixture(h)
            exec(h, "UPDATE kickside_pim_product SET catalog_id = $1 WHERE catalog_id = $2 AND product_id = $3", { "stranger", CATALOG, "r01" })
            local out = assert((run(h, t, {})))
            test.eq(#out, 9)
            h:release()
        end)

        test.it("reports the scope tables a plan reads", function()
            local h = db()
            local t = fixture(h)
            exec(h, "DROP TABLE IF EXISTS rt_stock")
            exec(h, "CREATE TABLE rt_stock (catalog_id TEXT NOT NULL, product_id TEXT NOT NULL, available INTEGER NOT NULL)")
            local admitted = assert(scopes.admit(reader("read"), { { id = "app:probe_stock", where = {} } }))
            local plan = assert(select.items(reader("read"), t, h:type(), {}, resolve, admitted, {}, {}))
            test.eq(plan.tables[1], "rt_stock")
            local bare = assert(select.items(reader("read"), t, h:type(), {}, resolve, {}, {}, {}))
            test.eq(#bare.tables, 0)
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
