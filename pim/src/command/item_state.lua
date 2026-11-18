-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local failure=require("failure")
-- Command state: each item sees the catalog as the items before it left it. It
-- holds the products, keys, axis slots and terms the command has touched.
local store = require("store")
local consts = require("consts")
local values = require("values")
local types = require("types")
local derived = require("derived")
local merge_rows = require("merge_rows")

local M = {}

type PendingTerm = { merged_into: string?, labels: { [string]: string }, parent: string?, retired: boolean }
type State = {
    db: types.Executor, catalog: types.Catalog, compiled: types.Compiled, catalog_id: string, actor: string,
    source: types.Source?, products: { [string]: types.Product }, skus: { [string]: string },
    freed: { [string]: boolean }, gone: { [string]: boolean }, uniques: { [string]: string }, released: { [string]: boolean }, axes: { [string]: string },
    vacated: { [string]: boolean }, stored_skus: { [string]: boolean }, siblings: { [string]: { [string]: string } },
        terms: { [string]: PendingTerm }, counted: { [string]: integer }, added: { [string]: integer }, origin: types.Origin?, provenance: types.JsonObject?, approval_item_id: string?,
        import: boolean,
    audit: boolean, stored_terms: { [string]: PendingTerm | false },
    -- items are the command's items; links holds, per link kind the command
    -- names, the ids its owner resolved, filled on first use so each kind is
    -- asked once per command.
    items: { types.ApplyItem }, links: { [string]: { [string]: boolean } },
    -- refined holds, per attribute id and canonical requested value, what the
    -- attribute type's functions made of it, for every value the command sets.
    refined: { [integer]: { [string]: types.Refined } },
}
M.State = State
M.PendingTerm = PendingTerm

function M.fail(outcome: string, message: string, detail: types.FindingDetail?): types.Outcome
    local d: types.FindingDetail = detail or {}
    local finding: types.Finding = { message = message, attribute = d.attribute, holder = d.holder, version = d.version,
        product_id = d.product_id, code = d.code, set = d.set, check = d.check, context = d.context }
    return { outcome = outcome, findings = { finding } }
end

-- copy_document copies the coordinate maps a patch rewrites; cells and their
-- values stay shared and are replaced whole.
function M.copy_document(d: types.Document): types.Document
    local out: types.Document = {}
    for id, coords in pairs(d) do
        local c: types.Coordinates = {}
        for ctx, cell in pairs(coords) do c[ctx] = cell end
        out[id] = c
    end
    return out
end

-- State gives each item the catalog as left by the items before it.
function M.new_state(db: types.Executor, catalog: types.Catalog, actor: string, source: types.Source?): State
    return { db = db, catalog = catalog, compiled = catalog.compiled, catalog_id = catalog.catalog_id, actor = actor,
        source = source, products = {}, skus = {}, freed = {}, gone = {}, uniques = {}, released = {}, axes = {}, vacated = {},
            stored_skus = {}, siblings = {}, terms = {}, counted = {}, added = {},
        import = false,
        audit = false, stored_terms = {}, items = {}, links = {}, refined = {} }
end

function M.load(st: State, product_id: string): (types.Product?, error?)
    if st.products[product_id] then return st.products[product_id], nil end
    local p, err = store.product(st.db, st.catalog_id, product_id)
    if err or not p then return nil, err end
    st.products[product_id] = p
    return p, nil
end

-- lineage is the product with its ancestors by level, as the command sees them.
function M.lineage(st: State, p: types.Product): (types.Lineage?, error?)
    local out: types.Lineage = { [p.level] = p }
    local at = p
    while at.parent_id do
        local parent, err = M.load(st, at.parent_id :: string)
        if err then return nil, err end
        if not parent then return nil, failure.corrupt("product lineage is broken") end
        out[parent.level] = parent
        at = parent
    end
    return out, nil
end

