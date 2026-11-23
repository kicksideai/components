-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local base64 = require("base64")
local fs = require("fs")
local json = require("json")

local function send(message)
    local output = assert(fs.get("kickside.mail.demo:output"))
    assert(output:writefile("sent.html", message.html))
    assert(output:writefile("sent.txt", message.text))

    for _, attachment in ipairs(message.attachments) do
        attachment.content_base64 = assert(base64.encode(attachment.content))
        attachment.content = nil
    end
    assert(output:writefile("sent.json", assert(json.encode(message))))
    return {provider_message_id = "render-demo"}
end

return {send = send, available = function() return {available = true} end}
