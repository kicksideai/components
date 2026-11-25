-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local autoinit = require("autoinit")
local registry = require("registry")
local templates = require("templates")
local sql = require("sql")
local fixtures = require("fixtures")
local api_fixtures = require("api_fixtures")
local jet = require("jet")
local publication_cases = require("publication_cases")
local resource_cases = require("resource_cases")
local history_cases = require("history_cases")

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
        local owned
        local state = {}
        test.before_each(function()
            owned, state.originals = {}, {}
        end)
        local function own(item)
            owned[#owned + 1] = {kind = item.kind, name = item.name}
            return item
        end
        local publication_fault
        local fault_enabled = false
        state.capture_configured = false
        test.after_each(function()
            if fault_enabled then publication_fault(false) end
            if state.capture_configured then
                api_fixtures.settings("", "")
                state.capture_configured = false
            end
            fixtures.remove(owned)
            if #state.originals > 0 then
                local changes = assert(registry.snapshot()):changes()
                for _, original in ipairs(state.originals) do assert(changes:update(original)) end
                assert(changes:apply())
            end
        end)
        publication_fault = function(enabled, hold_seq, permanent)
            fault_enabled = enabled or hold_seq ~= nil
            local db = assert(sql.get("app:db"))
            assert(db:execute("DELETE FROM mail_realtime_fixture WHERE topic=$1", {"fixture.publisher_fault"}))
            if fault_enabled then
                local mode = type(enabled) == "number" and "exhaust"
                    or permanent and "permanent" or enabled and "unavailable" or "hold"
                assert(db:execute("INSERT INTO mail_realtime_fixture (topic,subject,data,observed) VALUES ($1,$2,$3,$4)",
                    {"fixture.publisher_fault", tostring(type(enabled) == "number" and enabled or hold_seq or ""), "{}", mode}))
            end
            assert(db:release())
        end

        local cases = {
            test = test,
            HTML = HTML,
            OWNER = OWNER,
            state = state,
            own = own,
            publication_fault = publication_fault,
            review = review,
            call = call,
            candidate = candidate,
            value = value,
            TEXT = TEXT,
            discard_overlay = discard_overlay,
            THREAD = THREAD,
        }
        publication_cases.register(cases)
        resource_cases.register(cases)
        history_cases.register(cases)

    end)
end)}
