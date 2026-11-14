-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- The probe exposes the command deadline received from a process batch.
local commands = require("commands")
local M = {}
function M.apply(request: commands.ApplyRequest, boundary: { at: string, ns: integer }?): (commands.ApplyResult?, error?)
    if request.board_id ~= "deadline" then
        return { outcomes = { { status = request.board_id, findings = { { code = "dependency_offline", message = "dependency is offline" } } } } } :: commands.ApplyResult, nil
    end
    return nil, errors.new({ kind = errors.TIMEOUT, message = "process command deadline",
        details = { code = "deadline_probe", deadline = boundary and boundary.at, deadline_ns = boundary and tostring(boundary.ns) } })
end
return M
