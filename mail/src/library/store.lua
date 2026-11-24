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
    local rows, err = db:query("SELECT * FROM mail_library WHERE kind=$1 AND name=$2", {key.kind, key.name})
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

function M.write(tx: sql.Transaction, item: types.Resource): (types.Resource?, error?)
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
    return item, nil
end

function M.remove(tx: sql.Transaction, key: types.ResourceKey): error?
    local _, err = tx:execute("DELETE FROM mail_library WHERE kind=$1 AND name=$2", {key.kind, key.name})
    return err
end

return M
