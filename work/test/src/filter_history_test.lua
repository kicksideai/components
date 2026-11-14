-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- History conditions in the filter tree: what a field's value was, who changed
-- it and when, read from the change table; and the operands $now and $actor.
local test = require("test")
local sql = require("sql")
local fixtures = require("filter_fixture")
local values = require("values")
local types = require("types")

type Map = { [string]: unknown }

local OTHER_BOARD = "00000000-0000-0000-0000-00000000000f"

local function encoded(v: unknown): unknown
    if v == nil then return sql.NULL end
    return values.canonical(v)
end

-- with_changes adds change rows: r1 moss -> slate -> clay; r2 moss -> slate by u2;
-- r3 was set to slate once and never changed; r4 has only a rise of its size;
-- r5 was moss before its first tracked row.
local function with_changes(h: sql.DB): types.GeneratedTable
    local t = fixtures.table(h)
    fixtures.reset(h, OTHER_BOARD)
    local function row(board: string, seq: integer, id: string, actor: string, at: string, field: integer, before: unknown, after: unknown)
        assert(h:execute([[INSERT INTO kickside_work_change (board_id, seq, n, subject, kind, field_id, before, after, actor, at)
            VALUES ($1, $2, 1, $3, 'set', $4, $5, $6, $7, $8)]], { board, seq, "i:" .. id, field, encoded(before), encoded(after), actor, at }))
    end
    local function change(seq: integer, id: string, actor: string, day: integer, field: integer, before: unknown, after: unknown)
        row(fixtures.BOARD, seq, id, actor, string.format("2026-01-%02dT00:00:00.000000000Z", day), field, before, after)
    end
    change(1, "r1", "u1", 1, 1, nil, "moss")
    change(2, "r1", "u1", 10, 1, "moss", "slate")
    change(3, "r1", "u2", 20, 1, "slate", "clay")
    change(4, "r2", "u1", 2, 1, nil, "moss")
    change(5, "r2", "u2", 3, 1, "moss", "slate")
    change(6, "r3", "u1", 5, 1, nil, "slate")
    change(7, "r4", "u3", 6, 2, 40, 41)
    change(8, "r5", "u1", 15, 1, "moss", "slate")
    row(OTHER_BOARD, 1, "r6", "u1", "2026-01-01T00:00:00Z", 1, nil, "moss")
    return t
end

local function was(conditions: Map): Map
    conditions.field = conditions.field or "color"
    return { history = conditions }
end

local function jan(from: integer, to: integer): { string }
    return { string.format("2026-01-%02dT00:00:00.000000000Z", from), string.format("2026-01-%02dT00:00:00.000000000Z", to) }
end

