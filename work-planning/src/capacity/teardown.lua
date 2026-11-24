-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local ctx = require("ctx")
local storage = require("storage")

local function delete(): ({ success: boolean }?, error?)
    local attachment = ctx.get("component_id") :: string
    local complete, err = storage.delete_attachment(attachment)
    if err then return nil, err end
    if not complete then
        return nil, errors.new({ kind = errors.CONFLICT, retryable = true, message = "Planning attachment cleanup has another page.",
            details = { code = "cleanup_pending", cleanup_pending = true, needs_continue = true } })
    end
    return { success = true }, nil
end

return { delete = delete }
