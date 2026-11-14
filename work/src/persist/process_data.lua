-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local types = require("types")
local storage = require("storage")
local process = require("process")
local durations = require("durations")
local consts = require("consts")
local M = {}

function M.needs(item: types.Item): boolean
    local work = item.work :: types.ProcessData
    if not work.stage_visits then return true end
    local function missing(data: types.ProcessData): boolean
        return data.attempt ~= nil and (data.stage_visit == nil or data.timer_due == nil)
    end
    if missing(work) then return true end
    for _, data in pairs(work.region_data or {}) do if missing(data) then return true end end
    return false
end

-- upgrade interprets stage data written before visit budgets and attempt deadlines.
local function upgrade(board: types.Board, item: types.Item, p: types.Process, rows: { storage.StageRun }): error?
    local counts: { [string]: integer } = {}
    local ordinal: { [integer]: integer } = {}
    local latest: { [integer]: storage.StageRun } = {}
    for _, run in ipairs(rows) do
        if not ordinal[run.visit] then
            counts[run.state] = (counts[run.state] or 0) + 1
            ordinal[run.visit] = counts[run.state]
        end
        latest[run.visit] = run
    end
    local work = item.work :: types.ProcessData
    local visits = work.stage_visits or counts
    local active: { types.StateItem } = { item }
    for id in pairs(work.region_data or {}) do active[#active + 1] = process.region(item, id, p) end
    table.sort(active, function(a: types.StateItem, b: types.StateItem): boolean
        return (a.work.visit or a.visit) < (b.work.visit or b.visit)
    end)
    for _, held in ipairs(active) do
        local state = process.state_of(p, held.state) :: types.State
        local data = held.work :: types.ProcessData
        if state.kind == "automated" then
            local visit = data.visit or held.visit
            if not ordinal[visit] then
                if not work.stage_visits then visits[state.id] = (visits[state.id] or 0) + 1 end
                ordinal[visit] = visits[state.id] or 1
            end
            data.stage_visit = data.stage_visit or ordinal[visit]
            local run = latest[visit]
            data.attempt = data.attempt or (run and run.attempt)
            local deadlines = data.timer_due or {}
            if data.attempt and (not run or data.attempt == run.attempt) then
                local timer: string? = nil
                local at: string? = nil
                local duration: string? = nil
                if not data.waiting and (not run or not run.outcome) then
                    timer = consts.STAGE_TIMER_PREFIX .. data.attempt
                    at, duration = run and run.started or data.entered_at, state.run.timeout or board.compiled.policy.stage_timeout
                elseif run and data.waiting and run.outcome == "failed" and state.run.retry and run.attempt < state.run.retry.max then
                    timer, at, duration = consts.RETRY_TIMER_PREFIX .. (run.attempt + 1), run.finished, state.run.retry.backoff
                end
                if timer and at and not deadlines[timer] then
                    local due, derr = durations.after(at, duration :: string)
                    if derr then return derr end
                    deadlines[timer] = due :: string
                end
            end
            data.timer_due = deadlines
        end
    end
    work.stage_visits = visits
    return nil
end
-- read shares schema resolution and stage history across an item page.
function M.read(db: storage.Executor, board: types.Board, items: { types.Item }, definition: (types.Item) -> (types.Process?, error?)): error?
    local params: types.SqlParams = { board.board_id }
    local markers: { string } = {}
    local legacy: { types.Item } = {}
    for _, item in ipairs(items) do
        if M.needs(item) then
            legacy[#legacy + 1] = item
            params[#params + 1] = item.item_id
            markers[#markers + 1] = "$" .. #params
        end
    end
    local rows, err = db:query([[SELECT item_id, state, visit, attempt, started, finished, outcome FROM kickside_work_stage_run
        WHERE board_id = $1 AND item_id IN (]] .. table.concat(markers, ",") .. ") ORDER BY item_id, visit, attempt", params)
    if err then return errors.wrap(err, "stage history read failed") end
    local history: { [string]: { storage.StageRun } } = {}
    for _, row in ipairs(rows or {}) do
        local run = row :: storage.StageRun
        history[run.item_id] = history[run.item_id] or {}
        local held = history[run.item_id]
        held[#held + 1] = run
    end
    local definitions: { [string]: types.Process } = {}
    for _, item in ipairs(legacy) do
        local key = item.type .. ":" .. item.process_generation
        local p = definitions[key]
        if not p then
            local resolved, perr = definition(item)
            if perr or not resolved then return perr end
            p, definitions[key] = resolved, resolved
        end
        local uerr = upgrade(board, item, p, history[item.item_id] or {})
        if uerr then return uerr end
    end
    return nil
end
return M
