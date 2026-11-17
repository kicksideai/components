-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local fixture = require("fixture")
local steps = require("steps")
local values = require("values")
local json = require("json")
local rows = require("rows")
local uuid = require("uuid")

local function declaration(h, ref)
    return { key_prefix = h.prefix, fields = {}, item_types = { { id = "task", process = "p", fields = {} } },
        processes = { { id = "p", initial = "ready", migration = "pin", states = {
            { id = "ready", category = "unstarted" },
            { id = "build", category = "started", kind = "automated", run = {
                stage = "Build", flow_ref = ref, retry = { max = 2, backoff = "PT0.05S" },
            } },
        }, transitions = { { id = "start", from = { "ready" }, to = "build" } } } } }
end

local function actor(h, input)
    input.board_id = h.id
    return h.call("direct", { target = "app:flow_binding_actor", input = input })
end
local function define()
    test.describe("stage Flow declaration", function()
        test.it("accepts an exact Flow binding and freezes initial and retry entry envelopes", function()
            local h = fixture.board({ bare = true })
            local ref = assert(actor(h, { op = "flow" }))
            local d = declaration(h, ref)
            assert(actor(h, { op = "fault", fault = "success" }))
            assert(h.call("apply_schema", { declaration = d }))
            local id = steps.create(h, "task")
            steps.one(h, { op = "transition", item = id, transition = "start" })
            local replacement = assert(actor(h, { op = "flow" }))
            d.processes[1].states[2].run.flow_ref = replacement
            assert(h.call("apply_schema", { declaration = d }))
            assert(h.call("report", { item = id, visit = 2, attempt = 1, outcome = "failed" }))
            steps.wait_for("frozen retry entry", function()
                local count = 0
                for _, e in ipairs(steps.events(h)) do if e.type == "kickside.work.events:stage.entered" then count = count + 1 end end
                return count == 2
            end)
            local count = 0
            for _, e in ipairs(steps.events(h)) do
                if e.type == "kickside.work.events:stage.entered" then
                    count = count + 1
                    test.is_true(values.equal(e.body.flow_ref, ref))
                    test.eq(e.body.board_id, h.id)
                    test.eq(e.body.item, id)
                    test.eq(e.body.state, "build")
                    test.eq(e.body.visit, 2)
                    test.eq(e.body.attempt, count)
                end
            end
            test.eq(count, 2)
            local next_item = steps.create(h, "task")
            steps.one(h, { op = "transition", item = next_item, transition = "start" })
            for _, e in ipairs(steps.events(h)) do
                if e.type == "kickside.work.events:stage.entered" and e.body.item == next_item then
                    test.is_true(values.equal(e.body.flow_ref, replacement))
                end
            end
            ref.version = 3
            for _, e in ipairs(steps.events(h)) do
                if e.type == "kickside.work.events:stage.entered" and e.body.item == id then
                    test.eq(e.body.flow_ref.id, ref.id)
                    test.eq(e.body.flow_ref.version, 1)
                end
            end
        end)
        test.it("rejects malformed and unknown Flow reference fields during compilation", function()
            local h = fixture.board({ bare = true })
            for _, ref in ipairs({ {}, { kind = "run", id = uuid.v4(), version = 1 },
                { kind = "flow", id = "", version = 1 }, { kind = "flow", id = " padded ", version = 1 },
                { kind = "flow", id = uuid.v4(), version = 0 }, { kind = "flow", id = uuid.v4(), version = 1.5 },
                { kind = "flow", id = uuid.v4(), version = 1, mapping = {} } }) do
                local _, err = h.call("plan_schema", { declaration = declaration(h, ref) })
                test.not_nil(err)
                test.eq(err:kind(), errors.INVALID)
                test.eq(err:details().code, "stage_flow_ref_invalid")
            end
        end)
        test.it("rejects missing draft and mismatched published versions on plan and apply", function()
            for _, mode in ipairs({ "missing", "draft", "version" }) do
                local h = fixture.board({ bare = true })
                local ref = mode == "missing" and { kind = "flow", id = uuid.v4(), version = 1 }
                    or assert(actor(h, { op = "flow", draft = mode == "draft" }))
                if mode == "version" then ref.version = 2 end
                for _, method in ipairs({ "plan_schema", "apply_schema" }) do
                    local result, err = h.call(method, { declaration = declaration(h, ref) })
                    test.is_nil(result)
                    test.not_nil(err)
                end
            end
        end)
        test.it("checks both the schema administrator and stored launch principal Flow access", function()
            local h = fixture.board({ bare = true })
            local other, other_id = fixture.user(h)
            assert(h.call("grant", { subject_id = other_id, mask = 15 }))
            local owner_ref = assert(actor(h, { op = "flow" }))
            local admin_ref = assert(other("direct", { target = "app:flow_binding_actor", input = { op = "flow" } }))
            for _, ref in ipairs({ owner_ref, admin_ref }) do
                for _, method in ipairs({ "plan_schema", "apply_schema" }) do
                    local result, err = other(method, { declaration = declaration(h, ref) })
                    test.is_nil(result)
                    test.not_nil(err)
                    test.eq(err:kind(), errors.PERMISSION_DENIED)
                end
            end
        end)
        test.it("requires a Start schema compatible with the entire fixed Work envelope", function()
            for _, schema in ipairs({
                { type = "object", required = { "custom" } },
                { type = "object", additionalProperties = false, properties = { item = { type = "string" } } },
                { type = "object", properties = { attempt = { type = "string" } } },
                { type = "object", properties = { visit = { type = "integer", minimum = 2 } } },
                { type = "object", properties = { attempt = { enum = { 1 } } } },
            }) do
                local h = fixture.board({ bare = true })
                local ref = assert(actor(h, { op = "flow", schema = schema }))
                for _, method in ipairs({ "plan_schema", "apply_schema" }) do
                    local result, err = h.call(method, { declaration = declaration(h, ref) })
                    test.is_nil(result)
                    test.not_nil(err)
                    test.eq(err:details().code, "stage_flow_input_incompatible")
                end
            end
        end)
        test.it("keeps planning pure and reuses the constant installer request across schema retries and rebinding", function()
            local h = fixture.board({ bare = true })
            local ref = assert(actor(h, { op = "flow" }))
            local d = declaration(h, ref)
            assert(h.call("plan_schema", { declaration = d }))
            local absent, missing = actor(h, { op = "launcher" })
            test.is_nil(absent)
            test.not_nil(missing)
            assert(actor(h, { op = "fault", fault = "success" }))
            assert(h.call("apply_schema", { declaration = d, expected_generation = 0 }))
            local first = assert(actor(h, { op = "installation" }))
            first = assert(json.decode(first.installation))
            test.eq(first.args.principal.id, h.actor:id())
            assert(h.call("apply_schema", { declaration = d, expected_generation = 1 }))
            d.processes[1].states[2].run.flow_ref = assert(actor(h, { op = "flow" }))
            assert(h.call("apply_schema", { declaration = d, expected_generation = 1 }))
            local second = assert(json.decode(assert(actor(h, { op = "installation" })).installation))
            test.is_true(values.equal(second, first))
        end)
        test.it("retries interrupted installer calls before accepting the bound schema", function()
            for _, fault in ipairs({ "install", "ack" }) do
                local h = fixture.board({ bare = true })
                local ref = assert(actor(h, { op = "flow" }))
                local d = declaration(h, ref)
                assert(actor(h, { op = "fault", fault = fault }))
                local result, err = h.call("apply_schema", { declaration = d, expected_generation = 0 })
                test.is_nil(result)
                test.not_nil(err)
                test.eq(err:details().code, "binding_interrupted")
                test.eq(rows.scalar("SELECT COUNT(*) AS n FROM kickside_work_board WHERE board_id=$1", {h.id}), 0)
                assert(h.call("apply_schema", { declaration = d, expected_generation = 0 }))
                test.not_nil(assert(actor(h, { op = "installation" })).installation)
            end
        end)
        test.it("reuses installer identity when the schema append retries after a conflict", function()
            local h = fixture.board({ bare = true })
            local ref = assert(actor(h, { op = "flow" }))
            assert(actor(h, { op = "fault", fault = "append" }))
            assert(h.call("apply_schema", { declaration = declaration(h, ref), expected_generation = 0 }))
            test.not_nil(assert(actor(h, { op = "installation" })).installation)
            test.eq(rows.scalar("SELECT appends AS n FROM work_binding_fault WHERE board_id=$1", {h.id}), 2)
        end)
        test.it("does not accept a schema without installer acknowledgement", function()
            local h = fixture.board({ bare = true })
            local ref = assert(actor(h, { op = "flow" }))
            assert(actor(h, { op = "fault", fault = "no_result" }))
            local result, err = h.call("apply_schema", { declaration = declaration(h, ref) })
            test.is_nil(result)
            test.not_nil(err)
            test.eq(err:details().code, "stage_launcher_unacknowledged")
            test.eq(rows.scalar("SELECT COUNT(*) AS n FROM kickside_work_board WHERE board_id=$1", {h.id}), 0)
        end)
        test.it("uses complete regional locators for initial and retry bindings", function()
            local h = fixture.board({ bare = true })
            local ref = assert(actor(h, { op = "flow" }))
            local d = declaration(h, ref)
            local p = d.processes[1]
            p.states[#p.states + 1] = { id = "parallel", category = "started", kind = "parallel", join = "all",
                regions = { { id = "lane", initial = "build" } } }
            p.transitions[1].to = "parallel"
            assert(actor(h, { op = "fault", fault = "success" }))
            assert(h.call("apply_schema", { declaration = d }))
            local id = steps.create(h, "task")
            steps.one(h, { op = "transition", item = id, transition = "start" })
            assert(h.call("report", { item = id, visit = 3, attempt = 1, outcome = "failed" }))
            steps.wait_for("regional retry", function()
                local n = 0
                for _, e in ipairs(steps.events(h)) do
                    if e.type == "kickside.work.events:stage.entered" then n = n + 1 end
                end
                return n == 2
            end)
            for _, e in ipairs(steps.events(h)) do
                if e.type == "kickside.work.events:stage.entered" then
                    test.eq(e.body.board_id, h.id)
                    test.eq(e.body.item, id)
                    test.eq(e.body.state, "build")
                    test.eq(e.body.visit, 3)
                    test.is_true(values.equal(e.body.flow_ref, ref))
                end
            end
        end)
        test.it("validates pack bindings and revalidates frozen pack schemas before append", function()
            local h = fixture.board({ bare = true })
            local missing = { kind = "flow", id = uuid.v4(), version = 1 }
            assert(actor(h, { op = "pack", declaration = declaration(h, missing) }))
            for _, method in ipairs({ "pack_plan", "pack_apply" }) do
                local result, err = h.call(method, { pack = "app:binding_pack", expected_generation = 0, key = "binding-pack" })
                test.is_nil(result)
                test.not_nil(err)
            end
            local ref = assert(actor(h, { op = "flow" }))
            local _,successor=fixture.user(h)
            local result, err = actor(h, { op = "frozen", declaration = declaration(h, ref), ref = ref, successor=successor })
            test.is_nil(result)
            test.not_nil(err)
            test.eq(err:kind(), errors.PERMISSION_DENIED)
            test.eq(rows.scalar("SELECT COUNT(*) AS n FROM kickside_work_board WHERE board_id=$1", {h.id}), 0)
        end)
        test.it("provisions a real owned launcher and reuses it after a schema retry", function()
            local h = fixture.board({ bare = true })
            local ref = assert(actor(h, { op = "flow" }))
            local d = declaration(h, ref)
            assert(h.call("apply_schema", { declaration = d }))
            local first = assert(actor(h, { op = "launcher" }))
            test.eq(first.identity.principal.id, h.actor:id())
            test.eq(first.execution_identity.component_id, h.id)
            assert(h.call("apply_schema", { declaration = d }))
            test.eq(assert(actor(h, { op = "launcher" })).id, first.id)
        end)
        test.it("refuses to adopt an operator component at the owned launcher ID", function()
            local h = fixture.board({ bare = true })
            local ref = assert(actor(h, { op = "flow" }))
            assert(actor(h, { op = "occupy" }))
            local result, err = h.call("apply_schema", { declaration = declaration(h, ref) })
            test.is_nil(result)
            test.not_nil(err)
            test.eq(err:details().code,"stage_launcher_occupied")
            test.eq(rows.scalar("SELECT COUNT(*) AS n FROM kickside_automation_op WHERE automation_id=$1", {assert(actor(h,{op="launcher_id"}))}),0)
            test.eq(rows.scalar("SELECT COUNT(*) AS n FROM kickside_work_board WHERE board_id=$1", {h.id}), 0)
        end)
    end)
end
return { run = test.run_cases(define) }
