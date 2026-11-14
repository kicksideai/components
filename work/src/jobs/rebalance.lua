-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- The rebalance slot resolves the board identity live and appends bounded range events.
local security = require("security")
local time = require("time")
local json = require("json")
local component = require("component")
local consts = require("consts")
local store = require("store")
local job_rows = require("job_rows")
local deadline = require("deadline")
local threads = require("threads")
local append = require("append")
local types = require("types")
local domain = require("domain")

local receipts = require("receipts")
local M = {}

function M.batch(request: types.RebalanceRequest): (types.RebalanceResult?, error?)
    local trace_context, trace_err = receipts.trace(request.trace_context, "work.rebalance")
    if trace_err then return nil, trace_err end
    local board_id = request.board_id
    local _, access_err = component.validate_access(board_id, (component.ACCESS.ADMIN :: integer))
    if access_err then return nil, access_err :: error end
    local until_at, deadline_err = deadline.bound(request.deadline)
    if deadline_err or not until_at then return nil, deadline_err end
    local c, cerr = threads.open()
    if not c then return nil, cerr end
    local caught, uerr = threads.catch_up(c, board_id, consts.PROJECTION_KIND, until_at)
    if uerr or not caught or not caught.done then
        return nil, uerr or errors.new({ details = { code = "contract_unavailable" },  kind = errors.UNAVAILABLE, retryable = true, message = "rebalance waits for the projection" })
    end
    local db, derr = store.open()
    if not db then return nil, derr end
    local rows, rerr = job_rows.demand(db, board_id, "rebalance")
    local total, terr = job_rows.population(db, board_id)
    local long, lerr = job_rows.long_ranks(db, board_id, consts.LIMITS.rank_length)
    db:release()
    if rerr or terr or lerr or not total or not long then return nil, rerr or terr or lerr end
    if not rows or not rows[1] then return nil, errors.new({ details = { code = "resource_not_found" },  kind = errors.NOT_FOUND, message = "rebalance demand is missing" }) end
    local key, decode_err = store.need(rows[1], "key")
    if decode_err or key == nil then return nil, decode_err end

    local state: domain.RebalanceState = { offset = 0, total = total, direction = "left" }
    if key:sub(1, 1) == "{" then state = json.decode(key) :: domain.RebalanceState end
    if state.total ~= total or (state.direction == "right" and state.offset == 0 and long > 0) then
        state = { offset = 0, total = total, direction = "left" }
    end
    if total == 0 or (state.direction == "right" and state.offset == 0) then return { done = true }, nil end
    local count = math.min(consts.LIMITS.rebalance_batch, state.direction == "left" and (total - state.offset) or state.offset)
    local offset = state.direction == "left" and state.offset or (state.offset - count)
    local event: domain.Event = { trace_context = trace_context, type = consts.EVENTS.RANK_REBALANCED, subject = "rank", body = {
        range = { offset = offset, total = total, direction = state.direction }, count = count,
        actor = (security.actor() :: security.Actor):id(), at = time.now():utc():format("2006-01-02T15:04:05.000000000Z"), source = "rebalance",
    } }
    local _, aerr = append.writes(c, board_id, { { group = "rank", events = { event }, ops = {}, caller_expect = false } })
    if aerr then return nil, aerr end
    return { done = false }, nil
end

M.kind = "rebalance"
M.batch_id = "kickside.work.jobs:rebalance_batch"
M.owner = consts.REBALANCE_OWNER
M.batches = consts.LIMITS.rebalance_batches_per_run
return M
