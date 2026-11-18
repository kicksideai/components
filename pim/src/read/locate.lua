-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- A catalog is discoverable once its first schema generation commits.
local component = require("component")
local access = require("access")
local consts = require("consts")
local failure = require("failure")
local store = require("store")
local types = require("types")

local M = {}

local trim = require("trim_text").trim

local function committed(ids: { string }): ({ [string]: types.Row }?, error?)
    if #ids == 0 then return {}, nil end
    local params: { string } = {}
    for i = 1, #ids do params[i] = "$" .. tostring(i) end
    return store.with_db(function(db: types.Executor): ({ [string]: types.Row }?, error?)
        local rows, err = db:query("SELECT catalog_id, generation, product_count, item_count, rebuild_after"
            .. " FROM kickside_pim_catalog WHERE catalog_id IN (" .. table.concat(params, ",") .. ")", ids)
        if err then return nil, errors.wrap(err, "catalog discovery failed") end
        local by_id: { [string]: types.Row } = {}
        for _, row in ipairs(rows or {}) do
            local decoded, derr = store.decode_row(row, { catalog_id = "text", generation = "int",
                product_count = "int", item_count = "int" })
            if derr or not decoded then return nil, derr end
            by_id[decoded.catalog_id :: string] = decoded
        end
        return by_id, nil
    end)
end

-- Page the actor-scoped component directory and look up committed state by id.
function M.readable(limit: integer, offset: integer?, exact: string?): ({ types.CatalogSummary }?, error?, integer?)
    local start = offset or 0
    local rows, err = component.query({ impl_ids = { consts.CATALOG_IMPL }, access_mask = component.ACCESS.READ,
        component_ids = exact and { exact } or nil, include = { meta = true, access = true },
        order_by = { field = "component_id", direction = "ASC" }, limit = exact and 1 or limit + 1, offset = start })
    if err then return nil, errors.wrap(err, "catalog lookup failed") end
    local ids: { string } = {}
    for i, raw in ipairs(rows or {}) do
        if i > limit then break end
        local id = type(raw) == "table" and raw.component_id or nil
        if not id or id == "" then return nil, failure.corrupt("catalog component row is malformed") end
        ids[i] = id
    end
    local by_id, cerr = committed(ids)
    if cerr or not by_id then return nil, cerr end
    local out: { types.CatalogSummary } = {}
    for i, id in ipairs(ids) do
        local state = by_id[id]
        if not state then return nil, failure.catalog_not_initialized() end
        local row = (rows :: { types.ComponentRow })[i]
        local granted, gerr = access.describe(row.access_level)
        if gerr or not granted then return nil, gerr end
        local title = trim((row.meta or {}).title)
        out[i] = { catalog_id = id, access = granted, title = title ~= "" and title or "Catalog",
            generation = state.generation :: integer, product_count = state.product_count :: integer,
            item_count = state.item_count :: integer, status = type(state.rebuild_after) == "string" and "rebuilding" or "ready" }
    end
    local next_offset = rows and #rows > limit and start + limit or nil
    return out, nil, next_offset
end

function M.summary(id: string): (types.CatalogSummary?, error?)
    local rows, err = M.readable(1, 0, id)
    if err or not rows then return nil, err end
    if not rows[1] then return nil, errors.new({ kind = errors.NOT_FOUND, message = "catalog not found", details = { code = "catalog_not_found" } }) end
    return rows[1], nil
end

-- An implicit request addresses the caller's only initialized readable catalog.
function M.resolve(explicit: string?): (string?, error?)
    local id = trim(explicit)
    if id ~= "" then return id, nil end
    local page, err = M.readable(2)
    if err or not page then return nil, err end
    local first, second = page[1], page[2]
    if first and second then
        return nil, errors.new({ kind = errors.CONFLICT,
            message = "several catalogs are available; pass catalog_id as one of: "
                .. first.catalog_id .. " (" .. first.title .. "), " .. second.catalog_id .. " (" .. second.title .. ")",
            details = { code = "catalog_ambiguous" } })
    end
    if first then return first.catalog_id, nil end
    return nil, errors.new({ kind = errors.NOT_FOUND, message = "no catalog is available; create one first", details = { code = "catalog_not_found" } })
end

return M
