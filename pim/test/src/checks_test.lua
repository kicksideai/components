-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Requirement sets, the authored rule, channel coverage and readiness reads:
-- readiness follows resolution (fallback satisfies presence, never authorship),
-- root edits recompute every item, and release evaluates only the channels
-- that carry the item's family.
local test = require("test")
local fixture = require("fixture")
local steps = require("steps")
local store = require("store")
local types = require("types")

type Map = { [string]: unknown }

local copy = steps.copy

-- footwear returns the fixture's footwear family with its requirement sets replaced.
local function footwear(requirements: { Map }): Map
    local family = copy(fixture.DECLARATION.families[1]) :: Map
    family.requirements = requirements
    return family
end

local function ready(h: fixture.Handle, set: string, value: boolean): integer
    return #steps.query(h, { ready = { set = set, value = value }, limit = 200 }).items
end

local function codes(findings: { types.Finding }?, code: string): { string }
    local out: { string } = {}
    for _, f in ipairs(findings or {}) do
        if f.code == code then out[#out + 1] = tostring(f.attribute) .. "@" .. tostring(f.context) end
    end
    table.sort(out)
    return out
end

local function define()
    test.describe("requirement sets", function()
        test.it("reports a cleared root value as missing in its context and the contexts falling back to it", function()
            local h = fixture.catalog()
            fixture.boot(h)
            test.eq(ready(h, "web", true), 6)
            test.eq(steps.one(h, { product = { sku = "RDG" }, expect_version = steps.version(h, "RDG"),
                clear = { { attr = "core.name", ctx = { locale = "de" } } } }).outcome, "updated")
            test.eq(ready(h, "web", true), 0)
            test.eq(ready(h, "web", false), 6)
            local item = assert(steps.get(h, "RDG-slate-41"))
            local missing = codes((item.readiness :: { [string]: { types.Finding } }).web, "missing")
            test.eq(#missing, 2)
            test.eq(missing[1], "core.name@locale=de")
            test.eq(missing[2], "core.name@locale=de-AT")
        end)

        test.it("asks for authored values that no fallback satisfies and flips every item on a root edit", function()
            local h = fixture.catalog()
            fixture.boot(h)
            test.eq(ready(h, "marketplace_de", true), 0)
            local item = assert(steps.get(h, "RDG-moss-40"))
            local unauthored = codes((item.readiness :: { [string]: { types.Finding } }).marketplace_de, "not_authored")
            test.eq(unauthored[1], "marketing.description@locale=de")
            test.eq(steps.set(h, "RDG", "marketing.description", "Gebaut fuer den langen Heimweg.", { locale = "de" }).outcome, "updated")
            test.eq(ready(h, "marketplace_de", true), 6)
            test.eq(ready(h, "marketplace_de", false), 0)
        end)

        test.it("satisfies presence with a default and refuses a default as authored", function()
            local h = fixture.catalog()
            fixture.boot(h)
            local _, err = h.call("apply_schema", { declaration = { families = { footwear({
                { id = "web", context = { locale = "all" }, require = { "core.name", "core.care" } },
                { id = "marketplace_de", context = { locale = "de" }, require = { "core.gtin", "logistics.net_weight" },
                    authored = { "marketing.description" } },
                { id = "care", context = { locale = "en" }, require = { "core.gtin" }, authored = { "core.care" } } }) } } })
            test.is_nil(err)
            steps.rebuilt(h)
            test.eq(ready(h, "web", true), 6)
            test.eq(ready(h, "care", true), 0)
            local item = assert(steps.get(h, "RDG-moss-40"))
            test.eq(codes((item.readiness :: { [string]: { types.Finding } }).care, "not_authored")[1], "core.care@locale=en")
            test.eq(steps.set(h, "RDG", "core.care", "Brush off mud.").outcome, "updated")
            test.eq(ready(h, "care", true), 6)
        end)

        test.it("refuses a readiness filter on an unknown set and keeps models out of readiness", function()
            local h = fixture.catalog()
            fixture.boot(h)
            local _, err = h.call("query", { ready = { set = "nope", value = true } })
            test.not_nil(err)
            local model = assert(steps.get(h, "RDG-moss"))
            test.is_nil(model.readiness)
            local explained = h.call("explain", { product = { sku = "RDG-moss" }, attr = "core.name", context = { locale = "en" } }) :: types.ExplainResult
            test.is_nil(explained.findings)
            local item = h.call("explain", { product = { sku = "RDG-moss-40" }, attr = "core.name", context = { locale = "en" } }) :: types.ExplainResult
            test.not_nil(item.findings)
        end)
    end)

    test.describe("readiness reads", function()
        test.it("serves readiness and explain findings from the folded item row", function()
            local h = fixture.catalog()
            fixture.boot(h)
            local db = assert(store.open())
            local catalog = assert(store.catalog(db, h.id))
            local column: string? = nil
            for _, c in ipairs(catalog.compiled.layout.flags) do if c.ctx == "web" then column = c.column end end
            local id = assert(steps.get(h, "RDG-moss-40")).product.product_id
            assert(db:execute("UPDATE " .. catalog.item_table .. "_item SET " .. tostring(column) .. " = 0, findings = $1 WHERE product_id = $2",
                { '{"web":[{"code":"probe","attribute":"core.name"}]}', id }))
            db:release()
            local item = assert(steps.get(h, "RDG-moss-40"))
            local web = (item.readiness :: { [string]: { types.Finding } }).web
            test.eq(web[1].code, "probe")
            test.eq(#(item.readiness :: { [string]: { types.Finding } }).marketplace_de, 0)
            local explained = h.call("explain", { product = { sku = "RDG-moss-40" }, attr = "core.name", context = { locale = "en" } }) :: types.ExplainResult
            test.eq(((explained.findings :: { [string]: { types.Finding } }).web)[1].code, "probe")
        end)
    end)

    test.describe("channel coverage", function()
        test.it("leaves a product without the channel's requirement set unready", function()
            local h = fixture.catalog()
            local made = steps.one(h, { product = { sku = "PLAIN" }, create = { family = "generic" } })
            test.eq(made.outcome, "created")
            local out = h.call("release", { items = { { product = { sku = "PLAIN" }, expect_version = 1 } } }) :: types.ApplyResult
            test.eq(out.outcomes[1].outcome, "not_ready")
            local sets: { [string]: boolean } = {}
            for _, f in ipairs(out.outcomes[1].findings or {}) do
                test.eq(f.code, "no_requirement_set")
                sets[tostring(f.set)] = true
            end
            test.is_true(sets.web == true)
            test.is_true(sets.marketplace_de == true)
        end)

        test.it("skips a channel that does not carry the item's family", function()
            local h = fixture.catalog()
            fixture.boot(h)
            local _, err = h.call("apply_schema", { declaration = { channels = { { id = "plain", requirements = { "web" }, families = { "generic" } } } } })
            test.is_nil(err)
            local item = assert(steps.get(h, "RDG-moss-40"))
            local out = h.call("release", { items = { { product = { sku = "RDG-moss-40" }, expect_version = item.product.version,
                channels = { "plain" } } } }) :: types.ApplyResult
            test.eq(out.outcomes[1].outcome, "not_ready")
            test.eq(#(out.outcomes[1].findings or {}), 0)
            local web = h.call("release", { items = { { product = { sku = "RDG-moss-40" }, expect_version = item.product.version,
                channels = { "plain", "web" } } } }) :: types.ApplyResult
            test.eq(web.outcomes[1].outcome, "released")
        end)
    end)
end

return { run = test.run_cases(define) }
