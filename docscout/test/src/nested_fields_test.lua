-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local json = require("json")
local config = require("config")
local shapes = require("shapes")
local stages = require("stages")
local scoring = require("scoring")
local acceptance = require("acceptance")

local function field(name: string, group: string?, kind: string?): any
    local schema = assert(config.schema())
    local f = schema.properties.fields.items.default
    f.name, f.group, f.type = name, group or "", kind or "text"
    return f
end
local function configuration(fields: { any }): any
    local c = assert(config.schema()).default
    c.fields = fields
    return c
end
local function property(name: string, kind: string): any
    return { name = name, type = kind, description = "", enum_values = assert(json.decode("[]")), expected_format = "", required = true }
end

return { run = test.run_cases(function()
    test.describe("Nested typed fields", function()
        test.it("identifies duplicate names by full path and rejects path collisions and free text groups", function()
            test.is_nil(config.validate(configuration({ field("name", "parties.borrower"), field("name", "parties.agent") })))
            for _, fields in ipairs({
                { field("name", "parties"), field("name", "parties") },
                { field("parties"), field("name", "parties.borrower") },
                { field("borrower", "parties"), field("name", "parties.borrower") },
                { field("name", "Borrower details") }, { field("name", "parties..borrower") },
                { field("name", ".parties") }, { field("name", "parties.") },
            }) do test.not_nil(config.validate(configuration(fields))) end
        end)
        test.it("requires declared recursive properties and limits value nesting to four levels", function()
            local f = field("terms", "", "object")
            test.not_nil(config.validate(configuration({ f })))
            f.properties = { property("amount", "number") }
            test.is_true((json.validate({ type = "array" }, f.properties[1].enum_values)))
            test.is_nil(config.validate(configuration({ f })))
            f.properties[2] = property("amount", "text")
            test.not_nil(config.validate(configuration({ f })))
            f.properties = { property("rows", "list") }
            f.properties[1].item = { type = "object", description = "", enum_values = assert(json.decode("[]")), expected_format = "", properties = { property("date", "date") } }
            test.is_nil(config.validate(configuration({ f })))
            f.properties[1].item.properties[1] = property("deeper", "object")
            f.properties[1].item.properties[1].properties = { property("leaf", "text") }
            test.not_nil(config.validate(configuration({ f })))
            test.not_nil(config.validate(configuration({ field("rows", "", "list") })))
        end)
        test.it("generates nested structured output and validates typed expected values", function()
            local f = field("terms", "parties.borrower", "object")
            f.properties = { property("amount", "number"), property("status", "enum"), property("dates", "list") }
            f.properties[2].enum_values = { "open", "closed" }
            f.properties[3].item = { type = "date", description = "", enum_values = assert(json.decode("[]")), expected_format = "YYYY-MM-DD" }
            local schema = shapes.group_schema({ f }, { { ordinal = 7 } })
            local value = schema.properties.parties.properties.borrower.properties.terms.properties.value
            test.is_false(value.additionalProperties)
            test.eq(value.properties.amount.type, "number"); test.eq(value.properties.dates.items.type, "string")
            test.eq(value.properties.status.enum[2], "closed"); test.eq(#value.required, 3)
            local expected = { parties = { borrower = { terms = { amount = 12, status = "open", dates = { "2026-01-01" } } } } }
            test.is_nil(config.validate_expected({ f }, expected))
            expected.parties.borrower.terms.amount = "12"
            test.not_nil(config.validate_expected({ f }, expected))
            test.not_nil(config.validate_expected({ f }, { terms = {} }))
        end)
        test.it("enforces required and optional properties, enum items and closed objects", function()
            local f = field("terms", "agreement", "object")
            f.properties = { property("status", "enum"), property("tags", "list") }
            f.properties[1].enum_values = { "open", "closed" }
            f.properties[2].required = false
            f.properties[2].item = { type = "enum", enum_values = { "secured", "unsecured" } }
            test.is_nil(config.validate_expected({ f }, { agreement = { terms = { status = "open" } } }))
            for _, value in ipairs({ {}, { status = "unknown" }, { status = "open", tags = { "unknown" } }, { status = "open", extra = true } }) do
                test.not_nil(config.validate_expected({ f }, { agreement = { terms = value } }))
            end
        end)
        test.it("groups calls by full group path and region before splitting by the limit", function()
            local a, b, c = field("name", "parties.borrower"), field("name", "parties.agent"), field("amount", "parties.borrower")
            c.search_within = "sections"
            local d = field("address", "parties.borrower")
            local cfg = configuration({ a, b, c, d }); cfg.stages.extract.max_fields_per_call = 1
            local pool = shapes.pool()
            shapes.add(pool, { { ordinal = 1 }, { ordinal = 2 } })
            local calls = assert(stages.extraction_calls({ config = cfg, regions = { ["parties.borrower.amount"] = { 2 } }, pool = pool, notes = { { field = "parties.borrower.name", text = "Borrower note" }, { field = "parties.agent.name", text = "Agent note" } } }))
            test.eq(#calls, 4); test.eq(calls[1].fields[1].group, "parties.borrower"); test.eq(calls[2].fields[1].name, "address")
            test.eq(calls[3].fields[1].group, "parties.agent")
            test.eq(#calls[1].passages, 2); test.eq(#calls[4].passages, 1); test.eq(calls[4].passages[1].ordinal, 2)
            test.eq(#calls[1].notes, 1); test.eq(calls[1].notes[1], "parties.borrower.name: Borrower note")
            test.eq(#calls[2].notes, 0); test.eq(#calls[3].notes, 1); test.eq(calls[3].notes[1], "parties.agent.name: Agent note")
        end)
        test.it("assembles nested values and preserves false and absent fields", function()
            local values = shapes.values({ fields = {
                { name = "name", path = "parties.borrower.name", value = "Borrower" },
                { name = "name", path = "parties.agent.name", value = "Agent" },
                { name = "paid", path = "paid", value = false }, { name = "missing", path = "parties.missing", missing = true },
            } })
            test.eq(values.parties.borrower.name, "Borrower"); test.eq(values.parties.agent.name, "Agent")
            test.is_false(values.paid); test.is_nil(values.parties.missing)
        end)
        test.it("verifies typed values recursively even when support checks are off", function()
            local f = field("terms", "parties.borrower", "object"); f.properties = { property("amount", "number") }
            local cfg = configuration({ f }); cfg.stages.verify.check_quotes, cfg.stages.verify.check_support = false, false
            local run = { config = cfg, values = { { name = "terms", path = "parties.borrower.terms", value = { amount = "wrong" }, missing = false, evidence = {} } } }
            test.is_nil(stages.verify(run, {})); test.is_false(run.values[1].verified)
            run.values[1].value, run.values[1].reason = { amount = 12 }, nil
            test.is_nil(stages.verify(run, {})); test.is_true(run.values[1].verified)
        end)
        test.it("scores recursively by declared type with nested expectations and full path metrics", function()
            local f = field("terms", "parties.borrower", "list")
            f.item = { type = "object", properties = { property("amount", "number"), property("date", "date") } }
            local e = { { amount = 1200, date = "2026-01-01" }, { amount = 40, date = "2026-02-02" } }
            local g = { { amount = "40", date = "20260202" }, { amount = "USD 1,200", date = "20260101" } }
            local scores = scoring.case({ f }, { parties = { borrower = { terms = e } } }, { ["parties.borrower.terms"] = { value = g, verified = true } })
            test.eq(scores[1].score, 1); test.eq(scores[1].field, "parties.borrower.terms")
            test.eq(scoring.metrics({ f }, { scores })[1].field, "parties.borrower.terms")
        end)
        test.it("converts all 53 acceptance field definitions into a valid extractor", function()
            local fields = {}
            for _, definition in ipairs(acceptance.fields()) do
                local group, name = definition.path:match("^(.*)%.([^.]+)$")
                local f = field(name, group, definition.type)
                for k, v in pairs(definition) do if k ~= "path" then f[k] = v end end
                fields[#fields + 1] = f
            end
            test.eq(#fields, 53)
            local groups, count, objects, lists = {}, 0, 0, 0
            for _, f in ipairs(fields) do
                if not groups[f.group] then groups[f.group] = true; count = count + 1 end
                if f.type == "object" then objects = objects + 1 end
                if f.type == "list" then lists = lists + 1 end
            end
            test.eq(count, 11); test.eq(objects, 29); test.eq(lists, 10)
            test.is_nil(config.validate(configuration(fields)))
        end)
    end)
end) }
