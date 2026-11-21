-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Read statements: the pages behind feeds, links, releases and export. Each takes
-- the executor of the caller's read snapshot and answers rows.
local json = require("json")
local store = require("store")
local select = require("select")
local sql = require("sql")
local types = require("types")

local M = {}


local function rows_of(rows: { types.Row }?, err: error?, what: string): ({ types.Row }?, error?)
    if err then return nil, errors.wrap(err, what .. " failed") end
    return rows or {}, nil
end

-- changed_products pages products changed after cursor up to ceiling.
function M.changed_products(db: types.Executor, dialect: string, catalog_id: string, ceiling: integer, cursor: types.ChangesCursor,
    families: { string }?, limit: integer): ({ types.Row }?, error?)
    local params: types.SqlParams = { catalog_id, ceiling, cursor.seq, cursor.product_id, limit }
    local seek = [[ FROM kickside_pim_product WHERE catalog_id = $1 AND updated_seq <= $2
        AND (updated_seq, product_id) > ($3, $4)]]
    local order = " ORDER BY updated_seq, product_id LIMIT $5"
    local statement = "SELECT *" .. seek .. order
    if families and #families > 0 then
        local wanted: { [string]: boolean } = {}
        for _, family in ipairs(families) do wanted[family] = true end
        local encoded, err = json.encode(wanted)
        if err then return nil, err end
        params[6] = encoded
        -- Seek each family's ordered keys and merge only the bounded prefixes.
        -- Read the documents by primary key after choosing the global page.
        local family_seek = [[ FROM kickside_pim_product WHERE catalog_id = $1
            AND (family, updated_seq, product_id) > (f.key, $3, $4)
            AND (family, updated_seq) <= (f.key, $2)
            ORDER BY family, updated_seq, product_id LIMIT $5]]
        local pages = "SELECT k.product_id, k.updated_seq FROM json_each($6) f CROSS JOIN "
        local products: string
        if dialect == sql.type.POSTGRES then
            pages = pages .. "LATERAL (SELECT product_id, updated_seq" .. family_seek .. ") k"
            products = [[LATERAL (SELECT * FROM kickside_pim_product
                WHERE catalog_id = $1 AND product_id = page.product_id OFFSET 0) p]]
        else
            pages = pages .. "kickside_pim_product k ON k.catalog_id = $1 AND k.product_id IN (SELECT product_id"
                .. family_seek .. ")"
            products = "kickside_pim_product p ON p.catalog_id = $1 AND p.product_id = page.product_id"
        end
        statement = "SELECT p.* FROM (" .. pages .. " ORDER BY k.updated_seq, k.product_id LIMIT $5) page"
            .. " CROSS JOIN " .. products .. " ORDER BY page.updated_seq, page.product_id"
        -- SQLite assigns named parameters by appearance. Use explicit slots.
        if dialect ~= sql.type.POSTGRES then statement = statement:gsub("%$(%d+)", "?%1") end
    end
    local rows, err = db:query(statement, params)
    return rows_of(rows, err, "changes read")
end

-- channel_seen reports whether a channel still has publication rows.
function M.channel_seen(db: types.Executor, catalog_id: string, channel: string): (boolean?, error?)
    local rows, err = db:query("SELECT 1 AS present FROM kickside_pim_publication WHERE catalog_id = $1 AND channel = $2 LIMIT 1", { catalog_id, channel })
    if err then return nil, errors.wrap(err, "channel lookup failed") end
    return #(rows or {}) > 0, nil
end

function M.publication_state(db: types.Executor, catalog_id: string, product_id: string, channel: string): (string?, error?)
    local rows, err = db:query("SELECT state FROM kickside_pim_publication WHERE catalog_id = $1 AND channel = $2 AND product_id = $3",
        { catalog_id, channel, product_id })
    if err then return nil, errors.wrap(err, "publication state read failed") end
    local row = rows and rows[1]
    if not row then return nil, nil end
    return store.need(row, "state")
end

function M.publication_floor(db: types.Executor, catalog_id: string, channel: string, after: types.PublicationCursor): (types.Row?, error?)
    local seen = after.expiry_floor or { seq = 0, product_id = "" }
    local rows, err = db:query([[WITH floor AS (
        SELECT seq, product_id FROM kickside_pim_publication_floor WHERE catalog_id = $1 AND channel = $2
    )
    SELECT seq, product_id,
        CASE WHEN (seq, product_id) > ($3, $4) AND (seq, product_id) > ($5, $6) THEN 1 ELSE 0 END AS expired
        FROM floor]],
        { catalog_id, channel, after.seq, after.product_id, seen.seq, seen.product_id })
    if err then return nil, errors.wrap(err, "publication floor read failed") end
    if not rows or not rows[1] then return nil, nil end
    return store.decode_row(rows[1], { seq = "int", product_id = "text", expired = "int" })
