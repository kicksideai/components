-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Release reads: current publications protect immutable snapshots; unreferenced
-- releases expire after the catalog audit window.
local consts = require("consts")
local store = require("store")
local read_model = require("read_model")
local access = require("access")
local types = require("types")

local M = {}


local function record(r: types.Row): (types.ReleaseRecord?, error?)
    local decoded, err = store.decode_row(r, { release_id = "text", product_id = "text", version = "int", generation = "int", hash = "text", seq = "int", created_at = "text", snapshot = "json", channels = "json" })
    if err or not decoded then return nil, err end
    r = decoded
    local snap: types.Snapshot = r.snapshot :: types.Snapshot
    local channels: { string } = r.channels :: { string }
    return { release_id = r.release_id :: string, product_id = r.product_id :: string, version = r.version :: integer,
        generation = r.generation :: integer, snapshot = snap, hash = r.hash :: string, channels = channels,
        seq = r.seq :: integer, created_at = r.created_at :: string } , nil
end

function M.get_release(catalog_id: string, request: types.GetReleaseRequest): (types.GetReleaseResult?, error?)
    local caller, access_err = access.reader(catalog_id)
    if access_err or not caller then return nil, access_err end
    return access.with_snapshot(caller, function(tx: types.Executor, _catalog: types.Catalog, _dialect: string): (types.GetReleaseResult?, error?)
        local row, err = read_model.release(tx, catalog_id, request.release_id)
        if err then return nil, err end
        if not row then return nil, errors.new({ kind = errors.NOT_FOUND, message = "release not found", details = { code = "release_not_found" } }) end
        local release, rerr = record(row)
        if rerr then return nil, rerr end
        return { release = release }, nil
    end)
end

-- releases(catalog_id, { product, before?, limit? }) lists a product's releases newest first.
function M.releases(catalog_id: string, request: types.ReleasesRequest): (types.ReleasesResult?, error?)
    local caller, access_err = access.reader(catalog_id)
    if access_err or not caller then return nil, access_err end
    local limit = request.limit or 50
    if limit < 1 or limit > consts.LIMITS.page then return nil, access.invalid("limit must be 1.." .. consts.LIMITS.page) end
    return access.with_snapshot(caller, function(tx: types.Executor, _catalog: types.Catalog, _dialect: string): (types.ReleasesResult?, error?)
        local ref = request.product
        local p: types.Product?
        local err: error?
        if ref.id then p, err = store.product(tx, catalog_id, ref.id :: string)
        elseif ref.sku then p, err = store.product_by_sku(tx, catalog_id, ref.sku :: string)
        else return nil, access.invalid("product id or sku required") end
        if err then return nil, err end
        if not p then return nil, errors.new({ kind = errors.NOT_FOUND, message = "product not found", details = { code = "product_not_found" } }) end
        local rows, qerr = read_model.releases(tx, catalog_id, p.product_id, request.before, limit + 1)
        if qerr then return nil, qerr end
        local out: { types.ReleaseRecord } = {}
        for i = 1, math.min(#(rows or {}), limit) do
            local release, rerr = record(rows[i])
            if rerr or not release then return nil, rerr end
            out[i] = release
        end
        local next_seq: integer? = nil
        if #(rows or {}) > limit then next_seq = out[#out].seq end
        return { releases = out, next = next_seq }, nil
    end)
end

return M
