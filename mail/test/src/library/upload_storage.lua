-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local storage = require("storage")
local interleave = require("asset_interleave")

local function get(...)
    local volume, err = storage.get(...)
    if err then return nil, err end
    local remove = volume.remove
    function volume:remove(path)
        interleave.pause_reap(path)
        return remove(self, path)
    end
    return volume, nil
end

return {get = get}
