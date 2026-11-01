-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local data = require("data")
local repository = require("repository")
local recovery = require("recovery")
local jobs = require("jobs")
local teardown = require("teardown")
local uuid = require("uuid")
local time = require("time")
local channel = require("channel")

local function rows(statement: string, params: any?): any
    local sql = require("sql")
    local db = assert(sql.get("app:db"))
    local result, err = db:query(statement, params or {})
    db:release()
    return assert(result, tostring(err))
end

local function cases(count: integer): {any}
    local result = {}
    for i = 1, count do
        result[i] = {id = string.format("case-%03d", i), upload_id = uuid.v4(), upload_name = "invoice.pdf", expected = {}}
    end
    return result
end

local function admit(component_id: string, items: {any}, mutate: any?): (string?, error?, {string})
    local ids = {}
    local id, err = repository.add_eval(component_id, {actor_id = uuid.v4(), actor_context = "{}",
        config_revision = 0, fields = '[{"name":"total","type":"number"}]', config_snapshot = '{"fields":[]}'}, items,
        function(tx: any, dialect: string, eval_id: string): (error?, {[string]: string}?)
            local receipts, admit_err = data.admit_eval_jobs(tx, dialect, component_id, eval_id, items)
            if admit_err then return admit_err end
            for _, job_id in pairs(receipts) do ids[#ids + 1] = job_id end
            if mutate then receipts = mutate(receipts, items) end
            return nil, receipts
        end)
    return id, err, ids
end

local function receipt(eval_id: string): any
    return rows("SELECT job_id,next_check_at,status FROM kickside_docscout_eval_results WHERE eval_id=$1 ORDER BY case_id", {eval_id})[1]
end

return {run = test.run_cases(function()
    test.describe("Durable evaluation recovery", function()
        local owner, component_id
        test.before_each(function()
            owner = uuid.v4()
            component_id = data.extractor(owner)
        end)
        test.after_each(function()
            if component_id then
                teardown.abandon_delete(component_id)
                assert(data.caller(owner):call("app:probe", {op = "delete", id = component_id}))
            end
        end)
        for _, mode in ipairs({"missing map", "missing case", "duplicate", "extra", "invalid"}) do
            test.it("rolls back Jobs and evaluation admission for " .. mode, function()
                local value, err, ids = admit(component_id, cases(2), function(map: any, items: any): any
                    if mode == "missing map" then return nil end
                    if mode == "missing case" then map[items[1].id] = nil end
                    if mode == "duplicate" then map[items[1].id] = map[items[2].id] end
                    if mode == "extra" then map.unexpected = uuid.v4() end
                    if mode == "invalid" then map[items[1].id] = "not-a-job-id" end
                    return map
                end)
                test.is_nil(value); test.not_nil(err); test.is_false(err:retryable())
                test.eq(#assert(repository.list_evals(component_id, 20)), 0)
                for _, job_id in ipairs(ids) do
                    local job, read_err = jobs.get_job(job_id)
                    test.is_nil(read_err, tostring(read_err)); test.is_nil(job)
                end
            end)
        end
        test.it("settles a cancelled real worker once and keeps native cause details", function()
            local id = assert(admit(component_id, cases(1)))
            local job_id = receipt(id).job_id
            assert(jobs.cancel(job_id))
            local result, err = recovery.run({kind = "lease_released", job_id = job_id})
            test.is_nil(err, tostring(err)); test.eq(result.settled, 1)
            local saved = assert(repository.get_eval(id))
            test.eq(saved.status, "failed"); test.eq(saved.results[1].status, "failed")
            test.eq(saved.results[1].error.kind, errors.CANCELED)
            test.eq(saved.results[1].error.details.code, "docscout_job_terminal")
            test.eq(saved.results[1].error.details.status, "cancelled")
            local again = assert(recovery.run({kind = "lease_released", job_id = job_id}))
            test.eq(again.settled, 0)
            test.eq(assert(repository.get_eval(id)).finished_at, saved.finished_at)
        end)
        test.it("rotates a bounded due page without starving later pending cases", function()
            local id = assert(admit(component_id, cases(21)))
            data.execute("UPDATE kickside_docscout_eval_results SET next_check_at='2000-01-01T00:00:00.000Z' WHERE eval_id=$1", {id})
            local first = assert(recovery.run())
            test.is_true(first.needs_continue); test.eq(first.settled, 0)
            local left = rows("SELECT COUNT(*) AS n FROM kickside_docscout_eval_results WHERE eval_id=$1 AND next_check_at='2000-01-01T00:00:00.000Z'", {id})
            test.eq(tonumber(left[1].n), 5)
            assert(recovery.run())
            left = rows("SELECT COUNT(*) AS n FROM kickside_docscout_eval_results WHERE eval_id=$1 AND next_check_at='2000-01-01T00:00:00.000Z'", {id})
            test.eq(tonumber(left[1].n), 0)
            test.eq(assert(repository.get_eval(id)).status, "queued")
        end)
        test.it("does not write an outcome behind the deletion fence and resumes after abandon", function()
            local id = assert(admit(component_id, cases(1)))
            local job_id = receipt(id).job_id
            assert(jobs.cancel(job_id))
            local marked, _, mark_err = teardown.begin_delete(component_id, nil, nil)
            test.is_nil(mark_err, tostring(mark_err)); test.is_true(marked)
            local result = assert(recovery.run({kind = "lease_released", job_id = job_id}))
            test.eq(result.settled, 0); test.eq(#result.blocked, 1)
            test.is_true(errors.is(result.blocked[1].error, errors.NOT_FOUND))
            local pending = receipt(id)
            test.eq(pending.status, "queued")
            local instant = assert(time.parse(time.RFC3339, pending.next_check_at))
            test.is_true(instant:unix_nano() > time.now():unix_nano(), "blocked work must not leave an immediately due head")
            test.is_nil(teardown.abandon_delete(component_id))
            data.execute("UPDATE kickside_docscout_eval_results SET next_check_at='2000-01-01T00:00:00.000Z' WHERE eval_id=$1", {id})
            assert(recovery.run())
            test.eq(assert(repository.get_eval(id)).status, "failed")
        end)
        test.it("preserves a transient status-read failure after claiming a future recheck", function()
            local id = assert(admit(component_id, cases(1)))
            local job_id = receipt(id).job_id
            local original = jobs.get_job_statuses
            local source = errors.new({kind = errors.UNAVAILABLE, retryable = true, message = "status read unavailable",
                details = {code = "status_unavailable"}})
            jobs.get_job_statuses = function(_ids: any): (any?, error?) return nil, source end
            local ok, failure = pcall(function()
                local value, err = recovery.run({kind = "lease_released", job_id = job_id})
                test.is_nil(value); test.eq(err:kind(), source:kind()); test.is_true(err:retryable())
                test.eq(err:details().code, "status_unavailable")
                local pending = receipt(id)
                test.eq(pending.status, "queued")
                test.is_true(assert(time.parse(time.RFC3339, pending.next_check_at)):unix_nano() > time.now():unix_nano())
            end)
            jobs.get_job_statuses = original
            if not ok then error(failure) end
        end)
        test.it("complete deletion removes receipts and their recovery deadline", function()
            local id = assert(admit(component_id, cases(1)))
            local job_id = receipt(id).job_id
            local due = "1970-01-01T00:00:01.000Z"
            data.execute("UPDATE kickside_docscout_eval_results SET next_check_at=$1 WHERE eval_id=$2", {due, id})
            test.eq(assert(repository.next_deadline_ms()), 1000)
            assert(data.caller(owner):call("app:probe", {op = "delete", id = component_id}))
            component_id = nil
            test.eq(#rows("SELECT job_id FROM kickside_docscout_eval_results WHERE eval_id=$1", {id}), 0)
            local value, err = repository.get_eval(id)
            test.is_nil(value); test.is_true(errors.is(err, errors.NOT_FOUND), tostring(err))
            local result = assert(recovery.run({kind = "lease_released", job_id = job_id}))
            test.eq(result.settled, 0); test.eq(#result.blocked, 0)
            local deadline, deadline_err = repository.next_deadline_ms()
            test.is_nil(deadline_err, tostring(deadline_err))
            test.is_true(deadline == nil or deadline > 1000)
        end)
        test.it("a retained-out worker fails its case instead of inventing a successful result", function()
            local id = assert(admit(component_id, cases(1)))
            local job_id = receipt(id).job_id
            local original_statuses, original_get = jobs.get_job_statuses, jobs.get_job
            jobs.get_job_statuses = function(_ids: any): (any?, error?) return {}, nil end
            jobs.get_job = function(_id: string): (any?, error?) return nil, nil end
            local ok, failure = pcall(function()
                local result = assert(recovery.run({kind = "lease_released", job_id = job_id}))
                test.eq(result.settled, 1)
                local saved = assert(repository.get_eval(id))
                test.eq(saved.status, "failed"); test.eq(saved.results[1].error.details.status, "missing")
            end)
            jobs.get_job_statuses, jobs.get_job = original_statuses, original_get
            if not ok then error(failure) end
        end)
        test.it("two concurrent due scans cannot claim the same receipt snapshot", function()
            local id = assert(admit(component_id, cases(1)))
            local job_id = receipt(id).job_id
            data.execute("UPDATE kickside_docscout_eval_results SET next_check_at='2000-01-01T00:00:00.000Z' WHERE eval_id=$1", {id})
            local done = channel.new(2)
            for _ = 1, 2 do
                coroutine.spawn(function()
                    local claimed, err = repository.claim_eval_checks()
                    done:send({rows = claimed, error = err})
                end)
            end
            local occurrences = 0
            for _ = 1, 2 do
                local timeout = time.after("5s")
                local selected = channel.select({done:case_receive(), timeout:case_receive()})
                test.eq(selected.channel, done, "concurrent receipt scans did not finish")
                test.is_nil(selected.value.error, tostring(selected.value.error))
                for _, row in ipairs(selected.value.rows) do if row.job_id == job_id then occurrences = occurrences + 1 end end
            end
            test.eq(occurrences, 1)
        end)
    end)
end)}
