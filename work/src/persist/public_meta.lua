-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local storage = require("storage")
-- Publishes caller-independent board metadata after the projection commits.
-- The fold itself has no side effects.
local component = require("component")
local funcs = require("funcs")
local job_rows = require("job_rows")
local store = require("store")
local board_meta = require("board_meta")

local M = {}

function M.publish(input: storage.MetaInput): (storage.Published?, error?)
    local board_id = input.thread_id
    if type(board_id) ~= "string" or board_id == "" then return { published = false }, nil end
    local db, err = store.open()
    if not db then return nil, err end
    local metadata, merr = board_meta.get(db, board_id)
    if merr then db:release(); return nil, merr end
    local fields: { [string]: unknown } = {}
    if metadata then fields.title, fields.description, fields.icon = metadata.title, metadata.description, metadata.icon end
    local board, berr = store.board(db, board_id)
    if berr then db:release(); return nil, berr end
    if not board then
        db:release()
        if not metadata then return { published = false }, nil end
        local ok, err = component.set_meta(board_id, fields, { trusted_runtime = true, delete_keys = { "item_count", "open_count", "completed_count", "trashed_count", "category_counts" } })
        if not ok then return nil, err end
        return { published = true }, nil
    end
    local rebuilds, rerr = job_rows.rebuilds(db, board_id)
    db:release()
    if rerr then return nil, rerr end
    local rebuilding = false
    local rebuild_error = ""
    for _, row in ipairs(rebuilds or {}) do
        if row.status == "failed" then rebuild_error = store.text(row.error) or "board rebuild failed"
        else rebuilding = true end
    end
    local counts: { [string]: unknown } = { key_prefix = board.key_prefix, generation = board.generation,
        last_event_seq = board.applied_seq, reindexing = rebuilding, rebuild_error = rebuild_error,
        status = rebuild_error ~= "" and "error" or rebuilding and "reindexing" or "ready" }
    for key, value in pairs(counts) do fields[key] = value end
    local ok, serr = component.set_meta(board_id, fields, { trusted_runtime = true, delete_keys = { "item_count", "open_count", "completed_count", "trashed_count", "category_counts" } })
    if not ok then return nil, serr or errors.new({ details = { code = "internal" }, kind = errors.INTERNAL, message = "board meta write returned no result" }) end
    return { published = true }, nil
end

-- after_commit is the projection's post-commit hook; it publishes under the
-- trusted meta policy of publish_meta.
function M.after_commit(input: storage.MetaInput): (storage.Published?, error?)
    local _, err = funcs.call("kickside.work.persist:publish_meta", input)
    if err then return nil, err end
    return { published = true }, nil
end

return M
