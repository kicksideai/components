-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local types = require("types")

local M = {MAX_BYTES = 1024 * 1024}
local IMAGE_TYPES = {["image/png"] = true, ["image/jpeg"] = true, ["image/gif"] = true}

function M.image_error(content_type: string, size: number): error?
    if not IMAGE_TYPES[content_type] then
        return errors.new({kind = errors.INVALID, message = "Use a PNG, JPEG or GIF image",
            details = {code = "mail_asset_media_type"}})
    end
    if size < 1 or size > M.MAX_BYTES then
        return errors.new({kind = errors.INVALID, message = "Images must be between 1 byte and 1 MiB",
            details = {code = "mail_asset_size"}})
    end
    return nil
end

function M.cid(name: string): string
    return "mail-library-" .. name
end

function M.referenced(html: string, id: string): boolean
    local token = "cid:" .. id
    local start = 1
    while true do
        local first, last = html:find(token, start, true)
        if not first or not last then return false end
        if not html:sub(last + 1, last + 1):match("[%w._@+%-]") then return true end
        start = last + 1
    end
end

function M.context(items: {types.Resource}, attachments: {types.AttachmentRef}?): types.JsonObject
    local taken: {[string]: boolean} = {}
    for _, ref in ipairs(attachments or {}) do
        if ref.content_id then taken[ref.content_id:lower()] = true end
    end
    local result: types.JsonObject = {}
    for _, item in ipairs(items) do
        local id = M.cid(item.name)
        while taken[id] do id = id .. "." end
        result[item.name] = "cid:" .. id
    end
    return result
end

function M.from_items(items: types.ResourceMap): {types.Resource}
    local selected: {types.Resource} = {}
    for _, item in pairs(items) do
        if item.kind == "asset" then selected[#selected + 1] = item end
    end
    table.sort(selected, function(a, b) return a.name < b.name end)
    return selected
end

function M.reference(item: types.Resource, content_id: string): types.AssetRef
    local asset = item.asset :: types.Asset
    return {name = item.name, content_id = content_id, upload_id = asset.upload_id,
        original = asset.source == "original" and item.origin or nil}
end

function M.select(html: string, items: {types.Resource}, context: types.JsonObject): {types.AssetRef}
    local selected: {types.AssetRef} = {}
    for _, item in ipairs(items) do
        local id = (context[item.name] :: string):sub(#"cid:" + 1)
        if M.referenced(html, id) then
            selected[#selected + 1] = M.reference(item, id)
        end
    end
    return selected
end

return M
