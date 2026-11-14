-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local apply_ops = require("apply_ops")
local rows = require("rows")
local events = require("events")
local types = require("types")
local M = {}
local function publish(owner: types.Owner, total: integer): (boolean?, error?)
    local status = owner.status == "finishing" and "done" or owner.status
    local err = events.progress(owner.board_id, owner.operation_id, "bulk", owner.processed, total, status, owner.counts, owner.deadline)
    if err then return nil, err end
    if owner.status == "finishing" then
        local uerr = rows.update(owner, "done", nil)
        if uerr then return nil, uerr end
    end
    return owner.status == "done" or owner.status == "cancelled", nil
end
function M.batch(owner: types.Owner): (boolean?, error?)
    local ids = owner.data.ids :: { string }
    if owner.status == "cancelled" or owner.status == "done" then return publish(owner, #ids) end
    if owner.processed == #ids then
        local err = rows.update(owner, "finishing", nil)
        if err then return nil, err end
        return publish(owner, #ids)
    end
    local admitted = rows.update(owner, "running", nil)
    if admitted then return nil, admitted end
    if owner.status == "cancelled" then return publish(owner, #ids) end
    local started = events.progress(owner.board_id, owner.operation_id, "bulk", owner.processed, #ids, "running", owner.counts, owner.deadline)
    if started then return nil, started end
    local templates = owner.data.ops_template :: { types.Op }
    local through = math.min(owner.processed + 200, #ids)
    local size = math.max(1, 200 // #templates)
    for first = owner.processed + 1, through, size do
        local ops: { types.Op } = {}
        for i = first, math.min(first + size - 1, through) do
            for _, template in ipairs(templates) do
                local op: { [string]: unknown } = {}
                for k, v in pairs(template :: { [string]: unknown }) do op[k] = v end
                op.item = ids[i]
                ops[#ops + 1] = op :: types.Op
            end
        end
        local result, err = apply_ops.apply({ board_id = owner.board_id, ops = ops, mode = "independent", source = "bulk",
            key = "bulk/" .. owner.operation_id .. "/" .. owner.processed .. "/" .. first }, owner.deadline)
        if err or not result then return nil, err end
        for _, outcome in ipairs(result.outcomes) do owner.counts[outcome.status] = (owner.counts[outcome.status] or 0) + 1 end
    end
    owner.processed = through
    local status = through == #ids and "finishing" or "running"
    local err = rows.update(owner, status, nil)
    if err then return nil, err end
    return publish(owner, #ids)
end
return M
