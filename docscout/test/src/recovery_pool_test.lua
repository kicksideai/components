-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local data = require("data")
local jobs = require("jobs")
local repository = require("repository")
local recovery = require("recovery")
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

local function admit(owner: string, component_id: string): string
    local items = {{id = "case", upload_id = uuid.v4(), upload_name = "invoice.pdf", expected = {}}}
    return assert(repository.add_eval(component_id, {actor_id = owner, actor_context = "{}", config_revision = 0,
        fields = '[{"name":"total","type":"number"}]', config_snapshot = '{"fields":[]}'}, items,
        function(tx: any, dialect: string, admitted: string): (error?, {[string]: string}?)
            local receipts, err = data.admit_eval_jobs(tx, dialect, component_id, admitted, items)
            return err, receipts
        end))
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
                    if deleted and cleanup_err == nil then data.await_delete(component_id) end
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
        test.it("rechecks a dead deletion on its stored deadline and cleans up after explicit retry", function()
            local owner = uuid.v4()
            local id = data.extractor(owner)
            local eval_id = admit(owner, id)
            local live_id = data.extractor(owner)
            local live_eval = admit(owner, live_id)
            local receipt = job_id(eval_id)
            local events, pid = process.events(), nil
            local ok, failure = pcall(function()
                assert(jobs.cancel(receipt))
                local accepted = data.dead_delete(owner, id)
                local blocked = assert(recovery.run({kind = "lease_released", job_id = receipt}))
                test.eq(#blocked.blocked, 1); test.eq(blocked.settled, 0)
                local db = assert(sql.get("app:db"))
                local before = assert(db:query("SELECT next_check_at FROM kickside_docscout_eval_results WHERE eval_id=$1", {eval_id}))[1]
                assert(db:release())
                assert(jobs.cancel(job_id(live_eval)))
                data.execute("UPDATE kickside_docscout_eval_results SET next_check_at=$1 WHERE eval_id=$2", {before.next_check_at, live_eval})
                -- Boot discovers the stored due time without a fresh hint.
                pid = assert(process.spawn_monitored(SWEEPER, "app:processes"))
                local limit = time.now():unix_nano() + 35 * time.SECOND
                local saved, live
                repeat
                    db = assert(sql.get("app:db"))
                    saved = assert(db:query("SELECT status,next_check_at FROM kickside_docscout_eval_results WHERE eval_id=$1", {eval_id}))[1]
                    assert(db:release())
                    live = assert(repository.get_eval(live_eval))
                    if saved.next_check_at ~= before.next_check_at and live.status == "failed" then break end
                    time.sleep("50ms")
                until time.now():unix_nano() >= limit
                test.is_true(saved.next_check_at ~= before.next_check_at, "stored retry deadline did not recheck fenced recovery")
                test.is_true(assert(time.parse(time.RFC3339, saved.next_check_at)):unix_nano() > time.now():unix_nano())
                test.eq(saved.status, "queued")
                test.eq(live.status, "failed", "stored retry deadline did not settle the unfenced receipt")
                test.eq(live.results[1].error.details.status, "cancelled")
                assert(data.caller(owner):call("app:probe", {op = "delete", id = live_id}))
                data.await_delete(live_id)
                live_id = nil
                test.eq(assert(jobs.get_job(receipt)).status, "cancelled")
                test.eq(assert(jobs.get_job(accepted.job_id)).status, "dead")
                local retried = assert(data.caller(owner):call("app:probe", {op = "delete", id = id}))
                test.is_true(retried.in_progress); test.is_false(retried.deleted)
                test.is_true(retried.job_id ~= accepted.job_id)
                data.await_delete(id)
                db = assert(sql.get("app:db"))
                local remaining = assert(db:query("SELECT job_id,next_check_at FROM kickside_docscout_eval_results WHERE eval_id IN ($1,$2)", {eval_id, live_eval}))
                assert(db:release())
                test.eq(#remaining, 0)
                local removed, removed_err = repository.get_eval(eval_id, true)
                test.is_nil(removed); test.is_true(errors.is(removed_err, errors.NOT_FOUND), tostring(removed_err))
                local recovered = assert(recovery.run({kind = "lease_released", job_id = receipt}))
                test.eq(recovered.settled, 0); test.eq(#recovered.blocked, 0)
            end)
            local stop_err = pid and stop_sweeper(pid, events) or nil
            local delete_err
            if not ok then
                local _
                _, delete_err = data.caller(owner):call("app:probe", {op = "delete", id = id})
                if delete_err == nil then data.await_delete(id) end
            end
            local live_delete_err
            if live_id then
                local _
                _, live_delete_err = data.caller(owner):call("app:probe", {op = "delete", id = live_id})
                if live_delete_err == nil then data.await_delete(live_id) end
            end
            if not ok then error(failure) end
            test.is_nil(stop_err, tostring(stop_err)); test.is_nil(delete_err, tostring(delete_err))
            test.is_nil(live_delete_err, tostring(live_delete_err))
        end)
    end)
end)}
