-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Regression guards for model-context admission.  The fixture records exactly
-- what crossed the provider boundary, which keeps the assertion independent
-- of any stage's intermediate representation.
local test = require("test")
local json = require("json")
local fs = require("fs")
local registry = require("registry")
local data = require("data")
local canonical_json = require("canonical_json")
local baseline = require("baseline")
local funcs = require("funcs")
local uuid = require("uuid")
local store = require("store")
local ai = require("ai")
local shapes = require("shapes")
local stages = require("stages")
local runner = require("runner")

local MODEL = "class:docscout-context-budget"
local GENERATED_MODEL = "class:docscout-context-generated"
local EMBED_MODEL = "class:docscout-context-embed"

local function schema(): any
    return assert(json.decode(assert(registry.get("kickside.docscout:config_schema")).data.schema_json))
end

local function field(name: string): any
    local f = assert(json.decode(assert(json.encode(schema().properties.fields.items.default))))
    f.name, f.type, f.description = name, "number", "Total amount"
    return f
end

local function write_capture(name: string)
    local storage = assert(fs.get("app:uploads"))
    local _, err = storage:writefile(name, "[]")
    test.is_nil(err, tostring(err))
end

local function requests(name: string): { any }
    return assert(json.decode(assert((assert(fs.get("app:uploads"))):readfile(name))))
end

