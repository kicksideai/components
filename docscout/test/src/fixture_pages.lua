-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local json = require("json")
local fs = require("fs")
local reader = require("pages")
local png = require("png")
local M = {}
function M.render(req)
    local pages = assert(json.decode(req.ref.bytes))
    if req.count_only then return {ok = {total = #pages}} end
    local page = req.pages[1]
    if type(pages[page]) == "table" and pages[page].error then return {err = pages[page].error} end
    local text = pages[page]
    if type(text) == "table" then
        local storage = assert(fs.get("app:uploads"))
        local reads = assert(json.decode(assert(storage:readfile(text.record))))
        reads[tostring(page)] = (reads[tostring(page)] or 0) + 1
        assert(storage:writefile(text.record, assert(json.encode(reads))))
        text = text.text
    end
    return {ok = {total = #pages, pages = {{page = page, format = "png", bytes = png.page({text})}}}}
end
function M.read(input)
    local source = assert(reader.discover(input.upload_id))
    if input.replace then
        -- Model an entry stored after the initial miss and before insertion.
        setmetatable(source.images.entries, {__index = function(entries, page)
            rawset(entries, page, {image = {bytes = "old"}, used = 0})
            source.images.bytes = 3
            setmetatable(entries, nil)
            return nil
        end})
    end
    for _, page in ipairs(input.sequence) do assert(reader.read(source, page)) end
    local retained_bytes = 0
    for _, entry in pairs(source.images.entries) do retained_bytes = retained_bytes + #entry.image.bytes end
    return {bytes = source.images.bytes, retained_bytes = retained_bytes}
end
return M
