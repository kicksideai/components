-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local component = require("component")
local execution_identity = require("execution_identity")
local apply_ops = require("apply_ops")
local store = require("store")
local process = require("process")
local deadline = require("deadline")
local clock = require("clock")
local types = require("types")
local commands = require("commands")
local outcomes = require("outcomes")
local M = {}




local function batch(input: types.ProcessRequest, timer: boolean): (types.ProcessResult?, error?)
    local until_at, derr = deadline.bound(input.deadline)
    if derr then return nil, derr end
    local op: commands.Op = { op = timer and "timer" or "advance", item = input.item, state = input.state, visit = input.visit,
        timer = input.timer, attempt = input.attempt, scheduled_at = input.scheduled_at }
    if timer then
        local db, err = store.open()
        if not db then return nil, err end
        local item, ierr = store.item(db, input.board_id, input.item)
        db:release()
        if ierr then return nil, ierr end
        if item then item = process.for_visit(item, input.visit) end
        if not item or item.life ~= "live" or item.state ~= input.state then
            return { record = { status = "completed" } }, nil
        end
        op.scheduled_at = item.work and item.work.timer_due and item.work.timer_due[input.timer :: string]
        if not op.scheduled_at then return { record = { status = "completed" } }, nil end
        if clock.now() < op.scheduled_at then return { rearm = op.scheduled_at, record = { status = "completed" } }, nil end
    end
    local result, err = apply_ops.apply({ board_id = input.board_id, ops = { op }, mode = "atomic", source = "process", trace_context = input.trace_context }, until_at)
    if err then return nil, err end
    for _, out in ipairs(result.outcomes) do
        local refusal = outcomes.error(out.status, out.findings)
        if refusal then return nil, refusal end
    end
    local db, err = store.open()
    if not db then return nil, err end
    local item, ierr = store.item(db, input.board_id, input.item)
    db:release()
    if ierr then return nil, ierr end
    local rearm: string? = nil
    if timer and item then item = process.for_visit(item, input.visit) end
    if timer and item and item.work and item.work.timer_due then rearm = item.work.timer_due[input.timer :: string] end
    return { rearm = rearm, record = { status = "completed" } }, nil
end

function M.process_batch(input: types.ProcessRequest): (types.ProcessResult?, error?) return batch(input, true) end
function M.advance_batch(input: types.ProcessRequest): (types.ProcessResult?, error?) return batch(input, false) end

local function run(input: types.ProcessInput, method: string, owner: string): (types.ProcessResult?, error?)
    local context, err = component.get_private_context(input.payload.board_id)
    if err then return nil, err end
    local identity = context and context[execution_identity.CONTEXT_KEY]
    if identity == nil then return nil, errors.new({ kind = errors.INVALID, message = "board holds no execution identity", details = { code = "board_identity_absent" } }) end
    input.payload.deadline = input.job.deadline
    local result, run_err = execution_identity.run_as(identity, "kickside.work.jobs:" .. method, input.payload,
        { deferred_owner = owner, execution_root = input.payload.board_id })
    return result :: types.ProcessResult?, run_err :: error?
end

function M.process(input: types.ProcessInput): (types.ProcessResult?, error?) return run(input, "process_batch", "kickside.work.jobs:process") end
function M.advance(input: types.ProcessInput): (types.ProcessResult?, error?) return run(input, "advance_batch", "kickside.work.jobs:advance") end
return M
