-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Board policy values override application defaults.
local types = require("types")
local sql = require("sql")
local durations = require("durations")
local consts = require("consts")
local core_policy = require("core_policy")
local clock = require("clock")
local M = {}
M.DEFAULTS = { audit = "fields", audit_days = 365, trash_days = 14, tombstone_days = 365, interval_days = 365, stage_timeout = "PT1H", stage_max_visits = 5, comments_per_item = 10000 }
function M.event_window_ms(stored: types.Row?): (integer?, error?)
    if stored and (stored.enabled == false or stored.enabled == 0) then return nil, nil end
    if stored and stored.event_hot_retention_days ~= nil then
        local days = math.tointeger(tonumber(stored.event_hot_retention_days))
        if not days or days < 1 or days > consts.MAX_DURATION_DAYS then
            return nil, errors.new({ kind = errors.INTERNAL, message = "board event retention requires days in 1.." .. consts.MAX_DURATION_DAYS, details = { code = "invalid_retention_policy" } })
        end
        return days * 86400000, nil
    end
    local defaults, err = core_policy.policy()
    if err or not defaults then return nil, err end
    return defaults.events_ms :: integer, nil
end

function M.event_window(db: sql.DB, board_id: string): (types.EventWindow?, error?)
    local rows, err = db:query("SELECT event_hot_retention_days, enabled FROM kickside_retention_policy WHERE thread_id = $1", { board_id })
    if err then return nil, errors.wrap(err, "failed to load board event retention policy") end
    local ms, window_err = M.event_window_ms(rows and rows[1])
    if window_err then return nil, window_err end
    return { ms = ms, before = ms and clock.deadline(-ms).at }, nil
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
        elseif key == "comments_per_item" then
            if type(value) ~= "number" or math.tointeger(value) == nil or value < 1 or value > 100000 then
                return errors.new({ kind = errors.INVALID, message = "comments_per_item is an integer in 1..100000", details = { code = "invalid_policy" } })
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
        elseif type(value) ~= "number" or math.tointeger(value) == nil or (value :: number) < 0 or (value :: number) > consts.MAX_DURATION_DAYS then
            return errors.new({ details = { code = "invalid_policy" }, kind = errors.INVALID, message = key .. " is an integer in 0.." .. consts.MAX_DURATION_DAYS })
        end
    end
    return nil
end
function M.effective(defaults: types.JsonObject, own: types.PolicyDecl?): (types.Policy?, error?)
    local values: types.JsonObject = {}
    for key, value in pairs(M.DEFAULTS) do values[key] = defaults[key] == nil and value or defaults[key] end
    for key, value in pairs(own or {}) do values[key] = value end
    -- Zero windows select the finite defaults.
    for _, key in ipairs({ "audit_days", "interval_days" }) do
        if values[key] == 0 then values[key] = M.DEFAULTS[key] end
    end
    local err = M.check(values)
    if err then return nil, err end
    return values :: types.Policy, nil
end
return M