-- The admission estimate deliberately includes the message representation,
-- schema and tools.  Provider-only routing fields are not prompt content.
local function estimate(request: any): integer
    return math.ceil(#assert(json.encode({ messages = request.messages, schema = request.schema, tools = request.tools })) * 1.25 / 4)
end

local function assert_fits(captured: { any }, available: integer)
    for _, request in ipairs(captured) do
        if request.messages then
            test.is_true(estimate(request) <= available,
                "request estimate " .. estimate(request) .. " exceeds context window")
        elseif request.input then
            local input_estimate = math.ceil(#assert(json.encode({ input = request.input })) * 1.25 / 4)
            test.is_true(input_estimate <= available,
                "embedding estimate " .. input_estimate .. " exceeds context window")
        end
    end
end

local function normalize(fields: { any }): { any }
    for _, f in ipairs(fields) do
        for _, evidence in ipairs(f.evidence) do evidence.chunk_id = nil end
    end
    return fields
end

-- This is the same projection as the established origin-main identity guard.
-- The model reference stays unchanged while the test overlays just one card
-- limit, so a byte-for-byte comparison detects accidental prompt, option,
-- outcome or stored-result changes when budgeting is inactive.
local function identity_snapshot(): any
    local config_schema = assert(json.decode(assert(registry.get("kickside.docscout:config_schema")).data.schema_json))
    local cfg = config_schema.default
    cfg.fields = {}
    for _, name in ipairs({ "accepted", "rejected", "missing_reply", "provider_failure" }) do
        local f = assert(json.decode(assert(json.encode(config_schema.properties.fields.items.default))))
        f.name, f.type, f.description, f.search_hints = name, "number", "Total amount", "total amount"
        cfg.fields[#cfg.fields + 1] = f
    end
    cfg.retrieval.embedding_model, cfg.retrieval.context, cfg.retrieval.search_mode = "class:docscout-verification-identity", "none", "keyword"
    cfg.stages.map.enabled, cfg.stages.scout.enabled, cfg.stages.deep.enabled = false, false, false
    cfg.stages.extract.model, cfg.stages.extract.max_fields_per_call = "class:docscout-verification-identity", 1
    cfg.stages.verify.enabled, cfg.stages.verify.check_support, cfg.stages.verify.check_quotes = true, true, true
    cfg.stages.verify.model, cfg.stages.verify.check_completeness = "class:docscout-verification-identity", nil
    local owner = "11111111-1111-4111-8111-111111111111"
    local caller = data.caller(owner)
    local id = assert(caller:call("app:probe", { op = "create", input = { title = "Identity reader", config = cfg } })).component_id
    local upload = data.upload(owner, "application/pdf", "Original bytes", "# Invoice\nThe total amount is 1250.")
    local storage = assert(fs.get("app:uploads"))
    local _, write_err = storage:writefile("verification-requests.json", "[]")
    assert(write_err == nil, tostring(write_err))
    local result = assert(caller:call("kickside.docscout:invoke", { extractor_id = id, upload_id = upload }))
    local requests = assert(json.decode(assert(storage:readfile("verification-requests.json"))))
    local stored = assert(caller:call("app:probe", { op = "get", id = id })).runs[1]
    local calls, steps = {}, {}
    for _, step in ipairs(result.trace) do
        steps[#steps + 1] = { kind = step.kind, status = step.status, message = step.message,
            input_tokens = step.input_tokens, output_tokens = step.output_tokens }
        for _, call in ipairs(step.calls or {}) do
            call.latency_ms = nil
            calls[#calls + 1] = call
        end
    end
    local actual = { requests = requests, calls = calls, steps = steps, status = result.status, tokens = result.tokens,
        fields = normalize(result.fields), summary = result.summary, values = result.values,
        stored = { status = stored.status, tokens = stored.tokens, result = stored.result } }
    normalize(actual.stored.result.fields)
    return actual
end

local function with_card_limits(limits: any?, work: () -> any)
    if not limits then return work() end
    local overlay = assert(registry.overlay("app:context_budget_test"))
    local entry = assert(registry.get(limits.card or "app:fixture_verification_identity_model"))
    if limits.max_tokens == false then entry.data.max_tokens = nil else entry.data.max_tokens = limits.max_tokens end
    if limits.output_tokens == false then entry.data.output_tokens = nil else entry.data.output_tokens = limits.output_tokens end
    local changes = overlay:changes(); changes:update(entry); assert(changes:apply())
    local ok, result = pcall(work)
    local restore = assert(registry.overlay("app:context_budget_test")):changes()
    assert(restore:delete(entry.id)); assert(restore:apply())
    if not ok then error(result) end
    return result
end

local function saved_document(chunks: { any }, outline: { any }): string
    local owner = "owner-" .. uuid.v4()
    local component = data.extractor(owner)
    return assert(store.save({ component_id = component, owner_id = owner, upload_id = "upload-" .. uuid.v4(), checksum = "budget",
        processing_key = "budget", outline = outline, page_count = 0, tokens = 0, expires_at = "2999-01-01T00:00:00Z" }, chunks))
end

local function vector(): { number }
    local out = {}
    for n = 1, 512 do out[n] = n == 1 and 1 or 0 end
    return out
end

return { run = test.run_cases(function()
    test.describe("Context budget", function()
        for _, case in ipairs({
            { name = "fitting known limits" },
            { name = "zero context limit", limits = { max_tokens = 0, output_tokens = 4096 } },
            { name = "zero output limit", limits = { max_tokens = 16000, output_tokens = 0 } },
            { name = "absent context limit", limits = { max_tokens = false, output_tokens = 4096 } },
            { name = "absent output limit", limits = { max_tokens = 16000, output_tokens = false } },
        }) do
            test.it("matches the origin-main requests, outcomes and stored result with " .. case.name, function()
                local actual = with_card_limits(case.limits, identity_snapshot)
                test.eq(assert(canonical_json.encode(actual)), assert(canonical_json.encode(baseline.get()["true"])))
            end)
        end

        test.it("counts rejection causes without informational partial or section codes", function()
            local summary = runner.summary({
                { missing = false, verified = false, reason = "A quote is not in the document",
                    codes = { "context_budget_partial", "quote_not_found", "quote_not_found", "missing_in_sections" } },
                { missing = false, verified = true, codes = { "context_budget_partial" } },
                { missing = false, failed = true, verified = false, reason = "Cannot extract",
                    codes = { "context_budget_partial" } },
            })
            test.eq(summary.unverified.quote_not_found, 1)
            test.eq(summary.unverified.extraction_failed, 1)
            test.is_nil(summary.unverified.context_budget_partial)
            test.is_nil(summary.unverified.missing_in_sections)
            test.is_nil(summary.unverified.unchecked)
            test.eq(summary.verified, 1)
        end)

        test.it("treats either absent model limit as unknown and preserves direct request bodies", function()
            local reply_schema = { type = "object", additionalProperties = false, required = { "answer" },
                properties = { answer = { type = "string" } } }
            local system, user = "Identity system", "Identity user"
            for _, fixture in ipairs({
                { model = "class:docscout-context-unknown-window", capture = "context-unknown-window.json" },
                { model = "class:docscout-context-unknown-output", capture = "context-unknown-output.json" },
            }) do
                write_capture(fixture.capture)
                local fits, reserved = assert(ai.fitter(fixture.model, 128))
                local accepted, estimated, available = fits(system, string.rep(user, 400), reply_schema)
                test.is_true(accepted); test.not_nil(estimated); test.is_nil(available); test.is_nil(reserved)
                local result, err = ai.structured(ai.meter(), fixture.model, reply_schema, system, user, { max_tokens = 128 })
                test.is_nil(err, tostring(err)); test.eq(result.answer, "Fixture")
                local request = requests(fixture.capture)[1]
                test.eq(request.messages[1].content[1].text, system)
                test.eq(request.messages[2].content[1].text, user)
                test.eq(request.options.max_tokens, 128)
            end
        end)

        test.it("refuses a known oversized request before it reaches the provider", function()
            local capture = "context-extract-requests.json"
            write_capture(capture)
            local _, err = ai.structured(ai.meter(), MODEL, { type = "object", additionalProperties = false,
                    required = { "answer" }, properties = { answer = { type = "string" } } },
                "Budget test", string.rep("oversized input ", 2000), { max_tokens = 256 })
            test.not_nil(err); test.is_true(errors.is(err, errors.INVALID), tostring(err))
            test.is_false(err:retryable())
            test.eq(err:details().code, "context_budget_exceeded")
            test.not_nil(err:details().estimated_tokens); test.not_nil(err:details().available_tokens)
            test.eq(#requests(capture), 0)
        end)

        test.it("batches embeddings by text and refuses an unfit singleton before sending it", function()
            local capture = "context-embed-requests.json"
            write_capture(capture)
            local texts = { string.rep("Embedding source one. ", 110), string.rep("Embedding source two. ", 110),
                string.rep("Embedding source three. ", 110) }
            local vectors, err = ai.embed(ai.meter(), EMBED_MODEL, texts)
            test.is_nil(err, tostring(err)); test.eq(#vectors, #texts)
            local captured = requests(capture)
            test.is_true(#captured > 1)
            assert_fits(captured, 2144)
            write_capture(capture)
            local _, oversized = ai.embed(ai.meter(), EMBED_MODEL, { string.rep("Oversized embedding source. ", 1000) })
            test.not_nil(oversized); test.is_false(oversized:retryable())
            test.eq(oversized:details().code, "context_budget_exceeded")
            test.eq(#requests(capture), 0)
        end)

        test.it("skips an oversized earlier passage and marks the usable result as partial context", function()
            local capture = "context-extract-requests.json"
            write_capture(capture)
            local pool = shapes.pool()
            shapes.add(pool, {
                { ordinal = 1, heading_path = "Background", content = string.rep("Unrelated background. ", 1200) },
                { ordinal = 2, heading_path = "Invoice", content = "The total amount is 1250." },
            })
            local run = { pool = pool, regions = {}, notes = {}, analyses = {}, values = {}, config = {
                fields = { field("total") }, stages = {
                    extract = { model = MODEL, max_fields_per_call = 4, max_output_tokens = 256 },
                    verify = { check_quotes = false, check_support = false },
                },
            } }
            local step = { meter = ai.meter() }
            test.is_nil(stages.extract(run, step))
            test.eq(run.values[1].value, 1250)
            test.is_false(run.values[1].missing); test.is_false(run.values[1].failed)
            test.eq(json.encode(run.values[1].codes), '["context_budget_partial"]')
            test.is_nil(run.values[1].reason)
            test.is_nil(stages.verify(run, { meter = ai.meter() }))
            test.is_true(run.values[1].verified)
            test.eq(json.encode(run.values[1].codes), '["context_budget_partial"]')
            local captured = requests(capture)
            test.eq(#captured, 1)
            local encoded = assert(json.encode(captured[1].messages))
            test.is_nil(encoded:find("Unrelated background.", 1, true))
            test.not_nil(encoded:find("The total amount is 1250.", 1, true))
            assert_fits(captured, 2144)
        end)

        test.it("returns a non-retryable typed error when no required passage fits", function()
            local capture = "context-extract-empty.json"
            write_capture(capture)
            local pool = shapes.pool()
            shapes.add(pool, { { ordinal = 1, heading_path = "Background", content = string.rep("Too large. ", 2000) } })
            local run = { pool = pool, regions = {}, notes = {}, analyses = {}, values = {}, config = {
                fields = { field("total") }, stages = { extract = { model = MODEL, max_fields_per_call = 4, max_output_tokens = 256 } },
            } }
            local err = stages.extract(run, { meter = ai.meter() })
            test.not_nil(err); test.is_false(err:retryable()); test.eq(err:details().code, "context_budget_exceeded")
            test.not_nil(err:details().estimated_tokens); test.not_nil(err:details().available_tokens)
            test.eq(#requests(capture), 0)
            local value = run.values[1]
            test.is_true(value.failed); test.is_false(value.missing)
            test.eq(value.error.details.code, "context_budget_exceeded")
        end)

        test.it("keeps a successful field while recording a typed budget failure for another field", function()
            local capture = "context-extract-requests.json"
            write_capture(capture)
            local pool = shapes.pool()
            shapes.add(pool, {
                { ordinal = 1, heading_path = "Background", content = string.rep("Too large. ", 2000) },
                { ordinal = 2, heading_path = "Invoice", content = "The total amount is 1250." },
            })
            local oversized, usable = field("oversized"), field("total")
            oversized.search_within, usable.search_within = "sections", "sections"
            local run = { pool = pool, regions = { oversized = { 1 }, total = { 2 } }, notes = {}, analyses = {}, values = {}, config = {
                fields = { oversized, usable }, stages = { extract = { model = MODEL, max_fields_per_call = 4, max_output_tokens = 256 } },
            } }
            test.is_nil(stages.extract(run, { meter = ai.meter() }))
            test.eq(#run.values, 2)
            test.is_true(run.values[1].failed); test.is_false(run.values[1].missing)
            test.eq(run.values[1].error.details.code, "context_budget_exceeded")
            test.is_false(run.values[2].failed); test.eq(run.values[2].value, 1250)
            test.eq(#requests(capture), 1)
        end)

        test.it("batches section selection by fields and keeps every submitted map request within budget", function()
            local capture = "context-extract-requests.json"
            write_capture(capture)
            local fields = {}
            for n = 1, 12 do
                local f = field("section_" .. n)
                f.search_within = "sections"
                f.description = string.rep("Section selection requirement. ", 25)
                fields[#fields + 1] = f
            end
            local run = { regions = {}, document = { outline = {
                { id = "s1", level = 1, title = "Payment", path = "Payment", chunk_start = 1, chunk_end = 1 },
                { id = "s2", level = 1, title = "Terms", path = "Terms", chunk_start = 2, chunk_end = 2 },
                { id = "s3", level = 1, title = "Schedule", path = "Schedule", chunk_start = 3, chunk_end = 3 },
            } }, config = { fields = fields, stages = { map = {
                model = MODEL, outline = "find_or_build", section_summaries = false, max_tokens = 256,
            } } } }
            test.is_nil(stages.map(run, { meter = ai.meter() }))
            for _, f in ipairs(fields) do test.not_nil(run.regions[f.name], f.name) end
            local captured = requests(capture)
            test.is_true(#captured > 1, "section fields are batched when one request does not fit")
            assert_fits(captured, 2144)
        end)

        test.it("omits an oversized scout passage while retaining a later usable one", function()
            local capture = "context-extract-requests.json"
            write_capture(capture)
            local pool = shapes.pool()
            shapes.add(pool, {
                { ordinal = 1, heading_path = "Background", content = string.rep("Unrelated scout background. ", 1200) },
                { ordinal = 2, heading_path = "Invoice", content = "The total amount is 1250." },
            })
            local f = field("total")
            local run = { document = { outline = {} }, regions = {}, notes = {}, pool = pool, confidence = 0, config = {
                fields = { f }, retrieval = { search_mode = "keyword" }, stages = {
                    deep = { enabled = false }, scout = { model = MODEL, mode = "loop", max_rounds = 0, max_extra_queries = 1,
                        target_confidence = 1, max_tokens = 256, drop_noise = false, share_notes = false, tools = {} },
                },
            } }
            test.is_nil(stages.scout(run, { meter = ai.meter() }))
            local captured = requests(capture)
            test.eq(#captured, 1)
            local body = assert(json.encode(captured[1].messages))
            test.is_nil(body:find("Unrelated scout background.", 1, true))
            test.not_nil(body:find("The total amount is 1250.", 1, true))
            assert_fits(captured, 2144)
        end)

        test.it("batches highlights only from passages that fit their request", function()
            local capture = "context-extract-requests.json"
            write_capture(capture)
            local pool = shapes.pool()
            shapes.add(pool, {
                { ordinal = 1, heading_path = "Background", content = string.rep("Unrelated highlight background. ", 1200) },
                { ordinal = 2, heading_path = "Invoice", content = "The total amount is 1250." },
            })
            local run = { pool = pool, regions = {}, notes = {}, config = {
                fields = { field("total") }, stages = { extract = { model = MODEL, max_fields_per_call = 4, max_output_tokens = 256 } },
                retrieval = { highlighter_model = MODEL, highlighter_temperature = 0, highlighter_max_tokens = 256 },
            } }
            test.is_nil(stages.highlight(run, { meter = ai.meter() }))
            local captured = requests(capture)
            test.eq(#captured, 1)
            local body = assert(json.encode(captured[1].messages))
            test.is_nil(body:find("Unrelated highlight background.", 1, true))
            test.not_nil(body:find("The total amount is 1250.", 1, true))
            assert_fits(captured, 2144)
        end)

        test.it("batches section summaries by section without sending an oversized request", function()
            local capture = "context-extract-requests.json"
            write_capture(capture)
            local outline, chunks = {}, {}
            for n = 1, 6 do
                outline[n] = { id = "s" .. n, level = 1, title = "Section " .. n, path = "Section " .. n, chunk_start = n, chunk_end = n }
                chunks[n] = { ordinal = n, section_id = "s" .. n, heading_path = "Section " .. n,
                    content = string.rep("Summary source " .. n .. ". ", 160), vector = vector() }
            end
            local id = saved_document(chunks, outline)
            local run = { document = { id = id, outline = outline }, regions = {}, config = { fields = { field("total") }, stages = { map = {
                model = MODEL, outline = "find_or_build", section_summaries = true, max_tokens = 256,
            } } } }
            test.is_nil(stages.map(run, { meter = ai.meter() }))
            for _, section in ipairs(run.document.outline) do test.eq(section.summary, "Fixture") end
            local captured = requests(capture)
            test.is_true(#captured > 1)
            assert_fits(captured, 2144)
        end)

        test.it("batches outline previews by chunks without sending an oversized request", function()
            local capture = "context-extract-requests.json"
            write_capture(capture)
            local chunks = {}
            for n = 1, 100 do
                chunks[n] = { ordinal = n, section_id = "s" .. n, heading_path = "Section " .. n,
                    content = string.rep("Outline source " .. n .. ". ", 30), vector = vector() }
            end
            local id = saved_document(chunks, {})
            local run = { document = { id = id, outline = {} }, regions = {}, config = { fields = { field("total") }, stages = { map = {
                model = MODEL, outline = "build", section_summaries = false, max_tokens = 256,
            } } } }
            test.is_nil(stages.map(run, { meter = ai.meter() }))
            test.is_true(#run.document.outline > 0)
            local captured = requests(capture)
            test.is_true(#captured > 1)
            assert_fits(captured, 2144)
        end)

        for _, partial in ipairs({ true, false }) do
            test.it(partial and "rebuilds a partial outline instead of caching incomplete context" or "reuses a complete outline", function()
                with_card_limits({ card = "app:fixture_context_budget_model", max_tokens = 600, output_tokens = 256 }, function()
                    local capture = "context-extract-requests.json"
                    write_capture(capture)
                    local chunks = {
                        { ordinal = 1, section_id = "s1", content = partial and string.rep(string.char(1), 160) or "The total amount is 1250.",
                            vector = vector(), heading_path = "Invoice" },
                        { ordinal = 2, section_id = "s2", content = "Payment terms.", vector = vector(), heading_path = "Terms" },
                    }
                    local id = saved_document(chunks, {})
                    local function mapped(): any
                        local run = { document = { id = id, outline = {} }, regions = {}, config = {
                            fields = { field("total") }, stages = { map = { model = MODEL, outline = "find_or_build",
                                section_summaries = false, max_tokens = 256 } } } }
                        local step = { meter = ai.meter() }
                        test.is_nil(stages.map(run, step))
                        return { run = run, step = step }
                    end
                    local first = mapped()
                    test.eq(first.run.budget_dropped and first.run.budget_dropped.total or false, partial)
                    local before = #requests(capture)
                    test.is_true(before > 0)
                    local second = mapped()
                    test.eq(second.run.budget_dropped and second.run.budget_dropped.total or false, partial)
                    test.eq(#requests(capture), partial and before * 2 or before)
                    test.contains(second.step.message, partial and "Built an outline" or "Reused the outline")
                end)
            end)
        end

        test.it("rejects an unfit generated-context passage before sending it", function()
            local capture = "context-generated-requests.json"
            write_capture(capture)
            local owner = "owner-" .. uuid.v4()
            local component = data.extractor(owner)
            local retrieval = schema().default.retrieval
            retrieval.context, retrieval.context_model, retrieval.embedding_model = "generated", GENERATED_MODEL, "class:docscout-success"
            retrieval.chunk_size, retrieval.overlap, retrieval.split_headings = 16000, 0, true
            -- Heading paths are fixed prompt framing for generated context.
            -- A tiny body keeps the splitter from masking this singleton.
            local markdown = "# " .. string.rep("Background ", 1000) .. "\nSmall content"
            local upload = data.upload(owner, "application/pdf", "Original bytes", markdown)
            local _, err = data.caller(owner):call("app:probe", { op = "processed", id = component, upload_id = upload, retrieval = retrieval })
            test.not_nil(err); test.is_false(err:retryable()); test.eq(err:details().code, "context_budget_exceeded")
            test.eq(#requests(capture), 0)
        end)

        test.it("batches generated contexts by passages without sending an oversized request", function()
            local capture = "context-generated-requests.json"
            write_capture(capture)
            local owner = "owner-" .. uuid.v4()
            local component = data.extractor(owner)
            local retrieval = schema().default.retrieval
            retrieval.context, retrieval.context_model, retrieval.embedding_model = "generated", GENERATED_MODEL, "class:docscout-success"
            retrieval.chunk_size, retrieval.overlap, retrieval.split_headings = 16000, 0, true
            local sections = {}
            for n = 1, 6 do sections[#sections + 1] = "# Section " .. n .. "\n" .. string.rep("Generated context source. ", 60) end
            local upload = data.upload(owner, "application/pdf", "Original bytes", table.concat(sections, "\n\n"))
            local result, err = data.caller(owner):call("app:probe", { op = "processed", id = component, upload_id = upload, retrieval = retrieval })
            test.is_nil(err, tostring(err)); test.not_nil(result.document)
            local captured = requests(capture)
            test.is_true(#captured > 1)
            assert_fits(captured, 2144)
        end)

        test.it("batches support checks by values without sending an oversized request", function()
            local capture = "context-extract-requests.json"
            write_capture(capture)
            local fields, values = {}, {}
            for n = 1, 8 do
                local f = field("support_" .. n)
                f.evidence_required = false
                fields[n] = f
                values[n] = { name = f.name, path = f.name, value = n, missing = false, failed = false,
                    evidence = { { quote = string.rep("Support source " .. n .. ". ", 80), chunk = n } } }
            end
            local run = { regions = {}, config = { fields = fields, stages = { verify = {
                model = MODEL, check_quotes = false, check_support = true, max_tokens = 256,
            } } }, values = values }
            test.is_nil(stages.verify(run, { meter = ai.meter() }))
            local captured = requests(capture)
            test.is_true(#captured > 1)
            assert_fits(captured, 2144)
        end)

        for _, failure in ipairs({ "oversized", "provider_failure" }) do
            test.it("keeps successful support verdicts when another batch is " .. failure, function()
                local capture = "context-extract-requests.json"
                write_capture(capture)
                local fields, values = {}, {}
                for n, name in ipairs({ "rejected", failure }) do
                    fields[n] = field(name)
                    fields[n].evidence_required = false
                    values[n] = { name = name, path = name, value = n, missing = false, failed = false,
                        evidence = { { quote = string.rep("Support source. ", failure == "oversized" and n == 2 and 2000 or 220), chunk = n } } }
                end
                local run = { regions = {}, config = { fields = fields, stages = { verify = {
                    model = MODEL, check_quotes = false, check_support = true, max_tokens = 256,
                } } }, values = values }
                local err = stages.verify(run, { meter = ai.meter() })
                test.not_nil(err)
                if failure == "oversized" then test.eq(err:details().code, "context_budget_exceeded") end
                test.eq(json.encode(values[1].codes), '["support_rejected"]')
                test.eq(json.encode(values[2].codes), '["support_no_verdict"]')
                local captured = requests(capture)
                test.eq(#captured, failure == "oversized" and 1 or 2)
                assert_fits(captured, 2144)
            end)
        end

        test.it("keeps a later deep-analysis passage after an oversized earlier match", function()
            local capture = "context-extract-requests.json"
            write_capture(capture)
            local chunks = {
                { ordinal = 1, section_id = "s1", heading_path = "Background", content = string.rep("total background. ", 1300), vector = vector() },
                { ordinal = 2, section_id = "s2", heading_path = "Invoice", content = "The total amount is 1250.", vector = vector() },
            }
            local id = saved_document(chunks, {
                { id = "s1", level = 1, title = "Background", path = "Background", chunk_start = 1, chunk_end = 1 },
                { id = "s2", level = 1, title = "Invoice", path = "Invoice", chunk_start = 2, chunk_end = 2 },
            })
            local f = field("total")
            f.strategy = "deep"
            local run = { document = { id = id, outline = {} }, regions = {}, notes = {}, analyses = {}, pool = shapes.pool(), config = {
                fields = { f }, retrieval = { search_mode = "keyword", section_budget = 6000 }, stages = { deep = {
                    model = MODEL, query_model = MODEL, read = "chunks", parallel_fields = 1, max_queries = 1,
                    chunks_per_query = 5, chunk_cap = 5, min_similarity = 0, max_tokens = 256,
                } },
            } }
            test.is_nil(stages.deep(run, { meter = ai.meter() }))
            test.not_nil(run.analyses.total)
            local captured = requests(capture)
            test.eq(#captured, 1)
            local body = assert(json.encode(captured[1].messages))
            test.is_nil(body:find("total background.", 1, true))
            test.not_nil(body:find("The total amount is 1250.", 1, true))
            assert_fits(captured, 2144)
        end)

        test.it("bounds each built-in scout turn after an oversized tool result", function()
            local capture = "context-extract-requests.json"
            write_capture(capture)
            local chunks = {
                { ordinal = 1, section_id = "s1", heading_path = "Background", content = string.rep("total amount background. ", 1300), vector = vector() },
                { ordinal = 2, section_id = "s2", heading_path = "Invoice", content = "The total amount is 1250.", vector = vector() },
            }
            local id = saved_document(chunks, {
                { id = "s1", level = 1, title = "Background", path = "Background", chunk_start = 1, chunk_end = 1 },
                { id = "s2", level = 1, title = "Invoice", path = "Invoice", chunk_start = 2, chunk_end = 2 },
            })
            local f = field("total")
            local run = { document = { id = id, outline = {}, embedding_model = "class:docscout-success" }, regions = {}, notes = {}, pool = shapes.pool(), confidence = 0,
                config = { fields = { f }, retrieval = { search_mode = "keyword" }, stages = { deep = { enabled = false }, scout = {
                    model = MODEL, mode = "agent", max_rounds = 1, max_extra_queries = 1, target_confidence = 1,
                    max_tokens = 256, drop_noise = false, share_notes = false, tools = { "keyword_search" },
                } } } }
            test.is_nil(stages.scout(run, { meter = ai.meter() }))
            local captured = requests(capture)
            test.eq(#captured, 2)
            assert_fits(captured, 2144)
            local follow_up = assert(json.encode(captured[2].messages))
            test.is_nil(follow_up:find("total amount background.", 1, true))
            test.not_nil(follow_up:find("The total amount is 1250.", 1, true))
        end)

        test.it("normalizes a provider context-window rejection without changing output truncation", function()
            local overlay = assert(registry.overlay("app:context_budget_test"))
            local entry = assert(registry.get("kickside.docscout.engine:ai"))
            entry.data.imports.llm = "app:fixture_context_length"
            local changes = overlay:changes(); changes:update(entry); assert(changes:apply())
            local ok, failure = pcall(function()
                local _, mapped = funcs.call("app:context_budget_length_probe", {})
                test.not_nil(mapped); test.eq(mapped:details().code, "context_budget_exceeded")
                test.is_false(mapped:retryable()); test.eq(mapped:details().estimated_tokens, 912)
                local _, embedded = funcs.call("app:context_budget_length_probe", { embed = true })
                test.not_nil(embedded); test.eq(embedded:details().code, "context_budget_exceeded")
            end)
            local restore = assert(registry.overlay("app:context_budget_test")):changes()
            restore:delete(entry.id); assert(restore:apply())
            if not ok then error(failure) end
            local length = errors.new({ kind = errors.UNAVAILABLE, retryable = true, message = "reply cut",
                details = { finish_reason = "length" } })
            test.is_nil(ai.context_error(MODEL, length))
        end)
    end)
end) }
