-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local types = require("types")
local json = require("json")
local database = require("database")
local canonical = require("canonical_json")
local asset_store = require("asset_store")

local M = {}

function M.lock(tx: sql.Transaction, dialect: string): error?
    if dialect == "sqlite" then
        local _, err = tx:execute("UPDATE mail_library SET revision=revision WHERE 1=0")
        return err
    end
    local _, err = tx:execute("LOCK TABLE mail_library IN SHARE ROW EXCLUSIVE MODE")
    return err
end

local function asset_resource(row: types.LibraryRow): types.Resource
    local asset: types.Asset = {source = "original"}
    if row.asset_upload_id then
        asset = {source = "upload", upload_id = row.asset_upload_id, filename = row.filename,
            content_type = row.content_type, size = row.size_bytes, width = row.width, height = row.height}
    end
    return {kind = "asset", name = row.name, title = row.title, description = row.description,
        html = "", text = "", schema = {type = "object", properties = {}}, samples = {}, asset = asset,
        state = row.state, origin = row.origin, revision = row.revision, author = row.author,
        created_at = row.created_at, updated_at = row.updated_at}
end

local function resource(row: types.LibraryRow): (types.Resource?, error?)
    if row.kind == "asset" then return asset_resource(row), nil end
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

local ASSET_SELECT = [[SELECT a.*, 'asset' AS kind, a.upload_id AS asset_upload_id,
    CASE WHEN a.origin IS NULL THEN 'created' ELSE 'customized' END AS state,
    f.filename,f.content_type,f.size_bytes,f.width,f.height
    FROM mail_library_asset a JOIN mail_asset_file f ON f.upload_id=a.upload_id]]

