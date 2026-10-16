local test = require("test")
local security = require("security")
local funcs = require("funcs")
local crypto = require("crypto")
local registry = require("registry")
local repo = require("repo")

local function executor(id, thread_id)
    return funcs.new():with_actor(security.new_actor(id, { security_groups = { "app:member" } }))
        :with_scope(security.named_scope("app:member"))
        :with_context({ research_thread_id = thread_id })
end

local function cases()
    test.describe("Research component writers", function()
        test.it("stores the complete request title", function()
            local id = crypto.random.uuid()
            local prompt = "Research " .. string.rep("漢", 100)
            test.is_nil(repo.apply(id, { type = "kickside.research.events:request", body = {
                research_id = id, actor_id = "owner-" .. id, prompt = prompt,
            } }))
            local run, read_err = repo.get_by_thread(id)
            test.is_nil(read_err, tostring(read_err))
            test.eq(run.title, prompt)
        end)

        test.it("research readers honor READ grants and revocation on the run component", function()
            local id = crypto.random.uuid()
            local owner, reader, stranger = "owner-" .. id, "reader-" .. id, "stranger-" .. id
            local member = executor(owner, id)
            local _, create_err = member:call("kickside.core.threads:create_method", {
                id = id, impl_id = "kickside.research:research_kind", thread_class = "kickside.research" })
            test.is_nil(create_err, tostring(create_err))
            test.is_nil(repo.apply(id, { type = "kickside.research.events:request", body = {
                research_id = id, actor_id = owner, prompt = "Shared research" } }))
            local args = { research_id = id, thread_id = id }
            local owned, owned_err = member:call("app:access_probe", args)
            test.is_nil(owned_err)
            test.eq(owned.thread_id, id)
            local granted, grant_err = member:call("kickside.component.binding:grant_subtree_func", {
                root_component_id = id, subject = { subject_id = reader, subject_type = "user" }, access_mask = 1 })
            test.is_nil(grant_err, tostring(grant_err))
            test.is_true(granted.success, granted.error)
            local shared, shared_err = executor(reader, id):call("app:access_probe", args)
            test.is_nil(shared_err, tostring(shared_err))
            test.eq(shared.thread_id, id)
            test.eq(shared.run.research_id, id)
            test.eq(shared.summary.research_id, id)
            test.eq(shared.run.prompt, "Shared research")
            for _, row in ipairs(shared.rows) do
                test.is_nil(row.prompt)
                test.is_nil(row.result_md)
                test.is_nil(row.urls)
            end
            local visible = false
            for _, row in ipairs(shared.rows) do
                if row.research_id == id then visible = true end
            end
            test.is_true(visible, "READ grant does not list the shared run")
            local hidden, hidden_err = executor(stranger, id):call("app:access_probe", args)
            test.is_nil(hidden_err, tostring(hidden_err))
            test.is_nil(hidden.thread_id)
            test.is_nil(hidden.run)
            test.is_nil(hidden.summary)
            test.eq(#hidden.rows, 0)
            local revoked_grant, revoke_err = member:call("kickside.component.binding:revoke_subtree_func", {
                root_component_id = id, subject = { subject_id = reader, subject_type = "user" } })
            test.is_nil(revoke_err, tostring(revoke_err))
            test.is_true(revoked_grant.success, revoked_grant.error)
            local revoked, revoked_err = executor(reader, id):call("app:access_probe", args)
            test.is_nil(revoked_err)
            test.is_nil(revoked.thread_id)
            test.is_nil(revoked.run)
            test.is_nil(revoked.summary)
            test.eq(#revoked.rows, 0)
        end)

        test.it("continues research summary pages without returning report content", function()
            local owner = crypto.random.uuid()
            local member = executor(owner, nil)
            local ids = {}
            for index = 1, 3 do
                local id = crypto.random.uuid()
                ids[index] = id
                local _, err = member:call("kickside.core.threads:create_method", {
                    id = id, impl_id = "kickside.research:research_kind", thread_class = "kickside.research"})
                test.is_nil(err)
                test.is_nil(repo.apply(id, {type = "kickside.research.events:request", body = {
                    research_id = id, actor_id = owner, prompt = "Private prompt " .. index}}))
            end
            local first, first_err = member:call("app:access_probe", {research_id = ids[1], thread_id = ids[1], limit = 2})
            test.is_nil(first_err)
            test.eq(#first.rows, 2)
            test.eq(first.next_offset, 2)
            local last, last_err = member:call("app:access_probe", {research_id = ids[1], thread_id = ids[1], limit = 2, offset = first.next_offset})
            test.is_nil(last_err)
            test.eq(#last.rows, 1)
            test.is_nil(last.next_offset)
            test.is_nil(first.rows[1].prompt)
            test.not_nil(first.run.prompt)
        end)

        test.it("late progress preserves completed and failed research outcomes", function()
            for _, terminal in ipairs({ "result", "failed" }) do
                local id = crypto.random.uuid()
                test.is_nil(repo.apply(id, { type = "kickside.research.events:request", body = {
                    research_id = id, actor_id = "owner-" .. id, prompt = "Monotonic research" } }))
                test.is_nil(repo.apply(id, { type = "kickside.research.events:" .. terminal,
                    body = { markdown = "Terminal result", error = "Terminal failure" } }))
                local before, before_err = repo.get_by_thread(id)
                test.is_nil(before_err)
                test.is_nil(repo.apply(id, { type = "kickside.research.events:progress",
                    body = { step = "late progress", urls = { "https://example.com/late" } } }))
                local after, after_err = repo.get_by_thread(id)
                test.is_nil(after_err)
                test.eq(after.status, before.status)
                test.eq(after.latest_step, before.latest_step)
                test.eq(after.result_md, before.result_md)
                test.eq(#after.urls, #before.urls)
            end
        end)

        test.it("all producers have no publication policies and the member scope grants none", function()
            local actor = security.new_actor("research-member", { security_groups = { "app:member" } })
            local scope = security.named_scope("app:member")
            for _, name in ipairs({ "request_func", "report_progress", "deliver", "deliver_error" }) do
                local entry, err = registry.get("kickside.research:" .. name)
                test.is_nil(err)
                local data = entry.data or entry
                for _, policy in ipairs(data.security and data.security.policies or {}) do
                    local definition, policy_err = registry.get(policy)
                    test.is_nil(policy_err)
                    local body = definition.data or definition
                    test.is_true(body.policy.actions ~= "threads.output.publish")
                end
            end
            test.eq(scope:evaluate(actor, "threads.output.publish", "kickside.research.events:request", {}), "undefined")
        end)

        test.it("READ grants do not authorize research progress", function()
            local id = crypto.random.uuid()
            local owner, reader = "owner-" .. id, "reader-" .. id
            local member = executor(owner, id)
            local _, create_err = member:call("kickside.core.threads:create_method", {
                id = id, impl_id = "kickside.research:research_kind", thread_class = "kickside.research" })
            test.is_nil(create_err)
            local _, append_err = member:call("kickside.core.threads:append_event_method", {
                thread_id = id, event = { type = "kickside.research.events:request", body = {
                    research_id = id, actor_id = owner, prompt = "Read grant" } } })
            test.is_nil(append_err)
            local granted, grant_err = member:call("kickside.component.binding:grant_subtree_func", {
                root_component_id = id, subject = { subject_id = reader, subject_type = "user" }, access_mask = 1 })
            test.is_nil(grant_err)
            test.is_true(granted.success, granted.error)
            local denied, denied_err = executor(reader, id):call("kickside.research:report_progress", { step = "Read-only progress" })
            test.is_nil(denied)
            test.not_nil(denied_err)
            local events, events_err = member:call("kickside.core.threads:list_events_method", { thread_id = id })
            test.is_nil(events_err)
            test.eq(#events.events, 1)
        end)

        test.it("a shared writer publishes progress until WRITE is revoked", function()
            local id = crypto.random.uuid()
            local owner, writer = "owner-" .. id, "writer-" .. id
            local member = executor(owner, id)
            local _, create_err = member:call("kickside.core.threads:create_method", {
                id = id, impl_id = "kickside.research:research_kind", thread_class = "kickside.research" })
            test.is_nil(create_err)
            local _, append_err = member:call("kickside.core.threads:append_event_method", {
                thread_id = id, event = { type = "kickside.research.events:request", body = {
                    research_id = id, actor_id = owner, prompt = "Shared writer" } } })
            test.is_nil(append_err)
            local granted, grant_err = member:call("kickside.component.binding:grant_subtree_func", {
                root_component_id = id, subject = { subject_id = writer, subject_type = "user" }, access_mask = 3 })
            test.is_nil(grant_err)
            test.is_true(granted.success, granted.error)
            local other = executor(writer, id)
            local progress, progress_err = other:call("kickside.research:report_progress", { step = "Shared progress" })
            test.is_nil(progress_err)
            test.is_true(progress.success, progress.error)
            local revoked, revoke_err = member:call("kickside.component.binding:revoke_subtree_func", {
                root_component_id = id, subject = { subject_id = writer, subject_type = "user" } })
            test.is_nil(revoke_err)
            test.is_true(revoked.success, revoked.error)
            local denied, denied_err = other:call("kickside.research:report_progress", { step = "Revoked progress" })
            test.is_nil(denied)
            test.not_nil(denied_err)
            local events, events_err = member:call("kickside.core.threads:list_events_method", { thread_id = id })
            test.is_nil(events_err)
            test.eq(#events.events, 2)
        end)

        test.it("member owner produces every declared domain event while a stranger produces none", function()
            local id = crypto.random.uuid()
            local owner, stranger = "writer-" .. id, "stranger-" .. id
            local member = executor(owner, id)
            local created, create_err = member:call("kickside.core.threads:create_method", {
                id = id, impl_id = "kickside.research:research_kind", thread_class = "kickside.research" })
            test.is_nil(create_err, tostring(create_err))
            local request, request_err = member:call("kickside.core.threads:append_event_method", {
                thread_id = id, event = { type = "kickside.research.events:request", body = {
                    research_id = id, actor_id = owner, prompt = "Component writer regression" } } })
            test.is_nil(request_err, tostring(request_err))
            test.eq(request.inserted, 1)
            local progress, progress_err = member:call("kickside.research:report_progress", { step = "Writing output" })
            test.is_nil(progress_err)
            test.is_true(progress.success, progress.error)
            local result, result_err = member:call("kickside.research:deliver", {
                meta = { thread_id = id, research_id = id }, report = { title = "Result", summary = "Writer result", key_points = {}, sources = {} } })
            test.is_nil(result_err, tostring(result_err))
            test.is_true(result.delivered)
            local failed, failed_err = member:call("kickside.research:deliver_error", {
                meta = { thread_id = id, research_id = id }, error = "Writer failure" })
            test.is_nil(failed_err, tostring(failed_err))
            test.not_nil(failed)
            local other = executor(stranger, id)
            local denied_result, denied_err = other:call("kickside.research:deliver", {
                meta = { thread_id = id, research_id = id }, report = { title = "Forgery", summary = "Cross-user result", key_points = {}, sources = {} } })
            test.is_nil(denied_result)
            test.not_nil(denied_err)
            local events, events_err = member:call("kickside.core.threads:list_events_method", { thread_id = id, ascending = true })
            test.is_nil(events_err)
            test.eq(#events.events, 4)
            local types = {}
            for _, event in ipairs(events.events) do types[event.type] = true end
            for _, name in ipairs({ "request", "progress", "result", "failed" }) do
                test.is_true(types["kickside.research.events:" .. name])
            end
        end)
    end)
end

return { run = test.run_cases(cases) }
