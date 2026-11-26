-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local client = require("client")
local content = require("content")
local types = require("types")

local function read(input: types.AttachmentInput): ({types.Attachment}?, error?)
    local denied = client.require_send()
    if denied then return nil, denied end
    return content.attachments(input, true)
end

return {read = read}
