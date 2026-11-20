-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local blocks = require("blocks")
local funcs = require("funcs")
local time = require("time")
local fixture = require("fixture")
local scoped = require("scoped")
local steps = require("steps")

local WAIT = "kickside.work.blocks:wait_for_item"

local function define()
    test.describe("Work Blocks", function()
        test.it("offers public tools as virtual Blocks", function()
            local catalog = assert(blocks.catalog())
            for _, name in ipairs({"find_items","get_item","apply","transition","comment","report",
                "bulk","bulk_status","cancel_bulk","plan_move","move","move_status"}) do
                local id = "kickside.work.traits:" .. name
                local current = catalog[id]
                test.not_nil(current); test.eq(current.source_kind, "tool"); test.is_true(current.public)
                local plan, err = blocks.plan({block_id=id,config={}})
                test.is_nil(err,tostring(err)); test.not_nil(plan)
            end
            local report, err = blocks.plan({ block_id = "kickside.work.traits:report", config = { kind = "progress" } })
            assert(report, tostring(err))
            test.eq(report.config.func_id, "kickside.work.traits:report")
            test.contains(report.config.input_transform.default, "progress")
        end)
        test.it("lowers an item wait with its deadline as Block configuration", function()
            local catalog = assert(blocks.catalog())
            test.not_nil(catalog[WAIT])
            local plan, err = blocks.plan({ block_id = WAIT, config = { timeout_ms = 2000 } })
            assert(plan, tostring(err))
            test.eq(plan.config.func_id, "kickside.work.blocks:wait")
            test.eq(plan.config.args.config.timeout_ms, 2000)
        end)

        test.it("checks current state and wakes on a target change under the caller's READ access", function()
            local h = scoped.board(scoped.admin(), fixture.workflow(fixture.fresh_prefix()))
            local item = steps.create(h, "task", { title = "Target" })
            local other = steps.create(h, "task", { title = "Other" })
            local reader = scoped.member()
            assert(h.call("grant", { subject_id = reader.id, mask = 1 }))
            local client = funcs.new():with_actor(reader.actor):with_scope(reader.scope)
            local input = { board_id = h.id, item = item, state = "todo" }
            local first, err = client:call("kickside.work.blocks:wait", { input = input, config = { timeout_ms = 5000 } })
            assert(first, steps.detail(err)); test.eq(first.status, "matched")
            test.eq(first.item.id, item); test.eq(first.item.state, "todo")

            input.state, input.cursor = "canceled", first.cursor
            local pending = assert(client:async("kickside.work.blocks:wait", { input = input, config = { timeout_ms = 5000 } }))
            time.sleep("100ms")
            test.eq(steps.one(h, { op = "transition", item = other, transition = "cancel" }).status, "applied")
            test.eq(steps.one(h, { op = "transition", item = item, transition = "cancel" }).status, "applied")
            assert(pending:response():receive())
            local result, wait_err = pending:result()
            assert(result, steps.detail(wait_err))
            local matched = result:data()
            test.eq(matched.status, "matched"); test.eq(matched.item.id, item)
            test.eq(matched.item.state, "canceled")
            test.is_true(matched.cursor.seq > first.cursor.seq)

            input.state, input.cursor = "doing", matched.cursor
            local access_stamp = input.cursor.access
            input.cursor.access = "outdated-access"
            local timed = assert(client:call("kickside.work.blocks:wait", { input = input, config = { timeout_ms = 100 } }))
            test.eq(timed.status, "timed_out"); test.is_nil(timed.item)
            test.eq(timed.cursor.access, access_stamp)
            local outsider = scoped.member()
            local denied, denial = funcs.new():with_actor(outsider.actor):with_scope(outsider.scope):call(
                "kickside.work.blocks:wait", { input = input, config = { timeout_ms = 100 } })
            test.is_nil(denied); test.not_nil(denial)
        end)

        test.it("requires item visibility even with board READ", function()
            local declaration = fixture.declaration(fixture.fresh_prefix())
            declaration.fields[#declaration.fields + 1] = { code = "level", form = "text", index = "key" }
            local task = declaration.item_types[3]
            task.fields[#task.fields + 1] = "level"
            declaration.visibility = { field = "level", levels = { { id = "hidden", holders = {} } } }
            local h = scoped.board(scoped.admin(), declaration)
            local item = steps.create(h, "task")
            test.eq(steps.one(h, { op = "set", item = item, values = { level = "hidden" } }).status, "applied")
            local reader = scoped.member()
            assert(h.call("grant", { subject_id = reader.id, mask = 1 }))
            local result, err = funcs.new():with_actor(reader.actor):with_scope(reader.scope):call(
                "kickside.work.blocks:wait", { input = { board_id = h.id, item = item, state = "open" } })
            test.is_nil(result)
            test.eq(err:kind(), errors.NOT_FOUND)
            test.eq(err:details().code, "item_not_found")
        end)
    end)
end
return { run = test.run_cases(define) }
