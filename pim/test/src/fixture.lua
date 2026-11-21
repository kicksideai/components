-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Creates catalogs under a persisted harness actor and runs PIM operations as it.
local security = require("security")
local funcs = require("funcs")
local uuid = require("uuid")
local actors = require("actors")
local store = require("store")
local retention_rows = require("retention_rows")

local json = require("json")
local types = require("types")
local M = {}

M.DECLARATION = {
    dimensions = {
        { name = "channel", members = { "web", "marketplace" } },
        { name = "locale", members = { "en", "de", "de-AT" }, fallback = { ["de-AT"] = { "de" } } },
    },
    vocabularies = { { code = "colors" }, { code = "materials" }, { code = "categories", hierarchical = true } },
    aspects = {
        { namespace = "core", attributes = {
            { code = "name", type = "kickside.pim.types:text", scope = { "locale" }, index = "text",
              index_contexts = { { locale = "en" }, { locale = "de" } } },
            { code = "category", type = "kickside.pim.types:select", vocabulary = "categories", index = "key" },
            { code = "color", type = "kickside.pim.types:select", vocabulary = "colors", index = "key" },
            { code = "size", type = "kickside.pim.types:integer", index = "number" },
            { code = "gtin", type = "kickside.pim.types:identifier", unique = true, index = "key" },
            { code = "materials", type = "kickside.pim.types:select", vocabulary = "materials", cardinality = "set", index = "key" },
            { code = "care", type = "kickside.pim.types:text", default = "Clean with a damp cloth." },
            { code = "related", type = "kickside.pim.types:reference", cardinality = "set" },
        } },
        { namespace = "marketing", attributes = {
            { code = "description", type = "kickside.pim.types:rich_text", scope = { "locale" }, index = "text",
              index_contexts = { { locale = "en" } } },
            { code = "tagline", type = "kickside.pim.types:text", scope = { "channel", "locale" } },
        } },
        { namespace = "logistics", attributes = {
            { code = "net_weight", type = "kickside.pim.types:number", index = "number", config = { scale = 3 } },
        } },
        { namespace = "pricing", write = { sources = { "pricing" } }, attributes = {
            { code = "retail", type = "kickside.pim.types:number", index = "number", config = { scale = 2 } },
        } },
    },
    families = {
        { code = "footwear", aspects = { "core", "marketing", "logistics", "pricing" },
          variation = {
              { axes = { "core.color" }, own = { "core.materials" } },
              { axes = { "core.size" }, own = { "core.gtin", "logistics.net_weight" } },
          },
          requirements = {
              { id = "web", context = { locale = "all" }, require = { "core.name", "core.gtin" } },
              { id = "marketplace_de", context = { locale = "de" }, require = { "core.gtin", "logistics.net_weight" },
                authored = { "marketing.description" } },
          } },
    },
    channels = {
        { id = "web", requirements = { "web" } },
        { id = "marketplace", requirements = { "marketplace_de" } },
    },
    sources = {
        { id = "pricing", ordering = "sequence", writes = { "pricing" } },
        { id = "erp", ordering = "none", writes = { "core", "logistics" } },
    },
}

-- catalog(opts?) creates a catalog through the contract's create method as a
-- fresh actor; returns a handle whose call(op, request) runs as that actor.
type Call = (string, unknown) -> (unknown, error?)
-- executor is the funcs executor bound to the catalog's actor, for direct calls.
type Handle = { id: string, actor: security.Actor, executor: unknown, call: Call, async: Call }
M.Handle = Handle

