-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local trim = require("trim_text").trim

local function define_tests()
    test.describe("Whitespace trimming", function()
        test.it("preserves the full long body and its internal whitespace", function()
            local body = "# Report\n" .. string.rep("word ", 16000) .. "end"
            test.eq(trim(" \t\r\n" .. body .. "\v\f "), body)
        end)
        test.it("accepts long whitespace at both edges and whitespace-only text", function()
            local space = string.rep(" \t\r\n\v\f", 16000)
            test.eq(trim(space .. "value" .. space), "value")
            test.eq(trim(space), "")
        end)
        test.it("preserves non-ASCII and non-whitespace bytes", function()
            test.eq(trim(" \0é\194\160 "), "\0é\194\160")
            test.eq(trim(""), "")
            test.eq(trim(nil), "")
            test.eq(trim(false), "")
            test.eq(trim(12), "")
        end)
    end)
end

return { run = test.run_cases(define_tests) }
