-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local funcs = require("funcs")
local sql = require("sql")
local time = require("time")
local uuid = require("uuid")
local jobs = require("jobs")
local database = require("database")
local jobs_cancel = require("jobs_cancel")

local function register(support)
    local test = support.test
    local actors = support.actors
    local state = support.state
    local now_ms = support.now_ms
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
    local ceiling = support.ceiling

    test.it("settles jobs that are cancelled or no longer stored", function()
        local sender, sender_id = actors.sender, actors.sender_id
        local admitted_at = now_ms() + 3600000
        local recheck_at = admitted_at + policy.RECHECK_MS
        local hinted, cancelled, missing = {id = uuid.v7()}, {id = uuid.v7()}, {id = uuid.v7()}
        state.settlement_rows = {hinted, cancelled, missing}
        assert(database.with_tx(function(tx, dialect)
            for _, row in ipairs(state.settlement_rows) do
                local job_id: string = uuid.v7()
                if row ~= missing then
                    local job, enqueue_err = jobs.enqueue_tx(tx, dialect, {
                        namespace = "mail", scope = row.id, key = "deliver",
                        owner_locator = {kind = "mail-message", id = row.id},
                        job_type = "kickside.mail.delivery:deliver",
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
            local result = assert(executor:call("kickside.mail.jobs:owner", {change = change}))
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

    test.it("prunes preview rows in pages and schedules the earliest remaining expiry", function()
        local now = (now_ms() // 1000 + 300) * 1000
        local fixture = "retention-preview-" .. uuid.v4()
        assert(database.with_tx(function(tx)
            for i = 1, policy.BATCH + 2 do
                local expiry = now // 1000 + (i > policy.BATCH + 1 and 1 or 0)
                local _, err = tx:execute([[INSERT INTO mail_library_preview (id,actor,operation,digest,expected_json,expires_at)
                    VALUES ($1,$2,'update','fixture','{}',$3)]], {uuid.v4(), fixture, expiry})
                if err then return nil, err end
            end
            return true, nil
        end))
        local function count()
            return query("SELECT COUNT(*) AS n FROM mail_library_preview WHERE actor=$1", {fixture})[1].n
        end
        local function sweep(at)
            local executor = assert(funcs.new():with_context({mail_test_now = at}))
            local report = assert(executor:call("kickside.mail.jobs:owner", {}))
            assert(report.success, tostring(report.error))
            return report
        end
        local page = sweep(now)
        test.eq(2, count(), "rows left after the first page")
        test.eq(now, page.deadline_ms, "remaining expired row")
        test.is_true(page.needs_continue)
        local next_page = sweep(now)
        test.eq(1, count(), "rows left after the second page")
        test.eq(now + 1000, next_page.deadline_ms, "remaining future row")
        test.is_false(next_page.needs_continue)
        sweep(now + 1000)
        test.eq(0, count())
    end)

    test.it("refuses another delivery attempt after the sender becomes inactive", function()
        local admin, sender = actors.admin, actors.sender
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
        local admin, sender = actors.admin, actors.sender
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
        local admin, sender = actors.admin, actors.sender
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

    test.it("settles a delivery killed on the final execution on the lease-release hint", function()
        local admin, sender = actors.admin, actors.sender
        capture_with(admin)
        local input = body()
        input.subject = "Fixture ceiling"
        local queued = assert(invoke(sender, "send", input))
        await_message(sender, queued.message_id, function(row) return row.attempts == 5 end)
        local pending = persisted(queued.message_id)
        local job = await_job(pending.job_id, "dead")
        local failed = await_message(sender, queued.message_id, function(row) return row.status == "failed" end, 35)
        test.eq(5, job.execution_seq)
        test.eq("delivery_interrupted", failed.last_error.code)
        test.eq("Ask a mail administrator to check whether the interrupted message was delivered.", failed.last_error.message)
        test.eq(5, failed.attempts)
        test.is_true(failed.finished_at < pending.next_check_at)
        no_body(queued.message_id)
    end)
end

return {register = register}
