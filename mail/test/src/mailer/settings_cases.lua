-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local security = require("security")
local registry = require("registry")
local config = require("config")

local function register(support)
    local test = support.test
    local actors = support.actors
    local caller = support.caller
    local invoke = support.invoke
    local change = support.change
    local body = support.body
    local refusal = support.refusal
    local unconfigured = support.unconfigured
    local READER_POLICIES = support.READER_POLICIES
    local TOOL_NS = support.TOOL_NS

    test.it("rejects malformed configured addresses before writing settings", function()
        local admin = actors.admin
        for _, case in ipairs({
            {key = "from_address", read = config.sender, reason = "from_address_invalid"},
            {key = "reply_to", read = config.reply_to, reason = "reply_to_invalid"},
        }) do
            local key = case.key
            local previous = change(admin, key, "mail@example.org")
            test.is_true(previous.success)
            local malformed = "mail@example"
            local result = change(admin, key, malformed)
            test.is_false(result.success)
            -- Settings validation returns a message and leaves the key revision intact.
            test.eq("Enter a valid email address", result.error)
            test.is_true(change(admin, key, "", previous.revision).success)
            local settings = {from_address = "mail@example.org", from_name = "", reply_to = ""}
            settings[key] = malformed
            local value, err = case.read(settings)
            test.is_nil(value)
            test.eq(errors.INVALID, assert(err):kind())
            test.eq("invalid_config", err:details().code)
            test.eq(case.reason, err:details().reason_code)
        end
    end)

    test.it("validates optional UTF-8 sender display names on write", function()
        local admin = actors.admin
        local name = string.rep("é", 255)
        test.is_true(change(admin, "from_name", name).success)
        for _, value in ipairs({"Name\u{0085}Next", "Name\u{2028}Next", "Name\u{2029}Next",
            "Name" .. string.char(255), name .. "é", 42}) do
            test.is_false(change(admin, "from_name", value).success)
        end
        test.is_true(change(admin, "from_name", "").success)
    end)

    test.it("returns the same configuration error through mailer and writable destination", function()
        local admin, sender = actors.admin, actors.sender
        local missing_driver = unconfigured(sender)
        local port = assert(registry.get("kickside.mail.sink:send_email"))
        test.is_nil(port.data.config_schema and port.data.config_schema.connection_id)
        local destination = assert(invoke(sender, "write", body()))
        test.is_false(destination.success)
        test.eq(missing_driver:details().code, destination.error.code)
        test.is_false(destination.error.retriable)
        test.is_true(change(admin, "driver", "app.mail_harness:admitted").success)
        test.eq(missing_driver:kind(), unconfigured(sender):kind())
        local tool_result, tool_err = sender:call(TOOL_NS .. "mail_send", body())
        refusal(tool_result, tool_err, errors.INVALID, "invalid_config")
        for key in pairs(tool_err:details()) do test.eq("code", key) end
        local workflow = assert(sender:with_context({
            run_context = {run_id = "example-run", flow_ref = {kind = "flow", id = "example-flow", version = 1}},
        }))
        local workflow_result, workflow_err = workflow:call(TOOL_NS .. "mail_send", body())
        refusal(workflow_result, workflow_err, errors.INVALID, "invalid_config")
        for key in pairs(workflow_err:details()) do test.eq("code", key) end
    end)

    test.it("refuses a caller without the send capability before looking up settings", function()
        local denied = actors.denied
        local result, err = invoke(denied, "send", body())
        test.is_nil(result)
        test.eq(errors.PERMISSION_DENIED, err:kind())
        local destination = assert(invoke(denied, "write", body()))
        test.eq("permission_denied", destination.error.code)
    end)

    test.it("discovers declared templates and exposes their variables and sample", function()
        local reader = caller(READER_POLICIES)
        local builtin = assert(invoke(reader, "list_templates"))
        test.eq(1, #builtin.templates)
        local external_reader = caller({
            "kickside.mail.security:library_access",
            "app.mail_harness:external_template",
        })
        local found = assert(invoke(external_reader, "list_templates"))
        test.eq(2, #found.templates)
        test.eq("notice", found.templates[1].name)
        test.eq("Notice", found.templates[1].title)
        test.not_nil(found.templates[1].description)
        test.eq("object", found.templates[1].variable_schema.type)
        test.eq("string", found.templates[1].variable_schema.properties.subject.type)
        test.is_nil(found.templates[1].sample)
        test.eq("reminder", found.templates[2].name)

        local reminder = assert(invoke(external_reader, "get_template", {template = "reminder"}))
        test.eq("Send the report", reminder.sample.task)
        test.eq("task", reminder.variable_schema.required[1])
        test.eq("Task to complete.", reminder.variable_schema.properties.task.description)
        local external_sender = caller({

            "kickside.mail.security:library_access", "app.mail_harness:external_template",
        })
        local preview = assert(invoke(external_sender, "preview", {template = "reminder", vars = {task = "A & B"}}))
        test.eq("Reminder: A & B", preview.subject)
    end)
end

return {register = register}
