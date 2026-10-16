-- Tests the Research Block arm/resume lifecycle. Every
-- externally-callable dependency (contract, security, funcs, the
-- correlation repo) is swapped for a recording stub via block_signal._modules for
-- the duration of each case, then restored -- mirrors
-- platform/automation/src/automation_test.lua's with_loaded_modules seam. No real
-- contract dispatch, funcs call, or SQL is exercised here.

local test = require("test")
local block_signal = require("block_signal")

local function make_repo()
    local repo: any = {
        rows = {},
        insert_calls = {},
        mark_calls = {},
    }
    repo.get_by_research_id = function(research_id: any): (any?, string?)
        local row = repo.rows[research_id]
        if not row then return nil, nil end
        return row, nil
    end
    repo.insert = function(row: any): string?
        repo.insert_calls[#repo.insert_calls + 1] = row
        if repo.rows[row.research_id] == nil then
            repo.rows[row.research_id] = {
                research_id = row.research_id,
                thread_id = row.thread_id,
                dataflow_id = row.dataflow_id,
                signal_id = row.signal_id,
                status = row.status,
                terminal_event_id = "",
            }
        end
        return nil
    end
    repo.mark_resumed = function(research_id: any, status: any, terminal_event_id: any): (boolean, string?)
        repo.mark_calls[#repo.mark_calls + 1] = { research_id = research_id, status = status, terminal_event_id = terminal_event_id }
        local row = repo.rows[research_id]
        if not row or row.status ~= "waiting" then return false, nil end
        row.status = status
        row.terminal_event_id = terminal_event_id
        return true, nil
    end
    return repo
end

local function make_contract(thread_id: string, request_calls: any)
    return {
        get = function(_id: any): (any?, string?)
            return {
                with_actor = function(self: any): any return self end,
                with_scope = function(self: any): any return self end,
                open = function(_self: any): (any?, string?)
                    return {
                        request = function(_self2: any, args: any): (any?, string?)
                            request_calls[#request_calls + 1] = args
                            return { ok = true, research_id = args.research_id, thread_id = thread_id, status = "running" }, nil
                        end,
                    }, nil
                end,
            }, nil
        end,
    }
end

local function make_security()
    return {
        actor = function(): any return { id = function(): any return "actor-1" end } end,
        scope = function(): any return {} end,
    }
end

local function make_funcs(calls: any)
    return {
        new = function(): any
            return {
                call = function(_self: any, target: any, args: any): (any?, string?)
                    calls[#calls + 1] = { target = target, args = args }
                    return { ok = true }, nil
                end,
            }
        end,
    }
end

local function define_tests()
    test.describe("Research Block Signal", function()
        test.it("arm starts a research run, builds the request args, and persists correlation", function()
            local repo = make_repo()
            local request_calls: any = {}
            local register_calls: any = {}
            block_signal._modules = {
                repo = repo,
                contract = make_contract("thread-1", request_calls),
                security = make_security(),
                funcs = make_funcs(register_calls),
            }

            local result, err = block_signal.arm({
                dataflow_id = "df-1",
                signal_id = "sig-1",
                node_id = "node-1",
                run_context = { workflow_id = "wf-1", run_id = "run-1" },
                input = { topic = "solar" },
                config = { agent_id = "agent-1", prompt = "Research solar power", max_iterations = 12 },
            })
            block_signal._modules = {}

            test.no_error(result, err)
            test.eq(result.ok, true)
            test.eq(result.research_id, "block:df-1:sig-1")
            test.eq(result.thread_id, "thread-1")

            test.eq(#request_calls, 1)
            test.eq(request_calls[1].agent_id, "agent-1")
            test.eq(request_calls[1].max_iterations, 12)
            test.eq(request_calls[1].research_id, "block:df-1:sig-1")
            test.contains(request_calls[1].prompt, "Research solar power")
            test.contains(request_calls[1].prompt, "topic: solar")
            test.eq(request_calls[1].ctx.block_signal.dataflow_id, "df-1")
            test.eq(request_calls[1].ctx.block_signal.signal_id, "sig-1")
            test.eq(request_calls[1].ctx.block_signal.run_context.workflow_id, "wf-1")
            test.eq(request_calls[1].ctx.block_signal.run_context.run_id, "run-1")
            test.eq(request_calls[1].ctx.block_signal.node_id, "node-1")

            test.eq(#repo.insert_calls, 1)
            test.eq(repo.insert_calls[1].status, "waiting")
            test.eq(repo.insert_calls[1].thread_id, "thread-1")

            test.eq(#register_calls, 1)
            test.eq(register_calls[1].target, "kickside.core.threads:register_projection_method")
            test.eq(register_calls[1].args.thread_id, "thread-1")
            test.eq(register_calls[1].args.worker_ref, "func://kickside.research:resume_research_block_signal")
            test.eq(register_calls[1].args.worker_input_mode, "prefetch_events")
            test.eq(register_calls[1].args.worker_config.research_id, "block:df-1:sig-1")
            test.is_nil(register_calls[1].args.start_at_head)
        end)

        test.it("arm is idempotent on re-entry (an engine retry never double-starts)", function()
            local repo = make_repo()
            local request_calls: any = {}
            local register_calls: any = {}
            block_signal._modules = {
                repo = repo,
                contract = make_contract("thread-2", request_calls),
                security = make_security(),
                funcs = make_funcs(register_calls),
            }

            local args = {
                dataflow_id = "df-2",
                signal_id = "sig-2",
                config = { agent_id = "agent-1", prompt = "Research wind power" },
            }
            local first, first_err = block_signal.arm(args)
            local second, second_err = block_signal.arm(args)
            block_signal._modules = {}

            test.no_error(first, first_err)
            test.no_error(second, second_err)
            test.eq(first.research_id, second.research_id)
            test.eq(first.thread_id, second.thread_id)
            test.eq(#request_calls, 1)
            test.eq(#repo.insert_calls, 1)
            test.eq(#register_calls, 1)
        end)

        test.it("arm fails closed without agent_id or prompt", function()
            local repo = make_repo()
            block_signal._modules = { repo = repo }

            local no_agent, agent_err = block_signal.arm({
                dataflow_id = "df-3", signal_id = "sig-3",
                config = { prompt = "no agent configured" },
            })
            local no_prompt, prompt_err = block_signal.arm({
                dataflow_id = "df-3b", signal_id = "sig-3b",
                config = { agent_id = "agent-1" },
            })
            block_signal._modules = {}

            test.has_error(no_agent, agent_err)
            test.contains(agent_err, "agent_id")
            test.has_error(no_prompt, prompt_err)
            test.contains(prompt_err, "prompt")
        end)

        test.it("resume_from_event resumes on a result event with a reference-only payload", function()
            local repo = make_repo()
            repo.rows["block:df-4:sig-4"] = {
                research_id = "block:df-4:sig-4", thread_id = "thread-4",
                dataflow_id = "df-4", signal_id = "sig-4", status = "waiting",
            }
            local resume_calls: any = {}
            block_signal._modules = {
                repo = repo,
                funcs = make_funcs(resume_calls),
            }

            local out = block_signal.resume_from_event({
                thread_id = "thread-4",
                events = {
                    { type = "kickside.research.events:result", id = "evt-1", seq = 3, body = { markdown = "# report" } },
                },
                range = { to_seq = 3 },
                projection = { body = { worker_config = { research_id = "block:df-4:sig-4" } } },
            })
            block_signal._modules = {}

            test.eq(#resume_calls, 1)
            test.eq(resume_calls[1].target, "kickside.blocks:resume")
            test.eq(resume_calls[1].args.dataflow_id, "df-4")
            test.eq(resume_calls[1].args.signal_id, "sig-4")
            local payload = resume_calls[1].args.payload
            test.eq(payload.outcome, "result")
            test.eq(payload.status, "complete")
            test.eq(payload.research_id, "block:df-4:sig-4")
            test.eq(payload.result_ref.event_type, "kickside.research.events:result")
            test.eq(payload.result_ref.thread_id, "thread-4")
            test.eq(payload.result_ref.event_id, "evt-1")
            test.eq(payload.result_ref.seq, 3)
            test.eq(payload.run_ref.api, "/research/block:df-4:sig-4/events")
            test.is_nil(payload.markdown)
            test.is_nil(payload.result_ref.markdown)

            test.eq(repo.rows["block:df-4:sig-4"].status, "resumed")
            test.eq(out.last_seq, 3)
        end)

        test.it("resume_from_event resumes on a failed event with the failed payload", function()
            local repo = make_repo()
            repo.rows["block:df-5:sig-5"] = {
                research_id = "block:df-5:sig-5", thread_id = "thread-5",
                dataflow_id = "df-5", signal_id = "sig-5", status = "waiting",
            }
            local resume_calls: any = {}
            block_signal._modules = {
                repo = repo,
                funcs = make_funcs(resume_calls),
            }

            block_signal.resume_from_event({
                thread_id = "thread-5",
                events = { { type = "kickside.research.events:failed", id = "evt-2", seq = 2, body = { error = "boom" } } },
                range = { to_seq = 2 },
                projection = { body = { worker_config = { research_id = "block:df-5:sig-5" } } },
            })
            block_signal._modules = {}

            test.eq(#resume_calls, 1)
            local payload = resume_calls[1].args.payload
            test.eq(payload.outcome, "failed")
            test.eq(payload.status, "failed")
            test.eq(payload.failed_ref.event_type, "kickside.research.events:failed")
            test.eq(payload.failed_ref.event_id, "evt-2")
            test.is_nil(payload.result_ref)
            test.eq(repo.rows["block:df-5:sig-5"].status, "failed")
        end)

        test.it("resume_from_event does not double-resume a duplicate terminal event", function()
            local repo = make_repo()
            repo.rows["block:df-6:sig-6"] = {
                research_id = "block:df-6:sig-6", thread_id = "thread-6",
                dataflow_id = "df-6", signal_id = "sig-6", status = "resumed",
                terminal_event_id = "evt-first",
            }
            local resume_calls: any = {}
            block_signal._modules = {
                repo = repo,
                funcs = make_funcs(resume_calls),
            }

            block_signal.resume_from_event({
                thread_id = "thread-6",
                events = { { type = "kickside.research.events:result", id = "evt-3", seq = 4 } },
                range = { to_seq = 4 },
                projection = { body = { worker_config = { research_id = "block:df-6:sig-6" } } },
            })
            block_signal._modules = {}

            test.eq(#resume_calls, 0)
            test.eq(repo.rows["block:df-6:sig-6"].terminal_event_id, "evt-first")
        end)

        test.it("keeps the correlation waiting when canonical Block resume fails", function()
            local repo = make_repo()
            repo.rows["block:df-7:sig-7"] = {
                research_id = "block:df-7:sig-7", thread_id = "thread-7",
                dataflow_id = "df-7", signal_id = "sig-7", status = "waiting",
            }
            block_signal._modules = {
                repo = repo,
                funcs = {
                    new = function()
                        return { call = function() return nil, "resume unavailable" end }
                    end,
                },
            }

            local ok, resume_err = pcall(function()
                block_signal.resume_from_event({
                    thread_id = "thread-7",
                    events = { { type = "kickside.research.events:result", id = "evt-4", seq = 1 } },
                    range = { to_seq = 1 },
                    projection = { body = { worker_config = { research_id = "block:df-7:sig-7" } } },
                })
            end)
            block_signal._modules = {}

            test.eq(ok, false)
            test.contains(tostring(resume_err), "resume unavailable")
            test.eq(repo.rows["block:df-7:sig-7"].status, "waiting")
        end)
    end)
end

local run_cases = test.run_cases(define_tests)
return { run = function(o) return run_cases(o) end }
