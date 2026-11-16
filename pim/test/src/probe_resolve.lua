-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Harness entry point: resolves a plugin's schema under whichever actor calls it.
local plugins = require("plugins")
local types = require("types")

type Request = { plugin: string, catalog_id: string, config: types.JsonObject?, current: types.PluginSchema? }

local M = {}

function M.run(request: Request): (types.PluginSchema?, error?)
    local p, err = plugins.load(request.plugin)
    if err or not p then return nil, err end
    return plugins.resolve_schema(p, { catalog_id = request.catalog_id, config = request.config or {}, current = request.current })
end

return M
