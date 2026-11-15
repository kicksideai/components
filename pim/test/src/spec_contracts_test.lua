-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local registry = require("registry")
local fixture = require("fixture")
local store = require("store")
local types = require("types")

type Map = { [string]: unknown }

local function define()
    test.describe("SPEC contracts", function()
        test.it("compiles the main family example through ordinary schema admission", function()
            local family = assert(registry.get("app:spec_fixture")).data.family
            local h = fixture.catalog({ bare = true })
            local out, err = h.call("apply_schema", { declaration = {
                dimensions = { { name = "locale", members = { "en", "de" } } },
                vocabularies = { { code = "colors" } },
                aspects = {
                    { namespace = "core", attributes = {
                        { code = "name", type = "kickside.pim.types:text", scope = { "locale" } },
                        { code = "gtin", type = "kickside.pim.types:identifier", unique = true, index = "key" },
                        { code = "color", type = "kickside.pim.types:select", vocabulary = "colors", index = "key" },
                        { code = "size", type = "kickside.pim.types:integer", index = "number" },
                        { code = "materials", type = "kickside.pim.types:text", cardinality = "set" },
                    } },
                    { namespace = "marketing", attributes = { { code = "description", type = "kickside.pim.types:rich_text", scope = { "locale" } } } },
                    { namespace = "shipping", attributes = { { code = "weight", type = "kickside.pim.types:quantity", config = { units = { kg = "1" }, canonical = "kg" } } } },
                },
                families = { family },
            } })
            test.is_nil(err)
            test.not_nil(out)
            if out then
                local compiled = assert(h.call("get_schema", {})).families.footwear
                test.eq(compiled.owner["shipping.weight"], 2)
                test.eq(compiled.item_level, 2)
                test.eq(#compiled.checks, 1)
            end
        end)

        test.it("matches the route inventory and the endpoint policy exactly", function()
            local expected = assert(registry.get("app:spec_fixture")).data.routes :: { Map }
            local resources = assert(registry.get("kickside.pim.security:pim_endpoint_access")).data.policy.resources :: { string }
            local granted: { [string]: boolean } = {}
            for _, id in ipairs(resources) do granted[id] = true end
            local count = 0
            local entries = assert(registry.find({ [".kind"] = "http.endpoint" }))
            for _, entry in ipairs(entries) do
                if tostring(entry.id):match("^kickside%.pim%.api:") then count = count + 1 end
            end
            test.eq(count, #expected)
            test.eq(#resources, #expected)
            for _, route in ipairs(expected) do
                local id = "kickside.pim.api:" .. (route.operation :: string) .. ".endpoint"
                local endpoint = assert(registry.get(id)).data
                test.eq(endpoint.method, route.method, id)
                test.eq(endpoint.path, route.path, id)
                test.is_true(granted[id], id)
            end
        end)

        test.it("replays retained receipts independently of event expiry", function()
            local h = fixture.catalog()
            fixture.boot(h)
            local function command(): types.ApplyResult
                return assert(h.call("apply", { idempotency = { namespace = "test", key = "window" },
                    items = { { product = { sku = "RDG" }, expect_version = "any", set = { { attr = "core.care", value = "first" } } } } })) :: types.ApplyResult
            end
            local first = command()
            assert(h.call("apply", { items = { { product = { sku = "RDG" }, expect_version = "any", set = { { attr = "core.care", value = "later" } } } } }))
            local replay = command()
            test.is_true(replay.replayed)
            test.eq(replay.seq, first.seq)
            test.eq(assert(h.call("get", { product = { sku = "RDG" } })).values["core.care"].value, "later")
            local db = assert(store.open())
            assert(db:execute("DELETE FROM kickside_event WHERE thread_id = $1 AND seq = $2", { h.id, first.seq }))
            assert(db:release())
            local after = command()
            test.is_true(after.replayed)
            test.eq(assert(h.call("get", { product = { sku = "RDG" } })).values["core.care"].value, "later")
        end)
    end)
end

return { run = test.run_cases(define) }
