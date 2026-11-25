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

local function request(who, method, path, payload, headers, prefix)
    local state = assert(system.supervisor.state("app:gateway"))
    local address = assert(state.details:match("^service listening on (127%.0%.0%.1:[1-9]%d*)$"), state.details)
    headers = headers or {}
    headers["Content-Type"] = "application/json"
    if who then headers.Authorization = "Bearer " .. who.token end
    local res = assert(http.request(method, "http://" .. address .. (prefix or API) .. path, {
        headers = headers, body = payload and assert(json.encode(payload)) or nil,
    }))
    return res.status_code, res.body ~= "" and json.decode(res.body) or nil, res.body, res.headers
end

local function data(who, method, path, payload, expected)
    local status, body, raw = request(who, method, path, payload)
    assert(status == (expected or 200), method .. " " .. path .. " returned " .. status .. ": " .. raw)
    test.is_true(body.success, raw)
    return body.data
end

local function review(who, message, edit)
    edit.message = message
    local result = data(who, "POST", "/library/preview", edit)
    return assert(result.preview_id, result.errors[1] and result.errors[1].message)
end

local function create(who, item)
    item.preview_id = review(who, item.kind == "message" and item.name or "notice", {create = item})
    return data(who, "POST", "/library", item, 201)
end

local function update(who, item, message)
    item.preview_id = review(who, message or (item.kind == "message" and item.name or "notice"), {resources = {item}})
    return data(who, "PUT", "/library/" .. item.kind .. "/" .. item.name, item)
end

