-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Real scopes: members, work administrators and outsiders hold exactly what an installation composes,
-- through the HTTP endpoints and through the board contract.
local test = require("test")
local json = require("json")
local time = require("time")
local funcs = require("funcs")
local security = require("security")
local fixture = require("fixture")
local steps = require("steps")
local scoped = require("scoped")
local rows = require("rows")

type Map = { [string]: unknown }

local READ, WRITE, ADMIN = 1, 2, 8

local RETENTION_OWNER = "kickside.work.retention:owner"

local ROUTES = { "get_schema", "plan_schema", "apply_schema", "resume_migration", "apply", "get", "query", "count", "list_changes", "list_history", "get_time_in_state", "list_links", "list_comments", "list_stage_runs", "explain", "configure_plugin", "views" }

local function route(h: fixture.Handle, method: string): string
    return "/" .. h.id .. "/" .. method
end

-- data is the payload of a successful HTTP answer.
local function data(reply: scoped.Reply, what: string): Map
    test.eq(reply.status, 200, what .. " " .. json.encode(reply.body))
    test.is_true(reply.body.success == true, what)
    return reply.body.data :: Map
end

local function denied(err: unknown, what: string)
    test.not_nil(err, what)
    test.eq((err :: error):kind(), errors.PERMISSION_DENIED, what .. ": " .. tostring(err))
end

local function grant(owner: fixture.Handle, to: scoped.Session, mask: integer)
    assert(owner.call("grant", { subject_id = to.id, mask = mask }))
end

