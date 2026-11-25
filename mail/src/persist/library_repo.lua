-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local database = require("database")
local types = require("types")
local json = require("json")
local sql = require("sql")

local M = {}

function M.lock(tx: database.Transaction, dialect: string): (boolean?, error?)
    if dialect == "sqlite" then
        local _, err = tx:execute("UPDATE mail_library_asset SET revision=revision WHERE 1=0")
        if err then return nil, err end
        return true, nil
    end
    local _, err = tx:execute("LOCK TABLE mail_library_asset IN SHARE ROW EXCLUSIVE MODE")
    if err then return nil, err end
    return true, nil
end

function M.upsert(tx: database.Transaction, row: types.ProjectedResource): (boolean?, error?)
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

function M.archive(tx: database.Transaction, row: types.HistoryRow): (boolean?, error?)
    local _, err = tx:execute([[UPDATE mail_library SET archived=TRUE,revision=$1,last_seq=$2,author=$3,updated_at=$4
        WHERE kind=$5 AND name=$6 AND last_seq<$2]],
        {row.version, row.seq, row.author, row.at, row.kind, row.name})
    if err then return nil, err end
    return true, nil
end

function M.delete(tx: database.Transaction, key: types.ResourceKey, seq: integer): (boolean?, error?)
    local _, err = tx:execute("DELETE FROM mail_library WHERE kind=$1 AND name=$2 AND last_seq<$3",
        {key.kind, key.name, seq})
    if err then return nil, err end
    return true, nil
end

function M.upsert_asset(tx: database.Transaction, row: types.ProjectedAsset): (boolean?, error?)
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

function M.delete_asset(tx: database.Transaction, name: string, seq: integer): (boolean?, error?)
    local _, err = tx:execute("DELETE FROM mail_library_asset WHERE name=$1 AND last_seq<$2", {name, seq})
    if err then return nil, err end
    return true, nil
end

function M.delete_all(tx: database.Transaction): (integer?, error?)
    local resources, err = tx:execute("DELETE FROM mail_library")
    if err then return nil, err end
    local assets, asset_err = tx:execute("DELETE FROM mail_library_asset")
    if asset_err then return nil, asset_err end
    return resources.rows_affected + assets.rows_affected, nil
end

return M
