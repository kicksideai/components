-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local json = require("json")
local registry = require("registry")
local stages = require("stages")
local shapes = require("shapes")
local ai = require("ai")

local function field(name: string, kind: string): any
    local f = assert(json.decode(assert(registry.get("kickside.docscout:config_schema")).data.schema_json)).properties.fields.items.default
    f.name, f.type = name, kind
    return f
end
local function run(fields: { any }, populated: boolean): any
    local pool = shapes.pool()
    if populated then shapes.add(pool, { { ordinal = 1, content = "The total amount is 1250.", heading_path = "Payment" } }) end
    return { pool = pool, regions = {}, notes = {}, analyses = {}, values = {}, config = { fields = fields,
        stages = { extract = { model = "class:docscout-reply-budget", max_fields_per_call = 20, max_output_tokens = 256 } } } }
end
local function large(): any
    local f = field("rows", "list")
    f.item = { type = "object", properties = {} }
    for i = 1, 20 do f.item.properties[i] = { name = "column" .. i, type = "text" } end
    return f
end

return { run = test.run_cases(function()
    test.describe("Reply batching", function()
    test.it("splits combined replies that truncate while each field succeeds alone", function()
        local r = run({ field("first", "text"), field("second", "text") }, true)
        local step = { meter = ai.meter() }
        test.is_nil(stages.extract(r, step))
        test.eq(#r.values, 2)
        for _, v in ipairs(r.values) do test.is_false(v.failed); test.is_false(v.missing); test.eq(v.value, "Fixture") end
        test.eq(#step.meter.calls, 2)
        for _, call in ipairs(step.meter.calls) do test.eq(#call.fields, 1) end
    end)
    test.it("sends an oversized estimated shape alone and accepts its short actual reply", function()
        local r = run({ large(), field("total", "number") }, true)
        local step = { meter = ai.meter() }
        test.is_nil(stages.extract(r, step))
        test.eq(#r.values, 2); test.eq(#step.meter.calls, 2)
        test.is_false(r.values[1].failed); test.is_false(r.values[1].missing)
        test.eq(r.values[1].value[1].column20, "Fixture"); test.eq(r.values[2].value, 1250)
    end)
    test.it("preserves missing for an oversized estimated field with no passages", function()
        local r = run({ large() }, false)
        local step = { meter = ai.meter() }
        test.is_nil(stages.extract(r, step))
        test.eq(#step.meter.calls, 0); test.eq(#r.values, 1)
        test.is_true(r.values[1].missing); test.is_false(r.values[1].failed)
        test.eq(r.values[1].codes[1], "no_passage")
    end)
    test.it("retains the existing truncation classification for an underestimated reply", function()
        local r = run({ field("truncated_reply", "text") }, true)
        test.not_nil(stages.extract(r, { meter = ai.meter() }))
        test.is_true(r.values[1].failed)
        test.eq(r.values[1].error.details.code, "structured_reply_truncated")
    end)
    end)
end) }
