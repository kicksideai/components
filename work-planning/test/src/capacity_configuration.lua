-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local fixture = require("fixture")
local scoped = require("scoped")

local PLUGIN = "kickside.work.planning:plugin"
local MISSING = "absent_epic"

local function board(admin)
    return scoped.board(admin, {
        key_prefix = fixture.fresh_prefix(),
        fields = {
            { code = "title", form = "text" },
            { code = "planning_start", form = "time", index = "key" },
            { code = "planning_end", form = "time", index = "key" },
            { code = "due_date", form = "time" },
        },
        item_types = {
            { id = "task", process = "delivery", fields = { "title" } },
            { id = "epic", process = "delivery", fields = { "title", "due_date" } },
        },
        processes = { { id = "delivery", initial = "open", states = { { id = "open", category = "backlog" } } } },
    })
end

local function planning(h)
    local schema = assert(h.call("get_schema", {}))
    for _, plugin in ipairs(schema.plugins) do
        if plugin.plugin == PLUGIN then return plugin end
    end
    error("Planning is missing from Work's schema view")
end

local function define()
    test.describe("Planning configuration admission", function()
        test.it("activates with no Sprint type and only the registered closure tools", function()
            local h = board(scoped.admin())
            assert(h.call("apply_schema", { declaration = { plugins = { { use = PLUGIN } } } }))
            local plugin = planning(h)
            test.is_true(plugin.active)
            test.eq(#plugin.tools, 2)
            test.eq(plugin.tools[1], "kickside.work.planning:plan_close")
            test.eq(plugin.tools[2], "kickside.work.planning:close")
        end)

        test.it("adopts Planning dates only on configured epic types", function()
            local h = board(scoped.admin())
            assert(h.call("apply_schema", {
                declaration = {
                    plugins = { { use = PLUGIN } },
                    fields = { { code = "due_date", form = "time", index = "key" } },
                },
                plugin_configs = { [PLUGIN] = { epic_types = { "epic" }, epic_due_field = "due_date" } },
            }))
            local schema = assert(h.call("get_schema", {}))
            local types = {}
            for _, kind in ipairs(schema.compiled.item_types) do
                types[kind.id] = table.concat(kind.fields, ",")
            end
            test.is_true(types.epic:find("planning_start", 1, true) ~= nil)
            test.is_true(types.epic:find("planning_end", 1, true) == nil)
            test.eq(types.task, "title")
            for _, field in ipairs(schema.compiled.fields) do
                if field.code == "due_date" then test.eq(field.index, "key") end
            end
        end)

        test.it("uses Planning end on epics without a mapped due date", function()
            local h = board(scoped.admin())
            assert(h.call("apply_schema", {
                declaration = { plugins = { { use = PLUGIN } } },
                plugin_configs = { [PLUGIN] = { epic_types = { "epic" } } },
            }))
            for _, kind in ipairs(assert(h.call("get_schema", {})).compiled.item_types) do
                if kind.id == "epic" then
                    local dates = {}
                    for _, code in ipairs(kind.fields) do dates[code] = true end
                    test.is_true(dates.planning_start)
                    test.is_true(dates.planning_end)
                end
            end
        end)

        test.it("refuses missing issue and epic types during schema review", function()
            local admin = scoped.admin()
            local h = board(admin)
            for _, setting in ipairs({ "issue_types", "epic_types" }) do
                local reply = admin.http("POST", h.executor.route(h.id, "plan_schema"), {
                    declaration = { plugins = { { use = PLUGIN } } },
                    plugin_configs = { [PLUGIN] = { [setting] = { MISSING } } },
                })
                test.eq(reply.status, 400, reply.raw)
                test.eq(reply.body.details.item_type, MISSING)
            end
        end)
    end)
end

-- Run this entry against the Work release that shares schema admission with configure_plugin.
local function define_work_validation()
    test.describe("Planning attachment configuration admission", function()
        test.it("refuses to save a missing item type through direct attachment configuration", function()
            local admin = scoped.admin()
            local h = board(admin)
            assert(h.call("apply_schema", { declaration = { plugins = { { use = PLUGIN } } } }))

            for _, setting in ipairs({ "issue_types", "epic_types" }) do
                local reply = admin.http("POST", admin.route(h.id, "configure_plugin"), {
                    plugin = PLUGIN, config = { [setting] = { MISSING } },
                })
                local plugin = planning(h)
                local persisted = plugin.config and plugin.config[setting] and plugin.config[setting][1]
                test.eq(reply.status, 400, reply.raw .. " persisted item type: " .. tostring(persisted))
                test.is_nil(persisted)
            end
        end)
    end)
end

return { run = test.run_cases(define), work_validation = test.run_cases(define_work_validation) }
