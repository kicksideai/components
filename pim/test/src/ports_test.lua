-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local registry = require("registry")
local json = require("json")
local fixture = require("fixture")
local steps = require("steps")
local store = require("store")
local types = require("types")

-- every_event drives one catalog through every command kind, so its thread
-- holds each catalog event type at least once.
local function every_event(h: fixture.Handle)
    assert(h.call("apply_schema", { declaration = { plugins = { { use = "app:strict_plugin" } } },plugin_configs={["app:strict_plugin"]={endpoint="before"}} }))
    assert(h.call("configure_plugin", { plugin = "app:strict_plugin", config = { endpoint="after" } }))
    assert(h.executor:call("app:plugin_rebuild", { catalog_id = h.id, plugin = "app:strict_plugin" }))
    fixture.boot(h)
    local proposal = assert(h.call("propose", { items = { { product = { sku = "RDG" },
        set = { { attr = "core.care", value = "Proposed care" } } } } })) :: types.ProposeResult
    assert(h.call("decide", { proposal_id = proposal.proposal_id, decision = "reject" }))
    assert(h.call("apply",{idempotency={namespace="test",key="noop"},items={{product={sku="RDG"},expect_version="any",status="active"}}}))
    h.call("apply", { items = { { term = { vocabulary = "colors", code = "teal" }, labels = { en = "Teal" } } } })
    h.call("apply", { source = "pricing", origin = { type = "feed", id = "feed" }, items = { { product = { sku = "PRICED" }, create = { family = "generic" }, seq = 4,
        set = { { attr = "pricing.retail", value = "9.99" } } } } })
    h.call("apply", { items = { { product = { sku = "RDG-moss-40" }, expect_version = steps.version(h, "RDG-moss-40"), status = "draft",
        set = { { attr = "core.gtin", value = "E40" } }, clear = { { attr = "logistics.net_weight" } } } } })
    h.call("apply", { items = { { product = { sku = "RDG-slate-42" }, expect_version = "any", set = { { attr = "core.size", value = 46 } } } } })
    h.call("apply", { items = { { product = { sku = "RDG-slate-42" }, expect_version = "any", move = { parent = { sku = "RDG-moss" } } } } })
    h.call("release", { items = { { product = { sku = "RDG-moss-41" }, expect_version = steps.version(h, "RDG-moss-41") } } })
    h.call("withdraw", { items = { { product = { sku = "RDG-moss-41" } } } })
    local id = h.call("get", { product = { sku = "RDG-moss-42" } }).product.product_id
    h.call("apply", { items = { { product = { id = id }, expect_version = "any", delete = true } } })
    h.call("apply", { items = { { product = { id = id }, expect_version = "any", restore = true } } })
    h.call("apply", { items = { { product = { id = id }, expect_version = "any", delete = true } } })
    local db = assert(store.open())
    assert(db:execute("UPDATE kickside_pim_product SET state_at = $1 WHERE catalog_id = $2 AND product_id = $3",
        { "2000-01-01T00:00:00Z", h.id, id }))
    db:release()
    local out = fixture.retain()
    assert(out.success == true, tostring(out.error))
    assert(h.call("settle", {}))
    assert(h.call("release", { items = { { product = { sku = "RDG" }, expect_version = steps.version(h, "RDG") } } }))
end

