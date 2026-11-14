-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Schema-directed parsing of decoded JSON: an empty Lua table stands for both
-- {} and [], so a tolerant schema accepts it wherever a list is expected and
-- still refuses every other mismatch.
local test = require("test")
local shape = require("shape")
local types = require("types")
local json = require("json")

local SCHEMA: types.JsonObject = {
    type = "object", additionalProperties = false, required = { "id" },
    properties = {
        id = { type = "string" },
        tags = { type = "array", items = { type = "string" } },
        nested = { type = "object", properties = { list = { type = "array", minItems = 1, items = { type = "integer" } } } },
        either = { type = { "array", "null" } },
        meta = { type = "object" },
    },
}

local function define()
    test.describe("tolerant schemas", function()
        test.it("accepts an empty table where a list or an object is expected", function()
            local tolerant = shape.tolerant(SCHEMA)
            test.is_nil(shape.check(tolerant, { id = "a", tags = {}, meta = {} }, "probe"))
            test.is_nil(shape.check(tolerant, { id = "a", tags = { "x" }, nested = { list = { 1, 2 } } }, "probe"))
            test.is_nil(shape.check(tolerant, { id = "a", either = {} }, "probe"))
        end)

        test.it("accepts an empty list decoded from JSON where an object is expected", function()
            local tolerant = shape.tolerant(SCHEMA)
            test.is_nil(shape.check(tolerant, json.decode('{"id":"a","meta":[],"tags":[]}'), "probe"))
            test.not_nil(shape.check(tolerant, json.decode('{"id":"a","meta":[1]}'), "probe"))
        end)

        test.it("still refuses wrong types, missing keys, extra keys and list rules", function()
            local tolerant = shape.tolerant(SCHEMA)
            for _, bad in ipairs({
                { tags = {} },
                { id = 5 },
                { id = "a", tags = { 5 } },
                { id = "a", tags = "x" },
                { id = "a", extra = true },
                { id = "a", nested = { list = { "x" } } },
                { id = "a", meta = "x" },
            } :: { types.JsonObject }) do
                local err = shape.check(tolerant, bad, "probe")
                test.not_nil(err)
                test.eq((err :: error):kind(), errors.INVALID)
            end
        end)

        test.it("reads an empty schema node as any value and keeps empty lists of names", function()
            local decoded: types.JsonObject = { type = "object", required = {}, properties = { value = {}, kind = { enum = { "a", "b" } } } }
            test.is_nil(shape.check(shape.tolerant({ type = "object", properties = {} }), {}, "probe"))
            local tolerant = shape.tolerant(decoded)
            test.is_nil(shape.check(tolerant, { value = { 1, 2 } }, "probe"))
            test.is_nil(shape.check(tolerant, { value = "x", kind = "a" }, "probe"))
            test.not_nil(shape.check(tolerant, { kind = "c" }, "probe"))
        end)

        test.it("leaves the source schema untouched", function()
            local before = (SCHEMA.properties :: { [string]: types.JsonObject }).tags.type
            shape.tolerant(SCHEMA)
            test.eq((SCHEMA.properties :: { [string]: types.JsonObject }).tags.type, before)
        end)
    end)
end

return { run = test.run_cases(define) }
