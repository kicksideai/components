-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local fixture = require("fixture")
local steps = require("steps")
local sql = require("sql")
local json = require("json")
local component = require("component")
local scoped = require("scoped")
local registry = require("registry")
local clock = require("clock")
local core_prune = require("core_prune")
type Map = { [string]: unknown }
local PLUGIN = "app:folding_plugin"

local function view(h: fixture.Handle): Map
    local out, err = h.call("get_schema", {})
    assert(not err, steps.detail(err))
    for _, p in ipairs(out.plugins or {}) do if p.plugin == PLUGIN then return p :: Map end end
    return {}
end
local function rows(h: fixture.Handle): { Map }
    local db = assert(sql.get("app:db"))
    local out, err = db:query("SELECT seq, event_type, actor_id, marker, deliveries FROM work_test_plugin_fold WHERE board_id = $1 ORDER BY seq", { h.id })
    db:release()
    assert(not err, steps.detail(err))
    return out :: { Map }
end
local function ready(h: fixture.Handle, parked: boolean): Map
    local captured: Map = {}
    steps.wait_for("plugin projection state", function(): boolean
        local plugin = view(h)
        local p = plugin.projections["app:item_fold"]
        if type(p) ~= "table" then return false end
        captured = p :: Map
        return plugin.lifecycle.state == "ready" and captured.parked == parked
            and (parked or (not captured.bootstrapping and captured.last_seq > 0))
    end)
    return captured
end
local function activate(h: fixture.Handle, active: boolean, config: Map?)
    local request: Map = { declaration = { plugins = active and { { use = PLUGIN } } or {} } }
    if config then request.plugin_configs = { [PLUGIN] = config } end
    local _, err = h.call("apply_schema", request)
    assert(not err, steps.detail(err))
end
local function attachments(h: fixture.Handle): { Map }
    local found, err = component.list_system({ impl_ids = { "app:fold_attachment" }, meta = { owner = h.id }, include = { meta = true, private_context = true }, limit = 2 })
    assert(not err, steps.detail(err))
    return (found or {}) :: { Map }
end
local function projection(h: fixture.Handle, kind: string): (string, Map)
    for _, p in ipairs(assert(h.call("plugin_projections", {})).projections) do
        if p.kind == kind then return p.id, assert(json.decode(p.body)) :: Map end
    end
    error("projection is missing: " .. kind)
end

local function plugin_view(h: fixture.Handle, id: string, method: string): Map
    for _, entry in ipairs(assert(h.call(method, {})).plugins) do
        if entry.plugin == id then return entry :: Map end
    end
    error("plugin is missing: " .. id)
end

