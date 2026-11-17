-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Component identity/access with controlled public metadata. This represents
-- the interval after a fold commits but before its post-commit hook publishes.
local types = require("types")
local M = {}
M.ACCESS = { READ = 1 }
local meta: types.ComponentMeta = {}

function M.metadata(value: types.ComponentMeta)
    meta = value
end

function M.query(input: { component_ids: { string } }): ({ types.ComponentRow }?, error?)
    return { { component_id = input.component_ids[1], access_level = 11, meta = meta } }, nil
end

return M
