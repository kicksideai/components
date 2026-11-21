-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local fixture = require("fixture")
local scoped = require("scoped")
local agent_cases = require("agent_cases")
local registry = require("registry")
local sql = require("sql")
local time = require("time")
local channel = require("channel")
local prune = require("prune")
local fs = require("fs")

type Map = { [string]: unknown }
local PLUGIN = "app.compliance:plugin"
local CERT = "app.compliance:certificate"
local VALIDATOR = "app.compliance:validate"
local CHECK = "app.compliance:check"
local SCOPE = "app.compliance:approved"
local REPLICA = "app.compliance:replica"
local EVENTS = "app.compliance:events"
local PEER = "app:folding_plugin"
local KEY = "kickside.pim.plugin:" .. PLUGIN
local TOOL = "app.compliance:approved_items"
local UI = "app.compliance:catalog_ui"

local function execute(statement: string, params: { unknown }?)
    local db = assert(sql.get("app:db"))
    local _, err = db:execute(statement, params or {})
    db:release()
    assert(not err, tostring(err))
end

local function prepare_tables()
    execute([[CREATE TABLE IF NOT EXISTS pim_test_compliance_replica (
        catalog_id TEXT NOT NULL, product_id TEXT NOT NULL, attachment_id TEXT NOT NULL, region TEXT NOT NULL,
        PRIMARY KEY (catalog_id, product_id))]])
    execute([[CREATE INDEX IF NOT EXISTS pim_test_compliance_replica_attachment
        ON pim_test_compliance_replica (attachment_id, product_id)]])
    execute([[CREATE TABLE IF NOT EXISTS pim_test_compliance_events (
        catalog_id TEXT NOT NULL, seq BIGINT NOT NULL, attachment_id TEXT NOT NULL, event_type TEXT NOT NULL,
        PRIMARY KEY (catalog_id, seq))]])
    execute([[CREATE INDEX IF NOT EXISTS pim_test_compliance_events_attachment
        ON pim_test_compliance_events (attachment_id, seq)]])
end

local function count(catalog_id: string, events: boolean?): integer
    local statement = events and "SELECT COUNT(*) AS n FROM pim_test_compliance_events WHERE catalog_id=$1"
        or "SELECT COUNT(*) AS n FROM pim_test_compliance_replica WHERE catalog_id=$1"
    local db = assert(sql.get("app:db"))
    local rows, err = db:query(statement, { catalog_id })
    db:release()
    assert(not err, tostring(err))
    return math.tointeger(assert(rows)[1].n) :: integer
end

local function call(h: fixture.Handle, op: string, request: Map?): Map
    local out, err = h.call(op, request or {})
    assert(not err and out, tostring(err or op))
    return out :: Map
end

local function plugin(h: fixture.Handle): Map
    for _, entry in ipairs(call(h, "get_schema").plugins) do
        if entry.plugin == PLUGIN then return entry end
    end
    error("supplier compliance absent from catalog schema")
end

