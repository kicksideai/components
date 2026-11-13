-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Awaited populations compile against the process generation held by each item.
local approvals = require("approvals")
local access_rows = require("access_rows")
local store = require("store")
local domain = require("domain")
local types = require("types")
local M = {}

function M.condition(tx: types.Executor, board: domain.Board, actor: string, alias: string): (domain.Condition?, error?)
    local rows, err = tx:query("SELECT DISTINCT type,process_generation FROM kickside_work_item WHERE board_id=$1 AND life='live'", { board.board_id })
    if err then return nil, errors.wrap(err, "awaited processes read failed") end
    local parts: { string } = {}
    local args: { unknown } = { board.board_id }
    for _, row in ipairs(rows or {}) do
        local item_type, terr = store.need(row, "type")
        if terr then return nil, terr end
        local generation, gerr = store.need_int(row, "process_generation")
        if gerr then return nil, gerr end
        local model, merr = store.process_model(tx, board, { type = item_type :: string, process_generation = generation :: integer })
        if merr or not model then return nil, merr end
        local process = model.processes[model.item_types[item_type :: string].process]
        for _, state in ipairs(process.states) do
            local rule = approvals.rule(state)
            if rule then
                local condition, cerr = access_rows.holders_condition(board, approvals.holders(rule.from), "aw", model.fields)
                if cerr or not condition then return nil, cerr end
                local part = "(aw.type=? AND aw.process_generation=? AND aw.state=? AND (" .. condition.sql .. ")"
                args[#args + 1] = item_type
                args[#args + 1] = generation
                args[#args + 1] = state.id
                for _, arg in ipairs(condition.args) do args[#args + 1] = arg end
                if rule.prevent_self then
                    local entrant = board.dialect == "postgres" and "(aw.process_data::jsonb ->> 'entered_by')" or "json_extract(aw.process_data, '$.entered_by')"
                    part = part .. " AND " .. entrant .. " <> ?"
                    args[#args + 1] = actor
                end
                parts[#parts + 1] = part .. ")"
            end
        end
    end
    if #parts == 0 then return { sql = "1=0", args = {} }, nil end
    return { sql = "EXISTS (SELECT 1 FROM kickside_work_item aw WHERE aw.board_id=? AND aw.item_id=" .. alias .. ".item_id AND aw.life='live' AND (" .. table.concat(parts, " OR ") .. "))", args = args }, nil
end
return M
