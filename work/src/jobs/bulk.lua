-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local apply_ops = require("apply_ops")
local rows = require("rows")
local events = require("events")
local types = require("types")
local limits = require("limits")
local M = {}
local function publish(owner: types.Owner, total: integer): (boolean?, error?)
    local status = owner.status == "finishing" and "done" or owner.status
    if (owner.counts.applied or 0)>0 then
        local err = events.progress(owner.board_id, owner.operation_id, "bulk", owner.processed, total, status, owner.counts, owner.deadline)
        if err then return nil, err end
    end
    if owner.status == "finishing" then
        local uerr = rows.update(owner, "done", nil)
        if uerr then return nil, uerr end
    end
    return owner.status == "done" or owner.status == "cancelled", nil
end
function M.batch(owner: types.Owner): (boolean?, error?)
    local ids = owner.data.ids :: { string }
    if owner.status == "done" then return true,nil end
    if owner.status == "cancelled" then return publish(owner, #ids) end
    if owner.processed == #ids then
        if owner.status == "finishing" then return publish(owner,#ids) end
        local err = rows.update(owner,"done",nil)
        return err == nil,err
    end
    local admitted = rows.update(owner, "running", nil)
    if admitted then return nil, admitted end
    if owner.status == "cancelled" then return publish(owner, #ids) end
    local applied_before = owner.counts.applied or 0
    local templates = owner.data.ops_template :: { types.Op }
    -- A page's boundaries commit before any chunk. Recovery reuses them even
    -- when the installation changes its throughput settings between attempts.
    local page = owner.data.bulk_page :: {after: integer, through: integer, size: integer}?
    if not page or page.after ~= owner.processed then
        local settings, settings_err = limits.read()
        if settings_err or not settings then return nil, settings_err end
        if #templates > settings.bulk_batch_ops then
            return nil, errors.new({ kind = errors.INVALID, message = "bulk template exceeds bulk_batch_ops", details = { code = "bulk_template_limit" } })
        end
        page = {after=owner.processed, through=math.min(owner.processed+settings.bulk_batch_items,#ids), size=settings.bulk_batch_ops//#templates}
        owner.data.bulk_page = page
        local frozen = rows.update(owner,"running",nil,true)
        if frozen then return nil,frozen end
        if owner.status == "cancelled" then return publish(owner,#ids) end
    end
    local through, size = page.through, page.size
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
    local changed = (owner.counts.applied or 0)>applied_before
    local status = through == #ids and (changed and "finishing" or "done") or "running"
    local err = rows.update(owner, status, nil)
    if err then return nil, err end
    if not changed then return owner.status=="done" or owner.status=="cancelled",nil end
    return publish(owner, #ids)
end
return M
