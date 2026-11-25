-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local function load(fn)
    local ok, err = pcall(fn)
    return ok, err
end
return { load = load }
