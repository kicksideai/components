-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local fixture = require("fixture")
local test = require("test")
local store = require("store")
local items = require("items")
local types = require("types")
local function define()
    test.describe("command state", function()
        test.it("restores with the current case insensitive axis key",function()
            local h=fixture.catalog()
            fixture.boot(h)
            local old=assert(h.call("get",{product={sku="RDG-moss-40"}})).product
            assert(h.call("apply",{items={{product={id=old.product_id},expect_version="any",delete=true}}}))
            local db=assert(store.open())
            local catalog=assert(store.catalog(db,h.id))
            -- Text axes are refused by today's compiler. Exercise re-admission
            -- against a captured compiled schema at the planner boundary.
            local attr=catalog.compiled.attributes["core.size"]
            attr.form="text";attr.index="key";attr.config={case="insensitive"}
            catalog.compiled.by_id[attr.id]=attr
            local function set_axis(sku:string,value:string,key:string)
                local row=assert(db:query("SELECT product_id,document FROM kickside_pim_product WHERE catalog_id=$1 AND sku=$2",{h.id,sku}))[1]
                local doc=assert(require("json").decode(row.document))
                doc[tostring(attr.id)][""].p=value
                assert(db:execute("UPDATE kickside_pim_product SET document=$1,axis_key=$2 WHERE catalog_id=$3 AND product_id=$4",{require("json").encode(doc),key,h.id,row.product_id}))
            end
            local current=tostring(require("hash").sha256("1:a"))
            set_axis("RDG-moss-40","A",tostring(require("hash").sha256("1:A")))
            set_axis("RDG-moss-41","a",current)
            local request={items={{product={id=old.product_id},expect_version="any",restore=true}}}
            local policy={audit="fields",audit_days=365,trash_days=30,tombstone_days=90}
            local refused=assert(items.plan(db,catalog,request,h.actor:id(),policy))
            test.eq(refused.outcomes[1].outcome,"conflict",require("json").encode(refused.outcomes[1]))
            assert(db:execute("UPDATE kickside_pim_product SET state='trashed' WHERE catalog_id=$1 AND sku='RDG-moss-41'",{h.id}))
            local restored=assert(items.plan(db,catalog,request,h.actor:id(),policy))
            assert(db:release())
            test.eq(restored.outcomes[1].outcome,"updated")
            test.eq(restored.events[1].body.axis_key,current)
        end)
        test.it("plans 260 creates with term references within two head reads", function()
            local h = fixture.catalog()
            fixture.seed_terms(h)
            local db = assert(store.open())
            local catalog = assert(store.catalog(db, h.id))
            local reads = 0
            local measured = {
                query = function(_self: unknown, statement: string, params: types.SqlParams?)
                    reads = reads + 1
                    return db:query(statement, params)
                end,
            }
            local list: { types.ApplyItem } = {}
            for i = 1, 260 do
                list[i] = { product = { sku = "budget-" .. i }, create = {}, set = {
                    { attr = "core.category", value = i % 2 == 0 and "hiking" or "footwear" },
                    { attr = "core.materials", value = { "nylon", "rubber" } },
                } }
            end
            local out, err = items.plan((measured :: unknown) :: types.Executor, catalog, { items = list }, h.actor:id(),
                { audit = "fields", audit_days = 365, trash_days = 30, tombstone_days = 90 })
            assert(db:release())
            test.is_nil(err, tostring(err))
            test.eq(#out.events, 260)
            for _, outcome in ipairs(out.outcomes) do test.eq(outcome.outcome, "created") end
            test.is_true(reads <= 2, "planning reads: " .. reads)
        end)

        test.it("validates term references against earlier accepted term and product items", function()
            local h = fixture.catalog()
            fixture.seed_terms(h)
            local out, err = h.call("apply", { mode = "independent", items = {
                { product = { sku = "too-early" }, create = {}, set = { { attr = "core.category", value = "new" } } },
                { term = { vocabulary = "categories", code = "new" }, labels = { en = "New" } },
                { product = { sku = "first" }, create = {}, set = { { attr = "core.category", value = "new" } } },
                { term = { vocabulary = "categories", code = "new" }, retired = true },
                { product = { sku = "second" }, create = {}, set = { { attr = "core.category", value = "new" } } },
                { term = { vocabulary = "categories", code = "hiking" }, retired = true },
                { product = { sku = "retired" }, create = {}, set = { { attr = "core.category", value = "hiking" } } },
            } })
            test.is_nil(err, tostring(err))
            for i, expected in ipairs({ "invalid", "created", "created", "invalid", "created", "updated", "invalid" }) do
                test.eq(out.outcomes[i].outcome, expected)
            end
            test.eq(out.outcomes[1].findings[1].code, "invalid_reference")
            test.eq(h.call("get", { product = { sku = "second" } }).values["core.category"].value.ref[2], "categories:new")
        end)

        test.it("refuses deleting a parent after accepting its child", function()
            local h = fixture.catalog()
            local out, err = h.call("apply", { items = {
                { product = { sku = "parent" }, create = { family = "footwear" } },
                { product = { sku = "child" }, create = { parent = { sku = "parent" } }, set = { { attr = "core.color", value = "moss" } } },
                { product = { sku = "parent" }, expect_version = 1, delete = true },
            } })
            test.is_nil(err)
            test.eq(out.outcomes[3].outcome, "invalid")
        end)
        test.it("refuses deleting a target after accepting a reference", function()
            local h = fixture.catalog()
            local created = assert(h.call("apply", { items = { { product = { sku = "target" }, create = {} } } }))
            local id = created.outcomes[1].product_id
            local out, err = h.call("apply", { items = {
                { product = { sku = "holder" }, create = {}, set = { { attr = "core.related", value = { { ref = { "product", id } } } } } },
                { product = { id = id }, expect_version = 1, delete = true },
            } })
            test.is_nil(err)
            test.eq(out.outcomes[2].outcome, "invalid")
        end)
    end)

end
return { run = test.run_cases(define) }
