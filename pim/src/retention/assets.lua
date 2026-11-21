-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local asset_rows = require("asset_rows")
local clock = require("clock")
local consts = require("consts")
local funcs = require("funcs")
local store = require("store")
local threads = require("threads")
local time = require("time")
local types = require("types")

local M = {}
type Collected = { deleted: integer, spent: integer, more: boolean, deadline_ms: integer?, error: error? }
M.Collected = Collected

function M.collect(catalog: string, limit: integer, teardown: boolean?): (Collected?, error?)
    local rows, err = store.with_db(function(db: types.Executor) return asset_rows.collectable(db, catalog, limit + 1, teardown) end)
    if err or not rows then return nil, err end
    local out: Collected = {deleted = 0, spent = 0, more = #rows > limit}
    for i = 1, math.min(#rows, limit) do
        local row = rows[i]
        local due = row.due_at :: string?
        if teardown and tonumber(row.adopting) == 1 and due and due > clock.now() then
            local at, parse_err = time.parse(time.RFC3339, due)
            if parse_err or not at then return nil, parse_err end
            local until_ms = at:unix_nano() // 1000000
            out.deadline_ms = out.deadline_ms and math.min(out.deadline_ms, until_ms) or until_ms
        else
            local id = row.asset_id :: string
            local result, reap_err = funcs.call("kickside.uploads:reap_component_upload", {component_id = catalog, version_id = id, owner_impl = consts.CATALOG_IMPL})
            out.spent = out.spent + 1
            if reap_err or not result then
                out.error = out.error or reap_err or errors.new({kind = errors.INTERNAL, message = "asset collection returned no result"})
            else
                local _, forget_err = store.transaction("retire collected asset", function(tx: types.Executor, _dialect: string): (boolean?, error?)
                    local ferr = asset_rows.forget(tx, catalog, id)
                    if ferr then return nil, ferr end
                    return true, nil
                end)
                if forget_err then return nil, forget_err end
                out.deleted = out.deleted + 1
            end
        end
    end
    return out, nil
end

function M.retain(c: threads.Client, catalog: string, limit: integer): (Collected?, error?)
    if limit < 1 then return {deleted = 0, spent = 0, more = false}, nil end
    local collected, collect_err = M.collect(catalog, limit)
    if collect_err or not collected then return nil, collect_err end
    if collected.spent >= limit then
        collected.more = true
        return collected, nil
    end
    local capacity = limit - collected.spent
    local candidates, scan_err = store.with_db(function(db: types.Executor)
        return asset_rows.due(db, catalog, capacity)
    end)
    if scan_err or not candidates then return nil, scan_err end
    if #candidates.ids > 0 then
        local event: types.Event = {type = consts.EVENTS.ASSETS_REAPING, subject = "assets",
            body = {ids = candidates.ids}}
        local _, append_err = threads.append(c, catalog, {event}, {head = candidates.head :: integer})
        if append_err and not threads.mismatch(append_err, "head_mismatch") then return nil, append_err end
        collected.more = true
        collected.spent = collected.spent + #candidates.ids
    end
    local deadline, deadline_err = store.with_db(function(db: types.Executor) return asset_rows.deadline(db, catalog) end)
    if deadline_err then return nil, deadline_err end
    collected.deadline_ms = deadline
    return collected, nil
end

return M
