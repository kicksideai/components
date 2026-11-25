-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local ctx = require("ctx")
local component = require("component")
local storage = require("storage")

local function forbidden(): error
    return errors.new({ kind = errors.PERMISSION_DENIED, message = "Planning attachment deletion has not been committed.",
        details = { code = "planning_attachment_not_deleting" } })
end

local function delete(): ({ success: boolean }?, error?)
    local attachment = ctx.get("component_id")
    if type(attachment) ~= "string" or attachment == "" then return nil, forbidden() end
    local rows, lookup_err = component.list_system({ component_ids = { attachment }, limit = 1 })
    if lookup_err then return nil, lookup_err end
    local row = rows and rows[1]
    if not row or row.impl_id ~= "kickside.work.planning:attachment" or not row.deleting_at then
        return nil, forbidden()
    end
    local complete, err = storage.delete_attachment(attachment)
    if err then return nil, err end
    if not complete then
        return nil, errors.new({ kind = errors.CONFLICT, retryable = true, message = "Planning attachment cleanup has another page.",
            details = { code = "cleanup_pending", cleanup_pending = true, needs_continue = true } })
    end
    return { success = true }, nil
end

return { delete = delete }
