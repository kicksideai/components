-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local M = {}
function M.prepare(input: { board_id: string }): (unknown, error?)
    return { state = { board_id = input.board_id }, metadata = { title = "Stage consumer" },
        source = { source_kind = "event", source_ref = "kickside.work.ports:stage_entered", source_thread_id = input.board_id, start = "new" }, enabled = false }, nil
end
return M
