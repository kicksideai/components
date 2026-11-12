-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local json = require("json")
local shapes = require("shapes")

local function field(over: any): any
    local f = { name = "f", type = "text", description = "", enum_values = {}, required = false,
        search_hints = "", validation_hints = "", expected_format = "", strategy = "standard", search_within = "document",
        group = "", evidence_required = true, chunks = 5 }
    for k, v in pairs(over or {}) do f[k] = v end
    return f
end

local function chunk(ordinal: integer, over: any?): any
    local c = { ordinal = ordinal, heading_path = "Section", content = "text " .. ordinal }
    for k, v in pairs(over or {}) do c[k] = v end
    return c
end

return { run = test.run_cases(function()
    test.describe("Text helpers", function()
        test.it("counts long extracted Unicode values without truncation", function()
            local value = string.rep("界", 120000)
            local issue = shapes.length_issue({ type = "string", maxLength = 20 }, value)
            test.eq(issue.length, 120000)
            test.eq(issue.limit, 20)
        end)
        test.it("retains the byte scan semantics for incomplete UTF-8 sequences", function()
            local function scanned(value: string): string
                local characters = {}
                for ch in value:gmatch("[%z\1-\127\194-\244][\128-\191]*") do characters[#characters + 1] = ch end
                return table.concat(characters):lower()
            end
            local value = "\128a\128\192\128b\245\191"
            test.eq(shapes.normalize_literal(value), scanned(value))
            value = "a\194\128b\226\128"
            test.eq(shapes.normalize_literal(value), scanned(value))
        end)
        test.it("trims and splits non-empty lines", function()
            test.eq(shapes.trim("  a b \n"), "a b")
            test.eq(shapes.trim(""), "")
            test.eq((json.encode(shapes.lines("one\n\n  two  \n   \nthree"))), (json.encode({ "one", "two", "three" })))
            test.eq(#shapes.lines(""), 0)
        end)
        test.it("matches quotes across typography, emphasis and spacing but never across changed numbers", function()
            test.eq(shapes.normalize("  **Total due:**  EUR 5,188.40\n"), "total due: eur 5,188.40")
            test.eq(shapes.normalize("“Net 30” — payable\194\160on receipt…"), shapes.normalize('"Net 30" - payable on receipt...'))
            test.eq(shapes.normalize("Mid–Term   Memory"), "mid-term memory")
            test.eq(shapes.normalize("| Fee | 1,000 |"), "fee 1,000")
            test.is_true(shapes.normalize("-5") ~= shapes.normalize("+5"))
            test.is_true(shapes.normalize("1.5%") ~= shapes.normalize("15%"))
            test.is_true(shapes.normalize("2 * 3") ~= shapes.normalize("2 3"))
            test.eq(shapes.normalize("*Net 30* applies"), "net 30 applies")
            test.eq(shapes.normalize("field invoice_total"), "field invoice_total")
            test.eq(shapes.normalize("Gebühr für Prüfung"), "gebühr für prüfung")
        end)
        test.it("reads OCR math spacing markup as whitespace and keeps other dollar signs", function()
            local plain = shapes.normalize("Item A Item B")
            test.eq(shapes.normalize("Item A $\\quad$ Item B"), plain)
            test.eq(shapes.normalize("Item A$\\qquad$Item B"), plain)
            test.eq(shapes.normalize("Item A $\\hspace{2em}$ Item B"), plain)
            test.eq(shapes.normalize("Item A $\\, \\;$ Item B"), plain)
            test.eq(shapes.normalize("Item A $ $ Item B"), "item a $ $ item b")
            test.eq(shapes.normalize("Pay $5 and $6"), "pay $5 and $6")
            test.eq(shapes.normalize("cost $5 then $\\quad$ more"), "cost $5 then more")
            test.eq(shapes.normalize("$x^2$ grows"), "$x^2$ grows")
        end)
        test.it("locates a quote in its cited chunk, else the first chunk that holds it", function()
            local bodies = { [1] = shapes.normalize("Intro text."), [2] = shapes.normalize("Fee is USD 10."), [3] = shapes.normalize("Again: fee is USD 10.") }
            local order = { 1, 2, 3 }
            test.eq(shapes.locate("fee is USD 10", 3, bodies, order), 3)
            test.eq(shapes.locate("fee is USD 10", 1, bodies, order), 2)
            test.eq(shapes.locate("fee is USD 10", nil, bodies, order), 2)
            test.is_nil(shapes.locate("fee is USD 11", 2, bodies, order))
            test.is_nil(shapes.locate("  ", 2, bodies, order))
        end)
        test.it("locates a quote that runs across two adjacent chunks the field may read", function()
            local bodies = { [1] = shapes.normalize("Intro text. The first part ends"), [2] = shapes.normalize("here and the second part follows."),
                [3] = shapes.normalize("Closing words."), [4] = shapes.normalize("Final page.") }
            local raw = { [1] = { ordinal = 1, content = "Intro text. The first part ends" }, [2] = { ordinal = 2, content = "here and the second part follows." },
                [3] = { ordinal = 3, content = "Closing words." }, [4] = { ordinal = 4, content = "Final page." } }
            local source = table.concat({ raw[1].content, raw[2].content, raw[3].content, raw[4].content }, " ")
            local positions = shapes.source_positions({ raw[1], raw[2], raw[3], raw[4] }, source)
            for i, chunk in pairs(raw) do chunk.source_start, chunk.source_end = positions[i].first, positions[i].last end
            local ctx = shapes.quote_context({ raw[1], raw[2], raw[3], raw[4] }, source)
            local first, last = shapes.locate("the first part ends here and", nil, bodies, { 1, 2, 3, 4 }, ctx)
            test.eq(first, 1); test.eq(last, 2)
            first, last = shapes.locate("Intro text.", 1, bodies, { 1, 2, 3, 4 })
            test.eq(first, 1); test.eq(last, 1)
            test.is_nil(shapes.locate("the first part ends here and", nil, bodies, { 1, 3, 4 }))
            test.is_nil(shapes.locate("part follows. closing words. final page", nil, bodies, { 1, 2, 3, 4 }))
        end)
        test.it("joins overlapping adjacent chunks once at their shared text", function()
            local shared = "the shared overlap text repeated at the end of one chunk and the start of the next"
            local bodies = { [1] = shapes.normalize("Opening words, " .. shared), [2] = shapes.normalize(shared .. " and closing words.") }
            local raw = { { ordinal = 1, content = "Opening words, " .. shared }, { ordinal = 2, content = shared .. " and closing words." } }
            local source = "Opening words, " .. shared .. " and closing words."
            local positions = shapes.source_positions(raw, source)
            for i, chunk in ipairs(raw) do chunk.source_start, chunk.source_end = positions[i].first, positions[i].last end
            local first, last = shapes.locate("opening words, " .. shared .. " and closing", nil, bodies, { 1, 2 }, shapes.quote_context(raw, source))
            test.eq(first, 1); test.eq(last, 2)
        end)
        test.it("builds an empty table that encodes as a JSON object", function()
            test.eq((json.encode(shapes.object())), "{}")
            local filled = shapes.object(); filled.a = 1
            test.eq((json.encode(filled)), '{"a":1}')
        end)
    end)

    test.describe("Output estimates", function()
        test.it("estimates a field's reply from its value leaves and its quotes", function()
            local function f(t: string, over: any?): any
                local out = { name = "x", type = t, description = "" }
                for k, v in pairs(over or {}) do out[k] = v end
                return out
            end
            local number, text = shapes.output_estimate(f("number")), shapes.output_estimate(f("text"))
            test.is_true(text > number)
            local object = shapes.output_estimate(f("object", { properties = { f("text", { name = "a" }), f("number", { name = "b" }) } }))
            test.is_true(object > text)
            test.is_true(shapes.output_estimate(f("list", { item = f("text") })) > text)
            test.is_true(number > shapes.EVIDENCE_LIMIT * 10)
        end)
    end)

    test.describe("Evidence pool", function()
        test.it("adds each chunk once, keeps dropped chunks out and orders by position", function()
            local pool = shapes.pool()
            shapes.add(pool, { chunk(5), chunk(2), chunk(5) })
            test.eq(pool.count, 2)
            test.is_true(shapes.drop(pool, 5))
            test.is_false(shapes.drop(pool, 5))
            test.is_false(shapes.drop(pool, 99))
            shapes.add(pool, { chunk(5), chunk(1) })
            test.eq(pool.count, 2)
            local ordered = shapes.ordered(pool)
            test.eq(ordered[1].ordinal, 1); test.eq(ordered[2].ordinal, 2)
            shapes.add(pool, nil)
            test.eq(pool.count, 2)
        end)
        test.it("records the fields and queries that found each passage and its best rank", function()
            local pool = shapes.pool()
            shapes.add(pool, { chunk(4), chunk(5) }, "fee", "renewal fee")
            shapes.add(pool, { chunk(5), chunk(6) }, "law", "governing law")
            shapes.add(pool, { chunk(6) })
            local p = pool.provenance
            test.eq(p[5].rank, 1); test.eq(p[4].rank, 1); test.eq(p[6].rank, 1)
            test.is_true(p[5].fields.fee); test.is_true(p[5].fields.law); test.is_nil(p[4].fields.law)
            test.eq(table.concat(p[5].queries, "|"), "renewal fee|governing law")
            shapes.add(pool, { chunk(9), chunk(4) }, "fee", "fee schedule")
            test.eq(p[4].rank, 1); test.eq(p[9].rank, 1)
            shapes.add(pool, { chunk(10), chunk(11) }, "fee", "fee table")
            test.eq(p[11].rank, 2)
        end)
        local function ordinals(pool: any, fields: { string }?): string
            local o = {}
            for _, c in ipairs(shapes.ordered(pool, fields)) do o[#o + 1] = tostring(c.ordinal) end
            return table.concat(o, ",")
        end
        test.it("excludes noise only for the fields that did not cite it", function()
            local pool = shapes.pool()
            shapes.add(pool, { chunk(1), chunk(2), chunk(3), chunk(4) })
            local excluded = shapes.prune(pool, { 1, 2, 3, 99 }, { law = { 2 }, fee = { 3, 4 } })
            test.eq(excluded, 1)
            test.eq(ordinals(pool, { "law", "fee" }), "2,3,4")
            test.eq(ordinals(pool, { "law" }), "2,4")
            test.eq(ordinals(pool, { "fee" }), "3,4")
            test.is_true(pool.provenance[2].cited.law); test.is_nil(pool.provenance[2].cited.fee)
            test.eq(shapes.prune(pool, {}, {}), 0)
        end)
        test.it("re-admits an excluded passage for the field whose own search finds it again", function()
            local pool = shapes.pool()
            shapes.add(pool, { chunk(1), chunk(2) })
            shapes.prune(pool, { 1 }, { law = {}, fee = {} })
            test.eq(ordinals(pool, { "law", "fee" }), "2")
            shapes.add(pool, { chunk(1) }, "law", "governing law")
            test.eq(ordinals(pool, { "law" }), "1,2")
            test.eq(ordinals(pool, { "fee" }), "2")
            shapes.add(pool, { chunk(1) })
            test.eq(ordinals(pool, { "fee" }), "2")
        end)
        test.it("restores a previously excluded field when a later review cites its passage", function()
            local pool = shapes.pool()
            shapes.add(pool, { chunk(1), chunk(2) })
            shapes.prune(pool, { 1 }, { law = {}, fee = {} })
            shapes.add(pool, { chunk(1) }, "law", "governing law")
            test.eq(ordinals(pool, { "fee" }), "2")
            shapes.prune(pool, { 1 }, { law = {}, fee = { 1 } })
            test.eq(ordinals(pool, { "fee" }), "1,2")
            test.eq(ordinals(pool, { "law" }), "2")
            test.is_true(pool.provenance[1].cited.fee)
        end)
        test.it("lets a later noise decision exclude a historically cited passage", function()
            local pool = shapes.pool()
            shapes.add(pool, { chunk(1), chunk(2) })
            shapes.prune(pool, { 1 }, { fee = { 1 }, law = {} })
            shapes.prune(pool, { 1 }, { fee = {}, law = {} })
            test.eq(ordinals(pool, { "fee", "law" }), "2")
            test.is_true(pool.provenance[1].cited.fee)
            shapes.add(pool, { chunk(1) }, "deep", "fee detail")
            test.eq(ordinals(pool, { "deep" }), "1,2")
            test.eq(ordinals(pool, { "fee", "law" }), "2")
            shapes.prune(pool, { 1 }, { fee = {}, law = {} })
            test.eq(ordinals(pool, { "deep" }), "1,2")
        end)
        test.it("keeps passages inside a sections field's selected region even when marked as noise", function()
            local pool = shapes.pool()
            shapes.add(pool, { chunk(1), chunk(5), chunk(6) })
            test.eq(shapes.prune(pool, { 1, 5, 6 }, { law = {} }, { 5, 6, 7 }), 1)
            test.eq(ordinals(pool, { "law" }), "5,6")
        end)
        test.it("renders passages with their label, section and page or page range", function()
            local text = shapes.render({ chunk(3, { page_start = 2, page_end = 2 }), chunk(4, { page_start = 2, page_end = 4 }), chunk(9) })
            test.is_true(text:find("[C3] Section p.2\ntext 3", 1, true) ~= nil)
            test.is_true(text:find("[C4] Section pp.2-4\ntext 4", 1, true) ~= nil)
            test.is_true(text:find("[C9] Section\ntext 9", 1, true) ~= nil)
            test.eq(shapes.render({}), "")
        end)
        test.it("expands outline sections to their chunk ordinals and ignores unknown ids", function()
            local outline = { { id = "a", chunk_start = 1, chunk_end = 3 }, { id = "b", chunk_start = 4, chunk_end = 4 }, { id = "c", chunk_start = 5, chunk_end = 6 } }
            test.eq((json.encode(shapes.ordinals_of(outline, { "c", "a", "zzz" }))), (json.encode({ 1, 2, 3, 5, 6 })))
            test.eq(#shapes.ordinals_of(outline, {}), 0)
        end)
    end)

    test.describe("Field descriptions for models", function()
        test.it("states type, requirement, allowed values, format and rules", function()
            local text = shapes.field_lines({
                field({ name = "status", type = "enum", enum_values = { "Paid", "Unpaid" }, required = true, description = "Payment status" }),
                field({ name = "items", type = "list", item = { type = "number" }, expected_format = "decimal", validation_hints = "positive" }),
            })
            test.is_true(text:find("- status (enum, required): Payment status", 1, true) ~= nil)
            test.is_true(text:find("allowed: Paid, Unpaid", 1, true) ~= nil)
            test.is_true(text:find("- items (list of number): no description", 1, true) ~= nil)
            test.is_true(text:find("format: decimal", 1, true) ~= nil)
            test.is_true(text:find("rules: positive", 1, true) ~= nil)
        end)
    end)

    test.describe("Extraction schemas", function()
        test.it("maps every field type to a strict JSON Schema value", function()
            test.eq(shapes.value_schema(field({ type = "text" })).type, "string")
            test.eq(shapes.value_schema(field({ type = "date" })).type, "string")
            test.eq(shapes.value_schema(field({ type = "number" })).type, "number")
            test.eq(shapes.value_schema(field({ type = "boolean" })).type, "boolean")
            local enum = shapes.value_schema(field({ type = "enum", enum_values = { "A", "B" } }))
            test.eq(enum.type, "string"); test.eq((json.encode(enum.enum)), (json.encode({ "A", "B" })))
            local object = shapes.value_schema(field({ type = "object", properties = { { name = "label", type = "text" } } }))
            test.eq(object.type, "object"); test.is_false(object.additionalProperties); test.eq(object.properties.label.type, "string")
            local numbers = shapes.value_schema(field({ type = "list", item = { type = "number" } }))
            test.eq(numbers.type, "array"); test.eq(numbers.items.type, "number")
            local choices = shapes.value_schema(field({ type = "list", item = { type = "text", enum_values = { "x", "y" } } }))
            test.eq((json.encode(choices.items.enum)), (json.encode({ "x", "y" })))
            local objects = shapes.value_schema(field({ type = "list", item = { type = "object", properties = { { name = "label", type = "text" } } } }))
            test.eq(objects.items.type, "object"); test.is_false(objects.items.additionalProperties); test.eq(objects.items.properties.label.type, "string")
        end)
        test.it("searches each field by its name and description, then by each hint", function()
            local q = shapes.field_queries(field({ name = "renewal_notice_days", description = "Notice to stop renewal", search_hints = "non-renewal\n\nwritten notice" }))
            test.eq((json.encode(q)), (json.encode({ "renewal notice days: Notice to stop renewal", "non-renewal", "written notice" })))
            test.eq((json.encode(shapes.field_queries(field({ name = "total" })))), (json.encode({ "total" })))
        end)
        test.it("lets evidence cite only the passages the call sends", function()
            local schema = shapes.group_schema({ field({ name = "a" }) }, { chunk(4), chunk(5) })
            test.is_true((json.validate(schema, json.decode('{"a":{"found":true,"value":"x","confidence":1,"evidence":[{"chunk":5,"quote":"x"}]}}'))))
            test.is_false((json.validate(schema, json.decode('{"a":{"found":true,"value":"x","confidence":1,"evidence":[{"chunk":-1,"quote":"x"}]}}'))))
            test.is_false((json.validate(schema, json.decode('{"a":{"found":true,"value":"x","confidence":1,"evidence":[{"chunk":3,"quote":"x"}]}}'))))
        end)
        test.it("bounds evidence and confidence", function()
            local f = shapes.group_schema({ field({ name = "a" }) }, {}).properties.a.properties
            test.eq(f.evidence.maxItems, shapes.EVIDENCE_LIMIT)
            test.eq(f.confidence.minimum, 0); test.eq(f.confidence.maximum, 1)
        end)
        test.it("requires found, value, confidence and evidence for every field of a group", function()
            local schema = shapes.group_schema({ field({ name = "a" }), field({ name = "b", type = "number" }) }, {})
            test.eq((json.encode(schema.required)), (json.encode({ "a", "b" })))
            test.is_false(schema.additionalProperties)
            local a = schema.properties.a
            test.eq((json.encode(a.required)), (json.encode({ "found", "value", "confidence", "evidence" })))
            test.eq(a.properties.found.type, "boolean")
            test.eq((json.encode(a.properties.evidence.items.required)), (json.encode({ "chunk", "quote" })))
            test.eq(schema.properties.b.properties.value.type, "number")
        end)
    end)
end) }
