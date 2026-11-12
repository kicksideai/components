-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local data = require("data")
local registry = require("registry")
local json = require("json")
local uuid = require("uuid")
local artifacts = require("artifacts")
local hash = require("hash")
local ai = require("ai")
local fs = require("fs")
local pages_module = require("pages")
local scoring = require("scoring")

local function configuration()
    local schema = assert(json.decode(assert(registry.get("kickside.docscout:config_schema")).data.schema_json))
    local cfg, field = schema.default, schema.properties.fields.items.default
    field.name, field.type, field.description, field.search_hints = "amount", "number", "Total amount", "amount"
    cfg.fields = {field}
    cfg.retrieval.embedding_model, cfg.retrieval.context, cfg.retrieval.search_mode = "class:docscout-success", "none", "keyword"
    cfg.stages.map.enabled, cfg.stages.scout.enabled, cfg.stages.deep.enabled = false, false, false
    cfg.stages.extract.model, cfg.stages.extract.reads, cfg.stages.extract.max_pages = "class:docscout-pages", "pages", 4
    cfg.stages.verify.enabled, cfg.stages.verify.check_support, cfg.stages.verify.model = true, true, "class:docscout-pages"
    return cfg
end

local function upload(owner, pages, markdown, bound)
    local body = assert(json.encode(pages))
    local id = data.upload(owner, "application/x-page-fixture", body)
    local source = assert(artifacts.create_artifact({upload_id = id, kind = "binary", role = "source",
        mime_type = "application/x-page-fixture", content = body, storage_id = "app:uploads"}))
    assert(artifacts.create_artifact({upload_id = id, kind = "markdown", role = "primary", mime_type = "text/markdown",
        content = markdown or "<!-- page 1 -->\n# Amount\nDOCUMENT-TEXT amount: 9999", storage_id = "app:uploads",
        parent_artifact_id = source.artifact_id, locator = bound == false and {type = "test.markdown"} or {type = "test.markdown", source_checksum = hash.sha256(body)}}))
    return id
end

local function invoke(owner, cfg, id, pages)
    local caller = data.caller(owner)
    local extractor = assert(caller:call("app:probe", {op = "create", input = {title = "Page reader", config = cfg}})).component_id
    return caller:call("kickside.docscout:invoke", {extractor_id = extractor, upload_id = id, pages = pages}), caller, extractor
end