local function define()
    test.describe("declared plugin projections", function()
        local original: registry.Entry?
        test.after_each(function()
            if original then
                local changes = assert(registry.snapshot()):changes()
                if registry.get(original.id) then changes:update(original) else changes:create(original) end
                assert(changes:apply())
                original = nil
            end
        end)

        local function revise(id: string, update: (Map) -> ())
            original = assert(registry.get(id))
            local revised = assert(registry.get(id))
            update(revised.meta :: Map)
            local changes = assert(registry.snapshot()):changes()
            changes:update(revised)
            assert(changes:apply())
        end

        test.it("reports the current interface for implicit and explicit plugin manifests", function()
            local h = fixture.board()
            local plugin = "app:event_projection_plugin"
            revise(plugin, function(meta) meta.interface_version = 1 end)
            test.eq(plugin_view(h, PLUGIN, "schema_options").interface_version, 1)
            test.eq(plugin_view(h, plugin, "schema_options").interface_version, 1)
            assert(h.call("apply_schema", { declaration = { plugins = { { use = plugin } } } }))
            test.eq(plugin_view(h, plugin, "get_schema").interface_version, 1)
        end)

        test.it("refuses an unknown manifest interface before loading its declarations", function()
            local h = fixture.board()
            local plugin = "app:event_projection_plugin"
            revise(plugin, function(meta) meta.interface_version = 2; meta.attachment = "app:missing_attachment" end)
            local result, err = h.call("apply_schema", { declaration = { plugins = { { use = plugin } } } })
            test.is_nil(result)
            test.eq(assert(err):kind(), errors.INVALID)
            test.eq(assert(err):details().code, "plugin_interface_version_unsupported")
            test.eq(plugin_view(h, plugin, "schema_options").problem.code, "plugin_interface_version_unsupported")
        end)

        test.it("replays each selected retained patch with its producing schema generation", function()
            local h = fixture.board()
            local plugin, kind = "app:event_projection_plugin", "app:event_fold"
            local item = steps.create(h, "task", { title = "before replay" })
            local first_generation = assert(h.call("get_schema", {})).generation
            steps.one(h, { op = "set", item = item, values = { title = "outside replay window" } })
            steps.one(h, { op = "set", item = item, values = { title = "first retained edit" } })
            local first_seq = assert(steps.get(h, item)).item.updated_seq
            assert(h.call("apply_schema", { declaration = { key_prefix = fixture.fresh_prefix() } }))
            local second_generation = assert(h.call("get_schema", {})).generation
            test.eq(second_generation, first_generation + 1)
            steps.one(h, { op = "set", item = item, values = { title = "second retained edit" } })
            local second_seq = assert(steps.get(h, item)).item.updated_seq
            revise(plugin, function(meta)
                meta.projections[1].start_seq = first_seq
                meta.projections[1].events = { "kickside.work.events:item.changed" }
            end)
            local applied = assert(h.call("apply_schema", { declaration = { plugins = { { use = plugin } } } }))
            steps.wait_for("event projection catches up", function(): boolean
                return plugin_view(h, plugin, "get_schema").projections[kind].last_seq >= applied.seq
            end)
            local id, body = projection(h, kind)
            local patches = body.patches or {}
            test.eq(#patches, 2)
            test.eq(patches[1].seq, first_seq)
            test.eq(patches[1].schema_generation, first_generation)
            test.eq(patches[2].seq, second_seq)
            test.eq(patches[2].schema_generation, second_generation)
            test.eq(plugin_view(h, plugin, "get_schema").projections[kind].start_seq, first_seq)
            assert(h.call("plugin_sync", {}))
            steps.wait_for("unchanged event registration converges", function(): boolean
                return plugin_view(h, plugin, "get_schema").lifecycle.state == "ready"
            end)
            local after_id, after = projection(h, kind)
            test.eq(after_id, id)
            test.eq(#after.patches, 2)
        end)

        test.it("records a typed gap when the requested start has been pruned", function()
            local h = fixture.board()
            local plugin, kind = "app:event_projection_plugin", "app:event_fold"
            local item = steps.create(h, "task")
            local item_seq = assert(steps.get(h, item)).item.updated_seq :: integer
            local db = assert(sql.get("app:db"))
            local boundary = assert(core_prune.prune_thread(db, h.id, { cutoff = clock.offset(86400) }))
            db:release()
            local pruned = boundary.max_pruned_seq
            test.is_true(pruned >= item_seq)
            revise(plugin, function(meta) meta.projections[1].start_seq = pruned end)
            assert(h.call("apply_schema", { declaration = { plugins = { { use = plugin } } } }))
            steps.wait_for("event projection registration settles", function(): boolean
                return plugin_view(h, plugin, "get_schema").lifecycle.state ~= "pending"
            end)
            local failed = plugin_view(h, plugin, "get_schema").lifecycle
            test.eq(failed.state, "failed")
            test.eq(failed.error.kind, errors.CONFLICT)
            test.eq(failed.error.code, "plugin_projection_gap")
            test.eq(failed.error.floor, pruned + 1)
            for _, p in ipairs(assert(h.call("plugin_projections", {})).projections) do test.is_true(p.kind ~= kind) end

            local revised = assert(registry.get(plugin))
            revised.meta.projections[1].start_seq = pruned + 1
            local changes = assert(registry.snapshot()):changes()
            changes:update(revised)
            assert(changes:apply())
            assert(h.call("plugin_sync", {}))
            steps.wait_for("the first retained sequence is accepted", function(): boolean
                return plugin_view(h, plugin, "get_schema").lifecycle.state == "ready"
            end)
            test.eq(plugin_view(h, plugin, "get_schema").projections[kind].start_seq, pruned + 1)
        end)

        test.it("detaches an unused plugin after its manifest disappears", function()
            local h = fixture.board()
            activate(h, true)
            ready(h, false)
            local attachment = view(h).attachment_id :: string
            original = assert(registry.get(PLUGIN))
            local changes = assert(registry.snapshot()):changes()
            changes:delete(PLUGIN)
            assert(changes:apply())

            local result, err = h.call("apply_schema", { declaration = { plugins = {} } })
            assert(result, steps.detail(err))
            local lifecycle: Map? = nil
            steps.wait_for("plugin deactivation lifecycle", function()
                local db = assert(sql.get("app:db"))
                local rows = assert(db:query([[SELECT lifecycle FROM kickside_work_plugin
                    WHERE board_id = $1 AND plugin = $2]], { h.id, PLUGIN }))
                db:release()
                if #rows == 0 then
                    lifecycle = nil
                    return true
                end
                local state = assert(json.decode(rows[1].lifecycle)) :: Map
                lifecycle = state
                return state.state == "failed"
            end)
            test.is_nil(lifecycle, json.encode(lifecycle))
            steps.deleted(attachment)
            for _, projection in ipairs(assert(h.call("plugin_projections", {})).projections) do
                test.is_true(projection.projection_key ~= "kickside.work.plugin:" .. PLUGIN)
            end
        end)

        test.it("detaches an active plugin after a valid manifest revision requires new config", function()
            local h = fixture.board()
            activate(h, true)
            ready(h, false)
            local attachment = view(h).attachment_id :: string
            local found = assert(component.list_system({ component_ids = { attachment }, limit = 1 }))
            test.eq(#found, 1)

            original = assert(registry.get(PLUGIN))
            local revised = assert(registry.get(PLUGIN))
            local config_schema = revised.meta.config_schema :: Map
            config_schema.required = { "marker" }
            local changes = assert(registry.snapshot()):changes()
            changes:update(revised)
            assert(changes:apply())
            local active = view(h)
            test.eq((active.lifecycle :: Map).error.code, "plugin_config_invalid")

            local result, err = h.call("apply_schema", { declaration = { plugins = {} } })
            assert(result, steps.detail(err))
            steps.wait_for("plugin deactivation lifecycle", function()
                local entry = view(h)
                return entry.active == false and (entry.lifecycle :: Map).state ~= "pending"
            end)
            local inactive = view(h)
            test.eq((inactive.lifecycle :: Map).state, "ready", json.encode(inactive.lifecycle))
            steps.deleted(attachment)
            for _, projection in ipairs(assert(h.call("plugin_projections", {})).projections) do
                test.is_true(projection.projection_key ~= "kickside.work.plugin:" .. PLUGIN)
            end
        end)
        test.it("refreshes state projection snapshots after the board key prefix changes", function()
            local h = fixture.board()
            local id = steps.create(h, "task")
            activate(h, true)
            ready(h, false)
            local request: Map = { plugin = PLUGIN, kind = "app:item_fold" }
            local first = assert(h.call("plugin_feed", request))
            test.eq(#first.changes, 1)
            test.eq(first.changes[1].key, h.prefix .. "-1")
            test.is_true(first.done)
            request.token = first.token

            local prefix = fixture.fresh_prefix()
            assert(h.call("apply_schema", { declaration = { key_prefix = prefix } }))
            test.eq(assert(steps.get(h, id)).item.key, prefix .. "-1")
            local page = assert(h.call("plugin_feed", request))
            test.eq(#page.changes, 1, "state feed advanced without updating the item's key")
            test.eq(page.changes[1].key, prefix .. "-1")
        end)

        test.it("registers state projections without raw board events and converges existing cursors", function()
            local h = fixture.board()
            activate(h, true)
            local item = steps.create(h, "task", { title = "before convergence" })
            ready(h, false)
            local configured = assert(h.call("configure_plugin", { plugin = PLUGIN, config = {} }))
            steps.wait_for("unchanged configuration reaches the state cursor", function(): boolean
                return view(h).projections["app:item_fold"].last_seq >= configured.seq
            end)
            local before = ready(h, false)
            local id, body = projection(h, "app:item_fold")
            test.is_true(body.worker_config.start_seq < configured.seq)
            test.eq(body.meta.worker_input_mode, "cursor_only")
            test.eq(body.observed_mode, "cursor_only")
            test.is_false(body.received_events)

            body.meta.worker_input_mode = "prefetch_events"
            local db = assert(sql.get("app:db"))
            assert(db:execute("UPDATE kickside_projection SET body=$1 WHERE id=$2", { assert(json.encode(body)), id }))
            db:release()
            assert(h.call("plugin_sync", {}))
            steps.wait_for("state registration converges", function(): boolean
                local _, converged = projection(h, "app:item_fold")
                return converged.meta.worker_input_mode == "cursor_only"
            end)
            local after_id, after_body = projection(h, "app:item_fold")
            test.eq(after_id, id)
            test.eq(after_body.meta.worker_input_mode, "cursor_only")
            test.eq(after_body.worker_config.start_seq, body.worker_config.start_seq)
            test.eq(after_body.token, body.token)
            test.eq(view(h).projections["app:item_fold"].last_seq, before.last_seq)

            steps.one(h, { op = "set", item = item, values = { title = "after convergence" } })
            steps.wait_for("converged state worker follows changes", function(): boolean return #rows(h) == 2 end)
            steps.wait_for("converged state cursor", function(): boolean return view(h).projections["app:item_fold"].last_seq > before.last_seq end)
            local _, latest = projection(h, "app:item_fold")
            test.eq(latest.observed_mode, "cursor_only")
            test.is_false(latest.received_events)
            test.eq(tonumber(rows(h)[1].deliveries), 1)
        end)

        test.it("delivers declared events and advances past unselected facts", function()
            local h = fixture.board()
            local plugin = "app:event_projection_plugin"
            local kind = "app:event_fold"
            steps.create(h, "task", { title = "before subscription" })
            local function cursor(): integer
                local out = assert(h.call("get_schema", {}))
                for _, p in ipairs(out.plugins) do
                    if p.plugin == plugin and p.projections[kind] then return p.projections[kind].last_seq end
                end
                return 0
            end
            assert(h.call("apply_schema", { declaration = { plugins = { { use = plugin } } } }))
            local item = steps.create(h, "task", { title = "selected" })
            local seq = assert(steps.get(h, item)).item.updated_seq
            steps.wait_for("selected event delivery", function(): boolean return cursor() >= seq end)
            local _, body = projection(h, kind)
            test.eq(body.meta.worker_input_mode, "prefetch_events")
            test.eq(body.observed_mode, "prefetch_events")
            test.eq(#body.delivered, 1)
            test.eq(body.delivered[1], "kickside.work.events:item.created")
            steps.one(h, { op = "set", item = item, values = { title = "unselected" } })
            local later = assert(steps.get(h, item)).item.updated_seq
            steps.wait_for("cursor passes unselected fact", function(): boolean return cursor() >= later end)
            local _, after = projection(h, kind)
            test.eq(#after.delivered, 1)
            test.eq(after.delivered[1], body.delivered[1])
        end)

        test.it("dispatches native state workers on idle member boards and follows changes and deletes", function()
            local member = scoped.member()
            local h = fixture.board({ actor = member.actor })
            test.eq(assert(component.get_identity_receipt(h.id)).principal.id, member.id)
            local item = steps.create(h, "task", { title = "before activation" })
            steps.create(h, "task", { title = "another existing item" })
            activate(h, true)
            local dispatched: Map = {}
            steps.wait_for("native member callback", function(): boolean
                local plugin = view(h)
                dispatched = plugin.projections["app:item_fold"] or {}
                return plugin.lifecycle.state == "ready" and (dispatched.parked or (dispatched.last_seq or 0) > 0)
            end)
            test.is_false(dispatched.parked, tostring(dispatched.error))
            ready(h, false)
            test.eq(#rows(h), 2)
            for _, row in ipairs(rows(h)) do test.eq(row.actor_id, member.id) end
            steps.one(h, { op = "set", item = item, values = { title = "after activation" } })
            steps.wait_for("member worker follows change", function(): boolean return #rows(h) == 3 end)
            steps.one(h, { op = "delete", item = item })
            steps.wait_for("member worker follows delete", function(): boolean return #rows(h) == 4 end)
            test.eq(rows(h)[4].event_type, "delete")
            local out, denied = member.call("direct", { target = "app:plugin_projection_worker", input = {} })
            test.is_nil(out); test.eq(denied:kind(), errors.PERMISSION_DENIED)
            assert(h.call("configure_plugin", { plugin = PLUGIN, config = { fail = true } }))
            local parked = ready(h, true)
            test.is_true(parked.parked); test.not_nil(parked.error)
        end)
        test.it("answers installed options and active admission through the host contract", function()
            local h = fixture.board()
            local options = assert(h.call("contract_request", { contract = "kickside.work:board", method = "schema_options", value = { board_id = h.id } }))
            local found, malformed
            for _, plugin in ipairs(options.plugins) do
                if plugin.plugin == PLUGIN then found = plugin end
                if plugin.plugin == "app:missing_worker_plugin" then malformed = plugin end
            end
            test.not_nil(found); test.is_true(found.installed); test.eq(found.active, false)
            test.not_nil(found.config_schema)
            test.eq(malformed.problem.code, "plugin_projection_invalid")
            local _, inactive = h.call("contract_request", { contract = "kickside.work:board", method = "plugin_context", value = { board_id = h.id, plugin = PLUGIN } })
            test.not_nil(inactive); test.eq(inactive:kind(), errors.NOT_FOUND); test.eq(inactive:details().code, "plugin_inactive")
            activate(h, true, { marker = "configured" })
            local context = assert(h.call("contract_request", { contract = "kickside.work:board", method = "plugin_context", value = { board_id = h.id, plugin = PLUGIN } }))
            test.eq(context.config.marker, "configured")
            test.not_nil(context.attachment_id); test.not_nil(context.lifecycle); test.not_nil(context.projections)
            test.is_nil(context.use); test.is_nil(context.projection)
        end)
        test.it("bootstraps state, follows, removes cursor and attachment, and rebuilds on reactivation", function()
            local h = fixture.board()
            local item = steps.create(h, "task", { title = "before activation" })
            local admin, id = fixture.user(h)
            assert(h.call("grant", { subject_id = id, mask = 15 }))
            assert(admin("apply_schema", { declaration = { plugins = { { use = PLUGIN } } } }))
            ready(h, false)
            test.eq(#attachments(h), 1)
            test.eq(attachments(h)[1].private_context.board_id, h.id)
            test.eq(#rows(h), 1)
            test.eq(rows(h)[1].event_type, "upsert")
            test.eq(rows(h)[1].actor_id, h.actor:id())
            test.eq(view(h).lifecycle.state, "ready")
            steps.one(h, { op = "set", item = item, values = { title = "after activation" } })
            steps.wait_for("followed change", function(): boolean return #rows(h) == 2 end)
            test.eq(rows(h)[2].event_type, "upsert")
            activate(h, false)
            steps.wait_for("attachment teardown", function(): boolean return #attachments(h) == 0 end)
            test.eq(view(h).active, false)
            test.is_nil(view(h).projections["app:item_fold"])
            local listing = assert(h.call("plugin_projections", {}))
            for _, p in ipairs(listing.projections) do test.is_true(p.kind ~= "app:item_fold") end
            local historical = assert(h.call("get_schema", { generation = 2 }))
            test.eq(historical.plugins[1].plugin, PLUGIN)
            test.is_nil(historical.plugins[1].projections["app:item_fold"])
            steps.create(h, "task", { title = "while inactive" })
            test.eq(#rows(h), 0)
            activate(h, true)
            ready(h, false)
            test.eq(#rows(h), 2)
            test.eq(#attachments(h), 1)
        end)
        test.it("bootstraps live items after their source events expire", function()
            local h = fixture.board()
            steps.create(h, "task", { title = "Durable item" })
            local db = assert(sql.get("app:db"))
            assert(db:execute("DELETE FROM kickside_event WHERE thread_id=$1", { h.id })); db:release()
            activate(h, true)
            ready(h, false)
            test.eq(#rows(h), 1)
            test.eq(rows(h)[1].event_type, "upsert")
        end)
        test.it("bounds feed pages and keeps bootstrap and registration in the opaque token", function()
            local h = fixture.board()
            local ops: { Map } = {}
            for _ = 1, 200 do ops[#ops + 1] = { op = "create", type = "task", values = {} } end
            assert(h.call("apply", { ops = ops }))
            local tail: { Map } = {}
            for _ = 1, 5 do tail[#tail + 1] = { op = "create", type = "task", values = {} } end
            assert(h.call("apply", { ops = tail }))
            local _, inactive = h.call("plugin_feed", { plugin = PLUGIN, kind = "app:item_fold" })
            test.eq(inactive:kind(), errors.NOT_FOUND); test.eq(inactive:details().code, "plugin_inactive")
            activate(h, true)
            ready(h, false)
            local first = assert(h.call("plugin_feed", { plugin = PLUGIN, kind = "app:item_fold" }))
            test.eq(#first.changes, 200); test.is_false(first.done); test.is_true(first.bootstrap)
            test.not_nil(first.attachment_id); test.not_nil(first.config)
            local second = assert(h.call("plugin_feed", { plugin = PLUGIN, kind = "app:item_fold", token = first.token }))
            test.eq(#second.changes, 5); test.is_true(second.done); test.is_true(second.bootstrap)
            local third = assert(h.call("plugin_feed", { plugin = PLUGIN, kind = "app:item_fold", token = second.token }))
            test.eq(#third.changes, 0); test.is_true(third.done); test.is_false(third.bootstrap)
            local _, malformed = h.call("plugin_feed", { plugin = PLUGIN, kind = "app:item_fold", token = "malformed" })
            test.eq(malformed:kind(), errors.INVALID)
            local _, undeclared = h.call("plugin_feed", { plugin = PLUGIN, kind = "app:other" })
            test.eq(undeclared:kind(), errors.INVALID); test.eq(undeclared:details().code, "plugin_projection_invalid")
            local reader = fixture.user(h)
            local _, denied = reader("plugin_feed", { plugin = PLUGIN, kind = "app:item_fold" })
            test.eq(denied:kind(), errors.PERMISSION_DENIED)
            local other = fixture.board()
            activate(other, true); ready(other, false)
            local _, foreign = other.call("plugin_feed", { plugin = PLUGIN, kind = "app:item_fold", token = second.token })
            test.eq(foreign:kind(), errors.INVALID)
            local db = assert(sql.get("app:db"))
            assert(db:execute("UPDATE kickside_work_board SET tombstone_floor_seq = applied_seq WHERE board_id=$1", { h.id }))
            db:release()
            local reset = assert(h.call("plugin_feed", { plugin = PLUGIN, kind = "app:item_fold", token = first.token }))
            test.is_true(reset.bootstrap); test.eq(#reset.changes, 200); test.is_false(reset.done)
            test.eq(#rows(h), 205)
        end)
        test.it("resumes plugin state delivery after a hidden row ends a page", function()
            local owner = scoped.admin()
            local declaration = fixture.declaration(fixture.fresh_prefix())
            declaration.fields[7] = { code = "level", form = "text", index = "key" }
            declaration.item_types[3].fields[4] = "level"
            declaration.visibility = { field = "level", levels = {
                { id = "internal", holders = { { user = owner.id } } },
            } }
            local h = scoped.board(owner, declaration)
            local reader, reader_id = fixture.user(h, nil, true)
            assert(h.call("grant", { subject_id = reader_id, mask = 1 }))
            local hidden = steps.create(h, "task", { level = "internal" })
            activate(h, true)
            ready(h, false)
            local request: Map = { plugin = PLUGIN, kind = "app:item_fold" }
            local first = assert(reader("plugin_feed", request))
            test.eq(#first.changes, 0)
            test.is_nil(first.token:find(hidden, 1, true))

            local visible = steps.create(h, "task")
            request.token = first.token
            local next_page, err = reader("plugin_feed", request)
            assert(next_page, steps.detail(err))
            test.eq(#next_page.changes, 1)
            test.eq(next_page.changes[1].item_id, visible)
            local _, raw_err = reader("events", {})
            test.eq(raw_err:kind(), errors.PERMISSION_DENIED)
        end)
        test.it("rebuilds current state when effective configuration changes", function()
            local h = fixture.board()
            steps.create(h, "task", {})
            activate(h, true)
            ready(h, false)
            local _, original = projection(h, "app:item_fold")
            test.eq(rows(h)[1].marker, "initial")
            assert(h.call("configure_plugin", { plugin = PLUGIN, config = { marker = "reconfigured" } }))
            steps.wait_for("config replay", function(): boolean return #rows(h) > 0 and rows(h)[1].marker == "reconfigured" end)
            local _, stale = h.call("plugin_feed", { plugin = PLUGIN, kind = "app:item_fold", token = original.token })
            test.eq(stale:kind(), errors.INVALID)
            test.eq(#rows(h), 1)
            test.eq(tonumber(rows(h)[1].deliveries), 2)
        end)
        test.it("keeps cursor and folded rows for unchanged config and unrelated schema changes", function()
            local h = fixture.board()
            steps.create(h, "task", {})
            activate(h, true)
            local before = ready(h, false)
            local recorded = rows(h)
            local applied = assert(h.call("apply_schema", { declaration = { fields = { { code = "note", form = "text" } } } }))
            local configured = assert(h.call("configure_plugin", { plugin = PLUGIN, config = {} }))
            test.is_true(configured.seq > applied.seq)
            assert(h.call("plugin_sync", {}))
            steps.wait_for("unrelated schema projection", function(): boolean return view(h).projections["app:item_fold"].last_seq >= configured.seq end)
            local after = view(h).projections["app:item_fold"]
            test.is_true(after.last_seq >= before.last_seq)
            assert(h.call("plugin_sync", {}))
            test.eq(view(h).projections["app:item_fold"].last_seq, after.last_seq)
            local held = rows(h)
            test.eq(#held, #recorded)
            for i, row in ipairs(held) do for k, v in pairs(recorded[i]) do test.eq(row[k], v) end end
        end)
        test.it("parks only the failing plugin cursor while board commands and reads continue", function()
            local h = fixture.board()
            activate(h, true, { fail = true })
            local first = steps.create(h, "task", {})
            local state = ready(h, true)
            test.not_nil(state.error)
            local second = steps.create(h, "task", {})
            test.eq(assert(steps.get(h, first)).item.id, first)
            test.eq(assert(steps.get(h, second)).item.id, second)
            test.is_true(view(h).projections["app:item_fold"].parked)
            test.eq(view(h).projections["app:item_fold"].last_seq, state.last_seq)
        end)
        test.it("fences plugin scope reads until the backing projection catches up", function()
            local admin, member = scoped.admin(), scoped.member()
            local h = scoped.board(admin)
            assert(h.call("grant", { subject_id = member.id, mask = 1 }))
            assert(h.call("apply_schema", { declaration = { plugins = { { use = PLUGIN } }, scopes = { "app:fold_scope" } } }))
            local item = steps.create(h, "task", { title = "Before" })
            ready(h, false)
            assert(h.call("configure_plugin", { plugin = PLUGIN, config = { fail = true } }))
            ready(h, true)
            local edit = assert(steps.apply(h, { { op = "set", item = item, values = { title = "After" } } }))
            test.eq(edit.outcomes[1].status, "applied")
            local seq = assert(member.call("get", { item = { id = item } }, h.id)).as_of
            test.is_true(view(h).projections["app:item_fold"].last_seq < seq)
            local scope = { id = "app:fold_scope", where = { seq = { eq = seq } } }
            test.eq(#assert(member.call("query", { scopes = { scope } }, h.id)).items, 0)
            test.eq(#assert(member.call("query", { min_seq = seq }, h.id)).items, 1)
            for _, read in ipairs({
                { method = "query", request = { scopes = { scope }, min_seq = seq } },
                { method = "count", request = { scopes = { scope }, min_seq = seq } },
                { method = "query", request = { where = { match = item }, min_seq = seq } },
            }) do
                local page, err = member.call(read.method, read.request, h.id)
                test.is_nil(page)
                test.not_nil(err)
                test.eq(err:kind(), errors.UNAVAILABLE)
                test.is_true(err:retryable())
                test.eq(err:details().code, "projection_pending")
                test.eq(err:details().min_seq, seq)
                test.eq(err:details().applied_seq, view(h).projections["app:item_fold"].last_seq)
            end
            assert(h.call("configure_plugin", { plugin = PLUGIN, config = {} }))
            ready(h, false)
            steps.wait_for("plugin scope projection acknowledgement", function(): boolean
                return view(h).projections["app:item_fold"].last_seq >= seq
            end)
            local page = assert(member.call("query", { scopes = { scope }, min_seq = seq }, h.id))
            test.eq(#page.items, 1)
            test.eq(page.items[1].id, item)
            test.eq(page.items[1].values.title, "After")
            test.eq(assert(member.call("count", { scopes = { scope }, min_seq = seq }, h.id)).total, 1)
            local matched = assert(member.call("query", { where = { match = item }, min_seq = seq }, h.id))
            test.eq(#matched.items, 1)
            test.eq(matched.items[1].id, item)
        end)
        test.it("refuses missing and wrong-kind workers before changing the schema", function()
            local h = fixture.board()
            for id, code in pairs({ ["app:missing_worker_plugin"] = "plugin_projection_invalid", ["app:wrong_worker_plugin"] = "plugin_projection_invalid" }) do
                for _, method in ipairs({ "plan_schema", "apply_schema" }) do
                    local _, err = h.call(method, { declaration = { plugins = { { use = id } } } })
                    test.not_nil(err)
                    test.eq(err:kind(), errors.INVALID)
                    test.eq(err:details().code, code)
                end
            end
            test.eq(assert(h.call("get_schema", {})).generation, 1)
        end)
        test.it("isolates a declaration that becomes malformed from host progress and other plugins", function()
            local h = fixture.board()
            activate(h, true)
            ready(h, false)
            local original = assert(h.call("declaration", { id = PLUGIN }))
            local updated = assert(h.call("declaration", { id = PLUGIN }))
            updated.meta.projections[1].input = "invalid"
            local registry = require("registry")
            local changes = assert(registry.snapshot()):changes()
            changes:update(updated); assert(changes:apply())
            local item = steps.create(h, "task", { title = "host continues" })
            local _, sync_err = h.call("plugin_sync", {})
            changes = assert(registry.snapshot()):changes()
            changes:update(original); assert(changes:apply())
            test.is_nil(sync_err)
            test.eq(assert(steps.get(h, item)).item.values.title, "host continues")
            test.eq(#attachments(h), 1)
        end)
        test.it("rebuilds an unchanged configuration at a new declared revision", function()
            local h = fixture.board()
            steps.create(h, "task", {})
            activate(h, true)
            ready(h, false)
            local original = assert(h.call("declaration", { id = PLUGIN }))
            local revised = assert(h.call("declaration", { id = PLUGIN }))
            revised.meta.projections[1].revision = 2
            local registry = require("registry")
            local changes = assert(registry.snapshot()):changes()
            changes:update(revised); assert(changes:apply())
            assert(h.call("plugin_sync", {}))
            steps.wait_for("revision rebuild", function(): boolean return #rows(h) == 1 and tonumber(rows(h)[1].deliveries) == 2 end)
            changes = assert(registry.snapshot()):changes()
            changes:update(original); assert(changes:apply())
            local events = assert(h.call("events", {})).events
            local rebuilt = 0
            for _, event in ipairs(events) do if event.type == "kickside.work.events:plugin.rebuild" then rebuilt = rebuilt + 1 end end
            test.eq(rebuilt, 1)
        end)
        test.it("refuses lifecycle provisioning by a board reader", function()
            local h = fixture.board()
            local reader, id = fixture.user(h)
            assert(h.call("grant", { subject_id = id, mask = 1 }))
            local _, err = reader("plugin_sync", {})
            test.not_nil(err)
            test.eq(err:kind(), errors.PERMISSION_DENIED)
        end)
    end)
end
return { run = test.run_cases(define) }
