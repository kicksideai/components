-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local types = require("types")
-- Opens the board contract under the caller's actor and scope.
local contract = require("contract")
local security = require("security")
local M = {}


function M.open(contract_id: string?): (types.BoardClient?, error?)
    local definition, err = contract.get(contract_id or "kickside.work:board")
    if err then return nil, errors.wrap(err, "board contract lookup") end
    if not definition then
        return nil, errors.new({ kind = errors.UNAVAILABLE, message = "board contract unavailable", details = { code = "contract_unavailable" } })
    end
    local client, open_err = definition:with_actor(security.actor()):with_scope(security.scope()):open()
    if open_err then return nil, errors.wrap(open_err, "board contract open") end
    if not client then
        return nil, errors.new({ kind = errors.INTERNAL, message = "board contract returns no client", details = { code = "contract_unavailable" } })
    end
    return client :: types.BoardClient, nil
end
function M.call(method: string, input: types.Row, contract_id: string?): (unknown, error?)
    local client, err = M.open(contract_id)
    if err or not client then return nil, err end
    local fn = client[method]
    if not fn then
        return nil, errors.new({ kind = errors.INTERNAL, message = "board contract method unavailable", details = { code = "method_unavailable", method = method } })
    end
    return fn(client, input)
end
return M
