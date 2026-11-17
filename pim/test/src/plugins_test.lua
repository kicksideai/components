-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Plugins per catalog: the registry declares a plugin, KickSide settings hold
-- its app-level values, and a catalog ADMIN chooses and configures it in the
-- catalog schema; get_schema reports what the plugin runs with.
local test = require("test")
local fixture = require("fixture")
local types = require("types")
local sql = require("sql")

local json = require("json")
local uuid = require("uuid")

local SHELF = "app:shelf_plugin"
local DYNAMIC = "app:dynamic_plugin"
local ZONES = "app:zones_plugin"
local SEAM_OWNER = "app:seam_owner_plugin"
local SEAM_CONTRIBUTOR = "app:seam_contributor_plugin"
local OWNED_TYPE = "app:contributed_text_type"

type Map = { [string]: unknown }

-- declare_fields writes the dynamic plugin's own field declarations for one catalog.
local function declare_fields(catalog_id: string, fields: { { string } })
    local db = assert(sql.get("app:db"))
    assert(db:execute("CREATE TABLE IF NOT EXISTS pim_test_plugin_fields (owner_id TEXT NOT NULL, code TEXT NOT NULL, type TEXT NOT NULL, idx TEXT NOT NULL)", {}))
    assert(db:execute("DELETE FROM pim_test_plugin_fields WHERE owner_id = $1", { catalog_id }))
    for _, f in ipairs(fields) do
        assert(db:execute("INSERT INTO pim_test_plugin_fields (owner_id, code, type, idx) VALUES ($1, $2, $3, $4)", { catalog_id, f[1], f[2], f[3] }))
    end
    db:release()
end

local function schema(h: fixture.Handle): types.SchemaView
    local out, err = h.call("get_schema", {})
    assert(not err, tostring(err))
    return out :: types.SchemaView
end

