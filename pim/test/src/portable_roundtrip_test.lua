-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local types = require("types")
local fixture = require("fixture")
local steps = require("steps")
local uuid = require("uuid")
local json = require("json")
local fs = require("fs")

type Map = { [string]: unknown }

local READ, WRITE, ADMIN = 1, 2, 8

local catalog_fixture = require("catalog_fixture")
local catalog = catalog_fixture.catalog
local export = catalog_fixture.export
local import = catalog_fixture.import

local function define()
    test.describe("portability", function()
        test.it("bounds the encoded term line at admission and round-trips the exact limit", function()
            local source = fixture.catalog()
            local code = "storage-budget"
            local empty = assert(json.encode({ vocabulary = "colors", code = code, labels = { en = "" }, retired = false }))
            local label = string.rep("x", 3000000 - #empty - 1)
            local function apply(text: string): types.ApplyResult
                return assert(source.call("apply", { items = {
                    { term = { vocabulary = "colors", code = code }, labels = { en = text } },
                } }))
            end
            local accepted = apply(label)
            test.eq(accepted.outcomes[1].outcome, "created")
            local args = { storage_id = "app:exports", path = "term-budget-" .. source.id }
            local exported = assert(source.call("portable", { method = "export", args = args }))
            test.is_true(exported.success, json.encode(exported))
            local target = fixture.catalog({ bare = true })
            local imported = assert(target.call("portable", { method = "import_into", args = args }))
            test.is_true(imported.success, json.encode(imported))
            local terms = assert(target.call("list_terms", { vocabulary = "colors", after = "storage-budge", limit = 1 }))
            test.eq(terms.terms[1].code, code)
            test.eq(#terms.terms[1].labels.en, #label)
            local oversized = apply(label .. "x")
            test.eq(oversized.outcomes[1].outcome, "invalid")
            local escaped = apply(label:sub(1, #label - 1) .. "\n")
            test.eq(escaped.outcomes[1].outcome, "invalid", "JSON escaping counts towards the limit")
            local storage = assert(fs.get(args.storage_id))
            local line = assert(json.encode({ vocabulary = "colors", code = code, labels = { en = label .. "x" }, retired = false }))
            assert(storage:writefile(args.path .. "/data/terms.jsonl", line .. "\n"))
            local empty = fixture.catalog({ bare = true })
            local refused = assert(empty.call("portable", { method = "import_into", args = args }))
            test.is_false(refused.success)
            test.eq(refused.details.code, "import_chunk_limit")
        end)

        test.it("exports a newly created catalog with its empty schema", function()
            local h = fixture.catalog({ bare = true })
            local out = export(h.call)
            test.eq(out.success, true)
            test.eq(((out.manifest :: Map).counts :: Map).products, 0)
        end)

        test.it("leaves trashed products out of an export", function()
            local h = fixture.catalog()
            fixture.boot(h)
            steps.one(h, { product = { sku = "RDG-moss-40" }, expect_version = "any", delete = true })
            local out = export(h.call)
            test.eq(out.success, true)
            test.eq(((out.manifest :: Map).counts :: Map).products, 8)
        end)

        test.it("replays the same import on its original target", function()
            local src = fixture.catalog()
            fixture.boot(src)
            local _, path = export(src.call)
            local dst = fixture.catalog({ bare = true })
            test.eq(import(dst.call, path).success, true)
            test.eq(import(dst.call, path).success, true)
        end)

        test.it("refuses importing over a catalog holding the same skus", function()
            local src = fixture.catalog()
            fixture.boot(src)
            local _, path = export(src.call)
            local dst = fixture.catalog()
            fixture.boot(dst)
            test.eq(import(dst.call, path).success, false)
        end)

        test.it("keeps rows of the id map it was given", function()
            local src = fixture.catalog()
            fixture.boot(src)
            local _, path = export(src.call)
            local dst = fixture.catalog({ bare = true })
            local out = import(dst.call, path, { rows = { other = { a = "b" } } })
            test.eq(out.success, true)
            test.eq((((out.id_map :: Map).rows :: Map).other :: Map).a, "b")
            test.not_nil(((out.id_map :: Map).rows :: Map).pim_product)
        end)

        test.it("reproduces statuses, sets, clears and wildcard values", function()
            local src = fixture.catalog()
            fixture.boot(src)
            steps.one(src, { product = { sku = "RDG-moss-40" }, expect_version = "any", status = "draft" })
            steps.one(src, { product = { sku = "RDG" }, expect_version = "any", set = { { attr = "core.name", ctx = { locale = "*" }, value = "Any" } }, clear = { { attr = "core.care" } } })
            local _, path = export(src.call)
            local dst = fixture.catalog({ bare = true })
            test.eq(import(dst.call, path).success, true)
            test.eq(assert(steps.get(dst, "RDG-moss-40")).product.status, "draft")
            test.eq(assert(steps.get(dst, "RDG", { locale = "de-AT" })).values["core.name"].value, "Ridgeline Wanderstiefel")
            test.eq(assert(steps.get(dst, "RDG", { locale = "en" })).values["core.care"].state, "cleared")
            test.eq(#assert(steps.get(dst, "RDG-moss")).values["core.materials"].value :: { unknown }, 2)
        end)

        test.it("assigns the same attribute ids on a bare target", function()
            local src = fixture.catalog()
            local _, path = export(src.call)
            local dst = fixture.catalog({ bare = true })
            test.eq(import(dst.call, path).success, true)
            test.eq(catalog(dst).compiled.attributes["core.size"].id, catalog(src).compiled.attributes["core.size"].id)
            test.eq(catalog(dst).generation, 2)
        end)

        test.it("refuses an export path that holds nothing", function()
            local dst = fixture.catalog({ bare = true })
            test.eq(import(dst.call, "export-" .. uuid.v4()).success, false)
        end)

        for _, case in ipairs({ { "READ", READ, "export" }, { "WRITE", READ + WRITE, "import_into" } } :: { { unknown } }) do
            test.it("refuses " .. tostring(case[3]) .. " under " .. tostring(case[1]), function()
                local h = fixture.catalog()
                fixture.boot(h)
                local _, path = export(h.call)
                local call, id = fixture.user(h)
                h.call("grant", { subject_id = id, mask = case[2] })
                local out, err = call("portable", { method = case[3], args = { storage_id = "app:exports", path = case[3] == "export" and ("e-" .. uuid.v4()) or path, id_map = {} } })
                test.is_true(err ~= nil or (out :: Map).success == false, json.encode(out))
            end)
        end

        test.it("refuses export and import to an outsider", function()
            local h = fixture.catalog()
            fixture.boot(h)
            local _, path = export(h.call)
            local outsider = fixture.user(h)
            test.eq((export(outsider)).success, false)
            test.eq(import(outsider, path).success, false)
            test.eq(#h.call("query", {}).items, 6)
        end)

        test.it("exports under ADMIN", function()
            local h = fixture.catalog()
            fixture.boot(h)
            local call, id = fixture.user(h)
            h.call("grant", { subject_id = id, mask = READ + WRITE + ADMIN })
            test.eq(export(call).success, true)
        end)
    end)


end

return { run = test.run_cases(define) }
