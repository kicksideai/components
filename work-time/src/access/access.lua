-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local sql = require("sql")
local security = require("security")
local identity = require("identity")
local work = require("work")
local work_access = require("work_access")
local principals = require("principals")
local item_view = require("item_view")
local work_store = require("work_store")
local plugin_rows = require("plugin_rows")
local config = require("config")

type Admission = { grants: work.BoardAccess, person_id: string, board: work.Board, attachment_id: string }
local M = { Admission = Admission, PLUGIN = "kickside.work.time:plugin" }

function M.problem(kind: string, code: string, message: string): error
    return errors.new({ kind = kind, message = message, retryable = false, details = { code = code } })
end

function M.missing(): error
    return M.problem(errors.NOT_FOUND, "worklog_not_found", "Work item or worklog is unavailable on this board")
end

local function inactive(): error
    return M.problem(errors.NOT_FOUND, "plugin_inactive", "Work Time is inactive on this board")
end

function M.admit(db: sql.DB, board_id: string, operation: string): (Admission?, error?)
    local grants, err = work_access.effective(board_id)
    if err or not grants then return nil, err end
    if operation == "create" and not grants.write or operation ~= "read" and not (grants.write or grants.admin) then
        return nil, M.problem(errors.PERMISSION_DENIED, "worklog_write_denied", "Board WRITE is required to log time")
    end
    local actor = security.actor()
    local principal, principal_err = identity.principal_of_key(actor and actor:id())
    if principal_err or not principal or principal.kind ~= "user" then
        return nil, M.problem(errors.PERMISSION_DENIED, "person_required", "Work Time requires an authenticated person")
    end
    local active, aerr = plugin_rows.active(db, board_id, M.PLUGIN)
    if aerr or not active then return nil, aerr or inactive() end
    local board, berr = work_store.board(db, board_id)
    if berr or not board then return nil, berr or M.missing() end
    if board.compiled.visibility then
        local caller, cerr = principals.for_board(board_id, board.compiled)
        if cerr or not caller then return nil, cerr end
        board.caller = caller
    end
    board.dialect = db:type()
    return { grants = grants, person_id = principal.id, board = board, attachment_id = active.attachment_id }, nil
end

-- Refresh Work's schema and active attachment on the same transaction that
-- will select items and change Time rows. Holder authority is bound to its schema.
function M.current(tx: sql.Transaction, admitted: Admission): (work.Board?, config.Config?, error?)
    local board_id = admitted.board.board_id
    local board, berr = work_store.board(tx, board_id)
    if berr or not board then return nil, nil, berr or M.missing() end
    if board.digest ~= admitted.board.digest then return nil, nil, work_access.changed() end
    board.caller, board.dialect = admitted.board.caller, admitted.board.dialect
    local active, err = plugin_rows.active(tx, board_id, M.PLUGIN)
    if err or not active or active.attachment_id ~= admitted.attachment_id then
        return nil, nil, err or inactive()
    end
    return board, config.effective(active.config), nil
end

function M.live_item(tx: sql.DB | sql.Transaction, board: work.Board, item_id: string): (work.Item?, error?)
    local item, err = item_view.find(tx, board, { id = item_id })
    if err or not item or item.life ~= "live" then return nil, err or M.missing() end
    return item, nil
end

function M.can_edit(admitted: Admission, person_id: string): boolean
    return admitted.grants.admin or (admitted.grants.write and admitted.person_id == person_id)
end

-- Used by entry and timesheet queries after Work's board and item checks.
function M.person_filter(admitted: Admission, settings: config.Config, person_id: string?): (string?, error?)
    if settings.entry_visibility ~= "self" or admitted.grants.admin then return person_id, nil end
    if person_id and person_id ~= admitted.person_id then
        return nil, M.problem(errors.PERMISSION_DENIED, "worklog_person_denied", "This board limits worklogs to your own entries")
    end
    return admitted.person_id, nil
end

return M
