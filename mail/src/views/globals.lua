-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local types = require("types")
local registry = require("registry")
local env = require("env")
local security = require("security")

local M = {}

function M.data(vars: types.JsonObject, subject: string): (types.JsonObject?, error?)
    local app, app_err = registry.get("app:definition")
    if app_err and app_err:kind() ~= errors.NOT_FOUND then return nil, app_err end
    local url, url_err = env.get("PUBLIC_API_URL")
    if url_err and url_err:kind() ~= errors.NOT_FOUND then return nil, url_err end
    local actor = security.actor()
    local actor_meta = actor and actor:meta()
    local name = actor_meta and actor_meta.full_name
    local title = app and app.meta.title
    local data: types.JsonObject = {}
    for key, value in pairs(vars) do data[key] = value end
    data.vars = vars
    data.site = {title = type(title) == "string" and title or "", url = url or ""}
    data.sender = {name = type(name) == "string" and name or ""}
    data.message = {subject = subject, preheader = type(vars.preheader) == "string" and vars.preheader or subject}
    return data, nil
end

return M
