-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local funcs = require("funcs")
local store = require("store")
local board_meta = require("board_meta")
local guard = require("guard")
local locate = require("locate")
local threads = require("threads")
local append = require("append")
local receipts = require("receipts")
local clock = require("clock")
local consts = require("consts")
local domain = require("domain")
local types = require("types")
local M = {}

function M.update(request: types.UpdateRequest): (types.UpdateResult?, error?)
    local access_err = guard.require_access(request.board_id, guard.admin_access())
    if access_err then return nil, access_err end
    if request.key_prefix ~= nil then return nil, guard.invalid("board key prefix is immutable", { code = "prefix_immutable" }) end
    local title = request.title and locate.trim(request.title) or nil
    if title == "" then return nil, guard.invalid("board title must be nonblank", { code = "board_title_blank" }) end
    if title and #title > 255 then return nil, guard.invalid("board title exceeds 255 bytes", { code = "board_title_too_long" }) end
    local deadline = clock.deadline(consts.LIMITS.command_deadline_ms)
    local head, herr = receipts.covered(request.board_id, deadline)
    if herr or not head then return nil, herr end
    local db, derr = store.open()
    if derr or not db then return nil, derr end
    local previous, perr = board_meta.get(db, request.board_id)
    db:release()
    if perr then return nil, perr end
    if not previous then previous, perr = locate.metadata(request.board_id, guard.admin_access()) end
    if perr or not previous then return nil, perr end
    local metadata: domain.BoardMeta = { title = title or previous.title,
        description = request.description or previous.description,
        icon = request.icon or previous.icon }
    if metadata.title == previous.title and metadata.description == previous.description and metadata.icon == previous.icon then
        return { board_id = request.board_id, status = "unchanged", as_of = head }, nil
    end
    local event: domain.Event = { type = consts.EVENTS.BOARD_UPDATED, subject = "board", body = {
        title = metadata.title, description = metadata.description, icon = metadata.icon } }
    receipts.decorate(event, guard.actor_id(), guard.stamp_now(), "api", nil, nil)
    local client, cerr = threads.open()
    if cerr or not client then return nil, cerr end
    local seq, aerr = append.writes(client, request.board_id, { { group = "board", events = { event }, ops = {}, expect_head = head, caller_expect = true } })
    if aerr then return nil, aerr end
    local as_of, werr = receipts.covered(request.board_id, deadline)
    if werr then return nil, werr end
    local _, publish_err = funcs.call("kickside.work.persist:publish_meta", { thread_id = request.board_id })
    if publish_err then return nil, publish_err end
    return { board_id = request.board_id, status = "updated", seq = seq, as_of = as_of }, nil
end

return M
