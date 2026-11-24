-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local fixture = require("fixture")
local funcs = require("funcs")
local json = require("json")
local registry = require("registry")
local schemas = require("schemas")
local scoped = require("scoped")
local steps = require("steps")
local test = require("test")
local values = require("values")

local PLANNING = "kickside.work.planning:"
local API = "kickside.work.planning.api:"
local ROUTE = "/api/work/planning/"

local function board(admin, reader)
    local h = scoped.board(admin, {
        key_prefix = fixture.fresh_prefix(),
        fields = {
            { code = "title", form = "text" },
            { code = "due_date", form = "time", index = "key" },
        },
        item_types = { { id = "epic", process = "delivery", fields = { "title", "due_date" } } },
        processes = { { id = "delivery", initial = "open", states = { { id = "open", category = "backlog" } } } },
    })
    assert(h.call("pack_apply", { pack = PLANNING .. "pack", expected_generation = 1, key = "planning",
        plugin_configs = { [PLANNING .. "plugin"] = { epic_types = { "epic" }, epic_due_field = "due_date" } } }))
    assert(h.call("grant", { subject_id = reader.id, mask = 1 }))
    local schema = steps.call(h, "get_schema", {})
    assert(h.call("apply_schema", {
        expected_generation = schema.generation,
        declaration = {
            fields = {
                { code = "visibility_level", form = "text", index = "key" },
                { code = "story_points", form = "int", index = "number" },
                { code = "assignee", type = "principal", index = "key" },
            },
            item_types = {
                { id = "issue", process = "planning_issue",
                    fields = { "title", "current_sprint", "milestone", "story_points", "assignee", "visibility_level" } },
                { id = "sprint", process = "planning_sprint",
                    fields = { "name", "planning_start", "planning_end", "planning_goal", "visibility_level" } },
            },
            visibility = { field = "visibility_level", bypass = "admin", levels = { { id = "private", holders = {} } } },
        },
    }))
    return h
end

local function tool(caller, method, input)
    return funcs.new():with_actor(caller.actor):with_scope(caller.scope):call(API .. method, input)
end

local function read(caller, method, input)
    local reply = caller.http("POST", ROUTE .. method, input)
    test.eq(reply.status, 200, reply.raw)
    test.is_true(reply.body.success)
    local result = reply.body.data
    local valid, detail = json.validate_string({
        type = "object", required = { "success", "data" }, additionalProperties = false,
        properties = { success = { const = true }, data = schemas[method].output },
    }, reply.raw)
    test.is_true(valid, tostring(detail))

    local entry = assert(registry.get(API .. method))
    local output, err = tool(caller, method, input)
    assert(output, steps.detail(err))
    valid, detail = json.validate(assert(json.decode(entry.meta.output_schema)), output)
    test.is_true(valid, tostring(detail))
    test.is_true(output.success)
    output.success = nil
    test.eq(values.canonical(output), values.canonical(result))
    return result
end

