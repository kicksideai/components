-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local types = require("types")

local M = {}

function M.next_due(ex: types.Executor): (integer?, error?)
    local rows, err = ex:query([[SELECT due_at FROM mail_asset_file WHERE due_at IS NOT NULL
        ORDER BY due_at,upload_id LIMIT 1]])
    if err then return nil, err end
    local first = rows[1]
    return first and first.due_at :: integer?, nil
end

return M
