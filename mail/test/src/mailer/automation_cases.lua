-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local library_fixtures = require("library_fixtures")
local security = require("security")
local registry = require("registry")
local json = require("json")

local function register(support)
    local test = support.test
    local actors = support.actors
    local now_ms = support.now_ms
    local caller = support.caller
    local invoke = support.invoke
    local await_message = support.await_message
    local terminal = support.terminal
    local query = support.query
    local change = support.change
    local body = support.body
    local template_request = support.template_request
    local capture_with = support.capture_with
    local refusal = support.refusal
    local TOOL_NS = support.TOOL_NS

    test.it("selects admitted binding IDs on the next send", function()
        local admin, sender, log_admin = actors.admin, actors.sender, actors.log_admin
        test.is_false(change(admin, "driver", "missing").success)
        for key, value in pairs({driver = "app.mail_harness:admitted", from_address = "mail@example.org",
            from_name = "Test Mail", reply_to = "default@example.org"}) do
            local result = change(admin, key, value)
            test.is_true(result.success, result.error :: string?)
        end
        local forbidden_from = body()
        forbidden_from.from = "other@example.org"
        local rejected, err = invoke(sender, "send", forbidden_from)
        test.is_nil(rejected)
        test.eq("from_not_allowed", err:details().code)
        local first = assert(invoke(sender, "send", body()))
        test.eq("first|mail@example.org|Test Mail|default@example.org", terminal(log_admin, first).provider_message_id)

        test.is_true(change(admin, "driver", "app.mail_harness:second").success)
        local second = assert(invoke(sender, "send", {
            template = "notice", vars = {subject = "Status", message = "Ready"},
            to = {"reader@example.org"}, reply_to = "override@example.org",
        }))
        test.eq("second|mail@example.org|Test Mail|override@example.org", terminal(log_admin, second).provider_message_id)
    end)

    test.it("returns the message ID as the writable destination reference", function()
        local admin, sender, log_admin = actors.admin, actors.sender, actors.log_admin
        test.is_true(change(admin, "driver", "app.mail_harness:admitted").success)
        test.is_true(change(admin, "from_address", "mail@example.org").success)
        local result = assert(invoke(sender, "write", body()))
        test.is_true(result.success)
        local replay = assert(invoke(sender, "write", body()))
        test.eq(result.dest_ref.message_id, replay.dest_ref.message_id)
        local message = await_message(log_admin, result.dest_ref.message_id, function(row) return row.status ~= "queued" end)
        test.eq("first|mail@example.org||", message.provider_message_id)
        test.eq("automation", message.origin.kind)
        test.eq("automation", message.origin.id)
        test.is_nil(result.dest_ref.provider_message_id)
        test.is_nil(result.dest_ref.transport_metadata)
    end)

    test.it("sends once per Sync identity and acknowledges deletes without sending", function()
        local admin, sender = actors.admin, actors.sender
        assert(change(admin, "driver", "app.mail_harness:admitted").success)
        assert(change(admin, "from_address", "mail@example.org").success)
        local port = assert(registry.get("kickside.mail.sink:send_email"))
        local request = {
            config = {}, sink_op = "upsert", input = body(), idempotency_key = "source-item-v1",
            identity_key = "source-item", origin = "automation",
            automation_ref = {kind = "automation", id = "automation", revision = 1},
        }
        local first = assert(invoke(sender, "write_request", request))
        test.is_true(first.success, tostring(first.error and first.error.message))
        test.eq("created", first.result)
        test.eq("sent", terminal(sender, {message_id = first.dest_ref.message_id, status = "queued"}).status)
        local replay = assert(invoke(sender, "write_request", request))
        test.eq(first.dest_ref.message_id, replay.dest_ref.message_id)

        request.dest_ref = first.dest_ref
        request.idempotency_key = "source-item-v2"
        local redelivery = assert(invoke(sender, "write_request", request))
        test.is_true(redelivery.success)
        test.eq(first.result, redelivery.result)
        test.eq(first.dest_ref.message_id, redelivery.dest_ref.message_id)

        request.idempotency_key = "source-item-v3"
        request.input.subject = "Changed source item"
        local changed = assert(invoke(sender, "write_request", request))
        test.is_true(changed.success)
        test.eq(first.result, changed.result)
        test.eq(first.dest_ref.message_id, changed.dest_ref.message_id)
        test.is_true(changed.dest_ref.content_changed)
        local changed_replay = assert(invoke(sender, "write_request", request))
        test.eq(changed.dest_ref.message_id, changed_replay.dest_ref.message_id)
        test.is_true(changed_replay.dest_ref.content_changed)

        request.input.subject = "Different content for the same delivery"
        local conflict = assert(invoke(sender, "write_request", request))
        test.is_false(conflict.success)
        test.eq("idempotency_conflict", conflict.error.code)
        test.is_false(conflict.error.retriable)

        request.input = assert(json.decode("{}"))
        request.idempotency_key = "source-item-v4"
        request.sink_op = "delete"
        local deleted = assert(invoke(sender, "write_request", request))
        test.is_true(deleted.success, tostring(deleted.error and deleted.error.message))
        test.eq("noop", deleted.result)
        test.is_nil(deleted.dest_ref)
        local logged = assert(invoke(sender, "list_messages", {limit = 10}))
        test.eq(1, #logged.items)
        test.not_nil(port.data.operations.upsert)
        test.not_nil(port.data.operations.delete)
    end)

    test.it("scopes automation receipts by origin and write operation", function()
        local admin, sender = actors.admin, actors.sender
        capture_with(admin)
        local request = {config = {}, sink_op = "upsert", input = body(),
            idempotency_key = "shared-delivery", origin = "first-source"}
        local first = assert(invoke(sender, "write_request", request))
        test.is_true(first.success, tostring(first.error and first.error.message))
        local replay = assert(invoke(sender, "write_request", request))
        test.eq(first.dest_ref.message_id, replay.dest_ref.message_id)
        request.origin = "second-source"
        local other = assert(invoke(sender, "write_request", request))
        test.is_true(other.success, tostring(other.error and other.error.message))
        test.neq(first.dest_ref.message_id, other.dest_ref.message_id)
        request.sink_op = "create"
        local direct = assert(invoke(sender, "write_request", request))
        test.is_true(direct.success, tostring(direct.error and direct.error.message))
        test.neq(other.dest_ref.message_id, direct.dest_ref.message_id)
    end)

    test.it("requires Send mail on delete and accepts a delete without a payload or key", function()
        local sender, denied = actors.sender, actors.denied
        local request = {
            config = {}, sink_op = "delete", origin = "automation",
            automation_ref = {kind = "automation", id = "automation", revision = 1},
        }
        local before = query("SELECT COUNT(*) AS count FROM mail_message")[1].count
        request.input, request.idempotency_key = {}, "delete-key"
        local forbidden = assert(invoke(denied, "write_request", request))
        test.is_false(forbidden.success)
        test.eq("permission_denied", forbidden.error.code)

        request.input, request.idempotency_key = nil, nil
        local deleted = assert(invoke(sender, "write_request", request))
        test.is_true(deleted.success, tostring(deleted.error and deleted.error.message))
        test.eq("noop", deleted.result)
        test.is_nil(deleted.dest_ref)
        request.sink_op = "replace"
        local unsupported = assert(invoke(sender, "write_request", request))
        test.is_false(unsupported.success)
        test.eq("unsupported_operation", unsupported.error.code)
        test.eq(before, query("SELECT COUNT(*) AS count FROM mail_message")[1].count)
    end)

    test.it("records display origin from module and workflow send surfaces", function()
        local admin, sender = actors.admin, actors.sender
        assert(change(admin, "driver", "app.mail_harness:admitted").success)
        assert(change(admin, "from_address", "mail@example.org").success)
        local input = body()
        input.origin = {kind = "module", id = "app:mail-example", label = "Example module"}
        local submitted = assert(invoke(sender, "send", input))
        local row = terminal(sender, submitted)
        test.eq("module", row.origin.kind)
        test.eq("app:mail-example", row.origin.id)
        test.eq("Example module", row.origin.label)
        test.is_nil(row.driver_id)

        local executor = assert(sender:with_context({
            run_context = {run_id = "example-run", flow_ref = {kind = "flow", id = "example-flow", version = 1,
                title = "Example workflow"}},
        }))
        local workflow = assert(executor:call(TOOL_NS .. "mail_send", body()))
        local entry = terminal(sender, workflow)
        test.eq("workflow", entry.origin.kind)
        test.eq("example-run", entry.origin.id)
        test.eq("Example workflow", entry.origin.label)

        local unresolved = assert(sender:with_context({
            run_context = {run_id = "unresolved-run", flow_ref = {kind = "flow", id = "unknown-workflow", version = 1}},
        }))
        local without_title = terminal(sender, assert(unresolved:call(TOOL_NS .. "mail_send", body())))
        test.eq("workflow", without_title.origin.kind)
        test.eq("unresolved-run", without_title.origin.id)
        test.eq("", without_title.origin.label)
    end)

    test.it("queues workflow mail with the run ID when no title is supplied", function()
        local admin, sender = actors.admin, actors.sender
        assert(change(admin, "driver", "app.mail_harness:admitted").success)
        assert(change(admin, "from_address", "mail@example.org").success)
        local executor = assert(sender:with_context({
            run_context = {run_id = "workflow-without-title", flow_ref = {kind = "flow", id = "example-flow", version = 1}},
        }))
        local queued, err = executor:call(TOOL_NS .. "mail_send", body())
        test.is_nil(err, tostring(err))
        local delivered = terminal(sender, assert(queued))
        test.eq("sent", delivered.status)
        test.eq("workflow-without-title", delivered.origin.id)
        test.eq("", delivered.origin.label)
    end)

    test.it("returns INVALID from both preview contracts for malformed input", function()
        local editor = actors.editor
        local native, native_err = invoke(editor, "preview", 5)
        local library, library_err = library_fixtures.call(editor, "preview", 5)
        refusal(native, native_err, errors.INVALID, "invalid_template")
        refusal(library, library_err, errors.INVALID, "invalid_mail_draft")
    end)

    test.it("finds recent senders and filters activity by the message name", function()
        local admin, sender, editor = actors.admin, actors.sender, actors.editor
        assert(change(admin, "driver", "app.mail_harness:admitted").success)
        assert(change(admin, "from_address", "mail@example.org").success)
        local input = template_request()
        input.origin = {kind = "module", id = "app:recent-senders", label = "Recent senders"}
        local since = now_ms()
        local first = assert(invoke(sender, "send", input))
        test.eq("sent", terminal(sender, first).status)
        local second = assert(invoke(sender, "send", input))
        test.eq("sent", terminal(sender, second).status)
        test.eq("sent", terminal(sender, assert(invoke(sender, "send", body()))).status)
        local page = assert(invoke(sender, "list_messages", {template = input.template, status = "sent", since = since, limit = 1}))
        test.eq(second.message_id, page.items[1].message_id)
        test.not_nil(page.next_cursor)
        local last = assert(invoke(sender, "list_messages", {template = input.template, since = since, cursor = page.next_cursor, limit = 1}))
        test.eq(first.message_id, last.items[1].message_id)
        test.is_false(last.has_more)
        local editor = caller({"kickside.mail.security:library_access"})
        local entry = assert(library_fixtures.call(editor, "get", {kind = "message", name = input.template}))
        local matching
        for _, used in ipairs(entry.used_by.recent_senders) do
            if used.origin and used.origin.id == input.origin.id then matching = used end
        end
        test.not_nil(matching)
        test.eq(2, matching.count)
        test.eq(last.items[1].sender, matching.sender)
    end)
end

return {register = register}
