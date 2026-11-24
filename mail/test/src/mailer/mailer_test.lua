-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local security = require("security")
local contract = require("contract")
local funcs = require("funcs")
local registry = require("registry")
local blocks = require("blocks")
local compiler = require("compiler")
local json = require("json")
local sql = require("sql")
local time = require("time")
local uuid = require("uuid")
local jobs = require("jobs")
local database = require("database")
local jobs_cancel = require("jobs_cancel")
local canonical_json = require("canonical_json")

local TOOL_NS = "kickside.mail.traits:"
local READER_POLICIES = {
    "kickside.mail.security:library_access",
    "kickside.mail.security:module_access",
    "kickside.mail.security:module_runtime",
    "kickside.mail.security:template_access",
}

local function open(id, binding)
    local definition, err = contract.get(id)
    if err then return nil, err end
    return definition:open(binding)
end

local function probe(input)
    if input.operation == "set" or input.operation == "unset" then
        local settings = assert(open("kickside.settings:settings"))
        return settings[input.operation](settings, {
            namespace = "kickside.mail", key = input.key, value = input.value,
        })
    end
    if input.operation == "write" or input.operation == "write_request" then
        local writable = assert(open("kickside.data:writable", "kickside.mail.sink:writable"))
        local request = input.operation == "write_request" and input.message or {
            config = {}, sink_op = "create", input = input.message,
            idempotency_key = "delivery-key", identity_key = "record-key", origin = "automation",
        }
        return writable:write(request)
    end
    if input.operation == "blocks" then
        local catalog, catalog_err = blocks.catalog()
        if catalog_err then return nil, catalog_err end
        local id = TOOL_NS .. "mail_send"
        local descriptor = assert(catalog[id], "MailSend is missing from the Block catalog")
        local plan, plan_err = blocks.plan({block_id = id, def_node_id = "deliver", config = input.message})
        assert(plan, plan_err :: error?)
        local upstream_plan, upstream_err = blocks.plan({block_id = id, def_node_id = "deliver", config = {}})
        assert(upstream_plan, upstream_err :: error?)
        local compiled = assert(compiler.compile({
            nodes = {
                {id = "prepare", kind = "block", ref = TOOL_NS .. "mail_preview", config = {
                    template = "notice", vars = {subject = "Status", message = "Ready"},
                }},
                {id = "deliver", kind = "block", ref = id, config = {to = input.message.to}},
            },
            edges = {{id = "message", source_id = "prepare", source_port = "result", target_id = "deliver"}},
        }, {blocks = catalog}))
        return {descriptor = descriptor, plan = plan, upstream_plan = upstream_plan, compiled = compiled}
    end
    if input.operation == "resend" then
        return funcs.call("kickside.mail.service:resend", input.message)
    end
    if input.operation == "raw" then
        return open("kickside.mail:transport", "kickside.mail.harness:first")
    end
    if input.operation == "raw_send" then
        return funcs.call("kickside.mail.harness:send_first", input.message)
    end
    if input.operation == "driver_validation" then
        return funcs.call("kickside.mail.settings:validate_driver", {value = "first"})
    end
    local mailer, err = open("kickside.mail:mailer")
    if err then return nil, err end
    if input.operation == "list_templates" then return mailer:list_templates() end
    return mailer[input.operation](mailer, input.message)
end

