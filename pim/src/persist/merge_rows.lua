-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local failure=require("failure")
-- Term merge persistence: the pending merge row a job finishes, and the term
-- references a merge rewrites, read from the projection's reference rows.
local sql = require("sql")
local narrow = require("narrow")
local values = require("values")
local store = require("store")
local types = require("types")
local references = require("references")

local M = {}

-- record keeps the merge for its job: one pending merge per retired term.
function M.record(db: types.Executor, m: types.Merge): error?
    local _, derr = db:execute("DELETE FROM kickside_pim_merge WHERE catalog_id = $1 AND vocabulary = $2 AND from_code = $3",
        { m.catalog_id, m.vocabulary, m.from })
    if derr then return errors.wrap(derr, "merge row replace failed") end
    local _, err = db:execute([[INSERT INTO kickside_pim_merge (catalog_id, vocabulary, from_code, into_code, identity, source, requested_by, created_at,trace_context)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8,$9)]],
        { m.catalog_id, m.vocabulary, m.from, m.into, values.canonical(m.identity), m.source or sql.NULL, m.requested_by, m.created_at, m.trace_context and values.canonical(m.trace_context) or sql.NULL })
    if err then return errors.wrap(err, "merge row write failed") end
    return nil
end

function M.get(db: types.Executor, catalog_id: string, vocabulary: string, from: string): (types.Merge?, error?)
    local rows, err = db:query("SELECT * FROM kickside_pim_merge WHERE catalog_id = $1 AND vocabulary = $2 AND from_code = $3",
        { catalog_id, vocabulary, from })
    if err then return nil, errors.wrap(err, "merge row read failed") end
    local row: types.Row? = rows and rows[1]
    if not row then return nil, nil end
    local decoded, derr = store.decode_row(row, { into_code = "text", identity = "json", requested_by = "text", created_at = "text",trace_context="json?" })
    if derr or not decoded then return nil, derr end
    row = decoded
    return { catalog_id = catalog_id, vocabulary = vocabulary, from = from, into = row.into_code :: string,
        identity = row.identity :: types.JsonObject, source = narrow.text(row.source), requested_by = row.requested_by :: string,
        created_at = row.created_at :: string, trace_context=row.trace_context :: types.TraceContext? }, nil
end

function M.delete(db: types.Executor, catalog_id: string, vocabulary: string, from: string): error?
    local _, err = db:execute("DELETE FROM kickside_pim_merge WHERE catalog_id = $1 AND vocabulary = $2 AND from_code = $3",
        { catalog_id, vocabulary, from })
    if err then return errors.wrap(err, "merge row delete failed") end
    return nil
end

-- count_products counts the live products holding a reference to target.
function M.count_products(db: types.Executor, catalog_id: string, kind: string, target: string, pending: { [string]: types.Product }?): (integer?, error?)
    local params: types.SqlParams = { catalog_id, kind, target }
    local extra = store.exclusions(params, pending, "r.product_id")
    return store.count(db, [[SELECT COUNT(DISTINCT r.product_id) AS n FROM kickside_pim_ref r
        JOIN kickside_pim_product p ON p.catalog_id = r.catalog_id AND p.product_id = r.product_id AND p.state = 'live'
        WHERE r.catalog_id = $1 AND r.kind = $2 AND r.target = $3]] .. extra, params, "reference count failed")
end

-- references lists where the first limit live products (by id) reference
-- target, every reference of each.
function M.references(db: types.Executor, catalog_id: string, kind: string, target: string, limit: integer,
    pending: { [string]: types.Product }?): ({ types.TermRefRow }?, error?)
    local params: types.SqlParams = { catalog_id, kind, target }
    local extra = store.exclusions(params, pending, "r2.product_id")
    params[#params + 1] = limit
    local rows, err = db:query([[WITH selected_products AS MATERIALIZED (
            SELECT DISTINCT r2.product_id FROM kickside_pim_ref r2
            JOIN kickside_pim_product p2 ON p2.catalog_id = r2.catalog_id AND p2.product_id = r2.product_id AND p2.state = 'live'
            WHERE r2.catalog_id = $1 AND r2.kind = $2 AND r2.target = $3]] .. extra .. " ORDER BY r2.product_id LIMIT $" .. #params .. [[)
        SELECT r.product_id, r.attribute_id, r.ctx, r.path FROM selected_products selected
        JOIN kickside_pim_ref r ON r.product_id = selected.product_id
        WHERE r.catalog_id = $1 AND r.kind = $2 AND r.target = $3
        ORDER BY r.product_id, r.attribute_id, r.ctx, r.path]], params)
    if err then return nil, errors.wrap(err, "reference read failed") end
    local out: { types.TermRefRow } = {}
    for _, r in ipairs(rows or {}) do
        local decoded, derr = store.decode_row(r, { product_id = "text", attribute_id = "int", ctx = "text", path = "text" })
        if derr or not decoded then return nil, derr end
        r = decoded
        if not references.valid_path(r.path :: string) then
            return nil, failure.corrupt("PIM reference path is malformed","path")
        end
        out[#out + 1] = { product_id = (r.product_id :: string), attribute_id = (r.attribute_id :: integer),
            ctx = (r.ctx :: string), path = r.path :: string }
    end
    return out, nil
end


return M