local function define()
    test.describe("history conditions", function()
        test.it("preserves fractional and whole-second inclusive window bounds", function()
            local h = fixtures.db()
            local t = with_changes(h)
            assert(h:execute("UPDATE kickside_work_change SET at = '2026-01-05T00:00:00.500000000Z' WHERE board_id = $1 AND seq = 6", { fixtures.BOARD }))
            for _, bounds in ipairs({ { "2026-01-05T00:00:00Z", "2026-01-05T00:00:01Z" }, { "2026-01-05T00:00:00.4Z", "2026-01-05T00:00:00.6Z" } }) do
                test.eq(fixtures.ids(h, t, was({ by = "u1", during = bounds })), "r3")
            end
            h:release()
        end)
        test.it("answers was, by and during from the change rows of the item's board", function()
            local h = fixtures.db()
            local t = with_changes(h)
            local cases: { { unknown } } = {
                { was({ was = "moss" }), "r1,r2,r5" },
                { was({ was = "clay" }), "r1" },
                { was({ was = "never" }), "" },
                { was({ by = "u2" }), "r1,r2" },
                { was({ field = "size", by = "u3" }), "r4" },
                { was({}), "r1,r2,r3,r5" },
                { was({ during = jan(2, 5) }), "r2,r3" },
                { was({ by = "u1", during = jan(1, 2) }), "r1,r2" },
                { was({ was = "slate", by = "u2" }), "r2" },
                { was({ was = "moss", by = "u2" }), "" },
                { was({ field = "size", was = 40 }), "r4" },
                { was({ field = "size", was = 41 }), "r4" },
            }
            for i, c in ipairs(cases) do test.eq(fixtures.ids(h, t, c[1] :: Map), c[2], "case " .. i) end
            h:release()
        end)

        test.it("reads was during as the value being held in the window", function()
            local h = fixtures.db()
            local t = with_changes(h)
            local cases: { { unknown } } = {
                -- r1 held moss from the 1st to the 10th, r2 from the 2nd to the 3rd.
                { was({ was = "moss", during = jan(5, 6) }), "r1,r5" },
                { was({ was = "moss", during = jan(2, 3) }), "r1,r2,r5" },
                -- r5's only row shows it held moss until the 15th, from before its history.
                { was({ was = "moss", during = jan(14, 16) }), "r5" },
                { was({ was = "moss", during = jan(16, 17) }), "" },
                -- r3 still holds slate; r1 held it from the 10th to the 20th.
                { was({ was = "slate", during = jan(25, 26) }), "r2,r3,r5" },
                { was({ was = "slate", during = jan(12, 13) }), "r1,r2,r3" },
                { was({ was = "slate", during = jan(1, 2) }), "" },
                { was({ was = "clay", during = jan(1, 19) }), "" },
                { was({ was = "clay", during = jan(20, 20) }), "r1" },
                { was({ was = "slate", by = "u1", during = jan(12, 13) }), "r1,r3" },
            }
            for i, c in ipairs(cases) do test.eq(fixtures.ids(h, t, c[1] :: Map), c[2], "case " .. i) end
            h:release()
        end)

        test.it("nests under connectives with exact complements", function()
            local h = fixtures.db()
            local t = with_changes(h)
            test.eq(fixtures.ids(h, t, { ["not"] = was({ by = "u2" }) }), "r3,r4,r5,r6,r7,r8")
            test.eq(fixtures.ids(h, t, { ["and"] = { was({ was = "moss" }), fixtures.leaf("color", "eq", "moss") } }), "r1,r2")
            test.eq(fixtures.ids(h, t, { ["or"] = { was({ by = "u3", field = "size" }), fixtures.leaf("color", "is_null", true) } }), "r4,r7,r8")
            h:release()
        end)

        test.it("refuses a condition it cannot answer truthfully", function()
            local h = fixtures.db()
            local t = with_changes(h)
            local refused: { Map } = {
                { history = {} },
                { history = "moss" },
                { history = { was = "moss" } },
                { history = { field = "nope" } },
                { history = { field = "color", extra = 1 } },
                { history = { field = "color" }, field = "color" },
                was({ by = 3 }),
                was({ by = "" }),
                was({ was = {} }),
                was({ field = "size", was = "x" }),
                was({ during = "2026" }),
                was({ during = { "2026-01-01T00:00:00Z" } }),
                was({ during = { "2026-01-02T00:00:00Z", "2026-01-01T00:00:00Z" } }),
                was({ during = { "soon", "later" } }),
                was({ during = { "2026-01-01", "2026-01-02" } }),
                was({ field = "tags", was = "a" }),
                was({ field = "folded", was = "MOSS" }),
            }
            for i, where in ipairs(refused) do
                local _, err = fixtures.run(h, t, where)
                test.not_nil(err, "case " .. i)
                test.eq((err :: error):kind(), errors.INVALID, "case " .. i)
            end
            h:release()
        end)

    end)

    test.describe("operands", function()
        test.it("resolves $actor and $now where a value is taken", function()
            local h = fixtures.db()
            local t = with_changes(h)
            test.eq(fixtures.ids(h, t, was({ by = { ["$actor"] = "id" }, during = jan(2, 5) })), "r2,r3")
            test.eq(fixtures.ids(h, t, was({ during = { "2026-01-20T00:00:00Z", { ["$now"] = "P0D" } } })), "r1")
            test.eq(fixtures.ids(h, t, fixtures.leaf("at", "lt", { ["$now"] = "P0D" })), "r1,r2,r3,r4")
            test.eq(fixtures.ids(h, t, fixtures.leaf("at", "gt", { ["$now"] = "P36500D" })), "")
            test.eq(fixtures.ids(h, t, fixtures.leaf("at", "lt", { ["$now"] = "-P36500D" })), "")
            test.eq(fixtures.ids(h, t, fixtures.leaf("color", "neq", { ["$actor"] = "id" })), "r1,r2,r3,r4,r5,r6,r7,r8")
            test.eq(fixtures.ids(h, t, fixtures.leaf("color", "in", { "moss", { ["$actor"] = "id" } })), "r1,r2")
            h:release()
        end)

        test.it("refuses repeated out-of-order and mixed-week duration units", function()
            local h = fixtures.db()
            local t = fixtures.table(h)
            for _, offset in ipairs({ "PT1H1H", "PT1M1H", "P1W1D", "P1D1D", "PT1S1M" }) do
                local _, err = fixtures.run(h, t, fixtures.leaf("at", "lt", { ["$now"] = offset }))
                test.not_nil(err, offset)
                test.eq(err:details().code, "invalid_operand", offset)
            end
        end)
        test.it("reads $now offsets in weeks, days, hours, minutes and seconds", function()
            local h = fixtures.db()
            local t = with_changes(h)
            for _, offset in ipairs({ "PT0S", "-PT1H", "-P2W", "-P1DT2H3M4S", "PT90M" }) do
                local _, err = fixtures.run(h, t, fixtures.leaf("at", "lt", { ["$now"] = offset }))
                test.is_nil(err, offset)
            end
            h:release()
        end)

        test.it("refuses unknown operands, offsets and misplaced operands", function()
            local h = fixtures.db()
            local t = with_changes(h)
            local refused: { Map } = {
                fixtures.leaf("color", "eq", { ["$actor"] = "groups" }),
                fixtures.leaf("color", "eq", { ["$actor"] = "name" }),
                fixtures.leaf("color", "eq", { ["$thing"] = "id" }),
                fixtures.leaf("color", "eq", { ["$actor"] = "id", extra = 1 }),
                fixtures.leaf("at", "lt", { ["$now"] = "soon" }),
                fixtures.leaf("at", "lt", { ["$now"] = "P" }),
                fixtures.leaf("at", "lt", { ["$now"] = "PT" }),
                fixtures.leaf("at", "lt", { ["$now"] = "P1M" }),
                fixtures.leaf("at", "lt", { ["$now"] = "P1Y" }),
                fixtures.leaf("at", "lt", { ["$now"] = 5 }),
                fixtures.leaf("at", "lt", { ["$now"] = "P99999999999999D" }),
                fixtures.leaf("size", "lt", { ["$now"] = "P0D" }),
                fixtures.leaf("size", "eq", { ["$actor"] = "id" }),
                was({ by = { ["$now"] = "P0D" } }),
                was({ during = { { ["$actor"] = "id" }, "2026-01-01T00:00:00Z" } }),
            }
            for i, where in ipairs(refused) do
                local _, err = fixtures.run(h, t, where)
                test.not_nil(err, "case " .. i)
            end
            local anonymous, derr = fixtures.run_as(h, t, fixtures.leaf("color", "eq", { ["$actor"] = "id" }), nil)
            test.is_nil(anonymous)
            test.not_nil(derr)
            h:release()
        end)
    end)

    test.describe("time keys", function()
        test.it("orders fractional seconds with whole seconds", function()
            local h = fixtures.db()
            local t = fixtures.table(h)
            local plain = "2026-01-01T00:00:00Z"
            assert(not fixtures.reindex(h, t, "r5", "2026-01-01T00:00:00.5Z"))
            test.eq(fixtures.ids(h, t, fixtures.leaf("at", "gt", plain)), "r2,r3,r4,r5")
            test.eq(fixtures.ids(h, t, fixtures.leaf("at", "eq", "2026-01-01T00:00:00.500Z")), "r5")
            test.eq(fixtures.ids(h, t, fixtures.leaf("at", "lt", "2026-01-01T00:00:00.9Z")), "r1,r5")
            test.eq(fixtures.ids(h, t, fixtures.leaf("at", "eq", "2026-01-01T00:00:00.0Z")), "r1")
            h:release()
        end)
    end)
end

return { run = test.run_cases(define) }
