-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Feeds (spec 12): cursor-resumable pages over durable state, so a consumer can
-- build its read model from cursor zero at any time and follow it.
local store = require("store")
local read_model = require("read_model")
local narrow = require("narrow")
local snapshot = require("snapshot")
local access = require("access")
local types = require("types")

local M = {}


local PAGE = 500

local function page_limit(limit: integer?): (integer?, error?)
    local n = limit or PAGE
    if n < 1 or n > PAGE then return nil, access.invalid("limit must be 1.." .. PAGE) end
    return n, nil
end

-- changes(catalog_id, { cursor?, limit?, families? }) pages products in
-- (updated_seq, product_id) order up to the projection position; while a
-- rebuild runs, up to the seq before the schema change it rewrites for, so every
-- stamped row is reported. Trashed and purged products are deletes. A cursor
-- below the tombstone floor gets a gap: the consumer resyncs from zero.
function M.changes(catalog_id: string, request: types.ChangesRequest): (types.ChangesResult?, error?)
    local caller, access_err = access.reader(catalog_id)
    if access_err or not caller then return nil, access_err end
    local limit, lerr = page_limit(request.limit)
    if lerr or not limit then return nil, lerr end
    return access.with_snapshot(caller, function(tx: types.Executor,catalog: types.Catalog,dialect: string): (types.ChangesResult?,error?)
        return M.changes_snapshot(tx,dialect,catalog,request,limit)
    end)
end

function M.changes_snapshot(tx: types.Executor,dialect: string,catalog: types.Catalog,request: types.ChangesRequest,limit: integer,observed_floor_seq: integer?): (types.ChangesResult?,error?)
    local catalog_id=catalog.catalog_id
    local cursor=request.cursor or {seq=0,product_id=""}
        local floor = catalog.tombstone_floor_seq
        -- A plugin token can page through older rows after observing this floor.
        if cursor.seq > 0 and cursor.seq < floor and floor > (observed_floor_seq or 0) then
            return { items = {}, next = cursor, has_more = false, gap = { floor = floor } }, nil
        end
        local ceiling = catalog.applied_seq
        if catalog.rebuild_after ~= nil and catalog.rebuild_seq then ceiling = (catalog.rebuild_seq :: integer) - 1 end
        local rows, err = read_model.changed_products(tx, dialect, catalog_id, ceiling, cursor, request.families, limit + 1)
        if err then return nil, err end
        local items: { types.ChangeItem } = {}
        local page: { types.Product } = {}
        local cache: { [string]: types.Product } = {}
        for i = 1, math.min(#(rows or {}), limit) do
            local p, perr = store.from_row(rows[i])
            if perr or not p then return nil, perr end
            page[i] = p
            cache[p.product_id] = p
        end
        for i, p in ipairs(page) do
            local item: types.ChangeItem = { product_id = p.product_id, op = p.state == "live" and "upsert" or "delete",
                updated_seq = p.updated_seq or 0, sku = p.sku, family = p.family, parent_id = p.parent_id, root_id = p.root_id,
                level = p.level, status = p.status, version = p.version }
            if p.state == "live" then
                local lineage, lerr2 = store.lineage(tx, catalog_id, p, cache)
                if lerr2 or not lineage then return nil, lerr2 end
                local snap, term_refs = snapshot.build(catalog.compiled, p, lineage)
                item.values = snap.values
                local refs: { types.TermRef } = {}
                for ref in pairs(term_refs) do
                    local vocabulary, code = ref:match("^([^:]+):(.+)$")
                    refs[#refs + 1] = { vocabulary = vocabulary :: string, code = code :: string }
                end
                local terms, terr = store.read_terms(tx, catalog_id, refs)
                if terr then return nil, terr end
                item.terms = {}
                for _, term in ipairs(terms or {}) do
                    item.terms[#item.terms + 1] = { vocabulary = term.vocabulary, code = term.code, labels = term.labels,
                        parent = term.parent, retired = term.retired == 1 }
                end
            end
            items[i] = item
        end
        local last = items[#items]
        local next_cursor: types.ChangesCursor = last and { seq = last.updated_seq, product_id = last.product_id } or cursor
        return { items = items, next = next_cursor, has_more = #(rows or {}) > limit }, nil
end

-- publications(catalog_id, { channel, after?, limit? }) pages one channel's
-- publication changes in (seq, product_id) order: published releases carry their snapshot,
-- withdrawals carry only their state.
function M.publications(catalog_id: string, request: types.PublicationsRequest): (types.PublicationsResult?, error?)
    local caller, access_err = access.reader(catalog_id)
    if access_err or not caller then return nil, access_err end
    local limit, lerr = page_limit(request.limit)
    if lerr or not limit then return nil, lerr end
    local after: types.PublicationCursor = request.after or { seq = 0, product_id = "" }
    return access.with_snapshot(caller, function(tx: types.Executor, catalog: types.Catalog, _dialect: string): (types.PublicationsResult?, error?)
        local floor, ferr = read_model.publication_floor(tx, catalog_id, request.channel, after)
        if ferr then return nil, ferr end
        local expiry_floor = floor and { seq = floor.seq :: integer, product_id = floor.product_id :: string } or nil
        if floor and after.seq > 0 and floor.expired == 1 then
            return nil, errors.new({ kind = errors.CONFLICT, retryable = false,
                message = "publication cursor precedes an expired withdrawal",
                details = { code = "cursor_expired", floor = expiry_floor } })
        end
        if not floor and not (catalog.compiled.channels or {})[request.channel] then
            local seen, kerr = read_model.channel_seen(tx, catalog_id, request.channel)
            if kerr then return nil, kerr end
            if not seen then return nil, access.invalid("unknown channel " .. request.channel) end
        end
        local rows, qerr = read_model.publications(tx, catalog_id, request.channel, after, limit + 1)
        if qerr then return nil, qerr end
        local items: { types.PublicationItem } = {}
        local last = after
        for i = 1, math.min(#(rows or {}), limit) do
            local r: types.Row = rows[i]
            local decoded, derr = store.decode_row(r, { seq = "int", state = "text", product_id = "text", updated_at = "text", snapshot = "json?" })
            if derr or not decoded then return nil, derr end
            r = decoded
            local seq = r.seq :: integer
            local state = r.state :: string
            local item: types.PublicationItem = { product_id = r.product_id :: string, state = state, seq = seq,
                updated_at = r.updated_at :: string }
            if state == "published" then
                item.release_id = narrow.text(r.release_id)
                item.hash = narrow.text(r.hash)
                item.version = narrow.int(r.version)
                item.snapshot = r.snapshot :: types.Snapshot?
            end
            items[i] = item
            last = { seq = seq, product_id = item.product_id }
        end
        local continuation = { seq = last.seq, product_id = last.product_id, expiry_floor = expiry_floor }
        return { items = items, next = continuation, has_more = #(rows or {}) > limit }, nil
    end)
end

return M
