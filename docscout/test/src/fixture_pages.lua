-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local json = require("json")
local png = require("png")
local M = {}
function M.render(req)
    local pages = assert(json.decode(req.ref.bytes))
    if req.count_only then return {ok = {total = #pages}} end
    local page = req.pages[1]
    if type(pages[page]) == "table" and pages[page].error then return {err = pages[page].error} end
    return {ok = {total = #pages, pages = {{page = page, format = "png", bytes = png.page({pages[page]})}}}}
end
return M
