-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local registry = require("registry")
local test = require("test")

local function cases()
    test.it("declares closed schemas for every library input event and a component-owned fold", function()
        local binding = assert(registry.get("kickside.mail.binding:library"))
        local expected = {
            ["resource.created"] = "created", ["resource.updated"] = "edited",
            ["resource.base_set"] = "base_changed", ["resource.reset"] = false,
            ["resource.restored"] = "restored", ["resource.archived"] = "archived",
            ["resource.deleted"] = "deleted", ["asset.added"] = false,
            ["asset.restored"] = "restored", ["asset.removed"] = "deleted",
        }
        for _, input in ipairs(binding.meta.events.input) do
            local name = input.type:match("^kickside%.mail%.events:(.+)$")
            test.not_nil(expected[name])
            local declaration = assert(registry.get(input.type))
            test.eq("kickside.core.threads.event", declaration.meta.type)
            local schema = declaration.data.schema
            test.eq(false, schema.additionalProperties)
            test.not_nil(schema.properties.key)
            test.not_nil(schema.properties.revision)
            if expected[name] then test.eq(expected[name], schema.properties.change.const) end
            if name == "resource.reset" then
                test.eq("reset", schema.properties.change.enum[1])
                test.eq("restored", schema.properties.change.enum[2])
                test.not_nil(schema.properties.from_seq)
                test.not_nil(schema.properties.from_version)
            end
            if name == "resource.created" or name == "resource.updated" or name == "resource.base_set"
                or name == "resource.reset" or name == "resource.restored" then
                local required = {}
                for _, field in ipairs(schema.required) do required[field] = true end
                for _, field in ipairs({"content", "state", "change"}) do
                    test.is_true(required[field], name .. " needs " .. field)
                end
                test.eq(false, schema.properties.content.additionalProperties)
            end
            expected[name] = nil
        end
        test.is_nil(next(expected))
        test.eq(0, #binding.meta.events.output)
        test.eq(365, binding.meta.retention.event_days)
        local projection = binding.meta.projections[1]
        test.eq("kickside.mail:library_tables", projection.kind)
        test.eq("prefetch_events", projection.input_mode)
        local worker = assert(registry.get(assert(projection.worker_ref:match("^func://(.+)$"))))
        test.eq("projection.worker", worker.meta.type)
        test.eq(true, worker.meta.private)
        test.eq(true, worker.meta.component_owned)
        test.is_nil(worker.meta.post_commit_ref)
        test.is_nil(worker.data.security.groups)
        for _, id in ipairs(worker.data.security.policies) do
            local policy = assert(registry.get(id))
            test.eq(true, policy.meta.service_only)
            test.is_nil(policy.data.groups)
        end
    end)
end

return {run = test.run_cases(function()
    test.describe("Mail library projection declarations", cases)
end)}
