-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local types = require("types")
local json = require("json")
local sql = require("sql")

local M = {}

function M.lock(tx: types.Transaction, dialect: string): (boolean?, error?)
    if dialect == "sqlite" then
        local _, err = tx:execute("UPDATE mail_library_asset SET revision=revision WHERE 1=0")
        if err then return nil, err end
        return true, nil
    end
    local _, err = tx:execute("LOCK TABLE mail_library_asset IN SHARE ROW EXCLUSIVE MODE")
    if err then return nil, err end
    return true, nil
end

local function trim(tx: types.Transaction, key: types.ResourceKey): ({types.Record}?, error?)
    local removed, err = tx:query([[DELETE FROM mail_library_revision WHERE kind=$1 AND name=$2 AND revision <
        (SELECT revision FROM mail_library_revision WHERE kind=$1 AND name=$2 ORDER BY revision DESC LIMIT 1 OFFSET 24)
        RETURNING asset_upload_id AS upload_id]], {key.kind, key.name})
    return removed :: {types.Record}?, err
end

local function legacy_revision(tx: types.Transaction, table_name: string, row: types.Record): (integer?, error?)
    if row.revision ~= 0 then return row.revision :: integer, nil end
    local _, err = tx:execute("UPDATE " .. table_name .. " SET revision=$1 WHERE row_id=$1", {row.row_id})
    if err then return nil, err end
    return row.row_id :: integer, nil
end

local function write_asset(tx: types.Transaction, item: types.Resource, change: types.RevisionChange,
    version: integer): (types.LibraryWrite?, error?)
    local upload = (item.asset :: types.Asset).upload_id
    local rows, err = tx:query([[INSERT INTO mail_library_asset
        (name,title,description,origin,author,created_at,updated_at,upload_id)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
        ON CONFLICT(name) DO UPDATE SET title=excluded.title, description=excluded.description,
            revision=excluded.row_id, origin=excluded.origin, author=excluded.author, created_at=excluded.created_at,
            updated_at=excluded.updated_at, upload_id=excluded.upload_id
        RETURNING revision,row_id]],
        {item.name, item.title, item.description, item.origin or sql.NULL, item.author, item.created_at, item.updated_at, upload or sql.NULL})
    if err then return nil, err end
    local assigned, revision_err = legacy_revision(tx, "mail_library_asset", rows[1] :: types.Record)
    if revision_err then return nil, revision_err end
    local revision = assigned :: integer
    local _, record_err = tx:execute([[INSERT INTO mail_library_revision
        (kind,name,revision,title,description,html,text,schema_json,samples_json,state,origin,author,created_at,updated_at,note,asset_upload_id,version,action,restored_from)
        VALUES ('asset',$1,$2,$3,$4,'','','{"type":"object","properties":{}}','{}',$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)]],
        {item.name, revision, item.title, item.description, change.state,
            item.origin or sql.NULL, item.author, item.created_at, item.updated_at, change.note or sql.NULL,
            change.state ~= "original" and upload or sql.NULL, version, change.action, change.restored_from or sql.NULL})
    if record_err then return nil, record_err end
    local released, trim_err = trim(tx, item)
    if trim_err then return nil, trim_err end
    item.revision = revision
    return {item = item, released = released :: {types.Record}}, nil
end

function M.write(tx: types.Transaction, item: types.Resource, change: types.RevisionChange): (types.LibraryWrite?, error?)
    local history, history_err = tx:query([[SELECT version,action FROM mail_library_revision
        WHERE kind=$1 AND name=$2 ORDER BY revision DESC LIMIT 1]], {item.kind, item.name})
    if history_err then return nil, history_err end
    if history[1] and history[1].action == "deleted" then
        local _, err = tx:execute([[DELETE FROM mail_library_revision WHERE kind=$1 AND name=$2 AND action='deleted']],
            {item.kind, item.name})
        if err then return nil, err end
    end
    local version = (history[1] and (history[1].version :: integer) or 0) + 1
    return write_asset(tx, item, change, version)
end

