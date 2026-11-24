-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local registry = require("registry")
local scoped = require("scoped")
local test = require("test")

local PLUGIN = "kickside.work.time:plugin"

local function define()
    test.describe("Work Time worklog events", function()
        test.it("declares both system-only outputs on the activated Time attachment", function()
            local admin = scoped.admin()
            local board = scoped.board(admin)
            local route = "/" .. board.id
            local activated = admin.http("POST", route .. "/apply_schema", {
                declaration = { plugins = { { use = PLUGIN } } },
            })
            test.eq(activated.status, 200, activated.raw)
            local schema = admin.http("POST", route .. "/get_schema", {})
            test.eq(schema.status, 200, schema.raw)
            local active = schema.body.data.plugins[1]
            test.eq(active.plugin, PLUGIN)
            test.is_true(active.active)
            test.not_nil(active.attachment_id)

            local manifest = assert(registry.get(PLUGIN))
            local binding = assert(registry.get(manifest.meta.attachment :: string))
            test.eq(binding.kind, "contract.binding")
            local events = binding.meta.events
            test.not_nil(events, "the activated Time attachment binding must declare its event policy")
            test.eq(events.read, "admin")
            local system_only: { [string]: boolean } = {}
            for _, output in ipairs(events.output) do
                local id = output.type :: string
                local name = assert(id:match(":([^:]+)$"))
                system_only[name] = output.system_only == true
            end
            test.eq(system_only["worklog.changed"], true)
            test.eq(system_only["time.over_estimate"], true)
            for name, field in pairs({
                worklog_changed_port = "worklog.changed", over_estimate_port = "time.over_estimate",
            }) do
                local prefix = "kickside.work.time.events:"
                local port = assert(registry.get(prefix .. name))
                test.eq(port.meta.type, "kickside.automation.port")
                test.eq(port.data.binding, manifest.meta.attachment)
                test.eq(port.data.event, prefix .. field)
            end
        end)
    end)
end

return { run = test.run_cases(define) }
