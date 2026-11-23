-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local actors = require("actors")
local gateway = require("gateway")
local funcs = require("funcs")
local security = require("security")
local uuid = require("uuid")
local json = require("json")
local http_client = require("http_client")
local time = require("time")

type Map = { [string]: unknown }
local PACK = "kickside.work.kanban:pack"
local APP = "kickside.work.kanban:board_app"
local PLANNING = "kickside.work.planning:plugin"
local BOARDS = "/api/v1/work/boards"
local SCOPE = "?ui_app=kickside.work.kanban%3Aboard_app&include_counts=false"
local ISSUE_TYPES = { "epic", "story", "task", "bug", "sub_task" }

local function session(role: string)
    local id = (uuid.v4())
    local group = role == "admin" and "app.security:work_admin" or actors.PLATFORM_MEMBERS
    local actor = role == "admin" and actors.admin(id) or role == "member" and actors.member(id) or actors.outsider(id)
    if role ~= "outsider" then
        assert(funcs.call("kickside.security.binding:materialize_group_set", { groups = { group } }))
    end
    local scope = role == "outsider" and assert(security.new_scope({})) or assert(security.named_scope(group))
    local tokens = assert(security.token_store("kickside.users.security:tokens"))
    local token = assert(tokens:create(actor, scope, { expiration = "10m" }))
    tokens:close()
    local executor = funcs.new():with_actor(actor):with_scope(scope:with(assert(security.policy("app:caller_only"))))
    return {
        id = id,
        http = function(method: string, path: string, input: Map?): (number, Map, string)
            local response, err = http_client.request(method, gateway.url(path), {
                body = input and json.encode(input),
                headers = { Authorization = "Bearer " .. token, ["Content-Type"] = "application/json" },
            })
            assert(response, tostring(err))
            return response.status_code, (json.decode(response.body) or {}) :: Map, response.body
        end,
        call = function(op: string, input: Map, board_id: string?): (unknown, error?)
            return executor:call("app:work_call", { op = op, request = input, board_id = board_id })
        end,
    }
end

local function checked(value: unknown, err: error?): Map
    assert(value, err and (tostring(err) .. " " .. json.encode(err:details() or {})) or "missing result")
    return value :: Map
end

local function ok(status: number, body: Map): Map
    test.eq(status, 200, json.encode(body))
    return body.data :: Map
end

local function draft(title: string): Map
    return { idempotency_key = (uuid.v4()), title = title, pack = PACK, version = "1.0.0", starter = false,
        plugin_configs = { [PLANNING] = { issue_types = ISSUE_TYPES } } }
end

local function apply(owner, board: string, op: Map): Map
    local reply = ok(owner.http("POST", BOARDS .. "/" .. board .. "/apply", { ops = { op }, mode = "atomic" }))
    return reply.outcomes[1] :: Map
end

local function create_item(owner, board: string, issue_type: string, values: Map, parent: string?): string
    local reply = apply(owner, board, { op = "create", type = issue_type, values = values, parent = parent })
    test.eq(reply.status, "applied", json.encode(reply))
    return reply.item :: string
end

