-- Tests the research Dataflow graph as compiled from the production builder: the
-- agent's normal edge feeds deliver, and BOTH the agent's and deliver's error edges
-- feed deliver_error, so a blank report or a rejected append ends on the research
-- thread as FAILED instead of leaving the run running forever.

local test = require("test")
local research_request = require("research_request")
local flow = require("flow")
local compiler = require("compiler")

local SPEC = {
    prompt = "Investigate this",
    agent_id = "kickside.research.agents:researcher",
    max_iterations = 5,
    research_id = "r1",
    thread_id = "thread-1",
    ctx = {},
}

local function build_graph(): any
    local builder = research_request.graph(flow.create(), SPEC)
    local graph, err = compiler.build_graph(builder.operations, {})
    test.is_nil(err, "graph compiles")
    test.not_nil(graph)
    local valid, verr = compiler.validate_graph(graph)
    test.is_nil(verr, "graph validates")
    test.eq(valid, true)
    return graph
end

local function node_by_name(graph: any, name: string): (string, any)
    local node_id, err = graph:resolve_reference(name)
    test.is_nil(err, "node " .. name .. " resolves")
    return node_id, graph.nodes[node_id]
end

local function edge_to(edges: any, target_id: string): any
    for _, edge in ipairs(edges or {}) do
        if edge.target_node_id == target_id then return edge end
    end
    return nil
end

local function terminal_edge(edges: any): any
    for _, edge in ipairs(edges or {}) do
        if edge.is_workflow_terminal then return edge end
    end
    return nil
end

local function request_fixture(last_seq: number, catch_err: string?, start_err: string?, terminal_err: string?): (any, any)
    local observed: any = { readable = false, started = false }
    local builder: any = {}
    for _, method in ipairs({ "with_metadata", "with_input", "agent", "as", "error_to", "to", "with_data", "func" }) do
        builder[method] = function() return builder end
    end
    builder.with_title = function(_, title)
        observed.title = title
        return builder
    end
    builder.start = function()
        observed.started = true
        test.is_true(observed.readable, "the request read model must exist before the agent starts")
        if start_err then return nil, start_err end
        return "flow-1", nil
    end
    local executor: any = {}
    executor.with_actor = function() return executor end
    executor.with_scope = function() return executor end
    executor.call = function(_, target: string, args: any)
        if target == "kickside.core.threads:upsert_method" then return { thread_id = "thread-1" }, nil end
        if target == "kickside.core.threads:append_event_method" then
            if args.event.type == "kickside.research.events:failed" and terminal_err then return nil, terminal_err end
            return { thread_id = "thread-1", inserted = 1, duplicates = 0, max_seq = 7 }, nil
        end
        if target == "kickside.core.threads:catch_up_projection_method" then
            observed.catch_args = args
            observed.readable = last_seq >= 7 and catch_err == nil
            return { last_seq = last_seq, event_count = 7, done = last_seq >= 7 }, catch_err
        end
        error("unexpected request operation " .. target)
    end
    local request = research_request.new({
        security = { actor = function() return { id = function() return "owner" end } end, scope = function() return {} end },
        funcs = { new = function() return executor end },
        flow = { create = function() return builder end },
    })
    return request, observed
end

