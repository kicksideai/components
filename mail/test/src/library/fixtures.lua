-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local database = require("database")
local funcs = require("funcs")
local store = require("store")

local function remove(keys)
    if #keys == 0 then return end
    assert(database.transaction(function(tx)
        for _, key in ipairs(keys) do
            local err = store.remove(tx, key, true)
            if err then return nil, err end
        end
        return true, nil
    end))
    local result = assert(funcs.call("kickside.mail.library:reconcile"))
    assert(result.status == "success", result.message)
end

return {remove = remove}
