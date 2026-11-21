-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local fixture = require("fixture")
local scoped = require("scoped")
local time = require("time")
local jobs = require("jobs")
local store = require("store")

local function await_done(job_id: string)
    for _ = 1, 200 do
        if assert(jobs.get_job(job_id)).status == "done" then return end
        time.after("50ms"):receive()
    end
    test.eq(assert(jobs.get_job(job_id)).status, "done")
end

local function queue_fixture(catalog_id: string, scheduled_at: string?): string
    local db = assert(store.open())
    local tx = assert(db:begin())
    local request_id = "release-status"
    local job = assert(jobs.enqueue_tx(tx, db:type(), { namespace = "pim", scope = catalog_id, key = request_id,
        owner_locator = { kind = "component", id = catalog_id }, job_type = "kickside.pim.jobs:release_model",
        max_attempts = 1, scheduled_at = scheduled_at, immutable_payload = { catalog_id = catalog_id, request_id = request_id } }))
    assert(tx:execute([[INSERT INTO kickside_pim_release_job (catalog_id, request_id, model_id, root, identity, job_id, after_product, done)
        VALUES ($1, $2, 'model', 1, '{}', $3, 'last-on-page', 0)]], { catalog_id, request_id, job.id }))
    assert(tx:commit())
    assert(db:release())
    return job.id :: string
end

