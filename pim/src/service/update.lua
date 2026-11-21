-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local locate = require("locate")
local requests = require("requests")
local types = require("types")
local ui_app = require("ui_app")

local function update(input: unknown): (types.UpdateResult?, error?)
    local err = requests.parse("update", input)
    if err then return nil, err end
    local request = input :: types.UpdateRequest
    local id, resolve_err = locate.resolve(request.catalog_id)
    if resolve_err or not id then return nil, resolve_err end
    return ui_app.update(id, request.ui_app)
end

return { update = update }
