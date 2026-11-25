-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local contract = require("contract")
local funcs = require("funcs")
local registry = require("registry")
local security = require("security")
local uuid = require("uuid")
local fixtures = require("fixtures")
local api_fixtures = require("api_fixtures")
local database = require("database")
local reader = require("reader")
local live = require("live")
local originals = require("originals")

local function register(support)
    local test = support.test
    local HTML = support.HTML
    local OWNER = support.OWNER
    local state = support.state
    local own = support.own
    local publication_fault = support.publication_fault
    local clear_publication_fault = support.clear_publication_fault
    local review = support.review
    local call = support.call
    local candidate = support.candidate
    local value = support.value

    local function projection()
        local member = api_fixtures.session("editor")
        local definition = assert(contract.get("kickside.core:threads"))
        local thread = assert(definition:with_actor(member.actor):open())
        return thread, {thread_id = support.THREAD, kind = "kickside.mail:library_tables"}
    end

    test.it("recovers sends through retention after all three publication attempts fail", function()
        api_fixtures.settings("app.mail_harness:capture", "mail@example.org")
        state.capture_configured = true
        local member = api_fixtures.session("editor_sender")
        local sender = assert(funcs.new():with_actor(member.actor):with_scope(member.scope))
        local item = own(candidate("message", "publication-check",
            "{{ block body() }}Old HTML{{ end }}", "{{ block body() }}Old text{{ end }}"))
        item.base, item.subject = "plain", "Publication check"
        local saved = assert(call("create", item))
        fixtures.await_sync_idle()
        item.html, item.expected_revision = "{{ block body() }}New HTML{{ end }}", saved.revision
        item.preview_id = review({message = item.name, resources = {item}})
        local id = "kickside.mail.projection:message." .. item.name .. ".html"
        local changes = assert(registry.overlay(OWNER)):changes()
        assert(changes:delete(id))
        assert(changes:apply())
        publication_fault({id = id, kind = "registry.entry", meta = {}, data = {}}, "app.mail_library:publisher_collision")
        local result, err = fixtures.call(nil, "update", item)
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
        local exhausted = assert(fixtures.sync_job(result.seq))
        clear_publication_fault()
        fixtures.await_live(result.seq)
        local next_job = assert(fixtures.sync_job(result.seq, exhausted.id))
        test.is_true(next_job.execution_seq > 0)
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
        local thread, address = projection()
        assert(thread:pause_projection(address))
        local updated, err = fixtures.call(nil, "update", part)
        publication_fault({id = "app.mail_library:invalid_template", kind = "registry.entry",
            meta = {type = "kickside.mail:template"}, data = {}})
        assert(thread:resume_projection(address))
        assert(updated, tostring(err))
        test.is_false(updated.projected)
        fixtures.await(function()
            local job = fixtures.sync_job(updated.seq)
            return job and job.status == "dead"
        end, "A permanent publication error did not settle the job")
        local dead = assert(fixtures.sync_job(updated.seq))
        test.eq(1, dead.attempts)
        local unrelated = assert(funcs.call("kickside.mail.jobs:owner", {}))
        test.is_true(unrelated.success, tostring(unrelated.error))
        test.is_nil(fixtures.sync_job(updated.seq, dead.id))
        clear_publication_fault()
        test.eq("success", assert(funcs.call("kickside.mail.jobs:reconcile")).status)
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
        local scope = assert(security.scope()):with(assert(security.policy("app.mail_library:deny_marker_read")))
        local boot = assert(funcs.new():with_scope(scope))
        local failed = assert(boot:call("kickside.mail.jobs:reconcile"))
        test.eq(failed.status, "error")
        test.eq(assert(failed.details).kind, errors.PERMISSION_DENIED)
        test.eq("success", assert(funcs.call("kickside.mail.jobs:reconcile")).status)
        fixtures.await_live(updated.seq)
        test.not_nil(assert(fixtures.render(nil, {template = item.name, vars = {}})).html:find("New HTML", 1, true))
    end)

    test.it("keeps the newer publication when a publisher is holding older rows", function()
        local part = own(candidate("part", "publisher-race", "First HTML", "First text"))
        local saved = assert(call("create", part))
        part.html, part.expected_revision = "Held HTML", saved.revision
        part.preview_id = review({resources = {part}})
        local first = assert(call("update", part))
        local overlay = assert(live.open())
        local entries = assert(overlay:entries())
        local rows = assert(database.with_db(reader.live_rows))
        local declared = assert(originals.list())
        part.html, part.expected_revision = "Latest HTML", first.revision
        part.preview_id = review({resources = {part}})
        local second = assert(call("update", part))
        local published, stale = live.publish(overlay, entries, rows, declared, first.seq)
        test.is_nil(published)
        test.eq(errors.CONFLICT, assert(stale):kind())
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
        for i = 1, 2 do futures[i] = assert(fixtures.async(fixtures.editor(), "save", inputs[i])) end
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
        local thread, address = projection()
        assert(thread:pause_projection(address))
        local pending, append_err = fixtures.call(nil, "save", command)
        local before = fixtures.call(nil, "get", part)
        local second, catch_err = fixtures.call(nil, "save", {resources = {draft}, preview_id = receipt})
        local member = api_fixtures.session("editor")
        local scope = member.scope:with(assert(security.policy("app.mail_library:deny_library_wait")))
        local denied = assert(funcs.new():with_actor(member.actor):with_scope(scope))
        local denied_write, denied_err = fixtures.call(denied, "save", {resources = {draft}, preview_id = receipt})
        assert(thread:resume_projection(address))
        test.is_nil(denied_write)
        test.eq(errors.PERMISSION_DENIED, assert(denied_err):kind())
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
end

return {register = register}
