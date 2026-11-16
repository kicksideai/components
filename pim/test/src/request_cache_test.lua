-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local requests = require("requests")
local fixture = require("fixture")
local decoder = require("decoder")
local function bytes(text: string): { unknown }
    local raw: { unknown } = {}
    for i = 1, #text do raw[i] = assert(math.tointeger(text:byte(i))) end
    return raw
end
local function define()
    test.describe("request schema derivation", function()
        test.it("decodes a method once per registry version", function()
            fixture.schema(bytes('{"type":"object","properties":{"value":{"type":"string"}},"required":["value"]}'))
            local before = decoder.count()
            test.is_nil(requests.parse("cached", {value="text"}))
            local first = decoder.count()
            test.eq(first, before + 1)
            test.is_nil(requests.parse("cached", {value="again"}))
            test.eq(decoder.count(), first)
            local err = requests.parse("cached", {value=42})
            test.eq(err:kind(), errors.INVALID)
            test.eq(decoder.count(), first)
        end)
        test.it("re-derives changed definitions at the registry version", function()
            fixture.schema(bytes('{"type":"object","properties":{"value":{"type":"string"}},"required":["value"]}'))
            test.is_nil(requests.parse("changed", {value="text"}))
            local before = decoder.count()
            fixture.schema(bytes('{"type":"object","properties":{"value":{"type":"number"}},"required":["value"]}'))
            test.is_nil(requests.parse("changed", {value=42}))
            test.eq(decoder.count(), before + 1)
            local err = requests.parse("changed", {value="text"})
            test.eq(err:kind(), errors.INVALID)
        end)
        test.it("keeps malformed definition bytes classified as internal", function()
            for _, byte in ipairs({ 0.5, -1, 256, "x" }) do
                fixture.schema({123, byte, 125})
                local err = requests.parse("malformed", {})
                test.not_nil(err)
                test.eq(err:kind(), errors.INTERNAL)
                test.eq(err:details().code, "contract_schema_invalid")
            end
        end)
        test.it("decodes byte definitions across chunk boundaries", function()
            fixture.schema(bytes('{"type":"object","description":"' .. string.rep("x", 9000) .. '"}'))
            test.is_nil(requests.parse("large", {}))
        end)
    end)
end
return {run=test.run_cases(define)}
