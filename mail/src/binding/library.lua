-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local library = require("library")
local history = require("history")
local types = require("types")
local client = require("client")
local writer = require("writer")
local edits = require("edits")
local assets = require("assets")
local preview = require("preview")

local M = {
    list = library.page,
    get = library.get,
    asset_content = library.asset_content,
    preview = preview.preview,
    add_asset = assets.add,
}

function M.read_history(input: types.LibraryHistoryRequest): (types.LibraryHistoryPage?, error?)
    local denied = library.require_read()
    if denied then return nil, denied end
    return history.page(input)
end

function M.read_revision(input: types.LibraryRevisionRequest): (types.Revision?, error?)
    local denied = library.require_read()
    if denied then return nil, denied end
    return history.revision(input, type(input) == "table" and input.seq or nil)
end

function M.create(input: types.ResourceCreate): (types.Resource?, error?)
    local fields = type(input) == "table" and input or {} :: types.ResourceCreate
    if fields.kind == "asset" then return assets.adopt((input :: unknown) :: types.AssetWrite, "create") end
    return writer.one(edits.create(input), "create", {preview_id = fields.preview_id, command_id = fields.command_id})
end

function M.update(input: types.ResourceEdit): (types.Resource?, error?)
    local fields = type(input) == "table" and input or {} :: types.ResourceEdit
    if fields.kind == "asset" then return assets.adopt((input :: unknown) :: types.AssetWrite, "update") end
    return writer.one(edits.update(input), "update", {preview_id = fields.preview_id, command_id = fields.command_id})
end

function M.save(input: types.ResourceSave): (types.LibrarySaveResult?, error?)
    local denied = client.require_library()
    if denied then return nil, denied end
    local batch, err = edits.save(input)
    if err then return nil, err end
    return writer.apply("update", batch :: {types.LibraryEdit},
        {preview_id = input.preview_id, command_id = input.command_id, identity_op = "save"})
end

function M.set_base(input: types.ResourceBaseEdit): (types.Resource?, error?)
    local fields = type(input) == "table" and input or {} :: types.ResourceBaseEdit
    return writer.one(edits.set_base(input), "set_base", {preview_id = fields.preview_id, command_id = fields.command_id})
end

function M.reset(input: types.ResourceRevision): (types.Resource?, error?)
    local fields = type(input) == "table" and input or {} :: types.ResourceRevision
    return writer.one(edits.revision(input), "reset", {preview_id = fields.preview_id, command_id = fields.command_id})
end

function M.restore(input: types.ResourceRestore): (types.Resource?, error?)
    local fields = type(input) == "table" and input or {} :: types.ResourceRestore
    return writer.one(edits.restore(input), "restore", {preview_id = fields.preview_id, command_id = fields.command_id})
end

function M.delete(input: types.ResourceRevision): (boolean?, error?)
    local _, err = writer.apply("delete", {edits.revision(input)},
        {command_id = type(input) == "table" and input.command_id or nil})
    if err then return nil, err end
    return true, nil
end

return M
