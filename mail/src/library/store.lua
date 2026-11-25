-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local types = require("types")
local library_reader = require("library_reader")
local library_repo = require("library_repo")
local reference_repo = require("reference_repo")
local references = require("references")
local library = require("library")
local asset_store = require("asset_store")

local M = {
    get = library_reader.get,
    history = library_reader.history,
    live_rows = library_reader.live_rows,
    referrers = library.referrers,
    message_names = library.message_names,
}

function M.lock(tx: types.Transaction, dialect: string): error?
    local _, err = library_repo.lock(tx, dialect)
    return err
end

function M.write(tx: types.Transaction, item: types.Resource, change: types.RevisionChange): (types.Resource?, error?)
    local written, err = library_repo.write(tx, item, change)
    if err then return nil, err end
    local release_err = asset_store.release(tx, written.released)
    if release_err then return nil, release_err end
    if item.kind ~= "asset" and not item.archived and change.state ~= "original" then
        local _, ref_err = reference_repo.replace(tx, item, references.keys(item))
        if ref_err then return nil, ref_err end
    end
    return written.item, nil
end

function M.remove(tx: types.Transaction, key: types.ResourceKey, deleting: boolean): error?
    local released, err = library_repo.remove(tx, key, deleting)
    if err then return err end
    if key.kind ~= "asset" then
        local _, ref_err = reference_repo.delete_from(tx, key)
        if ref_err then return ref_err end
    end
    return asset_store.release(tx, released :: {types.Record})
end

return M
