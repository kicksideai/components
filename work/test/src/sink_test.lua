-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local registry = require("registry")
local fixture = require("fixture")
local steps = require("steps")
local scoped = require("scoped")
local funcs = require("funcs")
type Map = { [string]: unknown }
local function write(h: fixture.Handle, request: Map): Map
    local out, err = h.executor:call("kickside.work.sink:write", request)
    assert(not err, tostring(err))
    return out :: Map
end
local function define()
    test.describe("Work item sink", function()
        test.it("admits only registered sources with the dedicated source capability", function()
            local h = fixture.board()
            local id = steps.create(h, "task", { title = "Before" })
            local req: Map = { config = { board_id = h.id, source = "app:missing_write_source" }, origin = "sync",
                identity_key = id, sink_op = "upsert", idempotency_key = "source-admission", input = { values = { title = "After" } } }
            local rejected = write(h, req)
            test.is_false(rejected.success)
            test.eq(rejected.error.code, "source_unregistered")
            local member = scoped.member()
            assert(h.call("grant", { subject_id = member.id, mask = 3 }))
            req.config.source = "app:work_write_source"
            local denied, err = funcs.new():with_actor(member.actor):with_scope(member.scope):call("kickside.work.sink:write", req)
            test.is_nil(err, tostring(err))
            test.is_false(denied.success)
            test.eq(denied.error.kind, errors.PERMISSION_DENIED)
            test.eq(denied.error.code, "source_denied")
            test.eq(steps.get(h, id).item.values.title, "Before")
        end)
        test.it("declares record delivery with item key identity", function()
            local port = assert(registry.get("kickside.work.sink:items_port"))
            local binding = assert(registry.get(port.data.binding))
            test.eq(binding.meta.delivery, "at_least_once")
            test.eq(binding.meta.input_shape, "record")
            test.eq(binding.data.contracts[1].contract, "kickside.data:writable")
            test.not_nil(port.data.operations.upsert)
        end)
        test.it("applies as the caller and replays delivery receipts without a second item version", function()
            local h = fixture.board()
            local id = steps.create(h, "task", { title = "Before" })
            local key = h.prefix .. "-1"
            local req: Map = { config = { board_id = h.id, source = "app:work_write_source" }, origin = "test-sync",
                identity_key = key, sink_op = "upsert", idempotency_key = "delivery-1", input = { values = { title = "After" } } }
            local first = write(h, req)
            test.is_true(first.success == true)
            test.eq(first.result, "updated")
            test.eq((first.dest_ref :: Map).item_id, id)
            local version = steps.version(h, id)
            local again = write(h, req)
            test.is_true(again.success == true)
            test.eq(steps.version(h, id), version)
            req.input = { values = { title = "Different" } }
            local conflict = write(h, req)
            test.eq((conflict.error :: Map).code, "idempotency_conflict")
            test.eq((conflict.error :: Map).kind, errors.CONFLICT)
            req.origin = "another-sync"
            test.is_true(write(h, req).success == true)
            test.eq(((assert(steps.get(h, id)).item :: Map).values :: Map).title, "Different")
        end)
        test.it("accepts the immutable item identity a Work source supplies", function()
            local h = fixture.board()
            local id = steps.create(h, "task", { title = "Before" })
            local page = assert(h.executor:call("kickside.work.source:pull_items", { config = { board_id = h.id } }))
            test.eq(page.items[1].item_key, id)
            local result = write(h, { config = { board_id = h.id, source = "app:work_write_source" }, origin = "sync",
                identity_key = page.items[1].item_key, sink_op = "upsert", idempotency_key = "one",
                input = { values = { title = "After" } } })
            test.is_true(result.success == true)
            test.eq((result.dest_ref :: Map).item_id, id)
        end)
        test.it("keeps full delivery identities and causal trace when key parts exceed the command-key limit", function()
            local h = fixture.board()
            local id = steps.create(h, "task", { title = "Before" })
            local trace = { trace_id = "sink-trace", run_id = "sink-run", caused_by_event_id = steps.events(h)[1].id }
            local req: Map = { config = { board_id = h.id, source = "app:work_write_source" }, origin = string.rep("o", 200),
                identity_key = h.prefix .. "-1", sink_op = "upsert", idempotency_key = string.rep("k", 200),
                trace_context = trace, input = { values = { title = "After" } } }
            test.is_true(write(h, req).success == true)
            local events = steps.events(h)
            local context = events[#events].trace_context :: Map
            test.eq(context.trace_id, trace.trace_id)
            test.eq(context.run_id, trace.run_id)
            test.eq(context.caused_by_event_id, trace.caused_by_event_id)
            local version = steps.version(h, id)
            test.is_true(write(h, req).success == true)
            test.eq(steps.version(h, id), version)
        end)
        test.it("refuses missing identity, origin and source and preserves board access", function()
            local h = fixture.board()
            steps.create(h, "task", { title = "A" })
            local base: Map = { config = { board_id = h.id, source = "app:work_write_source" }, origin = "sync", sink_op = "upsert",
                idempotency_key = "one", input = { values = { title = "B" } } }
            test.eq((write(h, base).error :: Map).code, "identity_required")
            base.identity_key = h.prefix .. "-1"
            base.origin = nil
            test.is_false(write(h, base).success == true)
            base.origin = "sync"
            base.config = { board_id = h.id }
            test.eq((write(h, base).error :: Map).code, "invalid_config")
            base.config = { board_id = h.id, source = "app:work_write_source" }
            local other = fixture.board()
            local denied = write(other, base)
            test.is_false(denied.success == true)
            test.eq((denied.error :: Map).kind, errors.PERMISSION_DENIED)
        end)
    end)
end
return { run = test.run_cases(define) }
