-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Feeds and reads (spec 7, 12): the changes feed rebuilds state from cursor
-- zero, reports inherited changes and deletes, and signals a gap below the
-- tombstone floor; release, schema, link, explain, get and query reads expose
-- what consumers need without reaching into PIM tables.
local test = require("test")
local steps = require("steps")
local fixture = require("fixture")
local scoped = require("scoped")
local store = require("store")
local types = require("types")
local time = require("time")

local OLD = "2000-01-01T00:00:00Z"

local function exec(statement: string, params: types.SqlParams)
    local db = assert(store.open())
    local _, err = db:execute(statement, params)
    db:release()
    assert(not err, tostring(err))
end

local function drain(h: fixture.Handle, cursor: types.ChangesCursor?): ({ [string]: types.ChangeItem }, types.ChangesCursor?)
    local seen: { [string]: types.ChangeItem } = {}
    local at = cursor
    for _ = 1, 50 do
        local page = h.call("list_changes", { cursor = at, limit = 4 }) :: types.ChangesResult
        for _, item in ipairs(page.items) do seen[item.product_id] = item end
        at = page.next
        if not page.has_more then break end
    end
    return seen, at
end

local version = steps.version

local function release(h: fixture.Handle, sku: string): types.Outcome
    local out = h.call("release", { items = { { product = { sku = sku }, expect_version = version(h, sku), channels = { "web" } } } })
    return (out :: types.ApplyResult).outcomes[1]
end

