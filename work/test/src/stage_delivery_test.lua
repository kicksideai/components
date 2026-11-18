-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test=require("test")
local fixture=require("fixture")
local steps=require("steps")
local rows=require("rows")
local uuid=require("uuid")
local json=require("json")
local channel = require("channel")
local time = require("time")
local function actor(h,a)
    a.board_id=h.id
    return h.call("direct",{target="app:stage_delivery_actor",input=a})
end
local function binding(h,a)
    a.board_id=h.id
    return h.call("direct",{target="app:flow_binding_actor",input=a})
end
local function setup(opts)
    opts=opts or {}
    local h=fixture.board({bare=true})
    local ref=assert(binding(h,{op="flow",crash=opts.crash}))
    local d={key_prefix=h.prefix,fields={},item_types={{id="task",process="p",fields={}}},processes={{id="p",initial="ready",migration=opts.follow and "follow" or "pin",states={
        {id="ready",category="unstarted"},
        {id="build",category="started",kind="automated",run={stage="Build",flow_ref=ref,on_pass="passed",on_fail="failed",on_cancel="canceled",retry=opts.retry and {max=2,backoff=opts.backoff or "PT0.1S"} or nil}},
        {id="done",category="completed"},{id="failed",category="canceled"},{id="canceled",category="canceled"}},transitions={
        {id="start",from={"ready"},to="build"},{id="passed",from={"build"},to="done"},{id="failed",from={"build"},to="failed"},
        {id="canceled",from={"build"},to="canceled"},{id="again",from={"done","failed","canceled"},to="build"}}}}}
    if opts.regional then
        local p=d.processes[1]
        p.states[#p.states+1]={id="parallel",kind="parallel",category="started",join="all",regions={{id="lane",initial="build"}}}
        p.transitions[1].to="parallel"
    end
    if opts.ineligible_failure then
        d.fields = { { code = "points", form = "int", index = "number" } }
        d.item_types[1].fields = { "points" }
        d.processes[1].transitions[3].when = { field = "points", op = "gte", value = 1 }
    end
    if opts.backoff then
        d.processes[1].states[2].run.retry = { max = 2, backoff = opts.backoff }
    end
    if opts.unbound then
        local states = d.processes[1].states
        states[2].run.flow_ref = nil
        states[#states + 1] = { id = "bound", category = "started", kind = "automated",
            run = { stage = "Bound", flow_ref = ref } }
    end
    assert(h.call("apply_schema",{declaration=d}))
    if not opts.real or opts.manual then assert(binding(h,{op="pause_launcher"})) end
    assert(actor(h,{op="probe",mode=opts.real and "real" or "success"}))
    if opts.unstarted then return h,nil,ref,d end
    local item=steps.create(h,"task",opts.ineligible_failure and { points = 0 } or nil)
    if opts.projection_lag then
        assert(actor(h, { op = "probe", mode = "pause_before_stage_entry" }))
        local result, err = steps.apply(h, { { op = "transition", item = item, transition = "start" } })
        assert(not result and err, "projection pause did not block command catch-up")
    else
        local result = steps.one(h,{op="transition",item=item,transition="start"})
        test.eq(result.status, "applied")
    end
    local entry
    for _,e in ipairs(steps.events(h)) do if e.type=="kickside.work.events:stage.entered" then entry=e.body end end
    assert(entry)
    return h,entry,ref
end
local function envelope(e,ref,status)
    return {token={board_id=e.board_id,item=e.item,visit=e.visit,attempt=e.attempt},run_id=uuid.v4(),dataflow_id=uuid.v4(),flow_ref=ref,status=status or "failed",ended_at="2026-11-17T00:00:00Z"}
end
local function launch(h,e,generation)
    local launcher=assert(binding(h,{op="launcher_id"}))
    return actor(h,{op="deliver",request={config={board_id=h.id},input=e,sink_op="upsert",origin=launcher,
        automation_ref={kind="automation",id=launcher,revision=generation or 1},identity_key="delivery",idempotency_key="delivery/"..(generation or 1)}})
end
local function reports(h,item)
    return rows.scalar("SELECT COUNT(*) AS n FROM kickside_work_stage_run WHERE board_id=$1 AND item_id=$2 AND outcome IS NOT NULL",{h.id,item})
end
local function define()
    test.describe("Work stage delivery and completion",function()
        test.it("reuses attempt identity across Automation delivery generations and selects only the fixed envelope",function()
            local h,e=setup()
            local one=assert(launch(h,e,1));test.is_true(one.success)
            local first=json.decode(assert(actor(h,{op="observed"})).request)
            local two=assert(launch(h,e,2));test.is_true(two.success)
            local second=json.decode(assert(actor(h,{op="observed"})).request)
            test.eq(first.idempotency_key,second.idempotency_key)
            test.eq(second.automation_ref.revision,2)
            test.eq(second.origin,assert(binding(h,{op="launcher_id"})))
            test.is_nil(second.input.flow_ref)
            test.is_nil(second.input.at)
            test.eq(second.config.completion.component_id,h.id)
            test.eq(#second.config.completion.token_fields,4)
        end)
        test.it("acknowledges terminal failure when the named outcome transition is ineligible", function()
            local h, entry, ref = setup({ ineligible_failure = true })
            local result, err = actor(h, { op = "complete", envelope = envelope(entry, ref, "failed") })
            assert(result, steps.detail(err))
            test.is_true(result.acknowledged)
            local run = assert(h.call("list_stage_runs", { item = { id = entry.item } })).stage_runs[1]
            test.eq(run.outcome, "failed")
            test.eq(assert(h.call("get", { item = { id = entry.item } })).item.state, "build")
        end)
        test.it("keeps a committed stage delivery pending while Work projection lags", function()
            local h, entry = setup({ projection_lag = true })
            local projected = rows.scalar("SELECT COUNT(*) AS n FROM kickside_work_stage_run WHERE board_id = $1 AND item_id = $2",
                { h.id, entry.item })
            local first, err = launch(h, entry)
            assert(actor(h, { op = "resume_work_projection" }))
            test.eq(projected, 0, "the committed stage must be absent from the paused projection")
            steps.wait_for("stage entry projection", function()
                return rows.scalar("SELECT COUNT(*) AS n FROM kickside_work_stage_run WHERE board_id = $1 AND item_id = $2",
                    { h.id, entry.item }) == 1
            end)
            local recovered = assert(launch(h, entry))
            test.is_true(recovered.success)
            test.eq(assert(actor(h, { op = "observed" })).calls, 1)
            assert(first, steps.detail(err))
            test.is_false(first.success, "acknowledging a pending stage as " .. tostring(first.result) .. " discards its delivery")
            test.is_true(first.error.retriable)
        end)
        test.it("rejects stage launch outside the owned Automation execution frame", function()
            local h, entry = setup()
            local launcher = assert(binding(h, { op = "launcher_id" }))
            local out = assert(actor(h, { op = "launch", request = { config = { board_id = h.id },
                input = entry, sink_op = "upsert", origin = launcher,
                automation_ref = { kind = "automation", id = launcher, revision = 1 } } }))
            test.is_false(out.success)
            test.eq(out.error.code, "stage_launcher_mismatch")
            test.eq(assert(actor(h, { op = "observed" })).calls, 0)
        end)
        test.it("uses the recorded attempt's Flow reference and state for launch", function()
            local h, entry, ref = setup()
            local state = entry.state
            entry.state = "ready"
            entry.flow_ref = { kind = "flow", id = ref.id, version = ref.version + 1 }
            test.is_true(assert(launch(h, entry)).success)
            local write = json.decode(assert(actor(h, { op = "observed" })).request)
            test.eq(write.config.flow_ref.id, ref.id)
            test.eq(write.config.flow_ref.version, ref.version)
            test.eq(write.input.state, state)
        end)
        test.it("preserves the entered Flow when the item follows a new process generation", function()
            local h, entry, frozen = setup({ follow = true })
            local declaration = assert(h.call("get_schema", {})).declaration
            local replacement = assert(binding(h, { op = "flow" }))
            declaration.processes[1].states[2].run.flow_ref = replacement
            local updated = assert(h.call("apply_schema", { declaration = { processes = declaration.processes } }))
            steps.wait_for("following process generation", function()
                return steps.get(h, entry.item).item.process_generation == updated.generation
            end)
            test.is_true(assert(launch(h, entry)).success)
            local write = json.decode(assert(actor(h, { op = "observed" })).request)
            test.eq(write.config.flow_ref.id, frozen.id)
            test.eq(write.config.flow_ref.version, frozen.version)
            test.eq(write.input.state, entry.state)
        end)
        test.it("keeps capacity and uncertain admission retryable while board reports can commit",function()
            for _,mode in ipairs({"capacity","uncertain"}) do
                local h,e=setup()
                assert(actor(h,{op="probe",mode=mode}))
                local out=assert(launch(h,e));test.is_false(out.success);test.is_true(out.error.retriable)
                test.eq(out.error.code,mode=="capacity" and "rate_limited" or "provider_unavailable")
                test.eq(assert(actor(h,{op="observed"})).calls,1)
                test.eq(reports(h,e.item),0)
                assert(h.call("report",{item=e.item,visit=e.visit,attempt=e.attempt,outcome="passed",outputs={answer=42}}))
                test.eq(reports(h,e.item),1)
            end
        end)
        test.it("keeps an admission with no acknowledgement or definite refusal pending",function()
            for _,mode in ipairs({"no_verdict","no_ack"}) do
                local h,e=setup()
                assert(actor(h,{op="probe",mode=mode}))
                local out=assert(launch(h,e))
                test.is_false(out.success);test.is_true(out.error.retriable)
                test.eq(reports(h,e.item),0)
            end
        end)
        test.it("keeps an existing Flow reservation open after a lost acknowledgement and a refusal", function()
            local h, entry, ref = setup({ real = true, manual = true })
            assert(actor(h, { op = "probe", mode = "lose_ack" }))
            local first = assert(launch(h, entry))
            test.is_false(first.success)
            test.is_true(first.error.retriable)
            test.eq(rows.scalar("SELECT COUNT(*) AS n FROM workflow_runs WHERE workflow_id = $1", { ref.id }), 1)
            assert(actor(h, { op = "probe", mode = "reject_reserved" }))
            local second = assert(launch(h, entry, 2))
            test.is_false(second.success)
            test.is_true(second.error.retriable)
            test.eq(reports(h, entry.item), 0)
            assert(actor(h, { op = "probe", mode = "real" }))
            steps.wait_for("completion from the reserved Flow", function() return reports(h, entry.item) == 1 end)
            test.eq(rows.scalar("SELECT COUNT(*) AS n FROM workflow_runs WHERE workflow_id = $1", { ref.id }), 1)
            test.eq(assert(steps.get(h, entry.item)).item.state, "done")
        end)
        test.it("closes a definite pre-admission rejection through the finisher",function()
            local h,e=setup()
            assert(actor(h,{op="probe",mode="reject"}))
            test.is_true(assert(launch(h,e)).success)
            local runs=assert(h.call("list_stage_runs",{item={id=e.item}})).stage_runs
            test.eq(runs[1].outcome,"failed")
            test.eq(runs[1].outputs.error,"flow_launch_rejected")
            test.eq(assert(h.call("get",{item={id=e.item}})).item.state,"failed")
        end)
        test.it("launches a bound attempt when the delivery omits its Flow reference", function()
            local h, entry, ref = setup()
            entry.flow_ref = nil
            test.is_true(assert(launch(h, entry)).success)
            local observation = assert(actor(h, { op = "observed" }))
            test.eq(observation.calls, 1)
            local launched = assert(json.decode(observation.request)).config.flow_ref
            test.eq(launched.id, ref.id)
            test.eq(launched.version, ref.version)
        end)
        test.it("acknowledges a genuinely unbound attempt without calling Workflows", function()
            local h, entry, ref = setup({ unbound = true })
            test.is_nil(entry.board_id)
            test.is_nil(entry.flow_ref)
            local unbound = assert(launch(h, entry))
            test.eq(unbound.result, "noop")
            entry.flow_ref = ref
            local result = assert(launch(h, entry))
            test.is_true(result.success, result.error and result.error.code)
            test.eq(result.result, "noop")
            test.eq(assert(actor(h, { op = "observed" })).calls, 0)
        end)
        test.it("acknowledges an obsolete attempt without calling Workflows", function()
            local h, entry = setup()
            entry.visit = entry.visit + 100
            local result = assert(launch(h, entry))
            test.is_true(result.success)
            test.eq(result.result, "noop")
            test.eq(assert(actor(h, { op = "observed" })).calls, 0)
        end)
        for _,status in ipairs({"completed","failed","cancelled","terminated"}) do
            test.it("finishes silent "..status.." through the matching stage route",function()
                local h,e,ref=setup()
                local out,err=actor(h,{op="complete",envelope=envelope(e,ref,status)})
                test.is_nil(err);test.is_true(out and out.acknowledged)
                local expected=status=="completed" and "done" or status=="cancelled" and "canceled" or "failed"
                test.eq(assert(h.call("get",{item={id=e.item}})).item.state,expected)
                test.eq(reports(h,e.item),1)
            end)
        end
        test.it("recovers a crash before report and acknowledges duplicates without another append",function()
            local h,e,ref=setup()
            test.eq(reports(h,e.item),0)
            local env=envelope(e,ref)
            assert(actor(h,{op="probe",mode="crash_before_report"}))
            local out,err=actor(h,{op="complete",envelope=env})
            test.is_nil(out);test.not_nil(err);test.eq(err:details().code,"completion_interrupted")
            test.eq(reports(h,e.item),0)
            assert(actor(h,{op="complete",envelope=env}))
            local n=#steps.events(h)
            assert(actor(h,{op="complete",envelope=env}))
            test.eq(#steps.events(h),n)
        end)
        test.it("lets a committed report win against every terminal status",function()
            for _,status in ipairs({"completed","failed","cancelled","terminated"}) do
                local h,e,ref=setup()
                assert(h.call("report",{item=e.item,visit=e.visit,attempt=e.attempt,outcome="passed",outputs={answer=42}}))
                local n=#steps.events(h)
                assert(actor(h,{op="complete",envelope=envelope(e,ref,status)}))
                test.eq(#steps.events(h),n)
                test.eq(assert(h.call("list_stage_runs",{item={id=e.item}})).stage_runs[1].outputs.answer,42)
            end
        end)
        test.it("retries the existing item CAS when a concurrent report commits first",function()
            local h,e,ref=setup()
            assert(actor(h,{op="probe",mode="cas_report"}))
            assert(actor(h,{op="complete",envelope=envelope(e,ref)}))
            local runs=assert(h.call("list_stage_runs",{item={id=e.item}})).stage_runs
            test.eq(#runs,1);test.eq(runs[1].outcome,"passed");test.eq(runs[1].outputs.answer,42)
        end)
        test.it("acknowledges two competing terminal callbacks and commits only the winning route", function()
            local h, entry, ref = setup()
            local pending = {}
            for i, status in ipairs({ "completed", "failed" }) do
                pending[i] = assert(h.executor:async("app:work_call", { op = "direct", board_id = h.id,
                    request = { target = "app:stage_delivery_actor",
                        input = { op = "complete", board_id = h.id, envelope = envelope(entry, ref, status) } } }))
            end
            for _, callback in ipairs(pending) do
                local deadline = time.after("120s")
                local selected = channel.select({ callback:response():case_receive(), deadline:case_receive() })
                assert(selected.channel ~= deadline, "terminal callback timed out")
                local payload, err = callback:result()
                assert(payload, steps.detail(err))
                test.is_true(assert(payload:data()).acknowledged)
            end
            local stage = assert(h.call("list_stage_runs", { item = { id = entry.item } })).stage_runs[1]
            test.is_true(stage.outcome == "passed" or stage.outcome == "failed")
            test.eq(reports(h, entry.item), 1)
            local transitions = 0
            for _, event in ipairs(steps.events(h)) do
                if event.type == "kickside.work.events:item.transitioned" and event.body.item == entry.item
                    and event.body.from == "build" then
                    transitions = transitions + 1
                    test.eq(event.body.transition, stage.outcome)
                end
            end
            test.eq(transitions, 1)
        end)
        test.it("anchors a failing callback's retry at its finish plus backoff", function()
            local h, entry, ref = setup({ backoff = "PT1H" })
            local result = assert(actor(h, { op = "complete", envelope = envelope(entry, ref, "failed") }))
            test.is_true(result.acknowledged)
            local runs = assert(h.call("list_stage_runs", { item = { id = entry.item } })).stage_runs
            test.eq(#runs, 1)
            test.eq(runs[1].outcome, "failed")
            local finished = assert(time.parse(time.RFC3339, runs[1].finished_at))
            test.eq(runs[1].retry_at, finished:utc():add(3600000000000):format("2006-01-02T15:04:05.000000000Z"))
            for _, event in ipairs(steps.events(h)) do
                if event.type == "kickside.work.events:stage.entered" and event.body.item == entry.item then
                    test.eq(event.body.attempt, 1)
                end
            end
        end)
        test.it("acknowledges a retired stage row while its item locator still exists",function()
            local h,e,ref=setup()
            assert(actor(h,{op="retire_stage",item=e.item}))
            local n=#steps.events(h)
            assert(actor(h,{op="complete",envelope=envelope(e,ref)}))
            test.eq(#steps.events(h),n)
        end)
        test.it("ignores stale visits, stale attempts and missing items",function()
            for _,mode in ipairs({"visit","attempt","missing"}) do
                local h,e,ref=setup()
                local env=envelope(e,ref)
                if mode=="visit" then env.token.visit=e.visit+100
                elseif mode=="attempt" then env.token.attempt=e.attempt+1
                else env.token.item=uuid.v4() end
                local n=#steps.events(h)
                assert(actor(h,{op="complete",envelope=env}))
                test.eq(#steps.events(h),n)
            end
        end)
        test.it("preserves a stage delivery in trash and launches the retained attempt on restore", function()
            local h, entry = setup()
            test.eq(steps.one(h, { op = "delete", item = entry.item }).status, "applied")
            local deferred = assert(launch(h, entry))
            test.eq(assert(actor(h, { op = "observed" })).calls, 0)
            test.eq(steps.one(h, { op = "restore", item = entry.item }).status, "applied")
            test.is_false(deferred.success, "the launcher acknowledged its only delivery while the visit was in trash")
            test.is_true(deferred.error.retriable)
            test.is_true(assert(launch(h, entry)).success)
            test.eq(assert(actor(h, { op = "observed" })).calls, 1)
            test.eq(rows.scalar("SELECT COUNT(*) AS n FROM kickside_work_stage_run WHERE board_id = $1 AND item_id = $2",
                { h.id, entry.item }), 1)
        end)
        test.it("redelivers a trashed attempt through the owned launcher after restore", function()
            local h, entry, ref = setup({ real = true, manual = true })
            test.eq(steps.one(h, { op = "delete", item = entry.item }).status, "applied")
            local launcher = assert(binding(h, { op = "launcher_id" }))
            assert(binding(h, { op = "resume_launcher" }))
            steps.wait_for("durable stage delivery while the item is trashed", function()
                return rows.scalar("SELECT COUNT(*) AS n FROM kickside_trigger_item_ledger WHERE owner_id = $1 AND state = 'retrying'",
                    { launcher }) == 1
            end)
            test.eq(rows.scalar("SELECT COUNT(*) AS n FROM workflow_runs WHERE workflow_id = $1", { ref.id }), 0)
            test.eq(steps.one(h, { op = "restore", item = entry.item }).status, "applied")
            steps.wait_for("the retained Flow to complete after restore", function() return reports(h, entry.item) == 1 end)
            test.eq(rows.scalar("SELECT COUNT(*) AS n FROM workflow_runs WHERE workflow_id = $1", { ref.id }), 1)
            test.eq(assert(steps.get(h, entry.item)).item.state, "done")
        end)
        test.it("records a terminal callback in trash and preserves it on restore", function()
            for _, regional in ipairs({ false, true }) do
                local h, entry, ref = setup({ regional = regional })
                test.is_true(assert(launch(h, entry)).success)
                test.eq(steps.one(h, { op = "delete", item = entry.item }).status, "applied")
                local completion = envelope(entry, ref, "completed")
                test.is_true(assert(actor(h, { op = "complete", envelope = completion })).acknowledged)
                test.eq(reports(h, entry.item), 1)
                local head = #steps.events(h)
                test.is_true(assert(actor(h, { op = "complete", envelope = completion })).acknowledged)
                test.eq(#steps.events(h), head)
                test.eq(steps.one(h, { op = "restore", item = entry.item }).status, "applied")
                local stage = assert(h.call("list_stage_runs", { item = { id = entry.item } })).stage_runs[1]
                test.eq(stage.outcome, "passed")
                test.is_true(assert(launch(h, entry)).success)
                test.eq(assert(actor(h, { op = "observed" })).calls, 1)
            end
        end)
        test.it("fences regional visits and completes the active region",function()
            local h,e,ref=setup({regional=true})
            local env=envelope(e,ref,"completed");env.token.visit=e.visit-1
            assert(actor(h,{op="complete",envelope=env}));test.eq(reports(h,e.item),0)
            env.token.visit=e.visit
            assert(actor(h,{op="complete",envelope=env}));test.eq(reports(h,e.item),1)
        end)
        test.it("routes retry completion and fences the preceding attempt",function()
            local h,e,ref=setup({retry=true})
            local env=envelope(e,ref)
            assert(actor(h,{op="complete",envelope=env}))
            steps.wait_for("completion retry",function()
                for _,event in ipairs(steps.events(h)) do
                    if event.type=="kickside.work.events:stage.entered" and event.body.attempt==2 then return true end
                end
                return false
            end)
            local n=#steps.events(h)
            assert(actor(h,{op="complete",envelope=env}));test.eq(#steps.events(h),n)
            env.token.attempt=2
            assert(actor(h,{op="complete",envelope=env}))
            test.eq(assert(h.call("get",{item={id=e.item}})).item.state,"failed")
        end)
        test.it("anchors callback retry to the first attempt's recorded finish", function()
            local h, entry, ref = setup({ retry = true, backoff = "PT0.2S" })
            assert(actor(h, { op = "complete", envelope = envelope(entry, ref) }))
            local function runs()
                return assert(h.call("list_stage_runs", { item = { id = entry.item } })).stage_runs
            end
            steps.wait_for("retry after callback", function() return #runs() == 2 end)
            local attempts = runs()
            local finished = assert(time.parse(time.RFC3339, attempts[2].finished_at))
            local expected = finished:utc():add(200 * time.MILLISECOND):format("2006-01-02T15:04:05.000000000Z")
            test.is_true(attempts[1].started_at >= expected)
            local scheduled
            for _, event in ipairs(steps.events(h)) do
                if event.type == "kickside.work.events:timer.fired" and event.body.timer == "$retry:2" then
                    scheduled = event.body.scheduled_at
                end
            end
            test.eq(scheduled, expected)
        end)
        test.it("rejects foreign board tokens unknown fields and invalid locators",function()
            local h,e,ref=setup()
            for _,mode in ipairs({"board","unknown","uuid","visit","attempt","envelope","ref","run","error"}) do
                local env=envelope(e,ref)
                if mode=="board" then env.token.board_id=uuid.v4()
                elseif mode=="unknown" then env.token.input={secret=true}
                elseif mode=="uuid" then env.token.item="no"
                elseif mode=="envelope" then env.input={private=true}
                elseif mode=="ref" then env.flow_ref.extra=true
                elseif mode=="run" then env.run_id=nil
                elseif mode=="error" then env.error={code="failed",message=string.rep("x",4097)}
                else env.token[mode]=0 end
                local out,err=actor(h,{op="complete",envelope=env})
                test.is_nil(out);test.not_nil(err)
            end
            test.eq(reports(h,e.item),0)
        end)
        test.it("enforces live board WRITE on completion",function()
            local h,e,ref=setup()
            local other=fixture.user(h)
            assert(h.call("grant",{subject_id=h.actor:id(),mask=15}))
            local out,err=other("direct",{target="app:stage_delivery_actor",input={op="complete",board_id=h.id,envelope=envelope(e,ref)}})
            test.is_nil(out);test.not_nil(err)
            test.eq(reports(h,e.item),0)
        end)
        test.it("refuses another authorized user's principal before completion",function()
            local h,e,ref=setup()
            local other,id=fixture.user(h)
            assert(h.call("grant",{subject_id=id,mask=3}))
            local out,err=other("direct",{target="app:stage_delivery_actor",input={op="complete",board_id=h.id,envelope=envelope(e,ref)}})
            test.is_nil(out);test.not_nil(err);test.eq(err:details().code,"stage_launch_principal_denied")
            test.eq(reports(h,e.item),0)
        end)
        test.it("launches the pinned Flow version on retry and the rebound version for a new item", function()
            local h, _, v1, decl = setup({ real = true, manual = true, unstarted = true, retry = true, crash = true })
            local old = steps.create(h, "task")
            local v2 = assert(binding(h, { op = "publish_success_version", id = v1.id }))
            test.eq(v2.version, 2)
            decl.processes[1].states[2].run.flow_ref = v2
            assert(h.call("apply_schema", { declaration = decl }))
            local fresh = steps.create(h, "task")
            assert(binding(h, { op = "resume_launcher" }))
            for _, item in ipairs({ old, fresh }) do
                test.eq(steps.one(h, { op = "transition", item = item, transition = "start" }).status, "applied")
            end
            steps.wait_for("launcher completion of both generations", function()
                return assert(steps.get(h, old)).item.state == "failed" and assert(steps.get(h, fresh)).item.state == "done"
            end)
            for version, count in ipairs({ 2, 1 }) do
                test.eq(rows.scalar("SELECT COUNT(*) AS n FROM workflow_runs WHERE workflow_id = $1 AND version = $2",
                    { v1.id, version }), count)
            end
        end)
        test.it("admits one real run across delivery replay and publishes completion without a report",function()
            local h,e,ref=setup({real=true,manual=true})
            local launcher=assert(binding(h,{op="launcher"}))
            local req={config={board_id=h.id},input=e,sink_op="upsert",origin=launcher.id,
                automation_ref={kind="automation",id=launcher.id,revision=1},identity_key="replay",idempotency_key="generation/1"}
            local one=assert(actor(h,{op="deliver",request=req}));test.is_true(one.success)
            req.idempotency_key="generation/2"
            local two=assert(actor(h,{op="deliver",request=req}));test.is_true(two.success)
            if two.dest_ref then test.eq(one.dest_ref.run_id,two.dest_ref.run_id) else test.eq(two.result,"noop") end
            steps.wait_for("real run completion",function() return reports(h,e.item)==1 end)
            test.eq(rows.scalar("SELECT COUNT(*) AS n FROM workflow_runs WHERE workflow_id=$1",{ref.id}),1)
            test.eq(assert(h.call("get",{item={id=e.item}})).item.state,"done")
        end)
        test.it("routes a real launcher-driven crash immediately without waiting for the stage timeout",function()
            local h,e,ref=setup({real=true,crash=true})
            steps.wait_for("crashing Flow completion",function() return reports(h,e.item)==1 and rows.scalar("SELECT COUNT(*) AS n FROM workflow_runs WHERE workflow_id=$1 AND status='failed' AND NOT terminal_event_pending",{ref.id})==1 end)
            test.eq(assert(h.call("get",{item={id=e.item}})).item.state,"failed")
            test.eq(rows.scalar("SELECT COUNT(*) AS n FROM workflow_runs WHERE workflow_id=$1 AND status='failed' AND NOT terminal_event_pending",{ref.id}),1)
        end)
        test.it("removes the real owned launcher before deleting its board",function()
            local h=fixture.board({bare=true})
            local ref=assert(binding(h,{op="flow"}))
            local d={key_prefix=h.prefix,fields={},item_types={{id="task",process="p",fields={}}},processes={{id="p",initial="ready",states={{id="ready",category="unstarted"},{id="build",category="started",kind="automated",run={stage="Build",flow_ref=ref}}}}}}
            assert(h.call("apply_schema",{declaration=d}))
            local launcher=assert(binding(h,{op="launcher"}))
            local out,err=actor(h,{op="teardown"})
            if err then test.eq(err:details().code,"stage_launcher_delete_pending",tostring(err)) end
            steps.wait_for("owned launcher deletion",function() return rows.scalar("SELECT COUNT(*) AS n FROM kickside_components WHERE component_id=$1",{launcher.id})==0 end)
            assert(actor(h,{op="teardown"}))
            steps.deleted(h.id)
        end)
    end)
end
return {run=test.run_cases(define)}
