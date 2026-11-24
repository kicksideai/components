-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local contract = require("contract")
local funcs = require("funcs")
local http = require("http_client")
local json = require("json")
local registry = require("registry")
local security = require("security")
local sql = require("sql")
local system = require("system")
local time = require("time")
local uuid = require("uuid")
local test = require("test")
local library_fixtures = require("library_fixtures")

local API = "/api/mail"
local ZERO = "00000000-0000-0000-0000-000000000000"

local function session(names)
    local id = uuid.v4()
    local email = id .. "@example.org"
    local db = assert(sql.get("app:db"))
    assert(db:execute([[INSERT INTO app_users (user_id,email,full_name,password_hash,status)
        VALUES ($1,$2,'Mail fixture','test-only','active')]], {id, email}))
    local groups = {"app.mail_api:" .. names, "app:user"}
    if names:find("sender", 1, true) then groups[#groups + 1] = "app:mail_senders" end
    for _, group in ipairs(groups) do
        assert(db:execute("INSERT INTO app_user_groups (user_id,group_id) VALUES ($1,$2)", {id, group}))
    end
    assert(db:release())
    assert(funcs.call("kickside.security.binding:materialize_group_set", {groups = groups}))
    local actor = assert(security.new_actor(id, {user_id = id, email = email, full_name = "Mail fixture", security_groups = groups}))
    local scope = assert(security.named_scope(groups[1]))
    local tokens = assert(security.token_store("kickside.users.security:tokens"))
    local token = assert(tokens:create(actor, scope, {expiration = "1h"}))
    tokens:close()
    return {token = token, actor = actor, scope = scope, id = id, email = email}
end

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

local function settings(driver, address)
    local settings = assert(assert(contract.get("kickside.settings:settings")):open())
    if driver == "" then
        assert(settings:unset({namespace = "kickside.mail", key = "driver"}).success)
        assert(settings:unset({namespace = "kickside.mail", key = "from_address"}).success)
    else
        assert(settings:set({namespace = "kickside.mail", key = "driver", value = driver}).success)
        assert(settings:set({namespace = "kickside.mail", key = "from_address", value = address}).success)
    end
end

local function fixture(kind, name, content)
    local result = {kind = kind, name = name, title = name, description = "", html = content, text = content,
        schema = {type = "object", properties = {}}, samples = {}}
    return result
end

return {run = test.run_cases(function()
    test.describe("Mail HTTP", function()
        local owned, configured
        test.before_each(function()
            owned, configured = {}, false
        end)
        local function own(item)
            owned[#owned + 1] = {kind = item.kind, name = item.name}
            return item
        end
        local function configure()
            configured = true
            settings("capture", "mail@example.org")
        end
        test.after_each(function()
            library_fixtures.remove(owned)
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
                    if path:match("^/library") or path:match("^/delivery") or not path:match("/resend$") then
                        local denied, _, raw = request(sender, endpoint.data.method, path, {})
                        assert(denied == 403, endpoint.id .. " returned " .. denied .. ": " .. raw)
                    end
                end
            end
            test.eq(17, count)
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
            test.eq(403, request(sender, "GET", "/activity"))
            test.eq(400, request(editor, "POST", "/library/send-test", {message = "notice", to = {"other@example.org"}}))
            test.eq(400, request(admin, "POST", "/delivery/send-test", {to = {"other@example.org"}}))
            local messages = {
                {data(editor, "POST", "/library/send-test", {message = "notice"}, 202), editor},
                {data(admin, "POST", "/delivery/send-test", nil, 202), admin},
            }
            for _, pair in ipairs(messages) do
                local id, actor = pair[1].message_id, pair[2]
                local entry
                local deadline = time.now():add(10 * time.SECOND):unix_nano()
                repeat
                    entry = data(admin, "GET", "/activity/" .. id)
                    if entry.status == "queued" then time.sleep("20ms") end
                until entry.status ~= "queued" or time.now():unix_nano() >= deadline
                test.eq("sent", entry.status)
                test.eq(1, #entry.to)
                test.eq(actor.email, entry.to[1])
                test.eq("test", entry.origin.kind)
                test.eq(actor.id, entry.origin.id)
            end
            local activity = data(admin, "GET", "/activity?status=sent&message=notice&limit=1&since=0")
            test.eq("notice", activity.items[1].template)
            test.is_false(data(admin, "GET", "/delivery").configured)
        end)
    end)
end)}
