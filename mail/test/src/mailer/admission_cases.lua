-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local security = require("security")
local registry = require("registry")
local json = require("json")
local sql = require("sql")
local uuid = require("uuid")
local jobs = require("jobs")

local policy = require("policy")

local function register(support)
    local test = support.test
    local actors = support.actors
    local now_ms = support.now_ms
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
    local template_request = support.template_request
    local capture_with = support.capture_with
    local refusal = support.refusal
    local unconfigured = support.unconfigured

    test.it("uses its own member scope without joining the shared HTTP endpoint scope", function()
        local definition = assert(registry.get("kickside.mail:definition"))
        test.is_nil(definition.meta.member_scope)
        local policy = assert(registry.get("kickside.mail.security:module_access"))
        test.eq("module_access", policy.meta.intent)
    end)

    test.it("accepts one queued message per sender and idempotency key", function()
        local admin, sender = actors.admin, actors.sender
        capture_with(admin)
        local input = body()
        input.idempotency_key = "mail-admission"
        local first = assert(invoke(sender, "send", input))
        test.eq("queued", first.status)
        test.not_nil(first.message_id)
        local replay = assert(invoke(sender, "send", input))
        test.eq(first.message_id, replay.message_id)
        local other = caller({"kickside.mail.security:send_access"})
        local separate = assert(invoke(other, "send", input))
        test.is_true(first.message_id ~= separate.message_id)
        terminal(other, separate)
        test.eq("sent", terminal(sender, first).status)
        no_body(first.message_id)
        assert(change(admin, "driver", nil).success)
        replay = assert(invoke(sender, "send", input))
        test.eq(first.message_id, replay.message_id)
        test.eq("sent", replay.status)
        input.text = "Different"
        local result, err = invoke(sender, "send", input)
        refusal(result, err, errors.CONFLICT, "idempotency_conflict")
    end)

    test.it("writes no job or message for invalid mail admissions", function()
        local admin, sender, denied = actors.admin, actors.sender, actors.denied
        local function counts()
            return query([[SELECT (SELECT COUNT(*) FROM mail_message) AS messages,
                (SELECT COUNT(*) FROM kickside_job WHERE owner_kind='mail-message') AS jobs]])[1]
        end
        local before = counts()
        unconfigured(sender)
        capture_with(admin)
        local invalid = body()
        invalid.to = {}
        local value, err = invoke(sender, "send", invalid)
        refusal(value, err, errors.INVALID, "recipient_required")
        local templated = template_request()
        templated.vars = {}
        value, err = invoke(sender, "send", templated)
        refusal(value, err, errors.INVALID, "invalid_template_vars")
        value, err = invoke(denied, "send", body())
        refusal(value, err, errors.PERMISSION_DENIED, "mail_send_denied")
        local after = counts()
        test.eq(before.messages, after.messages)
        test.eq(before.jobs, after.jobs)
    end)

    test.it("returns the stored delivery result without creating another job on replay", function()
        local admin, sender = actors.admin, actors.sender
        capture_with(admin)
        local input = body()
        input.idempotency_key = uuid.v4()
        local admitted = assert(invoke(sender, "send", input))
        local sent = terminal(sender, admitted)
        test.eq("sent", sent.status)
        local original_job = persisted(admitted.message_id).job_id

        local replay = assert(invoke(sender, "send", input))
        test.eq(sent.message_id, replay.message_id)
        test.eq(sent.status, replay.status)
        input.text = "Changed body"
        local value, err = invoke(sender, "send", input)
        refusal(value, err, errors.CONFLICT, "idempotency_conflict")

        local messages = query("SELECT id, job_id FROM mail_message WHERE sender=$1", {sent.sender})
        test.eq(1, #messages)
        test.eq(admitted.message_id, messages[1].id)
        test.eq(original_job, messages[1].job_id)
        local jobs_for_message = query("SELECT id FROM kickside_job WHERE owner_kind='mail-message' AND owner_id=$1",
            {admitted.message_id})
        test.eq(1, #jobs_for_message)
        test.eq(original_job, jobs_for_message[1].id)
    end)

    test.it("rearms the same job after a retryable error and clears bodies when it sends", function()
        local admin, sender, log_admin = actors.admin, actors.sender, actors.log_admin
        capture_with(admin)
        local input = body()
        input.subject = "Fixture once"
        local queued = assert(invoke(sender, "send", input))
        local retry = await_message(sender, queued.message_id, function(row)
            return row.last_error and row.last_error.code == "rate_limited"
        end)
        local pending = persisted(queued.message_id)
        test.eq(1, retry.attempts)
        test.eq("queued", retry.status)
        test.not_nil(pending.html)
        test.not_nil(pending.text)
        test.is_true(retry.next_attempt_at > retry.created_at)
        local sent = terminal(sender, queued)
        test.eq("sent", sent.status)
        test.eq(2, sent.attempts)
        test.is_nil(sent.last_error)
        local logged = assert(invoke(log_admin, "get_message", queued.message_id))
        test.eq(queued.message_id, assert(json.decode(logged.provider_message_id)).idempotency_key)
        test.eq("done", await_job(pending.job_id, "done").status)
        test.eq(pending.job_id, persisted(queued.message_id).job_id)
        no_body(queued.message_id)
    end)


    for _, fault in ipairs({"refused", "dns", "tls", "connect_timeout", "response_timeout", "response_reset"}) do
        test.it("retries provider HTTP transport failure " .. fault, function()
            local admin, sender, log_admin = actors.admin, actors.sender, actors.log_admin
            capture_with(admin)
            local input = body()
            input.subject = "Fixture http_" .. fault
            local started = now_ms()
            local queued = assert(invoke(sender, "send", input))
            local pending = await_message(log_admin, queued.message_id, function(row)
                return row.last_error ~= nil or row.status == "sent"
            end)
            test.eq("queued", pending.status)
            test.eq(1, pending.attempts)
            test.eq("provider_transport_failed", pending.last_error.code)
            test.eq(errors.UNAVAILABLE, pending.last_error.kind)
            test.is_true(pending.next_attempt_at >= started + 1000)
            test.is_true(pending.next_attempt_at <= now_ms() + 1000)

            local job_id = persisted(queued.message_id).job_id
            local woken = assert(jobs.wake_job(job_id, {control = true}))
            test.is_true(woken.woken)
            local sent = terminal(log_admin, queued)
            test.eq("sent", sent.status)
            test.eq(2, sent.attempts)
            test.eq("fixture-http-delivery", sent.provider_message_id)
            test.is_nil(sent.last_error)
            test.eq(job_id, persisted(queued.message_id).job_id)
        end)
    end

    test.it("keeps an HTTP policy denial terminal", function()
        local admin, sender, log_admin = actors.admin, actors.sender, actors.log_admin
        capture_with(admin)
        local input = body()
        input.subject = "Fixture http_denied"
        local failure = terminal(log_admin, assert(invoke(sender, "send", input)))
        test.eq("failed", failure.status)
        test.eq(1, failure.attempts)
        test.eq("provider_request_failed", failure.last_error.code)
        test.eq(errors.PERMISSION_DENIED, failure.last_error.kind)
    end)

    test.it("uses the retry policy through an hour-long provider outage", function()
        for _, kind in ipairs({errors.UNAVAILABLE, errors.RATE_LIMITED, errors.TIMEOUT}) do
            local failure = errors.new({kind = kind, message = "Test outage", retryable = true})
            local attempt, now = 1, 0
            while now <= 3600000 do
                now = assert(policy.retry_at(failure, attempt, now, true), "Delivery exhausted within one hour")
                attempt = attempt + 1
            end
            test.is_true(attempt <= policy.MAX_ATTEMPTS)
            test.is_nil(policy.retry_at(failure, policy.MAX_ATTEMPTS, now, true))
        end
    end)

    test.it("honors bounded retry hints without shortening backoff or retrying permanent errors", function()
        local function failure(hint, retryable)
            return errors.new({kind = errors.RATE_LIMITED, message = "Test rate limit", retryable = retryable,
                details = {retry_after_ms = hint}})
        end
        test.eq(121000, policy.retry_at(failure(120000, true), 1, 1000, true))
        test.eq(901000, policy.retry_at(failure(7200000, true), 1, 1000, true))
        test.eq(3000, policy.retry_at(failure(10, true), 2, 1000, true))
        test.eq(2000, policy.retry_at(failure("invalid", true), 1, 1000, true))
        test.is_nil(policy.retry_at(failure(120000, false), 1, 1000, true))
    end)

    test.it("stops retrying at the attempt limit", function()
        local admin, sender = actors.admin, actors.sender
        capture_with(admin)
        local input = body()
        input.subject = "Fixture exhaust"
        local queued = assert(invoke(sender, "send", input))
        await_message(sender, queued.message_id, function(row) return row.last_error ~= nil end)
        local job_id = persisted(queued.message_id).job_id
        local db = assert(sql.get("app:db"))
        assert(db:execute("UPDATE mail_message SET attempts=$1 WHERE id=$2",
            {policy.MAX_ATTEMPTS - 1, queued.message_id}))
        assert(db:release())
        local failed = terminal(sender, queued)
        test.eq("failed", failed.status)
        test.eq(policy.MAX_ATTEMPTS, failed.attempts)
        test.eq("done", await_job(job_id, "done").status)
        test.eq("rate_limited", failed.last_error.code)
        no_body(queued.message_id)
    end)
end

return {register = register}
