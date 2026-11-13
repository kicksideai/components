-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- The filter tree on both engines: connectives with exact Boolean complements,
-- typed operators per field shape, operators that match empty values, and the
-- limits of one tree.
local test = require("test")
local fixtures = require("filter_fixture")
local reads = require("reads")
local select = require("select")
local filter = require("filter")
local types = require("types")

type Map = { [string]: unknown }

local ALL = fixtures.ALL
local READER = fixtures.READER
local resolve = fixtures.resolve
local fixture, run, ids, leaf, db = fixtures.table, fixtures.run, fixtures.ids, fixtures.leaf, fixtures.db

local function define()
    test.describe("filter tree", function()
        test.it("answers each operator over values and empty values", function()
            local h = db()
            local t = fixture(h)
            local cases: { { unknown } } = {
                { leaf("color", "eq", "moss"), "r1,r2" },
                { leaf("color", "neq", "moss"), "r3,r4,r5,r6,r7,r8" },
                { leaf("color", "in", { "moss", "slate" }), "r1,r2,r4,r5" },
                { leaf("color", "nin", { "moss", "slate" }), "r3,r6,r7,r8" },
                { leaf("color", "is_null", true), "r7,r8" },
                { leaf("color", "is_null", false), "r1,r2,r3,r4,r5,r6" },
                { leaf("color", "starts_with", "moss"), "r1,r2,r3" },
                { leaf("color", "contains", "late"), "r4,r5,r6" },
                { leaf("size", "eq", 20), "r2" },
                { leaf("size", "neq", 20), "r1,r3,r4,r5,r6,r7,r8" },
                { leaf("size", "lt", 20), "r1" },
                { leaf("size", "lte", 20), "r1,r2" },
                { leaf("size", "gt", 50), "r6" },
                { leaf("size", "gte", 50), "r5,r6" },
                { leaf("size", "between", { 20, 40 }), "r2,r3,r4" },
                { leaf("size", "nin", { 10, 20, 30 }), "r4,r5,r6,r7,r8" },
                { leaf("size", "is_null", true), "r7,r8" },
                { leaf("at", "gt", "2026-02-01T00:00:00Z"), "r3,r4" },
                { leaf("at", "between", { "2026-02-01T00:00:00Z", "2026-03-01T00:00:00Z" }), "r2,r3" },
                { leaf("tags", "has", "a"), "r1,r2,r7" },
                { leaf("tags", "in", { "b", "d" }), "r1,r5" },
                { leaf("tags", "nin", { "a", "c" }), "r5,r6,r8" },
                { leaf("tags", "is_null", true), "r6,r8" },
                { leaf("tags", "is_null", false), "r1,r2,r3,r4,r5,r7" },
            }
            for _, c in ipairs(cases) do
                local where = c[1] :: Map
                test.eq(ids(h, t, where), c[2], tostring(where.field) .. " " .. tostring(where.op))
            end
            h:release()
        end)

        test.it("reads pattern characters in contains and starts_with as text", function()
            local h = db()
            local t = fixture(h)
            test.eq(ids(h, t, leaf("color", "contains", "%")), "r6")
            test.eq(ids(h, t, leaf("color", "contains", "_")), "r6")
            test.eq(ids(h, t, leaf("color", "starts_with", "%")), "")
            test.eq(ids(h, t, leaf("color", "starts_with", "m_ss")), "")
            test.eq(ids(h, t, leaf("color", "contains", "MOSS")), "")
            test.eq(ids(h, t, leaf("color", "starts_with", "MOSS")), "")
            h:release()
        end)

        test.it("makes not the exact complement of every operator", function()
            local h = db()
            local t = fixture(h)
            local leaves: { Map } = {
                leaf("color", "eq", "moss"), leaf("color", "neq", "moss"), leaf("color", "in", { "moss" }), leaf("color", "nin", { "moss" }),
                leaf("color", "contains", "o"), leaf("color", "starts_with", "m"), leaf("color", "is_null", true),
                leaf("size", "lt", 30), leaf("size", "lte", 30), leaf("size", "gt", 30), leaf("size", "gte", 30),
                leaf("size", "between", { 20, 40 }), leaf("at", "lt", "2026-03-01T00:00:00Z"),
                leaf("tags", "has", "a"), leaf("tags", "in", { "a" }), leaf("tags", "nin", { "a" }), leaf("tags", "is_null", false),
            }
            for _, l in ipairs(leaves) do
                local label = tostring(l.field) .. " " .. tostring(l.op)
                local yes = ids(h, t, l)
                local no = ids(h, t, { ["not"] = l })
                local seen: { [string]: integer } = {}
                for id in (yes .. "," .. no):gmatch("[^,]+") do seen[id] = (seen[id] or 0) + 1 end
                for i = 1, ALL do test.eq(seen["r" .. i], 1, label .. " r" .. i) end
                test.eq(ids(h, t, { ["not"] = { ["not"] = l } }), yes, label)
            end
            h:release()
        end)

        test.it("combines and, or and not over empty values", function()
            local h = db()
            local t = fixture(h)
            local moss, big = leaf("color", "eq", "moss"), leaf("size", "gt", 15)
            test.eq(ids(h, t, { ["and"] = { moss, big } }), "r2")
            test.eq(ids(h, t, { ["or"] = { moss, big } }), "r1,r2,r3,r4,r5,r6")
            test.eq(ids(h, t, { ["and"] = { moss } }), "r1,r2")
            test.eq(ids(h, t, { ["not"] = { ["and"] = { moss, big } } }), "r1,r3,r4,r5,r6,r7,r8")
            test.eq(ids(h, t, { ["or"] = { { ["not"] = moss }, { ["not"] = big } } }), "r1,r3,r4,r5,r6,r7,r8")
            test.eq(ids(h, t, { ["not"] = { ["or"] = { moss, big } } }), "r7,r8")
            test.eq(ids(h, t, { ["and"] = { { ["not"] = moss }, { ["not"] = big } } }), "r7,r8")
            test.eq(ids(h, t, { ["and"] = { { ["or"] = { moss, leaf("tags", "has", "c") } }, { ["not"] = leaf("size", "eq", 30) } } }), "r1,r2,r4")
            h:release()
        end)

        test.it("binds every value and refuses unknown shapes of a tree", function()
            local h = db()
            local t = fixture(h)
            local hostile = "x' OR 1=1; DROP TABLE kickside_work_item; --"
            test.eq(ids(h, t, leaf("color", "eq", hostile)), "")
            test.eq(ids(h, t, leaf("color", "contains", hostile)), "")
            test.eq(ids(h, t, leaf("tags", "nin", { hostile })), "r1,r2,r3,r4,r5,r6,r7,r8")
            local refused: { Map } = {
                {},
                { field = "color" },
                { op = "eq", value = "moss" },
                { ["and"] = {} },
                { ["or"] = {} },
                { ["and"] = "moss" },
                { ["and"] = { field = "color", op = "eq", value = "moss" } },
                { ["not"] = {} },
                { ["not"] = { leaf("color", "eq", "moss") } },
                { ["and"] = { leaf("color", "eq", "moss") }, ["or"] = { leaf("color", "eq", "moss") } },
                { ["and"] = { leaf("color", "eq", "moss") }, field = "color", op = "eq", value = "moss" },
                { field = "color", op = "eq", value = "moss", extra = 1 },
                { field = 1, op = "eq", value = "moss" },
                { field = "color", op = 1, value = "moss" },
                { field = "color", op = "eq", value = "moss", ctx = "en" },
                { field = "color; DROP TABLE kickside_work_item", op = "eq", value = "moss" },
                leaf("color", "= 1 OR 1", "moss"),
                leaf("color", "like", "moss"),
                leaf("nope", "eq", "moss"),
            }
            for i, where in ipairs(refused) do
                local _, err = run(h, t, where)
                test.not_nil(err, "shape " .. i)
                test.eq((err :: error):kind(), errors.INVALID, "shape " .. i)
            end
            h:release()
        end)

        test.it("refuses an operator or operand the field's shape does not take", function()
            local h = db()
            local t = fixture(h)
            local refused: { Map } = {
                { field = "color", op = "eq" },
                { field = "color", op = "in" },
                leaf("color", "lt", "moss"),
                leaf("color", "gte", "moss"),
                leaf("color", "between", { "a", "z" }),
                leaf("color", "has", "moss"),
                leaf("color", "eq", { "moss" }),
                leaf("color", "in", {}),
                leaf("color", "in", "moss"),
                leaf("color", "nin", {}),
                leaf("color", "contains", ""),
                leaf("color", "starts_with", ""),
                leaf("color", "contains", 3),
                leaf("color", "is_null", "yes"),
                leaf("color", "is_null", 1),
                leaf("size", "eq", "x"),
                leaf("size", "contains", "1"),
                leaf("size", "starts_with", "1"),
                leaf("size", "has", 1),
                leaf("size", "between", { 1 }),
                leaf("size", "between", { 1, 2, 3 }),
                leaf("size", "between", 1),
                leaf("size", "between", { 40, 20 }),
                leaf("at", "contains", "2026"),
                leaf("at", "gt", "yesterday"),
                leaf("tags", "eq", "a"),
                leaf("tags", "neq", "a"),
                leaf("tags", "lt", "a"),
                leaf("tags", "between", { "a", "b" }),
                leaf("tags", "contains", "a"),
                leaf("tags", "starts_with", "a"),
                leaf("tags", "has", { "a" }),
                leaf("tags", "has", 3),
            }
            for i, where in ipairs(refused) do
                local _, err = run(h, t, where)
                test.not_nil(err, "case " .. i .. " " .. tostring(where.field) .. " " .. tostring(where.op))
            end
            h:release()
        end)

        test.it("counts matches apart from the page and the cursor, and caps the count", function()
            local h = db()
            local t = fixture(h)
            local function counted(q: types.ItemQuery): (integer, boolean)
                local plan = assert((select.items(READER, t, h:type(), q, resolve, {}, {}, 1)))
                local total, estimated, err = select.total(h, plan.count :: reads.Count)
                assert(total and estimated ~= nil, tostring(err))
                return total :: integer, estimated :: boolean
            end
            local moss = leaf("color", "starts_with", "moss")
            local total, estimated = counted({ where = moss, count = 100 })
            test.eq(total, 3)
            test.is_false(estimated)
            total, estimated = counted({ where = moss, count = 100, after = { id = "r2" } })
            test.eq(total, 3)
            test.is_false(estimated)
            total, estimated = counted({ where = moss, count = 3 })
            test.eq(total, 3)
            test.is_false(estimated)
            total, estimated = counted({ where = moss, count = 2 })
            test.eq(total, 2)
            test.is_true(estimated)
            total, estimated = counted({ count = 100 })
            test.eq(total, ALL)
            test.is_false(estimated)
            total, estimated = counted({ where = leaf("color", "eq", "none"), count = 100 })
            test.eq(total, 0)
            test.is_false(estimated)
            local plain = assert((select.items(READER, t, h:type(), {}, resolve, {}, {}, 1)))
            test.is_nil(plain.count)
            h:release()
        end)

        test.it("holds a tree to its depth, leaf and value limits", function()
            local h = db()
            local t = fixture(h)
            local function nested(depth: integer): Map
                local node: Map = leaf("color", "eq", "moss")
                for _ = 2, depth do node = { ["and"] = { node } } end
                return node
            end
            local function leaves(n: integer): Map
                local list: { Map } = {}
                for i = 1, n do list[i] = leaf("size", "eq", 1000 + i) end
                return { ["or"] = list }
            end
            local function listed(n: integer): Map
                local list: { integer } = {}
                for i = 1, n do list[i] = 1000 + i end
                return leaf("size", "in", list)
            end
            test.eq(ids(h, t, nested(filter.LIMITS.depth)), "r1,r2")
            local function refused(where: Map)
                local _, err = run(h, t, where)
                test.not_nil(err)
            end
            refused(nested(filter.LIMITS.depth + 1))
            test.eq(ids(h, t, leaves(filter.LIMITS.leaves)), "")
            refused(leaves(filter.LIMITS.leaves + 1))
            test.eq(ids(h, t, listed(filter.LIMITS.values)), "")
            refused(listed(filter.LIMITS.values + 1))
            h:release()
        end)
    end)
end

return { run = test.run_cases(define) }
