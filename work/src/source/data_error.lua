-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local types = require("types")
-- DataError keeps the native kind and condition code at data boundaries.
local M = {}

function M.failure(err: error): types.Failure
    local kind = err:kind()
    local details = err:details() or {}
    local code = details.code
    if type(code) ~= "string" then
        code = kind == errors.PERMISSION_DENIED and "permission_denied" or kind == errors.NOT_FOUND and "not_found"
            or kind == errors.CONFLICT and "conflict" or kind == errors.INVALID and "invalid_request" or "source_unavailable"
    end
    return { success = false, error = { code = code, message = err:message(), retriable = err:retryable() == true,
        scope = "item", kind = kind, details = details } }
end
return M
