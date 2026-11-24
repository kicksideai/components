-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local types = require("types")
local registry = require("registry")
local fs = require("fs")
local asset_refs = require("asset_refs")
local asset_store = require("asset_store")
local attachments = require("attachments")

local function invalid(): error
    return errors.new({kind = errors.INVALID, message = "Invalid packaged mail asset",
        details = {code = "invalid_mail_asset"}})
end

local function read(input: {ref: types.AssetRef, bytes: boolean}): (types.AssetPart?, error?)
    local ref = input.ref
    if ref.upload_id then
        if ref.original then return nil, invalid() end
        local provider, info, err = attachments.upload_info(ref.upload_id)
        if err then return nil, err end
        info = info :: types.ContentInfo
        if not info.source_ref or info.source_ref.component_id ~= asset_store.component_id() then return nil, invalid() end
        local inbound = asset_refs.image_error(info.content_type, info.size)
        if inbound then return nil, inbound end
        local part: types.AssetPart = {filename = info.filename, size = info.size :: integer, content_type = info.content_type}
        if input.bytes then
            local content, read_err = attachments.upload_bytes(provider :: types.ContentProvider, info.size, asset_refs.MAX_BYTES)
            if read_err then return nil, read_err end
            if content.content_type ~= info.content_type then return nil, invalid() end
            part.content = content.content
        end
        return part, nil
    end
    if not ref.original then return nil, invalid() end
    local entry, err = registry.get(ref.original)
    if err then return nil, err end
    local template = (entry.data :: types.Record).template :: types.ResourceContent?
    local asset = template and template.asset
    if entry.kind ~= "registry.entry" or entry.meta.type ~= "kickside.mail:template" or not template
        or template.kind ~= "asset" or template.name ~= ref.name or not asset or asset.source ~= "original"
        or type(asset.filesystem) ~= "string" or type(asset.path) ~= "string" or type(asset.filename) ~= "string"
        or type(asset.size) ~= "number" or type(asset.content_type) ~= "string" then
        return nil, invalid()
    end
    local bad_image = asset_refs.image_error(asset.content_type, asset.size)
    if bad_image then return nil, bad_image end
    local part: types.AssetPart = {filename = asset.filename, size = asset.size, content_type = asset.content_type}
    if input.bytes then
        local storage, fs_err = fs.get(asset.filesystem)
        if fs_err then return nil, fs_err end
        local stat, stat_err = storage:stat(asset.path)
        if stat_err then return nil, stat_err end
        if stat.size ~= part.size then return nil, invalid() end
        local content, read_err = storage:readfile(asset.path)
        if read_err then return nil, read_err end
        if #content ~= part.size then return nil, invalid() end
        part.content = content
    end
    return part, nil
end

return {read = read}
