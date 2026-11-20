-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local fixture = require("fixture")
local steps = require("steps")
type Map = { [string]: unknown }
local function tool(h: fixture.Handle, name: string, args: Map): Map
    local result, err = h.executor:with_context({ board_id = h.id }):call("kickside.work.traits:" .. name, args)
    assert(not err, name .. ": " .. steps.detail(err))
    test.is_true(result.success, name)
    return result :: Map
end
local function define()
    test.describe("Work full agent surface", function()
        test.it("binds WorkGetItem keys to an explicit board or the board in context", function()
            local a, b = fixture.board(), fixture.board()
            assert(b.call("grant", { subject_id = a.actor:id(), mask = 1 }))
            local id = steps.create(b, "task")
            local key = assert(steps.get(b, id)).item.key
            local args = { item = { key = key } }
            local found = assert(a.executor:call("kickside.work.traits:get_item", args))
            test.eq(found.item.id, id)
            test.eq(tool(a, "get_item", { board_id = b.id, item = args.item }).item.id, id)
            local function expect_missing(input: Map, in_context: boolean)
                local executor = in_context and a.executor:with_context({ board_id = a.id }) or a.executor
                local _, err = executor:call("kickside.work.traits:get_item", input)
                test.not_nil(err)
                test.eq(err:kind(), errors.NOT_FOUND)
                test.eq(err:details().code, "item_not_found")
            end
            expect_missing({ board_id = a.id, item = args.item }, false)
            expect_missing(args, true)
        end)

        test.it("reads boards, history, intervals, links, comments, changes and packs", function()
            local h = fixture.board()
            local item = steps.create(h, "task", { title = "Visible answer" })
            steps.one(h, { op = "comment", item = item, body = "Visible comment" })
            local boards = tool(h, "list_boards", {}).boards
            test.eq(#boards, 1); test.eq(boards[1].board_id, h.id)
            test.eq(tool(h, "count", {}).total, 1)
            test.is_true(#tool(h, "list_history", { item = { id = item } }).entries > 0)
            test.eq(tool(h, "get_time_in_state", { item = { id = item } }).field, "state")
            test.eq(#tool(h, "list_links", { item = { id = item } }).links, 0)
            test.eq(tool(h, "list_comments", { item = { id = item } }).comments[1].body, "Visible comment")
            test.eq(tool(h, "list_changes", {}).items[1].item_id, item)
            test.is_true(#tool(h, "list_packs", {}).packs > 0)
        end)
        test.it("creates, lists, reads, runs, saves, renames and deletes saved views", function()
            local h = fixture.board()
            local item = steps.create(h, "task", { title = "Saved view item" })
            local view = tool(h, "create_view", { title = "Agent view", view = { type = "list" } }).view_id
            test.eq(tool(h, "list_views", {}).views[1].view_id, view)
            test.eq(tool(h, "get_view", { view_id = view }).board_id, h.id)
            test.eq(tool(h, "run_view", { view_id = view }).items[1].id, item)
            tool(h, "save_view", { view_id = view, view = { type = "list", columns = { "title" } } })
            test.eq(tool(h, "get_view", { view_id = view }).view.columns[1], "title")
            local other = fixture.board()
            assert(other.call("grant", { subject_id = h.actor:id(), mask = 1 }))
            local next_item = steps.create(other, "task", { estimate = 2 })
            steps.one(h, { op = "set", item = item, values = { estimate = 1 } })
            tool(h, "save_view", { view_id = view, view = { type = "list", boards = { h.id, other.id }, order = { field = "estimate" } } })
            test.eq(tool(h, "get_view", { view_id = view }).view.boards[2], other.id)
            local page = tool(h, "run_view", { view_id = view, limit = 1 })
            test.eq(page.items[1].id, item)
            test.not_nil(page.cross_after)
            page = tool(h, "run_view", { view_id = view, limit = 1, cross_after = page.cross_after })
            test.eq(page.items[1].id, next_item)
            assert(other.call("revoke", { subject_id = h.actor:id() }))
            test.eq(tool(h, "list_views", {}).views[1].status, "unavailable")
            tool(h, "rename_view", { view_id = view, title = "Renamed agent view" })
            assert(other.call("grant", { subject_id = h.actor:id(), mask = 1 }))
            test.eq(tool(h, "get_view", { view_id = view }).title, "Renamed agent view")
            test.eq(tool(h, "delete_view", { view_id = view }).view_id, view)
        end)
        test.it("starts, reads and cancels bulk updates and plans, moves and reads a subtree move", function()
            local h, target = fixture.board(), fixture.board()
            assert(target.call("grant", { subject_id = h.actor:id(), mask = 3 }))
            local item = steps.create(h, "task", { title = "Move me" })
            local bulk = tool(h, "bulk", { key = "agent-bulk", query = {}, ops_template = { { op = "set", values = { title = "Bulk title" } } } })
            test.not_nil(bulk.bulk_id)
            test.eq(tool(h, "bulk_status", { bulk_id = bulk.bulk_id }).bulk_id, bulk.bulk_id)
            test.eq(tool(h, "cancel_bulk", { bulk_id = bulk.bulk_id }).bulk_id, bulk.bulk_id)
            steps.wait_for("bulk cancellation", function(): boolean
                local status = tool(h, "bulk_status", { bulk_id = bulk.bulk_id }).status
                return status == "done" or status == "cancelled"
            end)
            steps.create(target, "task", { title = "Target progress" })
            local target_bulk = tool(target, "bulk", { key = "target-progress", query = {}, ops_template = { { op = "set", values = { title = "Target updated" } } } })
            steps.wait_for("target bulk completion", function(): boolean return tool(target, "bulk_status", { bulk_id = target_bulk.bulk_id }).status == "done" end)
            local request = { item = item, to_board = target.id, key = "agent-move", map = {
                type = { task = "task" }, state = { open = "open" },
                fields = { title = "title", estimate = "estimate", labels = "labels" }, relations = {},
            } }
            test.is_true(tool(h, "plan_move", request).allowed)
            local moved = tool(h, "move", request)
            test.not_nil(moved.move_id)
            test.eq(tool(h, "move_status", { move_id = moved.move_id }).move_id, moved.move_id)
            steps.wait_for("tool move", function(): boolean return tool(h, "move_status", { move_id = moved.move_id }).status == "done" end)
            moved=tool(h,"move_status",{move_id=moved.move_id})
            test.not_nil(assert(target.call("get", { item = { id = moved.item } })).item)
        end)
        test.it("creates and configures boards, applies schemas and installs packs", function()
            local h = fixture.board()
            local created = tool(h, "create_board", { idempotency_key = "agent-created", title = "Agent board" })
            local id = created.board_id
            test.not_nil(id)
            tool(h, "update_board", { board_id = id, title = "Updated agent board" })
            local prefix = fixture.fresh_prefix()
            test.not_nil(tool(h, "plan_schema", { board_id = id, declaration = fixture.declaration(prefix) }).class)
            tool(h, "apply_schema", { board_id = id, declaration = fixture.declaration(prefix) })
            test.eq(tool(h, "get_schema", { board_id = id }).key_prefix, prefix)
            test.eq(tool(h, "get_schema", {}).key_prefix, h.prefix)
            assert(h.call("apply_schema", { declaration = { plugins = { { use = "app:trait_plugin" } } } }))
            test.not_nil(tool(h, "configure_plugin", { plugin = "app:trait_plugin", config = {} }).attachment_id)
            local empty = tool(h, "create_board", { idempotency_key = "agent-packed", title = "Packed" })
            local request = { board_id = empty.board_id, pack = "app:numeric_pack", expected_generation = empty.generation, key = "agent-install" }
            test.not_nil(tool(h, "pack_plan", request).digest)
            test.eq(tool(h, "pack_apply", request).status, "done")
            test.not_nil(tool(h, "get_schema", { board_id = empty.board_id }).compiled)
            local fleet = tool(h, "list_pack_boards", { pack = "app:numeric_pack" })
            test.eq(#fleet.boards, 1)
            test.eq(fleet.boards[1].board_id, empty.board_id)
            test.eq(#tool(fixture.board(), "list_pack_boards", { pack = "app:numeric_pack" }).boards, 0)
            local from_pack = tool(h, "create_board", { idempotency_key = "agent-pack-create", pack = "app:numeric_pack", starter = false })
            test.not_nil(from_pack.board_id)
        end)
        test.it("records approval and automated reports through the item contract", function()
            local d = fixture.declaration(fixture.fresh_prefix())
            d.processes = { { id = "delivery", initial = "review", states = {
                { id = "review", category = "started", kind = "gate", release_when = { approvals = { min = 1, from = { group = "app.security:work_test" } } } },
                { id = "done", category = "completed" },
            }, transitions = { { id = "release", from = { "review" }, to = "done", auto = true, default = true } } } }
            local h = fixture.board({ declaration = d })
            local item = steps.create(h, "task")
            test.eq(tool(h, "approve", { item = item, visit = 1 }).outcomes[1].status, "applied")
            test.eq(assert(steps.get(h, item)).item.state, "done")
            local stage = fixture.declaration(fixture.fresh_prefix())
            stage.processes = { { id = "delivery", initial = "build", states = {
                { id = "build", category = "started", kind = "automated", run = { stage = "build", on_fail = "failed" } },
                { id = "done", category = "completed" }, { id = "failed", category = "canceled" },
            }, transitions = { { id = "passed", from = { "build" }, to = "done" }, { id = "failed", from = { "build" }, to = "failed" } } } }
            local automated = fixture.board({ declaration = stage })
            local run = steps.create(automated, "task")
            test.eq(tool(automated, "report", { item = run, visit = 1, attempt = 1, outcome = "passed" }).outcomes[1].status, "applied")
            test.eq(assert(steps.get(automated, run)).item.state, "done")
        end)
        test.it("returns the contract's exact access errors for read, write and administration classes", function()
            local h, outsider, reader, writer = fixture.board(), fixture.board(), fixture.board(), fixture.board()
            assert(h.call("grant", { subject_id = reader.actor:id(), mask = 1 }))
            assert(h.call("grant", { subject_id = writer.actor:id(), mask = 3 }))
            for _, case in ipairs({
                { h = outsider, tool = "get_schema", method = "get_schema", args = {} },
                { h = reader, tool = "apply", method = "apply", args = { ops = { { op = "create", type = "task" } } } },
                { h = writer, tool = "schema_options", method = "schema_options", args = {} },
                { h = writer, tool = "resume_migration", method = "resume_migration", args = {} },
                { h = writer, tool = "plan_schema", method = "plan_schema", args = { declaration = {} } },
            }) do
                case.args.board_id = h.id
                local _, direct = case.h.call(case.method, case.args)
                local _, wrapped = case.h.executor:call("kickside.work.traits:" .. case.tool, case.args)
                test.eq(wrapped:kind(), errors.PERMISSION_DENIED)
                test.eq(wrapped:kind(), direct:kind()); test.eq(wrapped:details().code, direct:details().code)
            end
        end)
    end)
end
return { run = test.run_cases(define) }
