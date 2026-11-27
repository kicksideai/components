-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local json = require("json")
local sql = require("sql")
local delivery_wait = require("delivery_wait")

local function register(support)
    local test = support.test
    local session = support.session
    local settings = support.settings
    local request = support.request
    local data = support.data
    local create = support.create
    local await_delivery = support.await_delivery
    local fixture = support.fixture
    local own = support.own
    local configure = support.configure
    local state = support.state

    test.it("broadcasts topic-only library and Activity invalidations after commit", function()
        local db = assert(sql.get("app:db"))
        assert(db:execute("DELETE FROM mail_realtime_fixture"))
        local resource, subject = "event-frame", "Realtime fixture delivery"
        for topic, name in pairs({["fixture.observe_library"] = resource, ["fixture.observe_activity"] = subject}) do
            assert(db:execute("INSERT INTO mail_realtime_fixture (topic,subject,data,observed) VALUES ($1,$2,'{}','')",
                {topic, name}))
        end
        assert(db:release())
        local observe = delivery_wait.observe(nil, "10s")
        local editor = session("editor_sender")
        local admin = session("delivery")
        configure()
        local item = own(fixture("base", resource, "{{ block body() }}{{ end }}"))
        local saved = create(editor, item)
        test.eq(409, (request(editor, "POST", "/library", item)))
        local send = data(editor, "POST", "/library/send-test", {
            message = "notice", vars = {subject = subject},
        }, 202)
        state.activity_rows[#state.activity_rows + 1] = send.message_id
        local events = assert(observe(function()
            local connection = assert(sql.get("app:db"))
            local rows, err = connection:query("SELECT data, observed FROM mail_realtime_fixture WHERE subject='fixture'")
            assert(connection:release())
            return rows, err
        end, function(rows) return rows and #rows >= 3 end))
        test.eq(3, #events)
        local seen = {}
        for _, event in ipairs(events) do
            local envelope = assert(json.decode(event.data))
            local fields = 0
            for _ in pairs(envelope) do fields = fields + 1 end
            test.eq(1, fields)
            if envelope.topic == "mail.library" then
                test.eq(tostring(saved.revision), event.observed)
                seen.library = true
            else
                test.eq("mail.activity", envelope.topic)
                seen[event.observed] = true
            end
        end
        test.is_true(seen.library)
        test.is_true(seen.queued)
        test.is_true(seen.sent)
        test.eq("sent", data(admin, "GET", "/activity/" .. send.message_id).status)
        data(editor, "DELETE", "/library/base/" .. item.name, {expected_revision = saved.revision})
    end)

    test.it("uses a generated Mail settings block when Mail Admin is absent", function()
        local admin = session("settings_admin")
        local status, body, raw = request(admin, "GET", "/settings/blocks", nil, nil, "/api")
        test.eq(200, status, raw)
        local count = 0
        for _, block in ipairs(body.blocks) do
            if block.namespace == "kickside.mail" then
                count = count + 1
                test.eq("Mail", block.title)
                test.eq("kickside.mail", block.key)
                test.is_nil(block.component_tag)
            end
        end
        test.eq(1, count)
    end)

    test.it("lists the admitted transport status through the delivery endpoint", function()
        local admin = session("delivery")
        local listed = data(admin, "GET", "/delivery").transports
        test.eq(4, #listed)
        local driver = listed[1]
        test.eq("app.mail_harness:capture", driver.id)
        test.eq("Capture", driver.title)
        test.eq("lucide:mail", driver.icon)
        test.not_nil(driver.description)
        test.is_true(driver.ready)
        test.is_true(driver.idempotent)
    end)

    test.it("authorizes delivery administration and sends tests only to the acting address", function()
        local editor = session("editor_sender")
        local admin = session("delivery_sender")
        local sender = session("sender")
        configure()
        local status = data(admin, "GET", "/delivery")
        test.eq("app.mail_harness:capture", status.driver.id)
        test.is_true(status.configured)
        test.is_true(status.ready)
        test.eq("app.mail_harness:capture", status.transports[1].id)
        test.is_true(status.transports[1].ready)
        test.eq("mail@example.org", status.from.address)
        test.eq(403, (request(sender, "GET", "/activity")))
        test.eq(400, request(editor, "POST", "/library/send-test", {message = "notice", to = {"other@example.org"}}))
        test.eq(400, request(admin, "POST", "/delivery/send-test", {to = {"other@example.org"}}))
        local messages = {
            {data(editor, "POST", "/library/send-test", {message = "notice"}, 202), editor},
            {data(admin, "POST", "/delivery/send-test", nil, 202), admin},
        }
        for _, pair in ipairs(messages) do
            local id, actor = pair[1].message_id, pair[2]
            local entry = await_delivery(admin, id)
            test.eq(1, #entry.to)
            test.eq(actor.email, entry.to[1])
            test.eq("test", entry.origin.kind)
            test.eq(actor.id, entry.origin.id)
        end
        local activity = data(admin, "GET", "/activity?status=sent&message=notice&limit=1&since=0")
        test.eq("notice", activity.items[1].template)
        settings("", "")
        state.configured = false
        local unconfigured = data(admin, "GET", "/delivery")
        test.is_false(unconfigured.configured)
        test.eq("driver_required", unconfigured.code)
        test.eq("Choose a delivery service for Mail.", unconfigured.reason)
        local status_code, refused = request(editor, "POST", "/library/send-test", {message = "notice"})
        test.eq(400, status_code)
        test.eq("invalid_config", refused.code)
        test.eq(errors.INVALID, refused.kind)
        test.eq(refused.code, refused.details.code)
        for key in pairs(refused.details) do test.eq("code", key) end
        local admin_status, admin_refusal = request(admin, "POST", "/delivery/send-test")
        test.eq(status_code, admin_status)
        test.eq(refused.code, admin_refusal.code)
        test.eq(refused.kind, admin_refusal.kind)
        local preview = data(editor, "POST", "/library/preview", {message = "notice"})
        test.not_nil(preview.html)
    end)
end

return {register = register}
