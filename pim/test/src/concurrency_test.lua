-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Races through the head check: concurrent commands serialize, exactly one of
-- two conflicting commands wins, the loser answers from the winner's state, and
-- no write is lost while a schema change or rebuild runs.
local test = require("test")
local fixture = require("fixture")
local steps = require("steps")
local store = require("store")
local time = require("time")
local channel = require("channel")
local types = require("types")

type Map = { [string]: unknown }

-- together runs requests of op concurrently and returns each result and error.
local function together(h: fixture.Handle, calls: { { unknown } }): { { out: Map?, err: error? } }
    local pending: { unknown } = {}
    for i, c in ipairs(calls) do
        local cmd, err = h.async(c[1] :: string, c[2])
        assert(not err, tostring(err))
        pending[i] = cmd
    end
    local results: { { out: Map?, err: error? } } = {}
    for i, cmd in ipairs(pending) do
        local deadline = time.after("60s")
        local selected = channel.select({ cmd:response():case_receive(), deadline:case_receive() })
        assert(selected.channel ~= deadline, "command timed out")
        local payload, err = cmd:result()
        if err then
            results[i] = { err = err }
        else
            results[i] = { out = payload:data() :: Map }
        end
    end
    return results
end

local function outcomes(results: { { out: Map?, err: error? } }): { string }
    local out: { string } = {}
    for i, r in ipairs(results) do
        assert(not r.err, tostring(r.err))
        out[i] = ((r.out :: Map).outcomes :: { types.Outcome })[1].outcome
    end
    table.sort(out)
    return out
end

local function apply_item(item: Map): { unknown }
    return { "apply", { items = { item } } }
end