function M.get(db: types.Executor, key: types.ResourceKey): (types.Resource?, error?)
    if key.kind == "asset" then
        local assets, err = db:query(ASSET_SELECT .. " WHERE a.name=$1", {key.name})
        if err then return nil, err end
        if assets[1] then return asset_resource(assets[1] :: types.LibraryRow), nil end
        local reset, reset_err = db:query([[SELECT * FROM mail_library_revision
            WHERE kind='asset' AND name=$1 AND state='original' ORDER BY revision DESC LIMIT 1]], {key.name})
        if reset_err then return nil, reset_err end
        if not reset[1] then return nil, nil end
        return asset_resource(reset[1] :: types.LibraryRow), nil
    end
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
    local resources: {types.Resource} = {}
    if not filter.base and (not filter.kind or filter.kind == "asset") then
        local condition = ""
        if filter.state == "created" then condition = " WHERE a.origin IS NULL" end
        if filter.state == "customized" then condition = " WHERE a.origin IS NOT NULL" end
        local assets, asset_err = db:query(ASSET_SELECT .. condition .. " ORDER BY a.name")
        if asset_err then return nil, asset_err end
        for _, row in ipairs(assets) do
            resources[#resources + 1] = asset_resource(row :: types.LibraryRow)
        end
    end
    for _, row in ipairs(rows) do
        local item, read_err = resource(row :: types.LibraryRow)
        if read_err then return nil, read_err end
        resources[#resources + 1] = item :: types.Resource
    end
    return resources, nil
end

function M.summary(db: sql.DB, declarations: {types.LibraryDeclaration}, filter: types.ResourceFilter, after: types.ResourceKey?,
    limit: integer): (types.LibraryPage?, error?)
    local dialect, dialect_err = db:type()
    if dialect_err then return nil, dialect_err end
    local postgres = dialect == "postgres"
    local declaration_json, encode_err = json.encode(declarations)
    if encode_err then return nil, encode_err end
    local args: {unknown} = {declaration_json}
    local function bind(value: unknown): string
        args[#args + 1] = value
        return "$" .. #args
    end
    local declared = postgres
        and [[SELECT * FROM jsonb_to_recordset($1::jsonb) AS d(kind text,name text,base text,selected integer)]]
        or [[SELECT json_extract(value,'$.kind') AS kind, json_extract(value,'$.name') AS name,
            json_extract(value,'$.base') AS base, json_extract(value,'$.selected') AS selected FROM json_each($1)]]
    local template_filters: {string} = {}
    local asset_filters: {string} = {}
    local function apply(filters: {string}, predicate: string)
        filters[#filters + 1] = predicate
    end
    local templates = filter.state ~= "original" and filter.kind ~= "asset"
    local assets = filter.state ~= "original" and not filter.base and (not filter.kind or filter.kind == "asset")
    if templates and filter.kind then apply(template_filters, "l.kind=" .. bind(filter.kind)) end
    if filter.state == "created" or filter.state == "customized" then
        if templates then apply(template_filters, "l.state=" .. bind(filter.state)) end
        if assets then apply(asset_filters, filter.state == "created" and "a.origin IS NULL" or "a.origin IS NOT NULL") end
    end
    if templates and filter.base then apply(template_filters, "l.kind='message' AND l.base=" .. bind(filter.base)) end
    if (templates or assets) and filter.q and filter.q ~= "" then
        local needle = bind(filter.q:lower())
        local function search(fields: {string}): string
            local predicates: {string} = {}
            for _, field in ipairs(fields) do
                predicates[#predicates + 1] = (postgres and "strpos" or "instr") .. "(lower(" .. field .. ")," .. needle .. ")>0"
            end
            return "(" .. table.concat(predicates, " OR ") .. ")"
        end
        apply(template_filters, search({"l.name","l.title","l.description","l.html","l.text","l.subject"}))
        apply(asset_filters, search({"a.name","a.title","a.description"}))
    end
    local function conditions(filters: {string}): string
        return #filters == 0 and "" or " AND " .. table.concat(filters, " AND ")
    end
    local sources: {string} = {}
    local collate = postgres and ' COLLATE "C"' or ""
    if templates then
        sources[#sources + 1] = [[SELECT l.kind]] .. collate .. [[ AS kind,l.name]] .. collate .. [[ AS name,
            l.title,l.description,l.base,l.state,l.origin,l.revision,l.author,l.updated_at FROM mail_library l WHERE 1=1]]
            .. conditions(template_filters)
    end
    if assets then
        sources[#sources + 1] = [[SELECT 'asset' AS kind,a.name]] .. collate .. [[ AS name,
            a.title,a.description,NULL AS base,CASE WHEN a.origin IS NULL THEN 'created' ELSE 'customized' END AS state,
            a.origin,a.revision,a.author,a.updated_at FROM mail_library_asset a WHERE a.upload_id IS NOT NULL]]
            .. conditions(asset_filters)
    end
    local available = [[NOT EXISTS (SELECT 1 FROM mail_library l WHERE l.kind=d.kind AND l.name=d.name)
        AND (d.kind<>'asset' OR NOT EXISTS
            (SELECT 1 FROM mail_library_asset a WHERE a.name=d.name AND a.upload_id IS NOT NULL))]]
    if not filter.state or filter.state == "original" then
        sources[#sources + 1] = [[SELECT d.kind]] .. collate .. [[ AS kind,d.name]] .. collate .. [[ AS name,
            NULL AS title,NULL AS description,d.base,'original' AS state,NULL AS origin,CAST(NULL AS BIGINT) AS revision,
            NULL AS author,CAST(NULL AS BIGINT) AS updated_at FROM declared d WHERE d.selected=1 AND ]] .. available
    end
    if #sources == 0 then return {items = {}, total = 0}, nil end
    local seek = ""
    if after then seek = " WHERE (kind,name)>(" .. bind(after.kind) .. "," .. bind(after.name) .. ")" end
    local page_limit = bind(limit + 1)
    local pages: {string} = {}
    for _, source in ipairs(sources) do
        pages[#pages + 1] = "SELECT * FROM (SELECT * FROM (" .. source .. ") AS candidate" .. seek
            .. " ORDER BY kind,name LIMIT " .. page_limit .. ") AS branch"
    end
    local array_size = postgres and "jsonb_array_length(a.used_by_json::jsonb)" or "json_array_length(a.used_by_json)"
    local query = "WITH declared AS (" .. declared .. "), matched AS ("
        .. table.concat(sources, " UNION ALL ") .. "), summary AS (SELECT COUNT(*) AS total FROM matched)"
        .. ", page AS (SELECT * FROM (" .. table.concat(pages, " UNION ALL ")
        .. ") AS candidates ORDER BY kind,name LIMIT " .. page_limit .. ")"
        .. [[ SELECT page.*,summary.total,
        CASE WHEN page.state='original' THEN COALESCE((SELECT MAX(r.revision) FROM mail_library_revision r
            WHERE r.kind=page.kind AND r.name=page.name AND r.state='original'),0) ELSE page.revision END AS effective_revision,
        CASE page.kind WHEN 'base' THEN
            (SELECT COUNT(*) FROM mail_library WHERE kind='message' AND base=page.name)
            + (SELECT COUNT(*) FROM declared d WHERE d.kind='message' AND d.base=page.name AND ]] .. available .. [[)
        WHEN 'asset' THEN COALESCE((SELECT ]] .. array_size .. [[ FROM mail_library_asset a WHERE a.name=page.name),0)
        END AS use_count
        FROM summary LEFT JOIN page ON 1=1 ORDER BY page.kind,page.name]]
    local found, read_err = db:query(query, args)
    if read_err then return nil, read_err end
    local page: types.LibraryPage = {items = {}, total = found[1].total :: integer}
    for i, row in ipairs(found) do
        if not row.kind then break end
        if i > limit then
            local last = page.items[limit]
            page.next_cursor = last.kind .. "/" .. last.name
            break
        end
        page.items[i] = {kind = row.kind :: string, name = row.name :: string, title = (row.title or "") :: string,
            description = (row.description or "") :: string, base = row.base :: string?, state = row.state :: string,
            origin = row.origin :: string?, revision = row.effective_revision :: integer, author = row.author :: string?,
            updated_at = row.updated_at :: integer?, used_by = row.use_count and {messages = row.use_count :: integer} or nil}
    end
    return page, nil
end

function M.read(key: types.ResourceKey): (types.Resource?, error?)
    return database.read(function(db: sql.DB): (types.Resource?, error?) return M.get(db, key) end)
end

function M.asset_usage(db: types.Executor, name: string?, affected: types.AssetUsageFilter?): (types.AssetUsage?, error?)
    local select_usage = "SELECT a.name,a.used_by_json FROM mail_library_asset a"
    local rows, err
    if name then
        rows, err = db:query(select_usage .. " WHERE a.name=$1", {name})
    elseif affected then
        local names, names_err = json.encode(affected.assets)
        if names_err then return nil, names_err end
        local messages, messages_err = json.encode(affected.messages)
        if messages_err then return nil, messages_err end
        local filter = affected.dialect == "postgres" and [[a.name IN (SELECT jsonb_array_elements_text($1::jsonb))
            OR EXISTS (SELECT 1 FROM jsonb_array_elements_text(a.used_by_json::jsonb) AS used(name)
                WHERE used.name IN (SELECT jsonb_array_elements_text($2::jsonb)))]]
            or [[a.name IN (SELECT value FROM json_each($1))
            OR EXISTS (SELECT 1 FROM json_each(a.used_by_json) AS used
                WHERE used.value IN (SELECT value FROM json_each($2)))]]
        rows, err = db:query(select_usage .. " WHERE " .. filter, {names, messages})
    else
        rows, err = db:query(select_usage)
    end
    if err then return nil, err end
    local usage: types.AssetUsage = {}
    for _, row in ipairs(rows) do
        local names, decode_err = json.decode(row.used_by_json :: string)
        if decode_err then return nil, decode_err end
        usage[row.name :: string] = names :: {string}
    end
    return usage, nil
end

function M.save_asset_usage(tx: sql.Transaction, dialect: string, assets: {types.Resource}, usage: types.AssetUsage,
    changed: {[string]: boolean}?): error?
    local affected: types.AssetUsageFilter?
    local affected_assets: {[string]: boolean} = {}
    if changed then
        affected = {dialect = dialect, assets = {}, messages = {}}
        for name in pairs(usage) do affected_assets[name] = true end
        for key in pairs(changed) do
            local message = key:match("^message/(.+)$")
            local asset = key:match("^asset/(.+)$")
            if message then affected.messages[#affected.messages + 1] = message end
            if asset then affected_assets[asset] = true end
        end
        for name in pairs(affected_assets) do affected.assets[#affected.assets + 1] = name end
    end
    local previous, read_err = M.asset_usage(tx, nil, affected)
    if read_err then return read_err end
    for _, asset in ipairs(assets) do
        local prior = previous[asset.name]
        if not changed or prior or affected_assets[asset.name] then
            local names = usage[asset.name] or {}
            if changed and prior then
                for _, name in ipairs(prior) do
                    if not changed["message/" .. name] then names[#names + 1] = name end
                end
            end
            table.sort(names)
            usage[asset.name] = names
            local encoded, encode_err = json.encode(names)
            if encode_err then return encode_err end
            local _, err
            if prior then
                _, err = tx:execute([[UPDATE mail_library_asset SET used_by_json=$1
                    WHERE name=$2 AND used_by_json IS DISTINCT FROM $1]], {encoded, asset.name})
            else
                -- Packaged assets have no upload, so usage does not shadow their declarations.
                _, err = tx:execute([[INSERT INTO mail_library_asset
                    (name,title,description,origin,author,created_at,updated_at,used_by_json)
                    VALUES ($1,$2,$3,$4,'system:kickside.mail.library',0,0,$5)]],
                    {asset.name, asset.title, asset.description, asset.origin or sql.NULL, encoded})
            end
            if err then return err end
        end
    end
    return nil
end

function M.prune_packaged_asset_usage(tx: sql.Transaction, usage: types.AssetUsage): error?
    local rows, err = tx:query("SELECT name FROM mail_library_asset WHERE upload_id IS NULL")
    if err then return err end
    for _, row in ipairs(rows) do
        if not usage[row.name :: string] then
            local _, remove_err = tx:execute("DELETE FROM mail_library_asset WHERE name=$1 AND upload_id IS NULL", {row.name})
            if remove_err then return remove_err end
        end
    end
    return nil
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
    local query = [[SELECT r.*,f.filename,f.content_type,f.size_bytes,f.width,f.height
        FROM mail_library_revision r LEFT JOIN mail_asset_file f ON f.upload_id=r.asset_upload_id
        WHERE r.kind=$1 AND r.name=$2]]
    local params: {string | integer} = {key.kind, key.name}
    if revision then
        query = query .. " AND r.revision=$3"
        params[3] = revision
    end
    local rows, err = db:query(query .. " ORDER BY r.revision DESC", params)
    if err then return nil, err end
    local history: {types.Revision} = {}
    for i, row in ipairs(rows) do
        local saved = row :: types.LibraryRow
        local item, read_err = resource(saved)
        if read_err then return nil, read_err end
        history[i] = {kind = saved.kind, name = saved.name, revision = saved.revision, version = saved.version,
            action = saved.action, state = saved.state, restored_from = saved.restored_from,
            content = {kind = item.kind, name = item.name, title = item.title, description = item.description,
                html = item.html, text = item.text, subject = item.subject, base = item.base,
                schema = item.schema, samples = item.samples, asset = item.asset},
            author = saved.author, note = saved.note, created_at = saved.updated_at}
    end
    return history, nil
end

local function trim(tx: sql.Transaction, key: types.ResourceKey): error?
    local removed, err = tx:query([[DELETE FROM mail_library_revision WHERE kind=$1 AND name=$2 AND revision <
        (SELECT revision FROM mail_library_revision WHERE kind=$1 AND name=$2 ORDER BY revision DESC LIMIT 1 OFFSET 24)
        RETURNING asset_upload_id AS upload_id]], {key.kind, key.name})
    if err then return err end
    return asset_store.release(tx, removed :: {types.Record})
end

local function write_asset(tx: sql.Transaction, item: types.Resource, change: types.RevisionChange,
    version: integer): (types.Resource?, error?)
    local upload = (item.asset :: types.Asset).upload_id
    local rows, err = tx:query([[INSERT INTO mail_library_asset
        (name,title,description,origin,author,created_at,updated_at,upload_id)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
        ON CONFLICT(name) DO UPDATE SET title=excluded.title, description=excluded.description,
            revision=excluded.revision, origin=excluded.origin, author=excluded.author, created_at=excluded.created_at,
            updated_at=excluded.updated_at, upload_id=excluded.upload_id
        RETURNING revision]],
        {item.name, item.title, item.description, item.origin or sql.NULL, item.author, item.created_at, item.updated_at, upload or sql.NULL})
    if err then return nil, err end
    local revision = rows[1].revision :: integer
    local _, record_err = tx:execute([[INSERT INTO mail_library_revision
        (kind,name,revision,title,description,html,text,schema_json,samples_json,state,origin,author,created_at,updated_at,note,asset_upload_id,version,action,restored_from)
        VALUES ('asset',$1,$2,$3,$4,'','','{"type":"object","properties":{}}','{}',$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)]],
        {item.name, revision, item.title, item.description, change.state,
            item.origin or sql.NULL, item.author, item.created_at, item.updated_at, change.note or sql.NULL,
            change.state ~= "original" and upload or sql.NULL, version, change.action, change.restored_from or sql.NULL})
    if record_err then return nil, record_err end
    local trim_err = trim(tx, item)
    if trim_err then return nil, trim_err end
    item.revision = revision
    return item, nil
end

function M.write(tx: sql.Transaction, item: types.Resource, change: types.RevisionChange): (types.Resource?, error?)
    local history, history_err = tx:query([[SELECT version FROM mail_library_revision
        WHERE kind=$1 AND name=$2 ORDER BY revision DESC LIMIT 1]], {item.kind, item.name})
    if history_err then return nil, history_err end
    local version = (history[1] and (history[1].version :: integer) or 0) + 1
    if item.kind == "asset" then return write_asset(tx, item, change, version) end
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
        (kind,name,revision,title,description,html,text,subject,base,schema_json,samples_json,state,origin,author,
            created_at,updated_at,note,version,action,restored_from)
        SELECT kind,name,revision,title,description,html,text,subject,base,schema_json,samples_json,$1,origin,author,
            created_at,updated_at,$2,$3,$4,$5 FROM mail_library WHERE revision=$6]],
        {change.state, change.note or sql.NULL, version, change.action, change.restored_from or sql.NULL, item.revision})
    if snapshot_err then return nil, snapshot_err end
    local trim_err = trim(tx, item)
    if trim_err then return nil, trim_err end
    return item, nil
end

function M.remove(tx: sql.Transaction, key: types.ResourceKey, deleting: boolean): error?
    if key.kind == "asset" then
        local live, err = tx:query("DELETE FROM mail_library_asset WHERE name=$1 RETURNING upload_id", {key.name})
        if err then return err end
        if deleting then
            local history, history_err = tx:query([[DELETE FROM mail_library_revision WHERE kind='asset' AND name=$1
                RETURNING asset_upload_id AS upload_id]], {key.name})
            if history_err then return history_err end
            for _, row in ipairs(history) do live[#live + 1] = row end
        end
        return asset_store.release(tx, live :: {types.Record})
    end
    if deleting then
        local _, err = tx:execute("DELETE FROM mail_library_revision WHERE kind=$1 AND name=$2", {key.kind, key.name})
        if err then return err end
    end
    local _, err = tx:execute("DELETE FROM mail_library WHERE kind=$1 AND name=$2", {key.kind, key.name})
    return err
end

return M
