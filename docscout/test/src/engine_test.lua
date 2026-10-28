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
            local run = { document = { id = id }, regions = {}, config = { fields = { { name = "tax", search_within = "document" } },
                stages = { verify = { check_quotes = true, check_support = false } } }, values = { { name = "tax", missing = false, evidence = {
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
            local close = assert(store.search(id, { mode = "hybrid", text = "amount due", vector = unit(1), limit = 5, min_similarity = 0.5 }))
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
        test.it("uses structured output for a stored config carrying the retired text setting", function()
            local pool = shapes.pool()
            shapes.add(pool, { { ordinal = 1, content = "The total amount is 1250.", heading_path = "Payment" } })
            local field = assert(json.decode(assert(registry.get("kickside.docscout:config_schema")).data.schema_json)).properties.fields.items.default
            field.name, field.type = "total", "number"
            local run: any = { pool = pool, regions = {}, notes = {}, analyses = {}, values = {}, config = { fields = { field },
                stages = { extract = { model = "class:docscout-success", max_fields_per_call = 5, max_output_tokens = 256, structured_output = false } } } }
            test.is_nil(stages.extract(run, { meter = ai.meter() }))
            test.eq(run.values[1].value, 1250)
        end)
    end)
    test.describe("Extraction without passages", function()
        test.it("reports fields missing without a model call when their call has no passages", function()
            local field = assert(json.decode(assert(registry.get("kickside.docscout:config_schema")).data.schema_json)).properties.fields.items.default
            field.name, field.search_within = "governing_law", "sections"
            local pool = shapes.pool()
            shapes.add(pool, { { ordinal = 1, content = "The fee is USD 100.", heading_path = "Fees" } })
            local run = { pool = pool, regions = { governing_law = { 7 } }, notes = { { field = "governing_law", text = "Delaware" } }, analyses = {}, values = {},
                config = { fields = { field }, stages = { extract = { model = "class:docscout-small", max_fields_per_call = 5, max_output_tokens = 50 } } } }
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
                    stages = { extract = { model = "class:docscout-small", max_fields_per_call = 5, max_output_tokens = 50 } } } }
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
                fields = { { name = "missing", search_within = "sections" } }, stages = { extract = { max_fields_per_call = 5 } } } })
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
        test.it("gives each extraction call only passages every one of its fields may read", function()
            local pool = shapes.pool()
            shapes.add(pool, { { ordinal = 1, content = "fee" }, { ordinal = 2, content = "notice" }, { ordinal = 3, content = "law" } })
            local function f(name: string, within: string, group: string?): any return { name = name, search_within = within, group = group or "" } end
            local run = { pool = pool, regions = { notice = { 2 }, law = { 3 }, term = { 2 } },
                notes = { { field = "fee", text = "fee in C1" }, { field = "law", text = "law in C3" }, { text = "Delaware law in C3" } },
                config = { stages = { extract = { max_fields_per_call = 5 } },
                    fields = { f("fee", "document"), f("notice", "sections"), f("law", "sections"), f("term", "sections"), f("total", "document"), f("party", "document", "Parties") } } }
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
        test.it("lets the highlighter name only the passages it is sent", function()
            local schema = stages.highlight_schema({ { ordinal = 4 }, { ordinal = 5 } })
            test.is_true((json.validate(schema, json.decode('{"passages":[{"chunk":4,"excerpts":["Total due"]}]}'))))
            test.is_false((json.validate(schema, json.decode('{"passages":[{"chunk":-1,"excerpts":["Total due"]}]}'))))
            test.is_false((json.validate(schema, json.decode('{"passages":[{"chunk":1,"excerpts":["Total due"]}]}'))))
        end)
        test.it("splits a group with one region by the fields-per-call limit", function()
            local pool = shapes.pool()
            shapes.add(pool, { { ordinal = 1, content = "a" } })
            local run = { pool = pool, regions = {}, notes = {}, config = { stages = { extract = { max_fields_per_call = 2 } },
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
