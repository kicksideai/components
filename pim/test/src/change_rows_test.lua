-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Change history rows: collected per event with consecutive numbers, paged
-- newest first per catalog and subject with a stable cursor, pruned by age in
-- bounded batches, with JSON fields read back as values.
local test = require("test")
local sql = require("sql")
local history = require("history")
local types = require("types")

local C1, C2 = "change-rows-1", "change-rows-2"

local function db(): sql.DB
    local h, err = sql.get("app:db")
    assert(h, tostring(err))
    return h
end

local function fresh(h: sql.DB)
    assert(h:execute("DELETE FROM kickside_pim_change WHERE catalog_id = $1 OR catalog_id = $2", { C1, C2 }))
end

local function seed(h: sql.DB)
    local rows: { types.SqlParams } = {}
    for seq = 1, 4 do
        history.collect(rows, { catalog_id = C1, seq = seq, subject = seq % 2 == 0 and "p:a" or "p:b", actor = "u1",
            at = string.format("2026-01-0%dT00:00:00Z", seq), origin = seq == 4 and { job = "x" } or nil }, {
            { kind = "created" },
            { kind = "set", attribute_id = 7, ctx = "", before = seq - 1, after = { m = seq, e = 0 }, source = seq == 3 and "erp" or nil },
        })
    end
    history.collect(rows, { catalog_id = C2, seq = 1, subject = "p:a", actor = "u2", at = "2026-01-01T00:00:00Z", source = "feed" },
        { { kind = "created" } })
    assert(not history.write(h, rows))
end

local function define()
    test.describe("change history", function()
        test.it("pages one catalog newest first and keeps JSON fields as values", function()
            local h = db()
            fresh(h)
            seed(h)
            local all = assert((history.page(h, C1, { limit = 50 })))
            test.eq(#all, 8)
            test.eq(all[1].seq, 4)
            test.eq(all[1].n, 2)
            test.eq(all[1].kind, "set")
            test.eq(all[1].attribute_id, 7)
            test.eq((all[1].after :: { [string]: unknown }).m, 4)
            test.eq((all[1].origin :: { [string]: unknown }).job, "x")
            test.eq(all[2].kind, "created")
            test.is_nil(all[2].attribute_id)
            test.is_nil(all[2].before)
            local erp = all[3]
            test.eq(erp.seq, 3)
            test.eq(erp.source, "erp")
            local other = assert((history.page(h, C2, { limit = 50 })))
            test.eq(#other, 1)
            test.eq(other[1].source, "feed")
            h:release()
        end)

        test.it("pages by subject with a cursor and refuses malformed cursors", function()
            local h = db()
            fresh(h)
            seed(h)
            local seen: { string } = {}
            local before: string? = nil
            repeat
                local page, next_cursor, err = history.page(h, C1, { subject = "p:a", before = before, limit = 3 })
                assert(page, tostring(err))
                for _, e in ipairs(page) do seen[#seen + 1] = e.seq .. ":" .. e.n end
                before = next_cursor
            until before == nil
            test.eq(table.concat(seen, ","), "4:2,4:1,2:2,2:1")
            for _, bad in ipairs({ "x", "1:", ":1", "1:2:3" }) do
                local _, _, err = history.page(h, C1, { before = bad, limit = 3 })
                test.not_nil(err, bad)
            end
            h:release()
        end)

        test.it("prunes the oldest rows of one catalog in bounded batches", function()
            local h = db()
            fresh(h)
            seed(h)
            test.eq(history.prune(h, C1, "2026-01-03T00:00:00Z", 3), 3)
            test.eq(history.prune(h, C1, "2026-01-03T00:00:00Z", 3), 1)
            test.eq(history.prune(h, C1, "2026-01-03T00:00:00Z", 3), 0)
            test.eq(#assert((history.page(h, C1, { limit = 50 }))), 4)
            test.eq(#assert((history.page(h, C2, { limit = 50 }))), 1)
            h:release()
        end)
    end)
end

return { run = test.run_cases(define) }