local function codes(changes: { types.SchemaChange }, what: string): { string }
    local out: { string } = {}
    for _, c in ipairs(changes) do if c.what == what then out[#out + 1] = c.code end end
    table.sort(out)
    return out
end

local function view(h: fixture.Handle): { [string]: types.PluginView }
    local schema, err = h.call("get_schema", {})
    assert(not err, tostring(err))
    local out: { [string]: types.PluginView } = {}
    for _, plugin in ipairs((schema :: types.SchemaView).plugins) do out[plugin.plugin] = plugin end
    return out
end

local function choice(h: fixture.Handle, id: string): types.PluginEntry?
    for _, entry in ipairs(schema(h).declaration.plugins or {}) do if entry.use == id then return entry end end
    return nil
end

local function define()
    test.describe("plugins per catalog", function()
        test.it("answers plugin lists with explicit activity and structured declaration problems", function()
            local h = fixture.catalog()
            local out = schema(h)
            test.is_true(#out.plugins > 0)
            local found = false
            for _, plugin in ipairs(out.plugins) do
                test.eq(type(plugin.plugin), "string")
                test.eq(type(plugin.active), "boolean")
                test.eq(type(plugin.installed), "boolean")
                test.not_nil(plugin.lifecycle)
                test.not_nil(plugin.projections)
                test.is_nil(plugin.chosen)
                test.is_nil(plugin.effective)
                if plugin.plugin == SHELF then found = true; test.is_false(plugin.active) end
                if plugin.problem then test.eq(type(plugin.problem.code), "string") end
            end
            test.is_true(found)
            local options = h.call("schema_options", {}) :: types.SchemaOptions
            for _, plugin in ipairs(options.plugins) do test.not_nil(plugin.config_schema); test.not_nil(plugin.plugin) end
        end)

        test.it("admits literal values that happen to equal an inactive seam id", function()
            local h = fixture.catalog()
            local _, err = h.call("apply_schema", {declaration={aspects={{namespace="literal",attributes={
                {code="value",type="kickside.pim.types:text",default="app:probe_type"}
            }}}}})
            test.is_nil(err,tostring(err))
        end)

        test.it("requires active dependencies before append and prevents removing a required plugin", function()
            local h = fixture.catalog()
            local _, missing = h.call("apply_schema", { declaration = { plugins = { { use = "app:probe_owned_plugin" } } } })
            test.not_nil(missing)
            test.eq(missing:details().code, "plugin_required")
            local _, err = h.call("apply_schema", { declaration = { plugins = { { use = "app:probe_owned_plugin" }, { use = "app:probe_bare_plugin" } } } })
            test.is_nil(err, tostring(err))
            local _, removed = h.call("apply_schema", { declaration = { remove = { plugins = { "app:probe_bare_plugin" } } } })
            test.eq(removed:details().code, "plugin_required")
        end)

        test.it("checks seam ownership for retained plugin-contributed fields", function()
            local h = fixture.catalog({ bare = true })
            local initial = assert(h.call("apply_schema", { declaration = { plugins = { { use = SEAM_OWNER }, { use = SEAM_CONTRIBUTOR } } } }))
            test.not_nil(schema(h).attributes["contributed.text"])
            local result, err = h.call("apply_schema", { declaration = { remove = { plugins = { SEAM_OWNER } } } })
            test.is_nil(result, "removed the seam owner at generation " .. tostring(result and result.generation))
            test.eq(err:details().code, "plugin_seam_in_use")
            test.eq(schema(h).schema_generation, initial.generation)
        end)

        test.it("checks seam ownership for fields newly resolved by a provider", function()
            local h = fixture.catalog({ bare = true })
            declare_fields(h.id, { { "text", OWNED_TYPE, "none" } })
            local result, err = h.call("plan_schema", { declaration = { plugins = { { use = DYNAMIC } } } })
            test.is_nil(result)
            test.eq(err:details().code, "plugin_seam_unowned")
        end)

        test.it("plans provider-backed activation with explicit config before applying the same change", function()
            local h = fixture.catalog({ bare = true })
            declare_fields(h.id, { { "text", "kickside.pim.types:text", "none" } })
            local declaration = { plugins = { { use = DYNAMIC } } }
            local before = schema(h).schema_generation
            local event_count = #fixture.events(h)
            local before_choice = assert(view(h)[DYNAMIC])
            test.is_false(before_choice.active)
            local invalid, err = h.call("plan_schema", { declaration = declaration,
                plugin_configs = { [DYNAMIC] = { namespace = "9bad" } } })
            test.is_nil(invalid)
            test.eq(err:details().code, "plugin_config_invalid")

            local request = { declaration = declaration, plugin_configs = { [DYNAMIC] = { namespace = "custom" } } }
            local plan = assert(h.call("plan_schema", request)) :: types.SchemaPlanResult
            test.eq(plan.generation, before + 1)
            test.eq(plan.class, "additive")
            test.eq(codes(plan.changes, "added")[1], "custom.text")
            test.eq(#fixture.events(h), event_count)
            test.eq(schema(h).schema_generation, before)
            test.is_nil(choice(h, DYNAMIC))
            test.is_false(assert(view(h)[DYNAMIC]).active)

            local applied = assert(h.call("apply_schema", request)) :: types.SchemaResult
            test.eq(applied.generation, plan.generation)
            test.eq(applied.class, plan.class)
            test.eq(json.encode(applied.changes), json.encode(plan.changes))
            test.not_nil(schema(h).attributes["custom.text"])
            test.is_nil(schema(h).attributes["dynamic.text"])
            test.eq(assert(assert(view(h)[DYNAMIC]).config).namespace, "custom")
        end)

        test.it("validates activation configuration before append and configures active plugins as ADMIN", function()
            local h = fixture.catalog()
            local before = schema(h).as_of
            local _, bad = h.call("apply_schema", { declaration = { plugins = { { use = SHELF } } }, plugin_configs = { [SHELF] = { location = "W" } } })
            test.eq(bad:kind(), errors.INVALID)
            test.eq(bad:details().code, "plugin_config_invalid")
            test.eq(schema(h).as_of, before)
            local applied, err = h.call("apply_schema", { declaration = { plugins = { { use = SHELF } } }, plugin_configs = { [SHELF] = { location = "WH7" } } })
            test.is_nil(err, tostring(err))
            local context, cerr = h.call("plugin_context", { plugin = SHELF })
            test.is_nil(cerr, tostring(cerr))
            test.eq((context :: Map).config.location, "WH7")
            test.not_nil((context :: Map).attachment_id)
            local generation = schema(h).schema_generation
            local changed, conferr = h.call("configure_plugin", { plugin = SHELF, config = { location = "WH9" } })
            test.is_nil(conferr, tostring(conferr))
            test.is_true((changed :: Map).seq > (applied :: Map).seq)
            test.eq(schema(h).schema_generation, generation)
            test.eq((h.call("plugin_context", { plugin = SHELF }) :: Map).config.location, "WH9")
            local reader, reader_id = fixture.user(h)
            h.call("grant", { subject_id = reader_id, mask = 1 })
            local _, denied = reader("configure_plugin", { plugin = SHELF, config = { location = "WH8" } })
            test.eq(denied:kind(), errors.PERMISSION_DENIED)
            local _, inactive = h.call("plugin_context", { plugin = ZONES })
            test.eq(inactive:kind(), errors.NOT_FOUND)
            test.eq(inactive:details().code, "plugin_inactive")
        end)

        test.it("reports installed plugins without activating them from deployment configuration", function()
            local h = fixture.catalog()
            local plugins = view(h)
            local shelf = assert(plugins[SHELF])
            test.is_false(shelf.active)
            test.is_nil(shelf.config)
            test.is_nil(choice(h, SHELF))
            test.is_nil(plugins["app:other_seam_plugin"])
        end)

        test.it("takes initial configuration over defaults and drops membership only on remove", function()
            local h = fixture.catalog()
            local applied, err = h.call("apply_schema", { declaration = { plugins = { { use = SHELF } } }, plugin_configs = { [SHELF] = { location = "WH7" } } })
            test.is_nil(err, tostring(err))
            test.eq((applied :: types.SchemaResult).class, "additive")
            local shelf = assert(view(h)[SHELF])
            test.is_true(shelf.active)
            test.eq(assert(shelf.config).location, "WH7")
            test.eq(assert(shelf.config).reorder_days, 14)
            local _, cerr = h.call("configure_plugin", { plugin = SHELF, config = { reorder_days = 3 } })
            test.is_nil(cerr, tostring(cerr))
            local replaced = assert(view(h)[SHELF])
            test.is_true(replaced.active)
            test.eq(assert(replaced.config).location, "WH0")
            test.eq(assert(replaced.config).reorder_days, 3)
            local _, rerr = h.call("apply_schema", { declaration = { remove = { plugins = { SHELF } } } })
            test.is_nil(rerr)
            test.is_false(assert(view(h)[SHELF]).active)
        end)

        test.it("adds a template plugin's fields to the catalog as its own indexed data", function()
            local h = fixture.catalog()
            fixture.boot(h)
            local applied, err = h.call("apply_schema", { declaration = {
                plugins = { { use = SHELF } },
                families = { { code = "footwear", aspects = { "core", "marketing", "logistics", "pricing", "shelf" },
                    variation = { { axes = { "core.color" }, own = { "core.materials" } }, { axes = { "core.size" }, own = { "core.gtin", "logistics.net_weight", "shelf.bin" } } },
                    requirements = { { id = "web", context = { locale = "all" }, require = { "core.name", "core.gtin" } },
                        { id = "marketplace_de", context = { locale = "de" }, require = { "core.gtin", "logistics.net_weight" }, authored = { "marketing.description" } } } } } } })
            test.is_nil(err)
            test.eq((applied :: types.SchemaResult).class, "additive")
            test.eq(codes((applied :: types.SchemaResult).changes, "added")[1], "shelf.bin")
            local view = schema(h)
            local bin = assert(view.attributes["shelf.bin"])
            test.eq(bin.plugin, SHELF)
            test.eq(bin.index, "key")
            local chosen = assert(choice(h, SHELF))
            local copy = assert(chosen.schema)
            test.is_true(#copy.digest >= 32)
            test.is_nil(copy.version)
            test.is_nil(view.declaration.aspects[#view.declaration.aspects].attributes[1].plugin)
            local set, serr = h.call("apply", { items = { { product = { sku = "RDG-moss-40" }, expect_version = "any", set = { { attr = "shelf.bin", value = "A-17" } } } } })
            test.is_nil(serr)
            test.eq((set :: types.ApplyResult).outcomes[1].outcome, "updated")
            local found = h.call("query", { where = { field = "shelf.bin", op = "eq", value = "A-17" } }) :: { items: { Map } }
            test.eq(#found.items, 1)
            test.eq(found.items[1].sku, "RDG-moss-40")
            local removed, rerr = h.call("apply_schema", { declaration = { remove = { plugins = { SHELF } },
                families = { { code = "footwear", aspects = { "core", "marketing", "logistics", "pricing" },
                    variation = { { axes = { "core.color" }, own = { "core.materials" } }, { axes = { "core.size" }, own = { "core.gtin", "logistics.net_weight" } } },
                    requirements = { { id = "web", context = { locale = "all" }, require = { "core.name", "core.gtin" } },
                        { id = "marketplace_de", context = { locale = "de" }, require = { "core.gtin", "logistics.net_weight" }, authored = { "marketing.description" } } } } } } })
            test.is_nil(rerr)
            test.eq((removed :: types.SchemaResult).class, "semantic")
            test.is_nil(schema(h).attributes["shelf.bin"])
        end)

        test.it("accepts the declaration get_schema answers as the catalog's own and refuses a foreign plugin copy", function()
            local h = fixture.catalog()
            fixture.boot(h)
            local _, err = h.call("apply_schema", { declaration = {
                plugins = { { use = SHELF } },
                families = { { code = "footwear", aspects = { "core", "marketing", "logistics", "pricing", "shelf" },
                    variation = { { axes = { "core.color" }, own = { "core.materials" } }, { axes = { "core.size" }, own = { "core.gtin", "logistics.net_weight", "shelf.bin" } } },
                    requirements = { { id = "web", context = { locale = "all" }, require = { "core.name", "core.gtin" } },
                        { id = "marketplace_de", context = { locale = "de" }, require = { "core.gtin", "logistics.net_weight" }, authored = { "marketing.description" } } } } } } })
            test.is_nil(err, tostring(err))
            local view = schema(h)
            local plan, perr = h.call("plan_schema", { declaration = view.declaration })
            test.is_nil(perr, tostring(perr))
            test.eq((plan :: types.SchemaPlanResult).class, "unchanged")
            local again, aerr = h.call("apply_schema", { declaration = view.declaration })
            test.is_nil(aerr, tostring(aerr))
            test.eq((again :: types.SchemaResult).class, "unchanged")
            local foreign = json.decode((assert(json.encode(view.declaration)))) :: types.Declaration
            ((foreign.plugins :: { types.PluginEntry })[1].schema :: types.PluginSchema).digest = "tampered"
            local _, ferr = h.call("apply_schema", { declaration = foreign })
            test.not_nil(ferr)
        end)

        test.it("resolves a provider plugin's fields from the plugin's own store and takes changes when named again", function()
            local h = fixture.catalog()
            declare_fields(h.id, { { "weight", "kickside.pim.types:number", "number" }, { "origin", "kickside.pim.types:text", "none" } })
            local first, err = h.call("apply_schema", { declaration = { plugins = { { use = DYNAMIC } } } })
            test.is_nil(err)
            test.eq(codes((first :: types.SchemaResult).changes, "added")[1], "dynamic.origin")
            test.eq(codes((first :: types.SchemaResult).changes, "added")[2], "dynamic.weight")
            local view = schema(h)
            test.eq(assert(view.attributes["dynamic.weight"]).plugin, DYNAMIC)
            test.eq(assert(view.attributes["dynamic.weight"]).index, "number")
            local copy = assert(assert(choice(h, DYNAMIC)).schema)
            test.eq(copy.version, "2")
            local same, serr = h.call("plan_schema", { declaration = { plugins = { { use = DYNAMIC } } } })
            test.is_nil(serr)
            test.eq((same :: types.SchemaPlanResult).class, "unchanged")

            declare_fields(h.id, { { "weight", "kickside.pim.types:number", "number" }, { "origin", "kickside.pim.types:text", "none" },
                { "hs_code", "kickside.pim.types:identifier", "key" } })
            test.eq((choice(h, DYNAMIC) :: types.PluginEntry).schema.version, "2")
            local plan, perr = h.call("plan_schema", { declaration = { plugins = { { use = DYNAMIC } } } })
            test.is_nil(perr)
            test.eq((plan :: types.SchemaPlanResult).class, "additive")
            test.eq(codes((plan :: types.SchemaPlanResult).changes, "added")[1], "dynamic.hs_code")
            local second = h.call("apply_schema", { declaration = { plugins = { { use = DYNAMIC } } } }) :: types.SchemaResult
            test.eq(second.class, "additive")
            local after = schema(h)
            test.eq(assert(after.attributes["dynamic.hs_code"]).index, "key")
            test.eq(assert(after.attributes["dynamic.weight"]).id, assert(view.attributes["dynamic.weight"]).id)
            test.eq((choice(h, DYNAMIC) :: types.PluginEntry).schema.version, "3")

            assert(h.call("configure_plugin", { plugin = DYNAMIC, config = { namespace = "custom" } }))
            local renamed = h.call("apply_schema", { declaration = { plugins = { { use = DYNAMIC } } } }) :: types.SchemaResult
            test.eq(renamed.class, "additive")
            local moved = schema(h)
            test.is_nil(moved.attributes["dynamic.weight"])
            test.eq(assert(moved.attributes["custom.weight"]).plugin, DYNAMIC)
        end)

        test.it("refuses a request that carries plugin schema or a plugin aspect the catalog already declares", function()
            local h = fixture.catalog()
            local _, carried = h.call("apply_schema", { declaration = { plugins = { { use = SHELF , schema = { fragment = { aspects = {} }, digest = "x" } } } } })
            test.not_nil(carried)
            local _, aerr = h.call("apply_schema", { declaration = { aspects = { { namespace = "shelf", attributes = { { code = "row", type = "kickside.pim.types:text" } } } } } })
            test.is_nil(aerr)
            local before = schema(h).schema_generation
            local _, collision = h.call("apply_schema", { declaration = { plugins = { { use = SHELF } } } })
            test.is_true(tostring(collision):find("shelf", 1, true) ~= nil, tostring(collision))
            test.eq(schema(h).schema_generation, before)
        end)

        test.it("keeps the catalog as it stands when a provider fails", function()
            local h = fixture.catalog()
            local before = schema(h).schema_generation
            local _, err = h.call("apply_schema", { declaration = { plugins = { { use = "app:offline_plugin" } } } })
            test.not_nil(err)
            test.eq(err:kind(), errors.UNAVAILABLE)
            test.eq(err:details().code, "field_store_unavailable")
            test.is_true(err:retryable())
            test.eq(schema(h).schema_generation, before)
            declare_fields(h.id, { { "weight", "kickside.pim.types:number", "number" } })
            h.call("apply_schema", { declaration = { plugins = { { use = DYNAMIC } } } })
            local kept = schema(h)
            test.not_nil(kept.attributes["dynamic.weight"])
            local _, cerr = h.call("apply_schema", { declaration = { plugins = { { use = DYNAMIC } } } , plugin_configs = { [DYNAMIC] = { namespace = "9bad" } } })
            test.not_nil(cerr)
            test.not_nil(schema(h).attributes["dynamic.weight"])
        end)

        test.it("resolves plugin fields for a catalog created with a declaration naming the plugin", function()
            local h = fixture.catalog({ bare = true })
            local declaration = json.decode(json.encode(fixture.DECLARATION)) :: Map
            declaration.plugins = { { use = SHELF } }
            local created, err = h.executor:call("app:pim_call", { op = "create",
                request = { idempotency_key = "with-plugin-" .. uuid.v4(), title = "Plugin catalog", declaration = declaration } })
            test.is_nil(err)
            local other: fixture.Handle = { id = (created :: Map).catalog_id :: string, actor = h.actor, executor = h.executor,
                call = function(op: string, request: unknown): (unknown, error?)
                    return h.executor:call("app:pim_call", { op = op, catalog_id = (created :: Map).catalog_id, request = request })
                end, async = h.async }
            test.eq((created :: Map).generation, 1)
            local view = schema(other)
            test.eq(assert(view.attributes["shelf.bin"]).plugin, SHELF)
            test.not_nil(assert(choice(other, SHELF)).schema)
        end)

        test.it("contributes a vocabulary with its attribute and refuses one the catalog already declares", function()
            local h = fixture.catalog()
            local applied, err = h.call("apply_schema", { declaration = { plugins = { { use = ZONES } } } })
            test.is_nil(err)
            test.eq((applied :: types.SchemaResult).class, "additive")
            local view = schema(h)
            test.not_nil(view.vocabularies.zones)
            test.eq(assert(view.attributes["placement.zone"]).vocabulary, "zones")
            local terms = h.call("apply", { items = { { term = { vocabulary = "zones", code = "north" }, labels = { en = "North" } } } }) :: types.ApplyResult
            test.eq(terms.outcomes[1].outcome, "created")
            local set = h.call("apply", { items = { { product = { sku = "PLC-1" }, create = {}, set = { { attr = "placement.zone", value = "north" } } } } }) :: types.ApplyResult
            test.eq(set.outcomes[1].outcome, "created", json.encode(set))
            local found = h.call("query", { where = { field = "placement.zone", op = "eq", value = "north" } }) :: { items: { Map } }
            test.eq(#found.items, 1)

            local other = fixture.catalog()
            test.is_nil((select(2, other.call("apply_schema", { declaration = { vocabularies = { { code = "zones" } } } }))))
            local _, collision = other.call("apply_schema", { declaration = { plugins = { { use = ZONES } } } })
            test.is_true(tostring(collision):find("vocabulary zones", 1, true) ~= nil, tostring(collision))
        end)

        test.it("refuses two plugins contributing one namespace, and dropping a plugin whose aspect a family lists", function()
            local h = fixture.catalog()
            fixture.boot(h)
            declare_fields(h.id, { { "row", "kickside.pim.types:text", "none" } })
            test.is_nil((select(2, h.call("apply_schema", { declaration = { plugins = { { use = SHELF } } } }))))
            local _, twice = h.call("apply_schema", { declaration = { plugins = { { use = DYNAMIC } } } , plugin_configs = { [DYNAMIC] = { namespace = "shelf" } } })
            test.is_true(tostring(twice):find("plugin " .. SHELF .. ": aspect shelf is declared by plugin " .. DYNAMIC, 1, true) ~= nil, tostring(twice))
            test.is_nil(schema(h).attributes["shelf.row"])
            test.is_nil((select(2, h.call("apply_schema", { declaration = {
                families = { { code = "footwear", aspects = { "core", "marketing", "logistics", "pricing", "shelf" },
                    variation = { { axes = { "core.color" }, own = { "core.materials" } }, { axes = { "core.size" }, own = { "core.gtin", "logistics.net_weight" } } },
                    requirements = { { id = "web", context = { locale = "all" }, require = { "core.name", "core.gtin" } },
                        { id = "marketplace_de", context = { locale = "de" }, require = { "core.gtin", "logistics.net_weight" }, authored = { "marketing.description" } } } } } } }))))
            local _, listed = h.call("apply_schema", { declaration = { remove = { plugins = { SHELF } } } })
            test.is_true(tostring(listed):find("unknown aspect shelf", 1, true) ~= nil, tostring(listed))
            test.not_nil(schema(h).attributes["shelf.bin"])
        end)

        test.it("refuses unknown plugins and config the manifest rejects", function()
            local h = fixture.catalog()
            for _, entry in ipairs({
                { ["app:nope"] = { enabled = true } },
                { ["app:other_seam_plugin"] = { enabled = true } },
                { [SHELF] = { config = { location = "W" } } },
                { [SHELF] = { config = { aisle = 4 } } },
                { [SHELF] = { enabled = "yes" } },
            } :: { { [string]: unknown } }) do
                local _, err = h.call("apply_schema", { declaration = { plugins = entry } })
                test.not_nil(err)
            end
            local _, missing = h.call("apply_schema", { declaration = { remove = { plugins = { SHELF } } } })
            test.not_nil(missing)
        end)

        test.it("keeps plugin choices in history and lets a reader see them", function()
            local h = fixture.catalog()
            h.call("apply_schema", { declaration = { plugins = { { use = SHELF } } } , plugin_configs = { [SHELF] = { location = "WH9" } } })
            local reader, reader_id = fixture.user(h)
            h.call("grant", { subject_id = reader_id, mask = 1 })
            local seen, err = reader("get_schema", {})
            test.is_nil(err)
            local shelf: types.PluginView? = nil
            for _, p in ipairs((seen :: types.SchemaView).plugins) do if p.plugin == SHELF then shelf = p end end
            test.eq(assert(assert(shelf).config).location, "WH9")
            local first = h.call("get_schema", { generation = 1 }) :: types.SchemaView
            test.is_nil(first.declaration.plugins)
        end)
    end)
end

return { run = test.run_cases(define) }
