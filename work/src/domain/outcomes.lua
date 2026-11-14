-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local types = require("types")
local M = {}

function M.error(status: string, findings: { types.Finding }?): error?
    if status == "applied" or status == "unchanged" then return nil end
    local kind = status == "denied" and errors.PERMISSION_DENIED or status == "conflict" and errors.CONFLICT
        or status == "unavailable" and errors.UNAVAILABLE or errors.INVALID
    local finding = findings and findings[1]
    return errors.new({ kind = kind, message = finding and finding.message or "item command refused",
        details = { code = finding and finding.code or "command_refused", findings = findings } })
end
return M
