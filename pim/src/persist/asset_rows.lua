-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local clock = require("clock")
local time = require("time")
local types = require("types")

local M = {}
local GRACE_SECONDS = 15 * 60

function M.reserve(db: types.Executor, catalog: string, id: string): (string?, error?)
    local lease = clock.offset(GRACE_SECONDS)
    local _, err = db:execute("INSERT INTO kickside_pim_asset (catalog_id, asset_id, due_at) VALUES ($1,$2,$3)",
        {catalog, id, lease})
    if err then return nil, err end
    return lease, nil
end

function M.adopted(db: types.Executor, catalog: string, id: string): error?
    local result, err = db:execute([[UPDATE kickside_pim_asset SET adopting=0
        WHERE catalog_id=$1 AND asset_id=$2 AND reaping=0 AND adopting=1]], {catalog, id})
    if err then return err end
    if tonumber(result.rows_affected) ~= 1 then
        return errors.new({kind = errors.CONFLICT, message = "asset adoption expired", details = {code = "invalid_reference"}})
    end
    return nil
end

function M.active(db: types.Executor, catalog: string, id: string): (boolean?, error?)
    local rows, err = db:query([[SELECT 1 FROM kickside_pim_asset
        WHERE catalog_id=$1 AND asset_id=$2 AND reaping=0 AND adopting=0]], {catalog, id})
    if err then return nil, err end
    return rows ~= nil and #rows > 0, nil
end

function M.schedule(db: types.Executor, catalog: string, ids: {[string]: boolean}, at: string?): error?
    local when = at or clock.now()
    for id in pairs(ids) do
        local _, err = db:execute([[UPDATE kickside_pim_asset SET due_at=$1
            WHERE catalog_id=$2 AND asset_id=$3 AND reaping=0 AND NOT EXISTS (
                SELECT 1 FROM kickside_pim_ref WHERE catalog_id=$2 AND kind='asset' AND target=$3)]], {when, catalog, id})
        if err then return err end
    end
    return nil
end

function M.protect(db: types.Executor, catalog: string, ids: {[string]: boolean}): error?
    for id in pairs(ids) do
        local _, err = db:execute([[UPDATE kickside_pim_asset SET due_at=NULL
            WHERE catalog_id=$1 AND asset_id=$2 AND due_at IS NOT NULL AND reaping=0]], {catalog, id})
        if err then return err end
    end
    return nil
end

