-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local threads=require("threads")
local M={}
local fail=true
function M.reset() fail=true end
function M.open() return threads.open() end
function M.ensure(client,input)
    if fail then fail=false;return errors.new({kind=errors.UNAVAILABLE,retryable=true,message="transient thread convergence"}) end
    return threads.ensure(client,input)
end
return M
