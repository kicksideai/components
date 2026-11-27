-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local client = require("client")
local types = require("types")
local tool_result = require("tool_result")

local M = {}
local REFUSALS = {
    mail_revision_conflict = true,
    mail_command_id_conflict = true,
    mail_library_changed = true,
    mail_library_catching_up = true,
    mail_preview_required = true,
    mail_preview_mismatch = true,
    mail_preview_stale = true,
    mail_preview_expired = true,
    mail_resource_not_customized = true,
}

local function refusal(err: error): (types.Record?, error?)
    local details = err:details() or {}
    if REFUSALS[details.code] or (err:kind() == errors.INVALID and details.resource and details.face) then
        return tool_result.domain_error(err:message(), details), nil
    end
    return nil, err
end

local function summary(item: types.Resource): types.LibraryRowSummary
    return {kind = item.kind, name = item.name, revision = item.revision, state = item.state,
        seq = item.seq, committed = item.committed, projected = item.projected}
end

local function write_result(item: types.Resource?, err: error?): (types.Record | types.LibraryRowSummary | nil, error?)
    if err then return refusal(err) end
    return summary(item :: types.Resource), nil
end

function M.list(input: types.LibraryPageRequest): (unknown, error?)
    local library, open_err = client.library()
    if not library then return nil, open_err end
    local page, err = library:list(input)
    if err then return nil, err end
    local result = page :: types.LibraryPage
    return {items = result.items, next_cursor = result.next_cursor, library_seq = result.library_seq}, nil
end

function M.read(input: types.ResourceKey): (unknown, error?)
    local library, err = client.library()
    if not library then return nil, err end
    return library:get(input)
end

function M.preview(input: types.EditPreview): (unknown, error?)
    local library, open_err = client.library()
    if not library then return nil, open_err end
    local value, err = library:preview(input)
    if err then return refusal(err) end
    local result = value :: types.DraftPreview
    local first = result.errors and result.errors[1]
    if first then
        return tool_result.domain_error(first.message, {
            code = first.code, errors = result.errors, dependent_messages = result.dependent_messages,
            subject = result.subject, html = result.html, text = result.text,
        }), nil
    end
    return result, nil
end

function M.save(input: types.ResourceSave): (unknown, error?)
    local library, open_err = client.library()
    if not library then return nil, open_err end
    local saved, err = library:save(input)
    if err then return refusal(err) end
    local rows: {types.LibraryRowSummary} = {}
    local receipt = saved :: types.LibrarySaveResult
    if receipt.items then
        for i, item in ipairs(receipt.items) do rows[i] = summary(item) end
    end
    return {items = receipt.items and rows or nil, seq = receipt.seq,
        committed = receipt.committed, projected = receipt.projected}, nil
end

function M.create(input: types.ResourceCreate): (unknown, error?)
    local library, err = client.library()
    if not library then return nil, err end
    return write_result(library:create(input))
end

function M.asset_add(input: types.AssetWrite): (unknown, error?)
    local library, open_err = client.library()
    if not library then return nil, open_err end
    local item, err = library:add_asset(input)
    if err then return refusal(err) end
    local saved = item :: types.Resource
    if saved.projected == false then return summary(saved), nil end
    return {kind = saved.kind, name = saved.name, state = saved.state, revision = saved.revision,
        seq = saved.seq, committed = saved.committed, projected = saved.projected,
        messages = saved.used_by and saved.used_by.messages or {}}, nil
end

function M.reset(input: types.ResourceRevision): (unknown, error?)
    local library, err = client.library()
    if not library then return nil, err end
    return write_result(library:reset(input))
end

function M.history(input: types.LibraryHistoryRequest & {seq: integer?}): (unknown, error?)
    local library, err = client.library()
    if not library then return nil, err end
    if input.seq ~= nil then
        return library:read_revision({kind = input.kind, name = input.name, seq = input.seq :: integer})
    end
    return library:read_history(input)
end

function M.restore(input: types.ResourceRestore): (unknown, error?)
    local library, err = client.library()
    if not library then return nil, err end
    return write_result(library:restore(input))
end

function M.send_test(input: types.TestSend): (unknown, error?)
    local library, err = client.library()
    if not library then return nil, err end
    if type(input) == "table" and input.vars ~= nil then
        return tool_result.fail(errors.INVALID, "MailSendTest uses the message's saved samples")
    end
    return library:send_test(input)
end

return M
