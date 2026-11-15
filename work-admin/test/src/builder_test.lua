-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local session = require("session")
local fixture = require("fixture")
local uuid = require("uuid")
local json = require("json")
type Map = { [string]: unknown }
local function path(id: string, method: string): string return "/work/boards/" .. id .. "/" .. method end
local function create(owner: session.Session, declaration: Map): string
    local reply = owner.post("/work/boards", { title = "Builder board", declaration = declaration, idempotency_key = (uuid.v4()) })
    test.eq(reply.status, 200, json.encode(reply.body))
    return reply.body.data.board_id :: string
end
local function cases()
    test.describe("board builder HTTP requests", function()
        test.it("reports independent board access for readers, writers and administrators", function()
            local owner = session.admin()
            local id = create(owner, fixture.declaration())
            for _, actor in ipairs({ { session = session.member(), mask = 1, write = false, admin = false },
                { session = session.member(), mask = 3, write = true, admin = false }, { session = session.member(), mask = 9, write = false, admin = true } }) do
                assert(owner.call("grant", { subject_id = actor.session.id, mask = actor.mask }, id))
                local listed = actor.session.get("/work/boards")
                test.eq(listed.status, 200, json.encode(listed.body))
                local found: Map? = nil
                for _, board in ipairs(listed.body.data.boards) do if board.board_id == id then found = board :: Map end end
                test.not_nil(found)
                test.eq(found.access.read, true); test.eq(found.access.write, actor.write); test.eq(found.access.admin, actor.admin)
                local explained = actor.session.post(path(id, "explain"), {})
                test.eq(explained.status, 200, json.encode(explained.body))
                test.eq(explained.body.data.access.admin, actor.admin)
            end
        end)
        test.it("classifies stored-value field and item-type removals before an editor changes its draft", function()
            local owner = session.admin()
            local id = create(owner, fixture.declaration())
            local created = owner.post(path(id, "apply"), { ops = { { op = "create", type = "task", values = { title = "Keep this value" } } }, mode = "atomic", key = (uuid.v4()) })
            test.eq(created.status, 200, json.encode(created.body)); test.is_true(created.body.data.applied)
            local schema = owner.post(path(id, "get_schema"), {}).body.data
            local removed = owner.post(path(id, "plan_schema"), { expected_generation = schema.generation, declaration = { remove = { item_types = { "task" } } } })
            test.eq(removed.status, 200, json.encode(removed.body))
            test.eq(removed.body.data.class, "refused")
            test.eq(removed.body.data.refused[1].code, "item_type task")
            local field = owner.post(path(id, "plan_schema"), { expected_generation = schema.generation, declaration = {
                remove = { fields = { "title" } }, item_types = { { id = "task", process = "delivery", fields = {} } } } })
            test.eq(field.status, 200, json.encode(field.body))
            local held = false
            for _, change in ipairs(field.body.data.changes) do
                if change.code == "title" and change.what == "removed" and change.class == "semantic" then held = true end
            end
            test.is_true(held, "the editor keeps fields whose removal changes stored values")
            test.eq(owner.post(path(id, "get_schema"), {}).body.data.generation, schema.generation)
        end)
        test.it("persists board metadata through update and list with independent ADMIN access", function()
            local owner, writer, administrator = session.admin(), session.admin(), session.admin()
            local id = create(owner, fixture.declaration())
            local before = owner.post(path(id, "get_schema"), {}).body.data
            assert(owner.call("grant", { subject_id = writer.id, mask = 3 }, id))
            assert(owner.call("grant", { subject_id = administrator.id, mask = 9 }, id))
            test.eq(writer.post(path(id, "update"), { title = "Refused edit" }).status, 403)
            local member = session.member()
            assert(owner.call("grant", { subject_id = member.id, mask = 9 }, id))
            test.eq(member.post(path(id, "update"), { title = "Module capability required" }).status, 403)
            local updated = administrator.post(path(id, "update"), { title = "Release planning", description = "Ship the next milestone." })
            test.eq(updated.status, 200, json.encode(updated.body))
            test.eq(updated.body.data.status, "updated")
            local unchanged = administrator.post(path(id, "update"), { title = "Release planning", description = "Ship the next milestone." })
            test.eq(unchanged.status, 200, json.encode(unchanged.body))
            test.eq(unchanged.body.data.status, "unchanged")
            local found = false
            local listed = owner.get("/work/boards")
            test.eq(listed.status, 200, json.encode(listed.body))
            for _, board in ipairs(listed.body.data.boards) do
                if board.board_id == id then
                    found = true
                    test.eq(board.title, "Release planning")
                    test.eq(board.description, "Ship the next milestone.")
                end
            end
            test.is_true(found)
            test.eq(owner.post(path(id, "get_schema"), {}).body.data.generation, before.generation)
            test.eq(administrator.post(path(id, "update"), { description = "" }).status, 200)
        end)
        test.it("plans and persists a field title cosmetically without changing its code or id", function()
            local owner, reader = session.admin(), session.member()
            local id = create(owner, fixture.declaration())
            local before = owner.post(path(id, "get_schema"), {}).body.data
            local field = before.declaration.fields[1]
            local code, stable_id = field.code, field.id
            field.title = "Summary"
            local request = { declaration = before.declaration, expected_generation = before.generation }
            local plan = owner.post(path(id, "plan_schema"), request)
            test.eq(plan.status, 200, json.encode(plan.body))
            test.eq(plan.body.data.class, "cosmetic")
            test.eq(owner.post(path(id, "get_schema"), {}).body.data.generation, before.generation)
            request.key = uuid.v4()
            local applied = owner.post(path(id, "apply_schema"), request)
            test.eq(applied.status, 200, json.encode(applied.body))
            test.eq(applied.body.data.class, "cosmetic")
            local after = owner.post(path(id, "get_schema"), {}).body.data
            test.eq(after.declaration.fields[1].title, "Summary")
            test.eq(after.compiled.fields[1].title, "Summary")
            test.eq(after.declaration.fields[1].code, code)
            test.eq(after.declaration.fields[1].id, stable_id)
            assert(owner.call("grant", { subject_id = reader.id, mask = 1 }, id))
            request.expected_generation = after.generation
            test.eq(reader.post(path(id, "plan_schema"), request).status, 403)
            test.eq(reader.post(path(id, "apply_schema"), request).status, 403)
        end)
        test.it("validates process timers before apply and protects migration resume with ADMIN", function()
            local owner, reader = session.admin(), session.member()
            local id = create(owner, fixture.declaration())
            local schema = owner.post(path(id, "get_schema"), {}).body.data
            schema.declaration.processes[1].states[1].timers = { { id = "reminder", after = "invalid", ["then"] = { emit = "reminder" } } }
            local invalid = owner.post(path(id, "plan_schema"), { declaration = schema.declaration, expected_generation = schema.generation })
            test.eq(invalid.status, 400, json.encode(invalid.body))
            test.eq(invalid.body.details.code, "timer_duration_invalid")
            assert(owner.call("grant", { subject_id = reader.id, mask = 1 }, id))
            test.eq(reader.post(path(id, "resume_migration"), {}).status, 403)
            local absent = owner.post(path(id, "resume_migration"), {})
            test.eq(absent.status, 400, json.encode(absent.body)); test.eq(absent.body.details.code, "no_parked_migration")
            test.eq(owner.post(path(id, "get_schema"), {}).body.data.generation, schema.generation)
        end)
    end)
end
return { run = test.run_cases(cases) }
