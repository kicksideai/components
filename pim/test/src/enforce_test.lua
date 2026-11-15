-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Enforced checks (spec 3.4): a family check with enforce: write runs in
-- prepare as the caller on the products of the level that owns what it reads;
-- its findings reject the item before any state changes. Restore and import
-- are exempt; proposals meet the same checks when proposed and when decided.
local test = require("test")
local fixture = require("fixture")
local steps = require("steps")
local types = require("types")
local json = require("json")

type Map = { [string]: unknown }

local copy = steps.copy

-- footwear returns the fixture family with the given checks.
local function footwear(checks: { Map }): Map
    local family = copy(fixture.DECLARATION.families[1]) :: Map
    family.checks = checks
    return family
end

local WEIGHT = { check = "app:weight_check", reads = { "logistics.net_weight" }, config = { max = 2 }, enforce = "write" }

local function enforced(h: fixture.Handle, checks: { Map })
    local _, err = h.call("apply_schema", { declaration = { families = { footwear(checks) } } })
    assert(not err, tostring(err))
end

local function define()
    test.describe("enforced checks", function()
        test.it("compiles enforce: write only for an interactive check whose reads share one owning level", function()
            local h = fixture.catalog()
            for _, bad in ipairs({
                { check = "app:weight_check", reads = { "logistics.net_weight" }, cost = "release", enforce = "write" },
                { check = "app:weight_check", reads = { "logistics.net_weight", "core.name" }, enforce = "write" },
                { check = "app:weight_check", enforce = "write" },
                { check = "app:weight_check", reads = { "logistics.net_weight" }, enforce = "always" },
            } :: { Map }) do
                local _, err = h.call("plan_schema", { declaration = { families = { footwear({ bad }) } } })
                test.not_nil(err, json.encode(bad))
                test.eq((err :: error):kind(), errors.INVALID)
            end
            enforced(h, { WEIGHT })
            enforced(h, { { check = "app:weight_check", reads = { "core.name", "core.category" }, enforce = "write", config = { max = 2 } } })
        end)

        test.it("rejects a write its findings fail and leaves the product as it was", function()
            local h = fixture.catalog()
            fixture.boot(h)
            enforced(h, { WEIGHT })
            local before = steps.version(h, "RDG-moss-40")
            local heavy = steps.set(h, "RDG-moss-40", "logistics.net_weight", "3.5")
            test.eq(heavy.outcome, "invalid", json.encode(heavy))
            local finding = assert(heavy.findings)[1]
            test.eq(finding.code, "too_heavy")
            test.eq(finding.check, "app:weight_check")
            test.eq(steps.version(h, "RDG-moss-40"), before)
            test.eq(steps.set(h, "RDG-moss-40", "logistics.net_weight", "1.5").outcome, "updated")
            local created = h.call("apply", { items = { { product = { sku = "RDG-moss-44" }, create = { parent = { sku = "RDG-moss" } },
                set = { { attr = "core.size", value = 44 }, { attr = "logistics.net_weight", value = "9" } } } } }) :: types.ApplyResult
            test.eq(created.outcomes[1].outcome, "invalid", json.encode(created))
            test.is_nil((steps.get(h, "RDG-moss-44")))
        end)

        test.it("runs only on the level that owns the reads and rejects when the check cannot run", function()
            local h = fixture.catalog()
            fixture.boot(h)
            enforced(h, { { check = "app:raising_check", reads = { "logistics.net_weight" }, enforce = "write" } })
            test.eq(steps.set(h, "RDG", "core.name", "Ridgeline II", { locale = "en" }).outcome, "updated")
            local out = steps.set(h, "RDG-moss-40", "core.gtin", "0400moss40x")
            test.eq(out.outcome, "invalid", json.encode(out))
            test.eq(assert(out.findings)[1].code, "check_unavailable")
        end)

        test.it("exempts restore and import", function()
            local h = fixture.catalog()
            fixture.boot(h)
            test.eq(steps.set(h, "RDG-moss-40", "logistics.net_weight", "3.5").outcome, "updated")
            enforced(h, { WEIGHT })
            local id = assert(steps.get(h, "RDG-moss-40")).product.product_id
            local trashed = h.call("apply", { items = { { product = { sku = "RDG-moss-40" }, expect_version = steps.version(h, "RDG-moss-40"), delete = true } } }) :: types.ApplyResult
            test.is_true(trashed.outcomes[1].trashed == true, json.encode(trashed))
            local restored = h.call("apply", { items = { { product = { id = id }, expect_version = "any", restore = true } } }) :: types.ApplyResult
            test.is_true(restored.outcomes[1].restored == true, json.encode(restored))
            local again = steps.set(h, "RDG-moss-40", "core.gtin", "0400moss40y")
            test.eq(again.outcome, "invalid", json.encode(again))
        end)

        test.it("refuses a proposal its enforced checks fail, when proposed and when decided", function()
            local h = fixture.catalog()
            fixture.boot(h)
            enforced(h, { WEIGHT })
            local _, perr = h.call("propose", { items = { { product = { sku = "RDG-moss-40" }, set = { { attr = "logistics.net_weight", value = "3.5" } } } } })
            test.not_nil(perr)
            test.eq((perr :: error):kind(), errors.INVALID)
            local proposed, ok = h.call("propose", { items = { { product = { sku = "RDG-moss-40" }, set = { { attr = "logistics.net_weight", value = "1.9" } } } } })
            test.is_nil(ok)
            enforced(h, { { check = "app:weight_check", reads = { "logistics.net_weight" }, config = { max = 1 }, enforce = "write" } })
            local decided = h.call("decide", { proposal_id = (proposed :: Map).proposal_id, decision = "accept" }) :: Map
            test.eq(decided.status, "failed", json.encode(decided))
        end)
    end)
end

return { run = test.run_cases(define) }
