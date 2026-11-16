-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Opens the catalog contract under the caller's actor and scope.
local contract = require("contract")
local security = require("security")
local failure = require("failure")
local M = {}
type Input = { [string]: unknown }
type Catalog = { [string]: (Catalog, Input) -> (unknown, error?) }
M.Catalog = Catalog
function M.open(): (Catalog?, error?)
    local def, err = contract.get("kickside.pim:catalog")
    if err then return nil, failure.coded(errors.wrap(err, "catalog contract lookup"), "contract_unavailable") end
    if not def then return nil, errors.new({ kind = errors.UNAVAILABLE, retryable = true, message = "catalog contract unavailable", details = { code = "contract_unavailable" } }) end
    local client, oerr = def:with_actor(security.actor()):with_scope(security.scope()):open()
    if oerr then return nil, failure.coded(errors.wrap(oerr, "catalog contract open"), "contract_unavailable") end
    if not client then return nil, errors.new({ kind = errors.UNAVAILABLE, retryable = true, message = "catalog contract open returns no client", details = { code = "contract_unavailable" } }) end
    return client :: Catalog, nil
end
return M
