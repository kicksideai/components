-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local sql = require("sql")
local time = require("time")
local work = require("work")
local reads = require("reads")
local projection_feed = require("projection_feed")
local work_store = require("work_store")
local plugin_rows = require("plugin_rows")
local storage = require("storage")
local rows = require("rows")
local types = require("types")
local writer = require("writer")
local comparison = require("comparison")

local PLUGIN = "kickside.work.time:plugin"
local PROJECTION = "kickside.work.time:items"
local RECONCILE_BATCH = 50

type Config = { plugin: string, board_id: string, attachment_id: string }
type Body = { worker_config: Config, token: string?, reconcile_after: string? }
type Request = {
    thread_id: string,
    projection: { id: string, kind: string, body: Body },
    range: { from_seq: integer, to_seq: integer },
}
type Result = { last_seq: integer, patch: { token: string, reconcile_after: string }? }

local function observe(tx: sql.Transaction, position: types.Position, board: work.Board, item_id: string, now_ms: integer): error?
    local fences, err = tx:query([[SELECT retired_at_ms FROM kickside_work_time_item
        WHERE attachment_id = $1 AND item_id = $2]], { position.attachment_id, item_id })
    if err or not fences[1] or fences[1].retired_at_ms ~= nil then return err end
    local item, read_err = work_store.item(tx, position.board_id, item_id)
    if read_err then return read_err end
    -- A newer item is handled by the next feed page under its own board schema.
    if item and item.updated_seq > board.applied_seq then return nil end
    if not item or item.life == "purged" then
        local _, retire_err = tx:execute([[UPDATE kickside_work_time_item SET retired_at_ms = $1
            WHERE attachment_id = $2 AND item_id = $3]], { now_ms, position.attachment_id, item_id })
        return retire_err
    end
    if item.life ~= "live" then return nil end

    local total, total_err = rows.total(tx, position.attachment_id, item_id)
    if total_err or not total or total.entry_count == 0 then return total_err end
    local over = comparison.over_estimate(board, item, total.minutes)
    if over == total.over_estimate then return nil end
    total.over_estimate = over
    local save_err = rows.replace_total(tx, position, item_id, total)
    if save_err then return save_err end
    if board.compiled.visibility == nil then
        return writer.estimate(tx, position.attachment_id, position.board_id, item_id, item.updated_seq)
    end
    return nil
end

local function reconcile(tx: sql.Transaction, position: types.Position, board: work.Board, after: string,
    now_ms: integer): (string?, error?)
    local keys, err = tx:query([[SELECT item_id FROM kickside_work_time_item
        WHERE attachment_id = $1 AND item_id > $2 ORDER BY item_id LIMIT $3]],
        { position.attachment_id, after, RECONCILE_BATCH + 1 })
    if err then return nil, err end
    for i = 1, math.min(#keys, RECONCILE_BATCH) do
        local fold_err = observe(tx, position, board, keys[i].item_id, now_ms)
        if fold_err then return nil, fold_err end
    end
    return #keys > RECONCILE_BATCH and keys[RECONCILE_BATCH].item_id or "", nil
end

local function apply_page(input: Request, position: types.Position, page: reads.PluginFeed): (Result?, error?)
    local body = input.projection.body
    local now_ms = time.now():unix_nano() // 1000000
    local db, err = storage.open()
    if err or not db then return nil, err end
    local result, apply_err = rows.transaction(db, function(tx: sql.Transaction): (Result?, error?)
        local lock_err = rows.lock_attachment(tx, position)
        if lock_err then
            if lock_err:kind() == errors.NOT_FOUND then return { last_seq = input.range.to_seq }, nil end
            return nil, lock_err
        end
        local active, active_err = plugin_rows.active(tx, position.board_id, PLUGIN)
        if active_err then return nil, active_err end
        if not active or active.attachment_id ~= position.attachment_id then return { last_seq = input.range.to_seq }, nil end
        local board, board_err = work_store.board(tx, position.board_id)
        if board_err or not board then return nil, board_err end
        for _, change in ipairs(page.changes) do
            local change_err = observe(tx, position, board, change.item_id, now_ms)
            if change_err then return nil, change_err end
        end
        local after = body.reconcile_after or ""
        if body.token == nil or page.reset or after ~= "" then
            if page.reset then after = "" end
            local next_after, reconcile_err = reconcile(tx, position, board, after, now_ms)
            if reconcile_err or next_after == nil then return nil, reconcile_err end
            after = next_after
        end
        return {
            patch = { token = page.token, reconcile_after = after },
            last_seq = page.done and after == "" and input.range.to_seq or input.range.from_seq - 1,
        }, nil
    end)
    local _, release_err = db:release()
    if apply_err or release_err then return nil, apply_err or release_err end
    return result, nil
end

local function run(input: Request): (Result?, error?)
    local body = input.projection.body
    local config = body.worker_config
    if config.plugin ~= PLUGIN or config.board_id ~= input.thread_id or input.projection.kind ~= PROJECTION then
        return nil, errors.new({ kind = errors.INVALID, message = "invalid Time projection registration" })
    end
    local page, err = projection_feed.page({
        board_id = config.board_id, plugin = PLUGIN, kind = PROJECTION, token = body.token,
        attachment_id = config.attachment_id, projection_id = input.projection.id,
    })
    if err or not page then return nil, err end
    return apply_page(input, { board_id = config.board_id, attachment_id = config.attachment_id }, page)
end

return { run = run }
