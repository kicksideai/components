-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local schema = require("schema")
local changes = require("changes")
local json = require("json")
local declaration = require("declaration")

local schema_fixture = require("schema_fixture")
local types = require("types")
local DECL, type_of = schema_fixture.declaration, schema_fixture.type_of

local function define()
    test.describe("schema compile", function()
        test.it("merges explicit plugin membership and removes only named members", function()
            local first: types.Declaration = { plugins = { { use = "app:one" }, { use = "app:two" } } }
            test.is_nil(declaration.check_shape(first))
            local merged = assert(declaration.merge(first, { plugins = { { use = "app:two" }, { use = "app:three" } } }))
            test.eq(#merged.plugins, 3)
            test.eq(merged.plugins[1].use, "app:one")
            test.eq(merged.plugins[2].use, "app:two")
            test.eq(merged.plugins[3].use, "app:three")
            local removed = assert(declaration.merge(merged, { remove = { plugins = { "app:two" } } }))
            test.eq(#removed.plugins, 2)
            test.eq(removed.plugins[2].use, "app:three")
            test.not_nil(declaration.check_shape({ plugins = { ["app:one"] = { enabled = true } } }))
            test.not_nil(declaration.check_shape({ plugins = { { use = "app:one", config = {} } } }))
            test.not_nil(declaration.check_shape({ plugins = { { use = "app:one", enabled = true } } }))
        end)

        test.it("classifies absent extension declarations by their seam", function()
            for _, condition in ipairs({ "type", "scope", "link_kind" }) do
                local decl: types.Declaration = {}
                if condition == "scope" then decl.scopes = { "app:absent" }
                else decl.aspects = { { namespace = "core", attributes = { { code = "value", type = "app:absent", config = { target = "absent" } } } } } end
                local compiled, err = schema.compile(nil, decl, {
                    type_of = function(): (types.TypeMeta?, error?)
                        if condition == "link_kind" then return { type = "app:absent", form = "ref", indexes = { "none" } }, nil end
                        return nil, nil
                    end,
                    scope = function() return false, nil end,
                    link_kind = function() return false, nil end,
                })
                test.is_nil(compiled)
                test.not_nil(err)
                test.eq(err:kind(), errors.INVALID)
                test.eq(err:details().code, "unknown_" .. condition)
            end
        end)

        test.it("refuses defaults that cannot be indexed", function()
            for _, a in ipairs({
                { code = "v", type = "text", index = "key", default = string.rep("x", 257) },
                { code = "v", type = "text", unique = true, default = string.rep("x", 257) },
                { code = "v", type = "text", index = "key", cardinality = "set", default = { string.rep("x", 257) } },
                { code = "v", type = "number", index = "number", config = { scale = 2 }, default = "1.001" },
            }) do
                local c, err = schema.compile(nil, { aspects = { { namespace = "core", attributes = { a } } } }, { type_of = type_of })
                test.is_nil(c)
                test.not_nil(err)
                test.eq(err:kind(), errors.INVALID)
            end
        end)
        test.it("refuses excessive scope dimensions contexts candidates attributes and checks", function()
            local members: { string } = {}
            for i = 1, 17 do members[i] = tostring(i) end
            local dims: { types.DimensionDecl } = {}
            for _, name in ipairs({ "a", "b", "c", "d" }) do dims[#dims + 1] = { name = name, members = members } end
            local function refused(decl: types.Declaration)
                test.not_nil(select(2, schema.compile(nil, decl, { type_of = type_of, is_check = function() return true end })))
            end
            refused({ dimensions = dims, aspects = { { namespace = "core", attributes = { { code = "v", type = "text", scope = { "a", "b", "c", "d" } } } } } })
            refused({ dimensions = dims, aspects = { { namespace = "core", attributes = { { code = "v", type = "text", scope = { "a", "b" } } } } } })
            local chain = {}
            for i = 2, 17 do chain[#chain + 1] = tostring(i) end
            dims[1].fallback = { ["1"] = chain }
            dims[2].fallback = { ["1"] = chain }
            refused({ dimensions = dims, aspects = { { namespace = "core", attributes = { { code = "v", type = "text", scope = { "a", "b" } } } } } })
            refused({ dimensions = dims, families = { { code = "f", requirements = { { id = "r", context = { a = "all", b = "all" } } } } } })
            local attrs = {}
            for i = 1, 1001 do attrs[i] = { code = "v" .. i, type = "text" } end
            refused({ aspects = { { namespace = "core", attributes = attrs } } })
            local checks = {}
            for i = 1, 101 do checks[i] = { check = "app:check" } end
            refused({ families = { { code = "f", checks = checks } } })
        end)
        test.it("preserves native type lookup classification", function()
            local dependency = errors.new({ kind = errors.PERMISSION_DENIED, message = "refused", details = { code = "type_denied" } })
            local _, err = schema.compile(nil, { aspects = { { namespace = "core", attributes = { { code = "v", type = "text" } } } } },
                { type_of = function() return nil, dependency end })
            test.eq(err:kind(), errors.PERMISSION_DENIED)
            test.eq(err:details().code, "type_denied")
        end)
        test.it("assigns stable ids and ownership levels", function()
            local c = assert(schema.compile(nil, DECL, { type_of = type_of }))
            test.eq(c.attributes["core.name"].id, 1)
            test.eq(c.families.shoe.owner["core.color"], 1)
            test.eq(c.families.shoe.owner["core.size"], 2)
            test.eq(c.families.shoe.item_level, 2)
            test.eq(c.families.generic.item_level, 0)
            local again = assert(schema.compile(schema.with_index(c), DECL, { type_of = type_of }))
            test.eq(again.attributes["core.size"].id, c.attributes["core.size"].id)
            local facts = { usage = { [1] = 1, [2] = 1, [3] = 1, [4] = 1 }, family_products = { shoe = 1 }, populated = true }
            test.eq(changes.classify(c, again, changes.changes(c, again, facts)), "cosmetic")
        end)
        test.it("lays attributes out by width: defaults by form, declared widths, a cosmetic change and a refused value", function()
            local c = assert(schema.compile(nil, DECL, { type_of = type_of }))
            test.eq(c.attributes["core.name"].width, "half")
            test.eq(c.attributes["core.color"].width, "half")
            test.eq(c.attributes["core.size"].width, "third")
            local decl = assert(json.decode((assert(json.encode(DECL))))) :: types.Declaration
            decl.aspects[1].attributes[4].width = "quarter"
            table.insert(decl.aspects[1].attributes, { code = "notes", type = "rich_text" })
            table.insert(decl.aspects[1].attributes, { code = "tags", type = "select", vocabulary = "colors", cardinality = "set" })
            local again = assert(schema.compile(schema.with_index(c), decl, { type_of = type_of }))
            test.eq(again.attributes["core.rank"].width, "quarter")
            test.eq(again.attributes["core.notes"].width, "full")
            test.eq(again.attributes["core.tags"].width, "full")
            local facts = { usage = { [1] = 1, [2] = 1, [3] = 1, [4] = 1 }, family_products = { shoe = 1 }, populated = true }
            local width_change: types.SchemaChange? = nil
            for _, ch in ipairs(changes.changes(c, again, facts)) do
                if ch.code == "core.rank" and ch.what == "width" then width_change = ch end
            end
            test.eq(assert(width_change).class, "cosmetic")
            decl.aspects[1].attributes[4].width = "wide"
            test.not_nil(select(2, schema.compile(nil, decl, { type_of = type_of })))
        end)
        test.it("refuses fallback cycles and unknown members", function()
            local bad = { dimensions = { { name = "locale", members = { "a", "b" }, fallback = { a = { "b" }, b = { "a" } } } } }
            test.not_nil(select(2, schema.compile(nil, bad, { type_of = type_of })))
            test.not_nil(select(2, schema.ctx_key(schema.with_index(assert(schema.compile(nil, DECL, { type_of = type_of }))).dimensions, { "locale" }, { locale = "xx" })))
        end)
        test.it("refuses a type change on a populated attribute", function()
            local c = schema.with_index(assert(schema.compile(nil, DECL, { type_of = type_of })))
            local changed = { dimensions = DECL.dimensions, vocabularies = DECL.vocabularies, families = DECL.families,
                aspects = { { namespace = "core", attributes = {
                    { code = "name", type = "text", scope = { "locale" }, index = "text", index_contexts = { { locale = "en" } } },
                    { code = "color", type = "select", vocabulary = "colors", index = "key" },
                    { code = "size", type = "integer", index = "number" },
                    { code = "rank", type = "text" },
                } } } }
            local next_c = assert(schema.compile(c, changed, { type_of = type_of }))
            local facts = { usage = { [4] = 3 }, family_products = { shoe = 1 }, populated = true }
            test.eq(changes.classify(c, next_c, changes.changes(c, next_c, facts)), "refused")
            test.eq(changes.classify(c, next_c, changes.changes(c, next_c, { usage = {}, family_products = {}, populated = false })), "additive")
        end)
    end)
    test.describe("quantity attributes", function()
        test.it("require units with a canonical factor of 1", function()
            local function decl(units: unknown, canonical: string): types.Declaration
                return { aspects = { { namespace = "core", attributes = { { code = "weight", type = "quantity", index = "number",
                    config = { units = units, canonical = canonical, scale = 3 } } } } } }
            end
            test.not_nil((schema.compile(nil, decl({ kg = "1", lb = "0.45359237" }, "kg"), { type_of = type_of })))
            test.not_nil(select(2, schema.compile(nil, decl({ kg = "2" }, "kg"), { type_of = type_of })))
            test.not_nil(select(2, schema.compile(nil, decl({ kg = "1", lb = "-1" }, "kg"), { type_of = type_of })))
            test.not_nil(select(2, schema.compile(nil, decl({ kg = "1" }, "lb"), { type_of = type_of })))
        end)
    end)
    test.describe("schema compile edge cases", function()
        -- variant(fn) compiles a copy of DECL changed by fn.
        local function variant(fn: (types.Declaration) -> ()): (types.Compiled?, error?)
            local d = json.decode((json.encode(DECL))) :: types.Declaration
            fn(d)
            return schema.compile(nil, d, { type_of = type_of, link_kind = function(kind: string): (boolean, error?) return kind == "asset", nil end })
        end
        local function refused(fn: (types.Declaration) -> (), what: string)
            local c, err = variant(fn)
            test.is_nil(c, what)
            test.not_nil(err, what)
        end
        local function accepted(fn: (types.Declaration) -> (), what: string): types.Compiled
            local c, err = variant(fn)
            test.is_nil(err, what .. ": " .. tostring(err))
            return c :: types.Compiled
        end
        local function attr(d: types.Declaration, extra: types.AttributeDecl)
            table.insert(d.aspects[1].attributes, extra)
        end

        test.it("bounds dimensions and members", function()
            refused(function(d) for i = 1, 4 do table.insert(d.dimensions, { name = "d" .. i, members = { "x" } }) end end, "5 dimensions")
            refused(function(d) local m = {} for i = 1, 65 do m[i] = "m" .. i end d.dimensions[1].members = m end, "65 members")
            refused(function(d) d.dimensions[1].members = {} end, "no members")
            for _, m in ipairs({ "a;b", "a=b", "*", "" }) do refused(function(d) d.dimensions[1].members = { "en", m } end, "member " .. m) end
            refused(function(d) d.dimensions[1].members = { "en", "en" } end, "duplicate member")
            accepted(function(d) d.dimensions[1].members = { "en", "de", "de-AT", "a.b" } end, "dotted member")
            for _, name in ipairs({ "Locale", "1x" }) do refused(function(d) d.dimensions[1].name = name end, "dimension " .. name) end
            refused(function(d) table.insert(d.dimensions, { name = "locale", members = { "x" } }) end, "duplicate dimension")
        end)

        test.it("checks fallback chains", function()
            refused(function(d) d.dimensions[1].fallback = { en = { "en" } } end, "self fallback")
            refused(function(d) d.dimensions[1].fallback = { en = { "xx" } } end, "unknown target")
            refused(function(d) d.dimensions[1].fallback = { xx = { "en" } } end, "unknown source")
            local dim: types.Dimension = { name = "locale", members = { "a", "b", "c", "d" }, fallback = { a = { "b", "c" }, b = { "d" }, c = { "d" } } }
            local chain = schema.chain(dim, "a")
            test.eq(table.concat(chain, ","), "a,b,d,c,*")
            local nested: types.Dimension = { name = "locale", members = { "de", "de-AT", "de-CH" }, fallback = { ["de-CH"] = { "de-AT" }, ["de-AT"] = { "de" } } }
            test.eq(table.concat(schema.chain(nested, "de-CH"), ","), "de-CH,de-AT,de,*")
        end)

        test.it("checks vocabularies and attribute declarations", function()
            refused(function(d) d.vocabularies[1].semantic = true end, "semantic vocabulary")
            refused(function(d) table.insert(d.vocabularies, { code = "colors" }) end, "duplicate vocabulary")
            refused(function(d) d.vocabularies[1].code = "Colors" end, "vocabulary case")
            for _, code in ipairs({ "Name", "" }) do refused(function(d) attr(d, { code = code, type = "text" }) end, "code " .. code) end
            refused(function(d) attr(d, { code = "x" } :: types.AttributeDecl) end, "missing type")
            refused(function(d) attr(d, { code = "x", type = "nope" }) end, "unknown type")
            refused(function(d) attr(d, { code = "x", type = "text", cardinality = "many" }) end, "cardinality many")
            refused(function(d) attr(d, { code = "x", type = "text", scope = { "channel" } }) end, "unknown scope")
            refused(function(d) attr(d, { code = "x", type = "select" }) end, "select without vocabulary")
            refused(function(d) attr(d, { code = "x", type = "select", vocabulary = "sizes" }) end, "unknown vocabulary")
            refused(function(d) attr(d, { code = "name", type = "text" }) end, "duplicate code")
            refused(function(d) table.insert(d.aspects, { namespace = "core", attributes = {} }) end, "duplicate aspect")
            refused(function(d) table.insert(d.aspects, { namespace = "Core", attributes = {} }) end, "aspect case")
        end)

        test.it("refuses references that declare no target", function()
            refused(function(d) attr(d, { code = "x", type = "untargeted" }) end, "ref type without target")
            refused(function(d) attr(d, { code = "x", type = "untargeted", config = { target = "unbound" } }) end, "link to an unbound kind")
            refused(function(d) attr(d, { code = "x", type = "untargeted", config = { target = "product" } }) end, "link to products")
            refused(function(d) attr(d, { code = "x", type = "record", config = { members = { a = { form = "banana" } } } }) end, "member of unknown form")
            refused(function(d) attr(d, { code = "x", type = "record", config = { members = { a = { form = "ref" } } } }) end,
                "record member ref without target")
            refused(function(d) attr(d, { code = "x", type = "record", config = { members = {
                outer = { form = "record", members = { inner = { form = "ref" } } } } } }) end, "nested member ref without target")
            accepted(function(d)
                attr(d, { code = "x", type = "untargeted", config = { target = "asset" } })
                attr(d, { code = "y", type = "record", config = { members = { a = { form = "ref", target = "asset" } } } })
            end, "targeted references")
        end)

        test.it("checks index kinds and index contexts", function()
            refused(function(d) attr(d, { code = "x", type = "text", index = "number" }) end, "number on text")
            refused(function(d) attr(d, { code = "x", type = "rich_text", index = "key" }) end, "key on rich text")
            refused(function(d) attr(d, { code = "x", type = "integer", index = "text" }) end, "text on integer")
            refused(function(d) attr(d, { code = "x", type = "text", scope = { "locale" }, index = "key" }) end, "scoped index without contexts")
            refused(function(d) attr(d, { code = "x", type = "text", scope = { "locale" }, index = "key", index_contexts = {} }) end, "empty contexts")
            refused(function(d) attr(d, { code = "x", type = "text", scope = { "locale" }, index = "key", index_contexts = { { locale = "xx" } } }) end, "unknown member")
            refused(function(d) attr(d, { code = "x", type = "text", scope = { "locale" }, index = "key", index_contexts = { {} } }) end, "missing dimension")
            refused(function(d) attr(d, { code = "x", type = "text", scope = { "locale" }, index = "key",
                index_contexts = { { locale = "en" }, { locale = "en" } } }) end, "duplicate index context")
            local many = function(d: types.Declaration)
                for i = 1, 401 do attr(d, { code = "c" .. i, type = "integer", index = "number" }) end
            end
            refused(many, "401 columns")
        end)

        test.it("checks unique, defaults and quantity units", function()
            refused(function(d) attr(d, { code = "x", type = "text", scope = { "locale" }, unique = true }) end, "unique scoped")
            refused(function(d) attr(d, { code = "x", type = "text", cardinality = "set", unique = true }) end, "unique set")
            accepted(function(d) attr(d, { code = "x", type = "number", unique = true }) end, "unique number")
            local scoped = accepted(function(d) attr(d, { code = "x", type = "integer", scope = { "locale" }, default = "0042" }) end, "scoped default")
            test.eq(scoped.attributes["core.x"].default, 42)
            refused(function(d) attr(d, { code = "x", type = "integer", default = "x" }) end, "invalid default")
            local c = accepted(function(d) attr(d, { code = "x", type = "number", default = "1.50" }) end, "dec default")
            test.eq((c.attributes["core.x"].default :: types.Dec).m, 15)
            local units = { { units = {} }, { units = { kg = "1" } }, { units = { ["k g"] = "1" }, canonical = "k g" },
                { units = { kg = "1", g = "0" }, canonical = "kg" }, { units = { kg = "1", g = "abc" }, canonical = "kg" },
                { units = { g = "1" }, canonical = "kg" } }
            for i, cfg in ipairs(units) do refused(function(d) attr(d, { code = "w", type = "quantity", config = cfg }) end, "units " .. i) end
        end)

        test.it("checks attribute ids across aspects", function()
            local base = schema.with_index(assert(schema.compile(nil, DECL, { type_of = type_of })))
            local function next_with(fn: (types.Declaration) -> ()): (types.Compiled?, error?)
                local d = json.decode((json.encode(DECL))) :: types.Declaration
                fn(d)
                return schema.compile(base, d, { type_of = type_of })
            end
            test.not_nil(select(2, next_with(function(d) d.aspects[1].attributes[1].id = 99 end)))
            test.not_nil(select(2, next_with(function(d) d.aspects[1].attributes[1].id = 2; d.aspects[1].attributes[2].id = 2 end)))
            test.not_nil(select(2, next_with(function(d)
                table.insert(d.aspects, { namespace = "extra", attributes = { { id = 1, code = "name", type = "text" } } })
                table.remove(assert(d.aspects[1].attributes), 1)
            end)))
        end)

        test.it("checks families, variation and requirements", function()
            refused(function(d) table.insert(d.families, { code = "generic" }) end, "generic redeclared")
            refused(function(d) table.insert(d.families, { code = "shoe" }) end, "duplicate family")
            refused(function(d) table.insert(d.families, { code = "x", aspects = { "nope" } }) end, "unknown aspect")
            refused(function(d) table.insert(d.families[1].variation, { axes = { "core.rank" } }) end, "three levels")
            refused(function(d) d.families[1].variation[2] = { axes = {} } end, "level without axes")
            refused(function(d) d.families[1].variation[2] = { axes = { "core.nope" } } end, "axis outside family")
            for _, a in ipairs({ { code = "t", type = "text" }, { code = "t", type = "integer", scope = { "locale" } },
                { code = "t", type = "integer", cardinality = "set" }, { code = "t", type = "record" } }) do
                refused(function(d) attr(d, a); d.families[1].variation[2] = { axes = { "core.t" } } end, "bad axis " .. a.type)
            end
            refused(function(d) attr(d, { code = "t", type = "identifier" }); d.families[1].variation[2] = { axes = { "core.t" } } end, "identifier axis")
            for _, kind in ipairs({ "number", "boolean", "date", "select" }) do
                accepted(function(d)
                    attr(d, { code = "t", type = kind, vocabulary = kind == "select" and "colors" or nil })
                    d.families[1].variation[2] = { axes = { "core.t" } }
                end, "axis " .. kind)
            end
            refused(function(d) d.families[1].variation[2].own = { "core.color" } end, "owned twice")
            refused(function(d) d.families[1].variation[2].own = { "core.nope" } end, "own outside family")
            local c = accepted(function(_d) end, "base")
            for _, level in pairs(c.families.generic.owner) do test.eq(level, 0) end
            test.eq(c.families.generic.item_level, 0)
            for _, r in ipairs({ { id = "Web" }, { id = "web", context = { channel = "x" } }, { id = "web", context = { locale = "xx" } },
                { id = "web", require = { "core.nope" } }, { id = "web", authored = { "core.nope" } } }) do
                refused(function(d) d.families[1].requirements = { r } end, "requirement " .. json.encode(r))
            end
            refused(function(d) d.families[1].requirements = { { id = "web" }, { id = "web" } } end, "duplicate requirement")
            local all = accepted(function(d) d.families[1].requirements = { { id = "web", context = { locale = "all" } } } end, "all")
            test.eq(#all.families.shoe.requirements[1].contexts, 3)
            local none = accepted(function(d) d.families[1].requirements = { { id = "web" } } end, "no context")
            test.eq(#none.families.shoe.requirements[1].contexts, 1)
            local shared = accepted(function(d)
                d.families[1].requirements = { { id = "web" } }
                table.insert(d.families, { code = "bag", aspects = { "core" }, requirements = { { id = "web" } } })
            end, "shared set")
            test.eq(#shared.layout.flags, 1)
            refused(function(d)
                local reqs = {}
                for i = 1, 65 do reqs[i] = { id = "r" .. i } end
                d.families[1].requirements = reqs
            end, "65 sets")
        end)

        test.it("checks sources, channels and checks", function()
            refused(function(d) d.sources = { { id = "erp", ordering = "foo" } } end, "ordering foo")
            refused(function(d) d.sources = { { id = "erp" }, { id = "erp" } } end, "duplicate source")
            refused(function(d) d.sources = { { id = "" } } end, "empty source id")
            refused(function(d) d.sources = { { id = "erp", writes = { "nope" } } } end, "unknown write aspect")
            refused(function(d) d.sources = { { id = "erp", audit = "yes" } } end, "audit yes")
            refused(function(d) d.aspects[1].write = { sources = { "nope" } } end, "unknown write source")
            refused(function(d) d.channels = { { id = "Web" } } end, "channel case")
            refused(function(d) d.channels = { { id = "web" }, { id = "web" } } end, "duplicate channel")
            refused(function(d) d.channels = { { id = "web", requirements = { "nope" } } } end, "unknown set")
            refused(function(d) d.channels = { { id = "web", families = { "nope" } } } end, "unknown family")
            local c = accepted(function(d) d.channels = { { id = "web", families = {} } } end, "empty families")
            test.eq(#c.channels.web.families, 0)
            local d = json.decode((json.encode(DECL))) :: types.Declaration
            d.families[1].checks = { { check = "app:x", cost = "lazy" } }
            test.not_nil(select(2, schema.compile(nil, d, { type_of = type_of, is_check = function() return true, nil end })))
            d.families[1].checks = { { check = "app:x", reads = { "core.nope" } } }
            test.not_nil(select(2, schema.compile(nil, d, { type_of = type_of, is_check = function() return true, nil end })))
            d.families[1].checks = { { check = "app:x" } }
            test.not_nil(select(2, schema.compile(nil, d, { type_of = type_of })))
        end)

        test.it("adopts scopes the registry declares and classifies adoption as cosmetic", function()
            local function known(id: string): (boolean, error?)
                if id == "app:stock" or id == "app:cost" then return true, nil end
                return false, errors.new({ kind = errors.INVALID, message = "unknown scope " .. id })
            end
            local d = json.decode((json.encode(DECL))) :: types.Declaration
            d.scopes = { "app:stock" }
            test.not_nil(select(2, schema.compile(nil, d, { type_of = type_of })))
            local c = schema.with_index(assert(schema.compile(nil, d, { type_of = type_of, scope = known })))
            test.is_true(c.scopes["app:stock"] == true)
            local base = schema.with_index(assert(schema.compile(nil, DECL, { type_of = type_of })))
            test.is_nil(next(base.scopes))
            local adopted = assert(schema.compile(base, d, { type_of = type_of, scope = known }))
            test.eq(changes.classify(base, adopted, changes.changes(base, adopted, { usage = {}, family_products = {}, populated = true })), "cosmetic")
            d.scopes = { "app:nope" }
            test.not_nil(select(2, schema.compile(nil, d, { type_of = type_of, scope = known })))
            d.scopes = { "app:stock", "app:stock" }
            test.not_nil(select(2, schema.compile(nil, d, { type_of = type_of, scope = known })))
        end)

        test.it("records explicit membership and classifies adoption as cosmetic", function()
            local function manifest(id: string, _config: types.JsonObject): error?
                if id ~= "app:shelf" then return errors.new({ kind = errors.INVALID, message = "unknown plugin", details = { code = "unknown_plugin" } }) end
                return nil
            end
            local d = json.decode((json.encode(DECL))) :: types.Declaration
            d.plugins = { { use = "app:shelf" } }
            test.not_nil(select(2, schema.compile(nil, d, { type_of = type_of })))
            local c = schema.with_index(assert(schema.compile(nil, d, { type_of = type_of, plugin = manifest })))
            test.eq(c.plugins["app:shelf"].use, "app:shelf")
            local base = schema.with_index(assert(schema.compile(nil, DECL, { type_of = type_of })))
            test.is_nil(next(base.plugins))
            local facts = { usage = {}, family_products = {}, populated = true }
            test.eq(changes.classify(base, c, changes.changes(base, c, facts)), "cosmetic")
            d.plugins = { { use = "app:shelf" }, { use = "app:shelf" } }
            test.not_nil(select(2, schema.compile(nil, d, { type_of = type_of, plugin = manifest })))
            d.plugins = { { use = "app:nope" } }
            test.not_nil(select(2, schema.compile(nil, d, { type_of = type_of, plugin = manifest })))
        end)

        test.it("builds context keys inside the attribute scope only", function()
            local c = schema.with_index(assert(schema.compile(nil, DECL, { type_of = type_of })))
            test.not_nil(select(2, schema.ctx_key(c.dimensions, {}, { locale = "en" })))
            test.eq(schema.ctx_key(c.dimensions, {}, {}), "")
            test.eq(schema.ctx_key(c.dimensions, { "locale" }, { locale = "*" }), "locale=*")
            test.not_nil(select(2, schema.ctx_key(c.dimensions, { "locale" }, {})))
            test.not_nil(select(2, schema.ctx_key(c.dimensions, { "locale" }, { locale = "en", channel = "web" })))
        end)
    end)


end

return { run = test.run_cases(define) }
