-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local ctx = require("ctx")
local writer = require("writer")

local function delete(): ({success: boolean}?, error?)
    local _, err = writer.teardown(ctx.get("component_id") :: string?)
    if err then return nil, err end
    return {success = true}, nil
end

return {delete = delete}
