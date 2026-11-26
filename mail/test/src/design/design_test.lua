-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local blocks = require("blocks")
local funcs = require("funcs")
local json = require("json")
local registry = require("registry")
local security = require("security")
local sql = require("sql")
local time = require("time")
local fixtures = require("fixtures")
local api_fixtures = require("api_fixtures")
local delivery_wait = require("delivery_wait")

local NS = "kickside.mail.traits:"
local EDITOR = "mail-design-editor"
local ADDRESS = "editor@example.org"
local ALIASES = {
    library_list = "MailLibraryList", library_read = "MailLibraryRead", library_preview = "MailLibraryPreview",
    library_save = "MailLibrarySave", library_create = "MailLibraryCreate", library_reset = "MailLibraryReset",
    asset_add = "MailAssetAdd", library_history = "MailLibraryHistory", library_restore = "MailLibraryRestore", send_test = "MailSendTest",
}

local function caller(id, can_edit, can_send)
    local groups = {"app:user"}
    if can_edit then
        groups[#groups + 1] = "app:mail_editors"
        groups[#groups + 1] = "app.mail_api:editor"
    end
    if can_send then groups[#groups + 1] = "app:mail_senders" end
    local actor = assert(security.new_actor(id, {user_id = id, email = ADDRESS, security_groups = groups}))
    local scope = api_fixtures.role_scope(groups)
    return assert(funcs.new():with_actor(actor):with_scope(scope)), actor, scope
end

local function call(executor, tool, args)
    local result, err = executor:call(NS .. tool, args)
    assert(not err, tool .. ": " .. tostring(err))
    assert(result, tool .. " returned no result")
    return result
end

local function ok(executor, tool, args)
    local result = call(executor, tool, args)
    assert(result.success ~= false, tool .. ": " .. tostring(result.error))
    fixtures.await_live(result.seq)
    return result
end

local function refusal(executor, tool, args, code)
    local result = call(executor, tool, args)
    test.eq(false, result.success)
    test.eq(code, result.code, result.error)
    return result
end

local function key(kind, name)
    return {kind = kind, name = name}
end

local function read_written(executor, resource, receipt)
    test.is_true(receipt.committed)
    local current = ok(executor, "library_read", resource)
    test.eq(receipt.seq, current.seq)
    return current
end

local function edit(item)
    return {
        kind = item.kind, name = item.name, title = item.title, description = item.description,
        html = item.html, text = item.text, schema = item.schema, samples = item.samples,
        subject = item.subject, base = item.base, expected_revision = item.revision,
    }
end

return {run = test.run_cases(function()
    test.describe("Mail design tools", function()
        local owned, configured, restore_retention
        test.before_each(function()
            owned, configured = {}, false
        end)
        test.after_each(function()
            if restore_retention then
                restore_retention()
                restore_retention = nil
            end
            fixtures.remove(owned)
            if configured then
                api_fixtures.settings("", "")
            end
        end)

        test.it("discovers exactly the design tool entries and their Block schemas", function()
            local trait = assert(registry.get(NS .. "email_design"))
            test.eq("agent.trait", trait.meta.type)
            test.eq(true, trait.meta.public)
            test.eq("Email design", trait.meta.title)
            local catalog = assert(blocks.catalog())
            local ids = {}
            for _, id in ipairs(trait.data.tools) do
                local alias = ALIASES[id:sub(#NS + 1)]
                assert(alias and not ids[id], id)
                ids[id] = true
                local tool = assert(registry.get(id))
                test.eq(alias, tool.meta.llm_alias)
                test.eq("tool", tool.meta.type)
                test.eq(true, tool.meta.public)
                local block = assert(catalog[id], id)
                test.eq("tool", block.source_kind)
                test.eq("object", block.input.type)
                test.eq("object", block.output.type)
                test.not_nil(block.input.properties)
                test.not_nil(block.output.properties)
            end
            for name in pairs(ALIASES) do test.eq(true, ids[NS .. name]) end
            test.is_nil(catalog[NS .. "library_delete"])
            test.is_nil(catalog["kickside.mail.binding:library_delete"])
            local _, actor, scope = caller(EDITOR, true, true)
            test.neq("allow", scope:evaluate(actor, "funcs.call", NS .. "library_delete"))
            test.neq("allow", scope:evaluate(actor, "funcs.call", "kickside.mail.binding:library_delete"))
            test.neq("allow", scope:evaluate(actor, "env.get", "kickside.settings.env:encryption_key"))
        end)

        test.it("requires Edit mail library at every tool entrypoint and Send mail for delivery", function()
            local sender = caller("mail-design-sender", false, true)
            for name in pairs(ALIASES) do
                local result, err = sender:call(NS .. name, {})
                test.is_nil(result, name)
                assert(err, name)
                test.eq(errors.PERMISSION_DENIED, err:kind(), tostring(err))
            end
            local editor = caller(EDITOR, true, false)
            local _, err = editor:call(NS .. "send_test", {message = "notice"})
            test.eq("mail_send_denied", assert(err:details()).code)
        end)

        test.it("restyles the library together, repairs a welcome draft and sends to the acting person", function()
            local person = api_fixtures.session("editor_sender")
            local editor = assert(funcs.new():with_actor(person.actor):with_scope(person.scope))
            local page = ok(editor, "library_list", {kind = "base", state = "original", limit = 1})
            test.eq(1, #page.items)
            test.is_nil(page.items[1].html)
            test.not_nil(page.next_cursor)
            local block = assert(blocks.get({block_id = NS .. "library_list"}))
            assert(json.validate(block.output, page))
            local empty = ok(editor, "library_list", {q = "no matching title"})
            test.eq(0, #empty.items)
            test.not_nil(empty.library_seq)
            local next_page = ok(editor, "library_list", {kind = "base", cursor = page.next_cursor, limit = 1})
            test.neq(page.items[1].name, next_page.items[1].name)
            local stream = ok(editor, "library_list", {kind = "part", q = "butt"})
            test.eq("button", stream.items[1].name)
            local standard = ok(editor, "library_read", key("base", "standard"))
            local plain = ok(editor, "library_read", key("base", "plain"))
            local button = ok(editor, "library_read", key("part", "button"))
            test.not_nil(standard.used_by.messages)
            test.not_nil(standard.html)
            test.not_nil(standard.text)
            test.not_nil(button.samples.action_label)
            for _, item in ipairs({standard, plain, button}) do owned[#owned + 1] = key(item.kind, item.name) end

            local drafts = {edit(standard), edit(plain), edit(button)}
            drafts[1].html = drafts[1].html:gsub("</head>", '<style>body{font-family:Inter;color:#0B6E4F}</style></head>')
            drafts[2].html = drafts[2].html:gsub("</head>", '<style>body{font-family:Inter;color:#0B6E4F}</style></head>')
            drafts[3].html = drafts[3].html:gsub("#ba321f", "#0B6E4F"):gsub("font%-family:Arial", "font-family:Inter,Arial")
            drafts[3].text = drafts[3].text .. "\n"
            local preview = ok(editor, "library_preview", {message = "notice", resources = drafts})
            test.not_nil(preview.html:find("#0B6E4F", 1, true))
            test.not_nil(preview.text)
            local saved = ok(editor, "library_save", {resources = drafts, preview_id = preview.preview_id, note = "Brand refresh"})
            test.eq(3, #saved.items)
            for _, row in ipairs(saved.items) do
                test.eq("customized", ok(editor, "library_read", row).state)
                local history = ok(editor, "library_history", key(row.kind, row.name))
                test.eq(person.id, history.items[1].author)
                test.eq("Brand refresh", history.items[1].note)
            end

            local welcome = {
                kind = "message", name = "design-welcome", title = "Customer welcome", from = key("message", "notice"),
                subject = "Welcome, {{ vars.customer_name }}",
                schema = {type = "object", properties = {
                    customer_name = {type = "string"}, account_manager = {type = "string"}, login_url = {type = "string"},
                }, required = {"customer_name", "account_manager", "login_url"}},
                samples = {customer_name = "Example & Co", account_manager = "Example Manager", login_url = "https://example.org/start"},
                html = '{{ block body() }}{{ include "/part/button" map("action_url", vars.login_url) }}',
                text = '{{ block body() }}Meet {{ vars.account_manager }}. {{ vars.login_url }}{{ end }}',
            }
            owned[#owned + 1] = key(welcome.kind, welcome.name)
            refusal(editor, "library_create", welcome, "mail_preview_required")
            local broken = refusal(editor, "library_preview", {message = welcome.name, create = welcome}, "template_render_failed")
            test.eq(welcome.name, broken.errors[1].resource.name)
            test.eq("html", broken.errors[1].face)
            test.eq("template_render_failed", broken.errors[1].code)
            test.is_nil(broken.preview_id)
            welcome.html = '{{ block body() }}<p>Meet {{ vars.account_manager }}.</p>'
                .. '{{ include "/part/button" map("action_url", vars.login_url, "action_label", "Get started") }}'
                .. '{{ include "/part/signature" map("name", vars.account_manager) }}{{ end }}'
            local clean = ok(editor, "library_preview", {message = welcome.name, create = welcome})
            test.eq("Welcome, Example & Co", clean.subject)
            test.not_nil(clean.html:find("Get started", 1, true))
            welcome.preview_id = clean.preview_id
            local created = ok(editor, "library_create", welcome)
            test.eq("created", ok(editor, "library_read", key(welcome.kind, welcome.name)).state)
            test.eq(welcome.name, created.name)

            configured = true
            api_fixtures.settings("app.mail_harness:capture", "mail@example.org")
            local _, bad_send = editor:call(NS .. "send_test", {message = welcome.name, to = {"other@example.org"}})
            test.eq(errors.INVALID, bad_send:kind())
            local queued = ok(editor, "send_test", {message = welcome.name})
            local sent = delivery_wait.terminal(function()
                return fixtures.mailer(editor, "get_message", queued.message_id)
            end, "5s")
            test.eq("sent", sent.status, sent.last_error and sent.last_error.message)
            test.is_nil(sent.provider_message_id)
            local operator = api_fixtures.session("log_reader")
            local log = assert(funcs.new():with_actor(operator.actor):with_scope(operator.scope))
            local diagnostic = assert(fixtures.mailer(log, "get_message", queued.message_id))
            local captured = assert(json.decode(diagnostic.provider_message_id))
            test.eq(1, #captured.to)
            test.eq(person.email, captured.to[1])
            test.eq("Welcome, Example & Co", captured.subject)
            test.not_nil(captured.text:find("Example Manager", 1, true))
        end)

        test.it("binds a preview to candidate sources and actor and refuses stale revisions", function()
            local editor = caller(EDITOR, true, true)
            local button = ok(editor, "library_read", key("part", "button"))
            owned[#owned + 1] = key(button.kind, button.name)
            local candidate = edit(button)
            candidate.text = candidate.text .. "\n"
            local args = {resources = {candidate}}
            refusal(editor, "library_save", args, "mail_preview_required")
            local preview = ok(editor, "library_preview", {resources = args.resources, message = "notice"})
            args.preview_id = preview.preview_id
            candidate.text = candidate.text .. "Different source"
            refusal(editor, "library_save", args, "mail_preview_mismatch")
            candidate.text = button.text .. "\n"
            refusal(caller("another-editor", true, false), "library_save", args, "mail_preview_mismatch")
            local receipt_id = args.preview_id
            args.preview_id = receipt_id:gsub(".$", function(c) return c == "a" and "b" or "a" end)
            refusal(editor, "library_save", args, "mail_preview_mismatch")
            args.preview_id = receipt_id
            local resource = key(button.kind, button.name)
            local saved = read_written(editor, resource, ok(editor, "library_save", args))
            local conflict = refusal(editor, "library_save", args, "mail_preview_stale")
            test.eq(saved.revision, conflict.revision)
            test.eq(button.name, conflict.resource.name)

            local reset_request = {kind = button.kind, name = button.name, expected_revision = saved.revision}
            reset_request.preview_id = ok(editor, "library_preview", {reset = reset_request, message = "notice"}).preview_id
            local reset = read_written(editor, resource, ok(editor, "library_reset", reset_request))
            test.eq("original", reset.state)
            local restore_request = {kind = button.kind, name = button.name,
                expected_revision = reset.revision, seq = saved.seq}
            restore_request.preview_id = ok(editor, "library_preview", {restore = restore_request, message = "notice"}).preview_id
            local restored = read_written(editor, resource, ok(editor, "library_restore", restore_request))
            test.neq(saved.revision, restored.revision)
            test.eq(candidate.text, restored.text)
        end)

        local function draft_button()
            local editor = caller(EDITOR, true, false)
            local button = ok(editor, "library_read", key("part", "button"))
            owned[#owned + 1] = key(button.kind, button.name)
            local candidate = edit(button)
            candidate.text = candidate.text .. "\n"
            return editor, candidate
        end

        test.it("stores the actor and candidate revision before a preview authorizes a write", function()
            local editor, candidate = draft_button()
            local resources = {candidate}
            local preview = ok(editor, "library_preview", {message = "notice", resources = resources})
            local db = assert(sql.get("app:db"))
            local rows = assert(db:query([[SELECT actor, expected_json, expires_at FROM mail_library_preview
                WHERE id=$1]], {preview.preview_id}))
            assert(db:release())
            test.eq(1, #rows)
            test.eq(EDITOR, rows[1].actor)
            local versions = assert(json.decode(rows[1].expected_json))
            test.eq(candidate.expected_revision, versions["part/button"])
            test.is_true(rows[1].expires_at > time.now():unix())

            local args = {resources = resources, preview_id = preview.preview_id}
            refusal(caller("another-editor", true, false), "library_save", args, "mail_preview_mismatch")
            test.is_true(ok(editor, "library_save", args).items[1].revision > candidate.expected_revision)
        end)

        test.it("classifies reuse of a successful write's preview as stale", function()
            local editor, candidate = draft_button()
            local resources = {candidate}
            local preview = ok(editor, "library_preview", {message = "notice", resources = resources})
            local args = {resources = resources, preview_id = preview.preview_id}
            local saved = ok(editor, "library_save", args).items[1]
            local result, err = fixtures.call(editor, "save", args)
            test.is_nil(result)
            test.eq(errors.CONFLICT, err:kind())
            test.eq("mail_preview_stale", err:details().code)
            test.eq(saved.revision, ok(editor, "library_read", key(saved.kind, saved.name)).revision)
        end)

        test.it("rejects a stored preview after its expiry", function()
            local owner
            owner, restore_retention = fixtures.manual_retention()
            local editor, candidate = draft_button()
            local resources = {candidate}
            local preview = ok(editor, "library_preview", {message = "notice", resources = resources})
            local db = assert(sql.get("app:db"))
            assert(db:execute("UPDATE mail_library_preview SET expires_at=$1 WHERE id=$2",
                {time.now():unix() - 1, preview.preview_id}))
            assert(db:release())
            local result, err = fixtures.call(editor, "save", {resources = resources, preview_id = preview.preview_id})
            test.is_nil(result)
            test.eq(errors.INVALID, err:kind())
            test.eq("mail_preview_expired", err:details().code)

            local swept = assert(funcs.call(owner, {}))
            test.is_true(swept.success)
            db = assert(sql.get("app:db"))
            local rows = assert(db:query("SELECT id FROM mail_library_preview WHERE id=$1", {preview.preview_id}))
            assert(db:release())
            test.eq(0, #rows)
        end)

        test.it("lists broken dependents and refuses the whole save when the library changes after preview", function()
            local editor = caller(EDITOR, true, false)
            local button = ok(editor, "library_read", key("part", "button"))
            local plain = ok(editor, "library_read", key("base", "plain"))
            local button_edit, plain_edit = edit(button), edit(plain)
            button_edit.html = '{{ if .action_label == "Partner only" }}{{ .partner_accent }}{{ end }}' .. button_edit.html
            plain_edit.text = plain_edit.text .. "\n"
            local candidates = {button_edit, plain_edit}
            local preview_args = {resources = candidates, message = "notice"}
            local preview = ok(editor, "library_preview", preview_args)
            for _, name in ipairs({"design-partner-one", "design-partner-two"}) do
                local message = {
                    kind = "message", name = name, title = name, description = "", base = "plain",
                    subject = "Partner notice",
                    html = '{{ block body() }}{{ include "/part/button" map("action_url", "https://example.org", '
                        .. '"action_label", "Partner only") }}{{ end }}',
                    text = '{{ block body() }}Partner notice{{ end }}',
                    schema = {type = "object", properties = {}}, samples = {},
                }
                owned[#owned + 1] = key(message.kind, name)
                local draft = ok(editor, "library_preview", {create = message, message = name})
                message.preview_id = draft.preview_id
                ok(editor, "library_create", message)
            end

            local rejected = refusal(editor, "library_preview", preview_args, "template_render_failed")
            test.is_nil(rejected.preview_id)
            test.eq(2, #rejected.dependent_messages)
            test.eq("design-partner-one", rejected.dependent_messages[1])
            test.eq("design-partner-two", rejected.dependent_messages[2])
            test.eq("html", rejected.errors[1].face)
            test.eq("template_render_failed", rejected.errors[1].code)

            local refused = refusal(editor, "library_save",
                {resources = candidates, preview_id = preview.preview_id}, "template_render_failed")
            test.eq(2, #refused.dependent_messages)
            test.eq("design-partner-one", refused.errors[1].resource.name)
            test.eq("template_render_failed", refused.errors[1].code)
            test.eq(button.revision, ok(editor, "library_read", key(button.kind, button.name)).revision)
            test.eq(plain.revision, ok(editor, "library_read", key(plain.kind, plain.name)).revision)
        end)
    end)
end)}
