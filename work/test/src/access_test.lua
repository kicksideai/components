-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Board access: the component ACL decides each call, and callers outside the member group never reach the contract.
local test = require("test")
local fixture = require("fixture")
local steps = require("steps")
local guard = require("guard")
local probe = require("probe")

local READ, WRITE, ADMIN = 1, 2, 8

local function denied(err: unknown, what: string)
    test.not_nil(err, what)
    test.eq((err :: error):kind(), errors.PERMISSION_DENIED, what .. ": " .. tostring(err))
end

local function define()
    test.describe("board access", function()
        test.it("propagates native authorization outages from command preparation transition reads and scopes", function()
            local h = fixture.board()
            local id = steps.create(h, "task", { title = "Preserved" })
            local cases = {
                { mask = 4, kind = errors.UNAVAILABLE, method = "apply", request = { ops = { { op = "delete", item = id } } } },
                { mask = WRITE, kind = errors.TIMEOUT, method = "get", request = { item = { id = id }, include = { "transitions" } } },
                { mask = WRITE, kind = errors.INTERNAL, method = "query", request = { scopes = { { id = "app:work_scope" } } } },
            }
            for _, case in ipairs(cases) do
                probe.fail(h.id, case.mask, case.kind)
                local value, err = h.call(case.method, case.request)
                probe.clear(h.id)
                test.is_nil(value, case.method)
                test.not_nil(err, case.method)
                test.eq(err:kind(), case.kind, case.method)
                test.eq(err:details().code, "contract_unavailable", case.method)
            end
            test.eq(assert(h.call("get", { item = { id = id } })).item.life, "live")
        end)

        test.it("preserves operational authorization failures and handles only explicit refusal as denial", function()
            local denied_error = errors.new({ kind = errors.PERMISSION_DENIED, message = "refused", details = { code = "component_access_denied" } })
            local allowed, err = guard.authorization(denied_error)
            test.is_false(allowed)
            test.is_nil(err)
            for _, kind in ipairs({ errors.UNAVAILABLE, errors.INTERNAL, errors.TIMEOUT }) do
                local failure = errors.new({ kind = kind, message = "directory offline", details = { code = "contract_unavailable" } })
                local admitted, source = guard.authorization(failure)
                test.is_false(admitted)
                test.eq(source:kind(), kind)
                test.eq(source:details().code, "contract_unavailable")
            end
            local admitted, source = guard.authorization(nil)
            test.is_true(admitted)
            test.is_nil(source)
        end)
        test.it("grants exactly what each access level allows", function()
            local h = fixture.board()
            local id = steps.create(h, "task", { title = "A" })
            local edit = { ops = { { op = "set", item = id, values = { title = "Edited" } } } }
            local plan = { declaration = fixture.declaration(h.prefix) }
            plan.declaration.fields[#plan.declaration.fields + 1] = { code = "extra", form = "text" }

            local outsider = fixture.user(h)
            denied(select(2, outsider("get", { item = { id = id } })), "outsider get")
            denied(select(2, outsider("apply", edit)), "outsider apply")
            denied(select(2, outsider("list_changes", {})), "outsider changes")
            denied(select(2, outsider("list_history", {})), "outsider history")
            denied(select(2, outsider("get_schema", {})), "outsider get_schema")
            denied(select(2, outsider("plan_schema", plan)), "outsider plan_schema")
            test.eq(#outsider("list", {}).boards, 0)

            local reader, reader_id = fixture.user(h)
            assert(h.call("grant", { subject_id = reader_id, mask = READ }))
            test.not_nil((reader("get", { item = { id = id } })))
            test.not_nil((reader("list_changes", {})))
            test.not_nil((reader("list_history", {})))
            test.not_nil((reader("get_schema", {})))
            test.eq(#reader("list", {}).boards, 1)
            denied(select(2, reader("apply", edit)), "reader apply")
            denied(select(2, reader("plan_schema", plan)), "reader plan_schema")

            local writer, writer_id = fixture.user(h)
            assert(h.call("grant", { subject_id = writer_id, mask = READ + WRITE }))
            local applied, aerr = writer("apply", edit)
            test.is_nil(aerr)
            test.eq(applied.outcomes[1].status, "applied")
            denied(select(2, writer("plan_schema", plan)), "writer plan_schema")
            denied(select(2, writer("apply_schema", plan)), "writer apply_schema")

            local admin, admin_id = fixture.user(h)
            assert(h.call("grant", { subject_id = admin_id, mask = READ + WRITE + ADMIN }))
            local planned, serr = admin("plan_schema", plan)
            test.is_nil(serr)
            test.eq(planned.class, "additive")
        end)

        test.it("accepts commands from a WRITE-only principal and refuses read results", function()
            local h = fixture.board()
            local writer, writer_id = fixture.user(h)
            assert(h.call("grant", { subject_id = writer_id, mask = WRITE }))
            local request = { key = "write-only", ops = { { op = "create", type = "task", values = { title = "A" } } } }
            local result, err = writer("apply", request)
            test.is_nil(err, steps.detail(err))
            test.eq(result.outcomes[1].status, "applied")
            test.is_nil(result.outcomes[1].values)
            local id = result.outcomes[1].item
            test.eq(assert(writer("apply", request)).outcomes[1].item, id)
            denied(select(2, writer("get", { item = { id = id } })), "write-only get")
            denied(select(2, writer("list_changes", {})), "write-only changes")
            denied(select(2, writer("get_schema", {})), "write-only schema")
            test.eq(#assert(writer("list", {})).boards, 0)
            test.eq(assert(h.call("get", { item = { id = id } })).item.values.title, "A")
        end)

        test.it("keeps callers outside the module policies away from the contract", function()
            local h = fixture.board()
            local id = steps.create(h, "task", { title = "A" })
            local stranger, stranger_id = fixture.user(h, { "app:caller_only" })
            assert(h.call("grant", { subject_id = stranger_id, mask = READ + WRITE + ADMIN }))
            denied(select(2, stranger("get", { item = { id = id } })), "get without the module policies")
            denied(select(2, stranger("apply", { ops = { { op = "create", type = "task" } } })), "apply without the module policies")
            denied(select(2, stranger("list", {})), "list without the module policies")
            local member, member_id = fixture.user(h)
            assert(h.call("grant", { subject_id = member_id, mask = READ }))
            test.eq(assert(member("get", { item = { id = id } })).item.id, id)
        end)

        test.it("shares a board through a persisted group grant and refuses a nonmember", function()
            local h = fixture.board()
            local id = steps.create(h, "task", { title = "A" })
            local member = fixture.user(h)
            local nonmember = fixture.user(h, nil, true)
            denied(select(2, member("get", { item = { id = id } })), "before the group grant")
            assert(h.call("grant", { subject_id = "app.security:work_admin", subject_type = "group", mask = READ }))
            test.eq(assert(member("get", { item = { id = id } })).item.values.title, "A")
            denied(select(2, nonmember("get", { item = { id = id } })), "nonmember")
            assert(h.call("revoke", { subject_id = "app.security:work_admin", subject_type = "group" }))
            denied(select(2, member("get", { item = { id = id } })), "revoked group")
        end)
    end)
end

return { run = test.run_cases(define) }
