-- Test implementation of the kickside.research:request contract: it records a
-- completed run (request + result events) on a fresh thread under the caller and
-- answers like the production request, so DeepResearch reads a finished report.
local crypto = require("crypto")
local funcs = require("funcs")
local security = require("security")
local repo = require("repo")

local function report_for(prompt: string): string
    return "# " .. prompt .. "\n\n漢字 and emoji 😀 survive.\n\n" .. string.rep("detail-λ ", 6000)
end

local function request(args: any): (any, string?)
    local thread_id = crypto.random.uuid()
    local research_id = "research-" .. thread_id
    local actor = security.actor()
    local exec = funcs.new():with_actor(actor):with_scope(security.scope())
    local _, create_err = exec:call("kickside.core.threads:create_method", {
        id = thread_id, impl_id = "kickside.research:research_kind", thread_class = "kickside.research",
    })
    if create_err then return { ok = false }, tostring(create_err) end
    local request_err = repo.apply(thread_id, { type = "kickside.research.events:request", body = {
        research_id = research_id, actor_id = actor:id(), prompt = args.prompt,
    } })
    if request_err then return { ok = false }, tostring(request_err) end
    local result_err = repo.apply(thread_id, { type = "kickside.research.events:result", body = { markdown = report_for(args.prompt) } })
    if result_err then return { ok = false }, tostring(result_err) end
    return { ok = true, research_id = research_id, thread_id = thread_id, status = "running" }, nil
end

return { request = request, report_for = report_for }
