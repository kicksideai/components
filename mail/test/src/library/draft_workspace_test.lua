-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local funcs = require("funcs")
local registry = require("registry")
local security = require("security")
local uuid = require("uuid")
local fixtures = require("fixtures")
local api_fixtures = require("api_fixtures")
local database = require("database")
local jet = require("jet")
local references = require("references")
local test = require("test")
local threads_fixture = require("threads_fixture")

local OWNER = jet.draft_owner
local MESSAGE = "workspace-message"
local PART = "workspace-part"

local function resource(kind, name, body)
    if kind == "message" then body = "{{ block body() }}" .. body .. "{{ end }}" end
    return {kind = kind, name = name, title = name, description = "", html = body, text = body,
        subject = kind == "message" and "Workspace subject" or nil,
        schema = {type = "object", properties = {}}, samples = {}}
end

local function workspace()
    return assert(assert(registry.overlay(OWNER)):entries())
end

return {run = test.run_cases(function()
    test.describe("Mail draft workspace", function()
        local editor, actor, scope, owned, initial, live_html, restore_threads

        local function create(item)
            local draft = {message = item.kind == "message" and item.name or "notice", create = item}
            local result = assert(fixtures.call(editor, "preview", draft))
            item.preview_id = assert(result.preview_id, result.errors[1] and result.errors[1].message)
            local saved = assert(fixtures.call(editor, "create", item))
            fixtures.await_live(saved.seq)
            return saved
        end

        test.before_each(function()
            owned = {}
            local member = api_fixtures.session("editor")
            actor, scope = member.actor, member.scope
            editor = assert(funcs.new():with_actor(actor):with_scope(scope))
            initial = create(resource("message", MESSAGE, "Live body"))
            owned[1] = {kind = "message", name = MESSAGE}
            live_html = assert(fixtures.render(editor, {template = MESSAGE, vars = {}})).html
            test.not_nil(live_html:find("Live body", 1, true))
        end)

        test.after_each(function()
            if restore_threads then
                restore_threads()
                restore_threads = nil
            end
            fixtures.remove(owned)
        end)

        local function cancel_at_threads(method, input, fault)
            restore_threads = threads_fixture.select()
            local permission = assert(security.policy("app.mail_library:threads_fixture_dispatch"))
            local caller = assert(editor:with_scope(assert(scope:with(permission))))
            fault.gate = uuid.v4()
            caller = assert(caller:with_context({mail_fixture_threads = fault}))
            local paused = threads_fixture.observe_pause(fault.gate)
            local call = assert(fixtures.async(caller, method, input))
            paused()
            test.is_false(call:is_complete())
            call:cancel()
            test.is_true(call:is_canceled())
            local value = call:result()
            test.is_nil(value)
            restore_threads()
            restore_threads = nil
        end

        local function live_is_unchanged()
            local current = assert(fixtures.call(editor, "get", {kind = "message", name = MESSAGE}))
            test.eq(initial.revision, current.revision)
            test.eq(initial.html, current.html)
            local rendered = assert(fixtures.render(editor, {template = MESSAGE, vars = {}}))
            test.eq(live_html, rendered.html)
        end

        local function preview_and_save()
            local edit = resource("message", MESSAGE, "Next body")
            edit.expected_revision = initial.revision
            local result = assert(fixtures.call(editor, "preview", {message = MESSAGE, resources = {edit}}))
            test.not_nil(result.html:find("Next body", 1, true))
            test.eq(0, #workspace())
            live_is_unchanged()
            local review = assert(fixtures.call(editor, "preview", {message = MESSAGE, resources = {edit}}))
            local saved = assert(fixtures.call(editor, "save", {resources = {edit}, preview_id = assert(review.preview_id)})).items
            test.eq(edit.html, saved[1].html)
            test.neq(initial.revision, saved[1].revision)
            test.eq(0, #workspace())
        end

        test.it("selects only the draft roots and their transitive template references", function()
            local message = resource("message", MESSAGE, '{{ include "/part/direct" }}')
            message.base = "workspace-base"
            local base = resource("base", message.base, '{{ include "/part/transitive" }}')
            local direct = resource("part", "direct", '{{ include "/part/transitive" }}')
            local transitive = resource("part", "transitive", "Shared")
            local unrelated = resource("part", "unrelated", "Omit")
            local selected = references.closure({
                ["base/workspace-base"] = base, ["part/direct"] = direct,
                ["part/transitive"] = transitive, ["part/unrelated"] = unrelated,
            }, message, {}, {})
            test.eq(4, #selected)
            test.eq(message.name, selected[1].name)
            test.eq(base.name, selected[2].name)
            test.eq(direct.name, selected[3].name)
            test.eq(transitive.name, selected[4].name)
        end)

        test.it("renders a draft with its referenced base while leaving unrelated parts unchanged", function()
            local base = create(resource("base", "workspace-base", "<main>{{ block body() }}{{ end }}</main>"))
            owned[#owned + 1] = {kind = "base", name = base.name}
            local extra = create(resource("part", PART, "Unrelated part"))
            owned[#owned + 1] = {kind = "part", name = extra.name}
            local draft = resource("message", MESSAGE, "Closure body")
            draft.base = base.name
            local output, err = fixtures.call(editor, "preview", {message = MESSAGE, resources = {draft}})
            test.eq(0, #workspace())
            assert(output, tostring(err))
            test.not_nil(output.html:find("<main>Closure body</main>", 1, true))
            local unrelated = assert(fixtures.call(editor, "get", {kind = "part", name = extra.name}))
            test.eq(extra.revision, unrelated.revision)
            test.eq(extra.html, unrelated.html)
        end)

        test.it("returns a failed preview with an empty scratch overlay", function()
            local draft = resource("message", MESSAGE, '{{ include "/part/workspace-missing" }}')
            local output, err = fixtures.call(editor, "preview", {message = MESSAGE, resources = {draft}})
            test.eq(0, #workspace())
            test.is_nil(output)
            test.not_nil(err)
        end)

        test.it("evaluates and saves after a cancelled preview without changing live mail", function()
            local draft = resource("message", MESSAGE, "Cancelled preview body")
            draft.expected_revision = initial.revision
            cancel_at_threads("preview", {message = MESSAGE, resources = {draft}}, {subject = "message/" .. MESSAGE})
            test.eq(0, #workspace())
            live_is_unchanged()
            preview_and_save()
        end)

        test.it("sweeps a preview receipt at its expiry without changing live mail", function()
            local owner = fixtures.retention_id()
            local draft = resource("message", MESSAGE, "Uncommitted preview body")
            draft.expected_revision = initial.revision
            local preview = assert(fixtures.call(editor, "preview", {message = MESSAGE, resources = {draft}}))
            local receipt = assert(preview.preview_id)
            local function reserved()
                local rows = assert(database.with_db(function(db)
                    return db:query("SELECT expires_at FROM mail_library_preview WHERE id=$1", {receipt})
                end))
                return rows[1] and rows[1].expires_at
            end
            local expires = assert(reserved())
            local function sweep()
                local report = assert(funcs.call(owner, {}))
                assert(report.success, tostring(report.error))
            end
            sweep()
            test.eq(expires, reserved())
            assert(database.with_db(function(db)
                return db:execute("UPDATE mail_library_preview SET expires_at=$1 WHERE id=$2",
                    {time.now():unix() - 1, receipt})
            end))
            sweep()
            test.is_nil(reserved())
            local result, err = fixtures.call(editor, "save", {resources = {draft}, preview_id = receipt})
            test.is_nil(result)
            test.eq(errors.INVALID, assert(err):kind())
            test.eq("mail_preview_mismatch", err:details().code)
            test.eq(0, #workspace())
            live_is_unchanged()
        end)

        test.it("evaluates and saves after cancelled save validation without committing the edit", function()
            local draft = resource("message", MESSAGE, "Cancelled save body")
            draft.expected_revision = initial.revision
            local review = assert(fixtures.call(editor, "preview", {message = MESSAGE, resources = {draft}}))
            local input = {resources = {draft}, preview_id = assert(review.preview_id)}
            cancel_at_threads("save", input, {append = "pause"})
            live_is_unchanged()
            local saved = assert(fixtures.call(editor, "save", input))
            test.eq(draft.html, saved.items[1].html)
            test.eq(0, #workspace())
        end)

        test.it("keeps draft-only edits out of the library when a different revision is deleted", function()
            local part = create(resource("part", PART, "Live part"))
            owned[2] = {kind = "part", name = PART}
            local extra = resource("part", "workspace-extra", "Draft-only part")
            local preview = assert(fixtures.call(editor, "preview", {message = MESSAGE, create = extra}))
            test.not_nil(preview.preview_id)
            for _, item in ipairs(assert(fixtures.call(editor, "list", {kind = "part"})).items) do
                test.neq(extra.name, item.name)
            end
            assert(fixtures.call(editor, "delete", {kind = "part", name = PART, expected_revision = part.revision}))
            test.eq(0, #workspace())
            preview_and_save()
        end)

        test.it("preserves live templates during boot reconciliation", function()
            local boot = assert(fixtures.boot())
            test.eq("success", boot.status, boot.message)
            test.eq(0, #workspace())
            live_is_unchanged()
            preview_and_save()
        end)
    end)
end)}
