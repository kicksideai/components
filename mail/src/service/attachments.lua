-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local types = require("types")
local contract = require("contract")
local client = require("client")
local message = require("message")

local function content_result<T>(result: T | types.ContentFailure | nil, err: error?): (T?, error?)
    if err then return nil, err end
    local failure = result :: types.ContentFailure?
    if result and failure.success ~= false then return result :: T, nil end
    return nil, failure and failure.error or errors.new({kind = errors.INTERNAL, retryable = false,
        message = "Content provider returned no attachment", details = {code = "attachment_unavailable"}})
end

local function resolve(input: types.AttachmentInput, read_bytes: boolean): ({types.Attachment}?, error?)
    local bytes = input.message_bytes
    local attachments: {types.Attachment} = {}
    local total = 0
    local oversized = message.message_size_error(bytes, input.max_message_bytes)
    if oversized then return nil, oversized end
    if not input.refs or #input.refs == 0 then return attachments, nil end
    local definition, definition_err = contract.get("kickside.contract:content_provider")
    if definition_err then return nil, definition_err end

    for _, ref in ipairs(input.refs) do
        local provider, open_err = definition:open("kickside.uploads:content_provider", {upload_id = ref.upload_id})
        if open_err then return nil, open_err end
        provider = provider :: types.ContentProvider
        local metadata, info_err = content_result(provider:get_info({format = "raw"}))
        if info_err then return nil, info_err end
        local info = metadata :: types.ContentInfo
        local remaining = message.MAX_ATTACHMENT_BYTES - total
        local updated, limit_err = message.add_attachment_size(total, info.size)
        if limit_err then return nil, limit_err end
        total = updated :: number
        local filename, filename_err = message.attachment_filename(ref.filename or info.filename)
        if filename_err then return nil, filename_err end
        local content_type = info.content_type
        local part_size = message.attachment_size(info.size, filename, content_type, ref.content_id)
        bytes = bytes + part_size
        oversized = message.message_size_error(bytes, input.max_message_bytes)
        if oversized then return nil, oversized end

        if read_bytes then
            local content, content_err = content_result(provider:get_content({format = "raw", max_size = remaining}))
            if content_err then return nil, content_err end
            if content.truncated or type(content.content) ~= "string" or type(content.content_type) ~= "string"
                or content.content_type == "" or #content.content ~= info.size then
                return nil, errors.new({kind = errors.INTERNAL, retryable = false, message = "Content provider did not return the complete attachment",
                    details = {code = "incomplete_attachment"}})
            end
            if content.content_type ~= content_type then
                bytes = bytes - part_size + message.attachment_size(info.size, filename, content.content_type, ref.content_id)
                oversized = message.message_size_error(bytes, input.max_message_bytes)
                if oversized then return nil, oversized end
            end
            attachments[#attachments + 1] = {
                filename = filename,
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

function M.validate(input: types.AttachmentInput): error?
    local _, err = resolve(input, false)
    return err
end

function M.read(input: types.AttachmentInput): ({types.Attachment}?, error?)
    local denied = client.require_send()
    if denied then return nil, denied end
    return resolve(input, true)
end

return M
