-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local types = require("types")
local client = require("client")
local content = require("content")

local M = {}

function M.validate(input: types.AttachmentInput): error?
    local _, err = content.attachments(input, false)
    return err
end

function M.read(input: types.AttachmentInput): ({types.Attachment}?, error?)
    local denied = client.require_send()
    if denied then return nil, denied end
    return content.attachments(input, true)
end

function M.complete(input: types.AttachmentInput, carried: {types.Attachment}): ({types.Attachment}?, error?)
    if not input.library_assets or #input.library_assets == 0 then return carried, nil end
    return content.attachments(input, true, nil, carried)
end

return M
