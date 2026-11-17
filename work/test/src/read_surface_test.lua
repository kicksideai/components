-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local clock = require("clock")
local scoped = require("scoped")
local steps = require("steps")
local fixture = require("fixture")
local store = require("store")

local function define()
    test.describe("board read surfaces", function()
        test.it("reports independent READ WRITE and ADMIN grants on board reads", function()
            local owner = scoped.admin()
            local h = scoped.board(owner)
            local item = steps.create(h, "task")
            for _, grant in ipairs({ { mask = 1, write = false, admin = false }, { mask = 3, write = true, admin = false },
                { mask = 9, write = false, admin = true }, { mask = 11, write = true, admin = true } }) do
                local member = scoped.member()
                assert(h.call("grant", { subject_id = member.id, mask = grant.mask }))
                local listed = member.http("GET", "/api/work/boards")
                test.eq(listed.status, 200)
                test.eq(#listed.body.data.boards, 1)
                local replies = {
                    listed.body.data.boards[1],
                    assert(member.call("get", { item = { id = item } }, h.id)),
                    assert(member.call("explain", {}, h.id)),
                }
                for _, result in ipairs(replies) do
                    test.not_nil(result.access)
                    test.eq(result.access.read, true)
                    test.eq(result.access.write, grant.write)
                    test.eq(result.access.admin, grant.admin)
                end
            end
        end)

        test.it("reports planner indexes and the unspent explain budget without scanning items", function()
            local h = scoped.board(scoped.admin())
            for i = 1, 3 do steps.create(h, "task", { estimate = i }) end
            local out = assert(h.call("explain", { where = { field = "estimate", op = "eq", value = 2 },
                order = { field = "estimate" }, budget = { rows = 1, deadline = clock.deadline(10000).at } }))
            test.not_nil(out.plan.indexes)
            test.is_true(#out.plan.indexes > 0)
            local previous = ""
            for _, name in ipairs(out.plan.indexes) do
                test.eq(type(name), "string")
                test.is_true(name > previous)
                previous = name
            end
            test.eq(out.budget.rows_scanned, 0)
            test.eq(out.budget.rows_remaining, 1)
            test.is_true(out.budget.deadline_remaining_ms > 0)
            test.is_true(out.budget.deadline_remaining_ms <= 10000)
            test.is_nil(out.items)
            local deadline = clock.deadline(1000).at
            out = assert(h.call("explain", { budget = { rows = 7, deadline = deadline } }))
            test.eq(out.budget.rows_remaining, 7)
            test.is_true(out.budget.deadline_remaining_ms <= 1000)
            local _, err = h.call("explain", { budget = { deadline = "2000-01-01T00:00:00Z" } })
            test.eq(err:kind(), errors.TIMEOUT)
            test.eq(err:details().code, "read_deadline")
        end)

        test.it("pages links in both directions and redacts unreadable peers", function()
            local admin, member = scoped.admin(), scoped.member()
            local a, b = scoped.board(admin), scoped.board(admin)
            assert(a.call("grant", { subject_id = member.id, mask = 1 }))
            local source, target = steps.create(a, "task"), steps.create(b, "task")
            steps.one(a, { op = "link", item = source, type = "blocks", target = { board = b.id, item = target } })
            local response = member.http("POST", "/" .. a.id .. "/list_links", { item = { id = source }, limit = 1 })
            test.eq(response.status, 200)
            local page = response.body.data
            test.eq(#page.links, 1)
            test.is_true(page.links[1].target.unavailable)
            test.is_nil(page.links[1].target.item)
            local included = assert(member.call("get", { item = { id = source }, include = { "links" } }, a.id))
            test.is_true(included.links[1].unavailable)
            test.is_nil(included.links[1].board)
            test.is_nil(included.links[1].item)
            assert(b.call("grant", { subject_id = member.id, mask = 1 }))
            local inward = assert(member.call("list_links", { item = { id = target }, direction = "inward" }, b.id))
            test.eq(inward.links[1].source.item, source)
            local all = assert(member.call("list_links", { target = { board = b.id, item = target } }, a.id))
            test.eq(all.links[1].source.item, source)
            local second = steps.create(a, "task")
            steps.one(a, { op = "link", item = second, type = "blocks", target = { board = b.id, item = target } })
            local first = assert(member.call("list_links", { target = { board = b.id, item = target }, limit = 1 }, a.id))
            test.not_nil(first.after)
            local next = assert(member.call("list_links", { target = { board = b.id, item = target }, after = first.after, limit = 1 }, a.id))
            test.eq(#next.links, 1)
            test.is_true(first.links[1].source.item ~= next.links[1].source.item)
            test.is_nil(next.after)
        end)

        test.it("pages durable comments and enforces board READ", function()
            local admin, member = scoped.admin(), scoped.member()
            local h = scoped.board(admin)
            local item = steps.create(h, "task")
            for i = 1, 3 do steps.one(h, { op = "comment", item = item, body = "Comment " .. i }) end
            local denied = member.http("POST", "/" .. h.id .. "/list_comments", { item = { id = item } })
            test.eq(denied.status, 403)
            assert(h.call("grant", { subject_id = member.id, mask = 1 }))
            local first = assert(member.call("list_comments", { item = { id = item }, limit = 2 }, h.id))
            test.eq(#first.comments, 2)
            test.not_nil(first.after)
            local next = assert(member.call("list_comments", { item = { id = item }, limit = 2, after = first.after }, h.id))
            test.eq(#next.comments, 1)
            test.is_nil(next.after)
            test.is_true(first.comments[1].id ~= next.comments[1].id)
        end)

        test.it("continues a comment page after its anchor comment is deleted", function()
            local board = fixture.board()
            local item = steps.create(board, "task")
            local oldest = steps.one(board, { op = "comment", item = item, body = "First" }).comment
            local remaining = steps.one(board, { op = "comment", item = item, body = "Second" }).comment
            local page = assert(board.call("list_comments", { item = { id = item }, limit = 1 }))
            test.eq(page.comments[1].id, oldest)
            test.not_nil(page.after)
            test.eq(steps.one(board, { op = "comment", item = item, comment = oldest, delete = true }).status, "applied")
            local next_page = assert(board.call("list_comments", { item = { id = item }, limit = 1, after = page.after }))
            test.eq(#next_page.comments, 1)
            test.eq(next_page.comments[1].id, remaining)
        end)

        test.it("orders equal comment timestamps by id and rejects a malformed continuation", function()
            local board = fixture.board()
            local item = steps.create(board, "task")
            local ids: { string } = {}
            for i = 1, 3 do ids[i] = steps.one(board, { op = "comment", item = item, body = tostring(i) }).comment end
            table.sort(ids)
            local db = assert(store.open())
            assert(db:execute("UPDATE kickside_work_comment SET created_at=$1 WHERE board_id=$2 AND item_id=$3",
                { clock.now(), board.id, item }))
            db:release()
            local cursor: string? = nil
            for i, id in ipairs(ids) do
                local page = assert(board.call("list_comments", { item = { id = item }, limit = 1, after = cursor }))
                test.eq(#page.comments, 1)
                test.eq(page.comments[1].id, id)
                test.eq(page.after ~= nil, i < #ids)
                cursor = page.after
            end
            local _, err = board.call("list_comments", { item = { id = item }, after = "1" })
            test.eq(err:kind(), errors.INVALID)
        end)

        test.it("explains an admitted compiled query as a reader without stored values", function()
            local admin, member = scoped.admin(), scoped.member()
            local h = scoped.board(admin)
            steps.create(h, "task", { estimate = 77 })
            assert(h.call("grant", { subject_id = member.id, mask = 1 }))
            local response = member.http("POST", "/" .. h.id .. "/explain", { where = { field = "estimate", op = "gte", value = 4 } })
            test.eq(response.status, 200)
            local plan = response.body.data
            test.not_nil(plan.plan.statement)
            test.not_nil(plan.scopes)
            test.is_nil(plan.items)
            test.is_nil(plan.values)
            test.is_true(plan.visibility.life)
            local _, err = scoped.outsider().call("explain", {}, h.id)
            test.not_nil(err)
        end)
    end)
end
return { run = test.run_cases(define) }
