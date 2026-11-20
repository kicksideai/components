-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local fixture = require("fixture")
local scoped = require("scoped")
local steps = require("steps")
local json = require("json")
local registry = require("registry")
local time = require("time")

type Call = (string, unknown) -> (unknown, error?)
type Map = { [string]: unknown }
local PACK = "app:maintainer_pipeline"
local EVENT = "kickside.work.events:"

local AUTOMATED = {
    screening = true, triage = true, design = true, conformance = true,
    implement = true, test = true, verification = true,
}
local GATES = {
    design_review = true, security_review = true, escalated = true, merge_prep = true, release_prep = true,
}
local START = "intake screening triage classified "
local SHIP = " implement test verification merge_candidate merge_prep release_prep done"

local function events(h: fixture.Handle, id: string, kind: string): { Map }
    local found = {}
    for _, event in ipairs(steps.events(h)) do
        if event.type == EVENT .. kind and event.body.item == id then found[#found + 1] = event end
    end
    return found
end

local function fact(kind: string, state: string, visit: integer, detail: unknown?): string
    return kind .. "/" .. state .. "/" .. tostring(visit) .. (detail and "/" .. tostring(detail) or "")
end

-- Compare each item's ordered lifecycle with the intended path, including
-- facts that have no state transition of their own, such as retry attempts.
local function assert_lifecycle(h: fixture.Handle, id: string, path: string, outcomes: { [integer]: { string } }?)
    local states: { string } = {}
    for state in path:gmatch("%S+") do states[#states + 1] = state end

    local actual, expected = {}, {}
    for _, event in ipairs(steps.events(h)) do
        local body = event.body
        if body.item == id then
            if event.type == EVENT .. "item.created" then
                actual[#actual + 1] = fact("create", body.state, 1)
            elseif event.type == EVENT .. "item.transitioned" then
                actual[#actual + 1] = fact("transition", body.to, body.visit, body.from)
            elseif event.type == EVENT .. "stage.entered" then
                actual[#actual + 1] = fact("enter", body.state, body.visit, body.attempt)
            elseif event.type == EVENT .. "stage.reported" then
                actual[#actual + 1] = fact(body.outcome, body.state, body.visit, body.attempt)
            elseif event.type == EVENT .. "approval.recorded" then
                actual[#actual + 1] = fact(body.decision, body.gate, body.visit)
            elseif event.type == EVENT .. "timer.fired" then
                actual[#actual + 1] = fact("timer", body.state, body.visit, body.timer)
            end
        end
    end
    for visit, state in ipairs(states) do
        local entry = visit == 1 and fact("create", state, visit) or fact("transition", state, visit, states[visit - 1])
        expected[#expected + 1] = entry
        if AUTOMATED[state] then
            local results = (outcomes and outcomes[visit]) or (visit < #states and { "passed" } or {})
            for attempt = 1, math.max(1, #results) do
                if attempt > 1 then
                    expected[#expected + 1] = fact("timer", state, visit, "$retry:" .. tostring(attempt))
                end
                expected[#expected + 1] = fact("enter", state, visit, attempt)
                if results[attempt] then
                    expected[#expected + 1] = fact(results[attempt], state, visit, attempt)
                end
            end
        elseif state == "design_review" and states[visit + 1] == "escalated" then
            expected[#expected + 1] = fact("timer", state, visit, "design_review_overdue")
        elseif GATES[state] and visit < #states then
            expected[#expected + 1] = fact("approve", state, visit)
        end
    end
    test.eq(table.concat(actual, "\n"), table.concat(expected, "\n"), path)

    local history = assert(h.call("list_history", { item = { id = id }, limit = 100 })).entries
    local from_visit = #states
    for _, entry in ipairs(history) do
        if entry.kind == "state" then
            test.eq(entry.after, states[from_visit])
            test.eq(entry.before, states[from_visit - 1])
            from_visit = from_visit - 1
        end
    end
    test.eq(from_visit, 1, "every transition appears in state history")
end

local function board(): (fixture.Handle, Call, string)
    local h = fixture.board({ bare = true })
    local install = { pack = PACK, expected_generation = 0 }
    local plan, err = h.call("pack_plan", install)
    assert(plan, steps.detail(err))
    test.eq(plan.class, "initial")
    local installed, install_err = h.call("pack_apply", {
        pack = PACK, expected_generation = 0, key = "maintainer-pipeline-pack", starter = false,
    })
    assert(installed, steps.detail(install_err))
    test.eq(installed.status, "done")
    local owner, owner_id = fixture.user(h, nil, true)
    assert(h.call("grant", { subject_id = owner_id, mask = 3 }))
    return h, owner, owner_id
end

local function item(h: fixture.Handle, id: string, expected: string): Map
    local got, err = steps.get(h, id)
    assert(got, steps.detail(err))
    test.eq(got.item.state, expected, "state of " .. got.item.key)
    return got.item :: Map
end

local function create(h: fixture.Handle, owner: string, kind: string, title: string): string
    return steps.create(h, kind, {
        title = title, owner = { kind = "user", id = owner },
        jira_key = "KS-73", review_due = "2099-01-01T00:00:00Z",
    })
end

local function applied(outcome: Map)
    test.eq(outcome.status, "applied", json.encode(outcome))
    test.eq(#(outcome.findings or {}), 0, json.encode(outcome))
end

local function transition(h: fixture.Handle, id: string, name: string)
    applied(steps.one(h, { op = "transition", item = id, transition = name }))
end

local function report(h: fixture.Handle, id: string, state: string, outcome: string, outputs: Map?, publish: boolean?, attempt: integer?): Map
    local current = item(h, id, state)
    local request = { item = id, visit = current.visit, attempt = attempt or 1, outcome = outcome, outputs = outputs }
    local response, err
    local command = id .. "/" .. tostring(current.visit) .. "/" .. tostring(request.attempt)
    if publish then
        request.op = "report"
        response, err = steps.apply(h, {
            { op = "set", item = id, values = outputs },
            request,
        }, { mode = "atomic", key = command, trace_context = { trace_id = command } })
    else
        response, err = h.call("report", request)
    end
    assert(response, steps.detail(err))
    for _, result in ipairs(response.outcomes) do applied(result) end
    local reports = events(h, id, "stage.reported")
    local reported = reports[#reports]
    test.eq(reported.body.state, state)
    test.eq(reported.body.visit, current.visit)
    test.eq(reported.body.attempt, request.attempt)
    test.eq(reported.body.outcome, outcome)
    test.eq(json.encode(reported.body.outputs), (json.encode(outputs)))
    if publish then
        local changes = events(h, id, "item.changed")
        local edit = changes[#changes]
        test.eq(edit.trace_context.trace_id, command)
        test.eq(reported.trace_context.trace_id, command)
        test.eq(reported.seq, (edit.seq :: integer) + 1)
        local transitions = events(h, id, "item.transitioned")
        local first_route = nil
        for _, event in ipairs(transitions) do
            if (event.seq :: integer) > (reported.seq :: integer) then first_route = event; break end
        end
        assert(first_route, "the same command must take the outcome transition")
        test.eq(first_route.seq, (reported.seq :: integer) + 1)
        test.eq(first_route.trace_context.trace_id, command)

        local receipt = assert(h.call("events", { from_seq = response.seq })).events[1]
        test.eq(receipt.type, "kickside.work.command:command.recorded")
        test.eq(json.decode(receipt.body).receipt.result.outcomes[2].version, response.outcomes[2].version)
    end
    return response
end

local function classify(h: fixture.Handle, id: string, kind: string, size: string, risk: string, next_state: string): Map
    transition(h, id, "screen")
    report(h, id, "screening", "passed", { screening_summary = "Accepted" }, true)
    test.eq(item(h, id, "triage").values.screening_summary, "Accepted")
    local result = report(h, id, "triage", "passed", {
        classification = kind, size = size, risk = risk, area = "work",
    }, true)
    local classified = item(h, id, next_state)
    test.eq(classified.values.classification, kind)
    test.eq(classified.values.size, size)
    test.eq(classified.values.risk, risk)
    test.eq(classified.values.area, "work")
    return result
end

local function approve(h: fixture.Handle, owner: Call, id: string, state: string)
    local result, err = owner("approve", { item = id, visit = item(h, id, state).visit, decision = "approve" })
    assert(result, steps.detail(err))
    applied(result.outcomes[1])
end

local function implement(h: fixture.Handle, id: string): Map
    local url = "https://example.com/pull/" .. tostring(item(h, id, "implement").visit)
    local result = report(h, id, "implement", "passed", { pr_url = url }, true)
    test.eq(item(h, id, "test").values.pr_url, url)
    return result
end

local function ready(h: fixture.Handle, id: string)
    implement(h, id)
    report(h, id, "test", "passed")
    report(h, id, "verification", "passed")
    item(h, id, "merge_candidate")
end

local function await_retry(h: fixture.Handle, id: string, visit: integer)
    steps.wait_for("test retry", function()
        local runs = assert(h.call("list_stage_runs", { item = { id = id }, limit = 1 })).stage_runs
        return runs[1].visit == visit and runs[1].attempt == 2
    end)
    test.eq(item(h, id, "test").visit, visit)
end

local function finish(h: fixture.Handle, owner: Call, id: string)
    transition(h, id, "ready_to_merge")
    approve(h, owner, id, "merge_prep")
    approve(h, owner, id, "release_prep")
    item(h, id, "done")
end

local function link(h: fixture.Handle, source: string, kind: string, target: string, destination: fixture.Handle?)
    local target_board = destination or h
    applied(steps.one(h, { op = "link", item = source, type = kind, target = { item = target, board = target_board.id } }))
    local links = assert(target_board.call("list_links", { item = { id = target }, direction = "inward" })).links
    local found = false
    for _, relation in ipairs(links) do
        if relation.type == kind and relation.source.item == source and relation.target.item == target then found = true end
    end
    test.is_true(found, kind .. " must be visible from its destination")
    local facts = events(h, source, "item.linked")
    test.eq(facts[#facts].body.type, kind)
    test.eq(facts[#facts].body.target.item, target)
    test.eq(facts[#facts].body.target.board, target_board.id)
end

local function changes(h: fixture.Handle, cursor: unknown, limit: integer): Map
    local page, err = h.call("list_changes", { cursor = cursor, limit = limit })
    assert(page, steps.detail(err))
    test.is_nil(page.gap)
    return page
end

local function assert_ports(h: fixture.Handle)
    local observer = scoped.admin()
    assert(h.call("grant", { subject_id = observer.id, mask = 9 }))
    local board_events = {}
    for _, entry in ipairs(steps.events(h)) do
        local kind = (entry.type :: string):match("^kickside%.work%.events:(.+)$")
        if kind then
            local schema = assert(registry.get(entry.type)).data.schema
            local ok, err = json.validate(schema, entry.body)
            test.is_true(ok, entry.type .. ": " .. tostring(err))
            local bodies = board_events[kind] or {}
            bodies[#bodies + 1] = entry.body
            board_events[kind] = bodies
        end
    end
    test.eq(#board_events["schema.applied"], 1)
    for kind, bodies in pairs(board_events) do
        local name = "kickside.work.ports:" .. kind:gsub("%.", "_")
        local port = assert(registry.get(name))
        test.eq(port.data.event, EVENT .. kind)
        local reply = observer.http("POST", "/api/automations/source-samples", {
            source = name, config = { thread_id = h.id }, limit = 100,
        })
        test.eq(reply.status, 200, name .. ": " .. reply.raw)
        test.eq(#reply.body.samples, #bodies, name)
        for i, sample in ipairs(reply.body.samples) do
            local ok, err = json.validate(reply.body.output_schema, sample)
            test.is_true(ok, name .. ": " .. tostring(err) .. " " .. json.encode(sample))
            test.eq(json.encode(sample), json.encode(bodies[i]), name .. " sample " .. tostring(i))
        end
    end
end

local function define()
    test.describe("maintainer pipeline", function()
        test.it("publishes agent outputs with their outcome and routes by the new values", function()
            local h, owner, owner_id = board()
            local bug = create(h, owner_id, "bug", "Repair issue")
            local cursor = changes(h, nil, 1).next
            local result = classify(h, bug, "bug", "small", "low", "implement")
            local snapshot = assert(h.call("list_changes", { cursor = cursor, min_seq = result.seq, limit = 1 }))
            test.eq(#snapshot.items, 1)
            test.eq(snapshot.items[1].state, "implement")
            test.eq(snapshot.items[1].values.risk, "low")
            local implementation = implement(h, bug)
            local resumed = changes(h, snapshot.next, 1)
            test.eq(#resumed.items, 1)
            test.eq(resumed.items[1].item_id, bug)
            test.eq(resumed.items[1].state, "test")
            test.eq(resumed.items[1].values.pr_url, item(h, bug, "test").values.pr_url)
            test.is_true(resumed.items[1].updated_seq <= implementation.seq)
            test.eq(#changes(h, resumed.next, 1).items, 0)

            local stale, err = steps.apply(h, {
                { op = "set", item = bug, values = { pr_url = "https://example.com/stale" } },
                { op = "report", item = bug, visit = snapshot.items[1].visit, attempt = 1, outcome = "passed" },
            }, { mode = "atomic", key = "stale-implementation-result" })
            assert(stale, steps.detail(err))
            test.is_false(stale.applied)
            test.is_true(stale.outcomes[1].rolled_back)
            test.eq(stale.outcomes[2].findings[1].code, "stage_attempt_finished")
            test.eq(item(h, bug, "test").values.pr_url, resumed.items[1].values.pr_url)
            test.eq(#changes(h, resumed.next, 1).items, 0)
            local visit = resumed.items[1].visit
            report(h, bug, "test", "failed", { result = "transient failure" })
            await_retry(h, bug, visit)
            report(h, bug, "test", "passed", { result = "passed on retry" }, false, 2)
            report(h, bug, "verification", "passed")
            finish(h, owner, bug)
            assert_lifecycle(h, bug, START .. SHIP, { [6] = { "failed", "passed" } })
            assert_ports(h)
        end)

        test.it("admits a Feature to merge prep only after all three implementation children are done", function()
            local h, owner, owner_id = board()
            local feature = create(h, owner_id, "feature", "Add maintainer workflow")
            classify(h, feature, "feature", "large", "low", "design")
            report(h, feature, "design", "passed", { design_summary = "Use Work state and ports" }, true)
            approve(h, owner, feature, "design_review")
            report(h, feature, "conformance", "passed")
            local fanout, err = steps.apply(h, {
                { op = "create", type = "subtask", parent = feature, values = { title = "Model item types" } },
                { op = "create", type = "subtask", parent = feature, values = { title = "Model transitions" } },
                { op = "create", type = "subtask", parent = feature, values = { title = "Verify event contracts" } },
            }, { mode = "atomic", key = "feature-implementation-fanout" })
            assert(fanout, steps.detail(err))
            test.is_true(fanout.applied)
            test.eq(#fanout.outcomes, 3)
            ready(h, feature)
            for i, child in ipairs(fanout.outcomes) do
                applied(child)
                test.eq(item(h, feature, "merge_candidate").values.children_done, false)
                local early = steps.one(h, { op = "transition", item = feature, transition = "ready_to_merge" })
                test.eq(early.status, "denied", json.encode(early))
                test.eq(early.findings[1].code, "when_failed")
                local id = child.item
                local initial = item(h, id, "intake")
                test.eq(initial.parent, feature)
                test.eq(initial.values.owner.id, owner_id)
                test.eq(initial.values.area, "work")
                classify(h, id, "subtask", "small", "low", "conformance")
                report(h, id, "conformance", "passed")
                ready(h, id)
                transition(h, id, "ready_to_merge")
                approve(h, owner, id, "merge_prep")
                local checkpoint = changes(h, nil, 100).next
                approve(h, owner, id, "release_prep")
                item(h, id, "done")
                assert_lifecycle(h, id, START .. "conformance" .. SHIP)
                if i == 3 then
                    local page = changes(h, checkpoint, 1)
                    test.is_true(page.has_more)
                    local remainder = changes(h, page.next, 1)
                    test.is_false(remainder.has_more)
                    test.eq(#page.items, 1)
                    test.eq(#remainder.items, 1)
                    local updates = {}
                    for _, entry in ipairs({ page.items[1], remainder.items[1] }) do updates[entry.item_id] = entry end
                    test.eq(updates[id].state, "done")
                    test.eq(updates[feature].values.children_done, true)
                    test.eq(#changes(h, remainder.next, 1).items, 0)
                end
            end
            test.eq(item(h, feature, "merge_candidate").values.children_done, true)
            finish(h, owner, feature)
            assert_lifecycle(h, feature, START .. "design design_review conformance" .. SHIP)
            local children = assert(steps.get(h, feature, { "children" })).children
            test.eq(#children, 3)
            for _, child in ipairs(children) do test.eq(child.state, "done") end
            local page, seen = changes(h, nil, 1), {}
            for i = 1, 4 do
                test.eq(#page.items, 1)
                local entry = page.items[1]
                test.eq(entry.op, "upsert")
                test.eq(entry.state, "done")
                test.is_nil(seen[entry.item_id])
                seen[entry.item_id] = true
                test.eq(page.has_more, i < 4)
                page = changes(h, page.next, 1)
            end
            test.eq(#page.items, 0)
            assert_ports(h)
        end)

        test.it("counts attempts within visits and escalates when implementation cannot be re-entered", function()
            local h, owner, owner_id = board()
            local bug = create(h, owner_id, "bug", "Repair intermittent issue")
            classify(h, bug, "bug", "small", "low", "implement")
            local implement_visits, test_visits = {}, {}
            for visit = 1, 2 do
                implement_visits[visit] = item(h, bug, "implement").visit
                implement(h, bug)
                local current = item(h, bug, "test")
                test_visits[visit] = current.visit
                report(h, bug, "test", "failed", { result = "retry" })
                await_retry(h, bug, current.visit :: integer)
                report(h, bug, "test", "failed", { result = "repair" }, false, 2)
            end
            test.is_true(implement_visits[1] < test_visits[1])
            test.is_true(test_visits[1] < implement_visits[2])
            test.is_true(implement_visits[2] < test_visits[2])
            test.eq(item(h, bug, "escalated").values.escalation_reason, "implementation_exhausted")
            local runs = assert(h.call("list_stage_runs", { item = { id = bug } })).stage_runs
            test.eq(#runs, 8)
            for i, state in ipairs({ "test", "test", "implement", "test", "test", "implement", "triage", "screening" }) do
                test.eq(runs[i].state, state)
                test.eq(runs[i].attempt, (i == 1 or i == 4) and 2 or 1)
                test.eq(runs[i].outcome, state == "test" and "failed" or "passed")
            end
            for i = 1, 2 do
                local offset = (2 - i) * 3
                test.eq(runs[offset + 1].visit, test_visits[i])
                test.eq(runs[offset + 2].visit, test_visits[i])
                test.eq(runs[offset + 3].visit, implement_visits[i])
            end
            approve(h, owner, bug, "escalated")
            finish(h, owner, bug)
            local retries = events(h, bug, "timer.fired")
            test.eq(#retries, 2)
            for i, retry in ipairs(retries) do
                test.eq(retry.body.timer, "$retry:2")
                test.eq(retry.body.state, "test")
                test.eq(retry.body.visit, test_visits[i])
            end
            assert_lifecycle(h, bug, START .. "implement test implement test escalated merge_candidate merge_prep release_prep done", {
                [6] = { "failed", "failed" }, [8] = { "failed", "failed" },
            })
            assert_ports(h)
        end)

        test.it("enforces the owner reviews and conformance, and links the work that a change and release carry", function()
            local h, owner, owner_id = board()
            local security = create(h, owner_id, "security", "Review access controls")
            local high_risk_bug = create(h, owner_id, "bug", "Repair high-risk issue")
            local change = create(h, owner_id, "change", "Incoming pull request")
            local release = create(h, owner_id, "release", "Maintenance release")
            link(h, security, "blocks", change)
            link(h, change, "implements", high_risk_bug)
            link(h, release, "ships", change)
            link(h, release, "ships", security)
            classify(h, security, "security", "small", "high", "security_review")
            approve(h, owner, security, "security_review")
            report(h, security, "conformance", "passed")
            ready(h, security)
            finish(h, owner, security)
            assert_lifecycle(h, security, START .. "security_review conformance" .. SHIP)

            classify(h, high_risk_bug, "bug", "small", "high", "design")
            report(h, high_risk_bug, "design", "passed")
            local review = item(h, high_risk_bug, "design_review")
            local denied, err = h.call("approve", { item = high_risk_bug, visit = review.visit, decision = "approve" })
            assert(denied, steps.detail(err))
            test.eq(denied.outcomes[1].status, "denied", json.encode(denied.outcomes[1]))
            test.eq(item(h, high_risk_bug, "design_review").visit, review.visit)
            test.eq(#events(h, high_risk_bug, "approval.recorded"), 0)
            approve(h, owner, high_risk_bug, "design_review")
            report(h, high_risk_bug, "conformance", "failed", { reason = "design needs revision" })
            test.eq(#events(h, high_risk_bug, "stage.entered"), 5)
            report(h, high_risk_bug, "design", "passed", { design_summary = "Address conformance" }, true)
            approve(h, owner, high_risk_bug, "design_review")
            report(h, high_risk_bug, "conformance", "passed")
            implement(h, high_risk_bug)
            report(h, high_risk_bug, "test", "passed")
            report(h, high_risk_bug, "verification", "failed", { reason = "check failed" })
            ready(h, high_risk_bug)
            finish(h, owner, high_risk_bug)
            assert_lifecycle(h, high_risk_bug,
                START .. "design design_review conformance design design_review conformance implement test verification" .. SHIP,
                { [7] = { "failed" }, [13] = { "failed" } })

            for _, entry in ipairs({ { id = change, kind = "change" }, { id = release, kind = "release" } }) do
                classify(h, entry.id, entry.kind, "small", "low", "conformance")
                report(h, entry.id, "conformance", "passed")
                ready(h, entry.id)
                finish(h, owner, entry.id)
                assert_lifecycle(h, entry.id, START .. "conformance" .. SHIP)
            end
            assert_ports(h)
        end)

        test.it("refuses a direct transition that would bypass the automated Conformance verdict", function()
            local h, owner, owner_id = board()
            local security = create(h, owner_id, "security", "Conformance admission")
            classify(h, security, "security", "small", "high", "security_review")
            approve(h, owner, security, "security_review")
            local entered = item(h, security, "conformance")
            local denied = steps.one(h, { op = "transition", item = security, transition = "conformant" })
            test.eq(denied.status, "invalid", json.encode(denied))
            test.eq(denied.findings[1].code, "unknown_transition")
            test.eq(item(h, security, "conformance").visit, entered.visit)
            test.eq(#events(h, security, "stage.reported"), 2)
            report(h, security, "conformance", "passed")
            item(h, security, "implement")
            assert_lifecycle(h, security, START .. "security_review conformance implement")
            assert_ports(h)
        end)

        test.it("admits only the item types declared at each end of a directional relation", function()
            local h, _, owner_id = board()
            local destination, _, destination_owner = board()
            assert(destination.call("grant", { subject_id = h.actor:id(), mask = 1 }))
            assert(h.call("grant", { subject_id = destination.actor:id(), mask = 1 }))
            local feature = create(h, owner_id, "feature", "Change target")
            local change = create(h, owner_id, "change", "Incoming change")
            local release = create(h, owner_id, "release", "Shipping source")
            local remote_bug = create(destination, destination_owner, "bug", "Change target on another board")
            local remote_release = create(destination, destination_owner, "release", "Invalid cross-board target")
            for _, entry in ipairs({
                { item = feature, type = "implements", target = change, code = "relation_source_type" },
                { item = change, type = "implements", target = release, code = "relation_target_type" },
                { item = change, type = "ships", target = feature, code = "relation_source_type" },
                { item = change, type = "implements", target = remote_release, board = destination.id, code = "relation_target_type" },
            }) do
                local denied = steps.one(h, { op = "link", item = entry.item, type = entry.type,
                    target = { item = entry.target, board = entry.board } })
                test.eq(denied.status, "invalid", json.encode(denied))
                test.eq(denied.findings[1].code, entry.code)
                test.eq(#events(h, entry.item, "item.linked"), 0)
            end
            link(h, change, "implements", feature)
            link(h, change, "implements", remote_bug, destination)
            link(h, release, "ships", feature)
            local plan = assert(h.call("plan_schema", { declaration = { relation_types = {
                { id = "implements", from_types = { "change" }, to_types = { "feature" } },
            } } }))
            test.eq(plan.class, "refused")
            test.eq(plan.refused[1].what, "shape")
            assert_ports(h)
        end)

        test.it("escalates a Design review at its item deadline and resumes after the owner approves", function()
            local h, owner, owner_id = board()
            local feature = create(h, owner_id, "feature", "Review deadline")
            classify(h, feature, "feature", "large", "low", "design")
            local due = time.now():utc():add(3 * time.SECOND):format("2006-01-02T15:04:05.000000000Z")
            applied(steps.one(h, { op = "set", item = feature, values = { review_due = due } }))
            local review_visit = (item(h, feature, "design").visit :: integer) + 1
            report(h, feature, "design", "passed")
            steps.wait_for("Design review deadline", function()
                return assert(steps.get(h, feature)).item.state == "escalated"
            end)
            local escalated = item(h, feature, "escalated")
            test.eq(escalated.values.escalation_reason, "design_review_overdue")
            local timers = events(h, feature, "timer.fired")
            test.eq(#timers, 1)
            test.eq(timers[1].body.timer, "design_review_overdue")
            test.eq(timers[1].body.state, "design_review")
            test.eq(timers[1].body.visit, review_visit)
            test.eq(timers[1].body.scheduled_at, due)
            approve(h, owner, feature, "escalated")
            report(h, feature, "conformance", "passed")
            ready(h, feature)
            finish(h, owner, feature)
            assert_lifecycle(h, feature, START .. "design design_review escalated conformance" .. SHIP)
            assert_ports(h)
        end)
    end)
end

return { run = test.run_cases(define) }
