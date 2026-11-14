-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local fixture = require("fixture")
local steps = require("steps")
local sql = require("sql")
local function define()
    test.describe("plugin lifecycle batches", function()
        test.it("continues lifecycle cleanup after a bounded projection page", function()
            local h = fixture.board()
            assert(h.call("apply_schema", { declaration = { plugins = { { use = "app:work_plugin" } } } }))
            steps.wait_for("attachment ready", function(): boolean
                for _, plugin in ipairs(assert(h.call("get_schema", {})).plugins) do
                    if plugin.plugin == "app:work_plugin" then return plugin.lifecycle.state == "ready" end
                end
                return false
            end)
            local events = steps.events(h)
            local head = events[#events].seq
            for i = 1, 205 do
                assert(h.call("contract_request", { contract = "kickside.core:threads", method = "register_projection", value = {
                    thread_id = h.id, kind = string.format("app:retired_%04d", i), projection_key = "kickside.work.plugin:app:work_plugin",
                    worker_ref = "func://app:plugin_projection_worker", worker_input_mode = "prefetch_events", events = { input = {} }, start_seq = head } }))
            end
            local registered = assert(h.call("plugin_projections", {}))
            local inspected = 0
            for _, cursor in ipairs(registered.cursors) do
                if cursor.projection_key == "kickside.work.plugin:app:work_plugin" then
                    test.eq(cursor.last_seq, head, "retired fixtures do not replay prior board facts")
                    inspected = inspected + 1
                end
            end
            test.eq(inspected, 205)
            local db = assert(sql.get("app:db"))
            assert(db:execute("UPDATE kickside_work_plugin SET applied_revision=0 WHERE board_id=$1", { h.id })); db:release()
            local result = assert(h.call("direct", { target = "kickside.work.extensions:plugin_batch", input = { board_id = h.id } }))
            test.eq(result.done, false)
            local remaining = assert(h.call("plugin_projections", {})).projections
            test.is_true(#remaining > 1)
            test.is_true(#remaining <= 205)
            result = assert(h.call("direct", { target = "kickside.work.extensions:plugin_batch", input = { board_id = h.id } }))
            test.is_true(result.done)
            for _, projection in ipairs(assert(h.call("plugin_projections", {})).projections) do
                test.is_true(projection.projection_key ~= "kickside.work.plugin:app:work_plugin")
            end
        end)
        test.it("converges a committed plugin intent in one lifecycle batch", function()
            local h = fixture.board()
            assert(h.call("apply_schema", { declaration = { plugins = { { use = "app:folding_plugin" } } } }))
            local result = assert(h.call("direct", { target = "kickside.work.extensions:plugin_batch", input = { board_id = h.id } }))
            test.is_true(result.done)
            test.eq(result.inspected, 1)
            local state
            for _, plugin in ipairs(assert(h.call("get_schema", {})).plugins) do if plugin.plugin == "app:folding_plugin" then state = plugin end end
            test.eq(state.lifecycle.state, "ready")
            test.not_nil(state.attachment_id)
        end)
    end)
end
return { run = test.run_cases(define) }
