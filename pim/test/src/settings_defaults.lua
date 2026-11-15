-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Reads the PIM deployment defaults from the kickside.pim settings namespace.
local contract = require("contract")
local policy = require("policy")
local types = require("types")

local M = {}

local SETTINGS_CONTRACT = "kickside.settings:settings"
local NAMESPACE = "kickside.pim"

-- read() reads the deployment defaults; a settings failure is an error.
function M.read(): (types.Policy?, error?)
    local def, err = contract.get(SETTINGS_CONTRACT)
    if err then return nil, errors.wrap(err, "settings contract unavailable") end
    if not def then return nil, errors.new({ kind = errors.UNAVAILABLE, retryable = true, message = "settings contract unavailable", details = { code = "contract_unavailable" } }) end
    local client, oerr = def:open()
    if oerr then return nil, errors.wrap(oerr, "settings open failed") end
    if not client then return nil, errors.new({ kind = errors.UNAVAILABLE, retryable = true, message = "settings open returned no client", details = { code = "contract_unavailable" } }) end
    local read: { [string]: string | integer } = {}
    for key in pairs(policy.KEYS) do
        local res, gerr = client:get({ namespace = NAMESPACE, key = key })
        if gerr then return nil, errors.wrap(gerr, "settings read failed") end
        if type(res) ~= "table" or res.success ~= true then
            if type(res) == "table" and type(res.error) == "userdata" then return nil, errors.wrap(res.error, "settings read failed") end
            return nil, errors.new({ kind = errors.UNAVAILABLE, retryable = true,
                message = "setting is unreadable", details = { code = "settings_unavailable", namespace = NAMESPACE, key = key } })
        end
        local value = res.value
        local bad = policy.check(key, value)
        if bad then return nil, errors.new({ kind = errors.INTERNAL, retryable = false, message = bad, details = { code = "settings_value_invalid", namespace = NAMESPACE, key = key } }) end
        read[key] = key == "audit" and (value :: string) or (math.tointeger(value) :: integer)
    end
    return { audit = read.audit :: string, audit_days = read.audit_days :: integer, trash_days = read.trash_days :: integer,
        tombstone_days = read.tombstone_days :: integer }, nil
end

-- namespace reads every effective value of a settings namespace (a plugin's
-- app-level values); a settings failure is an error.
function M.namespace(ns: string): (types.JsonObject?, error?)
    local def, err = contract.get(SETTINGS_CONTRACT)
    if err then return nil, errors.wrap(err, "settings contract unavailable") end
    if not def then return nil, errors.new({ kind = errors.UNAVAILABLE, retryable = true, message = "settings contract unavailable", details = { code = "contract_unavailable" } }) end
    local client, oerr = def:open()
    if oerr then return nil, errors.wrap(oerr, "settings open failed") end
    if not client then return nil, errors.new({ kind = errors.UNAVAILABLE, retryable = true, message = "settings open returned no client", details = { code = "contract_unavailable" } }) end
    local res, gerr = client:get_namespace({ namespace = ns })
    if gerr then return nil, errors.wrap(gerr, "settings read failed") end
    if type(res) ~= "table" or res.success ~= true then
        if type(res) == "table" and type(res.error) == "userdata" then return nil, errors.wrap(res.error, "settings namespace read failed") end
        return nil, errors.new({ kind = errors.UNAVAILABLE, retryable = true, message = "settings namespace unreadable",
            details = { code = "settings_unavailable", namespace = ns } })
    end
    local values = res.values
    if values == nil then return {}, nil end
    if type(values) ~= "table" then return nil, errors.new({ kind = errors.INTERNAL, retryable = false, message = "settings namespace is not an object", details = { code = "settings_value_invalid", namespace = ns } }) end
    return values :: types.JsonObject, nil
end

return M