local function define()
    test.describe("conflicting commands", function()
        test.it("creates a sku once when two commands race", function()
            local h = fixture.catalog()
            local out = outcomes(together(h, { apply_item({ product = { sku = "RACE" }, create = {} }), apply_item({ product = { sku = "RACE" }, create = {} }) }))
            test.eq(table.concat(out, ","), "conflict,created")
            test.eq(assert(steps.get(h, "RACE")).product.version, 1)
        end)

        test.it("lets one of two edits at one version win", function()
            local h = fixture.catalog()
            fixture.boot(h)
            local v = steps.version(h, "RDG-moss-40")
            local out = outcomes(together(h, {
                apply_item({ product = { sku = "RDG-moss-40" }, expect_version = v, set = { { attr = "core.gtin", value = "race-a" } } }),
                apply_item({ product = { sku = "RDG-moss-40" }, expect_version = v, set = { { attr = "core.gtin", value = "race-b" } } }) }))
            test.eq(table.concat(out, ","), "conflict,updated")
            test.eq(steps.version(h, "RDG-moss-40"), v + 1)
        end)

        test.it("gives a unique value to one of two claimants", function()
            local h = fixture.catalog()
            fixture.boot(h)
            local out = outcomes(together(h, {
                apply_item({ product = { sku = "RDG-moss-40" }, expect_version = "any", set = { { attr = "core.gtin", value = "only-one" } } }),
                apply_item({ product = { sku = "RDG-moss-41" }, expect_version = "any", set = { { attr = "core.gtin", value = "only-one" } } }) }))
            test.eq(table.concat(out, ","), "conflict,updated")
            test.eq(#h.call("query", { where = { field = "core.gtin", op = "eq", value = "only-one" } }).items, 1)
        end)

        test.it("gives a sibling axis slot to one of two claimants", function()
            local h = fixture.catalog()
            fixture.boot(h)
            local function child(sku: string): { unknown }
                return apply_item({ product = { sku = sku }, create = { parent = { sku = "RDG-moss" } }, set = { { attr = "core.size", value = 88 } } })
            end
            test.eq(table.concat(outcomes(together(h, { child("A88"), child("B88") })), ","), "conflict,created")
        end)

        test.it("applies an idempotent command once when its key races itself", function()
            local h = fixture.catalog()
            fixture.boot(h)
            local request = { idempotency = { namespace = "race", key = "k" },
                items = { { product = { sku = "RDG-moss-40" }, expect_version = "any", set = { { attr = "core.gtin", value = "once" } } } } }
            local before = steps.version(h, "RDG-moss-40")
            local results = together(h, { { "apply", request }, { "apply", request }, { "apply", request } })
            for _, r in ipairs(results) do
                test.is_nil(r.err)
                test.eq(((r.out :: Map).outcomes :: { types.Outcome })[1].outcome, "updated")
            end
            test.eq(steps.version(h, "RDG-moss-40"), before + 1)
        end)
    end)

    test.describe("proposals under race", function()
        test.it("admits only one submission when two requests race for the last quota slot", function()
            local h = fixture.catalog()
            fixture.boot(h)
            assert(h.call("apply_schema", { declaration = { policy = { proposal_count = 1 } } }))
            local function suggestion(value: string): Map
                return { items = { { product = { sku = "RDG" }, set = { { attr = "core.care", value = value } } } } }
            end
            local submissions = together(h, { { "propose", suggestion("First") }, { "propose", suggestion("Second") } })
            local admitted, limited = 0, 0
            for _, submission in ipairs(submissions) do
                if submission.out then admitted = admitted + 1 end
                if submission.err and submission.err:details().code == "proposal_limit" then limited = limited + 1 end
            end
            test.eq(admitted, 1)
            test.eq(limited, 1)
            test.eq(#assert(h.call("list_proposals", {})).proposals, 1)
        end)

        test.it("applies a proposal once when two admins accept it", function()
            local h = fixture.catalog()
            fixture.boot(h)
            local p = h.call("propose", { items = { { product = { sku = "RDG" }, set = { { attr = "core.care", value = "Raced" } } } } })
            local before = steps.version(h, "RDG")
            local results = together(h, { { "decide", { proposal_id = p.proposal_id, decision = "accept" } }, { "decide", { proposal_id = p.proposal_id, decision = "accept" } } })
            local accepted = 0
            for _, r in ipairs(results) do
                if r.out and r.out.status == "accepted" then accepted = accepted + 1 end
            end
            test.is_true(accepted >= 1)
            test.eq(steps.version(h, "RDG"), before + 1)
        end)

        test.it("settles an accept racing a reject on one decision", function()
            local h = fixture.catalog()
            fixture.boot(h)
            local p = h.call("propose", { items = { { product = { sku = "RDG" }, set = { { attr = "core.care", value = "Either" } } } } })
            together(h, { { "decide", { proposal_id = p.proposal_id, decision = "accept" } }, { "decide", { proposal_id = p.proposal_id, decision = "reject" } } })
            local stored = h.call("list_proposals", { limit = 10 }).proposals[1]
            local care = assert(steps.get(h, "RDG")).values["core.care"].value
            if stored.status == "accepted" then test.eq(care, "Either") else test.eq(stored.status, "rejected"); test.is_false(care == "Either") end
        end)
    end)

    test.describe("schema changes under race", function()
        test.it("refuses the second of two applies at one expected generation", function()
            local h = fixture.catalog()
            local results = together(h, {
                { "apply_schema", { declaration = { vocabularies = { { code = "one" } } }, expected_generation = 1 } },
                { "apply_schema", { declaration = { vocabularies = { { code = "two" } } }, expected_generation = 1 } } })
            local ok, conflict = 0, 0
            for _, r in ipairs(results) do
                if r.err then
                    test.eq(r.err:kind(), errors.CONFLICT)
                    conflict = conflict + 1
                else
                    ok = ok + 1
                end
            end
            test.eq(ok, 1)
            test.eq(conflict, 1)
            test.eq(h.call("get_schema", {}).schema_generation, 2)
        end)

        test.it("applies both of two unguarded schema changes", function()
            local h = fixture.catalog()
            local results = together(h, { { "apply_schema", { declaration = { vocabularies = { { code = "one" } } } } }, { "apply_schema", { declaration = { vocabularies = { { code = "two" } } } } } })
            for _, r in ipairs(results) do test.is_nil(r.err) end
            local schema = h.call("get_schema", {})
            test.eq(schema.schema_generation, 3)
            test.not_nil(schema.vocabularies.one)
            test.not_nil(schema.vocabularies.two)
        end)

        test.it("keeps writes made while a schema change applies and its rebuild runs", function()
            local h = fixture.catalog()
            fixture.boot(h)
            local calls: { { unknown } } = { { "apply_schema", { declaration = { aspects = { { namespace = "core", attributes = {
                { code = "care", type = "kickside.pim.types:text", default = "Clean with a damp cloth.", index = "key" } } } } } } } }
            for n = 1, 6 do calls[#calls + 1] = apply_item({ product = { sku = "DURING-" .. n }, create = {}, set = { { attr = "core.care", value = "kept-" .. n } } }) end
            for _, r in ipairs(together(h, calls)) do test.is_nil(r.err) end
            steps.rebuilt(h)
            test.eq(#h.call("query", { family = "generic", limit = 50 }).items, 6)
            test.eq(#h.call("query", { where = { field = "core.care", op = "eq", value = "kept-3" } }).items, 1)
            test.eq(#h.call("query", { where = { field = "core.care", op = "eq", value = "Clean with a damp cloth." } }).items, 6)
        end)

        test.it("counts exactly after concurrent batches during a rebuild", function()
            local h = fixture.catalog()
            fixture.boot(h)
            h.call("apply_schema", { declaration = { aspects = { { namespace = "core", attributes = {
                { code = "care", type = "kickside.pim.types:text", default = "Wipe.", index = "key" } } } } } })
            local calls: { { unknown } } = {}
            for w = 1, 6 do
                local items: { Map } = {}
                for n = 1, 5 do items[n] = { product = { sku = "B" .. w .. "-" .. n }, create = {} } end
                calls[w] = { "apply", { items = items } }
            end
            for _, r in ipairs(together(h, calls)) do test.is_nil(r.err) end
            steps.rebuilt(h)
            local db = assert(store.open())
            local c = assert(store.catalog(db, h.id))
            db:release()
            test.eq(c.product_count, 9 + 30)
            test.eq(c.item_count, 6 + 30)
            test.eq(#h.call("query", { where = { field = "core.care", op = "eq", value = "Wipe." }, limit = 100 }).items, 36)
        end)
    end)
end

return { run = test.run_cases(define) }
