-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Declared seams: attribute types and checks read from their registry entries.
local test = require("test")
local seams = require("seams")

local function define()
    test.describe("seams", function()
        test.it("reads a declared type", function()
            local t = assert((seams.load_type("app:probe_text_type")))
            test.eq(t.type, "kickside.pim.type")
            test.eq(t.form, "text")
            test.eq(#(t.indexes :: { string }), 2)
            test.is_nil(t.target)
            local ref = assert((seams.load_type("app:probe_term_type")))
            test.eq(ref.target, "term")
            test.is_nil(ref.indexes)
        end)

        test.it("reads a type's config schema and functions", function()
            local t = assert((seams.load_type("app:probe_code_type")))
            test.eq(assert(t.config_schema).type, "object")
            test.eq(assert(t.functions).normalize, "app:probe_normalize")
            test.eq(assert(t.functions).validate, "app:probe_validate")
            local plain = assert((seams.load_type("app:probe_text_type")))
            test.is_nil(plain.config_schema)
            test.is_nil(plain.functions)
        end)

        test.it("refuses what is not a declared type", function()
            for _, id in ipairs({ "app:nope", "app:probe_formless_type", "app:probe_check", "app:probe_no_seam",
                "app:probe_wordy_functions_type", "app:probe_blank_function_type", "app:probe_listed_config_type" }) do
                local _, err = seams.load_type(id)
                test.not_nil(err, id)
                test.eq((err :: error):kind(), errors.INVALID, id)
            end
        end)

        test.it("knows a declared check", function()
            for _, id in ipairs({ "app:probe_check", "app:probe_no_seam", "app:probe_text_type", "app:nope" }) do
                local digest, err = seams.check_digest(id)
                test.is_nil(err, tostring(err))
                test.eq(digest ~= nil, id == "app:probe_check", id)
            end
        end)
    end)
end

return { run = test.run_cases(define) }
