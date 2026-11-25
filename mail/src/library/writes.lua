-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local types = require("types")
local client = require("client")
local writer = require("writer")
local edits = require("edits")
local assets = require("assets")
local preview = require("preview")

local M = {
    asset_add = assets.add, boot = writer.boot,
    preview_edits = preview.preview_edits, render_draft = preview.render_draft, render = preview.render,
}

function M.create(input: types.ResourceCreate): (types.Resource?, error?)
    local fields = type(input) == "table" and input or {} :: types.ResourceCreate
    if fields.kind == "asset" then return assets.adopt((input :: unknown) :: types.AssetWrite, "create") end
    return writer.one(edits.create(input), "create", fields.preview_id)
end

function M.update(input: types.ResourceEdit): (types.Resource?, error?)
    local fields = type(input) == "table" and input or {} :: types.ResourceEdit
    if fields.kind == "asset" then return assets.adopt((input :: unknown) :: types.AssetWrite, "update") end
    return writer.one(edits.update(input), "update", fields.preview_id)
end

function M.save(input: types.ResourceSave): ({types.Resource}?, error?)
    local denied = client.require_library()
    if denied then return nil, denied end
    local batch, err = edits.save(input)
    if err then return nil, err end
    return writer.apply("update", batch :: {types.LibraryEdit}, input.preview_id)
end

function M.set_base(input: types.ResourceBaseEdit): (types.Resource?, error?)
    local fields = type(input) == "table" and input or {} :: types.ResourceBaseEdit
    return writer.one(edits.set_base(input), "set_base", fields.preview_id)
end

function M.reset(input: types.ResourceRevision): (types.Resource?, error?)
    local fields = type(input) == "table" and input or {} :: types.ResourceRevision
    return writer.one(edits.revision(input), "reset", fields.preview_id)
end

function M.restore(input: types.ResourceRestore): (types.Resource?, error?)
    local fields = type(input) == "table" and input or {} :: types.ResourceRestore
    return writer.one(edits.restore(input), "restore", fields.preview_id)
end

function M.delete(input: types.ResourceRevision): (boolean?, error?)
    local _, err = writer.one(edits.revision(input), "delete")
    if err then return nil, err end
    return true, nil
end

return M
