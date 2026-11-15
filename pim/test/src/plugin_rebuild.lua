-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local writer = require("writer")
local function run(input: { catalog_id: string, plugin: string }): (unknown, error?)
    return writer.rebuild_plugin(input.catalog_id, input.plugin)
end
return { run = run }