local function define()
    test.describe("changes feed", function()
        test.it("includes referenced term labels in state feed records", function()
            local h = fixture.catalog()
            fixture.boot(h)
            local page = assert(h.call("list_changes", {})) :: types.ChangesResult
            local found = false
            for _, row in ipairs(page.items) do
                if row.sku == "RDG-moss-40" then
                    test.not_nil(row.terms)
                    for _, term in ipairs(row.terms) do if term.code == "moss" then found = true; test.eq(term.labels.en, "moss") end end
                end
            end
            test.is_true(found)
        end)

        test.it("reports term label changes through the state feed", function()
            local h = fixture.catalog()
            fixture.boot(h)
            local before = assert(h.call("list_changes", {})) :: types.ChangesResult
            assert(h.call("apply", { items = { { term = { vocabulary = "colors", code = "moss" }, labels = { en = "Updated color" } } } }))
            local page: types.ChangesResult = assert(h.call("list_changes", { cursor = before.next })) :: types.ChangesResult
            for _ = 1, 300 do
                if not page.rebuilding then break end
                time.sleep("10ms")
                page = assert(h.call("list_changes", { cursor = before.next })) :: types.ChangesResult
            end
            local found = false
            for _, row in ipairs(page.items) do
                if row.sku == "RDG-moss-40" then
                    for _, term in ipairs(row.terms or {}) do if term.code == "moss" and term.labels.en == "Updated color" then found = true end end
                end
            end
            test.is_true(found)
        end)
        test.it("rebuilds every product from cursor zero with resolved values", function()
            local h = fixture.catalog()
            fixture.boot(h)
            local seen = drain(h, nil)
            local n = 0
            for _ in pairs(seen) do n = n + 1 end
            test.eq(n, 9)
            local item: types.ChangeItem? = nil
            for _, v in pairs(seen) do if v.sku == "RDG-moss-40" then item = v end end
            local it = item :: types.ChangeItem
            test.eq(it.op, "upsert")
            test.eq((it.values :: { [string]: types.ContextValues })["core.gtin"][""], "0400moss40")
            test.eq((it.values :: { [string]: types.ContextValues })["core.name"]["locale=en"], "Ridgeline hiking boot")
        end)

        test.it("reports inherited changes and deletes after the cursor", function()
            local h = fixture.catalog()
            fixture.boot(h)
            local _, cursor = drain(h, nil)
            local root = (h.call("get", { product = { sku = "RDG" } }) :: types.GetResult).product
            h.call("apply", { items = { { product = { sku = "RDG" }, expect_version = root.version,
                set = { { attr = "core.name", ctx = { locale = "en" }, value = "Ridgeline trail boot" } } } } })
            local changed = drain(h, cursor)
            local n = 0
            for _, v in pairs(changed) do
                n = n + 1
                if v.level == 2 then test.eq((v.values :: { [string]: types.ContextValues })["core.name"]["locale=en"], "Ridgeline trail boot") end
            end
            test.eq(n, 9)
            local _, after_edit = drain(h, cursor)
            local victim = (h.call("get", { product = { sku = "RDG-slate-42" } }) :: types.GetResult).product
            h.call("apply", { items = { { product = { sku = "RDG-slate-42" }, expect_version = victim.version, delete = true } } })
            local deleted = drain(h, after_edit)
            test.eq(deleted[victim.product_id].op, "delete")
        end)

        test.it("holds the feed below a running rebuild's schema change", function()
            local h = fixture.catalog()
            fixture.boot(h)
            local edited = h.call("apply", { items = { { product = { sku = "RDG-moss-40" }, expect_version = version(h, "RDG-moss-40"),
                set = { { attr = "core.gtin", value = "edited-40" } } } } }) :: types.ApplyResult
            local seq = edited.seq :: integer
            -- A rebuild started by the schema event at seq stamps rows with seq;
            -- until it finishes, the feed stops below it.
            exec("UPDATE kickside_pim_catalog SET rebuild_after = $1, rebuild_seq = $2 WHERE catalog_id = $3", { "", seq, h.id })
            local held = drain(h, nil)
            for _, item in pairs(held) do test.is_true(item.updated_seq < seq) end
            test.is_nil(held[(h.call("get", { product = { sku = "RDG-moss-40" } }) :: types.GetResult).product.product_id])
            exec("UPDATE kickside_pim_catalog SET rebuild_after = NULL, rebuild_seq = NULL WHERE catalog_id = $1", { h.id })
            local released = drain(h, nil)
            local n = 0
            for _ in pairs(released) do n = n + 1 end
            test.eq(n, 9)
        end)

        test.it("answers a gap to a cursor below the tombstone floor", function()
            local h = fixture.catalog()
            fixture.boot(h)
            local _, early = drain(h, nil)
            local victim = (h.call("get", { product = { sku = "RDG-moss-41" } }) :: types.GetResult).product
            h.call("apply", { items = { { product = { sku = "RDG-moss-41" }, expect_version = victim.version, delete = true } } })
            exec("UPDATE kickside_pim_product SET state_at = $1 WHERE catalog_id = $2 AND product_id = $3", { OLD, h.id, victim.product_id })
            assert(fixture.retain().success)
            assert(h.call("settle", {}).done)
            exec("UPDATE kickside_pim_product SET state_at = $1 WHERE catalog_id = $2 AND product_id = $3", { OLD, h.id, victim.product_id })
            assert(fixture.retain().success)
            local page = h.call("list_changes", { cursor = early }) :: types.ChangesResult
            test.not_nil(page.gap)
            test.eq(#page.items, 0)
            local fresh = drain(h, nil)
            test.is_nil(fresh[victim.product_id])
        end)
    end)

    test.describe("release reads", function()
        test.it("re-reads releases by id with lineage, lists them, and serves the publications feed", function()
            local h = fixture.catalog()
            fixture.boot(h)
            local out = release(h, "RDG-moss-40")
            test.eq(out.outcome, "released")
            local got = h.call("get_release", { release_id = out.release_id }) :: types.GetReleaseResult
            test.eq(got.release.hash, out.hash)
            test.eq(got.release.snapshot.level, 2)
            test.not_nil(got.release.snapshot.parent_id)
            local listed = h.call("list_releases", { product = { sku = "RDG-moss-40" } }) :: types.ReleasesResult
            test.eq(#listed.releases, 1)
            test.eq(listed.releases[1].release_id, out.release_id)
            local feed = h.call("list_publications", { channel = "web" }) :: types.PublicationsResult
            test.eq(#feed.items, 1)
            test.eq(feed.items[1].state, "published")
            test.eq((feed.items[1].snapshot :: types.Snapshot).sku, "RDG-moss-40")
            local view = h.call("get", { product = { sku = "RDG-moss-40" } }) :: types.GetResult
            test.eq(view.release_id, out.release_id)
            test.eq(view.publications[1].channel, "web")
            test.eq(view.publications[1].state, "published")
            local published = h.call("query", { published = { channel = "web" } }) :: types.QueryResult
            test.eq(#published.items, 1)
            test.eq(published.items[1].sku, "RDG-moss-40")
        end)

        test.it("releases only active products", function()
            local h = fixture.catalog()
            fixture.boot(h)
            h.call("apply", { items = { { product = { sku = "RDG-moss-41" }, expect_version = version(h, "RDG-moss-41"), status = "draft" } } })
            local out = release(h, "RDG-moss-41")
            test.eq(out.outcome, "invalid")
            test.eq((out.findings :: { types.Finding })[1].code, "inactive")
        end)
    end)

    test.describe("changes feed edges", function()
        test.it("drains products sharing one seq exactly once", function()
            local h = fixture.catalog()
            fixture.boot(h)
            local _, cursor = drain(h)
            h.call("apply", { items = { { product = { sku = "RDG" }, expect_version = version(h, "RDG"),
                set = { { attr = "core.name", ctx = { locale = "en" }, value = "Renamed" } } } } })
            local seen: { [string]: integer } = {}
            local at = cursor
            for _ = 1, 20 do
                local page = h.call("list_changes", { cursor = at, limit = 2 }) :: types.ChangesResult
                for _, item in ipairs(page.items) do seen[item.product_id] = (seen[item.product_id] or 0) + 1 end
                at = page.next
                if not page.has_more then break end
            end
            local total = 0
            for _, n in pairs(seen) do
                test.eq(n, 1)
                total = total + 1
            end
            test.eq(total, 9)
        end)

        test.it("filters by family", function()
            local h = fixture.catalog()
            fixture.boot(h)
            h.call("apply", { items = { { product = { sku = "SHELL" }, create = { family = "generic" } } } })
            test.eq(#(h.call("list_changes", { families = { "footwear" }, limit = 100 }) :: types.ChangesResult).items, 9)
            test.eq(#(h.call("list_changes", { families = { "generic" }, limit = 100 }) :: types.ChangesResult).items, 1)
            test.eq(#(h.call("list_changes", { families = { "nope" }, limit = 100 }) :: types.ChangesResult).items, 0)
            test.eq(#(h.call("list_changes", { families = {}, limit = 100 }) :: types.ChangesResult).items, 10)
        end)

        test.it("bounds its page", function()
            local h = fixture.catalog()
            for _, limit in ipairs({ 0, 501, -1 }) do
                local _, err = h.call("list_changes", { limit = limit })
                test.not_nil(err)
            end
            local _, ok = h.call("list_changes", { limit = 500 })
            test.is_nil(ok)
        end)

        test.it("answers an empty page past the head and for a schema-only catalog", function()
            local h = fixture.catalog()
            local empty = h.call("list_changes", {}) :: types.ChangesResult
            test.eq(#empty.items, 0)
            test.eq(empty.next.seq, 0)
            test.eq(empty.next.product_id, "")
            fixture.boot(h)
            local beyond = h.call("list_changes", { cursor = { seq = 999999, product_id = "" } }) :: types.ChangesResult
            test.eq(#beyond.items, 0)
            test.eq(beyond.next.seq, 999999)
            test.is_false(beyond.has_more)
        end)

        test.it("reports a trashed item as a delete and its restore as an upsert", function()
            local h = fixture.catalog()
            fixture.boot(h)
            local id = (h.call("get", { product = { sku = "RDG-moss-40" } }) :: types.GetResult).product.product_id
            local _, cursor = drain(h)
            h.call("apply", { items = { { product = { id = id }, expect_version = "any", delete = true } } })
            local gone, after_delete = drain(h, cursor)
            test.eq(gone[id].op, "delete")
            test.is_nil(gone[id].values)
            test.eq(gone[id].sku, "RDG-moss-40")
            h.call("apply", { items = { { product = { id = id }, expect_version = "any", restore = true } } })
            local back = drain(h, after_delete)
            test.eq(back[id].op, "upsert")
            test.is_true(back[id].updated_seq > gone[id].updated_seq)
        end)

        test.it("stamps a model edit on its own children only", function()
            local h = fixture.catalog()
            fixture.boot(h)
            local _, cursor = drain(h)
            h.call("apply", { items = { { product = { sku = "RDG-moss" }, expect_version = version(h, "RDG-moss"),
                set = { { attr = "core.materials", value = { "nylon" } } } } } })
            local seen = drain(h, cursor)
            local skus: { string } = {}
            for _, item in pairs(seen) do skus[#skus + 1] = item.sku end
            table.sort(skus)
            test.eq(table.concat(skus, ","), "RDG-moss,RDG-moss-40,RDG-moss-41,RDG-moss-42")
        end)

        test.it("leaves descendants out of a root's status change", function()
            local h = fixture.catalog()
            fixture.boot(h)
            local _, cursor = drain(h)
            h.call("apply", { items = { { product = { sku = "RDG" }, expect_version = version(h, "RDG"), status = "draft" } } })
            local seen = drain(h, cursor)
            local total = 0
            for _, item in pairs(seen) do
                total = total + 1
                test.eq(item.sku, "RDG")
            end
            test.eq(total, 1)
        end)

        test.it("reports models with their level and lineage, and values with defaults and inheritance", function()
            local h = fixture.catalog()
            fixture.boot(h)
            local seen = drain(h)
            local root = (h.call("get", { product = { sku = "RDG" } }) :: types.GetResult).product.product_id
            test.eq(seen[root].level, 0)
            test.is_nil(seen[root].parent_id)
            local item = seen[(h.call("get", { product = { sku = "RDG-moss-40" } }) :: types.GetResult).product.product_id]
            test.eq(item.level, 2)
            test.eq(item.root_id, root)
            test.eq(item.values["core.care"][""], "Clean with a damp cloth.")
            test.eq(item.values["core.name"]["locale=en"], "Ridgeline hiking boot")
        end)

        test.it("leaves an unreferenced term relabel out of the feed", function()
            local h = fixture.catalog()
            fixture.boot(h)
            local _, cursor = drain(h)
            assert(h.call("apply", { items = { { term = { vocabulary = "colors", code = "clay" }, labels = { en = "Clay red" } } } }))
            local seen = drain(h, cursor)
            test.is_nil(next(seen))
        end)

        test.it("answers a gap with the cursor unchanged and nothing more", function()
            local h = fixture.catalog()
            fixture.boot(h)
            exec("UPDATE kickside_pim_catalog SET tombstone_floor_seq = $1 WHERE catalog_id = $2", { 5, h.id })
            local gap = h.call("list_changes", { cursor = { seq = 4, product_id = "" } }) :: types.ChangesResult
            test.eq((gap.gap :: types.FeedGap).floor, 5)
            test.eq(gap.next.seq, 4)
            test.is_false(gap.has_more)
            test.eq(#gap.items, 0)
            test.is_nil((h.call("list_changes", { cursor = { seq = 5, product_id = "" } }) :: types.ChangesResult).gap)
        end)
    end)

    test.describe("schema, links, hierarchy and explain", function()
        test.it("serves a past schema generation", function()
            local h = fixture.catalog()
            h.call("apply_schema", { declaration = { aspects = { { namespace = "marketing", attributes = {
                { code = "slogan", type = "kickside.pim.types:text" } } } } } })
            local head = h.call("get_schema", {}) :: types.SchemaView
            test.eq(head.schema_generation, 2)
            test.not_nil(head.attributes["marketing.slogan"])
            local first = h.call("get_schema", { generation = 1 }) :: types.SchemaView
            test.eq(first.schema_generation, 1)
            test.is_nil(first.attributes["marketing.slogan"])
        end)

        test.it("finds referencing products for product and term targets", function()
            local h = fixture.catalog()
            fixture.boot(h)
            local target = (h.call("get", { product = { sku = "RDG-slate" } }) :: types.GetResult).product
            h.call("apply", { items = { { product = { sku = "RDG" }, expect_version = version(h, "RDG"),
                set = { { attr = "core.related", value = { { ref = { "product", target.product_id } } } } } } } })
            local by_product = h.call("list_links", { kind = "product", target = target.product_id }) :: types.LinksResult
            test.eq(#by_product.items, 1)
            test.eq(by_product.items[1].sku, "RDG")
            test.eq(by_product.items[1].attribute, "core.related")
            local by_term = h.call("list_links", { kind = "term", target = "colors:moss", limit = 1 }) :: types.LinksResult
            test.eq(#by_term.items, 1)
            test.eq(by_term.items[1].sku, "RDG-moss")
        end)

        test.it("lists a model's variants by parent and root", function()
            local h = fixture.catalog()
            fixture.boot(h)
            local by_parent = h.call("query", { parent = { sku = "RDG-moss" } }) :: types.QueryResult
            test.eq(#by_parent.items, 3)
            local by_root = h.call("query", { root = { sku = "RDG" } }) :: types.QueryResult
            test.eq(#by_root.items, 6)
            local both = h.call("query", { root = { sku = "RDG" }, parent = { sku = "RDG-slate" } }) :: types.QueryResult
            test.eq(#both.items, 3)
            for _, row in ipairs(both.items) do test.eq(row.sku:sub(1, 9), "RDG-slate") end
            local _, err = h.call("query", { root = { sku = "RDG-moss" } })
            test.not_nil(err)
            test.eq((err :: error):details().code, "not_a_root_product")
        end)

        test.it("explains a fallback resolution", function()
            local h = fixture.catalog()
            fixture.boot(h)
            local out = h.call("explain", { product = { sku = "RDG-moss-40" }, attr = "core.name", context = { locale = "de-AT" } }) :: types.ExplainResult
            test.eq(out.candidates[1], "locale=de-AT")
            test.eq(out.candidates[2], "locale=de")
            test.eq(out.resolution.state, "inherited")
            test.eq(out.resolution.ctx, "locale=de")
            test.eq(out.resolution.value, "Ridgeline Wanderstiefel")
        end)
    end)
    test.describe("feeds", function()
        test.it("drains withdrawals sharing a sequence with one-item pages", function()
            local owner = scoped.member()
            local h = scoped.catalog(owner)
            fixture.boot(h)
            for _, sku in ipairs({ "RDG-moss-40", "RDG-moss-41", "RDG-moss-42" }) do
                local current = assert(h.call("get", { product = { sku = sku } }))
                local out = assert(h.call("release", { items = { { product = { sku = sku }, expect_version = current.product.version, channels = { "web" } } } }))
                test.eq(out.outcomes[1].outcome, "released")
            end
            assert(h.call("apply_schema", { declaration = { remove = { channels = { "web" } } } }))
            local seen = {}
            local after = nil
            for i = 1, 4 do
                local page, err = h.call("list_publications", { channel = "web", after = after, limit = 1 })
                test.is_nil(err)
                for _, item in ipairs(page.items) do
                    test.is_nil(seen[item.product_id])
                    seen[item.product_id] = true
                    test.eq(item.state, "withdrawn")
                end
                after = page.next
                if not page.has_more then break end
            end
            local count = 0
            for _ in pairs(seen) do count = count + 1 end
            test.eq(count, 3)
            local cursor = nil
            local pulled = {}
            for _ = 1, 4 do
                local page, err = h.call("pull", { config = { channel = "web" }, cursor = cursor, limit = 1 })
                test.is_nil(err)
                test.is_true(page.success)
                for _, item in ipairs(page.items) do
                    test.is_nil(pulled[item.item_key])
                    pulled[item.item_key] = true
                    test.eq(item.op, "delete")
                end
                cursor = page.next_cursor
                if not page.has_more then break end
            end
            count = 0
            for _ in pairs(pulled) do count = count + 1 end
            test.eq(count, 3)

            local first = assert(h.call("list_publications", { channel = "web", limit = 1 }))
            local tail = assert(h.call("list_publications", { channel = "web", after = first.next }))
            test.eq(tail.items[2].seq, first.next.seq)
            local http_first = owner.invoke(h.id, "list_publications", { channel = "web", limit = 1 })
            test.eq(http_first.status, 200)
            local http_after = http_first.body.data.next
            test.eq(http_after.product_id, first.next.product_id)
            local http_second = owner.invoke(h.id, "list_publications", { channel = "web", after = http_after, limit = 1 })
            test.eq(http_second.status, 200)
            test.eq(http_second.body.data.next.product_id, tail.items[1].product_id)
            test.eq(http_second.body.data.next.seq, http_after.seq)
            local last = tail.next
            exec("UPDATE kickside_pim_publication SET updated_at=$1 WHERE catalog_id=$2 AND channel='web'", { OLD, h.id })
            test.is_true(assert(fixture.retain()).success)
            local _, stale = h.call("list_publications", { channel = "web", after = first.next })
            test.not_nil(stale)
            test.eq(stale:kind(), errors.CONFLICT)
            test.eq(stale:details().code, "cursor_expired")
            local expired = owner.invoke(h.id, "list_publications", { channel = "web", after = http_after })
            test.eq(expired.status, 409)
            test.eq(expired.body.details.code, "cursor_expired")
            local current = assert(h.call("list_publications", { channel = "web", after = last }))
            test.eq(#current.items, 0)
            local fresh = assert(h.call("list_publications", { channel = "web" }))
            test.eq(#fresh.items, 0, "a removed channel can restart from zero")
            local other = assert(h.call("list_publications", { channel = "marketplace", after = first.next }))
            test.eq(#other.items, 0, "the boundary is per channel")
        end)
    end)

end

return { run = test.run_cases(define) }
