-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Catalog Blocks: exact kickside.block/v1 declarations over the catalog
-- contract, configured with the catalog picker, lowered to function nodes and
-- run as the caller.
local test = require("test")
local registry = require("registry")
local json = require("json")
local funcs = require("funcs")
local time = require("time")
local fixture = require("fixture")
local scoped = require("scoped")
local block_contract = require("block_contract")
local block_lower = require("block_lower")

type Map = { [string]: unknown }

local NS = "kickside.pim.blocks:"
local BLOCKS = { "get_product", "query_products", "apply", "release" }

local function entry(id: string): Map
    local value, err = registry.get(id)
    assert(not err and value, id .. ": " .. tostring(err))
    return value :: Map
end

-- target answers the function a Block's execution names, the one a Flow node calls.
local function target(block: string): string
    return (((entry(NS .. block).data :: Map).block :: Map).execution :: Map).function_id :: string
end

local function run(h: fixture.Handle, block: string, input: Map): (Map?, error?)
    local out, err = (h.executor :: funcs.Executor):call(target(block), { input = input, config = { catalog_id = h.id } })
    if err then return nil, err end
    return out :: Map, nil
end

local function must(h: fixture.Handle, block: string, input: Map): Map
    local out, err = run(h, block, input)
    assert(not err, block .. ": " .. tostring(err) .. " " .. json.encode(err and err:details() or {}))
    return out :: Map
end

