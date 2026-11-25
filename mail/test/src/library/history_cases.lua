-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local funcs = require("funcs")
local security = require("security")
local sql = require("sql")
local fixtures = require("fixtures")
local api_fixtures = require("api_fixtures")
local prune = require("prune")

local function register(support)
    local test = support.test
    local THREAD = support.THREAD
    local state = support.state
    local own = support.own
    local review = support.review
    local call = support.call
    local candidate = support.candidate
    local value = support.value

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
        local editor = fixtures.editor()
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
        test.eq(saved.author, history[1].author)
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
        local member = api_fixtures.session("sender")
        local executor = assert(funcs.new():with_actor(member.actor):with_scope(member.scope))
        local listed, denial = fixtures.call(executor, "list", {})
        test.is_nil(listed)
        test.eq(errors.PERMISSION_DENIED, denial:kind())
        test.eq("mail_library_denied", denial:details().code)
    end)
end

return {register = register}
