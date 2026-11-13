-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local fixture = require("fixture")
local steps = require("steps")
local sql = require("sql")
local json = require("json")
local registry = require("registry")
local shape = require("shape")

type Map = { [string]: unknown }
local GROUP = "app.security:work_test"

local function declaration(source: unknown): Map
    return { key_prefix = fixture.fresh_prefix(), fields = {
        { code = "owner", type = "principal" }, { code = "reviewers", type = "principal", cardinality = "set" },
        { code = "level", form = "text", index = "key" },
    }, item_types = { { id = "task", process = "flow", fields = { "owner", "reviewers", "level" } } },
    processes = { { id = "flow", initial = "todo", migration = "pin", states = {
        { id = "todo", category = "unstarted" },
        { id = "design", category = "started", awaiting = source, due = "PT1H" },
        { id = "review", category = "started", kind = "gate", release_when = {
            approvals = { min = 1, from = source, prevent_self = true }, when = { field = "level", op = "eq", value = "release" } } },
        { id = "done", category = "completed" },
    }, transitions = { { id = "design", from = "any", to = "design" }, { id = "review", from = "any", to = "review" },
        { id = "finish", from = { "review" }, to = "done", auto = true, default = true } } } } }
end
local function enter(h: fixture.Handle, state: string, values: Map?): string
    local id = steps.create(h, "task", values)
    test.eq(steps.one(h, { op = "transition", item = id, transition = state }).status, "applied")
    return id
