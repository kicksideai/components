-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local funcs = require("funcs")
local security = require("security")
local registry = require("registry")
local json = require("json")
local uuid = require("uuid")
local time = require("time")
local user_repo = require("user_repo")
local user_groups_repo = require("user_groups_repo")

local function scope() return security.new_scope({ assert(security.policy("app:user")) }) end
local function call(who: string, dto: any): (any?, error?)
    return funcs.new():with_actor(security.new_actor(who, { security_groups = {} })):with_scope(scope()):call("app:probe", dto)
end
-- An active user in the member group, so a recorded identity resolves.
local function member(): string
    local id = uuid.v4()
    assert(user_repo.create({ user_id = id, email = id .. "@docscout.test", password = "docscout-eval-test", status = "active" }))
    assert(user_groups_repo.assign_user_to_group(id, "app:user"))
    return id
end

local function extractor(who: string): string
    local config = assert(json.decode(assert(registry.get("kickside.docscout:config_schema")).data.schema_json)).default
    local field = assert(json.decode(assert(registry.get("kickside.docscout:config_schema")).data.schema_json)).properties.fields.items.default
    field.name = "total"; field.type = "number"
    config.fields = { field }
    return assert(call(who, { op = "create", input = { title = "Invoice reader", description = "", config = config } })).component_id
end

return { run = test.run_cases(function()
    test.describe("Evaluations", function()
        test.it("refuses to start without cases or edit access", function()
            local who = "eval-owner-" .. uuid.v4()
            local id = extractor(who)
            local _, no_cases = call(who, { op = "start_eval", id = id })
            test.not_nil(no_cases); test.is_true(errors.is(no_cases, errors.INVALID), tostring(no_cases))
            local _, stranger = call("stranger-" .. uuid.v4(), { op = "start_eval", id = id })
            test.not_nil(stranger)
            local _, listing = call("stranger-" .. uuid.v4(), { op = "list_evals", id = id })
            test.not_nil(listing)
        end)

        test.it("allows one evaluation at a time per extractor", function()
            local who = "eval-owner-" .. uuid.v4()
            local id = extractor(who)
            local cases = { { id = "c1", upload_name = "a.pdf" } }
            assert(call(who, { op = "queue_eval", id = id, cases = cases }))
            local _, conflict = call(who, { op = "queue_eval", id = id, cases = cases })
            test.not_nil(conflict); test.is_true(errors.is(conflict, errors.CONFLICT), tostring(conflict))
        end)

        test.it("runs each case as a job under the starter's resolved identity and records a failed case with its reason", function()
            local who = member()
            local id = extractor(who)
            assert(call(who, { op = "add_case", id = id, input = { upload_id = "missing-" .. uuid.v4(), upload_name = "missing.pdf", expected = { total = 10 } } }))
            local started, err = call(who, { op = "start_eval", id = id })
            test.is_nil(err, tostring(err)); test.not_nil(started.eval_id)
            local found
            for _ = 1, 100 do
                found = assert(call(who, { op = "get_eval", id = id, eval_id = started.eval_id }))
                if found.evaluation.status == "completed" or found.evaluation.status == "failed" then break end
                time.sleep("100ms")
            end
            local e = found.evaluation
            test.eq(e.status, "failed"); test.eq(e.error, "Every case failed")
            test.eq(#e.results, 1); test.eq(e.results[1].status, "failed")
            test.is_true(tostring(e.results[1].error):find("^read: ") ~= nil, tostring(e.results[1].error))
            test.is_true(tostring(e.results[1].error):find("upload", 1, true) ~= nil, tostring(e.results[1].error))
            test.not_nil(e.results[1].run_id)
            test.is_nil(e.identity)
            test.eq(found.history[1].id, started.eval_id)
        end)

        test.it("records a case as failed when the starter's identity no longer resolves", function()
            local who = "eval-ghost-" .. uuid.v4()
            local id = extractor(who)
            assert(call(who, { op = "add_case", id = id, input = { upload_id = "u-" .. uuid.v4(), upload_name = "a.pdf", expected = { total = 1 } } }))
            local started = assert(call(who, { op = "start_eval", id = id }))
            local e
            for _ = 1, 100 do
                e = assert(call(who, { op = "get_eval", id = id, eval_id = started.eval_id })).evaluation
                if e.status == "completed" or e.status == "failed" then break end
                time.sleep("100ms")
            end
            test.eq(e.status, "failed")
            test.is_true(tostring(e.results[1].error):find("User not found", 1, true) ~= nil, tostring(e.results[1].error))
        end)

        test.it("returns the active evaluation when started again", function()
            local who = member()
            local id = extractor(who)
            assert(call(who, { op = "add_case", id = id, input = { upload_id = "u-" .. uuid.v4(), upload_name = "a.pdf", expected = { total = 1 } } }))
            local first = assert(call(who, { op = "start_eval", id = id }))
            local second = assert(call(who, { op = "start_eval", id = id }))
            if second.existing then test.eq(second.eval_id, first.eval_id) else test.is_true(second.eval_id ~= first.eval_id) end
        end)

        test.it("refuses to evaluate cases that no longer match the fields", function()
            local who = "eval-owner-" .. uuid.v4()
            local id = extractor(who)
            assert(call(who, { op = "add_case", id = id, input = { upload_id = "u-" .. uuid.v4(), upload_name = "old.pdf", expected = { total = 1 } } }))
            local view = assert(call(who, { op = "get", id = id }))
            local cfg = view.config
            cfg.fields[1].name = "amount"
            assert(call(who, { op = "update", id = id, input = { title = view.title, description = "", config = cfg, expected_revision = view.expected_revision } }))
            local _, stale = call(who, { op = "start_eval", id = id })
            test.not_nil(stale); test.is_true(errors.is(stale, errors.INVALID), tostring(stale))
            test.is_true(tostring(stale):find("old.pdf", 1, true) ~= nil, tostring(stale))
        end)

        test.it("removes evaluations with the extractor", function()
            local who = "eval-owner-" .. uuid.v4()
            local id = extractor(who)
            local eval_id = assert(call(who, { op = "queue_eval", id = id, cases = { { id = "c1", upload_name = "a.pdf" } } }))
            assert(call(who, { op = "delete", id = id }))
            local _, gone = call(who, { op = "get_eval", id = id, eval_id = eval_id })
            test.not_nil(gone)
        end)
    end)
end) }
