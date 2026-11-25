-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")

local function preview()
    local security = require("security")
    local mail = require("preview")
    assert(not security.can("registry.get", "app:definition"), "Expected the registry denial in the render frame")
    return mail.template("notice", {subject = "Status", message = "Ready"})
end

local function run(options)
    local funcs = require("funcs")
    return test.run_cases(function()
        test.describe("Mail template globals", function()
            test.it("renders when the application definition is denied", function()
                local rendered, err = funcs.call("app.templates:preview_without_app_definition")
                if err then error(err:kind() .. ": " .. err:message()) end
                test.eq("Status", rendered.subject)
                test.not_nil(rendered.html:find("Ready", 1, true))
                test.not_nil(rendered.html:find("KickSide", 1, true))
            end)
        end)
    end)(options)
end

return {preview = preview, run = run}
