-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Mention validation on added and edited comments and their read views.
local test = require("test")
local fixture = require("fixture")
local steps = require("steps")

type Map = { [string]: unknown }

local function define()
    test.describe("mentions", function()
        test.it("carries principal mentions through events, rows and reads", function()
            local h = fixture.board()
            local id = steps.create(h, "task")
            local mentions = { { kind = "user", id = "u" }, { kind = "group", id = "g" }, { kind = "service", id = "s" } }
            local added = steps.one(h, { op = "comment", item = id, body = "Hello", mentions = mentions })
            test.eq(added.status, "applied")
            local comments = assert(steps.get(h, id, { "comments" })).comments :: { Map }
            test.eq(#(comments[1].mentions :: { Map }), 3)
            test.eq((comments[1].mentions :: { Map })[2].kind, "group")
            local edited = steps.one(h, { op = "comment", item = id, comment = added.comment, body = "Hello", mentions = { mentions[3] } })
            test.eq(edited.status, "applied")
            comments = assert(steps.get(h, id, { "comments" })).comments :: { Map }
            test.eq(#(comments[1].mentions :: { Map }), 1)
            test.eq((comments[1].mentions :: { Map })[1].id, "s")
            test.eq(comments[1].version, 2)
            test.eq(steps.one(h, { op = "comment", item = id, comment = added.comment, body = "Hello", mentions = { mentions[3] } }).status, "unchanged")
            local events = steps.events(h)
            test.eq(#(events[#events].body.mentions :: { Map }), 1)
            test.eq(#(events[#events - 1].body.mentions :: { Map }), 3)
            test.eq(steps.one(h, { op = "comment", item = id, comment = added.comment, body = "Hello" }).status, "applied")
            test.eq(#(assert(steps.get(h, id, { "comments" })).comments[1].mentions), 0)
        end)

        test.it("refuses malformed and oversized mention lists on add and edit", function()
            local h = fixture.board()
            local id = steps.create(h, "task")
            local added = steps.one(h, { op = "comment", item = id, body = "Original" })
            local oversized = {}
            for i = 1, 201 do oversized[i] = { kind = "user", id = "u" .. i } end
            local invalid: { unknown } = { "user", { kind = "user", id = "u" }, { false }, { { kind = "bot", id = "b" } },
                { { kind = "user", id = "" } }, { { kind = "user", id = 4 } }, { { kind = "user", id = "u", extra = true } }, oversized }
            for _, mentions in ipairs(invalid) do
                for _, comment in ipairs({ false, added.comment }) do
                    local outcome = steps.one(h, { op = "comment", item = id, comment = comment or nil, body = "Changed", mentions = mentions })
                    test.eq(outcome.status, "invalid")
                    test.eq((outcome.findings :: { Map })[1].code, "invalid_mentions")
                end
            end
            test.eq(assert(steps.get(h, id, { "comments" })).comments[1].body, "Original")
        end)
    end)
end

return { run = test.run_cases(define) }
