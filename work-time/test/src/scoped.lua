-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Sessions that hold exactly the scope an installation composes for a role: the Member group's
-- composed policies, or the same plus the work administration policy.
-- A session reaches the board contract through the harness caller and the HTTP endpoints through a bearer token.
local security = require("security")
local funcs = require("funcs")
local uuid = require("uuid")
local json = require("json")
local http_client = require("http_client")
local gateway = require("gateway")
local actors = require("actors")
local fixture = require("fixture")

local M = {}

local BOARD_PATH = "/api/work/boards"

type Json = { [string]: unknown }
type Reply = { status: number, body: Json, raw: string }
type Session = {
    id: string,
    actor: security.Actor,
    scope: security.Scope,
    call: (string, unknown, string?) -> (unknown, error?),
    http: (string, string, Json?) -> Reply,
}
M.Session = Session
M.Reply = Reply

local function open(actor: security.Actor, scope: security.Scope): Session
    local caller = assert(security.policy("app:caller_only"))
    local executor = funcs.new():with_actor(actor):with_scope(scope:with(caller))
    local tokens = assert(security.token_store("kickside.users.security:tokens"))
    local token = assert(tokens:create(actor, scope, { expiration = "1h" }))
    tokens:close()
    local function request(method: string, path: string, body: string): Reply
        local api_path = path:sub(1, 5) == "/api/" and path or BOARD_PATH .. path
        local res, err = http_client.request(method, gateway.url(api_path), {
            body = body,
            headers = { ["Content-Type"] = "application/json", Authorization = "Bearer " .. token },
        })
        assert(not err and res, tostring(err))
        local raw = res.body or ""
        local decoded = raw ~= "" and json.decode(raw) or {}
        return { status = res.status_code, body = decoded :: Json, raw = raw }
    end
    return {
        id = actor:id(), actor = actor, scope = scope,
        call = function(op: string, request: unknown, board_id: string?): (unknown, error?)
            return executor:call("app:work_call", { op = op, board_id = board_id, request = request })
        end,
        http = function(method: string, path: string, body: Json?): Reply
            return request(method, path, json.encode(body or {}))
        end,
    }
end

-- board creates a board through the contract as the session and returns a handle whose calls run as the session.
-- The first schema is the given declaration, the reference declaration when omitted.
function M.board(session: Session, declaration: Json?, pack: string?): fixture.Handle
    local prefix = fixture.fresh_prefix()
    local first = declaration or fixture.declaration(prefix)
    if declaration then prefix = declaration.key_prefix :: string end
    local created, err = session.call("create", { idempotency_key = (uuid.v4()), title = "Scoped board",
        declaration = first, pack = pack })
    assert(not err, tostring(err))
    local board_id = (created :: Json).board_id :: string
    return {
        id = board_id, prefix = prefix,
        call = function(op: string, request: unknown): (unknown, error?) return session.call(op, request, board_id) end,
    }
end

local function initialize()
    for _, groups in ipairs({ { actors.PLATFORM_MEMBERS }, { actors.PLATFORM_MEMBERS, actors.ADMIN_GROUP } }) do
        local result, err = funcs.call("kickside.security.binding:materialize_group_set", { groups = groups })
        assert(result and not err, tostring(err))
    end
end

-- member is a user of the platform Members group.
function M.member(): Session
    initialize()
    local actor = actors.real((uuid.v4()), false)
    return open(actor, assert(security.named_scope(actors.PLATFORM_MEMBERS)))
end

-- admin is a user of the Members group and the work administration group.
function M.admin(): Session
    initialize()
    local actor = actors.real((uuid.v4()), true)
    local scope = assert(security.named_scope(actors.ADMIN_GROUP))
    return open(actor, scope)
end

return M
