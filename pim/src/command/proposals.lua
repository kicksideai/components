-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Proposals (spec 11): stored commands awaiting a decision. Proposing needs
-- catalog READ; the proposal is PIM-owned state, outside the catalog log. Accepting
-- runs the items through the single write path, expecting the versions the
-- proposal was based on, with the proposal as provenance.
local failure = require("failure")
local store = require("store")
local types = require("types")


local M = {}


local invalid = failure.invalid

-- base checks the proposal against the catalog and returns the version of
-- every product it edits.
function M.base(db: types.Executor, catalog: types.Catalog, request: types.ProposeRequest): ({ [string]: integer }?, error?)
    local compiled = catalog.compiled
    local base: { [string]: integer } = {}
    for i, item in ipairs(request.items) do
        if item.create or item.delete or item.move or item.term or item.term_merge or item.restore or item.upsert then return nil,
            invalid("item " .. i .. ": proposals set, clear or unset values") end
        for _, list in ipairs({ item.set or {}, item.clear or {}, item.unset or {} }) do
            for _, e in ipairs(list) do
                local attr = compiled.attributes[e.attr]
                if not attr then return nil, invalid("item " .. i .. ": unknown attribute " .. tostring(e.attr)) end
                if #compiled.aspects[attr.aspect].write_sources > 0 then
                    return nil, invalid("item " .. i .. ": " .. attr.code .. " is written only by its sources")
                end
            end
        end
        local ref = item.product or {}
        local p: types.Product?
        local err: error?
        if type(ref.id) == "string" then p, err = store.product(db, catalog.catalog_id, ref.id)
        elseif type(ref.sku) == "string" then p, err = store.product_by_sku(db, catalog.catalog_id, ref.sku) end
        if err then return nil, err end
        if not p or p.state ~= "live" then return nil, invalid("item " .. i .. ": product not found") end
        item.product = { id = p.product_id }
        base[p.product_id] = p.version
    end
    return base, nil
end

-- apply_items turns proposal items into apply items pinned to their base versions.
local function apply_items(list: { types.ApplyItem }, base: { [string]: integer }): { types.ApplyItem }
    local items: { types.ApplyItem } = {}
    for i, item in ipairs(list) do
        local copy: types.ApplyItem = { product = item.product, set = item.set, clear = item.clear, unset = item.unset, status = item.status }
        local id = item.product and item.product.id
        copy.expect_version = id and base[id] or nil
        items[i] = copy
    end
    return items
end

-- plan_request is the apply request a proposal would make at the head it is
-- proposed against: propose plans it without appending, so values, references
-- and enforced checks are judged as the proposer, before the proposal exists.
function M.plan_request(request: types.ProposeRequest, base: { [string]: integer }): types.ApplyRequest
    return { items = apply_items(request.items, base), mode = "atomic", source = request.source }
end

-- accept_request turns a proposal into the apply request that accepts it.
function M.accept_request(proposal: types.Proposal, trace_context: types.TraceContext?): types.ApplyRequest
    local items = apply_items(proposal.items, proposal.base)
    local origin: types.Origin = { type = "proposal", id = proposal.proposal_id }
    if proposal.origin.type and proposal.origin.id then origin = { type = tostring(proposal.origin.type), id = tostring(proposal.origin.id) } end
    return { items = items, mode = "atomic", source = proposal.source, origin = origin, provenance = proposal.origin.provenance :: types.JsonObject?, approval_item_id = proposal.proposal_id,
        idempotency = { namespace = "proposal", key = proposal.proposal_id }, trace_context = trace_context }
end

return M
