-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local channel = require("channel")
local events = require("events")
local funcs = require("funcs")
local time = require("time")
local test = require("test")
local api = require("api_fixtures")
local delivery_wait = require("delivery_wait")
local library = require("library_fixtures")

return {run = test.run_cases(function()
    test.describe("Mail delivery notifications", function()
        test.it("announces a committed retry and reads the terminal delivery receipt", function()
            local member = api.session("sender")
            local sender = assert(funcs.new():with_actor(member.actor):with_scope(member.scope))
            api.settings("app.mail_harness:capture", "fixture@example.org")
            local subscription = assert(events.subscribe("mail.fixture", "activity"))
            local queue = subscription:channel()
            local receipt = assert(library.mailer(sender, "send",
                {to = {"reader@example.org"}, subject = "Fixture once", text = "Delivery notification"}))
            local deadline = assert(time.after("12s"))
            local retried = false
            while not retried do
                local next = channel.select({queue:case_receive(), deadline:case_receive()})
                if next.channel == deadline then break end
                local event = next.value
                if event.data and event.data.message_id == receipt.message_id then
                    retried = retried or event.data.status == "queued" and event.data.attempts == 1
                end
            end
            subscription:close()
            test.is_true(retried, "the Activity invalidation observes the committed retry")
            local row = delivery_wait.terminal(function()
                return library.mailer(sender, "get_message", receipt.message_id)
            end, "12s")
            api.settings("", "")
            test.eq("sent", row.status)
            test.eq(2, row.attempts)
        end)
    end)
end)}
