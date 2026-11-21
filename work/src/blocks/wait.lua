-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local access = require("access")
local clock = require("clock")
local consts = require("consts")
local domain = require("domain")
local feeds = require("feeds")
local item_view = require("item_view")
local projection_reader = require("projection_reader")
local reads = require("reads")
local schemas = require("schemas")
local shape = require("shape")
local store = require("store")
local time = require("time")
local types = require("types")
local waiters = require("waiters")

local M = {}

local function check_item(ctx: types.Context): (types.Match?, error?)
    local input = ctx.input
    local result, err = access.with_snapshot(input.board_id, nil,
        function(tx: reads.Executor, board: domain.Board, _dialect: string): (types.Observation?, error?)
            local item, err = item_view.find(tx, board, { id = input.item })
            if err then return nil, err end
            if not item then
                return nil, errors.new({ kind = errors.NOT_FOUND, message = "item not found", details = { code = "item_not_found" } })
            end
            local head, head_err = feeds.head(tx, board)
            if head_err or not head then return nil, head_err end
            local match: types.Match? = nil
            if item.life == "live" and not (item.work and item.work.regions) and item.state == input.state then
                match = { id = item.item_id, state = input.state, version = item.version }
            end
            return { cursor = head, item = match }, nil
        end, nil, ctx.budget)
    if err or not result then return nil, err end
    ctx.cursor = result.cursor
    return result.item, nil
end

local function projection_unavailable(): error
    return errors.new({ kind = errors.UNAVAILABLE, message = "Work board projection is unavailable",
        details = { code = "work_wait_projection_unavailable" }, retryable = true })
end

local function await_change(waiter: table, observed: integer): (integer?, error?)
    while true do
        local notice, timed_out, err = waiters.wait_until_reached(waiter)
        if err or timed_out then return nil, err end
        local update = notice :: { status: string, last_seq: integer? }
        if update.status ~= "active" then return nil, projection_unavailable() end
        if update.last_seq and update.last_seq > observed then return update.last_seq, nil end
    end
end

local function follow(ctx: types.Context): (types.Match?, error?)
    -- The item read already admitted this board. Resolve only the notification address;
    -- thread event access on a Work board is reserved for administrators.
    local db, err = store.open()
    if err or not db then return nil, err end
    local pair, cursor_err = projection_reader.find_projection_cursor(db, ctx.input.board_id, { kind = consts.PROJECTION_KIND })
    db:release()
    if cursor_err then return nil, cursor_err end
    local cursor = pair and (pair :: { cursor: types.ProjectionCursor }).cursor
    if not cursor or cursor.status ~= "active" then return nil, projection_unavailable() end

    local observed = (ctx.cursor :: reads.ChangesCursor).seq
    while not clock.passed(ctx.deadline) do
        local ms = math.max(1, math.ceil((ctx.deadline.ns - time.now():unix_nano()) / time.MILLISECOND))
        -- Register before the point read so a concurrent commit is read here or wakes the waiter.
        local waiter, listen_err = waiters.begin_wait(cursor.id, observed + 1, ms)
        if listen_err or not waiter then return nil, listen_err end
        local item, read_err = check_item(ctx)
        local next_seq: integer?, wait_err: error? = (ctx.cursor :: reads.ChangesCursor).seq, nil
        if not item and not read_err and (next_seq :: integer) <= observed then
            next_seq, wait_err = await_change(waiter, observed)
        end
        waiters.close_wait(waiter)
        if item or read_err then return item, read_err end
        if wait_err or not next_seq then return nil, wait_err end
        observed = next_seq
    end
    return nil, nil
end

function M.run(raw: unknown): (types.Result?, error?)
    local args = type(raw) == "table" and (raw :: types.Map) or {}
    local config = args.config or {}
    local err = shape.check(schemas.input, args.input, "Work wait input") or shape.check(schemas.config, config, "Work wait config")
    if err then return nil, err end
    local input = args.input :: types.Input
    local deadline = clock.deadline(((config :: types.Config).timeout_ms or 30000) :: integer)
    local budget: reads.ReadBudget = { deadline = deadline.at }
    local ctx: types.Context = { input = input, budget = budget, deadline = deadline }
    local item, read_err = check_item(ctx)
    if read_err then return nil, read_err end
    if not item then item, read_err = follow(ctx) end
    if read_err and not (read_err:kind() == errors.TIMEOUT and clock.passed(deadline)) then return nil, read_err end
    local cursor = ctx.cursor :: reads.ChangesCursor
    if item then return { status = "matched", cursor = cursor, item = item }, nil end
    return { status = "timed_out", cursor = cursor }, nil
end

return M
