-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local fixture = require("fixture")
local scoped = require("scoped")
local steps = require("steps")
local uuid = require("uuid")
local sql = require("sql")
local time = require("time")

local CONTRACT = "kickside.work.templates:templates"
local PLUGIN = "kickside.work.templates:plugin"
local ACTION = "kickside.work.templates:action"
type Map = { [string]: unknown }
type Call = (string, unknown) -> (unknown, error?)

local function invoke(call: Call, method: string, input: Map): (unknown, error?)
    return call("contract_request", { contract = CONTRACT, method = method, value = input })
end

local function activate(h: fixture.Handle): string
    assert(h.call("apply_schema", { declaration = { plugins = { { use = PLUGIN } } } }))
    local attachment: string? = nil
    steps.wait_for("template attachment", function(): boolean
        local state = assert(h.call("contract_request", { contract = "kickside.work:board", method = "plugin_context",
            value = { board_id = h.id, plugin = PLUGIN } }))
        if state.lifecycle.state == "ready" then attachment = state.attachment_id end
        return attachment ~= nil
    end)
    return assert(attachment)
end

local function event_window(h: fixture.Handle, days: integer)
    local db = assert(sql.get("app:db"))
    assert(db:execute("UPDATE kickside_retention_policy SET event_hot_retention_days = $1, enabled = true WHERE thread_id = $2", { days, h.id }))
    db:release()
end

local function publish(h: fixture.Handle, title: string, values: Map?): Map
    local result, err = invoke(h.call, "publish", { board_id = h.id, template_id = "weekly", title = title,
        override_fields = { "title" }, preset = { op = "create", type = "task", values = values or { title = title } } })
    assert(result, steps.detail(err))
    return result :: Map
end

local function instantiate(h: fixture.Handle, template: Map, key: string, overrides: Map?): (unknown, error?)
    return invoke(h.call, "instantiate", { board_id = h.id, template_id = "weekly", version = template.version,
        key = key, overrides = overrides })
end

local function code(err: error?, expected: string)
    test.not_nil(err)
    test.eq((err :: error):details().code, expected)
end

local function automation(h: fixture.Handle, input: Map): Map
    local result, err = h.executor:call("app:templates_recurring", input)
    assert(result, steps.detail(err))
    return result :: Map
end