function M.products(db: types.Executor, catalog: string, product_ids: {string}): ({[string]: boolean}?, error?)
    local found: {[string]: boolean} = {}
    for first = 1, #product_ids, 200 do
        local params: types.SqlParams = {catalog}
        local marks: {string} = {}
        for i = first, math.min(first + 199, #product_ids) do
            params[#params + 1] = product_ids[i]
            marks[#marks + 1] = "$" .. #params
        end
        local rows, err = db:query([[SELECT target FROM kickside_pim_ref
            WHERE catalog_id=$1 AND kind='asset' AND product_id IN (]] .. table.concat(marks, ",") .. ")", params)
        if err then return nil, err end
        for _, row in ipairs(rows or {}) do found[row.target :: string] = true end
    end
    return found, nil
end

function M.drop_attribute(db: types.Executor, catalog: string, attr: integer, limit: integer): (integer?, boolean?, error?)
    local selected = [[SELECT product_id,ctx,path,kind,target FROM kickside_pim_ref WHERE catalog_id=$1
        AND attribute_id=$2 ORDER BY product_id,ctx,path LIMIT $3]]
    local rows, err = db:query(selected, {catalog, attr, math.max(limit, 1)})
    if err then return nil, nil, err end
    local count = #(rows or {})
    if limit == 0 or count == 0 then return 0, count > 0, nil end
    local _, delete_err = db:execute([[DELETE FROM kickside_pim_ref WHERE catalog_id=$1 AND attribute_id=$2
        AND (product_id,ctx,path) IN (SELECT product_id,ctx,path FROM (]] .. selected .. ") AS page)", {catalog, attr, limit})
    if delete_err then return nil, nil, delete_err end
    local ids: {[string]: boolean} = {}
    for _, row in ipairs(rows or {}) do
        if row.kind == "asset" then ids[row.target :: string] = true end
    end
    return count, count == limit, M.schedule(db, catalog, ids)
end

function M.release(db: types.Executor, catalog: string, release_id: string, links: {[string]: types.LinkTarget}): error?
    local used: {[string]: boolean} = {}
    for key in pairs(links) do
        local id = key:match("^asset:(.+)$")
        if id then
            local _, err = db:execute([[INSERT INTO kickside_pim_ref
                (catalog_id, product_id, attribute_id, ctx, path, kind, target)
                VALUES ($1,$2,0,'',$3,'asset',$3) ON CONFLICT DO NOTHING]], {catalog, "release:" .. release_id, id})
            if err then return err end
            used[id] = true
        end
    end
    return M.protect(db, catalog, used)
end

function M.unpin_release(db: types.Executor, catalog: string, release_id: string): error?
    local holder = "release:" .. release_id
    local removed, err = db:query("SELECT target FROM kickside_pim_ref WHERE catalog_id=$1 AND product_id=$2", {catalog, holder})
    if err then return err end
    if not removed or #removed == 0 then return nil end
    local _, delete_err = db:execute("DELETE FROM kickside_pim_ref WHERE catalog_id=$1 AND product_id=$2", {catalog, holder})
    if delete_err then return delete_err end
    local ids: {[string]: boolean} = {}
    for _, row in ipairs(removed or {}) do ids[row.target :: string] = true end
    return M.schedule(db, catalog, ids)
end

type Due = {ids: {string}, head: integer?}
function M.due(db: types.Executor, catalog: string, limit: integer): (Due?, error?)
    local rows, err = db:query([[SELECT a.asset_id, c.applied_seq FROM kickside_pim_asset AS a
        JOIN kickside_pim_catalog AS c ON c.catalog_id=a.catalog_id
        WHERE a.catalog_id=$1 AND a.reaping=0 AND a.due_at IS NOT NULL AND a.due_at <= $2
        ORDER BY a.due_at, a.asset_id LIMIT $3]], {catalog, clock.now(), limit})
    if err then return nil, err end
    local ids: {string} = {}
    for _, row in ipairs(rows or {}) do ids[#ids + 1] = row.asset_id :: string end
    local head = rows and rows[1] and math.tointeger(tonumber(rows[1].applied_seq)) or nil
    return {ids = ids, head = head}, nil
end

function M.deadline(db: types.Executor, catalog: string): (integer?, error?)
    local rows, err = db:query([[SELECT due_at FROM kickside_pim_asset
        WHERE catalog_id=$1 AND reaping=0 AND due_at IS NOT NULL AND due_at > $2
        ORDER BY due_at,asset_id LIMIT 1]], {catalog, clock.now()})
    if err or not rows or not rows[1] then return nil, err end
    local at, parse_err = time.parse(time.RFC3339, rows[1].due_at :: string)
    if parse_err or not at then return nil, parse_err end
    return at:unix_nano() // 1000000, nil
end

function M.fence(db: types.Executor, catalog: string, ids: {string}): error?
    for _, id in ipairs(ids) do
        local _, err = db:execute([[UPDATE kickside_pim_asset SET reaping=1 WHERE catalog_id=$1 AND asset_id=$2
            AND due_at IS NOT NULL AND reaping=0 AND NOT EXISTS (
                SELECT 1 FROM kickside_pim_ref WHERE catalog_id=$1 AND kind='asset' AND target=$2)]], {catalog, id})
        if err then return err end
    end
    return nil
end

function M.collectable(db: types.Executor, catalog: string, limit: integer, teardown: boolean?): ({types.Row}?, error?)
    if teardown then
        return db:query([[SELECT asset_id,due_at,adopting FROM kickside_pim_asset
            WHERE catalog_id=$1 ORDER BY asset_id LIMIT $2]], {catalog, limit})
    end
    return db:query([[SELECT asset_id FROM kickside_pim_asset WHERE catalog_id=$1 AND reaping=1
        ORDER BY asset_id LIMIT $2]], {catalog, limit})
end

function M.forget(db: types.Executor, catalog: string, id: string): error?
    local _, err = db:execute("DELETE FROM kickside_pim_asset WHERE catalog_id=$1 AND asset_id=$2", {catalog, id})
    return err
end

return M
