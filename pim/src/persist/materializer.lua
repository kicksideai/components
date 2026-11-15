-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local failure=require("failure")
-- Folds catalog events into the PIM tables (spec 5.5). Runs inside the projection
-- transaction; events at or below catalog.applied_seq were already folded.
local json = require("json")
local sql = require("sql")
local consts = require("consts")
local clock = require("clock")
local values = require("values")
local layout = require("layout")
local history = require("history")
local driver = require("driver")
local store = require("store")
local narrow = require("narrow")
local types = require("types")
local jobs = require("jobs")
local merge_rows = require("merge_rows")

local document = require("document")
local derived = require("derived")
local item_index = require("item_index")
local schema_cleanup = require("schema_cleanup")
local release_jobs = require("release_jobs")
local attachments = require("attachments")

local M = {}

type IdSet = { [string]: boolean }
type FoldResult = { rebuild_job: string?, jobs: { string }, last_seq: integer }
-- Batch is what one fold accumulates and writes once at its end: the products
-- it loaded or saved, the items to recompute, products whose ref and unique rows
-- change, attribute usage deltas, history rows, and the counter changes it
-- commits with applied_seq.
type Batch = {
    cache: { [string]: types.Product }, ids: IdSet, rows: integer, derived: IdSet, usage: { [integer]: integer },
    history: { types.SqlParams }, products: integer, items: integer, trashed: integer,
}
M.FoldResult = FoldResult

local EV = consts.EVENTS
local PRODUCT_EVENTS: { [string]: boolean } = {
    [EV.PRODUCT_CREATED] = true, [EV.PRODUCT_CHANGED] = true, [EV.PRODUCT_MOVED] = true,
    [EV.PRODUCT_DELETED] = true, [EV.PRODUCT_RESTORED] = true, [EV.PRODUCT_PURGED] = true,
}

local function exec(tx: types.Executor, statement: string, params: types.SqlParams?): error?
    local _, err = tx:execute(statement, params or {})
    return err
end

local function mark(batch: Batch, product_id: string)
    if not batch.ids[product_id] then
        batch.ids[product_id] = true
        batch.rows = batch.rows + 1
    end
end

-- descendants_column names the product column that holds a model's descendants.
local function descendants_column(product: types.Product): string
    return product.level == 0 and "root_id" or "parent_id"
end

local function mark_affected(tx: types.Executor, catalog_id: string, product: types.Product, batch: Batch): error?
    if product.is_item == 1 then
        mark(batch, product.product_id)
        return nil
    end
    local rows, err = tx:query("SELECT product_id FROM kickside_pim_product WHERE catalog_id = $1 AND "
        .. descendants_column(product) .. " = $2 AND is_item = 1", { catalog_id, product.product_id })
    if err then return err end
    for _, r in ipairs(rows or {}) do
        local id, derr = store.need(r, "product_id")
        if derr or not id then return derr end
        mark(batch, id)
    end
    return nil
end

-- count moves the catalog counters for a product's state change.
local function count(batch: Batch, product: types.Product, from: string?, to: string)
    if from == to then return end
    local item = product.is_item == 1 and 1 or 0
    if from == "live" then batch.products = batch.products - 1; batch.items = batch.items - item end
    if from == "trashed" then batch.trashed = batch.trashed - 1 end
    if to == "live" then batch.products = batch.products + 1; batch.items = batch.items + item end
    if to == "trashed" then batch.trashed = batch.trashed + 1 end
end

