-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local fixture = require("fixture")
local steps = require("steps")
local json = require("json")

type Map = { [string]: unknown }

local copy = steps.copy

local function footwear_with(checks: { Map }): Map
    local family = copy(fixture.DECLARATION.families[1])
    family.checks = checks
    return family
end

local version = steps.version

local function define()
    test.describe("family checks", function()
        test.it("feed readiness and release", function()
            local h = fixture.catalog()
            fixture.boot(h)
            local _, err = h.call("apply_schema", { declaration = { families = { footwear_with({
                { check = "app:weight_check", reads = { "logistics.net_weight" }, config = { max = 0.741 } } }) } } })
            test.is_nil(err)
            steps.rebuilt(h)
            test.eq(#h.call("query", { ready = { set = "web", value = true } }).items, 4)
            local view = h.call("get", { product = { sku = "RDG-moss-42" } })
            test.eq(view.readiness.web[1].code, "too_heavy")
            local out = h.call("release", { items = { { product = { sku = "RDG-moss-42" }, expect_version = version(h, "RDG-moss-42") } } })
            test.eq(out.outcomes[1].outcome, "not_ready")
        end)

        test.it("run release-cost checks only at release", function()
            local h = fixture.catalog()
            fixture.boot(h)
            h.call("apply_schema", { declaration = { families = { footwear_with({
                { check = "app:weight_check", reads = { "logistics.net_weight" }, cost = "release", config = { max = 0.741 } } }) } } })
            steps.rebuilt(h)
            test.eq(#h.call("query", { ready = { set = "web", value = true } }).items, 6)
            local out = h.call("release", { items = { { product = { sku = "RDG-moss-42" }, expect_version = version(h, "RDG-moss-42") } } })
            test.eq(out.outcomes[1].outcome, "not_ready")
            out = h.call("release", { items = { { product = { sku = "RDG-moss-40" }, expect_version = version(h, "RDG-moss-40") } } })
            test.eq(out.outcomes[1].outcome, "released")
        end)

        test.it("refuses an unknown check function", function()
            local h = fixture.catalog()
            local _, err = h.call("apply_schema", { declaration = { families = { footwear_with({ { check = "app:nope" } }) } } })
            test.not_nil(err)
        end)
    end)

    test.describe("products sink", function()
        test.it("upserts by sku with redelivery, conflict, update and noop", function()
            local h = fixture.catalog()
            local base = { sink_op = "upsert", origin = "automation:erp-sync", config = { source = "erp" } }
            local function write(key: string, input: Map): Map
                local req = copy(base)
                req.idempotency_key = key
                req.input = input
                local out, err = h.call("sink", req)
                test.is_nil(err)
                return out
            end
            local created = write("k1", { sku = "SINK-1", set = { { attr = "core.gtin", value = "sink-1" } } })
            test.eq(created.success, true, json.encode(created))
            test.eq(created.result, "created", "first " .. json.encode(created))
            local again = write("k1", { sku = "SINK-1", set = { { attr = "core.gtin", value = "sink-1" } } })
            test.eq(again.result, "created", "again " .. json.encode(again))
            test.eq(again.dest_ref.product_id, created.dest_ref.product_id)
            local clash = write("k1", { sku = "SINK-1", set = { { attr = "core.gtin", value = "other" } } })
            test.eq(clash.success, false)
            test.eq(clash.error.code, "idempotency_conflict")
            test.eq(write("k2", { sku = "SINK-1", set = { { attr = "core.gtin", value = "sink-1b" } } }).result, "updated")
            test.eq(write("k3", { sku = "SINK-1", set = { { attr = "core.gtin", value = "sink-1b" } } }).result, "noop")
            local bad = write("k4", { sku = "SINK-2", set = { { attr = "pricing.retail", value = "1.00" } } })
            test.eq(bad.error.code, "permission_denied")
        end)
    end)
end

return { run = test.run_cases(define) }
