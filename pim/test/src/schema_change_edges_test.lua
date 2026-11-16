-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local fixture = require("fixture")
local steps = require("steps")
local store = require("store")

type Map = { [string]: unknown }

local catalog_fixture = require("catalog_fixture")

local function define()
    test.describe("schema change edges", function()
        local TEXT, SELECT = "kickside.pim.types:text", "kickside.pim.types:select"

        local function apply(h: fixture.Handle, declaration: Map): (Map?, error?)
            local out, err = h.call("apply_schema", { declaration = declaration })
            return out :: Map?, err
        end

        local function refused_kind(h: fixture.Handle, declaration: Map, kind: string, label: string)
            local _, err = apply(h, declaration)
            test.not_nil(err, label)
            test.eq((err :: error):kind(), kind, label .. ": " .. tostring(err))
        end

        local function booted(): fixture.Handle
            local h = fixture.catalog()
            fixture.boot(h)
            return h
        end

        local function generation(h: fixture.Handle): integer
            return h.call("get_schema", {}).schema_generation
        end

        test.it("adds a dimension to a populated catalog", function()
            local h = booted()
            local out = assert(apply(h, { dimensions = { { name = "market", members = { "eu", "us" } } } }))
            test.is_true(out.class == "additive" or out.class == "semantic")
            steps.rebuilt(h)
            test.eq(generation(h), 2)
            test.eq(steps.get(h, "RDG").product.sku, "RDG")
        end)

        test.it("refuses removing a member while the catalog holds products", function()
            local h = booted()
            local out, err = apply(h, { dimensions = { { name = "channel", members = { "web" } } } })
            test.is_nil(out)
            test.not_nil(err)
            test.eq(err:kind(), errors.INVALID)
            test.eq(err:details().code, "migration_required")
            test.is_false(err:retryable())
            test.eq(generation(h), 1)
        end)

        test.it("stops falling back once the fallback is removed", function()
            local h = booted()
            test.eq(assert(steps.get(h, "RDG", { locale = "de-AT" })).values["core.name"].state, "fallback")
            local out = assert(apply(h, { dimensions = { { name = "locale", members = { "en", "de", "de-AT" } } } }))
            test.eq(out.class, "semantic")
            steps.rebuilt(h)
            test.eq(assert(steps.get(h, "RDG", { locale = "de-AT" })).values["core.name"].state, "absent")
        end)

        test.it("refuses removing an axis attribute", function()
            local h = booted()
            refused_kind(h, { remove = { attributes = { "core.color" } } }, errors.INVALID, "axis removal")
            test.eq(generation(h), 1)
        end)

        test.it("refuses removing an attribute a requirement names or a set a channel names", function()
            local h = booted()
            refused_kind(h, { remove = { attributes = { "core.name" } } }, errors.INVALID, "required attribute")
            refused_kind(h, { families = { catalog_fixture.footwear_own({ "core.gtin", "logistics.net_weight" }) , }, channels = { { id = "web", requirements = { "gone" } } } },
                errors.INVALID, "channel set")
        end)

        test.it("refuses removing an aspect a family lists", function()
            local h = booted()
            refused_kind(h, { remove = { aspects = { "marketing" } } }, errors.INVALID, "listed aspect")
        end)

        test.it("drops a vocabulary's terms with the vocabulary", function()
            local h = fixture.catalog()
            local db = assert(store.open())
            local before = assert(db:query("SELECT COUNT(*) AS n FROM kickside_pim_term WHERE catalog_id = $1 AND vocabulary = $2", { h.id, "materials" }))
            db:release()
            test.is_true(tonumber(before[1].n) :: number > 0)
            local out = assert(apply(h, { families = { { code = "footwear", aspects = { "core", "marketing", "logistics", "pricing" }, variation = { { axes = { "core.color" } },
                { axes = { "core.size" }, own = { "core.gtin", "logistics.net_weight" } } },
                requirements = catalog_fixture.footwear_own({ "core.gtin", "logistics.net_weight" }).requirements } },
                remove = { attributes = { "core.materials" }, vocabularies = { "materials" } } }))
            test.not_nil(out)
            db = assert(store.open())
            local after = assert(db:query("SELECT COUNT(*) AS n FROM kickside_pim_term WHERE catalog_id = $1 AND vocabulary = $2", { h.id, "materials" }))
            db:release()
            test.eq(tonumber(after[1].n), 0)
        end)

        test.it("refuses a rename that also changes a used attribute's type", function()
            local h = booted()
            local id = catalog_fixture.catalog(h).compiled.attributes["core.size"].id
            local out, err = apply(h, { aspects = { { namespace = "core", attributes = { { id = id, code = "width", type = TEXT, index = "key" } } } },
                families = { { code = "footwear", aspects = { "core", "marketing", "logistics", "pricing" }, variation = { { axes = { "core.color" }, own = { "core.materials" } }, { axes = { "core.width" }, own = { "core.gtin", "logistics.net_weight" } } },
                    requirements = catalog_fixture.footwear_own({ "core.gtin", "logistics.net_weight" }).requirements } } })
            test.is_nil(out)
            test.not_nil(err)
            test.eq(err:kind(), errors.INVALID)
            test.eq(err:details().code, "invalid_schema")
            test.is_false(err:retryable())
            test.eq(generation(h), 1)
        end)

        test.it("refuses a rename onto a code in use and an unknown id", function()
            local h = booted()
            local id = catalog_fixture.catalog(h).compiled.attributes["core.care"].id
            refused_kind(h, { aspects = { { namespace = "core", attributes = { { id = id, code = "size", type = TEXT } } } } }, errors.INVALID, "code in use")
            refused_kind(h, { aspects = { { namespace = "core", attributes = { { id = 9999, code = "ghost", type = TEXT } } } } }, errors.INVALID, "unknown id")
        end)

        test.it("refuses moving an attribute id into another aspect", function()
            local h = booted()
            local id = catalog_fixture.catalog(h).compiled.attributes["core.care"].id
            refused_kind(h, { aspects = { { namespace = "logistics", attributes = { { id = id, code = "care", type = TEXT } } } } }, errors.INVALID, "other aspect")
        end)

        test.it("keeps history rows of a removed attribute by id", function()
            local h = booted()
            local id = catalog_fixture.catalog(h).compiled.attributes["core.care"].id
            test.eq(steps.set(h, "RDG", "core.care", "Brush.").outcome, "updated")
            assert(apply(h, { remove = { attributes = { "core.care" } } }))
            steps.rebuilt(h)
            local kept = false
            for _, e in ipairs(h.call("list_history", { product = { sku = "RDG" }, limit = 50 }).entries) do
                if e.attribute_id == id then
                    kept = true
                    test.is_nil(e.attribute)
                end
            end
            test.is_true(kept)
        end)

        test.it("compacts a removed attribute out of trashed products", function()
            local h = booted()
            local id = assert(steps.get(h, "RDG-moss-40")).product.product_id
            steps.one(h, { product = { id = id }, expect_version = "any", delete = true })
            assert(apply(h, { families = { catalog_fixture.footwear_own({ "core.gtin" }, nil, "core.gtin") }, remove = { attributes = { "logistics.net_weight" } } }))
            steps.rebuilt(h)
            test.eq(steps.one(h, { product = { id = id }, expect_version = "any", restore = true }).outcome, "updated")
            test.is_nil(assert(steps.get(h, "RDG-moss-40")).values["logistics.net_weight"])
        end)

        test.it("serves a removed channel as invalid in the feed when it never published", function()
            local h = booted()
            assert(apply(h, { remove = { channels = { "marketplace" } } }))
            local _, err = h.call("list_publications", { channel = "marketplace" })
            test.eq((err :: error):kind(), errors.INVALID)
        end)

        test.it("adds a channel without a rebuild and publishes to it", function()
            local h = booted()
            local out = assert(apply(h, { channels = { { id = "b2b", requirements = { "web" } } } }))
            test.is_false(h.call("query", { limit = 1 }).rebuilding)
            test.not_nil(out)
            local r = h.call("release", { items = { { product = { sku = "RDG-moss-40" }, expect_version = steps.version(h, "RDG-moss-40") } } })
            local channels = table.concat(r.outcomes[1].channels, ",")
            test.is_true(channels:find("b2b", 1, true) ~= nil, channels)
            test.is_true(channels:find("web", 1, true) ~= nil, channels)
        end)

        test.it("recomputes readiness after requirements change", function()
            local h = booted()
            test.eq(#h.call("query", { ready = { set = "web", value = true } }).items, 6)
            assert(apply(h, { families = { { code = "footwear", aspects = { "core", "marketing", "logistics", "pricing" },
                variation = { { axes = { "core.color" }, own = { "core.materials" } }, { axes = { "core.size" }, own = { "core.gtin", "logistics.net_weight" } } },
                requirements = { { id = "web", context = { locale = "all" }, require = { "core.name", "marketing.tagline" } },
                    { id = "marketplace_de", context = { locale = "de" }, require = { "core.gtin" }, authored = { "marketing.description" } } } } } }))
            steps.rebuilt(h)
            test.eq(#h.call("query", { ready = { set = "web", value = true } }).items, 0)
        end)

        test.it("refuses more requirement sets than a catalog may hold", function()
            local h = fixture.catalog()
            local requirements: { Map } = {}
            for i = 1, 65 do requirements[i] = { id = "r" .. i, context = { locale = "en" }, require = { "core.name" } } end
            refused_kind(h, { families = { { code = "many", aspects = { "core" }, requirements = requirements } } }, errors.INVALID, "65 sets")
        end)

        test.it("checks expected_generation", function()
            local h = fixture.catalog()
            local _, ok = h.call("apply_schema", { declaration = { vocabularies = { { code = "v1" } } }, expected_generation = 1 })
            test.is_nil(ok)
            local _, stale = h.call("apply_schema", { declaration = { vocabularies = { { code = "v2" } } }, expected_generation = 1 })
            test.eq((stale :: error):kind(), errors.CONFLICT)
            test.eq(((stale :: error):details() or {}).generation, 2)
        end)

        test.it("plans the first schema of a bare catalog and refuses removals there", function()
            local h = fixture.catalog({ bare = true })
            local plan, err = h.call("plan_schema", { declaration = fixture.DECLARATION })
            test.is_nil(err)
            test.eq(plan.class, "initial")
            local _, gerr = h.call("get_schema", {})
            test.not_nil(gerr)
            refused_kind(h, { remove = { families = { "footwear" } } }, errors.INVALID, "bare removal")
        end)

        test.it("plans an identical declaration as unchanged and writes nothing", function()
            local h = booted()
            local plan = h.call("plan_schema", { declaration = fixture.DECLARATION })
            test.eq(plan.class, "unchanged")
            test.eq(generation(h), 1)
        end)

        test.it("classifies a policy change with the change it travels with", function()
            local h = booted()
            local additive = assert(apply(h, { policy = { trash_days = 9 }, aspects = { { namespace = "core", attributes = { { code = "extra", type = TEXT } } } } }))
            test.eq(additive.class, "additive")
            local semantic = assert(apply(h, { policy = { trash_days = 10 }, aspects = { { namespace = "core", attributes = { { code = "care", type = TEXT, default = "Clean with a damp cloth.", index = "key" } } } } }))
            test.eq(semantic.class, "semantic")
            steps.rebuilt(h)
        end)

        test.it("returns a policy key to the deployment default with false", function()
            local h = fixture.catalog()
            assert(apply(h, { policy = { audit_days = 7 } }))
            test.eq(h.call("get_schema", {}).declaration.policy.audit_days, 7)
            assert(apply(h, { policy = { audit_days = false } }))
            test.is_nil(h.call("get_schema", {}).declaration.policy)
        end)

        test.it("changes the scope of an unused attribute and then asks for the context", function()
            local h = booted()
            local out = assert(apply(h, { aspects = { { namespace = "core", attributes = { { code = "related", type = "kickside.pim.types:reference", cardinality = "set", scope = { "locale" } } } } } }))
            test.eq(out.class, "additive")
            local target = assert(steps.get(h, "RDG-moss")).product.product_id
            test.eq(steps.one(h, { product = { sku = "RDG" }, expect_version = "any", set = { { attr = "core.related", value = { { ref = { "product", target } } } } } }).outcome, "invalid")
            test.eq(steps.one(h, { product = { sku = "RDG" }, expect_version = "any", set = { { attr = "core.related", ctx = { locale = "en" }, value = { { ref = { "product", target } } } } } }).outcome, "updated")
        end)

        test.it("drops unique from a used attribute, allows duplicates, and refuses it back", function()
            local h = booted()
            local plain = { code = "gtin", type = "kickside.pim.types:identifier", index = "key" }
            local out = assert(apply(h, { aspects = { { namespace = "core", attributes = { plain } } } }))
            test.eq(out.class, "semantic")
            steps.rebuilt(h)
            test.eq(steps.set(h, "RDG-moss-40", "core.gtin", "0400moss41").outcome, "updated")
            local back, err = apply(h, { aspects = { { namespace = "core", attributes = { { code = "gtin", type = "kickside.pim.types:identifier", index = "key", unique = true } } } } })
            test.is_nil(back)
            test.not_nil(err)
            test.eq(err:kind(), errors.INVALID)
            test.eq(err:details().code, "migration_required")
            test.is_false(err:retryable())
        end)

        test.it("refuses a cardinality change on a used attribute and allows it on an unused one", function()
            local h = booted()
            local used, err = apply(h, { aspects = { { namespace = "core", attributes = { { code = "materials", type = SELECT, vocabulary = "materials", index = "key" } } } } })
            test.is_nil(used)
            test.not_nil(err)
            test.eq(err:kind(), errors.INVALID)
            test.eq(err:details().code, "migration_required")
            test.is_false(err:retryable())
            local fresh = assert(apply(h, { aspects = { { namespace = "core", attributes = { { code = "tags", type = TEXT, cardinality = "set" } } } } }))
            test.eq(fresh.class, "additive")
            local changed = assert(apply(h, { aspects = { { namespace = "core", attributes = { { code = "tags", type = TEXT } } } } }))
            test.eq(changed.class, "additive")
        end)

        test.it("answers not found for a generation that never existed", function()
            local h = fixture.catalog()
            for _, g in ipairs({ 99, 0 }) do
                local _, err = h.call("get_schema", { generation = g })
                test.eq((err :: error):kind(), errors.NOT_FOUND)
            end
        end)

        test.it("refuses removing a source an aspect's write rule names", function()
            local h = fixture.catalog()
            refused_kind(h, { remove = { sources = { "pricing" } } }, errors.INVALID, "named source")
        end)

        test.it("removes a family once its products are trashed and refuses their restore", function()
            local h = fixture.catalog()
            local made = steps.one(h, { product = { sku = "SOLO" }, create = { family = "solo_family" } })
            test.eq(made.outcome, "invalid")
            assert(apply(h, { families = { { code = "solo", aspects = { "core" } } } }))
            local solo = steps.one(h, { product = { sku = "SOLO" }, create = { family = "solo" } })
            test.eq(solo.outcome, "created")
            local refused, err = apply(h, { remove = { families = { "solo" } } })
            test.is_nil(refused)
            test.not_nil(err)
            test.eq(err:kind(), errors.INVALID)
            test.eq(err:details().code, "migration_required")
            test.is_false(err:retryable())
            steps.one(h, { product = { id = solo.product_id }, expect_version = "any", delete = true })
            assert(apply(h, { remove = { families = { "solo" } } }))
            local back = steps.one(h, { product = { id = solo.product_id }, expect_version = "any", restore = true })
            test.eq(back.outcome, "invalid")
        end)

        test.it("keeps attribute ids in each generation's declaration", function()
            local h = fixture.catalog()
            local first = h.call("get_schema", { generation = 1 }).declaration
            for _, aspect in ipairs(first.aspects) do
                for _, a in ipairs(aspect.attributes) do test.not_nil(a.id, a.code) end
            end
            local id = catalog_fixture.catalog(h).compiled.attributes["core.size"].id
            test.eq(h.call("get_schema", {}).attributes["core.size"].id, id)
        end)
    end)
end

return { run = test.run_cases(define) }