-- seed_terms applies the reference vocabulary terms to a catalog.
function M.seed_terms(handle: Handle)
    local terms = {}
    for _, c in ipairs({ "moss", "slate", "clay", "sand" }) do terms[#terms + 1] = { term = { vocabulary = "colors", code = c }, labels = { en = c } } end
    for _, m in ipairs({ "nylon", "rubber", "leather" }) do terms[#terms + 1] = { term = { vocabulary = "materials", code = m }, labels = { en = m } } end
    terms[#terms + 1] = { term = { vocabulary = "categories", code = "footwear" }, labels = { en = "Footwear" } }
    terms[#terms + 1] = { term = { vocabulary = "categories", code = "hiking" }, parent = "footwear", labels = { en = "Hiking boots" } }
    local t, terr = handle.call("apply", { items = terms })
    assert(not terr, tostring(terr) .. " " .. require("json").encode(terr and terr:details() or {}))
    assert(t.applied == true, "terms applied")
end

function M.catalog(opts: { bare: boolean? }?): Handle
    local actor = actors.make(uuid.v4())
    local scope = assert(security.new_scope({ assert(security.policy("app:user")) }))
    local executor = funcs.new():with_actor(actor):with_scope(scope)
    local bare = opts and opts.bare == true
    local created, cerr = executor:call("app:pim_call", { op = "create",
        request = { idempotency_key = "fixture", title = "Fixture catalog", declaration = (not bare) and M.DECLARATION or nil } })
    assert(not cerr, tostring(cerr))
    local catalog_id: string = created.catalog_id
    local handle: Handle = {
        id = catalog_id, actor = actor, executor = executor,
        call = function(op: string, request: unknown): (unknown, error?)
            return executor:call("app:pim_call", { op = op, catalog_id = catalog_id, request = request })
        end,
        async = function(op: string, request: unknown): (unknown, error?)
            return executor:async("app:pim_call", { op = op, catalog_id = catalog_id, request = request })
        end,
    }
    if not bare then
        assert(created.generation == 1, "schema generation")
        M.seed_terms(handle)
    end
    return handle
end

-- user(h) returns a call function that runs operations on h's catalog as a new
-- actor, and that actor's id.
function M.user(h: Handle): (Call, string)
    local id = uuid.v4()
    local actor = actors.make(id)
    local scope = assert(security.new_scope({ assert(security.policy("app:user")) }))
    local executor = funcs.new():with_actor(actor):with_scope(scope)
    local call = function(op: string, request: unknown): (unknown, error?)
        return executor:call("app:pim_call", { op = op, catalog_id = h.id, request = request })
    end
    return call, id
end

-- boot(h) creates one model with two colors and three sizes each.
function M.boot(h: Handle): unknown
    local items = {
        { product = { sku = "RDG" }, create = { family = "footwear" }, set = {
            { attr = "core.name", ctx = { locale = "en" }, value = "Ridgeline hiking boot" },
            { attr = "core.name", ctx = { locale = "de" }, value = "Ridgeline Wanderstiefel" },
            { attr = "core.category", value = "hiking" },
            { attr = "marketing.description", ctx = { locale = "en" }, value = "Built for the long way home." },
        } },
    }
    for _, color in ipairs({ "moss", "slate" }) do
        items[#items + 1] = { product = { sku = "RDG-" .. color }, create = { parent = { sku = "RDG" } },
            set = { { attr = "core.color", value = color }, { attr = "core.materials", value = { "rubber", "nylon" } } } }
        for _, size in ipairs({ 40, 41, 42 }) do
            items[#items + 1] = { product = { sku = "RDG-" .. color .. "-" .. size }, create = { parent = { sku = "RDG-" .. color } },
                set = { { attr = "core.size", value = size },
                        { attr = "core.gtin", value = "0400" .. color .. size },
                        { attr = "logistics.net_weight", value = string.format("0.%d", 700 + size) } } }
        end
    end
    local out, err = h.call("apply", { items = items })
    assert(not err, tostring(err) .. " " .. require("json").encode(err and err:details() or {}))
    return out
end

-- retain drains the retention owner's bounded continuation protocol.
function M.retain(owner: string?): (unknown, error?)
    local db = assert(store.open())
    assert(not retention_rows.advance(db, { catalog_id = "", inclusive = 0, product_after = "" }))
    db:release()
    local deleted = 0
    local first_error: error? = nil
    local blocked={}
    local needs_continue = false
    for _ = 1, 1000 do
        local out, err = funcs.call(owner or "kickside.pim.retention:owner", {})
        if err then return nil, err end
        if out.error and not first_error then first_error = out.error end
        for _,item in ipairs(out.blocked or {}) do blocked[#blocked+1]=item end
        deleted = deleted + out.deleted
        needs_continue = needs_continue or out.needs_continue == true
        if out.sweep_complete then
            out.deleted, out.success, out.error, out.needs_continue = deleted, first_error == nil, first_error, needs_continue
            out.blocked=blocked
            return out, nil
        end
    end
    return nil, errors.new({ kind = errors.TIMEOUT, message = "retention sweep does not complete", details = { code = "retention_test_timeout" } })
end

-- events reads decoded event bodies through the catalog owner's thread contract.
function M.events(h: Handle): { types.RawEvent }
    local page, err = h.call("events", {})
    assert(not err and page, tostring(err))
    local events: { types.RawEvent } = page.events
    for _, event in ipairs(events) do
        if type(event.body) == "string" then
            local body, berr = json.decode(event.body :: string)
            assert(not berr, tostring(berr))
            event.body = body
        end
    end
    return events
end

function M.plugins(handle: Handle): { [string]: types.PluginView }
    local schema, err = handle.call("get_schema", {})
    assert(not err, tostring(err))
    local out: { [string]: types.PluginView } = {}
    for _, plugin in ipairs((schema :: types.SchemaView).plugins) do out[plugin.plugin] = plugin end
    return out
end

function M.plugin_entry(handle: Handle, id: string): types.PluginEntry?
    local schema = assert(handle.call("get_schema", {})) :: types.SchemaView
    for _, entry in ipairs(schema.declaration.plugins or {}) do if entry.use == id then return entry end end
    return nil
end

return M
