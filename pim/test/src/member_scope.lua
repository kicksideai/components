-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Resolves the same persisted group composition used by authenticated HTTP calls.
local contract = require("contract")
local security = require("security")
local execution_identity = require("execution_identity")
local M = {}
function M.resolve(actor: security.Actor): (security.Scope?, error?)
    local definition, err = contract.get("kickside.contract:scope_resolver")
    if err then return nil, err end
    local bound, berr = definition:with_actor(actor)
    if berr then return nil, berr end
    local scoped, serr = bound:with_scope(security.scope())
    if serr then return nil, serr end
    local resolver, oerr = scoped:open("kickside.users:scope_resolver_binding")
    if oerr then return nil, oerr end
    local result, rerr = resolver:resolve({ principal = { kind = "user", id = actor:id() } })
    if rerr then return nil, rerr end
    return execution_identity.scope_from_groups(result.scope_groups or {}, result.scope_policy_ids)
end
return M
