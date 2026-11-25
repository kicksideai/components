-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local types = require("types")
local asset_file_repo = require("asset_file_repo")
local database = require("database")
local content = require("content")
local time = require("time")
local funcs = require("funcs")

local M = {IMPLEMENTATION = "kickside.mail.binding:library"}

M.component_id = content.library_component_id

function M.reserve(asset: types.Asset, deadline: integer): (boolean?, error?)
    return database.with_tx(function(tx: types.Transaction): (boolean?, error?)
        return asset_file_repo.reserve(tx, asset, deadline)
    end)
end

local function now(): integer
    return time.now():unix_nano() // 1000000
end

function M.activate(tx: types.Transaction, id: string, deadline: integer): error?
    local _, err = asset_file_repo.activate(tx, id, deadline, now())
    return err
end

function M.release(tx: types.Transaction, rows: {types.Record}): error?
    local _, err = asset_file_repo.release(tx, rows, now())
    return err
end

function M.link(tx: types.Transaction, id: string, refs: {types.AssetRef}?): error?
    local _, err = asset_file_repo.link(tx, id, refs)
    return err
end

function M.refs(id: string): ({types.AssetRef}?, error?)
    return database.with_db(function(db: types.DB): ({types.AssetRef}?, error?)
        return asset_file_repo.refs(db, id)
    end)
end

function M.detach(tx: types.Transaction, id: string): error?
    local _, err = asset_file_repo.detach(tx, id, now())
    return err
end

function M.drop_expired_links(tx: types.Transaction, cutoff: integer, limit: integer, now_ms: integer): error?
    local _, err = asset_file_repo.drop_expired_links(tx, cutoff, limit, now_ms)
    return err
end

function M.collect(now_ms: integer, limit: integer, blocked_until: integer): (integer?, {types.BlockedAsset}?, error?)
    local ids, read_err = database.with_db(function(db: types.DB): ({string}?, error?)
        return asset_file_repo.due_unreferenced(db, now_ms, limit)
    end)
    if read_err then return nil, nil, read_err end
    local component_id = M.component_id()
    local removed: {string} = {}
    local deferred: {string} = {}
    local blocked: {types.BlockedAsset} = {}
    for _, id in ipairs(ids) do
        local _, err = funcs.call("kickside.uploads:reap_component_upload",
            {component_id = component_id, version_id = id, owner_impl = M.IMPLEMENTATION})
        if err then
            deferred[#deferred + 1] = id
            blocked[#blocked + 1] = {component_id = component_id, error = err}
        else
            removed[#removed + 1] = id
        end
    end
    if #ids > 0 then
        local _, err = database.with_tx(function(tx: types.Transaction): (boolean?, error?)
            local _, forget_err = asset_file_repo.forget(tx, removed, now_ms)
            if forget_err then return nil, forget_err end
            return asset_file_repo.schedule(tx, deferred, blocked_until, now_ms)
        end)
        if err then return nil, nil, err end
    end
    return #removed, blocked, nil
end

return M
