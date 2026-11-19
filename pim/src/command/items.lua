-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local failure=require("failure")
-- Validates apply items against the catalog state at the command's head and plans
-- their events (spec 6, steps 4-5). Later items in one command see earlier ones.
local uuid = require("uuid")
local consts = require("consts")
local store = require("store")
local values = require("values")
local types = require("types")
local policy = require("policy")

local item_state = require("item_state")
local item_patch = require("item_patch")
local evaluate = require("evaluate")
local checks = require("checks")
local terms = require("terms")

local M = {}


local EV = consts.EVENTS

-- Preparation belongs to one command and survives head conflicts in its generation.
type Prepared = { generation: integer?, refined: { [integer]: { [string]: types.Refined } }, links: { [string]: { [string]: boolean } } }
M.Prepared = Prepared

-- enforce runs the family's write-enforced checks owned at the candidate's
-- level over its state as the item would leave it, as the caller; a finding
-- rejects the item before the command's state changes. Restore never comes
-- here and import replays values that were accepted when exported.
local function enforce(st: item_state.State, candidate: types.Product): (types.Outcome?, error?)
    if st.import then return nil, nil end
    local family = st.compiled.families[candidate.family]
    local any = false
    for _, c in ipairs(family and family.checks or {}) do
        if c.enforce and c.level == candidate.level then any = true end
    end
    if not any then return nil, nil end
    local lineage, err = item_state.lineage(st, candidate)
    if err or not lineage then return nil, err end
    local findings = evaluate.enforced(st.compiled, candidate, lineage, checks.run)
    if #findings == 0 then return nil, nil end
    local outcome: types.Outcome = { outcome = "invalid", findings = findings }
    if candidate.version > 0 then
        outcome.product_id = candidate.product_id
        outcome.version = candidate.version
    end
    return outcome, nil
end

-- as_written is the product as the item leaves it: a copy carrying the patched
-- document and status, for checks to read before the state changes.
local function as_written(p: types.Product, document: types.Document, status: string?): types.Product
    local out: { [string]: unknown } = {}
    for k, v in pairs(p :: { [string]: unknown }) do out[k] = v end
    out.document = document
    if status then out.status = status end
    return out :: types.Product
end

-- Every product mutation carries the same source ordering and attribution.
local function stamp(st: item_state.State, p: types.Product, body: types.ProductBody, seq: integer?): types.ProductBody
    local source = st.source
    if source then
        body.source = source.id
        body.source_seq = seq
        if seq then p.source_seq[source.id] = seq end
    end
    body.origin = st.origin
    body.provenance = st.provenance
    body.approval_item_id = st.approval_item_id
    body.audit = st.audit
    return body
end

