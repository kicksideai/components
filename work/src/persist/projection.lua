-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local storage = require("storage")
-- Board projection worker: folds each prefetched batch in one transaction.
-- Batches can be delivered again before the cursor advances; the fold skips events
-- at or below board.applied_seq, which commits with the folded rows.
local jobs = require("jobs")
local store = require("store")
local materializer = require("materializer")
local types = require("types")
local consts = require("consts")

local principals = require("principals")
local M = {}

-- run folds one batch. The projection body is returned untouched: it carries the
-- engine's own configuration.
function M.run(raw: unknown): (storage.ProjectionOutput?, error?)
    -- Core's projection runtime supplies this input; thread and range are checked
    -- because every fold depends on them.
    local input = raw :: types.ProjectionInput
    local board_id = type(raw) == "table" and input.thread_id or nil
    if type(board_id) ~= "string" or board_id == "" then
        return nil, errors.new({ details = { code = "invalid_projection" }, kind = errors.INVALID, message = "projection input missing thread_id" })
    end
    local to_seq = type(input.range) == "table" and math.tointeger(input.range.to_seq) or nil
    if not to_seq then return nil, errors.new({ details = { code = "invalid_projection" }, kind = errors.INVALID, message = "projection input missing range" }) end
    local db, err = store.open()
    if not db then return nil, err end
    local dialect = db:type()
    local previous, previous_err = store.board(db, board_id)
    if previous_err then db:release(); return nil, previous_err end
    local compiled = previous and previous.compiled
    for _, event in ipairs(input.events or {}) do
        if event.type == consts.EVENTS.SCHEMA_APPLIED then
            local parsed, err = materializer.decode(event)
            if err then db:release(); return nil, err end
            if parsed and parsed.body.compiled then compiled = parsed.body.compiled end
        end
    end
    local caller: types.AccessCaller? = nil
    local caller_error: error? = nil
    if compiled and #(compiled.plugins or {}) > 0 then caller, caller_error = principals.for_board(board_id, compiled) end
    local tx, begin_err = db:begin()
    if begin_err then
        db:release()
        return nil, errors.wrap(begin_err, "projection transaction begin failed")
    end
    local folded, fold_err = materializer.fold(tx, dialect, board_id, input.events or {}, to_seq, consts.LIMITS.fold_rows, caller, caller_error)
    if fold_err or not folded then
        tx:rollback()
        db:release()
        return nil, fold_err
    end
    local _, commit_err = tx:commit()
    db:release()
    if commit_err then return nil, errors.wrap(commit_err, "projection commit failed") end
    if folded.plugin_job then
        local _, wake_err = jobs.wake_job(folded.plugin_job, { control = true, ensure_due = true })
        if wake_err then return nil, wake_err end
    end
    if folded.reindex_job then
        local _, wake_err = jobs.wake_job(folded.reindex_job, { control = true, ensure_due = true })
        if wake_err then return nil, errors.wrap(wake_err, "reindex wake failed") end
    end
    if folded.migration_job then
        local _, wake_err = jobs.wake_job(folded.migration_job, { control = true, ensure_due = true })
        if wake_err then return nil, errors.wrap(wake_err, "migration wake failed") end
    end
    if folded.recompute_job then
        local _, wake_err = jobs.wake_job(folded.recompute_job, { control = true, ensure_due = true })
        if wake_err then return nil, errors.wrap(wake_err, "recompute wake failed") end
    end
    if folded.rebalance_job then
        local _, wake_err = jobs.wake_job(folded.rebalance_job, { control = true, ensure_due = true })
        if wake_err then return nil, errors.wrap(wake_err, "rebalance wake failed") end
    end
    return { body = input.projection and input.projection.body or {}, last_seq = folded.last_seq }, nil
end

return M
