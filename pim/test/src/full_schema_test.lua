-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local channel = require("channel")
local fixture = require("fixture")
local json = require("json")
local registry = require("registry")
local retention_rows = require("retention_rows")
local scoped = require("scoped")
local sql = require("sql")
local steps = require("steps")
local test = require("test")
local time = require("time")
local types = require("types")
local catalog_fixture = require("catalog_fixture")
local base64 = require("base64")
local hash = require("hash")
local http_client = require("http_client")
local fs = require("fs")
local funcs = require("funcs")
local uuid = require("uuid")

type Map = { [string]: unknown }
local TYPE = "kickside.pim.types:"
local ROOT, BRANCH, LEAF = "RIDGE", "RIDGE-OAK", "RIDGE-OAK-42"
local EN = { channel = "web", locale = "en", market = "us" }
local DE = { channel = "retail", locale = "de", market = "eu" }
local AT = { channel = "retail", locale = "de-at", market = "eu" }
local TEXT = "Straße Café العربية 🥾"
local PLUGIN = "app:full_schema_plugin"
local STATE_PLUGIN = "app:state_plugin"

local function call(h: fixture.Handle, op: string, request: unknown): Map
    local out, err = h.call(op, request)
    assert(out and not err, op .. ": " .. tostring(err) .. " " .. json.encode(err and err:details() or {}))
    return out :: Map
end

local function refused(h: fixture.Handle, op: string, request: unknown, kind: string, code: string?): error
    local out, err = h.call(op, request)
    test.is_nil(out)
    local problem = assert(err)
    test.eq(problem:kind(), kind, tostring(problem))
    if code then test.eq(problem:details().code, code, tostring(problem)) end
    return problem
end

