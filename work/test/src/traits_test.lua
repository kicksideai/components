-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local registry = require("registry")
local json = require("json")
local fixture = require("fixture")
local steps = require("steps")
local values = require("values")
type Map = { [string]: unknown }

local function metadata(name: string): Map
    return assert(registry.get("kickside.work.traits:" .. name)).meta :: Map
end

local function accepts(name: string, input: Map): boolean
    return json.validate(assert(json.decode(metadata(name).input_schema :: string)), input) == true
end

local function define()
    test.describe("Work agent traits", function()
        test.it("declares exact read and write tools and a read-only trait", function()
            local expected = {}
            for _, name in ipairs({ "list_boards", "get_schema", "find_items", "get_item", "count", "explain", "list_history", "get_time_in_state", "list_links", "list_comments", "list_stage_runs", "list_changes", "bulk_status", "move_status", "list_packs", "list_views", "get_view", "run_view", "apply", "transition", "comment", "approve", "report", "bulk", "cancel_bulk", "create_view", "save_view", "rename_view", "delete_view", "schema_options", "resume_migration", "list_pack_boards", "create_board", "update_board", "plan_schema", "apply_schema", "pack_plan", "pack_apply", "configure_plugin", "plan_move", "move" }) do expected[name] = true end
            local reads = { "list_boards", "get_schema", "find_items", "get_item", "count", "explain", "list_history", "get_time_in_state", "list_links", "list_comments", "list_stage_runs", "list_changes", "bulk_status", "move_status", "list_packs", "list_views", "get_view", "run_view" }
            local writes = { "apply", "transition", "comment", "approve", "report", "bulk", "cancel_bulk", "create_view", "save_view", "rename_view", "delete_view" }
            local administration = { "schema_options", "resume_migration", "list_pack_boards", "create_board", "update_board", "plan_schema", "apply_schema", "pack_plan", "pack_apply", "configure_plugin", "plan_move", "move", "list_boards", "get_schema", "list_packs" }
            for _, name in ipairs({ "work", "work_readonly", "work_admin" }) do
                local entry = assert(registry.get("kickside.work.traits:" .. name))
                test.eq(entry.meta.type, "agent.trait")
                test.is_true(entry.meta.public)
                local actual, declared = {}, {}
                for _, short in ipairs(name == "work_admin" and administration or reads) do declared["kickside.work.traits:" .. short] = true end
                if name == "work" then for _, short in ipairs(writes) do declared["kickside.work.traits:" .. short] = true end end
                for _, id in ipairs(entry.data.tools) do
                    test.is_nil(actual[id], id); actual[id] = true
                    local tool = assert(registry.get(id))
                    test.eq(tool.meta.type, "tool")
                    local short = id:match(":(.+)$")
                    test.is_true(expected[short] == true)
                    if name == "work_readonly" then test.is_true(short ~= "apply" and short ~= "transition" and short ~= "comment") end
                end
                test.eq(values.canonical(actual), values.canonical(declared), name)
            end
            local policy = assert(registry.get("kickside.work.security:work_tools"))
            test.eq(policy.meta.intent, "tool_access")
            local capabilities, actual = {}, {}
            for name in pairs(expected) do capabilities[name] = true end
            for _, name in ipairs({ "work", "work_readonly", "work_admin", "build_work", "build_readonly" }) do capabilities[name] = true end
            for _, id in ipairs(policy.data.policy.resources) do
                local name = id:match(":(.+)$")
                test.is_nil(actual[name], id)
                actual[name] = true
            end
            test.eq(values.canonical(actual), values.canonical(capabilities))
        end)
        test.it("limits the transition and comment schemas to their advertised operation", function()
            for _, name in ipairs({ "transition", "comment" }) do
                local own = { op = name, item = "item-1" }
                test.is_true(accepts(name, { ops = { own, own } }))
                for _, wrong in ipairs({ "create", "set", name == "comment" and "transition" or "comment" }) do
                    local mixed = { ops = { own, { op = wrong } } }
                    test.is_false(accepts(name, mixed), name .. " accepted " .. wrong)
                    test.is_true(accepts("apply", mixed))
                end
            end
        end)
        test.it("rejects a mixed batch at the alias before applying any operation", function()
            local h = fixture.board({ declaration = fixture.workflow(fixture.fresh_prefix()) })
            local item = steps.create(h, "story", { title = "Original" })
            local executor = h.executor:with_context({ board_id = h.id })
            local batches = {
                { tool = "comment", ops = {
                    { op = "comment", item = item, body = "Should not be added" },
                    { op = "create", type = "story", values = { title = "Should not be created" } },
                } },
                { tool = "comment", ops = { { op = "set", item = item, values = { title = "Should not change" } } } },
                { tool = "transition", ops = { { op = "comment", item = item, body = "Should not be added" } } },
            }
            for _, batch in ipairs(batches) do
                local _, err = executor:call("kickside.work.traits:" .. batch.tool, { mode = "independent", ops = batch.ops })
                test.not_nil(err, batch.tool .. " accepted a foreign operation")
                test.eq(err:kind(), errors.INVALID)
                test.eq(err:details().code, "tool_operation_mismatch")
            end
            local found = assert(executor:call("kickside.work.traits:find_items", {}))
            test.eq(#found.items, 1)
            test.eq(found.items[1].values.title, "Original")
            local comments = assert(executor:call("kickside.work.traits:list_comments", { item = { id = item } }))
            test.eq(#comments.comments, 0)
        end)
        test.it("advertises the apply batch bounds", function()
            local ops = { { op = "comment" } }
            test.is_true(accepts("apply", { ops = ops }))
            for i = 2, 200 do ops[i] = ops[1] end
            test.is_true(accepts("apply", { ops = ops }))
            ops[201] = ops[1]
            test.is_false(accepts("apply", { ops = ops }))
            local schema = assert(json.decode(metadata("apply").input_schema :: string))
            test.is_false(json.validate_string(schema, '{"ops":[]}') == true)
        end)
        test.it("requires a known string operation in each apply item", function()
            test.is_true(accepts("apply", { ops = { { op = "create" }, { op = "set" } } }))
            for _, wrong in ipairs({ { op = "typo" }, { op = 1 }, { item = "item-1" } }) do
                test.is_false(accepts("apply", { ops = { wrong } }))
            end
        end)
        test.it("advertises exactly one link selector", function()
            local item, target = { id = "item-1" }, { board = "board-1", item = "item-2" }
            test.is_true(accepts("list_links", { item = item }))
            test.is_true(accepts("list_links", { target = target }))
            test.is_false(accepts("list_links", { item = item, target = target }))
            test.is_false(accepts("list_links", table.create(0, 1)))
        end)
        test.it("enumerates mutation outcomes and tells agents how to inspect them", function()
            for _, name in ipairs({ "apply", "transition", "comment", "approve", "report" }) do
                local meta = metadata(name)
                local schema = assert(json.decode(meta.output_schema :: string))
                for _, status in ipairs({ "applied", "unchanged", "conflict", "invalid", "denied", "unavailable" }) do
                    test.is_true(json.validate(schema, {
                        success = true, applied = false, outcomes = { { op = 1, status = status } },
                    }) == true, name .. ": " .. status)
                end
                test.is_false(json.validate(schema, {
                    success = true, applied = false, outcomes = { { op = 1, status = "other" } },
                }) == true, name)
                local description = meta.llm_description :: string
                for _, field in ipairs({ "outcomes[].status", "rolled_back", "findings[].code" }) do
                    test.not_nil(description:find(field, 1, true), name .. ": " .. field)
                end
            end
        end)
        test.it("calls exact board methods with call or trait context and the caller authority", function()
            local h = fixture.board({ declaration = fixture.workflow(fixture.fresh_prefix()) })
            local id = steps.create(h, "story", { title = "Agent", assignee = { kind = "user", id = h.actor:id() } })
            local executor = h.executor:with_context({ board_id = h.id })
            local function tool(name: string, args: Map): Map
                local out, err = executor:call("kickside.work.traits:" .. name, args)
                assert(not err, tostring(err))
                test.is_true(out.success)
                return out :: Map
            end
            test.eq((tool("get_item", { item = { id = id } }).item :: Map).id, id)
            test.eq(#(tool("find_items", {}).items :: { Map }), 1)
            test.not_nil(tool("get_schema", {}).compiled)
            test.not_nil(tool("explain", {}).plan)
            test.is_true(tool("apply", { ops = { { op = "set", item = id, values = { title = "Edited" } } } }).applied == true)
            test.is_true(tool("transition", { ops = { { op = "transition", item = id, transition = "start" } } }).applied == true)
            test.is_true(tool("comment", { ops = { { op = "comment", item = id, body = "Agent comment" } } }).applied == true)
            test.not_nil(tool("get_schema", { board_id = h.id }).compiled)
        end)
        test.it("returns native contract errors and enforces the board ACL", function()
            local h, other = fixture.board(), fixture.board()
            local _, denied = other.executor:call("kickside.work.traits:get_schema", { board_id = h.id })
            test.eq(denied:kind(), errors.PERMISSION_DENIED)
            local _, invalid = h.executor:call("kickside.work.traits:apply", { board_id = h.id, ops = {} })
            test.eq(invalid:kind(), errors.INVALID)
        end)
    end)
end
return { run = test.run_cases(define) }
