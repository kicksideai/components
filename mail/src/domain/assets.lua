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

local URL_ATTRIBUTES = {
    action = true, background = true, cite = true, data = true, formaction = true, href = true,
    longdesc = true, poster = true, src = true, usemap = true, ["xlink:href"] = true,
}
local RAW_TEXT = {script = true, style = true, textarea = true, title = true, xmp = true,
    iframe = true, noembed = true, noframes = true}

local function tag_end(markup: string, pos: integer): integer?
    while pos <= #markup do
        local first = markup:find([=[[>"']]=], pos)
        if not first then return nil end
        local marker = markup:sub(first, first)
        if marker == ">" then return first end
        local closing = markup:find(marker, first + 1, true)
        if not closing then return nil end
        pos = closing + 1
    end
    return nil
end

local function attribute_value(markup: string, pos: integer): (string, integer)
    local quote = markup:sub(pos, pos)
    if quote == '"' or quote == "'" then
        local last = markup:find(quote, pos + 1, true) or (#markup + 1)
        return markup:sub(pos + 1, last - 1), last + 1
    end
    local _, ending, value = markup:find("^([^%s>]+)", pos)
    return value or "", ending and ending + 1 or pos
end

local function cid(value: string): string?
    value = value:gsub("&#([0-9]+);?", function(digits)
        local byte = tonumber(digits)
        return byte and byte < 128 and string.char(byte) or nil
    end):gsub("&#[xX]([0-9a-fA-F]+);?", function(digits)
        local byte = tonumber(digits, 16)
        return byte and byte < 128 and string.char(byte) or nil
    end):gsub("&colon;", ":")
    return value:match("^%s*[cC][iI][dD]:([%w._@+%-]+)%s*$")
end

local function referenced_ids(markup: string): {[string]: boolean}
    local ids: {[string]: boolean} = {}
    local lower: string?
    local pos = 1
    while pos <= #markup do
        local start = markup:find("<", pos, true)
        if not start then break end
        if markup:sub(start, start + 3) == "<!--" then
            local closing = markup:find("-->", start + 4, true)
            if not closing then break end
            pos = closing + 3
        else
            local _, tag_name_end, tag = markup:find("^<([%a][%w:%-]*)", start)
            if tag and tag_name_end then
                tag = tag:lower()
                pos = tag_name_end + 1
                while pos <= #markup do
                    local _, finish, attr = markup:find("^[%s/]*([^%s/=>]+)", pos)
                    if not attr or not finish then break end
                    pos = finish + 1
                    local _, equals = markup:find("^%s*=%s*", pos)
                    if equals then
                        local value
                        value, pos = attribute_value(markup, equals + 1)
                        if URL_ATTRIBUTES[attr:lower()] then
                            local id = cid(value)
                            if id then ids[id] = true end
                        end
                    end
                end
                local ending = tag_end(markup, pos)
                if not ending or tag == "plaintext" then break end
                pos = ending + 1
                if RAW_TEXT[tag] then
                    lower = lower or markup:lower()
                    local closing = lower:find("</" .. tag .. "[%s/>]", pos)
                    if not closing then break end
                    pos = closing
                end
            elseif markup:sub(start + 1, start + 1):match("[!/?]") then
                local ending = tag_end(markup, start + 2)
                if not ending then break end
                pos = ending + 1
            else
                pos = start + 1
            end
        end
    end
    return ids
end

function M.referenced(markup: string, id: string): boolean
    return referenced_ids(markup)[id] == true
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
    local ids = referenced_ids(html)
    for _, item in ipairs(items) do
        local id = (context[item.name] :: string):sub(#"cid:" + 1)
        if ids[id] then
            selected[#selected + 1] = M.reference(item, id)
        end
    end
    return selected
end

return M
