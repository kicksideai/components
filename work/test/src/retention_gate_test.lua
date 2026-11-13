-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Core owns the retention gate; this regression records the declared board WRITE boundary.
local test = require("test")
local scoped = require("scoped")

local function define()
    test.describe("retention authority", function()
        test.it("refuses READ-only and allows WRITE to change board retention", function()
            local admin, member, reader = scoped.admin(), scoped.member(), scoped.member()
            local h = scoped.board(admin)
            assert(h.call("grant", { subject_id = member.id, mask = 3 }))
            assert(h.call("grant", { subject_id = reader.id, mask = 1 }))
            test.eq(reader.http("PUT", "/api/threads/" .. h.id .. "/retention", { event_hot_retention_days = 7 }).status, 403)
            test.eq(member.http("PUT", "/api/threads/" .. h.id .. "/retention", { event_hot_retention_days = 7 }).status, 200)
        end)
    end)
end

return { run = test.run_cases(define) }
