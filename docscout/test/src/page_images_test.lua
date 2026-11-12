-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local data = require("data")
local registry = require("registry")
local json = require("json")
local uuid = require("uuid")

return { run = test.run_cases(function()
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
