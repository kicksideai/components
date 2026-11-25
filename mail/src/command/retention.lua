-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local types = require("types")
local asset_file_repo = require("asset_file_repo")
local database = require("database")
local content = require("content")
local uploads = require("uploads")

local M = {}

function M.collect(now_ms: integer, limit: integer, blocked_until: integer): (integer?, {types.BlockedAsset}?, error?)
    local ids, read_err = database.with_db(function(db: types.DB): ({string}?, error?)
        return asset_file_repo.due_unreferenced(db, now_ms, limit)
    end)
    if read_err then return nil, nil, read_err end
    local component_id = content.library_component_id()
    local removed: {string} = {}
    local deferred: {string} = {}
    local blocked: {types.BlockedAsset} = {}
    for _, id in ipairs(ids) do
        local err = uploads.reap(component_id, id)
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
