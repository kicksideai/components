-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local fs = require("fs")
local funcs = require("funcs")
local security = require("security")
local sql = require("sql")
local provision = require("provision")

local function main()
    local id = "07cc253a-d1ab-46e5-936f-7d12490524bc"
    local groups = {"app:user", "app:mail_senders", "wippy.security:process"}
    local db = assert(sql.get("app:db"))
    assert(db:execute([[INSERT INTO app_users (user_id,email,full_name,password_hash,status)
        VALUES ($1,'reader@example.org','Demo reader','test-only','active')]], {id}))
    for _, group in ipairs(groups) do
        assert(db:execute("INSERT INTO app_user_groups (user_id,group_id) VALUES ($1,$2)", {id, group}))
    end
    assert(db:release())

    local actor = assert(security.new_actor(id, {security_groups = groups}))
    local scope = assert(security.named_scope("wippy.security:process"))
    assert(provision.ensure_user(actor, scope, id))

    local fixtures = assert(fs.get("kickside.mail.demo:fixtures"))
    local sender = assert(funcs.new():with_actor(actor):with_scope(scope))
    assert(sender:call("kickside.mail.demo:send_notice", {
        ["activity-banner.png"] = assert(fixtures:readfile("activity-banner.png")),
        ["report.pdf"] = assert(fixtures:readfile("report.pdf")),
    }))
    return 0
end

return {main = main}
