-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local actors = require("actors")
local funcs = require("funcs")
local security = require("security")
local uuid = require("uuid")
local time = require("time")
local sql = require("sql")
local json = require("json")

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

    end)
end
return { run = test.run_cases(define) }
