-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local schema = require("schema")
local changes = require("changes")
local resolve = require("resolve")
local json = require("json")
local declaration = require("declaration")
local policy = require("policy")

local schema_fixture = require("schema_fixture")
local types = require("types")
local DECL, type_of = schema_fixture.declaration, schema_fixture.type_of

local function define()
    test.describe("record term declarations", function()
        for _, depth in ipairs({ 2, 3 }) do
            test.it("requires a term vocabulary at record depth " .. depth, function()
                local term: types.MemberSpec = { form = "ref", target = "term" }
                local config: types.AttributeConfig = { members = { tag = term } }
                local path = "tag"
                for _ = 2, depth do
                    config = { members = { child = { form = "record", members = config.members } } }
                    path = "child." .. path
                end
                local decl: types.Declaration = {
                    vocabularies = { { code = "colors" } },
                    aspects = { { namespace = "core", attributes = {
                        { code = "bundle", type = "record", config = config },
                    } } },
                }
                local compiled, err = schema.compile(nil, decl, { type_of = type_of })
                test.is_nil(compiled)
                test.not_nil(err)
                if err then
                    test.eq(err:kind(), errors.INVALID)
                    test.eq(err:details().code, "invalid_schema")
                    test.eq(err:message(), "core.bundle." .. path .. ": term references need a vocabulary")
                end
                term.vocabulary = "colors"
                local valid, valid_err = schema.compile(nil, decl, { type_of = type_of })
                test.is_nil(valid_err)
                test.not_nil(valid)
            end)
        end
    end)
    test.describe("schema changes", function()
        test.it("classifies a newly declared vocabulary as additive", function()
            local before = schema.with_index(assert(schema.compile(nil, DECL, { type_of = type_of })))
            local merged = assert(declaration.merge(DECL, { vocabularies = { { code = "sizes" } } }))
            local after = assert(schema.compile(before, merged, { type_of = type_of }))
            local changeset = changes.changes(before, after, { usage = {}, family_products = {}, populated = false })
            test.eq(changes.classify(before, after, changeset), "additive")
        end)

        test.it("leaves the caller's declaration untouched", function()
            local decl = { aspects = { { namespace = "core", attributes = {
                { code = "color", type = "select", vocabulary = "colors", config = { note = "x" } } } } },
                vocabularies = { { code = "colors" } } }
            assert(schema.compile(nil, decl, { type_of = type_of }))
            test.is_nil(decl.aspects[1].attributes[1].config.target)
        end)
        test.it("refuses representation config changes on populated attributes", function()
            local function decl(scale: integer): types.Declaration
                return { aspects = { { namespace = "core", attributes = {
                    { code = "size", type = "integer", index = "number", config = { scale = scale } } } } } }
            end
            local before = schema.with_index(assert(schema.compile(nil, decl(0), { type_of = type_of })))
            local after = assert(schema.compile(before, decl(2), { type_of = type_of }))
            local facts = { usage = { [1] = 2 }, family_products = {}, populated = true }
            test.eq(changes.classify(before, after, changes.changes(before, after, facts)), "refused")
            test.eq(changes.changes(before, after, facts)[1].what, "config.scale")
        end)
    end)
    test.describe("resolution", function()
        test.it("falls back through the chain, inherits by level and stops at cleared", function()
            local c = schema.with_index(assert(schema.compile(nil, DECL, { type_of = type_of })))
            local name = c.attributes["core.name"]
            local root = { product_id = "r", level = 0, family = "shoe", document = { ["1"] = { ["locale=de"] = { p = "Stiefel" }, ["locale=en"] = { c = 1 } } } }
            local item = { product_id = "i", level = 2, family = "shoe", document = {} }
            local lineage = { [0] = root, [2] = item }
            local r = resolve.resolve(c, item :: unknown, lineage, assert(name), { locale = "de-AT" })
            test.eq(r.value, "Stiefel")
            test.eq(r.state, "inherited")
            test.is_true(r.fallback)
            test.eq(resolve.resolve(c, item, lineage, name, { locale = "en" }).state, "cleared")
            test.eq(resolve.resolve(c, root, { [0] = root }, c.attributes["core.size"], {}).state, "not_applicable")
        end)
    end)

    test.describe("schema change classification", function()
        local function compiled(d: types.Declaration): types.Compiled return schema.with_index(assert(schema.compile(nil, d, { type_of = type_of }))) end
        local function again(prev: types.Compiled, fn: (types.Declaration) -> ()): types.Compiled
            local d = json.decode((json.encode(DECL))) :: types.Declaration
            fn(d)
            return schema.with_index(assert(schema.compile(prev, d, { type_of = type_of })))
        end
        local USED = { usage = { [1] = 1, [2] = 1, [3] = 1, [4] = 1 }, family_products = { shoe = 1 }, populated = true }
        local EMPTY = { usage = {}, family_products = {}, populated = false }
        local function class(prev: types.Compiled, nxt: types.Compiled, facts: changes.Facts): string
            return changes.classify(prev, nxt, changes.changes(prev, nxt, facts))
        end
        local function rank(fn: (types.AttributeDecl) -> ()): (types.Declaration) -> ()
            return function(d: types.Declaration) fn(assert(d.aspects[1].attributes[4])) end
        end

        test.it("refuses representation changes of used attributes only", function()
            local base = compiled(DECL)
            local cases = {
                { "scope", rank(function(a) a.scope = { "locale" } end) },
                { "unique", rank(function(a) a.unique = true end) },
                { "type", rank(function(a) a.type = "number" end) },
                { "cardinality", rank(function(a) a.cardinality = "set" end) },
                { "range", rank(function(a) a.config = { range = { 0, 10 } } end) },
                { "case", function(d) d.aspects[1].attributes[1].config = { case = "insensitive" } end },
            }
            for _, case in ipairs(cases) do
                local nxt = again(base, case[2])
                test.eq(class(base, nxt, USED), "refused", case[1] .. " used")
                test.is_true(class(base, nxt, EMPTY) ~= "refused", case[1] .. " unused")
            end
        end)

        test.it("classifies index, default and removal changes", function()
            local base = compiled(DECL)
            test.eq(class(base, again(base, rank(function(a) a.index = "key" end)), USED), "semantic")
            test.eq(class(base, again(base, rank(function(a) a.default = 3 end)), USED), "semantic")
            test.eq(class(base, again(base, function(d) table.remove(d.aspects[1].attributes, 4) end), USED), "semantic")
            test.eq(class(base, again(base, function(d) table.remove(d.aspects[1].attributes, 4) end), EMPTY), "additive")
            test.eq(class(base, again(base, function(d) d.dimensions[1].fallback = {} end), USED), "semantic")
            test.eq(class(base, again(base, function(d) d.policy = { audit = "off" } end), USED), "cosmetic")
            test.eq(class(base, again(base, function(d) d.sources = { { id = "erp" } } end), USED), "cosmetic")
            test.eq(class(base, again(base, function(d) d.families = {} end), USED), "refused")
            test.eq(class(base, again(base, function(d) d.families[1].variation = { { axes = { "core.color" } } } end), USED), "refused")
        end)

        test.it("treats a rename by id as cosmetic without a rebuild", function()
            local base = compiled(DECL)
            local renamed = again(base, function(d)
                local a = d.aspects[1].attributes[4]
                a.id = base.attributes["core.rank"].id
                a.code = "position"
            end)
            test.eq(class(base, renamed, USED), "cosmetic")
            test.eq(renamed.digest, base.digest)
        end)

        test.it("refuses removing a dimension member while products exist", function()
            local base = compiled(DECL)
            local nxt = again(base, function(d) d.dimensions[1].members = { "en", "de" }; d.dimensions[1].fallback = {} end)
            test.eq(class(base, nxt, USED), "refused")
            test.is_true(class(base, nxt, EMPTY) ~= "refused")
        end)
    end)

    test.describe("declaration merge edge cases", function()
        test.it("resolves zero audit windows to the finite default", function()
            local defaults: types.Policy = { audit="fields", audit_days=7, trash_days=14, tombstone_days=365,
                proposal_days=30, completed_work_days=180, abandoned_work_days=180, import_days=180,
                pending_creation_days=90, proposal_count=1000, proposal_bytes=262144, command_deadline_ms=5000,
                maintenance_rows=500, maintenance_catalogs=10, rebuild_rows=500, job_batches=20, import_rows=200 }
            test.eq(policy.effective(defaults, nil).audit_days, 7)
            test.eq(policy.effective(defaults, { audit_days=0 }).audit_days, 365)
            test.eq(policy.effective(defaults, { audit_days=1 }).audit_days, 1)
            defaults.audit_days=0
            test.eq(policy.effective(defaults, nil).audit_days, 365)
            test.eq(policy.effective(defaults, { audit_days=0 }).audit_days, 365)
        end)

        test.it("bounds retention windows in catalog declarations", function()
            for _, key in ipairs({ "audit_days", "trash_days", "tombstone_days" }) do
                test.is_nil(policy.check(key, 106751), key)
                test.not_nil(policy.check(key, 106752), key)
                test.not_nil(policy.check(key, 1.5), key)
                test.not_nil(select(2, policy.overrides({ [key]=106752 })), key)
            end
        end)

        test.it("refuses policy values that are numbers in text", function()
            test.not_nil(policy.check("audit_days", "5"))
            test.not_nil(policy.check("trash_days", "30"))
            test.is_nil(policy.check("audit_days", 5))
        end)

        test.it("refuses removals that cannot apply", function()
            test.not_nil(select(2, declaration.merge(nil, { remove = { families = { "shoe" } } })))
            local base = assert(declaration.merge(nil, DECL))
            test.not_nil(select(2, declaration.merge(base, { remove = { attributes = { "core.nope" } } })))
            test.not_nil(select(2, declaration.merge(base, { remove = { families = { "nope" } } })))
            test.not_nil(select(2, declaration.merge(base, { remove = { channels = { "nope" } } })))
            test.not_nil(select(2, declaration.merge(base, { remove = { scopes = { "app:nope" } } })))
        end)

        test.it("replaces a named membership whole and removes it only by remove", function()
            local base = assert(declaration.merge(nil, { plugins = { { use = "app:shelf" } } }))
            local replaced = assert(declaration.merge(base, { plugins = { { use = "app:shelf" } } }))
            test.eq(#replaced.plugins, 1)
            test.eq(replaced.plugins[1].use, "app:shelf")
            local both = assert(declaration.merge(replaced, { plugins = { { use = "app:other" } } }))
            test.eq(#both.plugins, 2)
            local removed = assert(declaration.merge(both, { remove = { plugins = { "app:shelf" } } }))
            test.eq(#removed.plugins, 1)
            test.eq(removed.plugins[1].use, "app:other")
            test.not_nil(select(2, declaration.merge(removed, { remove = { plugins = { "app:shelf" } } })))
        end)

        test.it("adds scopes by id and removes them only by remove", function()
            local base = assert(declaration.merge(nil, { scopes = { "app:stock" } }))
            local more = assert(declaration.merge(base, { scopes = { "app:cost", "app:stock" } }))
            test.eq(table.concat(more.scopes :: { string }, ","), "app:stock,app:cost")
            local kept = assert(declaration.merge(more, { families = {} }))
            test.eq(#(kept.scopes :: { string }), 2)
            local fewer = assert(declaration.merge(more, { remove = { scopes = { "app:stock" } } }))
            test.eq(table.concat(fewer.scopes :: { string }, ","), "app:cost")
        end)
        test.it("takes incoming attribute order, retains omitted entries and ids, and refuses code collisions", function()
            local base = assert(declaration.merge(nil, DECL))
            base.aspects[1].attributes[1].id = 1
            base.aspects[1].attributes[2].id = 2
            local out = assert(declaration.merge(base, { aspects = { { namespace = "core", attributes = {
                { code = "size", type = "integer" }, { code = "extra", type = "text" } } } } }))
            local codes = {}
            for i, a in ipairs(out.aspects[1].attributes) do codes[i] = a.code end
            test.eq(table.concat(codes, ","), "size,extra,name,color,rank")
            test.eq(out.aspects[1].attributes[3].id, 1)
            test.eq(out.aspects[1].attributes[4].id, 2)
            test.not_nil(select(2, declaration.merge(base, { aspects = { { namespace = "core", attributes = { { id = 1, code = "color", type = "text" } } } } })))
            local written = assert(declaration.merge(base, { aspects = { { namespace = "core", write = { sources = { "erp" } } } } }))
            test.eq(written.aspects[1].write.sources[1], "erp")
            local kept = assert(declaration.merge(written, { aspects = { { namespace = "core", attributes = {} } } }))
            test.eq(kept.aspects[1].write.sources[1], "erp")
        end)
        test.it("merges policy keys and clears them with false", function()
            local base = assert(declaration.merge(nil, { policy = { audit = "off", trash_days = 3 } }))
            local cleared = assert(declaration.merge(base, { policy = { audit = false } }))
            test.is_nil(cleared.policy.audit)
            test.eq(cleared.policy.trash_days, 3)
            test.is_nil(assert(declaration.merge(cleared, { policy = { trash_days = false } })).policy)
            test.not_nil(select(2, declaration.merge(base, { policy = { color = 1 } })))
        end)
    end)

    test.describe("resolution edge cases", function()
        local TWO = json.decode((json.encode(DECL))) :: types.Declaration
        table.insert(TWO.dimensions, 1, { name = "channel", members = { "web", "marketplace" } })
        TWO.aspects[1].attributes[1].scope = { "locale", "channel" }
        TWO.aspects[1].attributes[1].index_contexts = { { channel = "web", locale = "en" } }
        table.insert(TWO.aspects[1].attributes, { code = "note", type = "text", default = "d" })

        test.it("orders two-dimension candidates with the first dimension most significant", function()
            local c = schema.with_index(assert(schema.compile(nil, TWO, { type_of = type_of })))
            local name = assert(c.attributes["core.name"])
            local cands = resolve.candidates(c, name, { channel = "marketplace", locale = "de-AT" })
            test.eq(table.concat(cands, "|"),
                "channel=marketplace;locale=de-AT|channel=marketplace;locale=de|channel=marketplace;locale=*|channel=*;locale=de-AT|channel=*;locale=de|channel=*;locale=*")
            local missing = resolve.candidates(c, name, { locale = "en" })
            test.eq(missing[1], "channel=*;locale=en")
        end)

        test.it("reports fallback, inheritance, wildcard and cleared-default states", function()
            local c = schema.with_index(assert(schema.compile(nil, DECL, { type_of = type_of })))
            local name = assert(c.attributes["core.name"])
            local id = tostring(name.id)
            local own: types.Product = { product_id = "r", sku = "r", family = "shoe", root_id = "r", level = 0, is_item = 0, version = 1,
                status = "active", state = "live", document = { [id] = { ["locale=de"] = { p = "D" } } }, source_seq = {} }
            local fallback = resolve.resolve(c, own, { [0] = own }, name, { locale = "de-AT" })
            test.eq(fallback.state, "fallback")
            local item: types.Product = { product_id = "i", sku = "i", family = "shoe", parent_id = "m", root_id = "r", level = 2, is_item = 1,
                version = 1, status = "active", state = "live", document = {}, source_seq = {} }
            local inherited = resolve.resolve(c, item, { [0] = own, [2] = item }, name, { locale = "de-AT" })
            test.eq(inherited.state, "inherited")
            test.is_true(inherited.fallback)
            own.document[id] = { ["locale=*"] = { c = 1 }, ["locale=en"] = { p = "E" } }
            test.eq(resolve.resolve(c, own, { [0] = own }, name, { locale = "en" }).value, "E")
            own.document[id] = { ["locale=*"] = { p = "W" } }
            local wild = resolve.resolve(c, own, { [0] = own }, name, { locale = "en" })
            test.eq(wild.state, "fallback")
            test.eq(wild.value, "W")
            local c2 = schema.with_index(assert(schema.compile(nil, TWO, { type_of = type_of })))
            local note = assert(c2.attributes["core.note"])
            own.document = { [tostring(note.id)] = { [""] = { c = 1 } } }
            test.eq(resolve.resolve(c2, own, { [0] = own }, note, {}).state, "cleared")
        end)
    end)
end

return { run = test.run_cases(define) }
