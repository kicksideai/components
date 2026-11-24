-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local contract = require("contract")
local logger = require("logger")
local types = require("types")

local M = {}

local function broadcast(topic: string, data: types.Record): error?
    local definition, err = contract.get("kickside.contract:realtime")
    if err then return err end
    local owner, open_err = definition:open()
    if open_err and not errors.is(open_err, errors.NOT_FOUND) then return open_err end
    if not owner then return nil end
    local result, send_err = (owner :: types.Realtime):broadcast({topic = topic, data = data})
    if send_err then return send_err end
    if not result or result.success ~= true then
        return errors.new({kind = errors.UNAVAILABLE, retryable = false,
            message = result and result.error or "Realtime broadcast returned no result",
            details = {code = "mail_realtime_refused"}})
    end
    return nil
end

local function publish(topic: string, data: types.Record)
    local err = broadcast(topic, data)
    if err then logger:error("Mail realtime broadcast failed", {topic = topic, error = tostring(err)}) end
end

function M.library(item: types.Resource)
    publish("mail.library.changed", {kind = item.kind, name = item.name, revision = item.revision})
end

function M.message(message_id: string, status: string)
    publish("mail.message.changed", {message_id = message_id, status = status})
end

return M
