-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local actors = require("actors")
local funcs = require("funcs")
local security = require("security")
local uuid = require("uuid")
local time = require("time")
local sql = require("sql")
local json = require("json")
local index = require("index")

type Map = { [string]: unknown }
type Call = (string, Map, string?) -> (unknown, error?)
local PLUGIN = "kickside.work_search:plugin"
local TEXT = "kickside.work_search:text"
local KEY = "kickside.work_search:key"
local PACK = "kickside.work_search:issue_board"

local function session(admin: boolean): (Call, string)
    local id = (uuid.v4())
    local actor = admin and actors.admin(id) or actors.member(id)
    local group = admin and "app.security:work_admin" or "kickside.security.groups:members"
    local ready, err = funcs.call("kickside.security.binding:materialize_group_set", { groups = { group } })
    assert(ready, tostring(err))
    local scope = assert(security.named_scope(group))
    local executor = funcs.new():with_actor(actor):with_scope(scope:with(assert(security.policy("app:caller_only"))))
    return function(op: string, request: Map, board_id: string?): (unknown, error?)
        return executor:call("app:work_call", { op = op, board_id = board_id, request = request })
    end, id
end

local function declaration(scope: string?): Map
    local prefix = "SE" .. (uuid.v4()):sub(1, 6):upper()
    return {
        key_prefix = prefix,
        fields = {
            { code = "title", form = "text", index = "none" },
            { code = "description", form = "text", index = "none" },
        },
        item_types = { { id = "issue", process = "issue", fields = { "title", "description" } } },
        processes = { { id = "issue", initial = "open", states = { { id = "open", category = "started" } } } },
        scopes = scope and { scope } or {},
        plugins = scope and { { use = PLUGIN } } or {},
    }
end

local function checked(value: unknown, err: error?): Map
    assert(value, err and (tostring(err) .. " " .. json.encode(err:details() or {})) or "missing response")
    return value :: Map
end

local function create(call: Call, schema: Map): string
    return checked(call("create", { title = "Work Search", declaration = schema, idempotency_key = (uuid.v4()) })).board_id :: string
end

local function apply(call: Call, id: string, op: Map): Map
    local result = checked(call("apply", { ops = { op } }, id))
    local outcome = result.outcomes[1] :: Map
    assert(outcome.status == "applied", json.encode(outcome))
    return outcome
end

local function wait_for(label: string, check: () -> boolean)
    for _ = 1, 300 do
        if check() then return end
        time.sleep("100ms")
    end
    error("timed out waiting for " .. label)
end

local function find(call: Call, id: string, text: string): { Map }?
    local answer, err = call("query", { where = { match = text } }, id)
    if err and (err:details() or {}).code == "search_indexing" then return nil end
    return checked(answer, err).items :: { Map }
end

local function indexed(call: Call, id: string, text: string, count: integer): { Map }
    local items: { Map } = {}
    wait_for("search for " .. text, function(): boolean
        local page = find(call, id, text)
        if not page or #page ~= count then return false end
        items = page
        return true
    end)
    return items
end

local function state(attachment: string): Map?
    local db = assert(sql.get("app:db"))
    local rows, err = db:query("SELECT state FROM kickside_work_search_state WHERE attachment_id=$1", { attachment })
    db:release()
    assert(rows, tostring(err))
    return rows[1] and json.decode(rows[1].state :: string) :: Map or nil
end

