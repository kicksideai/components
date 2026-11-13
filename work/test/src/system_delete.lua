-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Exercises Core's trusted teardown as its maintenance identity.
local security = require("security")
local component = require("component")
local M = {}
function M.run(input: unknown): (boolean, error?)
    if not security.can("work.testing.system_delete", "app:system_delete") then
        return false, errors.new({ kind = errors.PERMISSION_DENIED, message = "harness maintenance authority required" })
    end
    return component.system_delete(input.board_id :: string)
end
return M
