-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Portable failures retain their existing shape and the native error's fields.
local types = require("types")
local failure = require("failure")
local M = {}
function M.failure(err: error): types.PortableResult
    err = failure.coded(err, "internal")
    return { success = false, error = err:message(), kind = err:kind(), message = err:message(), retryable = err:retryable(), details = err:details() :: types.JsonObject? }
end
return M
