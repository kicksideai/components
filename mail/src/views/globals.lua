-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local types = require("types")
local registry = require("registry")
local env = require("env")
local security = require("security")
local settings = require("settings")

local M = {}

function M.read(): (types.RenderGlobals?, error?)
    local appearance, settings_err = settings.read("kickside.ui")
    if settings_err then return nil, settings_err end
    local title = appearance.title
    if type(title) ~= "string" or title == "" then
        local app, app_err = registry.get("app:definition")
        if app_err and app_err:kind() ~= errors.NOT_FOUND then return nil, app_err end
        title = app and app.meta.title
    end
    local url, url_err = env.get("PUBLIC_API_URL")
    if url_err and url_err:kind() ~= errors.NOT_FOUND then return nil, url_err end
    local actor, actor_err = security.actor()
    if actor_err then return nil, actor_err end
    local actor_meta = actor and actor:meta()
    local name = actor_meta and actor_meta.full_name
    return {
        site = {title = type(title) == "string" and title or "", url = url or ""},
        sender = {name = type(name) == "string" and name or ""},
    }, nil
end

function M.library_samples(): (types.RenderGlobals?, error?)
    local values, err = M.read()
    if not values then return nil, err end
    values.sender.name = ""
    return values, nil
end

function M.data(values: types.RenderGlobals, vars: types.JsonObject, subject: string): types.JsonObject
    local data: types.JsonObject = {}
    for key, value in pairs(vars) do data[key] = value end
    data.vars = vars
    data.site = {title = values.site.title, url = values.site.url}
    data.sender = {name = values.sender.name}
    data.message = {subject = subject, preheader = type(vars.preheader) == "string" and vars.preheader or subject}
    return data
end

return M
