-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local json = require("json")
local uuid = require("uuid")
local process = require("process")
local store = require("store")
local stages = require("stages")
local sql = require("sql")
local funcs = require("funcs")

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
        top_results = 6, embedding_model = "class:embed", context = "headings", context_model = "class:fast", section_budget = 6000 }
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
        test.it("keys processed copies by the settings that change them", function()
            local base = process.processing_key(retrieval())
            test.eq(base, process.processing_key(retrieval({ top_results = 20, section_budget = 900 })))
            test.is_true(base ~= process.processing_key(retrieval({ chunk_size = 600 })))
            test.is_true(base ~= process.processing_key(retrieval({ context = "generated" })))
            test.eq(process.processing_key(retrieval({ context_model = "class:nano" })), base)
            test.is_true(process.processing_key(retrieval({ context = "generated", context_model = "class:nano" })) ~= process.processing_key(retrieval({ context = "generated" })))
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
            local scoped = assert(store.search(id, { mode = "semantic", vector = unit(1), limit = 5, ordinals = { 2 } }))
            test.eq(#scoped, 1); test.eq(scoped[1].ordinal, 2)
            local again, again_err = store.save({ owner_id = owner, upload_id = upload, checksum = "c1", processing_key = "k1",
                outline = {}, page_count = 0, tokens = 0, expires_at = "2000-01-01T00:00:00Z" }, { chunks[1] })
            test.is_nil(again_err, tostring(again_err))
            test.is_nil((store.find(owner, upload, "c1", "k1")))
            local removed = assert(store.expire(100))
            test.is_true(removed >= 1)
            test.eq(#assert(store.all_chunks(again)), 0)
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
            assert(db:execute([[INSERT INTO kickside_docscout_runs (id,component_id,user_id,upload_id,caller,status,config_revision,duration_ms,tokens,created_at,expires_at)
                VALUES ($1,'extractor',$2,'u-old','ui','completed',0,1,1,'2000-01-01T00:00:00Z','2000-01-01T00:00:00Z')]], { run_id, owner }))
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

    test.describe("Verification", function()
        test.it("accepts quotes found in the document, rejects invented ones and finds quotes cited against the wrong chunk", function()
            local owner, upload = "owner-" .. uuid.v4(), "upload-" .. uuid.v4()
            local id = assert(store.save({ owner_id = owner, upload_id = upload, checksum = "c", processing_key = "k", outline = {},
                page_count = 0, tokens = 0, expires_at = far_future() }, {
                { ordinal = 1, section_id = "s1", heading_path = "Payment", content = "The total amount due is USD 1,250.00.", vector = unit(1) },
                { ordinal = 2, section_id = "s2", heading_path = "Terms", content = "Payment within 30 days of receipt.", vector = unit(2) },
            }))
            local run = { document = { id = id }, config = { stages = { verify = { enabled = true, check_quotes = true, check_support = false, model = "class:fast" } } },
                values = {
                    { name = "total", value = 1250, missing = false, evidence = { { quote = "total amount due is USD 1,250.00", chunk = 1 } } },
                    { name = "terms", value = "Net 30", missing = false, evidence = { { quote = "Payment within 30 days", chunk = 1 } } },
                    { name = "invented", value = "Net 60", missing = false, evidence = { { quote = "payable within 60 days", chunk = 2 } } },
                    { name = "absent", value = nil, missing = true, evidence = {} },
                } }
            local step = { meter = { input_tokens = 0, output_tokens = 0 } }
            test.is_nil(stages.verify(run, step))
            test.is_true(run.values[1].verified)
            test.is_true(run.values[2].verified); test.eq(run.values[2].evidence[1].chunk, 2)
            test.is_false(run.values[3].verified)
            test.is_true(run.values[4].verified)
            test.eq(step.message, "1 values need review")
        end)
    end)
end) }
