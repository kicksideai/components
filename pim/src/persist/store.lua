-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Row access over the fixed PIM tables, shared by the projection, writer and reader.
local json = require("json")
local registry = require("registry")
local sql = require("sql")
local consts = require("consts")
local schema = require("schema")
local narrow = require("narrow")
local types = require("types")
local bulk = require("bulk")

local persisted_json = require("persisted_json")
local error_envelope = require("error_envelope")

local failure = require("failure")
local M = {}

type Row = types.Row
type Term = { vocabulary: string, code: string, parent: string?, retired: integer, labels: { [string]: string } }

local function unconfigured(): error
    return errors.new({ details = { code = "database_unavailable" }, kind = errors.UNAVAILABLE, message = "PIM database is not configured" })
end

local function db_id(): (string?, error?)
    local entry, err = registry.get(consts.DB_CONFIG)
    if err then return nil, errors.wrap(err, "PIM database configuration lookup failed") end
    if not entry then return nil, unconfigured() end
    local db_id = (entry.meta or {}).db_id
    if type(db_id) ~= "string" or db_id == "" then return nil, unconfigured() end
    return db_id, nil
end

M.database_id=db_id

function M.open(): (sql.DB?, error?)
    local db_id, id_err = db_id()
    if not db_id then return nil, id_err end
    local db, err = sql.get(db_id)
    if err then return nil, err end
    if not db then return nil, errors.new({ details = { code = "database_unavailable" }, kind = errors.UNAVAILABLE, message = "PIM database unavailable" }) end
    return db, nil
end

-- need and need_int return corrupt-row errors through the caller's cleanup path.
local function need(row: Row, column: string): (string?, error?)
    local v = row[column]
    if type(v) ~= "string" then return nil, failure.corrupt("PIM row lacks " .. column, column) end
    return v, nil
end
local function need_int(row: Row, column: string): (integer?, error?)
    local v = narrow.int(row[column])
    if v == nil then return nil, failure.corrupt("PIM row lacks " .. column, column) end
    return v, nil
end
M.need = need
M.need_int = need_int

-- decode_row checks required columns and decodes JSON once before constructing a domain value.
function M.decode_row(row: Row, fields: { [string]: string }): (Row?, error?)
    local out: Row = {}
    for k, v in pairs(row) do out[k] = v end
    for name, kind in pairs(fields) do
        local value: unknown
        local err: error?
        if kind == "text" then value, err = need(row, name)
        elseif kind == "int" then value, err = need_int(row, name)
        else
            value, err = persisted_json.decode_table(row[name], name, kind == "json?")
            if err then err = error_envelope.wrap(err, "persisted row decode", { code = "row_corrupt" }) end
        end
        if err then return nil, err end
        out[name] = value
    end
    return out, nil
end

-- count decodes the one required aggregate row returned by a count query.
function M.count(db: types.Executor, statement: string, params: types.SqlParams, context: string): (integer?, error?)
    local rows, err = db:query(statement, params)
    if err then return nil, errors.wrap(err, context) end
    if not rows or not rows[1] then
        return nil, errors.new({ kind = errors.INTERNAL, message = "count returned no row", details = { code = "internal" } })
    end
    return need_int(rows[1], "n")
end

