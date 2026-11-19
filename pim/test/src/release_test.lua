-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local fixture = require("fixture")
local store = require("store")
local json = require("json")

type Map = { [string]: unknown }

local function item(h: fixture.Handle, sku: string): Map
    return h.call("get", { product = { sku = sku } })
end

local function release(h: fixture.Handle, sku: string, extra: Map?): Map
    local entry: Map = { product = { sku = sku }, expect_version = item(h, sku).product.version }
    for k, v in pairs(extra or {}) do entry[k] = v end
    local out, err = h.call("release", { items = { entry } })
    test.is_nil(err)
    return out
end

local function pull(h: fixture.Handle, channel: string, cursor: Map?): Map
    local out, err = h.call("pull", { cursor = cursor, config = { channel = channel }, limit = 50 })
    test.is_nil(err)
    test.eq(out.success, true, json.encode(out))
    return out
end

local function define()
    test.describe("readiness", function()
        test.it("evaluates requirement sets per item and filters by them", function()
            local h = fixture.catalog()
            fixture.boot(h)
            test.eq(#h.call("query", { ready = { set = "web", value = true } }).items, 6)
            test.eq(#h.call("query", { ready = { set = "marketplace_de", value = true } }).items, 0)
            local view = item(h, "RDG-moss-40")
            local findings = view.readiness.marketplace_de
            test.eq(#findings, 1)
            test.eq(findings[1].code, "not_authored")
            test.eq(findings[1].attribute, "marketing.description")
            test.eq(#view.readiness.web, 0)
        end)
    end)

    test.describe("release and publications", function()
        test.it("preserves false through writes, key filters, releases and the product feed", function()
            local h = fixture.catalog()
            assert(h.call("apply_schema", { declaration = {
                aspects = { { namespace = "core", attributes = {
                    { code = "flag", type = "kickside.pim.types:boolean", index = "key" },
                } } },
                channels = { { id = "boolean_test", families = { "generic" } } },
            } }))
            for _, sku in ipairs({ "FALSE", "TRUE" }) do
                local out = assert(h.call("apply", { items = {
                    { product = { sku = sku }, create = {}, set = { { attr = "core.flag", value = sku == "TRUE" } } },
                } }))
                test.eq(out.outcomes[1].outcome, "created")
            end
            test.eq(item(h, "FALSE").values["core.flag"].value, false)
            local result = assert(h.call("query", { where = { field = "core.flag", op = "eq", value = false } }))
            test.eq(#result.items, 1)
            test.eq(result.items[1].sku, "FALSE")

            local released = release(h, "FALSE", { channels = { "boolean_test" } }).outcomes[1]
            test.eq(released.outcome, "released")
            local published = pull(h, "boolean_test")
            test.eq(published.items[1].payload.snapshot.values["core.flag"][""], false)

            local products = assert(h.call("pull_products", { limit = 2 }))
            test.eq(#products.items, 2)
            for _, entry in ipairs(products.items) do
                test.eq(entry.op, "upsert")
                test.eq(entry.payload.values["core.flag"][""], entry.payload.sku == "TRUE")
            end
        end)

        test.it("publishes to ready channels and feeds the snapshot", function()
            local h = fixture.catalog()
            fixture.boot(h)
            local o = release(h, "RDG-moss-40").outcomes[1]
            test.eq(o.outcome, "released")
            test.eq(#o.channels, 1)
            test.eq(o.channels[1], "web")
            test.eq(o.findings[1].channel, "marketplace")
            local feed = pull(h, "web")
            test.eq(#feed.items, 1)
            local entry = feed.items[1]
            test.eq(entry.op, "upsert")
            test.eq(entry.item_key, o.product_id)
            test.eq(entry.payload.release_id, o.release_id)
            test.eq(entry.payload.hash, o.hash)
            test.eq(entry.payload.snapshot.sku, "RDG-moss-40")
            test.eq(entry.payload.snapshot.values["core.gtin"][""], "0400moss40")
            test.eq(#pull(h, "marketplace").items, 0)
            test.eq(#pull(h, "web", feed.next_cursor).items, 0)
        end)

        test.it("refuses an item that no channel is ready for, and stale versions", function()
            local h = fixture.catalog()
            fixture.boot(h)
            test.eq(release(h, "RDG-moss-40", { channels = { "marketplace" } }).outcomes[1].outcome, "not_ready")
            local stale = h.call("release", { items = { { product = { sku = "RDG-moss-40" }, expect_version = 99 } } })
            test.eq(stale.outcomes[1].outcome, "conflict")
            local model = h.call("release", { items = { { product = { sku = "RDG" }, expect_version = 999 } } })
            test.eq(model.outcomes[1].outcome, "conflict")
        end)

        test.it("refuses release and withdraw naming a channel the schema lacks", function()
            local h = fixture.catalog()
            fixture.boot(h)
            local unknown = release(h, "RDG-moss-40", { channels = { "web", "nope" } })
            test.eq(unknown.outcomes[1].outcome, "invalid")
            test.eq(unknown.outcomes[1].findings[1].message, "unknown channel nope")
            test.eq(release(h, "RDG-moss-40", { channels = { "web" } }).outcomes[1].outcome, "released")
            local out = h.call("withdraw", { items = { { product = { sku = "RDG-moss-40" }, channels = { "nope" } } } })
            test.eq(out.outcomes[1].outcome, "invalid")
            test.eq(out.outcomes[1].findings[1].message, "unknown channel nope")
        end)

        test.it("keeps releases immutable and feeds only the newest per item", function()
            local h = fixture.catalog()
            fixture.boot(h)
            local first = release(h, "RDG-slate-41").outcomes[1]
            local cursor = pull(h, "web").next_cursor
            local current = item(h, "RDG-slate-41")
            h.call("apply", { items = { { product = { sku = "RDG-slate-41" }, expect_version = current.product.version,
                set = { { attr = "core.gtin", value = "changed-gtin" } } } } })
            local second = release(h, "RDG-slate-41").outcomes[1]
            test.is_false(second.hash == first.hash)
            local feed = pull(h, "web", cursor)
            test.eq(#feed.items, 1)
            test.eq(feed.items[1].payload.release_id, second.release_id)
            test.eq(feed.items[1].payload.snapshot.values["core.gtin"][""], "changed-gtin")
            local db = assert(store.open())
            local rows = assert(db:query("SELECT snapshot FROM kickside_pim_release WHERE catalog_id = $1 AND product_id = $2 ORDER BY seq",
                { h.id, first.product_id }))
            db:release()
            test.eq(#rows, 2)
            test.eq(json.decode(rows[1].snapshot).values["core.gtin"][""], "0400slate41")
        end)

        test.it("feeds withdrawals from withdraw, item deletion and channel removal", function()
            local h = fixture.catalog()
            fixture.boot(h)
            local a = release(h, "RDG-moss-41").outcomes[1]
            local b = release(h, "RDG-moss-42").outcomes[1]
            local c = release(h, "RDG-slate-40").outcomes[1]
            local cursor = pull(h, "web").next_cursor
            test.eq(h.call("withdraw", { items = { { product = { sku = "RDG-moss-41" } } } }).outcomes[1].outcome, "withdrawn")
            test.eq(h.call("withdraw", { items = { { product = { sku = "RDG-moss-41" } } } }).outcomes[1].outcome, "unchanged")
            h.call("apply", { items = { { product = { sku = "RDG-moss-42" }, expect_version = item(h, "RDG-moss-42").product.version, delete = true } } })
            local feed = pull(h, "web", cursor)
            test.eq(#feed.items, 2)
            test.eq(feed.items[1].item_key, a.product_id)
            test.eq(feed.items[1].op, "delete")
            test.eq(feed.items[2].item_key, b.product_id)
            test.eq(feed.items[2].op, "delete")
            local _, err = h.call("apply_schema", { declaration = { remove = { channels = { "web" } } } })
            test.is_nil(err)
            local after = pull(h, "web", feed.next_cursor)
            test.eq(#after.items, 1)
            test.eq(after.items[1].item_key, c.product_id)
            test.eq(after.items[1].op, "delete")
        end)

        test.it("refuses an unknown channel and pages with has_more", function()
            local h = fixture.catalog()
            fixture.boot(h)
            local bad = h.call("pull", { config = { channel = "nope" } })
            test.eq(bad.success, false)
            test.eq(bad.error.code, "invalid_config")
            test.eq(bad.error.details.kind, errors.INVALID)
            test.not_nil(bad.error.details.code)
            for _, sku in ipairs({ "RDG-moss-40", "RDG-moss-41", "RDG-moss-42" }) do release(h, sku) end
            local page = h.call("pull", { config = { channel = "web" }, limit = 2 })
            test.eq(#page.items, 2)
            test.is_true(page.has_more)
            local rest = h.call("pull", { cursor = page.next_cursor, config = { channel = "web" }, limit = 2 })
            test.eq(#rest.items, 1)
            test.is_false(rest.has_more)
        end)

        test.it("refuses trashed and inactive items, stale or missing versions and oversized commands", function()
            local h = fixture.catalog()
            fixture.boot(h)
            local id = item(h, "RDG-moss-40").product.product_id
            h.call("apply", { items = { { product = { sku = "RDG-moss-40" }, expect_version = "any", delete = true } } })
            local trashed = h.call("release", { items = { { product = { id = id }, expect_version = 2 } } })
            test.eq(trashed.outcomes[1].outcome, "invalid")
            test.eq(trashed.outcomes[1].findings[1].message, "product not found")
            h.call("apply", { items = { { product = { sku = "RDG-moss-41" }, expect_version = "any", status = "archived" } } })
            local archived = release(h, "RDG-moss-41")
            test.eq(archived.outcomes[1].outcome, "invalid")
            test.eq(archived.outcomes[1].findings[1].code, "inactive")
            local missing = h.call("release", { items = { { product = { sku = "RDG-moss-42" } } } })
            test.eq(missing.outcomes[1].outcome, "conflict")
            local releases = h.call("list_releases", { product = { sku = "RDG-moss-42" } })
            test.eq(#releases.releases, 0)
            local many: { Map } = {}
            for _ = 1, 101 do many[#many + 1] = { product = { sku = "RDG-moss-42" }, expect_version = 1 } end
            local _, err = h.call("release", { items = many })
            test.not_nil(err)
        end)

        test.it("deduplicates the same snapshot within one release command",function()
            local h=fixture.catalog()
            fixture.boot(h)
            local product=item(h,"RDG-moss-40").product
            local request={items={
                {product={id=product.product_id},expect_version=product.version,channels={"web"}},
                {product={id=product.product_id},expect_version=product.version,channels={"web"}}
            }}
            local out=assert(h.call("release",request))
            test.eq(out.outcomes[1].outcome,"released")
            test.eq(out.outcomes[2].outcome,"unchanged")
            test.eq(out.outcomes[2].release_id,out.outcomes[1].release_id)
            test.eq(#assert(h.call("list_releases",{product={id=product.product_id}})).releases,1)
        end)
        test.it("returns the current release without writing an unchanged snapshot", function()
            local h = fixture.catalog()
            fixture.boot(h)
            local first = release(h, "RDG-moss-40").outcomes[1]
            local cursor = pull(h, "web").next_cursor
            local before=assert(h.call("get_schema",{})).as_of
            local second = release(h, "RDG-moss-40").outcomes[1]
            test.eq(second.release_id,first.release_id)
            test.eq(second.hash,first.hash)
            test.eq(assert(h.call("get_schema",{})).as_of,before)
            test.eq(#pull(h,"web",cursor).items,0)
            local listed=assert(h.call("list_releases",{product={sku="RDG-moss-40"}}))
            test.eq(#listed.releases,1)
        end)

        test.it("snapshots resolved, inherited and default values with term labels and lineage", function()
            local h = fixture.catalog()
            fixture.boot(h)
            local o = release(h, "RDG-moss-40").outcomes[1]
            local got = h.call("get_release", { release_id = o.release_id })
            local snap = got.release.snapshot
            test.eq(snap.values["core.care"][""], "Clean with a damp cloth.")
            test.eq(snap.values["core.name"]["locale=en"], "Ridgeline hiking boot")
            test.eq(snap.values["core.name"]["locale=de-AT"], "Ridgeline Wanderstiefel")
            test.eq(snap.level, 2)
            test.eq(snap.version, item(h, "RDG-moss-40").product.version)
            test.eq(snap.status, "active")
            test.eq(snap.root_id, item(h, "RDG").product.product_id)
            test.eq(snap.terms["colors:moss"].en, "moss")
            test.eq(snap.terms["categories:hiking"].en, "Hiking boots")
            test.eq(got.release.generation, 1)
            h.call("apply_schema", { declaration = { aspects = { { namespace = "marketing", attributes = {
                { code = "slogan", type = "kickside.pim.types:text" } } } } } })
            local later = release(h, "RDG-moss-40").outcomes[1]
            test.eq(later.release_id,o.release_id)
            test.eq(h.call("get_release", { release_id = later.release_id }).release.generation, 1)
        end)

        test.it("withdraws named channels only and leaves other items alone", function()
            local h = fixture.catalog()
            fixture.boot(h)
            local current = item(h, "RDG")
            h.call("apply", { items = { { product = { sku = "RDG" }, expect_version = current.product.version,
                set = { { attr = "marketing.description", ctx = { locale = "de" }, value = "Fuer den Heimweg." } } } } })
            local o = release(h, "RDG-moss-40").outcomes[1]
            test.eq(#o.channels, 2)
            local out = h.call("withdraw", { items = { { product = { sku = "RDG-moss-40" }, channels = { "web" } } } })
            test.eq(out.outcomes[1].outcome, "withdrawn")
            test.eq(out.outcomes[1].channels[1], "web")
            local states: { [string]: string } = {}
            for _, pub in ipairs(item(h, "RDG-moss-40").publications) do states[pub.channel] = pub.state end
            test.eq(states.web, "withdrawn")
            test.eq(states.marketplace, "published")
            local model = h.call("withdraw", { items = { { product = { sku = "RDG-moss" } } } })
            test.eq(model.outcomes[1].outcome, "unchanged")
            local again = release(h, "RDG-moss-40", { channels = { "web" } }).outcomes[1]
            test.eq(again.outcome, "released")
            states = {}
            for _, pub in ipairs(item(h, "RDG-moss-40").publications) do states[pub.channel] = pub.state end
            test.eq(states.web, "published")
        end)

        test.it("keeps a publication when the item turns draft after release", function()
            local h = fixture.catalog()
            fixture.boot(h)
            release(h, "RDG-moss-40")
            h.call("apply", { items = { { product = { sku = "RDG-moss-40" }, expect_version = item(h, "RDG-moss-40").product.version, status = "draft" } } })
            test.eq(#h.call("query", { published = { channel = "web" } }).items, 1)
            test.eq(#h.call("query", { published = {} }).items, 1)
        end)

        test.it("publishes again on a channel that was removed and declared anew", function()
            local h = fixture.catalog()
            fixture.boot(h)
            release(h, "RDG-moss-40")
            h.call("apply_schema", { declaration = { remove = { channels = { "web" } } } })
            local states: { [string]: string } = {}
            for _, pub in ipairs(item(h, "RDG-moss-40").publications) do states[pub.channel] = pub.state end
            test.eq(states.web, "withdrawn")
            local _, query_err = h.call("query", { published = { channel = "web" } })
            test.eq(assert(query_err):details().code, "unknown_channel")
            h.call("apply_schema", { declaration = { channels = { { id = "web", requirements = { "web" } } } } })
            test.eq(release(h, "RDG-moss-40").outcomes[1].outcome, "released")
            states = {}
            for _, pub in ipairs(item(h, "RDG-moss-40").publications) do states[pub.channel] = pub.state end
            test.eq(states.web, "published")
        end)

        test.it("answers unknown releases and products with not found", function()
            local h = fixture.catalog()
            fixture.boot(h)
            local _, gerr = h.call("get_release", { release_id = "00000000-0000-0000-0000-000000000000" })
            test.not_nil(gerr)
            local _, lerr = h.call("list_releases", { product = { sku = "NOPE" } })
            test.not_nil(lerr)
            local _, perr = h.call("list_publications", { channel = "web", limit = 0 })
            test.not_nil(perr)
            local _, over = h.call("list_publications", { channel = "web", limit = 501 })
            test.not_nil(over)
        end)

        test.it("replays an idempotent release from its receipt", function()
            local h = fixture.catalog()
            fixture.boot(h)
            local request = { idempotency = { namespace = "test", key = "rel-1" },
                items = { { product = { sku = "RDG-moss-40" }, expect_version = item(h, "RDG-moss-40").product.version } } }
            local first = h.call("release", request)
            local again = h.call("release", request)
            test.is_true(again.replayed)
            test.eq(again.outcomes[1].release_id, first.outcomes[1].release_id)
        end)
    end)
end

return { run = test.run_cases(define) }
