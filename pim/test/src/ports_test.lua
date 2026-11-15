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

local baseline = require("event_baseline")
local compatibility = require("event_compatibility")

local function define()
    test.describe("automation ports", function()
        test.it("detects nested event schema incompatibilities", function()
            local frozen = baseline.schemas["product.changed"]
            for _, mutation in ipairs({ "type", "required", "removed", "constraint" }) do
                local current = assert(json.decode(assert(json.encode(frozen))))
                local item = current.properties.patch.items
                if mutation == "type" then item.properties.a.type = "string"
                elseif mutation == "required" then item.required[#item.required + 1] = "v"
                elseif mutation == "removed" then item.properties.a = nil
                else item.properties.a.minimum = 1 end
                local ok, err = compatibility.check(frozen, current, "product.changed")
                test.is_false(ok, mutation)
                test.eq(err:kind(), errors.INVALID)
                test.eq(err:details().code, "event_schema_incompatible")
            end
        end)

        test.it("publish an event port for every catalog output event", function()
            local binding = assert(registry.get("kickside.pim.binding:catalog"))
            local outputs = {}
            for _, o in ipairs(binding.meta.events.output) do outputs[o.type] = true end
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

        test.it("emit only event bodies their declared schemas accept, for every event type", function()
            local h = fixture.catalog()
            every_event(h)
            local binding = assert(registry.get("kickside.pim.binding:catalog"))
            local declared: { [string]: boolean } = {}
            for _, o in ipairs(binding.meta.events.output) do declared[o.type] = true end
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

        test.it("evolve event schemas only by adding optional properties", function()
            for name, frozen in pairs(baseline.schemas) do
                local event_type = "kickside.pim.events:" .. name
                local current = assert(registry.get(event_type)).data.schema
                local ok, err = compatibility.check(frozen, current, event_type)
                test.is_nil(err, tostring(err))
                test.is_true(ok)
                local valid, verr = json.validate(current, baseline.bodies[name])
                test.is_true(valid == true, event_type .. ": " .. tostring(verr))
            end
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
