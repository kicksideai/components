-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local database = require("database")
local types = require("types")
local sql = require("sql")

local M = {}

local function adopted(projected: string): string
    return "(state='held' AND hold_seq<=" .. projected .. [[
    AND EXISTS (SELECT 1 FROM mail_library_upload_ref r WHERE r.upload_id=mail_asset_file.upload_id))]]
end

local function eligible(projected: string): string
    return [[(state='reaping' OR (
    (hold_seq IS NULL OR hold_seq<=]] .. projected .. [[)
    AND NOT EXISTS (SELECT 1 FROM mail_library_upload_ref r WHERE r.upload_id=mail_asset_file.upload_id)
    AND NOT EXISTS (SELECT 1 FROM mail_message_asset m WHERE m.upload_id=mail_asset_file.upload_id)))]]
end

function M.next_due(ex: database.Executor, projected: integer): (integer?, error?)
    local rows, err = ex:query("SELECT due_at FROM mail_asset_file WHERE due_at IS NOT NULL AND ("
        .. eligible("$1") .. " OR " .. adopted("$1") .. ")"
        .. " ORDER BY due_at,upload_id LIMIT 1", {projected})
    if err then return nil, err end
    local first = rows[1]
    return first and first.due_at :: integer?, nil
end

function M.reserve(tx: database.Transaction, upload_id: string, now_ms: integer, deadline: integer): (boolean?, error?)
    local _, err = tx:execute([[INSERT INTO mail_asset_file
        (upload_id,reserved_at,due_at) VALUES ($1,$2,$3)]], {upload_id, now_ms, deadline})
    if err then return nil, err end
    return true, nil
end

local function unavailable(): error
    return errors.new({kind = errors.CONFLICT, message = "The mail asset version is unavailable",
        retryable = false, details = {code = "mail_asset_version_unavailable"}})
end

-- A hold protects the upload through projection of the guarded append.
function M.hold_adoption(tx: database.Transaction, id: string, deadline: integer, now_ms: integer,
    seq: integer, token: string): (boolean?, error?)
    local result, err = tx:execute([[UPDATE mail_asset_file SET hold_seq=$1,hold_id=$2
        WHERE upload_id=$3 AND state='held' AND due_at=$4 AND due_at>$5 AND hold_seq IS NULL]],
        {seq, token, id, deadline, now_ms})
    if err then return nil, err end
    if result.rows_affected ~= 1 then return nil, unavailable() end
    return true, nil
end

function M.hold_restore(tx: database.Transaction, id: string, projected: integer, token: string, author: string,
    command_id: string, reserved_at: integer, check_at: integer): (boolean?, error?)
    local result, err = tx:execute([[UPDATE mail_asset_file SET hold_seq=$1,hold_id=$2,
        restore_author=$3,restore_command_id=$4,restore_reserved_at=$5,restore_check_at=$6
        WHERE upload_id=$7 AND state='held' AND (hold_seq IS NULL OR hold_seq<=$8)]],
        {projected + 1, token, author, command_id, reserved_at, check_at, id, projected})
    if err then return nil, err end
    if result.rows_affected == 1 then return true, nil end
    local rows, read_err = tx:query("SELECT state FROM mail_asset_file WHERE upload_id=$1", {id})
    if read_err then return nil, read_err end
    if not rows[1] or rows[1].state == "reaping" then
        return nil, errors.new({kind = errors.NOT_FOUND, message = "The source image is no longer available",
            details = {code = "mail_asset_source_gone"}})
    end
    return nil, errors.new({kind = errors.CONFLICT, retryable = true, message = "The source image is reserved by another write",
        details = {code = "mail_library_changed"}})
end

function M.settle_adoptions(tx: database.Transaction, now: integer, projected: integer, limit: integer): (boolean?, error?)
    local condition = adopted("$2")
    local _, err = tx:execute([[UPDATE mail_asset_file SET due_at=NULL WHERE upload_id IN (
        SELECT upload_id FROM mail_asset_file WHERE due_at <= $1 AND ]] .. condition .. [[
        ORDER BY due_at,upload_id LIMIT $3) AND due_at <= $1 AND ]] .. condition, {now, projected, limit})
    if err then return nil, err end
    return true, nil
end

function M.release_hold(tx: database.Transaction, id: string, token: string): (boolean?, error?)
    local _, err = tx:execute([[UPDATE mail_asset_file SET hold_seq=NULL,hold_id=NULL,restore_author=NULL,
        restore_command_id=NULL,restore_reserved_at=NULL,restore_check_at=NULL WHERE upload_id=$1 AND hold_id=$2]],
        {id, token})
    if err then return nil, err end
    return true, nil
end

function M.due_restores(ex: database.Executor, now: integer, limit: integer): ({types.RestoreReservation}?, error?)
    local rows, err = ex:query([[SELECT upload_id,hold_id,restore_author,restore_command_id FROM mail_asset_file
        WHERE state='held' AND restore_check_at <= $1 ORDER BY restore_check_at,upload_id LIMIT $2]], {now, limit})
    return rows :: {types.RestoreReservation}?, err
end

