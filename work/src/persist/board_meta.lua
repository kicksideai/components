-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local store = require("store")
local storage = require("storage")
local types = require("types")
local M = {}

function M.get(db: storage.Executor, board_id: string): (types.BoardMeta?, error?)
    local rows, err = db:query("SELECT title, description, icon, applied_seq FROM kickside_work_board_meta WHERE board_id = $1", { board_id })
    if err then return nil, err end
    if not rows or not rows[1] then return nil, nil end
    local row = rows[1]
    local title, terr = store.need(row, "title")
    if terr then return nil, terr end
    local description, derr = store.need(row, "description")
    if derr then return nil, derr end
    local icon, ierr = store.need(row, "icon")
    if ierr then return nil, ierr end
    local seq, serr = store.need_int(row, "applied_seq")
    if serr then return nil, serr end
    return { title = title :: string, description = description :: string, icon = icon :: string, applied_seq = seq }, nil
end

function M.fold(tx: storage.Executor, board_id: string, event: types.FoldEvent): error?
    local body = event.body
    local _, err = tx:execute([[INSERT INTO kickside_work_board_meta (board_id, title, description, icon, applied_seq)
        VALUES ($1, $2, $3, $4, $5) ON CONFLICT (board_id) DO UPDATE SET title = excluded.title,
        description = excluded.description, icon = excluded.icon, applied_seq = excluded.applied_seq]],
        { board_id, body.title, body.description, body.icon, event.seq })
    return err
end

return M