end
local function define()
    test.describe("declared awaiting", function()
        test.it("answers manual group eligibility and state entry time with a due deadline", function()
            local h = fixture.board({ declaration = declaration({ group = GROUP }) })
            local peer, pid = fixture.user(h, nil, true)
            assert(h.call("grant", { subject_id = pid, mask = 3 }))
            local id = enter(h, "design")
            local item = assert(peer("get", { item = { id = id } })).item
            test.not_nil(item.awaiting)
            test.is_true(item.awaiting.can_act)
            test.not_nil(item.awaiting.since)
            test.not_nil(item.awaiting.by)
            test.is_true(item.awaiting.by > item.awaiting.since)
            local change = assert(peer("list_changes", {})).items[1]
            test.not_nil(change.awaiting)
            test.eq(change.awaiting.since, item.awaiting.since)
            test.eq(change.awaiting.can_act, item.awaiting.can_act)
            steps.one(h, { op = "set", item = id, values = { level = "changed" } })
            test.eq(assert(steps.get(h, id)).item.awaiting.since, item.awaiting.since)
            local db = assert(sql.get("app:db"))
            assert(db:execute("DELETE FROM app_user_groups WHERE user_id=$1 AND group_id=$2", { pid, GROUP }))
            db:release()
            test.is_false(assert(peer("get", { item = { id = id } })).item.awaiting.can_act)
            test.eq(#assert(peer("query", { where = { awaiting = true } })).items, 0)
        end)

        test.it("matches declared users and principal fields including group members and sets", function()
            for _, form in ipairs({ "literal", "one", "set" }) do
                local h = fixture.board({ bare = true })
                local peer, pid = fixture.user(h, nil, true)
                assert(h.call("grant", { subject_id = pid, mask = 3 }))
                local source = form == "literal" and { { kind = "user", id = pid } } or { field = form == "one" and "owner" or "reviewers" }
                local d = declaration(source); d.key_prefix = h.prefix
                assert(h.call("apply_schema", { declaration = d }))
                local values: Map = form == "one" and { owner = { kind = "group", id = GROUP } } or form == "set" and { reviewers = { { kind = "group", id = GROUP } } } or {}
                local id = enter(h, "design", values)
                test.is_true(assert(peer("get", { item = { id = id } })).item.awaiting.can_act)
                if form == "literal" then test.is_false(assert(steps.get(h, id)).item.awaiting.can_act) end
                test.eq(#assert(peer("query", { where = { awaiting = true } })).items, 1)
                if form ~= "literal" then
                    steps.one(h, { op = "set", item = id, clear = { form == "one" and "owner" or "reviewers" } })
                    test.is_false(assert(peer("get", { item = { id = id } })).item.awaiting.can_act)
                    test.eq(#assert(peer("query", { where = { awaiting = true } })).items, 0)
                end
            end
        end)

        test.it("uses gate approvers and entrant prevention for reads filters and commands", function()
            local h = fixture.board({ declaration = declaration({ field = "owner" }) })
            local peer, pid = fixture.user(h, nil, true)
            assert(h.call("grant", { subject_id = pid, mask = 3 }))
            local id = enter(h, "review", { owner = { kind = "group", id = GROUP } })
            local own = assert(steps.get(h, id)).item
            test.is_false(own.awaiting.can_act)
            test.eq(own.awaiting.can_act, own.gate.can_approve)
            test.eq(own.awaiting.since, own.gate.entered_at)
            test.is_nil(own.awaiting.by)
            test.eq(#assert(h.call("query", { where = { awaiting = true } })).items, 0)
            local item = assert(peer("get", { item = { id = id } })).item
            test.is_true(item.awaiting.can_act)
            test.eq(item.awaiting.can_act, item.gate.can_approve)
            test.eq(#assert(peer("query", { where = { awaiting = true } })).items, 1)
            test.eq(assert(peer("approve", { item = id, visit = 2 })).outcomes[1].status, "applied")
        end)

        test.it("pages the SQL population under visibility and supports counts groups and saved views", function()
            local d = declaration({ group = GROUP })
            d.visibility = { field = "level", bypass = "admin", levels = { { id = "private", holders = { { group = "app.security:work_admin" } } } } }
            local h = fixture.board({ declaration = d })
            local peer, pid = fixture.user(h, nil, true)
            assert(h.call("grant", { subject_id = pid, mask = 3 }))
            local plain = steps.create(h, "task")
            test.is_nil(assert(steps.get(h, plain)).item.awaiting)
            local first = enter(h, "design")
            enter(h, "design", { level = "private" })
            local last = enter(h, "design")
            local where = { awaiting = true }
            local page = assert(peer("query", { where = where, include = { "awaiting" }, order = { field = "number" }, limit = 1 }))
            test.eq(#page.items, 1); test.eq(page.items[1].id, first)
            test.is_true(page.items[1].awaiting.can_act)
            test.not_nil(page.after)
            local next_page = assert(peer("query", { where = where, include = { "awaiting" }, order = { field = "number" }, limit = 1, after = page.after }))
            test.eq(#next_page.items, 1); test.eq(next_page.items[1].id, last)
            test.is_nil(next_page.after)
            test.eq(assert(peer("count", { where = where })).total, 2)
            test.eq(assert(peer("query", { where = where, group_by = "state" })).groups[1].count, 2)
            test.eq(#assert(peer("query", { where = { ["not"] = where } })).items, 1)
            local saved = assert(h.call("create_view", { board_id = h.id, title = "Waiting on me", view = { type = "list", where = where } }))
            test.eq(#assert(peer("run_view", { view_id = saved.view_id })).items, 2)
            test.not_nil(assert(peer("explain", { where = where })).plan.statement)
        end)

        test.it("reads old stored processes without awaiting and preserves pinned declarations", function()
            local d = declaration({ group = GROUP }); d.processes[1].states[2].awaiting = nil
            local h = fixture.board({ declaration = d })
            local old = enter(h, "design")
            test.is_nil(assert(steps.get(h, old)).item.awaiting)
            d.processes[1].states[2].awaiting = { group = GROUP }
            assert(h.call("apply_schema", { declaration = d }))
            local fresh = enter(h, "design")
            test.is_nil(assert(steps.get(h, old)).item.awaiting)
            test.is_true(assert(steps.get(h, fresh)).item.awaiting.can_act)
            local page = assert(h.call("query", { where = { awaiting = true } }))
            test.eq(#page.items, 1); test.eq(page.items[1].id, fresh)
            d.processes[1].states[2].awaiting = { { kind = "user", id = "someone-else" } }
            assert(h.call("apply_schema", { declaration = d }))
            test.is_true(assert(steps.get(h, fresh)).item.awaiting.can_act)
            test.eq(#assert(h.call("query", { where = { awaiting = true } })).items, 1)
        end)

        test.it("keeps pinned field eligibility after the principal field is renamed", function()
            local d = declaration({ field = "owner" })
            local h = fixture.board({ declaration = d })
            local id = enter(h, "design", { owner = { kind = "user", id = h.actor:id() } })
            local schema = assert(h.call("get_schema", {}))
            for _, field in ipairs(schema.compiled.fields) do if field.code == "owner" then d.fields[1].id = field.id end end
            d.fields[1].code = "designer"
            d.item_types[1].fields[1] = "designer"
            d.processes[1].states[2].awaiting.field = "designer"
            d.processes[1].states[3].release_when.approvals.from.field = "designer"
            assert(h.call("apply_schema", { declaration = d }))
            test.is_true(assert(steps.get(h, id)).item.awaiting.can_act)
            local page = assert(h.call("query", { where = { awaiting = true } }))
            test.eq(#page.items, 1); test.eq(page.items[1].id, id)
            d.processes[1].states[2].awaiting = { group = GROUP }
            d.processes[1].states[3].release_when.approvals.from = { group = GROUP }
            d.remove = { fields = { "designer" } }
            table.remove(d.fields :: { Map }, 1)
            table.remove(d.item_types[1].fields :: { string }, 1)
            assert(h.call("apply_schema", { declaration = d }))
            test.is_true(assert(steps.get(h, id)).item.awaiting.can_act)
            test.eq(#assert(h.call("query", { where = { awaiting = true } })).items, 1)
        end)

        test.it("ignores unused historical principal fields in the awaited population", function()
            local d = declaration({ field = "owner" })
            d.processes[1].migration = "follow"
            local h = fixture.board({ declaration = d })
            steps.create(h, "task")
            d.processes[1].states[2].awaiting = { group = GROUP }
            d.processes[1].states[3].release_when.approvals.from = { group = GROUP }
            d.remove = { fields = { "owner" } }
            table.remove(d.fields :: { Map }, 1)
            table.remove(d.item_types[1].fields :: { string }, 1)
            assert(h.call("apply_schema", { declaration = d }))
            test.eq(#assert(h.call("query", { where = { awaiting = true } })).items, 0)
        end)

        test.it("publishes visit identity and awaited principals to state-feed consumers", function()
            for _, source in ipairs({ { group = GROUP }, { { kind = "user", id = "reviewer" } }, { field = "reviewers" } }) do
                local h = fixture.board({ declaration = declaration(source) })
                local id = enter(h, "design", { reviewers = { { kind = "group", id = GROUP }, { kind = "user", id = h.actor:id() } } })
                local item = assert(steps.get(h, id)).item
                local change = assert(h.call("list_changes", {})).items[1]
                test.eq(change.visit, item.visit)
                test.eq(change.process_generation, item.process_generation)
                test.not_nil(change.awaiting.principals)
                local principals = change.awaiting.principals
                if source.group then
                    test.eq(#principals, 1); test.eq(principals[1].kind, "group"); test.eq(principals[1].id, GROUP)
                elseif source.field then
                    test.eq(#principals, 2)
                    test.eq(principals[1].kind, "group"); test.eq(principals[1].id, GROUP)
                    test.eq(principals[2].kind, "user"); test.eq(principals[2].id, h.actor:id())
                else
                    test.eq(#principals, 1); test.eq(principals[1].kind, "user"); test.eq(principals[1].id, "reviewer")
                end
            end
        end)

        test.it("publishes gate approvers and an empty source after a principal field is cleared", function()
            local h = fixture.board({ declaration = declaration({ field = "owner" }) })
            local id = enter(h, "review", { owner = { kind = "group", id = GROUP } })
            local change = assert(h.call("list_changes", {})).items[1]
            test.not_nil(change.awaiting.principals)
            test.eq(#change.awaiting.principals, 1)
            test.eq(change.awaiting.principals[1].kind, "group")
            test.eq(change.awaiting.principals[1].id, GROUP)
            test.eq(change.gate.entered_by.id, h.actor:id())
            steps.one(h, { op = "set", item = id, clear = { "owner" } })
            change = assert(h.call("list_changes", {})).items[1]
            test.not_nil(change.awaiting.principals)
            test.eq(#change.awaiting.principals, 0)
        end)

        test.it("publishes pinned awaited field principals after a field rename", function()
            local d = declaration({ field = "owner" })
            local h = fixture.board({ declaration = d })
            local id = enter(h, "design", { owner = { kind = "user", id = h.actor:id() } })
            local schema = assert(h.call("get_schema", {}))
            for _, field in ipairs(schema.compiled.fields) do if field.code == "owner" then d.fields[1].id = field.id end end
            d.fields[1].code = "designer"
            d.item_types[1].fields[1] = "designer"
            d.processes[1].states[2].awaiting.field = "designer"
            d.processes[1].states[3].release_when.approvals.from.field = "designer"
            assert(h.call("apply_schema", { declaration = d }))
            local change = assert(h.call("list_changes", {})).items[1]
            test.not_nil(change.awaiting.principals)
            test.eq(change.awaiting.principals[1].id, h.actor:id())
            test.eq(change.process_generation, 1)
            test.eq(change.visit, 2)
        end)

        test.it("keeps protected awaited field principals out of reader responses", function()
            local d = declaration({ field = "owner" })
            local h = fixture.board({ bare = true })
            d.key_prefix = h.prefix
            d.fields[1].access = { read = { { user = h.actor:id() } } }
            assert(h.call("apply_schema", { declaration = d }))
            local peer, pid = fixture.user(h, nil, true)
            assert(h.call("grant", { subject_id = pid, mask = 3 }))
            local id = enter(h, "design", { owner = { kind = "user", id = pid } })
            test.not_nil(assert(steps.get(h, id)).item.awaiting.principals)
            test.is_nil(assert(peer("get", { item = { id = id } })).item.awaiting.principals)
            test.is_nil(assert(peer("list_changes", {})).items[1].awaiting.principals)
        end)

        test.it("keeps awaited reads and state feeds within their declared response schemas", function()
            local h = fixture.board({ declaration = declaration({ group = GROUP }) })
            local id = enter(h, "design")
            local entry = assert(registry.get("kickside.work:board"))
            local replies = {
                get = assert(steps.get(h, id)),
                query = assert(h.call("query", { include = { "awaiting" } })),
                list_changes = assert(h.call("list_changes", {})),
            }
            for _, method in ipairs(entry.data.methods) do
                local reply = replies[method.name]
                if reply then
                    local schema = assert(json.decode(method.output_schemas[1].definition))
                    local err = shape.check(shape.tolerant(schema), reply, method.name)
                    test.is_nil(err, steps.detail(err))
                end
            end
        end)

        test.it("validates awaited sources and keeps gate approvers as the only gate spelling", function()
            local h = fixture.board({ bare = true })
            for _, change in ipairs({
                { awaiting = {}, code = "approval_from_required" },
                { awaiting = { field = "missing" }, code = "approval_field_invalid" },
                { awaiting = { field = "level" }, code = "approval_field_invalid" },
                { awaiting = { group = GROUP }, kind = "automated", code = "state_awaiting_kind" },
                { awaiting = { group = GROUP }, kind = "gate", code = "state_awaiting_kind" },
            }) do
                local d = declaration({ group = GROUP }); d.key_prefix = h.prefix
                d.processes[1].states[2].awaiting = change.awaiting
                d.processes[1].states[2].kind = change.kind
                local _, err = h.call("apply_schema", { declaration = d })
                test.not_nil(err); test.eq(err:kind(), errors.INVALID); test.eq(err:details().code, change.code)
            end
        end)
    end)
end
return { run = test.run_cases(define) }
