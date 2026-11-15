-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local fixture = require("fixture")
local steps = require("steps")
local catalog_fixture = require("catalog_fixture")
local store = require("store")
local types = require("types")

type Map = { [string]: unknown }

local function catalog(): fixture.Handle
    local h = fixture.catalog()
    fixture.boot(h)
    assert(h.call("apply_schema", { declaration = { aspects = { { namespace = "core", attributes = {
        { code = "bundle", type = "kickside.pim.types:record", cardinality = "list", config = { members = {
            detail = { form = "record", members = {
                related = { form = "ref", target = "product" },
                tags = { form = "ref", target = "term", vocabulary = "colors", cardinality = "set" },
                place = { form = "ref", target = "app.location" },
                note = { form = "text" },
            } },
        } } },
    } } } } }))
    return h
end

local function write(h: fixture.Handle, detail: Map): types.ApplyResult
    return assert(h.call("apply", { items = { { product = { sku = "RDG" }, expect_version = "any",
        set = { { attr = "core.bundle", value = { { detail = detail } } } } } } })) :: types.ApplyResult
end

local function detail(h: fixture.Handle): Map
    return (assert(steps.get(h, "RDG")).values["core.bundle"].value :: { Map })[1].detail :: Map
end

local function define()
    test.describe("record references", function()
        for _, case in ipairs({
            { field = "related", value = { ref = { "product", "00000000-0000-0000-0000-000000000000" } } },
            { field = "tags", value = { { ref = { "term", "colors:missing" } } } },
            { field = "place", value = { ref = { "app.location", "missing" } } },
        }) do
            test.it("rejects a missing nested " .. case.field .. " target without a write", function()
                local h = catalog()
                local out = write(h, { [case.field] = case.value })
                test.is_false(out.applied)
                test.eq(out.outcomes[1].outcome, "invalid")
                test.eq(assert(out.outcomes[1].findings)[1].code, "invalid_reference")
                test.is_nil(assert(steps.get(h, "RDG")).values["core.bundle"].value)
            end)
        end

        test.it("indexes nested references and prevents deleting their targets", function()
            local h = catalog()
            local id = assert(steps.get(h, "RDG-moss-40")).product.product_id
            test.is_true(write(h, { related = { ref = { "product", id } }, tags = { { ref = { "term", "colors:moss" } } } }).applied)
            for kind, target in pairs({ product = id, term = "colors:moss" }) do
                local rows = assert(h.call("list_links", { kind = kind, target = target })).items :: { Map }
                local found = false
                for _, row in ipairs(rows) do
                    if row.attribute == "core.bundle" then
                        test.eq(row.sku, "RDG")
                        test.eq(type(row.path), "string")
                        found = true
                    end
                end
                test.is_true(found, kind)
            end
            local deleted = assert(h.call("apply", { items = { { product = { id = id }, expect_version = "any", delete = true } } }))
            test.is_false(deleted.applied)
            local retired = assert(h.call("apply", { items = { { term = { vocabulary = "colors", code = "moss" }, retired = true } } }))
            test.is_false(retired.applied)
        end)

        test.it("embeds nested term and link labels in an immutable release", function()
            local h = catalog()
            assert(h.call("apply", { items = { { term = { vocabulary = "colors", code = "lichen" }, labels = { en = "Lichen" } } } }))
            local db = assert(store.open())
            assert(db:execute("CREATE TABLE IF NOT EXISTS pim_test_locations (id TEXT PRIMARY KEY, label TEXT NOT NULL, hidden INTEGER NOT NULL DEFAULT 0)", {}))
            assert(db:execute("INSERT INTO pim_test_locations (id, label) VALUES ($1, $2)", { h.id, "Depot" }))
            assert(db:release())
            test.is_true(write(h, { tags = { { ref = { "term", "colors:lichen" } } }, place = { ref = { "app.location", h.id } } }).applied)
            local released = assert(h.call("release", { items = { { product = { sku = "RDG-moss-40" }, expect_version = steps.version(h, "RDG-moss-40"), channels = { "web" } } } }))
            test.eq(released.outcomes[1].outcome, "released")
            local snap = assert(h.call("get_release", { release_id = released.outcomes[1].release_id })).release.snapshot
            test.eq(snap.terms["colors:lichen"].en, "Lichen")
            test.eq(snap.links["app.location:" .. h.id].label, "Depot")
        end)

        test.it("remaps nested product references while preserving other record members on import", function()
            local src = catalog()
            local old = assert(steps.get(src, "RDG-moss-40")).product.product_id
            test.is_true(write(src, { related = { ref = { "product", old } }, tags = { { ref = { "term", "colors:moss" } } }, note = "kept" }).applied)
            local exported, path = catalog_fixture.export(src.call)
            test.is_true(exported.success)
            local dst = fixture.catalog({ bare = true })
            local imported = catalog_fixture.import(dst.call, path)
            test.is_true(imported.success)
            local new_id = assert(steps.get(dst, "RDG-moss-40")).product.product_id
            test.is_false(new_id == old)
            local got = detail(dst)
            test.eq((got.related :: Map).ref[2], new_id)
            test.eq(got.note, "kept")
            test.eq((got.tags :: { Map })[1].ref[2], "colors:moss")
        end)

        test.it("merges nested term sets through the ordinary value write path", function()
            local h = catalog()
            assert(h.call("apply", { items = { { term = { vocabulary = "colors", code = "lichen" }, labels = { en = "Lichen" } } } }))
            test.is_true(write(h, { tags = { { ref = { "term", "colors:lichen" } }, { ref = { "term", "colors:slate" } } }, note = "kept" }).applied)
            local out = assert(h.call("apply", { items = { { term_merge = { vocabulary = "colors", from = "lichen", into = "slate" } } } }))
            test.is_true(out.applied)
            local got = detail(h)
            test.eq(#(got.tags :: { Map }), 1)
            test.eq((got.tags :: { Map })[1].ref[2], "colors:slate")
            test.eq(got.note, "kept")
        end)
    end)
end

return { run = test.run_cases(define) }
