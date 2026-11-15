-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local fixture = require("fixture")
local scoped = require("scoped")
local store = require("store")
local values = require("values")

local function define()
    test.describe("durable catalog reads", function()
        test.it("keeps history releases publications and products readable after the event log expires", function()
            local h = scoped.catalog(scoped.member())
            fixture.boot(h)
            local outcome = assert(h.call("release", { items = { { product = { sku = "RDG-moss-40" }, expect_version = 1, channels = { "web" } } } })).outcomes[1]
            test.eq(outcome.outcome, "released")
            local methods = {
                { method = "list_history", request = { limit = 200 } },
                { method = "get_release", request = { release_id = outcome.release_id } },
                { method = "list_publications", request = { channel = "web" } },
                { method = "list_changes", request = { limit = 500 } },
                { method = "get", request = { product = { sku = "RDG-moss-40" } } },
            }
            local before: { string } = {}
            for i, probe in ipairs(methods) do before[i] = values.canonical(assert(h.call(probe.method, probe.request))) end
            assert(h.call("settle", {}))
            local db = assert(store.open())
            local n = assert(db:query("SELECT COUNT(*) AS n FROM kickside_event WHERE thread_id = $1", { h.id }))[1].n
            assert(db:execute("DELETE FROM kickside_event WHERE thread_id = $1", { h.id }))
            local remaining = assert(db:query("SELECT COUNT(*) AS n FROM kickside_event WHERE thread_id = $1", { h.id }))[1].n
            assert(db:release())
            test.is_true(tonumber(n) > 0)
            test.eq(tonumber(remaining), 0)
            for i, probe in ipairs(methods) do
                local out, err = h.call(probe.method, probe.request)
                test.is_nil(err, tostring(err))
                test.eq(values.canonical(out), before[i], probe.method)
            end
        end)
    end)
end
return { run = test.run_cases(define) }