local function define()
    test.describe("module discovery", function()
        test.it("exposes exact contract and component declarations to members and conceals them from outsiders", function()
            local member, outsider = scoped.member(), scoped.outsider()
            for _, declaration in ipairs({
                { id = "kickside.work:board", kind = "contract.definition" },
                { id = "kickside.work.binding:board", kind = "contract.binding" },
            }) do
                local entry, err = member.call("declaration", { id = declaration.id })
                test.is_nil(err, steps.detail(err))
                test.eq(entry.id, declaration.id)
                test.eq(entry.kind, declaration.kind)
                local found, ferr = member.call("discover", declaration)
                test.is_nil(ferr, steps.detail(ferr))
                test.eq(#found, 1)
                test.eq(found[1].id, declaration.id)
                local hidden, herr = outsider.call("declaration", { id = declaration.id })
                test.is_nil(hidden)
                if herr then denied(herr, declaration.id) end
                local invisible, ierr = outsider.call("discover", declaration)
                if ierr then denied(ierr, declaration.id)
                else test.eq(#invisible, 0) end
            end
        end)
    end)

    test.describe("board creation", function()
        test.it("lets a work administrator create a board with a prefix claim, and replays the same request", function()
            local admin = scoped.admin()
            local request = { idempotency_key = "scope-admin", title = "Admin board", declaration = fixture.declaration(fixture.fresh_prefix()) }
            local created, err = admin.call("create", request)
            test.is_nil(err, steps.detail(err))
            test.eq((created :: Map).generation, 1)
            local again, aerr = admin.call("create", request)
            test.is_nil(aerr, steps.detail(aerr))
            test.eq((again :: Map).board_id, (created :: Map).board_id)
            test.is_true((again :: Map).replayed)
        end)

        test.it("admits board creation at the endpoint for administrators only", function()
            local admin, member, outsider = scoped.admin(), scoped.member(), scoped.outsider()
            local request = { idempotency_key = "http-create", title = "HTTP board", declaration = fixture.declaration(fixture.fresh_prefix()) }
            local created = data(admin.http("POST", "", request), "admin create")
            test.eq(created.generation, 1)
            test.eq(member.http("POST", "", request).status, 403)
            test.eq(outsider.http("POST", "", request).status, 403)
        end)

        test.it("refuses bare board creation by a member through the contract and service function", function()
            local member = scoped.member()
            for _, op in ipairs({ "create", "create_function" }) do
                local out, err = member.call(op, { idempotency_key = "bare-member-" .. op })
                test.is_nil(out, op)
                denied(err, op)
                test.eq(err:details().code, "board_creation_denied")
            end
        end)

        test.it("refuses a member a prefix claim at the contract", function()
            local member = scoped.member()
            local _, err = member.call("create", { idempotency_key = "member-claim", declaration = fixture.declaration(fixture.fresh_prefix()) })
            denied(err, "member create with a prefix claim")
        end)

        test.it("refuses an outsider at the contract", function()
            local outsider = scoped.outsider()
            local _, err = outsider.call("create", { idempotency_key = "outsider" })
            denied(err, "outsider create")
            local _, lerr = outsider.call("list", {})
            denied(lerr, "outsider list")
        end)
    end)

    test.describe("board work through the endpoints", function()
        test.it("runs schema, items, reads and deletion for an administrator", function()
            local admin = scoped.admin()
            local h = scoped.board(admin, fixture.workflow(fixture.fresh_prefix()))

            local listed = data(admin.http("GET", ""), "list")
            local found = false
            for _, b in ipairs(listed.boards :: { Map }) do if b.board_id == h.id then found = true end end
            test.is_true(found)

            local declaration = fixture.workflow(h.prefix)
            local fields = declaration.fields :: { Map }
            fields[#fields + 1] = { code = "extra", form = "text" }
            test.eq(data(admin.http("POST", route(h, "plan_schema"), { declaration = declaration }), "plan_schema").class, "additive")
            test.eq(data(admin.http("POST", route(h, "apply_schema"), { declaration = declaration, expected_generation = 1 }), "apply_schema").generation, 2)
            test.eq(data(admin.http("POST", route(h, "get_schema")), "get_schema").generation, 2)

            local applied = data(admin.http("POST", route(h, "apply"), { ops = {
                { op = "create", type = "task", values = { title = "A", estimate = 3, assignee = { kind = "user", id = admin.id } } },
            } }), "create")
            local id = ((applied.outcomes :: { Map })[1]).item :: string
            local function one(op: Map): Map
                local out = data(admin.http("POST", route(h, "apply"), { ops = { op } }), op.op :: string)
                local outcome = (out.outcomes :: { Map })[1]
                test.eq(outcome.status, "applied", json.encode(outcome))
                return outcome
            end
            one({ op = "set", item = id, values = { title = "A2" } })
            one({ op = "transition", item = id, transition = "start" })
            one({ op = "comment", item = id, body = "started" })

            local got = data(admin.http("POST", route(h, "get"), { item = { id = id }, include = { "comments", "transitions" } }), "get")
            test.eq((got.item :: Map).state, "doing")
            test.eq(#(got.comments :: { Map }), 1)
            test.is_true(#data(admin.http("POST", route(h, "list_changes"), {}), "list_changes").items >= 1)
            test.is_true(#data(admin.http("POST", route(h, "list_history"), { item = { id = id } }), "list_history").entries >= 2)
            local spans = data(admin.http("POST", route(h, "get_time_in_state"), { item = { id = id } }), "get_time_in_state")
            test.eq(spans.periods[#spans.periods].value, "doing")

            one({ op = "delete", item = id })
            one({ op = "restore", item = id })

            local resume = admin.http("POST", route(h, "resume_migration"))
            test.eq(resume.status, 400, json.encode(resume.body))

            local _, derr = admin.call("delete", {}, h.id)
            test.is_nil(derr, steps.detail(derr))
            steps.deleted(h.id)
            test.eq(admin.http("POST", route(h, "get"), { item = { id = id } }).status >= 400, true)
        end)

        test.it("lets a member with board access use the member endpoints and not the administration endpoints", function()
            local admin, member = scoped.admin(), scoped.member()
            local h = scoped.board(admin)
            grant(h, member, READ + WRITE + ADMIN)

            local applied = data(member.http("POST", route(h, "apply"), { ops = { { op = "create", type = "task", values = { title = "M" } } } }), "member apply")
            local id = ((applied.outcomes :: { Map })[1]).item :: string
            test.eq((data(member.http("POST", route(h, "get"), { item = { id = id } }), "member get").item :: Map).id, id)
            data(member.http("POST", route(h, "list_changes"), {}), "member changes")
            data(member.http("POST", route(h, "list_history"), {}), "member history")
            data(member.http("POST", route(h, "get_time_in_state"), { item = { id = id } }), "member get_time_in_state")
            data(member.http("POST", route(h, "get_schema")), "member get_schema")
            test.eq(#data(member.http("GET", ""), "member list").boards, 1)

            local declaration = fixture.declaration(h.prefix)
            for _, method in ipairs({ "plan_schema", "apply_schema", "resume_migration" }) do
                test.eq(member.http("POST", route(h, method), { declaration = declaration }).status, 403, method)
            end
            local planned, perr = member.call("plan_schema", { declaration = declaration }, h.id)
            test.is_nil(perr, steps.detail(perr))
            test.eq((planned :: Map).class, "unchanged")
        end)

        test.it("keeps authenticated outsiders away from every endpoint at every ACL role", function()
            local h = scoped.board(scoped.admin())
            for _, mask in ipairs({ 0, READ, WRITE, ADMIN, 15 }) do
                local outsider = scoped.outsider()
                if mask > 0 then grant(h, outsider, mask) end
                test.eq(outsider.http("GET", "").status, 403, "list " .. mask)
                test.eq(outsider.http("POST", "", {}).status, 403, "create " .. mask)
                for _, method in ipairs({ "save", "run" }) do
                    test.eq(outsider.http("POST", "/api/work/views/" .. h.id .. "/" .. method, {}).status, 403, method .. " " .. mask)
                end
                for _, method in ipairs(ROUTES) do
                    test.eq(outsider.http("POST", route(h, method), { declaration = fixture.declaration(h.prefix), item = { id = "x" }, ops = { { op = "create", type = "task" } } }).status, 403, method .. " " .. mask)
                end
            end
        end)

        test.it("keeps a member without board access out of the board", function()
            local admin, member = scoped.admin(), scoped.member()
            local h = scoped.board(admin)
            test.eq(member.http("POST", route(h, "get"), { item = { id = "x" } }).status, 403)
            local _, err = member.call("get", { item = { id = "x" } }, h.id)
            denied(err, "member without access")
        end)

        test.it("keeps authenticated outsiders away from every contract method at every ACL role", function()
            local h = scoped.board(scoped.admin())
            for _, mask in ipairs({ 0, READ, WRITE, ADMIN, 15 }) do
                local outsider = scoped.outsider()
                if mask > 0 then grant(h, outsider, mask) end
                for _, op in ipairs({ "create", "list", "get_schema", "plan_schema", "apply_schema", "resume_migration", "apply", "get", "query", "count", "list_changes", "list_history", "get_time_in_state", "list_links", "list_comments", "list_stage_runs", "explain", "configure_plugin", "create_view", "save_view", "run_view" }) do
                    local _, err = outsider.call(op, { item = { id = "x" }, ops = { { op = "create", type = "task" } }, declaration = fixture.declaration(h.prefix) }, h.id)
                    denied(err, "outsider " .. op .. " " .. mask)
                end
            end
        end)
    end)

    test.describe("workers under their declared identities", function()
        test.it("folds every command through the projection of a board owned by a real administrator", function()
            local admin = scoped.admin()
            local h = scoped.board(admin, fixture.workflow(fixture.fresh_prefix()))
            local id = steps.create(h, "task", { title = "A", estimate = 1, assignee = { kind = "user", id = admin.id } })
            steps.one(h, { op = "transition", item = id, transition = "start" })
            steps.one(h, { op = "comment", item = id, body = "note" })
            local got = assert(steps.get(h, id, { "comments" }))
            test.eq((got.item :: Map).state, "doing")
            test.eq(#(got.comments :: { Map }), 1)
            test.eq(rows.scalar("SELECT COUNT(*) AS n FROM kickside_work_change WHERE board_id = $1", { h.id }) >= 2, true)
        end)

        test.it("runs the follow migration under the board identity and the migration policies", function()
            local admin = scoped.admin()
            local h = scoped.board(admin, fixture.workflow(fixture.fresh_prefix()))
            local ids = {}
            for i = 1, 3 do ids[i] = steps.create(h, "task", { title = "T" .. i, estimate = 1 }) end
            local declaration = fixture.workflow(h.prefix)
            local process = (declaration.processes :: { Map })[1]
            process.initial = "backlog"
            process.map = { todo = "backlog" }
            for _, state in ipairs(process.states :: { Map }) do
                if state.id == "todo" then state.id = "backlog" end
            end
            for _, transition in ipairs(process.transitions :: { Map }) do
                if transition.from ~= "any" then
                    for i, from in ipairs(transition.from :: { string }) do if from == "todo" then (transition.from :: { string })[i] = "backlog" end end
                end
                if transition.to == "todo" then transition.to = "backlog" end
            end
            test.eq(data(admin.http("POST", route(h, "apply_schema"), { declaration = declaration }), "apply_schema").generation, 2)
            steps.wait_for("the migration", function() return rows.stale(h.id) == 0 end)
            steps.wait_for("the job record", function() return rows.job(h.id).status == "done" end)
            test.eq((assert(steps.get(h, ids[1])).item :: Map).state, "backlog")
            test.eq(rows.scalar("SELECT COUNT(*) AS n FROM kickside_work_change WHERE board_id = $1 AND kind = 'migration'", { h.id }), 3)
        end)

        test.it("returns visible board counts in discovery for a board owned by a real administrator", function()
            local admin = scoped.admin()
            local h = scoped.board(admin)
            steps.create(h, "task", { title = "T" })
            local summary
            for _ = 1, 50 do
                summary = (assert(admin.call("list", {})) :: Map).boards[1]
                if summary.item_count == 1 and summary.status == "ready" then break end
                time.sleep("100ms")
            end
            test.eq(summary.board_id, h.id)
            test.eq(summary.item_count, 1)
            test.eq(summary.status, "ready")
        end)

        test.it("releases the prefixes of a deleted board on the retention owner's own authority", function()
            local admin = scoped.admin()
            local h = scoped.board(admin)
            test.eq(rows.held(h.prefix), 1)
            local _, derr = admin.call("delete", {}, h.id)
            test.is_nil(derr, steps.detail(derr))
            steps.deleted(h.id)
            local frame = assert(security.named_scope("wippy.security:process"))
            local executor = funcs.new():with_actor(security.new_actor("harness-sweeper", {})):with_scope(frame)
            steps.retention_sweep(function(): boolean return rows.held(h.prefix) == 0 end, function(): Map
                local out, err = executor:call(RETENTION_OWNER, {})
                test.is_nil(err, steps.detail(err))
                test.is_true((out :: Map).success == true, steps.detail((out :: Map).error))
                return out :: Map
            end)
            test.eq(rows.held(h.prefix), 0)
        end)
    end)
end

return { run = test.run_cases(define) }
