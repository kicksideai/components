-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local data = require("data")
local json = require("json")
local uuid = require("uuid")
local registry = require("registry")
local png = require("png")
local pages = require("pages")
local process = require("process")
local stages = require("stages")
local store = require("store")
local shapes = require("shapes")

local VISION = "class:docscout-vision"

local function schema(): any
    return assert(json.decode(assert(registry.get("kickside.docscout:config_schema")).data.schema_json))
end

local function field(name: string, type: string, description: string): any
    local f = schema().properties.fields.items.default
    f.name, f.type, f.description = name, type, description
    return f
end

-- An extractor that reads pages: keyword prefetch of field queries, then
-- extraction and verification on the vision fixture.
local function configuration(fields: { any }): any
    local cfg = schema().default
    cfg.fields = fields
    cfg.retrieval.embedding_model, cfg.retrieval.context, cfg.retrieval.search_mode = VISION, "none", "keyword"
    cfg.stages.map.enabled, cfg.stages.scout.enabled, cfg.stages.deep.enabled = false, false, false
    cfg.stages.extract.model, cfg.stages.extract.reads, cfg.stages.extract.max_pages = VISION, "pages", 8
    cfg.stages.verify.enabled, cfg.stages.verify.model = true, VISION
    return cfg
end

-- The processed text misreads page 1 and carries a marker the vision fixture
-- refuses, so a request that carries document text fails. Page 3 has no text.
local MARKDOWN = table.concat({
    "<!-- page 1 -->", "", "# Invoice", "", "total: 1Z50 DOCUMENT-TEXT", "",
    "<!-- page 2 -->", "", "terms: apply in full", "",
    "<!-- page 3 -->",
}, "\n")

local PAGES = {
    { "total: 1250" },
    { "terms: apply in full", "reference: R-7" },
    { "due: 30" },
}

local function upload(owner: string, with_pages: { integer }): string
    local id = data.upload(owner, "application/pdf", "Original bytes", MARKDOWN)
    for _, n in ipairs(with_pages) do data.page_image(id, n, png.page(PAGES[n])) end
    return id
end

local function run_extractor(owner: string, cfg: any, upload_id: string): any
    local caller = data.caller(owner)
    local id = assert(caller:call("app:probe", { op = "create", input = { title = "Page reader", config = cfg } })).component_id
    return assert(caller:call("kickside.docscout:invoke", { extractor_id = id, upload_id = upload_id }))
end

local function by_path(result: any): { [string]: any }
    local out = {}
    for _, f in ipairs(result.fields) do out[f.path] = f end
    return out
end

local function steps(result: any): { [string]: any }
    local out = {}
    for _, s in ipairs(result.trace) do out[s.kind] = s end
    return out
end

local function invoice_fields(): { any }
    return { field("total", "number", "Total amount"), field("terms", "text", "Payment terms"),
        field("reference", "text", "Reference code"), field("due", "number", "Days until due") }
end

