-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local contract = require("contract")
local admission = require("admission")
local types = require("types")
local M = {}
function M.write(request: types.LaunchRequest): (types.WorkflowResult?, error?)
    local definition, err = contract.get("kickside.data:writable")
    if err or not definition then return nil, err end
    local sink, open_err = definition:open("kickside.workflows:run")
    if open_err or not sink then return nil, open_err end
    local written, write_err = sink:write(request)
    return written :: types.WorkflowResult?, write_err :: error?
end
-- A refusal after an earlier ambiguous delivery must not close a reserved run.
function M.find(flow_id: string, launcher_id: string, key: string): (unknown, error?)
    return admission.find(flow_id, launcher_id, key)
end
return M
