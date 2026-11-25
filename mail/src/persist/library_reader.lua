-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local types = require("types")
local json = require("json")
local sql = require("sql")
local canonical = require("canonical_json")

local M = {}

local function asset_resource(row: types.LibraryRow): types.Resource
    local asset: types.Asset = {source = "original"}
    if row.asset_upload_id then
        asset = {source = "upload", upload_id = row.asset_upload_id, filename = row.filename,
            content_type = row.content_type, size = row.size_bytes}
    end
    return {kind = "asset", name = row.name, title = row.title, description = row.description,
        html = "", text = "", schema = {type = "object", properties = {}}, samples = {}, asset = asset,
        state = row.state, origin = row.origin, origin_label = row.origin_label, revision = row.revision, author = row.author,
        created_at = row.created_at, updated_at = row.updated_at, seq = row.last_seq}
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
        samples = canonical.object(samples) :: types.JsonObject, state = row.state, origin = row.origin, origin_label = row.origin_label,
        revision = row.revision, author = row.author, created_at = row.created_at, updated_at = row.updated_at,
        archived = row.archived == true or row.archived == 1,
        seq = row.last_seq,
    }, nil
end

local ASSET_SELECT = [[SELECT name,title,description,origin,origin_label,revision,author,created_at,updated_at,last_seq,
    'asset' AS kind, upload_id AS asset_upload_id,
    CASE WHEN origin IS NULL THEN 'created' ELSE 'customized' END AS state, filename,content_type,size_bytes
    FROM mail_library_asset]]

function M.get(db: types.Executor, key: types.ResourceKey): (types.Resource?, error?)
    if key.kind == "asset" then
        local assets, err = db:query(ASSET_SELECT .. " WHERE name=$1", {key.name})
        if err then return nil, err end
        return assets[1] and asset_resource(assets[1] :: types.LibraryRow), nil
    end
    local rows, err = db:query("SELECT * FROM mail_library WHERE kind=$1 AND name=$2", {key.kind, key.name})
    if err then return nil, err end
    if not rows[1] then return nil, nil end
    return resource(rows[1] :: types.LibraryRow)
end

function M.projected_state(ex: types.Executor, key: types.ResourceKey): (types.ProjectedState?, error?)
    local rows, err
    if key.kind == "asset" then
        rows, err = ex:query("SELECT created_at,upload_id,last_seq FROM mail_library_asset WHERE name=$1", {key.name})
    else
        rows, err = ex:query("SELECT created_at,archived,last_seq FROM mail_library WHERE kind=$1 AND name=$2",
            {key.kind, key.name})
    end
    if err then return nil, err end
    return rows[1] :: types.ProjectedState?, nil
end

function M.subject_position(ex: types.Executor, key: types.ResourceKey): ({revision: integer, seq: integer?}?, error?)
    local rows, err = ex:query([[SELECT version AS revision,seq FROM mail_library_history
        WHERE kind=$1 AND name=$2 ORDER BY seq DESC LIMIT 1]], {key.kind, key.name})
    if err then return nil, err end
    return rows[1] :: {revision: integer, seq: integer?}? or {revision = 0}, nil
end

function M.rows(db: types.Executor, filter: types.ResourceFilter, include_archived: boolean?): ({types.Resource}?, error?)
    local result = sql.builder.select("*"):from("mail_library")
    if not include_archived then result = result:where(sql.builder.expr("archived=FALSE")) end
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
        if filter.state == "created" then condition = " WHERE origin IS NULL" end
        if filter.state == "customized" then condition = " WHERE origin IS NOT NULL" end
        local assets, asset_err = db:query(ASSET_SELECT .. condition .. " ORDER BY name")
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

function M.summary_page(db: types.Executor, dialect: string, declarations: {types.LibraryDeclaration}, filter: types.ResourceFilter, after: types.ResourceKey?,
    limit: integer): (types.LibraryPage?, error?)
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
            l.title,l.description,l.base,l.state,l.origin,l.revision,l.author,l.updated_at FROM mail_library l WHERE l.archived=FALSE]]
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
    local query = "WITH declared AS (" .. declared .. "), matched AS ("
        .. table.concat(sources, " UNION ALL ") .. "), summary AS (SELECT COUNT(*) AS total FROM matched)"
        .. ", page AS (SELECT * FROM (" .. table.concat(pages, " UNION ALL ")
        .. ") AS candidates ORDER BY kind,name LIMIT " .. page_limit .. ")"
        .. [[ SELECT page.*,summary.total,a.upload_id,a.filename,a.content_type,a.size_bytes,
        CASE WHEN page.state<>'original' THEN page.revision
            ELSE COALESCE((SELECT version FROM mail_library_history h
                WHERE h.kind=page.kind AND h.name=page.name ORDER BY seq DESC LIMIT 1),0)
        END AS effective_revision
        FROM summary LEFT JOIN page ON 1=1
        LEFT JOIN mail_library_asset a ON page.kind='asset' AND page.name=a.name AND page.state<>'original'
        ORDER BY page.kind,page.name]]
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
        local image: types.Asset?
        if row.upload_id then
            image = {source = "upload", upload_id = row.upload_id :: string, filename = row.filename :: string?,
                content_type = row.content_type :: string?, size = row.size_bytes :: integer?}
        end
        page.items[i] = {kind = row.kind :: string, name = row.name :: string, title = (row.title or "") :: string,
            description = (row.description or "") :: string, base = row.base :: string?, state = row.state :: string,
            origin = row.origin :: string?, revision = row.effective_revision :: integer, author = row.author :: string?,
            updated_at = row.updated_at :: integer?, asset = image}
    end
    return page, nil
end

function M.write_result(ex: types.Executor, key: types.ResourceKey, seq: integer): (types.Resource?, error?)
    local item, err = M.get(ex, key)
    if err then return nil, err end
    return item and item.seq == seq and item or nil, nil
end

function M.live_rows(db: types.Executor): ({types.Resource}?, error?)
    local rows, err = db:query("SELECT * FROM mail_library ORDER BY kind,name")
    if err then return nil, err end
    local items: {types.Resource} = {}
    for _, row in ipairs(rows) do
        local item, read_err = resource(row :: types.LibraryRow)
        if read_err then return nil, read_err end
        items[#items + 1] = item :: types.Resource
    end
    return items, nil
end

return M
