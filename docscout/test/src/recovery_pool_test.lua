-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local data = require("data")
local jobs = require("jobs")
local repository = require("repository")
local recovery = require("recovery")
local teardown = require("teardown")
local registry = require("registry")
local json = require("json")
local uuid = require("uuid")
local sql = require("sql")
local time = require("time")
local process = require("process")
local channel = require("channel")

local SWEEPER = "kickside.core.retention.service:sweeper_process"

local function stop_sweeper(pid: any, events: any): error?
    local _, cancel_err = process.cancel(pid)
    local timeout = time.after("5s")
    while true do
        local selected = channel.select({events:case_receive(), timeout:case_receive()})
        if selected.channel ~= events then
            return errors.new({kind = errors.INTERNAL, message = "owned recovery sweeper did not stop"})
        end
        if selected.value.kind == process.event.EXIT and tostring(selected.value.from) == tostring(pid) then
            return cancel_err or selected.value.result.error
        end
    end
end

local function replace(changes: any, id: string, apply: (any) -> ())
    local entry = assert(registry.get(id))
    apply(entry.data)
    changes:update({id = entry.id, kind = entry.kind, meta = entry.meta, data = entry.data})
end

local function job_id(eval_id: string): string
    local db = assert(sql.get("app:db"))
    local rows, err = db:query("SELECT job_id FROM kickside_docscout_eval_results WHERE eval_id=$1", {eval_id})
    db:release()
    assert(rows, tostring(err))
    return rows[1].job_id
end

