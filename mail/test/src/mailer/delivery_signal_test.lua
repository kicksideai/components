-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local channel = require("channel")
local events = require("events")
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

        test.it("announces a committed retry and reads the terminal delivery receipt", function()
            local member = api.session("sender")
            local sender = assert(funcs.new():with_actor(member.actor):with_scope(member.scope))
            api.settings("app.mail_harness:capture", "fixture@example.org")
            local subject = "Fixture pin"
            local db = assert(sql.get("app:db"))
            assert(db:execute("INSERT INTO mail_realtime_fixture (topic,subject,data,observed) VALUES ($1,$2,'{}','')",
                {watch, subject}))
            assert(db:release())
            local subscription = assert(events.subscribe("mail.fixture", "activity"))
            local queue = subscription:channel()
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
            local deadline = assert(time.after("12s"))
            local job_id = retry_job()
            while not job_id do
                local next = channel.select({queue:case_receive(), deadline:case_receive()})
                job_id = retry_job()
                if next.channel == deadline then break end
            end
            subscription:close()
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
