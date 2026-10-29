-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local data = require("data")
local json = require("json")
local registry = require("registry")
local uuid = require("uuid")
local time = require("time")
local process = require("process")
local channel = require("channel")
local ai = require("ai")
local stages = require("stages")
local shapes = require("shapes")
local scoring = require("scoring")
local function schema(): any
    return assert(json.decode(assert(registry.get("kickside.docscout:config_schema")).data.schema_json))
end
local function configuration(names: { string }): any
    local cfg = schema().default
    cfg.fields = {}
    for _, name in ipairs(names) do
        local f = schema().properties.fields.items.default
        f.name, f.type, f.description = name, "number", "Total amount"
        cfg.fields[#cfg.fields + 1] = f
    end
    cfg.retrieval.embedding_model, cfg.retrieval.context, cfg.retrieval.search_mode = "class:docscout-success", "none", "keyword"
    cfg.stages.map.enabled, cfg.stages.scout.enabled, cfg.stages.deep.enabled = false, false, false
    cfg.stages.extract.model, cfg.stages.extract.max_fields_per_call = "class:docscout-success", 1
    cfg.stages.verify.check_support = false
    return cfg
end
local function context(cfg: any): any
    local pool = shapes.pool()
    shapes.add(pool, { { ordinal = 1, content = "The total amount is 1250.", heading_path = "Invoice" } })
    return { config = cfg, pool = pool, notes = {}, analyses = {}, regions = {}, values = {} }
end
return { run = test.run_cases(function()
    test.describe("Independent extraction calls", function()
        test.it("keeps successful calls before and after a failed call", function()
            local run = context(configuration({ "before", "provider_failure", "after" }))
            test.is_nil(stages.extract(run, { meter = ai.meter() }))
            test.eq(#run.values, 3); test.eq(run.values[1].value, 1250); test.eq(run.values[3].value, 1250)
            local f = run.values[2]
            test.is_nil(f.value); test.is_false(f.missing); test.is_true(f.failed)
            test.eq(f.error.kind, errors.UNAVAILABLE); test.is_true(f.error.retryable)
            test.eq(f.error.details.code, "fixture_provider_failure")
        end)
        test.it("accepts a schema-valid missing-field reply through the provider contract", function()
            local cfg = configuration({ "missing_reply" })
            local model_schema = shapes.group_schema(cfg.fields, { { ordinal = 1 } })
            local reply, err = ai.structured(ai.meter(), cfg.stages.extract.model, model_schema, "Extract fields", "The total amount is 1250.")
            test.is_nil(err, tostring(err)); test.not_nil(reply)
            test.is_false(reply.missing_reply.found)
            test.eq(json.encode(reply.missing_reply.evidence), "[]")
        end)
        test.it("discards every field in a malformed call atomically", function()
            local cfg = configuration({ "before", "invalid_reply", "after" })
            cfg.stages.extract.max_fields_per_call = 2
            local run = context(cfg)
            test.is_nil(stages.extract(run, { meter = ai.meter() }))
            test.eq(#run.values, 3); test.is_true(run.values[1].failed); test.is_true(run.values[2].failed)
            test.is_nil(run.values[1].value); test.eq(run.values[3].value, 1250)
        end)
        test.it("fails a truncated call even when the reply has parseable values", function()
            local run = context(configuration({ "before", "truncated_reply", "after" }))
            local step = { meter = ai.meter() }
            test.is_nil(stages.extract(run, step))
            test.eq(run.values[1].value, 1250); test.eq(run.values[3].value, 1250)
            test.is_true(run.values[2].failed); test.is_nil(run.values[2].value)
            test.eq(run.values[2].error.details.code, "structured_reply_truncated")
            test.eq(step.meter.input_tokens, 36); test.eq(step.meter.output_tokens, 24)
        end)
        test.it("fails all remaining calls after a deadline without marking fields missing", function()
            local run = context(configuration({ "one", "two" }))
            local err = stages.extract(run, { meter = ai.meter(assert(time.parse(time.RFC3339, "2000-01-01T00:00:00Z"))) })
            test.not_nil(err); test.eq(#run.values, 2)
            for _, f in ipairs(run.values) do
                test.is_true(f.failed); test.is_false(f.missing); test.eq(f.error.kind, errors.TIMEOUT)
            end
        end)
        test.it("never verifies or scores failed fields as absent matches", function()
            local cfg = configuration({ "amount" })
            local cause = { kind = errors.UNAVAILABLE, message = "Model unavailable", retryable = true, details = { code = "fixture" } }
            cfg.stages.verify.check_quotes = false
            local f = { name = "amount", path = "amount", failed = true, missing = false, evidence = {}, error = cause }
            test.is_nil(stages.verify({ config = cfg, values = { f } }, {})); test.is_false(f.verified)
            local scores = scoring.case(cfg.fields, {}, { amount = f })
            test.eq(scores[1].score, 0); test.eq(scores[1].error.details.code, "fixture")
        end)
        for _, case in ipairs({
            { names = { "before", "provider_failure", "after" }, status = "partial" },
            { names = { "provider_failure" }, status = "failed" },
            { names = { "before", "after" }, status = "completed" },
            { names = { "missing_reply" }, status = "failed" },
            { names = { "provider_failure", "missing_reply" }, status = "failed" },
        }) do
            test.it("returns " .. case.status .. " for " .. table.concat(case.names, ", ") .. " through the contract, tool, Block and history", function()
                local owner = uuid.v4()
                local caller = data.caller(owner)
                local id = assert(caller:call("app:probe", { op = "create", input = { title = "Partial reader", config = configuration(case.names) } })).component_id
                local upload = data.upload(owner, "application/pdf", "Original bytes", "# Invoice\nThe total amount is 1250.")
                local input = { extractor_id = id, upload_id = upload, caller = "agent" }
                local direct, err = caller:call("kickside.docscout:invoke", input)
                test.is_nil(err, tostring(err)); test.eq(direct.status, case.status)
                local tool = assert(caller:call("kickside.docscout.traits:run_tool", input))
                for _, field in ipairs(tool.fields) do
                    if field.failed or field.missing then test.is_false(field.found) end
                end
                local block, block_err = caller:call("kickside.docscout.blocks:extract_run", { config = { extractor_id = id }, input = { upload_id = upload } })
                if case.status == "failed" then
                    test.is_nil(block); test.not_nil(block_err)
                    block = block_err:details().result
                else test.is_nil(block_err, tostring(block_err)) end
                test.not_nil(block)
                for _, result in ipairs({ direct, tool, block }) do
                    test.eq(result.status, case.status)
                    for _, f in ipairs(result.fields) do
                        if f.name == "provider_failure" then
                            test.is_true(f.failed); test.is_false(f.missing); test.is_false(f.verified)
                            test.eq(f.error.details.code, "fixture_provider_failure"); test.is_nil(f.value)
                        elseif f.name == "missing_reply" then
                            test.is_true(f.missing, "Expected a missing field: " .. tostring(json.encode(f))); test.is_false(f.failed); test.is_nil(f.value)
                        else test.eq(f.value, 1250); test.is_false(f.failed) end
                    end
                end
                local snapshot = assert(caller:call("app:probe", { op = "get", id = id }))
                test.eq(snapshot.runs[1].status, case.status)
                test.eq(snapshot.runs[1].result.fields[1].failed, direct.fields[1].failed)
            end)
        end
        test.it("isolates deep analysis failures to their own fields", function()
            local owner = uuid.v4()
            local caller = data.caller(owner)
            local cfg = configuration({ "before", "deep_failure", "after" })
            cfg.fields[2].strategy = "deep"
            cfg.stages.deep.enabled, cfg.stages.deep.max_queries, cfg.stages.deep.model = true, 1, "class:docscout-success"
            local id = assert(caller:call("app:probe", { op = "create", input = { title = "Deep reader", config = cfg } })).component_id
            local upload = data.upload(owner, "application/pdf", "Original bytes", "# Invoice\nThe total amount is 1250.")
            local result = assert(caller:call("kickside.docscout:invoke", { extractor_id = id, upload_id = upload }))
            test.eq(result.status, "partial"); test.eq(result.values.before, 1250); test.eq(result.values.after, 1250)
            test.is_true(result.fields[2].failed); test.eq(result.fields[2].error.details.code, "fixture_deep_failure")
        end)
        test.it("publishes committed partial runs through the realtime topic", function()
            local owner = uuid.v4()
            local caller = data.caller(owner)
            local id = assert(caller:call("app:probe", { op = "create", input = { title = "Realtime reader", config = configuration({ "before", "provider_failure" }) } })).component_id
            local upload = data.upload(owner, "application/pdf", "Original bytes", "# Invoice\nThe total amount is 1250.")
            local mailbox = process.listen("docscout.runs." .. id)
            assert(process.registry.register("user." .. owner))
            local result, err = caller:call("kickside.docscout:invoke", { extractor_id = id, upload_id = upload })
            local selected = channel.select({ mailbox:case_receive(), time.after("2s"):case_receive() })
            process.registry.unregister("user." .. owner); process.unlisten(mailbox)
            test.is_nil(err, tostring(err)); test.eq(result.status, "partial")
            test.eq(selected.channel, mailbox); test.eq(selected.value.run_id, result.run_id)
            local snapshot = assert(caller:call("app:probe", { op = "get", id = id }))
            test.eq(snapshot.runs[1].status, "partial"); test.is_true(snapshot.runs[1].result.fields[2].failed)
        end)
        test.it("declares field errors and conditional partial routing", function()
            local e = assert(registry.get("kickside.docscout:extraction"))
            local output = assert(json.decode(e.data.methods[1].output_schemas[1].definition))
            test.not_nil(output.properties.fields.items.properties.failed)
            test.not_nil(output.properties.fields.items.properties.error.properties.details)
            test.eq(output.properties.status.enum[2], "partial")
            local ports, failed_port = {}, false
            for _, port in ipairs(assert(registry.get("kickside.docscout.blocks:extract")).data.block.ports) do
                ports[port.id] = port.condition
                if port.id == "failed" then failed_port = true end
            end
            test.is_true(failed_port)
            test.eq(ports.result, "output.status == 'completed'")
            test.eq(ports.partial, "output.status == 'partial'")
            test.is_nil(ports.failed)
            local block = assert(registry.get("kickside.docscout.blocks:extract")).data.block
            test.eq(block.error.properties.details.properties.result.properties.status.enum[2], "partial")
        end)
        test.it("declares absent failed values in extraction, Block, tool and evaluation schemas", function()
            local extraction = assert(registry.get("kickside.docscout:extraction"))
            local contract_schema = assert(json.decode(extraction.data.methods[1].output_schemas[1].definition))
            local block_schema = assert(registry.get("kickside.docscout.blocks:extract")).data.block.output
            local tool_schema = assert(json.decode(assert(registry.get("kickside.docscout.traits:run_tool")).meta.output_schema))
            local field = { name = "amount", path = "amount", confidence = 0, verified = false, missing = false, failed = true, found = false,
                evidence = {}, error = { kind = errors.UNAVAILABLE, message = "Model unavailable", retryable = true } }
            for _, output in ipairs({ contract_schema, block_schema, tool_schema }) do
                local schema = output.properties.fields.items
                test.is_nil(field.value)
                local valid, err = json.validate_string(schema, assert(json.encode(field)))
                test.is_true(valid, tostring(err))
                test.not_nil(schema.properties.value.description)
                field.value = 1250
                test.is_false((json.validate_string(schema, assert(json.encode(field)))))
                field.value, field.missing = nil, true
                test.is_false((json.validate_string(schema, assert(json.encode(field)))))
                field.missing = false
            end
            field.found = nil
            test.is_false((json.validate_string(tool_schema.properties.fields.items, assert(json.encode(field)))))
            field.found = false
            local evaluation = assert(json.decode(assert(registry.get("kickside.docscout.traits:evaluation_tool")).meta.output_schema))
            local score_schema = evaluation.properties.cases.items.properties.scores.items
            local score = { field = "amount", score = 0, verified = false, failed = true, error = field.error }
            local valid, err = json.validate_string(score_schema, assert(json.encode(score)))
            test.is_true(valid, tostring(err)); test.not_nil(score_schema.properties.value.description)
            score.score = 1
            test.is_false((json.validate_string(score_schema, assert(json.encode(score)))))
        end)
        test.it("defaults every Extract configuration to class:fast", function()
            local s = schema()
            test.eq(s.default.stages.extract.model, "class:fast")
            test.eq(s.properties.stages.default.extract.model, "class:fast")
            test.eq(s.properties.stages.properties.extract.default.model, "class:fast")
            test.eq(s.properties.stages.properties.extract.properties.model.default, "class:fast")
        end)
    end)
end) }
