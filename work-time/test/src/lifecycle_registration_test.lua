-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local registry = require("registry")
local scoped = require("scoped")
local steps = require("steps")
local test = require("test")

local PLUGIN = "kickside.work.time:plugin"

local function define()
    test.describe("Work Time lifecycle wiring", function()
        test.it("registers a Work-managed projection when a board enables Time", function()
            local admin = scoped.admin()
            local board = scoped.board(admin)
            local reply = admin.http("POST", "/" .. board.id .. "/apply_schema", {
                declaration = { plugins = { { use = PLUGIN } } },
            })
            test.eq(reply.status, 200, reply.raw)
            local projection: steps.PluginView? = nil
            steps.wait_for("Time attachment ready", function()
                local options = steps.call(board, "schema_options", {})
                for _, plugin in ipairs(options.plugins) do
                    if plugin.plugin == PLUGIN and plugin.lifecycle.state == "ready" then
                        projection = plugin
                        return true
                    end
                end
                return false
            end)
            local plugin = assert(projection)
            test.is_true(plugin.active)
            test.is_true(next(plugin.projections) ~= nil, "Work did not register a Time projection")
            for _, state in pairs(plugin.projections) do
                test.is_nil(state.error)
            end
        end)

        test.it("declares teardown on the attachment binding used by Work", function()
            local manifest = assert(registry.get(PLUGIN))
            local binding = assert(registry.get(manifest.meta.attachment :: string))
            local found = false
            for _, method in ipairs(binding.data.contracts) do
                if method.contract == "kickside.contract:deletable" then
                    found = type(method.methods.delete) == "string"
                end
            end
            test.is_true(found, "Time's attachment has no deletable callback")
        end)
    end)
end

return { run = test.run_cases(define) }
