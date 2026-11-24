-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local types = require("types")
local sql = require("sql")
local database = require("database")
local autoinit = require("autoinit")
local time = require("time")
local funcs = require("funcs")

local M = {IMPLEMENTATION = "kickside.mail.binding:library"}

function M.component_id(): string
    return autoinit.component_id(autoinit.SYSTEM_SCOPE_KEY, "kickside.mail.library")
end

function M.reserve(asset: types.Asset, deadline: integer): (boolean?, error?)
    return database.transaction(function(tx: sql.Transaction): (boolean?, error?)
        local _, err = tx:execute([[INSERT INTO mail_asset_file
            (upload_id,filename,content_type,size_bytes,width,height,due_at) VALUES ($1,$2,$3,$4,$5,$6,$7)]],
            {asset.upload_id, asset.filename, asset.content_type, asset.size, asset.width or sql.NULL,
                asset.height or sql.NULL, deadline})
        if err then return nil, err end
        return true, nil
    end)
end

local function now(): integer
    return time.now():unix_nano() // 1000000
end

local function unavailable(): error
    return errors.new({kind = errors.CONFLICT, message = "The mail asset version is unavailable",
        retryable = false, details = {code = "mail_asset_version_unavailable"}})
end

function M.activate(tx: sql.Transaction, id: string): error?
    local result, err = tx:execute([[UPDATE mail_asset_file SET due_at=NULL
        WHERE upload_id=$1 AND due_at>$2]], {id, now()})
    if err then return err end
    if result.rows_affected ~= 1 then return unavailable() end
    return nil
end

local function lock_active(tx: sql.Transaction, id: string): error?
    local result, err = tx:execute("UPDATE mail_asset_file SET due_at=NULL WHERE upload_id=$1 AND due_at IS NULL", {id})
    if err then return err end
    if result.rows_affected ~= 1 then return unavailable() end
    return nil
end

local function version_ids(rows: {types.Record}): {string}
    local ids: {string} = {}
    local seen: {[string]: boolean} = {}
    for _, row in ipairs(rows) do
        local id = row.upload_id :: string?
        if id and not seen[id] then
            ids[#ids + 1] = id
            seen[id] = true
        end
    end
    table.sort(ids)
    return ids
end

function M.release(tx: sql.Transaction, rows: {types.Record}, at: integer?): error?
    local deadline = at or now()
    for _, id in ipairs(version_ids(rows)) do
        -- Take the same row lock as admission before checking the remaining references.
        local _, lock_err = tx:execute("UPDATE mail_asset_file SET due_at=NULL WHERE upload_id=$1 AND due_at IS NULL", {id})
        if lock_err then return lock_err end
        local _, err = tx:execute([[UPDATE mail_asset_file SET due_at=$1 WHERE upload_id=$2 AND due_at IS NULL
            AND NOT EXISTS (SELECT 1 FROM mail_library_asset WHERE upload_id=$2)
            AND NOT EXISTS (SELECT 1 FROM mail_library_revision WHERE asset_upload_id=$2)
            AND NOT EXISTS (SELECT 1 FROM mail_message_asset WHERE upload_id=$2)]], {deadline, id})
        if err then return err end
    end
    return nil
end

function M.link(tx: sql.Transaction, id: string, refs: {types.AssetRef}?): error?
    for _, version in ipairs(version_ids((refs or {}) :: {types.Record})) do
        local err = lock_active(tx, version)
        if err then return err end
    end
    for _, ref in ipairs(refs or {}) do
        local _, err = tx:execute([[INSERT INTO mail_message_asset (message_id,name,content_id,original,upload_id)
            VALUES ($1,$2,$3,$4,$5)]], {id, ref.name, ref.content_id, ref.original or sql.NULL, ref.upload_id or sql.NULL})
        if err then return err end
    end
    return nil
end

function M.refs(id: string): ({types.AssetRef}?, error?)
    return database.read(function(db: sql.DB): ({types.AssetRef}?, error?)
        local rows, err = db:query("SELECT name,content_id,original,upload_id FROM mail_message_asset WHERE message_id=$1 ORDER BY name", {id})
        return rows :: {types.AssetRef}?, err
    end)
end

function M.detach(tx: sql.Transaction, id: string): error?
    local removed, err = tx:query("DELETE FROM mail_message_asset WHERE message_id=$1 RETURNING upload_id", {id})
    if err then return err end
    return M.release(tx, removed :: {types.Record})
end

function M.drop_expired_links(tx: sql.Transaction, cutoff: integer, limit: integer, now_ms: integer): error?
    local removed, err = tx:query([[DELETE FROM mail_message_asset WHERE message_id IN (
        SELECT id FROM mail_message WHERE finished_at <= $1 ORDER BY finished_at,id LIMIT $2
    ) RETURNING upload_id]], {cutoff, limit})
    if err then return err end
    return M.release(tx, removed :: {types.Record}, now_ms)
end

function M.collect(now_ms: integer, limit: integer): (integer?, error?)
    local rows, read_err = database.read(function(db: sql.DB): ({types.Record}?, error?)
        local found, err = db:query([[SELECT upload_id FROM mail_asset_file WHERE due_at<=$1
            ORDER BY due_at,upload_id LIMIT $2]], {now_ms, limit})
        return found :: {types.Record}?, err
    end)
    if read_err then return nil, read_err end
    local component_id = M.component_id()
    local removed: {string} = {}
    local failure: error?
    for _, row in ipairs(rows) do
        local id = row.upload_id :: string
        local _, err = funcs.call("kickside.uploads:reap_component_upload",
            {component_id = component_id, version_id = id, owner_impl = M.IMPLEMENTATION})
        if err then
            failure = failure or err
        else
            removed[#removed + 1] = id
        end
    end
    if #removed > 0 then
        local _, err = database.transaction(function(tx: sql.Transaction): (boolean?, error?)
            for _, id in ipairs(removed) do
                local _, delete_err = tx:execute("DELETE FROM mail_asset_file WHERE upload_id=$1 AND due_at<=$2", {id, now_ms})
                if delete_err then return nil, delete_err end
            end
            return true, nil
        end)
        if err then return nil, err end
    end
    return #removed, failure
end

return M
