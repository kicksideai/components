-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local store = require("store")
-- Vocabulary terms: codes, labels, hierarchy, retirement and their use by products.
local test = require("test")
local fixture = require("fixture")
local steps = require("steps")
local types = require("types")

local function term(h: fixture.Handle, vocabulary: string, code: string, extra: { [string]: unknown }?): string
    local item: { [string]: unknown } = { term = { vocabulary = vocabulary, code = code } }
    for k, v in pairs(extra or {}) do item[k] = v end
    local out, err = h.call("apply", { items = { item } })
    if err then return (err :: error):kind() == errors.INVALID and "refused" or tostring(err) end
    return (out :: types.ApplyResult).outcomes[1].outcome
end

local function define()
    test.describe("vocabulary hierarchy declarations", function()
        test.it("refuses flattening a vocabulary that still has parent links", function()
            local h = fixture.catalog()
            local before = assert(h.call("get_schema", {}))
            local patch = { vocabularies = { { code = "categories", hierarchical = false } } }
            local plan, plan_err = h.call("plan_schema", { declaration = patch })
            local result, err = h.call("apply_schema", { declaration = patch })
            if result then
                local terms = assert(h.call("list_terms", { vocabulary = "categories", parent = "footwear" })).terms
                test.is_nil(result, "flat vocabulary still returns " .. #terms .. " child term(s)")
            end
            test.eq((err :: error):kind(), errors.INVALID)
            test.is_true(plan_err ~= nil or plan.class == "refused")
            test.eq(assert(h.call("get_schema", {})).as_of, before.as_of)
        end)

        test.it("still refuses flattening after a linked child is retired", function()
            local h = fixture.catalog()
            test.eq(term(h, "categories", "hiking", { retired = true }), "updated")
            local result, err = h.call("plan_schema", { declaration = { vocabularies = { { code = "categories" } } } })
            test.is_nil(result)
            test.eq((err :: error):kind(), errors.INVALID)
        end)

        test.it("flattens a vocabulary containing only roots even when another vocabulary has children", function()
            local h = fixture.catalog()
            assert(h.call("apply_schema", { declaration = { vocabularies = { { code = "labels", hierarchical = true } } } }))
            test.eq(term(h, "labels", "blue"), "created")
            local patch = { vocabularies = { { code = "labels", hierarchical = false } } }
            assert(h.call("plan_schema", { declaration = patch }))
            assert(h.call("apply_schema", { declaration = patch }))
            test.is_false(assert(h.call("get_schema", {})).vocabularies.labels.hierarchical)
            test.eq(term(h, "labels", "red", { parent = "blue" }), "invalid")
        end)
    end)

    test.describe("term codes and labels", function()
        test.it("accepts bounded codes and refuses others", function()
            local h = fixture.catalog()
            for _, code in ipairs({ "a/b", "-x", "", string.rep("c", 129), " moss" }) do test.eq(term(h, "colors", code), "invalid", code) end
            test.eq(term(h, "colors", "A.b_c-1"), "created")
            test.eq(term(h, "colors", "Moss"), "created")
            test.eq(term(h, "colors", "moss"), "unchanged")
            test.eq(term(h, "nope", "x"), "invalid")
            test.eq(term(h, "colors", "x", { labels = "x" }), "invalid")
            test.eq(term(h, "colors", "x", { labels = {} }), "created")
        end)

        test.it("keeps identical resends unchanged and parents when omitted", function()
            local h = fixture.catalog()
            test.eq(term(h, "categories", "boots", { parent = "footwear", labels = { en = "Boots" } }), "created")
            test.eq(term(h, "categories", "boots", { parent = "footwear", labels = { en = "Boots" } }), "unchanged")
            test.eq(term(h, "categories", "boots", { labels = { en = "Boots!" } }), "updated")
            local page = h.call("list_history", { limit = 1 }) :: types.HistoryResult
            test.eq(page.entries[1].subject, "t:categories:boots")
            test.eq((page.entries[1].after :: { parent: string }).parent, "footwear")
        end)
    end)

    test.describe("term listing", function()
        test.it("lists a vocabulary's live terms by code with labels and parents, retired ones on request", function()
            local h = fixture.catalog()
            fixture.seed_terms(h)
            test.eq(term(h, "categories", "sandals", { parent = "footwear", labels = { en = "Sandals" } }), "created")
            test.eq(term(h, "categories", "sandals", { retired = true }), "updated")
            local page, err = h.call("list_terms", { vocabulary = "categories" })
            test.is_nil(err)
            local listed = (page :: types.ListTermsResult).terms
            test.eq(#listed, 2)
            test.eq(listed[1].code, "footwear")
            test.eq(listed[2].code, "hiking")
            test.eq(listed[2].parent, "footwear")
            test.eq(listed[2].labels.en, "Hiking boots")
            test.is_false(listed[2].retired)
            local all = h.call("list_terms", { vocabulary = "categories", retired = true }) :: types.ListTermsResult
            test.eq(#all.terms, 3)
            test.is_true(all.terms[3].retired)
            local children = h.call("list_terms", { vocabulary = "categories", parent = "footwear" }) :: types.ListTermsResult
            test.eq(#children.terms, 1)
            test.eq(children.terms[1].code, "hiking")
        end)

        test.it("pages by code and refuses an unknown vocabulary", function()
            local h = fixture.catalog()
            fixture.seed_terms(h)
            local first = h.call("list_terms", { vocabulary = "colors", limit = 2 }) :: types.ListTermsResult
            test.eq(#first.terms, 2)
            test.eq(first.terms[1].code, "clay")
            test.not_nil(first.next)
            local rest = h.call("list_terms", { vocabulary = "colors", limit = 2, after = first.next }) :: types.ListTermsResult
            test.eq(#rest.terms, 2)
            test.eq(rest.terms[1].code, "sand")
            test.is_nil(rest.next)
            local _, err = h.call("list_terms", { vocabulary = "nope" })
            test.eq((err :: error):kind(), errors.INVALID)
            local reader, reader_id = fixture.user(h)
            local _, denied = reader("list_terms", { vocabulary = "colors" })
            test.eq((denied :: error):kind(), errors.PERMISSION_DENIED)
            h.call("grant", { subject_id = reader_id, mask = 1 })
            test.eq(#(reader("list_terms", { vocabulary = "colors" }) :: types.ListTermsResult).terms, 4)
        end)
    end)

    test.describe("term hierarchy", function()
        test.it("refuses parents that are absent, retired, cyclic or too deep", function()
            local h = fixture.catalog()
            test.eq(term(h, "colors", "x", { parent = "moss" }), "invalid")
            test.eq(term(h, "categories", "x", { parent = "nope" }), "invalid")
            test.eq(term(h, "categories", "old"), "created")
            test.eq(term(h, "categories", "old", { retired = true }), "updated")
            test.eq(term(h, "categories", "x", { parent = "old" }), "invalid")
            test.eq(term(h, "categories", "footwear", { parent = "footwear" }), "invalid")
            local out = assert(steps.apply(h, {
                { term = { vocabulary = "categories", code = "c1" } },
                { term = { vocabulary = "categories", code = "c2" }, parent = "c1" },
                { term = { vocabulary = "categories", code = "c1" }, parent = "c2" } }, "independent"))
            test.eq(out.outcomes[3].outcome, "invalid")
            local chain: { types.ApplyItem } = { { term = { vocabulary = "categories", code = "d0" } } }
            for i = 1, 65 do chain[#chain + 1] = { term = { vocabulary = "categories", code = "d" .. i }, parent = "d" .. (i - 1) } end
            local deep = assert(steps.apply(h, chain, "independent"))
            test.eq(deep.outcomes[65].outcome, "created")
            test.eq(deep.outcomes[66].outcome, "invalid")
        end)
    end)

    test.describe("retirement", function()
        test.it("keeps a retired term retired when only its labels change", function()
            local h = fixture.catalog()
            test.eq(term(h, "colors", "teal"), "created")
            test.eq(term(h, "colors", "teal", { retired = true }), "updated")
            test.eq(term(h, "colors", "teal", { retired = true }), "unchanged")
            test.eq(term(h, "colors", "teal", { labels = { en = "Teal" } }), "updated")
            fixture.boot(h)
            test.eq(steps.set(h, "RDG-moss", "core.color", "teal").outcome, "invalid")
            test.eq(term(h, "colors", "teal", { retired = false }), "updated")
        end)

        test.it("retires a parent once its children are retired", function()
            local h = fixture.catalog()
            test.eq(term(h, "categories", "footwear", { retired = true }), "invalid")
            test.eq(term(h, "categories", "hiking", { retired = true }), "updated")
            test.eq(term(h, "categories", "footwear", { retired = true }), "updated")
        end)
    end)

    test.describe("terms in product values", function()
        test.it("refuses retired terms and terms from another vocabulary", function()
            local h = fixture.catalog()
            fixture.boot(h)
            test.eq(steps.set(h, "RDG-moss", "core.color", { ref = { "term", "materials:nylon" } }).outcome, "invalid")
            local mixed = steps.set(h, "RDG-moss", "core.materials", { "leather", { ref = { "term", "materials:rubber" } } })
            test.eq(mixed.outcome, "updated")
            test.eq(#(assert(steps.get(h, "RDG-moss")).values["core.materials"].value :: { types.Scalar }), 2)
        end)

        test.it("sees terms created or retired earlier in the same command", function()
            local h = fixture.catalog()
            fixture.boot(h)
            local made = assert(steps.apply(h, {
                { term = { vocabulary = "colors", code = "teal" } },
                { product = { sku = "RDG-teal" }, create = { parent = { sku = "RDG" } }, set = { { attr = "core.color", value = "teal" } } } }))
            test.is_true(made.applied)
            local gone = assert(steps.apply(h, {
                { term = { vocabulary = "colors", code = "sand" }, retired = true },
                { product = { sku = "RDG-sand" }, create = { parent = { sku = "RDG" } }, set = { { attr = "core.color", value = "sand" } } } }, "independent"))
            test.eq(gone.outcomes[2].outcome, "invalid")
            local rolled = assert(steps.apply(h, {
                { term = { vocabulary = "colors", code = "ruby" } },
                { product = { sku = "RDG-ruby" }, create = { parent = { sku = "RDG" } } } }))
            test.is_false(rolled.applied)
            test.eq(steps.set(h, "RDG-moss", "core.color", "ruby").outcome, "invalid")
        end)

        test.it("finds products by term and drops the link when the value goes", function()
            local h = fixture.catalog()
            fixture.boot(h)
            local by = h.call("list_links", { kind = "term", target = "categories:hiking" }) :: types.LinksResult
            test.eq(#by.items, 1)
            test.eq(by.items[1].sku, "RDG")
            steps.one(h, { product = { sku = "RDG" }, expect_version = steps.version(h, "RDG"), unset = { { attr = "core.category" } } })
            test.eq(#(h.call("list_links", { kind = "term", target = "categories:hiking" }) :: types.LinksResult).items, 0)
        end)
    end)
    test.describe("terms", function()
        test.it("preserves labels across sequential term edits", function()
            local h = fixture.catalog()
            local out, err = h.call("apply", { items = {
                { term = { vocabulary = "categories", code = "batch" }, labels = { en = "Batch" } },
                { term = { vocabulary = "categories", code = "batch" }, retired = true },
            } })
            test.is_nil(err)
            test.is_true(out.applied)
            local db = assert(store.open())
            local term = assert(store.term(db, h.id, "categories", "batch"))
            db:release()
            test.eq(term.labels.en, "Batch")
            test.eq(term.retired, 1)
        end)
        test.it("checks term references as earlier accepted items leave them", function()
            local h = fixture.catalog()
            local out, err = h.call("apply", { mode = "independent", items = {
                { product = { sku = "holder" }, create = {}, set = { { attr = "core.category", value = "hiking" } } },
                { term = { vocabulary = "categories", code = "hiking" }, retired = true },
            } })
            test.is_nil(err)
            test.is_true(out.applied)
            test.eq(out.outcomes[1].outcome, "created")
            test.eq(out.outcomes[2].outcome, "invalid")
            local cleared, cerr = h.call("apply", { items = {
                { product = { sku = "holder" }, expect_version = 1, unset = { { attr = "core.category" } } },
                { term = { vocabulary = "categories", code = "hiking" }, retired = true },
            } })
            test.is_nil(cerr)
            test.is_true(cleared.applied)
            test.eq(cleared.outcomes[1].outcome, "updated")
            test.eq(cleared.outcomes[2].outcome, "updated")
        end)
        test.it("checks term children as earlier accepted items leave them", function()
            local h = fixture.catalog()
            local out, err = h.call("apply", { mode = "independent", items = {
                { term = { vocabulary = "categories", code = "parent" } },
                { term = { vocabulary = "categories", code = "child" }, parent = "parent" },
                { term = { vocabulary = "categories", code = "parent" }, retired = true },
            } })
            test.is_nil(err)
            test.is_true(out.applied)
            test.eq(out.outcomes[1].outcome, "created")
            test.eq(out.outcomes[2].outcome, "created")
            test.eq(out.outcomes[3].outcome, "invalid")
            local retired, rerr = h.call("apply", { items = {
                { term = { vocabulary = "categories", code = "child" }, retired = true },
                { term = { vocabulary = "categories", code = "parent" }, retired = true },
            } })
            test.is_nil(rerr)
            test.is_true(retired.applied)
            test.eq(retired.outcomes[1].outcome, "updated")
            test.eq(retired.outcomes[2].outcome, "updated")
        end)
    end)

end

return { run = test.run_cases(define) }
