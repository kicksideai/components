-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local types = require("types")
local sql = require("sql")

local M = {}

function M.next_due(ex: types.Executor): (integer?, error?)
    local rows, err = ex:query([[SELECT due_at FROM mail_asset_file WHERE due_at IS NOT NULL
        ORDER BY due_at,upload_id LIMIT 1]])
    if err then return nil, err end
    local first = rows[1]
    return first and first.due_at :: integer?, nil
end

function M.reserve(tx: types.Transaction, asset: types.Asset, deadline: integer): (boolean?, error?)
    local _, err = tx:execute([[INSERT INTO mail_asset_file
        (upload_id,filename,content_type,size_bytes,due_at) VALUES ($1,$2,$3,$4,$5)]],
        {asset.upload_id, asset.filename, asset.content_type, asset.size, deadline})
    if err then return nil, err end
    return true, nil
end

local function unavailable(): error
    return errors.new({kind = errors.CONFLICT, message = "The mail asset version is unavailable",
        retryable = false, details = {code = "mail_asset_version_unavailable"}})
end

function M.activate(tx: types.Transaction, id: string, deadline: integer, now_ms: integer): (boolean?, error?)
    local result, err = tx:execute([[UPDATE mail_asset_file SET due_at=NULL
        WHERE upload_id=$1 AND due_at=$2 AND due_at>$3]], {id, deadline, now_ms})
    if err then return nil, err end
    if result.rows_affected ~= 1 then return nil, unavailable() end
    return true, nil
end

local function lock_active(tx: types.Transaction, id: string): (boolean?, error?)
    local result, err = tx:execute("UPDATE mail_asset_file SET due_at=NULL WHERE upload_id=$1 AND due_at IS NULL", {id})
    if err then return nil, err end
    if result.rows_affected ~= 1 then return nil, unavailable() end
    return true, nil
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

function M.release(tx: types.Transaction, rows: {types.Record}, deadline: integer): (boolean?, error?)
    for _, id in ipairs(version_ids(rows)) do
        -- Take the same row lock as admission before checking the remaining references.
        local _, lock_err = tx:execute("UPDATE mail_asset_file SET due_at=NULL WHERE upload_id=$1 AND due_at IS NULL", {id})
        if lock_err then return nil, lock_err end
        local _, err = tx:execute([[UPDATE mail_asset_file SET due_at=$1 WHERE upload_id=$2 AND due_at IS NULL
            AND NOT EXISTS (SELECT 1 FROM mail_library_asset WHERE upload_id=$2)
            AND NOT EXISTS (SELECT 1 FROM mail_library_revision WHERE asset_upload_id=$2)
            AND NOT EXISTS (SELECT 1 FROM mail_message_asset WHERE upload_id=$2)]], {deadline, id})
        if err then return nil, err end
    end
    return true, nil
end

function M.link(tx: types.Transaction, id: string, refs: {types.AssetRef}?): (boolean?, error?)
    for _, version in ipairs(version_ids((refs or {}) :: {types.Record})) do
        local _, err = lock_active(tx, version)
        if err then return nil, err end
    end
    for _, ref in ipairs(refs or {}) do
        local _, err = tx:execute([[INSERT INTO mail_message_asset (message_id,name,content_id,original,upload_id)
            VALUES ($1,$2,$3,$4,$5)]], {id, ref.name, ref.content_id, ref.original or sql.NULL, ref.upload_id or sql.NULL})
        if err then return nil, err end
    end
    return true, nil
end

function M.refs(ex: types.Executor, id: string): ({types.AssetRef}?, error?)
    local rows, err = ex:query([[SELECT name,content_id,original,upload_id FROM mail_message_asset
        WHERE message_id=$1 ORDER BY name]], {id})
    return rows :: {types.AssetRef}?, err
end

function M.detach(tx: types.Transaction, id: string, now_ms: integer): (boolean?, error?)
    local removed, err = tx:query("DELETE FROM mail_message_asset WHERE message_id=$1 RETURNING upload_id", {id})
    if err then return nil, err end
    return M.release(tx, removed :: {types.Record}, now_ms)
end

function M.drop_expired_links(tx: types.Transaction, cutoff: integer, limit: integer, now_ms: integer): (boolean?, error?)
    local removed, err = tx:query([[DELETE FROM mail_message_asset WHERE message_id IN (
        SELECT id FROM mail_message WHERE finished_at <= $1 ORDER BY finished_at,id LIMIT $2
    ) RETURNING upload_id]], {cutoff, limit})
    if err then return nil, err end
    return M.release(tx, removed :: {types.Record}, now_ms)
end

function M.due_unreferenced(ex: types.Executor, now_ms: integer, limit: integer): ({string}?, error?)
    local rows, err = ex:query([[SELECT upload_id FROM mail_asset_file WHERE due_at<=$1
        ORDER BY due_at,upload_id LIMIT $2]], {now_ms, limit})
    if err then return nil, err end
    local ids: {string} = {}
    for _, row in ipairs(rows) do ids[#ids + 1] = row.upload_id :: string end
    return ids, nil
end

function M.forget(tx: types.Transaction, ids: {string}, cutoff: integer): (boolean?, error?)
    for _, id in ipairs(ids) do
        local _, err = tx:execute("DELETE FROM mail_asset_file WHERE upload_id=$1 AND due_at<=$2", {id, cutoff})
        if err then return nil, err end
    end
    return true, nil
end

function M.schedule(tx: types.Transaction, ids: {string}, due: integer, cutoff: integer): (boolean?, error?)
    for _, id in ipairs(ids) do
        local _, err = tx:execute("UPDATE mail_asset_file SET due_at=$1 WHERE upload_id=$2 AND due_at<=$3",
            {due, id, cutoff})
        if err then return nil, err end
    end
    return true, nil
end

return M
