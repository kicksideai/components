-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local types = require("types")
local json = require("json")
local database = require("database")
local canonical = require("canonical_json")

local M = {}

function M.lock(tx: sql.Transaction, dialect: string): error?
    if dialect == "sqlite" then
        local _, err = tx:execute("UPDATE mail_library SET revision=revision WHERE 1=0")
        return err
    end
    local _, err = tx:execute("LOCK TABLE mail_library IN SHARE ROW EXCLUSIVE MODE")
    return err
end

local function resource(row: types.LibraryRow): (types.Resource?, error?)
    local schema, schema_err = json.decode(row.schema_json)
    if schema_err then return nil, schema_err end
    local samples, sample_err = json.decode(row.samples_json)
    if sample_err then return nil, sample_err end
    return {
        kind = row.kind, name = row.name, title = row.title, description = row.description, html = row.html, text = row.text,
        subject = row.subject, base = row.base, schema = canonical.normalize_schema(schema) :: types.VariableSchema,
        samples = canonical.object(samples) :: types.JsonObject, state = row.state, origin = row.origin,
        revision = row.revision, author = row.author, created_at = row.created_at, updated_at = row.updated_at,
    }, nil
end

function M.get(db: types.Executor, key: types.ResourceKey): (types.Resource?, error?)
    local rows, err = db:query([[SELECT * FROM (
        SELECT *, NULL AS note FROM mail_library WHERE kind=$1 AND name=$2
        UNION ALL
        SELECT revision,kind,name,title,description,html,text,subject,base,schema_json,samples_json,state,origin,
            author,created_at,updated_at,note FROM mail_library_revision WHERE kind=$1 AND name=$2 AND state='original'
    ) AS effective ORDER BY revision DESC LIMIT 1]], {key.kind, key.name})
    if err then return nil, err end
    if not rows[1] then return nil, nil end
    return resource(rows[1] :: types.LibraryRow)
end

function M.find(db: types.Executor, filter: types.ResourceFilter): ({types.Resource}?, error?)
    local result = sql.builder.select("*"):from("mail_library")
    if filter.kind then result = result:where(sql.builder.eq({kind = filter.kind})) end
    if filter.base then
        result = result:where(sql.builder.expr("kind = 'message'")):where(sql.builder.eq({base = filter.base}))
    end
    if filter.state then result = result:where(sql.builder.eq({state = filter.state})) end
    local rows, err = result:order_by("kind, name"):run_with(db):query()
    if err then return nil, err end
    local resources = {}
    for i, row in ipairs(rows) do
        local item, read_err = resource(row :: types.LibraryRow)
        if read_err then return nil, read_err end
        resources[i] = item :: types.Resource
    end
    return resources, nil
end

function M.read(key: types.ResourceKey): (types.Resource?, error?)
    return database.read(function(db: sql.DB): (types.Resource?, error?) return M.get(db, key) end)
end

function M.original_revisions(db: types.Executor): (types.OriginalRevisions?, error?)
    local rows, err = db:query([[SELECT kind,name,MAX(revision) AS revision
        FROM mail_library_revision WHERE state='original' GROUP BY kind,name]])
    if err then return nil, err end
    local revisions: types.OriginalRevisions = {}
    for _, row in ipairs(rows) do
        local kind = row.kind :: string
        revisions[kind] = revisions[kind] or {}
        revisions[kind][row.name :: string] = row.revision :: integer
    end
    return revisions, nil
end

function M.history(db: types.Executor, key: types.ResourceKey, revision: integer?): ({types.Revision}?, error?)
    local query = "SELECT * FROM mail_library_revision WHERE kind=$1 AND name=$2"
    local params: {string | integer} = {key.kind, key.name}
    if revision then
        query = query .. " AND revision=$3"
        params[3] = revision
    end
    local rows, err = db:query(query .. " ORDER BY revision DESC", params)
    if err then return nil, err end
    local history: {types.Revision} = {}
    for i, row in ipairs(rows) do
        local saved = row :: types.LibraryRow
        local item, read_err = resource(saved)
        if read_err then return nil, read_err end
        history[i] = {kind = saved.kind, name = saved.name, revision = saved.revision,
            content = {kind = item.kind, name = item.name, title = item.title, description = item.description,
                html = item.html, text = item.text, subject = item.subject, base = item.base,
                schema = item.schema, samples = item.samples},
            author = saved.author, note = saved.note, created_at = saved.updated_at}
    end
    return history, nil
end

function M.write(tx: sql.Transaction, item: types.Resource, note: string?, reset: boolean): (types.Resource?, error?)
    local encoded_schema, schema_err = json.encode(item.schema)
    if schema_err then return nil, schema_err end
    local encoded_samples, sample_err = json.encode(item.samples)
    if sample_err then return nil, sample_err end
    local rows, err = tx:query([[INSERT INTO mail_library
        (kind,name,title,description,html,text,subject,base,schema_json,samples_json,state,origin,author,created_at,updated_at)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)
        ON CONFLICT(kind,name) DO UPDATE SET
            title=excluded.title, description=excluded.description, html=excluded.html, text=excluded.text,
            subject=excluded.subject, base=excluded.base, schema_json=excluded.schema_json, samples_json=excluded.samples_json,
            revision=excluded.revision, author=excluded.author, updated_at=excluded.updated_at
        RETURNING revision]],
        {item.kind, item.name, item.title, item.description, item.html, item.text, item.subject or sql.NULL,
        item.base or sql.NULL, encoded_schema, encoded_samples, item.state, item.origin or sql.NULL, item.author,
        item.created_at, item.updated_at})
    if err then return nil, err end
    item.revision = rows[1].revision :: integer
    local _, snapshot_err = tx:execute([[INSERT INTO mail_library_revision
        (kind,name,revision,title,description,html,text,subject,base,schema_json,samples_json,state,origin,author,created_at,updated_at,note)
        SELECT kind,name,revision,title,description,html,text,subject,base,schema_json,samples_json,$1,origin,author,created_at,updated_at,$2
        FROM mail_library WHERE revision=$3]], {reset and "original" or item.state, note or sql.NULL, item.revision})
    if snapshot_err then return nil, snapshot_err end
    local _, trim_err = tx:execute([[DELETE FROM mail_library_revision WHERE kind=$1 AND name=$2 AND revision <
        (SELECT revision FROM mail_library_revision WHERE kind=$1 AND name=$2 ORDER BY revision DESC LIMIT 1 OFFSET 24)]],
        {item.kind, item.name})
    if trim_err then return nil, trim_err end
    return item, nil
end

function M.remove(tx: sql.Transaction, key: types.ResourceKey, deleting: boolean): error?
    if deleting then
        local _, err = tx:execute("DELETE FROM mail_library_revision WHERE kind=$1 AND name=$2", {key.kind, key.name})
        if err then return err end
    end
    local _, err = tx:execute("DELETE FROM mail_library WHERE kind=$1 AND name=$2", {key.kind, key.name})
    return err
end

return M
