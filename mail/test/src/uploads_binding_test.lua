-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local contract = require("contract")
local test = require("test")

return { run = test.run_cases(function()
    test.describe("Uploads wiring", function()
        test.it("opens the real upload content provider", function()
            local definition = assert(contract.get("kickside.contract:content_provider"))
            local provider, err = definition:open("kickside.uploads:content_provider", { upload_id = "missing" })
            test.is_nil(err, tostring(err))
            test.not_nil(provider)
        end)
    end)
end) }
