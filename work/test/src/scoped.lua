-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Sessions that hold exactly the scope an installation composes for a role: the Member group's
-- composed policies, the same plus the work administration policy, or no module policy at all.
-- A session reaches the board contract through the harness caller and the HTTP endpoints through a bearer token.
local security = require("security")
local funcs = require("funcs")
local uuid = require("uuid")
local json = require("json")
local http_client = require("http_client")
local actors = require("actors")
local fixture = require("fixture")

local M = {}

local BASE = "http://127.0.0.1:19239/api/work/boards"

type Json = { [string]: unknown }
type Reply = { status: number, body: Json }
type Session = {
    id: string,
    actor: security.Actor,
    scope: security.Scope,
    call: (string, unknown, string?) -> (unknown, error?),
    http: (string, string, Json?) -> Reply,
    http_raw: (string, string, string) -> Reply,
    route: (string, string) -> string,
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
        local res, err = http_client.request(method, path:sub(1, 5) == "/api/" and ("http://127.0.0.1:19239" .. path) or (BASE .. path), {
            body = body,
            headers = { ["Content-Type"] = "application/json", Authorization = "Bearer " .. token },
        })
        assert(not err and res, tostring(err))
        local decoded = res.body ~= "" and json.decode(res.body) or {}
        return { status = res.status_code, body = decoded :: Json }
    end
    return {
        id = actor:id(), actor = actor, scope = scope,
        call = function(op: string, request: unknown, board_id: string?): (unknown, error?)
            return executor:call("app:work_call", { op = op, board_id = board_id, request = request })
        end,
        http = function(method: string, path: string, body: Json?): Reply
            return request(method, path, json.encode(body or {}))
        end,
        http_raw = request,
        route = function(board_id: string, method: string): string
            return "/" .. board_id .. "/" .. method
        end,
    }
end

-- board creates a board through the contract as the session and returns a handle whose calls run as the session.
-- The first schema is the given declaration, the reference declaration when omitted.
function M.board(session: Session, declaration: Json?): fixture.Handle
    local prefix = fixture.fresh_prefix()
    local first = declaration or fixture.declaration(prefix)
    if declaration then prefix = declaration.key_prefix :: string end
    local created, err = session.call("create", { idempotency_key = (uuid.v4()), title = "Scoped board", declaration = first })
    assert(not err, tostring(err))
    local board_id = (created :: Json).board_id :: string
    return {
        id = board_id, prefix = prefix, actor = session.actor, executor = session,
        call = function(op: string, request: unknown): (unknown, error?) return session.call(op, request, board_id) end,
    }
end

function M.initialize()
    for _, groups in ipairs({ { actors.PLATFORM_MEMBERS }, { actors.PLATFORM_MEMBERS, actors.ADMIN_GROUP } }) do
        local result, err = funcs.call("kickside.security.binding:materialize_group_set", { groups = groups })
        assert(result and not err, tostring(err))
    end
end

-- member is a user of the platform Members group.
function M.member(): Session
    M.initialize()
    local actor = actors.real((uuid.v4()), false)
    return open(actor, assert(security.named_scope(actors.PLATFORM_MEMBERS)))
end

-- admin is a user of the Members group and the work administration group.
function M.admin(): Session
    M.initialize()
    local actor = actors.real((uuid.v4()), true)
    return open(actor, assert(security.named_scope(actors.ADMIN_GROUP)))
end

-- outsider is a user outside every module group.
function M.outsider(): Session
    local actor = actors.outsider((uuid.v4()))
    return open(actor, assert(security.new_scope({})))
end

return M
