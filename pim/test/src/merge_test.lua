-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local store = require("store")
local funcs = require("funcs")
local merge_rows = require("merge_rows")
local clock = require("clock")
-- Term merge (spec 6): retire a term and re-point every value referencing
-- it, up to 500 products in the command and the rest through the term merge
-- job as the asking actor; axes and source-only aspects are refused.
local test = require("test")
local fixture = require("fixture")
local scoped = require("scoped")
local steps = require("steps")
local types = require("types")
local sql = require("sql")
local json = require("json")
local time = require("time")

type Map = { [string]: unknown }

local function merge(h: fixture.Handle, vocabulary: string, from: string, into: string, source: string?): (types.Outcome?, error?)
    local out, err = h.call("apply", { source = source, items = { { term_merge = { vocabulary = vocabulary, from = from, into = into } } } })
    if err then return nil, err end
    return (out :: types.ApplyResult).outcomes[1], nil
end

-- count counts the items whose resolved field holds value: has for a set, eq otherwise.
local function count(h: fixture.Handle, field: string, value: string, op: string?): integer
    local out, err = h.call("query", { where = { field = field, op = op or "eq", value = value }, limit = 200 })
    assert(not err, tostring(err))
    return #(out :: { items: { Map } }).items
end

local function pending_rows(catalog_id: string): integer
    local db = assert(sql.get("app:db"))
    local rows, err = db:query("SELECT COUNT(*) AS n FROM kickside_pim_merge WHERE catalog_id = $1", { catalog_id })
    db:release()
    assert(not err, tostring(err))
    return math.tointeger(tonumber((rows :: { { n: unknown } })[1].n)) or 0
end

