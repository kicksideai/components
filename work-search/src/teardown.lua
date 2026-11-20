-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local ctx = require("ctx")
local component = require("component")
local storage = require("storage")
local sql = require("sql")

local function delete(): ({ success: boolean }?, error?)
    local attachment = ctx.get("component_id") :: string
    local context, err = component.get_private_context(attachment)
    if err or not context then return nil, err end
    local board_id = context.board_id :: string
    local done, cleanup_err = storage.write(attachment, board_id, function(tx: sql.Transaction, sqlite: boolean, state: storage.State): (boolean?, error?)
        state.deleting = true
        local generation = state.retired or (state.building and state.building.id) or (state.active and state.active.id)
        if generation then
            local drained, drain_err = storage.drain(tx, sqlite, generation)
            if drain_err then return nil, drain_err end
            if drained then
                if state.retired then state.retired = nil
                elseif state.building then state.building = nil
                else state.active = nil end
            end
        end
        if state.retired or state.building or state.active then
            return false, storage.save(tx, attachment, state)
        end
        local _, delete_err = tx:execute("DELETE FROM kickside_work_search_state WHERE attachment_id=$1", { attachment })
        return true, delete_err
    end)
    if cleanup_err then return nil, cleanup_err end
    if not done then
        return nil, errors.new({ kind = errors.CONFLICT, retryable = true, message = "search attachment cleanup has another page",
            details = { code = "cleanup_pending", cleanup_pending = true, needs_continue = true } })
    end
    return { success = true }, nil
end

return { delete = delete }
