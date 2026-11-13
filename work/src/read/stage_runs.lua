-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local access = require("access")
local budget = require("budget")
local item_view = require("item_view")
local read_rows = require("read_rows")
local store = require("store")
local domain = require("domain")
local types = require("types")
local consts = require("consts")
local M = {}

function M.page(tx: types.Executor, board: domain.Board, item: domain.Item, limit: integer, after: string?, current: boolean?): (types.StageRunsResult?, error?)
    local visit: integer?, attempt: integer?
    if after then
        local v, a = after:match("^(%d+):(%d+)$")
        if v and a then visit, attempt = math.tointeger(tonumber(v)), math.tointeger(tonumber(a)) end
        if not visit or not attempt or visit < 1 or attempt < 1 then
            return nil, errors.new({ kind = errors.INVALID, message = "after is a stage-run cursor", details = { code = "stage_runs_cursor_invalid" } })
        end
    end
    local visits: { integer }? = nil
    if current then
        visits = { item.visit }
        for _, data in pairs(item.work and item.work.region_data or {}) do visits[#visits + 1] = data.visit :: integer end
    end
    local rows, err = read_rows.stage_runs(tx, board.board_id, item.item_id, limit + 1, visit, attempt, visits)
    if err or not rows then return nil, err end
    local runs: { types.StageRun } = {}
    for i = 1, math.min(#rows, limit) do
        local row = rows[i]
        local visit, err = store.need_int(row, "visit")
        if err or not visit then return nil, err end
        local attempt, err = store.need_int(row, "attempt")
        if err or not attempt then return nil, err end
        local state, err = store.need(row, "state")
        if err or not state then return nil, err end
        local started, err = store.need(row, "started")
        if err or not started then return nil, err end
        local outputs, err = store.stored(row.outputs, nil)
        if err then return nil, err end
        local progress, err = store.stored(row.progress, nil)
        if err then return nil, err end
        local retry_at: string? = nil
        local function scheduled(data: domain.ProcessData?): string?
            if not data or (data.visit or item.visit)~=visit or data.attempt~=attempt then return nil end
            return data.timer_due and data.timer_due[consts.RETRY_TIMER_PREFIX .. (attempt+1)]
        end
        retry_at=scheduled(item.work)
        for _,data in pairs(item.work and item.work.region_data or {}) do
            local due=scheduled(data)
            if due then retry_at=due end
        end
        runs[i] = { retry_at=retry_at, visit = visit, attempt = attempt, state = state, started_at = started, finished_at = store.text(row.finished),
            outcome = store.text(row.outcome), flow_run = store.text(row.flow_run), outputs = outputs :: types.JsonObject?, progress = progress :: types.JsonObject? }
    end
    local last = runs[#runs]
    return { stage_runs = runs, after = #rows > limit and (last.visit .. ":" .. last.attempt) or nil }, nil
end

function M.list(request: types.StageRunsRequest): (types.StageRunsResult?, error?)
    return budget.run(request, function(context: types.ReadContext): (types.StageRunsResult?, error?)
        return access.with_snapshot(request.board_id, request.min_seq, function(tx: types.Executor, board: domain.Board, _dialect: string): (types.StageRunsResult?, error?)
            local item, err = item_view.find(tx, board, request.item)
            if err then return nil, err end
            if not item then return nil, errors.new({ kind = errors.NOT_FOUND, message = "item not found", details = { code = "item_not_found" } }) end
            return M.page(tx, board, item, request.limit or 50, request.after)
        end, context)
    end)
end
return M
