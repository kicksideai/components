-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local session = require("session")
local fixture = require("fixture")
local json = require("json")
local uuid = require("uuid")
local security = require("security")
local repo = require("repo")
local workflow = require("workflow")
local publish = require("publish")
local M = {}

function M.publish()
    local created = assert(repo.create("Work administration stage"))
    local actor = assert(security.actor()):id()
    assert(workflow.apply(created.id, {
        { type = "node.add", body = { id = "start", kind = "start", config = { input_schema = { type = "object" } } } },
        { type = "node.add", body = { id = "step", kind = "block", ref = "app:flow_compatibility_block" } },
        { type = "node.add", body = { id = "finish", kind = "finish", config = { output_schema = { type = "object" } } } },
        { type = "edge.add", body = { id = "entry", source_id = "start", target_id = "step" } },
        { type = "edge.add", body = { id = "exit", source_id = "step", target_id = "finish" } },
    }, actor))
    local published = assert(publish.publish(created.id, actor))
    assert(published.ok, json.encode(published))
    return { kind = "flow", id = created.id, version = 1 }
end

local function cases()
    test.describe("Work Admin Flow binding compatibility", function()
        test.it("plans, applies and reloads a stage bound to a published Flow version", function()
            local owner = session.admin()
            local declaration = fixture.declaration()
            local created = owner.post("/work/boards", {
                title = "Flow compatibility", declaration = { key_prefix = declaration.key_prefix }, idempotency_key = uuid.v4(),
            })
            test.eq(created.status, 200, json.encode(created.body))
            local ref = assert(owner.call("publish_flow", {}))
            declaration.processes[1].states[1] = { id = "todo", category = "started", kind = "automated", run = {
                stage = "Build", on_pass = "finish", on_fail = "finish", flow_ref = ref,
            } }
            local path = "/work/boards/" .. created.body.data.board_id
            local planned = owner.post(path .. "/plan_schema", { declaration = declaration, expected_generation = 1 })
            test.eq(planned.status, 200, json.encode(planned.body))
            local applied = owner.post(path .. "/apply_schema", {
                declaration = declaration, expected_generation = 1, key = uuid.v4(),
            })
            test.eq(applied.status, 200, json.encode(applied.body))
            local loaded = owner.post(path .. "/get_schema", {})
            test.eq(loaded.status, 200, json.encode(loaded.body))
            local saved = loaded.body.data.declaration.processes[1].states[1].run.flow_ref
            test.eq(saved.kind, "flow")
            test.eq(saved.id, ref.id)
            test.eq(saved.version, 1)
        end)
    end)
end

M.run = test.run_cases(cases)
M.step = function(input: unknown): unknown return input end
return M
