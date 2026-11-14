-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Component teardown runs after the platform commits its deletion fence. The lifecycle
-- report lets the reaper remove the components the board owns, such as plugin attachments.
local ctx = require("ctx")
local lifecycle = require("lifecycle")
local lifecycle_report = require("lifecycle_report")
local types = require("types")
local M = {}

function M.handle(_request: unknown): (types.DeleteResult?, error?)
    local board_id = ctx.get("component_id")
    if type(board_id) ~= "string" or board_id == "" then
        return nil, errors.new({ kind = errors.INVALID, message = "component_id required", details = { code = "component_id_required" } })
    end
    local deleted, err = lifecycle.delete(board_id)
    if err or not deleted then return nil, err end
    if not deleted.success then
        return nil, errors.new({ kind = errors.CONFLICT, retryable = true, message = "board cleanup has another bounded page",
            details = { code = "cleanup_pending", cleanup_pending = true, needs_continue = true } })
    end
    local reported, rerr = lifecycle_report.component_deleted(board_id)
    if rerr or not reported then return nil, rerr end
    return deleted, nil
end

return M
