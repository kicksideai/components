-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Idempotency keys: replay, conflicts, namespaces and what is stored.
local test = require("test")
local fixture = require("fixture")
local store = require("store")
local types = require("types")

local function apply(h: fixture.Handle, items: { types.ApplyItem }, ns: string, key: string, extra: { [string]: unknown }?): (types.ApplyResult?, error?)
    local request: { [string]: unknown } = { items = items, idempotency = { namespace = ns, key = key } }
    for k, v in pairs(extra or {}) do request[k] = v end
    local out, err = h.call("apply", request)
    return out :: types.ApplyResult?, err
end

local function create(sku: string): types.ApplyItem
    return { product = { sku = sku }, create = { family = "generic" } }
end

local function define()
    test.describe("idempotency", function()
        test.it("keys commands per namespace and refuses empty parts", function()
            local h = fixture.catalog()
            local a = assert(apply(h, { create("A") }, "ui", "k1"))
            local b = assert(apply(h, { create("B") }, "sync", "k1"))
            test.is_nil(b.replayed)
            test.eq(b.outcomes[1].outcome, "created")
            test.not_nil(select(2, apply(h, { create("C") }, "", "k")))
            test.not_nil(select(2, apply(h, { create("C") }, "ui", "")))
            test.not_nil(a.seq)
        end)

        test.it("replays the stored result after the schema moved on", function()
            local h = fixture.catalog()
            local first = assert(apply(h, { create("A") }, "ui", "k"))
            h.call("apply_schema", { declaration = { aspects = { { namespace = "marketing", attributes = { { code = "x", type = "kickside.pim.types:text" } } } } } })
            local again = assert(apply(h, { create("A") }, "ui", "k"))
            test.is_true(again.replayed)
            test.eq(again.outcomes[1].product_id, first.outcomes[1].product_id)
            test.is_true((again.as_of :: integer) >= (first.seq :: integer))
        end)

        test.it("refuses the same key for a different request shape", function()
            local h = fixture.catalog()
            fixture.boot(h)
            assert(apply(h, { create("A"), create("B") }, "ui", "k"))
            test.not_nil(select(2, apply(h, { create("A"), create("B") }, "ui", "k", { mode = "independent" })))
            test.not_nil(select(2, apply(h, { create("B"), create("A") }, "ui", "k")))
            test.not_nil(select(2, apply(h, { create("A"), create("B") }, "ui", "k", { source = "erp" })))
            local _, rel = h.call("release", { items = { { product = { sku = "RDG-moss-40" }, expect_version = 1 } },
                idempotency = { namespace = "ui", key = "k" } })
            test.not_nil(rel)
        end)

        test.it("keeps refusals retryable and receipts successful unchanged commands", function()
            local h = fixture.catalog()
            fixture.boot(h)
            local failed = assert(apply(h, { create("X"), { product = { sku = "RDG" }, expect_version = 0, status = "draft" } }, "ui", "f"))
            test.is_false(failed.applied)
            local fixed = assert(apply(h, { create("X"), { product = { sku = "RDG" }, expect_version = 0, status = "draft" } }, "ui", "f"))
            test.is_nil(fixed.replayed)
            local same = assert(apply(h, { { product = { sku = "RDG" }, expect_version = 1, status = "active" } }, "ui", "u"))
            test.is_nil(same.seq)
            local rerun = assert(apply(h, { { product = { sku = "RDG" }, expect_version = 1, status = "active" } }, "ui", "u"))
            test.is_true(rerun.replayed)
        end)

        test.it("expires actual eventful and no-op receipts so their keys can be reused", function()
            local h = fixture.catalog()
            local initial = assert(apply(h, { create("RECEIPT-A") }, "expiry", "eventful"))
            test.eq(initial.outcomes[1].outcome, "created")
            local product = assert(h.call("get", { product = { sku = "RECEIPT-A" } })).product
            local same: types.ApplyItem = { product = { sku = "RECEIPT-A" }, expect_version = product.version, status = product.status }
            test.eq(assert(apply(h, { same }, "expiry", "noop")).outcomes[1].outcome, "unchanged")
            test.is_true(assert(apply(h, { create("RECEIPT-A") }, "expiry", "eventful")).replayed)
            test.is_true(assert(apply(h, { same }, "expiry", "noop")).replayed)
            local db = assert(store.open())
            local expired = assert(db:execute([[UPDATE kickside_pim_receipt SET expires_at=$1
                WHERE catalog_id=$2 AND marker LIKE 'r:6:expiry%']],
                { "2000-01-01T00:00:00Z", h.id }))
            test.eq(expired.rows_affected, 2)
            assert(db:release())
            test.is_true(assert(fixture.retain()).success)
            local check = assert(store.open())
            local receipts = assert(check:query([[SELECT marker FROM kickside_pim_receipt
                WHERE catalog_id=$1 AND marker LIKE 'r:6:expiry%']], { h.id }))
            assert(check:release())
            test.eq(#receipts, 0)
            local reused = assert(apply(h, { same }, "expiry", "eventful"))
            test.eq(reused.outcomes[1].outcome, "unchanged")
            test.is_nil(reused.replayed)
            test.eq(assert(apply(h, { create("RECEIPT-B") }, "expiry", "noop")).outcomes[1].outcome, "created")
            local kept = assert(h.call("get", { product = { sku = "RECEIPT-A" } })).product
            test.eq(kept.product_id, product.product_id)
            test.eq(kept.version, product.version)
        end)

        test.it("replays independent failures and marks every event of the command", function()
            local h = fixture.catalog()
            local first = assert(apply(h, { create("A"), create("A"), create("B") }, "ui", "multi", { mode = "independent" }))
            test.eq(first.outcomes[2].outcome, "conflict")
            local again = assert(apply(h, { create("A"), create("A"), create("B") }, "ui", "multi", { mode = "independent" }))
            test.is_true(again.replayed)
            test.eq(again.outcomes[2].outcome, "conflict")
            test.eq(#((again.outcomes[2].findings :: { types.Finding })), 1)
            local page = h.call("events", {}) :: { events: { { external_id: string? } } }
            local marked: { [string]: boolean } = {}
            for _, e in ipairs(page.events) do if e.external_id then marked[e.external_id :: string] = true end end
            test.is_true(marked["r:2:ui5:multi"])
            test.is_true(marked["e:13:r:2:ui5:multi:2"])
        end)

        test.it("replays schema applies and withdrawals", function()
            local h = fixture.catalog()
            fixture.boot(h)
            local decl = { aspects = { { namespace = "marketing", attributes = { { code = "x", type = "kickside.pim.types:text" } } } } }
            local s1 = h.call("apply_schema", { declaration = decl, idempotency = { namespace = "admin", key = "s" } }) :: types.SchemaResult
            local s2 = h.call("apply_schema", { declaration = decl, idempotency = { namespace = "admin", key = "s" } }) :: types.SchemaResult
            test.is_true(s2.replayed)
            test.eq(s2.generation, s1.generation)
            local _, cerr = h.call("apply_schema", { declaration = { aspects = { { namespace = "marketing", attributes = {
                { code = "y", type = "kickside.pim.types:text" } } } } }, idempotency = { namespace = "admin", key = "s" } })
            test.not_nil(cerr)
            h.call("release", { items = { { product = { sku = "RDG-moss-40" }, expect_version = 1, channels = { "web" } } } })
            local w1 = h.call("withdraw", { items = { { product = { sku = "RDG-moss-40" } } }, idempotency = { namespace = "ui", key = "w" } }) :: types.ApplyResult
            local w2 = h.call("withdraw", { items = { { product = { sku = "RDG-moss-40" } } }, idempotency = { namespace = "ui", key = "w" } }) :: types.ApplyResult
            test.is_true(w2.replayed)
            test.eq(w2.outcomes[1].outcome, w1.outcomes[1].outcome)
        end)
    end)
    test.describe("idempotency", function()
        test.it("keeps distinct idempotency tuples and event ordinals separate", function()
            local h = fixture.catalog()
            local function apply(namespace, key, sku, second)
                local items = { { product = { sku = sku }, create = {} } }
                if second then items[2] = { product = { sku = second }, create = {} } end
                return h.call("apply", { idempotency = { namespace = namespace, key = key }, items = items })
            end
            local first, err = apply("a/b", "c", "one", "two")
            test.is_nil(err)
            local other, oerr = apply("a", "b/c", "three")
            test.is_nil(oerr)
            test.eq(other.outcomes[1].outcome, "created")
            local ordinal, ierr = apply("a/b", "c/2", "four")
            test.is_nil(ierr)
            test.eq(ordinal.outcomes[1].outcome, "created")
            local replay, rerr = apply("a/b", "c", "one", "two")
            test.is_nil(rerr)
            test.eq(replay.seq, first.seq)
            test.is_true(replay.replayed)
        end)
    end)

end

return { run = test.run_cases(define) }
