-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local funcs = require("funcs")
local security = require("security")
local json = require("json")
local registry = require("registry")
local sql = require("sql")
local time = require("time")
local uuid = require("uuid")
local library_fixtures = require("library_fixtures")

local function register(support)
    local test = support.test
    local session = support.session
    local request = support.request
    local data = support.data
    local review = support.review
    local create = support.create
    local update = support.update
    local revision_write = support.revision_write
    local await_delivery = support.await_delivery
    local fixture = support.fixture
    local own = support.own
    local configure = support.configure
    local failed = support.failed
    local state = support.state
    local ZERO = support.ZERO

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
        state.activity_sender = sender.id
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
        local item = data(editor, "GET", route)
        assert_maps("GET", route .. "/history?seq=" .. item.seq, nil, 200)
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
        local restored = revision_write(editor, "restore", moved, {seq = created.seq})
        local history = data(editor, "GET", route .. "/history").items
        test.eq(4, #history)
        test.eq("restored", history[1].action)
        test.eq(1, history[1].restored_from)
        test.eq(4, history[1].version)
        test.eq("created", data(editor, "GET", route .. "/history?seq=" .. restored.seq).state)
        test.eq(restored.seq, history[1].seq)
        test.eq("base_changed", history[2].action)
        test.eq("edited", history[3].action)
        test.eq("Reword subject", history[3].note)
        test.eq("created", history[4].action)
        test.eq(1, history[4].version)
        test.eq(created.seq, history[4].seq)
        local original = own(data(editor, "GET", "/library/base/plain"))
        original.expected_revision = original.revision
        local custom = update(editor, original)
        revision_write(editor, "reset", custom, {})
        local reset = data(editor, "GET", "/library/base/plain/history").items[1]
        test.eq("reset", reset.action)
        test.eq("original", data(editor, "GET", "/library/base/plain/history?seq=" .. reset.seq).state)
        test.eq(original.revision + 2, reset.version)
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
            {seq = created.seq, expected_revision = created.revision})
        test.eq(400, status)
        test.eq("mail_preview_required", rejected.code)
        test.eq(1, #data(editor, "GET", route .. "/history").items)
        item.expected_revision = created.revision
        local edited = update(editor, item)
        local source = {kind = "message", name = item.name, expected_revision = edited.revision, seq = created.seq}
        item.expected_revision = edited.revision
        source.preview_id = review(editor, item.name, {resources = {item}})
        status, rejected = request(editor, "POST", route .. "/restore", source)
        test.eq(400, status)
        test.eq("mail_preview_mismatch", rejected.code)
        source.preview_id = nil
        local receipt = review(editor, item.name, {restore = source})
        source.preview_id, source.seq = receipt, edited.seq
        status, rejected = request(editor, "POST", route .. "/restore", source)
        test.eq(400, status)
        test.eq("mail_preview_mismatch", rejected.code)
        source.seq = created.seq
        local restored = data(editor, "POST", route .. "/restore", source)
        local history = data(editor, "GET", route .. "/history").items
        test.eq(restored.seq, history[1].seq)
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
        local policy_id = "kickside.mail.security:principal_directory_resolve"
        local snapshot = assert(registry.snapshot())
        local allowed, blocked = assert(snapshot:get(policy_id)), assert(snapshot:get(policy_id))
        blocked.data.policy.effect = "deny"
        local deny = snapshot:changes()
        assert(deny:update(blocked))
        assert(deny:apply())
        local status, refused = request(admin, "GET", "/activity/" .. id)
        local restore = assert(registry.snapshot()):changes()
        assert(restore:update(allowed))
        assert(restore:apply())
        test.eq(403, status)
        test.eq(errors.PERMISSION_DENIED, refused.kind)
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
end

return {register = register}
