-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Application defaults come from the settings contract; board values override them.
local contract = require("contract")
local policy = require("policy")
local types = require("types")
local M = {}
function M.namespace(namespace: string): (types.JsonObject?, error?)
    local definition, err = contract.get("kickside.settings:settings")
    if err then return nil, err end
    if not definition then return nil, errors.new({ details = { code = "contract_unavailable" },  kind = errors.UNAVAILABLE, message = "settings contract unavailable" }) end
    local client, oerr = definition:open()
    if oerr or not client then return nil, oerr end
    local result, rerr = client:get_namespace({ namespace = namespace })
    if rerr then return nil, rerr :: error end
    if not result or result.success ~= true then return nil, errors.new({ details = { code = "contract_unavailable" },  kind = errors.UNAVAILABLE, message = "settings namespace unreadable" }) end
    return (result.values or {}) :: types.JsonObject, nil
end
function M.read(): (types.Policy?, error?)
    local values, err = M.namespace("kickside.work")
    if err or not values then return nil, err end
    for _, key in ipairs({ "audit", "audit_days", "trash_days", "tombstone_days", "interval_days" }) do
        if values[key] == nil then return nil, errors.new({ details = { code = "contract_unavailable" },  kind = errors.UNAVAILABLE, message = "setting kickside.work." .. key .. " is unavailable" }) end
    end
    local effective, verr = policy.effective(values, nil)
    return effective, verr
end
return M
