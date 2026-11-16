-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local failure=require("failure")
-- The catalogs a caller can read, and the rule that picks one: an explicit id,
-- otherwise the caller's only readable catalog.
local component = require("component")
local access = require("access")
local consts = require("consts")
local types = require("types")

local M = {}


-- trim returns the text of v with surrounding space removed; non-text is empty.
local trim = require("trim_text").trim

-- readable lists the catalogs the caller can read, oldest first.
function M.readable(limit:integer?,offset:integer?,exact:string?): ({ types.CatalogSummary }?, error?)
    local rows, err = component.query({ impl_ids = { consts.CATALOG_IMPL }, access_mask = component.ACCESS.READ,
        component_ids = exact and {exact} or nil,
        include = { meta = true, access = true }, order_by = { field = "component_id", direction = "ASC" }, limit = limit or 50,offset=offset or 0 })
    if err then return nil, errors.wrap(err, "catalog lookup failed") end
    local out: { types.CatalogSummary } = {}
    for _, raw in ipairs(type(rows) == "table" and (rows :: { unknown }) or {}) do
        if type(raw) ~= "table" then return nil, failure.corrupt("catalog component row is malformed") end
        local row = raw :: types.ComponentRow
        local id = trim(row.component_id)
        if id ~= "" then
            local granted, gerr = access.describe(row.access_level)
            if gerr or not granted then return nil, gerr end
            local meta: types.ComponentMeta = row.meta or {}
            out[#out + 1] = { catalog_id = id, access = granted, title = trim(meta.title) ~= "" and trim(meta.title) or "Catalog",
                product_count = meta.product_count and math.tointeger(meta.product_count) or nil,
                item_count = meta.item_count and math.tointeger(meta.item_count) or nil,
                generation = meta.generation and math.tointeger(meta.generation) or nil, status = meta.status }
        end
    end
    return out, nil
end

-- Exact summary remains actor-scoped and uses the component identity lookup.
function M.summary(id:string): (types.CatalogSummary?,error?)
    local rows,err=M.readable(1,0,id)
    if err or not rows then return nil,err end
    if not rows[1] then return nil,errors.new({kind=errors.NOT_FOUND,message="catalog not found",details={code="catalog_not_found"}}) end
    return rows[1],nil
end

-- resolve answers the catalog a request addresses.
function M.resolve(explicit: string?): (string?, error?)
    local id = trim(explicit)
    if id ~= "" then return id, nil end
    local catalogs, err = M.readable(2)
    if not catalogs then return nil, err end
    if #catalogs == 1 then return catalogs[1].catalog_id, nil end
    if #catalogs == 0 then return nil, errors.new({ kind = errors.NOT_FOUND, message = "no catalog is available; create one first", details = { code = "catalog_not_found" } }) end
    local named: { string } = {}
    for _, c in ipairs(catalogs) do named[#named + 1] = c.catalog_id .. " (" .. c.title .. ")" end
    return nil, errors.new({ kind = errors.CONFLICT,
        message = "several catalogs are available; pass catalog_id as one of: " .. table.concat(named, ", "),
        details = { code = "catalog_ambiguous" } })
end

M.trim = trim

return M
