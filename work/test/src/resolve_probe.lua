-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Harness entry point: resolves a plugin's schema under whichever actor calls it.
local manifests = require("manifests")
local types = require("types")

type Request = { plugin: string, board_id: string, config: types.JsonObject?, current: types.PluginSchema? }

local M = {}

function M.run(request: Request): (types.PluginSchema?, error?)
    local p, err = manifests.load(request.plugin)
    if err or not p then return nil, err end
    return manifests.resolve_schema(p, { board_id = request.board_id, config = request.config or {}, current = request.current })
end

return M
