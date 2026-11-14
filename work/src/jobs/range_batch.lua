-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Rebuild batches select a bounded range and append its event under the board identity.
local security = require("security")
local time = require("time")
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
local config = require("config")
local M = {}

function M.batch(request: types.RecomputeRequest): (types.RecomputeResult?, error?)
    local trace_context, trace_err = receipts.trace(request.trace_context, "work." .. config.kind)
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
        return nil, uerr or errors.new({ details = { code = "contract_unavailable" },  kind = errors.UNAVAILABLE, retryable = true, message = config.kind .. " waits for the projection" })
    end
    local db, derr = store.open()
    if not db then return nil, derr end
    if config.kind == "recompute" then
        local pending, perr = job_rows.pending(db, board_id)
        if perr or #(pending or {}) > 0 then
            db:release()
            return nil, perr or errors.new({ details = { code = "contract_unavailable" },  kind = errors.UNAVAILABLE, retryable = true, message = "recompute waits for generated rows" })
        end
    end
    local rows, rerr = job_rows.demand(db, board_id, config.kind)
    if rerr or not rows or not rows[1] then
        db:release()
        return nil, rerr or errors.new({ details = { code = "resource_not_found" },  kind = errors.NOT_FOUND, message = config.kind .. " demand is missing" })
    end
    if rows[1].status == "done" then db:release(); return { done = true }, nil end
    local state, decode_err = store.stored(rows[1].key, {} :: domain.JsonObject)
    if decode_err then db:release(); return nil, decode_err end

    local after = state.after :: string
    local items, ierr = job_rows.range(db, board_id, after, consts.LIMITS.recompute_batch)
    db:release()
    if ierr then return nil, ierr end
    if not items or #items == 0 then
        local job_id, decode_err = store.need(rows[1], "job_id")
        if decode_err or job_id == nil then return nil, decode_err end

        local done, err = job_rows.complete(board_id, job_id, config.kind, rows[1].key)
        return { done = done }, err
    end
    local item_id, decode_err = store.need(items[#items], "item_id")
    if decode_err or item_id == nil then return nil, decode_err end

    local event: domain.Event = { trace_context = trace_context, type = config.event, subject = config.kind, body = {
        recompute = { after = after, through = item_id, generation = state.generation :: integer },
        actor = (security.actor() :: security.Actor):id(), at = time.now():utc():format("2006-01-02T15:04:05.000000000Z"), source = config.kind,
    } }
    local _, aerr = append.writes(c, board_id, { { group = config.kind, events = { event }, ops = {}, caller_expect = false } })
    if aerr then return nil, aerr end
    return { done = false }, nil
end

return M