return {run = test.run_cases(function()
    test.describe("Recovery after real pool failures", function()
        for _, mode in ipairs({"crash", "timeout"}) do
            test.it("settles an exhausted " .. mode .. " and admits another evaluation", function()
                local overlay = assert(registry.overlay("app:recovery_pool_test"))
                local owner, component_id, pid = uuid.v4(), nil, nil
                local events = process.events()
                local ok, failure = pcall(function()
                    local changes = overlay:changes()
                    replace(changes, "kickside.docscout.evals:evals", function(entry: any)
                        entry.imports.jobs = "app:recovery_jobs"
                    end)
                    replace(changes, "kickside.docscout.evals:case_worker", function(entry: any)
                        entry.modules = {"time"}
                        local body = mode == "crash" and 'error("fixture worker crash")' or 'time.sleep("1h")'
                        entry.source = 'local time = require("time")\nreturn {run = function(_input: any): any ' .. body .. ' end}'
                    end)
                    local _, apply_err = changes:apply()
                    assert(apply_err == nil, tostring(apply_err))
                    pid = assert(process.spawn_monitored(SWEEPER, "app:processes"))
                    local ready = time.now():unix_nano() + 5 * time.SECOND
                    while time.now():unix_nano() < ready do
                        local registered = process.registry.lookup(SWEEPER, process.registry.CONSISTENT)
                        if registered and tostring(registered) == tostring(pid) then break end
                        time.sleep("20ms")
                    end
                    test.eq(tostring(assert(process.registry.lookup(SWEEPER, process.registry.CONSISTENT))), tostring(pid))
                    local function call(dto: any): any return assert(data.caller(owner):call("app:probe", dto)) end
                    local schema = assert(json.decode(assert(registry.get("kickside.docscout:config_schema")).data.schema_json))
                    local config, field = schema.default, schema.properties.fields.items.default
                    field.name, field.type = "total", "number"
                    config.fields = {field}
                    component_id = call({op = "create", input = {title = "Worker recovery", config = config}}).component_id
                    local upload_id = data.upload_record(owner, "application/pdf", "invoice.pdf", 1)
                    call({op = "add_case", id = component_id, input = {upload_id = upload_id, expected = {total = 1}}})
                    local admitted = call({op = "start_eval", id = component_id})
                    local receipt = job_id(admitted.eval_id)
                    local job, evaluation
                    local limit = time.now():unix_nano() + 40 * time.SECOND
                    repeat
                        job = assert(jobs.get_job(receipt))
                        evaluation = assert(repository.get_eval(admitted.eval_id))
                        if job.status == "dead" and evaluation.status == "failed" then break end
                        time.sleep("50ms")
                    until time.now():unix_nano() >= limit
                    test.eq(job.status, "dead", "real pool did not exhaust its retries")
                    test.eq(tonumber(job.attempts), 3)
                    test.eq(evaluation.status, "failed", "terminal worker left the evaluation active")
                    test.eq(evaluation.results[1].error.details.code, "docscout_job_terminal")
                    test.eq(evaluation.results[1].error.details.status, "dead")
                    test.eq(evaluation.results[1].error.details.attempts, 3)
                    test.eq(evaluation.results[1].error.details.job_error, job.last_error)
                    test.eq(evaluation.tokens, 0)
                    local repeated = call({op = "start_eval", id = component_id})
                    test.is_true(repeated.eval_id ~= admitted.eval_id, "exhausted work must not block a fresh evaluation")
                    test.is_true(repeated.existing ~= true)
                end)
                local cleanup_err
                if component_id then
                    local deleted, delete_err = data.caller(owner):call("app:probe", {op = "delete", id = component_id})
                    cleanup_err = delete_err
                    if not deleted and not cleanup_err then cleanup_err = errors.new("fixture component was not deleted") end
                end
                if pid then cleanup_err = stop_sweeper(pid, events) or cleanup_err end
                local cleanup = assert(registry.overlay("app:recovery_pool_test")):changes()
                cleanup:delete("kickside.docscout.evals:evals")
                cleanup:delete("kickside.docscout.evals:case_worker")
                local _, restore_err = cleanup:apply()
                test.is_nil(restore_err, tostring(restore_err))
                if not ok then error(failure) end
                test.is_nil(cleanup_err, tostring(cleanup_err))
            end)
        end
        test.it("retries an abandoned deletion on its stored deadline without another hint", function()
            local owner = uuid.v4()
            local id = data.extractor(owner)
            local items = {{id = "case", upload_id = uuid.v4(), upload_name = "invoice.pdf", expected = {}}}
            local eval_id = assert(repository.add_eval(id, {actor_id = owner, actor_context = "{}", config_revision = 0,
                fields = '[{"name":"total","type":"number"}]', config_snapshot = '{"fields":[]}'}, items,
                function(tx: any, dialect: string, admitted: string): (error?, {[string]: string}?)
                    local receipts, err = data.admit_eval_jobs(tx, dialect, id, admitted, items)
                    return err, receipts
                end))
            local receipt = job_id(eval_id)
            local events, pid = process.events(), nil
            local ok, failure = pcall(function()
                assert(jobs.cancel(receipt))
                local marked, _, mark_err = teardown.begin_delete(id, nil, nil)
                test.is_nil(mark_err, tostring(mark_err)); test.is_true(marked)
                local blocked = assert(recovery.run({kind = "lease_released", job_id = receipt}))
                test.eq(#blocked.blocked, 1); test.eq(blocked.settled, 0)
                test.is_nil(teardown.abandon_delete(id))
                -- Core starts after cancellation and abandon: neither can send
                -- this process a fresh hint. Boot must discover the stored due time.
                pid = assert(process.spawn_monitored(SWEEPER, "app:processes"))
                local limit = time.now():unix_nano() + 35 * time.SECOND
                local saved
                repeat
                    saved = assert(repository.get_eval(eval_id))
                    if saved.status == "failed" then break end
                    time.sleep("50ms")
                until time.now():unix_nano() >= limit
                test.eq(saved.status, "failed", "stored retry deadline did not recover abandoned deletion")
                test.eq(saved.results[1].error.details.status, "cancelled")
            end)
            local stop_err = pid and stop_sweeper(pid, events) or nil
            teardown.abandon_delete(id)
            local _, delete_err = data.caller(owner):call("app:probe", {op = "delete", id = id})
            if not ok then error(failure) end
            test.is_nil(stop_err, tostring(stop_err)); test.is_nil(delete_err, tostring(delete_err))
        end)
    end)
end)}
