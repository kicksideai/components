-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local data = require("data")
local json = require("json")
local registry = require("registry")
local uuid = require("uuid")
local stages = require("stages")
local ai = require("ai")
local shapes = require("shapes")
local store = require("store")

local function schema(): any return assert(json.decode(assert(registry.get("kickside.docscout:config_schema")).data.schema_json)) end
local function field(kind: string?): any
    local f = schema().properties.fields.items.default
    f.name, f.type, f.description = "terms", kind or "text", "Payment terms"
    f.expected_format, f.validation_hints = "YYYY-MM-DD", "requested summary"
    f.item = f.type == "list" and { type = "object", properties = { { name = "due", type = "date" } } } or nil
    return f
end
local function context(f: any, model: string, enabled: boolean?, extra: string?): any
    local owner = "owner-" .. uuid.v4()
    local chunks = { { ordinal = 1, section_id = "s1", heading_path = "Payment", content = "The total amount is 1250." } }
    if extra then chunks[2] = { ordinal = 2, section_id = "s1", heading_path = "Payment", content = extra } end
    for _, chunk in ipairs(chunks) do
        chunk.vector = {}
        for n = 1, 512 do chunk.vector[n] = n == 1 and 1.0 or 0.0 end
    end
    local document = { owner_id = owner, component_id = data.extractor(owner), upload_id = "upload-" .. uuid.v4(), checksum = "c", processing_key = "k",
        outline = { { id = "s1", chunk_start = 1, chunk_end = #chunks, tokens = 2000 } },
        page_count = 0, tokens = 0, expires_at = "2999-01-01T00:00:00Z" }
    document.id = assert(store.save(document, chunks))
    local v = { name = f.name, path = shapes.path(f), value = f.type == "list" and { { due = "2025-01-01" } } or "2025-01-01",
        confidence = 1, verified = false, missing = false, failed = false,
        evidence = { { chunk = 1, quote = chunks[1].content } } }
    return { document = document, regions = {}, values = { v }, config = { fields = { f }, retrieval = { section_budget = 6000 },
        stages = { verify = { model = "class:docscout-completeness-" .. model, enabled = true, check_quotes = false,
            check_support = true, check_completeness = enabled, max_tokens = 256 } } } }
end
return { run = test.run_cases(function()
    test.describe("Optional completeness", function()
        test.it("keeps the absent and false policies on the existing support request", function()
            for _, policy in ipairs({ "absent", "false" }) do
                local enabled = nil
                if policy == "false" then enabled = false end
                local run = context(field(), "default", enabled)
                local step = { meter = ai.meter() }
                test.is_nil(stages.verify(run, step)); test.eq(#step.meter.calls, 1)
                test.eq(step.meter.input_tokens, 12); test.eq(step.meter.output_tokens, 8)
                test.is_true(run.values[1].verified); test.is_nil(run.values[1].complete)
            end
        end)
        test.it("asks for field-aware completeness with the full requested output contract", function()
            local run = context(field("list"), "complete", true)
            test.is_nil(stages.verify(run, { meter = ai.meter() }))
            test.is_true(run.values[1].complete); test.is_true(run.values[1].verified)
        end)
        test.it("keeps an unknown completeness verdict unknown", function()
            local run = context(field(), "unknown", true)
            test.is_nil(stages.verify(run, { meter = ai.meter() }))
            test.is_nil(run.values[1].complete); test.is_false(run.values[1].verified)
            test.eq(run.values[1].codes[1], "support_insufficient")
        end)
        test.it("distinguishes established incompleteness from unknown", function()
            local run = context(field(), "incomplete", true)
            test.is_nil(stages.verify(run, { meter = ai.meter() }))
            test.is_false(run.values[1].complete); test.is_false(run.values[1].verified)
        end)
        test.it("performs viable quote support when optional source context cannot fit", function()
            local run = context(field(), "small", true, string.rep("Other source text. ", 800))
            local step = { meter = ai.meter() }
            test.is_nil(stages.verify(run, step)); test.eq(#step.meter.calls, 1)
            test.is_nil(step.meter.calls[1].error_code)
            test.is_nil(run.values[1].complete)
        end)
        test.it("never sends missing or failed fields to the support model", function()
            local run = context(field(), "default", nil)
            run.values[#run.values + 1] = { name = "absent", path = "absent", missing = true, failed = false, evidence = {} }
            run.values[#run.values + 1] = { name = "failed", path = "failed", missing = false, failed = true, evidence = {} }
            local absent, failed = field(), field()
            absent.name, failed.name = "absent", "failed"
            run.config.fields = { run.config.fields[1], absent, failed }
            local step = { meter = ai.meter() }
            test.is_nil(stages.verify(run, step)); test.eq(#step.meter.calls, 1)
            test.eq(json.encode(step.meter.calls[1].fields), '["terms"]')
        end)
        test.it("accepts an earlier configuration without a completeness policy", function()
            local config = schema().default
            test.is_true(config.stages.verify.check_completeness == nil or config.stages.verify.check_completeness == false)
            local property = schema().properties.stages.properties.verify.properties.check_completeness
            test.not_nil(property); test.is_false(property.default)
        end)
    end)
end) }