return { run = test.run_cases(function()
    test.describe("Synthetic page images", function()
        test.it("carry their printed text", function()
            local image = png.page({ "total: 1250", "due: 30" })
            test.eq(image:sub(1, 8), "\137PNG\r\n\26\n")
            test.eq(png.text(image), "total: 1250\ndue: 30")
        end)
    end)

    test.describe("Extraction that reads pages", function()
        test.it("reads every page of a short document from its images, with no document text in the request", function()
            local owner = uuid.v4()
            local result = run_extractor(owner, configuration(invoice_fields()), upload(owner, { 1, 2, 3 }))
            local f = by_path(result)
            test.eq(f.total.value, 1250); test.is_true(f.total.verified, tostring(f.total.reason))
            test.eq(f.total.evidence[1].page, 1); test.eq(f.total.evidence[1].quote, "total: 1250")
            -- A value no text search finds is still read: all pages bypass the passage gate.
            test.eq(f.reference.value, "R-7"); test.is_true(f.reference.verified, tostring(f.reference.reason))
            test.eq(f.due.value, 30); test.eq(f.due.evidence[1].page, 3)
            local extract = steps(result).extract
            test.eq(json.encode(extract.calls[1].pages), "[1,2,3]")
            test.is_true(steps(result).read.message:find("page images for 3 of 3 pages", 1, true) ~= nil, steps(result).read.message)
            test.eq(result.pages, 3)
        end)
        test.it("records whether each quote agrees with its page's processed text without gating verified", function()
            local owner = uuid.v4()
            local f = by_path(run_extractor(owner, configuration(invoice_fields()), upload(owner, { 1, 2, 3 })))
            test.eq(f.total.evidence[1].text_agreement, "differs"); test.is_true(f.total.verified)
            test.eq(f.terms.evidence[1].text_agreement, "agrees"); test.is_true(f.terms.verified, tostring(f.terms.reason))
            test.eq(f.due.evidence[1].text_agreement, "no_text"); test.is_true(f.due.verified, tostring(f.due.reason))
        end)
        test.it("reports a page without an image instead of reading its text", function()
            local owner = uuid.v4()
            local result = run_extractor(owner, configuration(invoice_fields()), upload(owner, { 2, 3 }))
            local f = by_path(result)
            test.is_true(f.total.missing); test.is_false(f.total.verified)
            test.is_true(f.total.reason:find("page 1 has no page image", 1, true) ~= nil, tostring(f.total.reason))
            test.is_true(f.terms.verified, tostring(f.terms.reason))
            test.eq(json.encode(steps(result).extract.calls[1].pages), "[2,3]")
            test.eq(result.summary.unverified.page_image_unavailable, 1)
            test.is_true(steps(result).read.message:find("page images for 2 of 3 pages", 1, true) ~= nil)
        end)
        test.it("reports every field when no page has an image, without a model call", function()
            local owner = uuid.v4()
            local result = run_extractor(owner, configuration(invoice_fields()), upload(owner, {}))
            for _, f in ipairs(result.fields) do
                test.is_true(f.missing); test.is_true(f.reason:find("pages 1, 2, 3 have no page image", 1, true) ~= nil, tostring(f.reason))
            end
            test.is_nil(steps(result).extract.calls)
        end)
        test.it("gates verified on the visual check: rejected and unreadable values are not verified", function()
            local owner = uuid.v4()
            local id = data.upload(owner, "application/pdf", "Original bytes", "<!-- page 1 -->\n\nAmounts")
            data.page_image(id, 1, png.page({ "rejected_amount: 5", "unreadable_amount: 6", "amount: 7" }))
            local result = run_extractor(owner, configuration({ field("rejected_amount", "number", "Amount"),
                field("unreadable_amount", "number", "Amount"), field("amount", "number", "Amount") }), id)
            local f = by_path(result)
            test.is_false(f.rejected_amount.verified); test.is_false(f.unreadable_amount.verified); test.is_true(f.amount.verified)
            test.eq(result.summary.unverified.support_rejected, 1); test.eq(result.summary.unverified.support_unreadable, 1)
            local support = nil
            for _, call in ipairs(steps(result).verify.calls) do if call.stage == "support" then support = call end end
            test.eq(json.encode(support.pages), "[1]")
        end)
        test.it("shows the support check a text value's cited page and the page after it", function()
            local owner = uuid.v4()
            local result = run_extractor(owner, configuration({ field("terms", "text", "Payment terms") }), upload(owner, { 1, 2, 3 }))
            local support = nil
            for _, call in ipairs(steps(result).verify.calls) do if call.stage == "support" then support = call end end
            test.eq(json.encode(support.pages), "[2,3]")
            test.is_true(by_path(result).terms.complete)
        end)
        test.it("verifies only a quote on its cited page that states the value", function()
            test.eq(stages.page_verdict({ quote_on_page = "yes", states_value = "yes", reason = "" }).verdict, "supported")
            local moved = stages.page_verdict({ quote_on_page = "no", states_value = "yes", reason = "on page 2" })
            test.eq(moved.code, "quote_not_on_page")
            test.eq(stages.page_verdict({ quote_on_page = "yes", states_value = "no", reason = "" }).verdict, "not_supported")
            test.eq(stages.page_verdict({ quote_on_page = "unreadable", states_value = "yes", reason = "" }).code, "support_unreadable")
            test.eq(stages.page_verdict({ quote_on_page = "yes", states_value = "yes", complete = "incomplete", reason = "" }).complete, "incomplete")
        end)
        test.it("leaves values read from pages unverified without the visual support check", function()
            local owner = uuid.v4()
            local cfg = configuration({ field("total", "number", "Total amount") })
            cfg.stages.verify.check_support = false
            local result = run_extractor(owner, cfg, upload(owner, { 1 }))
            local f = by_path(result).total
            test.eq(f.value, 1250); test.is_false(f.verified); test.eq(f.evidence[1].text_agreement, "differs")
            test.eq(result.summary.unverified.unchecked, 1)
        end)
        test.it("returns a result that matches the extraction contract", function()
            local owner = uuid.v4()
            local result = run_extractor(owner, configuration(invoice_fields()), upload(owner, { 1, 2 }))
            local contract_schema = assert(json.decode(assert(registry.get("kickside.docscout:extraction")).data.methods[1].output_schemas[1].definition))
            local valid, err = json.validate_string(contract_schema, assert(json.encode(result)))
            test.is_true(valid, tostring(err))
        end)
        test.it("skips Deep analysis prose and still reads the deep field's pages", function()
            local owner = uuid.v4()
            local cfg = configuration({ field("total", "number", "Total amount") })
            cfg.fields[1].strategy = "deep"
            cfg.stages.deep.enabled, cfg.stages.deep.model, cfg.stages.deep.query_model = true, VISION, VISION
            local result = run_extractor(owner, cfg, upload(owner, { 1, 2, 3 }))
            for _, call in ipairs(steps(result).deep.calls or {}) do test.is_true(call.stage ~= "analysis") end
            test.eq(by_path(result).total.value, 1250)
        end)
    end)

    test.describe("Pages a call reads", function()
        local function manifest(count: integer, without: { integer }): any
            local gone, by_page, available, unavailable = {}, {}, {}, {}
            for _, n in ipairs(without) do gone[n] = true end
            for n = 1, count do
                if gone[n] then unavailable[#unavailable + 1] = n
                else by_page[n] = { artifact_id = "a" .. n, mime_type = "image/png" }; available[#available + 1] = n end
            end
            return { upload_id = "u", count = count, by_page = by_page, available = available, unavailable = unavailable }
        end
        local function passage(n: integer, page: integer): any
            return { ordinal = n, content = "p" .. n, heading_path = "Doc", page_start = page, page_end = page }
        end
        local function long_run(): any
            local fields = { field("a", "number", "A"), field("b", "number", "B"), field("c", "number", "C") }
            local pool = shapes.pool()
            shapes.add(pool, { passage(2, 2) })
            shapes.add(pool, { passage(1, 1) }, "a")
            shapes.add(pool, { passage(3, 3) }, "a")
            shapes.add(pool, { passage(6, 6), passage(5, 5) }, "b")
            shapes.add(pool, { passage(4, 4) }, "c")
            shapes.prune(pool, {}, { a = { 3 }, b = {}, c = {} })
            return { config = configuration(fields), regions = {}, pool = pool, page_images = manifest(6, { 5 }) }, fields
        end
        test.it("ranks a long document's pages by each field's cited and own passages within the page budget", function()
            local run, fields = long_run()
            local selection = assert(stages.call_pages(run, { fields = fields, passages = shapes.ordered(run.pool) }, 2))
            test.eq(json.encode(selection.pages), "[3,6]")
            test.eq(json.encode(selection.excluded), "[1,2,4]")
            test.is_nil(selection.cut.a); test.is_nil(selection.cut.b)
            test.eq(json.encode(selection.unavailable.b), "[5]")
        end)
        test.it("reports a field none of whose pages fit the page budget", function()
            local run, fields = long_run()
            local selection = assert(stages.call_pages(run, { fields = fields, passages = shapes.ordered(run.pool) }, 2))
            test.eq(selection.cut.c, 1)
        end)
        test.it("keeps a sections field to the pages holding its region's chunks", function()
            local owner = uuid.v4()
            local markdown = "<!-- page 1 -->\n# Cover\nCover text\n<!-- page 2 -->\n# Terms\nTerms text\n<!-- page 3 -->\nMore terms\n<!-- page 4 -->\n# Annex\nAnnex text"
            local document = assert(process.chunk(markdown, { chunk_size = 1200, overlap = 150, split_headings = true, keep_tables = true }))
            for _, c in ipairs(document.chunks) do
                local vector = {}
                for i = 1, 512 do vector[i] = i == 1 and 1.0 or 0.0 end
                c.vector = vector
            end
            local doc_id = assert(store.save({ component_id = data.extractor(owner), owner_id = owner, upload_id = "upload-" .. uuid.v4(), checksum = "c",
                processing_key = "k", outline = document.outline, page_count = 4, tokens = 0, expires_at = "2999-01-01T00:00:00Z" }, document.chunks))
            local terms = {}
            for _, c in ipairs(document.chunks) do if c.heading_path == "Terms" then terms[#terms + 1] = c.ordinal end end
            local f = field("terms", "text", "Terms")
            f.search_within = "sections"
            local run = { config = configuration({ f }), regions = { terms = terms }, pool = shapes.pool(), page_images = manifest(4, {}), document = { id = doc_id } }
            local selection = assert(stages.call_pages(run, { fields = { f }, passages = {} }, 8))
            test.eq(json.encode(selection.pages), "[2,3]")
        end)
    end)

    test.describe("Page images of an upload", function()
        test.it("reads an image upload's original as its only page", function()
            local owner = uuid.v4()
            local id = data.upload(owner, "image/png", png.page({ "total: 3" }), "total: 3")
            data.source_image(id, png.page({ "total: 3" }))
            local manifest = assert(pages.manifest(id, 0))
            test.eq(manifest.count, 1); test.eq(json.encode(manifest.available), "[1]")
            local bytes, mime = pages.image(manifest, 1)
            test.eq(png.text(bytes :: string), "total: 3"); test.eq(mime, "image/png")
        end)
        test.it("names a page without an image", function()
            local _, _, err = pages.image({ upload_id = "u", count = 2, by_page = {}, available = {}, unavailable = { 1, 2 } }, 2)
            test.eq(err:details().code, "page_image_unavailable")
        end)
    end)

    test.describe("Pages configuration", function()
        test.it("requires a page budget when extraction reads pages", function()
            local owner = uuid.v4()
            local cfg = configuration({ field("total", "number", "Total amount") })
            cfg.stages.extract.max_pages = nil
            local value, err = data.caller(owner):call("app:probe", { op = "create", input = { title = "No budget", config = cfg } })
            test.is_nil(value); test.not_nil(err)
            cfg.stages.extract.max_pages = 4
            test.not_nil(assert(data.caller(owner):call("app:probe", { op = "create", input = { title = "Budget", config = cfg } })).component_id)
        end)
    end)
end) }
