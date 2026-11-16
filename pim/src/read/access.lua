-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Shared read discipline: READ access, the min_seq check, and one read
-- snapshot over the catalog that stamps every answer with its position.
local security = require("security")
local component = require("component")
local store = require("store")
local types = require("types")
local failure = require("failure")

local M = {}

type Snapshot<T> = (types.Executor, types.Catalog, string) -> (T?, error?)

M.invalid = failure.invalid

-- Reader resolves the ambient caller's independent component grants once.
type Reader = types.Reader
M.Reader = Reader

function M.describe(raw: unknown): (types.CatalogAccess?, error?)
    local mask = type(raw) == "number" and math.tointeger(raw) or nil
    if not mask or mask < 0 then
        return nil, failure.corrupt("component access mask is malformed")
    end
    return { read = (mask & component.ACCESS.READ) ~= 0, write = (mask & component.ACCESS.WRITE) ~= 0,
        admin = (mask & component.ACCESS.ADMIN) ~= 0 }, nil
end

-- reader admits the ambient caller to read catalog_id.
function M.reader(catalog_id: string): (Reader?, error?)
    if catalog_id == "" then return nil, M.invalid("catalog_id required") end
    local mask, err = component.validate_access(catalog_id, component.ACCESS.READ)
    if err then return nil, failure.coded(errors.wrap(err, "catalog access denied"), "catalog_access_denied") end
    local granted, gerr = M.describe(mask)
    if gerr or not granted then return nil, gerr end
    local levels: { [string]: boolean } = { read = granted.read, write = granted.write, admin = granted.admin }
    local function allows(level: string): boolean
        return levels[level] == true
    end
    local actor = security.actor()
    return { catalog_id = catalog_id, actor = actor and actor:id() or nil, allows = allows }, nil
end

-- with_snapshot runs fn for an admitted reader inside one read transaction over
-- the catalog's committed state. A read that names a min_seq the projection has
-- yet to reach answers a retryable unavailability at once.
function M.with_snapshot<T: types.ReadStamp>(r: Reader, fn: Snapshot<T>, min_seq: integer?): (T?, error?)
    local result, catalog, err = store.snapshot(r.catalog_id, function(tx: types.Executor, c: types.Catalog, dialect: string): (T?, error?)
        if min_seq and min_seq > c.applied_seq then
            return nil, errors.new({ kind = errors.UNAVAILABLE, retryable = true, message = "the projection has not reached seq " .. min_seq,
                details = { code = "projection_behind", applied_seq = c.applied_seq } })
        end
        return fn(tx, c, dialect)
    end)
    if err or not result or not catalog then return nil, err end
    result.as_of = catalog.applied_seq
    result.generation = catalog.generation
    result.rebuilding = catalog.rebuild_after ~= nil
    return result, nil
end


return M
