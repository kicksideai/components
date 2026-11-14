-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local scoped = require("scoped")
local steps = require("steps")

local function define()
    test.describe("relation filters", function()
        test.it("uses directions quantifiers nesting and live targets in query and count as a member", function()
            local admin, member = scoped.admin(), scoped.member()
            local h = scoped.board(admin)
            assert(h.call("grant", { subject_id = member.id, mask = 3 }))
            local a, b, c = steps.create(h, "task"), steps.create(h, "task", { estimate = 3 }), steps.create(h, "task", { estimate = 8 })
            steps.one(h, { op = "link", item = a, type = "blocks", target = { item = b } })
            steps.one(h, { op = "link", item = b, type = "blocks", target = { item = c } })
            steps.one(h, { op = "link", item = a, type = "relates", target = { item = c } })
            local function check(where: unknown, expected: { string })
                local out = assert(member.call("query", { where = where }, h.id))
                test.eq(#out.items, #expected)
                local ids = {}
                for _, item in ipairs(out.items) do ids[item.id] = true end
                for _, id in ipairs(expected) do test.is_true(ids[id]) end
                test.eq(assert(member.call("count", { where = where }, h.id)).total, #expected)
            end
            check({ rel = "blocks", q = "some", where = { field = "estimate", op = "eq", value = 3 } }, { a })
            check({ rel = "blocks", dir = "inward", q = "some" }, { b, c })
            check({ rel = "blocks", q = "some", where = { rel = "blocks", q = "some" } }, { a })
            check({ rel = "relates", q = "some" }, { a, c })
            check({ rel = "blocks", q = "every", where = { field = "estimate", op = "gt", value = 2 } }, { a, b, c })
            steps.one(h, { op = "delete", item = b })
            check({ rel = "blocks", q = "some" }, {})
            check({ rel = "blocks", q = "none" }, { a, c })
            steps.one(h, { op = "restore", item = b })
            check({ rel = "blocks", q = "some" }, { a, b })
        end)

        test.it("refuses a third relation hop in query and count", function()
            local h = scoped.board(scoped.admin())
            local where = { rel = "blocks", q = "some", where = { rel = "blocks", q = "some", where = { rel = "blocks", q = "some" } } }
            for _, method in ipairs({ "query", "count" }) do
                local _, err = h.call(method, { where = where })
                test.eq(err:kind(), errors.INVALID); test.eq(err:details().code, "relation_depth")
            end
        end)

        test.it("keeps foreign endpoints outside some and fails closed for every and none", function()
            local admin = scoped.admin()
            local h, other = scoped.board(admin), scoped.board(admin)
            local a, remote = steps.create(h, "task"), steps.create(other, "task")
            steps.one(h, { op = "link", item = a, type = "blocks", target = { board = other.id, item = remote } })
            for _, q in ipairs({ "some", "every", "none" }) do
                test.eq(assert(h.call("count", { where = { rel = "blocks", q = q, where = { field = "state", op = "eq", value = "open" } } })).total, 0)
            end
        end)
    end)
end
return { run = test.run_cases(define) }
