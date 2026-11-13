-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local sql = require("sql")
local jobs = require("jobs")
local consts = require("consts")
local store = require("store")
local process = require("process")
local durations = require("durations")
local fold_batch = require("fold_batch")
local types = require("types")
local M = {}

local function schedule(tx: sql.Transaction, dialect: string, board: types.Board, item: types.Item, timer: string, deadline: string, attempt: integer?, trace_context: types.TraceContext?): error?
    local _, err = jobs.enqueue_tx(tx, dialect, { namespace = "kickside.work", scope = board.board_id,
        key = "t:" .. item.item_id .. ":" .. item.state .. ":" .. (item.work.visit or item.visit) .. ":" .. timer,
        owner_locator = { kind = "component", id = board.board_id }, job_type = consts.PROCESS_JOB,
        immutable_payload = { board_id = board.board_id, item = item.item_id, state = item.state, visit = item.work.visit or item.visit, timer = timer, attempt = attempt },
        scheduled_at = deadline, slot = true, trace_context = trace_context })
    return err
end

local function arm_state(tx: sql.Transaction, dialect: string, board: types.Board, item: types.Item, p: types.Process, trace_context: types.TraceContext?): error?
    local state = process.state_of(p, item.state)
    if not state then return fold_batch.corrupt("entered state is absent from the recorded process") end
    local work = item.work :: types.ProcessData
    for _, timer in ipairs(state.timers or {}) do
        local deadline, derr = durations.deadline(timer, item, board, work.entered_at :: string)
        if derr then return derr end
        if deadline then
            work.timer_due = work.timer_due or {}
            work.timer_due[timer.id] = deadline
            local serr = schedule(tx, dialect, board, item, timer.id, deadline, nil, trace_context)
            if serr then return serr end
        end
    end
    local wait = state.release_when and state.release_when.wait
    if wait then
        local deadline, derr = durations.after(work.entered_at :: string, wait)
        if derr or not deadline then return derr end
        work.timer_due = work.timer_due or {}
        work.timer_due[consts.WAIT_TIMER] = deadline
        return schedule(tx, dialect, board, item, consts.WAIT_TIMER, deadline, nil, trace_context)
    end
    return nil
end

function M.arm(tx: sql.Transaction, dialect: string, board: types.Board, item: types.Item, region: string?, trace_context: types.TraceContext?): error?
    local p, err = store.process(tx, board, item)
    if err or not p then return err end
    if region then return arm_state(tx, dialect, board, process.region(item, region, p), p, trace_context) end
    local aerr = arm_state(tx, dialect, board, item, p, trace_context)
    if aerr then return aerr end
    for id in pairs(item.work.region_data or {}) do
        local rerr = arm_state(tx, dialect, board, process.region(item, id, p), p, trace_context)
        if rerr then return rerr end
    end
    return nil
end

function M.advance(tx: sql.Transaction, dialect: string, board_id: string, id: string, trace_context: types.TraceContext?): error?
    local _, err = jobs.enqueue_tx(tx, dialect, { namespace = "kickside.work", scope = board_id, key = "advance:" .. id,
        owner_locator = { kind = "component", id = board_id }, job_type = consts.ADVANCE_JOB, slot = true, demand = true,
        trace_context = trace_context, immutable_payload = { board_id = board_id, item = id } })
    return err
end