local REBUILD = consts.REBUILD_OWNER
-- publish records a channel's publication state for a product when seq is newer
-- than the one it holds. Downstream modules read these rows as a feed.
local function publish(tx: types.Executor, catalog_id: string, channel: string, product_id: string, release_id: string?,
    state: string, seq: integer): error?
    return exec(tx, [[INSERT INTO kickside_pim_publication (catalog_id, channel, product_id, release_id, state, seq, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT (catalog_id, channel, product_id) DO UPDATE SET release_id = excluded.release_id, state = excluded.state,
        seq = excluded.seq, updated_at = excluded.updated_at WHERE kickside_pim_publication.seq < excluded.seq]],
        { catalog_id, channel, product_id, release_id or sql.NULL, state, seq, clock.now() })
end

-- unpublish_where withdraws the published rows matching column = value,
-- optionally only on the listed channels.
local function unpublish_where(tx: types.Executor, catalog_id: string, column: string, value: string,
    channels: { [string]: boolean }?, seq: integer): error?
    local rows, err = tx:query("SELECT channel, product_id, release_id FROM kickside_pim_publication WHERE catalog_id = $1 AND "
        .. column .. " = $2 AND state = 'published'", { catalog_id, value })
    if err then return err end
    for _, r in ipairs(rows or {}) do
        if not channels or channels[r.channel] then
            local decoded, derr = store.decode_row(r, { channel = "text", product_id = "text" })
            if derr or not decoded then return derr end
            local perr = publish(tx, catalog_id, decoded.channel :: string, decoded.product_id :: string, narrow.text(r.release_id), "withdrawn", seq)
            if perr then return perr end
        end
    end
    return nil
end

-- columns_of lists every generated column a layout holds, search sources included.
local function columns_of(l: types.Layout): { [string]: boolean }
    local out: { [string]: boolean } = {}
    for _, list in ipairs({ l.columns, l.sets, l.search, l.flags }) do
        for _, c in ipairs(list) do out[c.column] = true end
    end
    return out
end

-- pending_after lists the columns a rebuild must fill before reads may use
-- them: the columns the new layout adds, and the columns an unfinished rebuild
-- still owes, among those the new layout keeps.
local function pending_after(catalog: types.Catalog, before: types.Layout, after: types.Layout): { string }
    local old, new = columns_of(before), columns_of(after)
    local owed: { [string]: boolean } = {}
    for _, c in ipairs(catalog.pending_columns) do owed[c] = true end
    local out: { string } = {}
    for c in pairs(new) do
        if not old[c] or owed[c] then out[#out + 1] = c end
    end
    table.sort(out)
    return out
end

-- schedule_rebuild marks the catalog for rebuild from the schema event at seq and
-- demands the rebuild slot in the fold's transaction; the caller wakes the job
-- after commit.
local function schedule_rebuild(tx: sql.Transaction, dialect: string, catalog_id: string, seq: integer, pending: { string }): (string?, error?)
    local job, jerr = jobs.enqueue_tx(tx, dialect, { namespace = "pim", scope = "rebuild", key = catalog_id,
        owner_locator = { kind = "component", id = catalog_id }, slot = true, demand = true,
        job_type = REBUILD, immutable_payload = { catalog_id = catalog_id } })
    if jerr then return nil, jerr end
    local job_id = job and narrow.text(job.id)
    if not job_id then return nil, errors.new({ details = { code = "internal" }, kind = errors.INTERNAL, message = "rebuild enqueue returned no job id" }) end
    local err = exec(tx, "UPDATE kickside_pim_catalog SET rebuild_after = $1, rebuild_seq = $2, rebuild_job = $3, pending_columns = $4 WHERE catalog_id = $5",
        { "", seq, job_id, values.canonical(pending), catalog_id })
    if err then return nil, err end
    return job_id, nil
end

local function apply_schema(tx: sql.Transaction, dialect: string, catalog: types.Catalog?, catalog_id: string,
    event: types.SchemaEvent): (types.Catalog?, string?, error?)
    local body = event.body
    local compiled: types.Compiled = body.compiled
    local stamp = clock.now()
    local encoded = json.encode(compiled)
    local err: error?
    local job: string? = nil
    if not catalog then
        local names = layout.names(catalog_id)
        err = layout.create(tx, dialect, layout.of(names.base, compiled.layout))
        if err then return nil, nil, err end
        err = exec(tx, [[INSERT INTO kickside_pim_catalog (catalog_id, generation, compiled, digest, layout_digest, item_table,
            applied_seq, product_count, item_count, trashed_count, tombstone_floor_seq, created_at, updated_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)]],
            { catalog_id, body.generation, encoded, compiled.digest, compiled.layout_digest, names.base, event.seq, 0, 0, 0, 0, stamp, stamp })
    else
        local prev = catalog.compiled
        err = layout.alter(tx, dialect, layout.of(catalog.item_table, compiled.layout), prev.layout)
        if err then return nil, nil, err end
        err = exec(tx, [[UPDATE kickside_pim_catalog SET generation = $1, compiled = $2, digest = $3, layout_digest = $4,
            updated_at = $5 WHERE catalog_id = $6]], { body.generation, encoded, compiled.digest, compiled.layout_digest, stamp, catalog_id })
        if not err and prev.digest ~= compiled.digest then
            local populated, perr = store.populated(tx, catalog_id)
            if perr then return nil, nil, perr end
            if populated then job, err = schedule_rebuild(tx, dialect, catalog_id, event.seq, pending_after(catalog, prev.layout, compiled.layout)) end
        end
    end
    if err then return nil, nil, err end
    err = exec(tx, [[INSERT INTO kickside_pim_generation (catalog_id, generation, declaration, compiled, digest, class, actor, applied_seq,
        applied_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)]],
        { catalog_id, body.generation, json.encode(body.declaration), encoded, compiled.digest, body.class, tostring(body.actor or ""),
            event.seq, stamp })
    if err then return nil, nil, err end
    local completed = schema_cleanup.complete(tx, catalog_id)
    if completed then return nil, nil, completed end
    local desired: { [string]: types.PluginIntent } = catalog and catalog.plugin_state or {}
    for id, state in pairs(desired) do
        if not compiled.plugins[id] then state.active = false; state.seq = event.seq; state.lifecycle = { state = "pending" } end
    end
    for id in pairs(compiled.plugins) do
        local state = desired[id]
        if not state or not state.active then
            local aid, aerr = attachments.id(catalog_id, id, body.generation)
            if aerr then return nil, nil, aerr end
            local removing=state and state.removing or {}
            if state and state.attachment_id then removing[#removing+1]=state.attachment_id end
            desired[id] = { removing = removing, active = true, generation = body.generation, seq = event.seq, attachment_id = aid,
                config = (body.plugin_configs or {})[id] or {}, lifecycle = { state = "pending" } }
        end
    end
    local _, derr = tx:execute("UPDATE kickside_pim_catalog SET plugin_state = $1 WHERE catalog_id = $2", { values.canonical(desired), catalog_id })
    if derr then return nil, nil, derr end
    local refreshed, rerr = store.catalog(tx, catalog_id)
    return refreshed, job, rerr
end

local function apply_product(tx: sql.Transaction, catalog: types.Catalog, event: types.CreatedEvent | types.ProductEvent, batch: Batch): error?
    local body = event.body
    local catalog_id = catalog.catalog_id
    local compiled = catalog.compiled
    local seq = event.seq
    local product: types.Product?
    local err: error?
    if event.kind == "created" then
        local created = event.body
        local root_id = created.product_id
        if body.parent_id then
            local parent, perr = store.load(tx, catalog_id, batch.cache, body.parent_id :: string)
            if perr then return perr end
            if not parent then return failure.corrupt("created product names a missing parent") end
            root_id = parent.root_id
        end
        product = { product_id = created.product_id, sku = created.sku, family = created.family, parent_id = created.parent_id,
            root_id = root_id, level = created.level, is_item = created.is_item and 1 or 0, axis_key = created.axis_key,
            version = 0, status = created.status, state = "live", document = {}, source_seq = {}, created_seq = seq }
    else
        product, err = store.load(tx, catalog_id, batch.cache, body.product_id)
        if err then return err end
        if not product then return failure.corrupt("event names a missing product") end
    end
    local p: types.Product = product :: types.Product
    local state_before: string? = nil
    if event.kind ~= "created" then state_before = p.state end
    local before: { [integer]: boolean } = p.state == "live" and document.attribute_ids(compiled, p.document) or {}
    document.compact(compiled, p.document)
    document.apply_patch(p.document, body.patch or {}, body.source)
    if body.status then p.status = body.status end
    if body.axis_key then p.axis_key = body.axis_key end
    if body.source and body.source_seq then p.source_seq[body.source] = math.tointeger(body.source_seq) or 0 end
    if event.type == EV.PRODUCT_MOVED then
        p.parent_id = body.parent_id
    elseif event.type == EV.PRODUCT_DELETED then
        p.state = "trashed"
        p.state_at = body.at
    elseif event.type == EV.PRODUCT_RESTORED then
        p.axis_key=body.axis_key
        p.state = "live"
        p.state_at = body.at
    elseif event.type == EV.PRODUCT_PURGED then
        p.state = "purged"
        p.state_at = body.at
        p.document = {}
    end
    p.version = p.version + 1
    p.updated_seq = seq
    err = store.save_product(tx, catalog_id, p, event.type == EV.PRODUCT_CREATED)
    if err then return err end
    batch.cache[p.product_id] = p
    batch.derived[p.product_id] = true
    local after: { [integer]: boolean } = p.state == "live" and document.attribute_ids(compiled, p.document) or {}
    derived.usage_delta(batch.usage, before, after)
    if event.type == EV.PRODUCT_DELETED then
        err = unpublish_where(tx, catalog_id, "product_id", p.product_id, nil, seq)
        if err then return err end
    end
    count(batch, p, state_before, p.state)
    if p.is_item == 0 and #(body.patch or {}) > 0 then
        -- A model's values resolve into every descendant, so their views change too.
        err = exec(tx, "UPDATE kickside_pim_product SET updated_seq = $1 WHERE catalog_id = $2 AND "
            .. descendants_column(p) .. " = $3 AND product_id <> $4 AND state <> 'purged'", { seq, catalog_id, p.product_id, p.product_id })
        if err then return err end
    end
    return mark_affected(tx, catalog_id, p, batch)
end

local function apply_release(tx: sql.Transaction, catalog: types.Catalog, event: types.ReleaseEvent): error?
    local b = event.body
    local catalog_id = catalog.catalog_id
    local err = exec(tx, [[INSERT INTO kickside_pim_release (catalog_id, release_id, product_id, version, generation, snapshot,
        hash, channels, seq, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) ON CONFLICT (catalog_id, release_id) DO NOTHING]],
        { catalog_id, b.release_id, b.product_id, b.version, b.generation, values.canonical(b.snapshot), b.hash,
            values.canonical(b.channels), event.seq, clock.now() })
    if err then return err end
    err = exec(tx, "UPDATE kickside_pim_product SET release_id = $1 WHERE catalog_id = $2 AND product_id = $3",
        { b.release_id, catalog_id, b.product_id })
    if err then return err end
    for _, id in ipairs(b.channels or {}) do
        err = publish(tx, catalog_id, id, b.product_id, b.release_id, "published", event.seq)
        if err then return err end
    end
    return nil
end

-- apply_term stores the term, merge intent and job together in the fold transaction.
local function apply_term(tx: sql.Transaction, dialect: string, catalog_id: string, event: types.TermEvent,trace: types.TraceContext?): (string?, error?)
    local b = event.body
    local err = exec(tx, "DELETE FROM kickside_pim_term WHERE catalog_id = $1 AND vocabulary = $2 AND code = $3",
        { catalog_id, b.vocabulary, b.code })
    if err then return nil, err end
    err = exec(tx, [[INSERT INTO kickside_pim_term (catalog_id, vocabulary, code, parent, labels, retired, updated_seq,retired_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7,$8)]], { catalog_id, b.vocabulary, b.code, b.parent or sql.NULL,
        json.encode(b.labels or {}), b.retired and 1 or 0, event.seq,b.retired and b.at or sql.NULL })
    if err then return nil, err end
    local pending = b.merge
    if not pending then return nil, nil end
    pending.trace_context=trace
    local perr = merge_rows.record(tx, pending)
    if perr then return nil, perr end
    local job, jerr = jobs.enqueue_tx(tx, dialect, { namespace = "pim", scope = "merge", key = catalog_id .. ":" .. b.vocabulary .. ":" .. b.code,
        owner_locator = { kind = "component", id = catalog_id }, job_type = consts.MERGE_OWNER, max_attempts = 5, trace_context=trace,
        immutable_payload = { catalog_id = catalog_id, vocabulary = b.vocabulary, from = b.code, into = pending.into } })
    if jerr then return nil, jerr end
    local job_id = job and narrow.text(job.id)
    if not job_id then return nil, errors.new({ details = { code = "internal" }, kind = errors.INTERNAL, message = "merge enqueue returned no job id" }) end
    return job_id, nil
end

-- history_rows lists the change rows an event contributes (spec 5.6): lifecycle,
-- schema and release rows always, value steps only when the event carries audit.
local function history_rows(event: types.FoldEvent): (string, { history.Change })
    local rows: { history.Change } = {}
    if event.kind == "schema" then
        rows[1] = { kind = "schema", after = { generation = event.body.generation, class = event.body.class } }
        return "schema", rows
    elseif event.kind == "term" then
        local b = event.body
        rows[1] = { kind = "term", after = { labels = b.labels or {}, parent = b.parent, retired = b.retired == true } }
        return "t:" .. b.vocabulary .. ":" .. b.code, rows
    elseif event.kind == "release" then
        local b = event.body
        rows[1] = { kind = "released", after = { release_id = b.release_id, version = b.version, channels = b.channels or {} } }
        return "p:" .. b.product_id, rows
    elseif event.kind == "model_release" then
        rows[1] = { kind = "release_requested", after = { request_id = event.body.request_id, product_id = event.body.product_id } }
        return "p:" .. event.body.product_id, rows
    elseif event.kind == "withdraw" then
        rows[1] = { kind = "withdrawn", after = { channels = event.body.channels or {} } }
        return "p:" .. event.body.product_id, rows
    end
    local b = event.body
    local t = event.type
    if t == EV.PRODUCT_CREATED then
        rows[#rows + 1] = { kind = "created", after = { sku = b.sku, family = b.family, parent_id = b.parent_id, level = b.level, status = b.status } }
    elseif t == EV.PRODUCT_MOVED then
        rows[#rows + 1] = { kind = "moved", after = { parent_id = b.parent_id } }
    elseif t == EV.PRODUCT_DELETED then
        rows[#rows + 1] = { kind = "deleted" }
    elseif t == EV.PRODUCT_RESTORED then
        rows[#rows + 1] = { kind = "restored" }
    elseif t == EV.PRODUCT_PURGED then
        rows[#rows + 1] = { kind = "purged" }
    elseif b.status then
        rows[#rows + 1] = { kind = "status", before = b.previous_status, after = b.status }
    end
    if b.audit == true then
        for _, step in ipairs(b.patch or {}) do
            local kind = step.clear and "clear" or (step.unset and "unset" or "set")
            rows[#rows + 1] = { kind = kind, attribute_id = step.a, ctx = step.c, before = step.before, after = step.v, source = step.s }
        end
    end
    return "p:" .. b.product_id, rows
end

-- record_history collects the event's change rows (spec 5.6).
local function record_history(catalog_id: string, event: types.FoldEvent, rows: { types.SqlParams }): error?
    local subject, changes = history_rows(event)
    local actor, at = event.body.actor, event.body.at
    if not actor or not at then
        return failure.corrupt("event " .. event.seq .. " carries no actor or command time")
    end
    local source: string? = nil
    local origin: types.JsonObject? = nil
    if event.kind == "product" or event.kind == "created" then
        source = event.body.source
        if event.body.origin then origin = { origin = event.body.origin, provenance = event.body.provenance, approval_item_id = event.body.approval_item_id } end
    end
    history.collect(rows, { catalog_id = catalog_id, seq = event.seq, subject = subject, actor = actor, at = at, source = source,
        origin = origin }, changes)
    return nil
end

-- FOLDED lists the event types the catalog projection folds.
local FOLDED: { [string]: boolean } = {
    [EV.MODEL_RELEASE_REQUESTED] = true, [EV.SCHEMA_APPLIED] = true, [EV.TERM_CHANGED] = true, [EV.PRODUCT_RELEASED] = true, [EV.PRODUCT_WITHDRAWN] = true,
}
for t in pairs(PRODUCT_EVENTS) do FOLDED[t] = true end

-- typed reads a parsed step as PIM's fold event. The driver parsed the body
-- against the schema its type declares, which the body types in types.lua mirror.
local function typed(step: driver.Step): types.FoldEvent
    local t, seq = step.type, step.seq
    if t == EV.MODEL_RELEASE_REQUESTED then return { kind = "model_release", seq = seq, type = t, body = step.body :: types.ModelReleaseBody } end
    if t == EV.SCHEMA_APPLIED then return { kind = "schema", seq = seq, type = t, body = step.body :: types.SchemaBody } end
    if t == EV.TERM_CHANGED then return { kind = "term", seq = seq, type = t, body = step.body :: types.TermBody } end
    if t == EV.PRODUCT_RELEASED then return { kind = "release", seq = seq, type = t, body = step.body :: types.ReleaseBody } end
    if t == EV.PRODUCT_WITHDRAWN then return { kind = "withdraw", seq = seq, type = t, body = step.body :: types.WithdrawBody } end
    if t == EV.PRODUCT_CREATED then return { kind = "created", seq = seq, type = t, body = step.body :: types.ProductCreatedBody } end
    return { kind = "product", seq = seq, type = t, body = step.body :: types.ProductBody }
end

-- Item recomputation and schema cleanup share row_budget; partial schema cleanup leaves the checkpoint before its event.
function M.fold(tx: sql.Transaction, dialect: string, catalog_id: string, events: { types.RawEvent }, to_seq: integer,
    row_budget: integer): (FoldResult?, error?)
    local catalog, err = store.catalog(tx, catalog_id, dialect)
    if err then return nil, err end
    local result: FoldResult = { last_seq = to_seq, jobs = {} }
    local applied = catalog and catalog.applied_seq or 0
    local batch: Batch = { cache = {}, ids = {}, rows = 0, derived = {}, usage = {}, history = {}, products = 0, items = 0, trashed = 0 }
    local pending = false
    local stopped, ferr = driver.run(events, { applied = applied, budget = row_budget, accepts = FOLDED,
        rows = function(): integer return batch.rows end,
        pending = function(): boolean return pending end,
        apply = function(step: driver.Step): error?
            local event = typed(step)
            local herr: error?
            if event.kind == "schema" then
                if catalog then
                    local cleaned, cerr = schema_cleanup.run(tx, dialect, catalog, event, math.max(0, row_budget - batch.rows))
                    if cerr or not cleaned then return cerr end
                    batch.rows = batch.rows + cleaned.rows
                    if cleaned.more then
                        local perr = schema_cleanup.pending(tx, catalog_id, event.seq)
                        if perr then return perr end
                        pending = true
                        return nil
                    end
                end
                local job: string?
                catalog, job, herr = apply_schema(tx, dialect, catalog, catalog_id, event)
                if job then result.rebuild_job = job end
            elseif not catalog then
                herr = failure.corrupt("catalog event before its schema")
            elseif event.kind == "model_release" then
                local job: string?
                job, herr = release_jobs.record(tx, dialect, catalog_id, event.body, step.trace_context)
                if job then result.jobs[#result.jobs + 1] = job end
            elseif event.kind == "term" then
                local job: string?
                job, herr = apply_term(tx, dialect, catalog_id, event,step.trace_context)
                if job then result.jobs[#result.jobs + 1] = job end
                if not herr then
                    local refs, rerr = tx:query("SELECT 1 FROM kickside_pim_ref WHERE catalog_id=$1 AND kind='term' AND target=$2 LIMIT 1",
                        { catalog_id, event.body.vocabulary .. ":" .. event.body.code })
                    if rerr then return rerr end
                    if #(refs or {}) > 0 then
                        local rebuild, berr = schedule_rebuild(tx, dialect, catalog_id, event.seq, catalog.pending_columns)
                        if berr then return berr end
                        result.rebuild_job = rebuild
                    end
                end
            elseif event.kind == "product" or event.kind == "created" then
                herr = apply_product(tx, catalog, event, batch)
            elseif event.kind == "release" then
                herr = apply_release(tx, catalog, event)
            elseif event.kind == "withdraw" then
                local channels: { [string]: boolean } = {}
                for _, c in ipairs(event.body.channels or {}) do channels[c] = true end
                herr = unpublish_where(tx, catalog_id, "product_id", event.body.product_id, channels, event.seq)
            end
            if not herr and catalog then herr = record_history(catalog_id, event, batch.history) end
            return herr
        end })
    if ferr then return nil, ferr end
    if stopped then result.last_seq = stopped :: integer end
    if not catalog then return result, nil end
    local current: types.Catalog = catalog
    local active: { [integer]: boolean } = {}
    for _, attr in pairs(current.compiled.attributes) do active[attr.id] = true end
    for id in pairs(batch.usage) do if not active[id] then batch.usage[id] = nil end end
    err = derived.flush_derived(tx, catalog_id, current.compiled, batch)
    if not err then err = derived.flush_usage(tx, catalog_id, batch.usage) end
    if not err then
        err = history.write(tx, batch.history)
    end
    if not err then err = item_index.recompute(tx, dialect, current, batch.ids, batch.cache) end
    if err then return nil, err end
    if result.last_seq > current.applied_seq then
        err = exec(tx, [[UPDATE kickside_pim_catalog SET applied_seq = $1, product_count = product_count + $2,
            item_count = item_count + $3, trashed_count = trashed_count + $4 WHERE catalog_id = $5]],
            { result.last_seq, batch.products, batch.items, batch.trashed, catalog_id })
        if err then return nil, err end
    end
    return result, nil
end

return M
