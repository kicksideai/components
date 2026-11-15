-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local defaults = require("defaults")
local clock = require("clock")
local types = require("types")
local M = {}
M.DEFINITIONS = {
    storage_batch = { default = 100, min = 1, max = 1000 },
    plugin_projection_batch = { default = 20, min = 1, max = 100 },
    plugin_discovery_batch = { default = 200, min = 1, max = 200 },
    projection_catchup_ticks = { default = 1000, min = 1, max = 100000 },
    cleanup_batch = { default = 100, min = 1, max = 5000 },

    rebuild_batch = { default = 500, min = 1, max = 500 },
    rebuild_batches_per_run = { default = 20, min = 1, max = 100 },
    migration_batch = { default = 500, min = 1, max = 500 },
    migration_batches_per_run = { default = 20, min = 1, max = 100 },
    rebalance_batch = { default = 500, min = 1, max = 500 },
    rebalance_batches_per_run = { default = 20, min = 1, max = 100 },
    pack_steps_per_run = { default = 20, min = 1, max = 100 },
    operation_batches_per_run = { default = 20, min = 1, max = 100 },
    recovery_batch = { default = 100, min = 1, max = 500 },
    recovery_batches_per_run = { default = 4, min = 1, max = 100 },
    plugin_batch = { default = 20, min = 1, max = 100 },
    plugin_batches_per_run = { default = 1, min = 1, max = 100 },

    command_deadline_ms = { default = 5000, min = 1, max = 60000 },
    read_deadline_ms = { default = 2000, min = 1, max = 60000 },
    -- Native slot draining needs 205 units to make progress.
    retention_batch = { default = 500, min = 205, max = 5000 },
    bulk_batch_items = { default = 200, min = 1, max = 2000 },
    bulk_batch_ops = { default = 200, min = 1, max = 200 },
}
function M.validate(key: string, value: unknown): error?
    local rule: types.SettingRule? = M.DEFINITIONS[key]
    if not rule or type(value) ~= "number" or math.tointeger(value) == nil or value < rule.min or value > rule.max then
        return errors.new({ kind = errors.INVALID, message = key .. " is an integer in " .. (rule and (rule.min .. ".." .. rule.max) or "a declared range"),
            details = { code = "invalid_setting", key = key } })
    end
    return nil
end
function M.read(): (types.OperationalLimits?, error?)
    local values, err = defaults.namespace("kickside.work")
    if err or not values then return nil, err end
    local out: { [string]: integer } = {}
    for key in pairs(M.DEFINITIONS) do
        local verr = M.validate(key, values[key])
        if verr then return nil, verr end
        out[key] = values[key] :: integer
    end
    return out :: types.OperationalLimits, nil
end
function M.deadline(key: string): (types.Deadline?, error?)
    local values, err = M.read()
    if err or not values then return nil, err end
    return clock.deadline(values[key] :: integer), nil
end
return M
