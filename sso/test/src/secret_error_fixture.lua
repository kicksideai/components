-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local M = {status = 400, body = "sso-error-secret-sentinel", failure = nil}
function M.post()
    if M.failure then return nil, M.failure end
    return {status_code = M.status, body = M.body}, nil
end
return M
