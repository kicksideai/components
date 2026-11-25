-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local security = require("security")
local json = require("json")
local time = require("time")
local jobs = require("jobs")

local function register(support)
    local test = support.test
    local actors = support.actors
    local caller = support.caller
    local invoke = support.invoke
    local await_message = support.await_message
    local terminal = support.terminal
    local query = support.query
    local persisted = support.persisted
    local no_body = support.no_body
    local await_job = support.await_job
    local change = support.change
    local body = support.body
    local capture_with = support.capture_with
    local refusal = support.refusal

    test.it("stores provider details on retry and failure for log administrators only", function()
        local admin, sender, log_admin = actors.admin, actors.sender, actors.log_admin
        capture_with(admin)
        local admin_view = caller({"kickside.mail.security:log_admin"})
        local input = body()
        input.subject = "Fixture detail"
        local admitted = assert(invoke(sender, "send", input))
        local retry = await_message(sender, admitted.message_id, function(row) return row.last_error ~= nil end)
        test.eq("queued", retry.status)
        test.is_nil(retry.last_error.provider_detail)
        local pending = assert(invoke(admin_view, "get_message", admitted.message_id))
        test.eq("Upstream retry diagnostic", pending.last_error.provider_detail)
        local failed = terminal(sender, admitted)
        test.eq("failed", failed.status)
        test.is_nil(failed.last_error.provider_detail)
        local sender_items = assert(invoke(sender, "list_messages", {limit = 5, status = "failed"})).items
        test.eq(admitted.message_id, sender_items[1].message_id)
        test.is_nil(sender_items[1].last_error.provider_detail)
        test.eq("message_rejected", sender_items[1].last_error.code)
        local final = assert(invoke(admin_view, "get_message", admitted.message_id))
        test.eq("Upstream refusal diagnostic", final.last_error.provider_detail)
        local items = assert(invoke(admin_view, "list_messages", {limit = 200, status = "failed"})).items
        for _, row in ipairs(items) do
            if row.message_id == admitted.message_id then
                test.eq("Upstream refusal diagnostic", row.last_error.provider_detail)
                return
            end
        end
        error("Failed message missing from log")
    end)

    test.it("fails a nonretryable provider rejection on the first attempt", function()
        local admin, sender, log_admin = actors.admin, actors.sender, actors.log_admin
        capture_with(admin)
        local input = body()
        input.subject = "Fixture rejected"
        local queued = assert(invoke(sender, "send", input))
        local failed = terminal(sender, queued)
        test.eq("failed", failed.status)
        test.eq(1, failed.attempts)
        test.eq("provider_rejected", failed.last_error.code)
        local diagnostic = assert(invoke(log_admin, "get_message", failed.message_id)).last_error
        test.eq("credentials_invalid", diagnostic.code)
        no_body(queued.message_id)
    end)

    test.it("keeps message content out of delivery diagnostics and Jobs", function()
        local admin, sender, log_admin = actors.admin, actors.sender, actors.log_admin
        capture_with(admin)
        local input = {
            to = {"personal@example.org"}, bcc = {"blind@example.org"},
            subject = "Fixture echo", text = "Private message body\nConfidential fragment",
            html = "<p>Restricted HTML phrase</p>",
        }
        local queued = assert(invoke(sender, "send", input))
        local failed = terminal(log_admin, queued)
        test.eq("failed", failed.status)
        local row = persisted(queued.message_id)
        local detail = assert(row.provider_detail)
        test.not_nil(detail:find("Rejected record", 1, true))
        for _, secret in ipairs({"personal@example.org", "blind@example.org", "different@sample.org",
            "Fixture echo", "Private message body", "Confidential fragment", "Restricted HTML phrase"}) do
            test.is_nil(detail:find(secret, 1, true), secret)
            test.is_nil(row.error_message:find(secret, 1, true), secret)
        end
        local run = query("SELECT error_text FROM kickside_job_run WHERE job_id=$1", {row.job_id})[1]
        test.eq("message_rejected", run.error_text)
        test.not_nil(row.failed_text)
        test.not_nil(row.failed_html)
    end)

    test.it("resends only visible failed mail without rendering the stored bodies again", function()
        local admin, sender, log_admin = actors.admin, actors.sender, actors.log_admin
        capture_with(admin)
        local input = {to = {"reader@example.org"}, cc = {"copy@example.org"}, subject = "Stored subject",
            text = "Stored text", html = "<p>Stored HTML</p>"}
        local queued = assert(invoke(sender, "send", input))
        local captured = terminal(log_admin, queued)
        test.eq("sent", captured.status)
        local request = assert(json.decode(captured.provider_message_id))
        assert(change(admin, "driver", "app.mail_harness:admitted").success)
        input.subject = "Resend fixture"
        input.origin = {kind = "workflow", id = "fixture-workflow", label = "Fixture workflow"}
        local failed = terminal(sender, assert(invoke(sender, "send", input)))
        test.eq("failed", failed.status)
        local stored = persisted(failed.message_id)
        test.not_nil(stored.failed_html)
        test.is_true(stored.failed_html:find("Stored HTML", 1, true) ~= nil)
        test.eq(request.text, stored.failed_text)
        local another = caller({"kickside.mail.security:send_access"})
        local unread, hidden = invoke(another, "resend", failed.message_id)
        refusal(unread, hidden, errors.NOT_FOUND, "message_not_found")
        local unauthorized, denial = invoke(log_admin, "resend", failed.message_id)
        refusal(unauthorized, denial, errors.PERMISSION_DENIED, "mail_send_denied")
        local already_sent, unavailable = invoke(sender, "resend", queued.message_id)
        refusal(already_sent, unavailable, errors.CONFLICT, "mail_content_unavailable")

        capture_with(admin)
        local resent = assert(invoke(sender, "resend", failed.message_id))
        local row = terminal(log_admin, resent)
        test.eq("sent", row.status)
        test.eq(failed.message_id, row.resend_of)
        test.eq(failed.sender, row.sender)
        test.eq("resend", row.origin and row.origin.kind)
        test.eq(row.sender, row.origin.id)
        test.eq("Resent message", row.origin.label)
        local original = assert(invoke(log_admin, "get_message", row.resend_of))
        test.eq("workflow", original.origin.kind)
        test.eq(input.origin.id, original.origin.id)
        test.eq(input.origin.label, original.origin.label)
        local result = assert(json.decode(row.provider_message_id))
        test.eq(stored.failed_html, result.html)
        test.eq(stored.failed_text, result.text)
        test.eq(stored.subject, result.subject)
        test.eq(1, #result.to)
        test.eq(request.to[1], result.to[1])
        test.eq(1, #result.cc)
        test.eq(request.cc[1], result.cc[1])
        test.is_nil(persisted(row.message_id).failed_html)
        test.is_nil(persisted(row.message_id).failed_text)

        local admin_sender = caller({"kickside.mail.security:log_admin", "kickside.mail.security:send_access"})
        local another_send = assert(invoke(admin_sender, "resend", failed.message_id))
        local admin_row = terminal(admin_sender, another_send)
        test.eq(failed.message_id, admin_row.resend_of)
        test.is_true(failed.sender ~= admin_row.sender)
        test.eq(admin_row.sender, admin_row.origin.id)
    end)

    test.it("keeps the first delivery driver after the active driver changes", function()
        local admin, sender, log_admin = actors.admin, actors.sender, actors.log_admin
        capture_with(admin)
        local input = body()
        input.subject = "Fixture pin"
        input.cc = {"cc@example.org"}
        input.bcc = {"bcc@example.org"}
        local queued = assert(invoke(sender, "send", input))
        local retry = await_message(log_admin, queued.message_id, function(row)
            return row.status ~= "queued" or row.last_error ~= nil
        end)
        test.eq("app.mail_harness:capture", retry.driver_id)
        test.eq(1, retry.attempts)
        assert(change(admin, "driver", "app.mail_harness:second").success)
        local job_id = persisted(queued.message_id).job_id
        test.is_true(assert(jobs.wake_job(job_id, {control = true})).woken)
        local sent = terminal(log_admin, queued)
        test.eq("sent", sent.status)
        test.eq(2, sent.attempts)
        test.eq("app.mail_harness:capture", sent.driver_id)
        test.eq(queued.message_id, assert(json.decode(sent.provider_message_id)).idempotency_key)
    end)

    test.it("records an ambiguous non-idempotent delivery without retrying", function()
        local admin, sender, log_admin = actors.admin, actors.sender, actors.log_admin
        capture_with(admin)
        assert(change(admin, "driver", "app.mail_harness:second").success)
        local input = body()
        input.subject = "Fixture ambiguous"
        local queued = assert(invoke(sender, "send", input))
        local failed = await_message(log_admin, queued.message_id, function(row)
            return row.status ~= "queued" or row.last_error ~= nil
        end)
        test.eq("failed", failed.status)
        test.eq(1, failed.attempts)
        test.eq("delivery_uncertain", failed.last_error.code)
        test.is_nil(failed.next_attempt_at)
        test.eq("done", await_job(persisted(queued.message_id).job_id, "done").status)
    end)

    test.it("passes the Jobs execution deadline to the transport", function()
        local admin, sender, log_admin = actors.admin, actors.sender, actors.log_admin
        capture_with(admin)
        local earliest = time.now()
        local sent = terminal(log_admin, assert(invoke(sender, "send", body())))
        local received = assert(json.decode(sent.provider_message_id))
        test.eq("string", type(received.deadline))
        local deadline = assert(time.parse(time.RFC3339, received.deadline))
        test.is_true(deadline:after(earliest))
        test.is_true(deadline:before(time.now():add("1m")))
    end)
end

return {register = register}
