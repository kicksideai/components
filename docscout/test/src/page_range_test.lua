-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local data = require("data")
local process = require("process")
local store = require("store")
local stages = require("stages")
local shapes = require("shapes")
local doctools = require("doctools")
local ai = require("ai")
local json = require("json")
local registry = require("registry")
local uuid = require("uuid")

local MARKDOWN = "<!-- page 1 -->\n# Excluded heading\nExcluded before\n<!-- page 2 -->\n# Selected\nThe total amount is 1250.\n<!-- page 3 -->\n# Excluded ending\nExcluded after"
local MODEL = "class:docscout-range"
local function configuration(): any
    local schema = assert(json.decode(assert(registry.get("kickside.docscout:config_schema")).data.schema_json))
    local cfg, f = schema.default, schema.properties.fields.items.default
    f.name, f.type, f.description, f.search_hints = "total", "number", "Total amount", "total amount"
    cfg.fields = { f }
    cfg.retrieval.context, cfg.retrieval.embedding_model, cfg.retrieval.search_mode = "none", MODEL, "keyword"
    cfg.stages.map.model, cfg.stages.scout.model, cfg.stages.deep.model, cfg.stages.deep.query_model = MODEL, MODEL, MODEL, MODEL
    cfg.stages.extract.model, cfg.stages.verify.model = MODEL, MODEL
    cfg.stages.scout.max_rounds, cfg.stages.scout.mode = 1, "loop"
    cfg.stages.prefetch.queries = { { name = "Total", query = "total amount", chunks = 5 } }
    return cfg
end
local function document(): (any, any)
    local cfg = configuration()
    local doc = assert(process.chunk(MARKDOWN, cfg.retrieval, { first = 2, last = 2 }))
    for _, chunk in ipairs(doc.chunks) do
        chunk.vector = {};for i = 1, 512 do chunk.vector[i] = i == 1 and 1 or 0 end
    end
    local owner = uuid.v4()
    local component_id = data.extractor(owner)
    local id = assert(store.save({ component_id = component_id, owner_id = owner, upload_id = "fixture", checksum = "c", processing_key = "k",
        outline = doc.outline, page_count = doc.page_count, tokens = 0, expires_at = "2999-01-01T00:00:00Z" }, doc.chunks))
    doc.id, doc.embedding_model, doc.owner_id, doc.component_id = id, MODEL, owner, component_id
    return doc, cfg
end
local function run_for(): any
    local doc, cfg = document()
    return { document = doc, config = cfg, pool = shapes.pool(), regions = {}, notes = {}, analyses = {}, values = {}, confidence = 0 }
