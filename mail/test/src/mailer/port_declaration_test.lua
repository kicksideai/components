-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local binding_validation = require("binding_validation")
local registry = require("registry")
local test = require("test")

return {run = test.run_cases(function()
    test.describe("Mail automation destination", function()
        test.it("accepts the Mail port in Automation's declaration validator", function()
            local port = assert(registry.get("kickside.mail.ports:send_email"))
            local binding = assert(registry.get(port.data.binding))
            local failures = binding_validation.validate_bindings({port, binding})
            test.eq(0, #failures, table.concat(failures, "; "))
        end)
    end)
end)}