function M.next_restore_check(ex: database.Executor): (integer?, error?)
    local rows, err = ex:query([[SELECT restore_check_at FROM mail_asset_file WHERE state='held' AND restore_check_at IS NOT NULL
        ORDER BY restore_check_at,upload_id LIMIT 1]])
    if err then return nil, err end
    return rows[1] and rows[1].restore_check_at :: integer?, nil
end

function M.confirm_restore(tx: database.Transaction, id: string, token: string): (boolean?, error?)
    local _, err = tx:execute([[UPDATE mail_asset_file SET restore_check_at=NULL
        WHERE upload_id=$1 AND hold_id=$2 AND state='held']], {id, token})
    if err then return nil, err end
    return true, nil
end

local function lock_active(tx: database.Transaction, id: string): (boolean?, error?)
    local result, err = tx:execute([[UPDATE mail_asset_file SET state='held' WHERE upload_id=$1 AND state='held'
        AND EXISTS (SELECT 1 FROM mail_library_upload_ref r WHERE r.upload_id=$1)
        ]], {id})
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

function M.link(tx: database.Transaction, id: string, refs: {types.AssetRef}?): (boolean?, error?)
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

function M.refs(ex: database.Executor, id: string): ({types.AssetRef}?, error?)
    local rows, err = ex:query([[SELECT name,content_id,original,upload_id FROM mail_message_asset
        WHERE message_id=$1 ORDER BY name]], {id})
    return rows :: {types.AssetRef}?, err
end

function M.detach(tx: database.Transaction, id: string): (boolean?, error?)
    local _, err = tx:execute("DELETE FROM mail_message_asset WHERE message_id=$1", {id})
    if err then return nil, err end
    return true, nil
end

function M.drop_expired_links(tx: database.Transaction, cutoff: integer, limit: integer): (boolean?, error?)
    local _, err = tx:execute([[DELETE FROM mail_message_asset WHERE message_id IN (
        SELECT id FROM mail_message WHERE finished_at <= $1 ORDER BY finished_at,id LIMIT $2
    )]], {cutoff, limit})
    if err then return nil, err end
    return true, nil
end

function M.claim_due(tx: database.Transaction, projected: integer, now_ms: integer, limit: integer,
    retry_at: integer): ({types.Record}?, error?)
    return tx:query([[UPDATE mail_asset_file SET state='reaping',due_at=$1 WHERE upload_id IN (
        SELECT upload_id FROM mail_asset_file WHERE due_at<=$2 AND ]] .. eligible("$3") .. [[
        ORDER BY due_at,upload_id LIMIT $4) AND due_at<=$2 AND ]] .. eligible("$3") ..
        " RETURNING upload_id", {retry_at, now_ms, projected, limit})
end

function M.claim_retired(tx: database.Transaction, projected: integer, boundary: integer, limit: integer,
    retry_at: integer): ({types.Record}?, error?)
    -- Lock each ledger row before checking delivery links again.
    local rows, err = tx:query([[UPDATE mail_asset_file SET state='held' WHERE upload_id IN (
        SELECT r.upload_id FROM mail_library_upload_ref r JOIN mail_asset_file f ON f.upload_id=r.upload_id
        WHERE r.live=FALSE AND r.last_seq<=$1 AND f.state='held' AND (f.hold_seq IS NULL OR f.hold_seq<=$2)
        AND NOT EXISTS (SELECT 1 FROM mail_message_asset m WHERE m.upload_id=r.upload_id)
        ORDER BY r.last_seq,r.upload_id LIMIT $3) RETURNING upload_id]], {boundary, projected, limit})
    if err then return nil, err end
    local claimed = {}
    for _, row in ipairs(rows) do
        local result, claim_err = tx:query([[UPDATE mail_asset_file SET state='reaping',due_at=$1 WHERE upload_id=$2
            AND NOT EXISTS (SELECT 1 FROM mail_message_asset m WHERE m.upload_id=$2) RETURNING upload_id]],
            {retry_at, row.upload_id})
        if claim_err then return nil, claim_err end
        if result[1] then claimed[#claimed + 1] = result[1] end
    end
    return claimed, nil
end

function M.forget(tx: database.Transaction, id: string): (boolean?, error?)
    local _, err = tx:execute("DELETE FROM mail_asset_file WHERE upload_id=$1 AND state='reaping'", {id})
    if err then return nil, err end
    return true, nil
end

function M.release_library(tx: database.Transaction, now: integer): (boolean?, error?)
    local _, err = tx:execute([[INSERT INTO mail_asset_file (upload_id,reserved_at,due_at)
        SELECT upload_id,$1,$1 FROM mail_library_upload_ref WHERE TRUE ON CONFLICT (upload_id) DO NOTHING]], {now})
    if err then return nil, err end
    local _, update_err = tx:execute([[UPDATE mail_asset_file SET
        due_at=CASE WHEN due_at IS NULL OR due_at>$1 THEN $1 ELSE due_at END,
        hold_seq=NULL,hold_id=NULL,restore_author=NULL,restore_command_id=NULL,
        restore_reserved_at=NULL,restore_check_at=NULL WHERE state='held']], {now})
    if update_err then return nil, update_err end
    return true, nil
end

return M
