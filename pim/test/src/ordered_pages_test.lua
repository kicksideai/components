-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local store = require("store")
local read_model = require("read_model")
local history = require("history")
local types = require("types")
local layout = require("layout")
local select = require("select")

local CATALOG = "ordered-pages"
local SERIES = "WITH RECURSIVE series(n) AS (SELECT 1 UNION ALL SELECT n + 1 FROM series WHERE n < 12000) "

local function define()
    test.describe("ordered read pages", function()
        local db = assert(store.open())
        local pg = db:type() == "postgres"
        local function execute(statement: string)
            local _, err = db:execute(statement, { CATALOG })
            assert(not err, tostring(err))
        end
        local function clear()
            for _, tab in ipairs({ "kickside_pim_product", "kickside_pim_ref", "kickside_pim_change" }) do
                execute("DELETE FROM " .. tab .. " WHERE catalog_id = $1")
            end
        end
        local plan = ""
        local measured_plans: { string } = {}
        local measured = { query = function(_self: unknown, statement: string, args: types.SqlParams)
            local prefix = pg and "EXPLAIN (ANALYZE, TIMING OFF) " or "EXPLAIN QUERY PLAN "
            local lines = assert(db:query(prefix .. statement, args))
            local parts = {}
            for i, line in ipairs(lines) do parts[i] = tostring(line["QUERY PLAN"] or line.detail) end
            plan = table.concat(parts, "\n")
            measured_plans[#measured_plans + 1] = plan
            return db:query(statement, args)
        end } :: types.Executor
        local id = pg and "lpad(n::text, 5, '0')" or "printf('%05d', n)"
        test.before_all(function()
            clear()
            execute(SERIES .. [[INSERT INTO kickside_pim_product
                (catalog_id,product_id,sku,family,root_id,level,is_item,version,status,state,document,source_seq,created_seq,updated_seq)
                SELECT $1, ]] .. id .. ", " .. id .. ", 'generic','root',0,1,1,'active','live','{}','{}',1,1 FROM series")
            execute(SERIES .. [[INSERT INTO kickside_pim_ref (catalog_id,product_id,attribute_id,ctx,path,kind,target)
                SELECT $1, ]] .. id .. ", 7, '', 'a', 'term', CASE WHEN n > 11000 OR n % 7 = 0 THEN 'target' ELSE 'other' END FROM series")
            execute("INSERT INTO kickside_pim_ref VALUES ($1,'11500',7,'','b','term','target')")
            execute(SERIES .. [[INSERT INTO kickside_pim_change (catalog_id,seq,n,subject,kind,actor,at)
                SELECT $1, 1, n, 'p:subject','value','actor','2026-01-01T00:00:00Z' FROM series]])
            for _, tab in ipairs({ "kickside_pim_product", "kickside_pim_ref", "kickside_pim_change" }) do
                local _, err = db:execute("ANALYZE " .. tab, {})
                assert(not err, tostring(err))
            end
        end)

        test.it("seeks directly within a tied sequence and respects the change ceiling", function()
            local rows = assert((read_model.changed_products(measured, CATALOG, 1, { seq = 1, product_id = "11500" }, { "generic" }, 5)))
            test.eq(#rows, 5)
            test.eq(rows[1].product_id, "11501")
            test.eq(rows[5].product_id, "11505")
            test.not_nil(plan:find("kickside_pim_product_changes", 1, true), plan)
            test.not_nil(plan:gsub("%s", ""):find(pg and "ROW(updated_seq,product_id)>" or "(updated_seq,product_id)>", 1, true), plan)
            local past = assert((read_model.changed_products(db, CATALOG, 0, { seq = 0, product_id = "" }, nil, 5)))
            test.eq(#past, 0)
        end)

        test.it("seeks old subject history within a tied event", function()
            local rows, next_page = history.page(measured, CATALOG, { subject = "p:subject", before = "1:501", limit = 5 })
            assert(rows)
            test.eq(#rows, 5)
            test.eq(rows[1].n, 500)
            test.eq(next_page, "1:496")
            test.not_nil(plan:find("kickside_pim_change_subject", 1, true), plan)
            test.not_nil(plan:gsub("%s", ""):find(pg and "ROW(seq,n)<" or "(seq,n)<", 1, true), plan)
        end)

        test.it("seeks a backlink page through the URI path tie", function()
            local rows = assert((read_model.links(measured, db:type(), CATALOG, "term", "target",
                { product_id = "11500", attribute_id = 7, ctx = "", path = "a" }, 5)))
            test.eq(#rows, 5)
            test.eq(rows[1].product_id, "11500")
            test.eq(rows[1].path, "b")
            test.eq(rows[2].product_id, "11501")
            test.not_nil(plan:find("kickside_pim_ref_target", 1, true), plan)
            local compact = plan:gsub("%s", ""):gsub("r%.", "")
            test.not_nil(compact:find(pg and "ROW(product_id,attribute_id,ctx,path)>" or "(product_id,attribute_id,ctx,path)>", 1, true), plan)
            if pg then test.is_nil(plan:find("Merge Join", 1, true), plan) end
        end)

        test.it("walks filtered sort keys and counts only bounded candidates", function()
            local t = layout.of("pim_ordered_page_test", {
                columns = { { attribute_id = 1, column = "f1", ctx = "", kind = "number" } },
                flags = {}, search = {}, sets = {},
            })
            assert(not layout.drop(db, t.names))
            assert(not layout.create(db, db:type(), t))
            local _, err = db:execute(SERIES .. "INSERT INTO " .. t.names.item
                .. " (product_id,root_id,family,status,version,updated_seq,findings,sku_fold,f1) SELECT "
                .. id .. ", 'root','generic','active',1,1,'{}'," .. id .. ",CASE WHEN n > 11800 THEN NULL ELSE n / 10 END FROM series", {})
            assert(not err, tostring(err))
            assert(db:execute("ANALYZE " .. t.names.item, {}))
            local q: types.ItemQuery = { text = "!missing", sort = { field = "value", dir = "desc" }, after = { id = "11500", v = 1150 }, scan = 50, count = 10 }
            local compiled = assert((select.items({ catalog_id = CATALOG, allows = function(): boolean return true end },
                t, db:type(), q, function(): (types.Target?, error?)
                    return { column = "f1", kind = "number", set = false, shape = { form = "int", cardinality = "one", config = {} } }, nil
                end, {}, {}, { "status" })))
            measured_plans = {}
            local rows, edge, page_err = select.rows(measured, compiled, 5)
            assert(rows and edge, tostring(page_err))
            test.eq(#rows, 0)
            test.eq(edge.id, "11450")
            test.eq(edge.v, 1145)
            local plans = table.concat(measured_plans, "\n")
            test.not_nil(plans:find(t.names.item .. "_f1_desc", 1, true), plans)
            if pg then
                test.is_nil(plans:find("Seq Scan on " .. t.names.item, 1, true), plans)
                test.is_nil(plans:find("Seq Scan on kickside_pim_product", 1, true), plans)
            end
            measured_plans = {}
            local total, estimated = select.total(measured, compiled.count :: select.Count)
            test.eq(total, 0)
            test.is_true(estimated)
            local count_plan = measured_plans[1]
            if pg then
                test.not_nil(count_plan:find("(actual rows=50 loops=1)", 1, true), count_plan)
                test.not_nil(count_plan:find("Index Scan using " .. t.names.item .. "_pkey", 1, true), count_plan)
                test.is_nil(count_plan:find("Seq Scan on kickside_pim_product", 1, true), count_plan)
            else
                test.not_nil(count_plan:find("SCAN i USING INDEX sqlite_autoindex_" .. t.names.item, 1, true), count_plan)
            end
            assert(not layout.drop(db, t.names))
        end)

        test.after_all(function()
            clear()
            db:release()
        end)
    end)
end

return { run = test.run_cases(define) }
