-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Projection bounds, counters, descendant stamping and the rebuild slot: the
-- fold keeps catalog counters exact, stamps every product whose resolved view a
-- model edit changes, stops at its row budget, and a failed rebuild parks
-- until the rebuild method wakes it.
local test = require("test")
local json = require("json")
local fixture = require("fixture")
local funcs = require("funcs")
local time = require("time")
local jobs = require("jobs")
local uuid = require("uuid")
local store = require("store")
local narrow = require("narrow")
local materializer = require("materializer")
local types = require("types")

local catalog_fixture = require("catalog_fixture")
local catalog = catalog_fixture.catalog

local function exec(statement: string, params: types.SqlParams)
    local db = assert(store.open())
    local _, err = db:execute(statement, params)
    db:release()
    assert(not err, tostring(err))
end

local function trash(h: fixture.Handle, sku: string): string
    local p = h.call("get", { product = { sku = sku } }).product
    local out = h.call("apply", { items = { { product = { sku = sku }, expect_version = p.version, delete = true } } })
    assert(out.outcomes[1].trashed == true, out.outcomes[1].outcome)
    return p.product_id
end

local function settle(h: fixture.Handle)
    local settled, err = h.call("settle", {})
    assert(not err and settled.done == true, tostring(err))
end

local function define()
    test.describe("catalog counters", function()
        test.it("track live products, items and trash through every state change", function()
            local h = fixture.catalog()
            fixture.boot(h)
            local c = catalog(h)
            test.eq(c.product_count, 9)
            test.eq(c.item_count, 6)
            test.eq(c.trashed_count, 0)
            local id = trash(h, "RDG-moss-40")
            c = catalog(h)
            test.eq(c.product_count, 8)
            test.eq(c.item_count, 5)
            test.eq(c.trashed_count, 1)
            local db = assert(store.open())
            local p = assert(store.product(db, h.id, id))
            db:release()
            h.call("apply", { items = { { product = { id = id }, expect_version = p.version, restore = true } } })
            c = catalog(h)
            test.eq(c.product_count, 9)
            test.eq(c.item_count, 6)
            test.eq(c.trashed_count, 0)
            trash(h, "RDG-moss-41")
            exec("UPDATE kickside_pim_product SET state_at = $1 WHERE catalog_id = $2 AND state = 'trashed'", { "2000-01-01T00:00:00Z", h.id })
            local out = fixture.retain()
            assert(out.success == true)
            settle(h)
            c = catalog(h)
            test.eq(c.product_count, 8)
            test.eq(c.trashed_count, 0)
        end)
    end)

    test.describe("attribute usage", function()
        test.it("counts products holding a set or cleared cell through every state change", function()
            local h = fixture.catalog()
            local made = h.call("apply", { items = { { product = { sku = "SOLO" }, create = { family = "generic" } } } })
            local id = made.outcomes[1].product_id
            local attr = (catalog(h).compiled.attributes["marketing.tagline"] :: types.Attribute).id
            local function used(): integer
                local db = assert(store.open())
                local usage = assert(store.usage(db, h.id))
                db:release()
                return usage[attr] and usage[attr].products or 0
            end
            local function rescope(): string
                local plan, err = h.call("plan_schema", { declaration = { aspects = { { namespace = "marketing", attributes = {
                    { code = "tagline", type = "kickside.pim.types:text", scope = { "locale" } } } } } } })
                test.is_nil(err)
                return plan.class
            end
            local function apply(item: { [string]: unknown }): types.Outcome
                local db = assert(store.open())
                local p = assert(store.product(db, h.id, id))
                db:release()
                item.product = { id = id }
                item.expect_version = p.version
                return h.call("apply", { items = { item } }).outcomes[1]
            end
            local ctx = { channel = "web", locale = "en" }
            test.eq(apply({ clear = { { attr = "marketing.tagline", ctx = ctx } } }).outcome, "updated")
            test.eq(used(), 1)
            test.eq(rescope(), "refused")
            test.eq(apply({ unset = { { attr = "marketing.tagline", ctx = ctx } } }).outcome, "updated")
            test.eq(used(), 0)
            test.eq(rescope(), "additive")
            test.eq(apply({ set = { { attr = "marketing.tagline", ctx = ctx, value = "Go" } } }).outcome, "updated")
            test.eq(used(), 1)
            test.eq(apply({ delete = true }).outcome, "updated")
            test.eq(used(), 0)
            test.eq(apply({ restore = true }).outcome, "updated")
            test.eq(used(), 1)
        end)
    end)

    test.describe("public meta", function()
        test.it("reports nothing published for a thread without a catalog", function()
            for _, fn in ipairs({ "kickside.pim.persist:publish_meta", "kickside.pim.persist:projection_committed" }) do
                local out, err = funcs.call(fn, { thread_id = uuid.v4() })
                test.is_nil(err, fn)
                test.eq(out.published, false, fn)
            end
        end)
    end)

    test.describe("descendant stamping", function()
        test.it("stamps every descendant whose resolved view a model edit changes", function()
            local h = fixture.catalog()
            fixture.boot(h)
            local root = h.call("get", { product = { sku = "RDG" } }).product
            local out = h.call("apply", { items = { { product = { sku = "RDG" }, expect_version = root.version,
                set = { { attr = "core.name", ctx = { locale = "en" }, value = "Ridgeline trail boot" } } } } })
            local seq = out.seq
            local db = assert(store.open())
            local rows = assert(db:query("SELECT updated_seq FROM kickside_pim_product WHERE catalog_id = $1 AND root_id = $2 AND product_id <> $3",
                { h.id, root.product_id, root.product_id }))
            db:release()
            test.eq(#rows, 8)
            for _, r in ipairs(rows) do test.eq(narrow.int(r.updated_seq), seq) end
        end)
    end)

    test.describe("event parsing", function()
        test.it("stops the fold at an event whose body breaks its declared schema", function()
            local h = fixture.catalog()
            fixture.boot(h)
            local page = assert(h.call("events", {}))
            local events: { types.RawEvent } = page.events
            local last = math.tointeger(tonumber(events[#events].seq)) :: integer
            local id = h.call("get", { product = { sku = "RDG-moss-40" } }).product.product_id
            for _, body in ipairs({
                { product_id = id, generation = 1, patch = "not a patch", actor = "a", at = "2026-01-01T00:00:00Z" },
                { product_id = id, generation = 1, patch = {}, actor = "a", at = "2026-01-01T00:00:00Z", surprise = true },
                { generation = 1, patch = {}, actor = "a", at = "2026-01-01T00:00:00Z" },
            } :: { { [string]: unknown } }) do
                local db = assert(store.open())
                local tx = assert(db:begin())
                local _, err = materializer.fold(tx, db:type(), h.id, { { seq = last + 1, type = "kickside.pim.events:product.changed", body = body } },
                    last + 1, 20000)
                tx:rollback()
                db:release()
                test.not_nil(err)
                test.eq((err :: error):details().code, "row_corrupt", tostring(err))
            end
        end)
    end)

    test.describe("fold budget", function()
        test.it("stops after the event that reaches the row budget and reports it", function()
            local h = fixture.catalog()
            fixture.boot(h)
            local page = assert(h.call("events", {}))
            local events: { types.RawEvent } = page.events
            local last = math.tointeger(tonumber(events[#events].seq)) :: integer
            local db = assert(store.open())
            local tx = assert(db:begin())
            local folded, err = materializer.fold(tx, db:type(), uuid.v4(), events, last, 3)
            tx:rollback()
            db:release()
            test.is_nil(err)
            local result = folded :: materializer.FoldResult
            test.is_true(result.last_seq < last)
        end)
    end)

    test.describe("rebuild slot", function()
        test.it("parks a failed rebuild, keeps reads rebuilding, and resumes when woken", function()
            local h = fixture.catalog()
            fixture.boot(h)
            local victim = h.call("get", { product = { sku = "RDG-slate-40" } }).product.product_id
            exec("UPDATE kickside_pim_product SET document = $1 WHERE catalog_id = $2 AND product_id = $3", { "{broken", h.id, victim })
            local out, err = h.call("apply_schema", { declaration = { aspects = { { namespace = "core", attributes = {
                { code = "care", type = "kickside.pim.types:text", default = "Wipe clean.", index = "key" } } } } } })
            test.is_nil(err)
            test.eq(out.class, "semantic")
            local parked = false
            local observed = nil
            for _ = 1, 50 do
                local job, qerr = h.call("query", { limit = 1 })
                test.is_nil(qerr, tostring(qerr))
                if job.rebuilding then
                    local c = catalog(h)
                    if c.rebuild_job then
                        local row, rerr = jobs.get_job(c.rebuild_job :: string)
                        observed = row
                        test.is_nil(rerr, tostring(rerr))
                        if row and row.last_error ~= nil and row.status == "pending" and row.scheduled_at == nil then
                            test.eq(row.execution_seq, 1)
                            local db = assert(store.open())
                            local runs, run_err = db:query("SELECT status FROM kickside_job_run WHERE job_id = $1 ORDER BY execution_seq", { c.rebuild_job })
                            assert(db:release())
                            test.is_nil(run_err, tostring(run_err))
                            test.eq(#runs, 1)
                            test.eq(runs[1].status, "failed")
                            parked = true
                            break
                        end
                    end
                end
                time.after("100ms"):receive()
            end
            test.is_true(parked, json.encode(observed))
            test.is_true(h.call("query", {}).rebuilding)
            local published, perr = h.executor:call("kickside.pim.persist:publish_meta", { thread_id = h.id })
            test.is_nil(perr, tostring(perr))
            test.is_true(published.published)
            local meta, merr = h.call("component_meta", {})
            test.is_nil(merr, tostring(merr))
            test.eq(meta.status, "rebuilding")
            test.not_nil(meta.rebuild_error)
            for _, request in ipairs({
                { where = { field = "core.care", op = "eq", value = "Wipe clean." } },
                { where = { ["or"] = { { field = "core.size", op = "eq", value = 40 },
                    { ["not"] = { field = "core.care", op = "is_null", value = true } } } } },
                { sort = { field = "core.care" } },
            } :: { { [string]: unknown } }) do
                local _, unready = h.call("query", request)
                test.not_nil(unready)
                test.eq((unready :: error):kind(), errors.UNAVAILABLE)
            end
            exec("UPDATE kickside_pim_product SET document = $1 WHERE catalog_id = $2 AND product_id = $3", { "{}", h.id, victim })
            local woke = h.call("rebuild", {})
            test.is_true(woke.rebuilding)
            local done = false
            for _ = 1, 100 do
                if not h.call("query", {}).rebuilding then done = true; break end
                time.after("100ms"):receive()
            end
            test.is_true(done)
            test.eq(#h.call("query", { where = { field = "core.care", op = "eq", value = "Wipe clean." } }).items, 6)
        end)
    end)
end

return { run = test.run_cases(define) }
