-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local ctx = require("ctx")
local security = require("security")
local component = require("component")
local repository = require("repository")

local function delete(): (any?, error?)
    local id = ctx.get("component_id")
    if not security.can("component.context.read_system", "kickside.component:context") then
        local _, err = component.validate_access(id, component.ACCESS.DELETE)
        if err then return nil, err end
    end
    return repository.delete(id)
end

return { delete = delete }
