-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local sql = require("sql")
local release = require("release")

local function deliver(job_id, sequence, locator)
    if sequence == 5 and locator and locator.kind == "mail-message" then
        local db = assert(sql.get("app:db"))
        local rows = assert(db:query("SELECT subject FROM mail_message WHERE id=$1", {locator.id}))
        assert(db:release())
        if rows[1] and rows[1].subject == "Fixture ceiling_lost" then return false, nil end
    end
    return release.deliver(job_id, sequence, locator)
end

return {deliver = deliver}
