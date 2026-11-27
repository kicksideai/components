-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local types = require("types")

local M = {}

function M.data(values: types.Appearance): types.RenderGlobals
    return {
        site = {title = type(values.title) == "string" and values.title or "", url = values.url or ""},
        sender = {name = type(values.sender_name) == "string" and values.sender_name or ""},
    }
end

function M.context(values: types.RenderGlobals, vars: types.JsonObject, subject: string): types.JsonObject
    local data: types.JsonObject = {}
    for key, value in pairs(vars) do data[key] = value end
    data.vars = vars
    data.site = {title = values.site.title, url = values.site.url}
    data.sender = {name = values.sender.name}
    data.message = {subject = subject, preheader = type(vars.preheader) == "string" and vars.preheader or subject}
    return data
end

return M
