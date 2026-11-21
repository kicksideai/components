-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Proposals (spec 11): stored commands awaiting a decision. Proposing needs
-- catalog READ. Accepting plans the edits with the schema generation and
-- product versions the proposal was based on, with the proposal as provenance.
local failure = require("failure")
local store = require("store")
local types = require("types")


local M = {}
local invalid = failure.invalid

type Capture = { items: { types.CapturedProposalItem }, base: { [string]: integer } }

-- capture resolves product addresses and pins their versions at the guarded head.
function M.capture(db: types.Executor, catalog: types.Catalog, request: types.ProposeRequest): (Capture?, error?)
    local compiled = catalog.compiled
    local items: { types.CapturedProposalItem } = {}
    local base: { [string]: integer } = {}
    for i, item in ipairs(request.items) do
        local ref = item.product
        local p: types.Product?
        local err: error?
        if ref.id then p, err = store.product(db, catalog.catalog_id, ref.id)
        elseif ref.sku then p, err = store.product_by_sku(db, catalog.catalog_id, ref.sku) end
        if err then return nil, err end
        if not p or p.state ~= "live" then return nil, invalid("item " .. i .. ": product not found") end
        if item.expect_version ~= nil and item.expect_version ~= p.version then
            return nil, errors.new({ kind = errors.CONFLICT, message = "product changed",
                details = { code = "version_conflict", product_id = p.product_id, index = i,
                    expect_version = item.expect_version, version = p.version } })
        end
        for _, list in ipairs({ item.set or {}, item.clear or {}, item.unset or {} }) do
            for _, e in ipairs(list) do
                local attr = compiled.attributes[e.attr]
                if not attr then return nil, invalid("item " .. i .. ": unknown attribute " .. tostring(e.attr)) end
                if #compiled.aspects[attr.aspect].write_sources > 0 then
                    return nil, invalid("item " .. i .. ": " .. attr.code .. " is written only by its sources")
                end
            end
        end
        items[i] = { product = { id = p.product_id }, status = item.status,
            set = item.set and #item.set > 0 and item.set or nil,
            clear = item.clear and #item.clear > 0 and item.clear or nil,
            unset = item.unset and #item.unset > 0 and item.unset or nil }
        base[p.product_id] = p.version
    end
    return { items = items, base = base }, nil
end

-- apply_items turns proposal items into apply items pinned to their base versions.
local function apply_items(list: { types.CapturedProposalItem }, base: { [string]: integer }): { types.ApplyItem }
    local items: { types.ApplyItem } = {}
    for i, item in ipairs(list) do
        items[i] = { product = item.product, set = item.set, clear = item.clear, unset = item.unset, status = item.status,
            expect_version = base[item.product.id] }
    end
    return items
end

-- plan_request is the apply request a proposal would make at the head it is
-- proposed against: propose plans it without appending, so values, references
-- and enforced checks are judged as the proposer, before the proposal exists.
function M.plan_request(captured: Capture, source: string?): types.ApplyRequest
    return { items = apply_items(captured.items, captured.base), mode = "atomic", source = source }
end

-- accept_request turns a proposal into the apply request that accepts it.
function M.accept_request(proposal: types.Proposal): types.ApplyRequest
    local items = apply_items(proposal.items, proposal.base)
    local origin: types.Origin = { type = "proposal", id = proposal.proposal_id }
    if proposal.origin.type and proposal.origin.id then origin = { type = tostring(proposal.origin.type), id = tostring(proposal.origin.id) } end
    return { items = items, mode = "atomic", expected_generation = proposal.generation, source = proposal.source,
        origin = origin, provenance = proposal.origin.provenance :: types.JsonObject?, approval_item_id = proposal.proposal_id }
end

return M
