-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local session = require("session")
local fixture = require("fixture")
local json = require("json")
local uuid = require("uuid")
local registry = require("registry")
local time = require("time")
local mcp_migration_fault = require("mcp_migration_fault")
local http_client = require("http_client")
local NS = "kickside.work.traits:"
local URL = "http://127.0.0.1:19241/mcp"

local function create(owner: session.Session, declaration: unknown?): string
    local created = owner.post("/work/boards", {
        title = "MCP test board", declaration = declaration or fixture.declaration(), idempotency_key = (uuid.v4()),
    })
    test.eq(created.status, 200, json.encode(created.body))
    return created.body.data.board_id
end

local function credential(owner: session.Session, board_id: string, traits: { string }, tools: { string }?)
    local contexts = table.create(0, #traits)
    for _, trait in ipairs(traits) do contexts[trait] = { board_id = board_id } end
    local minted = owner.post("/mcp/credentials", {
        label = "Work trait fixture", allowed_trait_ids = traits, default_active_trait_ids = traits,
        allowed_tool_ids = tools,
        agent_profile = { trait_contexts = contexts },
    })
    test.eq(minted.status, 200, json.encode(minted.body))
    local token = assert(minted.body.credential.token, "credential did not include a bearer token")
    return function(method: string, params: unknown?): unknown
        local response, err = http_client.request("POST", URL, {
            headers = { Authorization = "Bearer " .. token, ["Content-Type"] = "application/json",
                Accept = "application/json, text/event-stream" },
            body = json.encode({ jsonrpc = "2.0", id = uuid.v4(), method = method, params = params }),
        })
        test.is_nil(err, tostring(err))
        test.eq(response.status_code, 200, response.body)
        local body = assert(json.decode(response.body))
        test.is_nil(body.error, response.body)
        return body.result
    end
end

local function aliases(rpc)
    local tools = {}
    for _, descriptor in ipairs(rpc("tools/list").tools) do
        if descriptor.name:sub(1, 4) == "Work" then tools[descriptor.name] = descriptor end
    end
    return tools
end

local function assert_surface(rpc, traits)
    local expected = {}
    for _, trait in ipairs(traits) do
        for _, tool in ipairs(assert(registry.get(trait)).data.tools) do
            expected[assert(registry.get(tool)).meta.llm_alias] = true
        end
    end
    local tools = aliases(rpc)
    local count = 0
    for name in pairs(expected) do
        test.not_nil(tools[name], name)
        test.not_nil(tools[name].inputSchema, name)
        test.not_nil(tools[name].outputSchema, name)
        count = count + 1
    end
    for name in pairs(tools) do test.is_true(expected[name], name) end
    return count
end

local function checked_tools(rpc, exercised)
    local descriptors = aliases(rpc)
    return function(name: string, args: unknown?): unknown
        local descriptor = assert(descriptors[name], name)
        local result = rpc("tools/call", { name = name, arguments = args or table.create(0, 1) })
        local payload = result.content[1].text
        assert(not result.isError, name .. ": " .. payload)
        local structured = result.structuredContent
        test.not_nil(structured, name .. " omitted structuredContent")
        local valid, validation_err = json.validate_string(descriptor.outputSchema, assert(json.encode(structured)))
        test.is_true(valid, name .. ": " .. tostring(validation_err))
        exercised[name] = true
        return structured
    end
end

local function add_item(call)
    local result = call("WorkApply", { ops = { { op = "create", type = "task", values = { title = "MCP item" } } } })
    assert(result.applied, json.encode(result))
    return assert(result.outcomes[1].item)
end

local function cases()
    test.describe("published MCP transport over Work traits", function()
        local exercised = {}
        test.it("lists all static Work tools and invokes reads and board administration under trait context", function()
            local owner = session.admin()
            local id = create(owner)
            local traits = { NS .. "work", NS .. "work_admin" }
            local rpc = credential(owner, id, traits)
            test.eq(assert_surface(rpc, traits), 41)
            local schema = rpc("tools/call", { name = "WorkGetSchema", arguments = table.create(0, 1) })
            test.is_false(schema.isError, schema.content[1].text)
            test.eq(assert(json.decode(schema.content[1].text)).generation, 1)
            local updated = rpc("tools/call", { name = "WorkUpdateBoard", arguments = { title = "Via MCP" } })
            test.is_false(updated.isError, updated.content[1].text)
            test.eq(assert(json.decode(updated.content[1].text)).board_id, id)
        end)
        test.it("runs item and saved-view tools against their advertised output schemas", function()
            local owner = session.admin()
            local id = create(owner)
            local call = checked_tools(credential(owner, id, { NS .. "work", NS .. "work_admin" }), exercised)
            local item = add_item(call)
            local reference = { item = { id = item } }
            test.is_true(call("WorkTransition", { ops = { { op = "transition", item = item, transition = "finish" } } }).applied)
            test.is_true(call("WorkComment", { ops = { { op = "comment", item = item, body = "MCP comment" } } }).applied)
            test.eq(call("WorkGetItem", reference).item.id, item)
            test.eq(call("WorkFindItems").items[1].id, item)
            test.eq(call("WorkCount").total, 1)
            test.not_nil(call("WorkExplain").plan)
            test.not_nil(call("WorkListHistory", reference).entries[1])
            test.eq(call("WorkGetTimeInState", reference).field, "state")
            test.eq(#call("WorkListLinks", reference).links, 0)
            test.eq(call("WorkListComments", reference).comments[1].body, "MCP comment")
            test.eq(call("WorkListChanges").items[1].item_id, item)
            test.eq(#call("WorkListStageRuns", reference).stage_runs, 0)
            local view = call("WorkCreateView", { title = "MCP list", view = { type = "list" } }).view_id
            test.eq(call("WorkListViews").views[1].view_id, view)
            test.eq(call("WorkGetView", { view_id = view }).board_id, id)
            test.eq(call("WorkRunView", { view_id = view }).items[1].id, item)
            test.eq(call("WorkSaveView", { view_id = view, view = { type = "list", columns = { "title" } } }).view_id, view)
            test.eq(call("WorkRenameView", { view_id = view, title = "MCP renamed" }).view_id, view)
            test.eq(call("WorkDeleteView", { view_id = view }).view_id, view)
        end)
        test.it("keeps direct WorkComment and WorkTransition grants within their advertised operations", function()
            local owner = session.admin()
            local id = create(owner)
            local read_write = checked_tools(credential(owner, id, { NS .. "work" }), exercised)
            local item = add_item(read_write)
            local reference = { item = { id = item } }
            local allowed = {
                { name = "WorkComment", tool = "comment", op = { op = "comment", item = item, body = "Allowed comment" } },
                { name = "WorkTransition", tool = "transition", op = { op = "transition", item = item, transition = "finish" } },
            }
            for _, grant in ipairs(allowed) do
                local rpc = credential(owner, id, {}, { NS .. grant.tool })
                local tools = aliases(rpc)
                test.not_nil(tools[grant.name])
                for name in pairs(tools) do test.eq(name, grant.name) end
                local call = checked_tools(rpc, exercised)
                test.is_true(call(grant.name, { board_id = id, ops = { grant.op } }).applied)
                for _, foreign in ipairs({
                    { op = "create", type = "task", values = { title = "Forbidden create" } },
                    { op = "set", item = item, values = { title = "Forbidden edit" } },
                }) do
                    local args = { board_id = id, mode = "independent", ops = { grant.op, foreign } }
                    test.is_false(json.validate_string(tools[grant.name].inputSchema, json.encode(args)) == true)
                    local result = rpc("tools/call", { name = grant.name, arguments = args })
                    test.is_true(result.isError, grant.name .. " accepted " .. foreign.op)
                    test.eq(result.structuredContent.error.kind, errors.INVALID)
                end
            end
            local saved = read_write("WorkGetItem", reference).item
            test.eq(saved.values.title, "MCP item")
            test.eq(saved.state, "done")
            test.eq(#read_write("WorkFindItems").items, 1)
            local comments = read_write("WorkListComments", reference).comments
            test.eq(#comments, 1)
            test.eq(comments[1].body, "Allowed comment")
        end)
        test.it("reports a genuine mixed WorkApply rollback and commits a corrected batch", function()
            local owner = session.admin()
            local id = create(owner)
            local call = checked_tools(credential(owner, id, { NS .. "work" }), exercised)
            local first, stale = add_item(call), add_item(call)
            local first_ref, stale_ref = { item = { id = first } }, { item = { id = stale } }
            local version = call("WorkGetItem", stale_ref).item.version
            test.is_true(call("WorkApply", {
                ops = { { op = "set", item = stale, values = { title = "Current" } } },
            }).applied)
            local ops = {
                { op = "comment", item = first, body = "Mixed batch" },
                { op = "set", item = stale, expect_version = version, values = { title = "Corrected" } },
            }
            local refused = call("WorkApply", { ops = ops })
            test.is_true(refused.success)
            test.is_false(refused.applied)
            test.eq(refused.outcomes[1].status, "unchanged")
            test.is_true(refused.outcomes[1].rolled_back)
            test.eq(refused.outcomes[2].status, "conflict")
            test.eq(refused.outcomes[2].findings[1].code, "version_mismatch")
            test.eq(#call("WorkListComments", first_ref).comments, 0)
            local current = call("WorkGetItem", stale_ref).item
            test.eq(current.values.title, "Current")
            ops[2].expect_version = current.version
            local applied = call("WorkApply", { ops = ops })
            test.is_true(applied.applied)
            test.eq(applied.outcomes[1].status, "applied")
            test.eq(applied.outcomes[2].status, "applied")
            test.eq(call("WorkListComments", first_ref).comments[1].body, "Mixed batch")
            test.eq(call("WorkGetItem", stale_ref).item.values.title, "Corrected")
        end)
        test.it("runs bulk and cross-board move tools against their advertised output schemas", function()
            local owner = session.admin()
            local traits = { NS .. "work", NS .. "work_admin" }
            local bulk_call = checked_tools(credential(owner, create(owner), traits), exercised)
            add_item(bulk_call)
            local bulk = bulk_call("WorkBulk", { key = uuid.v4(), query = table.create(0, 1),
                ops_template = { { op = "set", values = { title = "Bulk update" } } } })
            test.eq(bulk_call("WorkBulkStatus", { bulk_id = bulk.bulk_id }).bulk_id, bulk.bulk_id)
            test.eq(bulk_call("WorkCancelBulk", { bulk_id = bulk.bulk_id }).bulk_id, bulk.bulk_id)
            local id, target = create(owner), create(owner)
            local call = checked_tools(credential(owner, id, traits), exercised)
            local item = add_item(call)
            local move = { item = item, to_board = target, key = uuid.v4(), map = {
                type = { task = "task" }, state = { todo = "todo", done = "done" },
                fields = { title = "title" }, relations = table.create(0, 1),
            } }
            test.is_true(call("WorkPlanMove", move).allowed)
            local moved = call("WorkMove", move)
            local status = call("WorkMoveStatus", { move_id = moved.move_id })
            for attempt = 1, 40 do
                if status.status == "done" then break end
                time.sleep("100ms")
                status = call("WorkMoveStatus", { move_id = moved.move_id })
            end
            test.eq(status.status, "done", json.encode(status))
            test.eq(call("WorkGetItem", { board_id = target, item = { id = status.item } }).item.id, status.item)
        end)
        test.it("runs schema and pack tools against their advertised output schemas", function()
            local owner = session.admin()
            local id = create(owner)
            local call = checked_tools(credential(owner, id, { NS .. "work", NS .. "work_admin" }), exercised)
            test.eq(call("WorkListBoards").boards[1].board_id, id)
            test.eq(call("WorkGetSchema").generation, 1)
            test.eq(call("WorkUpdateBoard", { description = "MCP description" }).board_id, id)
            local draft = { declaration = { fields = { { code = "title", title = "Name", form = "text", index = "key" } } }, expected_generation = 1 }
            test.eq(call("WorkPlanSchema", draft).generation, 2)
            draft.key = uuid.v4()
            test.eq(call("WorkApplySchema", draft).generation, 2)
            test.not_nil(call("WorkSchemaOptions").plugins[1])
            test.not_nil(call("WorkListPacks").packs[1])
            local empty = call("WorkCreateBoard", { idempotency_key = uuid.v4(), title = "MCP pack target" })
            local request = { board_id = empty.board_id, pack = "app:configured_pack", expected_generation = empty.generation,
                plugin_configs = { ["app:ui_plugin"] = { threshold = 2 } } }
            test.not_nil(call("WorkPackPlan", request).digest)
            request.key = uuid.v4()
            test.eq(call("WorkPackApply", request).status, "done")
            test.not_nil(call("WorkConfigurePlugin", { board_id = empty.board_id, plugin = "app:ui_plugin", config = { threshold = 3 } }).attachment_id)
            test.eq(call("WorkListPackBoards", { pack = request.pack }).boards[1].board_id, empty.board_id)
        end)
        test.it("records gate approval and an automated stage report over MCP", function()
            local owner = session.admin()
            local gate = fixture.declaration()
            gate.processes = { { id = "delivery", initial = "review", states = {
                { id = "review", category = "started", kind = "gate", release_when = {
                    approvals = { min = 1, from = { { kind = "user", id = owner.id } } },
                } },
                { id = "done", category = "completed" },
            }, transitions = { { id = "release", from = { "review" }, to = "done", auto = true, default = true } } } }
            local gate_id = create(owner, gate)
            local call = checked_tools(credential(owner, gate_id, { NS .. "work" }), exercised)
            local item = add_item(call)
            test.is_true(call("WorkApprove", { item = item, visit = 1 }).applied)
            test.eq(call("WorkGetItem", { item = { id = item } }).item.state, "done")
            local stage = fixture.declaration()
            stage.processes = { { id = "delivery", initial = "build", states = {
                { id = "build", category = "started", kind = "automated", run = { stage = "Build", on_fail = "failed" } },
                { id = "done", category = "completed" }, { id = "failed", category = "canceled" },
            }, transitions = { { id = "passed", from = { "build" }, to = "done" },
                { id = "failed", from = { "build" }, to = "failed" } } } }
            local stage_id = create(owner, stage)
            local created = call("WorkApply", { board_id = stage_id, ops = { { op = "create", type = "task" } } })
            local automated_item = assert(created.outcomes[1].item)
            test.is_true(call("WorkReport", { board_id = stage_id, item = automated_item, visit = 1, attempt = 1, outcome = "passed" }).applied)
            local runs = call("WorkListStageRuns", { board_id = stage_id, item = { id = automated_item } })
            test.eq(runs.stage_runs[1].outcome, "passed")
        end)
        test.it("resumes a parked migration with a schema-valid WorkResumeMigration response", function()
            local owner = session.admin()
            local declaration = fixture.declaration()
            declaration.processes[1].migration = "follow"
            local id = create(owner, declaration)
            local call = checked_tools(credential(owner, id, { NS .. "work", NS .. "work_admin" }), exercised)
            local item = add_item(call)
            local process = declaration.processes[1]
            process.initial, process.map = "queued", { todo = "queued" }
            process.states[1].id = "queued"
            process.transitions[1].from = { "queued" }
            mcp_migration_fault.fail(id, 8, errors.PERMISSION_DENIED)
            local applied = call("WorkApplySchema", {
                declaration = { processes = { process } }, expected_generation = 1, key = uuid.v4(),
            })
            test.eq(applied.generation, 2)
            local parked
            for attempt = 1, 80 do
                parked = call("WorkGetSchema").migration_error
                if parked then break end
                time.sleep("100ms")
            end
            mcp_migration_fault.clear(id)
            test.not_nil(parked)
            local resumed = call("WorkResumeMigration")
            test.is_true(resumed.resumed)
            test.not_nil(resumed.job_id)
            local state
            for attempt = 1, 80 do
                state = call("WorkGetItem", { item = { id = item } }).item.state
                if state == "queued" then break end
                time.sleep("100ms")
            end
            test.eq(state, "queued")
        end)
        test.it("executes every published static Work tool with schema-valid output", function()
            local owner = session.admin()
            local descriptors = aliases(credential(owner, create(owner), { NS .. "work", NS .. "work_admin" }))
            for name in pairs(descriptors) do test.is_true(exercised[name], name) end
        end)
        test.it("keeps board and module access in the credential owner's scope", function()
            local owner, reader, writer = session.admin(), session.member(true), session.member(true)
            local id, other = create(owner), create(owner)
            assert(owner.call("grant", { subject_id = reader.id, mask = 1 }, id))
            assert(owner.call("grant", { subject_id = writer.id, mask = 3 }, id))
            local rpc = credential(reader, id, { NS .. "work", NS .. "work_admin" })
            test.is_false(rpc("tools/call", { name = "WorkGetSchema" }).isError)
            for _, request in ipairs({
                { name = "WorkGetSchema", arguments = { board_id = other } },
                { name = "WorkUpdateBoard", arguments = { title = "Record denied" } },
                { name = "WorkCreateBoard", arguments = { idempotency_key = uuid.v4() } },
                { name = "WorkApply", arguments = { ops = { { op = "create", type = "task" } } } },
            }) do
                local result = rpc("tools/call", request)
                test.is_true(result.isError, result.content[1].text)
                test.not_nil(result.structuredContent.error.kind, request.name)
            end
            local write = credential(writer, id, { NS .. "work", NS .. "work_admin" })
            test.is_false(write("tools/call", { name = "WorkApply", arguments = { ops = { { op = "create", type = "task" } } } }).isError)
            test.is_true(write("tools/call", { name = "WorkUpdateBoard", arguments = { title = "Writer cannot administer" } }).isError)
        end)
        test.it("withholds Work tools from a credential whose owner lacks the tool capability", function()
            local owner, member = session.admin(), session.member()
            local id = create(owner)
            assert(owner.call("grant", { subject_id = member.id, mask = 1 }, id))
            local rpc = credential(member, id, { NS .. "work" })
            test.is_nil(next(aliases(rpc)))
            local call = rpc("tools/call", { name = "WorkGetSchema" })
            test.is_true(call.isError)
        end)
        test.it("preserves a typed Work-owned error through JSON-RPC", function()
            local owner = session.admin()
            local rpc = credential(owner, create(owner), { NS .. "work", NS .. "work_admin" })
            local result = rpc("tools/call", { name = "WorkResumeMigration", arguments = table.create(0, 1) })
            test.is_true(result.isError)
            local failure = result.structuredContent.error
            test.eq(failure.kind, errors.INVALID)
            test.eq(failure.details.code, "no_parked_migration")
            test.is_nil(failure.retryable)
            local pending = rpc("tools/call", { name = "WorkFindItems", arguments = { min_seq = 1000000 } })
            test.is_true(pending.isError)
            failure = pending.structuredContent.error
            test.eq(failure.kind, errors.UNAVAILABLE)
            test.eq(failure.details.code, "projection_pending")
            test.is_true(failure.retryable)
        end)
    end)
end

return { run = test.run_cases(cases) }