function M.remove(tx: types.Transaction, key: types.ResourceKey, deleting: boolean): ({types.Record}?, error?)
    local live, err = tx:query("DELETE FROM mail_library_asset WHERE name=$1 RETURNING upload_id", {key.name})
    if err then return nil, err end
    if deleting then
        local history, history_err = tx:query([[DELETE FROM mail_library_revision WHERE kind='asset' AND name=$1
            RETURNING asset_upload_id AS upload_id]], {key.name})
        if history_err then return nil, history_err end
        for _, row in ipairs(history) do live[#live + 1] = row end
    end
    return live :: {types.Record}, nil
end

-- Keep revision-based History callers working until History reads the event log.
function M.snapshot_revision(tx: types.Transaction, event: types.PrefetchedLibraryEvent, row: types.HistoryRow): (boolean?, error?)
    local body = event.body
    local args = {row.kind, row.name, row.version, row.at, row.author, row.note or sql.NULL,
        row.action, row.restored_from or sql.NULL}
    local _, err
    if row.action == "archived" then
        _, err = tx:execute([[INSERT INTO mail_library_revision
            (kind,name,revision,updated_at,author,note,action,restored_from,version,title,description,
             html,text,subject,base,schema_json,samples_json,state,origin,created_at)
            SELECT $1,$2,$3,$4,$5,$6,$7,$8,$3,title,description,html,text,subject,base,schema_json,
                samples_json,state,origin,created_at FROM mail_library WHERE kind=$1 AND name=$2
            ON CONFLICT (kind,name,revision) DO NOTHING]], args)
    else
        local content = body.content
        local schema, schema_err = json.encode(content and content.schema or {})
        if schema_err then return nil, schema_err end
        local samples, samples_err = json.encode(content and content.samples or {})
        if samples_err then return nil, samples_err end
        _, err = tx:execute([[INSERT INTO mail_library_revision
            (kind,name,revision,updated_at,author,note,action,restored_from,version,title,description,
             html,text,subject,base,schema_json,samples_json,state,origin,created_at)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$3,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$4)
            ON CONFLICT (kind,name,revision) DO NOTHING]],
            {row.kind, row.name, row.version, row.at, row.author, row.note or sql.NULL, row.action, row.restored_from or sql.NULL,
                content and content.title or "", content and content.description or "", content and content.html or "",
                content and content.text or "", content and content.subject or sql.NULL, body.base or sql.NULL,
                schema, samples, body.state or "created", body.origin or sql.NULL})
    end
    if err then return nil, err end
    if row.action == "deleted" then
        local _, delete_err = tx:execute([[DELETE FROM mail_library_revision WHERE kind=$1 AND name=$2 AND revision<$3]],
            {row.kind, row.name, row.version})
        if delete_err then return nil, delete_err end
    end
    local _, trim_err = trim(tx, {kind = row.kind, name = row.name})
    if trim_err then return nil, trim_err end
    return true, nil
end

function M.upsert(tx: types.Transaction, row: types.ProjectedResource): (boolean?, error?)
    local schema, err = json.encode(row.schema)
    if err then return nil, err end
    local samples, sample_err = json.encode(row.samples)
    if sample_err then return nil, sample_err end
    local _, write_err = tx:execute([[INSERT INTO mail_library
        (kind,name,revision,last_seq,title,description,html,text,subject,base,schema_json,samples_json,
            state,origin,origin_label,author,created_at,updated_at,archived)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19)
        ON CONFLICT(kind,name) DO UPDATE SET
            revision=excluded.revision,last_seq=excluded.last_seq,title=excluded.title,description=excluded.description,
            html=excluded.html,text=excluded.text,subject=excluded.subject,base=excluded.base,
            schema_json=excluded.schema_json,samples_json=excluded.samples_json,state=excluded.state,
            origin=excluded.origin,origin_label=excluded.origin_label,author=excluded.author,
            updated_at=excluded.updated_at,archived=excluded.archived
        WHERE excluded.last_seq > mail_library.last_seq]],
        {row.kind, row.name, row.revision, row.last_seq, row.title, row.description, row.html, row.text,
            row.subject or sql.NULL, row.base or sql.NULL, schema, samples, row.state, row.origin or sql.NULL,
            row.origin_label or sql.NULL, row.author, row.created_at, row.updated_at, row.archived == true})
    if write_err then return nil, write_err end
    return true, nil
end

function M.archive(tx: types.Transaction, row: types.HistoryRow): (boolean?, error?)
    local _, err = tx:execute([[UPDATE mail_library SET archived=TRUE,revision=$1,last_seq=$2,author=$3,updated_at=$4
        WHERE kind=$5 AND name=$6 AND last_seq<$2]],
        {row.version, row.seq, row.author, row.at, row.kind, row.name})
    if err then return nil, err end
    return true, nil
end

function M.delete(tx: types.Transaction, key: types.ResourceKey, seq: integer): (boolean?, error?)
    local _, err = tx:execute("DELETE FROM mail_library WHERE kind=$1 AND name=$2 AND last_seq<$3",
        {key.kind, key.name, seq})
    if err then return nil, err end
    return true, nil
end

function M.upsert_asset(tx: types.Transaction, row: types.ProjectedAsset): (boolean?, error?)
    local _, err = tx:execute([[INSERT INTO mail_library_asset
        (name,revision,last_seq,title,description,origin,origin_label,author,created_at,updated_at,upload_id,filename,content_type,size_bytes)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
        ON CONFLICT(name) DO UPDATE SET
            revision=excluded.revision,last_seq=excluded.last_seq,title=excluded.title,description=excluded.description,
            origin=excluded.origin,origin_label=excluded.origin_label,author=excluded.author,updated_at=excluded.updated_at,
            upload_id=excluded.upload_id,filename=excluded.filename,content_type=excluded.content_type,size_bytes=excluded.size_bytes
        WHERE excluded.last_seq > mail_library_asset.last_seq]],
        {row.name, row.revision, row.last_seq, row.title, row.description, row.origin or sql.NULL,
            row.origin_label or sql.NULL, row.author, row.created_at, row.updated_at,
            row.upload_id, row.filename, row.content_type, row.size})
    if err then return nil, err end
    return true, nil
end

function M.delete_asset(tx: types.Transaction, name: string, seq: integer): (boolean?, error?)
    local _, err = tx:execute("DELETE FROM mail_library_asset WHERE name=$1 AND last_seq<$2", {name, seq})
    if err then return nil, err end
    return true, nil
end

return M
