-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local failure=require("failure")
-- Term edits and merges use the command's sequential state and ordinary product edits.
local consts = require("consts")
local values = require("values")
local types = require("types")
local references = require("references")
local item_state = require("item_state")
local item_patch = require("item_patch")
local merge_rows = require("merge_rows")
local clock = require("clock")
local execution_identity = require("execution_identity")
local resolve = require("resolve")
local term_line = require("term_line")
local M = {}
local EV = consts.EVENTS

-- A vocabulary can become flat once none of its stored terms has a parent.
function M.check_hierarchy_change(db: types.Executor, catalog_id: string, previous: { [string]: types.Vocabulary },
    effective: { [string]: types.Vocabulary }): error?
    for code, vocabulary in pairs(effective) do
        local before = previous[code]
        if before and before.hierarchical and not vocabulary.hierarchical then
            local rows, err = db:query([[SELECT 1 FROM kickside_pim_term
                WHERE catalog_id = $1 AND vocabulary = $2 AND parent IS NOT NULL LIMIT 1]], { catalog_id, code })
            if err then return errors.wrap(err, "vocabulary parent link check failed") end
            if rows and #rows > 0 then
                return failure.invalid("vocabulary " .. code .. " still has term parent links",
                    { code = "vocabulary_parent_links_exist", vocabulary = code })
            end
        end
    end
    return nil
end

