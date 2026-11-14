-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local consts = require("consts")
local planner = require("planner")
local guard = require("guard")
local uuid = require("uuid")
local rows = require("rows")
local operations = require("operations")
local events = require("events")
local receipts = require("receipts")
local store = require("store")
local types = require("types")
local domain = require("domain")
local M = {}
M.plan = planner.plan

function M.start(request: types.MoveRequest): (types.Status?, error?)
    local err = planner.access(request)
    if err then return nil, err end
    request.key = request.key or uuid.v4()
    local hashed = receipts.request_hash(request)
    local db, derr = store.open()
    if not db then return nil, derr end
    local owner, oerr = rows.get(db, request.board_id, nil, "move", request.key)
    db:release()
    if oerr then return nil, oerr end
    if owner then
        local aerr = guard.owner_access(owner.board_id, owner.actor_id)
        if aerr then return nil, aerr end
        if owner.request_hash ~= hashed then return nil, receipts.conflict_of() end
    end
    if not owner then
        local plan, perr = planner.plan(request)
        if perr or not plan then return nil, perr end
        if not plan.allowed then return nil, errors.new({ kind = errors.INVALID, message = "move plan is refused", details = { code = plan.findings[1].code, findings = plan.findings } }) end
        local created, cerr = rows.create(request.board_id, "move", request.key, hashed, { plan = plan, request = request }, true)
        if cerr or not created then return nil, cerr end
        owner = created
    end
    local aerr = guard.owner_access(owner.board_id, owner.actor_id)
    if aerr then return nil, aerr end
    local plan = owner.data.plan :: types.MovePlan
    local writes: { types.Write } = {}
    for _, item in ipairs(plan.items) do
        local event: domain.Event = { type = consts.EVENTS.MOVE_PREPARED, subject = "i:" .. item.from,
            body = { item = item.from, operation_id = owner.operation_id } }
        writes[#writes + 1] = { group = event.subject, events = { event }, ops = {}, caller_expect = false, expect_head = plan.source_seq }
    end
    local _, perr = events.append(owner.board_id, "move/" .. owner.operation_id .. "/prepared", writes, {})
    if perr then return nil, perr end
    local resumed, rerr = rows.resume(owner)
    if rerr or not resumed then return nil, rerr end
    return rows.status(resumed), nil
end
function M.status(request: types.Locator): (types.Status?, error?)
    local owner, err = operations.owner(request, "move")
    if err or not owner then return nil, err end
    return rows.status(owner), nil
end
return M
