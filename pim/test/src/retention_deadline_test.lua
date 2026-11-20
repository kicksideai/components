-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local fixture = require("fixture")
local store = require("store")
local clock = require("clock")
local funcs = require("funcs")
local time = require("time")
local retention_service = require("retention_service")
local retention_rows = require("retention_rows")
local defaults = require("defaults")
local function define()
    test.describe("retention eligibility deadlines", function()
        test.it("collects future trash through the real retention service without another write or wake", function()
            local h = fixture.catalog()
            assert(h.call("apply_schema", { declaration = { policy = { trash_days = 1 } } }))
            assert(h.call("apply", { items = { { product = { sku = "DEADLINE" }, create = { family = "generic" } } } }))
            assert(h.call("apply", { items = { { product = { sku = "DEADLINE" }, expect_version = "any", delete = true } } }))
            local db = assert(store.open())
            assert(db:execute("UPDATE kickside_pim_product SET state_at=$1 WHERE catalog_id=$2 AND sku='DEADLINE'", { clock.offset(-86400 + 2), h.id }))
            db:release()
            local collected, err = retention_service.observe(function(): (boolean?, error?)
                local db, derr = store.open()
                if derr then return nil, derr end
                local rows, rerr = db:query("SELECT state FROM kickside_pim_product WHERE catalog_id=$1 AND sku='DEADLINE'", { h.id })
                db:release()
                if rerr then return nil, rerr end
                return rows[1].state == "purged", nil
            end)
            test.is_nil(err, tostring(err))
            test.is_true(collected)

        end)
        test.it("reports the next future row eligibility after a complete owner pass", function()
            local h = fixture.catalog()
            assert(h.call("apply_schema", { declaration = { policy = { trash_days = 1 } } }))
            assert(h.call("apply", { items = { { product = { sku = "FUTURE" }, create = { family = "generic" } } } }))
            assert(h.call("apply", { items = { { product = { sku = "FUTURE" }, expect_version = "any", delete = true } } }))
            local before = math.floor(time.now():unix_nano() / 1000000)
            local report = assert(fixture.retain())
            test.not_nil(report.deadline_ms)
            test.is_true(report.deadline_ms > before)
            test.is_true(report.deadline_ms <= before + 86401000)
        end)
        test.it("uses only future eligibility for work, proposals and publication withdrawals", function()
            local h = fixture.catalog({ bare = true })
            local policy = assert(defaults.catalog(h.id))
            local classes = {
                { name = "import_work", days = policy.import_days, insert =
                    [[INSERT INTO kickside_pim_import_work(catalog_id,request_id,storage_id,path,identity,position,job_id,done,completed_at)
                        VALUES($1,$2,'storage','path','{}','{}','job',1,$3)]] },
                { name = "proposal", days = policy.proposal_days, insert =
                    [[INSERT INTO kickside_pim_proposal(catalog_id,proposal_id,origin,items,base,generation,status,created_by,created_at)
                        VALUES($1,$2,'{}','[]','{}',1,'pending','fixture',$3)]] },
                { name = "release_job", days = policy.abandoned_work_days, insert =
                    [[INSERT INTO kickside_pim_release_job(catalog_id,request_id,model_id,root,identity,job_id,after_product,done,created_at)
                        VALUES($1,$2,'product',1,'{}','job','',0,$3)]] },
                { name = "publication", days = policy.audit_days, insert =
                    [[INSERT INTO kickside_pim_publication(catalog_id,channel,product_id,state,seq,updated_at)
                        VALUES($1,'web',$2,'withdrawn',1,$3)]] },
            }
            local db = assert(store.open())
            for _, class in ipairs(classes) do
                local seconds = class.days * 86400
                local old = clock.offset(-seconds - 120)
                local future = clock.offset(-seconds + 120)
                assert(db:execute(class.insert, { h.id, "expired", old }))
                if class.name == "import_work" then
                    local before, err = retention_rows.deadline(db, h.id, policy)
                    test.is_nil(err, tostring(err))
                    test.is_true(before == nil or before > clock.millis() + 120000)
                    assert(db:execute("DELETE FROM kickside_pim_import_work WHERE catalog_id=$1", { h.id }))
                end
                assert(db:execute(class.insert, { h.id, "future", future }))
                local instant = assert(time.parse(time.RFC3339, future))
                local expected = math.floor(instant:unix_nano() / 1000000) + seconds * 1000 + 1000
                local deadline, err = retention_rows.deadline(db, h.id, policy)
                test.is_nil(err, tostring(err))
                test.eq(deadline, expected, class.name)
                assert(db:execute("DELETE FROM kickside_pim_" .. class.name .. " WHERE catalog_id=$1", { h.id }))
            end
            assert(db:release())
        end)
    end)
end
return { run = test.run_cases(define) }
