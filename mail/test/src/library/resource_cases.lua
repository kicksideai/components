-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local funcs = require("funcs")
local registry = require("registry")
local security = require("security")
local fixtures = require("fixtures")
local api_fixtures = require("api_fixtures")
local jet = require("jet")

local function register(support)
    local test = support.test
    local HTML = support.HTML
    local TEXT = support.TEXT
    local state = support.state
    local own = support.own
    local publication_fault = support.publication_fault
    local review = support.review
    local call = support.call
    local candidate = support.candidate
    local value = support.value
    local discard_overlay = support.discard_overlay

    test.it("exposes the shipped Image and Signature to library editors", function()
        local scope = assert(security.new_scope({assert(security.policy("kickside.mail.security:library_access")),
            assert(security.policy("kickside.mail.security:library_runtime")),
            assert(security.policy("app.mail_library:invoke_access"))}))
        local actor = assert(security.new_actor("parts-editor", {security_groups = {"app:mail_editors"}}))
        local editor = assert(funcs.new():with_actor(actor):with_scope(scope))
        local parts = {}
        for _, item in ipairs(assert(fixtures.call(editor, "list", {kind = "part"})).items) do
            parts[item.name] = item
        end
        local projection = assert(security.new_scope({assert(security.policy("kickside.mail.security:overlay_originals"))}))
        for _, name in ipairs({"image", "signature"}) do
            test.not_nil(parts[name])
            local item = assert(fixtures.call(editor, "get", {kind = "part", name = name}))
            test.eq("original", item.state)
            for _, face in ipairs({name, name .. ".text"}) do
                for _, action in ipairs({"registry.overlay.shadow", "registry.overlay.update.template.jet",
                    "registry.overlay.delete.template.jet"}) do
                    test.eq("allow", projection:evaluate(actor, action, "kickside.mail.views:" .. face))
                end
            end
        end
        local notice = assert(fixtures.call(editor, "preview", {message = "notice", vars = {
            subject = "Status", inline_content_id = "chart", image_alt = "Weekly chart",
        }}))
        test.not_nil(notice.html:find('src="cid:chart" alt="Weekly chart" width="534"', 1, true))
        test.not_nil(notice.text:find("Weekly chart", 1, true))
    end)
    test.it("looks up summaries by exact names in one bounded page", function()
        local found = assert(call("list", {kind = "part", names = {"signature", "image", "missing-part"}}))
        local names = {}
        for _, item in ipairs(found.items) do names[#names + 1] = item.name .. ":" .. item.title end
        test.eq(2, found.total)
        test.eq(2, #found.items)
        test.eq("image", found.items[1].name)
        test.eq("signature", found.items[2].name)
        test.is_nil(found.next_cursor)
        local mixed = assert(call("list", {names = {"standard", "logo"}}))
        test.eq(2, #mixed.items, table.concat(names, ","))
        test.eq("asset", mixed.items[1].kind)
        test.eq("base", mixed.items[2].kind)
        local too_many = {}
        for i = 1, 101 do too_many[i] = "part-" .. i end
        local refused, err = call("list", {names = too_many})
        test.is_nil(refused)
        test.eq("invalid_mail_filter", err:details().code)
        local bad, bad_err = call("list", {names = {"Not A Name"}})
        test.is_nil(bad)
        test.eq("invalid_mail_filter", bad_err:details().code)
    end)
    test.it("renders Notice on Plain without the Standard card or branded frame", function()
        local notice = assert(call("get", {kind = "message", name = "notice"}))
        notice.base = "plain"
        local result = assert(call("preview", {
            resource = notice, message = notice.name,
            vars = {subject = "Account update", preheader = "Review your account", heading = "New sign-in",
                message = "Check the sign-in details.", action_url = "https://example.org/account",
                action_label = "Review sign-in", details = {{key = "Status", value = "New"}},
                inline_content_id = "sign-in-map", image_alt = "Approximate sign-in location"},
        }))
        test.not_nil(result.html:find('name="color-scheme" content="light only"', 1, true))
        test.not_nil(result.html:find("max-width:600px", 1, true))
        test.not_nil(result.html:find("New sign-in</h1>", 1, true))
        test.not_nil(result.html:find("Review sign-in</a>", 1, true))
        test.not_nil(result.html:find('src="cid:sign-in-map"', 1, true))
        test.not_nil(result.html:find('alt="Approximate sign-in location"', 1, true))
        test.is_nil(result.html:find("border-radius:12px", 1, true))
        test.is_nil(result.html:find(">KickSide</", 1, true))
        test.not_nil(result.text:find("Review your account", 1, true))
        test.not_nil(result.text:find("Status: New", 1, true))
        test.not_nil(result.text:find("Approximate sign-in location", 1, true))
        test.not_nil(result.text:find("https://example.org/account", 1, true))
    end)

    test.it("projects edits, switches a base, and refuses a change that breaks a dependent", function()
        local part = own(candidate("part", "library-note", "HTML {{ .label }}", "Text {{ .label }}"))
        part.schema.properties.label = {type = "string"}
        part.samples.label = "Sample"
        local saved_part = assert(call("create", part))
        local base = own(candidate("base", "library-frame",
            'Frame {{ include "/part/library-note" map("label", "from base") }} [{{ block body() }}{{ end }}]',
            'Text frame {{ include "/part/library-note" map("label", "from base") }} [{{ block body() }}{{ end }}]'))
        local saved_base = assert(call("create", base))
        local message = own(candidate("message", "library-example",
            '{{ block body() }}{{ include "/part/library-note" vars }} {{ site.title }} {{ site.url }} {{ sender.name }} {{ message.subject }} {{ message.preheader }}{{ end }}',
            '{{ block body() }}{{ include "/part/library-note" vars }}{{ end }}'))
        message.base = base.name
        message.subject = "{{ label }}"
        message.schema.properties.label = {type = "string"}
        message.schema.properties.preheader = {type = "string"}
        message.samples = {label = "A & <B>", preheader = "First look"}
        local saved_message = assert(call("create", message))
        local scope = assert(security.new_scope({assert(security.policy("kickside.mail.security:library_access")),
            assert(security.policy("kickside.mail.security:library_runtime")),
            assert(security.policy("app.mail_library:invoke_access"))}))
        local actor = assert(security.new_actor("mail-editor", {full_name = "Sample Editor", security_groups = {"app:mail_editors"}}))
        local executor = assert(funcs.new():with_actor(actor):with_scope(scope))
        local rendered = assert(fixtures.render(executor, {template = message.name, vars = message.samples}))
        test.eq("A & <B>", rendered.subject)
        test.not_nil(rendered.html:find("Frame HTML from base [HTML A &amp; &lt;B&gt;", 1, true))
        assert(rendered.html:find("KickSide https://example.org Sample Editor", 1, true), rendered.html)
        test.not_nil(rendered.html:find("A &amp; &lt;B&gt; First look", 1, true))
        test.eq("Text frame Text from base [Text A & <B>]", rendered.text)

        local selected = assert(call("list", {kind = "message", state = "created", base = base.name})).items
        test.eq(1, #selected)
        test.eq(message.name, selected[1].name)
        local incompatible = assert(call("list", {kind = "part", state = "created", base = base.name})).items
        test.eq(0, #incompatible)
        local draft = candidate("part", part.name, "Draft {{ .label }}", "Draft {{ .label }}")
        draft.schema, draft.samples = part.schema, part.samples
        local preview = assert(fixtures.call(executor, "preview", {resource = draft, message = message.name}))
        test.not_nil(preview.html:find("Draft from base", 1, true))
        test.eq(rendered.html, assert(fixtures.render(executor, {template = message.name, vars = message.samples})).html)

        local second = own(candidate("message", "library-second", message.html, message.text))
        second.base, second.subject, second.schema, second.samples = message.base, message.subject, message.schema, message.samples
        local saved_second = assert(call("create", second))
        local used, use_err = call("delete", {kind = "part", name = part.name, expected_revision = saved_part.revision})
        test.is_nil(used)
        local details = assert(use_err:details(), tostring(use_err))
        test.eq("mail_resource_in_use", details.code, tostring(use_err))
        local failed = details.messages
        test.eq(2, #failed)
        test.eq(message.name, failed[1])
        test.eq(second.name, failed[2])
        test.is_nil(assert(call("get", part)).used_by)
        local messages = assert(call("get", base)).used_by.messages
        test.eq(2, #messages)
        test.eq(message.name, messages[1])
        test.eq(second.name, messages[2])
        assert(call("delete", {kind = "message", name = second.name, expected_revision = saved_second.revision}))

        part.html = '{{ if .label == "from base" }}{{ missing_value }}{{ else }}{{ .label }}{{ end }}'
        part.expected_revision = saved_part.revision
        local invalid = assert(call("preview", {message = message.name, resources = {part}}))
        test.is_nil(invalid.preview_id)
        local failure = invalid.errors[1]
        test.eq("template_render_failed", failure.code)
        test.eq(message.name, failure.resource.name)
        test.eq("html", failure.face)
        test.eq("Mail could not render this template.", failure.message)
        test.not_nil(failure.engine_message:find("missing_value", 1, true))
        test.eq(saved_part.revision, assert(call("get", {kind = "part", name = part.name})).revision)
        test.eq(rendered.html, assert(fixtures.render(executor, {template = message.name, vars = message.samples})).html)

        part.html = "Changed {{ .label }}"
        part.preview_id = review({message = message.name, resources = {part}}, executor)
        local updated = assert(fixtures.call(executor, "update", part))
        test.eq("mail-editor", updated.author)
        test.is_true(updated.revision > saved_part.revision)
        local conflict, conflict_err = fixtures.call(executor, "update", part)
        test.is_nil(conflict)
        test.eq(errors.CONFLICT, conflict_err:kind())
        local removed, in_use = call("delete", {kind = "base", name = base.name, expected_revision = saved_base.revision})
        test.is_nil(removed)
        test.eq(errors.CONFLICT, in_use:kind())
        test.eq("mail_resource_in_use", in_use:details().code)
        test.eq(1, #in_use:details().messages)
        test.eq(message.name, in_use:details().messages[1])
        message.base = "plain"
        local switch = {name = message.name, base = message.base, expected_revision = saved_message.revision}
        switch.preview_id = review({message = message.name, set_base = switch})
        local switched = assert(call("set_base", switch))
        local switched_render = assert(fixtures.render(executor, {template = message.name, vars = message.samples}))
        test.is_nil(switched_render.html:find("Frame", 1, true))
        test.not_nil(switched_render.html:find("Changed A &amp; &lt;B&gt;", 1, true))

        discard_overlay({part, base, message})
        local missing, missing_err = value(HTML, "message/" .. message.name)
        test.is_nil(missing)
        test.eq(errors.NOT_FOUND, missing_err:kind())
        test.eq("success", assert(funcs.call("kickside.mail.jobs:reconcile")).status)
        test.eq("success", assert(funcs.call("kickside.mail.jobs:reconcile")).status)
        fixtures.await_current_live()
        test.eq(switched_render.html, assert(fixtures.render(executor, {template = message.name, vars = message.samples})).html)
        assert(call("delete", {kind = "message", name = message.name, expected_revision = switched.revision}))
        assert(call("delete", {kind = "base", name = base.name, expected_revision = saved_base.revision}))
        assert(call("delete", {kind = "part", name = part.name, expected_revision = updated.revision}))
        fixtures.await_current_live()
        test.is_nil(value(HTML, "part/" .. part.name))
        test.is_nil(value(TEXT, "part/" .. part.name))

        part.expected_revision, part.preview_id = nil, nil
        local recreated = assert(call("create", part))
        test.is_true(recreated.revision > updated.revision)
        local stale, stale_err = call("delete", {kind = "part", name = part.name, expected_revision = updated.revision})
        test.is_nil(stale)
        test.eq("mail_revision_conflict", stale_err:details().code)
        assert(call("delete", {kind = "part", name = part.name, expected_revision = recreated.revision}))
    end)

    test.it("keeps a create preview stale after the resource is deleted", function()
        local part = own(candidate("part", "replayed-create", "Replay HTML", "Replay text"))
        local saved = assert(call("create", part))
        assert(call("delete", {kind = part.kind, name = part.name, expected_revision = saved.revision}))
        local replayed, err = fixtures.call(nil, "create", part)
        test.is_nil(replayed)
        test.eq(errors.CONFLICT, assert(err):kind())
        test.eq("mail_preview_stale", err:details().code)
        local recreated = assert(call("create", part))
        test.is_true(recreated.revision > saved.revision)
    end)

    test.it("refuses to send an archived message and restores its previous revision", function()
        local item = own(candidate("message", "archive-fixture",
            "{{ block body() }}Archive fixture{{ end }}", "{{ block body() }}Archive fixture{{ end }}"))
        item.base, item.subject = "plain", "Archive fixture"
        local saved = assert(call("create", item))
        assert(call("delete", {kind = item.kind, name = item.name, expected_revision = saved.revision}))

        local actor = assert(security.new_actor("archive-fixture-sender", {security_groups = {"app:mail_senders"}}))
        local scope = assert(security.named_scope("wippy.security:process"))
        local sender = assert(funcs.new():with_actor(actor):with_scope(scope))
        api_fixtures.settings("app.mail_harness:capture", "mail@example.org")
        local sent, send_err = fixtures.mailer(sender, "send",
            {template = item.name, vars = {}, to = {"reader@example.org"}})
        api_fixtures.settings("", "")
        test.is_nil(sent)
        test.eq(errors.NOT_FOUND, assert(send_err):kind(), tostring(send_err))
        test.eq("mail_template_archived", send_err:details().code, tostring(send_err))
        local archived = assert(call("get", item))
        test.is_true(archived.archived)
        test.is_true(archived.revision > saved.revision)
        local history = assert(call("read_history", item)).items
        test.eq("archived", history[1].action)
        test.eq(archived.seq, history[1].seq)

        local restore = {kind = item.kind, name = item.name, expected_revision = archived.revision, seq = saved.seq}
        restore.preview_id = review({message = item.name, restore = restore})
        local restored = assert(call("restore", restore))
        test.is_false(restored.archived)
        local rendered = assert(fixtures.render(nil, {template = item.name, vars = {}}))
        test.eq(item.subject, rendered.subject)
        test.not_nil(rendered.text:find("Archive fixture", 1, true))
    end)

    test.it("shadows a shipped entry and resets to the original after a module update", function()
        local key = own({kind = "part", name = "header"})
        local original = assert(call("get", key))
        test.eq("original", original.state)
        local edit = candidate("part", key.name, "Customized {{ site.title }}", "Custom text {{ site.title }}")
        edit.expected_revision = original.revision
        edit.preview_id = review({resources = {edit}})
        local saved = assert(call("update", edit))
        test.eq(original.origin, saved.origin)
        test.eq("customized", saved.state)
        local data = {site = {title = "Example"}}
        test.eq("Customized Example", assert(value(HTML, "part/header", data)))
        test.eq("Custom text Example", assert(value(TEXT, "part/header", data)))
        publication_fault(true)
        discard_overlay({key})
        local id = "kickside.mail.views:header"
        local snapshot = assert(registry.snapshot())
        local entry = assert(snapshot:get(id))
        local declaration = assert(snapshot:get(original.origin))
        state.originals = {assert(snapshot:get(id)), assert(snapshot:get(original.origin))}
        entry.data.source = "New original {{ site.title }}"
        declaration.data.template.html = entry.data.source
        local changes = snapshot:changes()
        assert(changes:update(entry))
        assert(changes:update(declaration))
        assert(changes:apply())
        publication_fault(false)
        test.eq("success", assert(funcs.call("kickside.mail.jobs:reconcile")).status)
        fixtures.await_live(saved.seq)
        test.eq("Customized Example", assert(value(HTML, "part/header", data)))
        local reset_request = {kind = key.kind, name = key.name, expected_revision = saved.revision}
        reset_request.preview_id = review({reset = reset_request})
        local reset = assert(call("reset", reset_request))
        test.eq("original", reset.state)
        test.eq("New original Example", assert(value(HTML, "part/header", data)))
    end)
end

return {register = register}