local function define()
    test.describe("model release jobs", function()
        test.it("returns one job for the same model version within a batch and across active requests", function()
            local h = scoped.catalog(scoped.member())
            fixture.boot(h)
            local model = assert(h.call("get", { product = { sku = "RDG" } })).product
            local item = { product = { id = model.product_id }, expect_version = model.version, channels = { "web" } }
            local repeated = { product = item.product, expect_version = item.expect_version }
            local first = assert(h.call("release", { items = { item, item }, idempotency = { namespace = "test", key = "first" } }))
            local job = first.outcomes[1]
            test.not_nil(job.job_id)
            test.eq(first.outcomes[2].job_id, job.job_id, "a batch queues the same model version only once")
            test.eq(first.outcomes[2].request_id, job.request_id)
            await_done(job.job_id)

            local function status(value: string)
                local db = assert(store.open())
                assert(db:execute([[UPDATE kickside_job SET status=$1, scheduled_at='2090-01-01T00:00:00Z',
                    lease_until='2090-01-01T00:00:00Z' WHERE id=$2]], { value, job.job_id }))
                assert(db:release())
            end
            for _, state in ipairs({ "pending", "running" }) do
                status(state)
                local duplicate = assert(h.call("release", { items = { repeated },
                    idempotency = { namespace = "test", key = state } }))
                status("done")
                test.eq(duplicate.outcomes[1].request_id, job.request_id)
                test.eq(duplicate.outcomes[1].job_id, job.job_id)
                test.is_false(duplicate.applied)
            end
            local later = assert(h.call("release", { items = { item } })).outcomes[1]
            test.not_nil(later.job_id)
            test.is_true(later.job_id ~= job.job_id, "a terminal job leaves the version free to release again")
            await_done(later.job_id)
            local replay = assert(h.call("release", { items = { repeated },
                idempotency = { namespace = "test", key = "pending" } }))
            test.is_true(replay.replayed)
            test.eq(replay.outcomes[1].job_id, job.job_id)

            status("running")
            local edit = assert(h.call("apply", { items = { { product = item.product, expect_version = item.expect_version,
                set = { { attr = "core.care", value = "A newer model version" } } } } }))
            local next_version = assert(h.call("release", { items = { { product = item.product, expect_version = edit.outcomes[1].version } } })).outcomes[1]
            status("done")
            test.eq(next_version.outcome, "queued")
            test.is_true(next_version.job_id ~= job.job_id, "versions of the same model have separate active jobs")
            await_done(next_version.job_id)
        end)

        test.it("replays model job IDs after completed-work retention removes their rows", function()
            local h = scoped.catalog(scoped.member())
            fixture.boot(h)
            local items = {}
            for _, sku in ipairs({ "RDG-moss-40", "RDG-moss", "RDG-slate" }) do
                local product = assert(h.call("get", { product = { sku = sku } })).product
                items[#items + 1] = { product = { id = product.product_id }, expect_version = product.version, channels = { "web" } }
            end
            local request = { items = items, idempotency = { namespace = "test", key = "retained-receipt" } }
            local first = assert(h.call("release", request))
            test.eq(first.outcomes[1].outcome, "released")
            for i = 2, 3 do
                test.eq(first.outcomes[i].outcome, "queued")
                await_done(first.outcomes[i].job_id)
            end
            local db = assert(store.open())
            assert(db:execute("UPDATE kickside_pim_release_job SET completed_at='2000-01-01T00:00:00Z' WHERE catalog_id=$1", { h.id }))
            assert(db:release())
            test.is_true(assert(fixture.retain()).success)
            db = assert(store.open())
            local rows = assert(db:query("SELECT request_id FROM kickside_pim_release_job WHERE catalog_id=$1", { h.id }))
            assert(db:release())
            test.eq(#rows, 0)

            local replay, err = h.call("release", request)
            test.is_nil(err, tostring(err))
            test.is_true(replay.replayed)
            test.eq(replay.seq, first.seq)
            for i = 1, 3 do
                test.eq(replay.outcomes[i].outcome, first.outcomes[i].outcome)
                test.eq(replay.outcomes[i].request_id, first.outcomes[i].request_id)
                test.eq(replay.outcomes[i].job_id, first.outcomes[i].job_id)
            end
        end)

        test.it("refuses a batch after its requester loses WRITE and leaves the task untouched", function()
            local owner, reader = scoped.member(), scoped.member()
            local h = scoped.catalog(owner)
            assert(h.call("grant", { subject_id = reader.id, mask = 3 }))
            local db = assert(store.open())
            assert(db:execute([[INSERT INTO kickside_pim_release_job (catalog_id, request_id, model_id, root, identity, job_id, after_product, done)
                VALUES ($1, 'access-probe', 'model', 1, '{}', 'unclaimed', '', 0)]], { h.id }))
            db:release()
            assert(h.call("grant", { subject_id = reader.id, mask = 1 }))
            local out, err = reader.call("release_model_batch", { request_id = "access-probe", deadline = "2090-01-01T00:00:00Z" }, h.id)
            local read = assert(store.open())
            local state = assert(read:query("SELECT done FROM kickside_pim_release_job WHERE catalog_id = $1 AND request_id = 'access-probe'", { h.id }))[1]
            assert(read:execute("DELETE FROM kickside_pim_release_job WHERE catalog_id = $1 AND request_id = 'access-probe'", { h.id }))
            read:release()
            test.is_nil(out)
            test.eq(err:kind(), errors.PERMISSION_DENIED)
            test.eq(tonumber(state.done), 0)
        end)

        test.it("returns one durable job reference and records model releases as the requesting administrator", function()
            local h = scoped.catalog(scoped.member())
            fixture.boot(h)
            local requester = scoped.member()
            assert(h.call("grant", { subject_id = requester.id, mask = 11 }))
            assert(h.call("apply", { items = { { product = { sku = "RDG-moss-40" }, expect_version = "any", status = "draft" } } }))
            local model = assert(h.call("get", { product = { sku = "RDG" } })).product
            local request = {trace_context={trace_id="model-trace",run_id="model-run",correlation_key="model-correlation"}, items = { { product = { id = model.product_id }, expect_version = model.version } },
                idempotency = { namespace = "test", key = "model-release" } }
            local first, err = requester.call("release", request, h.id)
            test.is_nil(err, tostring(err))
            test.eq(first.outcomes[1].outcome, "queued")
            local job_id = first.outcomes[1].job_id
            test.not_nil(job_id)
            local replay = assert(requester.call("release", request, h.id))
            test.eq(replay.outcomes[1].job_id, job_id)
            test.is_true(replay.replayed)
            local ref = { request_id = first.outcomes[1].request_id }
            local status, status_err = requester.call("get_model_release", ref, h.id)
            assert(status, tostring(status_err))
            test.eq(status.job_id, job_id)
            test.eq(status.request_id, ref.request_id)
            test.eq(status.model_id, model.product_id)
            local elsewhere = scoped.catalog(requester)
            local missing, missing_err = elsewhere.call("get_model_release", ref)
            test.is_nil(missing)
            test.eq(missing_err:kind(), errors.NOT_FOUND)
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
            local completed = assert(requester.call("get_model_release", ref, h.id))
            test.eq(completed.status, "done")
            test.not_nil(completed.after_product)
            test.eq(assert(jobs.get_job(job_id)).job_type, "kickside.pim.jobs:release_model")
            test.eq(#assert(h.call("list_releases", { product = { sku = "RDG-moss-40" } })).releases, 0)
            local history = assert(h.call("list_history", { limit = 10 }))
            local released = 0
            for _, entry in ipairs(history.entries) do
                if entry.kind == "released" then
                    test.eq(entry.actor, requester.id)
                    released = released + 1
                end
            end
            test.eq(released, 5)
        end)

        test.it("exposes queued page progress and cancellation to catalog readers over HTTP", function()
            local owner, reader = scoped.member(), scoped.member()
            local h = scoped.catalog(owner)
            assert(h.call("grant", { subject_id = reader.id, mask = 1 }))
            local job_id = queue_fixture(h.id, "2090-01-01T00:00:00Z")
            local request = { request_id = "release-status" }
            local queued = reader.invoke(h.id, "get_model_release", request)
            test.eq(queued.status, 200)
            test.eq(queued.body.data.job_id, job_id)
            test.eq(queued.body.data.status, "queued")
            test.eq(queued.body.data.after_product, "last-on-page")
            test.is_nil(queued.body.data.identity)
            test.is_true(assert(jobs.cancel(job_id)).canceled)
            test.eq(assert(reader.call("get_model_release", request, h.id)).status, "cancelled")
        end)

        test.it("reports a terminal worker failure through the catalog contract", function()
            local h = fixture.catalog()
            local job_id = queue_fixture(h.id, nil)
            local _, err = jobs.nudge_workers()
            test.is_nil(err, tostring(err))
            local until_time = time.now():add(10 * time.SECOND)
            local status = assert(h.call("get_model_release", { request_id = "release-status" }))
            while status.status ~= "failed" and time.now():before(until_time) do
                time.sleep("50ms")
                status = assert(h.call("get_model_release", { request_id = "release-status" }))
            end
            test.eq(status.status, "failed")
            test.eq(status.job_id, job_id)
            test.eq(status.after_product, "last-on-page")
        end)
    end)
end
return { run = test.run_cases(define) }
