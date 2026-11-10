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
        test.it("admits fifty fields and twenty-one sections without enums or schema references", function()
            local names = {}
            for n = 1, 50 do names[n] = "f" .. n end
            local run = run_for(names)
            run.config.stages.map.model = MODEL .. "-budget"
            for n = 4, 21 do
                run.document.outline[n] = { id = "s" .. n, title = "Section " .. n, level = 1,
                    path = "Section " .. n, chunk_start = n + 2, chunk_end = n + 2, tokens = 20 }
            end
            local step = { meter = ai.meter() }
            local err = stages.map(run, step)
            test.is_nil(err, tostring(err))
            test.eq(#step.queries, 50)
            for _, name in ipairs(names) do test.eq(json.encode(run.regions[name]), "[1,2]") end
        end)
        test.it("maps section ordinals to their ids and chunk regions", function()
            local run = run_for({ "terms.price" })
            run.config.stages.map.model = MODEL .. "-maximum"
            run.document.outline[1].id, run.document.outline[3].id = "appendix", "terms"
            local step = { meter = ai.meter() }
            local err = stages.map(run, step)
            test.is_nil(err, tostring(err))
            test.eq(json.encode(run.regions["terms.price"]), "[4,5]")
            test.eq(step.queries[1], "terms.price → terms")
        end)
        for _, mode in ipairs({ "below", "above", "fractional" }) do
            test.it("rejects a " .. mode .. " section ordinal without assigning regions", function()
                local run = run_for({ "parties.buyer", "terms.price" })
                run.config.stages.map.model = MODEL .. "-" .. mode
                local step = { meter = ai.meter() }
                local err = stages.map(run, step)
                test.not_nil(err)
                test.eq((err :: any):kind(), errors.UNAVAILABLE)
                test.is_false((err :: any):retryable())
                test.contains(tostring(err), "does not match its schema")
                test.is_nil(next(run.regions))
                test.is_nil(step.queries)
            end)
        end
        test.it("names the field a reply leaves without sections", function()
            local run = run_for({ "parties.buyer", "terms.unanswered" })
            local err = stages.map(run, { meter = ai.meter() })
            test.not_nil(err)
            test.eq((err :: any):kind(), errors.UNAVAILABLE)
            test.is_false((err :: any):retryable())
            test.contains(tostring(err), "terms.unanswered")
            test.is_nil(run.regions["parties.buyer"], "a partial choice selects no regions")
        end)
    end)
end) }
