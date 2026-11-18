-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Sessions holding exactly the scope an installation composes for a role: a
-- platform member or a user outside every group. A session reaches the board
-- contract through the harness caller and the HTTP endpoints through a bearer
-- token, the way the pages do.
local security = require("security")
local contract = require("contract")
local execution_identity = require("execution_identity")
local funcs = require("funcs")
local uuid = require("uuid")
local json = require("json")
local http_client = require("http_client")
local actors = require("actors")
local test = require("test")
local time = require("time")

local M = {}

M.API = "http://127.0.0.1:19241/api/v1"

type Json = { [string]: unknown }
type Reply = { status: number, body: Json }
type Session = {
    id: string,
    actor: security.Actor,
    call: (string, unknown, string?) -> (unknown, error?),
    get: (string) -> Reply,
    post: (string, unknown) -> Reply,
    post_raw: (string, string) -> Reply,
    allows: (string, string) -> boolean,
}
M.Session = Session
M.Reply = Reply

-- get sends one GET to the harness API with the given bearer token, or none.
function M.get(path: string, token: string?): Reply
    local headers: { [string]: string } = { ["Content-Type"] = "application/json" }
    if token then headers.Authorization = "Bearer " .. token end
    local res, err = http_client.request("GET", M.API .. path, { headers = headers })
    assert(not err and res, tostring(err))
    local decoded: unknown = res.body ~= "" and json.decode(res.body) or {}
    return { status = res.status_code, body = decoded :: Json }
end

local function open(actor: security.Actor, scope: security.Scope): Session
    local caller = assert(security.policy("app:caller_only"))
    local executor = funcs.new():with_actor(actor):with_scope(scope:with(caller))
    local tokens = assert(security.token_store("kickside.users.security:tokens"))
    local token = assert(tokens:create(actor, scope, { expiration = "1h" }))
    local restored_actor, restored_scope = tokens:validate(token)
    assert(restored_actor and restored_scope, "stored session validates")
    assert(restored_scope:evaluate(actor, "access", "kickside.work.admin.api:options.endpoint") == scope:evaluate(actor, "access", "kickside.work.admin.api:options.endpoint"), "stored session preserves module capability")
    tokens:close()
    local function post_raw(path: string, body: string): Reply
        local res, err = http_client.request("POST", M.API .. path, { headers = { ["Content-Type"] = "application/json", Authorization = "Bearer " .. token }, body = body })
        assert(not err and res, tostring(err))
        return { status = res.status_code, body = json.decode(res.body) :: Json }
    end
    return {
        id = actor:id(), actor = actor,
        allows = function(action: string, resource: string): boolean return scope:evaluate(actor, action, resource) == "allow" end,
        call = function(op: string, request: unknown, board_id: string?): (unknown, error?)
            return executor:call("app:work_call", { op = op, board_id = board_id, request = request })
        end,
        get = function(path: string): Reply return M.get(path, token) end,
        post = function(path: string, body: unknown): Reply return post_raw(path, json.encode(body)) end,
        post_raw = post_raw,
    }
end

-- members resolves the persisted user's live installation scope through Users.
local function members(actor: security.Actor): security.Scope
    local definition = assert(contract.get("kickside.contract:scope_resolver"))
    local bound, bind_err = definition:with_actor(actor)
    assert(not bind_err and bound, tostring(bind_err))
    local scoped, scope_bind_err = bound:with_scope(security.scope())
    assert(not scope_bind_err and scoped, tostring(scope_bind_err))
    local resolver, open_err = scoped:open("kickside.users:scope_resolver_binding")
    assert(not open_err and resolver, tostring(open_err))
    local result, err = resolver:resolve({ principal = { kind = "user", id = actor:id() } })
    assert(not err and result, tostring(err))
    local params = result :: Json
    -- Users may return explicit policies without named scope groups.
    local scope, scope_err = execution_identity.scope_from_groups(params.scope_groups or {}, params.scope_policy_ids)
    assert(not scope_err and scope, tostring(scope_err))
    return scope :: security.Scope
end

function M.admin(): Session
    local actor = actors.admin((uuid.v4()))
    local session = open(actor, members(actor))
    -- Core provisions the registry asynchronously after migrations.
    local deadline = time.now():add(5 * time.SECOND)
    repeat
        local version, err = session.call("prefix_registry_ready", {})
        if version ~= nil then return session end
        if not err or (err:details() or {}).code ~= "registry_denied" then error(err or "prefix registry returned no version") end
        time.sleep("50ms")
    until time.now():unix_nano() >= deadline:unix_nano()
    error("Work prefix registry was not provisioned")
end

function M.member(work_tools: boolean?): Session
    local actor = actors.member((uuid.v4()), work_tools)
    return open(actor, members(actor))
end

-- outsider is a user outside every module group.
function M.outsider(): Session
    local actor = actors.outsider((uuid.v4()))
    return open(actor, members(actor))
end

-- scope_probe reports the member capability through the public installation boundary.
function M.scope_probe(): boolean
    local actor = assert(security.actor())
    local scope = members(actor)
    return scope:evaluate(actor, "access", "kickside.work.admin.api:options.endpoint") == "allow"
end

local function define_scope_tests()
    test.describe("installation scope resolution", function()
        test.it("resolves member capability with public identity authority only", function()
            local actor = actors.member((uuid.v4()))
            local policy = assert(security.policy("app:public_identity_only"))
            local executor = funcs.new():with_actor(actor):with_scope(assert(security.new_scope({ policy, assert(security.policy("app:public_identity_methods")) })))
            local allowed, err = executor:call("app:member_scope_probe")
            test.is_nil(err, tostring(err))
            test.eq(allowed, true)
        end)
    end)
end

M.run = test.run_cases(define_scope_tests)

return M
