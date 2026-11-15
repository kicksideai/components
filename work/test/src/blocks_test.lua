-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local registry = require("registry")
local json = require("json")
local fixture = require("fixture")
local steps = require("steps")
local block_contract = require("block_contract")
local block_lower = require("block_lower")
local blocks = require("blocks")
type Map = { [string]: unknown }
local function define()
    test.describe("Work Blocks", function()
        test.it("offers virtual tools while preserving stored legacy Block references", function()
            local catalog = assert(blocks.catalog())
            for name, tool in pairs({find="find_items",get="get_item",apply="apply",transition="transition",comment="comment",report="report",
                bulk="bulk",bulk_status="bulk_status",cancel_bulk="cancel_bulk",plan_move="plan_move",move="move",move_status="move_status"}) do
                local current = catalog["kickside.work.traits:"..tool]
                test.not_nil(current);test.eq(current.source_kind,"tool");test.is_true(current.public)
                local legacy = assert(blocks.resolve("kickside.work.blocks:"..name))
                local entry=assert(registry.get(legacy.id))
                test.is_true(entry.meta.deprecated);test.eq(entry.meta.replacement,current.id)
                local plan, err = blocks.plan({block_id=legacy.id,config={board_id="stored-board"}})
                test.is_nil(err,tostring(err));test.not_nil(plan)
            end
        end)
        test.it("validates and lowers every function Block with its board picker", function()
            for _, name in ipairs({ "find", "get", "apply", "transition", "comment", "report" }) do
                local e = assert(registry.get("kickside.work.blocks:" .. name))
                test.is_nil(block_contract.validate(e), name)
                local block = e.data.block
                test.eq(block.config.properties.board_id.class, "work_board")
                test.eq(block.config.properties.board_id.value_field, "id")
                test.is_nil(block_contract.validate_instance(e, { board_id = "board-1" }))
                test.not_nil(block_contract.validate_instance(e, {}))
                local plan, err = block_lower.plan(e, { config = { board_id = "board-1" } })
                test.is_nil(err, tostring(err))
                test.eq(plan.node_type, "userspace.dataflow.node.func:node")
                test.eq(plan.config.func_id, block.execution.function_id)
            end
        end)
        test.it("declares transition and comment inputs as their exact apply operations", function()
            for _, name in ipairs({ "transition", "comment" }) do
                local entry = assert(registry.get("kickside.work.blocks:" .. name))
                local schema = entry.data.block.input
                test.is_true(json.validate(schema, { ops = { { op = name, item = "item-1", transition = name == "transition" and "start" or nil, body = name == "comment" and "Text" or nil } } }) == true)
                test.is_false(json.validate(schema, { ops = { { op = "delete", item = "item-1" } } }) == true)
            end
        end)
        test.it("reads, applies, transitions and comments through the board contract", function()
            local h = fixture.board({ declaration = fixture.workflow(fixture.fresh_prefix()) })
            local id = steps.create(h, "story", { title = "Flow", assignee = { kind = "user", id = h.actor:id() } })
            local function run(name: string, input: Map): Map
                local out, err = h.executor:call("kickside.work.blocks:" .. name .. ".run", { config = { board_id = h.id }, input = input })
                assert(not err, tostring(err))
                return out :: Map
            end
            test.eq((run("get", { item = { id = id } }).item :: Map).id, id)
            test.eq(#(run("find", {}).items :: { Map }), 1)
            test.is_true(run("apply", { ops = { { op = "set", item = id, values = { title = "Changed" } } } }).applied == true)
            test.is_true(run("transition", { ops = { { op = "transition", item = id, transition = "start" } } }).applied == true)
            test.is_true(run("comment", { ops = { { op = "comment", item = id, body = "Flow comment" } } }).applied == true)
            local got = run("get", { item = { id = id }, include = { "comments" } })
            test.eq((got.item :: Map).state, "doing")
            test.eq(((got.comments :: { Map })[1]).body, "Flow comment")
            local _, invalid = h.executor:call("kickside.work.blocks:get.run", { input = { item = { id = id } }, config = {} })
            test.eq(invalid:details().code, "invalid_config")
            local other = fixture.board()
            local _, denied = other.executor:call("kickside.work.blocks:get.run", { input = { item = { id = id } }, config = { board_id = h.id } })
            test.eq(denied:kind(), errors.PERMISSION_DENIED)
        end)
    end)
end
return { run = test.run_cases(define) }
