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
            local value = schema.properties.status.anyOf[1].properties.value
            test.eq(value.anyOf[1].type, "string")
            test.eq(json.encode(value.anyOf[1].enum), '["registered","unregistered"]')
            test.eq(value.anyOf[2].type, "null")
            local found = schema.properties.status.anyOf[2].properties.value
            test.eq(found.type, "string"); test.eq(json.encode(found.enum), json.encode(value.anyOf[1].enum))
            test.is_true((json.validate_string(schema, '{"status":{"found":false,"value":null,"confidence":0,"evidence":[]}}')))
            test.is_false((json.validate_string(schema, '{"status":{"found":true,"value":"invented","confidence":1,"evidence":[]}}')))
        end)
        test.it("admits a found reply only with a value and the quotes its field requires", function()
            local member = {type = "text", description = "", enum_values = {}, expected_format = "", required = false, nullable = true}
            local book, page = {name = "book"}, {name = "page"}
            for key, item in pairs(member) do book[key], page[key] = item, item end
            local fields = {
                {name = "title", type = "text", evidence_required = true},
                {name = "note", type = "text", evidence_required = false},
                {name = "reference", type = "object", evidence_required = false, properties = {book, page}},
            }
            local schema = shapes.group_schema(fields, {{ordinal = 1}})
            local absent = '{"found":false,"value":null,"confidence":0,"evidence":[]}'
            local function admits(over: {[string]: string}): (boolean, boolean)
                local members = {}
                for _, name in ipairs({"title", "note", "reference"}) do
                    members[#members + 1] = '"' .. name .. '":' .. (over[name] or absent)
                end
                local raw = "{" .. table.concat(members, ",") .. "}"
                local decoded = assert(json.decode(raw))
                local received = json.validate_string(shapes.receipt_schema(schema), assert(json.encode(decoded)))
                return (json.validate_string(schema, raw)), received == true and shapes.extraction_error(fields, decoded, "fixture") == nil
            end
            local function found(value: string, quotes: string): string
                return '{"found":true,"value":' .. value .. ',"confidence":1,"evidence":[' .. quotes .. ']}'
            end
            local quote = '{"chunk":1,"quote":"Book 12"}'
            for _, case in ipairs({
                {{}, true},
                {{title = found('"Deed"', quote)}, true},
                {{title = found("null", quote)}, false},
                {{title = found('"Deed"', "")}, false},
                {{note = found('"Deed"', "")}, true},
                {{note = found("null", "")}, false},
                {{reference = found('{"book":"12","page":null}', "")}, true},
                {{reference = found('{"book":null,"page":"3"}', "")}, true},
                {{reference = found('{"book":null,"page":null}', "")}, true},
                {{reference = found("null", "")}, false},
            }) do
                local generated, received = admits(case[1])
                test.eq(generated, case[2], assert(json.encode(case[1])))
                test.eq(received, case[2], assert(json.encode(case[1])))
            end
        end)
        test.it("keeps the reply schema linear in an object's members", function()
            local description = string.rep("d", 100)
            local properties = {}
            for i = 1, 100 do
                properties[i] = {name = "m" .. i, type = "text", description = description, enum_values = {}, expected_format = "", required = true, nullable = true}
            end
            local f = {name = "record", type = "object", description = description, properties = properties, evidence_required = true}
            local value = #assert(json.encode(shapes.value_schema(f)))
            local reply = #assert(json.encode(shapes.group_schema({f}, {{ordinal = 1}})))
            test.is_true(reply < 3 * value, "reply schema " .. reply .. " bytes for a value schema of " .. value)
        end)
        test.it("keeps an empty object valid when no member is nullable", function()
            local book = {name = "book", type = "text", description = "", enum_values = {}, expected_format = "", required = false}
            local schema = shapes.group_schema({{name = "reference", type = "object", evidence_required = false, properties = {book}}}, {{ordinal = 1}})
            local raw = '{"reference":{"found":true,"value":{},"confidence":1,"evidence":[]}}'
            test.is_true((json.validate_string(schema, raw)))
            test.is_true((json.validate_string(shapes.receipt_schema(schema), raw)))
        end)
        test.it("fails a found reply without a value for every field shape", function()
            local book = {name = "book", type = "text", description = "", enum_values = {}, expected_format = "", required = true, nullable = true}
            local fields = {
                {name = "rows", type = "list", evidence_required = false, item = {type = "object", properties = {book}}},
                {name = "reference", type = "object", evidence_required = false, properties = {book}},
                {name = "title", type = "text", evidence_required = false},
            }
            for _, f in ipairs(fields) do
                local reply = assert(json.decode('{"' .. f.name .. '":{"found":true,"value":null,"confidence":1,"evidence":[]}}'))
                local err = shapes.extraction_error({f}, reply, "fixture")
                test.not_nil(err, f.name)
                test.eq(err:details().code, "structured_reply_invalid")
                local valid = json.validate_string(shapes.group_schema({f}, {{ordinal = 1}}), '{"' .. f.name .. '":{"found":true,"value":null,"confidence":1,"evidence":[]}}')
                test.is_false(valid, f.name)
            end
        end)
        for _, reads in ipairs({"text", "pages"}) do
            for _, caller_kind in ipairs({"ui", "agent"}) do
                test.it("keeps fields that share a call when a constrained decoder cannot state one value for " .. reads .. " from " .. caller_kind, function()
                    local result, saved = extract("reply-contract-constrained-null", reads, caller_kind)
                    for _, value in ipairs({result, saved}) do
                        test.eq(value.summary.failed, 0); test.eq(value.summary.missing, 1); test.eq(value.summary.found, 5)
                        for _, field in ipairs(value.fields) do
                            test.is_false(field.failed, assert(json.encode(field)))
                            test.eq(field.missing, field.name == "text")
                        end
                    end
                end)
                test.it("cites a quote for every found value whose evidence is required for " .. reads .. " from " .. caller_kind, function()
                    local result, saved = extract("reply-contract-constrained-quote", reads, caller_kind)
                    for _, value in ipairs({result, saved}) do
                        test.eq(value.summary.found, 6); test.eq(value.summary.failed, 0)
                        for _, field in ipairs(value.fields) do
                            test.eq(#field.evidence, 1, assert(json.encode(field)))
                            test.is_nil(field.reason)
                        end
                    end
                end)
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
