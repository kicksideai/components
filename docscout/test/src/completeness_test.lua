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
local fs = require("fs")

local function schema(): any return assert(json.decode(assert(registry.get("kickside.docscout:config_schema")).data.schema_json)) end
local function field(kind: string?): any
    local f = schema().properties.fields.items.default
    f.name, f.type, f.description = "terms", kind or "text", "Payment terms"
    f.expected_format, f.validation_hints = "YYYY-MM-DD", "requested summary"
    f.item = f.type == "list" and { type = "object", properties = { { name = "due", type = "date" } } } or nil
    return f
end
local function context(f: any, model: string, enabled: boolean?, extra: string?): any
    local storage = assert(fs.get("app:uploads"))
    local _, err = storage:writefile("completeness-requests.json", "[]")
    assert(err == nil, tostring(err))
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
local function legacy_identity(run: any)
    local legacy = assert(json.decode(assert(json.encode(run))))
    legacy.config.stages.verify.check_completeness = false
    local step = { meter = ai.meter() }
    test.is_nil(stages.verify(run, step)); test.eq(#step.meter.calls, 1)
    local storage = assert(fs.get("app:uploads"))
    local enhanced_request = assert(json.decode(assert(storage:readfile("completeness-requests.json"))))[1]
    local _, err = storage:writefile("completeness-requests.json", "[]")
    test.is_nil(err)
    local legacy_step = { meter = ai.meter() }
    test.is_nil(stages.verify(legacy, legacy_step)); test.eq(#legacy_step.meter.calls, 1)
    test.is_nil(step.meter.calls[1].error_code)
    local legacy_request = assert(json.decode(assert(storage:readfile("completeness-requests.json"))))[1]
    test.eq(json.encode(enhanced_request), json.encode(legacy_request))
    test.eq(step.meter.input_tokens, legacy_step.meter.input_tokens)
    test.eq(step.meter.output_tokens, legacy_step.meter.output_tokens)
    test.eq(step.message, legacy_step.message)
    for _, v in ipairs(run.values) do
        test.is_nil(v.complete); test.is_true(v.verified)
        test.is_nil(v.reason); test.eq(#v.codes, 0)
    end
end
return { run = test.run_cases(function()
    test.describe("Optional completeness", function()
        for _, kind in ipairs({ "text", "list" }) do
            test.it("preserves legacy support when the " .. kind .. " contract exceeds admission", function()
                local f = field(kind)
                f.description = string.rep("Detailed output instructions. ", 120)
                if kind == "list" then
                    f.item.properties[1].description = string.rep("Nested contract. ", 200)
                end
                local run = context(f, "small", true)
                legacy_identity(run)
            end)
        end
        test.it("preserves legacy support after an optional chunk read fails", function()
            local run = context(field(), "default", true)
            data.execute("UPDATE kickside_docscout_chunks SET page_spans=$1 WHERE document_id=$2", { "{", run.document.id })
            local _, read_err = store.all_chunks(run.document.id)
            test.not_nil(read_err)
            legacy_identity(run)
        end)
        test.it("preserves legacy support after optional source-region selection fails", function()
            local f = field(); f.search_within = "sections"
            local run = context(f, "default", true)
            legacy_identity(run)
        end)
        test.it("retains the support call for extracted values without quotes", function()
            local run = context(field(), "small", true)
            run.values[1].evidence = {}
            local step = { meter = ai.meter() }
            test.is_nil(stages.verify(run, step)); test.eq(#step.meter.calls, 1)
            test.eq(json.encode(step.meter.calls[1].fields), '["terms"]')
            test.is_nil(run.values[1].complete); test.is_false(run.values[1].verified)
            test.eq(run.values[1].codes[1], "no_quote")
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
            test.eq(run.values[1].codes[1], "support_insufficient"); test.eq(#run.values[1].codes, 1)
        end)
        test.it("distinguishes established incompleteness from unknown", function()
            local run = context(field(), "incomplete", true)
            test.is_nil(stages.verify(run, { meter = ai.meter() }))
            test.is_false(run.values[1].complete); test.is_false(run.values[1].verified)
        end)
        test.it("performs viable quote support when optional source context cannot fit", function()
            local run = context(field(), "small", true, string.rep("Other source text. ", 800))
            legacy_identity(run)
        end)
        test.it("shares source chunks across fields and preserves all citation references", function()
            local run = context(field(), "shared", true, "Shared context marker.")
            local other = field(); other.name = "other"
            run.config.fields[2] = other
            run.values[2] = { name = "other", path = "other", value = "2025-01-01", missing = false, failed = false,
                evidence = { { chunk = 1, quote = "The total amount is 1250." } } }
            local step = { meter = ai.meter() }
            test.is_nil(stages.verify(run, step)); test.eq(#step.meter.calls, 1)
            test.is_true(run.values[1].complete); test.is_true(run.values[2].complete)
            test.eq(json.encode(step.meter.calls[1].sources), '[1,2]')
        end)
        for _, smaller_first in ipairs({ false, true }) do
            test.it("preserves the legacy request when the oversized source comes " .. (smaller_first and "last" or "first"), function()
                local run = context(field(), "small", true, string.rep("Other source text. ", 800))
                local other = field(); other.name, other.search_within = "other", "sections"
                run.config.fields[2], run.regions.other = other, { 1 }
                run.values[2] = { name = "other", path = "other", value = "2025-01-01", missing = false, failed = false,
                    evidence = { { chunk = 1, quote = "The total amount is 1250." }, { chunk = 1, quote = "amount is 1250" } } }
                if smaller_first then
                    run.config.fields[1], run.config.fields[2] = run.config.fields[2], run.config.fields[1]
                    run.values[1], run.values[2] = run.values[2], run.values[1]
                end
                legacy_identity(run)
            end)
        end
        test.it("bounds each legacy support reason so a constrained decoder ends a run-on reason within its reply", function()
            local run = context(field(), "default", false)
            test.is_nil(stages.verify(run, { meter = ai.meter() }))
            local storage = assert(fs.get("app:uploads"))
            local request = assert(json.decode(assert(storage:readfile("completeness-requests.json"))))[1]
            local function reply(reason: string): any return { terms = { supported = true, reason = reason } } end
            test.is_true((json.validate(request.schema, reply(string.rep("a", shapes.COMMENT_CHARS)))))
            test.is_false((json.validate(request.schema, reply(string.rep("a", shapes.COMMENT_CHARS + 1)))))
        end)
        test.it("accepts an earlier configuration without a completeness policy", function()
            local config = schema().default
            test.is_true(config.stages.verify.check_completeness == nil or config.stages.verify.check_completeness == false)
            config.stages.verify.check_completeness = nil
            test.is_true(assert(json.validate(schema(), config)))
            local property = schema().properties.stages.properties.verify.properties.check_completeness
            test.not_nil(property); test.is_false(property.default)
        end)
    end)
end) }