local function define()
    test.describe("catalog blocks", function()
        test.it("publishes one valid function Block per composed method, configured with the catalog picker", function()
            for _, name in ipairs(BLOCKS) do
                local e = entry(NS .. name)
                test.is_nil(block_contract.validate(e), NS .. name)
                local block = (e.data :: Map).block :: Map
                local config = block.config :: Map
                local field = (config.properties :: Map).catalog_id :: Map
                test.eq(field.picker, "wc-component-picker", name)
                test.eq(field.class, "pim_catalog", name)
                test.eq(field.value_field, "id", name)
                test.eq((config.required :: { string })[1], "catalog_id", name)
                local execution = block.execution :: Map
                test.eq(execution.kind, "function", name)
                test.not_nil(registry.get(execution.function_id :: string), name .. " names a registered function")
                local ids: { [string]: boolean } = {}
                for _, p in ipairs(block.ports :: { Map }) do ids[p.id :: string] = true end
                test.is_true(ids.result == true and ids.failed == true, name .. " routes result and failed")
                test.is_nil(block_contract.validate_instance(e, { catalog_id = "catalog-1" }), name)
                test.not_nil(block_contract.validate_instance(e, {}), name .. " needs a catalog")
                local plan, perr = block_lower.plan(e, { config = { catalog_id = "catalog-1" } })
                test.is_nil(perr)
                test.eq((plan :: Map).node_type, "userspace.dataflow.node.func:node")
                test.eq(((plan :: Map).config :: Map).func_id, execution.function_id)
            end
        end)

        test.it("reads, queries, applies and releases as the caller over the catalog contract", function()
            local h = fixture.catalog()
            fixture.boot(h)
            local got = must(h, "get_product", { product = { sku = "RDG-moss-40" }, context = { locale = "en" } })
            test.eq((got.product :: Map).sku, "RDG-moss-40")
            test.eq(((got.values :: Map)["core.name"] :: Map).value, "Ridgeline hiking boot")
            local page = must(h, "query_products", { family = "footwear", where = { field = "core.color", op = "eq", value = "moss" }, columns = { "core.size" }, limit = 10 })
            test.eq(#(page.items :: { Map }), 3, "the three sized moss items")
            for _, item in ipairs(page.items :: { Map }) do test.is_true(tostring(item.sku):find("^RDG%-moss%-") ~= nil, tostring(item.sku)) end
            local first = must(h, "query_products", { limit = 1 })
            local query = entry(NS .. "query_products").data.block
            test.eq(type(first.after), "string")
            test.is_true(json.validate(query.output, first))
            local resume = { limit = 1, after = first.after }
            test.is_true(json.validate(query.input, resume))
            local next_page = must(h, "query_products", resume)
            test.is_true(first.items[1].product_id ~= next_page.items[1].product_id)
            local applied = must(h, "apply", { items = { { product = { sku = "RDG-moss-40" }, expect_version = "any", set = { { attr = "core.gtin", value = "BLOCK40" } } } } })
            test.eq(((applied.outcomes :: { Map })[1]).outcome, "updated")
            assert(h.call("settle", {}))
            local after = must(h, "get_product", { product = { sku = "RDG-moss-40" } })
            test.eq(((after.values :: Map)["core.gtin"] :: Map).value, "BLOCK40")
            local item = must(h, "get_product", { product = { sku = "RDG-moss-41" } })
            local released = must(h, "release", { items = { { product = { sku = "RDG-moss-41" }, expect_version = (item.product :: Map).version } } })
            test.eq(((released.outcomes :: { Map })[1]).outcome, "released", json.encode(released.outcomes))
            local _, bad = run(h, "apply", { items = { { product = { sku = "RDG-moss-40" }, expect_version = 0, set = { { attr = "core.gtin", value = "X" } } } } })
            test.is_nil(bad)
            local _, missing = run(h, "get_product", { product = { sku = "NOPE" } })
            test.eq((missing :: error):kind(), errors.NOT_FOUND)
        end)

        test.it("refuses a Block call without a catalog or by a caller the catalog does not admit", function()
            local h = fixture.catalog()
            fixture.boot(h)
            local _, err = (h.executor :: funcs.Executor):call(target("get_product"), { input = { product = { sku = "RDG" } }, config = {} })
            test.eq((err :: error):kind(), errors.INVALID)
            local other = fixture.catalog()
            local _, denied = (other.executor :: funcs.Executor):call(target("get_product"), { input = { product = { sku = "RDG" } }, config = { catalog_id = h.id } })
            test.not_nil(denied)
            test.is_true((denied :: error):kind() == errors.PERMISSION_DENIED or (denied :: error):kind() == errors.NOT_FOUND, tostring(denied))
        end)

        test.it("lowers the published product wait with its configured catalog and deadline", function()
            local e = entry(NS .. "wait_for_product")
            test.is_nil(block_contract.validate(e))
            local plan, err = block_lower.plan(e, { config = { catalog_id = "catalog-1", timeout_ms = 2000 } })
            assert(plan, tostring(err))
            local config = (plan :: Map).config :: Map
            test.eq(config.func_id, target("wait_for_product"))
            local args = config.args :: Map
            test.eq((args.config :: Map).timeout_ms, 2000)
        end)

        test.it("waits as a catalog reader for target status and resumes from the returned cursor", function()
            local owner, reader, outsider = scoped.member(), scoped.member(), scoped.member()
            local h = scoped.catalog(owner)
            fixture.boot(h)
            assert(h.call("grant", { subject_id = reader.id, mask = 1 }))
            local client = funcs.new():with_actor(reader.actor):with_scope(reader.scope)
            local fn = target("wait_for_product")
            local config = { catalog_id = h.id, timeout_ms = 5000 }
            local input: Map = { product = { sku = "RDG-moss-40" }, predicate = { status = "active" } }
            local first = assert(client:call(fn, { input = input, config = config }))
            test.eq(first.status, "matched")
            input.cursor, input.predicate = first.cursor, { status = "draft" }
            input.min_seq = first.cursor.seq + 1
            local pending = assert(client:async(fn, { input = input, config = config }))
            time.sleep("100ms")
            assert(h.call("apply", { items = { { product = { sku = "RDG-moss-41" }, expect_version = "any", status = "draft" } } }))
            assert(h.call("apply", { items = { { product = { sku = "RDG-moss-40" }, expect_version = "any", status = "draft" } } }))
            assert(pending:response():receive())
            local response, err = pending:result()
            assert(response, tostring(err))
            local matched = response:data()
            test.eq(matched.status, "matched")
            test.eq(matched.product.sku, "RDG-moss-40")
            test.eq(matched.product.status, "draft")
            test.is_true(matched.cursor.seq > first.cursor.seq)

            input.cursor, input.predicate = matched.cursor, { status = "archived" }
            config.timeout_ms = 100
            local timed = assert(client:call(fn, { input = input, config = config }))
            test.eq(timed.status, "timed_out")
            test.is_nil(timed.product)
            input.predicate, input.min_seq = { status = "draft" }, matched.cursor.seq + 1
            local fenced = assert(client:call(fn, { input = input, config = config }))
            test.eq(fenced.status, "timed_out")
            test.eq(fenced.cursor.seq, matched.cursor.seq)
            local _, denied = funcs.new():with_actor(outsider.actor):with_scope(outsider.scope):call(fn, { input = input, config = config })
            test.not_nil(denied)
        end)

        test.it("matches channel and locale completeness and wakes for a publication-only change", function()
            local h = fixture.catalog()
            fixture.boot(h)
            local fn = target("wait_for_product")
            local client = h.executor :: funcs.Executor
            local config = { catalog_id = h.id, timeout_ms = 5000 }
            local input: Map = { product = { sku = "RDG-moss-40" }, predicate = { complete = { channel = "web" } } }
            local ready = assert(client:call(fn, { input = input, config = config }))
            test.eq(ready.status, "matched")
            input.predicate = { complete = { locale = "en" } }
            test.eq(assert(client:call(fn, { input = input, config = config })).status, "matched")
            input.predicate = { complete = { locale = "de" } }
            config.timeout_ms = 100
            test.eq(assert(client:call(fn, { input = input, config = config })).status, "timed_out")
            config.timeout_ms = 5000
            local completing = assert(client:async(fn, { input = input, config = config }))
            time.sleep("100ms")
            local edited = assert(h.call("apply", { items = { { product = { sku = "RDG" }, expect_version = "any",
                set = { { attr = "marketing.description", ctx = { locale = "de" }, value = "Fuer den Heimweg." } } } } }))
            test.eq(edited.outcomes[1].outcome, "updated")
            assert(completing:response():receive())
            local completion = assert(completing:result()):data()
            test.eq(completion.status, "matched")
            input.predicate = { complete = { channel = "marketplace" } }
            test.eq(assert(client:call(fn, { input = input, config = config })).status, "matched")

            input.cursor, input.predicate = completion.cursor, { publication = { channel = "web", state = "published" } }
            local pending = assert(client:async(fn, { input = input, config = config }))
            time.sleep("100ms")
            local release = assert(h.call("release", { items = { { product = input.product, expect_version = ready.product.version, channels = { "web" } } } }))
            test.eq(release.outcomes[1].outcome, "released")
            assert(pending:response():receive())
            local response, err = pending:result()
            assert(response, tostring(err))
            local matched = response:data()
            test.eq(matched.status, "matched")
            test.is_true(matched.cursor.seq > completion.cursor.seq)
        end)
    end)
end

return { run = test.run_cases(define) }
