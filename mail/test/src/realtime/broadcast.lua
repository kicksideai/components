-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local json = require("json")
local security = require("security")
local sql = require("sql")

local function broadcast(input)
    assert(security.can("realtime.broadcast", "kickside.realtime:" .. input.topic))
    local db = assert(sql.get("app:db"))
    local rows
    if input.topic == "mail.library" then
        local faults = assert(db:query("SELECT subject FROM mail_realtime_fixture WHERE topic=$1", {"fixture.refuse_library"}))
        if faults[1] then
            local name = faults[1].subject
            local committed = assert(db:query("SELECT revision FROM mail_library WHERE kind=$1 AND name=$2", {"part", name}))
            local observed = committed[1] and tostring(committed[1].revision) or "absent"
            assert(db:execute("UPDATE mail_realtime_fixture SET observed=$1 WHERE topic=$2 AND subject=$3",
                {observed, "fixture.refuse_library", name}))
            assert(db:release())
            return {success = false, error = "L7 fixture refuses library broadcast"}
        end
        rows = assert(db:query("SELECT CAST(revision AS TEXT) AS observed FROM mail_library WHERE kind='base' AND name='event-frame'"))
    else
        assert(input.topic == "mail.activity")
        rows = assert(db:query("SELECT status AS observed FROM mail_message WHERE subject='Realtime fixture delivery'"))
    end
    if rows[1] then
        assert(db:execute("INSERT INTO mail_realtime_fixture (topic,subject,data,observed) VALUES ($1,$2,$3,$4)",
            {input.topic, "fixture", assert(json.encode(input)), rows[1].observed}))
    end
    assert(db:release())
    return {success = true}
end

local function notify()
    return {success = true}
end

return {broadcast = broadcast, notify = notify}
