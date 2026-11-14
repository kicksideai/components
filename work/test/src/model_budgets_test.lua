-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local fixture = require("fixture")
local steps = require("steps")
local store = require("store")

local function define()
    test.describe("bounded reads", function()
        test.it("refuses an event whose dependency fan-out exceeds 5000 items before append", function()
            local d = fixture.declaration(fixture.fresh_prefix())
            d.fields[#d.fields + 1] = { code = "total", type = "rollup", form = "int", of = "blocks", fn = "sum", field = "estimate" }
            d.item_types[3].fields[#d.item_types[3].fields + 1] = "total"
            local h = fixture.board({ declaration = d })
            local source = steps.create(h, "task", { estimate = 1 })
            local holder = steps.create(h, "task")
            local db = assert(store.open())
            assert(db:execute([[WITH RECURSIVE n(i) AS (SELECT 1 UNION ALL SELECT i + 1 FROM n WHERE i < 5000)
                INSERT INTO kickside_work_item (board_id,item_id,number,type,state,category,process_generation,visit,parent_id,path,rank,version,life,document,created_seq,updated_seq,created_at,updated_at)
                SELECT b.board_id, 'fanout-' || CAST(n.i AS text), n.i + 2, b.type,b.state,b.category,b.process_generation,b.visit,b.parent_id,
                    '/fanout-' || CAST(n.i AS text) || '/',b.rank,b.version,b.life,b.document,b.created_seq,b.updated_seq,b.created_at,b.updated_at
                FROM n CROSS JOIN kickside_work_item b WHERE b.board_id = $1 AND b.item_id = $2]], { h.id, holder }))
            assert(db:execute([[INSERT INTO kickside_work_link (board_id,from_id,type,to_board_id,to_id,seq,at)
                SELECT $1,item_id,'blocks',board_id,$2,updated_seq,updated_at FROM kickside_work_item
                WHERE board_id = $1 AND item_id LIKE 'fanout-%']], { h.id, source }))
            test.eq(assert(store.count(db, "SELECT COUNT(*) AS n FROM kickside_work_link WHERE board_id = $1", { h.id })), 5000)
            local board = assert(store.board(db, h.id))
            local before = board.applied_seq
            db:release()
            local result = steps.one(h, { op = "set", item = source, values = { estimate = 2 } })
            test.eq(result.status, "invalid")
            test.eq(result.findings[1].code, "event_fanout_limit")
            test.eq(steps.get(h, source).item.values.estimate, 1)
            test.eq(assert(h.call("get_schema", {})).as_of, before)
        end)
        test.it("continues a sparse filtered scan from its last examined visible item", function()
            local h = fixture.board()
            local ids = {}
            for i = 1, 5 do ids[i] = steps.create(h, "task", { estimate = i }) end
            local after, found, pages = nil, {}, 0
            repeat
                local page = assert(h.call("query", { where = { field = "estimate", op = "eq", value = 5 },
                    order = { field = "estimate" }, limit = 200, budget = { rows = 2 }, after = after }))
                for _, item in ipairs(page.items) do found[#found + 1] = item.id end
                pages = pages + 1
                if pages == 1 then test.is_true(page.incomplete); test.eq(#page.items, 0) end
                after = page.after
                test.is_true(pages <= 3)
            until not after
            test.eq(pages, 3)
            test.eq(#found, 1)
            test.eq(found[1], ids[5])
        end)
        test.it("marks a count as estimated when its scan budget ends", function()
            local h = fixture.board()
            for i = 1, 5 do steps.create(h, "task", { estimate = i }) end
            local result = assert(h.call("count", { where = { field = "estimate", op = "gt", value = 0 }, budget = { rows = 2 } }))
            test.eq(result.total, 2)
            test.is_true(result.estimated)
            test.is_true(result.incomplete)
        end)
        test.it("withholds group counts when their complete population exceeds the scan allowance", function()
            local h = fixture.board()
            for i = 1, 5 do steps.create(h, "task", { estimate = i }) end
            local page = assert(h.call("query", { group_by = "estimate", budget = { rows = 2 } }))
            test.is_true(page.incomplete)
            test.is_nil(page.groups)
            test.not_nil(page.after)
        end)
        test.it("honors an earlier caller deadline and rejects a malformed deadline", function()
            local h = fixture.board()
            steps.create(h, "task")
            local page = assert(h.call("query", { budget = { deadline = "2000-01-01T00:00:00Z" } }))
            test.eq(#page.items, 0)
            test.is_true(page.incomplete)
            local _, err = h.call("query", { budget = { deadline = "invalid" } })
            test.eq(err:kind(), errors.INVALID)
            test.eq(err:details().code, "invalid_read_budget")
        end)
        test.it("shares a scan allowance across boards and resumes the unvisited board", function()
            local a, b = fixture.board(), fixture.board()
            assert(b.call("grant", { subject_id = a.actor:id(), mask = 1 }))
            for _ = 1, 3 do steps.create(a, "task"); steps.create(b, "task") end
            local cursor, found, pages = nil, {}, 0
            repeat
                local page = assert(a.call("query", { boards = { a.id, b.id }, limit = 200, budget = { rows = 2 }, cross_after = cursor }))
                test.is_true(#page.items <= 2)
                for _, item in ipairs(page.items) do test.is_nil(found[item.id]); found[item.id] = true end
                cursor = page.cross_after
                pages = pages + 1
                test.is_true(pages <= 5)
            until not cursor
            local n = 0
            for _ in pairs(found) do n = n + 1 end
            test.eq(n, 6)
        end)
        test.it("carries the remaining scan allowance into a later board", function()
            local a, b = fixture.board(), fixture.board()
            assert(b.call("grant", { subject_id = a.actor:id(), mask = 1 }))
            local first, second = a, b
            if first.id > second.id then first, second = second, first end
            steps.create(first, "task")
            for _ = 1, 3 do steps.create(second, "task") end
            local page = assert(a.call("query", { boards = { a.id, b.id }, limit = 200, budget = { rows = 2 } }))
            test.eq(#page.items, 2)
            test.is_true(page.incomplete)
            test.not_nil(page.cross_after)
        end)
        test.it("enforces the default read deadline when the caller supplies no budget", function()
            local h = fixture.board()
            local _, err = h.executor:call("app:read_budget_probe", { board_id = h.id })
            test.not_nil(err)
            test.eq(err:kind(), errors.TIMEOUT)
            test.eq(err:details().code, "read_deadline")
        end)
        test.it("propagates a caller deadline through point history feed and related reads", function()
            local h = fixture.board()
            local id = steps.create(h, "task")
            for _, method in ipairs({ "get", "list_history", "list_changes", "list_links", "list_comments", "list_stage_runs", "get_time_in_state", "get_schema" }) do
                local request = { budget = { deadline = "2000-01-01T00:00:00Z" } }
                if method ~= "list_changes" and method ~= "get_schema" then request.item = { id = id } end
                local _, err = h.call(method, request)
                test.not_nil(err, method)
                test.eq(err:kind(), errors.TIMEOUT, method)
                test.eq(err:details().code, "read_deadline", method)
            end
        end)
    end)
end
return { run = test.run_cases(define) }