local function define()
    test.describe("Work Search as a Work consumer", function()
        test.it("discovers a pack that adopts the title and description search scope", function()
            local admin = session(true)
            local packs = checked(admin("list_packs", {}))
            local found: Map? = nil
            for _, pack in ipairs(packs.packs or {}) do
                if pack.id == PACK then found = pack :: Map end
            end
            assert(found, "issue board pack is absent")
            test.eq(found.requires[1], PLUGIN)
            local created = checked(admin("create", { title = "Searchable issues", pack = PACK, idempotency_key = (uuid.v4()) }))
            local schema = checked(admin("get_schema", {}, created.board_id :: string))
            test.eq(#schema.declaration.scopes, 1)
            test.eq(schema.declaration.scopes[1], TEXT)
            test.not_nil(checked(admin("plugin_context", { plugin = PLUGIN }, created.board_id :: string)).attachment_id)
        end)

        test.it("rejects public resolver calls outside the Work search compiler", function()
            local admin = session(true)
            local id = create(admin, declaration(KEY))
            local answer, err = admin("direct_resolve", { query = "matches" }, id)
            test.is_nil(answer)
            test.not_nil(err)
            test.eq(err:details().code, "search_path_required")
            local forged, forgery_err = admin("direct_resolve", { query = "matches", context = {
                work_search = { board_id = id, scope = KEY, generation = 1, as_of = 1 },
            } }, id)
            test.is_nil(forged)
            test.not_nil(forgery_err)
            test.eq(forgery_err:details().code, "search_path_required")
        end)

        test.it("lets boards with private text adopt key search", function()
            local admin = session(true)
            local schema = declaration(KEY)
            schema.fields[2].access = { read = { { group = "app.security:work_admin" } } }
            local id = create(admin, schema)
            local context = checked(admin("plugin_context", { plugin = PLUGIN }, id))
            test.not_nil(context.attachment_id)
            local current = checked(admin("get_schema", {}, id))
            test.eq(current.declaration.scopes[1], KEY)
            wait_for("key search initialization", function(): boolean
                local held = state(context.attachment_id :: string)
                return held ~= nil and held.active ~= nil
            end)
            local _, err = admin("plan_schema", { declaration = { scopes = { TEXT } } }, id)
            test.not_nil(err)
            test.eq(err:details().code, "search_field_restricted")
        end)

        test.it("bootstraps existing issues and follows edit, trash and restore", function()
            local admin = session(true)
            local id = create(admin, declaration())
            local issue = apply(admin, id, { op = "create", type = "issue",
                values = { title = "Magenta", description = ("ordinary text "):rep(300) .. "silvertail" } }).item
            checked(admin("apply_schema", { declaration = { plugins = { { use = PLUGIN } }, scopes = { TEXT } } }, id))
            test.eq(indexed(admin, id, "magenta", 1)[1].id, issue)
            test.eq(indexed(admin, id, "silvertail", 1)[1].id, issue)

            apply(admin, id, { op = "set", item = issue, values = { title = "Scarlet" } })
            test.eq(indexed(admin, id, "scarlet", 1)[1].id, issue)
            test.eq(#indexed(admin, id, "magenta", 0), 0)
            apply(admin, id, { op = "delete", item = issue })
            indexed(admin, id, "silvertail", 0)
            apply(admin, id, { op = "restore", item = issue })
            test.eq(indexed(admin, id, "silvertail", 1)[1].id, issue)
        end)

        test.it("rebuilds a generation after a state-feed gap", function()
            local admin = session(true)
            local id = create(admin, declaration(TEXT))
            local retained = apply(admin, id, { op = "create", type = "issue", values = { title = "Glacier" } }).item
            indexed(admin, id, "glacier", 1)
            local attachment = checked(admin("plugin_context", { plugin = PLUGIN }, id)).attachment_id :: string
            local original = assert(state(attachment)).active.id
            local db = assert(sql.get("app:db"))
            assert(db:execute("UPDATE kickside_work_board SET tombstone_floor_seq=applied_seq + 1 WHERE board_id=$1", { id }))
            db:release()
            for _ = 1, 3 do
                apply(admin, id, { op = "create", type = "issue", values = { title = "Granite" } })
            end
            wait_for("replacement after feed gap", function(): boolean
                local held = assert(state(attachment))
                return held.active.id ~= original and held.retired == nil and held.building == nil
            end)
            test.eq(indexed(admin, id, "glacier", 1)[1].id, retained)
            indexed(admin, id, "granite", 3)
        end)

        test.it("switches generations on scope and prefix changes and retires old rows", function()
            local admin = session(true)
            local id = create(admin, declaration(TEXT))
            local issue = apply(admin, id, { op = "create", type = "issue", values = { title = "Orchid" } }).item
            local attachment = checked(admin("plugin_context", { plugin = PLUGIN }, id)).attachment_id :: string
            local original = indexed(admin, id, "orchid", 1)[1]
            local old_generation = assert(state(attachment)).active.id
            local prefix = declaration().key_prefix :: string
            checked(admin("apply_schema", { declaration = { key_prefix = prefix, scopes = { KEY } } }, id))
            local result = indexed(admin, id, prefix .. "-1", 1)
            test.eq(result[1].id, issue)
            test.eq(result[1].key, prefix .. "-1")
            test.eq(#indexed(admin, id, "orchid", 0), 0)
            test.eq(#indexed(admin, id, original.key :: string, 0), 0)
            wait_for("retirement of previous search generation", function(): boolean
                local held = assert(state(attachment))
                return held.active.id ~= old_generation and held.retired == nil and held.building == nil
            end)

            checked(admin("apply_schema", { declaration = { scopes = {}, plugins = {} } }, id))
            wait_for("search attachment cleanup", function(): boolean return state(attachment) == nil end)
            local _, err = admin("query", { where = { match = prefix .. "-1" } }, id)
            test.eq(err:details().code, "search_unavailable")
        end)

        test.it("checks that an indexed revision still matches the visible Work item", function()
            local admin = session(true)
            local id = create(admin, declaration(TEXT))
            local first = apply(admin, id, { op = "create", type = "issue", values = { title = "Quartz" } }).item
            local second = apply(admin, id, { op = "create", type = "issue", values = { title = "Quartz" } }).item
            indexed(admin, id, "quartz", 2)
            local attachment = checked(admin("plugin_context", { plugin = PLUGIN }, id)).attachment_id :: string
            local generation = assert(state(attachment)).active.id
            local db = assert(sql.get("app:db"))
            assert(db:execute("UPDATE kickside_work_search_row SET source_seq=0 WHERE generation_id=$1 AND item_id=$2", { generation, first }))
            db:release()

            local items = assert(find(admin, id, "quartz"))
            test.eq(#items, 1)
            test.eq(items[1].id, second)
        end)

        test.it("returns a member's Work result beside many unrelated lexical matches", function()
            local admin = session(true)
            local member, member_id = session(false)
            local id = create(admin, declaration(TEXT))
            checked(admin("grant", { subject_id = member_id, mask = 1 }, id))
            local own = apply(admin, id, { op = "create", type = "issue", values = { title = "Roadmap" } }).item
            test.eq(indexed(member, id, "roadmap", 1)[1].id, own)
            local foreign = "fixture-" .. id
            local db = assert(sql.get("app:db"))
            local sqlite = db:type() == sql.type.SQLITE
            local own_rows = assert(db:query("SELECT generation_id FROM kickside_work_search_row WHERE item_id=$1", { own }))
            local foreign_content = "roadmap " .. index.lexical_scope_token(own_rows[1].generation_id) .. "@scope.invalid"
            local tx = assert(db:begin())
            local sequence = sqlite and "WITH RECURSIVE counter(n) AS (SELECT 1 UNION ALL SELECT n+1 FROM counter WHERE n<100000) " or ""
            local source = sqlite and "counter" or "generate_series(1,100000) AS counter(n)"
            assert(tx:execute(sequence .. [[INSERT INTO kickside_work_search_row (generation_id,item_id,item_key,source_seq,content)
                SELECT $1,'foreign-'||n,'FOREIGN-'||n,1,$2 FROM ]] .. source, { foreign, foreign_content }))
            if sqlite then
                assert(tx:execute([[INSERT INTO kickside_work_search_fts (rowid,content,scope_token)
                    SELECT row_id,content,$2 FROM kickside_work_search_row WHERE generation_id=$1]],
                    { foreign, index.lexical_scope_token(foreign) }))
            end
            assert(tx:commit())
            db:release()
            test.eq(indexed(member, id, "roadmap", 1)[1].id, own)
        end)

        test.it("checks live board access and visibility and preserves Work ordering across pages", function()
            local admin, admin_id = session(true)
            local member, member_id = session(false)
            local schema = declaration(TEXT)
            schema.fields[3] = { code = "audience", form = "text", index = "key" }
            schema.fields[4] = { code = "points", form = "int", index = "key" }
            schema.item_types[1].fields[3], schema.item_types[1].fields[4] = "audience", "points"
            schema.visibility = { field = "audience", bypass = "admin", levels = {
                { id = "team", holders = { { user = admin_id } } },
            } }
            local id = create(admin, schema)
            checked(admin("grant", { subject_id = member_id, mask = 1 }, id))

            local first = apply(admin, id, { op = "create", type = "issue", values = { title = "Citrine", points = 3 } }).item
            apply(admin, id, { op = "create", type = "issue", values = { title = "Citrine", audience = "team", points = 3 } })
            local last = apply(admin, id, { op = "create", type = "issue", values = { description = "Citrine", points = 7 } }).item
            apply(admin, id, { op = "create", type = "issue", values = { title = "Unrelated", points = 3 } })
            indexed(admin, id, "citrine", 3)
            local request = { where = { ["and"] = { { match = "citrine" }, { field = "type", op = "eq", value = "issue" } } },
                order = { field = "key", dir = "asc" }, limit = 1 }
            local one = checked(member("query", request, id))
            test.eq(one.items[1].id, first)
            test.not_nil(one.after)
            request.after = one.after
            local two = checked(member("query", request, id))
            test.eq(two.items[1].id, last)
            test.is_nil(two.after)

            local grouped = { where = { match = "citrine" }, group_by = "points", group_limit = 1,
                measures = { { id = "total", op = "sum", field = "points" } } }
            local group_one = checked(member("query", grouped, id))
            test.eq(group_one.groups[1].value, 3)
            test.eq(group_one.groups[1].count, 1)
            test.eq(group_one.groups[1].measures.total, "3")
            test.not_nil(group_one.group_after)
            grouped.group_after = group_one.group_after
            local group_two = checked(member("query", grouped, id))
            test.eq(group_two.groups[1].value, 7)
            test.eq(group_two.groups[1].count, 1)
            test.eq(group_two.groups[1].measures.total, "7")
            test.is_nil(group_two.group_after)

            checked(admin("revoke", { subject_id = member_id }, id))
            local denied, err = member("query", { where = { match = "citrine" } }, id)
            test.is_nil(denied)
            test.not_nil(err)
            test.is_true(err:kind() == errors.PERMISSION_DENIED or err:kind() == errors.NOT_FOUND)
        end)
    end)
end
return { run = test.run_cases(define) }