local function activate(h: fixture.Handle, mode: string?, enforced: boolean?, peer: boolean?): Map
    local members = { { use = PLUGIN } }
    if peer then members[#members + 1] = { use = PEER } end
    return call(h, "apply_schema", { declaration = {
        plugins = members,
        aspects = { { namespace = "base", attributes = {
            { code = "label", type = "kickside.pim.types:text", index = "text" },
            { code = "reviewer", type = "kickside.pim.types:identifier", index = "key" },
            { code = "reviewed_at", type = "kickside.pim.types:datetime", index = "key" },
        } } },
        families = { { code = "supplier_item", aspects = { "base", "compliance" },
            requirements = { { id = "web", require = { "base.label" } } },
            checks = { { check = CHECK, reads = { "compliance.certificate" }, config = { mode = mode }, enforce = enforced and "write" or nil } } } },
        scopes = { SCOPE },
        sources = { { id = "supplier_compliance", writes = { "compliance" } } },
        channels = { { id = "web", requirements = { "web" } } },
    } })
end

local function item(sku: string, value: string?): Map
    local sets = { { attr = "base.label", value = "Outdoor boots" } }
    if value then sets[#sets + 1] = { attr = "compliance.certificate", value = value } end
    return { product = { sku = sku }, create = { family = "supplier_item" }, set = sets }
end

local function put(h: fixture.Handle, sku: string, value: string?): Map
    return call(h, "apply", { items = { item(sku, value) } }).outcomes[1]
end

local function await(read: () -> unknown, description: string): Map
    for _ = 1, 250 do
        local value = read()
        if value then return value :: Map end
        time.sleep("20ms")
    end
    error(description)
end

local function ready(h: fixture.Handle, kind: string): Map
    return await(function()
        local state = plugin(h)
        assert(state.lifecycle.state ~= "failed", tostring(state.lifecycle.error and state.lifecycle.error.message))
        return state.lifecycle.state == "ready" and state.projections[kind]
    end, "projection was not registered: " .. kind)
end

local function settle(h: fixture.Handle, kind: string)
    ready(h, kind)
    local result = call(h, "settle", { kind = kind, projection_key = KEY, max_ticks = 40 })
    test.is_true(result.done)
end

local function changed(id: string, meta: Map?, data: Map?, run: () -> ())
    local original = assert(registry.get(id))
    local changes = assert(registry.snapshot()):changes()
    if meta or data then
        changes:update({ id = id, kind = original.kind, meta = meta or original.meta, data = data or original.data })
    else
        changes:delete(id)
    end
    assert(not select(2, changes:apply()))
    local ok, err = pcall(run)
    local restore = assert(registry.snapshot()):changes()
    local entry = { id = id, kind = original.kind, meta = original.meta, data = original.data }
    if meta or data then restore:update(entry) else restore:create(entry) end
    assert(not select(2, restore:apply()))
    assert(ok, tostring(err))
end

local function copy(value: Map): Map
    local out: Map = {}
    for key, member in pairs(value) do out[key] = member end
    return out
end

local function version(revision: integer, interface_version: integer?): Map
    local meta = copy(assert(registry.get(PLUGIN)).meta)
    local replica = copy(meta.projections[2])
    replica.revision = revision
    meta.projections = { meta.projections[1], replica }
    meta.interface_version = interface_version or 1
    return meta
end

local function define()
    test.describe("third-party supplier compliance", function()
        test.it("installs a pack and panel, activates the provider, and serves a typed, indexed field through its scope and tool", function()
            prepare_tables()
            local h = fixture.catalog({ bare = true })
            local inactive = fixture.catalog({ bare = true })
            local option = plugin(h)
            test.is_true(option.installed)
            test.is_false(option.active)
            test.eq(option.interface_version, 1)
            local created = assert(h.executor:call("app:pim_call", { op = "create", request = {
                idempotency_key = "compliance-pack", title = "Supplier catalog", pack = "app.compliance:pack",
            } }))
            local listed = assert(h.executor:call("app:pim_call", { op = "list", request = { ui_app = UI } }))
            test.eq(listed.catalogs[1].catalog_id, created.catalog_id)
            local app = assert(registry.get(UI))
            local panel = assert(registry.get("app.compliance:panel"))
            test.eq(panel.meta.tag_name, app.meta.component)
            test.eq(panel.meta.entry_point, "panel.js")
            local bundle = assert(assert(fs.get("app.compliance:files")):readfile("panel.js"))
            for _, slot in ipairs({ "panel_slot", "certificate_editor", "supplier_link", "region_column", "audit_action" }) do
                local meta = assert(registry.get("app.compliance:" .. slot)).meta
                test.eq(meta.plugin, PLUGIN)
                local tag = meta.tag or meta.picker
                local view = assert(registry.find({ ["meta.type"] = "view.component", ["meta.tag_name"] = tag }))
                test.eq(#view, 1)
                test.eq(view[1].meta.entry_point, "panel.js")
                test.not_nil(bundle:find(tag, 1, true))
            end
            activate(h)
            test.eq(plugin(h).config.region, "EU")
            local schema = call(h, "get_schema")
            test.eq(schema.attributes["compliance.certificate"].type, CERT)
            test.eq(schema.attributes["compliance.certificate"].plugin, PLUGIN)
            test.eq(schema.declaration.plugins[1].schema.version, "EU")
            test.eq(put(h, "BOOT", "eu-123").outcome, "created")
            test.eq(put(h, "BAD", "invalid").outcome, "invalid")
            local boot = call(h, "get", { product = { sku = "BOOT" } })
            test.eq(boot.values["compliance.certificate"].value, "EU-123")
            local delivered = call(h, "sink", { sink_op = "upsert", origin = "supplier:import",
                idempotency_key = "supplier-link", config = { source = "supplier_compliance" },
                input = { sku = "BOOT", set = {
                    { attr = "compliance.supplier", value = { ref = { "compliance.supplier", "northwind" } } },
                } },
            })
            test.is_true(delivered.success)
            test.eq(delivered.result, "updated")
            local review = call(h, "apply", { items = { { product = { sku = "BOOT" }, expect_version = "any", set = {
                { attr = "base.reviewer", value = h.actor:id() },
                { attr = "base.reviewed_at", value = "2000-01-01T00:00:00Z" },
            } } } }).outcomes[1]
            test.eq(review.outcome, "updated")
            local reviewed = call(h, "query", { where = { ["and"] = {
                { field = "base.reviewer", op = "eq", value = { ["$actor"] = "id" } },
                { field = "base.reviewed_at", op = "lt", value = { ["$now"] = "PT0S" } },
            } } })
            test.eq(reviewed.items[1].sku, "BOOT")
            local _, bad_operand = h.call("query", { where = { field = "base.reviewer", op = "eq", value = { ["$supplier"] = "id" } } })
            test.eq(bad_operand:kind(), errors.INVALID)
            local released = call(h, "release", { items = { { product = { sku = "BOOT" }, expect_version = review.version } } }).outcomes[1]
            test.eq(released.outcome, "released", require("json").encode(released))
            local snapshot = call(h, "get_release", { release_id = released.release_id }).release.snapshot
            test.eq(snapshot.links["compliance.supplier:northwind"].label, "Northwind Supplies")
            local links = call(h, "list_links", { kind = "compliance.supplier", target = "northwind" })
            test.eq(#links.items, 1)
            local hits = call(h, "query", { where = { field = "compliance.certificate", op = "eq", value = "EU-123" } })
            test.eq(hits.items[1].sku, "BOOT")
            settle(h, REPLICA)
            settle(h, EVENTS)
            test.is_true(count(h.id, true) > 0)
            local scoped = call(h, "query", { text = "boots", scopes = { { id = SCOPE, where = { region = { eq = "EU" } } } } })
            test.eq(scoped.items[1].sku, "BOOT")
            agent_cases.check(h, inactive, PLUGIN, { TOOL }, {})
            test.eq(assert(h.executor:call(TOOL, { catalog_id = h.id, region = "EU" })).items[1].sku, "BOOT")
            local _, denied = inactive.executor:call(TOOL, { catalog_id = inactive.id, region = "EU" })
            test.eq(denied:details().code, "plugin_inactive")
        end)

        test.it("finishes a state feed when the final catalog fact comes from an automation port", function()
            prepare_tables()
            local h = fixture.catalog({ bare = true })
            activate(h)
            local product = put(h, "APPROVED", "EU-207")
            settle(h, REPLICA)
            local port = assert(registry.get("app.compliance:approval_port"))
            test.eq(port.data.binding, "kickside.pim.binding:catalog")
            local event_type = port.data.event
            local request = { catalog_id = h.id, sku = "APPROVED" }
            assert(h.executor:call("app.compliance:approve", request))
            assert(h.executor:call("app.compliance:approve", request))
            test.is_true(call(h, "settle").done)
            local approvals = 0
            for _, event in ipairs(call(h, "events").events) do
                if event.type == event_type then
                    local body = type(event.body) == "string" and assert(require("json").decode(event.body)) or event.body
                    test.eq(body.product_id, product.product_id)
                    approvals = approvals + 1
                end
            end
            test.eq(approvals, 1)
            local page = call(h, "plugin_feed", { plugin = PLUGIN, kind = REPLICA })
            test.eq(#page.changes, 1)
            test.is_true(page.done, "a filtered catalog fact cannot hold the feed open")
        end)

        test.it("rejects a write-enforced broken check before committing the item", function()
            prepare_tables()
            local h = fixture.catalog({ bare = true })
            activate(h, "scalar", true)
            local before = call(h, "get_schema").as_of
            local outcome = put(h, "REJECTED", "EU-123")
            test.eq(outcome.outcome, "invalid")
            test.eq(outcome.findings[1].code, "check_unavailable")
            test.eq(call(h, "get_schema").as_of, before)
        end)

        test.it("keeps accepted values when a newer validator rejects them", function()
            prepare_tables()
            local h = fixture.catalog({ bare = true })
            activate(h)
            test.eq(put(h, "OLD", "EU-123").outcome, "created")
            local data = copy(assert(registry.get(VALIDATOR)).data)
            data.source = [[return { validate = function(input)
                local results = {}
                for i = 1, #input.values do
                    results[i] = { findings = { { code = "certificate_expired", message = "Certificate format retired" } } }
                end
                return { results = results }
            end }]]
            changed(VALIDATOR, nil, data, function()
                test.eq(put(h, "NEW", "EU-456").outcome, "invalid")
                local found = call(h, "get", { product = { sku = "OLD" } })
                test.eq(found.values["compliance.certificate"].value, "EU-123")
                test.eq(call(h, "apply", { items = { { product = { sku = "OLD" }, expect_version = "any",
                    set = { { attr = "base.label", value = "Updated boots" } } } } }).outcomes[1].outcome, "updated")
            end)
        end)

        test.it("parks a crashed state worker with no partial page and recovers through a fresh registration while a peer advances", function()
            prepare_tables()
            local h = fixture.catalog({ bare = true })
            activate(h, nil, nil, true)
            test.eq(put(h, "ORIGINAL", "EU-100").outcome, "created")
            settle(h, REPLICA)
            test.eq(count(h.id), 1)
            call(h, "configure_plugin", { plugin = PLUGIN, config = { region = "EU", crash = true } })
            test.eq(put(h, "SECOND", "EU-101").outcome, "created")
            local parked = await(function()
                local projection = plugin(h).projections[REPLICA]
                return projection and projection.parked and projection
            end, "state worker did not park")
            test.not_nil(parked.error)
            test.eq(count(h.id), 1)
            settle(h, EVENTS)
            local peer = call(h, "settle", { kind = "app:product_fold", projection_key = "kickside.pim.plugin:" .. PEER })
            test.is_true(peer.done)
            test.eq(#call(h, "query").items, 2)
            call(h, "configure_plugin", { plugin = PLUGIN, config = { region = "EU", crash = false } })
            settle(h, REPLICA)
            test.eq(count(h.id), 2)
        end)

        test.it("resets on both a projection revision upgrade and downgrade and refuses a future interface", function()
            prepare_tables()
            local h = fixture.catalog({ bare = true })
            activate(h)
            put(h, "VERSIONED", "EU-321")
            settle(h, REPLICA)
            local first = ready(h, REPLICA).last_seq
            changed(PLUGIN, version(2), nil, function()
                call(h, "plugin_sync")
                settle(h, REPLICA)
                test.is_true(ready(h, REPLICA).last_seq > first)
                test.eq(count(h.id), 1)
            end)
            call(h, "plugin_sync")
            local downgraded = await(function()
                local view = plugin(h)
                local state = view.projections[REPLICA]
                return state and state.last_seq > first + 1 and state
            end, "downgraded projection did not reset")
            test.is_false(downgraded.parked)
            changed(PLUGIN, version(1, 2), nil, function()
                local state = plugin(h)
                test.is_true(state.active)
                test.eq(state.problem.code, "plugin_interface_version_unsupported")
                test.eq(state.lifecycle.state, "failed")
                local _, refused = h.call("plugin_context", { plugin = PLUGIN })
                test.eq(refused:details().code, "plugin_interface_version_unsupported")
                test.eq(#call(h, "query").items, 1)
            end)
        end)

        test.it("preserves the current event cursor when its sibling registration is missing", function()
            prepare_tables()
            local h = fixture.catalog({ bare = true })
            activate(h)
            put(h, "PARTIAL", "EU-401")
            settle(h, EVENTS)
            settle(h, REPLICA)
            local before = ready(h, EVENTS).last_seq
            call(h, "remove_plugin_projection", { kind = REPLICA, projection_key = KEY })
            local view = plugin(h)
            test.eq(view.projections[EVENTS].last_seq, before)
            test.is_nil(view.projections[REPLICA])
        end)

        test.it("does not allow an unused scope ownership conflict to block unrelated catalogs", function()
            local first = fixture.catalog({ bare = true })
            local second = fixture.catalog({ bare = true })
            local namespace = "app.compliance:competing"
            local changes = assert(registry.snapshot()):changes()
            changes:create({ id = namespace, kind = "registry.entry",
                meta = { type = "kickside.pim.plugin", attachment = "app:empty_plugin_attachment", seams = { SCOPE } },
                data = {} })
            assert(not select(2, changes:apply()))
            local ok, err = pcall(function()
                local _, collision = first.call("apply_schema", { declaration = {
                    plugins = { { use = PLUGIN }, { use = namespace } }, scopes = { SCOPE },
                } })
                test.not_nil(collision)
                call(second, "apply_schema", { declaration = { aspects = {
                    { namespace = "independent", attributes = { { code = "title", type = "kickside.pim.types:text" } } },
                } } })
                test.eq(collision:details().code, "plugin_seam_conflict")
            end)
            local restore = assert(registry.snapshot()):changes()
            restore:delete(namespace)
            assert(not select(2, restore:apply()))
            assert(ok, tostring(err))
        end)

        test.it("applies unrelated catalog schema while an inactive plugin has an unreadable worker", function()
            local h = scoped.catalog(scoped.member())
            local manifest = version(1)
            manifest.projections[2].worker_ref = "func://app:scoped_plugin_worker"
            changed(PLUGIN, manifest, nil, function()
                local result = call(h, "apply_schema", { declaration = { aspects = { {
                    namespace = "independent",
                    attributes = { { code = "title", type = "kickside.pim.types:text" } },
                } } } })
                test.eq(result.class, "additive")
            end)
        end)

        test.it("paces state backfill over multiple pages and isolates a lagging catalog", function()
            prepare_tables()
            local h = fixture.catalog({ bare = true })
            activate(h)
            settle(h, REPLICA)
            call(h, "pause_plugin_projection", { kind = REPLICA, projection_key = KEY })
            local paused = ready(h, REPLICA)
            test.is_true(paused.parked)
            local last = paused.last_seq
            local items = {}
            for i = 1, 240 do items[i] = item(string.format("BULK-%03d", i), "EU-123") end
            local first = call(h, "apply", { items = items })
            test.is_true(first.applied)
            test.eq(#first.outcomes, 240)
            test.eq(ready(h, REPLICA).last_seq, last)
            test.eq(count(h.id), 0)
            local page = call(h, "plugin_feed", { plugin = PLUGIN, kind = REPLICA })
            test.eq(#page.changes, 200)
            test.is_false(page.done)
            local remainder = call(h, "plugin_feed", { plugin = PLUGIN, kind = REPLICA, token = page.token })
            test.eq(#remainder.changes, 40)
            test.is_true(remainder.done)
            local other = fixture.catalog({ bare = true })
            activate(other)
            put(other, "OTHER", "EU-505")
            settle(other, REPLICA)
            test.eq(count(other.id), 1)
            call(h, "resume_plugin_projection", { kind = REPLICA, projection_key = KEY })
            settle(h, REPLICA)
            test.eq(count(h.id), 240)
            local out = call(h, "query", { scopes = { { id = SCOPE, where = { region = { eq = "EU" } } } }, limit = 12 })
            test.eq(#out.items, 12)
            test.not_nil(out.after)
        end)

        test.it("keeps another nineteen projections unchanged when one catalog receives an event", function()
            prepare_tables()
            local catalogs = {}
            local positions = {}
            for i = 1, 20 do
                local h = fixture.catalog({ bare = true })
                activate(h)
                settle(h, REPLICA)
                positions[i] = ready(h, REPLICA).last_seq
                catalogs[i] = h
            end
            local target = catalogs[20]
            put(target, "ISOLATED", "EU-505")
            settle(target, REPLICA)
            test.is_true(ready(target, REPLICA).last_seq > positions[20])
            test.eq(count(target.id), 1)
            for i = 1, 19 do
                local h = catalogs[i]
                test.eq(ready(h, REPLICA).last_seq, positions[i])
                test.eq(count(h.id), 0)
            end
        end)

        test.it("orders two plugin fields consistently and refuses a competing field namespace", function()
            prepare_tables()
            local first = fixture.catalog({ bare = true })
            local second = fixture.catalog({ bare = true })
            local shelf = { use = "app:shelf_plugin" }
            local own = { use = PLUGIN }
            call(first, "apply_schema", { declaration = { plugins = { shelf, own } } })
            call(second, "apply_schema", { declaration = { plugins = { own, shelf } } })
            local a, b = call(first, "get_schema").attributes, call(second, "get_schema").attributes
            test.eq(a["compliance.certificate"].id, b["compliance.certificate"].id)
            test.eq(a["shelf.bin"].id, b["shelf.bin"].id)
            local _, collision = second.call("apply_schema", { declaration = { aspects = { {
                namespace = "compliance",
                attributes = { { code = "certificate", type = "kickside.pim.types:identifier" } },
            } } } })
            test.eq(collision:kind(), errors.INVALID)
            test.not_nil(tostring(collision):find("compliance", 1, true))
        end)

        test.it("requires an explicit reset after the registration start falls below retained facts", function()
            prepare_tables()
            local h = fixture.catalog({ bare = true })
            local activation = activate(h)
            put(h, "RETAINED", "EU-701")
            settle(h, EVENTS)
            settle(h, REPLICA)
            call(h, "remove_plugin_projection", { kind = REPLICA, projection_key = KEY })
            local db = assert(sql.get("app:db"))
            local cutoff = db:type() == "sqlite" and "2090-01-01 00:00:00" or "2090-01-01T00:00:00Z"
            local pruned, err = prune.prune_thread(db, h.id, { cutoff = cutoff })
            db:release()
            assert(pruned, tostring(err))
            test.is_true(pruned.max_pruned_seq >= activation.seq)
            call(h, "plugin_sync")
            local failed = await(function()
                local state = plugin(h).lifecycle
                return state.state == "failed" and state
            end, "an unavailable registration start was not reported")
            test.eq(failed.error.code, "plugin_projection_history_pruned")
            test.not_nil(plugin(h).projections[EVENTS])
            test.eq(count(h.id), 1)
            local reset = call(h, "configure_plugin", { plugin = PLUGIN, config = { region = "EU" }, reset = true })
            test.is_true(reset.seq > pruned.max_pruned_seq)
            settle(h, REPLICA)
            test.eq(count(h.id), 1)
        end)

        test.it("reconciles a failed active manifest after the package is restored", function()
            prepare_tables()
            local h = fixture.catalog({ bare = true })
            activate(h)
            settle(h, REPLICA)
            changed(PLUGIN, version(1, 2), nil, function()
                local result = assert(h.executor:call("kickside.pim.extensions:plugin_batch", { catalog_id = h.id }))
                test.is_true(result.done)
                test.eq(plugin(h).problem.code, "plugin_interface_version_unsupported")
            end)
            test.eq(plugin(h).lifecycle.state, "failed")
            local recovered = assert(h.executor:call("kickside.pim.extensions:plugin_batch", { catalog_id = h.id }))
            test.is_true(recovered.done)
            test.eq(plugin(h).lifecycle.state, "ready")
        end)

        test.it("does not run an upgraded registration against incompatible stored config", function()
            prepare_tables()
            local h = fixture.catalog({ bare = true })
            activate(h)
            put(h, "CONFIGURED", "EU-703")
            settle(h, REPLICA)
            local meta = version(2)
            local config = copy(meta.config_schema)
            config.required = { "region", "issuer" }
            config.properties = copy(config.properties)
            config.properties.issuer = { type = "string" }
            meta.config_schema = config
            changed(PLUGIN, meta, nil, function()
                local before = call(h, "get_schema").as_of
                local result = assert(h.executor:call("kickside.pim.extensions:plugin_batch", { catalog_id = h.id }))
                test.is_true(result.done)
                local failed = plugin(h)
                test.eq(failed.problem.code, "plugin_config_invalid")
                test.eq(call(h, "get_schema").as_of, before)
                local _, refused = h.call("configure_plugin", { plugin = PLUGIN, config = { region = "US" } })
                test.eq(refused:details().code, "plugin_config_invalid")
                call(h, "configure_plugin", { plugin = PLUGIN, config = { region = "US", issuer = "Northwind" } })
                settle(h, REPLICA)
                test.eq(plugin(h).config.issuer, "Northwind")
            end)
        end)

        test.it("refuses a projection revision without a positive integer representation", function()
            local h = fixture.catalog({ bare = true })
            for _, invalid_revision in ipairs({ false, 0, 0.5, 1e20 }) do
                local malformed = version(1)
                malformed.projections[2].revision = invalid_revision
                changed(PLUGIN, malformed, nil, function()
                    local found = plugin(h)
                    test.eq(found.problem and found.problem.code, "plugin_projection_invalid")
                    local _, err = h.call("apply_schema", { declaration = { plugins = { { use = PLUGIN } } } })
                    test.eq(err:details().code, "plugin_projection_invalid")
                end)
            end
        end)

        test.it("keeps stored data readable after uninstall and refuses to disable while adopted seams remain", function()
            prepare_tables()
            local h = fixture.catalog({ bare = true })
            activate(h)
            put(h, "PERSISTENT", "EU-801")
            call(h, "update", { ui_app = UI })
            settle(h, REPLICA)
            local _, in_use = h.call("apply_schema", { declaration = { remove = { plugins = { PLUGIN } } } })
            test.not_nil(in_use)
            local query = { where = { field = "compliance.certificate", op = "eq", value = "EU-801" },
                scopes = { { id = SCOPE, where = { region = { eq = "EU" } } } } }
            changed(PLUGIN, nil, nil, function()
                local state = plugin(h)
                test.is_false(state.installed)
                test.is_true(state.active)
                test.eq(state.problem.code, "unknown_plugin")
                test.eq(call(h, "get", { product = { sku = "PERSISTENT" } }).values["compliance.certificate"].value, "EU-801")
                test.eq(#call(h, "query", query).items, 1)
                changed(UI, nil, nil, function()
                    test.eq(call(h, "get_catalog").ui_app, UI)
                    call(h, "update", { ui_app = "" })
                    test.is_nil(call(h, "get_catalog").ui_app)
                end)
                changed(SCOPE, nil, nil, function()
                    local _, stale = h.call("query", query)
                    test.eq(stale:details().code, "unknown_scope")
                    call(h, "apply_schema", { declaration = {
                        families = { { code = "supplier_item", aspects = { "base" },
                            requirements = { { id = "web", require = { "base.label" } } } } },
                        remove = { plugins = { PLUGIN }, scopes = { SCOPE }, sources = { "supplier_compliance" } },
                    } })
                    local _, err = h.call("plugin_context", { plugin = PLUGIN })
                    test.eq(err:details().code, "plugin_inactive")
                end)
                await(function() return count(h.id) == 0 and {} end, "disabled attachment did not clean its replica")
            end)
            local _, stale = h.call("query", query)
            test.not_nil(stale)
        end)
        local failure_messages = {
            error = "supplier check failed",
            timeout = "supplier check exceeded its deadline",
            scalar = "returned no result",
            oversized = "returned oversized findings",
            slow = "exceeded the family check deadline",
            blocked = "exceeded the family check deadline",
        }
        for _, mode in ipairs({ "error", "timeout", "scalar", "oversized", "slow", "blocked" }) do
            test.it("records " .. mode .. " checks as unavailable without preventing an ordinary write", function()
                prepare_tables()
                local h = fixture.catalog({ bare = true })
                activate(h, mode)
                local pending = assert(h.async("apply", { items = { item("PROBE", "EU-123") } }))
                local timeout = time.after("1500ms")
                local result = channel.select({ pending:response():case_receive(), timeout:case_receive() })
                if result.channel == timeout then
                    pending:cancel()
                    error("a check exceeded its execution budget")
                end
                local reply = assert(pending:result()):data()
                test.eq(reply.outcomes[1].outcome, "created")
                local found = call(h, "get", { product = { sku = "PROBE" } })
                test.eq(found.readiness.web[1].code, "check_unavailable")
                test.eq(found.readiness.web[1].check, CHECK)
                test.not_nil(found.readiness.web[1].message:find(failure_messages[mode], 1, true))
            end)
        end

    end)
end

return { run = test.run_cases(define) }