local function define_tests()
    test.describe("Research dataflow graph", function()
        test.it("returns a research run only after its request is readable", function()
            local request, observed = request_fixture(7, nil)
            local result, err = request.request({ prompt = "Northwind", agent_id = "researcher", research_id = "run-1" })
            test.is_nil(err, tostring(err))
            test.is_true(result.ok)
            test.is_true(observed.started)
            test.eq(observed.catch_args.kind, "kickside.research:run")
        end)

        test.it("uses the complete prompt for the research title", function()
            local request, observed = request_fixture(7, nil)
            local prompt = "Research " .. string.rep("漢", 100)
            local result, err = request.request({ prompt = prompt, agent_id = "researcher", research_id = "run-complete-title" })
            test.is_nil(err, tostring(err))
            test.is_true(result.ok)
            test.eq(observed.title, "Research: " .. prompt)
        end)

        test.it("refuses a run whose request projection does not reach its event", function()
            local request, observed = request_fixture(6, nil)
            local result, err = request.request({ prompt = "Northwind", agent_id = "researcher", research_id = "run-2" })
            test.is_false(result.ok)
            test.not_nil(err)
            test.is_false(observed.started)
        end)

        test.it("preserves a request projection failure before starting the agent", function()
            local request, observed = request_fixture(7, "projection unavailable")
            local result, err = request.request({ prompt = "Northwind", agent_id = "researcher", research_id = "run-3" })
            test.is_false(result.ok)
            test.contains(tostring(err), "projection unavailable")
            test.is_false(observed.started)
        end)

        test.it("preserves a failed startup event append", function()
            local request = request_fixture(7, nil, "flow unavailable", "terminal append unavailable")
            local result, err = request.request({ prompt = "Northwind", agent_id = "researcher", research_id = "run-4" })
            test.is_false(result.ok)
            test.contains(tostring(err), "flow unavailable")
            test.contains(tostring(err), "terminal append unavailable")
        end)

        test.it("routes the agent result to deliver and the agent error to deliver_error", function()
            local graph = build_graph()
            local research_id, research = node_by_name(graph, "research")
            local deliver_id = node_by_name(graph, "deliver")
            local deliver_error_id = node_by_name(graph, "deliver_error")

            test.eq(research.node_type, "userspace.dataflow.node.agent:node")
            test.eq(research.config.agent, SPEC.agent_id)
            test.eq(graph.input_data.prompt, SPEC.prompt)
            test.eq(research.config.arena.max_iterations, 5)
            test.eq(research.config.arena.tool_calling, "any", "the agent finishes through its structured exit tool")
            local schema = research.config.arena.exit_schema
            test.not_nil(schema, "research enforces its report schema at the agent exit")
            test.eq(schema.type, "object")
            test.eq(schema.properties.title.type, "string")
            test.eq(schema.properties.summary.type, "string")
            test.eq(schema.properties.key_points.items.type, "string")
            test.eq(schema.properties.sources.items.type, "object")
            test.eq(#schema.required, 4)
            test.eq(research.config.arena.tools[1], "kickside.research:report_progress")
            test.eq(research.config.arena.context.research_thread_id, "thread-1")

            local edges = graph.edges[research_id]
            local report_edge = edge_to(edges.targets, deliver_id)
            test.not_nil(report_edge, "agent normal edge reaches deliver")
            test.eq(report_edge.input_key, "report")

            local error_edge = edge_to(edges.error_targets, deliver_error_id)
            test.not_nil(error_edge, "agent error edge reaches deliver_error")
            test.eq(error_edge.input_key, "error")
        end)

        test.it("routes a deliver failure to deliver_error and success to the workflow terminal", function()
            local graph = build_graph()
            local deliver_id, deliver = node_by_name(graph, "deliver")
            local deliver_error_id, deliver_error = node_by_name(graph, "deliver_error")

            test.eq(deliver.config.func_id, "kickside.research:deliver")
            test.eq(deliver.config.inputs.required[1], "report")
            test.eq(deliver.config.inputs.required[2], "meta")

            local edges = graph.edges[deliver_id]
            local error_edge = edge_to(edges.error_targets, deliver_error_id)
            test.not_nil(error_edge, "deliver error edge reaches deliver_error")
            test.eq(error_edge.input_key, "error")

            local success = terminal_edge(edges.targets)
            test.not_nil(success, "deliver success ends the workflow")
            test.eq(success.is_success, true)

            test.eq(deliver_error.config.func_id, "kickside.research:deliver_error")
            test.eq(deliver_error.config.inputs.required[1], "error")
            local fail = terminal_edge(graph.edges[deliver_error_id].targets)
            test.not_nil(fail, "deliver_error ends the workflow")
            test.eq(fail.is_success, false)
        end)

        test.it("feeds the correlation meta to both terminals", function()
            local graph = build_graph()
            local meta_source: any = nil
            for _, source in ipairs(graph.static_data_sources) do
                if type(source.data) == "table" and source.data.thread_id == "thread-1" then
                    meta_source = source
                end
            end
            test.not_nil(meta_source, "meta static data is declared")
            test.eq(meta_source.data.research_id, "r1")

            local routed: { [string]: string } = {}
            for _, route in ipairs(meta_source.routes) do
                routed[route.target_name] = route.input_key
            end
            test.eq(routed["deliver"], "meta")
            test.eq(routed["deliver_error"], "meta")
        end)
    end)
end

local run_cases = test.run_cases(define_tests)
return { run = function(o) return run_cases(o) end }
