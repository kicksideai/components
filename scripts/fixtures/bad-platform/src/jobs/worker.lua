-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local function run()
    local secret = funcs.call("kplat.jobs:secret_fn")
    local bound = funcs.call("kplat.jobs.binding:run_func")
    local handled = funcs.call("kplat.jobs:list_handler")
    local missing = "kplat.jobs.persist:gone"
    return secret, bound, handled, missing
end
return { run = run }
