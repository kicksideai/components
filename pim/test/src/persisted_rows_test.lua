-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local merge_rows = require("merge_rows")
local history = require("history")
local store = require("store")
local types = require("types")
local test = require("test")
local function define()
    test.describe("persisted rows", function()
        test.it("returns malformed persisted JSON as a native error", function()
            local db = { query = function() return { { product_id = "product", sku = "sku", family = "generic", root_id = "product",
                level = 0, is_item = 1, version = 1, status = "active", state = "live", document = "{", source_seq = "{}" } }, nil end }
            local value, err = store.product(db :: types.Executor, "catalog", "product")
            test.is_nil(value)
            test.not_nil(err)
            test.eq(err:kind(), errors.INTERNAL)
            test.eq(err:details().code, "row_corrupt")
            test.eq(err:details().field, "document")
        end)
        test.it("refuses missing required persisted JSON instead of replacing it with an empty object", function()
            for _, field in ipairs({ "document", "source_seq" }) do
                local row = { product_id = "product", sku = "sku", family = "generic", root_id = "product",
                    level = 0, is_item = 1, version = 1, status = "active", state = "live", document = "{}", source_seq = "{}" }
                row[field] = nil
                local value, err = store.from_row(row :: types.Row)
                test.is_nil(value)
                test.eq(err:kind(), errors.INTERNAL)
                test.eq(err:details().code, "row_corrupt")
                test.eq(err:details().field, field)
            end
        end)
        test.it("returns a malformed reference position as a native error", function()
            local db = { query = function() return { { product_id = "product", attribute_id = 1, ctx = "", path = "bad" } }, nil end }
            local rows, err = merge_rows.references(db :: types.Executor, "catalog", "term", "v:term", 1)
            test.is_nil(rows)
            test.not_nil(err)
            test.eq(err:kind(), errors.INTERNAL)
            test.eq(err:details().code, "row_corrupt")
            test.eq(err:details().field, "path")
        end)
        test.it("rejects malformed history JSON", function()
            local db = { query = function() return { { seq = 1, n = 1, subject = "p:x", kind = "value", actor = "a", at = "now", before = "{" } }, nil end }
            local value, _, err = history.page(db :: types.Executor, "catalog", { limit = 10 })
            test.is_nil(value)
            test.not_nil(err)
            test.eq(err:details().code, "row_corrupt")
        end)
    end)

end
return { run = test.run_cases(define) }
