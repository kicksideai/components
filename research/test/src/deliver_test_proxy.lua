-- Tests the deliver terminal nodes: structured report validation, url extraction, markdown
-- rendering, the fail-closed guard on a blank report, and the exact thread-append
-- payloads for RESULT / FAILED. The funcs seam is swapped for a recording stub via
-- deliver._modules for the duration of each case (the block_signal seam pattern).

local test = require("test")
local json = require("json")
local deliver = require("deliver")
local consts = require("research_consts")

local function with_funcs(handler_result: any, handler_err: any, fn: any)
    local calls = {}
    deliver._modules.funcs = {
        new = function()
            return {
                call = function(_self: any, id: any, args: any)
                    calls[#calls + 1] = { id = id, args = args }
                    return handler_result, handler_err
                end,
            }
        end,
    }
    local ok, err = pcall(fn, calls)
    deliver._modules.funcs = nil
    if not ok then error(err, 0) end
end

local META = { research_id = "r1", thread_id = "thread-1" }

local function define_tests()
    test.describe("Research deliver formatting", function()
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

    test.describe("Research deliver terminal", function()
        test.it("preserves the requested terminal text in a structured report", function()
            with_funcs({ ok = true }, nil, function(calls)
                local raw = {title = "Northwind", summary = "47 crates and 12 reserve crates.\n\nNORTHWIND-RESEARCH-READY", key_points = {"59 total"}, sources = {}}
                local res, err = deliver.handler({ report = raw, meta = META })
                test.is_nil(err)
                test.is_true(res.delivered)
                local markdown = calls[1].args.event.body.markdown
                test.contains(markdown, "# Northwind")
                test.contains(markdown, "59 total")
                test.contains(markdown, "NORTHWIND-RESEARCH-READY")
            end)
        end)
        test.it("preserves braces and quotes in a structured summary", function()
            with_funcs({ok = true}, nil, function(calls)
                local res, err = deliver.handler({report = {title = "Escaping", summary = 'Use }stock and quote "reserve".\nTERMINAL-MARKER', key_points = {}, sources = {}}, meta = META})
                test.is_nil(err)
                test.is_true(res.delivered)
                test.contains(calls[1].args.event.body.markdown, 'Use }stock and quote "reserve".\nTERMINAL-MARKER')
            end)
        end)
        test.it("preserves the requested marker in every report field through RESULT delivery", function()
            with_funcs({ ok = true }, nil, function(calls)
                local res, err = deliver.handler({
                    report = {title = "TITLE-MARKER", summary = "SUMMARY-MARKER", key_points = {"NORTHWIND-RESEARCH-READY"}, sources = {{url = "https://example.test/SOURCE-MARKER", title = "Source"}}},
                    meta = META,
                })
                test.is_nil(err)
                test.is_true(res.delivered)
                local markdown = calls[1].args.event.body.markdown
                for _, marker in ipairs({ "TITLE-MARKER", "SUMMARY-MARKER", "NORTHWIND-RESEARCH-READY", "SOURCE-MARKER" }) do
                    test.contains(markdown, marker)
                end
                test.eq(calls[1].args.event.type, consts.EVENT.RESULT)
            end)
        end)
        test.it("appends a RESULT event carrying the rendered markdown and urls", function()
            with_funcs({ ok = true }, nil, function(calls)
                local res, err = deliver.handler({
                    report = { title = "Topic", summary = "A summary.", key_points = {}, sources = {{url = "https://x", title = "X"}} },
                    meta = META,
                })
                test.is_nil(err)
                test.eq(res.delivered, true)
                test.eq(res.thread_id, "thread-1")
                test.eq(#calls, 1)
                test.eq(calls[1].id, consts.THREADS_APPEND_EVENT)
                local args = calls[1].args
                test.eq(args.thread_id, "thread-1")
                test.eq(args.event.type, consts.EVENT.RESULT)
                test.eq(args.event.role, "assistant")
                test.is_true(args.event.body.markdown:find("# Topic", 1, true) ~= nil)
                test.eq(args.event.body.urls[1], "https://x")
                test.eq(args.event.content.content_type, "text/markdown")
                test.eq(args.event.content.content_bytes, #args.event.body.markdown)
            end)
        end)

        test.it("rejects a bare markdown string without writing a result", function()
            with_funcs({ ok = true }, nil, function(calls)
                local res, err = deliver.handler({ report = "# Findings\n\nProse only.", meta = META })
                test.is_nil(res)
                test.contains(err, deliver.NO_REPORT)
                test.eq(#calls, 0)
            end)
        end)

        local blank_reports: { { name: string, report: any } } = {
            { name = "an empty string", report = "" },
            { name = "whitespace", report = "  \n\t " },
            { name = "nil", report = nil },
            { name = "an empty table", report = {} },
            { name = "an empty content wrapper", report = { content = "" } },
            { name = "a whitespace summary", report = { summary = "   " } },
            { name = "an empty key_points list", report = { key_points = {} } },
        }
        for _, case in ipairs(blank_reports) do
            test.it("fails closed on " .. case.name .. " without touching the thread", function()
                with_funcs({ ok = true }, nil, function(calls)
                    local res, err = deliver.handler({ report = case.report, meta = META })
                    test.is_nil(res)
                    test.contains(err, deliver.NO_REPORT)
                    test.eq(#calls, 0)
                end)
            end)
        end

        test.it("surfaces the agent's structured error when it produced no report", function()
            with_funcs({ ok = true }, nil, function(calls)
                local res, err = deliver.handler({
                    report = { success = false, error = "No result produced" },
                    meta = META,
                })
                test.is_nil(res)
                test.eq(err, deliver.NO_REPORT .. ": No result produced")
                test.eq(#calls, 0)
            end)
        end)

        test.it("fails when the run has no thread to deliver to", function()
            with_funcs({ ok = true }, nil, function(calls)
                local res, err = deliver.handler({ report = {title = "Result", summary = "ok", key_points = {}, sources = {}}, meta = {} })
                test.is_nil(res)
                test.eq(err, "research result has no thread_id")
                test.eq(#calls, 0)
            end)
        end)

        test.it("returns the append failure instead of reporting delivery", function()
            with_funcs(nil, "thread is read-only", function(calls)
                local res, err = deliver.handler({ report = {title = "Result", summary = "ok", key_points = {}, sources = {}}, meta = META })
                test.is_nil(res)
                test.eq(err, "could not append research result: thread is read-only")
                test.eq(#calls, 1)
            end)
        end)
    end)

    test.describe("Research deliver_error terminal", function()
        test.it("appends a FAILED event from a plain error string", function()
            with_funcs({ ok = true }, nil, function(calls)
                local res, err = deliver.error_handler({ error = "  agent exploded  ", meta = META })
                test.is_nil(err)
                test.eq(res.failed, true)
                test.eq(res.delivered, false)
                test.eq(res.error, "agent exploded")
                test.eq(#calls, 1)
                local args = calls[1].args
                test.eq(args.thread_id, "thread-1")
                test.eq(args.event.type, consts.EVENT.FAILED)
                test.eq(args.event.body.error, "agent exploded")
                test.eq(args.event.content.content_bytes, #"agent exploded")
            end)
        end)

        test.it("uses the message of a structured dataflow error", function()
            with_funcs({ ok = true }, nil, function(calls)
                local res, err = deliver.error_handler({
                    error = { code = "FUNCTION_EXECUTION_FAILED", message = deliver.NO_REPORT },
                    meta = META,
                })
                test.is_nil(err)
                test.eq(res.error, deliver.NO_REPORT)
                test.eq(calls[1].args.event.body.error, deliver.NO_REPORT)
            end)
        end)

        test.it("falls back to the error code when a structured error has no message", function()
            with_funcs({ ok = true }, nil, function(calls)
                local res = deliver.error_handler({ error = { code = "AGENT_EXEC_FAILED" }, meta = META })
                test.eq(res.error, "AGENT_EXEC_FAILED")
                test.eq(calls[1].args.event.body.error, "AGENT_EXEC_FAILED")
            end)
        end)

        test.it("records a generic reason when the error carries nothing usable", function()
            with_funcs({ ok = true }, nil, function(calls)
                local res = deliver.error_handler({ error = {}, meta = META })
                test.eq(res.error, "research failed")
                test.eq(calls[1].args.event.body.error, "research failed")
            end)
        end)

        test.it("fails when the run has no thread to record the failure on", function()
            with_funcs({ ok = true }, nil, function(calls)
                local res, err = deliver.error_handler({ error = "boom", meta = {} })
                test.is_nil(res)
                test.eq(err, "research failure has no thread_id: boom")
                test.eq(#calls, 0)
            end)
        end)

        test.it("returns the append failure so the dataflow records it", function()
            with_funcs(nil, "thread is read-only", function(calls)
                local res, err = deliver.error_handler({ error = "boom", meta = META })
                test.is_nil(res)
                test.eq(err, "could not append research failure (boom): thread is read-only")
                test.eq(#calls, 1)
            end)
        end)
    end)
end

local run_cases = test.run_cases(define_tests)
return { run = function(o) return run_cases(o) end }
