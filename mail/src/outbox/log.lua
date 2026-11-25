-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local activity = require("activity")
local database = require("database")
local reader = require("message_reader")
local types = require("types")
local uuid = require("uuid")

local function for_resend(message_id: string): (types.MessageRow?, error?)
    local sender, err = activity.sender_scope()
    if err then return nil, err end
    if type(message_id) ~= "string" or not uuid.validate(message_id) then
        return nil, errors.new({kind = errors.INVALID, message = "A message ID is required",
            retryable = false, details = {code = "invalid_request"}})
    end
    local row, read_err = database.with_db(function(ex: types.Executor): (types.MessageRow?, error?)
        return reader.for_resend(ex, message_id, sender)
    end)
    if read_err then return nil, read_err end
    if row.status ~= "failed" or (not row.failed_html and not row.failed_text) then
        return nil, errors.new({kind = errors.CONFLICT, message = "The message has no failed content to resend",
            retryable = false, details = {code = "mail_content_unavailable"}})
    end
    return row, nil
end

return {get_message = activity.get, list_messages = activity.list, for_resend = for_resend}
