-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local types = require("types")
local contract = require("contract")
local funcs = require("funcs")
local base64 = require("base64")
local client = require("client")
local message = require("message")
local asset_refs = require("asset_refs")

local M = {}

local function content_result<T>(result: T | types.ContentFailure | nil, err: error?): (T?, error?)
    if err then return nil, err end
    local failure = result :: types.ContentFailure?
    if result and failure.success ~= false then return result :: T, nil end
    return nil, failure and failure.error or errors.new({kind = errors.INTERNAL, retryable = false,
        message = "Content provider returned no attachment", details = {code = "attachment_unavailable"}})
end

function M.upload_info(upload_id: string): (types.ContentProvider?, types.ContentInfo?, error?)
    local definition, err = contract.get("kickside.contract:content_provider")
    if err then return nil, nil, err end
    local instance, open_err = definition:open("kickside.uploads:content_provider", {upload_id = upload_id})
    if open_err then return nil, nil, open_err end
    local provider = instance :: types.ContentProvider
    local info, info_err = content_result(provider:get_info({format = "raw"}))
    if info_err then return nil, nil, info_err end
    return provider, info, nil
end

function M.upload_bytes(provider: types.ContentProvider, size: number, limit: number): (types.Content?, error?)
    local content, content_err = content_result(provider:get_content({format = "raw", max_size = limit}))
    if content_err then return nil, content_err end
    if content.truncated or type(content.content) ~= "string" or type(content.content_type) ~= "string"
        or content.content_type == "" or #content.content ~= size then
        return nil, errors.new({kind = errors.INTERNAL, retryable = false, message = "Content provider did not return the complete attachment",
            details = {code = "incomplete_attachment"}})
    end
    return content, nil
end

local function resolve(input: types.AttachmentInput, read_bytes: boolean, preview_html: string?,
    carried: {types.Attachment}?): ({types.Attachment}?, error?)
    local bytes = input.message_bytes
    local total = 0
    local files: {types.Attachment} = carried or {}
    local readers: {() -> (types.Attachment?, error?)} = {}
    local ids: {[string]: boolean} = {}

    local function account(filename: string, content_type: string, size: number, id: string?): error?
        local updated, limit_err = message.add_attachment_size(total, size)
        if limit_err then return limit_err end
        total = updated :: number
        bytes = bytes + message.attachment_size(size, filename, content_type, id)
        if id then
            local key = id:lower()
            if ids[key] then
                return errors.new({kind = errors.INVALID, message = "Attachment content IDs must be distinct",
                    details = {code = "invalid_content_id"}})
            end
            ids[key] = true
        end
        return message.message_size_error(bytes, input.max_message_bytes)
    end

    local oversized = message.message_size_error(bytes, input.max_message_bytes)
    if oversized then return nil, oversized end
    for _, part in ipairs(carried or {}) do
        local limit_err = account(part.filename, part.content_type, #part.content, part.content_id)
        if limit_err then return nil, limit_err end
    end
    for _, ref in ipairs(input.refs or {}) do
        if not preview_html or (ref.disposition == "inline" and ref.content_id and asset_refs.referenced(preview_html, ref.content_id)) then
            local provider, info, err = M.upload_info(ref.upload_id)
            if err then return nil, err end
            info = info :: types.ContentInfo
            local remaining = message.MAX_ATTACHMENT_BYTES - total
            local filename, filename_err = message.attachment_filename(ref.filename or info.filename)
            if filename_err then return nil, filename_err end
            local image_err = preview_html and asset_refs.image_error(info.content_type, info.size)
            if image_err then return nil, image_err end
            local limit_err = account(filename, info.content_type, info.size, ref.content_id)
            if limit_err then return nil, limit_err end
            if read_bytes then
                readers[#readers + 1] = function(): (types.Attachment?, error?)
                    local content, content_err = M.upload_bytes(provider :: types.ContentProvider, info.size,
                        preview_html and asset_refs.MAX_BYTES or remaining)
                    if content_err then return nil, content_err end
                    if content.content_type ~= info.content_type then
                        if preview_html then
                            local bad_image = asset_refs.image_error(content.content_type, info.size)
                            if bad_image then return nil, bad_image end
                        end
                        bytes = bytes - message.attachment_size(info.size, filename, info.content_type, ref.content_id)
                            + message.attachment_size(info.size, filename, content.content_type, ref.content_id)
                        local size_err = message.message_size_error(bytes, input.max_message_bytes)
                        if size_err then return nil, size_err end
                    end
                    return {filename = filename, content_type = content.content_type, content = content.content,
                        disposition = ref.disposition or "attachment", content_id = ref.content_id}, nil
                end
            end
        end
    end
    for _, ref in ipairs(input.library_assets or {}) do
        local resolved, err = funcs.call("kickside.mail.library:read_asset_file", {ref = ref, bytes = false})
        if err then return nil, err end
        local part = resolved :: types.AssetPart
        local id = ref.content_id
        local filename, filename_err = message.attachment_filename(part.filename)
        if filename_err then return nil, filename_err end
        local limit_err = account(filename, part.content_type, part.size, id)
        if limit_err then return nil, limit_err end
        if read_bytes then
            readers[#readers + 1] = function(): (types.Attachment?, error?)
                local result, read_err = funcs.call("kickside.mail.library:read_asset_file", {ref = ref, bytes = true})
                if read_err then return nil, read_err end
                local current = result :: types.AssetPart
                if current.size ~= part.size or current.content_type ~= part.content_type then
                    return nil, errors.new({kind = errors.CONFLICT, message = "Attachment metadata changed during delivery",
                        retryable = false, details = {code = "incomplete_attachment"}})
                end
                return {filename = filename, content_type = current.content_type, content = current.content :: string,
                    disposition = "inline", content_id = id}, nil
            end
        end
    end
    for _, read in ipairs(readers) do
        local file, err = read()
        if err then return nil, err end
        files[#files + 1] = file :: types.Attachment
    end
    return files, nil
end

function M.validate(input: types.AttachmentInput): error?
    local _, err = resolve(input, false)
    return err
end

function M.read(input: types.AttachmentInput): ({types.Attachment}?, error?)
    local denied = client.require_send()
    if denied then return nil, denied end
    return resolve(input, true)
end

function M.complete(input: types.AttachmentInput, carried: {types.Attachment}): ({types.Attachment}?, error?)
    if not input.library_assets or #input.library_assets == 0 then return carried, nil end
    return resolve(input, true, nil, carried)
end

function M.preview(rendered: types.Rendered, refs: {types.AttachmentRef}?): (types.InlineAssets?, error?)
    local files, err = resolve({refs = refs, library_assets = rendered.library_assets, message_bytes = 0}, true, rendered.html or "")
    if err then return nil, err end
    if #files == 0 then return nil, nil end
    local inline: types.InlineAssets = {}
    for _, file in ipairs(files) do
        local encoded, encode_err = base64.encode(file.content)
        if encode_err then return nil, encode_err end
        inline[file.content_id :: string] = "data:" .. file.content_type .. ";base64," .. encoded
    end
    return inline, nil
end

return M
