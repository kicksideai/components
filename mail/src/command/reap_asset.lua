-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local content = require("content")
local funcs = require("funcs")

local function run(version_id: string): (boolean?, error?)
    local _, err = funcs.call("kickside.uploads:reap_component_upload", {
        component_id = content.library_component_id(), version_id = version_id,
        owner_impl = "kickside.mail.binding:library",
    })
    if err then return nil, err end
    return true, nil
end

return {run = run}