local function revision_write(who, operation, item, fields, message)
    fields.kind, fields.name = item.kind, item.name
    fields.expected_revision = item.revision
    local route = "/library/" .. item.kind .. "/" .. item.name .. "/" .. operation
    local draft = {[operation == "base" and "set_base" or operation] = fields}
    fields.preview_id = review(who, message or (item.kind == "message" and item.name or "notice"), draft)
    return data(who, "POST", route, fields)
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
        local owned, activity_rows, activity_sender, configured
        test.before_each(function()
            owned, activity_rows, activity_sender, configured = {}, {}, nil, false
        end)
        local function own(item)
            owned[#owned + 1] = {kind = item.kind, name = item.name}
            return item
        end
        local function configure()
            configured = true
            settings("kickside.mail.harness:capture", "mail@example.org")
        end
        local function failed(sender, subject, recipient, at, template)
            local id = uuid.v4()
            activity_rows[#activity_rows + 1] = id
            local now = at or time.now():unix_nano() // 1000000
            local db = assert(sql.get("app:db"))
            assert(db:execute([[INSERT INTO mail_message
                (id,created_at,finished_at,sender,recipients,subject,from_address,attachments,driver_id,
                error_kind,error_code,error_message,provider_detail,failed_html,failed_text,template,status,sent_at)
                VALUES ($1,$2,$2,$3,$4,$5,'mail@example.org','[]','fixture',
                'PERMISSION_DENIED','credentials_invalid','Provider authorization refused','Provider response',
                '<p>Saved content</p>','Saved content',$6,$7,$8)]],
                {id, now, sender, assert(json.encode({to = {recipient}})), subject, template or sql.NULL, template and "sent" or "failed", template and now or sql.NULL}))
            assert(db:release())
            return id
        end
        test.after_each(function()
            library_fixtures.remove(owned)
            if #activity_rows > 0 or activity_sender then
                local db = assert(sql.get("app:db"))
                if activity_sender then
                    assert(db:execute("DELETE FROM mail_message WHERE sender=$1", {activity_sender}))
                end
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
            local library_count = 0
            for _, endpoint in ipairs(endpoints) do
                if endpoint.id:match("^kickside%.mail%.api:") then
                    count = count + 1
                    local path = endpoint.data.path:sub(#"/mail" + 1):gsub("{kind}", "message"):gsub("{name}", "notice"):gsub("{id}", ZERO)
                    test.eq(401, (request(nil, endpoint.data.method, path, {})), endpoint.id)
                    if path:match("^/library") or path:match("^/delivery") or path:match("^/activity") then
                        local denied, _, raw = request(sender, endpoint.data.method, path, {})
                        assert(denied == 403, endpoint.id .. " returned " .. denied .. ": " .. raw)
                    end
                    if path:match("^/library") then
                        library_count = library_count + 1
                        test.eq("allow", editor.scope:evaluate(editor.actor, "access", endpoint.id), endpoint.id)
                    end
                end
            end
            test.eq(19, count)
            test.eq(13, library_count)
            local predicate = "kickside.mail.api:library_list.endpoint"
            test.eq("allow", editor.scope:evaluate(editor.actor, "access", predicate))
            test.neq("allow", sender.scope:evaluate(sender.actor, "access", predicate))
            test.eq(403, request(editor, "GET", "/delivery"))
            test.eq(403, request(admin, "GET", "/library"))

        end)

        test.it("opens the library contract from a foreign caller with the editor capability", function()
            local editor = session("editor")
            local executor = assert(funcs.new():with_actor(editor.actor):with_scope(editor.scope))
            local page = assert(executor:call("app.mail_library:foreign_list", {kind = "base", limit = 1}))
            test.eq(1, #page.items)
            test.not_nil(page.next_cursor)
            test.is_nil(page.items[1].html)

            local sender = session("sender")
            local restricted = assert(funcs.new():with_actor(sender.actor):with_scope(sender.scope))
            local denied, err = restricted:call("app.mail_library:foreign_list", {kind = "base"})
            test.is_nil(denied)
            test.eq(errors.PERMISSION_DENIED, assert(err):kind())
        end)

        test.it("paginates the library without a view parameter", function()
            local editor = session("editor")
            local page = data(editor, "GET", "/library?kind=base&limit=1")
            test.eq(1, #page.items)
            test.not_nil(page.next_cursor)
            test.is_nil(page.items[1].html)
            local next_page = data(editor, "GET", "/library?kind=base&limit=1&cursor=" .. page.next_cursor)
            test.eq(1, #next_page.items)
            test.neq(page.items[1].name, next_page.items[1].name)
        end)

        test.it("shares preview, save and restore between design tools and HTTP", function()
            local editor = session("editor")
            local tools = assert(funcs.new():with_actor(editor.actor):with_scope(editor.scope))
            local path = "/library/message/contract-parity"
            local item = own(fixture("message", "contract-parity", "{{ block body() }}Before{{ end }}"))
            item.base, item.subject = "plain", "Contract parity"
            local created = create(editor, item)
            item.expected_revision = created.revision
            item.preview_id = nil
            item.html = "{{ block body() }}After{{ end }}"
            local input = {message = item.name, resources = {item}}
            local http_preview = data(editor, "POST", "/library/preview", input)
            local tool_preview = assert(tools:call("kickside.mail.traits:library_preview", input))
            test.eq(http_preview.html, tool_preview.html)
            test.not_nil(http_preview.preview_id)
            local saved = assert(tools:call("kickside.mail.traits:library_save", {
                resources = {item}, preview_id = http_preview.preview_id,
            })).items[1]
            test.is_true(saved.revision > created.revision)
            local current = data(editor, "GET", path)
            test.eq(saved.revision, current.revision)
            test.eq(item.html, current.html)

            local source = {kind = item.kind, name = item.name,
                expected_revision = saved.revision, revision = created.revision}
            local restored_preview = assert(tools:call("kickside.mail.traits:library_preview", {message = item.name, restore = source}))
            source.preview_id = assert(restored_preview.preview_id)
            local restored = data(editor, "POST", path .. "/restore", source)
            test.eq(created.html, restored.html)
            local tool_read = assert(tools:call("kickside.mail.traits:library_read", {kind = item.kind, name = item.name}))
            test.eq(restored.revision, tool_read.revision)

            local history = data(editor, "GET", path .. "/history?limit=1")
            test.eq(restored.revision, history.items[1].revision)
            test.not_nil(history.next_cursor)
            local prior = data(editor, "GET", path .. "/history?limit=1&cursor=" .. history.next_cursor)
            test.eq(saved.revision, prior.items[1].revision)
            local detail = data(editor, "GET", path .. "/history?revision=" .. created.revision)
            test.eq(created.html, detail.content.html)
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
            update(editor, edit)
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
            create(editor, part)
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

        test.it("restricts the Activity endpoints to administrators", function()
            local sender = session("sender")
            local admin = session("delivery_sender")
            local editor = session("editor")
            local own_id = failed(sender.id, "Sender activity", "reader@example.org")
            for _, role in ipairs({sender, editor}) do
                test.eq(403, (request(role, "GET", "/activity")))
                test.eq(403, (request(role, "GET", "/activity/" .. own_id)))
                test.eq(403, (request(role, "POST", "/activity/" .. own_id .. "/resend")))
            end
            test.eq(403, (request(session("delivery"), "POST", "/activity/" .. own_id .. "/resend")))
            local full = data(admin, "GET", "/activity/" .. own_id)
            test.eq("fixture", full.driver_id)
            test.eq("credentials_invalid", full.last_error.code)
            test.eq("Provider response", full.last_error.provider_detail)
            configure()
            local resent = data(admin, "POST", "/activity/" .. own_id .. "/resend", nil, 202)
            test.eq(own_id, await_delivery(admin, resent.message_id).resend_of)
        end)

        test.it("searches effective library source and returns summary rows", function()
            local editor = session("editor")
            local filtered = data(editor, "GET", "/library?kind=part&q=margin-right%3A8px")
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
            local full = data(editor, "GET", "/library/part/" .. header.name)
            test.is_true(full.html:find("margin-right:8px", 1, true) ~= nil)
            local bases = data(editor, "GET", "/library?kind=base&q=standard")
            test.eq(1, #bases.items)
            test.is_true(bases.items[1].used_by.messages >= 1)
        end)

        test.it("returns an exact total and one order across stored and packaged library pages", function()
            local editor = session("editor")
            for _, name in ipairs({"zz-paging", "aa-paging"}) do
                create(editor, own(fixture("part", name, "Pagination entry")))
            end
            local route = "/library?kind=part&limit=2"
            local all = data(editor, "GET", "/library?kind=part").items
            local offset, cursor = 1, nil
            repeat
                local page = data(editor, "GET", route .. (cursor and "&cursor=" .. cursor or ""))
                test.eq(#all, page.total)
                for _, item in ipairs(page.items) do
                    test.eq(all[offset].name, item.name)
                    test.is_nil(item.html)
                    offset = offset + 1
                end
                cursor = page.next_cursor
            until not cursor or offset > #all
            test.eq(#all + 1, offset)
            test.is_nil(cursor)
            local absent = data(editor, "GET", route .. "&q=not-a-matching-resource")
            test.eq(0, absent.total)
            test.eq(0, #absent.items)
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

        test.it("reports bounded Activity totals and preserves tied message cursors", function()
            local sender = session("sender")
            local admin = session("delivery")
            activity_sender = sender.id
            local start = time.now():unix_nano() // 1000000 - 10002
            local older = failed(sender.id, "Window boundary", "reader@example.org", start + 1)
            local first = failed(sender.id, "Window boundary", "reader@example.org", start + 10002)
            local second = failed(sender.id, "Window boundary", "reader@example.org", start + 10002)
            local db = assert(sql.get("app:db"))
            assert(db:execute([[WITH RECURSIVE sequence(n) AS (
                SELECT 2 UNION ALL SELECT n+1 FROM sequence WHERE n<10001
            )
            INSERT INTO mail_message (id,created_at,finished_at,sender,recipients,subject,from_address,attachments,driver_id,status)
            SELECT 'window-' || n,CAST($1 AS BIGINT)+n,CAST($1 AS BIGINT)+n,$2,
                '{"to":["reader@example.org"]}','Digest','mail@example.org','[]','fixture','failed'
            FROM sequence]], {start, sender.id}))
            assert(db:release())
            local list = data(admin, "GET", "/activity?limit=1")
            test.eq(10000, list.total)
            test.is_true(list.total_is_lower_bound)
            local search = data(admin, "GET", "/activity?q=Window%20boundary&limit=1")
            test.eq(2, search.total)
            test.is_true(search.total_is_lower_bound)
            test.is_true(search.has_more)
            local next_page = data(admin, "GET", "/activity?q=Window%20boundary&limit=1&cursor=" .. search.next_cursor)
            test.is_false(next_page.has_more)
            local seen = {[search.items[1].message_id] = true, [next_page.items[1].message_id] = true}
            test.is_true(seen[first] and seen[second])
            test.is_nil(seen[older])
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
            part.preview_id = review(editor, "notice", {create = part})
            assert_maps("POST", "/library", part, 201)
            assert_maps("GET", route, nil, 200)
            assert_maps("GET", route .. "/history", nil, 200)
        end)

        test.it("records per-resource versions and the action that produced each revision", function()
            local editor = session("editor")
            local item = own(fixture("message", "history-actions", "{{ block body() }}Initial{{ end }}"))
            item.base, item.subject = "plain", "Initial subject"
            local route = "/library/message/" .. item.name
            local created = create(editor, item)
            create(editor, own(fixture("part", "history-interleave", "Part")))
            item.expected_revision = created.revision
            item.note = "Reword subject"
            item.subject = "Edited subject"
            local edited = update(editor, item)
            local moved = revision_write(editor, "base", edited, {base = "standard"})
            local restored = revision_write(editor, "restore", moved, {revision = created.revision})
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
            local custom = update(editor, original)
            revision_write(editor, "reset", custom, {})
            local reset = data(editor, "GET", "/library/base/plain/history").items[1]
            test.eq("reset", reset.action)
            test.eq("original", reset.state)
            test.eq(2, reset.version)
        end)

        test.it("requires a reviewed draft for an HTTP edit", function()
            local editor = session("editor")
            local item = own(fixture("message", "reviewed-edit", "{{ block body() }}Before{{ end }}"))
            item.subject = "Reviewed edit"
            local route = "/library/message/" .. item.name
            local created = create(editor, item)
            item.expected_revision = created.revision
            item.preview_id = nil
            item.html = "{{ block body() }}After{{ end }}"
            local status, rejected = request(editor, "PUT", route, item)
            test.eq(400, status)
            test.eq("mail_preview_required", rejected.code)
            test.eq(created.revision, data(editor, "GET", route).revision)
            local saved = update(editor, item)
            test.eq(item.html, saved.html)
        end)

        test.it("requires a reviewed draft for an HTTP restore", function()
            local editor = session("editor")
            local item = own(fixture("message", "reviewed-restore", "{{ block body() }}Before{{ end }}"))
            item.subject = "Reviewed restore"
            local route = "/library/message/" .. item.name
            local created = create(editor, item)
            local status, rejected = request(editor, "POST", route .. "/restore",
                {revision = created.revision, expected_revision = created.revision})
            test.eq(400, status)
            test.eq("mail_preview_required", rejected.code)
            test.eq(1, #data(editor, "GET", route .. "/history").items)
            item.expected_revision = created.revision
            local edited = update(editor, item)
            local source = {kind = "message", name = item.name, expected_revision = edited.revision, revision = created.revision}
            item.expected_revision = edited.revision
            source.preview_id = review(editor, item.name, {resources = {item}})
            status, rejected = request(editor, "POST", route .. "/restore", source)
            test.eq(400, status)
            test.eq("mail_preview_mismatch", rejected.code)
            source.preview_id = nil
            local receipt = review(editor, item.name, {restore = source})
            source.preview_id, source.revision = receipt, edited.revision
            status, rejected = request(editor, "POST", route .. "/restore", source)
            test.eq(400, status)
            test.eq("mail_preview_mismatch", rejected.code)
            source.revision = created.revision
            local restored = data(editor, "POST", route .. "/restore", source)
            local history = data(editor, "GET", route .. "/history").items
            test.eq(restored.revision, history[1].revision)
            test.eq("restored", history[1].action)
            test.eq(1, history[1].restored_from)
        end)

        test.it("stores a randomly assigned preview with a fifteen minute expiry", function()
            local editor = session("editor")
            local item = own(fixture("message", "stored-preview", "{{ block body() }}Before{{ end }}"))
            item.subject = "Stored preview"
            local created = create(editor, item)
            item.expected_revision = created.revision
            local before = time.now():unix()
            local draft = {message = item.name, resources = {item}}
            local caller = assert(funcs.new():with_actor(editor.actor):with_scope(editor.scope))
            local first = assert(library_fixtures.call(caller, "preview", draft))
            local second = assert(library_fixtures.call(caller, "preview", draft))
            local db = assert(sql.get("app:db"))
            local rows, read_err = db:query([[SELECT id, digest, expected_json, actor, expires_at FROM mail_library_preview
                WHERE id IN ($1, $2)]], {first.preview_id or "", second.preview_id or ""})
            assert(db:release())
            assert(rows, read_err)
            test.eq(2, #rows)
            test.is_true(uuid.validate(first.preview_id))
            test.is_true(uuid.validate(second.preview_id))
            test.neq(first.preview_id, second.preview_id)
            test.eq(rows[1].digest, rows[2].digest)
            for _, row in ipairs(rows) do
                test.is_true(row.expires_at >= before + 900)
                test.is_true(row.expires_at <= time.now():unix() + 900)
                test.eq(editor.id, row.actor)
                test.eq(created.revision, assert(json.decode(row.expected_json))[item.kind .. "/" .. item.name])
            end
        end)

        test.it("labels library authors and delivery senders through the principal directory", function()
            local editor = session("editor")
            local item = own(fixture("part", "label-part", "Content"))
            create(editor, item)
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

        test.it("labels the recent senders alongside the editor of a message", function()
            local editor = session("editor")
            local sender = session("sender")
            local item = own(fixture("message", "recent-sender-labels", "{{ block body() }}Content{{ end }}"))
            item.base, item.subject = "plain", "Sender labels"
            create(editor, item)
            failed(sender.id, "Recent", "reader@example.org", nil, item.name)
            failed(ZERO, "Recent unknown", "unknown@example.org", nil, item.name)
            local resource = data(editor, "GET", "/library/message/" .. item.name)
            test.eq(editor.id, resource.author_label.id)
            local senders = {}
            for _, row in ipairs(resource.used_by.recent_senders) do senders[row.sender] = row end
            test.eq("Mail fixture", senders[sender.id].sender_label.label)
            test.eq(sender.id, senders[sender.id].sender_label.id)
            test.eq("user", senders[sender.id].sender_label.kind)
            test.eq(1, senders[sender.id].count)
            test.eq("Unknown account", senders[ZERO].sender_label.label)
        end)

        test.it("serves packaged image bytes only to editors and honors the validator", function()
            local path = "/library/asset/logo/content"
            local editor = session("editor")
            local sender = session("sender")
            local status, _, bytes, headers = request(editor, "GET", path)
            test.eq(200, status, bytes)
            test.eq("image/png", headers["Content-Type"])
            test.eq("\137PNG\r\n\26\n", bytes:sub(1, 8))
            local etag = headers.Etag
            test.not_nil(etag:match('^"0%-[a-f0-9]+"$'))
            local cached, _, body = request(editor, "GET", path, nil, {["If-None-Match"] = '"old", W/' .. etag})
            test.eq(304, cached)
            test.eq("", body or "")
            test.eq(403, (request(sender, "GET", path, nil, {["If-None-Match"] = etag})))
            test.eq(401, (request(nil, "GET", path)))
            test.eq(404, (request(editor, "GET", "/library/asset/missing-image/content")))
        end)

        test.it("previews and lists assets with an unrelated scratch entry and clears it on reconciliation", function()
            local editor = session("editor")
            local owner = "kickside.mail.render:live"
            local id = "kickside.mail.draft:html"
            local overlay = assert(registry.overlay(owner))
            local changes = overlay:changes()
            assert(changes:create({id = id, kind = "template.set", data = {engine = {escape = "html"}}}))
            assert(changes:apply())
            local preview = data(editor, "POST", "/library/preview", {message = "notice"})
            test.not_nil(preview.html)
            test.not_nil(registry.get(id))
            local summary, body, raw = request(editor, "GET", "/library?kind=asset")
            local boot = assert(funcs.call("kickside.mail.jobs:reconcile"))
            test.eq("success", boot.status, boot.message)
            local entries = assert(assert(registry.overlay(owner)):entries())
            for _, entry in ipairs(entries) do test.neq(id, entry.id) end
            test.eq(200, summary, raw)
            test.eq("logo", body.data.items[1].name)
            test.eq(2, body.data.items[1].used_by.messages)
            local rendered = data(editor, "POST", "/library/preview", {message = "notice"})
            test.not_nil(rendered.html)
            local item = data(editor, "GET", "/library/asset/logo")
            test.eq("notice", item.used_by.messages[1])
        end)

        test.it("updates asset usage when a message changes base or is deleted", function()
            local editor = session("editor")
            local path = "/library/asset/logo"
            local function summary()
                return data(editor, "GET", "/library?kind=asset").items[1].used_by.messages
            end
            local function used_by()
                return data(editor, "GET", path).used_by.messages
            end
            test.eq(2, summary())
            local item = own(fixture("message", "asset-usage", "{{ block body() }}Usage{{ end }}"))
            item.base, item.subject = "standard", "Usage"
            local saved = create(editor, item)
            test.eq(3, summary())
            test.eq("asset-usage", used_by()[1])
            test.eq("notice", used_by()[2])
            item.base, item.expected_revision = "plain", saved.revision
            saved = update(editor, item)
            test.eq(2, summary())
            test.eq("notice", used_by()[1])
            item.base, item.expected_revision = "standard", saved.revision
            saved = update(editor, item)
            test.eq(3, summary())
            data(editor, "DELETE", "/library/message/" .. item.name, {expected_revision = saved.revision})
            test.eq(2, summary())
            test.eq("notice", used_by()[1])
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

        test.it("refuses malformed draft shapes and library filters consistently", function()
            local editor = session("editor")
            for _, body in ipairs({
                {message = "notice", resource = 12},
                {message = "notice", resource = false},
                {message = "notice", resources = {12}},
                {message = {}, resources = {}},
            }) do
                local status, result = request(editor, "POST", "/library/preview", body)
                test.eq(400, status, json.encode(result))
                test.is_true(result.code == "invalid_mail_draft" or result.code == "invalid_mail_resources",
                    json.encode(result))
            end
            for _, filter in ipairs({"kind=unknown", "q=%00"}) do
                local status, result = request(editor, "GET", "/library?" .. filter)
                test.eq(400, status)
                test.eq("invalid_mail_filter", result.code)
            end
            local status, result = request(editor, "PUT", "/library/part/header", {kind = "part", name = "footer"})
            test.eq(400, status)
            test.eq("invalid_request", result.code)
            status, result = request(editor, "POST", "/library/preview", "notice")
            test.eq(400, status)
            test.eq("invalid_request", result.code)
        end)

        test.it("checks source, name, schema and note byte limits", function()
            local editor = session("editor")
            for _, case in ipairs({
                {field = "name", value = string.rep("n", 129)},
                {field = "html", value = string.rep("h", 65537)},
                {field = "text", value = string.rep("t", 65537)},
                {field = "schema", value = {type = "object", properties = {}, description = string.rep("s", 32768)}},
                {field = "note", value = string.rep("n", 4097), code = "invalid_revision_note"},
            }) do
                local part = own(fixture("part", "rejected-library-size", "Fixture"))
                part[case.field] = case.value
                local status, err = request(editor, "POST", "/library", part)
                test.eq(400, status, case.field)
                test.eq(case.code or "invalid_mail_resource", err.code)
            end
            local exact = own(fixture("part", string.rep("p", 128), string.rep("h", 65536)))
            exact.note = string.rep("n", 4096)
            local created = create(editor, exact)
            test.eq(65536, #created.html)
            test.eq(128, #created.name)
            local status, err = request(editor, "POST", "/library/preview",
                {message = "notice", vars = {message = string.rep("p", 3 * 1024 * 1024)}})
            test.eq(400, status)
            test.eq("invalid_request", err.code)
        end)

        test.it("warns about Gmail clipping and enforces the same render budget in preview and save", function()
            local editor = session("editor_sender")
            local vars = {subject = "Render budget", message = string.rep("'", 22 * 1024)}
            local preview = data(editor, "POST", "/library/preview", {message = "notice", vars = vars})
            test.is_true(#preview.html > 102 * 1024)
            test.eq("gmail_html_clipping", preview.warnings[1].code)
            vars.message = string.rep("'", 54 * 1024)
            local status, refused = request(editor, "POST", "/library/preview", {message = "notice", vars = vars})
            test.eq(400, status)
            test.eq("html_too_large", refused.code)
            test.eq("html", refused.details.face)
            configure()
            local send_status, send_error = request(editor, "POST", "/library/send-test", {message = "notice", vars = vars})
            test.eq(400, send_status)
            for _, field in ipairs({"code", "face", "limit", "maximum"}) do
                test.eq(refused.details[field], send_error.details[field], field)
            end
            test.eq("max_html_bytes", send_error.details.limit)
            test.eq(262144, send_error.details.maximum)
            local resource = own({kind = "message", name = "render-budget-copy",
                from = {kind = "message", name = "notice"}, samples = vars})
            local review_result = data(editor, "POST", "/library/preview", {message = resource.name, create = resource})
            test.is_nil(review_result.preview_id)
            test.eq("html_too_large", review_result.errors[1].code)
            test.eq(404, (request(editor, "GET", "/library/message/" .. resource.name)))
            vars.message = string.rep("x", 64 * 1024)
            status, refused = request(editor, "POST", "/library/preview", {message = "notice", vars = vars})
            test.eq(400, status)
            test.eq("invalid_template_vars", refused.code)
        end)

        test.it("names the candidate sources when a draft message include fails", function()
            local editor = session("editor")
            local part = own(fixture("part", "candidate-part", "Static"))
            create(editor, part)
            local base = own(fixture("base", "candidate-base",
                '{{ include "/part/candidate-part" }}{{ block body() }}{{ end }}'))
            create(editor, base)
            local message = own(fixture("message", "candidate-message", "{{ block body() }}Content{{ end }}"))
            message.base, message.subject = base.name, "Candidate diagnostic"
            create(editor, message)
            part.html = "{{ missing_value }}"
            local _, body = request(editor, "POST", "/library/preview", {message = message.name, resource = part})
            test.eq(message.name, body.details.resource.name)
            test.eq("Mail could not render this template.", body.error)
            test.not_nil(body.details.engine_message:match("^template render failed: template rendering failed: Jet Runtime Error"))
            test.not_nil(body.details.engine_message:find("missing_value", 1, true))
            local candidates = body.details.candidate_resources
            test.eq(3, #candidates)
            test.eq(message.name, candidates[1].name)
            test.eq(base.name, candidates[2].name)
            test.eq(part.name, candidates[3].name)
        end)

        local function directive(word, kind, name)
            return '{{ ' .. word .. ' "/' .. kind .. '/' .. name .. '" }}'
        end

        local function cycle_failure(reason, details, label, diagnostic)
            test.eq("Mail could not render this template.", reason, label)
            test.eq("html", details.face, label)
            test.not_nil(details.engine_message:find(diagnostic or "template dependency cycle", 1, true), details.engine_message)
        end

        local function http_cycle(editor, method, path, payload, diagnostic)
            local status, body, raw = request(editor, method, path, payload)
            test.eq(400, status, method .. " " .. path .. ": " .. raw)
            test.eq(errors.INVALID, body.kind, raw)
            test.eq("template_render_failed", body.code, raw)
            cycle_failure(body.error, body.details, path, diagnostic)
        end

        local function review_cycle(editor, draft, diagnostic)
            local result = data(editor, "POST", "/library/preview", draft)
            test.is_nil(result.preview_id)
            local issue = assert(result.errors[1])
            test.eq("template_render_failed", issue.code)
            cycle_failure(issue.message, issue, "review", diagnostic)
        end

        local function tool_cycle(editor, tool, payload, diagnostic)
            local result, err = editor:call("kickside.mail.traits:" .. tool, payload)
            assert(not err, tostring(err))
            test.eq(false, result.success, tool)
            test.eq("template_render_failed", result.code, tool)
            cycle_failure(result.error, tool == "library_preview" and result.errors[1] or result, tool, diagnostic)
            test.is_nil(result.preview_id, tool)
        end

        local function seed_source(table_name, item, html)
            local db = assert(sql.get("app:db"))
            if table_name == "mail_library_revision" then
                assert(db:execute([[UPDATE mail_library_revision SET html=$1 WHERE kind=$2 AND name=$3 AND revision=$4]],
                    {html, item.kind, item.name, item.revision}))
            else
                assert(db:execute("UPDATE mail_library SET html=$1 WHERE kind=$2 AND name=$3",
                    {html, item.kind, item.name}))
            end
            assert(db:release())
        end

        local graphs = {
            {kind = "base", word = "extends"},
            {kind = "base", word = "extends", peer = "base"},
            {kind = "base", word = "import"},
            {kind = "base", word = "import", peer = "base"},
            {kind = "part", word = "extends"},
            {kind = "part", word = "extends", peer = "part"},
            {kind = "part", word = "import"},
            {kind = "part", word = "import", peer = "part"},
            {kind = "message", word = "import"},
            {kind = "message", word = "import", peer = "part"},
            {kind = "message", word = "extends", diagnostic = "Unexpected extends clause"},
            {kind = "message", word = "extends", peer = "base"},
            {kind = "part", word = "include", diagnostic = "maximum 'include' depth"},
            {kind = "part", word = "include", peer = "part", diagnostic = "maximum 'include' depth"},
        }
        for _, graph in ipairs(graphs) do
            local shape = graph.peer and ("mutual with " .. graph.peer) or "self"
            test.it("reports " .. graph.kind .. " " .. graph.word .. " cycles (" .. shape .. ") without publishing", function()
                local editor = session("editor")
                local agent = assert(funcs.new():with_actor(editor.actor):with_scope(editor.scope))
                local target = own(fixture(graph.kind, "cycle-target", "Cycle content"))
                if graph.kind == "base" then
                    target.html, target.text = "Before {{ block body() }}{{ end }}", "Before {{ block body() }}{{ end }}"
                elseif graph.kind == "message" then
                    target.html, target.text = "{{ block body() }}Cycle content{{ end }}", "{{ block body() }}Cycle content{{ end }}"
                    target.subject, target.base = "Cycle", "standard"
                end

                local peer
                if graph.peer then
                    local source = graph.peer == "base" and "Peer {{ block body() }}{{ end }}" or "Peer"
                    peer = own(fixture(graph.peer, "cycle-peer", source))
                    create(editor, peer)
                end
                if graph.kind == "message" and graph.word == "extends" and peer then target.base = peer.name end
                local good_html = target.html
                local destination = peer or target
                local bad_html = directive(graph.word, destination.kind, destination.name) .. good_html
                if graph.kind == "message" and graph.word == "extends" and peer then
                    -- The message's declared base supplies its extends directive.
                    bad_html = good_html
                end
                local route = "/library/" .. target.kind .. "/" .. target.name
                local function arm_peer(active)
                    if peer then
                        local source = active and directive(graph.word, target.kind, target.name) .. peer.html or peer.html
                        seed_source("mail_library", peer, source)
                    end
                end
                local function alive()
                    local preview = data(editor, "POST", "/library/preview", {message = "notice"})
                    test.not_nil(preview.html)
                end

                -- A pre-existing source may name a resource that has yet to be created.
                arm_peer(true)
                target.html = bad_html
                local create_draft = {message = target.kind == "message" and target.name or "notice", create = target}
                review_cycle(editor, create_draft, graph.diagnostic)
                tool_cycle(agent, "library_preview", create_draft, graph.diagnostic)
                test.eq(404, (request(editor, "GET", route)))
                alive()
                arm_peer(false)

                target.html = good_html
                local first = create(editor, target)
                local message = target.name
                if target.kind ~= "message" then
                    local body = "Cycle content"
                    if target.kind == "part" then body = directive("include", target.kind, target.name) end
                    local dependent = own(fixture("message", "cycle-dependent", "{{ block body() }}" .. body .. "{{ end }}"))
                    dependent.base, dependent.subject = target.kind == "base" and target.name or "standard", "Cycle"
                    create(editor, dependent)
                    message = dependent.name
                end
                local second = update(editor, {
                    kind = target.kind, name = target.name, html = good_html, text = target.text,
                    title = "Healthy current revision", description = target.description,
                    subject = target.subject, base = target.base, schema = target.schema, samples = target.samples,
                    expected_revision = first.revision,
                })
                target.expected_revision = second.revision
                target.title = second.title
                arm_peer(true)
                target.html = bad_html
                http_cycle(editor, "POST", "/library/preview", {message = message, resource = target}, graph.diagnostic)
                local preview = {message = message, resources = {target}}
                tool_cycle(agent, "library_preview", preview, graph.diagnostic)
                alive()
                review_cycle(editor, preview, graph.diagnostic)
                alive()

                -- A revision imported from an earlier installation may contain invalid source.
                seed_source("mail_library_revision", first, bad_html)
                local restore = {kind = target.kind, name = target.name,
                    revision = first.revision, expected_revision = second.revision}
                local restore_draft = {message = message, restore = restore}
                review_cycle(editor, restore_draft, graph.diagnostic)
                tool_cycle(agent, "library_preview", restore_draft, graph.diagnostic)
                arm_peer(false)
                local stored = data(editor, "GET", route)
                test.eq(second.revision, stored.revision)
                test.eq(good_html, stored.html)
                test.eq(2, #data(editor, "GET", route .. "/history").items)
                local healthy = data(editor, "POST", "/library/preview", {message = message})
                test.not_nil(healthy.html:find("Cycle content", 1, true))
            end)
        end

        test.it("serves library edits and candidate previews through the router", function()
            local editor = session("editor")
            local base = own(fixture("base", "http-frame", "[{{ block body() }}{{ end }}]"))
            local saved_base = create(editor, base)
            local msg = own(fixture("message", "http-message", "{{ block body() }}Body{{ end }}"))
            msg.base, msg.subject = base.name, "Hello"
            local saved = create(editor, msg)
            local copy = create(editor, own({kind = "message", name = "http-copy",
                from = {kind = "message", name = msg.name}, title = "Copy of the fixture"}))
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
            local batch = {resources = {draft, base}, note = "Save both"}
            batch.preview_id = review(editor, msg.name, {resources = batch.resources})
            local result = data(editor, "POST", "/library/save", batch)
            test.eq(2, #result.items)
            copy.expected_revision = copy.revision
            copy.title = "New copy name"
            local single = update(editor, copy)
            local moved = revision_write(editor, "base", result.items[1], {base = "plain"})
            local revisions = data(editor, "GET", name .. "/history")
            test.eq(3, #revisions.items)
            test.eq("Save both", revisions.items[2].note)
            local restored = revision_write(editor, "restore", moved, {revision = saved.revision})
            test.eq(base.name, restored.base)
            local shipped = own(data(editor, "GET", "/library/base/plain"))
            local original_revision = shipped.revision
            shipped.html, shipped.text = base.html, base.text
            shipped.expected_revision = original_revision
            local customized = update(editor, shipped)
            local reset = revision_write(editor, "reset", customized, {})
            test.eq("original", reset.state)
            test.is_true(reset.revision > original_revision)

            data(editor, "DELETE", name, {expected_revision = restored.revision})
            data(editor, "DELETE", "/library/message/" .. copy.name, {expected_revision = single.revision})
            data(editor, "DELETE", "/library/base/" .. base.name, {expected_revision = result.items[2].revision})
        end)

        test.it("broadcasts topic-only library and Activity invalidations after commit", function()
            local db = assert(sql.get("app:db"))
            assert(db:execute("DELETE FROM mail_realtime_fixture"))
            assert(db:release())
            local editor = session("editor_sender")
            local admin = session("delivery")
            configure()
            local item = own(fixture("base", "event-frame", "{{ block body() }}{{ end }}"))
            local saved = create(editor, item)
            test.eq(409, (request(editor, "POST", "/library", item)))
            local send = data(editor, "POST", "/library/send-test", {
                message = "notice", vars = {subject = "Realtime fixture delivery"},
            }, 202)
            activity_rows[#activity_rows + 1] = send.message_id
            local deadline = time.now():add(10 * time.SECOND):unix_nano()
            local events
            repeat
                db = assert(sql.get("app:db"))
                events = assert(db:query("SELECT data, observed FROM mail_realtime_fixture WHERE subject='fixture'"))
                assert(db:release())
                if #events < 3 then time.sleep("20ms") end
            until #events >= 3 or time.now():unix_nano() >= deadline
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
            test.eq(3, #listed)
            local driver = listed[1]
            test.eq("kickside.mail.harness:capture", driver.id)
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
            test.eq("kickside.mail.harness:capture", status.driver.id)
            test.is_true(status.configured)
            test.is_true(status.ready)
            test.eq("kickside.mail.harness:capture", status.transports[1].id)
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
            configured = false
            local unconfigured = data(admin, "GET", "/delivery")
            test.is_false(unconfigured.configured)
            test.eq("driver_required", unconfigured.code)
            test.eq("Choose a delivery service for Mail.", unconfigured.reason)
            local status_code, refused, raw = request(editor, "POST", "/library/send-test", {message = "notice"})
            test.eq(400, status_code)
            test.eq("invalid_config", refused.code)
            test.eq("Mail delivery requires setup. Ask a mail administrator to check the delivery settings.", refused.error)
            test.is_nil(raw:find("driver_required", 1, true))
            test.is_nil(raw:find("An active mail driver is required", 1, true))
            local admin_status, admin_refusal = request(admin, "POST", "/delivery/send-test")
            test.eq(status_code, admin_status)
            test.eq(refused.code, admin_refusal.code)
            test.eq(refused.error, admin_refusal.error)
            local preview = data(editor, "POST", "/library/preview", {message = "notice"})
            test.not_nil(preview.html)
        end)
    end)
end)}
