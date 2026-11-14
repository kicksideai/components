-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local scoped = require("scoped")
local reconcile = require("reconcile")
local fixture = require("fixture")
local batch = require("batch")
local planner = require("planner")
local component = require("component")
local views = require("views")

local function define()
    test.describe("pack execution bounds", function()
        test.it("requires live ADMIN before a resumed view installation", function()
            assert(reconcile.trigger({ source = "pack_authority_test" }))
            local admin, member = scoped.admin(), scoped.member()
            local h = scoped.board(admin)
            assert(h.call("grant", { subject_id = member.id, mask = 3 }))
            local plan = assert(admin.call("pack_plan", { board_id = h.id, pack = "app:kanban_pack", expected_generation = 1 }))
            local _, err = member.call("pack_step", { board_id = h.id, operation_id = "resumed", actor_id = member.id,
                processed = 1, status = "running", counts = {}, data = { plan = plan, expected_generation = 1, starter = false } }, h.id)
            test.eq(#assert(h.call("list_views", {})).views, 0)
            test.not_nil(err)
            test.eq(err:kind(), errors.PERMISSION_DENIED)
        end)
        test.it("conflicts when a managed view changes after its reviewed revision", function()
            local h = fixture.board()
            local id = assert(h.call("create_view", { board_id = h.id, title = "View", view = { type = "list", columns = { "title" } } })).view_id
            local revision = assert(h.call("view_revision", { view_id = id }))
            assert(h.call("save_view", { view_id = id, view = { type = "list", columns = { "estimate" } } }))
            local _, err = h.call("pack_view", { view_id = id, revision = revision, request = { board_id = h.id, title = "Frozen", view = { type = "list", columns = { "labels" } } } })
            test.eq(assert(h.call("get_view", { view_id = id })).view.columns[1], "estimate")
            test.not_nil(err)
            test.eq(err:kind(), errors.CONFLICT)
        end)
        test.it("starts no resource effect after its enclosing deadline", function()
            local h = fixture.board()
            local plan = assert(h.call("pack_plan", { board_id = h.id, pack = "app:kanban_pack", expected_generation = 1 }))
            local before = assert(h.call("get_schema", {})).generation
            local done, err = h.call("pack_step", { board_id = h.id, operation_id = "expired", actor_id = h.actor:id(),
                processed = 0, status = "running", counts = {}, deadline = { at = "2000-01-01T00:00:00Z", ns = 0 },
                data = { plan = plan, expected_generation = 1, starter = false } })
            test.eq(assert(h.call("get_schema", {})).generation, before)
            test.is_nil(err, tostring(err))
            test.is_false(done)
        end)
    end)
end
return { run = test.run_cases(define) }
