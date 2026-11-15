-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local portable_result = require("portable_result")
local fs = require("fs")
local test = require("test")
local steps = require("steps")
local fixture = require("fixture")
local store = require("store")
local json = require("json")
local uuid = require("uuid")
local sql = require("sql")

type Map = { [string]: unknown }

local version = steps.version

local function define()
    test.describe("portability", function()
        test.it("replays a completed import as the same durable one shot",function()
            local source=fixture.catalog()
            test.eq(steps.one(source,{product={sku="ONCE"},create={}}).outcome,"created")
            local path="resume-"..source.id
            assert(source.call("portable",{method="export",args={storage_id="app:exports",path=path}}).success)
            local target=fixture.catalog({bare=true})
            local args={storage_id="app:exports",path=path}
            local first=assert(target.call("portable",{method="import_into",args=args}))
            test.is_true(first.success,json.encode(first))
            local again=assert(target.call("portable",{method="import_into",args=args}))
            test.is_true(again.success,json.encode(again))
            test.eq(json.encode(again.id_map.rows.pim_product),json.encode(first.id_map.rows.pim_product))
            local db=assert(store.open())
            local rows,err=db:query("SELECT job_id,done FROM kickside_pim_import_work WHERE catalog_id=$1",{target.id})
            assert(db:release())
            test.is_nil(err,tostring(err))
            test.eq(#rows,1)
            test.eq(tonumber(rows[1].done),1)
        end)
        test.it("resumes import after a committed product chunk",function()
            local source=fixture.catalog()
            for page=0,1 do
                local batch={}
                for n=1,500 do batch[n]={product={sku="RESUME-"..(page*500+n)},create={}} end
                assert(source.call("apply",{items=batch}).applied)
            end
            test.eq(steps.one(source,{product={sku="RESUME-LAST"},create={}}).outcome,"created")
            local path="partial-"..source.id
            assert(source.call("portable",{method="export",args={storage_id="app:exports",path=path}}).success)
            local storage=assert(fs.get("app:exports"))
            local file=path.."/data/products-000002.jsonl"
            local saved=assert(storage:readfile(file))
            assert(storage:writefile(file,"broken"))
            local target=fixture.catalog({bare=true})
            local args={storage_id="app:exports",path=path}
            local stopped=assert(target.call("portable",{method="import_into",args=args}))
            assert(storage:writefile(file,saved))
            test.is_false(stopped.success)
            local resumed=assert(target.call("portable",{method="import_into",args=args}))
            test.is_true(resumed.success,json.encode(resumed))
            test.not_nil(steps.get(target,"RESUME-LAST"))
            local other=target.call("portable",{method="import_into",args={storage_id="app:exports",path="resume-"..source.id}})
            test.is_false(other.success)
        end)
        test.it("exports a catalog and imports it into a new one with sources and references", function()
            local src = fixture.catalog()
            fixture.boot(src)
            local target = src.call("get", { product = { sku = "RDG-slate-40" } }).product.product_id
            src.call("apply", { source = "pricing", items = { { product = { sku = "RDG" }, seq = 1, set = { { attr = "pricing.retail", value = "189.00" } } } } })
            src.call("apply", { items = { { product = { sku = "RDG" }, expect_version = version(src, "RDG"),
                set = { { attr = "core.related", value = { { ref = { "product", target } } } } },
                clear = { { attr = "marketing.tagline", ctx = { channel = "marketplace", locale = "de" } } } } } })
            local path = "export-" .. uuid.v4()
            local exported, eerr = src.call("portable", { method = "export", args = { storage_id = "app:exports", path = path } })
            test.is_nil(eerr)
            test.eq(exported.success, true, json.encode(exported))
            test.eq(exported.manifest.counts.products, 9)

            local dst = fixture.catalog({ bare = true })
            local imported, ierr = dst.call("portable", { method = "import_into", args = { storage_id = "app:exports", path = path, id_map = {} } })
            test.is_nil(ierr)
            test.eq(imported.success, true, json.encode(imported))
            local map = imported.id_map.rows.pim_product
            test.not_nil(map[target])

            local root = dst.call("get", { product = { sku = "RDG" }, context = { locale = "de", channel = "marketplace" } })
            test.eq(root.values["core.name"].value, "Ridgeline Wanderstiefel")
            test.eq(root.values["pricing.retail"].source, "pricing")
            test.eq(root.values["core.related"].value[1].ref[2], map[target])
            test.eq(root.values["marketing.tagline"].state, "cleared")
            local item = dst.call("get", { product = { sku = "RDG-moss-41" } })
            test.eq(item.values["core.size"].value, 41)
            test.eq(item.values["core.color"].value.ref[2], "colors:moss")
            test.eq(#dst.call("query", { where = { field = "core.color", op = "eq", value = "slate" } }).items, 3)
            local terms = dst.call("apply", { items = { { term = { vocabulary = "categories", code = "hiking" }, parent = "footwear", labels = { en = "Hiking boots" } } } })
            test.eq(terms.outcomes[1].outcome, "unchanged")
        end)

        test.it("carries plugin choices and adopted scopes into the imported catalog", function()
            local src = fixture.catalog()
            local _, aerr = src.call("apply_schema", { declaration = {
                plugins = { { use = "app:shelf_plugin" } },
                scopes = { "app:stock_scope" } } , plugin_configs = { ["app:shelf_plugin"] = { location = "WH4" } } })
            test.is_nil(aerr)
            local path = "export-" .. uuid.v4()
            local exported = src.call("portable", { method = "export", args = { storage_id = "app:exports", path = path } })
            test.eq(exported.success, true, json.encode(exported))
            local dst = fixture.catalog({ bare = true })
            local imported = dst.call("portable", { method = "import_into", args = { storage_id = "app:exports", path = path, id_map = {} } })
            test.eq(imported.success, true, json.encode(imported))
            local schema = dst.call("get_schema", {})
            local shelf = fixture.plugins(dst)["app:shelf_plugin"]
            test.is_true(shelf.active)
            test.eq(shelf.config.location, "WH4")
            test.eq(fixture.plugin_entry(dst, "app:shelf_plugin").schema.digest, fixture.plugin_entry(src, "app:shelf_plugin").schema.digest)
            test.eq(schema.attributes["shelf.bin"].plugin, "app:shelf_plugin")
            test.is_true(schema.scopes["app:stock_scope"] == true)
        end)

        test.it("resolves provider plugin fields on the target and fails loudly when its store lacks them", function()
            local src = fixture.catalog()
            fixture.boot(src)
            local db = assert(sql.get("app:db"))
            assert(db:execute("CREATE TABLE IF NOT EXISTS pim_test_plugin_fields (owner_id TEXT NOT NULL, code TEXT NOT NULL, type TEXT NOT NULL, idx TEXT NOT NULL)", {}))
            assert(db:execute("INSERT INTO pim_test_plugin_fields (owner_id, code, type, idx) VALUES ($1, 'weight', 'kickside.pim.types:number', 'number')", { src.id }))
            db:release()
            test.is_nil((select(2, src.call("apply_schema", { declaration = { plugins = { { use = "app:dynamic_plugin" } } } }))))
            local set = src.call("apply", { items = { { product = { sku = "DYN-1" }, create = {}, set = { { attr = "dynamic.weight", value = "12" } } } } })
            test.eq(set.outcomes[1].outcome, "created", json.encode(set))
            local path = "export-" .. uuid.v4()
            test.eq(src.call("portable", { method = "export", args = { storage_id = "app:exports", path = path } }).success, true)

            local bare = fixture.catalog({ bare = true })
            local failed = bare.call("portable", { method = "import_into", args = { storage_id = "app:exports", path = path, id_map = {} } })
            test.eq(failed.success, false, json.encode(failed))
            test.is_true(tostring(failed.error):find("dynamic.weight", 1, true) ~= nil, tostring(failed.error))

            local dst = fixture.catalog({ bare = true })
            local db2 = assert(sql.get("app:db"))
            assert(db2:execute("INSERT INTO pim_test_plugin_fields (owner_id, code, type, idx) VALUES ($1, 'weight', 'kickside.pim.types:number', 'number')", { dst.id }))
            db2:release()
            local imported = dst.call("portable", { method = "import_into", args = { storage_id = "app:exports", path = path, id_map = {} } })
            test.eq(imported.success, true, json.encode(imported))
            local view = dst.call("get_schema", {})
            test.eq(view.attributes["dynamic.weight"].plugin, "app:dynamic_plugin")
            test.eq(dst.call("get", { product = { sku = "DYN-1" } }).values["dynamic.weight"].value.m, 12)
        end)
    end)

    test.describe("portability", function()
        test.it("reports malformed imported declarations as nonretryable invalid requests", function()
            local h = fixture.catalog()
            local path = "malformed-" .. uuid.v4()
            local storage = assert(fs.get("app:exports"))
            assert(storage:mkdir(path))
            assert(storage:mkdir(path .. "/data"))
            assert(storage:writefile(path .. "/data/schema.json", "42"))
            local out, err = h.call("portable", { method = "import_into", args = { storage_id = "app:exports", path = path } })
            test.is_nil(err)
            test.is_false(out.success)
            test.eq(out.kind, errors.INVALID)
            test.eq(out.details.code, "invalid_request")
            test.is_false(out.retryable)
        end)
        test.it("propagates file-existence refusals through durable import work",function()
            local h=fixture.catalog()
            local db=assert(store.open())
            assert(db:execute([[INSERT INTO kickside_pim_import_work(catalog_id,request_id,storage_id,path,identity,position,job_id,done)
                VALUES($1,'refused','refused','data','{}',$2,'manual',0)]],{h.id,json.encode({phase="products",file=1,offset=1,after=""})}))
            assert(db:release())
            local out,err=h.executor:call("app:import_batch_probe",{catalog_id=h.id})
            test.is_nil(out)
            test.eq(err:kind(),errors.PERMISSION_DENIED)
            test.eq(err:details().code,"storage_denied")
        end)
        test.it("streams several durable term batches using increasing byte cursors",function()
            local h=fixture.catalog()
            local path="term-stream-"..h.id
            local storage=assert(fs.get("app:exports"))
            assert(storage:mkdir(path));assert(storage:mkdir(path.."/data"))
            local lines={}
            for n=1,801 do lines[n]=json.encode({vocabulary="categories",code="stream-"..n,labels={en=string.rep("term",40)}}) end
            local content=table.concat(lines,"\n")
            assert(storage:writefile(path.."/data/terms.jsonl",content))
            local db=assert(store.open())
            assert(db:execute([[INSERT INTO kickside_pim_import_work(catalog_id,request_id,storage_id,path,identity,position,job_id,done)
                VALUES($1,'stream','app:exports',$2,'{}',$3,'manual',0)]],{h.id,path,json.encode({phase="terms",file=1,offset=1,after=""})}))
            local bytes,offset,batches=0,0,0
            for _=1,10 do
                local out,err=h.executor:call("app:import_batch_probe",{catalog_id=h.id})
                test.is_nil(err,tostring(err))
                test.eq(out.io.whole,0)
                test.eq(out.io.opens,1)
                test.eq(out.io.seeks[1],offset)
                bytes=bytes+out.io.bytes;batches=batches+1
                local pos=json.decode(assert(db:query("SELECT position FROM kickside_pim_import_work WHERE catalog_id=$1",{h.id}))[1].position)
                if pos.phase~="terms" then break end
                test.is_true(pos.offset>offset+1)
                offset=pos.offset-1
            end
            local count=tonumber(assert(db:query("SELECT COUNT(*) AS n FROM kickside_pim_term WHERE catalog_id=$1 AND code LIKE 'stream-%'",{h.id}))[1].n)
            assert(db:release())
            test.eq(count,801)
            test.is_true(batches>=5)
            test.is_true(bytes<#content*2,"linear read volume")
        end)
        test.it("retains native fields in portable failure envelopes", function()
            local refused = errors.new({ kind = errors.PERMISSION_DENIED, message = "read refused", retryable = false, details = { code = "storage_denied" } })
            local result = portable_result.failure(refused)
            test.is_false(result.success)
            test.eq(result.kind, errors.PERMISSION_DENIED)
            test.eq(result.details.code, "storage_denied")
            test.is_false(result.retryable)
        end)
        test.it("requests a read-only repeatable snapshot on PostgreSQL", function()
            local h = fixture.catalog()
            local out, _, err = store.snapshot(h.id, function(tx, catalog, dialect)
                if dialect == sql.type.POSTGRES then
                    local rows = assert(tx:query("SELECT current_setting('transaction_isolation') AS isolation, current_setting('transaction_read_only') AS readonly"))
                    test.eq(rows[1].isolation, "repeatable read")
                    test.eq(rows[1].readonly, "on")
                end
                return catalog.applied_seq, nil
            end)
            test.is_nil(err)
            test.not_nil(out)
        end)
    end)

end

return { run = test.run_cases(define) }
