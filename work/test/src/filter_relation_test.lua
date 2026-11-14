-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Relation conditions: some, every and none over the items a typed link reaches.
local test = require("test")
local sql = require("sql")
local fixtures = require("filter_fixture")
local types = require("types")

type Map = { [string]: unknown }

local BOARD = fixtures.BOARD
local OTHER = "00000000-0000-0000-0000-00000000000e"

local function relation(id: string, outward: string, inward: string, symmetric: boolean): types.Relation
    return { id = id, outward = outward, inward = inward, cardinality = "many", symmetric = symmetric }
end

local RELATIONS: { [string]: types.Relation } = {
    blocks = relation("blocks", "blocks", "blocked_by", false),
    related = relation("related", "related", "related", true),
    depends = relation("depends", "depends_on", "needed_by", false),
}

local function exec(h: sql.DB, statement: string, params: { unknown }?)
    local _, err = h:execute(statement, params or {})
    assert(not err, tostring(err))
end

-- related builds: r1 blocks r2 and r3; r4 blocks r5; r5 blocks r1; r6 blocks an item
-- of another board; an item of another board blocks r7; r2 and r4 are related; r3
-- depends on trashed r8.
local function related(h: sql.DB): types.GeneratedTable
    local t = fixtures.table(h)
    t.relations = RELATIONS
    fixtures.reset(h, OTHER)
    local function link(board: string, from: string, kind: string, to_board: string, to: string)
        exec(h, "INSERT INTO kickside_work_link (board_id, from_id, type, to_board_id, to_id, at, seq) VALUES ($1, $2, $3, $4, $5, '', 1)", { board, from, kind, to_board, to })
    end
    link(BOARD, "r1", "blocks", BOARD, "r2")
    link(BOARD, "r1", "blocks", BOARD, "r3")
    link(BOARD, "r4", "blocks", BOARD, "r5")
    link(BOARD, "r5", "blocks", BOARD, "r1")
    link(BOARD, "r6", "blocks", OTHER, "x1")
    link(OTHER, "y1", "blocks", BOARD, "r7")
    link(BOARD, "r2", "related", BOARD, "r4")
    link(BOARD, "r3", "depends", BOARD, "r8")
    exec(h, "UPDATE " .. t.names.item .. " SET life = 'trashed' WHERE item_id = 'r8'")
    return t
end

local function rel(name: string, q: string, where: Map?, dir: string?): Map
    return { rel = name, q = q, where = where, dir = dir }
end

local MOSS = fixtures.leaf("color", "eq", "moss")
local SLATE = fixtures.leaf("color", "eq", "slate")
local MOSSY = fixtures.leaf("color", "starts_with", "moss")

