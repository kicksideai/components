-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local data = require("data")
local json = require("json")
local registry = require("registry")
local fs = require("fs")
local canonical_json = require("canonical_json")
local baseline = require("baseline")

local function normalize(fields: { any }): { any }
    for _, f in ipairs(fields) do
        for _, e in ipairs(f.evidence) do e.chunk_id = nil end
    end
    return fields
end

return { run = test.run_cases(function()
    test.describe("Verification opt-out identity", function()
        for _, enabled in ipairs({ true, false }) do
            for _, policy in ipairs({ "absent", "false" }) do
                test.it("matches baseline requests and stored results with Verify " .. tostring(enabled) .. " and policy " .. policy, function()
                    local config_schema = assert(json.decode(assert(registry.get("kickside.docscout:config_schema")).data.schema_json))
                    local cfg = config_schema.default
                    cfg.fields = {}
                    for _, name in ipairs({ "accepted", "rejected", "missing_reply", "provider_failure" }) do
                        local f = assert(json.decode(assert(json.encode(config_schema.properties.fields.items.default))))
                        f.name, f.type, f.description, f.search_hints = name, "number", "Total amount", "total amount"
                        cfg.fields[#cfg.fields + 1] = f
                    end
                    cfg.retrieval.embedding_model, cfg.retrieval.context, cfg.retrieval.search_mode = "class:docscout-verification-identity", "none", "keyword"
                    cfg.stages.map.enabled, cfg.stages.scout.enabled, cfg.stages.deep.enabled = false, false, false
                    cfg.stages.extract.model, cfg.stages.extract.max_fields_per_call = "class:docscout-verification-identity", 1
                    cfg.stages.verify.enabled, cfg.stages.verify.check_support, cfg.stages.verify.check_quotes = enabled, true, true
                    cfg.stages.verify.model = "class:docscout-verification-identity"
                    if policy == "false" then cfg.stages.verify.check_completeness = false else cfg.stages.verify.check_completeness = nil end
                    local owner = "11111111-1111-4111-8111-111111111111"
                    local caller = data.caller(owner)
                    local id = assert(caller:call("app:probe", { op = "create", input = { title = "Identity reader", config = cfg } })).component_id
                    local upload = data.upload(owner, "application/pdf", "Original bytes", "# Invoice\nThe total amount is 1250.")
                    local storage = assert(fs.get("app:uploads"))
                    local _, write_err = storage:writefile("verification-requests.json", "[]")
                    test.is_nil(write_err)
                    local result = assert(caller:call("kickside.docscout:invoke", { extractor_id = id, upload_id = upload }))
                    local requests = assert(json.decode(assert(storage:readfile("verification-requests.json"))))
                    local snapshot = assert(caller:call("app:probe", { op = "get", id = id }))
                    local stored = snapshot.runs[1]
                    local calls, steps = {}, {}
                    for _, step in ipairs(result.trace) do
                        steps[#steps + 1] = { kind = step.kind, status = step.status, message = step.message,
                            input_tokens = step.input_tokens, output_tokens = step.output_tokens }
                        for _, call in ipairs(step.calls or {}) do
                            call.latency_ms = nil
                            calls[#calls + 1] = call
                        end
                    end
                    local actual = { requests = requests, calls = calls, steps = steps, status = result.status, tokens = result.tokens,
                        fields = normalize(result.fields), summary = result.summary, values = result.values,
                        stored = { status = stored.status, tokens = stored.tokens, result = stored.result } }
                    normalize(actual.stored.result.fields)
                    local expected = baseline.get()[tostring(enabled)]
                    test.eq(assert(canonical_json.encode(actual)), assert(canonical_json.encode(expected)))
                end)
            end
        end
    end)
end) }
