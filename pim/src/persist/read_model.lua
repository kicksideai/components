-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Read statements: the pages behind feeds, links, releases and export. Each takes
-- the executor of the caller's read snapshot and answers rows.
local store = require("store")
local select = require("select")
local types = require("types")

local M = {}


local function rows_of(rows: { types.Row }?, err: error?, what: string): ({ types.Row }?, error?)
    if err then return nil, errors.wrap(err, what .. " failed") end
    return rows or {}, nil
end

-- changed_products pages products changed after cursor up to ceiling.
function M.changed_products(db: types.Executor, catalog_id: string, ceiling: integer, cursor: types.ChangesCursor,
    families: { string }?, limit: integer): ({ types.Row }?, error?)
    local params: types.SqlParams = { catalog_id, ceiling, cursor.seq, cursor.seq, cursor.product_id }
    local statement = [[SELECT * FROM kickside_pim_product WHERE catalog_id = $1 AND updated_seq <= $2
        AND (updated_seq > $3 OR (updated_seq = $4 AND product_id > $5))]]
    if families and #families > 0 then
        local marks: { string } = {}
        for _, f in ipairs(families) do
            params[#params + 1] = f
            marks[#marks + 1] = "$" .. #params
        end
        statement = statement .. " AND family IN (" .. table.concat(marks, ", ") .. ")"
    end
    params[#params + 1] = limit
    statement = statement .. " ORDER BY updated_seq, product_id LIMIT $" .. #params
    local rows, err = db:query(statement, params)
    return rows_of(rows, err, "changes read")
end

-- channel_seen reports whether a channel ever published in this catalog.
function M.channel_seen(db: types.Executor, catalog_id: string, channel: string): (boolean?, error?)
    local rows, err = db:query("SELECT 1 AS present FROM kickside_pim_publication WHERE catalog_id = $1 AND channel = $2 LIMIT 1", { catalog_id, channel })
    if err then return nil, errors.wrap(err, "channel lookup failed") end
    return #(rows or {}) > 0, nil
end

-- publications pages one channel in (seq, product_id) order with its releases.
function M.publications(db: types.Executor, catalog_id: string, channel: string, after: types.ChangesCursor, limit: integer): ({ types.Row }?, error?)
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
function M.item_conditions(f: ItemFilter): { types.Condition }
    local out: { types.Condition } = {}
    if f.family then out[#out + 1] = { sql = "i.family = ?", args = { f.family } } end
    if f.status then out[#out + 1] = { sql = "i.status = ?", args = { f.status } } end
    if f.root_id then out[#out + 1] = { sql = "i.root_id = ?", args = { f.root_id } } end
    if f.parent_id then out[#out + 1] = { sql = "r.parent_id = ?", args = { f.parent_id } } end
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
function M.links(db: types.Executor, catalog_id: string, kind: string, target: string, after: types.LinksCursor?, limit: integer): ({ types.Row }?, error?)
    local params: types.SqlParams = { catalog_id, kind, target }
    local statement = [[SELECT r.product_id, p.sku, r.attribute_id, r.ctx, r.path FROM kickside_pim_ref r
        JOIN kickside_pim_product p ON p.catalog_id = r.catalog_id AND p.product_id = r.product_id
        WHERE r.catalog_id = $1 AND r.kind = $2 AND r.target = $3]]
    if after then
        params[#params + 1] = after.product_id
        local a = #params
        params[#params + 1] = after.product_id
        params[#params + 1] = after.attribute_id
        params[#params + 1] = after.attribute_id
        params[#params + 1] = after.ctx
        params[#params + 1] = after.ctx
        params[#params + 1] = after.path
        statement = statement .. " AND (r.product_id > $" .. a .. " OR (r.product_id = $" .. (a + 1) .. " AND (r.attribute_id > $" .. (a + 2)
            .. " OR (r.attribute_id = $" .. (a + 3) .. " AND (r.ctx > $" .. (a + 4) .. " OR (r.ctx = $" .. (a + 5) .. " AND r.path > $" .. (a + 6) .. "))))))"
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
