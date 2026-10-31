local http = require("http")
local store = require("store")
local json = require("json")
local crypto = require("crypto")
local M = {}

local function storage()
    return assert(store.get("app:oauth_provider_fixture_store"))
end

function M.issue(identity)
    local code = assert(crypto.random.uuid())
    local s = storage()
    local ok, err = s:set("code:" .. code, assert(json.encode(identity)), 60)
    s:release()
    assert(ok, tostring(err))
    return code
end

function M.cleanup(code)
    local s = storage()
    for _, prefix in ipairs({"code:", "token:"}) do
        local _, err = s:delete(prefix .. code)
        assert(not err, tostring(err))
    end
    s:release()
end

local function respond(status, body)
    local res = http.response()
    res:set_status(status)
    res:set_content_type(http.CONTENT.JSON)
    res:write_json(body)
end

function M.landing()
    return respond(200, {success = true})
end

function M.exchange()
    local body = assert(http.request():body())
    local code = body:match("code=([%w%-]+)")
    if not code or not body:find("client_id=fixture%-client") or not body:find("client_secret=fixture%-secret") then
        return respond(401, {error = "invalid_grant"})
    end
    local s = storage()
    local identity, read_err = s:get("code:" .. code)
    assert(not read_err, tostring(read_err))
    if not identity then s:release(); return respond(401, {error = "invalid_grant"}) end
    local deleted, delete_err = s:delete("code:" .. code)
    assert(deleted, tostring(delete_err))
    local written, write_err = s:set("token:" .. code, identity, 60)
    s:release()
    assert(written, tostring(write_err))
    return respond(200, {access_token = code, token_type = "bearer"})
end

local function claims()
    local token = (http.request():header("Authorization") or ""):match("^Bearer ([%w%-]+)$")
    if not token then return nil end
    local s = storage()
    local raw, read_err = s:get("token:" .. token)
    assert(not read_err, tostring(read_err))
    s:release()
    return raw and assert(json.decode(raw)) or nil
end

function M.userinfo()
    local identity = claims()
    if not identity then return respond(401, {error = "invalid_token"}) end
    return respond(200, {id = identity.subject, login = "fixture-user", name = "Fixture User"})
end

function M.emails()
    local identity = claims()
    if not identity then return respond(401, {error = "invalid_token"}) end
    return respond(200, {{email = identity.email, primary = true, verified = true}})
end

function M.set_jwks(keys)
    local s = storage()
    local ok, err = s:set("jwks", assert(json.encode({keys = keys})), 60)
    s:release()
    assert(ok, tostring(err))
end

function M.jwks()
    local s = storage()
    local raw, err = s:get("jwks")
    s:release()
    assert(not err, tostring(err))
    if not raw then return respond(404, {error = "no_jwks"}) end
    return respond(200, assert(json.decode(raw)))
end

return M
