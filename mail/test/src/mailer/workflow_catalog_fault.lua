-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local ctx = require("ctx")
local published_catalog = require("published_catalog")

local function catalog(options)
    if ctx.get("mail_test_catalog_error") then
        return nil, errors.new({kind = errors.UNAVAILABLE, message = "Workflow catalog unavailable"})
    end
    return published_catalog.catalog(options)
end

return {catalog = catalog}
