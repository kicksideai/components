-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Declaration/lifecycle boundary. Delivery is implemented by the launch adapter;
-- until then keep Automation deliveries retryable without acknowledging a run.
local M = {}
function M.write(_request: unknown): unknown
    return { success = false, error = { code = "provider_unavailable", scope = "flow", retriable = true,
        message = "Work stage delivery is not available", retry_after_ms = 2000 } }
end
return M