local function define()
    test.describe("term merge", function()
        test.it("validates holders beyond the first merge page before retirement",function()
            local h=fixture.catalog()
            assert(h.call("apply_schema", { declaration = { aspects = {
                { namespace = "pricing", write = { sources = { "pricing" } }, attributes = {
                    { code = "category", type = "kickside.pim.types:select", vocabulary = "categories" },
                } },
                { namespace = "probe", attributes = {
                    { code = "term", type = "kickside.pim.types:select", vocabulary = "categories", unique = true, index = "key" },
                } },
            } } }))
            for first=1,500,100 do
                local batch={}
                for n=first,first+99 do batch[#batch+1]={product={sku="BULK-"..n},create={},set={{attr="core.category",value="hiking"}}} end
                assert(h.call("apply",{items=batch}))
            end
            assert(h.call("apply",{source="pricing",items={{product={sku="LAST"},create={},seq=1,set={{attr="pricing.category",value="hiking"}}}}}))
            local before=assert(h.call("get_schema",{})).as_of
            local out=assert(merge(h,"categories","hiking","footwear"))
            test.eq(out.outcome,"forbidden")
            test.eq(assert(h.call("get_schema",{})).as_of,before)

            assert(h.call("apply", { source = "pricing", items = {
                { product = { sku = "LAST" }, seq = 2, unset = { { attr = "pricing.category" } } },
            } }))
            local claims = assert(h.call("apply", { items = {
                { product = { sku = "LAST" }, expect_version = "any", set = { { attr = "probe.term", value = "hiking" } } },
                { product = { sku = "CLAIM" }, create = {}, set = { { attr = "probe.term", value = "footwear" } } },
            } }))
            test.is_true(claims.applied)
            before = assert(h.call("get_schema", {})).as_of
            local rejected = assert(h.call("apply", { mode = "independent", items = {
                { term_merge = { vocabulary = "categories", from = "hiking", into = "footwear" } },
                { product = { sku = "BULK-1" }, expect_version = 1, status = "draft" },
            } }))
            test.eq(rejected.outcomes[1].outcome, "conflict")
            test.eq(rejected.outcomes[2].outcome, "updated")
            test.eq(rejected.seq, before + 1)
            test.eq((assert(steps.get(h, "BULK-1")).values["core.category"].value :: types.Ref).ref[2], "categories:hiking")
        end)
        test.it("refuses an outstanding merge retarget before append",function()
            local h=fixture.catalog()
            assert(h.call("apply",{items={{term={vocabulary="colors",code="clay"},retired=true}}}))
            local db=assert(store.open())
            assert(not merge_rows.record(db,{catalog_id=h.id,vocabulary="colors",from="clay",into="sand",identity={},requested_by=h.actor:id(),created_at=clock.now()}))
            assert(db:release())
            local before=assert(h.call("get_schema",{})).as_of
            local out=assert(merge(h,"colors","clay","moss"))
            test.eq(out.outcome,"conflict")
            test.eq(assert(h.call("get_schema",{})).as_of,before)
        end)
        test.it("keeps a pending merge destination across term label edits",function()
            local h=fixture.catalog()
            local before=assert(h.call("get_schema",{})).as_of
            local out=assert(h.call("apply",{mode="atomic",items={
                {term_merge={vocabulary="colors",from="clay",into="sand"}},
                {term={vocabulary="colors",code="clay"},labels={en="Clay label"}},
                {term_merge={vocabulary="colors",from="clay",into="moss"}},
            }}))
            test.is_false(out.applied)
            test.eq(out.outcomes[3].outcome,"conflict")
            test.eq(assert(h.call("get_schema",{})).as_of,before)
        end)
        test.it("retires the term and re-points single and set values, keeping one copy in a set", function()
            local h = fixture.catalog()
            fixture.boot(h)
            test.eq(steps.set(h, "RDG-slate", "core.materials", { "nylon" }).outcome, "updated")
            test.eq(count(h, "core.materials", "nylon", "has"), 6)
            local out = assert(merge(h, "materials", "nylon", "rubber"))
            test.eq(out.outcome, "updated", json.encode(out))
            test.eq(out.term, "materials:nylon")
            test.eq(out.rewritten, 2)
            test.eq(out.deferred, 0)
            test.eq(count(h, "core.materials", "nylon", "has"), 0)
            test.eq(count(h, "core.materials", "rubber", "has"), 6)
            local moss = assert(steps.get(h, "RDG-moss")).values["core.materials"].value :: { Map }
            test.eq(#moss, 1)
            test.eq((moss[1].ref :: { string })[2], "materials:rubber")
            test.eq(steps.set(h, "RDG-slate", "core.materials", { "nylon" }).outcome, "invalid")
            local cat = assert(merge(h, "categories", "hiking", "footwear"))
            test.eq(cat.rewritten, 1)
            test.eq((assert(steps.get(h, "RDG")).values["core.category"].value :: Map).ref[2], "categories:footwear")
        end)

        test.it("refuses unknown or retired terms, self merges, axis attributes and source-only aspects", function()
            local h = fixture.catalog()
            fixture.boot(h)
            for _, case in ipairs({ { "materials", "nylon", "nylon" }, { "materials", "nope", "rubber" }, { "materials", "nylon", "nope" }, { "nope", "a", "b" } }) do
                local out = assert(merge(h, case[1], case[2], case[3]))
                test.eq(out.outcome, "invalid", json.encode(case))
            end
            local axis = assert(merge(h, "colors", "moss", "slate"))
            test.eq(axis.outcome, "invalid")
            test.is_true(tostring(assert(axis.findings)[1].message):find("variation axis core.color", 1, true) ~= nil)
            test.is_nil((select(2, h.call("apply_schema", { declaration = { aspects = { { namespace = "pricing", write = { sources = { "pricing" } }, attributes = {
                { code = "retail", type = "kickside.pim.types:number", index = "number", config = { scale = 2 } },
                { code = "tone", type = "kickside.pim.types:select", vocabulary = "colors" } } } } } }))))
            test.eq(h.call("apply", { source = "pricing", items = { { product = { sku = "RDG" }, seq = 1, set = { { attr = "pricing.tone", value = "clay" } } } } }).outcomes[1].outcome, "updated")
            local forbidden = assert(merge(h, "colors", "clay", "sand"))
            test.eq(forbidden.outcome, "forbidden", json.encode(forbidden))
            test.eq((assert(steps.get(h, "RDG")).values["pricing.tone"].value :: Map).ref[2], "colors:clay")
            local allowed = assert(merge(h, "colors", "clay", "sand", "pricing"))
            test.eq(allowed.outcome, "updated", json.encode(allowed))
            test.eq((assert(steps.get(h, "RDG")).values["pricing.tone"].value :: Map).ref[2], "colors:sand")
            local _, proposal = h.call("propose", { items = { { term_merge = { vocabulary = "colors", from = "sand", into = "moss" } } } })
            test.not_nil(proposal)
        end)

        test.it("runs enforced checks before accepting generated product edits", function()
            local h = fixture.catalog()
            fixture.boot(h)
            local family = assert(json.decode(assert(json.encode(fixture.DECLARATION.families[1])))) :: types.FamilyDecl
            family.checks = { { check = "app:actor_check", reads = { "core.category" }, enforce = "write" } }
            local _, err = h.call("apply_schema", { declaration = { families = { family } } })
            test.is_nil(err)
            local before = assert(h.call("query", {})).as_of
            local out = assert(merge(h, "categories", "hiking", "footwear"))
            test.eq(out.outcome, "invalid")
            test.eq(assert(out.findings)[1].check, "app:actor_check")
            test.eq(assert(h.call("query", {})).as_of, before)
            test.eq(pending_rows(h.id), 0)
            local db = assert(store.open())
            local term = assert(store.term(db, h.id, "categories", "hiking"))
            assert(db:release())
            test.eq(term.retired, 0)
            test.eq((assert(steps.get(h, "RDG")).values["core.category"].value :: types.Ref).ref[2], "categories:hiking")
        end)

        test.it("finishes a merge of more than 500 products through the job, as the asking actor", function()
            local h = scoped.catalog(scoped.member())
            fixture.seed_terms(h)
            -- Keep setup within one projection page per command. The merge
            -- below still exercises a full rewrite page and its deferred tail.
            for first = 1, 520, 100 do
                local items: { Map } = {}
                for i = first, math.min(first + 99, 520) do
                    items[#items + 1] = { product = { sku = "S-" .. i }, create = {}, set = { { attr = "core.category", value = "hiking" } } }
                end
                local applied, err = h.call("apply", { items = items })
                assert(not err, tostring(err))
                test.is_true((applied :: types.ApplyResult).applied, json.encode((applied :: types.ApplyResult).outcomes[1]))
            end
            test.eq(count(h, "core.category", "hiking"), 200)
            local page_db = assert(store.open())
            local page_deadline = clock.deadline(5000)
            local page, page_err = merge_rows.references(page_db, h.id, "term", "categories:hiking", 500)
            local page_late = clock.passed(page_deadline)
            assert(page_db:release())
            test.is_nil(page_err, tostring(page_err))
            test.eq(#page, 500)
            test.is_false(page_late, "selecting a merge page exceeds the 5 s command deadline")
            local rejected, reject_err = h.call("apply", { mode = "atomic", items = {
                { term_merge = { vocabulary = "categories", from = "hiking", into = "footwear" } },
                { product = { sku = "missing" }, expect_version = "any", delete = true },
            } })
            test.is_nil(reject_err)
            test.is_false(rejected.applied)
            test.eq(pending_rows(h.id), 0)
            test.eq(count(h, "core.category", "hiking"), 200)
            local controlled, control_err = h.call("plan_fold_merge", { source = "erp" })
            test.is_nil(control_err, tostring(control_err))
            test.eq(controlled.outcomes[1].rewritten, 500)
            test.eq(controlled.outcomes[1].deferred, 20)
            test.eq(controlled.pending.requested_by, h.actor:id())
            test.eq(controlled.pending.source, "erp")
            test.eq(controlled.pending.identity.principal.id, h.actor:id())
            test.eq(#controlled.jobs, 1)
            test.eq(controlled.jobs[1].status, "pending")
            test.eq(tonumber(controlled.jobs[1].max_attempts), 5)
            test.eq(pending_rows(h.id), 0)
            local before_revoked = assert(h.call("query", {})).as_of
            local controlled_db = assert(store.open())
            assert(not merge_rows.record(controlled_db, controlled.pending))
            assert(controlled_db:execute("UPDATE app_users SET status = 'suspended' WHERE user_id = $1", { h.actor:id() }))
            assert(controlled_db:release())
            local refused, rerr = funcs.call("app:controlled_term_merge", {
                job = { id = "controlled-merge", lease_token = "lease", execution_seq = 1, deadline = clock.offset(60) },
                payload = { catalog_id = h.id, vocabulary = "categories", from = "hiking" },
            })
            controlled_db = assert(store.open())
            local still_pending = assert(merge_rows.get(controlled_db, h.id, "categories", "hiking"))
            assert(controlled_db:execute("UPDATE app_users SET status = 'active' WHERE user_id = $1", { h.actor:id() }))
            assert(not merge_rows.delete(controlled_db, h.id, "categories", "hiking"))
            assert(controlled_db:release())
            test.is_nil(refused)
            test.not_nil(rerr)
            test.eq(rerr:kind(), errors.PERMISSION_DENIED)
            test.is_false(rerr:retryable())
            test.eq(still_pending.requested_by, h.actor:id())
            test.eq(assert(h.call("query", {})).as_of, before_revoked)
            test.eq(count(h, "core.category", "hiking"), 200)
            local out = assert(merge(h, "categories", "hiking", "footwear", "erp"))
            test.eq(out.outcome, "updated", json.encode(out))
            test.eq(out.rewritten, 500)
            test.eq(out.deferred, 20)
            local remaining = -1
            for _ = 1, 600 do
                remaining = count(h, "core.category", "hiking")
                if remaining == 0 and pending_rows(h.id) == 0 then break end
                time.after("50ms"):receive()
            end
            test.eq(remaining, 0)
            test.eq(pending_rows(h.id), 0)
            test.eq((h.call("query", { where = { field = "core.category", op = "eq", value = "footwear" }, limit = 1, count = true }) :: Map).total, 520)
            local db = assert(store.open())
            local edits = assert(db:query("SELECT actor, source, seq FROM kickside_pim_change WHERE catalog_id = $1 AND kind = 'set' AND source = 'erp' ORDER BY seq DESC", { h.id }))
            assert(db:release())
            test.eq(#edits, 520)
            for _, row in ipairs(edits) do
                test.eq(row.actor, h.actor:id())
                test.eq(row.source, "erp")
            end
        end)
    end)
    test.describe("merge", function()
        test.it("validates merge rewrites against unique claims before append", function()
            local h = fixture.catalog()
            assert(h.call("apply_schema", { declaration = { aspects = { { namespace = "probe", attributes = {
                { code = "term", type = "kickside.pim.types:select", vocabulary = "categories", unique = true, index = "key" },
            } } } } }))
            assert(h.call("apply", { items = {
                { product = { sku = "from" }, create = {}, set = { { attr = "probe.term", value = "hiking" } } },
                { product = { sku = "into" }, create = {}, set = { { attr = "probe.term", value = "footwear" } } },
            } }))
            local out, err = h.call("apply", { items = { { term_merge = { vocabulary = "categories", from = "hiking", into = "footwear" } } } })
            test.is_nil(err)
            test.eq(out.outcomes[1].outcome, "conflict")
            test.eq(h.call("get", { product = { sku = "from" } }).values["probe.term"].value.ref[2], "categories:hiking")
        end)
        test.it("merges the pending term without discarding earlier labels", function()
            local h = fixture.catalog()
            local out, err = h.call("apply", { items = {
                { term = { vocabulary = "categories", code = "batch_merge" }, labels = { en = "Batch merge" } },
                { term_merge = { vocabulary = "categories", from = "batch_merge", into = "footwear" } },
            } })
            test.is_nil(err)
            test.eq(out.outcomes[2].outcome, "updated")
            local db = assert(store.open())
            local term = assert(store.term(db, h.id, "categories", "batch_merge"))
            db:release()
            test.eq(term.labels.en, "Batch merge")
            test.eq(term.retired, 1)
        end)
        test.it("merges references as earlier accepted items leave them", function()
            local h = fixture.catalog()
            assert(h.call("apply", { items = {
                { product = { sku = "changed" }, create = {}, set = { { attr = "core.category", value = "hiking" } } },
            } }))
            local out, err = h.call("apply", { items = {
                { product = { sku = "changed" }, expect_version = 1, set = { { attr = "core.category", value = "footwear" } } },
                { product = { sku = "created" }, create = {}, set = { { attr = "core.category", value = "hiking" } } },
                { term_merge = { vocabulary = "categories", from = "hiking", into = "footwear" } },
            } })
            test.is_nil(err)
            test.eq(out.outcomes[3].outcome, "updated")
            test.eq(out.outcomes[3].rewritten, 1)
            test.eq(h.call("get", { product = { sku = "created" } }).values["core.category"].value.ref[2], "categories:footwear")
            test.eq(h.call("get", { product = { sku = "changed" } }).product.version, 2)
        end)
    end)

end

return { run = test.run_cases(define) }
