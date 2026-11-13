-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Board policy values override application defaults.
local types = require("types")
local registry = require("registry")
local durations = require("durations")
local consts = require("consts")
local M = {}
M.DEFAULTS = { audit = "fields", audit_days = 365, trash_days = 14, tombstone_days = 365, interval_days = 0, stage_timeout = "PT1H", stage_max_visits = 5 }
function M.upgrade(compiled: types.Compiled)
    for _, key in ipairs({ "stage_timeout", "stage_max_visits" }) do
        if compiled.policy[key] == nil then compiled.policy[key] = M.DEFAULTS[key] end
    end
end
function M.event_days(): (integer?, error?)
    local entry, err = registry.get(consts.BOARD_IMPL)
    if err then return nil, err end
    local retention = entry and entry.meta and entry.meta.retention
    local days = type(retention) == "table" and retention.event_days
    days = type(days) == "number" and math.tointeger(days) or nil
    if not days or days < 1 then
        return nil, errors.new({ kind = errors.INTERNAL, message = "board event retention requires positive days", details = { code = "invalid_retention_policy" } })
    end
    return days :: integer, nil
end

function M.check(own: unknown): error?
    if own == nil then return nil end
    if type(own) ~= "table" then return errors.new({ kind = errors.INVALID, message = "policy is an object", details = { code = "invalid_policy" } }) end
    for key, value in pairs(own :: types.JsonObject) do
        if M.DEFAULTS[key] == nil and key ~= "wip" then
            return errors.new({ details = { code = "invalid_policy" }, kind = errors.INVALID, message = "unknown board policy " .. key })
        end
        if key == "wip" then
            if type(value) ~= "table" then return errors.new({ kind = errors.INVALID, message = "wip is a state limit map", details = { code = "wip_policy_invalid" } }) end
            for state, rule in pairs(value :: types.Wip) do
                if type(state) ~= "string" or type(rule) ~= "table" or math.type(rule.limit) ~= "integer" or rule.limit < 0
                    or (rule.hard ~= nil and type(rule.hard) ~= "boolean") then
                    return errors.new({ kind = errors.INVALID, message = "wip limit is a nonnegative integer with optional hard boolean", details = { code = "wip_policy_invalid" } })
                end
                for name in pairs(rule) do
                    if name ~= "limit" and name ~= "hard" then return errors.new({ kind = errors.INVALID, message = "unknown wip property " .. name, details = { code = "wip_policy_invalid" } }) end
                end
            end
        elseif key == "stage_max_visits" then
            if type(value) ~= "number" or math.type(value) ~= "integer" or value < 1 then
                return errors.new({ kind = errors.INVALID, message = "stage_max_visits is a positive integer", details = { code = "invalid_policy" } })
            end
        elseif key == "stage_timeout" then
            local _, err = durations.duration(value)
            if err then return err end
        elseif key == "audit" then
            if value ~= "fields" and value ~= "off" then return errors.new({ details = { code = "invalid_policy" }, kind = errors.INVALID, message = "audit is fields or off" }) end
        elseif type(value) ~= "number" or math.tointeger(value) == nil or (value :: number) < 0 then
            return errors.new({ details = { code = "invalid_policy" }, kind = errors.INVALID, message = key .. " is a nonnegative integer" })
        end
    end
    return nil
end
function M.effective(defaults: types.JsonObject, own: types.PolicyDecl?): (types.Policy?, error?)
    local values: types.JsonObject = {}
    for key, value in pairs(M.DEFAULTS) do values[key] = defaults[key] == nil and value or defaults[key] end
    for key, value in pairs(own or {}) do values[key] = value end
    local err = M.check(values)
    if err then return nil, err end
    return values :: types.Policy, nil
end
return M
