-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local fixture = require("fixture")
local jobs = require("jobs")
local store = require("store")
local time = require("time")

local function define()
    test.describe("one-shot attempt bounds", function()
        test.it("ends a retryable one-shot at max_attempts with every attempt recorded", function()
            local h = fixture.catalog()
            local job, err = jobs.enqueue({ namespace = "pim", scope = "test", key = h.id,
                owner_locator = { kind = "component", id = h.id }, thread_id = h.id,
                job_type = "app:unavailable_job", immutable_payload = { catalog_id = h.id }, max_attempts = 2 })
            test.is_nil(err, tostring(err))
            local terminal = false
            local until_time = time.now():add(60 * time.SECOND)
            while time.now():before(until_time) do
                local state, serr = jobs.get_job(job.id)
                test.is_nil(serr, tostring(serr))
                if state.status == "dead" then
                    test.eq(state.attempts, 2, "attempts: " .. tostring(state.last_error))
                    test.eq(state.max_attempts, 2)
                    terminal = true
                    break
                end
                time.after("50ms"):receive()
            end
            test.is_true(terminal)
            local db = assert(store.open())
            local runs, rerr = db:query("SELECT status FROM kickside_job_run WHERE job_id = $1 ORDER BY execution_seq", { job.id })
            test.is_nil(rerr, tostring(rerr))
            test.eq(#runs, 2, "run history: " .. job.id)
            for _, run in ipairs(runs) do test.eq(run.status, "failed") end
            local count = assert(db:query("SELECT COUNT(*) AS n FROM pim_test_job_attempts WHERE catalog_id = $1", { h.id }))[1].n
            assert(db:release())
            test.eq(tonumber(count), 2, "worker calls: " .. job.id)
        end)
    end)
end
return { run = test.run_cases(define) }
