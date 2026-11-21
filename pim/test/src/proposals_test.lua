-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Proposals (spec 11): propose stores value edits with their base versions;
-- decide accepts through the write path (accepted, conflict or failed) or
-- rejects, and one decision stands per proposal.
local test = require("test")
local steps = require("steps")
local fixture = require("fixture")
local json = require("json")
local store = require("store")
local types = require("types")
local requests = require("requests")
local catalog_fixture = require("catalog_fixture")

type Map = { [string]: unknown }

local version = steps.version

local function propose(h: fixture.Handle, items: { Map }, source: string?): (types.ProposeResult?, error?)
    local out, err = h.call("propose", { items = items, source = source })
    return out :: types.ProposeResult?, err
end

local function decide(h: fixture.Handle, id: string, decision: string): (types.DecideResult?, error?)
    local out, err = h.call("decide", { proposal_id = id, decision = decision })
    return out :: types.DecideResult?, err
end

local function stock_changed(h: fixture.Handle, product_id: string): integer
    local before = catalog_fixture.catalog(h).applied_seq
    local event, err = h.call("inventory_stock_changed", { product_id = product_id })
    assert(event, tostring(err))
    local settled = assert(h.call("settle", {}))
    test.eq(settled.last_seq, before + 1)
    test.eq(settled.last_seq, event.max_seq)
    test.eq(catalog_fixture.catalog(h).applied_seq, before)
    return event.max_seq
end

