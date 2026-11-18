-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local component = require("component")
local execution_identity = require("execution_identity")
local apply_ops = require("apply_ops")
local store = require("store")
local lifecycle = require("lifecycle")
local jobs = require("jobs")
local sql = require("sql")
local process = require("process")
local deadline = require("deadline")
local clock = require("clock")
local types = require("types")
local commands = require("commands")
local domain = require("domain")
local outcomes = require("outcomes")
local M = {}

local function current_deadline(item: domain.Item?, input: types.ProcessRequest): string?
    if not item or item.life ~= "live" then return nil end
    local visit = process.for_visit(item, input.visit)
    if not visit or visit.state ~= input.state or not visit.work or not visit.work.timer_due then return nil end
    return visit.work.timer_due[input.timer :: string]
end

local function batch(input: types.ProcessRequest, timer: boolean): (types.ProcessResult?, error?)
    local until_at, derr = deadline.bound(input.deadline)
    if derr then return nil, derr end
    local op: commands.Op = { op = timer and "timer" or "advance", item = input.item, state = input.state, visit = input.visit,
        timer = input.timer, attempt = input.attempt, scheduled_at = input.scheduled_at }
    local db, err = store.open()
    if not db then return nil, err end
    local current, ierr = store.item(db, input.board_id, input.item)
    db:release()
    if ierr then return nil, ierr end
    if not current or current.life=="purged" then return {record={status="completed"}},nil end
    if timer then
        op.scheduled_at = current_deadline(current, input)
        if not op.scheduled_at then return { settle = current.life == "trashed", record = { status = "completed" } }, nil end
        op.timer_life_at = current.life_at
        if clock.now() < op.scheduled_at then return { rearm = op.scheduled_at, record = { status = "completed" } }, nil end
    end
    local result, err = apply_ops.apply({ board_id = input.board_id, ops = { op }, mode = "atomic", source = "process", trace_context = input.trace_context }, until_at)
    if err then return nil, err end
    for _, out in ipairs(result.outcomes) do
        local refusal = outcomes.error(out.status, out.findings, out.error)
        if refusal then return nil, refusal end
    end
    local db, err = store.open()
    if not db then return nil, err end
    local item, ierr = store.item(db, input.board_id, input.item)
    db:release()
    if ierr then return nil, ierr end
    return { rearm = timer and current_deadline(item, input) or nil, settle = timer and item ~= nil and item.life == "trashed",
        record = { status = "completed" } }, nil
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

function M.process(input: types.ProcessInput): (types.ProcessResult?, error?)
    local result, err = run(input, "process_batch", "kickside.work.jobs:process")
    if err or not result or not result.settle then return result, err end
    local payload, job = input.payload, input.job
    -- Share the projection lock with restore. Restore either sees a settled job
    -- and enrolls a new one, or commits first and provides the deadline to rearm.
    return lifecycle.transaction(function(tx: sql.Transaction, dialect: string): (types.ProcessResult?, error?)
        local _, lock_err = store.board(tx, payload.board_id, dialect)
        if lock_err then return nil, lock_err end
        local item, read_err = store.item(tx, payload.board_id, payload.item)
        if read_err then return nil, read_err end
        local completion, complete_err = jobs.complete_tx(tx, job.id,
            { token = job.lease_token, execution_seq = job.execution_seq }, { rearm = current_deadline(item, payload) })
        if complete_err then return nil, complete_err end
        return { self_completed = true, completion = completion }, nil
    end)
end
function M.advance(input: types.ProcessInput): (types.ProcessResult?, error?) return run(input, "advance_batch", "kickside.work.jobs:advance") end
return M
