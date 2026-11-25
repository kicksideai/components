-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local time = require("time")
local ctx = require("ctx")
local live = require("live")
local database = require("database")

local function fault()
    return assert(database.with_db(function(ex)
        local rows, err = ex:query("SELECT subject,observed FROM mail_realtime_fixture WHERE topic=$1",
            {"fixture.publisher_fault"})
        if err then return nil, err end
        return rows, nil
    end))[1]
end

local function record(seq, state)
    assert(database.with_db(function(ex)
        return ex:execute("INSERT INTO mail_realtime_fixture (topic,subject,data,observed) VALUES ($1,$2,$3,$4)",
            {"fixture.publisher_race", tostring(seq), "{}", state})
    end))
end

local function publish(overlay, entries, rows, originals, seq)
    local flag = fault()
    if flag and flag.observed == "permanent" then
        return nil, errors.new({kind = errors.INTERNAL, retryable = false, message = "Injected permanent publication failure",
            details = {code = "fixture_publication_error"}})
    end
    if flag and flag.observed == "unavailable" then
        return nil, errors.new({kind = errors.UNAVAILABLE, retryable = true, message = "Injected publication failure",
            details = {code = "fixture_publication_error"}})
    end
    local held = flag and tonumber(flag.subject) == seq
    if held then
        record(seq, "waiting")
        local deadline = time.now():add(2 * time.SECOND):unix_nano()
        repeat
            time.sleep("10ms")
            flag = fault()
        until not flag or tonumber(flag.subject) ~= seq or time.now():unix_nano() >= deadline
    end
    local value, err = live.publish(overlay, entries, rows, originals, seq)
    if held then record(seq, err and tostring(err:kind()) or "applied") end
    return value, err
end

local function marker()
    if ctx.get("mail_test_marker_unavailable") then
        return nil, errors.new({kind = errors.UNAVAILABLE, retryable = true,
            message = "Fixture marker unavailable", details = {code = "fixture_marker_unavailable"}})
    end
    return live.marker()
end

return {open = live.open, marker = marker, published = live.published, publish = publish}
