-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local types = require("types")
local schema = require("schema")
local test = require("test")
local function define()
    test.describe("schema limits", function()
        test.it("counts text indexes toward the catalog's indexed-column limit", function()
            local attributes = {}
            for i = 1, 401 do attributes[i] = { code = "v" .. i, type = "text", index = "text" } end
            local compiled, err = schema.compile(nil, { aspects = { { namespace = "probe", attributes = attributes } } }, {
                type_of = function(id: string): (types.TypeMeta?, error?) return { type = id, form = "text", indexes = { "none", "text" } }, nil end,
            })
            test.is_nil(compiled)
            test.not_nil(err)
            test.eq(err:kind(), errors.INVALID)
        end)
        test.it("bounds resolution candidates independently of served contexts", function()
            local function declaration(member_count: integer): types.Declaration
                local members, fallback = {}, {}
                for i = 1, member_count do members[i] = "m" .. i end
                for i = 2, member_count do fallback[#fallback + 1] = members[i] end
                return { dimensions = {
                    { name = "a", members = members, fallback = { m1 = fallback } },
                    { name = "b", members = members, fallback = { m1 = fallback } },
                }, aspects = { { namespace = "probe", attributes = { { code = "value", type = "text", scope = { "a", "b" } } } } } }
            end
            local lookups = { type_of = function(id: string): (types.TypeMeta?, error?) return { type = id, form = "text", indexes = { "none" } }, nil end }
            test.not_nil((schema.compile(nil, declaration(7), lookups)))
            local compiled, err = schema.compile(nil, declaration(8), lookups)
            test.is_nil(compiled)
            test.eq(err:kind(), errors.INVALID)
        end)
    end)

end
return { run = test.run_cases(define) }
