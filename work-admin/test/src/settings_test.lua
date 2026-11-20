-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local session = require("session")
local fixture = require("fixture")
local registry = require("registry")
local json = require("json")
local uuid = require("uuid")
local fs = require("fs")
type Map = { [string]: unknown }
local SETTINGS = "/settings"
local WORK_NAMESPACE = "kickside.work"

local function listed_settings(admin: session.Session): { [string]: Map }
    local reply = admin.get(SETTINGS .. "?namespace=" .. WORK_NAMESPACE)
    test.eq(reply.status, 200, json.encode(reply.body))
    local by_key: { [string]: Map } = {}
    for _, row in ipairs(reply.body.settings) do
        test.eq(row.namespace, WORK_NAMESPACE)
        by_key[row.key] = row
    end
    return by_key
end

local function alternate_value(setting: Map): unknown
    local schema = setting.schema :: Map
    if setting.value_type == "int" then
        local current = setting.value :: number
        if current < (schema.maximum :: number) then return current + 1 end
        return current - 1
    end
    for _, value in ipairs(schema.enum :: { string }) do
        if value ~= setting.value then return value end
    end
    error("No alternate value for " .. tostring(setting.key))
end

local function create(owner: session.Session): string
    local reply = owner.post("/work/boards", { title = "Schema editing", idempotency_key = (uuid.v4()), declaration = fixture.declaration() })
    test.eq(reply.status, 200, json.encode(reply.body))
    return reply.body.data.board_id :: string
end
local function path(id: string, method: string): string return "/work/boards/" .. id .. "/" .. method end
local function extensions(owner: session.Session, id: string): Map
    local reply = owner.get("/work-admin/boards/" .. id .. "/options")
    test.eq(reply.status, 200, json.encode(reply.body))
    return reply.body.data :: Map