end

-- publications pages one channel in (seq, product_id) order with its releases.
function M.publications(db: types.Executor, catalog_id: string, channel: string, after: types.FeedPosition, limit: integer): ({ types.Row }?, error?)
    local rows, err = db:query([[SELECT p.product_id, p.release_id, p.state, p.seq, p.updated_at, r.snapshot, r.hash, r.version
        FROM kickside_pim_publication p LEFT JOIN kickside_pim_release r ON r.catalog_id = p.catalog_id AND r.release_id = p.release_id
        WHERE p.catalog_id = $1 AND p.channel = $2 AND (p.seq, p.product_id) > ($3, $4) ORDER BY p.seq, p.product_id LIMIT $5]],
        { catalog_id, channel, after.seq, after.product_id, limit })
    return rows_of(rows, err, "publications read")
end

-- ItemFilter narrows an item query by system columns and hierarchy.
type ItemFilter = { family: string?, status: string?, root_id: string?, parent_id: string? }
M.ItemFilter = ItemFilter

-- item_conditions are the query clauses of a filter.
function M.item_conditions(catalog_id: string, f: ItemFilter): { types.Condition }
    local out: { types.Condition } = {}
    if f.family then out[#out + 1] = { sql = "i.family = ?", args = { f.family } } end
    if f.status then out[#out + 1] = { sql = "i.status = ?", args = { f.status } } end
    if f.root_id then out[#out + 1] = { sql = "i.root_id = ?", args = { f.root_id } } end
    if f.parent_id then
        out[#out + 1] = { sql = "(SELECT parent_id FROM kickside_pim_product WHERE catalog_id = ? AND product_id = i.product_id) = ?",
            args = { catalog_id, f.parent_id } }
    end
    return out
end

-- ready_condition is the clause on a readiness flag column.
function M.ready_condition(column: string, ready: boolean): types.Condition
    return { sql = "i." .. column .. " = ?", args = { ready and 1 or 0 } }
end

-- items runs a compiled item query under its scan bound, and its count. A query reaching scope tables
-- depends on them, so their failure is an outage of the scope.
function M.items(tx: types.Executor, dialect: string, plan: select.Plan, limit: integer): ({ types.Row }?, integer?, boolean?, types.Cursor?, error?)
    for _, name in ipairs(plan.tables) do
        local present, terr = store.table_exists(tx, dialect, name)
        if terr then return nil, nil, nil, nil, terr end
        if not present then return nil, nil, nil, nil, errors.new({ kind = errors.INVALID,
            message = "scope table " .. name .. " does not exist", details = { code = "database_unavailable" } }) end
    end
    local function failed(what: string, err: error): ({ types.Row }?, integer?, boolean?, types.Cursor?, error?)
        if #plan.tables > 0 then return nil, nil, nil, nil, errors.wrap(err, "scoped " .. what .. " failed") end
        return nil, nil, nil, nil, errors.wrap(err, "item " .. what .. " failed")
    end
    local rows, stopped, err = select.rows(tx, plan, limit)
    if err or not rows then return failed("query", err or errors.new({ details = { code = "internal" }, kind = errors.INTERNAL, message = "item query returned no rows" })) end
    if not plan.count then return rows, nil, nil, stopped, nil end
    local total, estimated, cerr = select.total(tx, plan.count :: select.Count)
    if cerr then return failed("count", cerr) end
    return rows, total, estimated, stopped, nil
end

-- published_condition is the query clause for items published on a channel.
function M.published_condition(catalog_id: string, channel: string?): types.Condition
    local sql = "EXISTS (SELECT 1 FROM kickside_pim_publication pub WHERE pub.catalog_id = ?"
        .. " AND pub.product_id = i.product_id AND pub.state = 'published'"
    local args: { unknown } = { catalog_id }
    if channel then sql = sql .. " AND pub.channel = ?"; args[#args + 1] = channel end
    return { sql = sql .. ")", args = args }
end

-- links pages the references to a target after a cursor.
function M.links(db: types.Executor, dialect: string, catalog_id: string, kind: string, target: string, after: types.LinksCursor?, limit: integer): ({ types.Row }?, error?)
    local params: types.SqlParams = { catalog_id, kind, target }
    -- Keep the reference seek as the driver and resolve each SKU by primary key.
    local join = dialect == sql.type.POSTGRES
        and [[ JOIN LATERAL (SELECT sku FROM kickside_pim_product p
            WHERE p.catalog_id = r.catalog_id AND p.product_id = r.product_id OFFSET 0) p ON TRUE]]
        or [[ CROSS JOIN kickside_pim_product p ON p.catalog_id = r.catalog_id AND p.product_id = r.product_id]]
    local statement = [[SELECT r.product_id, p.sku, r.attribute_id, r.ctx, r.path FROM kickside_pim_ref r]]
        .. join .. " WHERE r.catalog_id = $1 AND r.kind = $2 AND r.target = $3"
    if after then
        params = { catalog_id, kind, target, after.product_id, after.attribute_id, after.ctx, after.path }
        statement = statement .. " AND (r.product_id, r.attribute_id, r.ctx, r.path) > ($4, $5, $6, $7)"
    end
    params[#params + 1] = limit
    statement = statement .. " ORDER BY r.product_id, r.attribute_id, r.ctx, r.path LIMIT $" .. #params
    local rows, err = db:query(statement, params)
    return rows_of(rows, err, "links read")
end

local RELEASE_COLUMNS = "release_id, product_id, version, generation, snapshot, hash, channels, seq, created_at"

-- release reads one release row.
function M.release(db: types.Executor, catalog_id: string, release_id: string): (types.Row?, error?)
    local rows, err = db:query("SELECT " .. RELEASE_COLUMNS .. " FROM kickside_pim_release WHERE catalog_id = $1 AND release_id = $2", { catalog_id, release_id })
    if err then return nil, errors.wrap(err, "release read failed") end
    return rows and rows[1] or nil, nil
end

-- releases pages a product's releases newest first, before a seq.
function M.releases(db: types.Executor, catalog_id: string, product_id: string, before: integer?, limit: integer): ({ types.Row }?, error?)
    local params: types.SqlParams = { catalog_id, product_id }
    local statement = "SELECT " .. RELEASE_COLUMNS .. " FROM kickside_pim_release WHERE catalog_id = $1 AND product_id = $2"
    if before then
        params[#params + 1] = before
        statement = statement .. " AND seq < $" .. #params
    end
    params[#params + 1] = limit
    statement = statement .. " ORDER BY seq DESC LIMIT $" .. #params
    local rows, err = db:query(statement, params)
    return rows_of(rows, err, "releases read")
end

-- One indexed sibling seek supports bounded depth-first term streaming.
function M.term_sibling(db:types.Executor,catalog_id:string,vocabulary:string,parent:string?,after:string): (types.Row?,error?)
    local statement="SELECT vocabulary,code,parent,labels,retired FROM kickside_pim_term WHERE catalog_id=$1 AND vocabulary=$2 AND code>$3 AND parent IS NULL ORDER BY code LIMIT 1"
    local params:types.SqlParams={catalog_id,vocabulary,after}
    if parent then
        statement="SELECT vocabulary,code,parent,labels,retired FROM kickside_pim_term WHERE catalog_id=$1 AND vocabulary=$2 AND code>$3 AND parent=$4 ORDER BY code LIMIT 1"
        params[4]=parent
    end
    local rows,err=db:query(statement,params)
    if err then return nil,err end
    return rows and rows[1] or nil,nil
end

-- export_page pages live products by level then id, with their parent's sku.
function M.export_page(db: types.Executor, catalog_id: string, after_level: integer, after_id: string, limit: integer): ({ types.Row }?, error?)
    local rows, err = db:query([[SELECT p.product_id, p.sku, p.family, p.level, p.status, p.document, parent.sku AS parent_sku
        FROM kickside_pim_product p LEFT JOIN kickside_pim_product parent
          ON parent.catalog_id = p.catalog_id AND parent.product_id = p.parent_id
        WHERE p.catalog_id = $1 AND p.state = 'live' AND (p.level, p.product_id) > ($2, $3)
        ORDER BY p.level, p.product_id LIMIT $4]], { catalog_id, after_level, after_id, limit })
    return rows_of(rows, err, "export read")
end

return M
