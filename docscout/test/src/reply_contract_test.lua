-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local data = require("data")
local json = require("json")
local registry = require("registry")
local uuid = require("uuid")
local ai = require("ai")
local stages = require("stages")
local shapes = require("shapes")
local artifacts = require("artifacts")
local hash = require("hash")

local function configuration(model: string, reads: string): any
    local schema = assert(json.decode(assert(registry.get("kickside.docscout:config_schema")).data.schema_json))
    local cfg = schema.default
    cfg.fields = {}
    for _, kind in ipairs({"text", "number", "boolean", "enum", "object", "list"}) do
        local field = assert(json.decode(assert(json.encode(schema.properties.fields.items.default))))
        field.name, field.type, field.group, field.search_hints = kind, kind, "reference", "reference"
        if kind == "enum" then field.enum_values = {"registered", "unregistered"} end
        if kind == "object" then field.properties = {{name = "book", type = "text", description = "", enum_values = assert(json.decode("[]")), expected_format = "", required = true}} end
        if kind == "list" then field.item = {type = "number"} end
        cfg.fields[#cfg.fields + 1] = field
    end
    cfg.retrieval.embedding_model, cfg.retrieval.context, cfg.retrieval.search_mode = "class:docscout-success", "none", "keyword"
    cfg.stages.map.enabled, cfg.stages.scout.enabled, cfg.stages.deep.enabled = false, false, false
    cfg.stages.extract.model, cfg.stages.extract.reads = "class:" .. model, reads
    cfg.stages.extract.max_fields_per_call, cfg.stages.extract.max_output_tokens = 6, 4096
    cfg.stages.extract.max_pages = 4
    cfg.stages.verify.enabled = false
    return cfg
end

local function extract(model: string, reads: string, caller_kind: string): (any, any)
    local owner = uuid.v4()
    local caller = data.caller(owner)
    local cfg = configuration(model, reads)
    local id = assert(caller:call("app:probe", {op = "create", input = {title = "Reference reader", config = cfg}})).component_id
    local upload
    if reads == "pages" then
        local body = '["No reference is stated."]'
        upload = data.upload(owner, "application/x-page-fixture", body)
        local source = assert(artifacts.create_artifact({upload_id = upload, kind = "binary", role = "source",
            mime_type = "application/x-page-fixture", content = body, storage_id = "app:uploads"}))
        assert(artifacts.create_artifact({upload_id = upload, kind = "markdown", role = "primary", mime_type = "text/markdown",
            content = "<!-- page 1 -->\n# Reference\nNo reference is stated.", storage_id = "app:uploads",
            parent_artifact_id = source.artifact_id, locator = {type = "test.markdown", source_checksum = hash.sha256(body)}}))
    else
        upload = data.upload(owner, "application/pdf", "Original bytes", "# Reference\nNo reference is stated.")
    end
    local result, err = caller:call("kickside.docscout:invoke", {extractor_id = id, upload_id = upload, caller = caller_kind})
    test.is_nil(err, tostring(err)); test.not_nil(result)
    return result, assert(caller:call("app:probe", {op = "get", id = id})).runs[1].result
end

return {run = test.run_cases(function()
    test.describe("Extraction reply contracts", function()
        test.it("declares typed nullable enum alternatives for strict providers", function()
            local schema = shapes.group_schema({{name = "status", type = "enum", enum_values = {"registered", "unregistered"}}}, {{ordinal = 1}})
            local value = schema.properties.status.properties.value
            test.eq(value.anyOf[1].type, "string")
            test.eq(json.encode(value.anyOf[1].enum), '["registered","unregistered"]')
            test.eq(value.anyOf[2].type, "null")
            test.is_true((json.validate_string(schema, '{"status":{"found":false,"value":null,"confidence":0,"evidence":[]}}')))
            test.is_false((json.validate_string(schema, '{"status":{"found":true,"value":"invented","confidence":1,"evidence":[]}}')))
        end)
        for _, reads in ipairs({"text", "pages"}) do
            for _, caller_kind in ipairs({"ui", "agent"}) do
                for _, mode in ipairs({"absent", "absent-value"}) do
                    test.it("records " .. mode .. " values as missing for " .. reads .. " from " .. caller_kind, function()
                        local result, saved = extract("reply-contract-" .. mode, reads, caller_kind)
                        for _, value in ipairs({result, saved}) do
                            test.eq(#value.fields, 6)
                            test.eq(value.summary.missing, 6); test.eq(value.summary.failed, 0)
                            for _, field in ipairs(value.fields) do
                                test.is_true(field.missing, assert(json.encode(field)))
                                test.is_false(field.failed); test.is_nil(field.error); test.is_nil(field.value)
                                test.is_false(field.verified); test.eq(field.confidence, 0); test.eq(#field.evidence, 0)
                            end
                            test.eq(json.encode(value.values), "{}")
                        end
                    end)
                end
                test.it("fails found fields with null values for " .. reads .. " from " .. caller_kind, function()
                    local result, saved = extract("reply-contract-found-null", reads, caller_kind)
                    for _, value in ipairs({result, saved}) do
                        test.eq(value.summary.failed, 6); test.eq(value.summary.missing, 0)
                        for _, field in ipairs(value.fields) do
                            test.is_true(field.failed); test.is_false(field.missing); test.is_nil(field.value)
                            test.eq(field.error.kind, errors.UNAVAILABLE)
                            test.eq(field.error.details.code, "structured_reply_invalid")
                        end
                        test.eq(json.encode(value.values), "{}")
                    end
                end)
                for _, mode in ipairs({"partial", "parsed"}) do
                    test.it("fails " .. mode .. " truncated " .. reads .. " extraction from " .. caller_kind, function()
                        local result, saved = extract("reply-contract-" .. mode, reads, caller_kind)
                        for _, value in ipairs({result, saved}) do
                            test.eq(value.summary.failed, 6); test.eq(value.summary.missing, 0)
                            for _, field in ipairs(value.fields) do
                                test.is_true(field.failed); test.is_false(field.missing); test.is_nil(field.value)
                                test.eq(field.error.details.code, "structured_reply_truncated")
                            end
                        end
                        local call
                        for _, step in ipairs(result.trace) do if step.kind == "extract" then call = step.calls[1] end end
                        test.eq(call.finish_reason, "length"); test.eq(call.error_code, "structured_reply_truncated")
                        test.eq(call.completion_tokens, 32)
                    end)
                end
            end
        end
        test.it("rejects a truncated built-in agent reply at the scout entry point", function()
            local cfg = configuration("reply-contract-partial", "text")
            cfg.stages.scout.enabled, cfg.stages.scout.mode, cfg.stages.scout.model = true, "agent", "class:reply-contract-partial"
            local pool = shapes.pool()
            shapes.add(pool, {{ordinal = 1, content = "No reference is stated.", heading_path = "Notes"}})
            local run = {config = cfg, pool = pool, document = {outline = {}}, notes = {}, analyses = {}, regions = {}, values = {}}
            local step = {meter = ai.meter()}
            local err = stages.scout(run, step)
            test.not_nil(err); test.eq(err:details().code, "model_reply_truncated")
            test.eq(step.meter.calls[1].finish_reason, "length")
            test.eq(step.meter.calls[1].error_code, "model_reply_truncated")
            test.eq(#run.notes, 0)
        end)
    end)
end)}
