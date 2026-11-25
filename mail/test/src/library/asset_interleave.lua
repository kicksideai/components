-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local sql = require("sql")
local fixtures = require("fixtures")

local M = {}

local function signal(gate, state)
    local db = assert(sql.get("app:db"))
    local result, err = db:execute("INSERT INTO mail_realtime_fixture (topic,subject,data,observed) VALUES ($1,$2,$3,$4)",
        {"fixture.asset_lifetime", gate, "{}", state})
    assert(db:release())
    assert(result, tostring(err))
end

local function signaled(gate, state)
    local db = assert(sql.get("app:db"))
    local rows, err = db:query("SELECT observed FROM mail_realtime_fixture WHERE topic=$1 AND subject=$2 AND observed=$3",
        {"fixture.asset_lifetime", gate, state})
    assert(db:release())
    return #assert(rows, tostring(err)) > 0
end

local function await(gate, state)
    fixtures.await(function() return signaled(gate, state) end,
        "Asset lifetime gate did not reach " .. gate .. " / " .. state)
end

local function pause(gate)
    signal(gate, "waiting")
    await(gate, "released")
end

function M.arm_reap(id) signal("reap_id", id) end

function M.pause_reap(id)
    if signaled("reap_id", id) then pause("after_claim") end
end

function M.await(gate) await(gate, "waiting") end
function M.release(gate) signal(gate, "released") end

return M
