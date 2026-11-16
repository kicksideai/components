-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local registry = require("registry")
-- Sessions that hold exactly the scope an installation composes for a role: the
-- Members group's composed policies, or only the signed-in baseline. A session
-- reaches the catalog contract through the harness caller and the HTTP
-- endpoints through a bearer token.
local security = require("security")
local funcs = require("funcs")
local uuid = require("uuid")
local json = require("json")
local http_client = require("http_client")
local actors = require("actors")
local fixture = require("fixture")
local access_cases = require("access_cases")
local member_scope = require("member_scope")

local M = {}

function M.api_url(): string
    return "http://127.0.0.1" .. assert(registry.get("app:gateway")).data.addr .. "/api"
end
function M.base_url(): string return M.api_url() .. "/pim/catalogs" end

type Json = { [string]: unknown }
type Reply = { status: number, body: Json }
type Session = {
    id: string,
    actor: security.Actor,
    scope: security.Scope,
    token: string,
    call: (string, unknown, string?) -> (unknown, error?),
    http: (string, string, Json?) -> Reply,
    raw: (string, string, string) -> Reply,
    api: (string, string, Json?) -> Reply,
    invoke: (string, string, Json?) -> Reply,
}
M.Session = Session
M.Reply = Reply

-- route turns a contract method and request into the verb, path and body of its
-- endpoint, moving route parameters into the path and a GET's request into its
-- query string.
local function route(catalog_id: string, method: string, request: Json?): (string, string, Json?)
    local spec = access_cases.ROUTES[method]
    local rest: Json = {}
    local path = "/" .. catalog_id .. spec[2]
    for k, v in pairs(request or {}) do
        local mark = "{" .. k .. "}"
        if path:find(mark, 1, true) then path = path:gsub(mark, tostring(v)) else rest[k] = v end
    end
    if spec[1] == "POST" then return "POST", path, rest end
    local parts: { string } = {}
    for k, v in pairs(rest) do
        local value: unknown = v
        if k == "product" then
            local ref = v :: Json
            k, value = ref.sku and "sku" or "id", ref.sku or ref.id
        elseif type(v) == "table" then
            value = json.encode(v)
        end
        parts[#parts + 1] = k .. "=" .. tostring(value):gsub("[^%w%-_%.~]", function(c: string): string return string.format("%%%02X", c:byte()) end)
    end
    return "GET", path .. (#parts > 0 and "?" .. table.concat(parts, "&") or ""), nil
end

M.route = route

local function open(actor: security.Actor, scope: security.Scope): Session
    local caller = assert(security.policy("app:caller_only"))
    local executor = funcs.new():with_actor(actor):with_scope(scope:with(caller))
    local tokens = assert(security.token_store("kickside.users.security:tokens"))
    local token = assert(tokens:create(actor, scope, { expiration = "1h" }))
    tokens:close()
    local function send(method: string, url: string, body: string): Reply
        local res, err = http_client.request(method, url, {
            body = body,
            headers = { ["Content-Type"] = "application/json", Authorization = "Bearer " .. token },
        })
        assert(not err and res, tostring(err))
        local decoded: unknown = res.body ~= "" and json.decode(res.body) or {}
        return { status = res.status_code, body = decoded :: Json }
    end
    local function raw(method: string, path: string, body: string): Reply
        return send(method, M.base_url() .. path, body)
    end
    return {
        id = actor:id(), actor = actor, scope = scope, token = token,
        call = function(op: string, request: unknown, catalog_id: string?): (unknown, error?)
            return executor:call("app:pim_call", { op = op, catalog_id = catalog_id, request = request })
        end,
        http = function(method: string, path: string, body: Json?): Reply
            return raw(method, path, json.encode(body or {}))
        end,
        raw = raw,
        invoke = function(catalog_id: string, method: string, request: Json?): Reply
            local verb, path, body = route(catalog_id, method, request)
            return raw(verb, path, body and json.encode(body) or "")
        end,
        api = function(method: string, path: string, body: Json?): Reply
            return send(method, M.api_url() .. path, json.encode(body or {}))
        end,
    }
end

-- catalog creates a catalog with the reference schema and terms as the session
-- and returns a handle whose calls run as the session.
function M.catalog(session: Session): fixture.Handle
    local created, err = session.call("create", { idempotency_key = (uuid.v4()), title = "Scoped catalog", declaration = fixture.DECLARATION })
    assert(not err, tostring(err))
    local id = (created :: Json).catalog_id :: string
    local handle: fixture.Handle = {
        id = id, actor = session.actor, executor = session,
        call = function(op: string, request: unknown): (unknown, error?) return session.call(op, request, id) end,
        async = function(_: string, _: unknown): (unknown, error?) return nil, nil end,
    }
    fixture.seed_terms(handle)
    return handle
end

-- member is a user of the platform Members group.
function M.member(): Session
    local actor = actors.member((uuid.v4()))
    return open(actor, assert(member_scope.resolve(actor)))
end

-- outsider is a signed-in user outside PIM's selected member group.
function M.outsider(): Session
    local actor = actors.outsider((uuid.v4()))
    return open(actor, assert(member_scope.resolve(actor)))
end

return M
