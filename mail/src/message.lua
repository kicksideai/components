-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local types = require("types")
local M = {
    MAX_ATTACHMENTS = 10,
    MAX_ATTACHMENT_BYTES = 25 * 1024 * 1024,
    MAX_KEY_BYTES = 2048,
}

local function invalid(code: string, message: string): error
    return errors.new({kind = errors.INVALID, message = message, retryable = false, details = {code = code}})
end

local REQUEST_FIELDS = {
    template = true, vars = true, subject = true, text = true, html = true, to = true,
    cc = true, bcc = true, reply_to = true, attachments = true, idempotency_key = true,
}

local function nonempty(value: unknown): boolean
    return type(value) == "string" and value:find("%S") ~= nil
end

local function array(value: unknown): boolean
    if type(value) ~= "table" then return false end
    local count = 0
    for key in pairs(value) do
        if type(key) ~= "number" or key % 1 ~= 0 or key < 1 or key > #value then return false end
        count = count + 1
    end
    return count == #value
end

function M.address(value: unknown): boolean
    if type(value) ~= "string" or #value > 254 or value:find("[%c%s]") then return false end
    local local_part, domain = value:match("^([^@]+)@([^@]+)$")
    if not local_part or #local_part > 64
        or local_part:find("[^%w.!#$%%&'*+/=?^_`{|}~%-]")
        or local_part:sub(1, 1) == "." or local_part:sub(-1) == "."
        or local_part:find("..", 1, true) then return false end
    if not domain:find(".", 1, true) or domain:sub(1, 1) == "." or domain:sub(-1) == "."
        or domain:find("..", 1, true) then return false end
    for label in domain:gmatch("[^.]+") do
        if #label > 63 or label:find("[^%w%-]") or label:sub(1, 1) == "-" or label:sub(-1) == "-" then
            return false
        end
    end
    return true
end

function M.mailbox(from: types.Mailbox): string
    local name = from.name
    if not name then return from.address end
    if name:find("[^%w _%-]") or name:find("^ ") or name:find(" $") then
        name = '"' .. name:gsub('[\\"]', "\\%0") .. '"'
    end
    return name .. " <" .. from.address .. ">"
end

function M.subject_error(value: unknown): error?
    if not nonempty(value) then return invalid("subject_required", "A subject is required") end
    if value:find("[%c]") then return invalid("invalid_subject", "Subject contains a control character") end
    return nil
end

function M.add_attachment_size(total: number, size: unknown): (number?, error?)
    if type(size) ~= "number" or size < 0 or size % 1 ~= 0 then
        return nil, errors.new({kind = errors.INTERNAL, retryable = false, message = "Content provider returned an invalid size",
            details = {code = "invalid_attachment_size"}})
    end
    if total + size > M.MAX_ATTACHMENT_BYTES then
        return nil, invalid("attachments_too_large", "Attachments exceed the total byte limit")
    end
    return total + size, nil
end

local ATTACHMENT_FIELDS = {upload_id = true, filename = true, disposition = true, content_id = true}

local function attachments_error(attachments: unknown): error?
    if not array(attachments) then return invalid("invalid_attachment", "Attachments must be an array") end
    if #attachments > M.MAX_ATTACHMENTS then
        return invalid("too_many_attachments", "Attachments exceed the count limit")
    end
    local content_ids = {}
    for _, ref in ipairs(attachments) do
        if type(ref) ~= "table" or not nonempty(ref.upload_id)
            or (ref.filename ~= nil and (not nonempty(ref.filename) or ref.filename:find("[%c]")))
            or (ref.disposition ~= nil and ref.disposition ~= "attachment" and ref.disposition ~= "inline") then
            return invalid("invalid_attachment", "Each attachment must reference an upload and have valid metadata")
        end
        for key in pairs(ref) do
            if not ATTACHMENT_FIELDS[key] then
                return invalid("invalid_attachment", "Attachments must contain only an upload ID and delivery options")
            end
        end
        if (ref.disposition == "inline" or ref.content_id ~= nil)
            and (type(ref.content_id) ~= "string" or not ref.content_id:match("^[%w._@+%-]+$")) then
            return invalid("invalid_content_id", "Inline attachments require a valid content ID")
        end
        if ref.content_id then
            local id = (ref.content_id :: string):lower()
            if content_ids[id] then return invalid("invalid_content_id", "Attachment content IDs must be distinct") end
            content_ids[id] = true
        end
    end
    return nil
end

local function user_recipient(value: unknown): boolean
    if type(value) ~= "table" or not nonempty(value.user_id) then return false end
    for key in pairs(value) do
        if key ~= "user_id" then return false end
    end
    return true
end

function M.validate(raw: unknown): (types.SendRequest?, error?)
    if type(raw) ~= "table" then return nil, invalid("invalid_message", "Message must be a record") end
    local input = raw :: types.Record
    if input.from ~= nil then
        return nil, invalid("from_not_allowed", "From is set by the installation")
    end
    for key in pairs(input) do
        if not REQUEST_FIELDS[key] then
            return nil, invalid("invalid_message", "Unsupported mail request field: " .. tostring(key))
        end
    end
    if input.reply_to ~= nil and not M.address(input.reply_to) then
        return nil, invalid("invalid_address", "Reply-to must be a valid email address")
    end

    if input.to == nil or (array(input.to) and #input.to == 0) then
        return nil, invalid("recipient_required", "At least one To recipient is required")
    end
    for _, field in ipairs({"to", "cc", "bcc"}) do
        local list = input[field]
        if list ~= nil then
            if not array(list) then return nil, invalid("invalid_address", field .. " must be an array of recipients") end
            for _, value in ipairs(list) do
                if not M.address(value) and not user_recipient(value) then
                    return nil, invalid("invalid_address", field .. " contains an invalid email address or user ID")
                end
            end
        end
    end

    if (input.text ~= nil and type(input.text) ~= "string") or (input.html ~= nil and type(input.html) ~= "string") then
        return nil, invalid("invalid_body", "Text and HTML bodies must be strings")
    end
    if input.template ~= nil then
        if not nonempty(input.template) then
            return nil, invalid("invalid_template", "A mail template name is required")
        end
        if input.subject ~= nil or input.html ~= nil or input.text ~= nil then
            return nil, invalid("template_body_conflict", "A template cannot be combined with subject, text, or HTML")
        end
    else
        if input.vars ~= nil then
            return nil, invalid("invalid_template", "Template variables require a template")
        end
        local err = M.subject_error(input.subject)
        if err then return nil, err end
        if not nonempty(input.text) and not nonempty(input.html) then
            return nil, invalid("body_required", "An HTML or text body is required")
        end
    end
    if input.idempotency_key ~= nil
        and (not nonempty(input.idempotency_key) or #input.idempotency_key > M.MAX_KEY_BYTES or input.idempotency_key:find("%c")) then
        return nil, invalid("invalid_idempotency_key", "Idempotency key must be non-empty, contain no control characters, and be at most 2048 bytes")
    end
    if input.attachments ~= nil then
        local err = attachments_error(input.attachments)
        if err then return nil, err end
    end
    return input :: types.SendRequest, nil
end

return M
