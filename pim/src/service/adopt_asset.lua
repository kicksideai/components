-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local funcs = require("funcs")
local uuid = require("uuid")
local component = require("component")
local asset_rows = require("asset_rows")
local locate = require("locate")
local requests = require("requests")
local failure = require("failure")
local store = require("store")
local types = require("types")

local function run(input: unknown): (types.JsonObject?, error?)
    local invalid = requests.parse("adopt_asset", input)
    if invalid then return nil, invalid end
    local request = input :: {catalog_id: string?, upload_id: string}
    local catalog_id, locate_err = locate.resolve(request.catalog_id)
    if locate_err or not catalog_id then return nil, locate_err end
    local _, access_err = component.validate_access(catalog_id, component.ACCESS.WRITE)
    if access_err then return nil, access_err end
    local version = uuid.v7()
    local reserved, reserve_err = store.transaction("reserve catalog asset", function(tx: types.Executor, dialect: string)
        local row, err = store.catalog(tx, catalog_id, dialect)
        if err then return nil, err end
        if not row then return nil, failure.catalog_not_initialized() end
        local deleting, derr = tx:query("SELECT 1 FROM kickside_pim_cleanup WHERE catalog_id=$1", {catalog_id})
        if derr then return nil, derr end
        if deleting and #deleting > 0 then return nil, failure.catalog_not_initialized() end
        return asset_rows.reserve(tx, catalog_id, version)
    end)
    if reserve_err or not reserved then return nil, reserve_err end
    local asset, adopt_err = funcs.call("kickside.uploads:adopt_component_upload",
        { component_id = catalog_id, version_id = version, upload_id = request.upload_id, lease_until = reserved })
    if adopt_err then return nil, adopt_err end
    if not asset then return nil, failure.corrupt("asset adoption returned no version") end
    local _, finish_err = store.transaction("finish catalog asset", function(tx: types.Executor, _dialect: string)
        local err = asset_rows.adopted(tx, catalog_id, version)
        if err then return nil, err end
        return true, nil
    end)
    if finish_err then return nil, finish_err end
    return requests.output("adopt_asset", { asset = {ref = {"asset", version}} })
end

return {run = run}
