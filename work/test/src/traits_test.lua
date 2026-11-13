-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local registry = require("registry")
local json = require("json")
local fixture = require("fixture")
local steps = require("steps")
local values = require("values")
type Map = { [string]: unknown }
local function define()
    test.describe("Work agent traits", function()
        test.it("declares exact read and write tools and a read-only trait", function()
            local expected = {}
            for _, name in ipairs({ "list_boards", "get_schema", "find_items", "get_item", "count", "explain", "list_history", "get_time_in_state", "list_links", "list_comments", "list_stage_runs", "list_changes", "bulk_status", "move_status", "list_packs", "list_views", "get_view", "run_view", "apply", "transition", "comment", "approve", "report", "bulk", "cancel_bulk", "create_view", "save_view", "rename_view", "delete_view", "create_board", "update_board", "plan_schema", "apply_schema", "pack_plan", "pack_apply", "configure_plugin", "plan_move", "move" }) do expected[name] = true end
            local reads = { "list_boards", "get_schema", "find_items", "get_item", "count", "explain", "list_history", "get_time_in_state", "list_links", "list_comments", "list_stage_runs", "list_changes", "bulk_status", "move_status", "list_packs", "list_views", "get_view", "run_view" }
            local writes = { "apply", "transition", "comment", "approve", "report", "bulk", "cancel_bulk", "create_view", "save_view", "rename_view", "delete_view" }
            local administration = { "create_board", "update_board", "plan_schema", "apply_schema", "pack_plan", "pack_apply", "configure_plugin", "plan_move", "move", "list_boards", "get_schema", "list_packs" }
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
        test.it("declares transition and comment as exact apply contract aliases", function()
            for _, name in ipairs({ "transition", "comment" }) do
                local entry = assert(registry.get("kickside.work.traits:" .. name))
                local schema = assert(json.decode(entry.meta.input_schema))
                test.is_true(json.validate(schema, { board_id = "board-1", ops = { { op = name, item = "item-1", transition = name == "transition" and "start" or nil, body = name == "comment" and "Text" or nil } } }) == true)
                local contract = assert(registry.get("kickside.work:board"))
                for _, method in ipairs(contract.data.methods) do
                    if method.name == "apply" then test.eq(values.canonical(schema), values.canonical(assert(json.decode(method.input_schemas[1].definition)))) end
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