local function define()
    test.describe("proposals", function()
        test.it("returns the original proposal after an interrupted submission acknowledgement", function()
            local h = fixture.catalog()
            fixture.boot(h)
            local product = assert(steps.get(h, "RDG")).product
            local request = { idempotency = { namespace = "agent", key = "review" },
                expected_generation = assert(h.call("get_schema", {})).generation,
                items = { { product = { sku = "RDG" }, expect_version = product.version,
                    set = { { attr = "core.care", value = "Agent edit" } } } } }
            local out, err = h.call("interrupt_submission", { request = request })
            test.is_nil(out)
            test.eq(assert(err):kind(), errors.UNAVAILABLE)
            assert(h.call("settle", {}))
            local pending = assert(h.call("list_proposals", { status = "pending" })).proposals
            test.eq(#pending, 1)
            assert(h.call("apply", { items = { { product = { sku = "RDG" }, expect_version = product.version, status = "draft" } } }))
            assert(h.call("apply_schema", { declaration = { vocabularies = { { code = "review_terms" } } } }))
            local retry = assert(h.call("propose", request))
            test.eq(retry.proposal_id, pending[1].proposal_id)
            test.eq(retry.status, "pending")
            test.eq(#assert(h.call("list_proposals", {})).proposals, 1)
            assert(decide(h, retry.proposal_id, "reject"))
            test.eq(assert(h.call("propose", request)).status, "pending")
            test.eq(assert(h.call("list_proposals", {})).proposals[1].status, "rejected")
            request.items[1].set[1].value = "A new edit"
            local replacement, conflict = h.call("propose", request)
            test.is_nil(replacement)
            test.eq(assert(conflict):kind(), errors.CONFLICT)
            test.eq(assert(conflict):details().code, "idempotency_conflict")
        end)

        test.it("bounds free-form command metadata and schema configuration at admission", function()
            local blob = string.rep("x", 4194305)
            local cases: { { method: string, request: Map } } = {
                { method = "apply", request = { items = { {} }, origin = { type = "source", id = blob } } },
                { method = "apply", request = { items = { {} }, source = blob } },
                { method = "apply", request = { items = { {} }, provenance = { blob = blob } } },
                { method = "release", request = { items = { { product = { sku = "RDG" }, channels = { blob } } } } },
                { method = "plan_schema", request = { declaration = { plugins = { { use = "app:plugin" } } } , plugin_configs = { ["app:plugin"] = { blob = blob } } } },
            }
            for _, case in ipairs(cases) do
                local err = requests.parse(case.method, case.request)
                test.not_nil(err)
                if err then
                    test.eq(err:kind(), errors.INVALID)
                    test.eq(err:details().code, "request_budget_exceeded")
                end
            end
        end)

        for _, budget in ipairs({ "bytes", "depth", "collection" }) do
            test.it("refuses proposal " .. budget .. " excess before storing anything", function()
                local h = fixture.catalog()
                fixture.boot(h)
                local provenance: Map = {}
                if budget == "bytes" then provenance.blob = string.rep("x", 4194305)
                elseif budget == "depth" then
                    local node = provenance
                    for _ = 1, 17 do local child: Map = {}; node.child = child; node = child end
                else
                    for i = 1, 4097 do provenance[tostring(i)] = true end
                end
                local out, err = h.call("propose", { provenance = provenance,
                    items = { { product = { sku = "RDG" }, set = { { attr = "core.care", value = "bounded" } } } } })
                test.is_nil(out)
                test.not_nil(err)
                if err then
                    test.eq(err:kind(), errors.INVALID)
                    test.eq(err:details().code, "request_budget_exceeded")
                end
                test.eq(#assert(h.call("list_proposals", {})).proposals, 0)
            end)
        end

        test.it("keeps the pending count in public meta current", function()
            local h = fixture.catalog()
            fixture.boot(h)
            local function pending(): unknown
                local db = assert(store.open())
                local rows = assert(db:query("SELECT value FROM kickside_component_meta WHERE component_id = $1 AND key = $2", { h.id, "pending_proposal_count" }))
                db:release()
                return rows[1] and tonumber(json.decode(tostring(rows[1].value)))
            end
            local proposed = assert(h.call("propose", { items = { { product = { sku = "RDG" }, set = { { attr = "core.care", value = "p" } } } } }))
            test.eq(pending(), 1)
            assert(h.call("decide", { proposal_id = proposed.proposal_id, decision = "reject" }))
            test.eq(pending(), 0)
        end)

        test.it("accepts through the write path with the proposal as provenance", function()
            local h = fixture.catalog()
            fixture.boot(h)
            local p, err = h.call("propose", { source = "erp", origin = { type = "agent", id = "enricher" }, provenance = { model = "test-model", confidence = 0.97 },
                items = { { product = { sku = "RDG" }, set = { { attr = "core.name", ctx = { locale = "de" }, value = "Ridgeline Bergstiefel" } } } } })
            test.is_nil(err)
            test.eq(p.status, "pending")
            test.eq(#h.call("list_proposals", { status = "pending" }).proposals, 1)
            local d = h.call("decide", { proposal_id = p.proposal_id, decision = "accept" })
            test.eq(d.status, "accepted")
            local root = h.call("get", { product = { sku = "RDG" }, context = { locale = "de" } })
            test.eq(root.values["core.name"].value, "Ridgeline Bergstiefel")
            test.eq(root.values["core.name"].source, "erp")
            local origin = h.call("list_history", { product = { sku = "RDG" }, limit = 1 }).entries[1].origin
            test.eq(origin.approval_item_id, p.proposal_id)
            test.eq(origin.origin.id, "enricher")
            test.eq(origin.provenance.model, "test-model")
            test.eq(origin.provenance.confidence, 0.97)
            local again = h.call("decide", { proposal_id = p.proposal_id, decision = "accept" })
            test.eq(again.status, "accepted")
        end)

        test.it("accepts after an Inventory-only append", function()
            local h = fixture.catalog()
            fixture.boot(h)
            local original = assert(h.call("get", { product = { sku = "RDG" } })) :: types.GetResult
            local proposed = assert(propose(h, { { product = { sku = "RDG" },
                set = { { attr = "core.care", value = "approved" } } } }))
            stock_changed(h, original.product.product_id)
            local accepted, err = decide(h, proposed.proposal_id, "accept")
            assert(accepted, tostring(err))
            test.eq(accepted.status, "accepted")
            local after = assert(h.call("get", { product = { sku = "RDG" } })) :: types.GetResult
            test.eq(after.values["core.care"].value, "approved")
        end)

        test.it("commits and replays a keyed edit after an Inventory-only append", function()
            local h = fixture.catalog()
            fixture.boot(h)
            local before = assert(h.call("get", { product = { sku = "RDG" } })) :: types.GetResult
            local thread_seq = stock_changed(h, before.product.product_id)

            local request = { idempotency = { namespace = "test", key = "after-stock" },
                items = { { product = { sku = "RDG" }, expect_version = before.product.version,
                    set = { { attr = "core.care", value = "edited" } } } } }
            local applied, apply_err = h.call("apply", request)
            assert(applied, tostring(apply_err))
            test.eq(applied.seq, thread_seq + 1)
            local replayed = assert(h.call("apply", request))
            test.eq(replayed.seq, applied.seq)
            test.is_true(replayed.replayed)
        end)

        test.it("records and replays a keyed no-op after an Inventory-only append", function()
            local h = fixture.catalog()
            fixture.boot(h)
            local before = assert(h.call("get", { product = { sku = "RDG" } })) :: types.GetResult
            local thread_seq = stock_changed(h, before.product.product_id)
            local request = { idempotency = { namespace = "test", key = "after-stock-noop" },
                items = { { product = { sku = "RDG" }, expect_version = before.product.version } } }
            local out, err = h.call("apply", request)
            assert(out, tostring(err))
            test.eq(out.outcomes[1].outcome, "unchanged")
            test.is_nil(out.seq)
            test.eq(out.as_of, thread_seq)
            local replayed = assert(h.call("apply", request))
            test.is_nil(replayed.seq)
            test.eq(replayed.as_of, thread_seq)
            test.is_true(replayed.replayed)
        end)

        test.it("refuses acceptance after a proposed attribute code is reused", function()
            local h = fixture.catalog()
            local function change(attributes: { Map }): Map
                return assert(h.call("apply_schema", { declaration = {
                    aspects = { { namespace = "core", attributes = attributes } },
                } })) :: Map
            end
            local function get(): types.GetResult
                return assert(h.call("get", { product = { sku = "REVIEW" } })) :: types.GetResult
            end
            local original = change({ { code = "review_note", type = "kickside.pim.types:text" } })
            test.eq(steps.one(h, { product = { sku = "REVIEW" }, create = {},
                set = { { attr = "core.review_note", value = "original" } } }).outcome, "created")
            local before = get()
            local old_schema = assert(h.call("get_schema", {})) :: types.SchemaView
            local attr_id = old_schema.attributes["core.review_note"].id
            local proposed = assert(propose(h, { { product = { sku = "REVIEW" },
                set = { { attr = "core.review_note", value = "approved" } } } }))
            local pending = assert(h.call("list_proposals", { status = "pending" })) :: types.ProposalsResult
            test.eq(pending.proposals[1].generation, original.generation)

            change({ { id = attr_id, code = "renamed_note", type = "kickside.pim.types:text" } })
            local current = change({ { code = "review_note", type = "kickside.pim.types:text" } })
            test.eq(get().product.version, before.product.version)

            local accepted, err = decide(h, proposed.proposal_id, "accept")
            test.is_nil(accepted)
            local conflict = assert(err)
            test.eq(conflict:kind(), errors.CONFLICT)
            test.eq(conflict:details().code, "schema_generation_conflict")
            test.eq(conflict:details().expected_generation, original.generation)
            test.eq(conflict:details().generation, current.generation)
            local after = get()
            test.eq(after.product.version, before.product.version)
            test.eq(after.values["core.review_note"].state, "absent")
            test.eq(after.values["core.renamed_note"].value, "original")
            test.eq(assert(decide(h, proposed.proposal_id, "reject")).status, "rejected")
        end)

        test.it("leaves a proposal in conflict when the product moved on, and rejects", function()
            local h = fixture.catalog()
            fixture.boot(h)
            local p = h.call("propose", { items = { { product = { sku = "RDG" }, set = { { attr = "core.name", ctx = { locale = "en" }, value = "A" } } } } })
            h.call("apply", { items = { { product = { sku = "RDG" }, expect_version = version(h, "RDG"),
                set = { { attr = "core.name", ctx = { locale = "en" }, value = "B" } } } } })
            local d = h.call("decide", { proposal_id = p.proposal_id, decision = "accept" })
            test.eq(d.status, "conflict")
            test.eq(h.call("get", { product = { sku = "RDG" }, context = { locale = "en" } }).values["core.name"].value, "B")
            local r = h.call("propose", { items = { { product = { sku = "RDG" }, set = { { attr = "core.name", ctx = { locale = "en" }, value = "C" } } } } })
            test.eq(h.call("decide", { proposal_id = r.proposal_id, decision = "reject" }).status, "rejected")
            local _, serr = h.call("propose", { items = { { product = { sku = "RDG" }, set = { { attr = "pricing.retail", value = "1.00" } } } } })
            test.not_nil(serr)
        end)

        test.it("settles failed when the accepted items are invalid at the head, and stays decided", function()
            local h = fixture.catalog()
            fixture.boot(h)
            local p = h.call("propose", { items = { { product = { sku = "RDG-moss-42" }, set = { { attr = "core.gtin", value = "G42" } } } } })
            h.call("apply", { items = { { product = { sku = "RDG-moss-42" }, expect_version = version(h, "RDG-moss-42"), delete = true } } })
            local d = h.call("decide", { proposal_id = p.proposal_id, decision = "accept" })
            test.eq(d.status, "failed")
            test.eq(d.result.outcomes[1].outcome, "invalid")
            local again = h.call("decide", { proposal_id = p.proposal_id, decision = "accept" })
            test.eq(again.status, "failed")
            local _, rerr = h.call("decide", { proposal_id = p.proposal_id, decision = "reject" })
            test.not_nil(rerr)
        end)
    end)


    test.describe("proposal edges", function()
        test.it("proposes only value and status edits", function()
            local h = fixture.catalog()
            fixture.boot(h)
            local id = h.call("get", { product = { sku = "RDG-moss-40" } }).product.product_id
            for _, item in ipairs({
                { product = { sku = "NEW" }, create = { family = "generic" } },
                { term = { vocabulary = "colors", code = "teal" }, labels = { en = "Teal" } },
                { product = { sku = "RDG-moss-40" }, delete = true },
                { product = { sku = "RDG-moss-40" }, move = { parent = { sku = "RDG-slate" } } },
                { product = { id = id }, restore = true, set = { { attr = "core.gtin", value = "R" } } },
            } :: { Map }) do
                local out, err = propose(h, { item })
                test.is_nil(out)
                test.not_nil(err)
            end
        end)

        test.it("refuses unknown attributes, products and sources", function()
            local h = fixture.catalog()
            fixture.boot(h)
            local trashed = h.call("get", { product = { sku = "RDG-moss-41" } }).product.product_id
            h.call("apply", { items = { { product = { id = trashed }, expect_version = "any", delete = true } } })
            local cases: { { items: { Map }, source: string? } } = {
                { items = { { product = { sku = "RDG" }, set = { { attr = "core.nope", value = 1 } } } } },
                { items = { { product = { sku = "NOPE" }, set = { { attr = "core.care", value = "x" } } } } },
                { items = { { product = { id = trashed }, set = { { attr = "core.gtin", value = "x" } } } } },
                { items = { { product = { sku = "RDG" }, set = { { attr = "core.care", value = "x" } } } }, source = "nope" },
            }
            for _, c in ipairs(cases) do
                local _, err = propose(h, c.items, c.source)
                test.not_nil(err)
            end
        end)

        test.it("stores the product id and base version of an item named by sku", function()
            local h = fixture.catalog()
            fixture.boot(h)
            local p = assert(propose(h, { { product = { sku = "RDG-moss-40" }, set = { { attr = "core.gtin", value = "P1" } } } }))
            local listed = h.call("list_proposals", { status = "pending" }) :: types.ProposalsResult
            local mine: types.Proposal? = nil
            for _, row in ipairs(listed.proposals) do if row.proposal_id == p.proposal_id then mine = row end end
            local stored = assert(mine)
            local id = h.call("get", { product = { sku = "RDG-moss-40" } }).product.product_id
            test.eq((stored.items[1].product :: types.ProductRef).id, id)
            test.eq(stored.base[id], version(h, "RDG-moss-40"))
        end)

        test.it("accepts a status-only proposal", function()
            local h = fixture.catalog()
            fixture.boot(h)
            local p = assert(propose(h, { { product = { sku = "RDG-moss-40" }, status = "draft" } }))
            test.eq(assert(decide(h, p.proposal_id, "accept")).status, "accepted")
            test.eq(h.call("get", { product = { sku = "RDG-moss-40" } }).product.status, "draft")
        end)

        test.it("accepts a sequence source proposal at its base version without advancing the source sequence", function()
            local h = fixture.catalog()
            fixture.boot(h)
            assert(h.call("apply_schema", { declaration = { sources = {
                { id = "erp", writes = { "core", "logistics" }, ordering = "sequence" },
            } } }))
            local function ordered_edit(seq: integer, value: string): types.Outcome
                local out = assert(h.call("apply", { source = "erp", items = {
                    { product = { sku = "RDG" }, seq = seq, set = { { attr = "core.care", value = value } } },
                } })) :: types.ApplyResult
                return out.outcomes[1]
            end
            test.eq(ordered_edit(10, "Imported").outcome, "updated")
            local function suggest(value: string): types.ProposeResult
                return assert(propose(h, {
                    { product = { sku = "RDG" }, set = { { attr = "core.care", value = value } } },
                }, "erp"))
            end
            local current = suggest("Reviewed")
            local stale = suggest("Stale")
            test.eq(assert(decide(h, current.proposal_id, "accept")).status, "accepted")
            test.eq(assert(decide(h, stale.proposal_id, "accept")).status, "conflict")
            test.eq(ordered_edit(10, "Repeated").outcome, "unchanged")
            test.eq(h.call("get", { product = { sku = "RDG" } }).values["core.care"].value, "Reviewed")
            test.eq(ordered_edit(11, "New delivery").outcome, "updated")
        end)

        test.it("requires renewed review after the proposal source's write rules change", function()
            local h = fixture.catalog()
            fixture.boot(h)
            local p = assert(propose(h, {
                { product = { sku = "RDG" }, set = { { attr = "core.care", value = "Pending" } } },
            }, "erp"))
            assert(h.call("apply_schema", { declaration = { sources = { { id = "erp", writes = { "logistics" } } } } }))
            local out, err = decide(h, p.proposal_id, "accept")
            test.is_nil(out)
            test.eq(assert(err):details().code, "schema_generation_conflict")
            test.eq(assert(decide(h, p.proposal_id, "reject")).status, "rejected")
        end)

        test.it("refuses a proposal for an aspect outside its declared source writes", function()
            local h = fixture.catalog()
            fixture.boot(h)
            local proposal, err = h.call("propose", { source = "erp", items = {
                { product = { sku = "RDG" }, set = {
                    { attr = "marketing.tagline", ctx = { channel = "web", locale = "en" }, value = "Campaign" },
                } },
            } })
            test.is_nil(proposal, json.encode(proposal))
            test.eq(assert(err):kind(), errors.INVALID)
            test.eq(#assert(h.call("list_proposals", {})).proposals, 0)
        end)

        test.it("requires renewed review after the proposal source is removed", function()
            local h = fixture.catalog()
            test.eq(steps.one(h, { product = { sku = "REVIEW" }, create = {} }).outcome, "created")
            local proposal = assert(h.call("propose", { source = "erp", items = {
                { product = { sku = "REVIEW" }, set = { { attr = "core.care", value = "Pending" } } },
            } })) :: types.ProposeResult
            assert(h.call("apply_schema", { declaration = { remove = { sources = { "erp" } } } }))
            local out, err = decide(h, proposal.proposal_id, "accept")
            test.is_nil(out)
            local listed = assert(h.call("list_proposals", {})) :: types.ProposalsResult
            test.eq(listed.proposals[1].status, "pending", tostring(err))
            test.eq(assert(err):details().code, "schema_generation_conflict")
            test.eq(assert(decide(h, proposal.proposal_id, "reject")).status, "rejected")
        end)

        test.it("leaves a proposal pending after a reviewer is denied source access", function()
            local h = fixture.catalog()
            fixture.boot(h)
            local reviewer, reviewer_id = fixture.user(h)
            assert(h.call("grant", { subject_id = reviewer_id, mask = 3 }))
            assert(h.call("apply_schema", { declaration = { sources = {
                { id = "erp", writes = { "core", "logistics" }, principals = { h.actor:id() } },
            } } }))
            local p = assert(propose(h, {
                { product = { sku = "RDG" }, set = { { attr = "core.care", value = "Review copy" } } },
            }, "erp"))
            local prior_version = version(h, "RDG")

            local out, err = reviewer("decide", { proposal_id = p.proposal_id, decision = "accept" })
            test.is_nil(out)
            local denied = assert(err)
            test.eq(denied:kind(), errors.PERMISSION_DENIED)
            test.eq(denied:details().code, "source_access_denied")
            test.eq(version(h, "RDG"), prior_version)
            local listed = assert(h.call("list_proposals", {})) :: types.ProposalsResult
            test.eq(#listed.proposals, 1)
            local stored = listed.proposals[1]
            local rejected, reject_err = decide(h, p.proposal_id, "reject")
            test.eq(stored.status, "pending", json.encode({
                denied_reviewer_recorded = stored.decided_by == reviewer_id,
                rejection_error = reject_err and reject_err:details().code,
            }))
            test.is_nil(stored.decided_by)
            test.is_nil(reject_err)
            test.eq(assert(rejected).status, "rejected")
        end)

        for _, scenario in ipairs({
            { timing = "before catch-up", status = "pending" },
            { timing = "before append", status = "pending" },
            { timing = "during conflict review", status = "conflict" },
        }) do
            test.it("keeps a proposal rejectable when source permission is revoked " .. scenario.timing, function()
                local h = fixture.catalog()
                fixture.boot(h)
                local p = assert(propose(h, {
                    { product = { sku = "RDG" }, set = { { attr = "core.care", value = "Review copy" } } },
                }, "erp"))
                if scenario.status == "conflict" then
                    assert(h.call("apply", { items = {
                        { product = { sku = "RDG" }, expect_version = version(h, "RDG"), set = { { attr = "core.care", value = "New version" } } },
                    } }))
                    test.eq(assert(decide(h, p.proposal_id, "accept")).status, "conflict")
                end
                local prior_version = version(h, "RDG")
                local prior = (assert(h.call("list_proposals", {})) :: types.ProposalsResult).proposals[1]

                local out, err = h.call("decide_with_source_revocation", {
                    request = { proposal_id = p.proposal_id, decision = "accept" },
                    declaration = { sources = { { id = "erp", writes = { "core", "logistics" }, principals = { "another-reviewer" } } } },
                    timing = scenario.timing,
                })
                test.is_nil(out)
                test.eq(assert(err):details().code, "schema_generation_conflict")
                test.eq(version(h, "RDG"), prior_version)
                local listed = assert(h.call("list_proposals", {})) :: types.ProposalsResult
                local stored = listed.proposals[1]
                test.eq(stored.status, scenario.status)
                test.eq(stored.decided_by, prior.decided_by)
                test.eq(stored.decided_at, prior.decided_at)
                test.eq(assert(decide(h, p.proposal_id, "reject")).status, "rejected")
            end)
        end

        test.it("rejects once, rejects a conflicted proposal, and keeps a conflict decidable", function()
            local h = fixture.catalog()
            fixture.boot(h)
            local p = assert(propose(h, { { product = { sku = "RDG" }, set = { { attr = "core.care", value = "x" } } } }))
            test.eq(assert(decide(h, p.proposal_id, "reject")).status, "rejected")
            test.eq(assert(decide(h, p.proposal_id, "reject")).status, "rejected")
            test.eq(assert(decide(h, p.proposal_id, "accept")).status, "rejected")
            local q = assert(propose(h, { { product = { sku = "RDG" }, set = { { attr = "core.care", value = "y" } } } }))
            h.call("apply", { items = { { product = { sku = "RDG" }, expect_version = version(h, "RDG"), set = { { attr = "core.care", value = "z" } } } } })
            test.eq(assert(decide(h, q.proposal_id, "accept")).status, "conflict")
            test.eq(assert(decide(h, q.proposal_id, "accept")).status, "conflict")
            test.eq(assert(decide(h, q.proposal_id, "reject")).status, "rejected")
        end)

        test.it("applies nothing of a proposal with one stale item", function()
            local h = fixture.catalog()
            fixture.boot(h)
            local p = assert(propose(h, {
                { product = { sku = "RDG-moss-40" }, set = { { attr = "core.gtin", value = "S40" } } },
                { product = { sku = "RDG-moss-41" }, set = { { attr = "core.gtin", value = "S41" } } } }))
            h.call("apply", { items = { { product = { sku = "RDG-moss-41" }, expect_version = version(h, "RDG-moss-41"), status = "draft" } } })
            test.eq(assert(decide(h, p.proposal_id, "accept")).status, "conflict")
            test.eq(h.call("get", { product = { sku = "RDG-moss-40" } }).values["core.gtin"].value, "0400moss40")
        end)

        test.it("leaves a proposal pending and rejectable when acceptance cannot append", function()
            local h = fixture.catalog()
            fixture.boot(h)
            local p = assert(propose(h, { { product = { sku = "RDG" },
                set = { { attr = "core.care", value = "Interrupted" } } } }))
            local before = version(h, "RDG")
            local out, err = h.call("interrupt_decision", { phase = "append",
                request = { proposal_id = p.proposal_id, decision = "accept" } })
            test.is_nil(out)
            test.eq(assert(err):kind(), errors.UNAVAILABLE)
            test.eq(version(h, "RDG"), before)
            local stored = (assert(h.call("list_proposals", {})) :: types.ProposalsResult).proposals[1]
            test.eq(stored.status, "pending")
            test.is_nil(stored.decided_by)
            test.eq(assert(decide(h, p.proposal_id, "reject")).status, "rejected")
        end)

        test.it("recovers an acceptance when the append commits and the caller loses catch-up", function()
            local h = fixture.catalog()
            fixture.boot(h)
            local p = assert(propose(h, { { product = { sku = "RDG" },
                set = { { attr = "core.care", value = "Committed" } } } }))
            local before = version(h, "RDG")
            local out, err = h.call("interrupt_decision", { phase = "projection",
                request = { proposal_id = p.proposal_id, decision = "accept" } })
            test.is_nil(out)
            test.eq(assert(err):kind(), errors.UNAVAILABLE, tostring(err))
            local accepted = assert(decide(h, p.proposal_id, "accept"))
            test.eq(accepted.status, "accepted")
            test.eq(assert(decide(h, p.proposal_id, "accept")).result.seq, assert(accepted.result).seq)
            test.eq(version(h, "RDG"), before + 1)
            test.eq(assert(steps.get(h, "RDG")).values["core.care"].value, "Committed")
            local rejected, denied = decide(h, p.proposal_id, "reject")
            test.is_nil(rejected)
            test.eq(assert(denied):details().code, "proposal_decided")
        end)

        test.it("answers an unknown proposal and decision", function()
            local h = fixture.catalog()
            fixture.boot(h)
            local _, missing = decide(h, "00000000-0000-0000-0000-000000000000", "accept")
            test.not_nil(missing)
            local p = assert(propose(h, { { product = { sku = "RDG" }, set = { { attr = "core.care", value = "x" } } } }))
            local _, maybe = decide(h, p.proposal_id, "maybe")
            test.not_nil(maybe)
        end)

        test.it("drops a decided proposal from the pending list", function()
            local h = fixture.catalog()
            fixture.boot(h)
            local p = h.call("propose", { items = { { product = { sku = "RDG" }, set = { { attr = "core.care", value = "x" } } } } })
            test.eq(#h.call("list_proposals", { status = "pending" }).proposals, 1)
            h.call("decide", { proposal_id = p.proposal_id, decision = "reject" })
            test.eq(#h.call("list_proposals", { status = "pending" }).proposals, 0)
            test.eq(#h.call("list_proposals", { status = "rejected" }).proposals, 1)
        end)
    end)
end

return { run = test.run_cases(define) }