local function caller(policy_ids, id)
    local policies = {assert(security.policy("kickside.mail.harness:caller"))}
    local groups = {"app:user"}
    for _, policy_id in ipairs(policy_ids) do
        policies[#policies + 1] = assert(security.policy(policy_id))
        if policy_id == "kickside.mail.security:send_access" then
            groups[#groups + 1] = "app:mail_senders"
        end
    end
    id = id or uuid.v4()
    local db = assert(sql.get("app:db"))
    assert(db:execute([[INSERT INTO app_users (user_id,email,full_name,password_hash,status)
        VALUES ($1,$2,$1,'test-only','active') ON CONFLICT (user_id) DO NOTHING]], {id, id .. "@example.org"}))
    for _, group_id in ipairs(groups) do
        assert(db:execute([[INSERT INTO app_user_groups (user_id,group_id) VALUES ($1,$2)
            ON CONFLICT (user_id,group_id) DO NOTHING]], {id, group_id}))
    end
    assert(db:release())
    local actor = assert(security.new_actor(id, {security_groups = groups}))
    local scope = assert(security.new_scope(policies))
    return assert(funcs.new():with_actor(actor):with_scope(scope)), id
end

local function invoke(executor, operation, message)
    return executor:call("kickside.mail.harness:probe", {operation = operation, message = message})
end

local function await_message(executor, id, matches, seconds)
    local deadline = time.now():add((seconds or 25) * time.SECOND):unix_nano()
    local result
    repeat
        result = assert(invoke(executor, "get_message", id))
        if matches(result) then return result end
        time.sleep("25ms")
    until time.now():unix_nano() >= deadline
    error("Unexpected delivery state: " .. assert(json.encode(result)))
end

local function terminal(executor, queued)
    test.eq("queued", queued.status)
    return await_message(executor, queued.message_id, function(result) return result.status ~= "queued" end)
end

local function query(statement, args)
    local db = assert(sql.get("app:db"))
    local rows, err = db:query(statement, args)
    assert(db:release())
    return assert(rows, tostring(err))
end

local function persisted(id)
    return assert(query("SELECT * FROM mail_message WHERE id=$1", {id})[1])
end

local function no_body(id)
    local row = persisted(id)
    test.is_nil(row.html)
    test.is_nil(row.text)
    test.is_nil(row.actor_context)
    test.is_nil(row.next_check_at)
    test.is_nil(row.next_attempt_at)
end

local function await_job(id, status)
    local deadline = time.now():add(25 * time.SECOND):unix_nano()
    local state
    repeat
        state = assert(jobs.get_job(id))
        if state.status == status then return state end
        time.sleep("25ms")
    until time.now():unix_nano() >= deadline
    error("Unexpected Jobs state: " .. assert(json.encode(state)))
end

local function change(admin, key, value)
    return assert(admin:call("kickside.mail.harness:probe", {
        operation = value == nil and "unset" or "set", key = key, value = value,
    }))
end

local function body()
    return {to = {"reader@example.org"}, subject = "Status", text = "Ready"}
end

local function template_request()
    return {to = {"reader@example.org"}, template = "notice", vars = {subject = "Status & updates", message = "Ready"}}
end

local function capture_with(admin)
    assert(change(admin, "driver", "capture").success)
    assert(change(admin, "from_address", "mail@example.org").success)
end

local function refusal(value, err, kind, code, variable)
    test.is_nil(value)
    test.not_nil(err)
    test.eq(kind, err:kind(), tostring(err))
    test.is_false(err:retryable())
    if code then test.eq(code, (err:details() or {}).code) end
    if variable then
        test.eq(variable, err:details().variable)
        test.is_true(err:message():find(variable, 1, true) ~= nil)
    end
end

local function unconfigured(executor)
    local value, err = invoke(executor, "send", body())
    test.is_nil(value)
    test.eq("invalid_config", err:details().code)
    test.is_false(err:retryable())
    return err
end

return {
    probe = probe,
    run = test.run_cases(function()
        test.describe("System-managed mailer", function()
            local admin, sender, sender_id, denied, log_admin, editor
            local settlement_rows = {}
            test.before_each(function()
                admin = caller({"kickside.mail.harness:admin"})
                log_admin = caller({"kickside.mail.security:log_admin", "kickside.mail.security:module_runtime"})
                denied = caller({"kickside.mail.security:module_runtime"})
                editor = caller(READER_POLICIES)
                sender, sender_id = caller({
                    "kickside.mail.security:module_runtime",
                    "kickside.mail.security:template_access",
                    "kickside.mail.security:send_access",
                })
                for _, key in ipairs({"driver", "from_address", "from_name", "reply_to"}) do
                    local result = change(admin, key)
                    test.is_true(result.success, result.error :: string?)
                end
            end)
            test.after_each(function()
                if #settlement_rows == 0 then return end
                assert(database.transaction(function(tx)
                    for _, row in ipairs(settlement_rows) do
                        local _, mail_err = tx:execute("DELETE FROM mail_message WHERE id=$1", {row.id})
                        if mail_err then return nil, mail_err end
                        if row.job_id then
                            local _, job_err = tx:execute("DELETE FROM kickside_job WHERE id=$1", {row.job_id})
                            if job_err then return nil, job_err end
                        end
                    end
                    return true, nil
                end))
                settlement_rows = {}
            end)

            test.it("uses its own member scope without joining the shared HTTP endpoint scope", function()
                local definition = assert(registry.get("kickside.mail:definition"))
                test.is_nil(definition.meta.member_scope)
                local policy = assert(registry.get("kickside.mail.security:module_access"))
                test.eq("module_access", policy.meta.intent)
            end)

            test.it("accepts one queued message per sender and idempotency key", function()
                capture_with(admin)
                local input = body()
                input.idempotency_key = "mail-admission"
                local first = assert(invoke(sender, "send", input))
                test.eq("queued", first.status)
                test.not_nil(first.message_id)
                local replay = assert(invoke(sender, "send", input))
                test.eq(first.message_id, replay.message_id)
                local other = caller({"kickside.mail.security:send_access",
                    "kickside.mail.security:module_runtime", "kickside.mail.security:template_access"})
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

            test.it("rearms the same job after a retryable error and clears bodies when it sends", function()
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

            local policy = require("policy")

            for _, fault in ipairs({"refused", "dns", "tls", "connect_timeout", "response_timeout", "response_reset"}) do
                test.it("retries provider HTTP transport failure " .. fault, function()
                    capture_with(admin)
                    local input = body()
                    input.subject = "Fixture http_" .. fault
                    local started = policy.now()
                    local queued = assert(invoke(sender, "send", input))
                    local pending = await_message(log_admin, queued.message_id, function(row)
                        return row.last_error ~= nil or row.status == "sent"
                    end)
                    test.eq("queued", pending.status)
                    test.eq(1, pending.attempts)
                    test.eq("provider_transport_failed", pending.last_error.code)
                    test.eq(errors.UNAVAILABLE, pending.last_error.kind)
                    test.is_true(pending.next_attempt_at >= started + 1000)
                    test.is_true(pending.next_attempt_at <= policy.now() + 1000)

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
                        now = assert(policy.retry_at(failure, attempt, now), "Delivery exhausted within one hour")
                        attempt = attempt + 1
                    end
                    test.is_true(attempt <= policy.MAX_ATTEMPTS)
                    test.is_nil(policy.retry_at(failure, policy.MAX_ATTEMPTS, now))
                end
            end)

            test.it("honors bounded retry hints without shortening backoff or retrying permanent errors", function()
                local function failure(hint, retryable)
                    return errors.new({kind = errors.RATE_LIMITED, message = "Test rate limit", retryable = retryable,
                        details = {retry_after_ms = hint}})
                end
                test.eq(121000, policy.retry_at(failure(120000, true), 1, 1000))
                test.eq(901000, policy.retry_at(failure(7200000, true), 1, 1000))
                test.eq(3000, policy.retry_at(failure(10, true), 2, 1000))
                test.eq(2000, policy.retry_at(failure("invalid", true), 1, 1000))
                test.is_nil(policy.retry_at(failure(120000, false), 1, 1000))
            end)

            test.it("stops retrying at the attempt limit", function()
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

            test.it("stores provider details on retry and failure for log administrators only", function()
                capture_with(admin)
                local admin_view = caller({"kickside.mail.security:log_admin", "kickside.mail.security:module_runtime"})
                local input = body()
                input.subject = "Fixture detail"
                local admitted = assert(invoke(sender, "send", input))
                local retry = await_message(sender, admitted.message_id, function(row) return row.last_error ~= nil end)
                test.eq("queued", retry.status)
                test.is_nil(retry.last_error.provider_detail)
                local pending = assert(invoke(admin_view, "get_message", admitted.message_id))
                test.eq("Fixture retry detail", pending.last_error.provider_detail)
                local failed = terminal(sender, admitted)
                test.eq("failed", failed.status)
                test.is_nil(failed.last_error.provider_detail)
                local sender_items = assert(invoke(sender, "list_messages", {limit = 5, status = "failed"})).items
                test.eq(admitted.message_id, sender_items[1].message_id)
                test.is_nil(sender_items[1].last_error.provider_detail)
                test.eq("Ask a mail administrator to check why the message was refused.", sender_items[1].last_error.message)
                local final = assert(invoke(admin_view, "get_message", admitted.message_id))
                test.eq("Fixture refusal detail", final.last_error.provider_detail)
                local items = assert(invoke(admin_view, "list_messages", {limit = 200, status = "failed"})).items
                for _, row in ipairs(items) do
                    if row.message_id == admitted.message_id then
                        test.eq("Fixture refusal detail", row.last_error.provider_detail)
                        return
                    end
                end
                error("Failed message missing from log")
            end)

            test.it("fails a nonretryable provider rejection on the first attempt", function()
                capture_with(admin)
                local input = body()
                input.subject = "Fixture rejected"
                local queued = assert(invoke(sender, "send", input))
                local failed = terminal(sender, queued)
                test.eq("failed", failed.status)
                test.eq(1, failed.attempts)
                test.eq("credentials_invalid", failed.last_error.code)
                test.eq("Ask a mail administrator to check delivery authorization.", failed.last_error.message)
                test.eq("Test authorization refused", assert(invoke(log_admin, "get_message", failed.message_id)).last_error.message)
                no_body(queued.message_id)
            end)

            test.it("resends only visible failed mail without rendering the stored bodies again", function()
                capture_with(admin)
                local input = {to = {"reader@example.org"}, cc = {"copy@example.org"}, subject = "Stored subject",
                    text = "Stored text", html = "<p>Stored HTML</p>"}
                local queued = assert(invoke(sender, "send", input))
                local captured = terminal(log_admin, queued)
                test.eq("sent", captured.status)
                local request = assert(json.decode(captured.provider_message_id))
                assert(change(admin, "driver", "first").success)
                input.subject = "Resend fixture"
                input.origin = {kind = "workflow", id = "fixture-workflow", label = "Fixture workflow"}
                local failed = terminal(sender, assert(invoke(sender, "send", input)))
                test.eq("failed", failed.status)
                local stored = persisted(failed.message_id)
                test.not_nil(stored.failed_html)
                test.is_true(stored.failed_html:find("Stored HTML", 1, true) ~= nil)
                test.eq(request.text, stored.failed_text)
                local another = caller({"kickside.mail.security:send_access", "kickside.mail.security:module_runtime"})
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

                local admin_sender = caller({"kickside.mail.security:log_admin", "kickside.mail.security:send_access",
                    "kickside.mail.security:module_runtime"})
                local another_send = assert(invoke(admin_sender, "resend", failed.message_id))
                local admin_row = terminal(admin_sender, another_send)
                test.eq(failed.message_id, admin_row.resend_of)
                test.is_true(failed.sender ~= admin_row.sender)
                test.eq(admin_row.sender, admin_row.origin.id)
            end)

            test.it("uses the active driver at delivery even after a different driver rearmed the job", function()
                capture_with(admin)
                local input = body()
                input.subject = "Fixture exhaust"
                local queued = assert(invoke(sender, "send", input))
                local retry = await_message(log_admin, queued.message_id, function(row) return row.last_error ~= nil end)
                test.eq("capture", retry.driver_id)
                assert(change(admin, "driver", "second").success)
                local sent = terminal(sender, queued)
                test.eq("sent", sent.status)
                test.eq(2, sent.attempts)
                sent = assert(invoke(log_admin, "get_message", queued.message_id))
                test.eq("second", sent.driver_id)
                test.eq("second|mail@example.org||", sent.provider_message_id)
            end)

            test.it("refuses excess recipients before queuing and after a driver change", function()
                capture_with(admin)
                assert(change(admin, "driver", "second").success)
                local input = body()
                input.cc = {"cc@example.org"}
                input.bcc = {"bcc@example.org"}
                local count_sql = "SELECT COUNT(*) AS n FROM mail_message WHERE subject=$1"
                input.subject = "Recipient limit test"
                local before = query(count_sql, {input.subject})[1].n
                local result, err = invoke(sender, "send", input)
                refusal(result, err, errors.INVALID, "too_many_recipients")
                test.eq("max_recipients", err:details().limit)
                test.eq(2, err:details().maximum)
                test.eq(before, query(count_sql, {input.subject})[1].n)
                assert(change(admin, "driver", "capture").success)
                input.subject = "Fixture exhaust"
                local queued = assert(invoke(sender, "send", input))
                await_message(sender, queued.message_id, function(row) return row.last_error ~= nil end)
                assert(change(admin, "driver", "second").success)
                local failed = terminal(sender, queued)
                test.eq("failed", failed.status)
                test.eq(2, failed.attempts)
                test.eq("too_many_recipients", failed.last_error.code)
            end)

            test.it("bounds raw and rendered subjects and bodies before queuing", function()
                capture_with(admin)
                for _, case in ipairs({{"subject", 256, "subject_too_long"},
                    {"text", 262145, "text_too_large"}, {"html", 262145, "html_too_large"}}) do
                    local input = body()
                    input[case[1]] = string.rep("a", case[2])
                    local value, err = invoke(sender, "send", input)
                    refusal(value, err, errors.INVALID, case[3])
                end
                local template = template_request()
                template.vars.subject = string.rep("é", 256)
                local value, err = invoke(sender, "send", template)
                refusal(value, err, errors.INVALID, "subject_too_long")
                local amplifying = assert(funcs.call("kickside.mail.library:create", {
                    kind = "message", name = "rendered-text-boundary", from = {kind = "message", name = "notice"},
                    text = "{{ block body() }}" .. string.rep("{{ vars.message }}", 65) .. "{{ end }}",
                }))
                template.template = amplifying.name
                template.vars.subject = "Status"
                template.vars.message = string.rep("a", 4096)
                value, err = invoke(sender, "send", template)
                assert(funcs.call("kickside.mail.library:delete", {
                    kind = amplifying.kind, name = amplifying.name, expected_revision = amplifying.revision,
                }))
                refusal(value, err, errors.INVALID, "text_too_large")
            end)

            test.it("lists and reads only the sender's messages unless the viewer holds log administration", function()
                capture_with(admin)
                local other = caller({"kickside.mail.security:send_access",
                    "kickside.mail.security:module_runtime", "kickside.mail.security:template_access"})
                local one = assert(invoke(sender, "send", body()))
                local two = assert(invoke(sender, "send", body()))
                local three = assert(invoke(other, "send", body()))
                local sent = terminal(sender, one)
                test.is_nil(sent.driver_id)
                test.is_nil(sent.provider_message_id)
                terminal(sender, two)
                terminal(other, three)
                local denied_value, denied_err = invoke(other, "get_message", one.message_id)
                refusal(denied_value, denied_err, errors.NOT_FOUND, "message_not_found")
                local page = assert(invoke(sender, "list_messages", {limit = 1, status = "sent"}))
                test.eq(two.message_id, page.items[1].message_id)
                test.is_nil(page.items[1].driver_id)
                test.is_nil(page.items[1].provider_message_id)
                test.is_true(page.has_more)
                local second = assert(invoke(sender, "list_messages", {limit = 1, status = "sent", cursor = page.next_cursor}))
                test.eq(one.message_id, second.items[1].message_id)
                test.is_false(second.has_more)
                test.is_nil(second.next_cursor)
                local expired_filter = assert(invoke(sender, "list_messages", {limit = 5, since = sent.created_at + 100000}))
                test.eq(0, #expired_filter.items)
                local others = assert(invoke(other, "list_messages", {limit = 5}))
                test.eq(1, #others.items)
                test.eq(three.message_id, others.items[1].message_id)
                local all = assert(invoke(log_admin, "list_messages", {limit = 200}))
                local visible = {}
                for _, row in ipairs(all.items) do visible[row.message_id] = row end
                test.is_true(visible[one.message_id] ~= nil and visible[three.message_id] ~= nil)
                test.eq("capture", visible[one.message_id].driver_id)
                local admin_row = assert(invoke(log_admin, "get_message", one.message_id))
                test.eq("capture", admin_row.driver_id)
                test.eq(one.message_id, assert(json.decode(admin_row.provider_message_id)).idempotency_key)
                test.eq(admin_row.provider_message_id, visible[one.message_id].provider_message_id)
            end)

            test.it("settles jobs that are cancelled or no longer stored", function()
                local admitted_at = policy.now() + 3600000
                local recheck_at = admitted_at + policy.RECHECK_MS
                local hinted, cancelled, missing = {id = uuid.v7()}, {id = uuid.v7()}, {id = uuid.v7()}
                settlement_rows = {hinted, cancelled, missing}
                assert(database.transaction(function(tx, dialect)
                    for _, row in ipairs(settlement_rows) do
                        local job_id: string = uuid.v7()
                        if row ~= missing then
                            local job, enqueue_err = jobs.enqueue_tx(tx, dialect, {
                                namespace = "mail", scope = row.id, key = "deliver",
                                owner_locator = {kind = "mail-message", id = row.id},
                                job_type = "kickside.mail.outbox:deliver",
                                immutable_payload = {message_id = row.id}, parked = true,
                            })
                            if enqueue_err then return nil, enqueue_err end
                            job_id = job.id :: string
                            row.job_id = job_id
                            local ok, cancel_err = jobs_cancel.cancel_job_tx(tx, dialect, {id = job_id})
                            if cancel_err then return nil, cancel_err end
                            assert(ok)
                        end
                        local _, insert_err = tx:execute([[INSERT INTO mail_message
                            (id,created_at,status,next_attempt_at,next_check_at,sender,actor_context,
                            recipients,subject,from_address,attachments,job_id,html,text)
                            VALUES ($1,$2,'queued',$2,$3,$4,'{}','{"to":["reader@example.org"]}',
                            'Settlement fixture','mail@example.org','[]',$5,'<p>Ready</p>','Ready')]],
                            {row.id, admitted_at, recheck_at, sender_id, job_id})
                        if insert_err then return nil, insert_err end
                    end
                    return true, nil
                end))

                local function owner(now, change)
                    local executor = assert(funcs.new():with_context({mail_test_now = now}))
                    local result = assert(executor:call("kickside.mail.outbox:owner", {change = change}))
                    assert(result.success, tostring(result.error))
                    return result
                end
                local function interrupted(row, at)
                    local message = assert(invoke(sender, "get_message", row.id))
                    test.eq("failed", message.status)
                    test.eq("delivery_interrupted", message.last_error.code)
                    test.eq("Ask a mail administrator to check whether the interrupted message was delivered.", message.last_error.message)
                    test.eq(at, persisted(row.id).finished_at)
                    no_body(row.id)
                end

                local hinted_at = admitted_at + 1
                owner(hinted_at, {kind = "lease_released", job_id = hinted.job_id,
                    owner_locator = {kind = "mail-message", id = hinted.id}})
                interrupted(hinted, hinted_at)
                owner(recheck_at - 1)
                for _, row in ipairs({cancelled, missing}) do
                    local before_recheck = persisted(row.id)
                    test.eq("queued", before_recheck.status)
                    test.eq(recheck_at, before_recheck.next_check_at)
                end
                owner(recheck_at)
                interrupted(cancelled, recheck_at)
                interrupted(missing, recheck_at)
            end)

            test.it("refuses another delivery attempt after the sender becomes inactive", function()
                capture_with(admin)
                local input = body()
                input.subject = "Fixture once"
                local queued = assert(invoke(sender, "send", input))
                local retry = await_message(sender, queued.message_id, function(row) return row.last_error ~= nil end)
                local db = assert(sql.get("app:db"))
                assert(db:execute([[UPDATE app_users SET status='suspended' WHERE user_id=$1]], {retry.sender}))
                assert(db:release())
                local failed = terminal(sender, queued)
                test.eq("failed", failed.status)
                test.eq(2, failed.attempts)
                test.eq(errors.PERMISSION_DENIED, failed.last_error.kind)
                no_body(queued.message_id)
            end)

            test.it("refuses delivery after the sender's send grant is revoked", function()
                capture_with(admin)
                local input = body()
                input.subject = "Fixture once"
                local queued = assert(invoke(sender, "send", input))
                local retry = await_message(sender, queued.message_id, function(row) return row.last_error ~= nil end)
                local db = assert(sql.get("app:db"))
                assert(db:execute("DELETE FROM app_user_groups WHERE user_id=$1 AND group_id=$2",
                    {retry.sender, "app:mail_senders"}))
                assert(db:release())
                local failed = terminal(sender, queued)
                test.eq("failed", failed.status)
                test.eq(2, failed.attempts)
                test.eq(errors.PERMISSION_DENIED, failed.last_error.kind)
                test.eq("mail_send_denied", failed.last_error.code)
                test.is_nil(failed.provider_message_id)
                no_body(queued.message_id)
            end)

            test.it("drains more than one expiry batch after the retention setting changes", function()
                local now = time.now():unix_nano() // 1000000
                local cutoff = now - 172800000
                local slots = 450
                local db = assert(sql.get("app:db"))
                local tx = assert(db:begin())
                for _ = 1, slots do
                    assert(tx:execute([[INSERT INTO mail_message
                        (id,created_at,status,finished_at,sender,recipients,subject,from_address,attachments)
                        VALUES($1,$2,'failed',$2,'retention-fixture','{"to":["reader@example.org"]}',
                        'Retention test','mail@example.org','[]')]], {uuid.v7(), cutoff}))
                end
                assert(tx:commit())
                assert(db:release())
                local count = "SELECT COUNT(*) AS n FROM mail_message WHERE sender='retention-fixture'"
                test.eq(slots, query(count)[1].n)
                test.is_false(change(admin, "log_retention_days", 0).success)
                local retention = change(admin, "log_retention_days", 1)
                test.is_true(retention.success, retention.error :: string?)
                local deadline = time.now():add(10 * time.SECOND):unix_nano()
                repeat
                    if query(count)[1].n == 0 then return end
                    time.sleep("25ms")
                until time.now():unix_nano() >= deadline
                error("Retention did not drain the expired rows")
            end)

            for _, lost in ipairs({false, true}) do
                local hint = lost and "with the lease-release hint lost" or "on the lease-release hint"
                test.it("settles a delivery killed on the final execution " .. hint, function()
                    capture_with(admin)
                    local input = body()
                    input.subject = lost and "Fixture ceiling_lost" or "Fixture ceiling"
                    local queued = assert(invoke(sender, "send", input))
                    await_message(sender, queued.message_id, function(row) return row.attempts == 5 end)
                    local pending = persisted(queued.message_id)
                    local job = await_job(pending.job_id, "dead")
                    test.eq(5, job.execution_seq)
                    local last_error = job.last_error :: string
                    test.is_true(last_error:find("max_execution_ms", 1, true) ~= nil, last_error)
                    if lost then
                        local before = persisted(queued.message_id)
                        test.eq("queued", before.status)
                        test.not_nil(before.html)
                    end
                    local failed = await_message(sender, queued.message_id, function(row) return row.status == "failed" end, 35)
                    test.eq("delivery_interrupted", failed.last_error.code)
                    test.eq("Ask a mail administrator to check whether the interrupted message was delivered.", failed.last_error.message)
                    test.eq(5, failed.attempts)
                    if lost then
                        test.is_true(failed.finished_at >= pending.next_check_at)
                    else
                        test.is_true(failed.finished_at < pending.next_check_at)
                    end
                    no_body(queued.message_id)
                end)
            end

            test.it("discovers installed descriptors and selects each on the next send", function()
                test.is_false(change(admin, "driver", "missing").success)
                for key, value in pairs({driver = "first", from_address = "mail@example.org",
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

                test.is_true(change(admin, "driver", "second").success)
                local second = assert(invoke(sender, "send", {
                    template = "notice", vars = {subject = "Status", message = "Ready"},
                    to = {"reader@example.org"}, reply_to = "override@example.org",
                }))
                test.eq("second|mail@example.org|Test Mail|override@example.org", terminal(log_admin, second).provider_message_id)
            end)

            test.it("returns the message ID as the writable destination reference", function()
                test.is_true(change(admin, "driver", "first").success)
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

            test.it("sends each Sync upsert once and acknowledges deletes without sending", function()
                assert(change(admin, "driver", "first").success)
                assert(change(admin, "from_address", "mail@example.org").success)
                local port = assert(registry.get("kickside.mail.ports:send_email"))
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
                request.input.subject = "Changed source item"
                local changed = assert(invoke(sender, "write_request", request))
                test.is_true(changed.success, tostring(changed.error and changed.error.message))
                test.is_true(first.dest_ref.message_id ~= changed.dest_ref.message_id)
                test.eq("sent", terminal(sender, {message_id = changed.dest_ref.message_id, status = "queued"}).status)

                request.dest_ref = changed.dest_ref
                request.input = assert(json.decode("{}"))
                request.idempotency_key = "source-item-v3"
                request.sink_op = "delete"
                local deleted = assert(invoke(sender, "write_request", request))
                test.is_true(deleted.success, tostring(deleted.error and deleted.error.message))
                test.eq("noop", deleted.result)
                test.is_nil(deleted.dest_ref)
                local logged = assert(invoke(sender, "list_messages", {limit = 10}))
                test.eq(2, #logged.items)
                test.not_nil(port.data.operations.upsert)
                test.not_nil(port.data.operations.delete)
                test.is_nil(port.data.operations.create)
            end)

            test.it("records display origin from module and workflow send surfaces", function()
                assert(change(admin, "driver", "first").success)
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

            test.it("finds recent senders and filters activity by the message name", function()
                assert(change(admin, "driver", "first").success)
                assert(change(admin, "from_address", "mail@example.org").success)
                local input = template_request()
                input.origin = {kind = "module", id = "app:recent-senders", label = "Recent senders"}
                local since = policy.now()
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
                local editor = caller({"kickside.mail.security:library_access", "kickside.mail.security:library_calls"})
                local entry = assert(editor:call("kickside.mail.library:get", {kind = "message", name = input.template}))
                local matching
                for _, used in ipairs(entry.used_by.recent_senders) do
                    if used.origin and used.origin.id == input.origin.id then matching = used end
                end
                test.not_nil(matching)
                test.eq(2, matching.count)
                test.eq(last.items[1].sender, matching.sender)
            end)

            test.it("rejects malformed configured addresses before writing settings", function()
                for _, key in ipairs({"from_address", "reply_to"}) do
                    test.is_true(change(admin, key, "mail@example.org").success)
                    local result = change(admin, key, "mail@example")
                    test.is_false(result.success)
                    test.eq("Enter a valid email address", result.error)
                    test.is_true(change(admin, key, "").success)
                end
            end)

            test.it("returns the same configuration error through mailer and writable destination", function()
                local missing_driver = unconfigured(sender)
                local port = assert(registry.get("kickside.mail.ports:send_email"))
                test.is_nil(port.data.config_schema and port.data.config_schema.connection_id)
                local destination = assert(invoke(sender, "write", body()))
                test.is_false(destination.success)
                test.eq(missing_driver:details().code, destination.error.code)
                test.eq(missing_driver:message(), destination.error.message)
                test.is_false(destination.error.retriable)
                test.is_true(change(admin, "driver", "first").success)
                test.is_true(unconfigured(sender):message() ~= missing_driver:message())
            end)

            test.it("refuses a caller without the send capability before looking up settings", function()
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
                    "kickside.mail.security:module_runtime", "kickside.mail.security:library_access",
                    "kickside.mail.harness:external_template",
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
                    "kickside.mail.security:module_runtime", "kickside.mail.security:template_access",
                    "kickside.mail.security:library_access", "kickside.mail.harness:external_template",
                })
                local preview = assert(invoke(external_sender, "preview", {template = "reminder", vars = {task = "A & B"}}))
                test.eq("Reminder: A & B", preview.subject)
            end)

            test.it("refuses a Jet name with no declaration on send and preview", function()
                capture_with(admin)
                local input = template_request()
                input.template = "undeclared"
                local sent, send_err = invoke(sender, "send", input)
                refusal(sent, send_err, errors.NOT_FOUND, "template_not_found")
                local preview, preview_err = invoke(editor, "preview", {template = input.template, vars = input.vars})
                refusal(preview, preview_err, errors.NOT_FOUND, "template_not_found")
            end)

            test.it("names missing, mistyped and unknown variables before rendering", function()
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
                local reader = caller(READER_POLICIES)
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

                assert(change(admin, "driver", "first").success)
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
                local input = template_request()
                input.text = "Conflicting body"
                local sent, err = invoke(sender, "send", input)
                refusal(sent, err, errors.INVALID, "template_body_conflict")
            end)

            test.it("resolves user recipients only under the caller's Users authority", function()
                capture_with(admin)
                local db = assert(sql.get("app:db"))
                local id = "07cc253a-d1ab-46e5-936f-7d12490524bd"
                local blank = "07cc253a-d1ab-46e5-936f-7d12490524be"
                assert(db:execute([[INSERT INTO app_users (user_id,email,full_name,password_hash,status)
                    VALUES ($1,'resolved@example.org','Recipient','test-only','active'),
                           ($2,'','No address','test-only','active')]], {id, blank}))
                db:release()

                local reader = caller({
                    "kickside.mail.security:module_runtime", "kickside.mail.security:template_access",
                    "kickside.mail.security:send_access", "kickside.mail.harness:principal_reader",
                    "kickside.users.security:users_runtime_read", "kickside.users.security:login_db_access",
                })
                local input = body()
                input.to[2] = {user_id = id}
                input.to[3] = "READER@example.org"
                input.cc = {"Cc@example.org", {user_id = id}, "CC@example.org"}
                input.bcc = {{user_id = id}, "cc@example.org", "Bcc@example.org", "BCC@example.org"}
                local refused, err = invoke(sender, "send", input)
                refusal(refused, err, errors.PERMISSION_DENIED)
                local delivered = assert(reader:call(TOOL_NS .. "mail_send", input))
                local captured = assert(json.decode(terminal(log_admin, delivered).provider_message_id))
                test.eq("reader@example.org", captured.to[1])
                test.eq("resolved@example.org", captured.to[2])
                test.eq(2, #captured.to)
                test.eq("Cc@example.org", captured.cc[1])
                test.eq(1, #captured.cc)
                test.eq("Bcc@example.org", captured.bcc[1])
                test.eq(1, #captured.bcc)

                for _, recipient in ipairs({blank, "resolved@example.org"}) do
                    input.to[2] = {user_id = recipient}
                    local missing, missing_err = invoke(reader, "send", input)
                    refusal(missing, missing_err, errors.INVALID, "recipient_address_missing")
                end
            end)

            test.it("selects only drivers with an explicit discovery grant", function()
                local result = change(admin, "driver", "unregistered")
                test.is_false(result.success)
                test.eq("The active mail driver is not installed", result.error)
            end)

            test.it("keeps driver selection and transport outside the sending group's public scope", function()
                for _, operation in ipairs({"raw", "raw_send", "driver_validation"}) do
                    local result, err = invoke(sender, operation, body())
                    test.is_nil(result)
                    test.eq(errors.PERMISSION_DENIED, err:kind())
                end
            end)
        end)
    end),
}
