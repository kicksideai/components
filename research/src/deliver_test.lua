-- Tests the deliver node's pure shaping: structured report validation, source-url extraction, and markdown rendering. The
-- thread append + read-model patch side effects are exercised in the live app.

local test = require("test")
local deliver = require("deliver")

local function define_tests()
    test.describe("Research deliver", function()
        test.it("normalizes a structured report object", function()
            local r = deliver.to_report({ title = "Solar in 2026", summary = "Solar grew fast.", key_points = { "a", "b" }, sources = {} })
            test.eq(r.title, "Solar in 2026")
            test.eq(r.summary, "Solar grew fast.")
            test.eq(r.key_points[1], "a")
        end)

        test.it("rejects a JSON-string report with noise around it", function()
            local r, err = deliver.to_report('noise before {"summary":"From a string."} trailing')
            test.is_nil(r)
            test.not_nil(err)
        end)
        test.it("rejects a content-wrapped agent output", function()
            local r, err = deliver.to_report({content = '{"title":"Wrapped","summary":"Inner summary."}'})
            test.is_nil(r)
            test.not_nil(err)
        end)
        test.it("rejects bare prose", function()
            local r, err = deliver.to_report("just prose")
            test.is_nil(r)
            test.not_nil(err)
        end)
        test.it("extracts urls from structured sources", function()
            local urls = deliver.urls_of({sources = {{url = "https://a", title = "A"}, {url = "https://b", title = "B"}}})
            test.eq(#urls, 2)
            test.eq(urls[1], "https://a")
            test.eq(urls[2], "https://b")
        end)

        test.it("renders markdown with title, key points and sources", function()
            local md = deliver.render_markdown({
                title = "Topic",
                summary = "A summary.",
                key_points = { "one", "two" },
                sources = { { url = "https://x", title = "X" } },
            })
            test.is_true(md:find("# Topic", 1, true) ~= nil)
            test.is_true(md:find("## Key points", 1, true) ~= nil)
            test.is_true(md:find("- one", 1, true) ~= nil)
            test.is_true(md:find("https://x", 1, true) ~= nil)
        end)
    end)
end

local run_cases = test.run_cases(define_tests)
return { run = function(o) return run_cases(o) end }
