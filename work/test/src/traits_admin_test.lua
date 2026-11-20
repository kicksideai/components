-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local fixture = require("fixture")
local steps = require("steps")
local operation_steps = require("operation_steps")
local registry = require("registry")
local json = require("json")
local authorization_probe = require("authorization_probe")
local rows = require("rows")
type Map = { [string]: unknown }
local function tool(h: fixture.Handle, name: string, args: Map): Map
    local result, err = h.executor:with_context({ board_id = h.id }):call("kickside.work.traits:" .. name, args)
    assert(not err, name .. ": " .. steps.detail(err))
    test.is_true(result.success, name)
    local entry = assert(registry.get("kickside.work.traits:" .. name))
    local ok, validation = json.validate_string(entry.meta.output_schema, assert(json.encode(result)))
    test.is_true(ok, name .. ": " .. tostring(validation))
    return result :: Map
end
local function define()
    test.describe("Work administration answers", function()
        test.it("starts and monitors moves through the admin trait alone under source access", function()
            local source, target = fixture.board(), fixture.board()
            operation_steps.gate(source, true)
            local item = steps.create(source, "task")
            assert(target.call("grant", { subject_id = source.actor:id(), mask = 3 }))
            local compiled = assert(source.executor:call("app:compile_work_agent", { board_id = source.id, admin_only = true }))
            local tools = {}
            for _, entry in pairs(compiled.tools) do tools[entry.registry_id] = true end
            test.is_true(tools["kickside.work.traits:move"])
            test.is_true(tools["kickside.work.traits:move_status"], "admin-only agent cannot discover WorkMoveStatus")

            local started = tool(source, "move", { item = item, to_board = target.id, key = "admin-trait-move",
                map = { type = {}, state = {}, fields = {}, relations = {} } })
            local request = { move_id = started.move_id }
            steps.wait_for("admin agent sees completed move", function(): boolean
                return tool(source, "move_status", request).status == "done"
            end)
            local executor = target.executor:with_context({ board_id = source.id })
            for _, mask in ipairs({ 1, 3 }) do
                assert(source.call("grant", { subject_id = target.actor:id(), mask = mask }))
                local _, err = executor:call("kickside.work.traits:move_status", request)
                test.eq(err:kind(), errors.PERMISSION_DENIED)
            end
            assert(source.call("grant", { subject_id = target.actor:id(), mask = 11 }))
            test.eq(tool(target, "move_status", { board_id = source.id, move_id = started.move_id }).status, "done")
        end)
        test.it("accepts context board inputs and keeps explicit board precedence", function()
            local h, other = fixture.board(), fixture.board()
            for _, case in ipairs({
                { name = "update_board", args = { title = "Context title" } },
                { name = "pack_plan", args = { pack = "app:numeric_pack", expected_generation = 1 } },
                { name = "pack_apply", args = { pack = "app:numeric_pack", expected_generation = 1, key = "context-pack" } },
                { name = "create_view", args = { view = { type = "list" } } },
                { name = "list_views", args = {} },
                { name = "schema_options", args = {} },
                { name = "resume_migration", args = {} },
            }) do
                local entry = assert(registry.get("kickside.work.traits:" .. case.name))
                local ok, err = json.validate_string(entry.meta.input_schema, assert(json.encode(next(case.args) and case.args or table.create(0, 1))))
                test.is_true(ok, case.name .. ": " .. tostring(err))
            end
            test.eq(tool(h, "update_board", { title = "Context title" }).board_id, h.id)
            assert(other.call("grant", { subject_id = h.actor:id(), mask = 9 }))
            test.eq(tool(h, "update_board", { board_id = other.id, title = "Explicit title" }).board_id, other.id)
            test.not_nil(tool(h, "schema_options", {}).plugins)
            test.not_nil(tool(h, "schema_options", { board_id = other.id }).plugins)
            local _, err = h.executor:with_context({ board_id = h.id }):call("kickside.work.traits:resume_migration", {})
            test.eq(err:kind(), errors.INVALID)
            test.eq(err:details().code, "no_parked_migration")
        end)
        test.it("encodes empty plugin maps as objects and plugin lists as arrays", function()
            local h = fixture.board()
            assert(h.call("apply_schema", { declaration = { plugins = { { use = "app:trait_plugin" } } } }))
            for _, name in ipairs({ "get_schema", "schema_options" }) do
                local entry = assert(registry.get("kickside.work.traits:" .. name))
                local schema = assert(json.decode(entry.meta.output_schema)).properties.plugins.items
                for _, plugin in ipairs(tool(h, name, {}).plugins) do
                    local encoded = assert(json.encode(plugin))
                    local ok, err = json.validate_string(schema, encoded)
                    test.is_true(ok, name .. ": " .. tostring(err))
                    if plugin.plugin == "app:trait_plugin" then
                        test.eq(json.encode(plugin.config), "{}")
                        test.eq(json.encode(plugin.projections), "{}")
                        test.eq(json.encode(plugin.requires), "[]")
                    end
                end
            end
        end)
        test.it("publishes an installed field type descriptor in board and tool options", function()
            local h = fixture.board()
            local options = assert(h.call("contract_request", { contract = "kickside.work:board", method = "schema_options", value = { board_id = h.id } }))
            local contract = assert(registry.get("kickside.work:board"))
            for _, method in ipairs(contract.data.methods) do
                if method.name == "schema_options" then
                    local ok, err = json.validate_string(method.output_schemas[1].definition, assert(json.encode(options)))
                    test.is_true(ok, tostring(err))
                end
            end
            for _, result in ipairs({ options, tool(h, "schema_options", {}) }) do
                local descriptor
                for _, field_type in ipairs(result.field_types or {}) do
                    if field_type.id == "app:work_type" then descriptor = field_type end
                end
                test.not_nil(descriptor, "installed app:work_type must be discoverable")
                test.eq(descriptor.form, "int")
                test.eq(descriptor.indexes[2], "number")
                test.eq(descriptor.config_schema.type, "object")
                test.eq(descriptor.config_schema.additionalProperties, false)
            end
        end)
        test.it("encodes absent item values and value states as objects", function()
            local d = fixture.declaration(fixture.fresh_prefix())
            d.item_types[3].fields = {}
            local h = fixture.board({ declaration = d })
            local item = steps.create(h, "task")
            local result = tool(h, "get_item", { item = { id = item } })
            test.eq(json.encode(result.item.values), "{}")
            test.eq(json.encode(result.item.value_states), "{}")
        end)
        test.it("encodes empty interval totals as an object", function()
            local d = fixture.declaration(fixture.fresh_prefix())
            d.fields[2].intervals = true
            local h = fixture.board({ declaration = d })
            local item = steps.create(h, "task")
            test.eq(json.encode(tool(h, "get_time_in_state", { item = { id = item }, field = "estimate" }).totals), "{}")
        end)
        test.it("encodes pack declaration projection maps as objects", function()
            tool(fixture.board(), "list_packs", {})
        end)
        test.it("encodes empty pack planning maps as objects", function()
            local h = fixture.board()
            local created = tool(h, "create_board", { idempotency_key = "map-plan", title = "Pack maps" })
            local plan = tool(h, "pack_plan", { board_id = created.board_id, pack = "app:numeric_pack", expected_generation = created.generation })
            test.eq(json.encode(plan.maps), "{}")
        end)
        test.it("encodes empty cross-board positions and continuation maps as objects", function()
            local h = fixture.board()
            local empty = tool(h, "find_items", { boards = {} })
            test.eq(json.encode(empty.positions), "{}")
            local stopped = tool(h, "find_items", { boards = { h.id }, budget = { deadline = "2000-01-01T00:00:00Z" } })
            test.is_true(stopped.incomplete)
            test.eq(json.encode(stopped.positions), "{}")
            test.eq(json.encode(stopped.cross_after.boards), "{}")
        end)
        test.it("resumes a parked follow migration through administration context", function()
            local h = fixture.board({ declaration = fixture.workflow(fixture.fresh_prefix()) })
            local item = steps.create(h, "task")
            local d = fixture.workflow(h.prefix)
            local process = d.processes[1]
            process.initial, process.map = "queued", { todo = "queued" }
            for _, state in ipairs(process.states) do if state.id == "todo" then state.id = "queued" end end
            for _, transition in ipairs(process.transitions) do
                if type(transition.from) == "table" then
                    for i, state in ipairs(transition.from) do if state == "todo" then transition.from[i] = "queued" end end
                end
                if transition.to == "todo" then transition.to = "queued" end
            end
            authorization_probe.fail(h.id, 8, errors.PERMISSION_DENIED)
            assert(h.call("apply_schema", { declaration = d }))
            steps.wait_for("parked tool migration", function(): boolean return rows.job(h.id).status == "failed" end)
            authorization_probe.clear(h.id)
            local result = tool(h, "resume_migration", {})
            test.is_true(result.resumed)
            test.not_nil(result.job_id)
            steps.wait_for("resumed tool migration", function(): boolean return rows.stale(h.id) == 0 end)
            test.eq(assert(steps.get(h, item)).item.state, "queued")
        end)
        test.it("publishes advanced persisted process states in schema answers", function()
            local d = fixture.declaration(fixture.fresh_prefix())
            d.processes = { { id = "delivery", initial = "human", states = {
                { id = "human", category = "started", due = "PT1H", awaiting = { group = "app.security:work_test" },
                  timers = { { id = "remind", after = "PT30M", ["then"] = { emit = "reminder" } } } },
                { id = "gate", category = "started", kind = "gate", release_when = { wait = "PT1H" } },
                { id = "build", category = "started", kind = "automated", run = { stage = "build" } },
                { id = "done", category = "completed" },
            }, transitions = {
                { id = "review", from = { "human" }, to = "gate" },
                { id = "release", from = { "gate" }, to = "build", auto = true, default = true },
                { id = "passed", from = { "build" }, to = "done" },
                { id = "failed", from = { "build" }, to = "done" },
            } } }
            local h = fixture.board({ declaration = d })
            local result = tool(h, "get_schema", {})
            local entry = assert(registry.get("kickside.work.traits:get_schema"))
            local schema = assert(json.decode(entry.meta.output_schema)).properties.declaration.properties.processes
            local ok, err = json.validate_string(schema, assert(json.encode(result.declaration.processes)))
            test.is_true(ok, tostring(err))
        end)
    end)
end
return { run = test.run_cases(define) }
