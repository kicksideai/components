-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local json = require("json")
local security = require("security")
local sql = require("sql")

local function broadcast(input)
    assert(security.can("realtime.broadcast", "kickside.realtime:" .. input.topic))
    local db = assert(sql.get("app:db"))
    local payload = input.data
    local subject, observed
    if input.topic == "mail.library.changed" then
        subject = payload.name
        local rows = assert(db:query("SELECT revision FROM mail_library WHERE kind=$1 AND name=$2",
            {payload.kind, payload.name}))
        observed = rows[1] and tostring(rows[1].revision) or "absent"
    else
        subject = payload.message_id
        local rows = assert(db:query("SELECT status FROM mail_message WHERE id=$1", {subject}))
        observed = assert(rows[1]).status
    end
    local _, err = db:execute("INSERT INTO mail_realtime_fixture (topic,subject,data,observed) VALUES ($1,$2,$3,$4)",
        {input.topic, subject, assert(json.encode(payload)), observed})
    assert(db:release())
    if err then return nil, err end
    return {success = true}
end

local function notify()
    return {success = false, error = "Mail publishes broadcast topics"}
end

return {broadcast = broadcast, notify = notify}
