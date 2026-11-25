-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local contract = require("contract")
local funcs = require("funcs")
local security = require("security")
local sql = require("sql")
local uuid = require("uuid")

local function session(names, compose_memberships)
    local id = uuid.v4()
    local email = id .. "@example.org"
    local db = assert(sql.get("app:db"))
    assert(db:execute([[INSERT INTO app_users (user_id,email,full_name,password_hash,status)
        VALUES ($1,$2,'Mail fixture','test-only','active')]], {id, email}))
    local groups = names and {"app.mail_api:" .. names, "app:user"} or {"app:user"}
    if names == "outside" or names == "module_only" then groups = {"app.mail_api:" .. names} end
    if names == "editor" or names == "editor_sender" then groups[#groups + 1] = "app:mail_editors" end
    if names and names:find("sender", 1, true) then groups[#groups + 1] = "app:mail_senders" end
    for _, group in ipairs(groups) do
        assert(db:execute("INSERT INTO app_user_groups (user_id,group_id) VALUES ($1,$2)", {id, group}))
    end
    assert(db:release())
    local materialized = assert(funcs.call("kickside.security.binding:materialize_group_set", {groups = groups}))
    local actor = assert(security.new_actor(id, {user_id = id, email = email, full_name = "Mail fixture", security_groups = groups}))
    local scope = assert(security.named_scope(compose_memberships and materialized.scope_name or groups[1]))
    local tokens = assert(security.token_store("kickside.users.security:tokens"))
    local token = assert(tokens:create(actor, scope, {expiration = "1h"}))
    tokens:close()
    return {token = token, actor = actor, scope = scope, id = id, email = email}
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

return {session = session, settings = settings}
