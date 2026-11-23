-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local types = require("types")
local contract = require("contract")
local client = require("client")
local message = require("message")
local render = require("render")

local function content_result<T>(result: T | types.ContentFailure | nil, err: error?): (T?, error?)
    if err then return nil, err end
    local failure = result :: types.ContentFailure?
    if result and failure.success ~= false then return result :: T, nil end
    return nil, failure and failure.error or errors.new({kind = errors.INTERNAL, retryable = false,
        message = "Content provider returned no attachment", details = {code = "attachment_unavailable"}})
end

local function resolve(attachments: {types.Attachment}, refs: {types.AttachmentRef}?, read_bytes: boolean): ({types.Attachment}?, error?)
    if not refs or #refs == 0 then return attachments, nil end
    local definition, definition_err = contract.get("kickside.contract:content_provider")
    if definition_err then return nil, definition_err end

    local content_ids = {}
    local total = 0
    for _, attachment in ipairs(attachments) do
        total = total + #attachment.content
        content_ids[attachment.content_id:lower()] = true
    end
    for _, ref in ipairs(refs) do
        if ref.content_id then
            local content_id = ref.content_id:lower()
            if content_ids[content_id] then
                return nil, errors.new({kind = errors.INVALID, retryable = false,
                    message = "Attachment content IDs must be distinct", details = {code = "duplicate_content_id"}})
            end
        end
        local provider, open_err = definition:open("kickside.uploads:content_provider", {upload_id = ref.upload_id})
        if open_err then return nil, open_err end
        provider = provider :: types.ContentProvider
        local info, info_err = content_result(provider:get_info({format = "raw"}))
        if info_err then return nil, info_err end
        local remaining = message.MAX_ATTACHMENT_BYTES - total
        local updated, limit_err = message.add_attachment_size(total, info.size)
        if limit_err then return nil, limit_err end
        total = updated :: number

        if read_bytes then
            local content, content_err = content_result(provider:get_content({format = "raw", max_size = remaining}))
            if content_err then return nil, content_err end
            if content.truncated or type(content.content) ~= "string" or type(content.content_type) ~= "string"
                or content.content_type == "" or #content.content ~= info.size then
                return nil, errors.new({kind = errors.INTERNAL, retryable = false, message = "Content provider did not return the complete attachment",
                    details = {code = "incomplete_attachment"}})
            end
            attachments[#attachments + 1] = {
                filename = ref.filename or info.filename,
                content_type = content.content_type,
                content = content.content,
                disposition = ref.disposition or "attachment",
                content_id = ref.content_id,
            }
        end
    end
    return attachments, nil
end

local M = {}

function M.validate(layout: {types.Attachment}, refs: {types.AttachmentRef}?): error?
    local _, err = resolve(layout, refs, false)
    return err
end

function M.read(refs: {types.AttachmentRef}): ({types.Attachment}?, error?)
    local denied = client.require_send()
    if denied then return nil, denied end
    local logo, err = render.layout_image()
    if err then return nil, err end
    return resolve({logo :: types.Attachment}, refs, true)
end

return M
