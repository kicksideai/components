-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local json = require("json")
local uuid = require("uuid")
local process = require("process")
local store = require("store")
local stages = require("stages")
local sql = require("sql")
local funcs = require("funcs")
local shapes = require("shapes")

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

return { run = test.run_cases(function()
    test.describe("Document processing", function()
        test.it("builds sections from headings outside code fences with nested paths", function()
            local sections = process.sections(MARKDOWN)
            local titles = {}
            for _, s in ipairs(sections) do titles[#titles + 1] = s.path end
            test.eq(json.encode(titles), json.encode({ "Start of document", "Agreement", "Agreement › Payment", "Agreement › Termination" }))
            test.is_true(sections[3].text:find("# not a heading inside code", 1, true) ~= nil)
        end)
        test.it("chunks within sections, keeps page locators and strips the markers", function()
            local chunks, outline, pages = process.chunk(MARKDOWN, retrieval())
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
        test.it("keys processed copies by the settings and resolved models that change them", function()
            local models = { embedding = "towers/qwen3-embed", context = "towers/gemma" }
            local base = process.processing_key(retrieval(), models)
            test.eq(base, process.processing_key(retrieval({ search_mode = "keyword", section_budget = 900 }), models))
            test.is_true(base ~= process.processing_key(retrieval({ chunk_size = 600 }), models))
            test.is_true(base ~= process.processing_key(retrieval({ context = "generated" }), models))
            test.is_true(base ~= process.processing_key(retrieval(), { embedding = "other/embedder", context = "towers/gemma" }))
            test.eq(process.processing_key(retrieval(), { embedding = "towers/qwen3-embed", context = "other/writer" }), base)
            test.is_true(process.processing_key(retrieval({ context = "generated" }), models) ~=
                process.processing_key(retrieval({ context = "generated" }), { embedding = "towers/qwen3-embed", context = "other/writer" }))
        end)
    end)

    test.describe("Processed document store", function()
        test.it("saves, finds, searches by keyword and vector inside a region, and expires", function()
            local owner, upload = "owner-" .. uuid.v4(), "upload-" .. uuid.v4()
            local chunks = {
                { ordinal = 1, section_id = "s1", heading_path = "Payment", content = "Total amount due is USD 1,250.00", context = "Payment", page_start = 1, page_end = 1, vector = unit(1) },
                { ordinal = 2, section_id = "s2", heading_path = "Termination", content = "Either party may terminate with notice", context = "Termination", page_start = 2, page_end = 2, vector = unit(2) },
            }
            local id, err = store.save({ owner_id = owner, upload_id = upload, checksum = "c1", processing_key = "k1",
                outline = { { id = "s1", chunk_start = 1, chunk_end = 1 }, { id = "s2", chunk_start = 2, chunk_end = 2 } },
                page_count = 2, tokens = 20, expires_at = far_future() }, chunks)
            test.is_nil(err, tostring(err)); test.not_nil(id)
            local found = assert(store.find(owner, upload, "c1", "k1"))
            test.eq(found.id, id); test.eq(found.chunk_count, 2); test.eq(#found.outline, 2)
            test.is_nil((store.find(owner, upload, "c1", "other-key")))
            local keyword = assert(store.search(id, { mode = "keyword", text = "terminate", limit = 5 }))
            test.eq(keyword[1].ordinal, 2); test.eq(keyword[1].page_start, 2)
            local semantic = assert(store.search(id, { mode = "semantic", vector = unit(1), limit = 1 }))
            test.eq(semantic[1].ordinal, 1)
            local close = assert(store.search(id, { mode = "hybrid", text = "amount due", vector = unit(1), limit = 5, min_similarity = 0.5 }))
            test.eq(#close, 1); test.eq(close[1].ordinal, 1); test.eq(type(close[1].similarity), "number")
            local scoped = assert(store.search(id, { mode = "semantic", vector = unit(1), limit = 5, ordinals = { 2 } }))
            test.eq(#scoped, 1); test.eq(scoped[1].ordinal, 2)
            test.eq(#assert(store.search(id, { mode = "keyword", text = "terminate", limit = 5, ordinals = {} })), 0)
            local concurrent = assert(store.save({ owner_id = owner, upload_id = upload, checksum = "c1", processing_key = "k1",
                outline = {}, page_count = 0, tokens = 0, expires_at = far_future() }, { chunks[1] }))
            test.eq(concurrent, id)
            test.eq(#assert(store.all_chunks(id)), 2)
            local expired = assert(store.save({ owner_id = owner, upload_id = upload, checksum = "c2", processing_key = "k1",
                outline = {}, page_count = 0, tokens = 0, expires_at = "2000-01-01T00:00:00Z" }, { chunks[1] }))
            local replaced = assert(store.save({ owner_id = owner, upload_id = upload, checksum = "c2", processing_key = "k1",
                outline = {}, page_count = 0, tokens = 0, expires_at = far_future() }, { chunks[2] }))
            test.is_true(replaced ~= expired)
            test.eq(#assert(store.all_chunks(expired)), 0)
            test.eq(assert(store.all_chunks(replaced))[1].content, chunks[2].content)
        end)
    end)

    test.describe("Retention", function()
        test.it("removes expired processed documents and runs and keeps fresh ones", function()
            local owner = "owner-" .. uuid.v4()
            local stale = assert(store.save({ owner_id = owner, upload_id = "u-old", checksum = "c", processing_key = "k", outline = {},
                page_count = 0, tokens = 0, expires_at = "2000-01-01T00:00:00Z" }, { { ordinal = 1, section_id = "s1", heading_path = "A", content = "old", vector = unit(3) } }))
            local fresh = assert(store.save({ owner_id = owner, upload_id = "u-new", checksum = "c", processing_key = "k", outline = {},
                page_count = 0, tokens = 0, expires_at = far_future() }, { { ordinal = 1, section_id = "s1", heading_path = "A", content = "new", vector = unit(4) } }))
            local db = assert(sql.get("app:db"))
            local run_id = uuid.v4()
            assert(db:execute([[INSERT INTO kickside_docscout_runs (id,component_id,user_id,upload_id,caller,status,config_revision,result,trace,duration_ms,tokens,created_at,expires_at)
                VALUES ($1,'extractor',$2,'u-old','ui','completed',0,'{}','[]',1,1,'2000-01-01T00:00:00Z','2000-01-01T00:00:00Z')]], { run_id, owner }))
            db:release()
            local result = assert(funcs.new():call("kickside.docscout:retention_owner", { change = {} }))
            test.is_true(result.success); test.is_true(result.deleted >= 2)
            test.eq(#assert(store.all_chunks(stale)), 0)
            test.eq(#assert(store.all_chunks(fresh)), 1)
            db = assert(sql.get("app:db"))
            local rows = assert(db:query("SELECT count(*) AS n FROM kickside_docscout_runs WHERE id=$1", { run_id }))
            db:release()
            test.eq(tonumber(rows[1].n), 0)
        end)
    end)

    test.describe("Regions", function()
        test.it("returns exactly the selected region and refuses a sections field without one", function()
            local run = { regions = { terms = { 2, 3 } } }
            local count = select("#", stages.region(run, { name = "terms", search_within = "sections" }))
            test.eq(count, 1)
            test.is_nil(stages.region(run, { name = "total", search_within = "document" }))
            local ok = pcall(stages.region, run, { name = "missing", search_within = "sections" })
            test.is_false(ok)
        end)
        test.it("prefetches a sections field only inside its region", function()
            local id = assert(store.save({ owner_id = "owner-" .. uuid.v4(), upload_id = "upload-" .. uuid.v4(), checksum = "c", processing_key = "k", outline = {},
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
            test.eq(json.encode(ordinals), json.encode({ 2 }))
        end)
        test.it("gives each extraction call only passages every one of its fields may read", function()
            local pool = shapes.pool()
            shapes.add(pool, { { ordinal = 1, content = "fee" }, { ordinal = 2, content = "notice" }, { ordinal = 3, content = "law" } })
            local function f(name: string, within: string, group: string?): any return { name = name, search_within = within, group = group or "" } end
            local run = { pool = pool, regions = { notice = { 2 }, law = { 3 }, term = { 2 } },
                config = { stages = { extract = { max_fields_per_call = 5 } },
                    fields = { f("fee", "document"), f("notice", "sections"), f("law", "sections"), f("term", "sections"), f("total", "document"), f("party", "document", "Parties") } } }
            local shape = {}
            for _, call in ipairs(stages.extraction_calls(run)) do
                local names, ordinals = {}, {}
                for _, field in ipairs(call.fields) do names[#names + 1] = field.name end
                for _, c in ipairs(call.passages) do ordinals[#ordinals + 1] = c.ordinal end
                shape[#shape + 1] = table.concat(names, ",") .. ":" .. table.concat(ordinals, ",")
            end
            test.eq(table.concat(shape, " | "), "fee,total:1,2,3 | notice,term:2 | law:3 | party:1,2,3")
        end)
        test.it("splits a group with one region by the fields-per-call limit", function()
            local pool = shapes.pool()
            shapes.add(pool, { { ordinal = 1, content = "a" } })
            local run = { pool = pool, regions = {}, config = { stages = { extract = { max_fields_per_call = 2 } },
                fields = { { name = "a", search_within = "document", group = "" }, { name = "b", search_within = "document", group = "" }, { name = "c", search_within = "document", group = "" } } } }
            local calls = stages.extraction_calls(run)
            test.eq(#calls, 2)
            test.eq(#calls[1].fields, 2)
            test.eq(calls[2].fields[1].name, "c")
        end)
    end)

    test.describe("Verification", function()
        local function document(): string
            return assert(store.save({ owner_id = "owner-" .. uuid.v4(), upload_id = "upload-" .. uuid.v4(), checksum = "c", processing_key = "k", outline = {},
                page_count = 0, tokens = 0, expires_at = far_future() }, {
                { ordinal = 1, section_id = "s1", heading_path = "Payment", content = "The **total amount due** is USD 1,250.00.", page_start = 1, vector = unit(1) },
                { ordinal = 2, section_id = "s2", heading_path = "Terms", content = "Payment within 30 days of receipt. Discount: -5%.", page_start = 2, vector = unit(2) },
            }))
        end
        local function field(name: string, over: any?): any
            local f = { name = name, search_within = "document", evidence_required = true }
            for k, v in pairs(over or {}) do f[k] = v end
            return f
        end
        local function quotes_only(fields: { any }, values: { any }): any
            return { document = { id = document() }, regions = {}, values = values,
                config = { fields = fields, stages = { verify = { enabled = true, check_quotes = true, check_support = false, model = "class:fast" } } } }
        end
        test.it("accepts quotes in the document, relocates misattributed ones with all their locators and rejects changed signs", function()
            local run = quotes_only({ field("total"), field("terms"), field("discount"), field("absent") }, {
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
        test.it("fails a value without a quote when its field requires evidence", function()
            local run = quotes_only({ field("total"), field("note", { evidence_required = false }) }, {
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
