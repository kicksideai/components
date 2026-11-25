-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local contract = require("contract")
local security = require("security")
local uploads = require("uploads")
local upload_types = require("upload_types")

local function run(input)
    local actor = assert(security.actor())
    if input.cleanup then
        return uploads.purge_owner(actor:id())
    end
    local owner = upload_types.component_id_for_owner(actor:id())
    local components = assert(assert(contract.get("kickside.component:component_service")):open())
    local found = assert(components:query({component_ids = {owner}}))
    assert(found.success, tostring(found.error))
    if #found.components == 0 then
        local registered = assert(components:register({component_id = owner, impl_id = upload_types.IMPL}))
        assert(registered.success, tostring(registered.error))
    end
    local upload, err = uploads.store_file(actor:id(), input.bytes, "mark", #input.bytes, input.mime, "app:uploads")
    if err then return nil, err end
    return upload.uuid, nil
end

return {run = run}
