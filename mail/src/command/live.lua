-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local database = require("database")
local live = require("live")
local originals = require("originals")
local reader = require("library_reader")
local state = require("live_repo")
local notify = require("notify")
local thread_events = require("thread_events")
local types = require("types")

local M = {}

function M.reconcile(boot: boolean?, after_seq: integer?): (boolean?, error?)
    local published, marker_err = live.marker()
    if marker_err then return nil, marker_err end
    local current, read_err = database.with_db(state.get_existing)
    if read_err then return nil, read_err end
    if not current and not boot then return false, nil end
    local seq = current and current.template_seq or 0
    if published == seq or (after_seq and seq <= after_seq) then return false, nil end
    local queued, err = database.with_tx(function(tx: database.Transaction, dialect: string): (boolean?, error?)
        local mark, lock_err = state.lock_existing(tx, dialect)
        if lock_err then return nil, lock_err end
        if not mark and not boot then return false, nil end
        local seq = mark and mark.template_seq or 0
        if after_seq and seq <= after_seq then return false, nil end
        local marker, check_err = live.marker()
        if check_err then return nil, check_err end
        if marker == seq then return false, nil end
        return state.enqueue_sync(tx, dialect, thread_events.library_thread_id(), seq)
    end)
    if err then return nil, err end
    if queued then notify.nudge() end
    return queued, nil
end

local function snapshot(ex: database.Executor): (types.LiveSnapshot?, error?)
    local before, err = state.get(ex)
    if err then return nil, err end
    local rows, read_err = reader.live_rows(ex)
    if read_err then return nil, read_err end
    local after, mark_err = state.get(ex)
    if mark_err then return nil, mark_err end
    if before.template_seq ~= after.template_seq then
        return nil, errors.new({kind = errors.CONFLICT, retryable = true, message = "Mail templates changed during publication",
            details = {code = "mail_library_publish_conflict"}})
    end
    return {seq = before.template_seq, projected_seq = after.projected_seq, rows = rows :: {types.Resource}}, nil
end

local function attempt(min_seq: integer?): (boolean?, error?)
    local overlay, open_err = live.open()
    if open_err then return nil, open_err end
    if not overlay then
        return nil, errors.new({kind = errors.INTERNAL, message = "Mail live overlay is unavailable",
            details = {code = "mail_library_overlay_missing"}})
    end
    local listed, list_err = overlay:entries()
    if list_err then return nil, list_err end
    local entries = listed :: {types.JetEntry}
    local marker = live.published(entries)
    local value, read_err = database.with_db(snapshot)
    if read_err then return nil, read_err end
    local data = value :: types.LiveSnapshot
    if min_seq and data.projected_seq < min_seq then return false, nil end
    if marker and marker >= data.seq then return false, nil end
    local declared, declaration_err = originals.list()
    if declaration_err then return nil, declaration_err end
    return live.publish(overlay, entries, data.rows, declared :: types.OriginalMap, data.seq)
end

function M.publish(min_seq: integer?): (boolean?, error?)
    local last: error?
    for _ = 1, 5 do
        local changed, err = attempt(min_seq)
        if not err then
            if changed then notify.library() end
            return true, nil
        end
        if not errors.is(err, errors.CONFLICT) then return nil, err end
        last = err
    end
    return nil, last
end

return M
