-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local contract = require("contract")
local funcs = require("funcs")
local http = require("http_client")
local json = require("json")
local security = require("security")
local sql = require("sql")
local system = require("system")
local uuid = require("uuid")

local function role_scope(groups)
    local materialized = assert(funcs.call("kickside.security.binding:materialize_group_set", {groups = groups}))
    return assert(security.named_scope(materialized.scope_name))
end

local function session(names, actor_id, no_baseline)
    local id = actor_id or uuid.v4()
    local email = id .. "@example.org"
    local db = assert(sql.get("app:db"))
    assert(db:execute([[INSERT INTO app_users (user_id,email,full_name,password_hash,status)
        VALUES ($1,$2,'Mail fixture','test-only','active')]], {id, email}))
    local groups = names and {"app.mail_api:" .. names, "app:user"} or {"app:user"}
    if names == "outside" or names == "module_only" or no_baseline then groups = {"app.mail_api:" .. names} end
    if names and names:find("editor", 1, true) then groups[#groups + 1] = "app:mail_editors" end
    if names and names:find("sender", 1, true) then groups[#groups + 1] = "app:mail_senders" end
    for _, group in ipairs(groups) do
        assert(db:execute("INSERT INTO app_user_groups (user_id,group_id) VALUES ($1,$2)", {id, group}))
    end
    assert(db:release())
    local actor = assert(security.new_actor(id, {user_id = id, email = email, full_name = "Mail fixture", security_groups = groups}))
    local scope = role_scope(groups)
    local tokens = assert(security.token_store("kickside.users.security:tokens"))
    local token = assert(tokens:create(actor, scope, {expiration = "1h"}))
    tokens:close()
    return {token = token, actor = actor, scope = scope, id = id, email = email}
end

local function update_user(admin, id, body)
    local state = assert(system.supervisor.state("app:gateway"))
    local address = assert(state.details:match("^service listening on (127%.0%.0%.1:[1-9]%d*)$"), state.details)
    local response = assert(http.request("PUT", "http://" .. address .. "/api/users/" .. id, {
        headers = {Authorization = "Bearer " .. admin.token, ["Content-Type"] = "application/json"},
        body = assert(json.encode(body)),
    }))
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

return {session = session, role_scope = role_scope, settings = settings, update_user = update_user}
