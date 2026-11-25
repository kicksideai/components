-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local contract = require("contract")
local autoinit = require("autoinit")
local funcs = require("funcs")
local registry = require("registry")
local templates = require("templates")
local security = require("security")
local sql = require("sql")
local uuid = require("uuid")
local fixtures = require("fixtures")
local api_fixtures = require("api_fixtures")
local jet = require("jet")
local prune = require("prune")

local THREAD = autoinit.component_id(autoinit.SYSTEM_SCOPE_KEY, "kickside.mail.library")

local HTML = "kickside.mail.views:templates"
local TEXT = "kickside.mail.views:text_templates"
local OWNER = "kickside.mail.render:live"

local function review(draft, executor)
    draft.message = draft.message or "notice"
    local result = assert(fixtures.call(executor, "preview", draft))
    return assert(result.preview_id, result.errors[1] and result.errors[1].message)
end

local function call(method, input)
    if method == "create" then
        input.preview_id = review({message = input.kind == "message" and input.name or "notice", create = input})
    end
    local result, err = fixtures.call(nil, method, input)
    if type(result) == "table" and method ~= "get" then fixtures.await_live(result.seq) end
    return result, err
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
        if names[entry.meta.name] or entry.id == "kickside.mail.projection:marker" then assert(changes:delete(entry.id)) end
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
        local publication_fault
        local fault_enabled, capture_configured = false, false
        test.after_each(function()
            if fault_enabled then publication_fault(false) end
            if capture_configured then
                api_fixtures.settings("", "")
                capture_configured = false
            end
            fixtures.remove(owned)
            if #originals > 0 then
                local changes = assert(registry.snapshot()):changes()
                for _, original in ipairs(originals) do assert(changes:update(original)) end
                assert(changes:apply())
            end
        end)
        publication_fault = function(enabled, hold_seq, permanent)
            fault_enabled = enabled or hold_seq ~= nil
            local flag = assert(registry.get("app.mail_library:publication_failure"))
            flag.data.enabled, flag.data.hold_seq, flag.data.permanent = enabled, hold_seq, permanent
            local changes = assert(registry.snapshot()):changes()
            assert(changes:update(flag))
            assert(changes:apply())
        end

        test.it("recovers sends through retention after all three publication attempts fail", function()
            api_fixtures.settings("kickside.mail.harness:capture", "mail@example.org")
            capture_configured = true
            local reader = api_fixtures.session("editor_sender")
            local sender = assert(funcs.new():with_actor(reader.actor):with_scope(reader.scope))
            local item = own(candidate("message", "publication-check",
                "{{ block body() }}Old HTML{{ end }}", "{{ block body() }}Old text{{ end }}"))
            item.base, item.subject = "plain", "Publication check"
            local saved = assert(call("create", item))
            if saved.seq then fixtures.await_live(saved.seq) end
            item.html, item.expected_revision = "{{ block body() }}New HTML{{ end }}", saved.revision
            item.preview_id = review({message = item.name, resources = {item}})
            publication_fault(true)
            local faulty = assert(funcs.new():with_context({mail_test_projection_error = true}))
            local result, err = fixtures.call(faulty, "update", item)
            assert(result, tostring(err))
            test.eq(result.revision, assert(call("get", item)).revision)
            test.eq(2, #assert(call("read_history", item)).items)
            local rendered, fenced = fixtures.mailer(nil, "preview", {template = item.name, vars = {}})
            test.is_nil(rendered)
            test.eq(errors.UNAVAILABLE, assert(fenced):kind())
            test.eq("mail_library_publishing", fenced:details().code)
            test.is_true(fenced:retryable())
            local sent, send_err = fixtures.mailer(sender, "send", {
                template = item.name, vars = {}, to = {"reader@example.org"},
            })
            test.is_nil(sent)
            test.eq("mail_library_publishing", assert(send_err):details().code)
            fixtures.await(function()
                local job = fixtures.sync_job(result.seq)
                return job and job.status == "dead" and job.attempts == 3
            end, "Library sync did not exhaust three failed publications")
            publication_fault(false)
            local pass = assert(funcs.call("kickside.mail.jobs:owner", {}))
            test.is_true(pass.success, tostring(pass.error))
            fixtures.await_live(result.seq)
            test.not_nil(assert(fixtures.render(nil, {template = item.name, vars = {}})).html:find("New HTML", 1, true))
            test.not_nil(assert(fixtures.mailer(sender, "send", {
                template = item.name, vars = {}, to = {"reader@example.org"},
            })).message_id)
        end)

        test.it("ends a publication job after one permanent failure", function()
            local part = own(candidate("part", "permanent-publication-fault", "Original HTML", "Original text"))
            local saved = assert(call("create", part))
            part.html, part.expected_revision = "Changed HTML", saved.revision
            part.preview_id = review({resources = {part}})
            publication_fault(true, nil, true)
            local updated = assert(fixtures.call(nil, "update", part))
            fixtures.await(function()
                local job = fixtures.sync_job(updated.seq)
                return job and job.status == "dead"
            end, "A permanent publication error did not settle the job")
            test.eq(1, fixtures.sync_job(updated.seq).attempts)
            publication_fault(false)
            local pass = assert(funcs.call("kickside.mail.jobs:owner", {}))
            test.is_true(pass.success, tostring(pass.error))
            fixtures.await_live(updated.seq)
        end)

        test.it("fences committed content when the marker is lost until boot reconciliation", function()
            local item = own(candidate("message", "commit-check",
                "{{ block body() }}Old HTML{{ end }}", "{{ block body() }}Old text{{ end }}"))
            item.base, item.subject = "plain", "Commit check"
            local saved = assert(call("create", item))
            item.html, item.expected_revision = "{{ block body() }}New HTML{{ end }}", saved.revision
            item.preview_id = review({message = item.name, resources = {item}})
            local updated = assert(call("update", item))
            test.eq(updated.revision, assert(call("get", item)).revision)
            fixtures.await_live(updated.seq)
            local overlay = assert(registry.overlay(OWNER))
            local changes = overlay:changes()
            for _, entry in ipairs(assert(overlay:entries())) do assert(changes:delete(entry.id)) end
            assert(changes:apply())
            local rendered, fenced = fixtures.mailer(nil, "preview", {template = item.name, vars = {}})
            test.is_nil(rendered)
            test.eq("mail_library_publishing", assert(fenced):details().code)
            test.eq("success", assert(funcs.call("kickside.mail.jobs:reconcile")).status)
            fixtures.await_live(updated.seq)
            test.not_nil(assert(fixtures.render(nil, {template = item.name, vars = {}})).html:find("New HTML", 1, true))
        end)

        test.it("keeps the newer publication when a publisher is holding older rows", function()
            local part = own(candidate("part", "publisher-race", "First HTML", "First text"))
            local saved = assert(call("create", part))
            local held = saved.seq + 1
            local function observe(value)
                local db = assert(sql.get("app:db"))
                local rows = assert(db:query("SELECT observed FROM mail_realtime_fixture WHERE topic=$1 AND subject=$2 AND observed=$3",
                    {"fixture.publisher_race", tostring(held), value}))
                assert(db:release())
                return #rows > 0
            end
            part.html, part.expected_revision = "Held HTML", saved.revision
            part.preview_id = review({resources = {part}})
            publication_fault(false, held)
            local first = assert(fixtures.call(nil, "update", part))
            test.eq(held, first.seq)
            fixtures.await(function() return observe("waiting") end, "First publisher never opened the overlay")
            part.html, part.expected_revision = "Latest HTML", first.revision
            part.preview_id = review({resources = {part}})
            local second = assert(fixtures.call(nil, "update", part))
            test.eq("success", assert(funcs.call("kickside.mail.jobs:reconcile")).status)
            fixtures.await_live(second.seq)
            publication_fault(false)
            fixtures.await(function() return observe(tostring(errors.CONFLICT)) end, "Stale overlay did not report a conflict")
            test.eq(second.seq, assert(registry.get("kickside.mail.projection:marker")).data.seq)
            test.eq("Latest HTML", assert(value(HTML, "part/" .. part.name)))
        end)

        test.it("admits only one concurrent save and replays the winning command", function()
            local part = own(candidate("part", "save-command-replay", "Old HTML", "Old text"))
            local created = assert(call("create", part))
            local inputs, futures = {}, {}
            for i = 1, 2 do
                local change = candidate("part", part.name, "New HTML " .. i, "New text")
                change.expected_revision = created.revision
                inputs[i] = {command_id = uuid.v4(), resources = {change}, preview_id = review({resources = {change}})}
            end
            for i = 1, 2 do futures[i] = assert(fixtures.async(funcs.new(), "save", inputs[i])) end
            fixtures.await(function() return futures[1]:is_complete() and futures[2]:is_complete() end,
                "Concurrent library saves did not finish")
            local winner, saved, rejected
            for i = 1, 2 do
                local payload, err = futures[i]:result()
                local value = payload and payload:data()
                if value then
                    test.is_nil(winner)
                    winner, saved = i, value
                else
                    rejected = err
                end
            end
            assert(saved, tostring(rejected))
            test.eq("mail_revision_conflict", assert(rejected):details().code)
            local current = assert(call("get", part))
            test.eq(saved.items[1].revision, current.revision)
            test.eq("New HTML " .. winner, current.html)
            local replay, replay_err = call("save", inputs[winner])
            assert(replay, tostring(replay_err))
            test.eq(saved.items[1].revision, replay.items[1].revision)
            test.not_nil(saved.seq)
            test.eq(saved.seq, replay.seq)
            test.eq(2, #assert(call("read_history", part)).items)
            local changed = inputs[winner]
            changed.resources[1].html = "Different content"
            local refused, conflict = call("save", changed)
            test.is_nil(refused)
            test.eq("mail_command_id_conflict", assert(conflict):details().code)
            changed.resources[1].html = "New HTML " .. winner
            local next_edit = candidate("part", part.name, "Later HTML", "Later text")
            next_edit.expected_revision = current.revision
            next_edit.preview_id = review({resources = {next_edit}})
            assert(call("update", next_edit))
            local original_result = assert(call("save", changed))
            test.eq(saved.seq, original_result.seq)
            test.eq(current.revision, original_result.items[1].revision)
            test.eq(current.html, original_result.items[1].html)
        end)

        test.it("returns a committed receipt while the projection is paused and refuses another stale write", function()
            local part = own(candidate("part", "paused-projection", "Old HTML", "Old text"))
            local saved = assert(call("create", part))
            local draft = candidate("part", part.name, "New HTML", "New text")
            draft.expected_revision = saved.revision
            local receipt = review({resources = {draft}})
            local command = {resources = {draft}, preview_id = receipt, command_id = uuid.v4()}
            local thread = assert(assert(contract.get("kickside.core:threads")):open())
            local address = {thread_id = autoinit.component_id(autoinit.SYSTEM_SCOPE_KEY, "kickside.mail.library"),
                kind = "kickside.mail:library_tables"}
            assert(thread:pause_projection(address))
            local pending, append_err = fixtures.call(nil, "save", command)
            local before = fixtures.call(nil, "get", part)
            local second, catch_err = fixtures.call(nil, "save", {resources = {draft}, preview_id = receipt})
            local denied = assert(funcs.new():with_context({mail_test_catch_up_denied = true}))
            local denied_write, denied_err = fixtures.call(denied, "save", {resources = {draft}, preview_id = receipt})
            assert(thread:resume_projection(address))
            test.is_nil(denied_write)
            test.eq(errors.PERMISSION_DENIED, assert(denied_err):kind())
            test.eq("fixture_catch_up_denied", denied_err:details().code)
            assert(pending, tostring(append_err))
            fixtures.await_live(pending.seq)
            test.is_true(pending.committed)
            test.is_false(pending.projected)
            test.eq(saved.revision, before.revision)
            test.is_nil(second)
            test.eq("mail_library_catching_up", assert(catch_err):details().code)
            test.is_true(catch_err:retryable())
            local replay = assert(fixtures.call(nil, "save", command))
            test.eq(pending.seq, replay.seq)
            test.eq(saved.revision + 1, replay.items[1].revision)
            test.eq(2, #assert(call("read_history", part)).items)
        end)

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
            api_fixtures.settings("kickside.mail.harness:capture", "mail@example.org")
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
            originals = {assert(snapshot:get(id)), assert(snapshot:get(original.origin))}
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

        local function history_fixture(name)
            local item = own(candidate("part", name, "Original history content", "Original history text"))
            local first = assert(call("create", item))
            local other = own(candidate("part", name .. "-other", "Other subject", "Other subject"))
            assert(call("create", other))
            item.html, item.expected_revision = "New history content", first.revision
            item.preview_id = review({resources = {item}})
            local newest = assert(call("update", item))
            return first, newest
        end

        test.it("pages one History entry per event by descending sequence", function()
            local first, newest = history_fixture("history-sequence")
            local key = {kind = newest.kind, name = newest.name, limit = 1}
            local current = assert(call("read_history", key))
            local previous = assert(call("read_history", {
                kind = key.kind, name = key.name, limit = 1, cursor = current.next_cursor,
            }))
            test.eq(1, #current.items)
            test.eq(1, #previous.items)
            test.eq(newest.seq, current.items[1].seq)
            test.eq(tostring(newest.seq), current.next_cursor)
            test.eq(first.seq, previous.items[1].seq)
            test.eq(first.revision, previous.items[1].version)
            test.is_nil(previous.next_cursor)
        end)

        test.it("restores content from an event sequence and records its source version", function()
            local first, newest = history_fixture("history-restore-sequence")
            local restore = {kind = first.kind, name = first.name, seq = first.seq, expected_revision = newest.revision}
            local detail, detail_err = call("read_revision", {kind = first.kind, name = first.name, seq = first.seq})
            assert(detail, tostring(detail_err))
            test.eq(first.html, detail.content.html)
            restore.preview_id = review({restore = restore})
            local restored, restore_err = call("restore", restore)
            assert(restored, tostring(restore_err))
            test.eq(first.html, restored.html)
            local history = assert(call("read_history", {kind = first.kind, name = first.name})).items
            test.eq(restored.seq, history[1].seq)
            test.eq("restored", history[1].action)
            test.eq(first.revision, history[1].restored_from)
        end)

        test.it("prunes History through the Threads boundary and refuses an approved restore of a pruned event", function()
            local first, newest = history_fixture("history-pruned-sequence")
            local restore = {kind = first.kind, name = first.name, seq = first.seq, expected_revision = newest.revision}
            local preview, preview_err = call("preview", {message = "notice", restore = restore})

            local db = assert(sql.get("app:db"))
            local before = assert(db:query("SELECT max_pruned_seq FROM kickside_thread WHERE id=$1", {THREAD}))
            local result, prune_err = prune.prune_thread(db, THREAD, {
                cutoff = "2099-01-01T00:00:00Z", max_total = first.seq - before[1].max_pruned_seq,
            })
            assert(db:release())
            assert(result, tostring(prune_err))
            test.eq(first.seq, result.max_pruned_seq)
            local owner = assert(funcs.call("kickside.mail.jobs:owner", {}))
            assert(owner.success, tostring(owner.error))
            db = assert(sql.get("app:db"))
            local rows = assert(db:query(
                "SELECT seq FROM mail_library_history WHERE kind=$1 AND name=$2 ORDER BY seq",
                {first.kind, first.name}))
            assert(db:release())
            test.eq(1, #rows)
            test.eq(newest.seq, rows[1].seq)

            assert(preview, tostring(preview_err))
            restore.preview_id = assert(preview.preview_id)
            local value, err = call("restore", restore)
            test.is_nil(value)
            test.eq(errors.NOT_FOUND, err:kind())
            test.eq("mail_revision_pruned", err:details().code)
        end)

        test.it("retains every unpruned event, including reset and restore", function()
            local scope = assert(security.new_scope({assert(security.policy("kickside.mail.security:library_access")),
                assert(security.policy("kickside.mail.security:library_runtime")),
                assert(security.policy("app.mail_library:invoke_access"))}))
            local actor = assert(security.new_actor("history-editor", {security_groups = {"app:mail_editors"}}))
            local editor = assert(funcs.new():with_actor(actor):with_scope(scope))
            local function read(method, input)
                if method == "update" then
                    input.preview_id = review({resources = {input}}, editor)
                elseif method == "reset" or method == "restore" then
                    input.preview_id = review({[method] = input}, editor)
                end
                local result, err = fixtures.call(editor, method, input)
                if err then error(method .. ": " .. err:message() .. " (" .. tostring((err:details() or {}).code) .. ")") end
                return result
            end
            local key = own({kind = "base", name = "plain"})
            local initial = read("get", key)
            local initial_history = #read("read_history", key).items
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
            local history = read("read_history", key).items
            test.eq(initial_history + 2, #history)
            test.eq("Reset layout", history[1].note)
            test.eq("history-editor", history[1].author)
            local reset_detail = read("read_revision", {kind = key.kind, name = key.name, seq = history[1].seq})
            test.eq(initial.html, reset_detail.content.html)
            test.eq("First customization", history[2].note)
            test.is_true(history[1].created_at > 0)
            local restore = {kind = key.kind, name = key.name, seq = saved.seq, expected_revision = reset.revision}
            local restored = read("restore", restore)
            test.eq(edit.html, restored.html)
            test.eq("customized", restored.state)
            local rejected, conflict = fixtures.call(editor, "restore", restore)
            test.is_nil(rejected)
            test.eq("mail_preview_stale", conflict:details().code)
            for i = 1, 26 do
                edit.expected_revision = restored.revision
                edit.title = "Layout " .. i
                restored = read("update", edit)
            end
            history = read("read_history", {kind = key.kind, name = key.name, limit = 100}).items
            test.eq(initial_history + 29, #history)
            test.eq(initial.revision + 29, history[1].version)
            test.eq(initial.revision + 1, history[29].version)
            test.eq(restored.seq, history[1].seq)
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
            local old = assert(fixtures.render(nil, {template = message.name, vars = {}}))
            for _, part in ipairs({one, two}) do
                part.html, part.text = "{{ .after }}", "{{ .after }}"
                part.schema.properties = {after = {type = "string"}}
                part.samples = {after = "New"}
                local invalid = assert(call("preview", {message = message.name, resources = {part}}))
                test.is_nil(invalid.preview_id)
                test.eq("template_render_failed", invalid.errors[1].code)
            end
            base.html = base.html:gsub("before", "after"):gsub("Old", "New")
            base.text = base.html
            local preview = assert(call("preview", {resources = {base, one, two}, message = message.name}))
            test.not_nil(preview.html:find("New one New two Body", 1, true))
            test.eq(old.html, assert(fixtures.render(nil, {template = message.name, vars = {}})).html)
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
                test.eq(1, #assert(call("read_history", item)).items)
            end
            test.eq(old.html, assert(fixtures.render(nil, {template = message.name, vars = {}})).html)
            two.html = valid_html
            local changed = assert(call("save", {resources = {base, one, two}, preview_id = receipt, note = "Together"})).items
            test.eq(3, #changed)
            test.eq(preview.html, assert(fixtures.render(nil, {template = message.name, vars = {}})).html)
            for _, item in ipairs(changed) do
                test.eq("Together", assert(call("read_history", item)).items[1].note)
            end
            assert(call("delete", message))
            for _, item in ipairs(changed) do
                assert(call("delete", {kind = item.kind, name = item.name, expected_revision = item.revision}))
            end
        end)

        test.it("requires library access even when the caller can send", function()
            local scope = assert(security.new_scope({assert(security.policy("kickside.mail.security:send_access")),
                assert(security.policy("kickside.mail.security:library_runtime")),
                assert(security.policy("app.mail_library:invoke_access"))}))
            local actor = assert(security.new_actor("mail-sender", {full_name = "Sample Sender"}))
            local executor = assert(funcs.new():with_actor(actor):with_scope(scope))
            local listed, denial = fixtures.call(executor, "list", {})
            test.is_nil(listed)
            test.eq(errors.PERMISSION_DENIED, denial:kind())
            test.eq("mail_library_denied", denial:details().code)
        end)
    end)
end)}
