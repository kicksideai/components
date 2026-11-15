-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local function delete(): ({ success: boolean }, error?)
    return { success = true }, nil
end
return { delete = delete }