local function plan_create(st: item_state.State, item: types.ApplyItem): (types.Event?, types.Outcome?, error?)
    local c = item.create :: types.CreateSpec
    local compiled = st.compiled
    local sku = item.product and item.product.sku
    if type(sku) ~= "string" or sku == "" or #sku > consts.LIMITS.sku_bytes then return nil, item_state.fail("invalid", "create needs a sku of 1..128 bytes"), nil end
    local existing, err = item_state.by_sku(st, sku)
    if err then return nil, nil, err end
    if existing then return nil, item_state.fail("conflict", "sku already exists", { product_id = existing.product_id }), nil end
    local family_code = c.family or "generic"
    local family = compiled.families[family_code]
    local parent: types.Product?
    if c.parent then
        parent, err = item_state.address(st, c.parent)
        if err then return nil, nil, err end
        if not parent then return nil, item_state.fail("invalid", "parent not found", { code = "invalid_reference" }), nil end
        if c.family and c.family ~= parent.family then return nil, item_state.fail("invalid", "a variant shares its parent's family"), nil end
        family_code = parent.family
        family = compiled.families[family_code]
        if parent.is_item == 1 then return nil, item_state.fail("invalid", "items cannot have children"), nil end
    end
    if not family then return nil, item_state.fail("invalid", "unknown family " .. tostring(family_code)), nil end
    local level = parent and parent.level + 1 or 0
    if parent then
        local room, rerr = item_state.has_room(st, parent.root_id)
        if rerr then return nil, nil, rerr end
        if not room then return nil, item_state.fail("invalid", "too many products under this root"), nil end
    end
    local status = item.status or "active"
    if not consts.STATUSES[status] then return nil, item_state.fail("invalid", "unknown status " .. tostring(status)), nil end
    local p: types.Product = { product_id = uuid.v7() :: string, sku = sku, family = family_code, parent_id = parent and parent.product_id or nil,
        root_id = parent and parent.root_id or "", level = level, is_item = (level == family.item_level) and 1 or 0,
        version = 0, status = status, state = "live", document = {}, source_seq = {} }
    if p.root_id == "" then p.root_id = p.product_id end
    local patched, outcome, berr = item_patch.build_patch(st, p, item)
    if berr then return nil, nil, berr end
    if outcome or not patched then return nil, outcome, nil end
    local built: item_patch.Built = patched
    local key, axis_err = item_patch.axis_key(compiled, family, level, built.document)
    if axis_err then return nil, item_state.fail("invalid", axis_err), nil end
    if key then
        local axis_fail, aerr = item_state.check_axis(st, p.parent_id :: string, key, p.product_id)
        if aerr then return nil, nil, aerr end
        if axis_fail then return nil, axis_fail, nil end
    end
    local rejected, eerr = enforce(st, as_written(p, built.document, nil))
    if eerr then return nil, nil, eerr end
    if rejected then return nil, rejected, nil end
    local source = st.source
    local seq: integer? = nil
    if source and source.ordering == "sequence" then
        seq = math.tointeger(item.seq)
        if seq == nil then return nil, item_state.fail("invalid", "source " .. source.id .. " requires seq"), nil end
    end
    item_state.take_axis(st, p, p.parent_id, key)
    p.axis_key = key
    p.document = built.document
    p.version = 1
    if parent then st.added[p.root_id] = (st.added[p.root_id] or 0) + 1 end
    st.products[p.product_id] = p
    st.skus[sku] = p.product_id
    st.freed[sku] = nil
    item_state.claim_uniques(st, p, built.unique)
    return { type = EV.PRODUCT_CREATED, subject = "p:" .. p.product_id,
        body = stamp(st, p, { product_id = p.product_id, sku = sku, family = family_code, parent_id = p.parent_id, level = level,
            is_item = p.is_item == 1, axis_key = key, status = status, patch = built.patch }, seq) },
        { outcome = "created", product_id = p.product_id, sku = sku, version = 1 }, nil
end

local function plan_delete(st: item_state.State, p: types.Product, seq: integer?): (types.Event?, types.Outcome?, error?)
    local has, herr = item_state.has_children(st, p.product_id)
    if herr then return nil, nil, herr end
    if has then return nil, item_state.fail("invalid", "products with descendants cannot be deleted"), nil end
    local refs, rerr = item_state.count_refs(st, "product", p.product_id, p.product_id)
    if rerr then return nil, nil, rerr end
    if (refs :: integer) > 0 then return nil, item_state.fail("invalid", "product is referenced by " .. refs .. " values"), nil end
    p.state = "trashed"
    st.gone[p.product_id] = true
    p.version = p.version + 1
    st.freed[p.sku] = true
    st.skus[p.sku] = nil
    return { type = EV.PRODUCT_DELETED, subject = "p:" .. p.product_id, body = stamp(st, p, { product_id = p.product_id }, seq) },
        { outcome = "updated", product_id = p.product_id, version = p.version, trashed = true }, nil
end

local function plan_move(st: item_state.State, item: types.ApplyItem, p: types.Product, seq: integer?): (types.Event?, types.Outcome?, error?)
    local compiled = st.compiled
    local has, herr = item_state.has_children(st, p.product_id)
    if herr then return nil, nil, herr end
    if has or p.level == 0 then return nil, item_state.fail("invalid", "only variants without descendants move"), nil end
    local parent, perr = item_state.address(st, (item.move :: { parent: types.ProductRef }).parent)
    if perr then return nil, nil, perr end
    if not parent or parent.level ~= p.level - 1 or parent.root_id ~= p.root_id then
        return nil, item_state.fail("invalid", "a variant moves to a product one level up under the same root"), nil
    end
    if parent.product_id == p.parent_id then
        if seq == nil then return nil, { outcome = "unchanged", product_id = p.product_id, version = p.version }, nil end
        -- A newer delivery still advances the sequence when the parent already matches.
        p.version = p.version + 1
        return { type = EV.PRODUCT_CHANGED, subject = "p:" .. p.product_id,
            body = stamp(st, p, { product_id = p.product_id, patch = {} }, seq) },
            { outcome = "updated", product_id = p.product_id, version = p.version }, nil
    end
    local family = compiled.families[p.family]
    local key, axis_err = item_patch.axis_key(compiled, family, p.level, p.document)
    if axis_err or not key then return nil, item_state.fail("invalid", axis_err or "variant has no axis values"), nil end
    local axis_fail, aerr = item_state.check_axis(st, parent.product_id, key, p.product_id)
    if aerr then return nil, nil, aerr end
    if axis_fail then return nil, axis_fail, nil end
    item_state.take_axis(st, p, parent.product_id, key)
    p.parent_id = parent.product_id
    p.axis_key = key
    p.version = p.version + 1
    return { type = EV.PRODUCT_MOVED, subject = "p:" .. p.product_id,
        body = stamp(st, p, { product_id = p.product_id, parent_id = parent.product_id, axis_key = key }, seq) },
        { outcome = "updated", product_id = p.product_id, version = p.version }, nil
