-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local work = require("work")
local document = require("document")

local M = {}

function M.over_estimate(board: work.Board, item: work.Item, minutes: integer): boolean
    local estimate = board.model.fields.time_original_minutes
    local original = estimate and document.value(item.document, estimate.id)
    return type(original) == "number" and minutes > original
end

return M
