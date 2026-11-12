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
    for _, page in ipairs(input.sequence) do assert(reader.read(source, page)) end
    return true
end
return M
