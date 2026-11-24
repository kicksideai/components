-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local storage = require("storage")
local projection_feed = require("projection_feed")
local M = {}

type Projection = {
    thread_id: string,
    projection: { id: string, kind: string, body: {
        worker_config: { plugin: string, board_id: string, attachment_id: string },
        token: string?, capacity_after: string | false | nil,
    } },
    range: { from_seq: integer, to_seq: integer },
}
type Result = { last_seq: integer, patch: { token: string, capacity_after: string | false }? }

function M.run(input: Projection): (Result?, error?)
    local body = input.projection.body
    local config = body.worker_config
    if config.board_id ~= input.thread_id or config.plugin ~= "kickside.work.planning:plugin"
        or input.projection.kind ~= "kickside.work.planning:capacity_lifecycle" then
        return nil, errors.new({ kind = errors.INVALID, message = "Invalid Planning capacity projection." })
    end
    local page, err = projection_feed.page({
        board_id = input.thread_id, plugin = config.plugin, attachment_id = config.attachment_id,
        projection_id = input.projection.id, kind = input.projection.kind, token = body.token,
    })
    if err or not page then return nil, err end
    if page.attachment_id ~= config.attachment_id then
        return nil, errors.new({ kind = errors.CONFLICT, message = "Planning attachment changed during the projection." })
    end
    local after = (page.reset or not body.token) and "" or body.capacity_after or nil
    local folded, fold_err = storage.fold(input.thread_id, page.attachment_id, page.changes, after)
    if not folded then return nil, fold_err end
    return { last_seq = page.done and not folded.after and input.range.to_seq or input.range.from_seq - 1,
        patch = { token = page.token, capacity_after = folded.after or false } }, nil
end

return M
