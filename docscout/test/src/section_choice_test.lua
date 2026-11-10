-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Map's section choice under a schema-constrained decoder: the reply carries one
-- section list per "search within sections" field.
local test = require("test")
local registry = require("registry")
local json = require("json")
local ai = require("ai")
local stages = require("stages")

local MODEL = "class:docscout-constrained"

local function schema(): any
    return assert(json.decode(assert(registry.get("kickside.docscout:config_schema")).data.schema_json))
end
local function run_for(names: { string }): any
    local cfg = schema().default
    cfg.fields = {}
    for _, path in ipairs(names) do
        local group, name = path:match("^(.*)%.([^.]+)$")
        local f = schema().properties.fields.items.default
        f.name, f.group, f.type, f.search_within = name or path, group or "", "text", "sections"
        cfg.fields[#cfg.fields + 1] = f
    end
    cfg.stages.map.model, cfg.stages.map.section_summaries = MODEL, false
    local outline = {
        { id = "s1", level = 1, title = "Parties", path = "Parties", chunk_start = 1, chunk_end = 2, tokens = 40 },
        { id = "s2", level = 1, title = "Terms", path = "Terms", chunk_start = 3, chunk_end = 3, tokens = 20 },
        { id = "s3", level = 1, title = "Schedule", path = "Schedule", chunk_start = 4, chunk_end = 5, tokens = 30 },
    }
    return { config = cfg, document = { id = "document", outline = outline }, regions = {}, values = {} }
end

return { run = test.run_cases(function()
    test.describe("Section choice", function()
        test.it("selects a region for every sections field under a constrained decoder", function()
            local run = run_for({ "parties.buyer", "parties.seller", "terms.price" })
            local step = { meter = ai.meter() }
            local err = stages.map(run, step)
            test.is_nil(err, tostring(err))
            for _, path in ipairs({ "parties.buyer", "parties.seller", "terms.price" }) do
                test.not_nil(run.regions[path], path)
                test.eq(run.regions[path][1], 1)
            end
            test.eq(#step.queries, 3)
        end)
        test.it("names the field a reply leaves without sections", function()
            local run = run_for({ "parties.buyer", "terms.unanswered" })
            local err = stages.map(run, { meter = ai.meter() })
            test.not_nil(err)
            test.eq((err :: any):kind(), errors.UNAVAILABLE)
            test.is_true((err :: any):retryable())
            test.contains(tostring(err), "terms.unanswered")
            test.is_nil(run.regions["parties.buyer"], "a partial choice selects no regions")
        end)
    end)
end) }
