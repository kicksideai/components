-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local funcs = require("funcs")
local registry = require("registry")
local security = require("security")
local time = require("time")
local fixtures = require("fixtures")
local test = require("test")

local NS = "kickside.mail.library:"
local OWNER = NS .. "draft_workspace"
local DRAFT = "kickside.mail.draft:"
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

local function cancel_after_publication(editor, method, input)
    local parked = assert(editor:with_context({mail_test_park_draft = true}))
    local future = assert(parked:async(NS .. method, input))
    local deadline = time.now():add(10 * time.SECOND):unix_nano()
    local published
    repeat
        for _, entry in ipairs(workspace()) do
            if entry.kind == "template.set" and entry.id:sub(-5) == ".html" then
                published = entry.id
                break
            end
        end
        if not published and not future:is_complete() then time.sleep("1ms") end
    until published or future:is_complete() or time.now():unix_nano() >= deadline
    if future:is_complete() then
        local _, err = future:result()
        error(err or "Draft evaluation finished before it parked")
    end
    assert(future:cancel())
    assert(published, "Draft evaluation must publish the workspace before cancellation")
    assert(registry.get(published))
    return published:sub(1, -5)
end

return {run = test.run_cases(function()
    test.describe("Mail draft workspace", function()
        local editor, actor, scope, owned, initial, live_html

        test.before_each(function()
            owned = {}
            scope = assert(security.new_scope({
                assert(security.policy("kickside.mail.security:library_access")),
                assert(security.policy("kickside.mail.security:library_calls")),
            }))
            actor = assert(security.new_actor("workspace-editor", {}))
            editor = assert(funcs.new():with_actor(actor):with_scope(scope))
            initial = assert(editor:call(NS .. "create", resource("message", MESSAGE, "Live body")))
            owned[1] = {kind = "message", name = MESSAGE}
            live_html = assert(editor:call(NS .. "render", {template = MESSAGE, vars = {}})).html
            test.not_nil(live_html:find("Live body", 1, true))
        end)

        test.after_each(function()
            fixtures.remove(owned)
        end)

        local function live_is_unchanged()
            local current = assert(editor:call(NS .. "get", {kind = "message", name = MESSAGE}))
            test.eq(initial.revision, current.revision)
            test.eq(initial.html, current.html)
            local rendered = assert(editor:call(NS .. "render", {template = MESSAGE, vars = {}}))
            test.eq(live_html, rendered.html)
        end

        local function preview_and_save()
            local edit = resource("message", MESSAGE, "Next body")
            edit.expected_revision = initial.revision
            local result = assert(editor:call(NS .. "render_draft", {message = MESSAGE, resources = {edit}}))
            test.not_nil(result.html:find("Next body", 1, true))
            test.eq(0, #workspace())
            live_is_unchanged()
            local saved = assert(editor:call(NS .. "save", {resources = {edit}}))
            test.eq(edit.html, saved[1].html)
            test.neq(initial.revision, saved[1].revision)
            test.eq(0, #workspace())
        end

        test.it("builds scratch entries for only the message and its referenced base", function()
            local base = assert(editor:call(NS .. "create", resource("base", "workspace-base", "{{ block body() }}{{ end }}")))
            owned[#owned + 1] = {kind = "base", name = base.name}
            local extra = assert(editor:call(NS .. "create", resource("part", PART, "Unrelated part")))
            owned[#owned + 1] = {kind = "part", name = extra.name}
            local draft = resource("message", MESSAGE, "Closure body")
            draft.base = base.name
            local scoped = assert(editor:with_context({mail_test_expected_scratch_entries = 7}))
            local output, err = scoped:call(NS .. "render_draft", {message = MESSAGE, resources = {draft}})
            test.eq(0, #workspace())
            assert(output, tostring(err))
            test.not_nil(output.html:find("Closure body", 1, true))
        end)

        test.it("returns a failed preview with an empty scratch overlay", function()
            local draft = resource("message", MESSAGE, '{{ include "/part/workspace-missing" }}')
            local output, err = editor:call(NS .. "render_draft", {message = MESSAGE, resources = {draft}})
            test.eq(0, #workspace())
            test.is_nil(output)
            test.not_nil(err)
        end)

        test.it("evaluates and saves after a cancelled preview without changing live mail", function()
            local draft = resource("message", MESSAGE, "Cancelled preview body")
            cancel_after_publication(editor, "render_draft", {message = MESSAGE, resources = {draft}})
            live_is_unchanged()
            preview_and_save()
        end)

        test.it("evaluates and saves after cancelled save validation without committing the edit", function()
            local draft = resource("message", MESSAGE, "Cancelled save body")
            draft.expected_revision = initial.revision
            cancel_after_publication(editor, "save", {resources = {draft}})
            live_is_unchanged()
            preview_and_save()
        end)

        test.it("discards a cancelled candidate with different resources and a deleted part", function()
            local part = assert(editor:call(NS .. "create", resource("part", PART, "Live part")))
            owned[2] = {kind = "part", name = PART}
            local edited = resource("part", PART, "Cancelled part")
            local extra = resource("part", "workspace-extra", "Draft-only part")
            local prefix = cancel_after_publication(editor, "render_draft", {message = MESSAGE, resources = {edited, extra}})
            assert(registry.get(prefix .. "part." .. extra.name .. ".html"))
            assert(registry.get(prefix .. "part." .. PART .. ".html"))
            for _, item in ipairs(assert(editor:call(NS .. "list", {kind = "part"}))) do
                test.neq(extra.name, item.name)
            end
            test.neq("allow", scope:evaluate(actor, "template.get", prefix .. "html"))
            test.neq("allow", scope:evaluate(actor, "registry.get", prefix .. "part." .. extra.name .. ".html"))
            assert(editor:call(NS .. "delete", {kind = "part", name = PART, expected_revision = part.revision}))
            test.is_nil(registry.get(prefix .. "part." .. extra.name .. ".html"))
            test.is_nil(registry.get(prefix .. "part." .. PART .. ".html"))
            preview_and_save()
        end)

        test.it("clears leftover draft sets at boot while preserving live templates", function()
            local changes = assert(registry.overlay(OWNER)):changes()
            for _, face in ipairs({"html", "text"}) do
                local set = DRAFT .. face
                assert(changes:create({id = set, kind = "template.set",
                    data = {engine = {escape = face == "html" and "html" or "none"}}}))
                assert(changes:create({id = DRAFT .. "part.leftover." .. face, kind = "template.jet",
                    meta = {name = "part/leftover", depends_on = {set}}, data = {set = set, source = "Leftover"}}))
            end
            assert(changes:apply())
            local boot = assert(funcs.call(NS .. "reconcile"))
            test.eq("success", boot.status, boot.message)
            test.eq(0, #workspace())
            live_is_unchanged()
            preview_and_save()
        end)
    end)
end)}
