-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local fixture = require("fixture")
local steps = require("steps")
local store = require("store")
local tables = require("tables")
local read_rows = require("read_rows")

local function explain(db, statement: string, args, tx: any?)
    local pg = db:type() == "postgres"
    local prefix = pg and "EXPLAIN (ANALYZE, COSTS OFF, TIMING OFF) " or "EXPLAIN QUERY PLAN "
    local executor = tx or db
    local result = assert(executor:query(prefix .. statement, args))
    local lines = {}
    for _, row in ipairs(result) do lines[#lines + 1] = pg and row["QUERY PLAN"] or row.detail end
    return table.concat(lines, "\n")
end

local function define()
    test.describe("stage-run query plans", function()
        test.it("seeks a deep cursor by visit and attempt and can read only the current visits", function()
            local db = assert(store.open())
            local tx = assert(db:begin())
            assert(tx:execute([[WITH RECURSIVE visits(n) AS (VALUES(1) UNION ALL SELECT n+1 FROM visits WHERE n<10000),
                attempts(n) AS (VALUES(1), (2), (3))
                INSERT INTO kickside_work_stage_run (board_id,item_id,visit,attempt,state,started)
                SELECT 'stage-plan','item',visits.n,attempts.n,'build','2026' FROM visits CROSS JOIN attempts]], {}))
            assert(tx:execute("ANALYZE kickside_work_stage_run", {}))

            local plan = ""
            local probe = { query = function(_, statement, params)
                plan = explain(db, statement, params, tx)
                return tx:query(statement, params)
            end }
            local deep = assert(read_rows.stage_runs(probe :: any, "stage-plan", "item", 4, 10, 2))
            local current = assert(read_rows.stage_runs(tx, "stage-plan", "item", 10, nil, nil, { 15, 4 }))
            assert(tx:rollback())
            db:release()

            test.eq(#deep, 4)
            test.eq(deep[1].visit, 10); test.eq(deep[1].attempt, 1)
            test.eq(deep[4].visit, 9); test.eq(deep[4].attempt, 1)
            test.eq(#current, 6)
            test.eq(current[1].visit, 15); test.eq(current[1].attempt, 3)
            test.eq(current[6].visit, 4); test.eq(current[6].attempt, 1)
            print("DEEP STAGE-RUN PLAN\n" .. plan)
            test.is_true(plan:find("(visit,attempt)<(?,?)", 1, true) ~= nil
                or plan:find("ROW(visit, attempt) <", 1, true) ~= nil, plan)
        end)
    end)

    test.describe("move alias query plans", function()
        test.it("seeks an endpoint miss and the inbound aliases to redirect", function()
            local db = assert(store.open())
            local tx = assert(db:begin())
            assert(tx:execute([[WITH RECURSIVE numbers(n) AS (VALUES(1) UNION ALL SELECT n+1 FROM numbers WHERE n<25000)
                INSERT INTO kickside_work_key_alias (board_id,key,item_id,to_board_id,to_item_id,at)
                SELECT 'alias-plan','AL-' || n,'origin-' || n,'target-board','target-' || n,'2026' FROM numbers]], {}))
            assert(tx:execute("ANALYZE kickside_work_key_alias", {}))
            local plan = ""
            local probe = { query = function(_, statement, params)
                plan = explain(db, statement, params, tx)
                return tx:query(statement, params)
            end }
            local endpoint = assert(store.endpoint(probe :: any, { board = "alias-plan", item = "missing" }))
            local incoming = explain(db, [[SELECT key FROM kickside_work_key_alias WHERE to_board_id=$1 AND to_item_id=$2]],
                { "target-board", "target-24999" }, tx)
            assert(tx:rollback())
            db:release()
            test.eq(endpoint.item, "missing")
            test.is_true(plan:find("kickside_work_key_alias_endpoint", 1, true) ~= nil, plan)
            test.is_true(incoming:find("kickside_work_key_alias_destination", 1, true) ~= nil, incoming)
        end)

        test.it("caps retained alias chains after 32 redirects", function()
            local db = assert(store.open())
            local tx = assert(db:begin())
            assert(tx:execute([[WITH RECURSIVE numbers(n) AS (VALUES(1) UNION ALL SELECT n+1 FROM numbers WHERE n<33)
                INSERT INTO kickside_work_key_alias (board_id,key,item_id,to_board_id,to_item_id,at)
                SELECT 'alias-chain','CHAIN-' || n,'item-' || n,'alias-chain','item-' || (n+1),'2026' FROM numbers]], {}))
            local probes = 0
            local counter = { query = function(_, statement, params)
                probes = probes + 1
                return tx:query(statement, params)
            end }
            local endpoint, err = store.endpoint(counter :: any, { board = "alias-chain", item = "item-1" })
            local over_limit_probes = probes
            local last = assert(store.endpoint(tx, { board = "alias-chain", item = "item-2" }))
            assert(tx:rollback())
            db:release()
            test.is_nil(endpoint)
            test.not_nil(err)
            test.eq(err:details().code, "key_alias_hop_limit")
            test.eq(over_limit_probes, 33)
            test.eq(last.item, "item-34")
        end)
    end)

    test.describe("Work indexed query plans", function()
        local board, db, title, set_lookup
        test.before_all(function()
            local declaration = fixture.declaration(fixture.fresh_prefix())
            declaration.fields[1].index = "key"
            declaration.fields[4].index = "key"
            declaration.plugins = { { use = "app:query_text_search_plugin" } }
            declaration.scopes = { "app:query_text_search_scope" }
            board = fixture.board({ declaration = declaration })
            local seed = steps.create(board, "task", { title = "seed", estimate = 1 })
            local parent = steps.create(board, "task")
            local child = steps.create(board, "task", nil, parent)
            db = assert(store.open())
            local held = assert(store.board(db, board.id))
            local names = tables.names(board.id)
            local table_name = names.item
            local estimate = "f" .. held.model.fields.estimate.id .. "_number"
            local labels = "f" .. held.model.fields.labels.id .. "_set"
            title = "f" .. held.model.fields.title.id .. "_key"
            set_lookup = names.set .. "_lookup"
            local tx = assert(db:begin())
            assert(tx:execute("UPDATE " .. table_name .. " SET rank = 'zz-parent' WHERE item_id = $1", {parent}))
            assert(tx:execute("UPDATE " .. table_name .. " SET rank = 'zz-child' WHERE item_id = $1", {child}))
            local numbers = "WITH RECURSIVE numbers(n) AS (VALUES(1) UNION ALL SELECT n+1 FROM numbers WHERE n<19999) "
            assert(tx:execute(numbers .. [[INSERT INTO kickside_work_item
                (board_id,item_id,number,type,state,category,process_generation,visit,path,rank,version,life,document,created_seq,updated_seq,created_at,updated_at)
                SELECT i.board_id,'sample-' || (100000+n),n+3,i.type,i.state,i.category,i.process_generation,i.visit,i.path,
                    CAST((100000+n) AS text),i.version,i.life,i.document,i.created_seq,n+10,i.created_at,i.updated_at
                FROM numbers CROSS JOIN kickside_work_item i WHERE i.board_id=$1 AND i.item_id=$2]], {board.id, seed}))
            assert(tx:execute(numbers .. "INSERT INTO " .. table_name .. [[
                (item_id,type,state,category,path,rank,number,life,version,created_seq,updated_seq,created_at,updated_at,]] .. estimate .. "," .. title .. [[)
                SELECT 'sample-' || (100000+n),i.type,i.state,i.category,i.path,CAST((100000+n) AS text),n+3,i.life,
                    i.version,i.created_seq,n+10,i.created_at,i.updated_at,n,CASE WHEN n=19999 THEN 'needle' ELSE 'common-' || n END
                FROM numbers CROSS JOIN ]] .. table_name .. " i WHERE i.item_id=$1", {seed}))
            assert(tx:execute(numbers .. "INSERT INTO " .. names.set .. [[
                (item_id,col,value_key) SELECT 'sample-' || (100000+n),CAST($1 AS text),
                    CASE WHEN n=19999 THEN 'needle' ELSE 'common' END FROM numbers]], {labels}))
            assert(tx:execute([[CREATE TABLE IF NOT EXISTS app_work_query_text
                (board_id TEXT NOT NULL, item_id TEXT NOT NULL, content TEXT NOT NULL, PRIMARY KEY (board_id, item_id))]], {}))
            assert(tx:execute(numbers .. [[INSERT INTO app_work_query_text (board_id, item_id, content)
                SELECT $1, 'sample-' || (100000+n), CASE WHEN n=19999 THEN 'needle' ELSE 'ordinary' END FROM numbers]], {board.id}))
            assert(tx:commit())
            assert(db:execute("ANALYZE " .. table_name, {}))
            assert(db:execute("ANALYZE " .. names.set, {}))
            assert(db:execute("ANALYZE kickside_work_item", {}))
        end)
        test.after_all(function() if db then db:release() end end)

        test.it("seeks and streams a rank or numeric page without sorting the population", function()
            local sorted = {}
            for _, request in ipairs({
                {limit=10},
                {limit=10,order={field="rank",dir="desc"}},
                {limit=10,order={field="estimate"}},
                {limit=10,order={field="estimate",dir="desc"}},
                {limit=10,order={field="estimate"},after={id="sample-119900",v=19900}},
            }) do
                local plan = assert(board.call("explain", request)).plan
                local output = explain(db, plan.statement, plan.args)
                print("ORDER SQL " .. plan.statement .. "\n" .. output)
                if output:find("Sort",1,true) or output:find("TEMP B-TREE",1,true) then sorted[#sorted+1] = plan.statement .. "\n" .. output end
            end
            test.eq(#sorted, 0, table.concat(sorted, "\n\n"))
        end)

        test.it("does not walk the whole board before returning an indexed exact match", function()
            local selection = {field="title", op="eq", value="needle"}
            local plan = assert(board.call("explain", {limit=10, where=selection})).plan
            print("EXACT MATCH SQL " .. plan.statement .. "\n" .. explain(db, plan.statement, plan.args))
            local page = assert(board.call("direct", {target="app:query_plan_read_page", input={board_id=board.id, limit=10, where=selection}}))
            test.eq(#page.items, 1)
            test.eq(page.scanned, 1, "the index should charge the single matching candidate")
        end)

        test.it("turns a selective text prefix into an indexed range", function()
            local plan = assert(board.call("explain", {limit=10, where={field="title", op="starts_with", value="needle"}})).plan
            local output = explain(db, plan.statement, plan.args)
            print("PREFIX SQL " .. plan.statement .. "\n" .. output)
            test.is_true(output:find("Index Cond:",1,true) ~= nil and output:find(title .. " >=",1,true) ~= nil
                or output:find(title .. ">?",1,true) ~= nil, output)
        end)

        test.it("drives a selective positive membership filter from the set lookup index", function()
            local plan = assert(board.call("explain", {limit=10, where={field="labels", op="has", value="needle"}})).plan
            local output = explain(db, plan.statement, plan.args)
            print("MEMBERSHIP SQL " .. plan.statement .. "\n" .. output)
            test.is_true(output:find(set_lookup,1,true) ~= nil, output)
        end)

        test.it("seeks directly to the numeric cursor and change-feed tuple", function()
            local plan = assert(board.call("explain", { limit = 10, order = { field = "estimate" },
                after = { id = "sample-119900", v = 19900 } })).plan
            local numeric = explain(db, plan.statement, plan.args)
            test.is_true(numeric:find("(f2_number,item_id)>(?,?)", 1, true) ~= nil
                or numeric:find("ROW(f2_number, item_id) >", 1, true) ~= nil, numeric)
            local feed = explain(db, [[SELECT updated_seq, item_id FROM kickside_work_item
                WHERE board_id = $1 AND updated_seq <= $2 AND (updated_seq, item_id) > ($3, $4)
                ORDER BY updated_seq, item_id LIMIT $5]], { board.id, 20010, 19980, "sample-119970", 10 })
            test.is_true(feed:find("(updated_seq,item_id)>(?,?)", 1, true) ~= nil
                or feed:find("ROW(updated_seq, item_id) >", 1, true) ~= nil, feed)
        end)

        test.it("bounds sparse contains and SQL scope matches even on an empty page", function()
            for _, where in ipairs({
                { field = "title", op = "contains", value = "needle" },
                { match = "NEEDLE" },
            }) do
                local request = { board_id = board.id, limit = 10, where = where, budget = { rows = 16 } }
                local page = assert(board.call("direct", { target = "app:query_plan_read_page", input = request }))
                test.eq(page.scanned, 16)
                test.eq(#page.items, 0)
                test.not_nil(page.after)
                request.after = { v = "119998", id = "sample-119998" }
                page = assert(board.call("direct", { target = "app:query_plan_read_page", input = request }))
                test.eq(#page.items, 1)
                test.eq(page.items[1].id, "sample-119999")
                test.is_true(page.scanned <= 16)
            end
        end)

        local function below_window(where)
            local page = assert(board.call("direct", { target = "app:query_plan_read_page",
                input = { board_id = board.id, where = where, limit = 1, budget = { rows = 1 } } }))
            test.eq(#page.items, 0, "the sparse match lies outside the candidate allowance")
            test.eq(page.scanned, 1)
            test.not_nil(page.after)
        end
        test.it("charges leading candidates before evaluating children", function()
            below_window({ children = true, q = "some" })
        end)
        test.it("charges leading candidates before evaluating mixed conjunctions", function()
            below_window({ ["and"] = {
                { field = "type", op = "eq", value = "task" },
                { field = "title", op = "contains", value = "needle" },
            } })
        end)

        test.it("uses a composite rank seek inside a bounded substring continuation", function()
            local plan = assert(board.call("explain", { limit = 10, budget = { rows = 16 },
                where = { field = "title", op = "contains", value = "needle" },
                after = { id = "sample-119000", v = "119000" } })).plan
            local output = explain(db, plan.statement, plan.args)
            print("BOUNDED RANK SQL " .. plan.statement .. "\n" .. output)
            test.is_true(output:find("(rank,item_id)>(?,?)", 1, true) ~= nil
                or output:find("ROW(rank, item_id) >", 1, true) ~= nil, output)
        end)

    end)
end

return { run = test.run_cases(define) }
