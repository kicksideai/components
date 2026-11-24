-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local scoped = require("scoped")
local steps = require("steps")
local storage = require("storage")

local PLUGIN = "kickside.work.time:plugin"
local ORIGINAL = "time_original_minutes"
local REMAINING = "time_remaining_minutes"

local function success(reply: scoped.Reply): { [string]: unknown }
    test.eq(reply.status, 200, reply.raw)
    return reply.body.data :: { [string]: unknown }
end

local function change(item_types: { string }, activate: boolean?): { [string]: unknown }
    return {
        declaration = activate and { plugins = { { use = PLUGIN } } } or {},
        plugin_configs = { [PLUGIN] = { item_types = item_types } },
    }
end

local function has_field(fields: { string }, code: string): boolean
    for _, field in ipairs(fields) do
        if field == code then return true end
    end
    return false
end

local function define()
    test.describe("Work Time schema", function()
        test.it("activates with no selected item types and declares the settings defaults", function()
            local admin = scoped.admin()
            local board = scoped.board(admin)
            local route = "/" .. board.id
            success(admin.http("POST", route .. "/apply_schema", { declaration = { plugins = { { use = PLUGIN } } } }))
            local schema = success(admin.http("POST", route .. "/get_schema", {}))
            local plugin = schema.plugins[1]
            test.eq(plugin.plugin, PLUGIN)
            test.is_true(plugin.active)
            test.not_nil(plugin.attachment_id)
            test.eq(#plugin.requires, 0)
            local options = assert(board.call("schema_options", {}))
            local properties = nil
            for _, option in ipairs(options.plugins) do
                if option.plugin == PLUGIN then properties = option.config_schema.properties end
            end
            test.not_nil(properties)
            test.eq(properties.rounding_minutes.default, 1)
            test.eq(properties.entry_visibility.default, "all")
            test.eq(#properties.item_types.default, 0)
            for _, field in ipairs(schema.compiled.fields) do
                test.is_true(field.code ~= ORIGINAL and field.code ~= REMAINING)
            end
        end)

        test.it("adds optional tracked numeric estimates to selected types for Work item readers", function()
            local admin, member = scoped.admin(), scoped.member()
            local board = scoped.board(admin)
            local route = "/" .. board.id
            success(admin.http("POST", route .. "/apply_schema", change({ "task" }, true)))
            local schema = success(admin.http("POST", route .. "/get_schema", {}))
            local estimate_fields = 0
            for _, field in ipairs(schema.compiled.fields) do
                if field.code == ORIGINAL or field.code == REMAINING then
                    estimate_fields = estimate_fields + 1
                    test.eq(field.plugin, PLUGIN)
                    test.eq(field.form, "int")
                    test.eq(field.index, "number")
                    test.is_true(field.track)
                end
            end
            test.eq(estimate_fields, 2)
            for _, item_type in ipairs(schema.compiled.item_types) do
                test.eq(has_field(item_type.fields, ORIGINAL), item_type.id == "task")
                test.eq(has_field(item_type.fields, REMAINING), item_type.id == "task")
            end
            steps.create(board, "task", { title = "No estimate" })
            local item = steps.create(board, "task", { title = "Estimated task", [ORIGINAL] = 90 })
            test.is_nil(assert(steps.get(board, item)).item.values[REMAINING])
            assert(board.call("grant", { subject_id = member.id, mask = 1 }))
            local page = success(member.http("POST", route .. "/query", { where = { field = ORIGINAL, op = "eq", value = 90 } }))
            test.eq(#page.items, 1)
            test.eq(page.items[1].id, item)
            test.eq(page.items[1].values[ORIGINAL], 90)
        end)

        test.it("rejects invalid config and types the board does not declare", function()
            local admin = scoped.admin()
            local board = scoped.board(admin)
            local route = "/" .. board.id
            local absent = change({ "absent_type" }, true)
            local plan = admin.http("POST", route .. "/plan_schema", absent)
            test.eq(plan.status, 400, plan.raw)
            success(admin.http("POST", route .. "/apply_schema", change({ "task" }, true)))
            for _, config in ipairs({
                { item_types = { "absent_type" } }, { item_types = { "task", "task" } },
                { item_types = { "Task" } }, { rounding_minutes = 10 }, { entry_visibility = "everyone" },
            }) do
                local rejected = admin.http("POST", route .. "/configure_plugin", { plugin = PLUGIN, config = config })
                test.eq(rejected.status, 400, rejected.raw)
            end
            local schema = success(admin.http("POST", route .. "/get_schema", {}))
            test.eq(#schema.plugins[1].config.item_types, 1)
            test.eq(schema.plugins[1].config.item_types[1], "task")
            success(admin.http("POST", route .. "/configure_plugin", {
                plugin = PLUGIN, config = { item_types = { "task" }, rounding_minutes = 15, entry_visibility = "self" },
            }))
            schema = success(admin.http("POST", route .. "/get_schema", {}))
            test.eq(schema.plugins[1].config.rounding_minutes, 15)
            test.eq(schema.plugins[1].config.entry_visibility, "self")
        end)

        test.it("preserves live estimates until the type removal is resolved in Work review", function()
            local admin = scoped.admin()
            local board = scoped.board(admin)
            local route = "/" .. board.id
            local enabled = success(admin.http("POST", route .. "/apply_schema", change({ "task", "epic" }, true)))
            local task = steps.create(board, "task", { title = "Task", [ORIGINAL] = 90, [REMAINING] = 30 })
            local epic = steps.create(board, "epic", { title = "Epic", [ORIGINAL] = 120 })
            local request = change({ "epic" })
            local plan = success(admin.http("POST", route .. "/plan_schema", request))
            test.eq(plan.class, "refused")
            test.eq(#plan.refused, 2)
            local resolutions = {}
            for _, finding in ipairs(plan.refused) do
                test.eq(finding.what, "field.remove")
                test.eq(finding.item_type, "task")
                resolutions[finding.path] = "drop"
            end
            local direct = admin.http("POST", route .. "/configure_plugin", { plugin = PLUGIN, config = { item_types = { "epic" } } })
            test.eq(direct.status, 400, direct.raw)
            local applied = admin.http("POST", route .. "/apply_schema", request)
            test.eq(applied.status, 400, applied.raw)
            local values = assert(steps.get(board, task)).item.values
            test.eq(values[ORIGINAL], 90)
            test.eq(values[REMAINING], 30)
            request.expected_generation = enabled.generation
            request.resolutions = resolutions
            success(admin.http("POST", route .. "/apply_schema", request))
            test.is_nil(assert(steps.get(board, task)).item.values[ORIGINAL])
            test.eq(assert(steps.get(board, epic)).item.values[ORIGINAL], 120)
        end)

        test.it("installs Time tables and their access indexes on the Work database", function()
            local board = scoped.board(scoped.admin())
            local db = assert(storage.open())
            local board_rows, board_err = db:query("SELECT board_id FROM kickside_work_board WHERE board_id = $1", { board.id })
            local indexes_sql = db:type() == "postgres"
                and "SELECT indexname AS name FROM pg_indexes WHERE schemaname = current_schema() AND indexname LIKE 'kickside_work_time_%'"
                or "SELECT name FROM sqlite_master WHERE type = 'index' AND name LIKE 'kickside_work_time_%'"
            local rows, err = db:query(indexes_sql, {})
            local indexes = {}
            for _, row in ipairs(rows or {}) do indexes[row.name] = true end
            local missing_table: string? = nil
            for _, name in ipairs({ "attachment", "item", "worklog", "receipt", "total", "daily" }) do
                local _, table_err = db:query("SELECT attachment_id FROM kickside_work_time_" .. name .. " LIMIT 1", {})
                if table_err then
                    missing_table = name
                    break
                end
            end
            db:release()
            test.is_nil(board_err)
            test.eq((board_rows or {})[1].board_id, board.id)
            test.is_nil(err)
            test.is_nil(missing_table)
            for _, name in ipairs({
                "attachment_retired", "item_retired", "worklog_item_date", "worklog_person_date", "worklog_board_date",
                "worklog_expiry", "receipt_item", "receipt_expiry", "total_board_item", "daily_person_date",
                "daily_sprint_date", "daily_board_date",
            }) do
                test.is_true(indexes["kickside_work_time_" .. name] == true, "missing index " .. name)
            end
        end)

        test.it("rejects worklogs with fractional or nonpositive minutes at the storage boundary", function()
            local db = assert(storage.open())
            local insert = [[INSERT INTO kickside_work_time_worklog
                (attachment_id, board_id, item_id, person_id, entry_id, version, minutes, work_date)
                VALUES ('duration-attachment', 'duration-board', 'duration-item', 'duration-person', $1, 1, $2, '2026-11-24')]]
            local _, fractional = db:execute(insert, { "fractional", "1.5" })
            local _, zero = db:execute(insert, { "zero", "0" })
            db:release()
            test.not_nil(fractional)
            test.not_nil(zero)
        end)
    end)
end

return { run = test.run_cases(define) }
