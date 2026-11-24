-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local funcs = require("funcs")
local json = require("json")
local registry = require("registry")
local fixtures = require("fixtures")
local fixture = require("fixture")
local schemas = require("schemas")
local scoped = require("scoped")
local steps = require("steps")
local test = require("test")
local values = require("values")

local API = "kickside.work.planning.api:"
local PLANNING = "kickside.work.planning:"

return { run = test.run_cases(function()
    test.describe("Generated Planning transports", function()
        test.it("keeps contract inputs and outputs in sync with the same HTTP and tool vocabulary", function()
            for _, id in ipairs({ "planning", "sprint_reference" }) do
                local definition = assert(registry.get(PLANNING .. id))
                for _, method in ipairs(definition.data.methods) do
                    local input = assert(json.decode(method.input_schemas[1].definition))
                    local output = assert(json.decode(method.output_schemas[1].definition))
                    test.eq(values.canonical(input), values.canonical(schemas[method.name].input))
                    test.eq(values.canonical(output), values.canonical(schemas[method.name].output))
                    if id == "planning" then
                        local tool = assert(registry.get(API .. method.name))
                        test.eq(values.canonical(assert(json.decode(tool.meta.input_schema))), values.canonical(input))
                        local endpoint = assert(registry.get(API .. method.name .. ".endpoint"))
                        test.eq(endpoint.data.path, "/work/planning/" .. method.name)
                    end
                end
            end
            for method, examples in pairs(fixtures) do
                for _, input in ipairs(examples.valid) do test.is_true(json.validate(schemas[method].input, input) == true) end
                for _, input in ipairs(examples.invalid) do test.is_false(json.validate(schemas[method].input, input) == true) end
            end
        end)

        test.it("runs the tool under the caller and emits the same validation and receipt as HTTP", function()
            local admin, writer, reader = scoped.admin(), scoped.member(), scoped.member()
            local h = scoped.board(admin, { key_prefix = fixture.fresh_prefix() }, PLANNING .. "pack")
            steps.wait_for("Planning attachment ready", function()
                return steps.call(h, "plugin_context", { plugin = PLANNING .. "plugin" }).lifecycle.state == "ready"
            end)
            assert(h.call("grant", { subject_id = writer.id, mask = 3 }))
            assert(h.call("grant", { subject_id = reader.id, mask = 1 }))
            local item = steps.create(h, "issue", { title = "Move" })
            local sprint = steps.create(h, "sprint", { name = "Sprint" })
            local payload = { board_id = h.id, sprint_id = sprint, key = "plan",
                changes = { { item = item, expected_version = 1, sprint_id = sprint } } }
            local read_executor = funcs.new():with_actor(reader.actor):with_scope(reader.scope)
            local denied, denied_err = read_executor:call(API .. "plan_sprint", payload)
            test.is_nil(denied)
            assert(denied_err)
            test.eq(denied_err:kind(), errors.PERMISSION_DENIED)
            local actor = funcs.new():with_actor(writer.actor):with_scope(writer.scope)
            local planned, err = actor:call(API .. "plan_sprint", payload)
            assert(planned, steps.detail(err))
            test.is_true(planned.success)
            test.is_true(planned.applied)
            local tool = assert(registry.get(API .. "plan_sprint"))
            test.is_true(json.validate(assert(json.decode(tool.meta.output_schema)), planned) == true)

            local route = "/api/work/planning/plan_sprint"
            local reply = writer.http("POST", route, payload)
            test.eq(reply.status, 200, reply.raw)
            test.is_true(reply.body.data.replayed)
            test.eq(reply.body.data.seq, planned.seq)
            payload.capacity = { unit = "minutes" }
            local _, tool_err = actor:call(API .. "plan_sprint", payload)
            assert(tool_err)
            test.eq(tool_err:kind(), errors.INVALID)
            test.eq(writer.http("POST", route, payload).status, 400)
        end)
    end)
end) }
