-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local work = require("work")

type Config = { rounding_minutes: integer, entry_visibility: string, item_types: { string } }
local M = { Config = Config }

-- Work validates the effective configuration before resolving the provider.
function M.effective(values: work.JsonObject): Config
    return {
        rounding_minutes = (values.rounding_minutes :: integer?) or 1,
        entry_visibility = (values.entry_visibility :: string?) or "all",
        item_types = (values.item_types :: { string }?) or {},
    }
end

return M
