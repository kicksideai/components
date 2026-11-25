-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local registry = require("registry")
local time = require("time")
local live = require("live")
local database = require("database")

local FLAG = "app.mail_library:publication_failure"

local function record(seq, state)
    assert(database.with_db(function(ex)
        return ex:execute("INSERT INTO mail_realtime_fixture (topic,subject,data,observed) VALUES ($1,$2,$3,$4)",
            {"fixture.publisher_race", tostring(seq), "{}", state})
    end))
end

local function publish(overlay, entries, rows, originals, seq)
    local flag = registry.get(FLAG)
    if flag and flag.data.permanent then
        return nil, errors.new({kind = errors.INTERNAL, retryable = false, message = "Injected permanent publication failure",
            details = {code = "fixture_publication_error"}})
    end
    if flag and flag.data.enabled then
        return nil, errors.new({kind = errors.UNAVAILABLE, retryable = true, message = "Injected publication failure",
            details = {code = "fixture_publication_error"}})
    end
    local held = flag and flag.data.hold_seq == seq
    if held then
        record(seq, "waiting")
        local deadline = time.now():add(2 * time.SECOND):unix_nano()
        repeat
            time.sleep("10ms")
            flag = registry.get(FLAG)
        until not flag or flag.data.hold_seq ~= seq or time.now():unix_nano() >= deadline
    end
    local value, err = live.publish(overlay, entries, rows, originals, seq)
    if held then record(seq, err and tostring(err:kind()) or "applied") end
    return value, err
end

return {open = live.open, marker = live.marker, published = live.published, publish = publish}
