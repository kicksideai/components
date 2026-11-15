-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local fixture = require("fixture")
local steps = require("steps")
local types = require("types")

local catalog_fixture = require("catalog_fixture")
local kind = catalog_fixture.kind

local function define()
    test.describe("read views", function()
        test.it("stamps every read with its position", function()
            local h = fixture.catalog()
            fixture.boot(h)
            for _, case in ipairs({
                { "get", { product = { sku = "RDG" } } }, { "query", {} }, { "list_history", {} }, { "get_schema", {} }, { "list_changes", {} },
                { "list_publications", { channel = "web" } }, { "list_links", { kind = "product", target = "x" } },
                { "explain", { product = { sku = "RDG" }, attr = "core.care" } }, { "list_releases", { product = { sku = "RDG" } } },
            } :: { { unknown } }) do
                local out = h.call(case[1] :: string, case[2])
                test.is_true(out.as_of > 0, tostring(case[1]))
                test.eq(out.generation, 1, tostring(case[1]))
                test.is_false(out.rebuilding, tostring(case[1]))
            end
        end)

        test.it("reaches a position on request and refuses one beyond the head", function()
            local h = fixture.catalog()
            fixture.boot(h)
            local head = h.call("query", {}).as_of
            for _, op in ipairs({ "query", "list_history" }) do
                local _, ok = h.call(op, { min_seq = head })
                test.is_nil(ok, op)
                local _, ahead = h.call(op, { min_seq = head + 1000 })
                test.eq(kind(ahead), errors.UNAVAILABLE, op)
                test.eq(ahead:details().code, "projection_behind", op)
                test.is_true(ahead:retryable(), op)
            end
            local _, ignored = h.call("query", { min_seq = 0 })
            test.is_nil(ignored)
        end)

        test.it("pages links per member and returns them through a cursor", function()
            local h = fixture.catalog()
            local made = assert(steps.apply(h, { { product = { sku = "T" }, create = { family = "generic" } }, { product = { sku = "H1" }, create = { family = "generic" } }, { product = { sku = "H2" }, create = { family = "generic" } } }))
            local target = made.outcomes[1].product_id
            for i = 2, 3 do
                steps.one(h, { product = { id = made.outcomes[i].product_id }, expect_version = "any", set = { { attr = "core.related", value = { { ref = { "product", target } } } } } })
            end
            local first = h.call("list_links", { kind = "product", target = target, limit = 1 }) :: types.LinksResult
            test.eq(#first.items, 1)
            test.not_nil(first.next)
            local rest = h.call("list_links", { kind = "product", target = target, limit = 5, after = first.next }) :: types.LinksResult
            test.eq(#rest.items, 1)
            test.is_false(first.items[1].product_id == rest.items[1].product_id)
            test.eq(first.items[1].attribute, "core.related")
        end)

        test.it("answers no links for an unknown kind or target", function()
            local h = fixture.catalog()
            fixture.boot(h)
            test.eq(#h.call("list_links", { kind = "asset", target = "a1" }).items, 0)
            test.eq(#h.call("list_links", { kind = "term", target = "colors:teal" }).items, 0)
            test.eq(#h.call("list_links", { kind = "term", target = "colors:moss" }).items, 1)
        end)

        test.it("lists a term's users with one path per set member", function()
            local h = fixture.catalog()
            fixture.boot(h)
            local out = h.call("list_links", { kind = "term", target = "materials:rubber" }) :: types.LinksResult
            test.eq(#out.items, 2)
            test.eq(out.items[1].path, "1")
        end)

        test.it("exposes defaults, owners and channels in get_schema", function()
            local h = fixture.catalog()
            local schema = h.call("get_schema", {})
            test.eq(schema.attributes["core.care"].default, "Clean with a damp cloth.")
            test.eq(schema.families.footwear.owner["core.size"], 2)
            test.not_nil(schema.channels.web)
            test.eq(#schema.dimensions, 2)
        end)

        test.it("answers an empty publications feed and pages it after a cursor", function()
            local h = fixture.catalog()
            fixture.boot(h)
            test.eq(#h.call("list_publications", { channel = "web" }).items, 0)
            for _, sku in ipairs({ "RDG-moss-40", "RDG-moss-41" }) do
                h.call("release", { items = { { product = { sku = sku }, expect_version = steps.version(h, sku), channels = { "web" } } } })
            end
            local first = h.call("list_publications", { channel = "web", limit = 1 })
            test.eq(#first.items, 1)
            test.is_true(first.has_more)
            local rest = h.call("list_publications", { channel = "web", after = first.next })
            test.eq(#rest.items, 1)
            test.is_false(rest.has_more)
        end)

        test.it("refuses an unknown channel in the publications feed", function()
            local h = fixture.catalog()
            local _, err = h.call("list_publications", { channel = "nope" })
            test.eq(kind(err), errors.INVALID)
        end)

        test.it("hides release history of a sku once trashed but keeps it by id", function()
            local h = fixture.catalog()
            fixture.boot(h)
            local id = assert(steps.get(h, "RDG-moss-40")).product.product_id
            h.call("release", { items = { { product = { id = id }, expect_version = steps.version(h, "RDG-moss-40"), channels = { "web" } } } })
            steps.one(h, { product = { id = id }, expect_version = "any", delete = true })
            local _, by_sku = h.call("list_releases", { product = { sku = "RDG-moss-40" } })
            test.eq(kind(by_sku), errors.NOT_FOUND)
            test.eq(#h.call("list_releases", { product = { id = id } }).releases, 1)
        end)
    end)

end

return { run = test.run_cases(define) }