local function catalog(session: scoped.Session?): fixture.Handle
    local h = session and scoped.catalog(session, true) or fixture.catalog({ bare = true })
    local declaration = assert(registry.get("app:full_schema")).data
    local request = { declaration = declaration, expected_generation = 1 }
    local plan = call(h, "plan_schema", request) :: types.SchemaPlanResult
    test.eq(plan.class, "additive")
    test.eq(#plan.refused, 0)
    test.eq(call(h, "apply_schema", request).generation, 2)
    local terms = call(h, "apply", { items = {
        { term = { vocabulary = "categories", code = "goods" }, labels = { en = "Goods" } },
        { term = { vocabulary = "categories", code = "boots" }, parent = "goods", labels = { en = "Boots", de = "Stiefel" } },
        { term = { vocabulary = "categories", code = "old" }, parent = "goods", retired = true },
        { term = { vocabulary = "finishes", code = "oak" }, labels = { en = "Oak" } },
        { term = { vocabulary = "finishes", code = "ash" }, labels = { en = "Ash" } },
    } })
    test.is_true(terms.applied, json.encode(terms))
    return h
end

local function ref(kind: string, id: string): types.Ref
    return { ref = { kind, id } }
end

local function get(h: fixture.Handle, sku: string, ctx: types.Ctx?): types.GetResult
    return call(h, "get", { product = { sku = sku }, context = ctx }) :: types.GetResult
end

local function edit(h: fixture.Handle, sku: string, patch: Map): types.Outcome
    patch.product = { sku = sku }
    patch.expect_version = get(h, sku).product.version
    return call(h, "apply", { items = { patch } }).outcomes[1] :: types.Outcome
end

local function outcome(result: types.Outcome, expected: string, code: string?)
    test.eq(result.outcome, expected, json.encode(result))
    if code then test.eq(assert(result.findings)[1].code, code, json.encode(result)) end
end

local function create(h: fixture.Handle, sku: string, entries: { types.ValueEntry }?): types.Outcome
    return steps.one(h, { product = { sku = sku }, create = { family = "standalone" }, set = entries })
end

local function tree(h: fixture.Handle)
    local made = call(h, "apply", { items = {
        { product = { sku = ROOT }, create = { family = "model" }, status = "active", set = {
            { attr = "item.name", ctx = { locale = "en" }, value = TEXT },
            { attr = "item.name", ctx = { locale = "de" }, value = "Wanderschuh" },
            { attr = "item.copy", ctx = { channel = "web", locale = "en" }, value = "<p>Waterproof</p>" },
            { attr = "item.copy", ctx = { channel = "retail", locale = "de" }, value = "<p>Wasserdicht</p>" },
            { attr = "item.category", value = "boots" },
        } },
        { product = { sku = BRANCH }, create = { parent = { sku = ROOT } }, status = "active",
            set = { { attr = "item.finish", value = "oak" } } },
        { product = { sku = LEAF }, create = { parent = { sku = BRANCH } }, status = "active",
            set = { { attr = "item.size", value = 42 }, { attr = "item.identifier", value = "Boot-42" } } },
    } })
    test.is_true(made.applied, json.encode(made))
end

local function query(h: fixture.Handle, attr: string, op: string, value: unknown): { types.QueryItem }
    return steps.query(h, { where = { field = attr, op = op, value = value } }).items
end

local function release(h: fixture.Handle, sku: string, channels: { string }): types.Outcome
    return call(h, "release", { items = { { product = { sku = sku }, channels = channels,
        expect_version = get(h, sku).product.version } } }).outcomes[1] :: types.Outcome
end

local function snapshot(h: fixture.Handle, id: string?): types.ReleaseRecord
    return call(h, "get_release", { release_id = assert(id) }).release :: types.ReleaseRecord
end

local function seed_depot(id: string)
    local db = assert(sql.get("app:db"))
    assert(db:execute("CREATE TABLE IF NOT EXISTS pim_test_locations (id TEXT PRIMARY KEY, label TEXT NOT NULL, hidden INTEGER NOT NULL DEFAULT 0)", {}))
    assert(db:execute("INSERT INTO pim_test_locations (id, label) VALUES ($1, $2)", { id, "Depot" }))
    db:release()
end

local function values_and_indexes()
    test.it("round-trips every form, catalog layout, scoped values and index kinds", function()
        local h = catalog()
        seed_depot(h.id)
        local schema = call(h, "get_schema", {}) :: types.SchemaView
        local builtins: { [string]: boolean } = {}
        for _, attr in pairs(schema.attributes) do builtins[attr.type] = true end
        for _, option in ipairs(call(h, "schema_options", {}).types) do
            if option.id:sub(1, #TYPE) == TYPE then
                test.is_true(builtins[option.id], option.id)
            end
        end
        test.eq(schema.attributes["item.name"].width, "quarter")
        test.eq(schema.attributes["item.copy"].width, "full")
        test.eq(schema.attributes["item.price"].width, "third")
        test.eq(schema.attributes["item.weight"].width, "half")
        test.eq(schema.declaration.aspects[1].attributes[1].code, "name")
        test.eq(table.concat(schema.attributes["item.market_copy"].scope, ","), "channel,locale,market")
        test.eq(schema.attributes["quality.stamp"].plugin, PLUGIN)
        test.eq(schema.attributes["item.price"].config.currency, "EUR")
        test.is_true(schema.scopes["app:stock_scope"])
        local target = assert(create(h, "TARGET").product_id)
        local made = create(h, "PRODUCT", {
            { attr = "item.name", ctx = { locale = "en" }, value = TEXT },
            { attr = "item.copy", ctx = { channel = "web", locale = "en" }, value = "<p>Waterproof 🥾</p>" },
            { attr = "item.label", ctx = { channel = "web" }, value = "Online" },
            { attr = "item.market_copy", ctx = EN, value = "US only" },
            { attr = "item.identifier", value = "Straße-١" },
            { attr = "item.rank", value = -9007199254740991 },
            { attr = "item.fraction", value = "0.000000000001" },
            { attr = "item.weight", value = "1 lb" },
            { attr = "item.price", value = "12.3400" },
            { attr = "item.introduced", value = "0001-01-01" },
            { attr = "item.changed_at", value = "9999-12-31T23:59:59.999999999Z" },
            { attr = "item.category", value = "boots" },
            { attr = "item.finishes", value = { "oak", "ash", "oak" } },
            { attr = "item.related", value = ref("product", target) },
            { attr = "item.depot", value = ref("app.location", h.id) },
            { attr = "item.packages", value = { { title = "Set", aliases = { "z", "a", "z" },
                details = { targets = { ["term/~"] = ref("term", "categories:boots"), owner = ref("component", h.id) } } } } },
            { attr = "quality.stamp", value = " a b c " },
        })
        outcome(made, "created")
        local got = get(h, "PRODUCT", EN).values
        test.eq(got["item.name"].value, TEXT)
        test.eq(got["item.copy"].value, "<p>Waterproof 🥾</p>")
        test.eq(got["item.label"].value, "Online")
        test.eq(get(h, "PRODUCT", DE).values["item.label"].value, "Standard")
        test.eq(got["item.market_copy"].value, "US only")
        test.eq(get(h, "PRODUCT", DE).values["item.market_copy"].state, "absent")
        test.eq(got["item.identifier"].value, "Straße-١")
        test.eq(got["item.rank"].value, -9007199254740991)
        test.eq(got["item.fraction"].value.m, 1)
        test.eq(got["item.fraction"].value.e, -12)
        test.eq(got["item.weight"].value.u, "lb")
        test.eq(got["item.weight"].value.v.m, 1)
        test.eq(got["item.price"].value.m, 1234)
        test.eq(got["item.price"].value.e, -2)
        test.eq(got["item.enabled"].value, false)
        test.eq(got["item.enabled"].state, "default")
        test.eq(got["item.introduced"].value, "0001-01-01")
        test.eq(got["item.changed_at"].value, "9999-12-31T23:59:59.999999999Z")
        test.eq(got["item.category"].value.ref[2], "categories:boots")
        test.eq(#got["item.finishes"].value, 2)
        test.eq(got["item.finishes"].value[1].ref[2], "finishes:ash")
        test.eq(got["item.finishes"].value[2].ref[2], "finishes:oak")
        test.eq(got["item.related"].value.ref[2], target)
        test.eq(got["item.depot"].value.ref[2], h.id)
        test.eq(table.concat(got["item.packages"].value[1].aliases, ","), "z,a,z")
        test.eq(got["item.packages"].value[1].details.targets.owner.ref[2], h.id)
        test.eq(got["quality.stamp"].value, "ABC")
        outcome(steps.set(h, "PRODUCT", "quality.stamp", "a b"), "invalid", "wrong_length")
        test.eq(query(h, "item.identifier", "eq", "STRASSE-١")[1].sku, "PRODUCT")
        test.eq(query(h, "item.rank", "lt", 0)[1].sku, "PRODUCT")
        test.eq(query(h, "item.weight", "eq", "453.59237 g")[1].sku, "PRODUCT")
        test.eq(query(h, "item.finishes", "has", "oak")[1].sku, "PRODUCT")
        test.eq(query(h, "item.price", "gte", "12.34")[1].sku, "PRODUCT")
        test.eq(query(h, "item.depot", "eq", ref("app.location", h.id))[1].sku, "PRODUCT")
        test.eq(steps.query(h, { text = "waterproof STRASSE العربية" }).items[1].sku, "PRODUCT")
        test.eq(steps.count(h, { text = "CAFE" }), 0)
        test.eq(steps.query(h, { text = "CAFÉ" }).items[1].sku, "PRODUCT")
        local links = call(h, "list_links", { kind = "term", target = "categories:boots" }).items :: { types.LinkRow }
        for _, row in ipairs(links) do
            if row.attribute == "item.packages" then
                test.eq(row.path, "0/details/targets/term~1~0")
                return
            end
        end
        error("nested reference did not reach the reverse index")
    end)

    test.it("keeps empty, cleared, absent and default values distinct", function()
        local h = catalog()
        outcome(create(h, "EMPTY"), "created")
        local got = get(h, "EMPTY", EN).values
        test.eq(got["item.copy"].state, "absent")
        test.eq(got["item.label"].state, "default")
        outcome(steps.set(h, "EMPTY", "item.label", "", { channel = "web" }), "updated")
        outcome(steps.set(h, "EMPTY", "item.annotations", {}), "updated")
        outcome(edit(h, "EMPTY", { clear = { { attr = "item.label", ctx = { channel = "web" } } } }), "updated")
        got = get(h, "EMPTY", EN).values
        test.eq(got["item.label"].state, "cleared")
        test.is_nil(got["item.label"].value)
        test.eq(got["item.annotations"].state, "own")
        test.eq(#(got["item.annotations"].value :: { unknown }), 0)
        outcome(edit(h, "EMPTY", { unset = { { attr = "item.label", ctx = { channel = "web" } } } }), "updated")
        test.eq(get(h, "EMPTY", EN).values["item.label"].value, "Standard")
        outcome(steps.set(h, "EMPTY", "item.label", nil, { channel = "web" }), "invalid")
        test.eq(get(h, "EMPTY", EN).values["item.label"].state, "default")
    end)

    test.it("rejects explicit JSON null and a missing value while clear and unset remain distinct", function()
        local h = catalog()
        outcome(create(h, "HTTP-NULL"), "created")
        local ui = scoped.member()
        call(h, "grant", { subject_id = ui.id, mask = 3 })
        for _, suffix in ipairs({ ',"value":null', "" }) do
            local body = '{"items":[{"product":{"sku":"HTTP-NULL"},"expect_version":1,"set":[{"attr":"item.spare"' .. suffix .. '}]}]}'
            local reply = ui.raw("POST", "/" .. h.id .. "/apply", body)
            test.eq(reply.status, 200, json.encode(reply.body))
            test.is_false(reply.body.data.applied)
            outcome(reply.body.data.outcomes[1] :: types.Outcome, "invalid")
            test.eq(get(h, "HTTP-NULL").values["item.spare"].state, "absent")
        end
        outcome(steps.set(h, "HTTP-NULL", "item.spare", ""), "updated")
        test.eq(get(h, "HTTP-NULL").values["item.spare"].value, "")
        outcome(edit(h, "HTTP-NULL", { clear = { { attr = "item.spare" } } }), "updated")
        test.eq(get(h, "HTTP-NULL").values["item.spare"].state, "cleared")
        outcome(edit(h, "HTTP-NULL", { unset = { { attr = "item.spare" } } }), "updated")
        test.eq(get(h, "HTTP-NULL").values["item.spare"].state, "absent")
        outcome(steps.set(h, "HTTP-NULL", "item.spare", "x" .. string.char(0) .. "y"), "invalid")
    end)

    test.it("uses Unicode folding for unique identifiers, SKU prefixes and search across contexts", function()
        local h = catalog()
        outcome(create(h, "Straße-🥾", {
            { attr = "item.identifier", value = "Σtraße" },
            { attr = "item.name", ctx = { locale = "en" }, value = "Café العربية 👩🏽‍🔬" },
            { attr = "item.spare", value = "Café" },
        }), "created")
        outcome(create(h, "Straße-🥾"), "conflict")
        outcome(create(h, "OTHER", { { attr = "item.identifier", value = "ςTRASSE" } }), "conflict")
        test.eq(query(h, "item.identifier", "eq", "σtrasse")[1].sku, "Straße-🥾")
        test.eq(steps.query(h, { text = "STRASSE-" }).items[1].sku, "Straße-🥾")
        test.eq(steps.query(h, { text = "CAFÉ العربية" }).items[1].sku, "Straße-🥾")
        test.eq(steps.count(h, { text = "CAFE" }), 0)
        test.eq(steps.count(h, { text = "🥾" }), 0)
        test.eq(get(h, "Straße-🥾").values["item.spare"].value, "Café")
    end)

    test.it("rolls back an atomic conflict and keeps unrelated items in independent mode", function()
        local h = catalog()
        local items: { types.ApplyItem } = {
            { product = { sku = "FIRST" }, create = { family = "standalone" },
                set = { { attr = "item.identifier", value = "Straße" } } },
            { product = { sku = "SECOND" }, create = { family = "standalone" },
                set = { { attr = "item.identifier", value = "STRASSE" } } },
            { product = { sku = "FIRST" }, create = { family = "standalone" } },
            { product = { sku = "THIRD" }, create = { family = "standalone" } },
        }
        local atomic = call(h, "apply", { items = items, mode = "atomic" }) :: types.ApplyResult
        test.is_false(atomic.applied)
        outcome(atomic.outcomes[2], "conflict")
        outcome(atomic.outcomes[3], "conflict")
        test.eq(steps.count(h, { family = "standalone" }), 0)
        local independent = call(h, "apply", { items = items, mode = "independent" }) :: types.ApplyResult
        test.is_true(independent.applied)
        outcome(independent.outcomes[1], "created")
        outcome(independent.outcomes[2], "conflict")
        outcome(independent.outcomes[3], "conflict")
        outcome(independent.outcomes[4], "created")
        test.eq(steps.count(h, { family = "standalone" }), 2)
        test.eq(query(h, "item.identifier", "eq", "strasse")[1].sku, "FIRST")
    end)
end

local function boundaries()
    test.it("checks numeric endpoints, precision, canonical units and conversion rounding", function()
        local h = catalog()
        outcome(create(h, "NUMBERS"), "created")
        local cases: { { attr: string, good: unknown, bad: unknown } } = {
            { attr = "item.rank", good = 9007199254740991, bad = 9007199254740992 },
            { attr = "item.rank", good = -9007199254740991, bad = -9007199254740992 },
            { attr = "item.fraction", good = { m = 999999999999999, e = 12 }, bad = { m = 1, e = 13 } },
            { attr = "item.fraction", good = "-0.000000000001", bad = "0.0000000000001" },
            { attr = "item.fraction", good = { m = 999999999999999, e = -12 }, bad = "999999999999999.1" },
            { attr = "item.weight", good = "10 kg", bad = "10.001 kg" },
            { attr = "item.weight", good = "-0.005 g", bad = "1 oz" },
            { attr = "item.price", good = { m = 922337203685477, e = 2 }, bad = { m = 922337203685478, e = 2 } },
        }
        for _, case in ipairs(cases) do
            outcome(steps.set(h, "NUMBERS", case.attr, case.good), "updated")
            local before = get(h, "NUMBERS")
            outcome(steps.set(h, "NUMBERS", case.attr, case.bad), "invalid")
            local after = get(h, "NUMBERS")
            test.eq(after.product.version, before.product.version)
            test.eq(json.encode(after.values[case.attr]), json.encode(before.values[case.attr]))
        end
        test.eq(query(h, "item.weight", "eq", "-0.01 g")[1].sku, "NUMBERS")
    end)

    test.it("keeps decimal strings exact when excess trailing zeros reduce into range", function()
        local h = catalog()
        outcome(create(h, "PRECISION"), "created")
        outcome(steps.set(h, "PRECISION", "item.fraction", "999999999999999000000000000"), "updated")
        local value = get(h, "PRECISION").values["item.fraction"].value
        test.eq(value.m, 999999999999999)
        test.eq(value.e, 12)
        outcome(steps.set(h, "PRECISION", "item.fraction", "0.000000000001000000000000000000000"), "updated")
        test.eq(get(h, "PRECISION").values["item.fraction"].value.e, -12)
    end)

    test.it("accepts extreme calendar dates and UTC instants across DST transitions", function()
        local h = catalog()
        outcome(create(h, "DATES"), "created")
        for _, date in ipairs({ "0001-01-01", "1582-10-04", "2000-02-29", "9999-12-31" }) do
            outcome(steps.set(h, "DATES", "item.introduced", date), "updated")
            test.eq(query(h, "item.introduced", "eq", date)[1].sku, "DATES")
        end
        for _, date in ipairs({ "1900-02-29", "9999-13-01", "2024-03-00" }) do
            outcome(steps.set(h, "DATES", "item.introduced", date), "invalid")
        end
        for _, instant in ipairs({ "0001-01-01T00:00:00Z", "2024-03-10T06:59:59Z", "2024-03-10T07:00:00Z",
            "2024-11-03T05:30:00Z", "2024-11-03T06:30:00Z", "9999-12-31T23:59:59Z" }) do
            outcome(steps.set(h, "DATES", "item.changed_at", instant), "updated")
            test.eq(query(h, "item.changed_at", "eq", instant)[1].sku, "DATES")
        end
        for _, invalid in ipairs({ "2024-03-10T02:30:00", "2024-11-03T01:30:00-04:00",
            "2024-11-03T01:30:00-05:00", "2024-11-03T06:30:00+00:00", "2024-11-03T06:30:00.Z" }) do
            outcome(steps.set(h, "DATES", "item.changed_at", invalid), "invalid")
        end
    end)

    test.it("indexes all admitted fractional second digits without collapsing neighboring instants", function()
        local h = catalog()
        local field = "item.changed_at"
        local earlier = "2024-11-03T05:30:00.1234567891Z"
        local later = "2024-11-03T05:30:00.1234567892Z"
        outcome(create(h, "EARLY", { { attr = field, value = earlier } }), "created")
        outcome(create(h, "LATE", { { attr = field, value = later } }), "created")
        local equal = query(h, field, "eq", earlier)
        test.eq(#equal, 1)
        test.eq(equal[1].sku, "EARLY")
        test.eq(query(h, field, "eq", "2024-11-03T05:30:00.12345678910Z")[1].sku, "EARLY")
        local after = query(h, field, "gt", earlier)
        test.eq(#after, 1)
        test.eq(after[1].sku, "LATE")
    end)

    test.it("enforces SKU, key, document and collection budgets on stored writes", function()
        local h = catalog()
        outcome(create(h, ""), "invalid")
        outcome(create(h, string.rep("é", 64)), "created")
        outcome(create(h, string.rep("é", 64) .. "x"), "invalid")
        outcome(create(h, "BUDGET"), "created")
        outcome(steps.set(h, "BUDGET", "item.identifier", string.rep("é", 128)), "updated")
        outcome(steps.set(h, "BUDGET", "item.identifier", string.rep("é", 128) .. "x"), "invalid")
        local many: { string } = {}
        for i = 1, 1000 do many[i] = "item" .. i end
        outcome(steps.set(h, "BUDGET", "item.annotations", many), "updated")
        many[1001] = "excess"
        outcome(steps.set(h, "BUDGET", "item.annotations", many), "invalid")
        test.eq(#(get(h, "BUDGET").values["item.annotations"].value :: { unknown }), 1000)
        local key = string.rep("x", 262144)
        outcome(steps.set(h, "BUDGET", "item.spare", key), "invalid")
        outcome(steps.set(h, "BUDGET", "item.spare", key:sub(1, 250000)), "updated")
        test.eq(#(get(h, "BUDGET").values["item.spare"].value :: string), 250000)
    end)

    test.it("accepts 500 items per apply, refuses 501 and pages terms across the boundary", function()
        local h = catalog()
        local items: { types.ApplyItem } = {}
        for i = 1, 501 do
            items[i] = { term = { vocabulary = "finishes", code = "oak" } }
        end
        refused(h, "apply", { items = items }, errors.INVALID)
        table.remove(items)
        local first = call(h, "apply", { items = items }) :: types.ApplyResult
        test.is_true(first.applied, json.encode(first.outcomes[1]))
        test.eq(#first.outcomes, 500)
        for _, result in ipairs(first.outcomes) do outcome(result, "unchanged") end
        for start = 1, 501, 100 do
            local terms: { types.ApplyItem } = {}
            for i = start, math.min(start + 99, 501) do
                terms[#terms + 1] = { term = { vocabulary = "finishes", code = string.format("batch-%03d", i) } }
            end
            test.is_true(call(h, "apply", { items = terms }).applied)
        end
        local after: string?
        local n = 0
        repeat
            local page = call(h, "list_terms", { vocabulary = "finishes", limit = 200, after = after }) :: types.ListTermsResult
            for _, term in ipairs(page.terms) do
                if term.code:match("^batch%-") then
                    n = n + 1
                    test.eq(term.code, string.format("batch-%03d", n))
                end
            end
            after = page.next
        until not after
        test.eq(n, 501)
    end)

    test.it("plans the exact field, dimension, member and index caps before allocating a generation", function()
        local h = catalog()
        local base = call(h, "get_schema", {}) :: types.SchemaView
        local total, indexed = 0, 0
        for _, attr in pairs(base.attributes) do
            total = total + 1
            indexed = indexed + #attr.index_contexts
        end
        local fields: { types.AttributeDecl } = {}
        for i = 1, 1000 - total do
            fields[i] = { code = "field_" .. i, type = TYPE .. "text",
                index = i <= 400 - indexed and "text" or nil }
        end
        local req = { declaration = { aspects = { { namespace = "limits", attributes = fields } } } }
        test.eq(call(h, "plan_schema", req).class, "additive")
        fields[401 - indexed].index = "text"
        refused(h, "plan_schema", req, errors.INVALID, "invalid_request")
        fields[401 - indexed].index = nil
        fields[#fields + 1] = { code = "one_more", type = TYPE .. "text" }
        refused(h, "plan_schema", req, errors.INVALID, "invalid_schema")
        local members: { string } = {}
        for i = 1, 64 do members[i] = "m" .. i end
        local dims = { { name = "region", members = members } }
        test.eq(call(h, "plan_schema", { declaration = { dimensions = dims } }).class, "additive")
        members[65] = "excess"
        refused(h, "plan_schema", { declaration = { dimensions = dims } }, errors.INVALID, "invalid_request")
        members[65] = nil
        dims[2] = { name = "extra", members = { "one" } }
        refused(h, "plan_schema", { declaration = { dimensions = dims } }, errors.INVALID, "invalid_request")
        test.eq(call(h, "get_schema", {}).schema_generation, 2)
    end)
end

local function hierarchy_and_references()
    test.it("changes an axis with live children, recomputes inherited indexes and protects parents", function()
        local h = catalog()
        tree(h)
        local leaf = get(h, LEAF, AT)
        test.eq(leaf.product.level, 2)
        test.eq(leaf.values["item.finish"].value.ref[2], "finishes:oak")
        test.eq(leaf.values["item.finish"].owner, get(h, BRANCH).product.product_id)
        test.eq(leaf.values["item.name"].value, "Wanderschuh")
        test.eq(leaf.values["item.name"].state, "inherited")
        test.eq(leaf.values["item.name"].ctx, "locale=de")
        test.is_nil(get(h, ROOT).values["item.size"])
        local report = call(h, "explain", { product = { sku = ROOT }, attr = "item.size" })
        test.eq(report.resolution.state, "not_applicable")
        outcome(steps.set(h, LEAF, "item.name", "Leaf override", { locale = "de-at" }), "invalid")
        outcome(steps.set(h, ROOT, "item.name", "Österreichischer Schuh", { locale = "de-at" }), "updated")
        test.eq(get(h, LEAF, AT).values["item.name"].value, "Österreichischer Schuh")
        outcome(edit(h, ROOT, { clear = { { attr = "item.name", ctx = { locale = "de-at" } } } }), "updated")
        test.eq(get(h, LEAF, AT).values["item.name"].state, "cleared")
        outcome(edit(h, ROOT, { unset = { { attr = "item.name", ctx = { locale = "de-at" } } } }), "updated")
        test.eq(get(h, LEAF, AT).values["item.name"].value, "Wanderschuh")
        outcome(steps.set(h, BRANCH, "item.finish", "ash"), "updated")
        test.eq(query(h, "item.finish", "eq", "ash")[1].sku, LEAF)
        test.eq(#query(h, "item.finish", "eq", "oak"), 0)
        test.eq(get(h, LEAF).product.product_id, leaf.product.product_id)
        outcome(edit(h, ROOT, { delete = true }), "invalid")
        outcome(edit(h, BRANCH, { delete = true }), "invalid")
        outcome(steps.one(h, { product = { sku = "DEEP" }, create = { parent = { sku = LEAF } } }), "invalid")
        outcome(steps.one(h, { product = { sku = "DUP" }, create = { parent = { sku = BRANCH } },
            set = { { attr = "item.size", value = 42 } } }), "conflict")
        outcome(edit(h, LEAF, { delete = true }), "updated")
        outcome(edit(h, BRANCH, { delete = true }), "updated")
        outcome(steps.one(h, { product = { id = leaf.product.product_id }, expect_version = "any", restore = true }), "invalid")
        outcome(edit(h, ROOT, { delete = true }), "updated")
    end)

    test.it("refuses missing, retired and cross-catalog references and term parent cycles", function()
        local h = catalog()
        local foreign = fixture.catalog({ bare = true })
        local other = assert(steps.one(foreign, { product = { sku = "SAME-SKU" }, create = {} }).product_id)
        outcome(create(h, "SAME-SKU"), "created")
        outcome(steps.set(h, "SAME-SKU", "item.related", ref("product", other)), "invalid", "invalid_reference")
        outcome(steps.set(h, "SAME-SKU", "item.category", "missing"), "invalid", "invalid_reference")
        outcome(steps.set(h, "SAME-SKU", "item.category", "old"), "invalid")
        outcome(steps.set(h, "SAME-SKU", "item.category", ref("term", "finishes:oak")), "invalid")
        outcome(steps.set(h, "SAME-SKU", "item.depot", ref("app.location", "schema-missing")), "invalid", "invalid_reference")
        outcome(steps.one(h, { term = { vocabulary = "categories", code = "goods" }, parent = "boots" }), "invalid")
        outcome(steps.one(h, { term = { vocabulary = "categories", code = "goods" }, retired = true }), "invalid")
        outcome(steps.one(h, { term = { vocabulary = "categories", code = "new" }, parent = "old" }), "invalid")
        local terms = call(h, "list_terms", { vocabulary = "categories", parent = "goods", retired = true }) :: types.ListTermsResult
        test.eq(#terms.terms, 2)
        test.eq(terms.terms[1].code, "boots")
        test.eq(terms.terms[2].code, "old")
        test.is_true(terms.terms[2].retired)
        local local_id = get(h, "SAME-SKU").product.product_id
        outcome(steps.set(h, "SAME-SKU", "item.related", ref("product", local_id)), "updated")
        outcome(edit(h, "SAME-SKU", { delete = true }), "updated")
        outcome(steps.one(h, { product = { id = local_id }, expect_version = "any", restore = true }), "updated")
        test.eq(get(h, "SAME-SKU").values["item.related"].value.ref[2], local_id)
        local peer = assert(create(h, "PEER", { { attr = "item.related", value = ref("product", local_id) } }).product_id)
        outcome(steps.set(h, "SAME-SKU", "item.related", ref("product", peer)), "updated")
        outcome(edit(h, "SAME-SKU", { delete = true }), "invalid")
        outcome(edit(h, "PEER", { delete = true }), "invalid")
        outcome(edit(h, "PEER", { unset = { { attr = "item.related" } } }), "updated")
        outcome(edit(h, "SAME-SKU", { delete = true }), "updated")
    end)

    test.it("resolves readable component targets and captures their release labels", function()
        local h = catalog()
        local other = fixture.catalog({ bare = true })
        local function package_at(id: string): unknown
            return { { details = { targets = { owner = ref("component", id) } } } }
        end
        outcome(create(h, "OWNER", { { attr = "item.category", value = "boots" } }), "created")
        outcome(steps.set(h, "OWNER", "item.packages", package_at(other.id)), "invalid", "invalid_reference")
        call(other, "grant", { subject_id = h.actor:id(), mask = 1 })
        outcome(steps.set(h, "OWNER", "item.packages", package_at(other.id)), "updated")
        local referenced = call(h, "list_links", { kind = "component", target = other.id }).items :: { types.LinkRow }
        test.eq(#referenced, 1)
        test.eq(referenced[1].sku, "OWNER")
        local released = release(h, "OWNER", { "web" })
        outcome(released, "released")
        test.eq(snapshot(h, released.release_id).snapshot.links["component:" .. other.id].label, "Fixture catalog")
    end)

    test.it("holds a root to its descendant cap and reuses a slot freed in the same apply", function()
        local h = catalog()
        tree(h)
        local function variant(size: integer): types.ApplyItem
            return { product = { sku = "CAP-" .. size }, create = { parent = { sku = BRANCH } },
                set = { { attr = "item.size", value = size } } }
        end
        for first = 100, 2097, 125 do
            local batch: { types.ApplyItem } = {}
            for size = first, math.min(first + 124, 2097) do batch[#batch + 1] = variant(size) end
            local result = call(h, "apply", { items = batch }) :: types.ApplyResult
            test.is_true(result.applied, json.encode(result.outcomes[1]))
            test.eq(result.outcomes[#batch].outcome, "created")
        end
        local req = { root = { sku = ROOT }, count = true, limit = 1 }
        test.eq(steps.query(h, req).total, 1999)
        outcome(steps.one(h, variant(2098)), "invalid")
        local made = call(h, "apply", { items = {
            { product = { sku = LEAF }, expect_version = get(h, LEAF).product.version, delete = true },
            variant(2098),
            variant(2099),
        }, mode = "independent" }) :: types.ApplyResult
        outcome(made.outcomes[1], "updated")
        outcome(made.outcomes[2], "created")
        outcome(made.outcomes[3], "invalid")
        test.eq(steps.query(h, req).total, 1999)
        test.eq(get(h, "CAP-2098").values["item.size"].value, 2098)
    end)

    test.it("refuses a fourth nested record and a third variant level in schema review", function()
        local h = catalog()
        local raw = call(h, "get_schema", {}) :: types.SchemaView
        local record = steps.copy(raw.attributes["item.packages"].config) :: types.AttributeConfig
        record.members.details.members.targets.members.extra = { form = "record", members = { title = { form = "text" } } }
        refused(h, "plan_schema", { declaration = { aspects = { { namespace = "item",
            attributes = { { code = "too_deep", type = TYPE .. "record", config = record } } } } } }, errors.INVALID)
        local family = steps.copy(raw.declaration.families[1]) :: types.FamilyDecl
        family.variation[3] = { axes = { "item.rank" } }
        refused(h, "plan_schema", { declaration = { families = { family } } }, errors.INVALID)
    end)

    test.it("accepts the deepest term chain and refuses another parent edge", function()
        local h = catalog()
        local items: { types.ApplyItem } = {}
        for i = 0, 64 do
            items[#items + 1] = { term = { vocabulary = "categories", code = "depth-" .. i },
                parent = i > 0 and "depth-" .. (i - 1) or nil }
        end
        test.is_true(call(h, "apply", { items = items }).applied)
        outcome(steps.one(h, { term = { vocabulary = "categories", code = "depth-65" }, parent = "depth-64" }), "invalid")
        local leaf = call(h, "list_terms", { vocabulary = "categories", parent = "depth-63" }) :: types.ListTermsResult
        test.eq(leaf.terms[1].code, "depth-64")
    end)
end

local function impact(plan: types.SchemaPlanResult, code: string, what: string, class: string)
    for _, change in ipairs(plan.changes) do
        if change.code == code and change.what == what then
            test.eq(change.class, class)
            return
        end
    end
    error("schema review omitted " .. code .. " " .. what .. ": " .. json.encode(plan.changes))
end

local function schema_apply(h: fixture.Handle, decl: unknown): types.SchemaResult
    local generation = call(h, "get_schema", {}).schema_generation
    local req = { declaration = decl, expected_generation = generation }
    local plan = call(h, "plan_schema", req) :: types.SchemaPlanResult
    local applied = call(h, "apply_schema", req) :: types.SchemaResult
    test.eq(applied.generation, generation + 1)
    test.eq(applied.class, plan.class)
    steps.rebuilt(h)
    return applied
end

local function schema_evolution()
    test.it("reviews used-field retyping, cardinality and scope changes before refusing each write", function()
        local h = catalog()
        tree(h)
        outcome(steps.set(h, ROOT, "item.spare", "authored"), "updated")
        local mutations: { { what: string, field: types.AttributeDecl } } = {
            { what = "form", field = { code = "spare", type = TYPE .. "integer" } },
            { what = "cardinality", field = { code = "spare", type = TYPE .. "text", cardinality = "list" } },
            { what = "scope", field = { code = "spare", type = TYPE .. "text", scope = { "locale" } } },
        }
        for _, case in ipairs(mutations) do
            local req = { expected_generation = 2, declaration = { aspects = { { namespace = "item", attributes = { case.field } } } } }
            local plan = call(h, "plan_schema", req) :: types.SchemaPlanResult
            test.eq(plan.class, "refused")
            impact(plan, "item.spare", case.what, "refused")
            test.is_true(#plan.refused > 0)
            local err = refused(h, "apply_schema", req, errors.INVALID, "migration_required")
            test.is_true(#err:details().changes > 0)
            test.eq(call(h, "get_schema", {}).schema_generation, 2)
            test.eq(get(h, LEAF).values["item.spare"].value, "authored")
        end
        local req = { declaration = { dimensions = {
            { name = "locale", members = { "en", "de" } },
        } }, expected_generation = 2 }
        local plan = call(h, "plan_schema", req) :: types.SchemaPlanResult
        test.eq(plan.class, "refused")
        test.is_true(#plan.refused > 0)
        refused(h, "apply_schema", req, errors.INVALID, "migration_required")
        test.eq(get(h, LEAF, AT).values["item.name"].value, "Wanderschuh")
    end)

    test.it("reports named impacts, preserves field identity on rename and recomputes readiness", function()
        local h = catalog()
        tree(h)
        outcome(steps.set(h, ROOT, "item.spare", "keep this value"), "updated")
        local schema = call(h, "get_schema", {}) :: types.SchemaView
        local id = schema.attributes["item.spare"].id
        local family = steps.copy(schema.declaration.families[1]) :: types.FamilyDecl
        test.eq(family.code, "model")
        local requirements = assert(family.requirements)
        requirements[1].require[#requirements[1].require + 1] = "item.certification"
        local decl = {
            aspects = { { namespace = "item", attributes = {
                { id = id, code = "notes", type = TYPE .. "text" },
                { code = "certification", type = TYPE .. "text" },
            } } },
            families = { family },
        }
        local req = { declaration = decl, expected_generation = 2 }
        local before = get(h, LEAF)
        test.eq(#assert(before.readiness).web_en, 0)
        local plan = call(h, "plan_schema", req) :: types.SchemaPlanResult
        test.eq(plan.class, "semantic")
        impact(plan, "item.notes", "renamed from item.spare", "cosmetic")
        impact(plan, "item.certification", "added", "additive")
        impact(plan, "family model", "requirements", "semantic")
        test.eq(call(h, "get_schema", {}).schema_generation, 2)
        test.eq(call(h, "apply_schema", req).generation, 3)
        steps.rebuilt(h)
        local after = call(h, "get_schema", {}) :: types.SchemaView
        test.eq(after.attributes["item.notes"].id, id)
        test.is_nil(after.attributes["item.spare"])
        test.eq(get(h, LEAF).values["item.notes"].value, "keep this value")
        local findings = assert(get(h, LEAF).readiness).web_en
        test.eq(#findings, 1)
        test.eq(findings[1].attribute, "item.certification")
        test.eq(#assert(get(h, LEAF).readiness).retail_de, 0)
        outcome(release(h, LEAF, { "web" }), "not_ready")
        outcome(steps.set(h, ROOT, "item.certification", "CE"), "updated")
        test.eq(#assert(get(h, LEAF).readiness).web_en, 0)
        local drop = { remove = { attributes = { "item.notes" } } }
        local removal = call(h, "plan_schema", { declaration = drop }) :: types.SchemaPlanResult
        impact(removal, "item.notes", "removed", "semantic")
        schema_apply(h, drop)
        test.is_nil(get(h, LEAF).values["item.notes"])
        test.eq(call(h, "get_schema", { generation = 2 }).attributes["item.spare"].id, id)
    end)

    test.it("keeps release snapshots immutable while term merge and channel removal update live derived state", function()
        local h = catalog()
        tree(h)
        local first = release(h, LEAF, { "web", "retail" })
        outcome(first, "released")
        local old = snapshot(h, first.release_id)
        test.eq(old.generation, 2)
        test.eq(old.snapshot.terms["categories:boots"].en, "Boots")
        outcome(steps.one(h, { term = { vocabulary = "categories", code = "boots" }, retired = true }), "invalid")
        outcome(steps.one(h, { term_merge = { vocabulary = "categories", from = "boots", into = "goods" } }), "updated")
        steps.rebuilt(h)
        test.eq(get(h, LEAF).values["item.category"].value.ref[2], "categories:goods")
        test.eq(query(h, "item.category", "eq", "goods")[1].sku, LEAF)
        test.eq(#query(h, "item.category", "eq", "boots"), 0)
        test.eq(#assert(get(h, LEAF).readiness).web_en, 0)
        local req = { declaration = { remove = { channels = { "retail" } } }, expected_generation = 2 }
        local plan = call(h, "plan_schema", req) :: types.SchemaPlanResult
        impact(plan, "channel retail", "removed", "semantic")
        test.eq(call(h, "apply_schema", req).generation, 3)
        steps.rebuilt(h)
        local second = release(h, LEAF, { "web" })
        outcome(second, "released")
        test.is_true(first.release_id ~= second.release_id)
        local current = snapshot(h, second.release_id)
        test.eq(current.generation, 3)
        test.eq(current.snapshot.terms["categories:goods"].en, "Goods")
        test.is_nil(current.snapshot.terms["categories:boots"])
        test.eq(json.encode(snapshot(h, first.release_id)), json.encode(old))
        local view = get(h, LEAF)
        local publication: Map = {}
        for _, state in ipairs(view.publications) do publication[state.channel] = state.state end
        test.eq(publication.web, "published")
        test.is_true(publication.retail ~= "published")
        local history = call(h, "list_publications", { channel = "retail", limit = 20 })
        test.eq(history.items[1].state, "withdrawn")
    end)

    test.it("recomputes inherited readiness after a term merge changes the checked value", function()
        local h = catalog()
        tree(h)
        local schema = call(h, "get_schema", {}) :: types.SchemaView
        local family = steps.copy(schema.declaration.families[1]) :: types.FamilyDecl
        family.checks = { { check = "app:full_schema_category_check", reads = { "item.category" },
            config = { blocked = "categories:boots" } } }
        schema_apply(h, { families = { family } })
        local blocked = assert(get(h, LEAF).readiness)
        test.eq(blocked.web_en[1].code, "blocked_category")
        test.eq(blocked.retail_de[1].code, "blocked_category")
        test.eq(steps.count(h, { family = "model", ready = { set = "web_en", value = true } }), 0)
        outcome(steps.one(h, { term_merge = { vocabulary = "categories", from = "boots", into = "goods" } }), "updated")
        steps.rebuilt(h)
        test.eq(#assert(get(h, LEAF).readiness).web_en, 0)
        test.eq(steps.count(h, { family = "model", ready = { set = "web_en", value = true } }), 1)
        outcome(release(h, LEAF, { "web" }), "released")
    end)

    test.it("refuses stale drafts and preserves the original keyed receipt across generations", function()
        local h = catalog()
        outcome(create(h, "STALE"), "created")
        local v = get(h, "STALE").product.version
        local original = { expected_generation = 2, idempotency = { namespace = "client", key = "prior" },
            items = { { product = { sku = "STALE" }, expect_version = v,
                set = { { attr = "item.rank", value = 7 } } } } }
        local receipt = call(h, "apply", original) :: types.ApplyResult
        outcome(receipt.outcomes[1], "updated")
        outcome(steps.one(h, { product = { sku = "STALE" }, expect_version = v,
            set = { { attr = "item.rank", value = 9 } } }), "conflict", "version_conflict")
        schema_apply(h, { vocabularies = { { code = "new_vocab" } } })
        local err = refused(h, "apply", { expected_generation = 2, mode = "independent", items = {
            { product = { sku = "STALE" }, expect_version = "any", set = { { attr = "item.rank", value = 9 } } },
        } }, errors.CONFLICT, "schema_generation_conflict")
        test.eq(err:details().expected_generation, 2)
        test.eq(err:details().generation, 3)
        local replay = call(h, "apply", original) :: types.ApplyResult
        test.eq(replay.seq, receipt.seq)
        test.is_true(replay.replayed)
        test.eq(get(h, "STALE").values["item.rank"].value, 7)
        test.eq(get(h, "STALE").product.version, v + 1)
    end)

    test.it("keeps concurrent writes when a schema apply replaces the physical index layout", function()
        local h = catalog()
        tree(h)
        local version = get(h, LEAF).product.version
        local schema, serr = h.async("apply_schema", { expected_generation = 2, declaration = { aspects = {
            { namespace = "item", attributes = { { code = "spare", type = TYPE .. "text", index = "key" } } },
        } } })
        assert(schema, tostring(serr))
        local write, werr = h.async("apply", { items = {
            { product = { sku = LEAF }, expect_version = version, set = { { attr = "item.size", value = 43 } } },
            { product = { sku = ROOT }, expect_version = "any", set = { { attr = "item.spare", value = "racing write" } } },
        } })
        assert(write, tostring(werr))
        for _, pending in ipairs({ schema, write }) do
            local deadline = time.after("30s")
            local ready = channel.select({ pending:response():case_receive(), deadline:case_receive() })
            assert(ready.channel ~= deadline, "concurrent command timed out")
        end
        local schema_reply, schema_err = schema:result()
        assert(schema_reply and not schema_err, tostring(schema_err))
        local write_reply, write_err = write:result()
        assert(write_reply and not write_err, tostring(write_err))
        test.eq(schema_reply:data().generation, 3)
        local applied = write_reply:data() :: types.ApplyResult
        test.is_true(applied.applied)
        outcome(applied.outcomes[1], "updated")
        outcome(applied.outcomes[2], "updated")
        steps.rebuilt(h)
        test.eq(query(h, "item.spare", "eq", "racing write")[1].sku, LEAF)
        test.eq(query(h, "item.size", "eq", 43)[1].sku, LEAF)
        test.eq(get(h, LEAF).product.version, version + 1)
    end)
end

local function replay_and_extensions()
    test.it("replays supplier and proposal decisions and round-trips a portable import exactly once", function()
        local h = catalog()
        tree(h)
        local request = { sink_op = "upsert", origin = "automation:full-schema", idempotency_key = "supplier-1", config = { source = "supplier" },
            input = { sku = LEAF, seq = 1, set = { { attr = "inventory.stock", value = 12 } } } }
        local first = call(h, "sink", request)
        test.is_true(first.success, json.encode(first))
        test.eq(first.result, "updated")
        test.eq(json.encode(call(h, "sink", request)), json.encode(first))
        test.eq(get(h, LEAF).values["inventory.stock"].source, "supplier")
        outcome(steps.set(h, LEAF, "inventory.stock", 7), "forbidden")
        local proposal = call(h, "propose", { origin = { type = "agent", id = "copy-editor" }, items = {
            { product = { sku = ROOT }, set = { { attr = "item.name", ctx = { locale = "en" }, value = "New product name" } } },
        } })
        local version = get(h, ROOT).product.version
        local decision = { proposal_id = proposal.proposal_id, decision = "accept" }
        local admitted = call(h, "decide", decision)
        test.eq(admitted.status, "accepted")
        test.eq(json.encode(call(h, "decide", decision)), json.encode(admitted))
        test.eq(get(h, ROOT).product.version, version + 1)
        test.eq(get(h, LEAF, EN).values["item.name"].value, "New product name")
        local exported, path = catalog_fixture.export(h.call)
        test.is_true(exported.success)
        local dst = fixture.catalog({ bare = true })
        local imported = catalog_fixture.import(dst.call, path)
        test.is_true(imported.success, json.encode(imported))
        local there = get(dst, LEAF, EN)
        local again = catalog_fixture.import(dst.call, path)
        test.is_true(again.success, json.encode(again))
        test.eq(get(dst, LEAF, EN).product.product_id, there.product.product_id)
        test.eq(get(dst, LEAF, EN).product.version, there.product.version)
        test.eq(there.values["inventory.stock"].value, 12)
        test.eq(there.values["inventory.stock"].source, "supplier")
        test.eq(there.values["item.name"].value, "New product name")
    end)

    test.it("serves a declared plugin projection and matches adopted scope rows", function()
        local h = catalog()
        call(h, "apply_schema", { declaration = { plugins = { { use = STATE_PLUGIN } } },
            plugin_configs = { [STATE_PLUGIN] = { marker = "full schema" } } })
        tree(h)
        local db = assert(sql.get("app:db"))
        assert(db:execute([[CREATE TABLE IF NOT EXISTS pim_test_stock
            (catalog_id TEXT NOT NULL, product_id TEXT NOT NULL, location_id TEXT NOT NULL, available INTEGER NOT NULL)]], {}))
        assert(db:execute("INSERT INTO pim_test_stock (catalog_id, product_id, location_id, available) VALUES ($1, $2, $3, $4)",
            { h.id, get(h, LEAF).product.product_id, "WAREHOUSE", 12 }))
        db:release()
        local matched = steps.query(h, { scopes = { { id = "app:stock_scope",
            where = { available = { gt = 10 }, location = { eq = "WAREHOUSE" } } } } })
        test.eq(#matched.items, 1)
        test.eq(matched.items[1].sku, LEAF)
        for _ = 1, 300 do
            local context = call(h, "plugin_context", { plugin = STATE_PLUGIN })
            assert(context.lifecycle.state ~= "failed", json.encode(context.lifecycle))
            if context.lifecycle.state == "ready" then
                test.eq(context.config.marker, "full schema")
                local feed = call(h, "plugin_feed", { plugin = STATE_PLUGIN, kind = "app:state_fold" })
                test.is_nil(feed.gap)
                test.is_true(feed.done)
                test.eq(feed.config.marker, "full schema")
                return
            end
            time.sleep("10ms")
        end
        error("state plugin did not become ready")
    end)
end

local PNG = assert(base64.decode("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jk9sAAAAASUVORK5CYII="))

local function send_media(session: scoped.Session, method: string, path: string, body: string?, content_type: string?)
    return assert(http_client.request(method, scoped.api_url() .. path, {
        body = body, headers = {Authorization = "Bearer " .. session.token, ["Content-Type"] = content_type},
    }))
end

local function upload(session: scoped.Session, filename: string, mime: string, bytes: string): string
    local boundary = "pim-media-" .. uuid.v4()
    local body = "--" .. boundary .. '\r\nContent-Disposition: form-data; name="file"; filename="' .. filename .. '"'
        .. "\r\nContent-Type: " .. mime .. "\r\n\r\n" .. bytes .. "\r\n--" .. boundary .. "--\r\n"
    local response = send_media(session, "POST", "/uploads", body, "multipart/form-data; boundary=" .. boundary)
    test.is_true(response.status_code >= 200 and response.status_code < 300, response.body)
    local id = (assert(json.decode(response.body)) :: {uuid: string}).uuid
    assert(id, response.body)
    for _ = 1, 200 do
        local complete = catalog_fixture.count_rows([[SELECT COUNT(*) AS n FROM kickside_uploads
            WHERE uuid=$1 AND storage_state='completed']], {id})
        if complete == 1 then return id end
        time.sleep("25ms")
    end
    error("upload did not complete " .. id)
end

local function attach(h: fixture.Handle, id: string): string
    local asset = call(h, "adopt_asset", {upload_id = id}).asset :: types.Ref
    test.eq(asset.ref[1], "asset")
    return asset.ref[2]
end

local function media_value(id: string): types.ValueEntry
    return {attr = "item.packages", value = {{title = "Pack", details = {targets = {image = ref("asset", id)}}}}}
end

local function upload_exists(id: string): boolean
    return catalog_fixture.count_rows("SELECT COUNT(*) AS n FROM kickside_uploads WHERE uuid=$1", {id}) == 1
end

local function stored_path(id: string): string
    local db = assert(sql.get("app:db"))
    local rows = assert(db:query("SELECT storage_path FROM kickside_uploads WHERE uuid=$1", {id}))
    db:release()
    return rows[1].storage_path
end

local function retention_until(catalog_id: string, done: () -> boolean)
    for _ = 1, 80 do
        -- Start each bounded owner pass at the catalog whose assets we are checking.
        local db = assert(sql.get("app:db"))
        local cursor_err = retention_rows.advance(db, {catalog_id = catalog_id, inclusive = 1, product_after = ""})
        db:release()
        assert(not cursor_err, tostring(cursor_err))
        local result, err = funcs.call("kickside.pim.retention:owner", {})
        assert(not err and result and result.success, tostring(err) .. " " .. json.encode(result))
        for _, blocked in ipairs(result.blocked or {}) do
            assert(blocked.component_id ~= catalog_id, tostring(blocked.error))
        end
        if done() then return end
        time.sleep("10ms")
    end
    error("media retention did not drain")
end

local function catalog_projection_inputs(): { {type: string, via: string} }
    for _, declaration in ipairs(assert(registry.get("kickside.pim.binding:catalog")).meta.projections) do
        if declaration.kind == "kickside.pim:catalog_model" then
            local inputs = {}
            for _, event in ipairs(declaration.events.input) do
                inputs[#inputs + 1] = {type = event.type, via = "thread"}
            end
            return inputs
        end
    end
    error("catalog projection declaration missing")
end

local function media_cases()
    test.it("adopts media through the catalog cursor while other cursors of the same kind are paused", function()
        local owner = scoped.member()
        local h = catalog(owner)
        local inputs = catalog_projection_inputs()
        for _, address in ipairs({
            {projection_key = "default", cursor_key = "sibling"},
            {projection_key = "archive", cursor_key = "default"},
        }) do
            call(h, "register_catalog_projection", {inputs = inputs, projection_key = address.projection_key, cursor_key = address.cursor_key})
            local paused = call(h, "pause_plugin_projection", {kind = "kickside.pim:catalog_model",
                projection_key = address.projection_key, cursor_key = address.cursor_key})
            test.eq(paused.status, "paused")
        end
        local source = upload(owner, "sibling.png", "image/png", PNG)
        local asset = attach(h, source)
        test.eq(send_media(owner, "GET", "/uploads/" .. asset .. "/raw").body, PNG)
        test.eq(catalog_fixture.count_rows([[SELECT COUNT(*) AS n FROM kickside_projection_cursor
            WHERE thread_id=$1 AND status='paused']], {h.id}), 2)
    end)

    test.it("requires the materialized reservation before copying a personal upload", function()
        local owner = scoped.member()
        local h = catalog(owner)
        local source = upload(owner, "reservation.png", "image/png", PNG)
        local current, previous = catalog_projection_inputs(), {}
        for _, input in ipairs(current) do
            if input.type ~= "kickside.pim.events:asset.reserved" and input.type ~= "kickside.pim.events:assets.reaping" then
                previous[#previous + 1] = input
            end
        end
        test.eq(#previous + 2, #current)
        call(h, "register_catalog_projection", {inputs = previous})
        refused(h, "adopt_asset", {upload_id = source}, errors.CONFLICT, "asset_reservation_unavailable")
        test.eq(catalog_fixture.count_rows("SELECT COUNT(*) AS n FROM kickside_pim_asset WHERE catalog_id=$1", {h.id}), 0)
        test.eq(catalog_fixture.count_rows("SELECT COUNT(*) AS n FROM kickside_uploads WHERE actor_id=$1",
            {"upload-component:" .. h.id}), 0)
        test.eq(send_media(owner, "GET", "/uploads/" .. source .. "/raw").body, PNG)

        call(h, "register_catalog_projection", {inputs = current})
        local asset = attach(h, source)
        test.eq(catalog_fixture.count_rows([[SELECT COUNT(*) AS n FROM kickside_pim_asset
            WHERE catalog_id=$1 AND asset_id=$2 AND adopting=0]], {h.id, asset}), 1)
        test.eq(send_media(owner, "GET", "/uploads/" .. asset .. "/raw").body, PNG)
    end)

    test.it("refuses a missing nested catalog asset as an invalid reference", function()
        local h = catalog()
        outcome(create(h, "MEDIA-MISSING", {media_value("missing")}), "invalid", "invalid_reference")
    end)

    test.it("reads catalog media as a reader, snapshots immutable bytes and collects replaced and deleted assets", function()
        local owner, reader = scoped.member(), scoped.member()
        local h = catalog(owner)
        local personal = upload(owner, "primary.png", "image/png", PNG)
        local first = attach(h, personal)
        local first_raw = "/uploads/" .. first .. "/raw"
        outcome(create(h, "MEDIA", {{attr = "item.category", value = "boots"}, media_value(first)}), "created")
        test.eq(send_media(reader, "GET", first_raw).status_code, 403)
        local grant = call(h, "grant", {subject_id = reader.id, mask = 1})
        test.is_true(grant.success, json.encode(grant))
        local live = assert(reader.call("get", {product = {sku = "MEDIA"}}, h.id)) :: types.GetResult
        local packs = (live.values["item.packages"].value :: unknown) :: {{details: {targets: {image: types.Ref}}}}
        test.eq(packs[1].details.targets.image.ref[2], first)
        local version_bytes = send_media(reader, "GET", first_raw)
        test.eq(version_bytes.status_code, 200, version_bytes.body)
        test.eq(version_bytes.body, PNG)
        test.eq(send_media(owner, "DELETE", "/uploads/" .. personal).status_code, 200)
        test.eq(send_media(reader, "GET", first_raw).body, PNG)

        local previous = release(h, "MEDIA", {"web"})
        outcome(previous, "released")
        local captured = snapshot(h, previous.release_id)
        local link = assert(assert(captured.snapshot.links)["asset:" .. first])
        test.eq(assert(link.data).checksum, hash.sha256(PNG))
        test.eq(assert(link.data).content_type, "image/png")
        test.eq(assert(link.data).size, #PNG)

        local replacement_bytes = PNG .. "replacement"
        local second = attach(h, upload(owner, "replacement.png", "image/png", replacement_bytes))
        test.is_true(first ~= second)
        outcome(edit(h, "MEDIA", {set = {media_value(second)}}), "updated")
        outcome(release(h, "MEDIA", {"web"}), "released")
        outcome(edit(h, "MEDIA", {unset = {{attr = "item.packages"}}}), "updated")
        local first_path = stored_path(first)
        local db = assert(sql.get("app:db"))
        assert(db:execute("UPDATE kickside_pim_release SET created_at='2000-01-01T00:00:00Z' WHERE catalog_id=$1 AND release_id=$2",
            {h.id, previous.release_id}))
        db:release()
        test.eq(snapshot(h, previous.release_id).hash, captured.hash)
        test.eq(send_media(reader, "GET", first_raw).body, PNG)
        retention_until(h.id, function() return not upload_exists(first) end)
        test.is_false(assert(fs.get("app:exports")):exists(first_path))
        local fence_id = "kickside.pim.events:assets.reaping"
        local schema = assert(registry.get(fence_id)).data.schema
        local fenced, reserved = false, false
        for _, event in ipairs(call(h, "events", {}).events) do
            if event.type == fence_id then
                local body = type(event.body) == "string" and assert(json.decode(event.body)) or event.body
                test.is_true(json.validate(schema, body))
                fenced = fenced or body.ids[1] == first
            elseif event.type == "kickside.pim.events:asset.reserved" then
                local body = type(event.body) == "string" and assert(json.decode(event.body)) or event.body
                local reservation_schema = assert(registry.get(event.type)).data.schema
                test.is_true(json.validate(reservation_schema, body))
                reserved = reserved or body.asset_id == first
            end
        end
        test.is_true(fenced)
        test.is_true(reserved)
        test.eq(send_media(reader, "GET", first_raw).status_code, 404)
        outcome(edit(h, "MEDIA", {set = {media_value(first)}}), "invalid", "invalid_reference")
        test.eq(send_media(reader, "GET", "/uploads/" .. second .. "/raw").body, replacement_bytes)

        local second_path = stored_path(second)
        test.is_true(call(h, "delete_component", {}).success)
        retention_until(h.id, function() return not upload_exists(second) end)
        test.is_false(assert(fs.get("app:exports")):exists(second_path))
    end)

    test.it("refuses cross-catalog, foreign, wrong-type, oversized and deleted upload references", function()
        local owner, other = scoped.member(), scoped.member()
        local h, foreign = catalog(owner), catalog(other)
        local source = upload(owner, "photo.png", "image/png", PNG)
        local asset = attach(h, source)
        outcome(create(foreign, "FOREIGN", {media_value(asset)}), "invalid", "invalid_reference")
        refused(foreign, "adopt_asset", {upload_id = source}, errors.PERMISSION_DENIED, "asset_adoption_denied")
        outcome(create(h, "PERSONAL", {media_value(source)}), "invalid", "invalid_reference")

        local text_asset = attach(h, upload(owner, "notes.txt", "text/plain", "shoe notes"))
        outcome(create(h, "WRONG-TYPE", {media_value(text_asset)}), "invalid", "asset_media_type")
        local large = attach(h, upload(owner, "large.png", "image/png", PNG .. string.rep("x", 128)))
        outcome(create(h, "TOO-LARGE", {media_value(large)}), "invalid", "asset_too_large")

        test.eq(send_media(owner, "DELETE", "/uploads/" .. source).status_code, 200)
        refused(h, "adopt_asset", {upload_id = source}, errors.NOT_FOUND, "upload_not_found")
    end)
end

local function define()
    test.describe("full schema contract", values_and_indexes)
    test.describe("full schema boundaries", boundaries)
    test.describe("full schema hierarchy and references", hierarchy_and_references)
    test.describe("full schema media", media_cases)
    test.describe("full schema evolution", schema_evolution)
    test.describe("full schema integrations", replay_and_extensions)
    test.describe("full schema agent tools", function()
        test.it("adopts a personal upload through the agent tool with catalog WRITE", function()
            local owner, member = scoped.member(), scoped.member()
            local h = catalog(owner)
            local source = upload(member, "agent-photo.png", "image/png", PNG)
            local tool_id = "kickside.pim.traits:adopt_asset"
            local meta = assert(registry.get(tool_id)).meta
            local input_schema = assert(json.decode(meta.input_schema))
            local request = {upload_id = source}
            test.is_true(json.validate(input_schema, request))
            test.is_false(json.validate(input_schema, {catalog_id = h.id}))
            test.is_false(json.validate(input_schema, {upload_id = "not-a-uuid"}))

            local executor = funcs.new():with_actor(member.actor):with_scope(member.scope):with_context({catalog_id = h.id})
            call(h, "grant", {subject_id = member.id, mask = 1})
            local denied, access_err = executor:call(tool_id, request)
            test.is_nil(denied)
            test.eq(assert(access_err):kind(), errors.PERMISSION_DENIED)

            call(h, "grant", {subject_id = member.id, mask = 3})
            local result, err = executor:call(tool_id, request)
            assert(result and not err, tostring(err))
            test.is_true(json.validate(assert(json.decode(meta.output_schema)), result))
            local asset = result.asset :: types.Ref
            test.eq(asset.ref[1], "asset")
            test.is_true(asset.ref[2] ~= source)
            local applied, apply_err = executor:call("kickside.pim.traits:apply", {items = {
                {product = {sku = "AGENT-MEDIA"}, create = {family = "standalone"}, set = {media_value(asset.ref[2])}},
            }})
            assert(applied and not apply_err, tostring(apply_err))
            outcome(applied.outcomes[1] :: types.Outcome, "created")

            local foreign = upload(owner, "foreign-photo.png", "image/png", PNG)
            local refused_asset, owner_err = executor:call(tool_id, {upload_id = foreign})
            test.is_nil(refused_asset)
            test.eq(assert(owner_err):kind(), errors.PERMISSION_DENIED)
            test.eq(assert(owner_err):details().code, "asset_adoption_denied")
        end)
    end)
end

return { run = test.run_cases(define) }
