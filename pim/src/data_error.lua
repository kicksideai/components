-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Data boundaries retain native classification beside their DataError fields.
local failure = require("failure")
local M = {}
type Code = "auth_expired" | "rate_limited" | "invalid_config" | "invalid_request" | "not_found" | "conflict"
    | "permission_denied" | "provider_unavailable" | "provider_error" | "cursor_expired" | "history_unavailable"
    | "stalled" | "dependency_missing" | "idempotency_conflict" | "unknown"
type CodeOverride = Code | "source_gap" | "contract_unavailable"
type NativeDetails = { code: string?, kind: string?, retryable: boolean? } & { [string]: unknown }
type Failure = { success: boolean, error: { code: Code, message: string, retriable: boolean, scope: string,
    details: NativeDetails } }
M.CodeOverride = CodeOverride
M.Failure = Failure

local function boundary_code(kind: string, override: CodeOverride?): Code
    if override == "source_gap" then return "cursor_expired" end
    if override == "contract_unavailable" then return "provider_unavailable" end
    if override then return override end
    if kind == errors.INVALID then return "invalid_request" end
    if kind == errors.PERMISSION_DENIED then return "permission_denied" end
    if kind == errors.NOT_FOUND then return "not_found" end
    if kind == errors.CONFLICT then return "conflict" end
    return "provider_unavailable"
end

function M.failure(err: error, override: CodeOverride?, scope: string?): Failure
    local kind = err:kind()
    local code = boundary_code(kind, override)
    err = failure.coded(err, code)
    local details = (err:details() or {}) :: NativeDetails
    details.kind, details.retryable = kind, err:retryable()
    return { success = false, error = { code = code, message = err:message(), retriable = err:retryable() == true, scope = scope or "item",
        details = details } }
end

function M.publications(err: error): Failure
    local details = err:details()
    if details and details.code == "cursor_expired" then return M.failure(err, "cursor_expired") end
    return M.failure(err, err:kind() == errors.INVALID and "invalid_config" or nil)
end

function M.write(err: error): Failure
    local details = err:details()
    if err:kind() == errors.CONFLICT and details and details.code == "idempotency_conflict" then
        return M.failure(err, "idempotency_conflict")
    end
    return M.failure(err)
end

return M