local function define()
    test.describe("automation ports", function()
        test.it("replays a proposal rejection even when the proposal was already conflicted", function()
            local h = fixture.catalog()
            fixture.boot(h)
            local trace = { trace_id = "proposal-review", correlation_key = "review-inbox" }
            local proposal = assert(h.call("propose", { items = { { product = { sku = "RDG" },
                set = { { attr = "core.care", value = "Suggested" } } } }, trace_context = trace })) :: types.ProposeResult
            assert(h.call("apply", { items = { { product = { sku = "RDG" }, expect_version = "any",
                set = { { attr = "core.care", value = "New version" } } } } }))
            local function decide(decision: string): types.DecideResult
                return assert(h.call("decide", { proposal_id = proposal.proposal_id, decision = decision,
                    trace_context = trace })) :: types.DecideResult
            end
            test.eq(decide("accept").status, "conflict")
            test.eq(decide("accept").status, "conflict")
            test.eq(#(assert(h.call("list_proposals", { status = "pending" })) :: types.ProposalsResult).proposals, 0)
            test.eq(decide("reject").status, "rejected")
            test.eq(decide("reject").status, "rejected")
            local facts: { types.RawEvent } = {}
            for _, event in ipairs(fixture.events(h)) do
                if event.type == "kickside.pim.events:proposal.submitted" or event.type == "kickside.pim.events:proposal.decided" then
                    facts[#facts + 1] = event
                end
            end
            test.eq(#facts, 3)
            test.eq(facts[1].type, "kickside.pim.events:proposal.submitted")
            test.eq(facts[1].body.generation, 1)
            test.eq(facts[1].trace_context.correlation_key, trace.correlation_key)
            for _, event in ipairs(facts) do test.eq(event.body.proposal_id, proposal.proposal_id) end
            test.eq(facts[2].body.status, "conflict")
            test.eq(facts[2].body.decision, "accept")
            test.eq(facts[3].body.status, "rejected")
            test.eq(facts[3].body.decision, "reject")
            test.eq(facts[3].trace_context.correlation_key, trace.correlation_key)
            local listed = assert(h.call("list_proposals", { status = "rejected" })) :: types.ProposalsResult
            test.eq(listed.proposals[1].proposal_id, proposal.proposal_id)
        end)

        test.it("commits acceptance with the product edit and returns the same decision on replay", function()
            local h = fixture.catalog()
            fixture.boot(h)
            local proposal = assert(h.call("propose", { items = { { product = { sku = "RDG" },
                set = { { attr = "core.care", value = "Accepted" } } } } })) :: types.ProposeResult
            local request = { proposal_id = proposal.proposal_id, decision = "accept" }
            local accepted = assert(h.call("decide", request)) :: types.DecideResult
            local replayed = assert(h.call("decide", request)) :: types.DecideResult
            test.eq(accepted.status, "accepted")
            test.eq(assert(accepted.result).seq, assert(replayed.result).seq)
            local events = fixture.events(h)
            local edit, fact = events[#events - 1], events[#events]
            test.eq(edit.type, "kickside.pim.events:product.changed")
            test.eq(edit.body.approval_item_id, proposal.proposal_id)
            test.eq(fact.type, "kickside.pim.events:proposal.decided")
            test.eq(fact.body.status, "accepted")
            test.eq(fact.seq, edit.seq + 1)
            test.eq(assert(steps.get(h, "RDG")).values["core.care"].value, "Accepted")
        end)

        test.it("records the schema generations that encoded retained product patches", function()
            local h = fixture.catalog()
            steps.one(h, { product = { sku = "PATCH-GENERATION" }, create = { family = "footwear" },
                set = { { attr = "core.name", ctx = { locale = "en" }, value = "Before" } } })
            local schema = assert(h.call("apply_schema", { declaration = { aspects = {
                { namespace = "extension", attributes = { { code = "field", type = "kickside.pim.types:text" } } },
            } } })) :: types.SchemaResult
            test.eq(schema.generation, 2)
            steps.one(h, { product = { sku = "PATCH-GENERATION" }, expect_version = "any",
                set = { { attr = "core.name", ctx = { locale = "en" }, value = "After" } } })
            local patches: { [string]: types.ProductPatchBody } = {}
            for _, event in ipairs(fixture.events(h)) do
                if event.type == "kickside.pim.events:product.created" or event.type == "kickside.pim.events:product.changed" then
                    patches[event.type] = event.body :: types.ProductPatchBody
                end
            end
            local created = assert(patches["kickside.pim.events:product.created"])
            local changed = assert(patches["kickside.pim.events:product.changed"])
            test.eq(assert(created.patch)[1].v, "Before")
            test.eq(assert(changed.patch)[1].v, "After")
            test.eq(created.generation, 1)
            test.eq(changed.generation, 2)
        end)

        test.it("requires a generation in product patch events", function()
            for _, name in ipairs({ "product.created", "product.changed" }) do
                local schema = assert(registry.get("kickside.pim.events:" .. name)).data.schema
                local required: { [string]: boolean } = {}
                for _, field in ipairs(schema.required) do required[field] = true end
                test.is_true(required.generation, name)
            end
        end)

        test.it("publishes ports for public catalog events and keeps the asset fence internal", function()
            local binding = assert(registry.get("kickside.pim.binding:catalog"))
            local outputs = {}
            local internal = {}
            for _, o in ipairs(binding.meta.events.output) do
                local event = assert(registry.get(o.type))
                if event.meta.internal == true then internal[#internal + 1] = o.type
                else outputs[o.type] = true end
            end
            test.eq(#internal, 1)
            test.eq(internal[1], "kickside.pim.events:assets.reaping")
            local ports = assert(registry.find({ [".kind"] = "registry.entry", ["meta.type"] = "kickside.automation.port" }))
            local seen = {}
            for _, p in ipairs(ports) do
                if tostring(p.id):find("^kickside%.pim%.ports:") then
                    test.eq(p.data.binding, "kickside.pim.binding:catalog", tostring(p.id))
                    test.is_true(outputs[p.data.event] == true, tostring(p.id))
                    local event = assert(registry.get(p.data.event))
                    test.eq(event.meta.type, "kickside.core.threads.event")
                    seen[p.data.event] = true
                end
            end
            for t in pairs(outputs) do test.is_true(seen[t] == true, t) end
        end)

        test.it("emits a schema-valid body for every public catalog event", function()
            local h = fixture.catalog()
            every_event(h)
            local binding = assert(registry.get("kickside.pim.binding:catalog"))
            local declared: { [string]: boolean } = {}
            for _, o in ipairs(binding.meta.events.output) do
                if not assert(registry.get(o.type)).meta.internal then declared[o.type] = true end
            end
            local page = assert(h.call("events", {}))
            local rows: { types.RawEvent } = page.events
            local seen: { [string]: boolean } = {}
            for _, e in ipairs(rows) do
                if declared[e.type] then
                    seen[e.type] = true
                    local entry = assert(registry.get(e.type))
                    local body: unknown = e.body
                    if type(body) == "string" then body = json.decode(body) end
                    local ok, err = json.validate(entry.data.schema, body)
                    test.is_true(ok == true, e.type .. " body breaks its schema: " .. tostring(err) .. " " .. json.encode(body))
                end
            end
            for t in pairs(declared) do test.is_true(seen[t] == true, "scenario emits no " .. t) end
        end)

        test.it("publish the products sink and the publications source", function()
            local sink = assert(registry.get("kickside.pim.sink:products_port"))
            local sink_binding = assert(registry.get(sink.data.binding))
            test.eq(sink_binding.data.contracts[1].contract, "kickside.data:writable")
            test.eq(sink_binding.meta.delivery, "at_least_once")
            test.eq(sink_binding.meta.input_shape, "record")
            test.not_nil(sink.data.operations.upsert)
            local source = assert(registry.get("kickside.pim.source:publications_port"))
            local source_binding = assert(registry.get(source.data.binding))
            test.eq(source_binding.data.contracts[1].contract, "kickside.data:pullable")
            test.is_true(source.data.config_schema.channel.required)
            for _, name in ipairs({ "products", "proposals" }) do
                local port = assert(registry.get("kickside.pim.source:" .. name .. "_port"))
                local binding = assert(registry.get(port.data.binding))
                test.eq(binding.data.contracts[1].contract, "kickside.data:pullable")
                test.is_true(port.data.config_schema.catalog_id.required)
            end
        end)
    end)
end

return { run = test.run_cases(define) }
