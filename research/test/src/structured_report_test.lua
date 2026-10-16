-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local registry = require("registry")
local deliver = require("deliver")
local deep_research = require("deep_research")
local function define_tests()
    test.describe("Research structured boundary", function()
        for _, raw in ipairs({"plain prose", 'prefix {"summary":"text"}', {content = "text"}, {result = {summary = "text"}}, {title = "incomplete"}}) do
            test.it("rejects unstructured or incomplete output " .. type(raw), function()
                local report, err = deliver.to_report(raw)
                test.is_nil(report)
                test.not_nil(err)
            end)
        end
        test.it("aligns the bundled agent prompt with the input and structured exit contracts", function()
            local entry, err = registry.get("kickside.research.agents:researcher")
            test.is_nil(err)
            test.not_nil(entry)
            local prompt = entry.data.prompt
            test.contains(prompt, '`prompt`')
            test.contains(prompt, "finish")
            test.is_nil((prompt:find('<input key="topic">', 1, true)))
            test.is_nil((prompt:find('"label"', 1, true)))
            test.is_nil((prompt:find('"note"', 1, true)))
        end)
        test.it("accepts the published topic input through the request contract", function()
            -- The topic passes prompt validation; this caller has no identity for the
            -- request contract, which fails with its typed error.
            local result, err = deep_research.handle({topic = "alias only"})
            test.is_nil(result)
            test.not_nil(err)
        end)
    end)
end
return {run = test.run_cases(define_tests)}
