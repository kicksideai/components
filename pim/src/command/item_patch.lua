-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Item patches: checks each requested value against its attribute, the source's
-- write rights and the index, and turns it into patch steps.
local hash = require("hash")
local json = require("json")
local item_state = require("item_state")
local consts = require("consts")
local schema = require("schema")
local store = require("store")
local values = require("values")
local links = require("links")
local type_functions = require("type_functions")
local types = require("types")
local references = require("references")

local M = {}

-- released lists unique keys an item gives up; they are free for later items once it is accepted.
type Built = { patch: { types.PatchStep }, document: types.Document, unique: { [string]: types.Value }, released: { string } }
M.Built = Built

-- coerce turns term codes into term references for term-typed attributes.
function M.coerce(attr: types.Attribute, raw: unknown): unknown
    if attr.config.target ~= "term" then return raw end
    local function one(v: unknown): unknown
        if type(v) == "string" then return { ref = { "term", attr.vocabulary .. ":" .. v } } end
        return v
    end
    if attr.cardinality == "one" then return one(raw) end
    if type(raw) ~= "table" then return raw end
    local out: { unknown } = {}
    for i, v in ipairs(raw :: { unknown }) do out[i] = one(v) end
    return out
end

-- refine runs the type functions of every attribute the command sets, once per
-- attribute: the form normalizes each requested value, normalize refines the
-- valid ones, validate answers findings over the refined values, and the
-- outcome per value waits in st.refined for the patch that takes it. Import
-- replays values accepted when they were exported and skips the functions.
function M.refine(st: item_state.State): error?
    if st.import then return nil end
    local compiled = st.compiled
    local batches: { [integer]: { attr: types.Attribute, keys: { string }, raw: { unknown } } } = {}
    local order: { integer } = {}
    for _, item in ipairs(st.items) do
        if type(item) == "table" then
            for _, e in ipairs(item.set or {}) do
                local attr = compiled.attributes[e.attr]
                if attr and attr.functions then
                    local raw = M.coerce(attr, e.value)
                    local key = values.canonical(raw)
                    local batch = batches[attr.id]
                    if not batch then
                        batch = { attr = attr, keys = {}, raw = {} }
                        batches[attr.id] = batch
                        order[#order + 1] = attr.id
                    end
                    local seen = st.refined[attr.id]
                    if not seen then
                        seen = {}
                        st.refined[attr.id] = seen
                    end
                    if not seen[key] then
                        seen[key] = {}
                        batch.keys[#batch.keys + 1] = key
                        batch.raw[#batch.raw + 1] = raw
                    end
                end
            end
        end
    end
    table.sort(order)
    for _, id in ipairs(order) do
        local batch = batches[id]
        local attr = batch.attr
        local fns = attr.functions :: types.TypeFunctions
        local refined = st.refined[id]
        local valid_keys: { string } = {}
        local valid: { unknown } = {}
        for i, key in ipairs(batch.keys) do
            local value, verr = values.normalize(attr, batch.raw[i])
            if verr then refined[key].error = tostring(verr)
            else
                valid_keys[#valid_keys + 1] = key
                valid[#valid + 1] = value
            end
        end
        if fns.normalize and #valid > 0 then
            local answers, err = type_functions.normalize(fns.normalize :: string, (attr.config :: unknown) :: types.JsonObject, valid)
            if err or not answers then return err end
            local kept_keys: { string } = {}
            local kept: { unknown } = {}
            for i, key in ipairs(valid_keys) do
                local a = answers[i]
                if a.error then refined[key].error = a.error
                else
                    local value, verr = values.normalize(attr, a.value)
                    if verr then
                        return errors.new({ kind = errors.UNAVAILABLE, retryable = true, details = { code = "contract_unavailable" },
                            message = "type function " .. tostring(fns.normalize) .. " answered a value the form refuses: " .. tostring(verr) })
                    end
                    kept_keys[#kept_keys + 1] = key
                    kept[#kept + 1] = value
                end
            end
            valid_keys, valid = kept_keys, kept
        end
        for i, key in ipairs(valid_keys) do refined[key].value = valid[i] :: types.Value end
        if fns.validate and #valid > 0 then
            local answers, err = type_functions.validate(fns.validate :: string, (attr.config :: unknown) :: types.JsonObject, valid)
            if err or not answers then return err end
            for i, key in ipairs(valid_keys) do
                if #answers[i] > 0 then
                    local findings: { types.Finding } = {}
                    for _, f in ipairs(answers[i]) do findings[#findings + 1] = { code = f.code, message = f.message, attribute = attr.code } end
                    refined[key].findings = findings
                end
            end
        end
    end
    return nil
end

-- requested takes the value the command sets: what the type's functions made
-- of it when the type declares any, else the form's normalization.
local function requested(st: item_state.State, attr: types.Attribute, raw: unknown): (types.Value?, types.Outcome?, error?)
    local value = M.coerce(attr, raw)
    if attr.functions and not st.import then
        local refined = (st.refined[attr.id] or {})[values.canonical(value)]
        if not refined then return nil, nil, errors.new({ details = { code = "internal" }, kind = errors.INTERNAL, message = attr.code .. ": value was not refined before the patch" }) end
        if refined.error then return nil, item_state.fail("invalid", attr.code .. ": " .. refined.error, { attribute = attr.code }), nil end
        if refined.findings then return nil, { outcome = "invalid", findings = refined.findings }, nil end
        return refined.value, nil, nil
    end
    local normalized, verr = values.normalize(attr, value)
    if verr then return nil, item_state.fail("invalid", attr.code .. ": " .. tostring(verr), { attribute = attr.code }), nil end
    return normalized, nil, nil
end

-- requested_links lists the ids of one link kind the command's items set, so
-- the kind's owner is asked once per command.
local function requested_links(st: item_state.State, kind: string): ({ string }?, error?)
    local out: { string } = {}
    local seen: { [string]: boolean } = {}

    for _, item in ipairs(st.items) do
        if type(item) == "table" then
            for _, e in ipairs(item.set or {}) do
                local attr = st.compiled.attributes[e.attr]
                if attr then
                    local value, refused, err = requested(st, attr, e.value)
                    if err then return nil, err end
                    if value and not refused then
                        for _, occurrence in ipairs(references.collect(attr, value)) do
                            local ref = occurrence.value.ref
                            if ref[1] == kind and not seen[ref[2]] then
                                seen[ref[2]] = true
                                out[#out + 1] = ref[2]
                            end
                        end
                    end
                end
            end
        end
    end
    return out
end

-- resolved_links answers the ids of kind the owner resolved for this command,
-- asking it on the first use.
local function resolved_links(st: item_state.State, kind: string): ({ [string]: boolean }?, error?)
    local known = st.links[kind]
    if known then return known, nil end
    local ids, ierr = requested_links(st, kind)
    if ierr or not ids then return nil, ierr end
    local resolved, err = links.resolve(kind, st.catalog_id, ids)
    if err or not resolved then return nil, err end
    st.links[kind] = resolved
    return resolved, nil
end

-- read_terms batches the command's requested terms after type normalization.
-- Later term edits overlay these head rows in the command state.
function M.read_terms(st: item_state.State): error?
    local refs: { types.TermRef } = {}
    local seen: { [string]: boolean } = {}
    local function add(vocabulary: unknown, code: unknown)
        if type(vocabulary) ~= "string" or type(code) ~= "string" then return end
        local key = vocabulary .. ":" .. code
        if seen[key] then return end
        seen[key] = true
        refs[#refs + 1] = { vocabulary = vocabulary, code = code }
    end
    local checked: { [string]: boolean } = {}
    for _, item in ipairs(st.items) do
        if type(item) == "table" then
            if item.term then
                add(item.term.vocabulary, item.term.code)
                add(item.term.vocabulary, item.parent)
            end
            if item.term_merge then
                add(item.term_merge.vocabulary, item.term_merge.from)
                add(item.term_merge.vocabulary, item.term_merge.into)
            end
            for _, entry in ipairs(item.set or {}) do
                local attr = st.compiled.attributes[entry.attr]
                if attr then
                    local key = attr.id .. "|" .. values.canonical(entry.value)
                    if not checked[key] then
                        checked[key] = true
                        local value, outcome, err = requested(st, attr, entry.value)
                        if err then return err end
                        if value and not outcome then
                            for _, occurrence in ipairs(references.collect(attr, value)) do
                                local ref = occurrence.value.ref
                                local vocabulary, code = ref[2]:match("^([^:]+):(.+)$")
                                if ref[1] == "term" and vocabulary == occurrence.vocabulary then add(vocabulary, code) end
                            end
                        end
                    end
                end
            end
        end
    end
    return item_state.read_terms(st, refs)
end

-- check_refs answers whether every reference in value names a live term or
-- product, or an id a link kind's owner resolves; holder_id is the product
-- holding the value, which may name itself. A referent the catalog does not
-- hold fails the item with code invalid_reference, so a caller that delivers
-- records out of order can tell a missing dependency from a malformed value.
-- A stored value (restore) keeps its links as they are: a target that
-- disappeared degrades, it never blocks.
function M.check_refs(st: item_state.State, attr: types.Attribute, value: types.Value, holder_id: string, stored: boolean?): (types.Outcome?, error?)
    for _, occurrence in ipairs(references.collect(attr, value)) do
        local ref = occurrence.value.ref
        local kind, id = ref[1], ref[2]
        if kind ~= "term" and kind ~= "product" then
            if not stored then
                local known, err = resolved_links(st, kind)
                if err or not known then return nil, err end
                if not known[id] then
                    return item_state.fail("invalid", attr.code .. ": unknown " .. kind .. " " .. id, { attribute = attr.code, code = "invalid_reference" }), nil
                end
            end
        elseif kind == "term" then
            local vocabulary, code = id:match("^([^:]+):(.+)$")
            if not vocabulary or not code or vocabulary ~= occurrence.vocabulary then return item_state.fail("invalid",
                attr.code .. ": term from the wrong vocabulary"), nil end
            local state, err = item_state.term_state(st, vocabulary, code)
            if err then return nil, err end
            if not state then return item_state.fail("invalid", attr.code .. ": unknown term " .. id, { attribute = attr.code, code = "invalid_reference" }), nil end
            if state == "retired" then return item_state.fail("invalid", attr.code .. ": retired term " .. id, { attribute = attr.code }), nil end
        elseif kind == "product" and id ~= holder_id then
            local target, err = item_state.load(st, id)
            if err then return nil, err end
            if not target or target.state ~= "live" then
                return item_state.fail("invalid", attr.code .. ": unknown product " .. id, { attribute = attr.code, code = "invalid_reference" }), nil
            end
        end
    end
    return nil, nil
end

-- Restoring re-admits the complete stored representation under today's schema.
function M.validate_document(st: item_state.State, p: types.Product): types.Outcome?
    local family = st.compiled.families[p.family]
    if not family or not family.levels[p.level + 1] or p.is_item ~= (p.level == family.item_level and 1 or 0) then
        return item_state.fail("invalid", "restored hierarchy differs from the current family")
    end
    for id, coords in pairs(p.document) do
        local attr = (st.compiled.by_id or {})[tonumber(id) :: integer]
        if not attr or family.owner[attr.code] ~= p.level then return item_state.fail("invalid", "restored attribute is not owned at this level") end
        for ctx, cell in pairs(coords) do
            local context: { [string]: string } = {}
            for dim, member in ctx:gmatch("([^=;]+)=([^;]+)") do context[dim] = member end
            local key, cerr = schema.ctx_key(st.compiled.dimensions, attr.scope, context)
            if cerr or key ~= ctx then return item_state.fail("invalid", "restored context is incompatible with " .. attr.code) end
            if (cell.p == nil) == (cell.c == nil) or (cell.c ~= nil and cell.c ~= 1) then
                return item_state.fail("invalid", "restored cell is malformed")
            end
            if cell.p ~= nil then
                local normalized, err = values.normalize(attr, cell.p)
                if err or not values.equal(normalized, cell.p) then return item_state.fail("invalid", "restored value is incompatible with " .. attr.code) end
                local kerr = M.index_error(attr, cell.p, false)
                if kerr then return item_state.fail("invalid", "restored index is incompatible with " .. attr.code) end
            end
        end
    end
    local _, aerr = M.axis_key(st.compiled, family, p.level, p.document)
    if aerr then return item_state.fail("invalid", aerr) end
    return nil
end

function M.axis_key(compiled: types.Compiled, family: types.Family, level: integer, document: types.Document): (string?, string?)
    local axes = family.levels[level + 1].axes
    if #axes == 0 then return nil, nil end
    local parts: { string } = {}
    for _, code in ipairs(axes) do
        local attr = compiled.attributes[code] :: types.Attribute
        local cell = (document[tostring(attr.id)] or {})[""]
        if not cell or cell.p == nil then return nil, code .. " is a variation axis and must be provided" end
        local key = values.key(attr.form, values.scalar(cell.p), attr.config) or ""
        parts[#parts + 1] = #key .. ":" .. key
    end
    return tostring(hash.sha256(table.concat(parts, "|"))), nil
end

-- write_allowed applies the aspect write rule and the source binding.
function M.write_allowed(st: item_state.State, attr: types.Attribute): string?
    if st.import then return nil end
    local aspect = st.compiled.aspects[attr.aspect]
    local source = st.source
    if #aspect.write_sources > 0 then
        local listed = false
        for _, s in ipairs(aspect.write_sources) do if source and s == source.id then listed = true end end
        if not listed then return attr.code .. " is written only by source " .. table.concat(aspect.write_sources, ", ") end
    end
    if source and not source.writes[attr.aspect] then return "source " .. source.id .. " cannot write " .. attr.aspect end
    return nil
end

-- build_patch turns set/clear/unset entries into a document patch for product p.
-- index_error answers whether a value fits every generated column that indexes
-- it: number columns need an order value at the attribute's scale and range,
-- key and set columns, unique values and axes need a key.
M.index_error = values.index_error

function M.build_patch(st: item_state.State, p: types.Product, item: types.ApplyItem): (Built?, types.Outcome?, error?)
    local compiled = st.compiled
    local family = compiled.families[p.family]
    local document: types.Document = item_state.copy_document(p.document)
    local patch: { types.PatchStep } = {}
    local touched_unique: { [string]: types.Value } = {}
    local released: { string } = {}
    local axes: { [string]: boolean } = {}
    for _, l in ipairs(family.levels) do for _, a in ipairs(l.axes) do axes[a] = true end end
    local entries: { { op: string, e: types.ValueEntry } } = {}
    for _, e in ipairs(item.set or {}) do entries[#entries + 1] = { op = "set", e = e } end
    for _, e in ipairs(item.clear or {}) do entries[#entries + 1] = { op = "clear", e = e } end
    for _, e in ipairs(item.unset or {}) do entries[#entries + 1] = { op = "unset", e = e } end
    for _, entry in ipairs(entries) do
        local e = entry.e
        local attr = compiled.attributes[e.attr]
        if not attr then return nil, item_state.fail("invalid", "unknown attribute " .. tostring(e.attr)), nil end
        local level = family.owner[attr.code]
        if level == nil then return nil, item_state.fail("invalid", attr.code .. " is not in family " .. family.code), nil end
        if level ~= p.level then
            return nil, item_state.fail("invalid", attr.code .. " is owned by level " .. level, { attribute = attr.code }), nil
        end
        local denied = M.write_allowed(st, attr)
        if denied then return nil, item_state.fail("forbidden", denied, { attribute = attr.code }), nil end
        local ctx, cerr = schema.ctx_key(compiled.dimensions, attr.scope, e.ctx)
        if cerr then return nil, item_state.fail("invalid", attr.code .. ": " .. tostring(cerr)), nil end
        local coords: types.Coordinates = document[tostring(attr.id)] or {}
        local current = coords[ctx :: string]
        local cell: types.Cell?
        if entry.op == "set" then
            local value, refused, qerr = requested(st, attr, e.value)
            if qerr then return nil, nil, qerr end
            if refused then return nil, refused, nil end
            local refail, rerr = M.check_refs(st, attr, value :: types.Value, p.product_id)
            if rerr then return nil, nil, rerr end
            if refail then return nil, refail, nil end
            local kerr = M.index_error(attr, value :: types.Value, axes[attr.code] == true)
            if kerr then return nil, item_state.fail("invalid", attr.code .. ": " .. tostring(kerr), { attribute = attr.code }), nil end
            if attr.unique then touched_unique[attr.code] = value end
            cell = { p = value }
        else
            for _, axis in ipairs(family.levels[p.level + 1].axes) do
                if axis == attr.code then return nil, item_state.fail("invalid", attr.code .. " is a variation axis and stays provided"), nil end
            end
            if entry.op == "clear" then cell = { c = 1 } end
        end
        local unchanged = (cell == nil and current == nil)
            or (cell ~= nil and current ~= nil and values.equal(cell.p, current.p) and cell.c == current.c)
        if not unchanged and attr.unique and current and current.p ~= nil then
            local old = values.key(attr.form, values.scalar(current.p :: types.Value), attr.config)
            if old then released[#released + 1] = attr.id .. "|" .. old end
        end
        if not unchanged then
            local step: types.PatchStep = { a = attr.id, c = ctx :: string }
            if current and current.p ~= nil then step.before = current.p end
            if entry.op == "set" then step.v = (cell :: types.Cell).p elseif entry.op == "clear" then step.clear = true else step.unset = true end
            if st.import and e.source then step.s = e.source end
            patch[#patch + 1] = step
            coords[ctx :: string] = cell
            document[tostring(attr.id)] = next(coords) and coords or nil
        end
    end
    local encoded = json.encode(document)
    if #encoded > consts.LIMITS.document_bytes then return nil, item_state.fail("invalid", "product document exceeds 256 KB"), nil end
    for code, value in pairs(touched_unique) do
        local attr = compiled.attributes[code] :: types.Attribute
        local key = values.key(attr.form, values.scalar(value), attr.config) or ""
        local slot = attr.id .. "|" .. key
        local held: string? = st.uniques[slot]
        if held == nil and not st.released[slot] then
            local owner, err = store.unique_owner(st.db, st.catalog_id, attr.id, key)
            if err then return nil, nil, err end
            held = owner
        end
        if held and held ~= p.product_id and not st.gone[held] then
            return nil, item_state.fail("conflict", code .. " value is already used by another product", { attribute = code, holder = held }), nil
        end
    end
    return { patch = patch, document = document, unique = touched_unique, released = released }, nil, nil
end

return M
