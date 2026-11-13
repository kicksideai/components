-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local scoped = require("scoped")
local steps = require("steps")
local registry = require("registry")

local function define()
    test.describe("contract request validation", function()
        test.it("returns the specific refusal for item-addressed bulk templates", function()
            local h=scoped.board(scoped.admin())
            for _,item in ipairs({"unselected",false}) do
                local out,err=h.call("bulk",{key="addressed-template",query={},ops_template={{op="delete",item=item}}})
                test.is_nil(out)
                test.not_nil(err)
                test.eq(err:kind(),errors.INVALID)
                test.eq(err:details().code,"bulk_template_item")
            end
        end)
        test.it("validates every contract method before reading request members", function()
            local admin = scoped.admin()
            local h = scoped.board(admin)
            local before = #steps.events(h)
            for _, id in ipairs({ "kickside.work:board", "kickside.work:view", "kickside.work:packs" }) do
                for _, method in ipairs(assert(registry.get(id)).data.methods) do
                    for _, value in ipairs({ 17, false, "bad", { unexpected = true } }) do
                        local out, err = admin.call("contract_request", { contract = id, method = method.name, value = value })
                        test.is_nil(out, id .. "." .. method.name)
                        test.not_nil(err, id .. "." .. method.name)
                        test.eq(err:kind(), errors.INVALID, id .. "." .. method.name)
                        test.eq(err:details().code, "invalid_shape", id .. "." .. method.name)
                    end
                end
            end
            test.eq(#steps.events(h), before)
        end)
        test.it("rejects public execution controls before appending", function()
            local admin = scoped.admin()
            local h = scoped.board(admin)
            local id = steps.create(h, "task", { title = "Before" })
            local out, err = admin.call("apply", { deadline = {}, ops = { { op = "set", item = id, values = { title = "After" } } } }, h.id)
            test.is_nil(out)
            test.eq(err:kind(), errors.INVALID)
            test.eq(err:details().code, "invalid_shape")
            test.eq(assert(steps.get(h, id)).item.values.title, "Before")
        end)
        test.it("rejects unknown request properties before creation or mutation", function()
            local admin = scoped.admin()
            local h = scoped.board(admin)
            local id = steps.create(h, "task", { title = "Before" })
            for _, method in ipairs({ "get_schema", "apply", "get", "plan_schema", "apply_schema", "list", "list_history", "list_changes" }) do
                local input = { board_id = h.id, extra = true }
                if method == "list" then input.board_id = nil end
                if method == "apply" then input.ops = { { op = "set", item = id, values = { title = "After" } } } end
                if method == "get" then input.item = { id = id } end
                if method == "plan_schema" or method == "apply_schema" then input.declaration = {} end
                local out, err = admin.call(method, input, h.id)
                test.is_nil(out, method)
                test.eq(err:kind(), errors.INVALID, method)
                test.eq(err:details().code, "invalid_shape", method)
            end
            test.eq(assert(steps.get(h, id)).item.values.title, "Before")
        end)
        test.it("classifies invalid JSON at the HTTP boundary", function()
            local admin = scoped.admin()
            local reply = admin.http_raw("POST", "", "{")
            test.eq(reply.status, 400)
            test.eq(reply.body.kind, errors.INVALID)
            test.eq(reply.body.details.code, "invalid_json")
        end)

        test.it("retains native contract-open failures in API responses", function()
            local outsider = scoped.outsider()
            local result = assert(outsider.call("api_call", { method = "list" }))
            test.eq(result.status, 403)
            test.eq(result.body.kind, errors.PERMISSION_DENIED)
            test.is_false(result.body.success)
        end)

        for _, method in ipairs({ "create", "list", "get_schema", "plan_schema", "apply_schema", "resume_migration", "apply", "get", "query", "count", "list_changes", "list_history", "get_time_in_state" }) do
            test.it("refuses malformed " .. method .. " through the contract", function()
                local admin = scoped.admin()
                local out, err = admin.call(method, { board_id = 17, idempotency_key = {}, item = false, ops = false, generation = "bad", limit = "bad" })
                test.is_nil(out)
                test.not_nil(err)
                test.eq((err :: error):kind(), errors.INVALID, steps.detail(err))
            end)
        end
    end)
end

return { run = test.run_cases(define) }
