-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Data boundaries retain native classification beside their DataError fields.
local failure = require("failure")
local M = {}
type Failure = { success: boolean, error: { code: string, message: string, retriable: boolean, scope: string,
    details: { [string]: unknown } } }
M.Failure = Failure
function M.failure(err: error, code: string?, scope: string?): Failure
    local kind = err:kind()
    local mapped = code
    if not mapped then
        if kind == errors.INVALID then mapped = "invalid_request"
        elseif kind == errors.PERMISSION_DENIED then mapped = "permission_denied"
        elseif kind == errors.NOT_FOUND then mapped = "not_found"
        elseif kind == errors.CONFLICT then mapped = "conflict"
        else mapped = "provider_unavailable" end
    end
    local allowed: {[string]:boolean}={auth_expired=true,rate_limited=true,invalid_config=true,invalid_request=true,not_found=true,conflict=true,permission_denied=true,
        provider_unavailable=true,provider_error=true,cursor_expired=true,history_unavailable=true,stalled=true,dependency_missing=true,idempotency_conflict=true,unknown=true}
    if mapped=="source_gap" then mapped="cursor_expired" end
    if not allowed[mapped :: string] then mapped="provider_unavailable" end
    err = failure.coded(err, mapped :: string)
    local details = err:details() or {}
    details.kind, details.retryable = kind, err:retryable()
    return { success = false, error = { code = mapped, message = err:message(), retriable = err:retryable() == true, scope = scope or "item",
        details = details } }
end
return M
