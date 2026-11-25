-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local funcs = require("funcs")
local uuid = require("uuid")
local test = require("test")
local fixtures = require("fixtures")
local api_fixtures = require("api_fixtures")
local delivery_wait = require("delivery_wait")

return {run = test.run_cases(function()
    test.describe("Mail message storage", function()
        test.it("returns the stored message identity and status when the sender replays a key", function()
            local member = api_fixtures.session("sender")
            local sender = assert(funcs.new():with_actor(member.actor):with_scope(member.scope))
            api_fixtures.settings("app.mail_harness:capture", "mail@example.org")
            local input = {to = {"reader@example.org"}, subject = "Original", text = "Ready", idempotency_key = uuid.v4()}
            local inserted = assert(fixtures.mailer(sender, "send", input))
            local id = inserted.message_id
            local finished = delivery_wait.terminal(function()
                return fixtures.mailer(sender, "get_message", id)
            end, "25s")
            api_fixtures.settings("", "")
            test.eq("sent", finished.status)
            local replay = assert(fixtures.mailer(sender, "send", input))
            test.eq(id, replay.message_id)
            test.eq("sent", replay.status)
            input.subject = "Different"
            local value, error = fixtures.mailer(sender, "send", input)
            test.is_nil(value)
            test.eq("idempotency_conflict", assert(error):details().code)
            test.eq("Original", assert(fixtures.mailer(sender, "get_message", id)).subject)
            test.eq(1, assert(fixtures.mailer(sender, "list_messages", {limit = 1})).total)
            local absent, err = fixtures.mailer(sender, "get_message", uuid.v4())
            test.is_nil(absent)
            test.eq(errors.NOT_FOUND, assert(err):kind())
            test.eq("message_not_found", err:details().code)
        end)

        test.it("groups recent senders with and without an origin", function()
            local member = api_fixtures.session("sender")
            local sender = assert(funcs.new():with_actor(member.actor):with_scope(member.scope))
            api_fixtures.settings("app.mail_harness:capture", "mail@example.org")
            local origin = {kind = "module", id = "report", label = "Report"}
            for index = 1, 3 do
                local queued = assert(fixtures.mailer(sender, "send", {
                    to = {"reader@example.org"}, template = "notice",
                    vars = {subject = "Notice", message = "Ready"},
                    origin = index > 1 and origin or nil,
                }))
                local delivered = delivery_wait.terminal(function()
                    return fixtures.mailer(sender, "get_message", queued.message_id)
                end, "25s")
                test.eq("sent", delivered.status)
            end
            api_fixtures.settings("", "")

            local notice = assert(fixtures.call(nil, "get", {kind = "message", name = "notice"}))
            local groups = {}
            for _, group in ipairs(notice.used_by.recent_senders) do
                if group.sender == member.id then groups[#groups + 1] = group end
            end
            test.eq(2, #groups)
            test.eq(2, groups[1].count)
            test.eq(origin.id, groups[1].origin.id)
            test.eq(1, groups[2].count)
            test.is_nil(groups[2].origin)
        end)
    end)
end)}
