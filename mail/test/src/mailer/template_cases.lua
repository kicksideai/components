-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local security = require("security")
local registry = require("registry")
local blocks = require("blocks")
local json = require("json")
local sql = require("sql")
local uuid = require("uuid")
local canonical_json = require("canonical_json")

local function register(support)
    local test = support.test
    local actors = support.actors
    local caller = support.caller
    local invoke = support.invoke
    local terminal = support.terminal
    local query = support.query
    local change = support.change
    local body = support.body
    local template_request = support.template_request
    local capture_with = support.capture_with
    local refusal = support.refusal
    local READER_POLICIES = support.READER_POLICIES
    local TOOL_NS = support.TOOL_NS

    test.it("returns a typed direct-body refusal when a live layout depends on a template cycle", function()
        local admin, sender, sender_id, log_admin = actors.admin, actors.sender, actors.sender_id, actors.log_admin
        capture_with(admin)
        local views = "kickside.mail.views:"
        local layout = views .. "layout"
        local targets = {
            {name = "/base/standard"},
            {name = "/base/plain", id = views .. "plain"},
            {name = "/part/header", id = views .. "header"},
            {name = "/message/notice", id = views .. "notice"},
        }
        local function apply(entries)
            local changes = assert(registry.snapshot()):changes()
            for _, entry in ipairs(entries) do assert(changes:update(entry)) end
            assert(changes:apply())
        end
        local function directive(word, destination)
            return '{{ ' .. word .. ' "' .. destination .. '" }}'
        end

        for _, word in ipairs({"extends", "import"}) do
            for _, target in ipairs(targets) do
                local originals, changed = {assert(registry.get(layout))}, {assert(registry.get(layout))}
                changed[1].data.source = directive(word, target.name)
                if target.id then
                    originals[2] = assert(registry.get(target.id))
                    changed[2] = assert(registry.get(target.id))
                    changed[2].data.source = directive(word, "/base/standard")
                end
                apply(changed)
                local returned, sent, err = pcall(invoke, sender, "send", body())
                apply(originals)
                assert(returned, tostring(sent))
                refusal(sent, err, errors.INTERNAL, "template_render_failed")
                local details = (err :: error):details()
                test.eq("html", details.face)
                test.eq("standard", details.resource.name)
                local diagnostic = details.engine_message
                assert(type(diagnostic) == "string", tostring(diagnostic))
                test.not_nil(diagnostic:find("template dependency cycle", 1, true), diagnostic)
                test.eq(0, #query("SELECT id FROM mail_message WHERE sender=$1", {sender_id}))
            end
        end

        local input = body()
        input.html = '<p>{{ extends "/base/standard" }}{{ import "/part/header" }}{{ import "/message/notice" }}</p>'
        local queued = assert(invoke(sender, "send", input))
        local delivered = terminal(log_admin, queued)
        test.eq("sent", delivered.status)
        local captured = assert(json.decode(delivered.provider_message_id))
        test.not_nil(captured.html:find("{{ extends", 1, true))
        test.not_nil(captured.html:find("{{ import", 1, true))
    end)

    test.it("refuses a Jet name with no declaration on send and preview", function()
        local admin, sender, editor = actors.admin, actors.sender, actors.editor
        capture_with(admin)
        local input = template_request()
        input.template = "undeclared"
        local sent, send_err = invoke(sender, "send", input)
        refusal(sent, send_err, errors.NOT_FOUND, "template_not_found")
        local preview, preview_err = invoke(editor, "preview", {template = input.template, vars = input.vars})
        refusal(preview, preview_err, errors.NOT_FOUND, "template_not_found")
    end)

    test.it("names missing, mistyped and unknown variables before rendering", function()
        local admin, sender, editor = actors.admin, actors.sender, actors.editor
        capture_with(admin)
        local input = template_request()
        local tests = {
            {variable = "vars"},
            {vars = "not an object", variable = "vars"},
            {vars = {"an array"}, variable = "vars"},
            {vars = {message = "Ready"}, variable = "subject"},
            {vars = {subject = false, message = "Ready"}, variable = "subject"},
            {vars = {subject = "Status", message = "Ready", typo = "extra"}, variable = "typo"},
            {vars = {subject = "Status", ["a/b~c"] = true}, variable = "a/b~c"},
            {vars = {subject = "Status", details = {{key = "State", value = 9}}}, variable = "details"},
        }
        for _, case in ipairs(tests) do
            input.vars = case.vars
            local sent, send_err = invoke(sender, "send", input)
            refusal(sent, send_err, errors.INVALID, "invalid_template_vars", case.variable)
            local preview, preview_err = invoke(editor, "preview", {template = input.template, vars = case.vars})
            refusal(preview, preview_err, errors.INVALID, "invalid_template_vars", case.variable)
        end
    end)

    test.it("delivers the packaged Header image to a sender without library access", function()
        local admin, sender, log_admin, editor = actors.admin, actors.sender, actors.log_admin, actors.editor
        capture_with(admin)
        local input = template_request()
        local preview = assert(invoke(editor, "preview", {template = input.template, vars = input.vars}))
        test.not_nil(preview.html:find('src="cid:mail-library-logo"', 1, true))
        test.is_nil(preview.text:find("cid:", 1, true))
        local uri = assert(preview.inline_assets["mail-library-logo"])
        test.eq("data:image/png;base64,", uri:sub(1, 22))
        local completed = terminal(log_admin, assert(invoke(sender, "send", input)))
        test.eq("sent", completed.status, tostring(completed.last_error and completed.last_error.message))
        local captured = assert(json.decode(completed.provider_message_id))
        test.eq(1, #captured.attachments)
        local logo = captured.attachments[1]
        test.eq("mail-library-logo", logo.content_id)
        test.eq("inline", logo.disposition)
        test.eq(uri, "data:" .. logo.content_type .. ";base64," .. logo.base64)
    end)

    test.it("previews without delivery settings and matches what send renders", function()
        local admin, sender, log_admin, editor = actors.admin, actors.sender, actors.log_admin, actors.editor
        local input = template_request()
        local preview = assert(invoke(editor, "preview", {template = input.template, vars = input.vars}))
        test.eq(input.vars.subject, preview.subject)
        test.not_nil(preview.html)
        test.not_nil(preview.text)
        test.is_nil(preview.attachments)

        capture_with(admin)
        local result = assert(invoke(sender, "send", input))
        local captured = assert(json.decode(terminal(log_admin, result).provider_message_id))
        for _, part in ipairs({"subject", "html", "text"}) do
            test.eq(captured[part], preview[part])
        end
    end)

    test.it("invokes the four registered tools as non-admin callers", function()
        local admin, sender = actors.admin, actors.sender
        local reader_policies = {table.unpack(READER_POLICIES)}
        reader_policies[#reader_policies + 1] = "kickside.mail.security:send_runtime"
        local reader = caller(reader_policies)
        local tool_sender = caller({
            "kickside.mail.security:module_access", "kickside.mail.security:module_runtime",
            "kickside.mail.security:library_access", "kickside.mail.security:send_access",
        })
        local input = template_request()
        local preview_input = {template = input.template, vars = input.vars}
        for _, executor in ipairs({reader, tool_sender}) do
            local list = assert(executor:call(TOOL_NS .. "mail_list_templates", {}))
            test.eq("notice", list.templates[1].name)
            test.is_nil(list.templates[1].variable_schema)
            test.is_nil(list.templates[1].sample)
            local info = assert(executor:call(TOOL_NS .. "mail_get_template", {template = "notice"}))
            test.eq("string", info.variable_schema.properties.subject.type)
            local missing, missing_err = executor:call(TOOL_NS .. "mail_get_template", {template = "undeclared"})
            refusal(missing, missing_err, errors.NOT_FOUND, "template_not_found")
        end
        local refused, send_err = reader:call(TOOL_NS .. "mail_send", input)
        refusal(refused, send_err, errors.PERMISSION_DENIED, "mail_send_denied")
        local absent, preview_err = sender:call(TOOL_NS .. "mail_preview", preview_input)
        refusal(absent, preview_err, errors.PERMISSION_DENIED, "mail_library_denied")
        local preview = assert(tool_sender:call(TOOL_NS .. "mail_preview", preview_input))
        test.eq(input.vars.subject, preview.subject)
        local invalid, invalid_err = tool_sender:call(TOOL_NS .. "mail_preview", {template = "notice", vars = {}})
        refusal(invalid, invalid_err, errors.INVALID, "invalid_template_vars", "subject")

        assert(change(admin, "driver", "app.mail_harness:admitted").success)
        assert(change(admin, "from_address", "mail@example.org").success)
        for _, message in ipairs({input, body()}) do
            local sent = assert(tool_sender:call(TOOL_NS .. "mail_send", message))
            local contract_result = assert(invoke(sender, "send", message))
            test.eq("queued", sent.status)
            test.eq("queued", contract_result.status)
            test.not_nil(sent.message_id)
            test.not_nil(contract_result.message_id)
            test.is_true(sent.message_id ~= contract_result.message_id)
            test.eq("sent", terminal(tool_sender, sent).status)
            test.eq("sent", terminal(sender, contract_result).status)
        end

        local full = assert(registry.get(TOOL_NS .. "mail"))
        local read_trait = assert(registry.get(TOOL_NS .. "mail_readonly"))
        test.is_true(full.meta.public)
        test.is_true(read_trait.meta.public)
        test.eq(4, #full.data.tools)
        test.eq(3, #read_trait.data.tools)
        test.eq(TOOL_NS .. "mail_send", full.data.tools[1])
        for i, tool in ipairs(read_trait.data.tools) do
            test.eq(full.data.tools[i + 1], tool)
        end
    end)

    test.it("discovers MailSend as a public Block and lowers its registered schema", function()
        local id = TOOL_NS .. "mail_send"
        local tool_sender = caller({
            "kickside.mail.security:module_runtime", "kickside.mail.security:send_access",
        })
        local result = assert(invoke(tool_sender, "blocks", body()))
        test.eq("tool", result.descriptor.source_kind)
        test.is_true(result.descriptor.tool)
        local entry = assert(registry.get(id))
        test.eq("MailSend", entry.meta.llm_alias)
        test.eq(assert(canonical_json.encode(assert(json.decode(entry.meta.input_schema)))),
            assert(canonical_json.encode(result.descriptor.input)))
        test.not_nil(result.descriptor.input.properties.attachments)
        test.eq("userspace.dataflow.node.func:node", result.plan.node_type)
        test.eq(id, result.plan.config.func_id)
        test.eq("userspace.dataflow.node.func:node", result.upstream_plan.node_type)
        test.eq(id, result.upstream_plan.config.func_id)
        test.is_nil(result.upstream_plan.config.input_transform)
        test.is_true(result.compiled.ok, json.encode(result.compiled.errors))
        local nodes = {}
        for _, command in ipairs(result.compiled.commands) do
            if command.type == "CREATE_NODE" then nodes[command.payload.node_id] = command.payload end
        end
        test.eq(id, nodes.deliver.config.func_id)
        test.not_nil(nodes.deliver.config.input_transform.default)
        test.eq(TOOL_NS .. "mail_preview", nodes.prepare.config.func_id)
        test.eq("deliver", nodes.prepare.config.data_targets[1].node_id)

        local definition = assert(registry.get("kickside.mail:mailer"))
        local send_schema = assert(json.decode(definition.data.methods[1].input_schemas[1].definition))
        local templated = template_request()
        templated.attachments = {{upload_id = "attachment-id"}}
        templated.to[2] = {user_id = "recipient-id"}
        for _, input in ipairs({body(), templated}) do
            local tool_valid, tool_schema_err = json.validate(result.descriptor.input, input)
            test.is_true(tool_valid, tostring(tool_schema_err))
            local contract_valid, contract_schema_err = json.validate(send_schema, input)
            test.is_true(contract_valid, tostring(contract_schema_err))
        end
    end)

    test.it("reports the conflict when a template and a supplied body are both present", function()
        local sender = actors.sender
        local input = template_request()
        input.text = "Conflicting body"
        local sent, err = invoke(sender, "send", input)
        refusal(sent, err, errors.INVALID, "template_body_conflict")
    end)

    test.it("resolves user recipients only under the caller's Users authority", function()
        local admin, sender, log_admin = actors.admin, actors.sender, actors.log_admin
        capture_with(admin)
        local db = assert(sql.get("app:db"))
        local id, blank = tostring(uuid.v4()), tostring(uuid.v4())
        local email = id .. "@example.org"
        assert(db:execute([[INSERT INTO app_users (user_id,email,full_name,password_hash,status)
            VALUES ($1,$2,'Recipient','test-only','active'),
                   ($3,$4,'No address','test-only','active')]], {id, email, blank, 'invalid-' .. blank}))
        db:release()

        local reader = caller({
            "kickside.mail.security:module_runtime", "kickside.mail.security:template_access",
            "kickside.mail.security:send_access", "app.mail_harness:principal_reader",
            "kickside.users.security:users_runtime_read", "kickside.users.security:login_db_access",
        })
        local input = body()
        input.to[2] = {user_id = id}
        input.to[3] = "reader@EXAMPLE.org"
        input.to[4] = "READER@example.org"
        input.cc = {"Cc@example.org", {user_id = id}, "Cc@EXAMPLE.org"}
        input.bcc = {{user_id = id}, "Cc@Example.org", "Bcc@example.org", "BCC@example.org"}
        local refused, err = invoke(sender, "send", input)
        refusal(refused, err, errors.PERMISSION_DENIED)
        local delivered = assert(reader:call(TOOL_NS .. "mail_send", input))
        local captured = assert(json.decode(terminal(log_admin, delivered).provider_message_id))
        test.eq("reader@example.org", captured.to[1])
        test.eq(email, captured.to[2])
        test.eq("READER@example.org", captured.to[3])
        test.eq(3, #captured.to)
        test.eq("Cc@example.org", captured.cc[1])
        test.eq(1, #captured.cc)
        test.eq("Bcc@example.org", captured.bcc[1])
        test.eq("BCC@example.org", captured.bcc[2])
        test.eq(2, #captured.bcc)

        for _, recipient in ipairs({blank, email}) do
            input.to[2] = {user_id = recipient}
            local missing, missing_err = invoke(reader, "send", input)
            refusal(missing, missing_err, errors.INVALID, "recipient_address_missing")
        end
    end)

    test.it("keeps driver selection and transport outside the sending group's public scope", function()
        local sender = actors.sender
        for _, operation in ipairs({"raw", "raw_send", "driver_validation"}) do
            local result, err = invoke(sender, operation, body())
            test.is_nil(result)
            test.eq(errors.PERMISSION_DENIED, err:kind())
        end
    end)
end

return {register = register}
