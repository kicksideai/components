-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local fixture = require("fixture")
local scoped = require("scoped")
local steps = require("steps")

local function post(session, board, method, body)
    return session.http("POST", session.route(board.id, method), body)
end

local function data(reply)
    assert(reply.status == 200, "HTTP " .. reply.status .. ": " .. tostring(reply.body.error))
    test.is_true(reply.body.success)
    return reply.body.data
end

local function define()
    test.describe("public Work API", function()
        test.it("refuses a rank command using a stale item version", function()
            local owner = scoped.admin()
            local board = scoped.board(owner)
            local moved = steps.create(board, "task", { title = "Moved" })
            local anchor = steps.create(board, "task", { title = "Anchor" })
            local old = data(post(owner, board, "get", { item = { id = moved } })).item
            steps.one(board, { op = "set", item = moved, values = { title = "Newer edit" } })
            local fresh = data(post(owner, board, "get", { item = { id = moved } })).item
            test.is_true(fresh.version > old.version)
            local result = data(post(owner, board, "apply", {
                ops = { { op = "rank", item = moved, after = anchor, expect_version = old.version } },
            }))
            test.eq(result.outcomes[1].status, "conflict")
        end)

        test.it("keeps the empty subgroup separate from a populated parent subgroup", function()
            local owner = scoped.admin()
            local board = scoped.board(owner)
            local parent = steps.create(board, "task", { title = "Parent" })
            steps.create(board, "task", { title = "Child" }, parent)
            local result = data(post(owner, board, "query", { group_by = "state", sub_group_by = "parent" }))
            test.eq(#result.groups, 1)
            test.eq(#result.groups[1].groups, 2)
            local occupied, empty
            for _, subgroup in ipairs(result.groups[1].groups) do
                if subgroup.items[1].parent == parent then occupied = subgroup else empty = subgroup end
            end
            test.not_nil(occupied)
            test.not_nil(empty)
            test.eq(occupied.value, parent)
            test.is_nil(empty.value)
        end)

        test.it("rejects an unsupported grouped cross-board query explicitly", function()
            local owner = scoped.admin()
            local first, second = scoped.board(owner), scoped.board(owner)
            steps.create(first, "task")
            steps.create(second, "task")
            local request = { boards = { first.id, second.id } }
            test.eq(#data(post(owner, first, "query", request)).items, 2)
            request.group_by = "state"
            local reply = post(owner, first, "query", request)
            test.eq(reply.status, 400)
            test.eq(reply.body.details.code, "invalid_query")
        end)

        test.it("pages only saved views readable on the requested board", function()
            local owner, reader = scoped.admin(), scoped.member()
            local other, board = scoped.board(owner), scoped.board(owner)
            assert(board.call("grant", { subject_id = reader.id, mask = 1 }))
            assert(other.call("grant", { subject_id = reader.id, mask = 1 }))
            local function save(session, on, title, personal)
                return data(post(session, on, "views", { title = title, personal = personal, view = { type = "list" } }))
            end
            save(reader, other, "Other board", true)
            save(owner, board, "Another caller's view", true)
            local mine = save(reader, board, "Requested board", true)
            local shared = save(owner, board, "Shared view", false)
            local page = data(post(reader, board, "list_views", { limit = 1 }))
            test.eq(#page.views, 1)
            test.eq(page.views[1].view_id, mine.view_id)
            test.not_nil(page.after)
            local next_page = data(post(reader, board, "list_views", { limit = 1, after = page.after }))
            test.eq(#next_page.views, 1)
            test.eq(next_page.views[1].view_id, shared.view_id)
            test.eq(next_page.views[1].view.type, "list")
            test.is_nil(next_page.after)
        end)

        test.it("returns an effective delete flag alongside write access", function()
            local owner, writer = scoped.admin(), scoped.member()
            local board = scoped.board(owner)
            local item = steps.create(board, "task")
            assert(board.call("grant", { subject_id = writer.id, mask = 3 }))
            local response = data(post(writer, board, "get", { item = { id = item } }))
            test.is_true(response.access.write)
            local denial = data(post(writer, board, "apply", { ops = { { op = "delete", item = item } } }))
            test.eq(denial.outcomes[1].status, "denied")
            test.eq(denial.outcomes[1].findings[1].code, "delete_denied")
            test.eq(response.access.delete, false)
            assert(board.call("grant", { subject_id = writer.id, mask = 7 }))
            local granted = data(post(writer, board, "get", { item = { id = item } })).access
            test.is_true(granted.delete)
            test.is_false(granted.admin)
        end)

        test.it("refuses to overwrite a comment with a stale comment version", function()
            local owner = scoped.admin()
            local board = scoped.board(owner)
            local item = steps.create(board, "task")
            local created = steps.one(board, { op = "comment", item = item, body = "Original" })
            local request = { item = { id = item } }
            local original = data(post(owner, board, "list_comments", request)).comments[1]
            steps.one(board, { op = "comment", item = item, comment = created.comment, body = "First edit" })
            local fresh = data(post(owner, board, "list_comments", request)).comments[1]
            test.is_true(fresh.version > original.version)
            local result = data(post(owner, board, "apply", {
                ops = { { op = "comment", item = item, comment = created.comment, body = "Stale edit", expect_comment_version = original.version } },
            }))
            test.eq(result.outcomes[1].status, "conflict")
            test.eq(result.outcomes[1].findings[1].code, "version_mismatch")
            local stale_delete = data(post(owner, board, "apply", {
                ops = { { op = "comment", item = item, comment = created.comment, delete = true, expect_comment_version = original.version } },
            }))
            test.eq(stale_delete.outcomes[1].status, "conflict")
            test.eq(data(post(owner, board, "list_comments", request)).comments[1].body, "First edit")
            local current_delete = data(post(owner, board, "apply", {
                ops = { { op = "comment", item = item, comment = created.comment, delete = true, expect_comment_version = fresh.version } },
            }))
            test.eq(current_delete.outcomes[1].status, "applied")
            test.eq(#data(post(owner, board, "list_comments", request)).comments, 0)
        end)

        test.it("resumes a rank-ordered card view with the new rank in the item delta", function()
            local owner = scoped.admin()
            local board = scoped.board(owner)
            local first = steps.create(board, "task")
            local second = steps.create(board, "task")
            local before = data(post(owner, board, "list_changes", {}))
            test.is_false(before.has_more)
            steps.one(board, { op = "rank", item = first, after = second })
            local point = data(post(owner, board, "get", { item = { id = first } })).item
            local delta = data(post(owner, board, "list_changes", { cursor = before.next }))
            test.eq(#delta.items, 1)
            test.eq(delta.items[1].item_id, first)
            test.eq(delta.items[1].op, "upsert")
            test.eq(delta.items[1].rank, point.rank)
        end)

        test.it("does not advertise a transition into a state whose WIP limit blocks the caller", function()
            local owner, writer = scoped.admin(), scoped.member()
            local declaration = fixture.declaration(fixture.fresh_prefix())
            declaration.fields[7] = { code = "access_level", type = "option", options = { { id = "internal" } } }
            declaration.item_types[3].fields[4] = "access_level"
            declaration.visibility = { field = "access_level", levels = { { id = "internal", holders = { { user = owner.id } } } }, bypass = "admin" }
            declaration.processes[1].states[2] = { id = "doing", category = "started" }
            declaration.processes[1].states[3] = { id = "staging", category = "started" }
            declaration.processes[1].transitions = {
                { id = "start", from = { "open" }, to = "doing" },
                { id = "via_staging", from = { "open" }, to = "staging" },
                { id = "enter_doing", from = { "staging" }, to = "doing", auto = true, default = true },
            }
            declaration.policy = { wip = { doing = { limit = 1, hard = true } } }
            local board = scoped.board(owner, declaration)
            local hidden = steps.create(board, "task", { access_level = "internal" })
            local visible = steps.create(board, "task")
            test.eq(steps.one(board, { op = "transition", item = hidden, transition = "start" }).status, "applied")
            assert(board.call("grant", { subject_id = writer.id, mask = 3 }))

            local counts = data(post(writer, board, "count", { where = { field = "state", op = "eq", value = "doing" } }))
            test.eq(counts.total, 0)
            local point = data(post(writer, board, "get", { item = { id = visible }, include = { "transitions" } }))
            local reply = data(post(writer, board, "apply", { ops = { { op = "transition", item = visible, transition = "start" } } }))
            test.eq(reply.outcomes[1].findings[1].code, "wip_limit")
            local routed = data(post(writer, board, "apply", { ops = { { op = "transition", item = visible, transition = "via_staging" } } }))
            test.eq(routed.outcomes[1].findings[1].code, "wip_limit")
            test.eq(#point.transitions, 0)
            local page = data(post(writer, board, "query", { include = { "transitions" } }))
            test.eq(#page.items, 1)
            test.eq(#page.items[1].transitions, 0)
        end)

        test.it("replays ranked card moves after atomic state and lane changes", function()
            local owner = scoped.admin()
            local declaration = fixture.declaration(fixture.fresh_prefix())
            declaration.processes[1].states[2] = { id = "doing", category = "started" }
            declaration.processes[1].transitions = { { id = "start", from = { "open" }, to = "doing" } }
            declaration.policy = { wip = { doing = { limit = 1, hard = false } } }
            local board = scoped.board(owner, declaration)
            local anchor = steps.create(board, "story", { priority = "p4" })
            steps.one(board, { op = "transition", item = anchor, transition = "start" })
            local card = steps.create(board, "story", { priority = "p4" })
            local before = data(post(owner, board, "list_changes", {})).next
            local offered = data(post(owner, board, "get", { item = { id = card }, include = { "transitions" } })).transitions
            test.eq(offered[1].id, "start")
            local moved = data(post(owner, board, "apply", { mode = "atomic", ops = {
                { op = "transition", item = card, transition = "start" },
                { op = "rank", item = card, before = anchor },
            } }))
            test.eq(moved.outcomes[1].status, "applied")
            test.eq(moved.outcomes[1].findings[1].code, "wip_limit")
            test.eq(moved.outcomes[2].status, "applied")
            local column = data(post(owner, board, "query", { where = { field = "state", op = "eq", value = "doing" }, group_by = "state" })).groups[1]
            test.eq(column.count, 2)
            test.eq(column.items[1].id, card)
            local state_delta = data(post(owner, board, "list_changes", { cursor = before }))
            test.eq(state_delta.items[1].state, "doing")
            test.eq(state_delta.items[1].rank, column.items[1].rank)
            local lane_move = data(post(owner, board, "apply", { mode = "atomic", ops = {
                { op = "set", item = card, values = { priority = "p0" } },
                { op = "rank", item = card, after = anchor },
            } }))
            test.eq(lane_move.outcomes[1].status, "applied")
            test.eq(lane_move.outcomes[2].status, "applied")
            local lane = data(post(owner, board, "query", { where = { field = "priority", op = "eq", value = "p0" }, group_by = "priority" })).groups[1]
            test.eq(lane.count, 1)
            test.eq(lane.items[1].id, card)
            local lane_delta = data(post(owner, board, "list_changes", { cursor = state_delta.next }))
            test.eq(lane_delta.items[1].rank, lane.items[1].rank)
            test.is_true(lane_delta.items[1].rank > column.items[2].rank)
        end)
    end)
end

return { run = test.run_cases(define) }