type Edit = (item_state.State, types.ApplyItem, types.Product) -> (types.Event?, types.Outcome?, error?)
-- plan_merge retires one term and re-points the values referencing it at
-- another (spec 6): up to merge_inline products in this command, the rest
-- through the term merge job, which repeats this command as the asking actor
-- until no reference remains. A merge of a term already retired by an earlier
-- merge continues the rewrite without retiring it again.
function M.plan_merge(st: item_state.State, item: types.ApplyItem, edit: Edit): ({ types.Event }?, types.Outcome?, error?)
    local m = item.term_merge :: types.TermMerge
    local exclusive = item.set or item.clear or item.unset or item.status or item.move or item.delete or item.create or item.restore or item.term or item.product
    if exclusive then return nil, item_state.fail("invalid", "term_merge is a separate item"), nil end
    local compiled = st.compiled
    if type(m.vocabulary) ~= "string" or not compiled.vocabularies[m.vocabulary] then return nil, item_state.fail("invalid", "unknown vocabulary " .. tostring(m.vocabulary)), nil end
    if type(m.from) ~= "string" or type(m.into) ~= "string" or m.from == "" or m.into == "" then return nil, item_state.fail("invalid", "term_merge names from and into"), nil end
    if m.from == m.into then return nil, item_state.fail("invalid", "a term does not merge into itself"), nil end
    local from_row, ferr = item_state.term(st, m.vocabulary, m.from)
    if ferr then return nil, nil, ferr end
    if not from_row then return nil, item_state.fail("invalid", "unknown term " .. m.vocabulary .. ":" .. m.from), nil end
    local into_state, ierr = item_state.term_state(st, m.vocabulary, m.into)
    if ierr then return nil, nil, ierr end
    if into_state ~= "live" then return nil, item_state.fail("invalid", "unknown or retired term " .. m.vocabulary .. ":" .. m.into), nil end
    local pending,perr=merge_rows.get(st.db,st.catalog_id,m.vocabulary,m.from)
    if perr then return nil,nil,perr end
    if (pending and pending.into~=m.into) or (from_row.merged_into and from_row.merged_into~=m.into) then
        return nil,item_state.fail("conflict","outstanding term merge has another destination",{code="term_merge_conflict"}),nil
    end
    local from_key, into_key = m.vocabulary .. ":" .. m.from, m.vocabulary .. ":" .. m.into
    local rows, total, rerr = item_state.merge_references(st, from_key, not from_row.retired)
    if rerr or not rows or total == nil then return nil, nil, rerr end
    if total > consts.LIMITS.merge_holders then
        return nil, item_state.fail("invalid", "term merge exceeds the 20000-holder validation budget", { code = "term_merge_limit" }), nil
    end
    local by_id = compiled.by_id or {}
    -- Every referencing attribute must be writable by this command's source,
    -- and no referencing product may vary on it: rewriting an axis value would
    -- move the product to another sibling slot.
    local checked: { [integer]: boolean } = {}
    for _, r in ipairs(rows) do
        local attr = by_id[r.attribute_id]
        if not attr then return nil, nil, failure.corrupt("reference row names no attribute") end
        if not checked[r.attribute_id] then
            checked[r.attribute_id] = true
            local denied = item_patch.write_allowed(st, attr)
            if denied then return nil, item_state.fail("forbidden", "merge rewrites " .. attr.code .. ": " .. denied, { attribute = attr.code }), nil end
        end
        local holder, herr = item_state.load(st, r.product_id)
        if herr then return nil, nil, herr end
        local family = holder and compiled.families[holder.family]
        if holder and family then
            for _, axis in ipairs(family.levels[holder.level + 1].axes) do
                if axis == attr.code then
                    return nil, item_state.fail("invalid", "merge would rewrite variation axis " .. attr.code .. " of " .. holder.sku, { attribute = attr.code }), nil
                end
            end
        end
    end
    local events: { types.Event } = {}
    if not from_row.retired then
        local body: types.TermBody = { vocabulary = m.vocabulary, code = m.from, labels = from_row.labels, parent = from_row.parent, retired = true, merged_into = m.into }
        events[#events + 1] = { type = EV.TERM_CHANGED, subject = "t:" .. from_key, body = body }
        st.terms[from_key] = { merged_into=m.into, labels = from_row.labels, parent = from_row.parent, retired = true }
    end
    local order: { string } = {}
    local per_product: { [string]: { types.TermRefRow } } = {}
    for _, r in ipairs(rows) do
        if not per_product[r.product_id] then
            per_product[r.product_id] = {}
            order[#order + 1] = r.product_id
        end
        table.insert(per_product[r.product_id], r)
    end
    local rewritten = 0
    local planning = st
    local inline = consts.LIMITS.merge_inline
    for index, id in ipairs(order) do
        -- Deferred holders validate against the accepted prefix and each other.
        -- Only the inline edits join the enclosing command's state and events.
        if index == inline + 1 then planning = item_state.fork(st) end
        local p, lerr = item_state.load(planning, id)
        if lerr then return nil, nil, lerr end
        if p and p.state == "live" then
            local edits: { types.ValueEntry } = {}
            local done: { [string]: boolean } = {}
            for _, r in ipairs(per_product[id]) do
                local slot = r.attribute_id .. "|" .. r.ctx
                local attr = by_id[r.attribute_id] :: types.Attribute
                local coords = p.document[tostring(attr.id)]
                local cell = coords and coords[r.ctx]
                if not done[slot] and cell and cell.p ~= nil then
                    done[slot] = true
                    local before = cell.p :: types.Value
                    local mapped = references.map(attr, before, function(ref: types.Ref, _path: string, _vocabulary: string?): types.Ref
                        if ref.ref[1] == "term" and ref.ref[2] == from_key then return { ref = { "term", into_key } } end
                        return ref
                    end)
                    local after, nerr = values.normalize(attr, mapped)
                    if nerr or not after then return nil, nil, nerr end
                    if not values.equal(before, after) then
                        edits[#edits + 1] = { attr = attr.code, ctx = resolve.parse_ctx(r.ctx), value = after }
                    end
                end
            end
            if #edits > 0 then
                local event, outcome, eerr = edit(planning, { product = { id = id }, expect_version = p.version, set = edits, seq = item.seq }, p)
                if eerr then return nil, nil, eerr end
                if not outcome or (outcome.outcome ~= "updated" and outcome.outcome ~= "unchanged") then return nil, outcome, nil end
                if event and index <= inline then
                    events[#events + 1] = event
                    rewritten = rewritten + 1
                end
            end
        end
    end
    local deferred = math.max(total - math.min(#order, inline), 0)
    if deferred > 0 then
        local identity, cerr = execution_identity.capture()
        if cerr or not identity then return nil, nil, cerr :: error? end
        local intent: types.Merge = { catalog_id = st.catalog_id, vocabulary = m.vocabulary, from = m.from, into = m.into,
            identity = identity :: types.JsonObject, source = st.source and st.source.id or nil, requested_by = st.actor, created_at = clock.now() }
        local retirement = events[1]
        if not retirement or retirement.type ~= EV.TERM_CHANGED then
            retirement = { type = EV.TERM_CHANGED, subject = "t:" .. from_key, body = { vocabulary = m.vocabulary, code = m.from, labels = from_row.labels, parent = from_row.parent, retired = true, merged_into = m.into } }
            table.insert(events, 1, retirement)
        end
        (retirement.body :: types.TermBody).merge = intent
    end
    return events, { outcome = "updated", term = from_key, rewritten = rewritten, deferred = deferred }, nil
end

function M.plan_term(st: item_state.State, item: types.ApplyItem): (types.Event?, types.Outcome?, error?)
    local t = item.term :: types.TermRef
    local vocab = st.compiled.vocabularies[t.vocabulary]
    if not vocab then return nil, item_state.fail("invalid", "unknown vocabulary " .. tostring(t.vocabulary)), nil end
    if type(t.code) ~= "string" or not t.code:match("^[A-Za-z0-9][A-Za-z0-9_.-]*$") or #t.code > 128 then
        return nil, item_state.fail("invalid", "invalid term code"), nil
    end
    if item.labels ~= nil then
        if type(item.labels) ~= "table" then return nil, item_state.fail("invalid", "labels must map locales to text"), nil end
        for locale, label in pairs(item.labels) do
            if type(locale) ~= "string" or type(label) ~= "string" then return nil, item_state.fail("invalid", "labels must map locales to text"), nil end
        end
    end
    local key = t.vocabulary .. ":" .. t.code
    if item.parent ~= nil then
        if not vocab.hierarchical then return nil, item_state.fail("invalid", "vocabulary is not hierarchical"), nil end
        local parent_state, err = item_state.term_state(st, t.vocabulary, item.parent)
        if err then return nil, nil, err end
        if parent_state ~= "live" then return nil, item_state.fail("invalid", "unknown parent term"), nil end
        local at: string? = item.parent
        local steps = 0
        while at do
            if at == t.code then return nil, item_state.fail("invalid", "term parents cannot form a cycle"), nil end
            local row, perr = item_state.term(st, t.vocabulary, at)
            if perr then return nil, nil, perr end
            at = row and row.parent or nil
            steps = steps + 1
            if steps > consts.LIMITS.term_depth then return nil, item_state.fail("invalid", "term hierarchy is too deep"), nil end
        end
    end
    local current, err = item_state.term(st, t.vocabulary, t.code)
    if err then return nil, nil, err end
    if item.retired == true and not (current and current.retired == true) then
        local n, qerr = item_state.count_refs(st, "term", key)
        if qerr then return nil, nil, qerr end
        if (n :: integer) > 0 then return nil, item_state.fail("invalid", "term is referenced by " .. n .. " values"), nil end
        local children, cerr = item_state.count_child_terms(st, t.vocabulary, t.code)
        if cerr then return nil, nil, cerr :: error? end
        if (children :: integer) > 0 then return nil, item_state.fail("invalid", "term has " .. children .. " active children"), nil end
    end
    -- An omitted retired flag keeps the term's current state.
    local retired = current ~= nil and current.retired == true
    if item.retired ~= nil then retired = item.retired == true end
    local next_term: item_state.PendingTerm = { merged_into = current and current.merged_into, labels = item.labels or (current and current.labels) or {}, parent = item.parent or (current and current.parent),
        retired = retired }
    if current and values.equal(current.labels, next_term.labels) and current.parent == next_term.parent
        and (current.retired == true) == next_term.retired then
        return nil, { outcome = "unchanged", term = key }, nil
    end
    local portable, perr = term_line.encode({ vocabulary = t.vocabulary, code = t.code,
        labels = next_term.labels, parent = next_term.parent, retired = retired })
    if perr or not portable then
        return nil, item_state.fail("invalid", tostring(perr)), nil
    end
    st.terms[key] = next_term
    return { type = EV.TERM_CHANGED, subject = "t:" .. key,
        body = { vocabulary = t.vocabulary, code = t.code, labels = next_term.labels, parent = next_term.parent, retired = next_term.retired } },
        { outcome = current and "updated" or "created", term = key }, nil
end

return M
