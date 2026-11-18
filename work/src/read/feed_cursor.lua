-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local codec = require("codec")
local types = require("types")
local M = {}

local function unavailable(): error
    return errors.new({ kind = errors.UNAVAILABLE, message = "feed position encryption is unavailable",
        details = { code = "feed_cursor_unavailable" } })
end

local function invalid(): error
    return errors.new({ kind = errors.INVALID, message = "feed position is invalid", details = { code = "invalid_feed_cursor" } })
end

local function context(board_id: string, cursor: types.ChangesCursor): string
    return "kickside.work.feed.v1\0" .. board_id .. "\0" .. cursor.seq .. "\0" .. (cursor.floor or 0) .. "\0" .. (cursor.access or "")
end

function M.anchor(board_id: string, cursor: types.ChangesCursor): (string?, error?)
    if not cursor.position then return cursor.item_id, nil end
    if cursor.item_id ~= "" or cursor.seq <= 0 or #cursor.position > 128 then return nil, invalid() end
    local item_id, err = codec.open(cursor.position, context(board_id, cursor))
    if err and err:kind() == errors.UNAVAILABLE then return nil, unavailable() end
    if err or not item_id then return nil, invalid() end
    return item_id, nil
end

function M.conceal(board_id: string, cursor: types.ChangesCursor, item_id: string): error?
    local sealed, err = codec.seal(item_id, context(board_id, cursor))
    if err or not sealed then return unavailable() end
    cursor.item_id, cursor.position = "", sealed
    return nil
end

return M
