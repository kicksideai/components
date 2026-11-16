-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- The native error PIM raises most.
local error_envelope = require("error_envelope")
local M = {}

-- invalid is the error of a request that cannot be served as stated.
function M.invalid(message: string, details: { [string]: unknown }?): error
    local d = details or {}
    d.code = d.code or "invalid_request"
    return errors.new({ kind = errors.INVALID, retryable = false, message = message, details = d })
end

-- coded supplies a boundary code while retaining the source error's fields.
function M.coded(err: error, code: string): error
    local details = err:details()
    if details and type(details.code) == "string" and details.code ~= "" then return err end
    return error_envelope.wrap(err, "PIM boundary", { code = code })
end

function M.corrupt(message: string, field: string?): error
    return errors.new({kind=errors.INTERNAL,retryable=false,message=message,details={code="row_corrupt",field=field}})
end
function M.unknown_source(source: string): error
    return M.invalid("unknown source " .. source, {code="unknown_source",source=source})
end
return M
