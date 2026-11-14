-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Harness-only appends establish raw log states for fold and storage tests.
local contract = require("contract")
local security = require("security")
local M = {}
function M.run(input: unknown): (unknown, error?)
    if not security.can("work.testing.append", "app:trusted_append") then
        return nil, errors.new({ kind = errors.PERMISSION_DENIED, message = "harness append authority required" })
    end
    local def = assert(contract.get("kickside.core:threads"))
    local client = assert(def:with_actor(security.actor()):with_scope(security.scope()):open())
    return client:append_events(input)
end
return M