return { run = test.run_cases(function()
    test.describe("Planning read transports", function()
        test.it("returns workload totals for caller-visible unfinished work and preserves capacity", function()
            local admin, reader = scoped.admin(), scoped.member()
            local h = board(admin, reader)
            local sprint = steps.create(h, "sprint", { name = "Sprint" })
            local assignment = { board = h.id, item = sprint }
            local owner = { kind = "user", id = reader.id }
            steps.create(h, "issue", { title = "Visible", current_sprint = assignment, story_points = 3, assignee = owner })
            steps.create(h, "issue", { title = "Private", current_sprint = assignment, story_points = 9,
                assignee = owner, visibility_level = "private" })
            steps.create(h, "issue", { title = "Unestimated", current_sprint = assignment })
            local done = steps.create(h, "issue", { title = "Completed", current_sprint = assignment, story_points = 5 })
            test.eq(steps.one(h, { op = "transition", item = done, transition = "complete" }).status, "applied")
            local written = admin.http("POST", ROUTE .. "set_capacity", { board_id = h.id, sprint_id = sprint,
                expected_version = 0, unit = "points", rows = { { person = reader.id, amount = 8 } } })
            test.eq(written.status, 200, written.raw)

            local request = { board_id = h.id, sprint_id = sprint }
            local result = read(reader, "workload", request)
            test.eq(result.unit, "points")
            test.eq(result.version, 1)
            test.is_true(result.estimates_available)
            test.is_true(result.caller_visible)
            test.is_false(result.incomplete)
            test.eq(result.as_of, steps.call(h, "get_schema", {}).as_of)
            test.eq(#result.rows, 1)
            test.eq(result.rows[1].person, reader.id)
            test.eq(result.rows[1].load, 3)
            test.eq(result.rows[1].capacity, 8)
            test.eq(result.rows[1].items, 1)
            test.eq(result.rows[1].missing_estimates, 0)
            test.eq(values.canonical(result.total), values.canonical({ load = 3, capacity = 8, items = 2, missing_estimates = 1 }))
            test.eq(values.canonical(result.unassigned), values.canonical({ load = 0, items = 1, missing_estimates = 1 }))
            local all = read(admin, "workload", request)
            test.eq(all.total.load, 12)
            test.eq(all.total.items, 3)
        end)

        test.it("returns roadmap field mappings to a board reader", function()
            local admin, reader = scoped.admin(), scoped.member()
            local h = board(admin, reader)
            local result = read(reader, "roadmap", { board_id = h.id })
            test.eq(values.canonical(result), values.canonical({ types = {
                epic = { start = "planning_start", finish = "due_date" },
                milestone = { start = "planning_start", finish = "planning_end", membership = "milestone" },
            } }))
        end)

        test.it("returns an empty roadmap map when Planning is active without roadmap types", function()
            local admin, reader = scoped.admin(), scoped.member()
            local h = scoped.board(admin)
            assert(h.call("grant", { subject_id = reader.id, mask = 1 }))
            local request = { board_id = h.id }
            local inactive = reader.http("POST", ROUTE .. "roadmap", request)
            test.eq(inactive.status, 404, inactive.raw)
            test.eq(inactive.body.details.code, "plugin_inactive")
            assert(h.call("apply_schema", { declaration = { plugins = { { use = PLANNING .. "plugin" } } } }))
            test.is_nil(next(read(reader, "roadmap", request).types))
        end)

        test.it("refuses members without board READ and does not expose a hidden sprint", function()
            local admin, reader, outsider = scoped.admin(), scoped.member(), scoped.member()
            local h = board(admin, reader)
            local sprint = steps.create(h, "sprint", { name = "Private sprint", visibility_level = "private" })
            local workload = { board_id = h.id, sprint_id = sprint }
            for method, request in pairs({ roadmap = { board_id = h.id }, workload = workload }) do
                local reply = outsider.http("POST", ROUTE .. method, request)
                test.eq(reply.status, 403, reply.raw)
                test.is_nil(reply.body.data)
                local result, err = tool(outsider, method, request)
                test.is_nil(result)
                test.eq(assert(err):kind(), errors.PERMISSION_DENIED)
            end

            local reply = reader.http("POST", ROUTE .. "workload", workload)
            test.eq(reply.status, 404, reply.raw)
            test.is_nil(reply.body.data)
            local result, err = tool(reader, "workload", workload)
            test.is_nil(result)
            test.eq(assert(err):kind(), errors.NOT_FOUND)

            local empty = read(admin, "workload", workload)
            test.eq(#empty.rows, 0)
            test.eq(empty.total.items, 0)
            test.is_nil(empty.unit)
            test.is_nil(empty.version)
        end)

        test.it("enforces input shapes and registers agent and read-scoped MCP tools", function()
            local member = scoped.member()
            local manifest = assert(registry.get(PLANNING .. "plugin"))
            local expected = { workload = "WorkReadWorkload", roadmap = "WorkReadRoadmap" }
            for method, invalid in pairs({ workload = { board_id = "board" }, roadmap = { board_id = "board", sprint_id = "sprint" } }) do
                local reply = member.http("POST", ROUTE .. method, invalid)
                test.eq(reply.status, 400, reply.raw)
                test.eq(reply.body.details.code, "invalid_shape")
                local result, err = tool(member, method, invalid)
                test.is_nil(result)
                test.eq(assert(err):kind(), errors.INVALID)

                local id = API .. method
                local listed = false
                for _, tool_id in ipairs(manifest.meta.tools) do
                    if tool_id == id then listed = true end
                end
                test.is_true(listed, id)
                local entry = assert(registry.get(id))
                test.eq(entry.meta.llm_alias, expected[method])
                test.eq(#entry.meta.mcp.required_scopes, 1)
                test.eq(entry.meta.mcp.required_scopes[1], "state.read")
                test.eq(values.canonical(assert(json.decode(entry.meta.input_schema))), values.canonical(schemas[method].input))
            end
        end)
    end)
end) }
