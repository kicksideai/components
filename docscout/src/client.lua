-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local contract = require("contract")
local security = require("security")
local M = {}
function M.run(input: any): (any?, error?)
    local definition, err = contract.get("kickside.docscout:extraction")
    if err then return nil, err end
    local instance, open_err = definition:with_actor(security.actor()):with_scope(security.scope()):open("kickside.docscout:engine")
    if open_err then return nil, open_err end
    return instance:run(input)
end
return M
