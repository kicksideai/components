-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local data = require("data")
local json = require("json")
local uuid = require("uuid")
local process = require("process")
local store = require("store")
local stages = require("stages")
local sql = require("sql")
local funcs = require("funcs")
local shapes = require("shapes")
local ai = require("ai")
local time = require("time")
local registry = require("registry")
local security = require("security")

local MARKDOWN = table.concat({
    "<!-- page 1 -->", "", "Preamble before any heading.", "",
    "# Agreement", "", "Parties agree as follows.", "",
    "## Payment", "", "The total amount due is USD 1,250.00, payable within 30 days.", "",
    "<!-- page 2 -->", "", "| Item | Amount |", "| --- | --- |", "| Fee | 1,000 |", "| Tax | 250 |", "",
    "```", "# not a heading inside code", "```", "",
    "## Termination", "", "Either party may terminate with notice.",
}, "\n")

local function retrieval(over: any?): any
    local r = { chunk_size = 1200, overlap = 150, split_headings = true, keep_tables = true, search_mode = "hybrid",
        embedding_model = "class:embed", context = "headings", context_model = "class:fast", section_budget = 6000 }
    for k, v in pairs(over or {}) do r[k] = v end
    return r
end

local function unit(index: integer): { number }
    local v = {}
    for i = 1, 512 do v[i] = (i == index) and 1.0 or 0.0 end
    return v
end

local function far_future(): string return "2999-01-01T00:00:00Z" end

local components: { [string]: string } = {}
local function component_for(owner: string): string
    if components[owner] then return components[owner] end
    local id = data.extractor(owner)
    components[owner] = id
    return id
end
local function save(doc: any, chunks: { any }): (any?, error?)
    doc.component_id = doc.component_id or component_for(doc.owner_id)
    return store.save(doc, chunks)
end

