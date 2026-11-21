-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local contract = require("contract")
local security = require("security")
local uuid = require("uuid")
local asset_rows = require("asset_rows")
local store = require("store")
local types = require("types")

type Request = { catalog_id: string, ids: {string} }
type Info = { filename: string, content_type: string, size: integer, checksum: string?,
    source_ref: { component_id: string?, upload_id: string } }
type Provider = { get_info: (self: Provider, options: { format: string }) -> (Info?, error?) }
local M = {}

function M.describe(request: Request): ({targets: {[string]: types.LinkTarget}}?, error?)
    local targets: {[string]: types.LinkTarget} = {}
    if #request.ids == 0 then return {targets = targets}, nil end
    local definition, err = contract.get("kickside.contract:content_provider")
    if err or not definition then return nil, err end
    local actor, scope = security.actor(), security.scope()
    for _, id in ipairs(request.ids) do
        if uuid.validate(id) then
            local active, aerr = store.with_db(function(db: types.Executor)
                return asset_rows.active(db, request.catalog_id, id)
            end)
            if aerr then return nil, aerr end
            if active then
                local instance, open_err = definition:with_actor(actor):with_scope(scope)
                    :with_context({upload_id = id}):open("kickside.uploads:content_provider")
                if open_err or not instance then return nil, open_err end
                local info, read_err = (instance :: Provider):get_info({format = "raw"})
                if read_err and not (errors.is(read_err, errors.NOT_FOUND) or errors.is(read_err, errors.PERMISSION_DENIED)) then
                    return nil, read_err
                end
                if info and info.source_ref.component_id == request.catalog_id and info.source_ref.upload_id == id
                    and type(info.checksum) == "string" and #info.checksum == 64 then
                    targets[id] = {label = info.filename, data = {upload_id = id, checksum = info.checksum,
                        content_type = info.content_type, size = info.size}}
                end
            end
        end
    end
    return {targets = targets}, nil
end

function M.resolve(request: Request): ({ids: {string}}?, error?)
    local result, err = M.describe(request)
    if err or not result then return nil, err end
    local ids: {string} = {}
    for _, id in ipairs(request.ids) do
        if result.targets[id] then ids[#ids + 1] = id end
    end
    return {ids = ids}, nil
end

return M