local function define()
    test.describe("quantifiers", function()
        test.it("answers some, every and none in each direction", function()
            local h = fixtures.db()
            local t = related(h)
            local cases: { { unknown } } = {
                { rel("blocks", "some", MOSS), "r1,r5" },
                { rel("blocks", "some"), "r1,r4,r5" },
                { rel("blocks", "every", MOSSY), "r1,r2,r3,r5,r7,r8" },
                { rel("blocks", "none", MOSS), "r2,r3,r4,r7,r8" },
                { rel("blocks", "none"), "r2,r3,r7,r8" },
                { rel("blocks", "some", MOSS, "inward"), "r2,r3" },
                { rel("blocks", "every", SLATE, "inward"), "r1,r4,r5,r6,r8" },
                { rel("blocks", "none", MOSS, "inward"), "r1,r4,r5,r6,r8" },
                { rel("related", "some", SLATE), "r2" },
                { rel("related", "some", MOSS), "r4" },
                { rel("related", "none", MOSS), "r1,r2,r3,r5,r6,r7,r8" },
                { rel("blocks", "some", fixtures.leaf("tags", "has", "c")), "r1" },
                { rel("blocks", "some", fixtures.leaf("size", "gt", 45)), "r4" },
                { rel("blocks", "some", fixtures.leaf("size", "gt", 55)), "" },
            }
            for i, c in ipairs(cases) do test.eq(fixtures.ids(h, t, c[1] :: Map), c[2], "case " .. i) end
            h:release()
        end)

        test.it("ignores a link to a trashed or missing item", function()
            local h = fixtures.db()
            local t = related(h)
            test.eq(fixtures.ids(h, t, rel("depends", "some")), "")
            test.eq(fixtures.ids(h, t, rel("depends", "none")), "r1,r2,r3,r4,r5,r6,r7,r8")
            test.eq(fixtures.ids(h, t, rel("depends", "every", MOSS)), "r1,r2,r3,r4,r5,r6,r7,r8")
            exec(h, "DELETE FROM " .. t.names.item .. " WHERE item_id = 'r2'")
            test.eq(fixtures.ids(h, t, rel("blocks", "some", fixtures.leaf("color", "eq", "moss"))), "r5")
            h:release()
        end)

        test.it("answers every and none false over a link it cannot read", function()
            local h = fixtures.db()
            local t = related(h)
            local outward = fixtures.ids(h, t, rel("blocks", "every", MOSSY))
            test.is_true(outward:find("r6", 1, true) == nil)
            test.is_true(fixtures.ids(h, t, rel("blocks", "none")):find("r6", 1, true) == nil)
            test.is_true(fixtures.ids(h, t, rel("blocks", "every", SLATE, "inward")):find("r7", 1, true) == nil)
            test.is_true(fixtures.ids(h, t, rel("blocks", "some")):find("r6", 1, true) == nil)
            h:release()
        end)

        test.it("nests under connectives and other relations, each over its own row", function()
            local h = fixtures.db()
            local t = related(h)
            test.eq(fixtures.ids(h, t, rel("blocks", "some", rel("blocks", "some", MOSS))), "r4,r5")
            test.eq(fixtures.ids(h, t, { ["not"] = rel("blocks", "some", MOSS) }), "r2,r3,r4,r6,r7,r8")
            test.eq(fixtures.ids(h, t, { ["and"] = { rel("blocks", "some", MOSS), SLATE } }), "r5")
            test.eq(fixtures.ids(h, t, rel("blocks", "some", { ["not"] = MOSS })), "r1,r4")
            test.eq(fixtures.ids(h, t, rel("blocks", "some", { ["and"] = { MOSSY, rel("related", "some", SLATE) } })), "r1")
            h:release()
        end)

        test.it("asks history about the row the relation reaches", function()
            local h = fixtures.db()
            local t = related(h)
            assert(h:execute([[INSERT INTO kickside_work_change (board_id, seq, n, subject, kind, field_id, after, actor, at)
                VALUES ($1, 1, 1, 'i:r2', 'set', 1, '"moss"', 'u9', '2026-01-01T00:00:00Z')]], { BOARD }))
            test.eq(fixtures.ids(h, t, rel("blocks", "some", { history = { field = "color", by = "u9" } })), "r1")
            test.eq(fixtures.ids(h, t, { history = { field = "color", by = "u9" } }), "r2")
            h:release()
        end)

        test.it("refuses what it cannot answer and crosses a bounded number of relations", function()
            local h = fixtures.db()
            local t = related(h)
            local refused: { Map } = {
                rel("nope", "some"),
                rel("blocks", "most"),
                rel("blocks", "every"),
                rel("blocks", "some", nil, "sideways"),
                rel("related", "some", nil, "inward"),
                { rel = 1, q = "some" },
                { rel = "blocks" },
                { rel = "blocks", q = "some", extra = 1 },
                rel("blocks", "some", {}),
                rel("blocks", "some", fixtures.leaf("nope", "eq", 1)),
                rel("blocks", "some", rel("blocks", "some", rel("blocks", "some", rel("blocks", "some")))),
            }
            for i, where in ipairs(refused) do
                local _, err = fixtures.run(h, t, where)
                test.not_nil(err, "case " .. i)
                test.eq((err :: error):kind(), errors.INVALID, "case " .. i)
            end
            test.not_nil(fixtures.ids(h, t, rel("blocks", "some", rel("blocks", "some", rel("blocks", "some")))))
            local plain = fixtures.table(h)
            local _, none = fixtures.run(h, plain, rel("blocks", "some"))
            test.not_nil(none)
            h:release()
        end)
    end)
end

return { run = test.run_cases(define) }
