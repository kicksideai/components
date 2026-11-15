-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- The products sink (kickside.data:writable): one upsert per sku under a
-- receipt key, every failure answered in the writable result shape.
local test = require("test")
local fixture = require("fixture")
local scoped = require("scoped")
local steps = require("steps")
local types = require("types")
local json = require("json")

type Map = { [string]: unknown }

local BASE_ORIGIN = "automation:sink-test"

local function write(call: fixture.Call, key: string?, input: Map?, config: Map?, over: Map?): Map
    local req: Map = { sink_op = "upsert", origin = BASE_ORIGIN, idempotency_key = key, input = input, config = config or { source = "erp" } }
    for k, v in pairs(over or {}) do req[k] = v end
    local out, err = call("sink", req)
    assert(not err, tostring(err))
    return out :: Map
end

local function code(out: Map): string?
    local e = out.error
    if type(e) ~= "table" then return nil end
    return (e :: Map).code :: string?
end

local function define()
    test.describe("sink requests", function()
        test.it("keeps one scoped destination across stable-identity deliveries and replays their own receipts", function()
            local h = scoped.catalog(scoped.member())
            local identity = { identity_key = "stable-product" }
            local first_input = { sku = "STABLE", set = { { attr = "core.care", value = "First" } } }
            local second_input = { sku = "STABLE", set = { { attr = "core.care", value = "Second" } } }
            local first = write(h.call, "delivery-one", first_input, nil, identity)
            test.is_true(first.success, json.encode(first))
            test.eq(first.result, "created")
            local second = write(h.call, "delivery-two", second_input, nil, identity)
            test.is_true(second.success, json.encode(second))
            test.eq(second.result, "updated")
            test.eq(second.dest_ref.product_id, first.dest_ref.product_id)
            local again = write(h.call, "delivery-two", second_input, nil, identity)
            test.is_true(again.success, json.encode(again))
            test.eq(again.dest_ref.product_id, first.dest_ref.product_id)
            test.eq(again.result, "updated")
            local original = write(h.call, "delivery-one", first_input, nil, identity)
            test.is_true(original.success, json.encode(original))
            test.eq(original.dest_ref.product_id, first.dest_ref.product_id)
            test.eq(original.result, "created")
            local got = assert(steps.get(h, "STABLE"))
            test.eq(got.product.version, 2)
            test.eq(got.values["core.care"].value, "Second")
            test.eq(#assert(h.call("query", {})).items, 1)
            local other = scoped.catalog(scoped.member())
            local foreign = write(other.call, "delivery-one", first_input, nil, identity)
            test.is_true(foreign.success, json.encode(foreign))
            test.eq(foreign.result, "created")
            test.is_false(foreign.dest_ref.product_id == first.dest_ref.product_id)
            test.eq(assert(steps.get(other, "STABLE")).values["core.care"].value, "First")
        end)

        test.it("refuses an unsupported operation", function()
            local h = fixture.catalog()
            local out = write(h.call, "k", { sku = "S" }, nil, { sink_op = "delete" })
            test.eq(out.success, false)
        end)

        test.it("refuses an empty or blank sku", function()
            local h = fixture.catalog()
            for _, sku in ipairs({ "", "   " }) do test.eq(write(h.call, "k", { sku = sku }).success, false) end
            test.eq(write(h.call, "k", {}).success, false)
        end)

        test.it("refuses a missing idempotency key", function()
            local h = fixture.catalog()
            test.eq(write(h.call, nil, { sku = "S" }).success, false)
            test.eq(write(h.call, "  ", { sku = "S" }).success, false)
        end)

        test.it("refuses a missing origin", function()
            local h = fixture.catalog()
            test.eq(write(h.call, "k", { sku = "S" }, nil, { origin = "" }).success, false)
        end)

        test.it("answers malformed values as an invalid request", function()
            local h = fixture.catalog()
            for _, input in ipairs({
                { sku = "S", set = "core.gtin" },
                { sku = "S", set = { { value = 1 } } },
                { sku = "S", status = 5 },
                { sku = "S", seq = "first" },
                { sku = 5 },
            } :: { Map }) do
                local out = write(h.call, "k-shape", input)
                test.eq(out.success, false)
                test.eq(code(out), "invalid_request")
            end
        end)

        test.it("refuses an unknown attribute at item scope and answers a parent not yet delivered as a retriable dependency", function()
            local h = fixture.catalog()
            fixture.boot(h)
            local bad = write(h.call, "k1", { sku = "S", set = { { attr = "core.nope", value = 1 } } })
            test.eq(code(bad), "invalid_request")
            test.eq((bad.error :: Map).retriable, false)
            test.eq((bad.error :: Map).scope, "item")
            local waiting = write(h.call, "k2", { sku = "S", parent_sku = "NOPE" })
            test.eq(code(waiting), "dependency_missing", json.encode(waiting))
            test.eq((waiting.error :: Map).retriable, true)
            test.eq((waiting.error :: Map).scope, "item")
            test.eq((((waiting.error :: Map).details :: Map).findings :: { Map })[1].code, "invalid_reference")
        end)

        test.it("answers a referenced product or term not yet in the catalog as a retriable dependency", function()
            local h = fixture.catalog()
            fixture.boot(h)
            local product = write(h.call, "k1", { sku = "RDG", set = { { attr = "core.related", value = { { ref = { "product", "01900000-0000-7000-8000-000000000000" } } } } } })
            test.eq(code(product), "dependency_missing", json.encode(product))
            test.eq((product.error :: Map).retriable, true)
            test.eq((product.error :: Map).scope, "item")
            local term = write(h.call, "k2", { sku = "RDG", set = { { attr = "core.category", value = "nope" } } })
            test.eq(code(term), "dependency_missing", json.encode(term))
            test.eq((term.error :: Map).retriable, true)
        end)
    end)

    test.describe("sink writes", function()
        test.it("creates a variant under a parent sku in its family", function()
            local h = fixture.catalog()
            fixture.boot(h)
            local out = write(h.call, "k1", { sku = "RDG-moss-50", parent_sku = "RDG-moss", set = { { attr = "core.size", value = 50 } } })
            test.eq(out.result, "created")
            local got = assert(steps.get(h, "RDG-moss-50"))
            test.eq(got.product.level, 2)
            test.eq(got.product.family, "footwear")
            test.eq(code(write(h.call, "k2", { sku = "RDG-moss-51", parent_sku = "RDG-moss" })), "invalid_request")
        end)

        test.it("updates an existing sku and ignores the family and parent it names", function()
            local h = fixture.catalog()
            fixture.boot(h)
            local out = write(h.call, "k1", { sku = "RDG-moss-40", family = "generic", parent_sku = "RDG-slate", set = { { attr = "core.gtin", value = "up-40" } } })
            test.eq(out.result, "updated")
            local got = assert(steps.get(h, "RDG-moss-40"))
            test.eq(got.product.family, "footwear")
            test.eq(got.product.parent_id, assert(steps.get(h, "RDG-moss")).product.product_id)
        end)

        test.it("orders an ordered source by seq and refuses a missing seq", function()
            local h = fixture.catalog()
            fixture.boot(h)
            local cfg = { source = "pricing" }
            test.eq(write(h.call, "k1", { sku = "RDG", seq = 5, set = { { attr = "pricing.retail", value = "10.00" } } }, cfg).result, "updated")
            test.eq(write(h.call, "k2", { sku = "RDG", seq = 4, set = { { attr = "pricing.retail", value = "1.00" } } }, cfg).result, "noop")
            local price = assert(steps.get(h, "RDG")).values["pricing.retail"].value :: types.Dec
            test.eq(price.m, 1)
            test.eq(price.e, 1)
            test.eq(code(write(h.call, "k3", { sku = "RDG", set = { { attr = "pricing.retail", value = "2.00" } } }, cfg)), "invalid_request")
        end)

        test.it("refuses an unknown source and a source writing outside its aspects", function()
            local h = fixture.catalog()
            fixture.boot(h)
            test.eq(code(write(h.call, "k1", { sku = "RDG" }, { source = "nope" })), "invalid_request")
            test.eq(code(write(h.call, "k2", { sku = "RDG", set = { { attr = "marketing.tagline", ctx = { channel = "web", locale = "en" }, value = "x" } } })), "permission_denied")
        end)

        test.it("treats the same key from another origin as a new command", function()
            local h = fixture.catalog()
            fixture.boot(h)
            test.eq(write(h.call, "k", { sku = "RDG-moss-40", set = { { attr = "core.gtin", value = "o1" } } }).result, "updated")
            test.eq(write(h.call, "k", { sku = "RDG-moss-40", set = { { attr = "core.gtin", value = "o2" } } }, nil, { origin = "automation:other" }).result, "updated")
            test.eq(assert(steps.get(h, "RDG-moss-40")).values["core.gtin"].value, "o2")
        end)

        test.it("denies an outsider and a reader", function()
            local h = fixture.catalog()
            fixture.boot(h)
            local out = write(fixture.user(h), "k", { sku = "RDG" })
            test.eq(code(out), "permission_denied")
            test.eq(out.error.details.kind, errors.PERMISSION_DENIED)
            test.not_nil(out.error.details.code)
            local reader, id = fixture.user(h)
            h.call("grant", { subject_id = id, mask = 1 })
            test.eq(code(write(reader, "k", { sku = "RDG" })), "permission_denied")
        end)

        test.it("trims the sku", function()
            local h = fixture.catalog()
            test.eq(write(h.call, "k1", { sku = " SINK-1 " }).result, "created")
            test.eq(write(h.call, "k2", { sku = "SINK-1" }).result, "noop")
        end)

        test.it("creates with a status and changes it later", function()
            local h = fixture.catalog()
            test.eq(write(h.call, "k1", { sku = "S", status = "draft" }).result, "created")
            test.eq(assert(steps.get(h, "S")).product.status, "draft")
            test.eq(write(h.call, "k2", { sku = "S", status = "active" }).result, "updated")
            test.eq(assert(steps.get(h, "S")).product.status, "active")
        end)

        test.it("answers a held unique value as a retriable conflict", function()
            local h = fixture.catalog()
            fixture.boot(h)
            local out = write(h.call, "k", { sku = "RDG-moss-40", set = { { attr = "core.gtin", value = "0400moss41" } } })
            test.eq(code(out), "conflict")
            test.eq((out.error :: Map).retriable, true)
        end)

        test.it("creates a new product for the sku of a trashed one", function()
            local h = fixture.catalog()
            fixture.boot(h)
            local old = assert(steps.get(h, "RDG-moss-40")).product.product_id
            steps.one(h, { product = { sku = "RDG-moss-40" }, expect_version = steps.version(h, "RDG-moss-40"), delete = true })
            local out = write(h.call, "k", { sku = "RDG-moss-40", parent_sku = "RDG-moss", set = { { attr = "core.size", value = 40 } } })
            test.eq(out.result, "created")
            test.is_false((out.dest_ref :: Map).product_id == old)
        end)

        test.it("replays the same result after the schema moved on", function()
            local h = fixture.catalog()
            local first = write(h.call, "k", { sku = "S" })
            h.call("apply_schema", { declaration = { vocabularies = { { code = "later" } } } })
            local again = write(h.call, "k", { sku = "S" })
            test.eq(again.result, first.result)
            test.eq((again.dest_ref :: Map).product_id, (first.dest_ref :: Map).product_id)
        end)
    end)
end

return { run = test.run_cases(define) }