-- catalog(db, id, lock_dialect?) returns the catalog row with its compiled model, or
-- nil. With a dialect it locks the row (PostgreSQL FOR UPDATE; SQLite's writer lock).
function M.catalog(db: types.Executor, catalog_id: string, lock_dialect: string?): (types.Catalog?, error?)
    local suffix = ""
    if lock_dialect == sql.type.POSTGRES then suffix = " FOR UPDATE" end
    local rows, err = db:query("SELECT * FROM kickside_pim_catalog WHERE catalog_id = $1" .. suffix, { catalog_id })
    if err then return nil, errors.wrap(err, "catalog read failed") end
    local row: Row? = rows and rows[1]
    if not row then return nil, nil end
    local decoded, decode_err = M.decode_row(row, { catalog_id = "text", generation = "int", applied_seq = "int", item_table = "text", digest = "text", layout_digest = "text", product_count = "int", item_count = "int", trashed_count = "int", tombstone_floor_seq = "int", compiled = "json", plugin_state = "json", pending_columns = "json?", rebuild_storage = "json?" })
    if decode_err or not decoded then return nil, decode_err end
    row = decoded
    local compiled = row.compiled :: types.Compiled
    return {
        plugin_after = row.plugin_after :: string?, plugin_state = row.plugin_state :: { [string]: types.PluginIntent }, catalog_id = row.catalog_id :: string, generation = row.generation :: integer, applied_seq = row.applied_seq :: integer,
        compiled = schema.with_index(compiled), item_table = row.item_table :: string, digest = row.digest :: string,
        layout_digest = row.layout_digest :: string, rebuild_after = narrow.text(row.rebuild_after), rebuild_seq = narrow.int(row.rebuild_seq),
        rebuild_job = narrow.text(row.rebuild_job), rebuild_storage = row.rebuild_storage :: types.RebuildStorage?,
        pending_columns = (row.pending_columns or {}) :: {string},
            product_count = row.product_count :: integer, item_count = row.item_count :: integer,
        trashed_count = row.trashed_count :: integer,
        tombstone_floor_seq = row.tombstone_floor_seq :: integer,
    }, nil
end

local function product_row(row: Row): (types.Product?, error?)
    local decoded, decode_err = M.decode_row(row, { product_id = "text", sku = "text", family = "text", root_id = "text", level = "int", is_item = "int", version = "int", status = "text", state = "text", document = "json", source_seq = "json" })
    if decode_err or not decoded then return nil, decode_err end
    row = decoded
    local document = row.document :: types.Document
    local source_seq = row.source_seq :: { [string]: integer }
    return {
        product_id = row.product_id :: string, sku = row.sku :: string, family = row.family :: string, parent_id = narrow.text(row.parent_id),
        root_id = row.root_id :: string, level = row.level :: integer, is_item = row.is_item :: integer, axis_key = narrow.text(row.axis_key),
        version = row.version :: integer, status = row.status :: string, state = row.state :: string, state_at = narrow.text(row.state_at),
        document = document, source_seq = source_seq,
        created_seq = narrow.int(row.created_seq), updated_seq = narrow.int(row.updated_seq), release_id = narrow.text(row.release_id),
    }, nil
end

-- from_row parses a full kickside_pim_product row.
M.from_row = product_row

function M.product(db: types.Executor, catalog_id: string, product_id: string): (types.Product?, error?)
    local rows, err = db:query("SELECT * FROM kickside_pim_product WHERE catalog_id = $1 AND product_id = $2", { catalog_id, product_id })
    if err then return nil, errors.wrap(err, "product read failed") end
    local row = rows and rows[1]
    if not row then return nil, nil end
    return product_row(row)
end

function M.product_by_sku(db: types.Executor, catalog_id: string, sku: string): (types.Product?, error?)
    local rows, err = db:query("SELECT * FROM kickside_pim_product WHERE catalog_id = $1 AND sku = $2 AND state = 'live'", { catalog_id, sku })
    if err then return nil, errors.wrap(err, "product read failed") end
    local row = rows and rows[1]
    if not row then return nil, nil end
    return product_row(row)
end

-- select_in reads the products whose column is one of values, one statement
-- per chunk; extra narrows the rows further.
local function select_in(db: types.Executor, catalog_id: string, column: string, values: { string }, extra: string): ({ types.Product }?, error?)
    local out: { types.Product } = {}
    local per = 10000
    for first = 1, #values, per do
        local params: types.SqlParams = { catalog_id }
        local marks: { string } = {}
        for i = first, math.min(first + per - 1, #values) do
            params[#params + 1] = values[i]
            marks[#marks + 1] = "$" .. #params
        end
        local rows, err = db:query("SELECT * FROM kickside_pim_product WHERE catalog_id = $1 AND " .. column .. " IN ("
            .. table.concat(marks, ", ") .. ")" .. extra, params)
        if err then return nil, errors.wrap(err, "product read failed") end
        for _, row in ipairs(rows or {}) do
            local p, derr = product_row(row)
            if derr or not p then return nil, derr end
            out[#out + 1] = p
        end
    end
    return out, nil
end

-- products reads the given products by id.
function M.products(db: types.Executor, catalog_id: string, ids: { string }): ({ types.Product }?, error?)
    return select_in(db, catalog_id, "product_id", ids, "")
end

-- products_by_sku reads the live holders of the given skus.
function M.products_by_sku(db: types.Executor, catalog_id: string, skus: { string }): ({ types.Product }?, error?)
    return select_in(db, catalog_id, "sku", skus, " AND state = 'live'")
end

-- load returns a product through cache, reading and caching it on a miss.
function M.load(db: types.Executor, catalog_id: string, cache: { [string]: types.Product }, product_id: string): (types.Product?, error?)
    local cached = cache[product_id]
    if cached then return cached, nil end
    local p, err = M.product(db, catalog_id, product_id)
    if err or not p then return nil, err end
    cache[product_id] = p
    return p, nil
end

-- lineage maps each level on the product's path to its product, reading
-- through cache when one is given.
function M.lineage(db: types.Executor, catalog_id: string, product: types.Product, cache: { [string]: types.Product }?): (types.Lineage?, error?)
    local known: { [string]: types.Product } = cache or {}
    local out: types.Lineage = { [product.level] = product }
    local at = product
    while at.parent_id do
        local parent, err = M.load(db, catalog_id, known, at.parent_id :: string)
        if err then return nil, err end
        if not parent then return nil, failure.corrupt("product lineage is broken") end
        out[parent.level] = parent
        at = parent
    end
    return out, nil
end

local function product_fields(p: types.Product): types.SqlParams
    local document = next(p.document) == nil and "{}" or json.encode(p.document)
    local source_seq = next(p.source_seq) == nil and "{}" or json.encode(p.source_seq)
    return { p.sku, p.family, p.parent_id or sql.NULL, p.root_id, p.level, p.is_item, p.axis_key or sql.NULL,
        p.version, p.status, p.state, p.state_at or sql.NULL, document, source_seq, p.release_id or sql.NULL, p.created_seq, p.updated_seq }
end

local product_columns: { bulk.Column } = {
    { name = "catalog_id" }, { name = "product_id" }, { name = "sku" }, { name = "family" },
    { name = "parent_id" }, { name = "root_id" }, { name = "level" }, { name = "is_item" },
    { name = "axis_key" }, { name = "version" }, { name = "status" }, { name = "state" },
    { name = "state_at" }, { name = "document" }, { name = "source_seq" }, { name = "release_id" },
    { name = "created_seq" }, { name = "updated_seq" },
}

-- write_products persists independent creations or leaf edits in one batch.
-- Leaf edits preserve the product row's identity and hierarchy keys.
function M.write_products(db: types.Executor, catalog_id: string, products: { types.Product }, insert: boolean): error?
    local rows: { types.SqlParams } = {}
    for _, p in ipairs(products) do
        local params: types.SqlParams = { catalog_id, p.product_id }
        for _, value in ipairs(product_fields(p)) do params[#params + 1] = value end
        rows[#rows + 1] = params
    end
    local conflict = not insert and [[ ON CONFLICT (catalog_id, product_id) DO UPDATE SET
        version = excluded.version, status = excluded.status, document = excluded.document,
        source_seq = excluded.source_seq, updated_seq = excluded.updated_seq]] or nil
    return bulk.insert(db, "kickside_pim_product", product_columns, rows, conflict)
end

function M.save_product(db: types.Executor, catalog_id: string, p: types.Product): error?
    local params = product_fields(p)
    params[#params + 1] = catalog_id
    params[#params + 1] = p.product_id
    local statement = [[UPDATE kickside_pim_product SET sku = $1, family = $2, parent_id = $3, root_id = $4, level = $5,
            is_item = $6, axis_key = $7, version = $8, status = $9, state = $10, state_at = $11, document = $12, source_seq = $13,
            release_id = $14, created_seq = $15, updated_seq = $16 WHERE catalog_id = $17 AND product_id = $18]]
    local _, err = db:execute(statement, params)
    if err then return errors.wrap(err, "product write failed") end
    return nil
end

local function term_row(row: Row): (Term?, error?)
    local decoded, decode_err = M.decode_row(row, { vocabulary = "text", code = "text", retired = "int", labels = "json" })
    if decode_err or not decoded then return nil, decode_err end
    row = decoded
    return { vocabulary = row.vocabulary :: string, code = row.code :: string, parent = narrow.text(row.parent), retired = row.retired :: integer,
        labels = row.labels :: { [string]: string } }, nil
end

function M.term(db: types.Executor, catalog_id: string, vocabulary: string, code: string): (Term?, error?)
    local rows, err = M.read_terms(db, catalog_id, { { vocabulary = vocabulary, code = code } })
    if err then return nil, err end
    return rows and rows[1], nil
end

-- read_terms reads exact vocabulary/code pairs in bounded statements.
function M.read_terms(db: types.Executor, catalog_id: string, refs: { types.TermRef }): ({ Term }?, error?)
    local out: { Term } = {}
    for first = 1, #refs, 10000 do
        local params: types.SqlParams = { catalog_id }
        local pairs: { string } = {}
        for i = first, math.min(first + 9999, #refs) do
            params[#params + 1] = refs[i].vocabulary
            params[#params + 1] = refs[i].code
            pairs[#pairs + 1] = "($" .. (#params - 1) .. ", $" .. #params .. ")"
        end
        local rows, err = db:query("SELECT * FROM kickside_pim_term WHERE catalog_id = $1 AND (vocabulary, code) IN ("
            .. table.concat(pairs, ", ") .. ")", params)
        if err then return nil, errors.wrap(err, "term read failed") end
        for _, row in ipairs(rows or {}) do
            local term, derr = term_row(row)
            if derr or not term then return nil, derr end
            out[#out + 1] = term
        end
    end
    return out, nil
end

-- terms pages one vocabulary's terms by code after a cursor: live ones, or every
-- one when retired is set; parent narrows to the children of one term.
function M.terms(db: types.Executor, catalog_id: string, vocabulary: string, filter: { parent: string?, retired: boolean?, after: string? },
    limit: integer): ({ Term }?, error?)
    local params: types.SqlParams = { catalog_id, vocabulary }
    local statement = "SELECT * FROM kickside_pim_term WHERE catalog_id = $1 AND vocabulary = $2"
    if not filter.retired then statement = statement .. " AND retired = 0" end
    if filter.parent ~= nil then
        params[#params + 1] = filter.parent
        statement = statement .. " AND parent = $" .. #params
    end
    if filter.after ~= nil then
        params[#params + 1] = filter.after
        statement = statement .. " AND code > $" .. #params
    end
    params[#params + 1] = limit
    statement = statement .. " ORDER BY code LIMIT $" .. #params
    local rows, err = db:query(statement, params)
    if err then return nil, errors.wrap(err, "term list failed") end
    local out: { Term } = {}
    for _, row in ipairs(rows or {}) do
        local term, derr = term_row(row)
        if derr or not term then return nil, derr end
        out[#out + 1] = term
    end
    return out, nil
end

-- unique_owner returns the product holding a unique value, if any.
function M.unique_owner(db: types.Executor, catalog_id: string, attribute_id: integer, key: string): (string?, error?)
    local rows, err = db:query([[SELECT product_id FROM kickside_pim_unique_value
        WHERE catalog_id = $1 AND attribute_id = $2 AND value_key = $3]], { catalog_id, attribute_id, key })
    if err then return nil, errors.wrap(err, "unique value read failed") end
    local row: Row? = rows and rows[1]
    return row and narrow.text(row.product_id) or nil, nil
end

-- axis_slots maps each axis key under parent_id to the live child holding it.
function M.axis_slots(db: types.Executor, catalog_id: string, parent_id: string): ({ [string]: string }?, error?)
    local rows, err = db:query([[SELECT product_id, axis_key FROM kickside_pim_product
        WHERE catalog_id = $1 AND parent_id = $2 AND axis_key IS NOT NULL AND state = 'live']], { catalog_id, parent_id })
    if err then return nil, errors.wrap(err, "axis read failed") end
    local out: { [string]: string } = {}
    for _, row in ipairs(rows or {}) do
    local decoded, decode_err = M.decode_row(row, { axis_key = "text", product_id = "text" })
    if decode_err or not decoded then return nil, decode_err end
    row = decoded
        out[(row.axis_key :: string)] = row.product_id :: string
    end
    return out, nil
end

local function exclusions<T>(params: types.SqlParams, pending: { [string]: T }?, column: string?): string
    local marks: { string } = {}
    for id in pairs(pending or {}) do
        params[#params + 1] = id
        marks[#marks + 1] = "$" .. #params
    end
    if #marks == 0 then return "" end
    return " AND " .. (column or "product_id") .. " NOT IN (" .. table.concat(marks, ",") .. ")"
end
M.exclusions = exclusions

function M.has_children(db: types.Executor, catalog_id: string, product_id: string, pending: { [string]: types.Product }?): (boolean?, error?)
    local params: types.SqlParams = { catalog_id, product_id }
    local extra = exclusions(params, pending)
    local rows, err = db:query([[SELECT 1 AS present FROM kickside_pim_product
        WHERE catalog_id = $1 AND parent_id = $2 AND state = 'live']] .. extra .. " LIMIT 1", params)
    if err then return nil, errors.wrap(err, "children read failed") end
    return rows ~= nil and rows[1] ~= nil, nil
end

function M.count_descendants(db: types.Executor, catalog_id: string, root_id: string): (integer?, error?)
    return M.count(db, [[SELECT COUNT(*) AS n FROM kickside_pim_product
        WHERE catalog_id = $1 AND root_id = $2 AND product_id <> $3 AND state = 'live']], { catalog_id, root_id, root_id }, "descendant count failed")
end

function M.count_refs(db: types.Executor, catalog_id: string, kind: string, target: string,
    pending: { [string]: types.Product }?, excluded: string?): (integer?, error?)
    local params: types.SqlParams = { catalog_id, kind, target }
    local statement = "SELECT COUNT(*) AS n FROM kickside_pim_ref WHERE catalog_id = $1 AND kind = $2 AND target = $3"
    if excluded then
        params[#params + 1] = excluded
        statement = statement .. " AND product_id <> $" .. #params
    end
    local extra = exclusions(params, pending)
    return M.count(db, statement .. extra, params, "reference count failed")
end

function M.count_child_terms(db: types.Executor, catalog_id: string, vocabulary: string, code: string,
    pending: { [string]: boolean }?): (integer?, error?)
    local params: types.SqlParams = { catalog_id, vocabulary, code }
    local extra = exclusions(params, pending, "code")
    return M.count(db, [[SELECT COUNT(*) AS n FROM kickside_pim_term
        WHERE catalog_id = $1 AND vocabulary = $2 AND parent = $3 AND retired = 0]] .. extra, params, "child term count failed")
end

-- Generation is one applied schema: its effective declaration and compiled model.
type Generation = { declaration: types.Declaration, compiled: types.Compiled }

-- generation returns the declaration and compiled model of one generation.
function M.generation(db: types.Executor, catalog_id: string, generation: integer): (Generation?, error?)
    local rows, err = db:query("SELECT declaration, compiled FROM kickside_pim_generation WHERE catalog_id = $1 AND generation = $2",
        { catalog_id, generation })
    if err then return nil, errors.wrap(err, "generation read failed") end
    local row: Row? = rows and rows[1]
    if not row then return nil, nil end
    local decoded, decode_err = M.decode_row(row, { declaration = "json", compiled = "json" })
    if decode_err or not decoded then return nil, decode_err end
    row = decoded
    local declaration = row.declaration :: types.Declaration
    local compiled = row.compiled :: types.Compiled
    return { declaration = declaration, compiled = schema.with_index(compiled) }, nil
end

-- declaration returns the effective declaration of the catalog's active generation.
function M.declaration(db: types.Executor, catalog_id: string, generation: integer): (types.Declaration?, error?)
    local g, err = M.generation(db, catalog_id, generation)
    if err or not g then return nil, err end
    return g.declaration, nil
end

-- usage reads live product and index incompatibility counts per attribute.
function M.usage(db: types.Executor, catalog_id: string): ({ [integer]: types.AttributeUsage }?, error?)
    local rows, err = db:query([[SELECT attribute_id, products, key_violations, order_violations
        FROM kickside_pim_attribute_usage WHERE catalog_id = $1 AND products > 0]], { catalog_id })
    if err then return nil, errors.wrap(err, "attribute usage read failed") end
    local out: { [integer]: types.AttributeUsage } = {}
    for _, r in ipairs(rows or {}) do
        local row, decode_err = M.decode_row(r, { attribute_id = "int", products = "int",
            key_violations = "int", order_violations = "int" })
        if decode_err or not row then return nil, decode_err end
        out[row.attribute_id :: integer] = { products = row.products :: integer,
            key_violations = row.key_violations :: integer, order_violations = row.order_violations :: integer }
    end
    return out, nil
end

-- PostgreSQL can choose a sequential scan for a common family with equality
-- and LIMIT alone. The ordered lower bound seeks the partial index on both engines,
-- and the outer equality discards a different family.
function M.family_occupied(db: types.Executor, catalog_id: string, family: string): (boolean, error?)
    local rows, err = db:query([[SELECT 1 FROM (
        SELECT family FROM kickside_pim_product WHERE catalog_id = $1 AND family >= $2 AND state = 'live'
        ORDER BY family LIMIT 1
    ) candidate WHERE family = $2]], { catalog_id, family })
    if err then return false, errors.wrap(err, "family occupancy read failed") end
    return rows ~= nil and rows[1] ~= nil, nil
end

type Publication = { channel: string, release_id: string?, state: string, seq: integer }
M.Publication = Publication

-- publications lists a product's publication state per channel.
function M.publications(db: types.Executor, catalog_id: string, product_id: string): ({ Publication }?, error?)
    local rows, err = db:query("SELECT channel, release_id, state, seq FROM kickside_pim_publication WHERE catalog_id = $1 AND product_id = $2 ORDER BY channel",
        { catalog_id, product_id })
    if err then return nil, errors.wrap(err, "publication read failed") end
    local out: { Publication } = {}
    for _, r in ipairs(rows or {}) do
        local row: Row = r
    local decoded, decode_err = M.decode_row(row, { channel = "text", state = "text", seq = "int" })
    if decode_err or not decoded then return nil, decode_err end
    row = decoded
        out[#out + 1] = { channel = row.channel :: string, release_id = narrow.text(row.release_id), state = row.state :: string, seq = row.seq :: integer }
    end
    return out, nil
end

-- table_exists answers whether the database holds a table named name.
function M.table_exists(db: types.Executor, dialect: string, name: string): (boolean?, error?)
    local statement = dialect == sql.type.POSTGRES and "SELECT 1 AS present WHERE to_regclass($1) IS NOT NULL"
        or "SELECT 1 AS present FROM sqlite_master WHERE type = 'table' AND name = $1"
    local rows, err = db:query(statement, { name })
    if err then return nil, errors.wrap(err, "table lookup failed") end
    return rows ~= nil and #rows > 0, nil
end

function M.populated(db: types.Executor, catalog_id: string): (boolean?, error?)
    local rows, err = db:query("SELECT 1 AS present FROM kickside_pim_product WHERE catalog_id = $1 LIMIT 1", { catalog_id })
    if err then return nil, errors.wrap(err, "product presence read failed") end
    return rows ~= nil and rows[1] ~= nil, nil
end

function M.release(db: sql.DB, err: error?): error?
    return error_envelope.cleanup(function() return db:release() end, err, "database release failed")
end

-- with_db owns connection cleanup for command preparation and simple row work.
function M.with_db<T>(fn: (sql.DB) -> (T?,error?)): (T?,error?)
    local db,err=M.open()
    if err or not db then return nil,err end
    local out,ferr=fn(db)
    ferr=M.release(db,ferr)
    if ferr then return nil,ferr end
    return out,nil
end

-- transaction commits successful writes and retains failures from cleanup.
function M.transaction<T>(what: string, fn: (types.Executor, string) -> (T?, error?)): (T?, error?)
    local db, err = M.open()
    if not db then return nil, err end
    local tx, berr = db:begin()
    if berr then
        return nil, M.release(db, errors.wrap(berr, what .. " begin failed"))
    end
    local out, ferr = fn(tx, db:type())
    if ferr then
        ferr = error_envelope.cleanup(function() return tx:rollback() end, ferr, what .. " rollback failed")
    else
        local _, cerr = tx:commit()
        if cerr then ferr = errors.wrap(cerr, what .. " commit failed") end
    end
    ferr = M.release(db, ferr)
    if ferr then return nil, ferr end
    return out, nil
end

-- snapshot runs every callback query in one read-only repeatable snapshot.
function M.snapshot<T>(catalog_id: string, fn: (types.Executor, types.Catalog, string) -> (T?, error?)): (T?, types.Catalog?, error?)
    local db, err = M.open()
    if not db then return nil, nil, err end
    local options = db:type() == sql.type.POSTGRES and { isolation = sql.isolation.REPEATABLE_READ, read_only = true } or nil
    local tx, berr = db:begin(options)
    if berr then
        return nil, nil, M.release(db, errors.wrap(berr, "read transaction begin failed"))
    end
    local catalog, cerr = M.catalog(tx, catalog_id)
    local result: T?
    local ferr: error?
    if cerr then ferr = cerr
    elseif not catalog then ferr = failure.catalog_not_initialized()
    else
        local work, werr = tx:query("SELECT seq FROM kickside_pim_schema_work WHERE catalog_id = $1", { catalog_id })
        if werr then ferr = werr
        elseif work and work[1] then
            ferr = errors.new({ kind = errors.UNAVAILABLE, retryable = true, message = "catalog schema is being applied",
                details = { code = "schema_applying", seq = work[1].seq } })
        else result, ferr = fn(tx, catalog, db:type()) end
    end
    ferr = error_envelope.cleanup(function() return tx:rollback() end, ferr, "read transaction rollback failed")
    ferr = M.release(db, ferr)
    if ferr then return nil, nil, ferr end
    return result, catalog, nil
end


return M
