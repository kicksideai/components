-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local component = require("component")
local ctx = require("ctx")
local sql = require("sql")
local time = require("time")
local storage = require("storage")
local rows = require("rows")

local function delete(): ({ success: boolean }?, error?)
    local attachment = ctx.get("component_id") :: string
    local context, err = component.get_private_context(attachment)
    if err or not context then return nil, err end
    local board = context.board_id :: string
    local db, open_err = storage.open()
    if open_err or not db then return nil, open_err end
    local done, retire_err = rows.transaction(db, function(tx: sql.Transaction): (boolean?, error?)
        local _, write_err = tx:execute([[INSERT INTO kickside_work_time_attachment (attachment_id, board_id, retired_at_ms)
            VALUES ($1,$2,$3) ON CONFLICT (attachment_id) DO UPDATE SET retired_at_ms = excluded.retired_at_ms
            WHERE kickside_work_time_attachment.board_id = excluded.board_id AND kickside_work_time_attachment.retired_at_ms IS NULL]],
            { attachment, board, time.now():unix_nano() // 1000000 })
        if write_err then return nil, write_err end
        return true, nil
    end)
    local _, release_err = db:release()
    if retire_err or release_err or not done then return nil, retire_err or release_err end
    return { success = true }, nil
end

return { delete = delete }
