-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local funcs = require("funcs")
local registry = require("registry")
local templates = require("templates")
local security = require("security")
local sql = require("sql")
local fixtures = require("fixtures")
local jet = require("jet")

local NS = "kickside.mail.library:"
local HTML = "kickside.mail.views:templates"
local TEXT = "kickside.mail.views:text_templates"
local OWNER = NS .. "projection"

local function review(draft, executor)
    draft.message = draft.message or "notice"
    local result = assert((executor or funcs.new()):call(NS .. "preview_edits", draft))
    return assert(result.preview_id, result.errors[1] and result.errors[1].message)
end

local function call(method, input)
    if method == "create" then
        input.preview_id = review({message = input.kind == "message" and input.name or "notice", create = input})
    end
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

local function discard_overlay(items)
    local names = {}
    for _, item in ipairs(items) do
        names[jet.name(item)] = true
        if item.kind == "message" then names[jet.name(item, "subject")] = true end
    end
    local overlay = assert(registry.overlay(OWNER))
    local changes = overlay:changes()
    for _, entry in ipairs(assert(overlay:entries())) do
        if names[entry.meta.name] then assert(changes:delete(entry.id)) end
    end
    assert(changes:apply())
end

return {run = test.run_cases(function()
    test.describe("Mail library", function()
        local owned, originals
        test.before_each(function()
            owned, originals = {}, {}
        end)
        local function own(item)
            owned[#owned + 1] = {kind = item.kind, name = item.name}
            return item
        end
        test.after_each(function()
            fixtures.remove(owned)
            if #originals > 0 then
                local changes = assert(registry.snapshot()):changes()
                for _, original in ipairs(originals) do assert(changes:update(original)) end
                assert(changes:apply())
            end
        end)
        test.it("rolls back a revision when live publication fails", function()
            local part = own(candidate("part", "publication-check", "Old HTML", "Old text"))
            local saved = assert(call("create", part))
            part.html, part.expected_revision = "New HTML", saved.revision
            part.preview_id = review({resources = {part}})
            local faulty = assert(funcs.new():with_context({mail_test_projection_error = true}))
            local result, err = faulty:call(NS .. "update", part)
            test.is_nil(result)
            test.eq("mail_projection_failed", assert(err):details().code)
            test.eq(saved.revision, assert(call("get", part)).revision)
            test.eq("Old HTML", assert(value(HTML, "part/" .. part.name)))
            test.eq(1, #assert(call("history", part)))
        end)

        test.it("restores the committed live source when SQL commit fails after publication", function()
            local part = own(candidate("part", "commit-check", "Old HTML", "Old text"))
            local saved = assert(call("create", part))
            local db = assert(sql.get("app:db"))
            assert(db:execute("CREATE TABLE mail_test_commit_parent (id INTEGER PRIMARY KEY)"))
            assert(db:execute([[CREATE TABLE mail_test_commit_child
                (id INTEGER REFERENCES mail_test_commit_parent(id) DEFERRABLE INITIALLY DEFERRED)]]))
            assert(db:release())
            part.html, part.expected_revision = "New HTML", saved.revision
            part.preview_id = review({resources = {part}})
            local faulty = assert(funcs.new():with_context({mail_test_commit_error = part.name}))
            local result, err = faulty:call(NS .. "update", part)
            db = assert(sql.get("app:db"))
            assert(db:execute("DROP TABLE mail_test_commit_child"))
            assert(db:execute("DROP TABLE mail_test_commit_parent"))
            assert(db:release())
            test.is_nil(result)
            test.not_nil(err)
            test.not_nil(tostring(err):lower():find("foreign key", 1, true), tostring(err))
            test.eq(saved.revision, assert(call("get", part)).revision)
            test.eq("Old HTML", assert(value(HTML, "part/" .. part.name)))
            test.eq(1, #assert(call("history", part)))
        end)

        test.it("exposes the shipped Image and Signature to library editors", function()
            local scope = assert(security.new_scope({assert(security.policy("kickside.mail.security:library_access")),
                assert(security.policy("kickside.mail.security:library_calls"))}))
            local actor = assert(security.new_actor("parts-editor", {security_groups = {"app:mail_editors"}}))
            local editor = assert(funcs.new():with_actor(actor):with_scope(scope))
            local parts = {}
            for _, item in ipairs(assert(editor:call(NS .. "list", {kind = "part"}))) do
                parts[item.name] = item
            end
            local projection = assert(security.new_scope({assert(security.policy("kickside.mail.security:overlay_originals"))}))
            for _, name in ipairs({"image", "signature"}) do
                test.not_nil(parts[name])
                local item = assert(editor:call(NS .. "get", {kind = "part", name = name}))
                test.eq("original", item.state)
                for _, face in ipairs({name, name .. ".text"}) do
                    for _, action in ipairs({"registry.overlay.shadow", "registry.overlay.update.template.jet",
                        "registry.overlay.delete.template.jet"}) do
                        test.eq("allow", projection:evaluate(actor, action, "kickside.mail.views:" .. face))
                    end
                end
            end
            local notice = assert(editor:call(NS .. "render_draft", {message = "notice", vars = {
                subject = "Status", inline_content_id = "chart", image_alt = "Weekly chart",
            }}))
            test.not_nil(notice.html:find('src="cid:chart" alt="Weekly chart" width="534"', 1, true))
            test.not_nil(notice.text:find("Weekly chart", 1, true))
        end)
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
                assert(security.policy("kickside.mail.security:library_calls"))}))
            local actor = assert(security.new_actor("mail-editor", {full_name = "Sample Editor", security_groups = {"app:mail_editors"}}))
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
            local invalid = assert(call("preview_edits", {message = message.name, resources = {part}}))
            test.is_nil(invalid.preview_id)
            local failure = invalid.errors[1]
            test.eq("template_render_failed", failure.code)
            test.eq(message.name, failure.resource.name)
            test.eq("html", failure.face)
            test.eq("Mail could not render this template.", failure.message)
            test.not_nil(failure.engine_message:find("missing_value", 1, true))
            test.eq(saved_part.revision, assert(call("get", {kind = "part", name = part.name})).revision)
            test.eq(rendered.html, assert(executor:call(NS .. "render", {template = message.name, vars = message.samples})).html)

            part.html = "Changed {{ .label }}"
            part.preview_id = review({message = message.name, resources = {part}}, executor)
            local updated = assert(executor:call(NS .. "update", part))
            test.eq("mail-editor", updated.author)
            test.is_true(updated.revision > saved_part.revision)
            local conflict, conflict_err = executor:call(NS .. "update", part)
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
            local switched_render = assert(executor:call(NS .. "render", {template = message.name, vars = message.samples}))
            test.is_nil(switched_render.html:find("Frame", 1, true))
            test.not_nil(switched_render.html:find("Changed A &amp; &lt;B&gt;", 1, true))

            discard_overlay({part, base, message})
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
            local replayed, err = funcs.call(NS .. "create", part)
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
            local sent, send_err = sender:call("kickside.mail.service:send",
                {template = item.name, vars = {}, to = {"reader@example.org"}})
            test.is_nil(sent)
            test.eq(errors.NOT_FOUND, assert(send_err):kind(), tostring(send_err))
            test.eq("mail_template_archived", send_err:details().code, tostring(send_err))
            local archived = assert(call("get", item))
            test.is_true(archived.archived)
            test.is_true(archived.revision > saved.revision)
            local history = assert(call("history", item))
            test.eq("archived", history[1].action)
            test.eq(archived.revision, history[1].revision)

            local restore = {kind = item.kind, name = item.name, expected_revision = archived.revision, revision = saved.revision}
            restore.preview_id = review({message = item.name, restore = restore})
            local restored = assert(call("restore", restore))
            test.is_false(restored.archived)
            local rendered = assert(call("render", {template = item.name, vars = {}}))
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
            discard_overlay({key})

            local id = "kickside.mail.views:header"
            local entry = assert(registry.get(id))
            local declaration = assert(registry.get(original.origin))
            originals = {assert(registry.get(id)), assert(registry.get(original.origin))}
            entry.data.source = "New original {{ site.title }}"
            declaration.data.template.html = entry.data.source
            local snapshot = assert(registry.snapshot())
            local changes = snapshot:changes()
            assert(changes:update(entry))
            assert(changes:update(declaration))
            assert(changes:apply())
            test.eq("success", assert(call("reconcile")).status)
            test.eq("Customized Example", assert(value(HTML, "part/header", data)))
            local reset_request = {kind = key.kind, name = key.name, expected_revision = saved.revision}
            reset_request.preview_id = review({reset = reset_request})
            local reset = assert(call("reset", reset_request))
            test.eq("original", reset.state)
            test.eq("New original Example", assert(value(HTML, "part/header", data)))
        end)

        test.it("retains the newest 25 revisions, including reset and restore", function()
            local scope = assert(security.new_scope({assert(security.policy("kickside.mail.security:library_access")),
                assert(security.policy("kickside.mail.security:library_calls"))}))
            local actor = assert(security.new_actor("history-editor", {security_groups = {"app:mail_editors"}}))
            local editor = assert(funcs.new():with_actor(actor):with_scope(scope))
            local function read(method, input)
                if method == "update" then
                    input.preview_id = review({resources = {input}}, editor)
                elseif method == "reset" or method == "restore" then
                    input.preview_id = review({[method] = input}, editor)
                end
                local result, err = editor:call(NS .. method, input)
                if err then error(method .. ": " .. err:message() .. " (" .. tostring((err:details() or {}).code) .. ")") end
                return result
            end
            local key = own({kind = "base", name = "plain"})
            local initial = read("get", key)
            local initial_history = #read("history", key)
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
            test.eq(initial_history + 2, #history)
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
            test.eq("mail_preview_stale", conflict:details().code)
            for i = 1, 26 do
                edit.expected_revision = restored.revision
                edit.title = "Layout " .. i
                restored = read("update", edit)
            end
            history = read("history", key)
            test.eq(25, #history)
            test.eq(initial_history + 29, history[1].version)
            test.eq(initial_history + 5, history[25].version)
            test.eq(restored.revision, history[1].revision)
            test.eq("Layout 2", history[25].content.title)
            read("reset", {kind = key.kind, name = key.name, expected_revision = restored.revision})
        end)

        test.it("validates the entire candidate library and writes all revisions together", function()
            local one = candidate("part", "batch-one", "{{ .before }}", "{{ .before }}")
            local two = candidate("part", "batch-two", "{{ .before }}", "{{ .before }}")
            local base = candidate("base", "batch-base",
                '{{ include "/part/batch-one" map("before", "Old one") }} {{ include "/part/batch-two" map("before", "Old two") }} {{ block body() }}{{ end }}',
                '{{ include "/part/batch-one" map("before", "Old one") }} {{ include "/part/batch-two" map("before", "Old two") }} {{ block body() }}{{ end }}')
            for _, part in ipairs({one, two}) do
                part.schema.properties.before = {type = "string"}
                part.samples.before = "Old"
            end
            local message = candidate("message", "batch-message", "{{ block body() }}Body{{ end }}", "{{ block body() }}Body{{ end }}")
            message.subject, message.base = "Subject", base.name
            for _, item in ipairs({one, two, base, message}) do
                own(item)
                item.expected_revision = assert(call("create", item)).revision
            end
            local old = assert(call("render", {template = message.name, vars = {}}))
            for _, part in ipairs({one, two}) do
                part.html, part.text = "{{ .after }}", "{{ .after }}"
                part.schema.properties = {after = {type = "string"}}
                part.samples = {after = "New"}
                local invalid = assert(call("preview_edits", {message = message.name, resources = {part}}))
                test.is_nil(invalid.preview_id)
                test.eq("template_render_failed", invalid.errors[1].code)
            end
            base.html = base.html:gsub("before", "after"):gsub("Old", "New")
            base.text = base.html
            local preview = assert(call("render_draft", {resources = {base, one, two}, message = message.name}))
            test.not_nil(preview.html:find("New one New two Body", 1, true))
            test.eq(old.html, assert(call("render", {template = message.name, vars = {}})).html)
            local revision = two.expected_revision
            local receipt = review({message = message.name, resources = {base, one, two}})
            two.expected_revision = 0
            local saved, stale = call("save", {resources = {base, one, two}, preview_id = receipt, note = "Together"})
            test.is_nil(saved)
            test.eq("mail_preview_mismatch", stale:details().code)
            two.expected_revision = revision
            local valid_html = two.html
            two.html = "{{ .undefined }}"
            local broken, invalid = call("save", {resources = {base, one, two}, preview_id = receipt})
            test.is_nil(broken)
            test.eq("mail_preview_mismatch", invalid:details().code)
            for _, item in ipairs({base, one, two}) do
                test.eq(item.expected_revision, assert(call("get", item)).revision)
                test.eq(1, #assert(call("history", item)))
            end
            test.eq(old.html, assert(call("render", {template = message.name, vars = {}})).html)
            two.html = valid_html
            local changed = assert(call("save", {resources = {base, one, two}, preview_id = receipt, note = "Together"}))
            test.eq(3, #changed)
            test.eq(preview.html, assert(call("render", {template = message.name, vars = {}})).html)
            for _, item in ipairs(changed) do
                test.eq("Together", assert(call("history", item))[1].note)
            end
            assert(call("delete", message))
            for _, item in ipairs(changed) do
                assert(call("delete", {kind = item.kind, name = item.name, expected_revision = item.revision}))
            end
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
