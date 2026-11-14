-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Output reservation, component deletion authority and malformed requests use installation scopes.
local test = require("test")
local scoped = require("scoped")
local fixture = require("fixture")
local steps = require("steps")
local rows = require("rows")
local autoinit = require("autoinit")
local component = require("component")
local execution_identity = require("execution_identity")
local consts = require("consts")
local registry = require("registry")

local function define()
    test.describe("event and delete gates", function()
        test.it("declares ADMIN authority for raw board events", function()
            test.eq(assert(registry.get("kickside.work.binding:board")).meta.events.read, "admin")
        end)
        test.it("keeps producer publication authority out of the stored board identity", function()
            local h = scoped.board(scoped.admin())
            local context = assert(component.get_private_context(h.id))
            local identity = context[execution_identity.CONTEXT_KEY]
            local frame, err = execution_identity.resolve(identity, { deferred_owner = consts.MIGRATION_OWNER, execution_root = h.id })
            test.is_nil(err, steps.detail(err))
            for _, event in pairs(consts.EVENTS) do
                test.eq(frame.scope:evaluate(frame.actor, "threads.output.publish", event), "undefined", event)
            end
        end)



        test.it("refuses forged board facts from a WRITE member before they fold", function()
            local admin, member = scoped.admin(), scoped.member()
            local h = scoped.board(admin)
            assert(h.call("grant", { subject_id = member.id, mask = 3 }))
            local item = steps.create(h, "task", { title = "Original" })
            for _, event in ipairs({
                { type = "schema.applied", subject = "schema", body = { generation = 900 } },
                { type = "item.created", subject = "i:forged", body = { item = "forged", type = "task", state = "open" } },
                { type = "item.transitioned", subject = "i:" .. item, body = { item = item, state = "forged", actor = member.id } },
            }) do
                local before = rows.scalar("SELECT MAX(seq) AS n FROM kickside_event WHERE thread_id = $1", { h.id })
                local out, err = member.call("append", { thread_id = h.id, events = {
                    { type = "kickside.work.events:" .. event.type, subject = event.subject, body = event.body },
                } }, h.id)
                test.is_nil(out, event.type)
                test.not_nil(err, event.type)
                test.eq((err :: error):kind(), errors.PERMISSION_DENIED, steps.detail(err))
                test.eq(rows.scalar("SELECT MAX(seq) AS n FROM kickside_event WHERE thread_id = $1", { h.id }), before)
            end
            assert(h.call("settle", {}))
            test.eq(rows.scalar("SELECT generation AS n FROM kickside_work_board WHERE board_id = $1", { h.id }), 1)
            test.eq(rows.scalar("SELECT COUNT(*) AS n FROM kickside_work_item WHERE board_id = $1", { h.id }), 1)
            test.eq((assert(steps.get(h, item)).item).state, "open")
        end)

        test.it("refuses a direct prefix claim from a work administrator", function()
            local admin = scoped.admin()
            local h = scoped.board(admin)
            local prefix = fixture.fresh_prefix()
            local id = autoinit.component_id(autoinit.SYSTEM_SCOPE_KEY, "work_registry")
            local out, err = admin.call("append", { thread_id = id, events = {
                { type = "kickside.work.events:prefix.claimed", subject = "prefix:" .. prefix,
                  body = { prefix = prefix, board = h.id, actor = admin.id, at = "2026-11-04T00:00:00.000Z" } },
            } }, h.id)
            test.is_nil(out)
            test.not_nil(err)
            test.eq((err :: error):kind(), errors.PERMISSION_DENIED, steps.detail(err))
            local declaration = fixture.declaration(prefix)
            test.is_true(assert(h.call("apply_schema", { declaration = declaration })).generation == 2)
        end)

        test.it("enforces DELETE through the component service and permits a DELETE member", function()
            local admin, member = scoped.admin(), scoped.member()
            local h = scoped.board(admin)
            steps.create(h, "task", { title = "Keep" })
            assert(h.call("grant", { subject_id = member.id, mask = 3 }))
            local out, err = member.call("delete", {}, h.id)
            test.is_nil(out)
            test.not_nil(err)
            test.eq((err :: error):kind(), errors.PERMISSION_DENIED, steps.detail(err))
            test.eq(rows.scalar("SELECT COUNT(*) AS n FROM kickside_work_item WHERE board_id = $1", { h.id }), 1)
            assert(h.call("grant", { subject_id = member.id, mask = 5 }))
            local deleted, derr = member.call("delete", {}, h.id)
            test.is_nil(derr, steps.detail(derr))
            test.not_nil(deleted)
            steps.deleted(h.id)
            test.eq(rows.scalar("SELECT COUNT(*) AS n FROM kickside_work_item WHERE board_id = $1", { h.id }), 0)
        end)
    end)

end

return { run = test.run_cases(define) }
