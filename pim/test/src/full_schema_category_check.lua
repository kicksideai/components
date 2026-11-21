-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local types = require("types")

local function run(input: types.CheckInput): types.CheckResult
    local category = (input.view["item.category"] or {})[""] :: types.Ref?
    if category and category.ref[2] == input.config.blocked then
        return { findings = { {
            code = "blocked_category", attribute = "item.category", message = "This category is blocked.",
        } } }
    end
    return { findings = {} }
end

return { run = run }