end

local function plan_edit(st: item_state.State, item: types.ApplyItem, p: types.Product, seq: integer?): (types.Event?, types.Outcome?, error?)
    local compiled = st.compiled
    if item.delete then return plan_delete(st, p, seq) end
    if item.move then return plan_move(st, item, p, seq) end
    if item.status ~= nil and not consts.STATUSES[item.status] then return nil, item_state.fail("invalid", "unknown status"), nil end
    local patched, outcome, berr = item_patch.build_patch(st, p, item)
    if berr then return nil, nil, berr end
    if outcome or not patched then return nil, outcome, nil end
    local built: item_patch.Built = patched
    local status_change = item.status ~= nil and item.status ~= p.status
    if #built.patch == 0 and not status_change and seq == nil then
        return nil, { outcome = "unchanged", product_id = p.product_id, version = p.version }, nil
    end
    local family = compiled.families[p.family]
    local key, axis_err = item_patch.axis_key(compiled, family, p.level, built.document)
    if axis_err then return nil, item_state.fail("invalid", axis_err), nil end
    if key and key ~= p.axis_key then
        local axis_fail, aerr = item_state.check_axis(st, p.parent_id :: string, key, p.product_id)
        if aerr then return nil, nil, aerr end
        if axis_fail then return nil, axis_fail, nil end
    end
    local rejected, eerr = enforce(st, as_written(p, built.document, status_change and item.status or nil))
    if eerr then return nil, nil, eerr end
    if rejected then return nil, rejected, nil end
    if key ~= p.axis_key then item_state.take_axis(st, p, p.parent_id, key) end
    local previous_status = p.status
    p.document = built.document
    p.version = p.version + 1
    if status_change then p.status = item.status :: string end
    item_state.release(st, p, built.released)
    item_state.claim_uniques(st, p, built.unique)
    local body: types.ProductBody = { product_id = p.product_id, patch = built.patch }
    if status_change then
        body.previous_status = previous_status
        body.status = item.status
    end
    if key ~= p.axis_key then
        body.axis_key = key
        p.axis_key = key
    end
    return { type = EV.PRODUCT_CHANGED, subject = "p:" .. p.product_id, body = stamp(st, p, body, seq) },
        { outcome = "updated", product_id = p.product_id, version = p.version }, nil
end

local function check_version(st: item_state.State, item: types.ApplyItem, p: types.Product): (integer?, types.Outcome?)
    local source = st.source
    local seq: integer? = nil
    if source and source.ordering == "sequence" and not st.proposal then
        seq = math.tointeger(item.seq)
        if seq == nil then return nil, item_state.fail("invalid", "source " .. source.id .. " requires seq") end
        local stored = math.tointeger(p.source_seq[source.id]) or 0
        if seq <= stored then return nil, { outcome = "unchanged", product_id = p.product_id, version = p.version,
            findings = { { message = "stale_source: seq " .. seq .. " is not after " .. stored } } } end
    elseif item.expect_version ~= "any" then
        local wanted = item.expect_version
        local expected = type(wanted) == "number" and math.tointeger(wanted) or nil
        if expected == nil then return nil, item_state.fail("invalid", "expect_version is required") end
        if expected ~= p.version then
            return nil, item_state.fail("conflict", "product changed", { code = "version_conflict", version = p.version })
        end
    end
    return seq, nil
end

local function plan_existing(st: item_state.State, item: types.ApplyItem, p: types.Product): (types.Event?, types.Outcome?, error?)
    local seq, outcome = check_version(st, item, p)
    if outcome then return nil, outcome, nil end
    return plan_edit(st, item, p, seq)
end

