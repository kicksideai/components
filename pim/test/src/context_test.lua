-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Contexts and fallback chains through the command and read paths.
local test = require("test")
local fixture = require("fixture")
local steps = require("steps")
local types = require("types")

local function define()
    test.describe("write contexts", function()
        test.it("requires every scope dimension and refuses others", function()
            local h = fixture.catalog()
            fixture.boot(h)
            test.eq(steps.set(h, "RDG", "marketing.tagline", "x", { locale = "de" }).outcome, "invalid")
            test.eq(steps.set(h, "RDG", "marketing.tagline", "x", { channel = "web", locale = "de", extra = "x" }).outcome, "invalid")
            test.eq(steps.set(h, "RDG", "core.name", "x", { locale = "xx" }).outcome, "invalid")
            test.eq(steps.set(h, "RDG-moss-40", "core.size", 40, { locale = "en" }).outcome, "invalid")
        end)

        test.it("stores wildcard values and keys contexts in declared dimension order", function()
            local h = fixture.catalog()
            fixture.boot(h)
            test.eq(steps.set(h, "RDG", "core.name", "Any", { locale = "*" }).outcome, "updated")
            test.eq(steps.set(h, "RDG", "marketing.tagline", "Go", { locale = "de", channel = "web" }).outcome, "updated")
            local page = h.call("list_history", { product = { sku = "RDG" }, limit = 1 }) :: types.HistoryResult
            test.eq(page.entries[1].ctx, "channel=web;locale=de")
        end)
    end)

    test.describe("read contexts", function()
        test.it("falls back through declared chains and stops at a cleared value", function()
            local h = fixture.catalog()
            fixture.boot(h)
            local at = assert(steps.get(h, "RDG", { locale = "de-AT" }))
            test.eq(at.values["core.name"].state, "fallback")
            test.eq(at.values["core.name"].ctx, "locale=de")
            test.eq(steps.one(h, { product = { sku = "RDG" }, expect_version = steps.version(h, "RDG"),
                clear = { { attr = "core.name", ctx = { locale = "de" } } } }).outcome, "updated")
            test.eq(assert(steps.get(h, "RDG", { locale = "de-AT" })).values["core.name"].state, "cleared")
        end)

        test.it("uses the wildcard when a member has no value", function()
            local h = fixture.catalog()
            fixture.boot(h)
            steps.set(h, "RDG", "marketing.tagline", "Everywhere", { channel = "*", locale = "de" })
            local got = assert(steps.get(h, "RDG", { channel = "web", locale = "de" }))
            test.eq(got.values["marketing.tagline"].state, "fallback")
            test.eq(got.values["marketing.tagline"].ctx, "channel=*;locale=de")
            local only_channel = assert(steps.get(h, "RDG", { channel = "marketplace" }))
            test.eq(only_channel.values["core.name"].state, "absent")
        end)

        test.it("refuses read contexts naming unknown dimensions or members", function()
            local h = fixture.catalog()
            fixture.boot(h)
            test.not_nil(select(2, steps.get(h, "RDG", { locale = "xx" })))
            test.not_nil(select(2, steps.get(h, "RDG", { foo = "x" })))
            local _, err = h.call("explain", { product = { sku = "RDG" }, attr = "core.name", context = { locale = "xx" } })
            test.not_nil(err)
        end)

        test.it("explains six candidates for a two-dimension scope and one for an unscoped attribute", function()
            local h = fixture.catalog()
            fixture.boot(h)
            steps.set(h, "RDG", "marketing.tagline", "Web", { channel = "web", locale = "de" })
            local out = h.call("explain", { product = { sku = "RDG" }, attr = "marketing.tagline",
                context = { channel = "marketplace", locale = "de-AT" } }) :: types.ExplainResult
            test.eq(#out.candidates, 6)
            test.eq(out.resolution.state, "absent")
            local plain = h.call("explain", { product = { sku = "RDG-moss-40" }, attr = "core.size", context = { locale = "en" } }) :: types.ExplainResult
            test.eq(#plain.candidates, 1)
            test.eq(plain.candidates[1], "")
        end)

        test.it("follows a fallback chain added later", function()
            local h = fixture.catalog()
            fixture.boot(h)
            local _, err = h.call("apply_schema", { declaration = { dimensions = {
                { name = "channel", members = { "web", "marketplace" } },
                { name = "locale", members = { "en", "de", "de-AT", "de-CH" }, fallback = { ["de-AT"] = { "de" }, ["de-CH"] = { "de-AT" } } } } } })
            test.is_nil(err)
            local got = assert(steps.get(h, "RDG", { locale = "de-CH" }))
            test.eq(got.values["core.name"].value, "Ridgeline Wanderstiefel")
            local out = h.call("explain", { product = { sku = "RDG" }, attr = "core.name", context = { locale = "de-CH" } }) :: types.ExplainResult
            test.eq(table.concat(out.candidates, ","), "locale=de-CH,locale=de-AT,locale=de,locale=*")
        end)

        test.it("serves three-dimension scopes in a four-dimension catalog", function()
            local h = fixture.catalog()
            local _, err = h.call("apply_schema", { declaration = {
                dimensions = { { name = "channel", members = { "web", "marketplace" } },
                    { name = "locale", members = { "en", "de", "de-AT" }, fallback = { ["de-AT"] = { "de" } } },
                    { name = "market", members = { "us", "eu" } }, { name = "season", members = { "ss", "fw" } } },
                aspects = { { namespace = "marketing", attributes = { { code = "promo", type = "kickside.pim.types:text",
                    scope = { "channel", "locale", "market" } } } } } } })
            test.is_nil(err)
            fixture.boot(h)
            local ctx = { channel = "web", locale = "en", market = "us" }
            test.eq(steps.set(h, "RDG", "marketing.promo", "Sale", ctx).outcome, "updated")
            test.eq(assert(steps.get(h, "RDG", ctx)).values["marketing.promo"].value, "Sale")
            local _, five = h.call("apply_schema", { declaration = { dimensions = {
                { name = "channel", members = { "web", "marketplace" } }, { name = "locale", members = { "en", "de", "de-AT" } },
                { name = "market", members = { "us", "eu" } }, { name = "season", members = { "ss", "fw" } },
                { name = "region", members = { "n" } } } } })
            test.not_nil(five)
        end)
    end)

    test.describe("snapshots and indexes by context", function()
        test.it("snapshots resolved values for every served context without wildcard keys", function()
            local h = fixture.catalog()
            fixture.boot(h)
            local out = steps.one(h, { product = { sku = "RDG-moss-40" }, expect_version = steps.version(h, "RDG-moss-40") })
            test.eq(out.outcome, "unchanged")
            local rel = h.call("release", { items = { { product = { sku = "RDG-moss-40" }, expect_version = steps.version(h, "RDG-moss-40"),
                channels = { "web" } } } }) :: types.ApplyResult
            local got = h.call("get_release", { release_id = rel.outcomes[1].release_id }) :: types.GetReleaseResult
            local names = got.release.snapshot.values["core.name"]
            test.eq(names["locale=en"], "Ridgeline hiking boot")
            test.eq(names["locale=de-AT"], "Ridgeline Wanderstiefel")
            test.is_nil(names["locale=*"])
        end)

        test.it("indexes text only in declared index contexts and refuses filters elsewhere", function()
            local h = fixture.catalog()
            fixture.boot(h)
            test.eq(steps.count(h, { text = "Wanderstiefel" }), 6)
            local _, err = h.call("query", { where = { field = "core.name", ctx = { locale = "de-AT" }, op = "eq", value = "x" } })
            test.not_nil(err)
        end)
    end)
end

return { run = test.run_cases(define) }
