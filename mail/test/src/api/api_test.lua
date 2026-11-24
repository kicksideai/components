-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local funcs = require("funcs")
local http = require("http_client")
local json = require("json")
local registry = require("registry")
local sql = require("sql")
local system = require("system")
local time = require("time")
local uuid = require("uuid")
local test = require("test")
local library_fixtures = require("library_fixtures")
local fixtures = require("fixtures")
local session = fixtures.session
local settings = fixtures.settings

local API = "/api/mail"
local ZERO = "00000000-0000-0000-0000-000000000000"

local function request(who, method, path, payload)
    local state = assert(system.supervisor.state("app:gateway"))
    local address = assert(state.details:match("^service listening on (127%.0%.0%.1:[1-9]%d*)$"), state.details)
    local headers = {["Content-Type"] = "application/json"}
    if who then headers.Authorization = "Bearer " .. who.token end
    local res = assert(http.request(method, "http://" .. address .. API .. path, {
        headers = headers, body = payload and assert(json.encode(payload)) or nil,
    }))
    return res.status_code, res.body ~= "" and json.decode(res.body) or nil, res.body
end

local function data(who, method, path, payload, expected)
    local status, body, raw = request(who, method, path, payload)
    assert(status == (expected or 200), method .. " " .. path .. " returned " .. status .. ": " .. raw)
    test.is_true(body.success, raw)
    return body.data
end

local function await_delivery(who, id)
    local entry
    local deadline = time.now():add(10 * time.SECOND):unix_nano()
    repeat
        entry = data(who, "GET", "/activity/" .. id)
        if entry.status == "queued" then time.sleep("20ms") end
    until entry.status ~= "queued" or time.now():unix_nano() >= deadline
    test.eq("sent", entry.status)
    return entry
end

local function fixture(kind, name, content)
    local result = {kind = kind, name = name, title = name, description = "", html = content, text = content,
        schema = {type = "object", properties = {}}, samples = {}}
    return result
end

