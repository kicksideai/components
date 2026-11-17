-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Component identity/access with controlled public metadata. This represents
-- the interval after a fold commits but before its post-commit hook publishes.
local types = require("types")
local M = {}
M.ACCESS = { READ = 1 }
local meta: types.ComponentMeta = {}
local candidates: { string } = {}

function M.metadata(value: types.ComponentMeta)
    meta = value
end

function M.directory(ids: { string })
    candidates = ids
end

function M.query(input: { component_ids: { string }?, offset: integer, limit: integer }): ({ types.ComponentRow }?, error?)
    if input.component_ids then
        return { { component_id = input.component_ids[1], access_level = 11, meta = meta } }, nil
    end
    local rows: { types.ComponentRow } = {}
    for i = input.offset + 1, math.min(input.offset + input.limit, #candidates) do
        rows[#rows + 1] = { component_id = candidates[i], access_level = 11, meta = meta }
    end
    return rows, nil
end

return M
