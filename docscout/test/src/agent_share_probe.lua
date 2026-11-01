-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local component = require("component")
return { run = function(input: any): (any?, error?)
    local service, err = component.get_service()
    if err then return nil, err end
    if not service then return nil, errors.new({ kind = errors.INTERNAL, message = "Component service unavailable" }) end
    return service:grant_subtree({ root_component_id = input.component_id,
        subject = { subject_type = "user", subject_id = input.reader }, access_mask = component.ACCESS.READ })
end }