return {run = test.run_cases(function()
    test.describe("Mail HTTP", function()
        local owned, activity_rows, configured
        test.before_each(function()
            owned, activity_rows, configured = {}, {}, false
        end)
        local function own(item)
            owned[#owned + 1] = {kind = item.kind, name = item.name}
            return item
        end
        local function configure()
            configured = true
            settings("capture", "mail@example.org")
        end
        local function failed(sender, subject, recipient, at)
            local id = uuid.v4()
            activity_rows[#activity_rows + 1] = id
            local now = at or time.now():unix_nano() // 1000000
            local db = assert(sql.get("app:db"))
            assert(db:execute([[INSERT INTO mail_message
                (id,created_at,finished_at,status,sender,recipients,subject,from_address,attachments,driver_id,
                error_kind,error_code,error_message,provider_detail,failed_html,failed_text)
                VALUES ($1,$2,$2,'failed',$3,$4,$5,'mail@example.org','[]','fixture',
                'PERMISSION_DENIED','credentials_invalid','Provider authorization refused','Provider response',
                '<p>Saved content</p>','Saved content')]],
                {id, now, sender, assert(json.encode({to = {recipient}})), subject}))
            assert(db:release())
            return id
        end
        test.after_each(function()
            library_fixtures.remove(owned)
            if #activity_rows > 0 then
                local db = assert(sql.get("app:db"))
                for _, id in ipairs(activity_rows) do
                    assert(db:execute("DELETE FROM mail_message WHERE id=$1", {id}))
                end
                assert(db:release())
            end
            if configured then settings("", "") end
        end)

        test.it("requires authenticated capability on each exact endpoint", function()
            local sender = session("sender")
            local editor = session("editor")
            local admin = session("delivery")
            local endpoints = assert(registry.find({[".kind"] = "http.endpoint"}))
            local count = 0
            for _, endpoint in ipairs(endpoints) do
                if endpoint.id:match("^kickside%.mail%.api:") then
                    count = count + 1
                    local path = endpoint.data.path:sub(#"/mail" + 1):gsub("{kind}", "message"):gsub("{name}", "notice"):gsub("{id}", ZERO)
                    test.eq(401, (request(nil, endpoint.data.method, path, {})), endpoint.id)
                    if path:match("^/library") or path:match("^/delivery") then
                        local denied, _, raw = request(sender, endpoint.data.method, path, {})
                        assert(denied == 403, endpoint.id .. " returned " .. denied .. ": " .. raw)
                    end
                end
            end
            test.eq(18, count)
            local predicate = "kickside.mail.api:library_list.endpoint"
            test.eq("allow", editor.scope:evaluate(editor.actor, "access", predicate))
            test.neq("allow", sender.scope:evaluate(sender.actor, "access", predicate))
            test.eq(403, request(editor, "GET", "/delivery"))
            test.eq(403, request(admin, "GET", "/library"))
            local status, body = request(sender, "POST", "/activity/" .. ZERO .. "/resend")
            test.eq(404, status)
            test.eq(errors.NOT_FOUND, body.kind)
            test.eq("message_not_found", body.code)
        end)

        test.it("allows scoped Mail managers to discover System tabs", function()
            local endpoint = "kickside.ui.api:list_settings_tabs.endpoint"
            for _, role in ipairs({"editor", "delivery"}) do
                local manager = session(role)
                test.eq("allow", manager.scope:evaluate(manager.actor, "access", endpoint), role)
            end
            local sender = session("sender")
            test.neq("allow", sender.scope:evaluate(sender.actor, "access", endpoint))
        end)

        test.it("returns editable shipped templates without license comments", function()
            local editor = session("editor")
            local originals = data(editor, "GET", "/library?state=original")
            local faces = 0
            for _, item in ipairs(originals.items) do
                if item.kind ~= "asset" then
                    local resource = data(editor, "GET", "/library/" .. item.kind .. "/" .. item.name)
                    test.is_nil(resource.html:find("SPDX-License-Identifier", 1, true), item.name)
                    test.is_nil(resource.text:find("SPDX-License-Identifier", 1, true), item.name)
                    test.is_nil(resource.description:find("site.title", 1, true), item.name)
                    test.is_nil(resource.description:find("text face", 1, true), item.name)
                    faces = faces + 1
                end
            end
            test.is_true(faces > 0)
        end)

        test.it("reads shipped source before and during customization", function()
            local editor = session("editor")
            local route = "/library/message/notice"
            local shipped = data(editor, "GET", route)
            own(shipped)
            local edit = {kind = shipped.kind, name = shipped.name, title = shipped.title, description = shipped.description,
                html = shipped.html, text = shipped.text, subject = "Customized subject", base = shipped.base,
                schema = shipped.schema, samples = shipped.samples, expected_revision = shipped.revision}
            data(editor, "PUT", route, edit)
            local current = data(editor, "GET", route)
            test.eq("customized", current.state)
            test.eq("Customized subject", current.subject)
            for _, field in ipairs({"html", "text", "subject", "base"}) do
                test.eq(shipped[field], current.original[field], field)
            end
            test.eq(shipped.schema.properties.subject.type, current.original.schema.properties.subject.type)
            test.eq(shipped.samples.subject, current.original.samples.subject)
            test.eq(403, (request(session("sender"), "GET", route)))
            local part = own(fixture("part", "original-source-local", "Local part"))
            data(editor, "POST", "/library", part, 201)
            test.is_nil(data(editor, "GET", "/library/part/" .. part.name).original)
        end)

        test.it("labels shipped resources with their owning module title", function()
            local editor = session("editor")
            local list = data(editor, "GET", "/library?kind=message&state=original")
            local notice, reminder
            for _, item in ipairs(list.items) do
                if item.name == "notice" then notice = item end
                if item.name == "reminder" then reminder = item end
            end
            test.eq("kickside.mail.views:notice_template", notice.origin)
            test.eq("Mail", notice.origin_label)
            test.eq("KickSide", reminder.origin_label)
            test.eq(notice.origin_label, data(editor, "GET", "/library/message/notice").origin_label)
        end)

        test.it("reports the effective Mail capabilities of the authenticated caller", function()
            test.eq(401, (request(nil, "GET", "/capabilities")))
            local expected = {
                member = {false, false, false},
                log_reader = {false, false, false},
                sender = {true, false, false},
                editor = {false, true, false},
                delivery = {false, false, true},
                editor_sender = {true, true, false},
                delivery_sender = {true, false, true},
            }
            for role, flags in pairs(expected) do
                local capabilities = data(session(role ~= "member" and role or nil), "GET", "/capabilities")
                test.eq(flags[1], capabilities.send, role)
                test.eq(flags[2], capabilities.edit_library, role)
                test.eq(flags[3], capabilities.administer_delivery, role)
            end
        end)

        test.it("lets senders read and resend only their own messages over HTTP", function()
            local sender = session("sender")
            local other = session("sender")
            local admin = session("delivery")
            local editor = session("editor")
            local own_id = failed(sender.id, "Sender activity", "reader@example.org")
            local other_id = failed(other.id, "Sender activity", "other@example.org")
            local page = data(sender, "GET", "/activity")
            test.eq(1, #page.items)
            test.eq(own_id, page.items[1].message_id)
            local message = data(sender, "GET", "/activity/" .. own_id)
            test.is_nil(message.driver_id)
            test.is_nil(message.provider_message_id)
            test.is_nil(message.last_error.provider_detail)
            test.eq("Ask a mail administrator to check delivery authorization.", message.last_error.message)
            test.eq(404, (request(sender, "GET", "/activity/" .. other_id)))
            test.eq(404, (request(sender, "POST", "/activity/" .. other_id .. "/resend")))
            test.eq(403, (request(editor, "GET", "/activity")))
            local full = data(admin, "GET", "/activity/" .. own_id)
            test.eq("fixture", full.driver_id)
            test.eq("Provider response", full.last_error.provider_detail)
            configure()
            local resent = data(sender, "POST", "/activity/" .. own_id .. "/resend", nil, 202)
            test.eq(own_id, await_delivery(sender, resent.message_id).resend_of)
        end)

        test.it("searches effective library source and returns summary rows on request", function()
            local editor = session("editor")
            local filtered = data(editor, "GET", "/library?kind=part&q=margin-right%3A8px&view=summary")
            test.eq(1, #filtered.items)
            local header = filtered.items[1]
            test.eq("header", header.name)
            test.eq("part", header.kind)
            test.eq("original", header.state)
            test.eq("Mail", header.origin_label)
            test.is_nil(header.html)
            test.is_nil(header.text)
            test.is_nil(header.subject)
            test.is_nil(header.samples)
            local full = data(editor, "GET", "/library?kind=part&q=margin-right%3A8px")
            test.is_true(full.items[1].html:find("margin-right:8px", 1, true) ~= nil)
            test.eq(full.items[1].html, data(editor, "GET", "/library/part/header").html)
            local bases = data(editor, "GET", "/library?kind=base&q=standard&view=summary")
            test.eq(1, #bases.items)
            test.is_true(bases.items[1].used_by.messages >= 1)
        end)

        test.it("searches activity subjects and recipients with unpaged totals and today's failures", function()
            local admin = session("delivery")
            local first = failed(admin.id, "Status Needle", "reader@example.org")
            local second = failed(admin.id, "Daily digest", "needle%tag@example.org")
            failed(admin.id, "Daily digest", "other@example.org")
            failed(admin.id, "Old digest", "old@example.org", 1)
            local page = data(admin, "GET", "/activity?q=NEEDLE&status=failed&limit=1")
            test.eq(2, page.total)
            test.is_true(page.has_more)
            test.is_true(page.failed_today >= 3)
            local next_page = data(admin, "GET", "/activity?q=needle&status=failed&limit=1&cursor=" .. page.next_cursor)
            test.eq(2, next_page.total)
            test.is_false(next_page.has_more)
            local seen = {[page.items[1].message_id] = true, [next_page.items[1].message_id] = true}
            test.is_true(seen[first] and seen[second])
            local exact = data(admin, "GET", "/activity?q=needle%25tag")
            test.eq(1, exact.total)
            test.eq(second, exact.items[1].message_id)
            local empty = data(admin, "GET", "/activity?q=unmatched-string")
            test.eq(0, empty.total)
            test.eq(page.failed_today, empty.failed_today)
        end)

        test.it("encodes empty sample and schema maps as JSON objects", function()
            local editor = session("editor")
            local part = own(fixture("part", "empty-maps", "Part"))
            local route = "/library/part/" .. part.name
            local function assert_maps(method, path, content, expected)
                local status, _, raw = request(editor, method, path, content)
                test.eq(expected, status, raw)
                test.not_nil(raw:match('"samples"%s*:%s*{}'), raw)
                test.not_nil(raw:match('"properties"%s*:%s*{}'), raw)
            end
            assert_maps("GET", "/library/part/header", nil, 200)
            assert_maps("GET", "/library/asset/logo", nil, 200)
            assert_maps("POST", "/library", part, 201)
            assert_maps("GET", route, nil, 200)
            assert_maps("GET", "/library?kind=part&q=empty-maps", nil, 200)
            assert_maps("GET", route .. "/history", nil, 200)
        end)

        test.it("records per-resource versions and the action that produced each revision", function()
            local editor = session("editor")
            local item = own(fixture("message", "history-actions", "{{ block body() }}Initial{{ end }}"))
            item.base, item.subject = "plain", "Initial subject"
            local route = "/library/message/" .. item.name
            local created = data(editor, "POST", "/library", item, 201)
            data(editor, "POST", "/library", own(fixture("part", "history-interleave", "Part")), 201)
            item.expected_revision = created.revision
            item.note = "Reword subject"
            item.subject = "Edited subject"
            local edited = data(editor, "PUT", route, item)
            local moved = data(editor, "POST", route .. "/base", {base = "standard", expected_revision = edited.revision})
            local restored = data(editor, "POST", route .. "/restore", {revision = created.revision, expected_revision = moved.revision})
            local history = data(editor, "GET", route .. "/history").items
            test.eq(4, #history)
            test.eq("restored", history[1].action)
            test.eq(1, history[1].restored_from)
            test.eq(4, history[1].version)
            test.eq("created", history[1].state)
            test.eq(restored.revision, history[1].revision)
            test.eq("base_changed", history[2].action)
            test.eq("edited", history[3].action)
            test.eq("Reword subject", history[3].note)
            test.eq("created", history[4].action)
            test.eq(1, history[4].version)
            test.eq(created.revision, history[4].revision)
            local original = own(data(editor, "GET", "/library/base/plain"))
            original.expected_revision = original.revision
            local custom = data(editor, "PUT", "/library/base/plain", original)
            data(editor, "POST", "/library/base/plain/reset", {expected_revision = custom.revision})
            local reset = data(editor, "GET", "/library/base/plain/history").items[1]
            test.eq("reset", reset.action)
            test.eq("original", reset.state)
            test.eq(2, reset.version)
        end)

        test.it("labels library authors and delivery senders through the principal directory", function()
            local editor = session("editor")
            local item = own(fixture("part", "label-part", "Content"))
            data(editor, "POST", "/library", item, 201)
            local row = data(editor, "GET", "/library/part/" .. item.name)
            test.eq(editor.id, row.author)
            test.eq(editor.id, row.author_label.id)
            test.eq("user", row.author_label.kind)
            test.eq("Mail fixture", row.author_label.label)
            local list = data(editor, "GET", "/library?kind=part&q=label-part")
            test.eq("Mail fixture", list.items[1].author_label.label)
            local history = data(editor, "GET", "/library/part/" .. item.name .. "/history")
            test.eq("Mail fixture", history.items[1].author_label.label)
            local admin = session("delivery")
            local sender = session("sender")
            local id = failed(sender.id, "Directory person", "label@example.org")
            local missing = failed(ZERO, "Directory person", "absent@example.org")
            local service = failed("principal:service:fixture", "Directory person", "service@example.org")
            local found = data(admin, "GET", "/activity/" .. id)
            test.eq(sender.id, found.sender)
            test.eq("Mail fixture", found.sender_label.label)
            test.eq("Unknown account", data(admin, "GET", "/activity/" .. missing).sender_label.label)
            local service_label = data(admin, "GET", "/activity/" .. service).sender_label
            test.eq("service", service_label.kind)
            test.eq("Unknown account", service_label.label)
            local page = data(admin, "GET", "/activity?q=Directory%20person")
            test.eq(3, #page.items)
            for _, entry in ipairs(page.items) do test.not_nil(entry.sender_label) end
        end)

        test.it("lists the packaged asset and previews its CID under the editor capability", function()
            local editor = session("editor")
            local sender = session("sender")
            local assets = data(editor, "GET", "/library?kind=asset")
            test.eq(1, #assets.items)
            test.eq("logo", assets.items[1].name)
            local logo = data(editor, "GET", "/library/asset/logo")
            test.eq("original", logo.state)
            test.eq("image/png", logo.asset.content_type)
            test.eq(32, logo.asset.width)
            test.eq("notice", logo.used_by.messages[1])
            local preview = data(editor, "POST", "/library/preview", {message = "notice"})
            test.not_nil(preview.html:find('src="cid:mail-library-logo"', 1, true))
            test.not_nil(preview.inline_assets["mail-library-logo"]:match("^data:image/png;base64,"))
            test.eq(403, (request(sender, "GET", "/library/asset/logo")))
            test.eq(403, (request(sender, "POST", "/library", {kind = "asset", name = "proof"})))
        end)

        test.it("serves library edits and candidate previews through the router", function()
            local editor = session("editor")
            local base = own(fixture("base", "http-frame", "[{{ block body() }}{{ end }}]"))
            local saved_base = data(editor, "POST", "/library", base, 201)
            local msg = own(fixture("message", "http-message", "{{ block body() }}Body{{ end }}"))
            msg.base, msg.subject = base.name, "Hello"
            local saved = data(editor, "POST", "/library", msg, 201)
            local copy = data(editor, "POST", "/library", own({kind = "message", name = "http-copy",
                from = {kind = "message", name = msg.name}, title = "Copy of the fixture"}), 201)
            test.eq(msg.subject, copy.subject)
            test.eq(msg.base, copy.base)
            local list = data(editor, "GET", "/library?kind=message&state=created&q=fixture")
            test.eq(1, #list.items)
            test.eq(copy.name, list.items[1].name)
            local name = "/library/message/" .. msg.name
            test.eq(saved.revision, data(editor, "GET", name).revision)
            local use = data(editor, "GET", "/library/base/" .. base.name)
            test.eq(2, #use.used_by.messages)
            test.eq(copy.name, use.used_by.messages[1])
            test.eq(msg.name, use.used_by.messages[2])
            local status, blocked = request(editor, "DELETE", "/library/base/" .. base.name,
                {expected_revision = saved_base.revision})
            test.eq(409, status)
            test.eq("mail_resource_in_use", blocked.code)

            local draft = fixture("message", msg.name, "{{ block body() }}Draft body{{ end }}")
            draft.base, draft.subject = base.name, "Draft subject"
            local preview = data(editor, "POST", "/library/preview", {message = msg.name, resources = {draft}})
            test.eq("Draft subject", preview.subject)
            test.eq("[Draft body]", preview.html)
            test.eq("[Draft body]", preview.text)
            draft.html = "{{ block body() }}{{ unknown_value }}{{ end }}"
            local bad_status, bad = request(editor, "POST", "/library/preview", {message = msg.name, resources = {draft}})
            test.eq(400, bad_status)
            test.eq(msg.name, bad.details.resource.name)
            test.eq("html", bad.details.face)
            draft.html = draft.text
            draft.expected_revision = saved.revision
            base.expected_revision = saved_base.revision
            local result = data(editor, "POST", "/library/save", {resources = {draft, base}, note = "Save both"})
            test.eq(2, #result.items)
            copy.expected_revision = copy.revision
            copy.title = "New copy name"
            local single = data(editor, "PUT", "/library/message/" .. copy.name, copy)
            local moved = data(editor, "POST", name .. "/base", {base = "plain", expected_revision = result.items[1].revision})
            local revisions = data(editor, "GET", name .. "/history")
            test.eq(3, #revisions.items)
            test.eq("Save both", revisions.items[2].note)
            local restored = data(editor, "POST", name .. "/restore", {revision = saved.revision, expected_revision = moved.revision})
            test.eq(base.name, restored.base)
            local shipped = own(data(editor, "GET", "/library/base/plain"))
            local original_revision = shipped.revision
            shipped.html, shipped.text = base.html, base.text
            shipped.expected_revision = original_revision
            local customized = data(editor, "PUT", "/library/base/plain", shipped)
            local reset = data(editor, "POST", "/library/base/plain/reset", {expected_revision = customized.revision})
            test.eq("original", reset.state)
            test.is_true(reset.revision > original_revision)

            data(editor, "DELETE", name, {expected_revision = restored.revision})
            data(editor, "DELETE", "/library/message/" .. copy.name, {expected_revision = single.revision})
            data(editor, "DELETE", "/library/base/" .. base.name, {expected_revision = result.items[2].revision})
        end)

        test.it("emits library and delivery wake-ups only for committed state", function()
            local db = assert(sql.get("app:db"))
            assert(db:execute("DELETE FROM mail_realtime_fixture"))
            assert(db:release())
            local editor = session("editor_sender")
            local admin = session("delivery")
            configure()
            local item = own(fixture("base", "event-frame", "{{ block body() }}{{ end }}"))
            local saved = data(editor, "POST", "/library", item, 201)
            item.expected_revision = 0
            test.eq(409, (request(editor, "PUT", "/library/base/" .. item.name, item)))
            local send = data(editor, "POST", "/library/send-test", {message = "notice"}, 202)
            local deadline = time.now():add(10 * time.SECOND):unix_nano()
            local events
            repeat
                db = assert(sql.get("app:db"))
                events = assert(db:query("SELECT topic, data, observed FROM mail_realtime_fixture WHERE subject IN ($1,$2)",
                    {item.name, send.message_id}))
                assert(db:release())
                if #events < 3 then time.sleep("20ms") end
            until #events >= 3 or time.now():unix_nano() >= deadline
            test.eq(3, #events)
            local seen = {}
            for _, event in ipairs(events) do
                local payload = assert(json.decode(event.data))
                if event.topic == "mail.library.changed" then
                    test.eq("base", payload.kind)
                    test.eq(item.name, payload.name)
                    test.eq(saved.revision, payload.revision)
                    test.eq(tostring(saved.revision), event.observed)
                    test.is_nil(payload.html)
                    seen.library = true
                else
                    test.eq("mail.message.changed", event.topic)
                    test.eq(send.message_id, payload.message_id)
                    test.is_nil(payload.subject)
                    if payload.status == "sent" then test.eq("sent", event.observed) end
                    seen[payload.status] = true
                end
            end
            test.is_true(seen.library)
            test.is_true(seen.queued)
            test.is_true(seen.sent)
            test.eq("sent", data(admin, "GET", "/activity/" .. send.message_id).status)
            data(editor, "DELETE", "/library/base/" .. item.name, {expected_revision = saved.revision})
        end)

        test.it("authorizes delivery administration and sends tests only to the acting address", function()
            local editor = session("editor_sender")
            local admin = session("delivery_sender")
            local sender = session("sender")
            configure()
            local status = data(admin, "GET", "/delivery")
            test.eq("capture", status.driver.id)
            test.is_true(status.configured)
            test.eq("mail@example.org", status.from.address)
            test.eq(0, #data(sender, "GET", "/activity").items)
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
            configured = false
            test.is_false(data(admin, "GET", "/delivery").configured)
        end)
    end)
end)}
