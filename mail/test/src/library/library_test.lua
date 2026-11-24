-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local funcs = require("funcs")
local registry = require("registry")
local templates = require("templates")
local security = require("security")
local env = require("env")

local NS = "kickside.mail.library:"
local HTML = "kickside.mail.views:templates"
local TEXT = "kickside.mail.views:text_templates"
local OWNER = NS .. "projection"

local function call(method, input)
    return funcs.call(NS .. method, input)
end

local function candidate(kind, name, html, text)
    return {
        kind = kind, name = name, title = name, description = "",
        html = html, text = text, schema = {type = "object", properties = {}}, samples = {},
    }
end

local function value(set_id, name, data)
    local set = assert(templates.get(set_id))
    local result, err = set:render(name, data or {})
    set:release()
    return result, err
end

local function discard_overlay()
    local overlay = assert(registry.overlay(OWNER))
    local changes = overlay:changes()
    assert(changes:delete(overlay:entries()))
    assert(changes:apply())
end

return {run = test.run_cases(function()
    test.describe("Mail library", function()
        test.it("renders Notice on Plain without the Standard card or branded frame", function()
            local notice = assert(call("get", {kind = "message", name = "notice"}))
            notice.base = "plain"
            local result = assert(call("render_draft", {
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
            assert(env.set("PUBLIC_API_URL", "https://example.org"))
            local part = candidate("part", "library-note", "HTML {{ .label }}", "Text {{ .label }}")
            part.schema.properties.label = {type = "string"}
            part.samples.label = "Sample"
            local saved_part = assert(call("create", part))
            local base = candidate("base", "library-frame",
                'Frame {{ include "/part/library-note" map("label", "from base") }} [{{ block body() }}{{ end }}]',
                'Text frame {{ include "/part/library-note" map("label", "from base") }} [{{ block body() }}{{ end }}]')
            local saved_base = assert(call("create", base))
            local message = candidate("message", "library-example",
                '{{ block body() }}{{ include "/part/library-note" vars }} {{ site.title }} {{ site.url }} {{ sender.name }} {{ message.subject }} {{ message.preheader }}{{ end }}',
                '{{ block body() }}{{ include "/part/library-note" vars }}{{ end }}')
            message.base = base.name
            message.subject = "{{ label }}"
            message.schema.properties.label = {type = "string"}
            message.schema.properties.preheader = {type = "string"}
            message.samples = {label = "A & <B>", preheader = "First look"}
            local saved_message = assert(call("create", message))
            local scope = assert(security.new_scope({assert(security.policy("kickside.mail.security:library_access")),
                assert(security.policy("kickside.mail.security:library_calls"))}))
            local actor = assert(security.new_actor("mail-editor", {full_name = "Sample Editor"}))
            local executor = assert(funcs.new():with_actor(actor):with_scope(scope))
            local rendered = assert(executor:call(NS .. "render", {template = message.name, vars = message.samples}))
            test.eq("A & <B>", rendered.subject)
            test.not_nil(rendered.html:find("Frame HTML from base [HTML A &amp; &lt;B&gt;", 1, true))
            assert(rendered.html:find("KickSide https://example.org Sample Editor", 1, true), rendered.html)
            test.not_nil(rendered.html:find("A &amp; &lt;B&gt; First look", 1, true))
            test.eq("Text frame Text from base [Text A & <B>]", rendered.text)

            local selected = assert(call("list", {kind = "message", state = "created", base = base.name}))
            test.eq(1, #selected)
            test.eq(message.name, selected[1].name)
            local incompatible = assert(call("list", {kind = "part", state = "created", base = base.name}))
            test.eq(0, #incompatible)
            local draft = candidate("part", part.name, "Draft {{ .label }}", "Draft {{ .label }}")
            draft.schema, draft.samples = part.schema, part.samples
            local preview = assert(executor:call(NS .. "render_draft", {resource = draft, message = message.name}))
            test.not_nil(preview.html:find("Draft from base", 1, true))
            test.eq(rendered.html, assert(executor:call(NS .. "render", {template = message.name, vars = message.samples})).html)

            local used, use_err = call("delete", {kind = "part", name = part.name, expected_revision = saved_part.revision})
            test.is_nil(used)
            test.eq("mail_resource_in_use", use_err:details().code)

            part.html = '{{ if .label == "from base" }}{{ missing_value }}{{ else }}{{ .label }}{{ end }}'
            part.expected_revision = saved_part.revision
            local changed, failure = call("update", part)
            test.is_nil(changed)
            test.eq(errors.INVALID, failure:kind())
            test.eq("template_render_failed", failure:details().code)
            test.eq(message.name, failure:details().resource.name)
            test.eq("html", failure:details().face)
            test.not_nil(failure:message():find("missing_value", 1, true))
            test.eq(saved_part.revision, assert(call("get", {kind = "part", name = part.name})).revision)
            test.eq(rendered.html, assert(executor:call(NS .. "render", {template = message.name, vars = message.samples})).html)

            part.html = "Changed {{ .label }}"
            local updated = assert(executor:call(NS .. "update", part))
            test.eq("mail-editor", updated.author)
            test.is_true(updated.revision > saved_part.revision)
            local conflict, conflict_err = call("update", part)
            test.is_nil(conflict)
            test.eq(errors.CONFLICT, conflict_err:kind())
            local removed, in_use = call("delete", {kind = "base", name = base.name, expected_revision = saved_base.revision})
            test.is_nil(removed)
            test.eq("mail_resource_in_use", in_use:details().code)
            local switched = assert(call("set_base", {name = message.name, base = "plain", expected_revision = saved_message.revision}))
            local switched_render = assert(executor:call(NS .. "render", {template = message.name, vars = message.samples}))
            test.is_nil(switched_render.html:find("Frame", 1, true))
            test.not_nil(switched_render.html:find("Changed A &amp; &lt;B&gt;", 1, true))

            discard_overlay()
            local missing, missing_err = value(HTML, "message/" .. message.name)
            test.is_nil(missing)
            test.eq(errors.NOT_FOUND, missing_err:kind())
            test.eq("success", assert(call("reconcile")).status)
            test.eq("success", assert(call("reconcile")).status)
            test.eq(switched_render.html, assert(executor:call(NS .. "render", {template = message.name, vars = message.samples})).html)
            assert(call("delete", {kind = "message", name = message.name, expected_revision = switched.revision}))
            assert(call("delete", {kind = "base", name = base.name, expected_revision = saved_base.revision}))
            assert(call("delete", {kind = "part", name = part.name, expected_revision = updated.revision}))
            test.is_nil(value(HTML, "part/" .. part.name))
            test.is_nil(value(TEXT, "part/" .. part.name))

            part.expected_revision = nil
            local recreated = assert(call("create", part))
            test.is_true(recreated.revision > updated.revision)
            local stale, stale_err = call("delete", {kind = "part", name = part.name, expected_revision = updated.revision})
            test.is_nil(stale)
            test.eq("mail_revision_conflict", stale_err:details().code)
            assert(call("delete", {kind = "part", name = part.name, expected_revision = recreated.revision}))
        end)

        test.it("shadows a shipped entry and resets to the original after a module update", function()
            local key = {kind = "part", name = "header"}
            local original = assert(call("get", key))
            test.eq("original", original.state)
            local edit = candidate("part", key.name, "Customized {{ site.title }}", "Custom text {{ site.title }}")
            edit.expected_revision = original.revision
            local saved = assert(call("update", edit))
            test.eq(original.origin, saved.origin)
            test.eq("customized", saved.state)
            local data = {site = {title = "Example"}}
            test.eq("Customized Example", assert(value(HTML, "part/header", data)))
            test.eq("Custom text Example", assert(value(TEXT, "part/header", data)))
            discard_overlay()

            local id = "kickside.mail.views:header"
            local entry = assert(registry.get(id))
            local old_source = entry.data.source
            local declaration = assert(registry.get(original.origin))
            local old_original = declaration.data.template.html
            entry.data.source = "New original {{ site.title }}"
            declaration.data.template.html = entry.data.source
            local snapshot = assert(registry.snapshot())
            local changes = snapshot:changes()
            assert(changes:update(entry))
            assert(changes:update(declaration))
            assert(changes:apply())
            test.eq("success", assert(call("reconcile")).status)
            test.eq("Customized Example", assert(value(HTML, "part/header", data)))
            local reset = assert(call("reset", {kind = key.kind, name = key.name, expected_revision = saved.revision}))
            test.eq("original", reset.state)
            test.eq("New original Example", assert(value(HTML, "part/header", data)))
            entry.data.source = old_source
            declaration.data.template.html = old_original
            snapshot = assert(registry.snapshot())
            changes = snapshot:changes()
            assert(changes:update(entry))
            assert(changes:update(declaration))
            assert(changes:apply())
        end)

        test.it("retains the newest 25 revisions, including reset and restore", function()
            local scope = assert(security.new_scope({assert(security.policy("kickside.mail.security:library_access")),
                assert(security.policy("kickside.mail.security:library_calls"))}))
            local actor = assert(security.new_actor("history-editor", {}))
            local editor = assert(funcs.new():with_actor(actor):with_scope(scope))
            local function read(method, input)
                local result, err = editor:call(NS .. method, input)
                if err then error(method .. ": " .. err:message() .. " (" .. tostring((err:details() or {}).code) .. ")") end
                return result
            end
            local key = {kind = "base", name = "plain"}
            local initial = read("get", key)
            local edit = candidate("base", key.name, "First [{{ block body() }}{{ end }}]",
                "First text [{{ block body() }}{{ end }}]")
            edit.expected_revision, edit.note = initial.revision, "First customization"
            local saved = read("update", edit)
            local first = saved.revision
            local reset = read("reset", {
                kind = key.kind, name = key.name, expected_revision = first, note = "Reset layout",
            })
            test.is_true(reset.revision > first)
            test.eq(reset.revision, read("get", key).revision)
            local history = read("history", key)
            test.eq(2, #history)
            test.eq("Reset layout", history[1].note)
            test.eq("history-editor", history[1].author)
            test.eq(initial.html, history[1].content.html)
            test.eq("First customization", history[2].note)
            test.is_true(history[1].created_at > 0)
            local restore = {kind = key.kind, name = key.name, revision = first, expected_revision = reset.revision}
            local restored = read("restore", restore)
            test.eq(edit.html, restored.html)
            test.eq("customized", restored.state)
            local rejected, conflict = editor:call(NS .. "restore", restore)
            test.is_nil(rejected)
            test.eq("mail_revision_conflict", conflict:details().code)
            for i = 1, 26 do
                edit.expected_revision = restored.revision
                edit.title = "Layout " .. i
                restored = read("update", edit)
            end
            history = read("history", key)
            test.eq(25, #history)
            test.eq(restored.revision, history[1].revision)
            test.eq("Layout 2", history[25].content.title)
            read("reset", {kind = key.kind, name = key.name, expected_revision = restored.revision})
        end)

        test.it("requires library access even when the caller can send", function()
            local scope = assert(security.new_scope({assert(security.policy("kickside.mail.security:send_access")),
                assert(security.policy("kickside.mail.security:library_calls"))}))
            local actor = assert(security.new_actor("mail-sender", {full_name = "Sample Sender"}))
            local executor = assert(funcs.new():with_actor(actor):with_scope(scope))
            local listed, denial = executor:call(NS .. "list", {})
            test.is_nil(listed)
            test.eq(errors.PERMISSION_DENIED, denial:kind())
            test.eq("mail_library_denied", denial:details().code)
        end)
    end)
end)}
