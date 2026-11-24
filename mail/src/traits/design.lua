-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local funcs = require("funcs")
local client = require("client")
local types = require("types")
local tool_result = require("tool_result")

local M = {}
local LIBRARY = "kickside.mail.library:"
local REFUSALS = {
    mail_revision_conflict = true,
    mail_preview_mismatch = true,
    mail_preview_expired = true,
    mail_resource_not_customized = true,
}

local function call(id: string, input: unknown): (unknown, error?)
    local denied = client.require_library()
    if denied then return nil, denied end
    return funcs.call(id, input)
end

local function refusal(err: error): (types.Record?, error?)
    local details = err:details() or {}
    if REFUSALS[details.code] or (err:kind() == errors.INVALID and details.resource and details.face) then
        return tool_result.domain_error(err:message(), details), nil
    end
    return nil, err
end

local function summary(item: types.Resource): types.LibraryRowSummary
    return {kind = item.kind, name = item.name, revision = item.revision, state = item.state}
end

local function write_one(method: string, input: unknown): (types.Record | types.LibraryRowSummary | nil, error?)
    local item, err = call(LIBRARY .. method, input)
    if err then return refusal(err) end
    return summary(item :: types.Resource), nil
end

local function require_preview(input: unknown): (types.Record?, error?)
    local denied = client.require_library()
    if denied then return nil, denied end
    if type(input) ~= "table" then
        return tool_result.fail(errors.INVALID, "Provide a mail library write request")
    end
    local value = (input :: types.Record).preview_id
    if value == nil or value == "" then
        return tool_result.domain_error("Preview these changes first, then pass the returned preview_id",
            {code = "mail_preview_required"}), nil
    end
    return nil, nil
end

function M.list(input: types.LibraryPageRequest): (unknown, error?)
    local value, err = call(LIBRARY .. "list_page", input)
    if err then return nil, err end
    local page = value :: types.LibraryPage
    return {items = page.items, next_cursor = page.next_cursor}, nil
end

function M.read(input: types.ResourceKey): (unknown, error?)
    return call(LIBRARY .. "get", input)
end

function M.preview(input: types.EditPreview): (unknown, error?)
    local value, err = call(LIBRARY .. "preview_edits", input)
    if err then return refusal(err) end
    local result = value :: types.DraftPreview
    local first = result.errors[1]
    if first then
        return tool_result.domain_error(first.message, {
            code = first.code, errors = result.errors, dependent_messages = result.dependent_messages,
            subject = result.subject, html = result.html, text = result.text,
        }), nil
    end
    return result, nil
end

function M.save(input: types.ResourceSave): (unknown, error?)
    local required, invalid = require_preview(input)
    if invalid or required then return required, invalid end
    local saved, err = call(LIBRARY .. "save", input)
    if err then return refusal(err) end
    local rows: {types.LibraryRowSummary} = {}
    for i, item in ipairs(saved :: {types.Resource}) do rows[i] = summary(item) end
    return {items = rows}, nil
end

function M.create(input: types.ResourceCreate): (unknown, error?)
    local required, invalid = require_preview(input)
    if invalid or required then return required, invalid end
    return write_one("create", input)
end

function M.asset_add(input: types.AssetWrite): (unknown, error?)
    local item, err = call(LIBRARY .. "asset_add", input)
    if err then return refusal(err) end
    local saved = item :: types.Resource
    return {kind = saved.kind, name = saved.name, state = saved.state, revision = saved.revision,
        messages = saved.used_by and saved.used_by.messages or {}}, nil
end

function M.reset(input: types.ResourceRevision): (unknown, error?)
    return write_one("reset", input)
end

function M.history(input: types.ResourceKey): (unknown, error?)
    local items, err = call(LIBRARY .. "history", input)
    if err then return nil, err end
    return {items = items}, nil
end

function M.restore(input: types.ResourceRestore): (unknown, error?)
    return write_one("restore", input)
end

function M.send_test(input: types.TestSend): (unknown, error?)
    local denied = client.require_library()
    if denied then return nil, denied end
    if type(input) == "table" and input.vars ~= nil then
        return tool_result.fail(errors.INVALID, "MailSendTest uses the message's saved samples")
    end
    return call("kickside.mail.service:library_send_test", input)
end

return M