local function define()
    test.describe("Kanban over Work", function()
        test.it("discovers only authorized registrations and gives board creation its own capability", function()
            local admin = session("admin")
            local member = session("member")
            local outside = session("outsider")
            local catalog = ok(admin.http("GET", "/api/v1/work/packs"))
            test.eq(catalog.can_create_board, true)
            test.eq(ok(member.http("GET", "/api/v1/work/packs")).can_create_board, false)
            local pack
            for _, entry in ipairs(catalog.packs) do if entry.id == PACK then pack = entry end end
            test.eq(assert(pack).version, "1.0.0")
            test.is_nil(pack.problem)
            local app = checked(member.call("registry_get", { id = APP }))
            test.eq(app.meta.page, "/work-kanban/board")
            test.eq(#app.meta.packs, 1)
            test.eq(app.meta.packs[1], PACK)
            test.is_nil(outside.call("registry_get", { id = APP }))
            test.eq(member.http("POST", BOARDS, draft("Denied")), 403)
        end)

        test.it("creates an empty board by replay-safe request and discovers it by exact UI app and ACL", function()
            local admin = session("admin")
            local member = session("member")
            local request = draft("Delivery")
            local first = ok(admin.http("POST", BOARDS, request))
            local board = first.board_id :: string
            local replay = ok(admin.http("POST", BOARDS, request))
            test.eq(replay.board_id, board)
            test.eq(replay.replayed, true)
            local second = ok(admin.http("POST", BOARDS, draft("Operations"))).board_id :: string
            local first_page = ok(admin.http("GET", BOARDS .. SCOPE .. "&limit=1"))
            test.eq(#first_page.boards, 1)
            test.not_nil(first_page.next)
            test.eq(first_page.boards[1].ui_app, APP)
            test.is_nil(first_page.boards[1].item_count)
            local next_page = ok(admin.http("GET", BOARDS .. SCOPE .. "&limit=1&after=" .. first_page.next))
            test.eq(#next_page.boards, 1)
            test.is_true(next_page.boards[1].board_id ~= first_page.boards[1].board_id)
            local before = ok(member.http("GET", BOARDS .. SCOPE))
            test.eq(#before.boards, 0)
            checked(admin.call("grant", { subject_id = member.id, mask = 1 }, board))
            local reader = ok(member.http("GET", BOARDS .. SCOPE)).boards
            test.eq(#reader, 1)
            test.eq(reader[1].board_id, board)
            test.eq(reader[1].access.write, false)
            test.eq(member.http("POST", BOARDS .. "/" .. second .. "/get_schema", {}), 403)
            local schema = ok(member.http("POST", BOARDS .. "/" .. board .. "/get_schema", { include_extensions = true }))
            test.eq(schema.pack.id, PACK)
            test.eq(#schema.extensions, 1)
            test.eq(schema.extensions[1].id, "test.kanban:search_panel")
            local view_page = ok(member.http("POST", BOARDS .. "/" .. board .. "/list_views", {}))
            test.eq(#view_page.views, 4)
            local result = ok(member.http("POST", BOARDS .. "/" .. board .. "/query", {}))
            test.eq(#result.items, 0)
            local summary
            for _, field in ipairs(schema.compiled.fields) do if field.code == "title" then summary = field end end
            test.eq(assert(summary).index, "none")
            test.eq(summary.track, true)
        end)

        test.it("runs grouped Work queries and preserves the prepared sprint close contract", function()
            local owner = session("admin")
            local board = ok(owner.http("POST", BOARDS, draft("Sprints"))).board_id :: string
            local invalid_sprint = create_item(owner, board, "sprint", {
                name = "Invalid dates", planning_start = "2026-11-23", planning_end = "2026-11-10",
            })
            local refused = apply(owner, board, { op = "transition", item = invalid_sprint, transition = "start" })
            test.eq(refused.findings[1].code, "planning_dates_out_of_order")
            local sprint = create_item(owner, board, "sprint", {
                name = "Sprint A", planning_start = "2026-11-10", planning_end = "2026-11-23",
            })
            local next_sprint = create_item(owner, board, "sprint", { name = "Sprint B" })
            test.eq(apply(owner, board, { op = "transition", item = sprint, transition = "start" }).status, "applied")
            local epic = create_item(owner, board, "epic", { title = "Delivery Epic" })
            local task = create_item(owner, board, "task", {
                title = "Kanban Alpha task", current_sprint = { board = board, item = sprint },
            }, epic)
            local bug = create_item(owner, board, "bug", { title = "Kanban Beta bug" }, epic)
            local preview = checked(owner.call("plan_close", { sprint_id = sprint, rollover_id = next_sprint }, board))
            test.eq(#preview.snapshot.members, 1)
            test.eq(preview.snapshot.members[1].item_id, task)
            local denied = apply(owner, board, { op = "transition", item = sprint, transition = "close" })
            test.eq(denied.status, "denied")
            test.eq(denied.findings[1].code, "transition_command_required")
            test.eq(apply(owner, board, { op = "set", item = task, values = { story_points = 3 } }).status, "applied")
            local _, stale = owner.call("close", { snapshot = preview.snapshot, token = preview.token, key = (uuid.v4()) }, board)
            test.eq(assert(stale):details().code, "planning_snapshot_stale")
            preview = checked(owner.call("plan_close", { sprint_id = sprint, rollover_id = next_sprint }, board))
            local closed = checked(owner.call("close", {
                snapshot = preview.snapshot, token = preview.token, key = (uuid.v4()),
            }, board))
            test.eq(closed.applied, true)
            local item = ok(owner.http("POST", BOARDS .. "/" .. board .. "/get", { item = { id = task } }))
            test.eq(item.item.values.current_sprint.item, next_sprint)
            local query_path = BOARDS .. "/" .. board .. "/query"
            local page = ok(owner.http("POST", query_path, {
                where = { field = "type", op = "in", value = { "task", "bug" } },
                group_by = "state", order = { { field = "rank" } }, limit = 1,
            }))
            test.eq(page.groups[1].value, "todo")
            test.eq(page.groups[1].count, 2)
            test.eq(#page.groups[1].items, 1)
            test.not_nil(page.groups[1].after)
            local search
            for attempt = 1, 100 do
                local status, reply = owner.http("POST", query_path, { where = { match = "Kanban" }, limit = 1 })
                if status == 200 then
                    search = reply.data
                    break
                end
                test.eq(reply.details.code, "search_indexing")
                time.sleep("100ms")
            end
            assert(search, "Work Search did not reach readiness")
            test.not_nil(search.after)
            local second = ok(owner.http("POST", query_path, { where = { match = "Kanban" }, limit = 1, after = search.after }))
            local ids = { [search.items[1].id] = true, [second.items[1].id] = true }
            test.is_true(ids[task])
            test.is_true(ids[bug])

            local path = BOARDS .. "/" .. board
            local schema = ok(owner.http("POST", path .. "/get_schema", { include_extensions = true }))
            test.eq(schema.extensions[1].id, "test.kanban:search_panel")
            ok(owner.http("POST", path .. "/apply_schema", {
                expected_generation = schema.generation,
                declaration = { scopes = {}, plugins = { { use = PLANNING } } },
            }))
            local deactivated = ok(owner.http("POST", path .. "/get_schema", { include_extensions = true }))
            test.eq(#deactivated.extensions, 0)
            local views = ok(owner.http("POST", path .. "/list_views", {})).views
            for _, view in ipairs(views) do
                if view.title == "Board" or view.title == "Backlog" then
                    local available = ok(owner.http("POST", "/api/v1/work/views/" .. view.view_id .. "/run", { limit = 1 }))
                    test.not_nil(available.items[1])
                end
            end
        end)

        test.it("admits only readable items into counts, cursor pages and linked endpoints", function()
            local owner, reader = session("admin"), session("member")
            local board = ok(owner.http("POST", BOARDS, draft("Access controls"))).board_id :: string
            local path = BOARDS .. "/" .. board
            local schema = ok(owner.http("POST", path .. "/get_schema", {}))
            local epic
            for _, kind in ipairs(schema.declaration.item_types) do if kind.id == "epic" then epic = kind end end
            assert(epic)
            epic.fields[#epic.fields + 1] = "level"
            epic.fields[#epic.fields + 1] = "operator_note"
            ok(owner.http("POST", path .. "/apply_schema", {
                expected_generation = schema.generation,
                declaration = {
                    fields = {
                        { code = "level", form = "text", index = "key" },
                        { code = "operator_note", form = "text", access = { read = { { user = owner.id } } } },
                    },
                    item_types = { epic },
                    visibility = { field = "level", bypass = "admin", levels = {
                        { id = "private", holders = { { user = owner.id } } },
                    } },
                },
            }))
            checked(owner.call("grant", { subject_id = reader.id, mask = 1 }, board))
            local visible = create_item(owner, board, "epic", { title = "First", operator_note = "Operator context" })
            local hidden = create_item(owner, board, "epic", { title = "Private", level = "private" })
            local other = create_item(owner, board, "epic", { title = "Last" })
            local linked = apply(owner, board, { op = "link", item = visible, type = "relates", target = { board = board, item = hidden } })
            test.eq(linked.status, "applied")
            local denied = apply(owner, board, { op = "transition", item = other, transition = "block" })
            test.eq(denied.findings[1].code, "when_failed")
            local first = ok(reader.http("POST", path .. "/query", { group_by = "state", limit = 1, order = { { field = "rank" } } }))
            test.eq(first.groups[1].count, 2)
            test.eq(first.items[1].id, visible)
            test.is_nil(first.items[1].values.operator_note)
            local last = ok(reader.http("POST", path .. "/query", { limit = 1, order = { { field = "rank" } }, after = first.after }))
            test.eq(last.items[1].id, other)
            test.is_nil(last.after)
            local included = ok(reader.http("POST", path .. "/get", { item = { id = visible }, include = { "links" } }))
            test.is_nil(included.item.values.operator_note)
            test.eq(included.links[1].unavailable, true)
            test.is_nil(included.links[1].item)
        end)
    end)
end

return { run = test.run_cases(define) }
