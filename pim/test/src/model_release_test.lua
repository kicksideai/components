-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local fixture = require("fixture")
local scoped = require("scoped")
local time = require("time")
local jobs = require("jobs")
local store = require("store")

local function define()
    test.describe("model release jobs", function()
        test.it("refuses a reader's direct batch call before changing another catalog's task", function()
            local owner, reader = scoped.member(), scoped.member()
            local h = scoped.catalog(owner)
            assert(h.call("grant", { subject_id = reader.id, mask = 1 }))
            local db = assert(store.open())
            assert(db:execute([[INSERT INTO kickside_pim_release_job (catalog_id, request_id, model_id, root, identity, job_id, after_product, done)
                VALUES ($1, 'access-probe', 'model', 1, '{}', 'unclaimed', '', 0)]], { h.id }))
            db:release()
            local out, err = reader.call("release_model_batch", { request_id = "access-probe", deadline = "2090-01-01T00:00:00Z" }, h.id)
            local read = assert(store.open())
            local state = assert(read:query("SELECT done FROM kickside_pim_release_job WHERE catalog_id = $1 AND request_id = 'access-probe'", { h.id }))[1]
            assert(read:execute("DELETE FROM kickside_pim_release_job WHERE catalog_id = $1 AND request_id = 'access-probe'", { h.id }))
            read:release()
            test.is_nil(out)
            test.eq(err:kind(), errors.PERMISSION_DENIED)
            test.eq(tonumber(state.done), 0)
        end)

        test.it("returns one durable job reference and releases the model's ready items as the member", function()
            local h = scoped.catalog(scoped.member())
            fixture.boot(h)
            assert(h.call("apply", { items = { { product = { sku = "RDG-moss-40" }, expect_version = "any", status = "draft" } } }))
            local model = assert(h.call("get", { product = { sku = "RDG" } })).product
            local request = {trace_context={trace_id="model-trace",run_id="model-run",correlation_key="model-correlation"}, items = { { product = { id = model.product_id }, expect_version = model.version } },
                idempotency = { namespace = "test", key = "model-release" } }
            local first, err = h.call("release", request)
            test.is_nil(err, tostring(err))
            test.eq(first.outcomes[1].outcome, "queued")
            local job_id = first.outcomes[1].job_id
            test.not_nil(job_id)
            local replay = assert(h.call("release", request))
            test.eq(replay.outcomes[1].job_id, job_id)
            test.is_true(replay.replayed)
            local count = 0
            for _ = 1, 200 do
                count = #assert(h.call("list_publications", { channel = "web" })).items
                local job = assert(jobs.get_job(job_id))
                if count == 5 and job.status == "done" then break end
                time.after("50ms"):receive()
            end
            local db=assert(store.open())
            local rows=assert(db:query("SELECT trace_id,run_id,correlation_key FROM kickside_event WHERE thread_id=$1 AND type=$2",{h.id,"kickside.pim.events:product.released"}))
            for _,event in ipairs(rows) do
                test.eq(event.trace_id,"model-trace")
                test.eq(event.run_id,"model-run")
                test.eq(event.correlation_key,"model-correlation")
            end
            assert(db:release())
            test.eq(count, 5)
            test.eq(assert(jobs.get_job(job_id)).status, "done")
            test.eq(assert(jobs.get_job(job_id)).job_type, "kickside.pim.jobs:release_model")
            test.eq(#assert(h.call("list_releases", { product = { sku = "RDG-moss-40" } })).releases, 0)
        end)
    end)
end
return { run = test.run_cases(define) }
