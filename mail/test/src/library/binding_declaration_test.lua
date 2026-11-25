-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local registry = require("registry")
local test = require("test")
local resource = require("resource")

local function cases()
    test.it("keeps Settings list access inside the Mail driver selection reader", function()
        local grant = "kickside.mail.security:settings_admin_read"
        for _, id in ipairs({"kickside.mail.binding:mailer_send", "kickside.mail.binding:mailer_resend",
            "kickside.mail.binding:mailer_send_delivery_test", "kickside.mail.binding:library_send_test",
            "kickside.mail.binding:mailer_delivery_status", "kickside.mail.delivery:deliver"}) do
            for _, policy in ipairs(assert(registry.get(id)).data.security.policies) do
                test.neq(grant, policy, id)
            end
        end
        local reader = assert(registry.get("kickside.mail.read:driver_selection"))
        test.is_true(reader.meta.private)
        test.is_nil(reader.data.security.groups)
        test.eq(grant, reader.data.security.policies[2])
    end)

    test.it("mounts the publication fixture through Mail's declared library requirement", function()
        local adapter = assert(registry.get("kickside.mail:live_registry"))
        test.eq("ns.requirement", adapter.kind)
        test.eq("kickside.mail.render:live", adapter.data.default)
        local publisher = assert(registry.get("kickside.mail.command:live"))
        test.eq("app.mail_library:projection_fault", publisher.data.imports.live)
        for _, id in ipairs(assert(registry.get("kickside.mail.jobs:library_sync")).data.security.policies) do
            test.is_nil(id:match("^app[.:]"), id)
        end
    end)

    test.it("provisions library editors solely through the installed host grant", function()
        local binding = assert(registry.get("kickside.mail.binding:library"))
        local grants = {}
        for _, grant in ipairs(binding.meta.provision.grants) do
            grants[grant.subject_id] = grant.access_mask
        end
        test.eq(3, grants["app:mail_editors"])
        test.is_nil(grants["wippy.test:runner"])
    end)

    test.it("uses Jobs' published consumer policy for Mail job producers and workers", function()
        local public = "kickside.core.jobs.security:module_access"
        local writer = assert(registry.get("kickside.mail.binding:library_create"))
        local consumer = assert(registry.get("kickside.mail.security:jobs_consumer_composition"))
        test.eq(consumer.data.group_id, writer.data.security.groups[1])
        test.eq(public, consumer.data.policies[1])
        for _, policy in ipairs(writer.data.security.policies) do
            test.is_nil(policy:match("^kickside%.core%.jobs[.:]"), policy)
        end
        for _, id in ipairs({"kickside.mail.binding:mailer_send", "kickside.mail.delivery:deliver"}) do
            local entry = assert(registry.get(id))
            local found = false
            for _, policy in ipairs(entry.data.security.policies) do
                if policy:match("^kickside%.core%.jobs[.:]") then
                    test.eq(public, policy, id)
                    found = true
                end
            end
            test.is_true(found, id)
        end
    end)

    test.it("limits the public Core composition to one private projection waiter", function()
        local id = "kickside.mail.security:core_consumer"
        local composition = assert(registry.get(id .. "_composition"))
        test.eq(id, composition.data.group_id)
        test.eq(1, #composition.data.policies)
        test.eq("kickside.core.security:module_access", composition.data.policies[1])
        test.is_nil(composition.data.groups)

        local wait = "kickside.mail.command:catch_up"
        local seen = 0
        for _, entry in ipairs(assert(registry.find({[".kind"] = "function.lua"}))) do
            local frame = entry.data.security
            if frame then
                for _, group in ipairs(frame.groups or {}) do
                    if group == id then
                        test.eq(wait, entry.id)
                        test.is_true(entry.meta.private)
                        test.is_nil(frame.actor)
                        seen = seen + 1
                    end
                end
            end
        end
        test.eq(1, seen)
        local member = assert(registry.get("kickside.mail.security:library_projection_wait"))
        test.eq(wait, member.data.policy.resources[1])
        test.eq(1, #member.data.policy.resources)
        test.eq(0, #(member.data.groups or {}))
    end)

    test.it("declares closed schemas for every library input event and a component-owned fold", function()
        local binding = assert(registry.get("kickside.mail.binding:library"))
        test.eq("tabler:mail", binding.meta.icon)
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
            test.eq(resource.MAX_NOTE_LENGTH, schema.properties.note.maxLength, name)
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