-- plan_restore returns a trashed product to the catalog. It is validated at the
-- head like a write: its family, parent, sku, unique values, axis slot and
-- references must still hold (spec 5.7).
local function plan_restore(st: item_state.State, item: types.ApplyItem): (types.Event?, types.Outcome?, error?)
    local ref = item.product
    if type(ref) ~= "table" or type(ref.id) ~= "string" then return nil, item_state.fail("invalid", "restore addresses a product by id"), nil end
    local p, err = item_state.load(st, ref.id)
    if err then return nil, nil, err end
    if not p then return nil, item_state.fail("invalid", "only trashed products restore"), nil end
    local state = p.state
    if state ~= "trashed" then return nil, item_state.fail("invalid", "only trashed products restore"), nil end
    local seq, outcome = check_version(st, item, p)
    if outcome then return nil, outcome, nil end
    local compiled = st.compiled
    local family = compiled.families[p.family]
    if not family then return nil, item_state.fail("invalid", "family " .. p.family .. " no longer exists"), nil end
    local document_error = item_patch.validate_document(st, p)
    if document_error then return nil, document_error, nil end
    if p.parent_id then
        local parent, perr = item_state.load(st, p.parent_id :: string)
        if perr then return nil, nil, perr end
        if not parent or parent.state ~= "live" then return nil, item_state.fail("invalid", "parent is not in the catalog"), nil end
        if parent.family ~= p.family or parent.level + 1 ~= p.level or parent.root_id ~= p.root_id then return nil, item_state.fail("invalid", "restored parent hierarchy differs"), nil end
        local room, rerr = item_state.has_room(st, parent.root_id)
        if rerr then return nil, nil, rerr end
        if not room then return nil, item_state.fail("invalid", "too many products under this root"), nil end
    end
    local holder, serr = item_state.by_sku(st, p.sku)
    if serr then return nil, nil, serr end
    if holder and holder.product_id ~= p.product_id then
        return nil, item_state.fail("conflict", "sku is used by another product", { holder = holder.product_id }), nil
    end
    local unique: { [string]: types.Value } = {}
    for code, attr in pairs(compiled.attributes) do
        local coords = p.document[tostring(attr.id)]
        if coords then
            for _, cell in pairs(coords) do
                if cell.p ~= nil then
                    local refail, rerr = item_patch.check_refs(st, attr, cell.p, p.product_id, true)
                    if rerr then return nil, nil, rerr end
                    if refail then return nil, refail, nil end
                end
            end
            local own = coords[""]
            if attr.unique and own and own.p ~= nil then unique[code] = own.p end
        end
    end
    for code, value in pairs(unique) do
        local attr = compiled.attributes[code] :: types.Attribute
        local key = values.key(attr.form, values.scalar(value), attr.config) or ""
        local slot = attr.id .. "|" .. key
        local held: string? = st.uniques[slot]
        if held == nil and not st.released[slot] then
            local owner, oerr = store.unique_owner(st.db, st.catalog_id, attr.id, key)
            if oerr then return nil, nil, oerr end
            held = owner
        end
        if held and held ~= p.product_id and not st.gone[held] then
            return nil, item_state.fail("conflict", code .. " value is already used by another product", { attribute = code, holder = held }), nil
        end
    end
    local axis_key = item_patch.axis_key(compiled, family, p.level, p.document)
    if axis_key and p.parent_id then
        local axis_fail, aerr = item_state.check_axis(st, p.parent_id :: string, axis_key, p.product_id)
        if aerr then return nil, nil, aerr end
        if axis_fail then return nil, axis_fail, nil end
    end
    item_state.take_axis(st, p, p.parent_id, axis_key)
    p.axis_key=axis_key
    if p.parent_id then st.added[p.root_id] = (st.added[p.root_id] or 0) + 1 end
    p.state = "live"
    p.version = p.version + 1
    st.freed[p.sku] = nil
    st.skus[p.sku] = p.product_id
    st.gone[p.product_id] = nil
    item_state.claim_uniques(st, p, unique)
    return { type = EV.PRODUCT_RESTORED, subject = "p:" .. p.product_id,
        body = stamp(st, p, { product_id = p.product_id, axis_key = axis_key }, seq) },
        { outcome = "updated", product_id = p.product_id, version = p.version, restored = true }, nil
end

