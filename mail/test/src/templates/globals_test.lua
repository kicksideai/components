-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local funcs = require("funcs")
local security = require("security")
local fixtures = require("fixtures")
local api_fixtures = require("api_fixtures")

local function run(options)
    return test.run_cases(function()
        test.describe("Mail template globals", function()
            test.it("renders when the application definition is denied", function()
                local editor = api_fixtures.session("editor")
                local scope = assert(editor.scope:with(assert(security.policy("app.templates:deny_app_definition"))))
                test.eq("deny", scope:evaluate(editor.actor, "registry.get", "app:definition"))
                local executor = assert(funcs.new():with_actor(editor.actor):with_scope(scope))
                local rendered, err = fixtures.render(executor, {
                    template = "notice", vars = {subject = "Status", message = "Ready"},
                })
                if err then error(err:kind() .. ": " .. err:message()) end
                test.eq("Status", rendered.subject)
                test.not_nil(rendered.html:find("Ready", 1, true))
                test.not_nil(rendered.html:find("KickSide", 1, true))
            end)
        end)
    end)(options)
end

return {run = run}
