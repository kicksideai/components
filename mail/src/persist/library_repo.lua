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

-- Keep revision-based History callers working until History reads the event log.
function M.snapshot_revision(tx: types.Transaction, event: types.PrefetchedLibraryEvent, row: types.HistoryRow): (boolean?, error?)
    local body = event.body
    local _, err
    if row.kind == "asset" then
        local asset = body.asset
        local content = body.content
        _, err = tx:execute([[INSERT INTO mail_library_revision
            (kind,name,revision,updated_at,author,note,action,restored_from,version,title,description,
                html,text,schema_json,samples_json,state,origin,created_at,asset_upload_id)
            VALUES ('asset',$1,$2,$3,$4,$5,$6,$7,$2,$8,$9,'','','{"type":"object","properties":{}}','{}',$10,$11,$3,$12)
            ON CONFLICT (kind,name,revision) DO NOTHING]],
            {row.name, row.version, row.at, row.author, row.note or sql.NULL, row.action, row.restored_from or sql.NULL,
                body.title or (content and content.title) or "", body.description or (content and content.description) or "",
                body.state or (body.origin and "customized" or "created"), body.origin or sql.NULL,
                asset and asset.upload_id or sql.NULL})
    elseif row.action == "archived" then
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
