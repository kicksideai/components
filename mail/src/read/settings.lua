-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local types = require("types")
local config = require("config")
local mail_config = require("mail_config")
local policy = require("policy")
local env = require("env")
local funcs = require("funcs")
local security = require("security")

local M = {}

function M.driver(): (types.DriverSelection?, error?)
    local selection, err = funcs.call("kickside.mail.read:driver_selection")
    return selection :: types.DriverSelection?, err
end

function M.mail(): (types.Settings?, error?)
    local values, err = config.settings("kickside.mail")
    return values :: types.Settings?, err
end

function M.retention_window(): (integer?, error?)
    local values, err = M.mail()
    if err then return nil, err end
    local days = policy.retention_days(values.log_retention_days)
    if not days then return nil, mail_config.setup_error("Mail delivery log retention days are invalid") end
    return days * policy.DAY_MS, nil
end

function M.appearance(): (types.Appearance?, error?)
    local values, err = config.settings("kickside.ui")
    if err then return nil, err end
    local url, url_err = env.get("PUBLIC_API_URL")
    if url_err and url_err:kind() ~= errors.NOT_FOUND then return nil, url_err end
    local actor, actor_err = security.actor()
    if actor_err then return nil, actor_err end
    local meta = actor and actor:meta()
    return {title = values.title, url = url, sender_name = meta and meta.full_name}, nil
end

return M