return { run = test.run_cases(function()
    test.describe("Document processing", function()
        test.it("clips boundary chunks and outline to inclusive real pages before indexing", function()
            local markdown = "<!-- page 1 -->\n# Outside\nExcluded first\n<!-- page 2 -->\n# Selected\nIncluded second\n<!-- page 3 -->\nIncluded third\n<!-- page 4 -->\n# Outside end\nExcluded fourth"
            for _, headings in ipairs({ true, false }) do
                local doc = assert(process.chunk(markdown, retrieval({ split_headings = headings }), { first = 2, last = 3 }))
                test.eq(doc.page_count, 4)
                local body = {}
                for _, c in ipairs(doc.chunks) do
                    test.is_true(c.page_start >= 2); test.is_true(c.page_end <= 3)
                    test.eq(c.ordinal, #body + 1)
                    body[#body + 1] = c.content
                    for _, span in ipairs(c.page_spans) do test.is_true(span.page >= 2 and span.page <= 3) end
                end
                local joined = table.concat(body, "\n")
                test.is_nil(joined:find("Excluded", 1, true))
                test.is_true(joined:find("Included second", 1, true) ~= nil)
                test.is_true(joined:find("Included third", 1, true) ~= nil)
                for _, section in ipairs(doc.outline) do
                    test.is_true(section.page_start >= 2); test.is_true(section.page_end <= 3)
                    test.is_nil(section.title:find("Outside", 1, true))
                end
            end
            local single = assert(process.chunk(markdown, retrieval({ split_headings = false }), { first = 3, last = 3 }))
            test.eq(#single.chunks, 1); test.eq(single.chunks[1].content, "Included third")
            test.eq(shapes.quote_location(single.chunks[1], "Included third").page, 3)
        end)
        test.it("includes every page in an explicit whole-document range with real quote locations", function()
            for _, headings in ipairs({ true, false }) do
                local options = retrieval({ split_headings = headings })
                local full = assert(process.chunk(MARKDOWN, options))
                local selected = assert(process.chunk(MARKDOWN, options, { first = 1, last = 2 }))
                test.eq(selected.page_count, full.page_count)
                test.eq(#selected.chunks, #full.chunks)
                for i, chunk in ipairs(selected.chunks) do
                    test.eq(chunk.content, full.chunks[i].content)
                    test.eq(chunk.page_start, full.chunks[i].page_start)
                    test.eq(chunk.page_end, full.chunks[i].page_end)
                    test.eq(json.encode(chunk.page_spans), json.encode(full.chunks[i].page_spans))
                end
                local payment
                for _, chunk in ipairs(selected.chunks) do
                    if chunk.content:find("| Tax | 250 |", 1, true) then payment = chunk end
                end
                test.not_nil(payment);test.eq(shapes.quote_location(payment, "| Tax | 250 |").page, 2)
                test.eq(selected.outline[1].page_start, 1)
                test.eq(selected.outline[#selected.outline].page_end, 2)
            end
        end)
        test.it("excludes unattributed text and retains sparse page numbers with partial page metadata", function()
            local markdown = "Unattributed preamble\n# Unattributed heading\nUnknown page text\n<!-- page 2 -->\n# Selected\nSelected amount\n<!-- page 4 -->\n# Ending\nExcluded ending"
            for _, headings in ipairs({ true, false }) do
                local options = retrieval({ split_headings = headings })
                local selected = assert(process.chunk(markdown, options, { first = 1, last = 3 }))
                test.eq(selected.page_count, 4);test.is_true(#selected.chunks > 0)
                for _, chunk in ipairs(selected.chunks) do
                    test.eq(chunk.page_start, 2);test.eq(chunk.page_end, 2)
                    test.is_nil(chunk.content:find("Unattributed", 1, true))
                    test.is_nil(chunk.content:find("Unknown", 1, true))
                    test.is_nil(chunk.content:find("Excluded", 1, true))
                    test.is_nil(chunk.heading_path:find("Unattributed", 1, true))
                    for _, span in ipairs(chunk.page_spans) do test.eq(span.page, 2) end
                end
                for _, section in ipairs(selected.outline) do
                    test.eq(section.page_start, 2);test.eq(section.page_end, 2)
                    test.is_nil(section.title:find("Unattributed", 1, true))
                end
                local ending = assert(process.chunk(markdown, options, { first = 4, last = 4 }))
                test.eq(shapes.quote_location(ending.chunks[1], "Excluded ending").page, 4)
                local gap = assert(process.chunk(markdown, options, { first = 3, last = 3 }))
                test.eq(#gap.chunks, 0);test.eq(#gap.outline, 0)
            end
        end)
        test.it("keeps overlapped text on its source page when a boundary repeats in adjacent chunks", function()
            local markdown = "<!-- page 1 -->\n" .. string.rep("Excluded before. ", 50) .. "\n<!-- page 2 -->\n" .. string.rep("Selected text. ", 50) .. "\n<!-- page 3 -->\n" .. string.rep("Excluded after. ", 50)
            for _, headings in ipairs({ true, false }) do
                for _, overlap in ipairs({ 0, 20, 60 }) do
                    local doc = assert(process.chunk(markdown, retrieval({ split_headings = headings, chunk_size = 100, overlap = overlap }), { first = 2, last = 2 }))
                    test.is_true(#doc.chunks > 1)
                    for _, chunk in ipairs(doc.chunks) do
                        test.is_nil(chunk.content:find("Excluded", 1, true), chunk.content)
                        test.eq(chunk.page_start, 2);test.eq(chunk.page_end, 2)
                    end
                end
            end
        end)
        test.it("rejects invalid ranges and documents without page information", function()
            for _, pages in ipairs({ false, "2-3", {}, { first = 0, last = 1 }, { first = 2, last = 1 },
                { first = 1.5, last = 2 }, { first = 1, last = 2.5 }, { first = "1", last = 2 },
                { first = 1, last = 5 }, { first = 1, last = 1, extra = true } }) do
                local doc, err = process.chunk("<!-- page 1 -->\nPage one\n<!-- page 2 -->\nPage two", retrieval(), pages)
                test.is_nil(doc); test.not_nil(err); test.is_true(errors.is(err, errors.INVALID), tostring(err))
            end
            local doc, err = process.chunk("# Plain text\nNo page markers", retrieval(), { first = 1, last = 1 })
            test.is_nil(doc); test.is_true(errors.is(err, errors.INVALID))
            test.is_true(tostring(err):find("page information", 1, true) ~= nil, tostring(err))
        end)
        test.it("keeps the omitted-range document and processing key identical", function()
            local full = assert(process.chunk(MARKDOWN, retrieval()))
            test.eq(json.encode(full), json.encode(assert(process.chunk(MARKDOWN, retrieval(), nil))))
            local models = { embedding = "fixture/embedder" }
            local base = assert(process.processing_key(retrieval(), models))
            test.eq(base, assert(process.processing_key(retrieval(), models, nil)))
            local range = assert(process.processing_key(retrieval(), models, { first = 1, last = 1 }))
            test.is_true(range ~= base)
            test.is_true(range ~= assert(process.processing_key(retrieval(), models, { first = 2, last = 2 })))
        end)
        test.it("builds sections from headings outside code fences with nested paths", function()
            local sections = process.sections(MARKDOWN)
            local titles = {}
            for _, s in ipairs(sections) do titles[#titles + 1] = s.path end
            test.eq((json.encode(titles)), (json.encode({ "Start of document", "Agreement", "Agreement › Payment", "Agreement › Termination" })))
            test.is_true(sections[3].text:find("# not a heading inside code", 1, true) ~= nil)
        end)
        test.it("chunks within sections, keeps page locators and strips the markers", function()
            local document, err = process.chunk(MARKDOWN, retrieval())
            test.is_nil(err, tostring(err))
            local chunks, outline, pages = document.chunks, document.outline, document.page_count
            test.eq(pages, 2)
            for _, c in ipairs(chunks) do test.is_nil((c.content:find("<!--", 1, true))) end
            local payment
            for _, c in ipairs(chunks) do if c.heading_path == "Agreement › Payment" then payment = c end end
            test.not_nil(payment)
            test.eq(payment.page_start, 1); test.eq(payment.page_end, 2)
            test.is_true(payment.content:find("| Tax | 250 |", 1, true) ~= nil)
            local termination = outline[#outline]
            test.eq(termination.title, "Termination"); test.eq(termination.page_start, 2)
            test.eq(chunks[#chunks].section_id, termination.id)
        end)
        test.it("requires a full Markdown artifact and preserves full content", function()
            local owner = uuid.v4()
            for _, original in ipairs({ "text/markdown", "text/html" }) do
                local upload_id = data.upload(owner, original, "Original bytes")
                local value, err = data.caller(owner):call("app:probe", { op = "content", upload_id = upload_id })
                test.is_nil(value); test.not_nil(err); test.is_true(errors.is(err, errors.UNAVAILABLE))
                test.eq(err:details().code, "markdown_artifact_required")
            end
            local full = string.rep("Extracted text ", 4000)
            local upload_id = data.upload(owner, "application/pdf", "Original bytes", full)
            local value = assert(data.caller(owner):call("app:probe", { op = "content", upload_id = upload_id }))
            test.eq(value.markdown, full)
        end)
        for _, denied in ipairs({ "app:deny_provider_security", "app:deny_provider_context" }) do
            test.it("returns a native provider-builder denial through " .. denied, function()
                local owner = uuid.v4()
                local upload_id = data.upload(owner, "application/pdf", "Original bytes", "Extracted Markdown")
                local scope = security.new_scope({ assert(security.policy("app:user")), assert(security.policy(denied)) })
                local caller = data.caller(owner):with_scope(scope)
                local value, err = caller:call("app:probe", { op = "content", upload_id = upload_id })
                test.is_nil(value); test.not_nil(err)
                test.is_true(errors.is(err, errors.PERMISSION_DENIED), tostring(err))
                test.is_false(err:retryable())
            end)
        end
        test.it("resolves a quote's page and retains the range for a quote spanning pages", function()
            local document = assert(process.chunk("<!-- page 1 -->\n# Terms\nFee 100\n<!-- page 2 -->\nTax 250", retrieval({ split_headings = false })))
            test.eq(#document.chunks, 1)
            local chunk = document.chunks[1]
            chunk.vector = unit(1)
            local id = assert(save({ owner_id = "owner-" .. uuid.v4(), upload_id = "upload", checksum = "c", processing_key = "k", outline = document.outline,
                page_count = 2, tokens = 0, expires_at = far_future() }, { chunk }))
            local run = { document = { id = id }, regions = {}, config = { fields = { { name = "tax", type = "number", search_within = "document" } },
                stages = { verify = { check_quotes = true, check_support = false } } }, values = { { name = "tax", value = 250, missing = false, evidence = {
                    { quote = "Tax 250", chunk = 1, page = 1 }, { quote = "Fee 100 Tax 250", chunk = 1, page = 1 } } } } }
            test.is_nil(stages.verify(run, {}))
            test.eq(run.values[1].evidence[1].page, 2)
            local cross = run.values[1].evidence[2]
            test.is_nil(cross.page); test.eq(cross.page_start, 1); test.eq(cross.page_end, 2)
        end)
        test.it("keys processed copies by the settings and resolved models that change them", function()
            local models = { embedding = "fixture/embedder", context = "fixture/context" }
            local base = process.processing_key(retrieval(), models)
            test.eq(base, (process.processing_key(retrieval({ search_mode = "keyword", section_budget = 900 }), models)))
            test.is_true(base ~= process.processing_key(retrieval({ chunk_size = 600 }), models))
            test.is_true(base ~= process.processing_key(retrieval({ context = "generated" }), models))
            test.is_true(base ~= process.processing_key(retrieval(), { embedding = "other/embedder", context = "fixture/context" }))
            test.eq((process.processing_key(retrieval(), { embedding = "fixture/embedder", context = "other/writer" })), base)
            test.is_true(process.processing_key(retrieval({ context = "generated" }), models) ~=
                process.processing_key(retrieval({ context = "generated" }), { embedding = "fixture/embedder", context = "other/writer" }))
        end)
    end)

    test.describe("Processed document store", function()
        test.it("isolates processed copies by extractor and fences writes after teardown", function()
            local owner = "owner-" .. uuid.v4()
            local first = component_for(owner)
            components[owner] = nil
            local second = component_for(owner)
            local function doc(id: string): any
                return { component_id = id, owner_id = owner, upload_id = "shared", checksum = "c", processing_key = "k", outline = {},
                    page_count = 0, tokens = 0, expires_at = far_future() }
            end
            local chunks = { { ordinal = 1, section_id = "s", heading_path = "Terms", content = "Shared terms", vector = unit(1) } }
            local a = assert(save(doc(first), chunks))
            local b = assert(save(doc(second), chunks))
            test.is_true(a ~= b)
            test.eq(assert(store.find(first, owner, "shared", "c", "k")).id, a)
            assert(data.caller(owner):call("app:probe", { op = "delete", id = first }))
            data.await_delete(first)
            test.eq(#assert(store.all_chunks(a)), 0)
            test.eq(#assert(store.search(a, { mode = "keyword", text = "Shared", limit = 5 })), 0)
            test.eq(#assert(store.search(a, { mode = "semantic", vector = unit(1), limit = 5 })), 0)
            test.eq(#assert(store.all_chunks(b)), 1)
            local value, err = save(doc(first), chunks)
            test.is_nil(value); test.not_nil(err)
        end)
        test.it("saves, finds, searches by keyword and vector inside a region, and expires", function()
            local owner, upload = "owner-" .. uuid.v4(), "upload-" .. uuid.v4()
            local chunks = {
                { ordinal = 1, section_id = "s1", heading_path = "Payment", content = "Total amount due is USD 1,250.00", context = "Payment", page_start = 1, page_end = 1, vector = unit(1) },
                { ordinal = 2, section_id = "s2", heading_path = "Termination", content = "Either party may terminate with notice", context = "Termination", page_start = 2, page_end = 2, vector = unit(2) },
            }
            local id, err = save({ owner_id = owner, upload_id = upload, checksum = "c1", processing_key = "k1",
                outline = { { id = "s1", chunk_start = 1, chunk_end = 1 }, { id = "s2", chunk_start = 2, chunk_end = 2 } },
                page_count = 2, tokens = 20, expires_at = far_future() }, chunks)
            test.is_nil(err, tostring(err)); test.not_nil(id)
            local found = assert(store.find(component_for(owner), owner, upload, "c1", "k1"))
            test.eq(found.id, id); test.eq(found.chunk_count, 2); test.eq(#found.outline, 2)
            test.is_nil((store.find(component_for(owner), owner, upload, "c1", "other-key")))
            local keyword = assert(store.search(id, { mode = "keyword", text = "terminate", limit = 5 }))
            test.eq(keyword[1].ordinal, 2); test.eq(keyword[1].page_start, 2)
            local semantic = assert(store.search(id, { mode = "semantic", vector = unit(1), limit = 1 }))
            test.eq(semantic[1].ordinal, 1)
            local close = assert(store.search(id, { mode = "hybrid", text = "amount due", vector = unit(1), limit = 5, min_similarity = 0.6 }))
            test.eq(#close, 1); test.eq(close[1].ordinal, 1); test.eq(type(close[1].similarity), "number")
            local scoped = assert(store.search(id, { mode = "semantic", vector = unit(1), limit = 5, ordinals = { 2 } }))
            test.eq(#scoped, 1); test.eq(scoped[1].ordinal, 2)
            test.eq(#assert(store.search(id, { mode = "keyword", text = "terminate", limit = 5, ordinals = {} })), 0)
            local concurrent = assert(save({ owner_id = owner, upload_id = upload, checksum = "c1", processing_key = "k1",
                outline = {}, page_count = 0, tokens = 0, expires_at = far_future() }, { chunks[1] }))
            test.eq(concurrent, id)
            test.eq(#assert(store.all_chunks(id)), 2)
            local expired = assert(save({ owner_id = owner, upload_id = upload, checksum = "c2", processing_key = "k1",
                outline = {}, page_count = 0, tokens = 0, expires_at = "2000-01-01T00:00:00Z" }, { chunks[1] }))
            local replaced = assert(save({ owner_id = owner, upload_id = upload, checksum = "c2", processing_key = "k1",
                outline = {}, page_count = 0, tokens = 0, expires_at = far_future() }, { chunks[2] }))
            test.is_true(replaced ~= expired)
            test.eq(#assert(store.all_chunks(expired)), 0)
            test.eq(assert(store.all_chunks(replaced))[1].content, chunks[2].content)
        end)
        test.it("applies a minimum similarity to each hit's vector similarity in semantic and hybrid search", function()
            local chunks = {}
            for n = 1, 6 do
                chunks[n] = { ordinal = n, section_id = "s" .. n, heading_path = "Terms", vector = unit(1),
                    content = n == 6 and "Renewal requires written notice" or ("Clause text number " .. string.rep("i", n)) }
            end
            chunks[7] = { ordinal = 7, section_id = "s7", heading_path = "Other", content = "Unrelated schedule of fees", vector = unit(2) }
            local id = assert(save({ owner_id = "owner-" .. uuid.v4(), upload_id = "upload-" .. uuid.v4(), checksum = "c", processing_key = "k",
                outline = {}, page_count = 0, tokens = 0, expires_at = far_future() }, chunks))
            local function kept(mode: string): string
                local ordinals = {}
                for _, hit in ipairs(assert(store.search(id, { mode = mode, text = "renewal", vector = unit(1), limit = 10, min_similarity = 0.6 }))) do
                    ordinals[#ordinals + 1] = hit.ordinal
                end
                table.sort(ordinals)
                return json.encode(ordinals)
            end
            test.eq(kept("semantic"), json.encode({ 1, 2, 3, 4, 5, 6 }))
            test.eq(kept("hybrid"), json.encode({ 1, 2, 3, 4, 5, 6 }))
        end)
    end)

    test.describe("Retention", function()
        test.it("removes expired processed documents and runs and keeps fresh ones", function()
            local owner = "owner-" .. uuid.v4()
            local stale = assert(save({ owner_id = owner, upload_id = "u-old", checksum = "c", processing_key = "k", outline = {},
                page_count = 0, tokens = 0, expires_at = "2000-01-01T00:00:00Z" }, { { ordinal = 1, section_id = "s1", heading_path = "A", content = "old", vector = unit(3) } }))
            local fresh = assert(save({ owner_id = owner, upload_id = "u-new", checksum = "c", processing_key = "k", outline = {},
                page_count = 0, tokens = 0, expires_at = far_future() }, { { ordinal = 1, section_id = "s1", heading_path = "A", content = "new", vector = unit(4) } }))
            local db = assert(sql.get("app:db"))
            local run_id = uuid.v4()
            assert(db:execute([[INSERT INTO kickside_docscout_runs (id,component_id,user_id,upload_id,caller,status,config_revision,result,trace,duration_ms,tokens,created_at,expires_at)
                VALUES ($1,'extractor',$2,'u-old','ui','completed',0,'{}','[]',1,1,'2000-01-01T00:00:00Z','2000-01-01T00:00:00Z')]], { run_id, owner }))
            db:release()
            local result = assert(funcs.new():call("kickside.docscout.retention:owner", { change = {} }))
            test.is_true(result.success); test.is_true(result.deleted >= 2)
            test.eq(#assert(store.all_chunks(stale)), 0)
            test.eq(#assert(store.all_chunks(fresh)), 1)
            db = assert(sql.get("app:db"))
            local rows = assert(db:query("SELECT count(*) AS n FROM kickside_docscout_runs WHERE id=$1", { run_id }))
            db:release()
            test.eq(tonumber(rows[1].n), 0)
        end)
    end)

    test.describe("Deadlines", function()
        test.it("refuses a model call once the run's deadline has passed", function()
            local meter = ai.meter(time.now():add(-1 * time.SECOND))
            local _, err = ai.generate(meter, "class:fast", "system", "user")
            test.not_nil(err); test.is_true(errors.is(err, errors.TIMEOUT), tostring(err))
            local _, embed_err = ai.embed(meter, "class:embed", { "text" })
            test.not_nil(embed_err); test.is_true(errors.is(embed_err, errors.TIMEOUT), tostring(embed_err))
            test.eq(meter.input_tokens, 0)
        end)
        test.it("gives a model call the time left before the deadline", function()
            local left = ai.time_left(ai.meter(time.now():add(30 * time.SECOND)))
            test.is_true(left > 25000 and left <= 30000, tostring(left))
            test.is_nil(ai.time_left(ai.meter()))
        end)
    end)

    test.describe("Structured extraction", function()
        test.it("extracts typed values through structured output", function()
            local pool = shapes.pool()
            shapes.add(pool, { { ordinal = 1, content = "The total amount is 1250.", heading_path = "Payment" } })
            local field = assert(json.decode(assert(registry.get("kickside.docscout:config_schema")).data.schema_json)).properties.fields.items.default
            field.name, field.type = "total", "number"
            local run: any = { pool = pool, regions = {}, notes = {}, analyses = {}, values = {}, config = { fields = { field },
                stages = { extract = { model = "class:docscout-success", max_fields_per_call = 5, max_output_tokens = 256 } } } }
            test.is_nil(stages.extract(run, { meter = ai.meter() }))
            test.eq(run.values[1].value, 1250)
        end)
    end)
    test.describe("Stage sampling settings", function()
        -- The sampling fixture reports prompt tokens of 1000 + temperature * 100 (0 when unset)
        -- and completion tokens equal to the call's max_tokens.
        local SAMPLING = "class:docscout-sampling"
        local function field(over: any?): any
            local f = assert(json.decode(assert(registry.get("kickside.docscout:config_schema")).data.schema_json)).properties.fields.items.default
            f.name, f.type = "total", "number"
            for k, v in pairs(over or {}) do f[k] = v end
            return f
        end
        local function pool(): any
            local p = shapes.pool()
            shapes.add(p, { { ordinal = 1, content = "The total amount is 1250.", heading_path = "Payment" } })
            return p
        end
        local function usage(meter: any): string return meter.input_tokens .. "/" .. meter.output_tokens end

        test.it("passes the map stage's temperature and output limit to the section choice", function()
            local outline = {
                { id = "s1", level = 1, title = "Parties", path = "Parties", chunk_start = 1, chunk_end = 1 },
                { id = "s2", level = 1, title = "Payment", path = "Payment", chunk_start = 2, chunk_end = 2 },
                { id = "s3", level = 1, title = "Term", path = "Term", chunk_start = 3, chunk_end = 3 },
            }
            local run = { document = { outline = outline }, regions = {}, config = { fields = { field({ search_within = "sections" }) },
                stages = { map = { model = SAMPLING, outline = "find_or_build", section_summaries = false, temperature = 0.3, max_tokens = 512 } } } }
            local step = { meter = ai.meter() }
            test.is_nil(stages.map(run, step))
            test.eq(usage(step.meter), "1030/512")
        end)
        test.it("passes map sampling to outline building and section summaries", function()
            local id = assert(save({ owner_id = "owner-" .. uuid.v4(), upload_id = "upload-" .. uuid.v4(), checksum = "c", processing_key = "k",
                outline = {}, page_count = 0, tokens = 0, expires_at = far_future() }, {
                { ordinal = 1, section_id = "s1", heading_path = "Terms", content = "The total amount is 1250.", vector = unit(1) },
            }))
            for _, configured in ipairs({ true, false }) do
                local cfg = { model = SAMPLING, outline = "build", section_summaries = true }
                if configured then cfg.temperature, cfg.max_tokens = 0, 128 end
                local run = { document = { id = id, outline = {} }, regions = {}, config = { fields = {}, stages = { map = cfg } } }
                local step = { meter = ai.meter() }
                test.is_nil(stages.map(run, step))
                test.eq(usage(step.meter), configured and "2000/256" or "0/0")
                test.eq(#run.document.outline, 1)
                test.eq(run.document.outline[1].summary, "Fixture")
            end
        end)
        test.it("reuses the built outline persisted on the processed copy for the same map model", function()
            local id = assert(save({ owner_id = "owner-" .. uuid.v4(), upload_id = "upload-" .. uuid.v4(), checksum = "c", processing_key = "k",
                outline = {}, page_count = 0, tokens = 0, expires_at = far_future() }, {
                { ordinal = 1, section_id = "s1", heading_path = "Terms", content = "The total amount is 1250.", vector = unit(1) },
            }))
            local function mapped(model: string, outline: string): (any, any)
                local run = { document = { id = id, outline = {} }, regions = {}, config = { fields = {}, stages = { map = {
                    model = model, outline = outline, section_summaries = false, temperature = 0, max_tokens = 128 } } } }
                local step = { meter = ai.meter() }
                test.is_nil(stages.map(run, step))
                return run, step
            end
            local built, first = mapped(SAMPLING, "find_or_build")
            test.eq(usage(first.meter), "1000/128")
            local reused, second = mapped(SAMPLING, "find_or_build")
            test.eq(usage(second.meter), "0/0")
            test.eq(json.encode(reused.document.outline), json.encode(built.document.outline))
            test.contains(second.message, "Reused")
            local _, forced = mapped(SAMPLING, "build")
            test.eq(usage(forced.meter), "1000/128", "outline: build always builds")
            local _, other = mapped("class:docscout-sampling-other", "find_or_build")
            test.eq(usage(other.meter), "1000/128", "another map model card builds its own outline")
            local _, again = mapped("class:docscout-sampling-other", "find_or_build")
            test.eq(usage(again.meter), "0/0")
        end)
        test.it("invalidates the outline cache for every sampling input and model-card revision", function()
            local id = assert(save({owner_id="owner-" .. uuid.v4(),upload_id=uuid.v4(),checksum="cache",processing_key="cache",outline={},page_count=0,tokens=0,expires_at=far_future()}, {
                {ordinal=1,section_id="s1",heading_path="Terms",content="The total amount is 1250.",vector=unit(1)},
            }))
            local function mapped(options: any): any
                local cfg={model=SAMPLING,outline="find_or_build",section_summaries=false}
                for k,v in pairs(options) do cfg[k]=v end
                local run={document={id=id,outline={}},regions={},config={fields={},stages={map=cfg}}}
                local step={meter=ai.meter()}
                test.is_nil(stages.map(run,step)); return step
            end
            for _, options in ipairs({{}, {temperature=0}, {temperature=0.2}, {temperature=0.2,max_tokens=128}, {temperature=0.2,max_tokens=256}, {max_tokens=256}}) do
                test.contains(mapped(options).message,"Built")
                test.contains(mapped(options).message,"Reused")
            end
            local overlay=assert(registry.overlay("app:engine_test"))
            local entry=assert(registry.get("app:fixture_sampling_model"))
            entry.data.output_tokens=2048
            local changes=overlay:changes();changes:update(entry)
            local _,apply_err=changes:apply();test.is_nil(apply_err,tostring(apply_err))
            local ok,err=pcall(function()
                test.contains(mapped({max_tokens=256}).message,"Built")
                test.contains(mapped({max_tokens=256}).message,"Reused")
            end)
            local restore=assert(registry.overlay("app:engine_test")):changes();restore:delete(entry.id)
            local _,restore_err=restore:apply();test.is_nil(restore_err,tostring(restore_err))
            if not ok then error(err) end
        end)
        test.it("passes the scout stage's temperature to the structured loop and the agent", function()
            for _, mode in ipairs({ "loop", "agent" }) do
                for _, configured in ipairs({ true, false }) do
                    local run = { document = { outline = {} }, regions = {}, notes = {}, pool = pool(), confidence = 0,
                        config = { fields = { field() }, retrieval = { search_mode = "keyword" }, stages = { deep = { enabled = false },
                            scout = { model = SAMPLING, mode = mode, max_rounds = 1, max_extra_queries = 1, target_confidence = 0.7, max_tokens = 1024,
                                drop_noise = false, share_notes = false, tools = { "keyword_search" }, temperature = 0 } } } }
                    if not configured then run.config.stages.scout.temperature = nil end
                    local step = { meter = ai.meter() }
                    test.is_nil(stages.scout(run, step))
                    test.eq(usage(step.meter), configured and "1000/1024" or "0/1024", mode)
                end
            end
        end)
        test.it("passes the extract stage's temperature with its output limit", function()
            local run = { pool = pool(), regions = {}, notes = {}, analyses = {}, values = {}, config = { fields = { field() },
                stages = { extract = { model = SAMPLING, max_fields_per_call = 5, max_output_tokens = 256, temperature = 0.2 } } } }
            local step = { meter = ai.meter() }
            test.is_nil(stages.extract(run, step))
            test.eq(usage(step.meter), "1020/256")
        end)
        test.it("passes the verify stage's temperature and output limit to the support check", function()
            local run = { regions = {}, config = { fields = { field({ evidence_required = false }) },
                    stages = { verify = { enabled = true, model = SAMPLING, check_quotes = false, check_support = true, temperature = 0.1, max_tokens = 768 } } },
                values = { { name = "total", path = "total", value = 1250, missing = false, failed = false, evidence = { { quote = "The total amount is 1250.", chunk = 1 } } } } }
            local step = { meter = ai.meter() }
            test.is_nil(stages.verify(run, step))
            test.eq(usage(step.meter), "1010/768")
        end)
        test.it("passes the deep stage's output limit to the analysis with its temperature", function()
            local id = assert(save({ owner_id = "owner-" .. uuid.v4(), upload_id = "upload-" .. uuid.v4(), checksum = "c", processing_key = "k",
                outline = {}, page_count = 0, tokens = 0, expires_at = far_future() }, {
                { ordinal = 1, section_id = "s1", heading_path = "Terms", content = "The total amount is 1250.", vector = unit(1) },
            }))
            local run = { document = { id = id, outline = {} }, regions = {}, notes = {}, analyses = {}, pool = pool(),
                config = { fields = { field({ strategy = "deep" }) }, retrieval = { search_mode = "keyword", section_budget = 6000 }, stages = { deep = {
                    model = SAMPLING, query_model = SAMPLING, read = "chunks", parallel_fields = 1, max_queries = 1, chunks_per_query = 5, chunk_cap = 10,
                    min_similarity = 0, query_temperature = 0.2, analysis_temperature = 0.3, max_tokens = 640 } } } }
            local step = { meter = ai.meter() }
            test.is_nil(stages.deep(run, step))
            test.eq(step.status, "completed")
            test.eq(usage(step.meter), "1030/640")
        end)
        test.it("passes the highlighter's temperature and output limit", function()
            local run = { pool = pool(), regions = {}, notes = {}, config = { fields = { field() }, stages = { extract = { max_fields_per_call = 5 } }, retrieval = { highlighter_model = SAMPLING, highlighter_temperature = 0.1, highlighter_max_tokens = 300 } } }
            local step = { meter = ai.meter() }
            test.is_nil(stages.highlight(run, step))
            test.eq(usage(step.meter), "1010/300")
        end)
        test.it("leaves temperature and output limit to the provider when a stage sets none", function()
            local run = { regions = {}, config = { fields = { field({ evidence_required = false }) },
                    stages = { verify = { enabled = true, model = SAMPLING, check_quotes = false, check_support = true } } },
                values = { { name = "total", path = "total", value = 1250, missing = false, failed = false, evidence = { { quote = "The total amount is 1250.", chunk = 1 } } } } }
            local step = { meter = ai.meter() }
            test.is_nil(stages.verify(run, step))
            test.eq(usage(step.meter), "0/0")
        end)
    end)
    test.describe("Extraction without passages", function()
        test.it("reports fields missing without a model call when their call has no passages", function()
            local field = assert(json.decode(assert(registry.get("kickside.docscout:config_schema")).data.schema_json)).properties.fields.items.default
            field.name, field.search_within = "governing_law", "sections"
            local pool = shapes.pool()
            shapes.add(pool, { { ordinal = 1, content = "The fee is USD 100.", heading_path = "Fees" } })
            local run = { pool = pool, regions = { governing_law = { 7 } }, notes = { { field = "governing_law", text = "Delaware" } }, analyses = {}, values = {},
                config = { fields = { field }, stages = { extract = { model = "class:docscout-small", max_fields_per_call = 5, max_output_tokens = 256 } } } }
            local step = { meter = ai.meter() }
            test.is_nil(stages.extract(run, step))
            test.eq(#run.values, 1)
            test.is_true(run.values[1].missing)
            test.eq(run.values[1].reason, "No passage from its sections reached extraction")
            test.eq(step.meter.input_tokens, 0)
        end)
    end)

    test.describe("Outlines", function()
        test.it("previews chunks for outlining in windows that cover the document once, in order", function()
            local chunks = {}
            for i = 1, 7 do chunks[i] = { ordinal = i, content = "Line " .. i .. "\nmore" } end
            local windows = stages.outline_windows(chunks, 3)
            test.eq(#windows, 3)
            test.eq(windows[1].first, 1); test.eq(windows[1].last, 3)
            test.eq(windows[3].first, 7); test.eq(windows[3].last, 7)
            test.eq(windows[2].preview, "[C4] Line 4 more\n[C5] Line 5 more\n[C6] Line 6 more")
        end)
    end)

    test.describe("Context windows", function()
        local big = string.rep("The total amount due is USD 1,250.00. ", 200)
        test.it("refuses a prompt larger than the model's window before calling it", function()
            local _, err = ai.generate(ai.meter(), "class:docscout-small", "system", big)
            test.not_nil(err); test.is_true(errors.is(err, errors.INVALID), tostring(err))
            test.is_true(tostring(err):find("context window", 1, true) ~= nil, tostring(err))
        end)
        test.it("says which extraction settings shrink a prompt the model cannot take", function()
            local pool = shapes.pool()
            shapes.add(pool, { { ordinal = 1, content = big, heading_path = "Payment" } })
            local field = assert(json.decode(assert(registry.get("kickside.docscout:config_schema")).data.schema_json)).properties.fields.items.default
            field.name, field.type, field.description = "total", "number", "Total due"
            local run = { pool = pool, regions = {}, notes = {}, analyses = {}, values = {},
                config = { fields = { field },
                    stages = { extract = { model = "class:docscout-small", max_fields_per_call = 5, max_output_tokens = 256 } } } }
            local err = stages.extract(run, { meter = ai.meter() })
            test.not_nil(err); test.is_true(errors.is(err, errors.INVALID), tostring(err))
            test.is_true(tostring(err):find("fields per call", 1, true) ~= nil, tostring(err))
        end)
    end)

    test.describe("Regions", function()
        test.it("returns exactly the selected region and refuses a sections field without one", function()
            local run = { regions = { terms = { 2, 3 } } }
            local selected, err = stages.region(run, { name = "terms", search_within = "sections" })
            test.is_nil(err); test.eq(#selected, 2)
            local whole, whole_err = stages.region(run, { name = "total", search_within = "document" })
            test.is_nil(whole); test.is_nil(whole_err)
            local selected_missing, missing = stages.region(run, { name = "missing", search_within = "sections" })
            test.is_nil(selected_missing)
            test.not_nil(missing); test.is_true(errors.is(missing, errors.INTERNAL))
            local _, calls_err = stages.extraction_calls({ regions = {}, config = {
                fields = { { name = "missing", search_within = "sections" } }, stages = { extract = { max_fields_per_call = 5, max_output_tokens = 4096 } } } })
            test.not_nil(calls_err); test.is_true(errors.is(calls_err, errors.INTERNAL))
        end)
        test.it("prefetches a sections field only inside its region", function()
            local id = assert(save({ owner_id = "owner-" .. uuid.v4(), upload_id = "upload-" .. uuid.v4(), checksum = "c", processing_key = "k", outline = {},
                page_count = 0, tokens = 0, expires_at = far_future() }, {
                { ordinal = 1, section_id = "s1", heading_path = "Fees", content = "The renewal fee is USD 100.", vector = unit(1) },
                { ordinal = 2, section_id = "s2", heading_path = "Term", content = "Renewal notice is ninety days.", vector = unit(2) },
            }))
            local field = { name = "notice", description = "renewal notice", search_hints = "", strategy = "standard", search_within = "sections", chunks = 5 }
            local run = { document = { id = id }, regions = { notice = { 2 } }, pool = shapes.pool(),
                config = { fields = { field }, retrieval = { search_mode = "keyword" }, stages = { deep = { enabled = false }, prefetch = { queries = {} } } } }
            local step = { meter = { input_tokens = 0, output_tokens = 0 } }
            test.is_nil(stages.prefetch(run, step))
            local ordinals = {}
            for _, c in ipairs(shapes.ordered(run.pool)) do ordinals[#ordinals + 1] = c.ordinal end
            test.eq((json.encode(ordinals)), (json.encode({ 2 })))
        end)
        test.it("tells the deep query model the plain-text form its queries are searched in", function()
            local id = assert(save({ owner_id = "owner-" .. uuid.v4(), upload_id = "upload-" .. uuid.v4(), checksum = "c", processing_key = "k", outline = {},
                page_count = 0, tokens = 0, expires_at = far_future() }, {
                { ordinal = 1, section_id = "s1", heading_path = "Term", content = "Renewal notice is ninety days.", vector = unit(1) },
            }))
            local field = assert(json.decode(assert(registry.get("kickside.docscout:config_schema")).data.schema_json)).properties.fields.items.default
            field.name, field.description, field.strategy = "notice_period", "Days of notice before renewal", "deep"
            local run = { document = { id = id, outline = {} }, regions = {}, pool = shapes.pool(), analyses = {},
                config = { fields = { field }, retrieval = { search_mode = "keyword" }, stages = { deep = { enabled = true,
                    model = "class:docscout-sampling", query_model = "class:docscout-echo", read = "chunks", parallel_fields = 1,
                    max_queries = 2, chunks_per_query = 5, chunk_cap = 10, min_similarity = 0, query_temperature = 0, analysis_temperature = 0 } } } }
            local step = { meter = ai.meter() }
            test.is_nil(stages.deep(run, step))
            test.eq(#step.queries, 2)
            local prompt = step.queries[2]
            for _, statement in ipairs({ "natural-language phrase", "matched by its words and by its meaning", "regular expressions", "boolean operators" }) do
                test.is_true(prompt:find(statement, 1, true) ~= nil, statement)
            end
        end)
        for _, mode in ipairs({ "loop", "agent" }) do
            test.it("tells the " .. mode .. " scout to write plain-text search queries", function()
                local field = assert(json.decode(assert(registry.get("kickside.docscout:config_schema")).data.schema_json)).properties.fields.items.default
                field.name, field.description = "amount", "Invoice amount"
                local run = { document = { id = "unused", outline = {} }, regions = {}, pool = shapes.pool(), notes = {},
                    config = { fields = { field }, stages = { scout = { model = "class:docscout-echo", mode = mode,
                        max_rounds = 0, max_extra_queries = 1, target_confidence = 0.7, max_tokens = 4096, tools = {}, share_notes = true } } } }
                shapes.add(run.pool, { { ordinal = 1, heading_path = "Invoice", content = "The total amount is 1250." } })
                test.is_nil(stages.scout(run, { meter = ai.meter() }))
                local prompt = run.notes[1].text
                for _, statement in ipairs({ "natural-language phrase", "matched by its words and by its meaning", "regular expressions", "boolean operators" }) do
                    test.is_true(prompt:find(statement, 1, true) ~= nil, mode .. ": " .. statement)
                end
            end)
        end
        test.it("gives each extraction call only passages every one of its fields may read", function()
            local pool = shapes.pool()
            shapes.add(pool, { { ordinal = 1, content = "fee" }, { ordinal = 2, content = "notice" }, { ordinal = 3, content = "law" } })
            local function f(name: string, within: string, group: string?): any return { name = name, search_within = within, group = group or "" } end
            local run = { pool = pool, regions = { notice = { 2 }, law = { 3 }, term = { 2 } },
                notes = { { field = "fee", text = "fee in C1" }, { field = "law", text = "law in C3" }, { text = "Delaware law in C3" } },
                config = { stages = { extract = { max_fields_per_call = 5, max_output_tokens = 4096 } },
                    fields = { f("fee", "document"), f("notice", "sections"), f("law", "sections"), f("term", "sections"), f("total", "document"), f("party", "document", "parties") } } }
            local shape = {}
            for _, call in ipairs(stages.extraction_calls(run)) do
                local names, ordinals = {}, {}
                for _, field in ipairs(call.fields) do names[#names + 1] = field.name end
                for _, c in ipairs(call.passages) do ordinals[#ordinals + 1] = c.ordinal end
                shape[#shape + 1] = table.concat(names, ",") .. ":" .. table.concat(ordinals, ",") .. ":" .. table.concat(call.notes, ";")
            end
            test.eq(table.concat(shape, " | "),
                "fee,total:1,2,3:fee: fee in C1;agent: Delaware law in C3 | notice,term:2: | law:3:law: law in C3 | party:1,2,3:agent: Delaware law in C3")
        end)
        test.it("gives an extraction call the passages its own fields may still read after pruning", function()
            local pool = shapes.pool()
            shapes.add(pool, { { ordinal = 1, content = "fee" }, { ordinal = 2, content = "law" }, { ordinal = 3, content = "both" } })
            shapes.prune(pool, { 1, 2 }, { fee = { 1 }, ["terms.law"] = { 2 } })
            local run = { pool = pool, regions = {}, notes = {}, config = { stages = { extract = { max_fields_per_call = 5, max_output_tokens = 4096 } },
                fields = { { name = "fee", search_within = "document", group = "" }, { name = "law", search_within = "document", group = "terms" } } } }
            local shape = {}
            for _, call in ipairs(stages.extraction_calls(run)) do
                local ordinals = {}
                for _, c in ipairs(call.passages) do ordinals[#ordinals + 1] = c.ordinal end
                shape[#shape + 1] = call.fields[1].name .. ":" .. table.concat(ordinals, ",")
            end
            test.eq(table.concat(shape, " | "), "fee:1,3 | law:2,3")
        end)
        test.it("tells the scout which chunks each sections field may read", function()
            local pool = shapes.pool()
            shapes.add(pool, { { ordinal = 1, content = "fee", heading_path = "Fees" }, { ordinal = 3, content = "law", heading_path = "Law" } })
            local field = assert(json.decode(assert(registry.get("kickside.docscout:config_schema")).data.schema_json)).properties.fields.items.default
            local law, fee = {}, {}
            for k, v in pairs(field) do law[k] = v; fee[k] = v end
            law.name, law.search_within = "governing_law", "sections"
            fee.name = "fee"
            local run = { pool = pool, regions = { governing_law = { 3, 4 } }, notes = {}, config = { fields = { fee, law } } }
            local text = stages.scout_input(run, { fee, law })
            test.is_true(text:find("governing_law reads only C3, C4", 1, true) ~= nil, text)
            test.is_nil((text:find("fee reads only", 1, true)))
            test.is_true(text:find("[C3] Law", 1, true) ~= nil, text)
        end)
        test.it("asks the highlighter for one entry per passage it is sent and no other", function()
            local schema = stages.highlight_schema({ { ordinal = 4 }, { ordinal = 5 } })
            test.is_true((json.validate(schema, json.decode('{"4":["Total due"],"5":[]}'))))
            test.is_false((json.validate(schema, json.decode('{"4":["Total due"]}'))))
            test.is_false((json.validate(schema, json.decode('{"4":[],"5":[],"1":["Total due"]}'))))
        end)
        test.it("asks the scout for evidence and a note for every field it scouts", function()
            local fields = { { name = "fee", group = "" }, { name = "rate", group = "terms" } }
            local schema = stages.scout_schema({ max_extra_queries = 2 }, fields, { { ordinal = 1 }, { ordinal = 2 } })
            local reply = '{"confidence":0.5,"evidence":{"fee":[1],"terms.rate":[]},"drop":[2],"queries":[],"notes":{"fee":"C1 states it","terms.rate":""}}'
            test.is_true((json.validate(schema, json.decode(reply))))
            test.is_false((json.validate(schema, json.decode((reply:gsub(',"terms.rate":%[%]', ""))))))
            test.is_false((json.validate(schema, json.decode((reply:gsub('"fee":"C1 states it",', ""))))))
        end)
        test.it("asks for a summary of every section", function()
            local schema = stages.summary_schema({ { id = "s1" }, { id = "s2" } })
            test.is_true((json.validate(schema, json.decode('{"s1":"Parties","s2":"Payment terms"}'))))
            test.is_false((json.validate(schema, json.decode('{"s1":"Parties"}'))))
        end)
        test.it("keeps one scout note per field and retains cited passages", function()
            local p = shapes.pool()
            shapes.add(p, { { ordinal = 1, content = "The total amount is 1250.", heading_path = "Payment" }, { ordinal = 2, content = "Other", heading_path = "Other" } })
            local f = assert(json.decode(assert(registry.get("kickside.docscout:config_schema")).data.schema_json)).properties.fields.items.default
            local fee, rate = {}, {}
            for k, v in pairs(f) do fee[k] = v; rate[k] = v end
            fee.name, rate.name, rate.group = "fee", "rate", "terms"
            local run = { document = { outline = {} }, regions = {}, notes = {}, pool = p, confidence = 0,
                config = { fields = { fee, rate }, retrieval = { search_mode = "keyword" }, stages = { deep = { enabled = false },
                    scout = { model = "class:docscout-success", mode = "loop", max_rounds = 0, max_extra_queries = 1, target_confidence = 0.7, max_tokens = 1024,
                        drop_noise = true, share_notes = true, tools = {} } } } }
            test.is_nil(stages.scout(run, { meter = ai.meter() }))
            local noted = {}
            for _, n in ipairs(run.notes) do noted[#noted + 1] = n.field .. "=" .. n.text end
            table.sort(noted)
            test.eq(table.concat(noted, ","), "fee=Fixture,terms.rate=Fixture")
            test.not_nil(run.pool.by_ordinal[1])
        end)
        test.it("splits a group by the estimated output of its fields within the output limit", function()
            local pool = shapes.pool()
            shapes.add(pool, { { ordinal = 1, content = "a" } })
            local function text(name: string): any return { name = name, type = "text", description = "", search_within = "document", group = "" } end
            local fields = { text("a"), text("b"), text("c"), text("d") }
            local per_field = shapes.output_estimate(fields[1])
            local run = { pool = pool, regions = {}, notes = {}, config = { fields = fields,
                stages = { extract = { max_fields_per_call = 20, max_output_tokens = 2 * per_field + 1 } } } }
            local calls = assert(stages.extraction_calls(run))
            test.eq(#calls, 2); test.eq(#calls[1].fields, 2); test.eq(calls[2].fields[1].name, "c")
        end)
        test.it("extracts a field whose estimated output exceeds the output limit in its own call", function()
            local item = { type = "object", properties = {} }
            for n = 1, 12 do item.properties[n] = { name = "p" .. n, type = "text", required = true, description = "", enum_values = {}, expected_format = "" } end
            local wide = { name = "rows", type = "list", item = item, description = "", search_within = "document", group = "", evidence_required = true }
            local small = { name = "total", type = "number", description = "", search_within = "document", group = "", evidence_required = true }
            local pool = shapes.pool()
            shapes.add(pool, { { ordinal = 1, content = "The total amount is 1250.", heading_path = "Invoice" } })
            local run = { pool = pool, regions = {}, notes = {}, analyses = {}, values = {}, config = { fields = { wide, small },
                stages = { extract = { model = "class:docscout-success", max_fields_per_call = 20, max_output_tokens = 1024 } } } }
            test.is_true(shapes.output_estimate(wide) > 1024)
            test.is_nil(stages.extract(run, { meter = ai.meter() }))
            local rows, total = run.values[1], run.values[2]
            test.is_false(rows.failed); test.eq(rows.value[1].p12, "Fixture")
            test.is_nil(rows.error)
            test.is_false(total.failed); test.eq(total.value, 1250)
        end)
        test.it("splits a group with one region by the fields-per-call limit", function()
            local pool = shapes.pool()
            shapes.add(pool, { { ordinal = 1, content = "a" } })
            local run = { pool = pool, regions = {}, notes = {}, config = { stages = { extract = { max_fields_per_call = 2, max_output_tokens = 4096 } },
                fields = { { name = "a", search_within = "document", group = "" }, { name = "b", search_within = "document", group = "" }, { name = "c", search_within = "document", group = "" } } } }
            local calls = stages.extraction_calls(run)
            test.eq(#calls, 2)
            test.eq(#calls[1].fields, 2)
            test.eq(calls[2].fields[1].name, "c")
        end)
    end)

    test.describe("Verification", function()
        local function document(): string
            return assert(save({ owner_id = "owner-" .. uuid.v4(), upload_id = "upload-" .. uuid.v4(), checksum = "c", processing_key = "k", outline = {},
                page_count = 0, tokens = 0, expires_at = far_future() }, {
                { ordinal = 1, section_id = "s1", heading_path = "Payment", content = "The **total amount due** is USD 1,250.00.", page_start = 1, vector = unit(1) },
                { ordinal = 2, section_id = "s2", heading_path = "Terms", content = "Payment within 30 days of receipt. Discount: -5%.", page_start = 2, vector = unit(2) },
            }))
        end
        local function field(name: string, over: any?): any
            local f = { name = name, type = "text", search_within = "document", evidence_required = true }
            for k, v in pairs(over or {}) do f[k] = v end
            return f
        end
        local function quotes_only(fields: { any }, values: { any }): any
            return { document = { id = document() }, regions = {}, values = values,
                config = { fields = fields, stages = { verify = { enabled = true, check_quotes = true, check_support = false, model = "class:fast" } } } }
        end
        test.it("accepts quotes in the document, relocates misattributed ones with all their locators and rejects changed signs", function()
            local run = quotes_only({ field("total", { type = "number" }), field("terms"), field("discount", { type = "number" }), field("absent") }, {
                { name = "total", value = 1250, missing = false, evidence = { { quote = "total amount due is USD 1,250.00", chunk = 1 } } },
                { name = "terms", value = "Net 30", missing = false, evidence = { { quote = "Payment within 30 days", chunk = 1, chunk_id = "wrong", section = "Payment", page = 1 } } },
                { name = "discount", value = 5, missing = false, evidence = { { quote = "Discount: +5%", chunk = 2 } } },
                { name = "absent", missing = true, evidence = {} },
            })
            local step = { meter = { input_tokens = 0, output_tokens = 0 } }
            test.is_nil(stages.verify(run, step))
            test.is_true(run.values[1].verified)
            local moved = run.values[2].evidence[1]
            test.is_true(run.values[2].verified); test.eq(moved.chunk, 2); test.eq(moved.section, "Terms"); test.eq(moved.page, 2)
            test.is_true(moved.chunk_id ~= "wrong")
            test.is_false(run.values[3].verified); test.eq(run.values[3].reason, "A quote is not in the document")
            test.is_true(run.values[4].verified)
            test.eq(step.message, "1 value needs review")
        end)
        test.it("asks the support check for one verdict per found value", function()
            local run = { document = { id = document() }, regions = {}, values = {
                    { name = "total", value = 1250, missing = false, evidence = { { quote = "total amount due is USD 1,250.00", chunk = 1 } } },
                    { name = "terms", value = "Net 30", missing = false, evidence = { { quote = "Payment within 30 days", chunk = 2 } } },
                    { name = "discount", group = "rates", value = 5, missing = false, evidence = { { quote = "Discount: -5%", chunk = 2 } } },
                    { name = "absent", missing = true, evidence = {} } },
                config = { fields = { field("total", { type = "number" }), field("terms"), field("discount", { type = "number", group = "rates" }), field("absent") },
                    stages = { verify = { enabled = true, check_quotes = true, check_support = true, model = "class:docscout-success" } } } }
            local step = { meter = ai.meter() }
            test.is_nil(stages.verify(run, step))
            for i = 1, 3 do
                test.is_false(run.values[i].verified, run.values[i].name)
                test.eq(run.values[i].reason, "Fixture", run.values[i].name)
            end
            test.is_true(run.values[4].verified)
            test.is_true(step.meter.input_tokens > 0)
        end)
        test.it("fails a value without a quote when its field requires evidence", function()
            local run = quotes_only({ field("total", { type = "number" }), field("note", { evidence_required = false }) }, {
                { name = "total", value = 1250, missing = false, reason = "No quote supports this value", evidence = {} },
                { name = "note", value = "paid", missing = false, evidence = {} },
            })
            local step = { meter = { input_tokens = 0, output_tokens = 0 } }
            test.is_nil(stages.verify(run, step))
            test.is_false(run.values[1].verified)
            test.is_true(run.values[1].reason:find("No quote supports this value", 1, true) ~= nil)
            test.is_true(run.values[2].verified)
            test.eq(step.message, "1 value needs review")
        end)
        test.it("only relocates a quote inside the field's selected sections", function()
            local run = quotes_only({ field("terms", { search_within = "sections" }) }, {
                { name = "terms", value = "Net 30", missing = false, evidence = { { quote = "Payment within 30 days", chunk = 1 } } },
            })
            run.regions.terms = { 1 }
            local step = { meter = { input_tokens = 0, output_tokens = 0 } }
            test.is_nil(stages.verify(run, step))
            test.is_false(run.values[1].verified)
        end)
    end)
end) }
