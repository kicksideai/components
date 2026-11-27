-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local function run()
    local api = contract.get("kplat.jobs:api")
    return api, "kplat.jobs:api_binding"
end
return { run = run }