local function deliver(h: fixture.Handle, template: Map, identity: string, attempt: string, caller: Call?): Map
    local parts = { identity, "occurrence", "upsert", "1", attempt }
    for i, part in ipairs(parts) do parts[i] = tostring(#part) .. ":" .. part end
    local key = table.concat(parts)
    local result, err = (caller or h.call)("contract_request", { contract = "kickside.data:writable", binding = ACTION, method = "write",
        value = { config = { board_id = h.id, template_id = "weekly", version = template.version },
            input = { overrides = { title = "Recurring result" } }, sink_op = "upsert",
            identity_key = identity, idempotency_key = key, origin = "fixture-automation" } })
    assert(result, steps.detail(err))
    return result :: Map
end

return { run = test.run_cases(function()
    test.describe("Work Templates HTTP", function()
        test.it("lists active versions for a reader and instantiates the selected version for a writer", function()
            local owner, member = scoped.admin(), scoped.member()
            local board = scoped.board(owner)
            activate(board)
            local first = publish(board, "First preset")
            local second = publish(board, "Second preset")
            local path = member.route(board.id, "templates")

            test.eq(member.http("GET", path).status, 403)
            assert(board.call("grant", { subject_id = member.id, mask = 1 }))
            local list = member.http("GET", path)
            test.eq(list.status, 200, list.raw)
            test.is_true(list.body.success)
            local versions = {}
            for _, template in ipairs(list.body.data.templates) do versions[template.version] = template.title end
            test.eq(#list.body.data.templates, 2)
            test.eq(versions[first.version], "First preset")
            test.eq(versions[second.version], "Second preset")

            local request = { template_id = "weekly", version = first.version, key = "http-create" }
            local denied = member.http("POST", path .. "/instantiate", request)
            test.eq(denied.status, 403, denied.raw)
            test.eq(denied.body.kind, errors.PERMISSION_DENIED)
            assert(board.call("grant", { subject_id = member.id, mask = 3 }))
            local result = member.http("POST", path .. "/instantiate", request)
            test.eq(result.status, 200, result.raw)
            test.is_true(result.body.success)
            local created = result.body.data.outcomes[1]
            test.eq(created.status, "applied")
            test.eq(assert(steps.get(board, created.item)).item.values.title, "First preset")
            local replay = member.http("POST", path .. "/instantiate", request)
            test.eq(replay.status, 200, replay.raw)
            test.is_true(replay.body.data.replayed)
            test.eq(replay.body.data.outcomes[1].item, created.item)
        end)

        test.it("returns typed failures for an inactive catalog and an unknown version", function()
            local owner = scoped.admin()
            local board = scoped.board(owner)
            local path = owner.route(board.id, "templates")
            local inactive = owner.http("GET", path)
            test.eq(inactive.status, 404, inactive.raw)
            test.eq(inactive.body.kind, errors.NOT_FOUND)
            test.eq(inactive.body.details.code, "plugin_inactive")

            activate(board)
            local missing = owner.http("POST", path .. "/instantiate", {
                template_id = "weekly", version = uuid.v4(), key = "http-missing",
            })
            test.eq(missing.status, 404, missing.raw)
            test.eq(missing.body.kind, errors.NOT_FOUND)
            test.eq(missing.body.details.code, "template_version_not_found")
        end)
    end)

    test.describe("Work templates", function()
        test.it("publishes immutable versions and lists a board catalog only after activation", function()
            local h = fixture.board()
            local _, err = invoke(h.call, "list", { board_id = h.id })
            code(err, "plugin_inactive")
            activate(h)
            local first = publish(h, "First")
            local second = publish(h, "Second")
            test.is_true(first.version ~= second.version)
            local listed = assert(invoke(h.call, "list", { board_id = h.id }))
            test.eq(#listed.templates, 2)
            local other = fixture.board()
            activate(other)
            test.eq(#assert(invoke(other.call, "list", { board_id = other.id })).templates, 0)
            local _, invalid = invoke(h.call, "publish", { board_id = h.id, template_id = "bad", title = "Bad",
                preset = { op = "create", type = "task", values = { estimate = "bad" } } })
            code(invalid, "invalid_value")
        end)

        test.it("checks current board access and hides defaults without static field read access", function()
            local declaration = fixture.declaration(fixture.fresh_prefix())
            local fields = declaration.fields :: { Map }
            fields[2].access = { read = {}, write = {} }
            local h = fixture.board({ declaration = declaration })
            activate(h)
            local preset = publish(h, "Hidden estimate", { title = "Visible title", estimate = 7 })
            local reader, reader_id = fixture.user(h, nil, true)
            assert(h.call("grant", { subject_id = reader_id, mask = 1 }))
            local request = { board_id = h.id }
            local listed = assert(invoke(reader, "list", request))
            test.eq(listed.templates[1].preset.values.title, "Visible title")
            test.is_nil(listed.templates[1].preset.values.estimate)
            local _, denied = invoke(reader, "archive", { board_id = h.id, template_id = "weekly", version = preset.version })
            test.eq(assert(denied):kind(), errors.PERMISSION_DENIED)
            local _, write_denied = invoke(reader, "instantiate", { board_id = h.id, template_id = "weekly",
                version = preset.version, key = "reader" })
            test.eq(assert(write_denied):kind(), errors.PERMISSION_DENIED)
            local _, field_denied = instantiate(h, preset, "admin")
            code(field_denied, "field_denied")
        end)

        test.it("creates one item through apply, preserves replay after archive, and rejects changed keys", function()
            local h = fixture.board()
            activate(h)
            local first = publish(h, "First")
            publish(h, "Second")
            local _, forbidden = instantiate(h, first, "bad", { estimate = 4 })
            code(forbidden, "template_override_denied")
            local created = assert(instantiate(h, first, "repeat", { title = "Changed" }))
            local id = assert(created.outcomes[1].item)
            test.eq(assert(h.call("get", { item = { id = id } })).item.values.title, "Changed")
            local _, conflict = instantiate(h, first, "repeat", { title = "Different" })
            code(conflict, "idempotency_conflict")
            assert(invoke(h.call, "archive", { board_id = h.id, template_id = "weekly", version = first.version }))
            test.eq(#assert(invoke(h.call, "list", { board_id = h.id })).templates, 1)
            local replay = assert(instantiate(h, first, "repeat", { title = "Changed" }))
            test.is_true(replay.replayed)
            test.eq(replay.outcomes[1].item, id)
            local _, archived = instantiate(h, first, "new")
            code(archived, "template_archived")
            test.eq(#assert(h.call("query", {})).items, 1)
        end)

        test.it("checks stored field identities when schema changes and keeps successful replays", function()
            local h = fixture.board()
            activate(h)
            local first = publish(h, "First")
            local receipt = assert(instantiate(h, first, "before"))
            local declaration = fixture.declaration(h.prefix)
            table.remove(declaration.fields :: { Map }, 1)
            for _, item_type in ipairs(declaration.item_types) do table.remove(item_type.fields, 1) end
            declaration.remove = { fields = { "title" } }
            assert(h.call("apply_schema", { declaration = declaration }))
            assert(h.call("apply_schema", { declaration = fixture.declaration(h.prefix) }))
            local _, stale = instantiate(h, first, "after")
            code(stale, "template_schema_changed")
            local replay = assert(instantiate(h, first, "before"))
            test.eq(replay.outcomes[1].item, receipt.outcomes[1].item)
        end)

        test.it("uses occurrence identity across Automation delivery changes and pins the catalog version", function()
            local h = fixture.board()
            activate(h)
            local first = publish(h, "First")
            publish(h, "Second")
            local occurrence = uuid.v4()
            local short_window = deliver(h, first, occurrence, "0")
            test.eq(short_window.error.code, "template_replay_window_short")
            event_window(h, 90)
            local created = deliver(h, first, occurrence, "0")
            test.is_true(created.success, tostring(created.error))
            local replay = deliver(h, first, occurrence, "1")
            test.is_true(replay.success)
            test.eq(replay.dest_ref.item_id, created.dest_ref.item_id)
            local next_occurrence = deliver(h, first, uuid.v4(), "0")
            test.is_true(next_occurrence.success)
            test.is_true(next_occurrence.dest_ref.item_id ~= created.dest_ref.item_id)
            local expired = deliver(h, first, uuid.v4(), "1")
            test.eq(expired.error.code, "template_replay_unavailable")
            assert(invoke(h.call, "archive", { board_id = h.id, template_id = "weekly", version = first.version }))
            local blocked = deliver(h, first, uuid.v4(), "0")
            test.eq(blocked.success, false)
            test.eq(blocked.error.code, "template_archived")
        end)

        test.it("checks the occurrence executor's current Work permission even when a receipt exists", function()
            local h = fixture.board()
            activate(h)
            event_window(h, 90)
            local first = publish(h, "Pinned")
            local writer, writer_id = fixture.user(h, nil, true)
            assert(h.call("grant", { subject_id = writer_id, mask = 2 }))
            local occurrence = uuid.v4()
            local created = deliver(h, first, occurrence, "0", writer)
            test.is_true(created.success, tostring(created.error))
            assert(h.call("revoke", { subject_id = writer_id }))
            local refused = deliver(h, first, occurrence, "1", writer)
            test.eq(refused.success, false)
            test.eq(refused.error.kind, errors.PERMISSION_DENIED)
            test.eq(#assert(h.call("query", {})).items, 1)
        end)

        test.it("replays a pinned request after archive retirement and attachment teardown", function()
            local h = fixture.board()
            local attachment = activate(h)
            event_window(h, 3)
            local first = publish(h, "First")
            local second = publish(h, "Second")
            local created = assert(instantiate(h, first, "receipt", { title = "Result" }))
            assert(invoke(h.call, "archive", { board_id = h.id, template_id = "weekly", version = first.version }))
            event_window(h, 90)
            local db = assert(sql.get("app:db"))
            local receipt_time = time.now():add(assert(time.parse_duration("-96h"))):utc():format("2006-01-02T15:04:05.000000000Z")
            assert(db:execute("UPDATE kickside_work_receipt SET at = $1 WHERE board_id = $2 AND seq = $3",
                { receipt_time, h.id, created.seq }))
            assert(db:execute("UPDATE kickside_work_template_version SET expires_at = $1 WHERE attachment_id = $2 AND version = $3",
                { "2000-01-01T00:00:00.000000000Z", attachment, first.version }))
            db:release()
            assert(h.call("direct", { target = "kickside.work.templates:retire" }))
            local replay, replay_err = instantiate(h, first, "receipt", { title = "Result" })
            assert(replay, steps.detail(replay_err))
            test.is_true(replay.replayed)
            test.eq(replay.outcomes[1].item, created.outcomes[1].item)
            assert(h.call("apply_schema", { declaration = { plugins = {} } }))
            steps.deleted(attachment)
            local detached = assert(instantiate(h, first, "receipt", { title = "Result" }))
            test.is_true(detached.replayed)
            test.eq(detached.seq, created.seq)
            local _, version_err = instantiate(h, second, "receipt", { title = "Result" })
            code(version_err, "idempotency_conflict")
            local _, override_err = instantiate(h, first, "receipt", { title = "Changed" })
            code(override_err, "idempotency_conflict")
            local _, new_err = instantiate(h, first, "fresh", { title = "Result" })
            code(new_err, "plugin_inactive")
            test.eq(#assert(h.call("query", {})).items, 1)
        end)

        test.it("uses Work receipt evidence for operator replay through catalog teardown", function()
            local h = fixture.board()
            local attachment = activate(h)
            event_window(h, 90)
            local first = publish(h, "First")
            local identity = uuid.v4()
            test.is_true(deliver(h, first, identity, "0").success)
            assert(h.call("apply_schema", { declaration = { plugins = {} } }))
            steps.deleted(attachment)
            local replay = deliver(h, first, identity, "1")
            test.is_true(replay.success, tostring(replay.error and replay.error.code))
            local db = assert(sql.get("app:db"))
            assert(db:execute("UPDATE kickside_work_receipt SET at = $1 WHERE board_id = $2",
                { "2000-01-01T00:00:00.000000000Z", h.id }))
            db:release()
            local expired = deliver(h, first, identity, "2")
            test.is_false(expired.success)
            test.eq(expired.error.code, "template_replay_unavailable")
            test.eq(#assert(h.call("query", {})).items, 1)
        end)

        test.it("expires archived versions, emits catalog facts, and drops versions on plugin teardown", function()
            local h = fixture.board()
            local attachment = activate(h)
            local first = publish(h, "First")
            local second = publish(h, "Second")
            local emit = { board_id = h.id, template_id = "weekly", version = first.version }
            assert(invoke(h.call, "archive", emit))
            assert(invoke(h.call, "archive", emit))
            local events = assert(h.call("contract_request", { contract = "kickside.core:threads", method = "list_events",
                value = { thread_id = attachment, from_seq = 1, limit = 10 } })).events
            local published, archived = 0, 0
            for _, event in ipairs(events) do
                if event.type == "kickside.work.templates:template.published" then published = published + 1 end
                if event.type == "kickside.work.templates:template.archived" then archived = archived + 1 end
            end
            test.eq(published, 2)
            test.eq(archived, 1)
            local db = assert(sql.get("app:db"))
            assert(db:execute("UPDATE kickside_work_template_version SET expires_at = $1 WHERE attachment_id = $2 AND version = $3",
                { "2000-01-01T00:00:00.000000000Z", attachment, first.version }))
            db:release()
            local _, expired = instantiate(h, first, "expired")
            code(expired, "template_version_not_found")
            local retired = assert(h.call("direct", { target = "kickside.work.templates:retire" }))
            test.eq(retired.deleted, 1)
            assert(h.call("apply_schema", { declaration = { plugins = {} } }))
            steps.deleted(attachment)
            local db = assert(sql.get("app:db"))
            local rows = assert(db:query("SELECT version FROM kickside_work_template_version WHERE attachment_id = $1", { attachment }))
            db:release()
            test.eq(#rows, 0)
            activate(h)
            local _, missing = instantiate(h, second, "new-attachment")
            code(missing, "template_version_not_found")
        end)

        test.it("installs the recurring task under the board and runs pinned creates as the installer", function()
            local h = fixture.board()
            activate(h)
            event_window(h, 90)
            local first = publish(h, "Pinned title")
            local second = publish(h, "Other title")
            local installed = automation(h, { board_id = h.id, version = first.version })
            local id = assert(installed.id or installed.component_id) :: string
            local installed_component = automation(h, { op = "component", automation_id = id })
            test.eq(installed_component.parent_id, h.id)
            local function control(action: string, key: string)
                automation(h, { op = "control", automation_id = id, control = action, request_id = key })
            end
            control("run_now", "first-occurrence")
            steps.wait_for("first recurring item", function(): boolean
                local items = assert(h.call("query", {})).items
                return #items == 1 and items[1].values.title == "Pinned title"
            end)
            local item = assert(h.call("query", {})).items[1]
            local history = assert(h.call("list_history", { item = { id = item.id } })).entries
            local created = history[#history]
            test.eq(created.kind, "created")
            test.eq(created.actor, h.actor:id())
            control("run_now", "first-occurrence")
            control("pause", "pause")
            automation(h, { op = "reconfigure", automation_id = id, board_id = h.id,
                version = second.version, overrides = { title = "Reconfigured" } })
            control("resume", "resume")
            control("run_now", "second-occurrence")
            steps.wait_for("second recurring item", function(): boolean
                local items = assert(h.call("query", {})).items
                return #items == 2 and items[2].values.title == "Reconfigured"
            end)
        end)

        test.it("refuses to delete a board with a live recurring task", function()
            local h = fixture.board()
            activate(h)
            local first = publish(h, "Pinned title")
            local installed = automation(h, { board_id = h.id, version = first.version })
            local id = assert(installed.id or installed.component_id) :: string

            local result, err = h.call("contract_request", {
                contract = "kickside.work:board", method = "delete", value = { board_id = h.id },
            })
            test.is_nil(result)
            test.eq(assert(err):kind(), errors.CONFLICT)
            test.eq(automation(h, { op = "component", automation_id = id }).parent_id, h.id)
        end)
    end)
end) }