function M.apply(tx: sql.Transaction, dialect: string, board: types.Board, event: types.FoldEvent, batch: types.FoldBatch): error?
    local body = event.body
    local item, err = fold_batch.load(tx, board.board_id, batch, body.item)
    if err or not item then return err end
    local root = item
    item = process.for_visit(root, body.visit) or root
    local work = item.work :: types.ProcessData
    if event.type == consts.EVENTS.STAGE_ENTERED then
        work.attempt, work.waiting = body.attempt, nil
        local p, perr = store.process(tx, board, item)
        if perr or not p then return perr end
        local state = process.state_of(p, item.state) :: types.State
        local deadline, derr = durations.after(body.at :: string, state.run.timeout or board.compiled.policy.stage_timeout :: string)
        if derr or not deadline then return derr end
        work.timer_due = work.timer_due or {}
        local key = consts.STAGE_TIMER_PREFIX .. body.attempt
        work.timer_due[key] = deadline
        local serr = schedule(tx, dialect, board, item, key, deadline, body.attempt, batch.trace_context)
        if serr then return serr end
        err = fold_batch.exec(tx, [[INSERT INTO kickside_work_stage_run (board_id,item_id,visit,attempt,state,started)
            VALUES ($1,$2,$3,$4,$5,$6)]], { board.board_id, item.item_id, body.visit, body.attempt, body.state, body.at })
    elseif event.type == consts.EVENTS.STAGE_REPORTED then
        err = fold_batch.exec(tx, [[INSERT INTO kickside_work_stage_run (board_id,item_id,visit,attempt,state,started,finished,outcome,outputs,progress,flow_run)
            VALUES ($1,$2,$3,$4,$5,$6,$6,$7,$8,$9,$10)
            ON CONFLICT (board_id,item_id,visit,attempt) DO UPDATE SET finished=excluded.finished,outcome=excluded.outcome,
                outputs=excluded.outputs,progress=excluded.progress,flow_run=excluded.flow_run]],
            { board.board_id, item.item_id, body.visit, body.attempt, body.state, body.at, body.outcome,
                store.encode(body.outputs), store.encode(body.progress), event.trace_context and event.trace_context.run_id or sql.NULL })
        work.waiting = true
        if work.timer_due then work.timer_due[consts.STAGE_TIMER_PREFIX .. body.attempt] = nil end
        local p, perr = store.process(tx, board, item)
        if perr then return perr end
        local state = process.state_of(p :: types.Process, item.state) :: types.State
        if not err and (work.stage_visit :: integer) <= (state.run.max_visits or board.compiled.policy.stage_max_visits :: integer)
            and body.outcome == "failed" and state.run.retry and body.attempt < state.run.retry.max then
            local deadline, derr = durations.after(body.at :: string, state.run.retry.backoff)
            if derr or not deadline then return derr end
            work.timer_due = work.timer_due or {}
            local key = consts.RETRY_TIMER_PREFIX .. (body.attempt + 1)
            work.timer_due[key] = deadline
            err = schedule(tx, dialect, board, item, key, deadline, body.attempt + 1, batch.trace_context)
        end
    elseif event.type == consts.EVENTS.APPROVAL_RECORDED then
        work.approvals = work.approvals or {}
        work.approvals[body.actor :: string] = body.decision :: string
        if body.decision == "reject" then work.rejected = true end
        err = fold_batch.exec(tx, [[INSERT INTO kickside_work_approval (board_id,item_id,visit,actor,decision,at)
            VALUES ($1,$2,$3,$4,$5,$6) ON CONFLICT (board_id,item_id,visit,actor) DO UPDATE SET decision = excluded.decision, at = excluded.at]],
            { board.board_id, item.item_id, body.visit, body.actor, body.decision, body.at })
    elseif event.type == consts.EVENTS.TIMER_FIRED then
        if body.timer == consts.WAIT_TIMER then work.wait_done = true end
        if work.timer_due then work.timer_due[body.timer :: string] = nil end
        local p, perr = store.process(tx, board, item)
        if perr or not p then return perr end
        local state = process.state_of(p, item.state) :: types.State
        for _, timer in ipairs(state.timers or {}) do
            if timer.id == body.timer and timer["repeat"] then
                local deadline, derr = durations.after(body.scheduled_at :: string, timer["repeat"])
                if derr or not deadline then return derr end
                work.timer_due = work.timer_due or {}
                work.timer_due[timer.id] = deadline
            end
        end
    end
    if err then return err end
    process.sync(item)
    fold_batch.touch(batch, root, event.seq)
    fold_batch.record(batch, board.board_id, event, "i:" .. item.item_id, event.type:match(":(.+)$") :: string, nil, nil,
        { visit = body.visit, attempt = body.attempt, decision = body.decision, outcome = body.outcome, timer = body.timer, force = body.force })
    batch.rows = batch.rows + 1
    return nil
end
return M
