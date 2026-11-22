-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local store = require("store")
local storage = require("storage")
local types = require("types")
local M = {}

function M.get(db: storage.Executor, board_id: string): (types.BoardMeta?, error?)
    local rows, err = db:query("SELECT title, description, icon, ui_app, applied_seq FROM kickside_work_board_meta WHERE board_id = $1", { board_id })
    if err then return nil, err end
    if not rows or not rows[1] then return nil, nil end
    local row = rows[1]
    local title, terr = store.need(row, "title")
    if terr then return nil, terr end
    local description, derr = store.need(row, "description")
    if derr then return nil, derr end
    local icon, ierr = store.need(row, "icon")
    if ierr then return nil, ierr end
    local ui_app, uerr = store.need(row, "ui_app")
    if uerr then return nil, uerr end
    local seq, serr = store.need_int(row, "applied_seq")
    if serr then return nil, serr end
    return { title = title :: string, description = description :: string, icon = icon :: string, ui_app = ui_app :: string, applied_seq = seq }, nil
end

function M.packs(ids: { unknown }, pack_filter: string?): ({ { board_id: string, pack: string, version: string, digest: string } }?, error?)
    if #ids == 0 then return {}, nil end
    local placeholders: { string } = {}
    for i = 1, #ids do placeholders[i] = "$" .. i end
    local db, derr = store.open()
    if not db then return nil, derr end
    local rows, err = db:query("SELECT board_id,pack,pack_version,pack_digest FROM kickside_work_board WHERE board_id IN (" ..
        table.concat(placeholders, ",") .. ") ORDER BY board_id", ids)
    db:release()
    if err then return nil, err end
    local packs = {}
    for _, row in ipairs(rows or {}) do
        local pack = store.text(row.pack)
        if pack and (not pack_filter or pack_filter == pack) then
            local board_id, ierr = store.need(row, "board_id")
            if ierr then return nil, ierr end
            local version, verr = store.need(row, "pack_version")
            if verr then return nil, verr end
            local digest, digest_err = store.need(row, "pack_digest")
            if digest_err then return nil, digest_err end
            packs[#packs + 1] = { board_id = board_id :: string, pack = pack, version = version :: string, digest = digest :: string }
        end
    end
    return packs, nil
end

function M.fold(tx: storage.Executor, board_id: string, event: types.FoldEvent): error?
    local body = event.body
    local _, err = tx:execute([[INSERT INTO kickside_work_board_meta (board_id, title, description, icon, ui_app, applied_seq)
        VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT (board_id) DO UPDATE SET title = excluded.title,
        description = excluded.description, icon = excluded.icon, ui_app = excluded.ui_app, applied_seq = excluded.applied_seq]],
        { board_id, body.title, body.description, body.icon, body.ui_app or "", event.seq })
    return err
end

return M
