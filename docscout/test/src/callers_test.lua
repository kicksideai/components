-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local data = require("data")
local sql = require("sql")
local registry = require("registry")
local json = require("json")
local uuid = require("uuid")
local process = require("process")
local channel = require("channel")
local time = require("time")
local caller = data.caller
local function defaults() return assert(json.decode(assert(registry.get("kickside.docscout:config_schema")).data.schema_json)).default end

return { run = test.run_cases(function()
    test.describe("Docscout callers", function()
        test.it("lists extractors with a filter, reads configuration with its schema and saves with a revision check", function()
            local who = "caller-" .. uuid.v4()
            local a = assert(caller(who):call("app:probe", { op = "create", input = { title = "Invoice reader", description = "", config = defaults() } }))
            assert(caller(who):call("app:probe", { op = "create", input = { title = "Contract reader", description = "", config = defaults() } }))
            local listed = assert(caller(who):call("kickside.docscout.traits:list_tool", { filter = "invoice" }))
            test.is_true(listed.success); test.eq(#listed.extractors, 1); test.eq(listed.extractors[1].title, "Invoice reader")
            local got = assert(caller(who):call("kickside.docscout.traits:get_tool", { extractor_id = a.component_id }))
            test.is_true(got.success); test.eq(got.expected_revision, 0)
            test.not_nil(got.config_schema.properties.stages)
            got.config.stages.scout.max_rounds = 3
            local saved = assert(caller(who):call("kickside.docscout.traits:configure_tool", { extractor_id = a.component_id, title = "Invoice reader", config = got.config, expected_revision = 0 }))
            test.is_true(saved.success, tostring(saved.error))
            local stale, stale_err = caller(who):call("kickside.docscout.traits:configure_tool", { extractor_id = a.component_id, title = "Invoice reader", config = got.config, expected_revision = 0 })
            test.is_nil(stale); test.not_nil(stale_err); test.is_true(errors.is(stale_err, errors.CONFLICT))
            local bad, bad_err = caller(who):call("kickside.docscout.traits:configure_tool", { extractor_id = a.component_id, title = "Invoice reader", config = { fields = {} }, expected_revision = 1 })
            test.is_nil(bad); test.not_nil(bad_err); test.is_true(errors.is(bad_err, errors.INVALID))
            local stranger, stranger_err = caller("stranger-" .. uuid.v4()):call("kickside.docscout.traits:get_tool", { extractor_id = a.component_id })
            test.is_nil(stranger); test.not_nil(stranger_err); test.is_true(errors.is(stranger_err, errors.PERMISSION_DENIED))
        end)
        test.it("pages filtered extractor summaries in stable order", function()
            local who = "caller-" .. uuid.v4()
            for i = 1, 4 do
                assert(caller(who):call("app:probe", { op = "create", input = { title = i == 1 and "Other" or "Match " .. i, config = defaults() } }))
            end
            local cursor, ids = nil, {}
            for _ = 1, 3 do
                local page = assert(caller(who):call("kickside.docscout.traits:list_tool", { filter = "Match", limit = 1, cursor = cursor }))
                test.eq(#page.extractors, 1)
                ids[#ids + 1] = page.extractors[1].extractor_id
                cursor = page.next_cursor
            end
            test.is_nil(cursor); test.is_true(ids[1] < ids[2]); test.is_true(ids[2] < ids[3])
            local _, err = caller(who):call("kickside.docscout.traits:list_tool", { cursor = 42 })
            test.not_nil(err); test.is_true(errors.is(err, errors.INVALID))
        end)
        test.it("stops a run that reaches its deadline before a stage starts", function()
            local who = "caller-" .. uuid.v4()
            local config = defaults()
            local field = assert(json.decode(assert(registry.get("kickside.docscout:config_schema")).data.schema_json)).properties.fields.items.default
            field.name = "total"
            config.fields = { field }
            local a = assert(caller(who):call("app:probe", { op = "create", input = { title = "Late reader", description = "", config = config } }))
            local _, err = caller(who):call("app:probe", { op = "contract_run", input =
                { extractor_id = a.component_id, upload_id = "upload-" .. uuid.v4(), caller = "ui", deadline = "2000-01-01T00:00:00Z" } })
            test.not_nil(err)
            test.is_true(errors.is(err, errors.TIMEOUT), tostring(err))
            local trace = (err :: any):details().trace
            test.eq(#trace, 1); test.eq(trace[1].kind, "read"); test.eq(trace[1].status, "failed")
            local _, malformed = caller(who):call("kickside.docscout:extraction_run",
                { extractor_id = a.component_id, upload_id = "u", caller = "eval", deadline = "tomorrow" })
            test.not_nil(malformed); test.is_true(errors.is(malformed, errors.INVALID), tostring(malformed))
        end)
        test.it("records a provider refusal in the failed step and persisted run", function()
            local who = "caller-" .. uuid.v4()
            local config = defaults()
            local field = assert(json.decode(assert(registry.get("kickside.docscout:config_schema")).data.schema_json)).properties.fields.items.default
            field.name = "total"; field.type = "number"; config.fields = { field }
            config.retrieval.embedding_model, config.retrieval.context, config.retrieval.search_mode = "class:docscout-success", "none", "keyword"
            config.stages.map.enabled, config.stages.scout.enabled, config.stages.deep.enabled = false, false, false
            config.stages.extract.model = "class:docscout-refusal"
            local created = assert(caller(who):call("app:probe", { op = "create", input = { title = "Reader", config = config } }))
            local mailbox = process.listen("docscout.runs." .. created.component_id)
            assert(process.registry.register("user." .. who))
            local upload_id = data.upload(who, "application/pdf", "Original bytes", "# Invoice\nThe total amount is 1250.")
            local value, err = caller(who):call("kickside.docscout:invoke", { extractor_id = created.component_id, upload_id = upload_id, caller = "ui" })
            local selected = channel.select({ mailbox:case_receive(), time.after("2s"):case_receive() })
            process.registry.unregister("user." .. who); process.unlisten(mailbox)
            test.eq(selected.channel, mailbox)
            test.is_nil(err, tostring(err)); test.not_nil(value)
            test.eq(selected.value.component_id, created.component_id); test.eq(selected.value.run_id, value.run_id)
            test.eq(value.status, "failed"); test.is_true(value.fields[1].failed)
            test.eq(value.fields[1].error.kind, errors.UNAVAILABLE)
            test.is_false(value.fields[1].error.retryable); test.eq(value.fields[1].error.details.code, "provider_refused")
            local details = { run_id = value.run_id, trace = value.trace }
            test.eq(value.error.details.code, "provider_refused")
            test.eq(details.trace[1].kind, "read"); test.eq(details.trace[1].status, "completed")
            test.eq(details.trace[#details.trace].kind, "extract"); test.eq(details.trace[#details.trace].status, "failed")
            local snapshot = assert(caller(who):call("app:probe", { op = "get", id = created.component_id }))
            test.eq(#snapshot.runs, 1); test.eq(snapshot.runs[1].id, details.run_id); test.eq(snapshot.runs[1].status, "failed")
            local db = assert(sql.get("app:db"))
            local dialect = assert(db:type()); db:release()
            if dialect == "sqlite" then
                data.execute("CREATE TRIGGER docscout_refuse_run BEFORE INSERT ON kickside_docscout_runs WHEN NEW.user_id='" .. who
                    .. "' BEGIN SELECT RAISE(ABORT,'fixture_run_refused'); END")
            else
                data.execute("CREATE FUNCTION docscout_refuse_run() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN IF NEW.user_id='" .. who
                    .. "' THEN RAISE EXCEPTION USING ERRCODE='42501', MESSAGE='fixture_run_refused'; END IF; RETURN NEW; END $$")
                data.execute("CREATE TRIGGER docscout_refuse_run BEFORE INSERT ON kickside_docscout_runs FOR EACH ROW EXECUTE FUNCTION docscout_refuse_run()")
            end
            local secondary_value, secondary = caller(who):call("kickside.docscout:invoke",
                { extractor_id = created.component_id, upload_id = upload_id, caller = "ui" })
            if dialect == "sqlite" then data.execute("DROP TRIGGER docscout_refuse_run")
            else
                data.execute("DROP TRIGGER docscout_refuse_run ON kickside_docscout_runs")
                data.execute("DROP FUNCTION docscout_refuse_run()")
            end
            test.is_nil(secondary_value); test.not_nil(secondary)
            test.eq(secondary:details().operation_error.kind, errors.UNAVAILABLE)
            test.is_false(secondary:details().operation_error.retryable)
            test.eq(secondary:details().operation_error.details.code, "provider_refused")
        end)
        test.it("declares complete extraction and Block result schemas", function()
            local definition = assert(registry.get("kickside.docscout:extraction"))
            local method = definition.data.methods[1]
            local input = assert(json.decode(method.input_schemas[1].definition))
            test.eq(input.properties.caller.enum[1], "ui")
            local output = assert(json.decode(method.output_schemas[1].definition))
            test.not_nil(output.properties.fields.items.properties.evidence.items.properties.quote)
            test.not_nil(output.properties.trace.items.properties.status)
            test.eq(output.properties.values.type, "object")
            test.eq(output.properties.fields.items.properties.path.type, "string")
            for _, key in ipairs({ "config_revision", "status", "duration_ms", "tokens" }) do test.not_nil(output.properties[key]) end
            local block = assert(registry.get("kickside.docscout.blocks:extract"))
            test.not_nil(block.data.block.output.properties.fields.items.properties.evidence.items)
            test.eq(block.data.block.output.properties.fields.items.properties.path.type, "string")
            test.eq(block.data.block.output.properties.values.type, "object")
        end)
        test.it("refuses a Block run without an extractor or an upload", function()
            local who = "caller-" .. uuid.v4()
            local _, no_extractor = caller(who):call("kickside.docscout.blocks:extract_run", { config = {}, input = { upload_id = "u" } })
            test.not_nil(no_extractor)
            local _, no_upload = caller(who):call("kickside.docscout.blocks:extract_run", { config = { extractor_id = "x" }, input = {} })
            test.not_nil(no_upload)
            local block = assert(registry.get("kickside.docscout.blocks:extract"))
            test.eq(block.data.block.execution.function_id, "kickside.docscout.blocks:extract_run")
            test.eq(block.data.block.config.properties.extractor_id.class, "kickside.docscout")
        end)
    end)
end) }
