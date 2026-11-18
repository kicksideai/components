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

local function define()
    test.describe("proposals", function()
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

        test.it("fails a proposal that lost its source's write permission after submission", function()
            local h = fixture.catalog()
            fixture.boot(h)
            local p = assert(propose(h, {
                { product = { sku = "RDG" }, set = { { attr = "core.care", value = "Pending" } } },
            }, "erp"))
            assert(h.call("apply_schema", { declaration = { sources = { { id = "erp", writes = { "logistics" } } } } }))
            local d = assert(decide(h, p.proposal_id, "accept"))
            test.eq(d.status, "failed")
            test.eq((d.result :: types.ApplyResult).outcomes[1].outcome, "forbidden")
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

        test.it("settles a proposal when its source was removed before decision", function()
            local h = fixture.catalog()
            test.eq(steps.one(h, { product = { sku = "REVIEW" }, create = {} }).outcome, "created")
            local proposal = assert(h.call("propose", { source = "erp", items = {
                { product = { sku = "REVIEW" }, set = { { attr = "core.care", value = "Pending" } } },
            } })) :: types.ProposeResult
            assert(h.call("apply_schema", { declaration = { remove = { sources = { "erp" } } } }))
            local _, err = h.call("decide", { proposal_id = proposal.proposal_id, decision = "accept" })
            local listed = assert(h.call("list_proposals", {})) :: types.ProposalsResult
            test.eq(listed.proposals[1].status, "failed", tostring(err))
            test.eq(assert(err):details().code, "unknown_source")
            test.eq(assert(decide(h, proposal.proposal_id, "accept")).status, "failed")
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
                test.eq(assert(err):details().code, "source_access_denied")
                test.eq(version(h, "RDG"), prior_version)
                local listed = assert(h.call("list_proposals", {})) :: types.ProposalsResult
                local stored = listed.proposals[1]
                test.eq(stored.status, scenario.status)
                test.eq(stored.decided_by, prior.decided_by)
                test.eq(stored.decided_at, prior.decided_at)
                test.eq(assert(decide(h, p.proposal_id, "reject")).status, "rejected")
            end)
        end

        test.it("leaves another reviewer's acceptance claim intact after source access is denied", function()
            local h = fixture.catalog()
            fixture.boot(h)
            local reviewer, reviewer_id = fixture.user(h)
            assert(h.call("grant", { subject_id = reviewer_id, mask = 3 }))
            assert(h.call("apply_schema", { declaration = { sources = {
                { id = "erp", writes = { "core", "logistics" }, principals = { h.actor:id() } },
            } } }))
            local p = assert(propose(h, {
                { product = { sku = "RDG" }, set = { { attr = "core.care", value = "Claimed" } } },
            }, "erp"))
            local db = assert(store.open())
            assert(db:execute([[UPDATE kickside_pim_proposal SET status = 'accepting', decided_by = $1, decided_at = $2
                WHERE catalog_id = $3 AND proposal_id = $4]], { h.actor:id(), "2026-11-17T12:00:00Z", h.id, p.proposal_id }))
            db:release()

            local out, err = reviewer("decide", { proposal_id = p.proposal_id, decision = "accept" })
            test.is_nil(out)
            test.eq(assert(err):details().code, "source_access_denied")
            local listed = assert(h.call("list_proposals", {})) :: types.ProposalsResult
            test.eq(listed.proposals[1].status, "accepting")
            test.eq(listed.proposals[1].decided_by, h.actor:id())
            test.eq(assert(decide(h, p.proposal_id, "accept")).status, "accepted")
        end)

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

        test.it("finishes an accept left in accepting and refuses to reject it", function()
            local h = fixture.catalog()
            fixture.boot(h)
            local p = assert(propose(h, { { product = { sku = "RDG" }, set = { { attr = "core.care", value = "Resumed" } } } }))
            local db = assert(store.open())
            assert(db:execute("UPDATE kickside_pim_proposal SET status = 'accepting' WHERE catalog_id = $1 AND proposal_id = $2", { h.id, p.proposal_id }))
            db:release()
            local _, rerr = decide(h, p.proposal_id, "reject")
            test.not_nil(rerr)
            test.eq(assert(decide(h, p.proposal_id, "accept")).status, "accepted")
            test.eq(h.call("get", { product = { sku = "RDG" } }).values["core.care"].value, "Resumed")
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