-- read_skus loads the stored live holders of skus the command has yet to read.
function M.read_skus(st: State, skus: { string }): error?
    local wanted: { string } = {}
    for _, sku in ipairs(skus) do
        if not st.stored_skus[sku] then
            st.stored_skus[sku] = true
            wanted[#wanted + 1] = sku
        end
    end
    if #wanted == 0 then return nil end
    local found, err = store.products_by_sku(st.db, st.catalog_id, wanted)
    if err or not found then return err end
    for _, p in ipairs(found) do
        if not st.products[p.product_id] then st.products[p.product_id] = p end
        if st.skus[p.sku] == nil and not st.freed[p.sku] then st.skus[p.sku] = p.product_id end
    end
    return nil
end

-- by_sku answers the live holder of sku as the command's earlier items left it:
-- a sku claimed in this command, else free when an earlier item released it,
-- else the stored holder.
function M.by_sku(st: State, sku: string): (types.Product?, error?)
    local err = M.read_skus(st, { sku })
    if err then return nil, err end
    local id = st.skus[sku]
    if id then return M.load(st, id) end
    return nil, nil
end

function M.address(st: State, ref: types.ProductRef?): (types.Product?, error?)
    if type(ref) ~= "table" then return nil, nil end
    local p: types.Product?
    local err: error?
    if type(ref.id) == "string" then p, err = M.load(st, ref.id)
    elseif type(ref.sku) == "string" then p, err = M.by_sku(st, ref.sku) end
    if err then return nil, err end
    if p and p.state ~= "live" then return nil, nil end
    return p, nil
end

-- read_terms shares immutable head reads across item forks; accepted term edits
-- stay in terms and take precedence over these stored rows and absences.
function M.read_terms(st: State, refs: { types.TermRef }): error?
    local wanted: { types.TermRef } = {}
    local seen: { [string]: boolean } = {}
    for _, ref in ipairs(refs) do
        local key = ref.vocabulary .. ":" .. ref.code
        if st.stored_terms[key] == nil and not seen[key] then
            seen[key] = true
            wanted[#wanted + 1] = ref
        end
    end
    if #wanted == 0 then return nil end
    local found, err = store.read_terms(st.db, st.catalog_id, wanted)
    if err or not found then return err end
    for _, ref in ipairs(wanted) do st.stored_terms[ref.vocabulary .. ":" .. ref.code] = false end
    for _, term in ipairs(found) do
        st.stored_terms[term.vocabulary .. ":" .. term.code] = { labels = term.labels, parent = term.parent, retired = term.retired == 1 }
    end
    return nil
end

-- term returns the term as earlier accepted items leave it.
function M.term(st: State, vocabulary: string, code: string): (PendingTerm?, error?)
    local key = vocabulary .. ":" .. code
    local pending = st.terms[key]
    if pending ~= nil then return pending, nil end
    local err = M.read_terms(st, { { vocabulary = vocabulary, code = code } })
    if err then return nil, err end
    local stored = st.stored_terms[key]
    if stored == false then return nil, nil end
    return stored, nil
end

function M.term_state(st: State, vocabulary: string, code: string): (string?, error?)
    local term, err = M.term(st, vocabulary, code)
    if err or not term then return nil, err end
    return term.retired and "retired" or "live", nil
end

-- release frees unique keys an accepted item gave up, unless another item
-- already claimed them.
function M.release(st: State, p: types.Product, keys: { string })
    for _, k in ipairs(keys) do
        local holder = st.uniques[k]
        if holder == nil or holder == p.product_id then
            st.uniques[k] = nil
            st.released[k] = true
        end
    end
end

function M.claim_uniques(st: State, p: types.Product, unique: { [string]: types.Value })
    for code, value in pairs(unique) do
        local attr = st.compiled.attributes[code] :: types.Attribute
        st.uniques[attr.id .. "|" .. (values.key(attr.form, values.scalar(value), attr.config) or "")] = p.product_id
    end
end

-- check_axis answers whether the sibling slot parent_id|key is free for
-- product_id as the command's earlier accepted items left it.
function M.check_axis(st: State, parent_id: string, key: string, product_id: string): (types.Outcome?, error?)
    local slot = parent_id .. "|" .. key
    local held: string? = st.axes[slot]
    if held == nil and not st.vacated[slot] then
        local stored = st.siblings[parent_id]
        if stored == nil then
            local slots, err = store.axis_slots(st.db, st.catalog_id, parent_id)
            if err or not slots then return nil, err end
            stored = slots
            st.siblings[parent_id] = slots
        end
        held = stored[key]
    end
    if held and held ~= product_id and not st.gone[held] then return M.fail("conflict", "a sibling already has these axis values", { holder = held }), nil end
    return nil, nil
end

-- take_axis moves an accepted product's sibling slot: it vacates the slot the
-- product holds and claims parent_id|key.
function M.take_axis(st: State, p: types.Product, parent_id: string?, key: string?)
    if p.parent_id and p.axis_key then
        local old = (p.parent_id :: string) .. "|" .. (p.axis_key :: string)
        local holder = st.axes[old]
        if holder == nil or holder == p.product_id then
            st.axes[old] = nil
            st.vacated[old] = true
        end
    end
    if parent_id and key then st.axes[parent_id .. "|" .. key] = p.product_id end
end

-- has_room answers whether one more product fits under root, counting the
-- products the command's earlier accepted items add.
function M.has_room(st: State, root: string): (boolean, error?)
    local stored = st.counted[root]
    if stored == nil then
        local n, err = store.count_descendants(st.db, st.catalog_id, root)
        if err or n == nil then return false, err end
        stored = n
        st.counted[root] = n
    end
    return stored + (st.added[root] or 0) + 1 <= consts.LIMITS.descendants, nil
end

-- fork isolates a merge's provisional edits from the command's accepted state.
function M.fork(st: State): State
    local out: { [string]: unknown } = {}
    for k, v in pairs(st :: { [string]: unknown }) do out[k] = v end
    for _, name in ipairs({ "skus", "freed", "gone", "uniques", "released", "axes", "vacated", "stored_skus", "siblings", "terms", "counted", "added" }) do
        local copy: { [string]: unknown } = {}
        for k, v in pairs(out[name] :: { [string]: unknown }) do copy[k] = v end
        out[name] = copy
    end
    local products: { [string]: types.Product } = {}
    for id, p in pairs(st.products) do
        local copy: { [string]: unknown } = {}
        for k, v in pairs(p :: { [string]: unknown }) do copy[k] = v end
        local seqs: { [string]: integer } = {}
        for k, v in pairs(p.source_seq) do seqs[k] = v end
        copy.source_seq = seqs
        products[id] = copy :: types.Product
    end
    out.products = products
    return out :: State
end

function M.has_children(st: State, id: string): (boolean?, error?)
    for _, p in pairs(st.products) do
        if p.state == "live" and p.parent_id == id then return true, nil end
    end
    return store.has_children(st.db, st.catalog_id, id, st.products)
end

-- pending_references derives relationships from the command's current documents.
local function pending_references(st: State, kind: string, target: string, excluded: string?): ({ types.TermRefRow }?, error?)
    local out: { types.TermRefRow } = {}
    for _, p in pairs(st.products) do
        if p.state == "live" and p.product_id ~= excluded then
            local refs, _, rerr = derived.derived_rows(st.compiled, p)
            if rerr then return nil, rerr end
            for _, ref in ipairs(refs or {}) do
                if ref.kind == kind and ref.target == target then
                    out[#out + 1] = { product_id = p.product_id, attribute_id = ref.attribute_id, ctx = ref.ctx,
                        path = ref.path }
                end
            end
        end
    end
    return out, nil
end

function M.count_refs(st: State, kind: string, target: string, excluded: string?): (integer?, error?)
    local n, err = store.count_refs(st.db, st.catalog_id, kind, target, st.products, excluded)
    if err then return nil, err end
    local refs, rerr = pending_references(st, kind, target, excluded)
    if rerr or not refs then return nil, rerr end
    return (n :: integer) + #refs, nil
end

function M.count_child_terms(st: State, vocabulary: string, parent: string): (integer?, error?)
    local pending: { [string]: boolean } = {}
    local count = 0
    local prefix = vocabulary .. ":"
    for key, term in pairs(st.terms) do
        if key:sub(1, #prefix) == prefix then
            pending[key:sub(#prefix + 1)] = true
            if not term.retired and term.parent == parent then count = count + 1 end
        end
    end
    local stored, err = store.count_child_terms(st.db, st.catalog_id, vocabulary, parent, pending)
    if err or stored == nil then return nil, err end
    return stored + count, nil
end

-- merge_references overlays pending documents on persisted relationships before paging products.
function M.merge_references(st: State, target: string, retiring: boolean): ({ types.TermRefRow }?, integer?, error?)
    local cap = consts.LIMITS.merge_holders
    local total, err = merge_rows.count_products(st.db, st.catalog_id, "term", target, cap + 1, st.products)
    if err or total == nil then return nil, nil, err end
    if total > cap then return {}, total, nil end
    local pending, perr = pending_references(st, "term", target, nil)
    if perr or not pending then return nil, nil, perr end
    local holders: { [string]: boolean } = {}
    for _, r in ipairs(pending) do
        if not holders[r.product_id] then total = total + 1; holders[r.product_id] = true end
    end
    if total > cap then return {}, total, nil end
    local limit = retiring and total or consts.LIMITS.merge_inline
    local rows, rerr = merge_rows.references(st.db, st.catalog_id, "term", target, limit, st.products)
    if rerr or not rows then return nil, nil, rerr end
    for _, r in ipairs(pending) do rows[#rows + 1] = r end
    table.sort(rows, function(a: types.TermRefRow, b: types.TermRefRow): boolean
        if a.product_id ~= b.product_id then return a.product_id < b.product_id end
        if a.attribute_id ~= b.attribute_id then return a.attribute_id < b.attribute_id end
        if a.ctx ~= b.ctx then return a.ctx < b.ctx end
        return a.path < b.path
    end)
    local out: { types.TermRefRow } = {}
    local last: string? = nil
    local products = 0
    for _, r in ipairs(rows) do
        if r.product_id ~= last then products = products + 1; last = r.product_id end
        if products > limit then break end
        out[#out + 1] = r
    end
    local ids: { string } = {}
    local wanted: { [string]: boolean } = {}
    for _, r in ipairs(out) do
        if not st.products[r.product_id] and not wanted[r.product_id] then
            ids[#ids + 1] = r.product_id
            wanted[r.product_id] = true
        end
    end
    local loaded, lerr = store.products(st.db, st.catalog_id, ids)
    if lerr or not loaded then return nil, nil, lerr end
    for _, product in ipairs(loaded) do st.products[product.product_id] = product end
    return out, total, nil
end

return M
