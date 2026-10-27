local test = require("test")
local funcs = require("funcs")
local security = require("security")
return {run = test.run_cases(function()
    test.describe("storage-s3 administration boundary", function()
        test.it("returns 403 for member list, test, configure and reset requests", function()
            local scope = assert(security.new_scope({assert(security.policy("app.storage_s3:settings_member_runtime"))}))
            local caller = funcs.new():with_actor(assert(security.new_actor("settings-member", {}))):with_scope(scope)
            for _, request in ipairs({{method = "GET"}, {method = "POST"},
                {method = "POST", configure = true}, {method = "DELETE", configure = true}}) do
                local result, err = caller:with_context({storage_method = request.method})
                    :call("app.storage_s3:settings_member_probe", request)
                test.is_nil(err, tostring(err))
                test.eq(403, result.status)
                test.is_false(result.body.success)
                test.eq("Settings administrator access required", result.body.error)
            end
        end)
    end)
end)}
