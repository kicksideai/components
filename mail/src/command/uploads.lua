-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local funcs = require("funcs")

local function adopt(component_id: string, upload_id: string, version_id: string, lease_until: string): ({upload_id: string}?, error?)
    local result, err = funcs.call("kickside.uploads:adopt_component_upload", {
        component_id = component_id, upload_id = upload_id, version_id = version_id, lease_until = lease_until,
    })
    return result :: {upload_id: string}?, err
end

return {adopt = adopt}
