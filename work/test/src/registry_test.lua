-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- The prefix registry: a system component whose thread holds the claims, writable by
-- work administrators only, appended atomically with a board write.
local test = require("test")
local autoinit = require("autoinit")
local fixture = require("fixture")
local scoped = require("scoped")
local steps = require("steps")

local function registry_id(): string
    return autoinit.component_id(autoinit.SYSTEM_SCOPE_KEY, "work_registry") :: string
end

local function claim_event(prefix: string, board: string): { [string]: unknown }
    return { type = "kickside.work.events:prefix.claimed", subject = "prefix:" .. prefix,
        body = { prefix = prefix, board = board, actor = "probe", at = "2026-11-03T00:00:00.000Z" } }
end

local function define()
    test.describe("prefix registry", function()
        test.it("claims a prefix through schema apply for a work administrator", function()
            local h = fixture.board({ bare = true })
            local prefix = fixture.fresh_prefix()
            local out, err = h.call("apply_schema", { declaration = fixture.declaration(prefix) })
            test.is_nil(err, steps.detail(err))
            test.eq(out.generation, 1)
        end)

        test.it("refuses claims from a member outside the administrator group", function()
            local h = fixture.board({ bare = true })
            local call = scoped.member().call
            local prefix = fixture.fresh_prefix()
            local out, err = call("append", { thread_id = registry_id(),
                events = { claim_event(prefix, h.id) }, expect = { subject = "prefix:" .. prefix, version = 0 } })
            test.is_nil(out)
            test.not_nil(err)
            test.eq((err :: error):kind(), errors.PERMISSION_DENIED, steps.detail(err))
        end)

        test.it("rolls back a registry write when the other thread's write conflicts", function()
            local h = fixture.board({ bare = true })
            local prefix = fixture.fresh_prefix()
            local _, err = h.call("trusted_append", { writes = {
                { thread_id = registry_id(), events = { claim_event(prefix, h.id) }, expect = { subject = "prefix:" .. prefix, version = 0 } },
                { thread_id = h.id, events = { { type = "kickside.work.events:comment.deleted", subject = "c:x",
                    body = { comment = "x", item = "y", actor = "probe", at = "2026-11-03T00:00:00.000Z" } } }, expect = { head = 99 } },
            } })
            test.not_nil(err)
            test.eq((err :: error):details().reason, "head_mismatch", steps.detail(err))
            local _, again = h.call("trusted_append", { thread_id = registry_id(),
                events = { claim_event(prefix, h.id) }, expect = { subject = "prefix:" .. prefix, version = 0 } })
            test.is_nil(again, steps.detail(again))
        end)
    end)
end

return { run = test.run_cases(define) }
