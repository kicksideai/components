-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local actors = require("actors")
local funcs = require("funcs")
local security = require("security")
local uuid = require("uuid")
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
            local _, err = admin("plan_schema", { declaration = { scopes = { TEXT } } }, id)
            test.not_nil(err)
            test.eq(err:details().code, "search_field_restricted")
        end)

    end)
end
return { run = test.run_cases(define) }