end
local function cases()
    test.describe("Work application defaults", function()
        test.it("lists, saves and reads back every declared Work setting as an administrator", function()
            local entries = assert(registry.find({ ["meta.type"] = "kickside.settings:definition" }))
            local admin = session.admin()
            local listed = listed_settings(admin)
            local declared = 0
            local failures: { string } = {}
            for _, entry in ipairs(entries) do
                if entry.data.namespace == WORK_NAMESPACE then
                    declared = declared + 1
                    local key = entry.data.key :: string
                    local before = assert(listed[key], "Missing Work setting: " .. key)
                    listed[key] = nil
                    test.eq(before.editable, true, key)
                    local value = alternate_value(before)
                    local saved = admin.put(SETTINGS, { namespace = WORK_NAMESPACE, key = key, value = value })
                    if saved.status == 200 then
                        local after = listed_settings(admin)[key]
                        local original = before.value
                        if before.is_default then original = nil end
                        local restored = admin.put(SETTINGS, { namespace = WORK_NAMESPACE, key = key, value = original })
                        test.eq(restored.status, 200, key .. ": " .. json.encode(restored.body))
                        test.not_nil(after, key)
                        test.eq(after.value, value, key)
                        test.eq(after.is_default, false, key)
                    else
                        table.insert(failures, key .. ": HTTP " .. tostring(saved.status) .. " " .. json.encode(saved.body))
                    end
                end
            end
            test.is_true(declared > 0, "Work has declared settings")
            test.eq(next(listed), nil, "Every listed Work setting has a declaration")
            test.eq(#failures, 0, table.concat(failures, "\n"))
        end)
    end)
    test.describe("settings declaration and schema editor requests", function()
        test.it("declares an announced admin view and protects the System tab with board creation access", function()
            local entry = assert(registry.get("kickside.work.admin:settings_tab"))
            test.eq(entry.meta.type, "ui.settings_tab")
            test.eq(entry.data.key, "work"); test.eq(entry.data.label, "Work")
            test.eq(entry.data.access, "kickside.work.api:create.endpoint")
            test.eq(entry.data.component_tag, "kickside-work-admin")
            local admin = assert(registry.get("kickside.work.admin:admin"))
            test.eq(admin.meta.announced, true); test.eq(admin.meta.auto_register, true)
            test.eq(admin.meta.entry_point, "admin.js")
            local bundle = assert(fs.get("kickside.work.admin:ui_fs"))
            local exists = bundle:exists("admin.js")
            test.is_true(exists)
            local defaults = assert(registry.get("kickside.work.admin:defaults_block"))
            test.eq(defaults.data.namespace, "kickside.work"); test.eq(defaults.data.key, "kickside.work")
            test.eq(defaults.data.component_tag, "kickside-work-defaults")
            local member, outsider = session.member(), session.outsider()
            test.is_true(member.allows("registry.find", "kickside.work.admin:settings_tab"))
            test.is_true(member.allows("registry.get", "kickside.work.admin:admin"))
            test.is_false(outsider.allows("registry.get", "kickside.work.admin:admin"))
            test.is_false(member.allows("access", entry.data.access))
            test.is_true(session.admin().allows("access", entry.data.access))
        end)
        test.it("round trips an editor draft through plan then apply with generation protection and stable rename", function()
            local owner, reader = session.admin(), session.member()
            local id = create(owner)
            local got = owner.post(path(id, "get_schema"), {})
            test.eq(got.status, 200, json.encode(got.body))
            local generation = got.body.data.generation :: integer
            local declaration = got.body.data.declaration
            local field_id = declaration.fields[1].id
            declaration.fields[1].code = "name"
            declaration.fields[2] = { code = "priority", type = "option", index = "key", track = true, cardinality = "one", options = {
                { id = "normal", label = "Normal", color = "primary", order = 1 }, { id = "high", label = "High", color = "warn", order = 2 },
            } }
            declaration.item_types[1].fields = { "name", "priority" }
            declaration.policy = { wip = { todo = { limit = 4, hard = true } }, audit = "fields", audit_days = 90 }
            local request = { declaration = declaration, expected_generation = generation, plugin_configs = {} }
            local plan = owner.post(path(id, "plan_schema"), request)
            test.eq(plan.status, 200, json.encode(plan.body))
            test.eq(#plan.body.data.refused, 0)
            test.is_true(#plan.body.data.changes > 0)
            local still = owner.post(path(id, "get_schema"), {})
            test.eq(still.body.data.generation, generation, "planning never changes the board")
            request.key = uuid.v4()
            local applied = owner.post(path(id, "apply_schema"), request)
            test.eq(applied.status, 200, json.encode(applied.body))
            local after = owner.post(path(id, "get_schema"), {})
            test.eq(after.body.data.generation, generation + 1)
            test.eq(after.body.data.declaration.fields[1].id, field_id)
            test.eq(after.body.data.declaration.fields[1].code, "name")
            test.eq(after.body.data.compiled.fields[2].options[2].color, "warn")
            test.eq(after.body.data.compiled.policy.wip.todo.hard, true)
            test.eq(after.body.data.compiled.policy.audit_days, 90)
            request.key = uuid.v4()
            test.eq(owner.post(path(id, "apply_schema"), request).status, 409)
            assert(owner.call("grant", { subject_id = reader.id, mask = 1 }, id))
            test.eq(reader.post(path(id, "plan_schema"), request).status, 403)
            test.eq(reader.post(path(id, "apply_schema"), request).status, 403)
        end)
    end)
    test.describe("plugin configuration and caller scope", function()
        test.it("discovers scoped plugin choices and configures an active plugin against its schema", function()
            local owner, reader = session.admin(), session.member()
            local id = create(owner)
            local before = extensions(owner, id)
            local offered = false
            for _, installed in ipairs(before.schema_options.plugins) do
                if installed.plugin == "app:ui_plugin" then offered = true; test.eq(installed.tools[1], "kickside.work.traits:get_schema") end
            end
            test.is_true(offered)
            local malformed
            for _, option in ipairs(before.schema_options.plugins) do if option.plugin == "app:malformed_ui_plugin" then malformed = option end end
            test.not_nil(malformed); test.is_true(malformed.installed); test.is_false(malformed.active)
            test.eq(malformed.problem.code, "plugin_projection_invalid")
            test.eq(malformed.config_schema.properties.amount.type, "integer")
            test.is_true(before.access.admin)
            local schema = owner.post(path(id, "get_schema"), {}).body.data
            local request = { expected_generation = schema.generation, declaration = { plugins = { { use = "app:ui_plugin" } } }, plugin_configs = { ["app:ui_plugin"] = { threshold = 2 } } }
            test.eq(owner.post(path(id, "plan_schema"), request).status, 200)
            request.key = uuid.v4()
            local applied = owner.post(path(id, "apply_schema"), request)
            test.eq(applied.status, 200, json.encode(applied.body))
            local active_schema = owner.post(path(id, "get_schema"), {}).body.data
            local plugin = active_schema.plugins[1]
            test.eq(plugin.plugin, "app:ui_plugin")
            test.is_true(plugin.active)
            test.eq(plugin.config.threshold, 2)
            test.not_nil(plugin.attachment_id)
            test.not_nil(plugin.lifecycle)
            test.eq(next(plugin.projections), nil, "a plugin without projections has no projection state")
            local old_schema = owner.post(path(id, "get_schema"), { generation = schema.generation }).body.data
            for _, installed in ipairs(old_schema.plugins) do test.is_false(installed.active) end
            local activation = owner.post(path(id, "get_schema"), { generation = active_schema.generation }).body.data
            test.eq(activation.plugins[1].attachment_id, plugin.attachment_id)
            assert(owner.call("grant", { subject_id = reader.id, mask = 1 }, id))
            local read = extensions(reader, id)
            test.is_false(read.access.admin)
            test.eq(#read.schema_options.plugins, 0)
            local configured = owner.post(path(id, "configure_plugin"), { plugin = "app:ui_plugin", config = { threshold = 3 } })
            test.eq(configured.status, 200, json.encode(configured.body))
            local invalid = owner.post(path(id, "configure_plugin"), { plugin = "app:ui_plugin", config = { threshold = "wrong" } })
            test.eq(invalid.status, 400, json.encode(invalid.body))
            test.eq(reader.post(path(id, "configure_plugin"), { plugin = "app:ui_plugin", config = { threshold = 4 } }).status, 403)
            local next_schema = owner.post(path(id, "get_schema"), {}).body.data
            test.eq(next_schema.plugins[1].config.threshold, 3)
            test.eq(next_schema.plugins[1].attachment_id, plugin.attachment_id)
            local deactivate = { expected_generation = next_schema.generation, declaration = { plugins = {} } }
            test.eq(owner.post(path(id, "plan_schema"), deactivate).status, 200)
            deactivate.key = uuid.v4()
            test.eq(owner.post(path(id, "apply_schema"), deactivate).status, 200)
            test.is_false(owner.post(path(id, "get_schema"), {}).body.data.plugins[1].active)
        end)
    end)
end
return { run = test.run_cases(cases) }
