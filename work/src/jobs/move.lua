-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local consts = require("consts")
local planner = require("planner")
local rows = require("rows")
local events = require("events")
local receipts = require("receipts")
local types = require("types")
local domain = require("domain")
local M = {}

local function incoming(owner: types.Owner, plan: types.MovePlan): error?
    local key = "move/" .. owner.operation_id .. "/in"
    local hit, herr = receipts.command(plan.to_board, key)
    if herr then return herr end
    if hit then return nil end
    plan.allowed, plan.findings = true, {}
    local writes, werr = planner.prepare(plan, owner.operation_id)
    if werr or not writes then return werr end
    if not plan.allowed then return errors.new({ kind = errors.INVALID, message = "move target refuses the plan", details = { code = plan.findings[1].code, findings = plan.findings } }) end
    -- The target head keeps the mapped schema, hierarchy and relation population at its prepared position.
    for _, write in ipairs(writes) do write.expect_head = plan.target_seq end
    local _, aerr = events.append(plan.to_board, key, writes, {}, owner.deadline)
    return aerr
end

function M.batch(owner: types.Owner): (boolean?, error?)
    if owner.status == "done" then return true, nil end
    local plan = owner.data.plan :: types.MovePlan
    local request = owner.data.request :: types.MoveRequest
    local aerr = planner.access(request)
    if aerr then return nil, aerr end
    local ierr = incoming(owner, plan)
    if ierr then return nil, ierr end
    local writes: { types.Write } = {}
    for _, item in ipairs(plan.items) do
        local event: domain.Event = { type = consts.EVENTS.ITEM_MOVED_OUT, subject = "i:" .. item.from,
            body = { item = item.from, operation_id = owner.operation_id, old_key = item.old_key, moved_to = { board = plan.to_board, item = item.item } } }
        writes[#writes + 1] = { group = event.subject, events = { event }, ops = {}, caller_expect = false,
            expect_subject = event.subject, expect_version = item.version + 1 }
    end
    local _, oerr = events.append(owner.board_id, "move/" .. owner.operation_id .. "/out", writes, {}, owner.deadline)
    if oerr then return nil, oerr end
    owner.processed = #plan.items
    owner.counts.applied = #plan.items
    local uerr = rows.update(owner, "done", nil)
    return true, uerr
end
return M
