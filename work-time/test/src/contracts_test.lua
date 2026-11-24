-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local json = require("json")
local registry = require("registry")
local funcs = require("funcs")
local time = require("time")
local scoped = require("scoped")
local steps = require("steps")
local schemas = require("schemas")
local values = require("values")
local fixtures = require("fixtures")
local csv = require("csv")
local test = require("test")

local PLUGIN = "kickside.work.time:plugin"
local API = "kickside.work.time.api:"

return { run = test.run_cases(function()
    test.describe("Generated Work Time transports", function()
        test.it("keeps contract, HTTP and tool schemas aligned and declares exact MCP scopes", function()
            local definition = assert(registry.get("kickside.work.time:time"))
            for _, method in ipairs(definition.data.methods) do
                local input = assert(json.decode(method.input_schemas[1].definition))
                local output = assert(json.decode(method.output_schemas[1].definition))
                test.eq(values.canonical(input), values.canonical(schemas[method.name].input))
                test.eq(values.canonical(output), values.canonical(schemas[method.name].output))
            end
            local aliases = {
                log_time = { "create", "WorkLogTime", "state.write" },
                edit_worklog = { "edit", "WorkEditWorklog", "state.write" },
                delete_worklog = { "delete", "WorkDeleteWorklog", "state.write" },
                list_worklogs = { "list", "WorkListWorklogs", "state.read" },
                time_totals = { "totals", "WorkTimeTotals", "state.read" },
            }
            local plugin = assert(registry.get(PLUGIN))
            test.eq(#plugin.meta.tools, 5)
            for _, id in ipairs(plugin.meta.tools) do
                local entry = assert(registry.get(id))
                local spec = assert(aliases[entry.name or id:match(":(.*)$")])
                test.eq(entry.meta.llm_alias, spec[2])
                test.eq(entry.meta.mcp.required_scopes[1], spec[3])
                test.eq(values.canonical(assert(json.decode(entry.meta.input_schema))), values.canonical(schemas[spec[1]].input))
            end
            for method, examples in pairs(fixtures) do
                for _, input in ipairs(examples.valid) do test.is_true(json.validate(schemas[method].input, input) == true) end
                for _, input in ipairs(examples.invalid) do test.is_false(json.validate(schemas[method].input, input) == true) end
            end
        end)

        test.it("runs tools and HTTP with the same authenticated worklog ownership and validation", function()
            local owner = scoped.admin()
            local board = scoped.board(owner)
            local applied = owner.http("POST", "/" .. board.id .. "/apply_schema", {
                declaration = { plugins = { { use = PLUGIN } } },
                plugin_configs = { [PLUGIN] = { item_types = { "task" } } },
            })
            test.eq(applied.status, 200, applied.raw)
            steps.wait_for("Time attachment ready", function()
                return steps.call(board, "plugin_context", { plugin = PLUGIN }).lifecycle.state == "ready"
            end)
            local item = steps.create(board, "task")
            local caller = scoped.member()
            assert(board.call("grant", { subject_id = caller.id, mask = 3 }))
            local exec = funcs.new():with_actor(caller.actor):with_scope(caller.scope)
            local input = { board_id = board.id, item = item, minutes = 10, key = "tool",
                work_date = time.now():utc():format("2006-01-02") }
            local result, err = exec:call(API .. "log_time", input)
            assert(result, steps.detail(err))
            test.is_true(result.success)
            local entry = assert(registry.get(API .. "log_time"))
            test.is_true(json.validate(assert(json.decode(entry.meta.output_schema)), result) == true)

            local path = "/" .. board.id .. "/time/worklogs"
            local listed = caller.http("GET", path .. "?item=" .. item)
            test.eq(listed.status, 200, listed.raw)
            test.eq(listed.body.data.entries[1].person, caller.id)
            test.eq(listed.body.data.entries[1].id, result.id)
            input.person = owner.id
            local spoofed = caller.http("POST", path, input)
            test.eq(spoofed.status, 400, spoofed.raw)
            local outsider = scoped.member().http("GET", path .. "?item=" .. item)
            test.eq(outsider.status, 403, outsider.raw)
        end)

        test.it("quotes all CSV cells and neutralizes formulas in resolved display names", function()
            local rendered = csv.render({ coverage = "complete", groups = { {
                board_id = "board", person = "id", person_name = ' =HYPERLINK("link")', entry_count = 1, minutes = 25,
            } } })
            test.is_true(rendered:find('"' .. "'" .. ' =HYPERLINK(""link"")"', 1, true) ~= nil)
            test.is_true(rendered:find('"1","25"', 1, true) ~= nil)
        end)

        test.it("returns a structured HTTP error when a CSV report request is invalid", function()
            local admin = scoped.admin()
            local board = scoped.board(admin)
            local reply = admin.http("GET", "/" .. board.id .. "/time/export.csv?group_by=sprint")
            test.eq(reply.status, 400, reply.raw)
            test.is_false(reply.body.success)
            test.eq(reply.body.details.code, "invalid_time_query")
        end)

        test.it("returns a classified HTTP error when the CSV handler returns no report", function()
            local admin = scoped.admin()
            local board = scoped.board(admin)
            local reply = admin.http("GET", "/" .. board.id .. "/time/export.csv?item=missing-report")
            test.eq(reply.status, 500, reply.raw)
            test.is_false(reply.body.success)
            test.eq((reply.body.details or {}).code, "time_export_missing_report", reply.raw)
        end)

        test.it("preserves the signed estimate values Work admits in the read schemas", function()
            local admin = scoped.admin()
            local board = scoped.board(admin)
            local route = "/" .. board.id
            local active = admin.http("POST", route .. "/apply_schema", {
                declaration = { plugins = { { use = PLUGIN } } },
                plugin_configs = { [PLUGIN] = { item_types = { "task" } } },
            })
            test.eq(active.status, 200, active.raw)
            steps.wait_for("Time attachment ready", function()
                return steps.call(board, "plugin_context", { plugin = PLUGIN }).lifecycle.state == "ready"
            end)
            local item = steps.create(board, "task", { time_original_minutes = -1, time_remaining_minutes = -2 })
            local summary = admin.http("POST", route .. "/time/summary", { items = { item } })
            test.eq(summary.status, 200, summary.raw)
            test.is_true(json.validate(schemas.summary.output, summary.body.data) == true)
            test.eq(summary.body.data.items[1].original_minutes, -1)
            test.eq(summary.body.data.items[1].remaining_minutes, -2)
            test.is_false(summary.body.data.items[1].over_estimate)
            local totals = admin.http("POST", route .. "/time/totals", { item = item })
            test.eq(totals.status, 200, totals.raw)
            test.is_true(json.validate(schemas.totals.output, totals.body.data) == true)
        end)
    end)
end) }
