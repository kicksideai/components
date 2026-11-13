-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local local_types = require("local_types")
-- Collection sources retain the board's durable change cursor and retractions.
local board_client = require("board_client")
local data_error = require("data_error")
local types = require("types")
local domain = require("domain")
local M = {}





local function pull(req: local_types.Request, filtered: boolean): local_types.Result
    local config = req.config or {}
    if not config.board_id or config.board_id == "" then
        return data_error.failure(errors.new({ kind = errors.INVALID, message = "config.board_id is required", details = { code = "invalid_config" } })) :: local_types.Result
    end
    local opened, err = board_client.open()
    if err or not opened then return data_error.failure(err :: error) :: local_types.Result end
    local client = opened :: local_types.Board
    local page, read_err = client:list_changes({ board_id = config.board_id, cursor = req.cursor, limit = req.limit,
        selection = filtered and config.where or nil })
    if read_err then return data_error.failure(read_err) :: local_types.Result end
    local result = page :: types.ChangesResult
    if result.gap then
        return data_error.failure(errors.new({ kind = errors.CONFLICT, message = "source cursor requires a resync",
            details = { code = "source_gap", floor = result.gap.floor } })) :: local_types.Result
    end
    local items: { local_types.Item } = {}
    for i, item in ipairs(result.items) do
        items[i] = { item_key = item.item_id, dedup_key = item.item_id .. ":" .. item.updated_seq,
            source_version = string.format("%020d", item.updated_seq), op = item.op, payload = item.op == "upsert" and item or nil }
    end
    return { success = true, items = items, next_cursor = result.next, has_more = result.has_more }
end
function M.items(req: local_types.Request): local_types.Result return pull(req, true) end
function M.changes(req: local_types.Request): local_types.Result return pull(req, false) end
return M