-- plan(db, catalog, request, actor, defaults) -> { outcomes, events, ok }. The
-- effective audit flag (catalog policy over the deployment default, then the
-- source's audit switch) is decided here and carried in the product events.
type PlanResult = { outcomes: { types.Outcome }, events: { types.Event }, ok: boolean }
M.PlanResult = PlanResult

-- referenced_skus lists the skus the items address, so the command reads their
-- stored holders in one statement.
local function referenced_skus(list: { types.ApplyItem }): { string }
    local out: { string } = {}
    local function add(ref: unknown)
        if type(ref) == "table" then
            local sku = (ref :: { [string]: unknown }).sku
            if type(sku) == "string" then out[#out + 1] = sku end
        end
    end
    for _, item in ipairs(list) do
        if type(item) == "table" then
            add(item.product)
            if type(item.create) == "table" then add((item.create :: { [string]: unknown }).parent) end
            if type(item.move) == "table" then add((item.move :: { [string]: unknown }).parent) end
        end
    end
    return out
end

function M.source_access(source: types.Source, actor: string): error?
    if next(source.principals) and not source.principals[actor] then
        return errors.new({ details = { code = "source_access_denied" }, kind = errors.PERMISSION_DENIED,
            message = "principal is not bound to source " .. source.id })
    end
    return nil
end

function M.plan(db: types.Executor, catalog: types.Catalog, request: types.ApplyRequest, actor: string, defaults: types.Policy,
    prepared: Prepared?, proposal: boolean?): (PlanResult?, error?)
    local source: types.Source?
    if request.source ~= nil then
        source = catalog.compiled.sources[request.source]
        if not source then return nil, failure.unknown_source(request.source) end
        local access_err = M.source_access(source, actor)
        if access_err then return nil, access_err end
    end
    local st = item_state.new_state(db, catalog, actor, source)
    st.items = request.items
    local perr = item_state.read_skus(st, referenced_skus(request.items))
    if perr then return nil, perr end
    st.import = request.import == true
    st.proposal = proposal == true
    if prepared then
        if prepared.generation ~= catalog.generation then
            prepared.generation, prepared.refined, prepared.links = catalog.generation, {}, {}
        end
        st.refined, st.links = prepared.refined, prepared.links
    end
    local ferr = item_patch.refine(st)
    if ferr then return nil, ferr end
    local terr = item_patch.read_terms(st)
    if terr then return nil, terr end
    st.origin = request.origin
    st.provenance = request.provenance
    st.approval_item_id = request.approval_item_id
    local effective = policy.effective(defaults, catalog.compiled.policy)
    st.audit = effective.audit == "fields" and (source == nil or source.audit)
    local outcomes: { types.Outcome } = {}
    local events: { types.Event } = {}
    local ok = true
    for index, item in ipairs(request.items) do
        local event: types.Event?
        local outcome: types.Outcome?
        local err: error?
        if type(item) ~= "table" then
            outcome = item_state.fail("invalid", "item must be an object")
        elseif item.restore and (item.delete or item.move or item.create or item.set or item.clear or item.unset or item.status
            or item.term or item.term_merge) then
            outcome = item_state.fail("invalid", "restore is a separate item")
        elseif (item.move or item.delete) and ((item.move and item.delete) or item.create or item.set or item.clear or item.unset
            or item.status or item.term or item.term_merge) then
            outcome = item_state.fail("invalid", "move and delete are separate items")
        elseif item.term_merge then
            -- Ordinary items validate before changing state. A merge can change
            -- several products before a later holder fails validation.
            local candidate = item_state.fork(st)
            local list: { types.Event }?
            list, outcome, err = terms.plan_merge(candidate, item, plan_edit)
            if outcome and outcome.outcome == "updated" then st = candidate end
            for _, e in ipairs(list or {}) do events[#events + 1] = e end
        elseif item.term then
            event, outcome, err = terms.plan_term(st, item)
        elseif item.restore then
            event, outcome, err = plan_restore(st, item)
        elseif item.create and item.upsert and item.product and type(item.product.sku) == "string" then
            -- An upsert creates the sku when it is absent at the command head and
            -- otherwise updates it (by source seq, else last writer wins).
            local existing: types.Product?
            existing, err = item_state.by_sku(st, item.product.sku)
            if not err then
                if existing and existing.state == "live" then
                    if item.seq == nil then item.expect_version = "any" end
                    event, outcome, err = plan_existing(st, item, existing)
                else
                    event, outcome, err = plan_create(st, item)
                end
            end
        elseif item.create then
            event, outcome, err = plan_create(st, item)
        else
            local p: types.Product?
            p, err = item_state.address(st, item.product)
            if not err then
                if not p then outcome = item_state.fail("invalid", "product not found", { code = "invalid_reference" })
                else event, outcome, err = plan_existing(st, item, p) end
            end
        end
        if err then return nil, err end
        if not outcome then return nil, errors.new({ details = { code = "internal" }, kind = errors.INTERNAL, message = "item " .. index .. " was planned without an outcome" }) end
        local result: types.Outcome = outcome
        result.index = index
        outcomes[index] = result
        if event then events[#events + 1] = event end
        if result.outcome ~= "created" and result.outcome ~= "updated" and result.outcome ~= "unchanged" then ok = false end
    end
    return { outcomes = outcomes, events = events, ok = ok }, nil
end

return M
