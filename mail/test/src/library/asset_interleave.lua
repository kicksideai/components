-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local ctx = require("ctx")
local database = require("database")
local fixtures = require("fixtures")

local M = {}

local function signal(gate, state)
    assert(database.with_db(function(ex)
        return ex:execute("INSERT INTO mail_realtime_fixture (topic,subject,data,observed) VALUES ($1,$2,$3,$4)",
            {"fixture.asset_lifetime", gate, "{}", state})
    end))
end

local function signaled(gate, state)
    local rows = assert(database.with_db(function(ex)
        return ex:query("SELECT observed FROM mail_realtime_fixture WHERE topic=$1 AND subject=$2 AND observed=$3",
            {"fixture.asset_lifetime", gate, state})
    end))
    return #rows > 0
end

local function await(gate, state)
    fixtures.await(function() return signaled(gate, state) end,
        "Asset lifetime gate did not reach " .. gate .. " / " .. state)
end

local function pause(gate)
    signal(gate, "waiting")
    await(gate, "released")
end

function M.pause(gate)
    if ctx.get("mail_test_asset_gate") ~= gate then return end
    pause(gate)
end

function M.arm_reap(id) signal("reap_id", id) end

function M.pause_reap(id)
    if signaled("reap_id", id) then pause("after_claim") end
end

function M.await(gate) await(gate, "waiting") end
function M.release(gate) signal(gate, "released") end

return M