return { run = test.run_cases(function()
    test.describe("Page image extraction", function()
        test.it("retains visual check semantics in evaluation scores", function()
            local value = {value = 1250, missing = false, verified = true, extraction_kind = "page_image", source_revision = "revision",
                verification = {kind = "page_image", status = "passed", checks = {value_support = "passed"}}}
            local scores = scoring.case({{name = "amount", group = "", type = "number"}}, {amount = 1250}, {amount = value})
            local stored = assert(json.decode(assert(json.encode(scores))))[1]
            test.eq(stored.extraction_kind, "page_image")
            test.eq(stored.source_revision, "revision")
            test.eq(stored.verification.status, "passed")
        end)
        test.it("stores explicit visual checks and image identities, independent of text agreement", function()
            local owner = uuid.v4()
            local result, caller, extractor = invoke(owner, configuration(), upload(owner, {"amount: 1250"}))
            local contract_schema = assert(json.decode(assert(registry.get("kickside.docscout:extraction")).data.methods[1].output_schemas[1].definition))
            local valid, validation_err = json.validate_string(contract_schema, assert(json.encode(result)))
            test.is_true(valid, tostring(validation_err))
            local value = result.fields[1]
            test.eq(value.value, 1250)
            test.is_true(value.verified)
            test.eq(value.extraction_kind, "page_image")
            test.eq(value.verification.kind, "page_image")
            test.eq(value.verification.status, "passed")
            test.eq(value.verification.checks.text_agreement, "failed")
            test.not_nil(value.evidence[1].image_checksum)
            test.not_nil(value.evidence[1].source_revision)
            test.is_nil(value.evidence[1].chunk_id)
            local saved = assert(caller:call("app:probe", {op = "get", id = extractor})).runs[1].result.fields[1]
            test.eq(saved.verification.status, "passed")
            test.eq(saved.evidence[1].image_checksum, value.evidence[1].image_checksum)
        end)
        test.it("reads shared pages once across extraction groups and field checks in one run", function()
            local owner, cfg = uuid.v4(), configuration()
            local storage, record = assert(fs.get("app:uploads")), uuid.v4() .. ".json"
            assert(storage:writefile(record, "{}"))
            local field = assert(json.decode(assert(json.encode(cfg.fields[1]))))
            field.name = "tax"
            cfg.fields[2], cfg.stages.extract.max_fields_per_call = field, 1
            local id = upload(owner, {{text = "amount: 1250\ntax: 50", record = record}, {text = "Notes", record = record}})
            local result, caller, extractor = invoke(owner, cfg, id)
            test.eq(#result.fields, 2)
            for _, value in ipairs(result.fields) do test.is_true(value.verified) end
            local reads = assert(json.decode(assert(storage:readfile(record))))
            test.eq(reads["1"], 1)
            test.eq(reads["2"], 1)
            assert(caller:call("kickside.docscout:invoke", {extractor_id = extractor, upload_id = id}))
            reads = assert(json.decode(assert(storage:readfile(record))))
            test.eq(reads["1"], 2)
            test.eq(reads["2"], 2)
        end)
        test.it("evicts the least recently used page beyond the run's 16 MiB image cap", function()
            local owner, storage, record = uuid.v4(), assert(fs.get("app:uploads")), uuid.v4() .. ".json"
            assert(storage:writefile(record, "{}"))
            local images = {}
            for page = 1, 5 do images[page] = {text = string.rep("x", 3584 * 1024), record = record} end
            local id = upload(owner, images)
            assert(data.caller(owner):call("app:fixture_page_reads", {upload_id = id, sequence = {1,2,3,4,1,5,1,2}}))
            local reads = assert(json.decode(assert(storage:readfile(record))))
            test.eq(reads["1"], 1)
            test.eq(reads["2"], 2)
            for page = 3, 5 do test.eq(reads[tostring(page)], 1) end
        end)
        test.it("leaves values visually unchecked when support is disabled", function()
            local owner, cfg = uuid.v4(), configuration()
            cfg.stages.verify.check_support = false
            local result = invoke(owner, cfg, upload(owner, {"amount: 1250"}))
            test.is_false(result.fields[1].verified)
            test.eq(result.fields[1].verification.status, "not_run")
        end)
        test.it("does not send pages outside the run range", function()
            local owner = uuid.v4()
            local id = upload(owner, {"amount: 1", "amount: 2", "amount: 3"},
                "<!-- page 1 -->\n# First\namount: 1\n<!-- page 2 -->\n# Second\namount: 2\n<!-- page 3 -->\n# Third\namount: 3")
            local result = invoke(owner, configuration(), id, {first = 2, last = 2})
            test.eq(result.fields[1].value, 2)
            test.eq(result.fields[1].evidence[1].page, 2)
        end)
        test.it("refuses text that is not proven to belong to the source revision", function()
            local owner = uuid.v4()
            local cfg = configuration()
            local caller = data.caller(owner)
            local extractor = assert(caller:call("app:probe", {op = "create", input = {title = "Unbound reader", config = cfg}})).component_id
            local value, err = caller:call("kickside.docscout:invoke", {extractor_id = extractor,
                upload_id = upload(owner, {"amount: 1250"}, nil, false)})
            test.is_nil(value)
            test.eq(err:details().code, "page_text_revision_unbound")
        end)
        test.it("counts base64 image bytes in the context estimate", function()
            local image = ai.image_part("image/png", string.rep("x", 12000))
            local estimate = ai.estimate("Read", {image}, {})
            test.is_true(estimate >= math.ceil(16000 * 1.25 / 4))
        end)
    end)
    test.describe("Image boundaries and failures", function()
        test.it("keeps completeness unavailable when verification omits eligible pages", function()
            local owner, cfg = uuid.v4(), configuration()
            cfg.fields[1].type = "text"
            cfg.stages.verify.check_completeness = true
            local result, caller, extractor = invoke(owner, cfg, upload(owner,
                {"amount: first part", "continued", "more", "last"},
                "<!-- page 1 -->\n# Amount\namount: first part\n<!-- page 2 -->\ncontinued\n<!-- page 3 -->\nmore\n<!-- page 4 -->\nlast"))
            for _, step in ipairs(result.trace) do
                if step.kind == "extract" then test.eq(assert(json.encode(step.calls[1].pages)), "[1,2,3,4]") end
                if step.kind == "verify" then test.eq(assert(json.encode(step.calls[1].pages)), "[1,2]") end
            end
            local value = result.fields[1]
            test.is_nil(value.complete)
            test.eq(value.verification.checks.completeness, "unavailable")
            test.is_false(value.verified)
            test.is_true(table.concat(value.codes, ","):find("visual_completeness_unavailable", 1, true) ~= nil)
            local saved = assert(caller:call("app:probe", {op = "get", id = extractor})).runs[1].result.fields[1]
            test.is_nil(saved.complete)
            test.eq(saved.verification.checks.completeness, "unavailable")
        end)
        test.it("accepts completeness when every eligible page reaches verification", function()
            local owner, cfg = uuid.v4(), configuration()
            cfg.fields[1].type = "text"
            cfg.stages.verify.check_completeness = true
            local result = invoke(owner, cfg, upload(owner, {"outside", "amount: all", "continued", "outside"},
                "<!-- page 1 -->\n# Amount\noutside\n<!-- page 2 -->\namount: all\n<!-- page 3 -->\ncontinued\n<!-- page 4 -->\noutside"), {first = 2, last = 3})
            test.is_true(result.fields[1].complete)
            test.is_true(result.fields[1].verified)
            test.eq(result.fields[1].verification.checks.completeness, "passed")
        end)
        test.it("keeps completeness unknown when Map drops section context", function()
            local owner, cfg = uuid.v4(), configuration()
            cfg.fields[1].type, cfg.fields[1].search_within = "text", "sections"
            cfg.stages.map.enabled, cfg.stages.map.model, cfg.stages.map.section_summaries = true, "class:docscout-constrained-budget", false
            cfg.stages.verify.check_completeness = true
            local markdown, images = {}, {}
            for page = 1, 100 do
                markdown[#markdown + 1] = "<!-- page " .. page .. " -->\n# Section " .. page .. " " .. string.rep("heading ", 80) .. "\n" ..
                    (page == 1 and "amount: first part" or "Other section text")
                images[page] = page == 1 and "amount: first part" or "Other section text"
            end
            local result = invoke(owner, cfg, upload(owner, images, table.concat(markdown, "\n")))
            test.is_false(result.fields[1].verified)
            test.eq(result.fields[1].verification.checks.completeness, "unavailable")
            test.is_nil(result.fields[1].complete)
        end)
        test.it("refuses section page membership with unproven gaps", function()
            local cfg = configuration()
            cfg.fields[1].search_within = "sections"
            local run = {config = cfg, regions = {amount = {1}}, page_images = {count = 3}}
            local selected, err = pages_module.allowed(run, cfg.fields[1], {
                {ordinal = 1, section_id = "terms", page_spans = {{page = 1, text = "Terms"}, {page = 3, text = "More terms"}}}})
            test.is_nil(selected)
            test.eq(err:details().code, "section_image_boundary_unavailable")
        end)
        test.it("keeps visual continuation within a selected section before a conflicting annex", function()
            local owner, cfg = uuid.v4(), configuration()
            cfg.fields[1].search_within = "sections"
            cfg.stages.map.enabled, cfg.stages.map.model, cfg.stages.map.section_summaries = true, "class:docscout-constrained", false
            local markdown = "<!-- page 1 -->\n# Terms\namount: 1250\n<!-- page 2 -->\nMore terms.\n" ..
                "<!-- page 3 -->\n# Annex\namount: 9999\n<!-- page 4 -->\n# Footer\nEnd."
            local result = invoke(owner, cfg, upload(owner, {"amount: 1250", "More terms", "amount: 9999", "End"}, markdown))
            test.is_true(result.fields[1].verified)
            for _, step in ipairs(result.trace) do
                if step.kind == "verify" then test.eq(assert(json.encode(step.calls[1].pages)), "[1,2]") end
            end
        end)
        test.it("does not claim completeness after page-budget cuts", function()
            local owner, cfg = uuid.v4(), configuration()
            cfg.fields[1].type = "text"
            cfg.stages.extract.max_pages = 1
            cfg.stages.verify.check_completeness = true
            local id = upload(owner, {"amount: first part", "continued second part"},
                "<!-- page 1 -->\n# Amount\namount: first part\n<!-- page 2 -->\ncontinued second part")
            local result = invoke(owner, cfg, id)
            test.is_nil(result.fields[1].complete)
            test.is_false(result.fields[1].verified)
            test.eq(result.fields[1].verification.checks.completeness, "unavailable")
        end)
        test.it("preserves a false boolean extracted from a physical page", function()
            local owner, cfg = uuid.v4(), configuration()
            cfg.fields[1].type = "boolean"
            local result = invoke(owner, cfg, upload(owner, {"amount: false"}))
            test.is_false(result.fields[1].value)
            test.is_false(result.fields[1].missing)
            test.is_true(result.fields[1].verified)
        end)
        test.it("retains typed image render errors on the field", function()
            local owner, cfg = uuid.v4(), configuration()
            local result = invoke(owner, cfg, upload(owner, {{error = {kind = errors.UNAVAILABLE,
                retryable = true, code = "fixture_render_failure", message = "Page rendering fails"}}}))
            test.is_true(result.fields[1].failed)
            test.is_false(result.fields[1].missing)
            test.eq(result.fields[1].error.details.code, "fixture_render_failure")
            test.is_true(result.fields[1].error.retryable)
        end)
        test.it("refuses a section that shares a physical page", function()
            local cfg = configuration()
            cfg.fields[1].search_within = "sections"
            local run = {config = cfg, regions = {amount = {1}}, page_images = {count = 3}}
            local selected, err = pages_module.allowed(run, cfg.fields[1], {
                {ordinal = 1, section_id = "terms", page_spans = {{page = 2, text = "Terms"}}},
                {ordinal = 2, section_id = "annex", page_spans = {{page = 2, text = "Annex"}}}})
            test.is_nil(selected)
            test.eq(err:details().code, "section_image_boundary_unavailable")
        end)
        test.it("bounds a section's page set by its chunks and the run range", function()
            local cfg = configuration()
            cfg.fields[1].search_within = "sections"
            local run = {config = cfg, regions = {amount = {1}}, page_images = {count = 4}, page_range = {first = 2, last = 3}}
            local selected = assert(pages_module.allowed(run, cfg.fields[1], {
                {ordinal = 1, section_id = "terms", page_spans = {{page = 1, text = "Terms"}, {page = 2, text = "Terms"}, {page = 3, text = "Terms"}}},
                {ordinal = 2, section_id = "annex", page_spans = {{page = 4, text = "Annex"}}}}))
            test.eq(assert(json.encode(selected)), "[2,3]")
        end)
        test.it("reports an oversized image as a context failure instead of document absence", function()
            local owner, cfg = uuid.v4(), configuration()
            cfg.stages.extract.model, cfg.stages.extract.max_output_tokens = "class:docscout-pages-budget", 256
            local result = invoke(owner, cfg, upload(owner, {"amount: 1250\n" .. string.rep("padding", 2000)}))
            test.is_true(result.fields[1].failed)
            test.is_false(result.fields[1].missing)
            test.eq(result.fields[1].error.details.code, "context_budget_exceeded")
        end)
        test.it("preserves permanent provider rejection and does not retry it", function()
            local owner, cfg = uuid.v4(), configuration()
            cfg.stages.extract.model = "class:docscout-pages-refusal"
            local result = invoke(owner, cfg, upload(owner, {"amount: 1250"}))
            test.is_true(result.fields[1].failed)
            test.eq(result.fields[1].error.details.code, "fixture_image_rejected")
            test.is_false(result.fields[1].error.retryable)
            for _, step in ipairs(result.trace) do if step.kind == "extract" then test.eq(#step.calls, 1) end end
        end)
        test.it("requires vision independently for visual verification before upload access", function()
            local owner, cfg = uuid.v4(), configuration()
            cfg.stages.verify.model = "class:docscout-success"
            local caller = data.caller(owner)
            local id = assert(caller:call("app:probe", {op = "create", input = {title = "No visual checker", config = cfg}})).component_id
            local result, err = caller:call("kickside.docscout:invoke", {extractor_id = id, upload_id = uuid.v4()})
            test.is_nil(result)
            test.eq(err:details().code, "model_vision_unsupported")
        end)
        test.it("rejects an unreadable upload without using a model", function()
            local id = upload(uuid.v4(), {"amount: 1250"})
            local owner, cfg = uuid.v4(), configuration()
            local caller = data.caller(owner)
            local extractor = assert(caller:call("app:probe", {op = "create", input = {title = "Upload access", config = cfg}})).component_id
            local result, err = caller:call("kickside.docscout:invoke", {extractor_id = extractor, upload_id = id})
            test.is_nil(result)
            test.eq(err:kind(), errors.NOT_FOUND)
            local saved = assert(caller:call("app:probe", {op = "get", id = extractor})).runs[1]
            test.eq(saved.status, "failed")
            for _, step in ipairs(err:details().trace) do test.eq(#(step.calls or {}), 0) end
        end)
        test.it("returns the contract's non-paged outcome on the run", function()
            local owner, cfg = uuid.v4(), configuration()
            local caller = data.caller(owner)
            local extractor = assert(caller:call("app:probe", {op = "create", input = {title = "Nonpaged", config = cfg}})).component_id
            local result, err = caller:call("kickside.docscout:invoke", {extractor_id = extractor,
                upload_id = data.upload(owner, "text/plain", "amount: 1250", "amount: 1250")})
            test.is_nil(result)
            test.eq(err:details().code, "not_paged")
        end)
    end)
    test.describe("Page image admission", function()
        test.it("refuses a model without vision before reading the upload", function()
            local schema = assert(json.decode(assert(registry.get("kickside.docscout:config_schema")).data.schema_json))
            local config = schema.default
            local field = schema.properties.fields.items.default
            field.name, field.description = "amount", "Total amount"
            config.fields = {field}
            config.stages.extract.reads, config.stages.extract.max_pages = "pages", 4
            config.stages.extract.model = "class:docscout-success"
            local caller = data.caller(uuid.v4())
            local created = assert(caller:call("app:probe", {op = "create", input = {title = "Page reader", config = config}}))
            local value, err = caller:call("kickside.docscout:invoke", {extractor_id = created.component_id, upload_id = uuid.v4()})
            test.is_nil(value)
            test.not_nil(err)
            test.eq(err:details().code, "model_vision_unsupported")
            test.eq(err:retryable(), false)
        end)
    end)
end) }