end
local function in_range(chunks: any)
    test.is_true(#chunks > 0)
    for _, c in ipairs(chunks) do
        test.eq(c.page_start, 2);test.eq(c.page_end, 2)
        test.is_nil(c.content:find("Excluded", 1, true));test.is_nil(c.heading_path:find("Excluded", 1, true))
    end
end
return { run = test.run_cases(function()
    test.describe("Page range stage isolation", function()
        test.it("marks absence only within selected sections of the searched pages", function()
            local cfg = configuration()
            cfg.fields[1].name, cfg.fields[1].search_within = "missing_reply", "sections"
            cfg.stages.extract.model = "class:docscout-success"
            local markdown = "<!-- page 1 -->\n# Invoice\nPayment terms apply.\n<!-- page 2 -->\nThe total amount is 1250."
            local full = assert(process.chunk(markdown, cfg.retrieval))
            test.eq(full.outline[1].page_start, 1); test.eq(full.outline[1].page_end, 2)
            local selected = assert(process.chunk(markdown, cfg.retrieval, { first = 1, last = 1 }))
            local pool = shapes.pool()
            shapes.add(pool, selected.chunks)
            for _, chunk in ipairs(selected.chunks) do
                test.eq(chunk.page_start, 1); test.eq(chunk.page_end, 1)
                test.is_nil(chunk.content:find("1250", 1, true))
            end
            local run = { config = cfg, document = selected, pool = pool, regions = { missing_reply = shapes.ordinals_of(selected.outline, { selected.outline[1].id }) },
                notes = {}, analyses = {}, values = {} }
            test.is_nil(stages.extract(run, { meter = ai.meter() }))
            test.eq(#run.values, 1); test.is_true(run.values[1].missing)
            test.eq(json.encode(run.values[1].codes), '["missing_in_sections"]')
            test.is_nil(run.values[1].reason)
        end)
        test.it("clips generated context and embeddings and isolates reusable processed copies by range", function()
            local owner, cfg = uuid.v4(), configuration()
            local component_id = data.extractor(owner)
            local upload_id = data.upload(owner, "application/pdf", "Original bytes", MARKDOWN)
            cfg.retrieval.context, cfg.retrieval.context_model = "generated", MODEL
            local caller = data.caller(owner)
            local request = { op = "processed", id = component_id, upload_id = upload_id, retrieval = cfg.retrieval, pages = { first = 2, last = 2 } }
            local selected = assert(caller:call("app:probe", request))
            in_range(assert(store.all_chunks(selected.document.id)))
            local reused = assert(caller:call("app:probe", request))
            test.eq(selected.document.id, reused.document.id);test.eq(reused.step.meter.input_tokens, 0)
            request.pages = nil
            request.retrieval.context, request.retrieval.embedding_model = "none", "class:docscout-success"
            local full = assert(caller:call("app:probe", request))
            request.pages = { first = 2, last = 2 }
            local ranged = assert(caller:call("app:probe", request))
            test.is_true(full.document.id ~= ranged.document.id)
            test.is_true(#assert(store.all_chunks(full.document.id)) > #assert(store.all_chunks(ranged.document.id)))
            in_range(assert(store.all_chunks(ranged.document.id)))
            cfg.fields = {}
            cfg.stages.map.temperature = 0
            cfg.stages.map.model, cfg.stages.map.outline, cfg.stages.map.section_summaries = "class:docscout-sampling", "build", false
            local full_run = { document = full.document, config = cfg, regions = {} }
            local full_step = { meter = ai.meter() }
            test.is_nil(stages.map(full_run, full_step));test.is_true(full_step.meter.input_tokens > 0, full_step.message)
            cfg.stages.map.outline = "find_or_build"
            local selected_run = { document = ranged.document, config = cfg, regions = {} }
            local selected_step = { meter = ai.meter() }
            test.is_nil(stages.map(selected_run, selected_step));test.is_true(selected_step.meter.input_tokens > 0, selected_step.message)
            test.eq(selected_run.document.outline[1].page_start, 2);test.eq(selected_run.document.outline[1].page_end, 2)
            local reused_step = { meter = ai.meter() }
            test.is_nil(stages.map(selected_run, reused_step));test.eq(reused_step.meter.input_tokens, 0)
        end)
        test.it("limits keyword, semantic, hybrid, section and native-agent document tools", function()
            local run = run_for()
            for _, mode in ipairs({ "keyword", "semantic", "hybrid" }) do
                local ctx = { document = run.document, meter = ai.meter() }
                in_range(assert(doctools.search(ctx, mode, "total amount", 20)))
                if mode == "keyword" then test.eq(#assert(doctools.search(ctx, mode, "Excluded", 20)), 0) end
            end
            in_range(assert(doctools.section(run, run.document.outline[1].id)))
            local result = assert(data.caller(run.document.owner_id):with_context({ docscout = {
                component_id = run.document.component_id, document_id = run.document.id, outline = run.document.outline,
                embedding_model = MODEL, tool = "keyword_search" } }):call("kickside.docscout.engine:document_tool", { query = "total", limit = 20 }))
            in_range(result.chunks)

            local _, listing = doctools.call(run, "read_outline", { detail = "titles" })
            test.is_nil(listing:find("Excluded", 1, true));test.is_true(listing:find("p.2", 1, true) ~= nil)
            for _, name in ipairs({ "keyword_search", "semantic_search" }) do
                local hits, text, err = doctools.call({ document = run.document, meter = ai.meter() }, name, { query = "total", limit = 20 })
                test.is_nil(err);in_range(hits);test.is_nil(text:find("Excluded", 1, true))
            end
        end)
        test.it("limits map building, summaries and section choices", function()
            local run = run_for()
            run.config.fields[1].search_within = "sections"
            run.config.stages.map.outline, run.config.stages.map.section_summaries = "build", true
            test.is_nil(stages.map(run, { meter = ai.meter() }))
            test.eq(run.document.outline[1].page_start, 2);test.eq(run.document.outline[1].page_end, 2)
            test.eq(#run.regions.total, 1)
        end)
        test.it("limits prefetch and both scout modes at page boundaries", function()
            for _, mode in ipairs({ "loop", "agent" }) do
                local run = run_for()
                run.config.stages.deep.enabled = false
                test.is_nil(stages.prefetch(run, { meter = ai.meter() }))
                in_range(shapes.ordered(run.pool))
                run.config.stages.scout.mode = mode
                test.is_nil(stages.scout(run, { meter = ai.meter() }))
                in_range(shapes.ordered(run.pool))
            end
        end)
        test.it("limits deep reading by chunks and sections", function()
            for _, read in ipairs({ "chunks", "sections" }) do
                local run = run_for()
                run.config.fields[1].strategy = "deep"
                run.config.stages.deep.read = read
                test.is_nil(stages.deep(run, { meter = ai.meter() }))
                in_range(shapes.ordered(run.pool))
            end
        end)
        test.it("highlights only selected passages and preserves their real-page evidence", function()
            local run = run_for()
            run.config.retrieval.highlighter_model = "class:docscout-range-highlight"
            test.is_nil(stages.prefetch(run, { meter = ai.meter() }))
            local step = { meter = ai.meter() }
            test.is_nil(stages.highlight(run, step))
            local highlighted = shapes.ordered(run.pool)
            in_range(highlighted);test.eq(#highlighted, 1)
            test.eq(highlighted[1].content, "The total amount is 1250.")
            test.eq(step.message, "Kept 1 of 1 passages")
            test.eq(#step.meter.calls, 1);test.eq(step.meter.calls[1].stage, "highlight")
            test.eq(json.encode(step.meter.calls[1].sources), "[1]")
            run.config.stages.extract.model = "class:docscout-success"
            test.is_nil(stages.extract(run, { meter = ai.meter() }))
            run.config.stages.verify.check_support = false
            test.is_nil(stages.verify(run, { meter = ai.meter() }))
            test.eq(run.values[1].value, 1250);test.is_true(run.values[1].verified)
            test.eq(run.values[1].evidence[1].quote, "The total amount is 1250.")
            test.eq(run.values[1].evidence[1].page, 2)
        end)
        test.it("limits extraction and rejects quotes that exist only outside the range", function()
            local run = run_for()
            test.is_nil(stages.prefetch(run, { meter = ai.meter() }))
            test.is_nil(stages.extract(run, { meter = ai.meter() }))
            run.config.stages.verify.check_support = false
            run.values = { { name = "total", path = "total", value = 1250, missing = false, failed = false, evidence = {
                { quote = "The total amount is 1250.", chunk = 1 }, { quote = "Excluded before", chunk = 1 } } } }
            test.is_nil(stages.verify(run, { meter = ai.meter() }))
            test.is_true(run.values[1].evidence[1].found);test.eq(run.values[1].evidence[1].page, 2)
            test.is_false(run.values[1].evidence[2].found)
            run.values[1].evidence = { run.values[1].evidence[1] }
            run.config.stages.verify.check_support = true
            test.is_nil(stages.verify(run, { meter = ai.meter() }))
        end)
    end)
end) }
