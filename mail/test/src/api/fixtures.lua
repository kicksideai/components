-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local contract = require("contract")
local funcs = require("funcs")
local http = require("http_client")
local json = require("json")
local security = require("security")
local system = require("system")
local uuid = require("uuid")
local identity = require("identity")
local reconcile = require("reconcile")

local projected = false
local function role_scope(groups)
    if not projected then
        assert(reconcile.trigger())
        projected = true
    end
    local resolved = assert(funcs.call("kickside.security.runtime:resolve_groups", {groups = groups}))
    return assert(identity.scope_from_groups(resolved.groups, resolved.policy_ids))
end

local function token_for(actor, scope)
    local tokens = assert(security.token_store("kickside.users.security:tokens"))
    local token = assert(tokens:create(actor, scope, {expiration = "1h"}))
    tokens:close()
    return token
end

local function users_request(token, method, path, body)
    local state = assert(system.supervisor.state("app:gateway"))
    local address = assert(state.details:match("^service listening on (127%.0%.0%.1:[1-9]%d*)$"), state.details)
    return assert(http.request(method, "http://" .. address .. "/api/users" .. path, {
        headers = {Authorization = "Bearer " .. token, ["Content-Type"] = "application/json"},
        body = assert(json.encode(body)),
    }))
end

local admin_token
local function users_admin_token()
    if admin_token then return admin_token end
    local groups = {"app.mail_api:users_admin"}
    local scope = role_scope(groups)
    local directory = assert(assert(contract.get("kickside.contract:directory")):open())
    local result = assert(directory:search({query = "System Administrator", kinds = {"user"}, limit = 2}))
    assert(#result.principals == 1, "The harness needs one bootstrap administrator")
    local principal = result.principals[1]
    local admin = assert(security.new_actor(principal.id, {user_id = principal.id, email = principal.sublabel,
        security_groups = groups}))
    admin_token = token_for(admin, scope)
    return admin_token
end

local function create_user(id, email, full_name, groups)
    local response = users_request(users_admin_token(), "POST", "", {
        user_id = id, email = email, full_name = full_name, groups = groups, password = uuid.v4() .. "a!Z1",
    })
    assert(response.status_code == 201, response.body)
end

local function session(names, actor_id, no_baseline)
    local id = actor_id or uuid.v4()
    local email, full_name = id .. "@example.org", "Mail fixture"
    local groups = names and {"app.mail_api:" .. names, "app:user"} or {"app:user"}
    if names == "outside" or names == "module_only" or no_baseline then groups = {"app.mail_api:" .. names} end
    if names and names:find("editor", 1, true) then groups[#groups + 1] = "app:mail_editors" end
    if names and names:find("sender", 1, true) then groups[#groups + 1] = "app:mail_senders" end
    create_user(id, email, full_name, groups)
    local actor = assert(security.new_actor(id, {user_id = id, email = email, full_name = full_name, security_groups = groups}))
    local scope = role_scope(groups)
    return {token = token_for(actor, scope), actor = actor, scope = scope, id = id, email = email}
end

local function update_user(admin, id, body)
    local response = users_request(admin.token, "PUT", "/" .. id, body)
    assert(response.status_code == 200, response.body)
    assert(assert(json.decode(response.body)).success, response.body)
end

local function settings(driver, address)
    local settings = assert(assert(contract.get("kickside.settings:settings")):open())
    if driver == "" then
        assert(settings:unset({namespace = "kickside.mail", key = "driver"}).success)
        assert(settings:unset({namespace = "kickside.mail", key = "from_address"}).success)
    else
        assert(settings:set({namespace = "kickside.mail", key = "driver", value = driver}).success)
        assert(settings:set({namespace = "kickside.mail", key = "from_address", value = address}).success)
    end
end

return {session = session, create_user = create_user, role_scope = role_scope, settings = settings, update_user = update_user}
