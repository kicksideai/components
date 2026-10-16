-- DeepResearch returns the whole completed report (through a test binding of the
-- kickside.research:request contract), and report_progress records the agent's
-- progress fields as given.
local crypto = require("crypto")
local json = require("json")
local registry = require("registry")
local funcs = require("funcs")
local repo = require("repo")
local security = require("security")
local request_stub = require("request_stub")
local test = require("test")

local function executor(owner: string)
    return funcs.new():with_actor(security.new_actor(owner, { security_groups = { "app:member" } }))
        :with_scope(security.named_scope("app:member"))
end

local function stored_run(report: string?): (any, string)
    local thread_id = crypto.random.uuid()
    local owner = "research-report-owner-" .. thread_id
    local execute = executor(owner)
    local _, create_err = execute:call("kickside.core.threads:create_method", {
        id = thread_id, impl_id = "kickside.research:research_kind", thread_class = "kickside.research",
    })
    test.is_nil(create_err, tostring(create_err))
    test.is_nil(repo.apply(thread_id, { type = "kickside.research.events:request", body = {
        research_id = "research-" .. thread_id, actor_id = owner, prompt = "Stored report",
    } }))
    if report then
        test.is_nil(repo.apply(thread_id, { type = "kickside.research.events:result", body = { markdown = report } }))
    end
    return execute, thread_id
end

local function define_tests()
    test.describe("Deep Research tool shapes", function()
        test.it("publishes valid input and output schemas for tool discovery", function()
            local entry, lookup_err = registry.get("kickside.research.traits:deep_research")
            test.is_nil(lookup_err, tostring(lookup_err))
            local input, input_err = json.decode(entry.meta.input_schema)
            test.is_nil(input_err, tostring(input_err))
            test.eq(input.required[1], "prompt")
            test.is_nil(input.properties.thread_id)
            test.is_nil(input.properties.report_limit)
            local output, output_err = json.decode(entry.meta.output_schema)
            test.is_nil(output_err, tostring(output_err))
            test.eq(output.properties.report.type, "string")
            test.is_nil(output.properties.next_offset)
        end)

        test.it("returns the whole completed report through the request contract", function()
            local execute = executor("research-report-owner-" .. crypto.random.uuid())
            local result, err = execute:call("kickside.research.traits:deep_research", { prompt = "Northwind returns policy" })
            test.is_nil(err, tostring(err))
            test.eq(result.success, true, tostring(result.error))
            test.eq(result.status, "complete")
            test.not_nil(result.thread_id)
            test.eq(result.report, request_stub.report_for("Northwind returns policy"))
        end)

        test.it("returns a missing prompt as a failed envelope", function()
            local execute = executor("research-report-owner-" .. crypto.random.uuid())
            local result, err = execute:call("kickside.research.traits:deep_research", {})
            test.is_nil(err, tostring(err))
            test.eq(result.success, false)
            test.eq(result.error, "prompt is required")
        end)

        test.it("records every progress field as reported", function()
            local execute, thread_id = stored_run(nil)
            local findings = {}
            for index = 1, 30 do findings[index] = string.rep("finding-" .. tostring(index) .. " ", 80) end
            local step = string.rep("checking primary sources ", 100)
            local recorded, record_err = execute:with_context({ research_thread_id = thread_id })
                :call("kickside.research:report_progress", { step = step, status = "working", findings = findings, eta = "soon" })
            test.is_nil(record_err, tostring(record_err))
            test.eq(recorded.success, true, tostring(recorded.error))
            local listed, list_err = execute:call("kickside.core.threads:list_events_method", { thread_id = thread_id, ascending = true, limit = 50 })
            test.is_nil(list_err, tostring(list_err))
            local progress = nil
            for _, event in ipairs(listed.events) do
                if event.type == "kickside.research.events:progress" then progress = event end
            end
            test.not_nil(progress)
            local body = type(progress.body) == "string" and json.decode(progress.body) or progress.body
            test.eq(body.step, (step:gsub("%s+$", "")))
            test.eq(#body.findings, 30)
            test.eq(body.findings[30], findings[30])
        end)
    end)
end

return { run = test.run_cases(define_tests) }
