-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local funcs = require("funcs")
local sql = require("sql")
local time = require("time")
local test = require("test")
local jobs = require("jobs")
local api = require("api_fixtures")
local delivery_wait = require("delivery_wait")
local library = require("library_fixtures")

return {run = test.run_cases(function()
    test.describe("Mail delivery notifications", function()
        local watch = "fixture.observe_retry"
        test.after_each(function()
            local db = assert(sql.get("app:db"))
            assert(db:execute("DELETE FROM mail_realtime_fixture WHERE topic=$1", {watch}))
            assert(db:release())
            api.settings("", "")
        end)

        test.it("returns an already completed delivery from the first public read", function()
            library.await_current_live()
            local member = api.session("sender")
            local sender = assert(funcs.new():with_actor(member.actor):with_scope(member.scope))
            api.settings("app.mail_harness:capture", "fixture@example.org")
            local receipt = assert(library.mailer(sender, "send", {
                to = {"reader@example.org"}, subject = "Completed before waiting", text = "Delivery notification",
            }))
            local function read()
                return library.mailer(sender, "get_message", receipt.message_id)
            end
            local waiting_since = time.now()
            local completed = delivery_wait.terminal(read, "12s")
            test.eq("sent", completed.status)
            test.not_nil(completed.finished_at)
            test.is_true(time.now():before(waiting_since:add("1s")), "Completion did not wake the Activity wait")

            local reads = 0
            local started = time.now()
            local row = delivery_wait.terminal(function()
                reads = reads + 1
                return read()
            end, "12s")
            test.eq(completed.finished_at, row.finished_at)
            test.eq("sent", row.status)
            test.eq(1, reads)
            test.is_true(time.now():before(started:add("1s")))
        end)

        test.it("wakes when a short-lived broadcaster publishes during the first read", function()
            local state = {message_id = "fixture", status = "queued"}
            local started = time.now()
            local row = delivery_wait.terminal(function()
                local snapshot = state
                if state.status == "queued" then
                    state = {message_id = state.message_id, status = "sent"}
                    local published = assert(funcs.call("app.mail_realtime:broadcast", {topic = "mail.activity"}))
                    test.is_true(published.success)
                end
                return snapshot
            end, "1s")
            test.eq("sent", row.status)
            test.is_true(time.now():before(started:add("1s")), "Activity wait reached its deadline")
        end)

        test.it("announces a committed retry and reads the terminal delivery receipt", function()
            library.await_current_live()
            local member = api.session("sender")
            local sender = assert(funcs.new():with_actor(member.actor):with_scope(member.scope))
            api.settings("app.mail_harness:capture", "fixture@example.org")
            local subject = "Fixture pin"
            local db = assert(sql.get("app:db"))
            assert(db:execute("INSERT INTO mail_realtime_fixture (topic,subject,data,observed) VALUES ($1,$2,'{}','')",
                {watch, subject}))
            assert(db:release())
            local observe = delivery_wait.observe("activity", "12s")
            local receipt = assert(library.mailer(sender, "send",
                {to = {"reader@example.org"}, subject = subject, text = "Delivery notification"}))
            local function retry_job()
                local db = assert(sql.get("app:db"))
                local rows = assert(db:query([[SELECT data FROM mail_realtime_fixture
                    WHERE topic=$1 AND subject=$2 AND observed=$3 LIMIT 1]],
                    {"fixture.activity_retry", receipt.message_id, "queued"}))
                assert(db:release())
                return rows[1] and rows[1].data
            end
            local job_id = observe(retry_job, function(id) return id ~= nil end)
            assert(job_id, "The Activity invalidation observes the committed retry")
            local retry = assert(library.mailer(sender, "get_message", receipt.message_id))
            test.eq("queued", retry.status)
            test.eq(1, retry.attempts)
            test.is_true(assert(jobs.wake_job(job_id, {control = true})).woken)
            local row = delivery_wait.terminal(function()
                return library.mailer(sender, "get_message", receipt.message_id)
            end, "12s")
            test.eq("sent", row.status)
            test.eq(2, row.attempts)
            test.not_nil(row.finished_at)
        end)
    end)
end)}
