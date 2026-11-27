-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local http = require("http")
local json = require("json")

local function handle()
    local request, response = http.request(), http.response()
    local message = assert(request:body_json())
    if message.subject == "Rejected by the relay" then
        response:set_status(422)
        response:write_json({})
        return
    end
    local part = message.attachments and message.attachments[1]
    response:write_json({id = assert(json.encode({
        subject = message.subject,
        content_id = part and part.content_id,
        encoded_attachment = part and #part.content_base64 > 0,
    }))})
end

return {handle = handle}
