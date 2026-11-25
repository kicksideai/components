-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local funcs = require("funcs")
local fixture = require("fixture")
local scoped = require("scoped")
local steps = require("steps")
local test = require("test")

local function subject()
    local admin = scoped.admin()
    local board = scoped.board(admin, { key_prefix = fixture.fresh_prefix() }, "kickside.work.planning:pack")
    local sprint = steps.create(board, "sprint", { name = "Period", planning_start = "2026-11-01", planning_end = "2026-11-14" })
    local item = steps.create(board, "issue", { current_sprint = { board = board.id, item = sprint } })
    return admin, board, sprint, item
end

local function resolve(admin, board, item, interleave)
    return funcs.new():with_actor(admin.actor):with_scope(admin.scope):with_context(interleave)
        :call("kickside.work.planning.api:handle_resolve", { board_id = board.id, item = item, work_date = "2026-11-10" })
end

return { run = test.run_cases(function()
    test.describe("Planning sprint reference snapshots", function()
        test.it("resolves the same sprint across a committed index rebuild", function()
            local admin, board, sprint, item = subject()
            local result, err = resolve(admin, board, item, { sprint_reference_rebuild_through = item })
            assert(result, steps.detail(err))
            test.eq(result.sprint_id, sprint)
        end)

        test.it("refuses to resolve across a committed sprint date change", function()
            local admin, board, sprint, item = subject()
            local result, err = resolve(admin, board, item, { sprint_reference_edit_sprint = sprint })
            test.is_nil(result)
            test.eq(assert(err):details().code, "planning_snapshot_stale")
        end)
    end)
end) }
