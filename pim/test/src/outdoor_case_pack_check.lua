-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local types = require("types")

local function run(input: types.CheckInput): types.CheckResult
    local packs = input.view["logistics.case_pack"]
    local quantity = packs and packs[""]
    if input.previous_status == "draft" and input.proposed_status == "active"
        and (type(quantity) ~= "number" or quantity < 1) then
        return { findings = { { code = "case_pack_required", message = "Set the wholesale case quantity before activating this SKU." } } }
    end
    return { findings = {} }
end

return { run = run }
