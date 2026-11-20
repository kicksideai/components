-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local session = require("session")
local json = require("json")
local uuid = require("uuid")
local registry = require("registry")
type Map = { [string]: unknown }
local function path(id: string, method: string): string return "/work/boards/" .. id .. "/" .. method end
local function create(owner: session.Session, pack: string?, starter: boolean): string
    local reply = owner.post("/work/boards", { title = "Packed board", pack = pack, starter = starter,
        declaration = { key_prefix = "P" .. uuid.v4():gsub("-", ""):sub(1, 8):upper() }, idempotency_key = (uuid.v4()) })
    test.eq(reply.status, 200, json.encode(reply.body))
    return reply.body.data.board_id :: string
end
local function cases()
    test.describe("pack wizard and upgrade HTTP requests", function()
        local restore: { id: string, kind: string, meta: Map, data: Map }? = nil
        test.after_each(function()
            if restore then
                local changes = assert(registry.snapshot()):changes()
                changes:update(restore); assert(changes:apply()); restore = nil
            end
        end)
        test.it("preserves native plugin dependency refusal through discovery and creation", function()
            local entry = assert(registry.get("app:unavailable_pack"))
            restore = { id = tostring(entry.id), kind = entry.kind, meta = entry.meta, data = entry.data }
            local changed = assert(json.decode(json.encode(restore))) :: { id: string, kind: string, meta: Map, data: Map }
            changed.data.requires = { "app:forbidden_plugin" }
            local changes = assert(registry.snapshot()):changes()
            changes:update(changed); assert(changes:apply())
            local owner = session.admin()
            for _, result in ipairs({ owner.get("/work/packs"), owner.post("/work/boards", {
                title = "Denied dependency", pack = "app:unavailable_pack", idempotency_key = uuid.v4() }) }) do
                test.eq(result.status, 403, json.encode(result.body))
                test.eq(result.body.kind, errors.PERMISSION_DENIED)
            end
        end)
        test.it("discovers real scoped packs and their unavailable requirements", function()
            local owner, outsider = session.admin(), session.outsider()
            local listed = owner.get("/work/packs")
            test.eq(listed.status, 200, json.encode(listed.body))
            local found: Map = {}
            for _, pack in ipairs(listed.body.data.packs) do found[pack.id] = pack end
            test.eq(found["app:delivery_pack"].title, "Delivery")
            test.eq(found["app:delivery_pack"].version, "1.0.0")
            test.is_false(found["app:unavailable_pack"].plugins[1].installed)
            test.eq(outsider.get("/work/packs").status, 403)
            local hidden = session.member().get("/work/packs")
            test.eq(hidden.status, 200)
            for _, pack in ipairs(hidden.body.data.packs) do test.is_true(pack.id ~= "app:hidden_pack") end
        end)
        test.it("discovers display metadata and configuration for the wizard", function()
            local listed = session.admin().get("/work/packs")
            test.eq(listed.status, 200, json.encode(listed.body))
            local found: Map = {}
            for _, pack in ipairs(listed.body.data.packs) do found[pack.id] = pack end
            local plugin = found["app:configured_pack"].plugins[1]
            test.eq(plugin.plugin, "app:ui_plugin")
            test.eq(plugin.title, "Board enhancements")
            test.eq(plugin.config_schema and plugin.config_schema.properties.threshold.type, "integer")
            test.eq(plugin.config_schema and plugin.config_schema.properties.threshold.minimum, 1)
        end)
        test.it("creates with pack provenance, honors starter opt-out, and leaves Empty board empty", function()
            local owner = session.admin()
            for _, starter in ipairs({ false, true }) do
                local id = create(owner, "app:delivery_pack", starter)
                local schema = owner.post(path(id, "get_schema"), {})
                test.eq(schema.status, 200, json.encode(schema.body))
                test.eq(schema.body.data.pack.id, "app:delivery_pack"); test.eq(schema.body.data.pack.version, "1.0.0")
                local items = owner.post(path(id, "query"), {})
                test.eq(items.status, 200, json.encode(items.body)); test.eq(#items.body.data.items, starter and 1 or 0)
            end
            local id = create(owner, nil, false)
            local schema = owner.post(path(id, "get_schema"), {})
            test.eq(schema.status, 200, json.encode(schema.body)); test.is_nil(schema.body.data.pack)
            test.eq(schema.body.data.generation, 1)
            local missing = owner.post("/work/boards", { title = "Unavailable", pack = "app:unavailable_pack", idempotency_key = (uuid.v4()) })
            test.eq(missing.status, 400, json.encode(missing.body)); test.eq(missing.body.details.code, "unknown_plugin")
        end)
        test.it("uses exact plugin identities and initial configuration for packed creation and empty-board installation", function()
            local owner = session.admin()
            local listed = owner.get("/work/packs")
            test.eq(listed.status, 200, json.encode(listed.body))
            for _, pack in ipairs(listed.body.data.packs) do
                if pack.id == "app:configured_pack" then
                    test.eq(pack.plugins[1].plugin, "app:ui_plugin")
                    test.is_true(pack.plugins[1].installed)
                    test.is_nil(pack.plugins[1].id)
                end
            end
            local request = { title = "Configured board", pack = "app:configured_pack", starter = false,
                declaration = { key_prefix = "P" .. uuid.v4():gsub("-", ""):sub(1, 8):upper() },
                plugin_configs = { ["app:ui_plugin"] = { threshold = 7 } }, idempotency_key = uuid.v4() }
            local created = owner.post("/work/boards", request)
            test.eq(created.status, 200, json.encode(created.body))
            test.eq(owner.post("/work/boards", request).body.data.board_id, created.body.data.board_id)
            local view = owner.post(path(created.body.data.board_id, "get_schema"), {}).body.data
            test.eq(view.plugins[1].plugin, "app:ui_plugin"); test.eq(view.plugins[1].config.threshold, 7)
            local id = create(owner, nil, false)
            local install = { pack = "app:configured_pack", expected_generation = 1,
                plugin_configs = { ["app:ui_plugin"] = { threshold = 9 } }, key = uuid.v4() }
            local planned = owner.post(path(id, "pack_plan"), install)
            test.eq(planned.status, 200, json.encode(planned.body)); test.eq(#planned.body.data.refused, 0)
            local applied = owner.post(path(id, "pack_apply"), install)
            test.eq(applied.status, 200, json.encode(applied.body)); test.eq(applied.body.data.status, "done")
            local installed = owner.post(path(id, "get_schema"), {}).body.data
            test.eq(installed.pack.id, "app:configured_pack"); test.eq(installed.plugins[1].config.threshold, 9)
        end)
        test.it("reviews conflicts and explicit state maps then applies with generation and ADMIN protection", function()
            local owner, reader = session.admin(), session.member()
            local id = create(owner, "app:upgrade_pack", false)
            local local_edit = owner.post(path(id, "apply_schema"), { expected_generation = 1, declaration = { fields = { { code = "title", form = "text", title = "Local title" } } }, key = (uuid.v4()) })
            test.eq(local_edit.status, 200, json.encode(local_edit.body))
            local entry = assert(registry.get("app:upgrade_pack"))
            local original = { id = tostring(entry.id), kind = entry.kind, meta = entry.meta, data = entry.data }
            local changed = assert(json.decode(json.encode(original))) :: { id: string, kind: string, meta: Map, data: Map }
            changed.meta.version = "2.0.0"; changed.data.schema.fields[1].title = "Pack title"
            changed.data.schema.processes[1].initial = "ready"; changed.data.schema.processes[1].states[1].id = "ready"
            local changes = assert(registry.snapshot()):changes(); changes:update(changed); assert(changes:apply())
            local ok, reason = pcall(function()
                local current = owner.post(path(id, "get_schema"), {}).body.data
                test.is_true(current.outdated)
                local request: Map = { pack = "app:upgrade_pack", version = "2.0.0", expected_generation = current.generation }
                local planned = owner.post(path(id, "pack_plan"), request)
                test.eq(planned.status, 200, json.encode(planned.body))
                test.eq(planned.body.data.conflicts[1].path, "fields.title")
                test.eq(planned.body.data.maps.flow.open, "ready")
                test.eq(owner.post(path(id, "get_schema"), {}).body.data.generation, current.generation)
                request.resolutions = { ["fields.title"] = "incoming" }; request.maps = { flow = { open = "ready" } }
                local reviewed = owner.post(path(id, "pack_plan"), request)
                test.eq(reviewed.status, 200, json.encode(reviewed.body)); test.eq(#reviewed.body.data.refused, 0)
                assert(owner.call("grant", { subject_id = reader.id, mask = 1 }, id))
                test.eq(reader.post(path(id, "pack_plan"), request).status, 403)
                request.key = uuid.v4()
                test.eq(reader.post(path(id, "pack_apply"), request).status, 403)
                local applied = owner.post(path(id, "pack_apply"), request)
                test.eq(applied.status, 200, json.encode(applied.body)); test.eq(applied.body.data.status, "done")
                local after = owner.post(path(id, "get_schema"), {}).body.data
                test.eq(after.pack.version, "2.0.0"); test.is_false(after.outdated)
                test.eq(after.declaration.fields[1].title, "Pack title")
                request.key = uuid.v4(); test.eq(owner.post(path(id, "pack_apply"), request).status, 409)
            end)
            local restore = assert(registry.snapshot()):changes(); restore:update(original); assert(restore:apply())
            assert(ok, tostring(reason))
        end)
    end)
end
return { run = test.run_cases(cases) }
