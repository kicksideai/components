-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local contract = require("contract")
local logger = require("logger")
local types = require("types")
local notifier = require("notifier")
local jobs = require("jobs")

local M = {}

local function broadcast(topic: string): error?
    local definition, err = contract.get("kickside.contract:realtime")
    if err then return err end
    local owner, open_err = definition:open()
    if open_err and not errors.is(open_err, errors.NOT_FOUND) then return open_err end
    if not owner then return nil end
    local result, send_err = (owner :: types.Realtime):broadcast({topic = topic})
    if send_err then return send_err end
    if not result or result.success ~= true then
        return errors.new({kind = errors.UNAVAILABLE, retryable = false,
            message = result and result.error or "Realtime broadcast returned no result",
            details = {code = "mail_realtime_refused"}})
    end
    return nil
end

local function publish(topic: string)
    local err = broadcast(topic)
    if err then logger:warn("Mail realtime broadcast failed", {topic = topic, error = tostring(err)}) end
end

function M.library()
    publish("mail.library")
end

function M.activity()
    publish("mail.activity")
end

function M.retention()
    local _, err = notifier.notify({kind = "owner_eligibility_changed"})
    if err then logger:warn("Mail retention notification failed", {error = tostring(err)}) end
end

function M.nudge()
    local _, err = jobs.nudge_workers()
    if err then logger:warn("Mail job notification failed", {error = tostring(err)}) end
end

return M
