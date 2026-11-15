-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local fixture = require("fixture")
local test = require("test")
local function define()
    test.describe("schema order", function()
        test.it("persists submitted attribute order and keeps omitted attributes and their ids", function()
            local h = fixture.catalog()
            local before = assert(h.call("get_schema", {}))
            local name_id, size_id = before.attributes["core.name"].id, before.attributes["core.size"].id
            local applied, err = h.call("apply_schema", { declaration = { aspects = { { namespace = "core", attributes = {
                { code = "size", type = "kickside.pim.types:integer", index = "number" },
                { code = "name", type = "kickside.pim.types:text", scope = { "locale" }, index = "text",
                    index_contexts = { { locale = "en" }, { locale = "de" } } },
            } } } } })
            test.is_nil(err)
            local after = assert(h.call("get_schema", { generation = applied.generation }))
            local attributes = after.declaration.aspects[1].attributes
            test.eq(attributes[1].code, "size")
            test.eq(attributes[1].id, size_id)
            test.eq(attributes[2].code, "name")
            test.eq(attributes[2].id, name_id)
            test.eq(attributes[3].code, "category")
            test.eq(attributes[4].code, "color")
            test.eq(#attributes, #before.declaration.aspects[1].attributes)
        end)
    end)

end
return { run = test.run_cases(define) }
