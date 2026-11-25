-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local delivery_wait = require("delivery_wait")
local test = require("test")
local security = require("security")
local contract = require("contract")
local funcs = require("funcs")
local blocks = require("blocks")
local compiler = require("compiler")
local json = require("json")
local sql = require("sql")
local time = require("time")
local uuid = require("uuid")
local jobs = require("jobs")
local database = require("database")
local api_fixtures = require("api_fixtures")
local admission_cases = require("admission_cases")
local delivery_retry_cases = require("delivery_retry_cases")
local activity_cases = require("activity_cases")
local delivery_retention_cases = require("delivery_retention_cases")
local automation_cases = require("automation_cases")
local settings_cases = require("settings_cases")
local template_cases = require("template_cases")
local driver_example_cases = require("driver_example_cases")

local TOOL_NS = "kickside.mail.traits:"
local READER_POLICIES = {
    "kickside.mail.security:library_access",
    "kickside.mail.security:module_access",


}

local function now_ms(): integer
    return time.now():unix_nano() // 1000000
end

local function open(id, binding)
    local definition, err = contract.get(id)
    if err then return nil, err end
    return definition:open(binding)
end

local function probe(input)
    if input.operation == "set" or input.operation == "unset" then
        local settings = assert(open("kickside.settings:settings"))
        return settings[input.operation](settings, {
            namespace = "kickside.mail", key = input.key, value = input.value,
        })
    end
    if input.operation == "write" or input.operation == "write_request" then
        local writable = assert(open("kickside.data:writable", "kickside.mail.sink:writable"))
        local key = "record:" .. assert(security.actor()):id()
        local request = input.operation == "write_request" and input.message or {
            config = {}, sink_op = "create", input = input.message,
            idempotency_key = key, identity_key = key, origin = "automation",
        }
        return writable:write(request)
    end
    if input.operation == "blocks" then
        local catalog, catalog_err = blocks.catalog()
        if catalog_err then return nil, catalog_err end
        local id = TOOL_NS .. "mail_send"
        local descriptor = assert(catalog[id], "MailSend is missing from the Block catalog")
        local plan, plan_err = blocks.plan({block_id = id, def_node_id = "deliver", config = input.message})
        assert(plan, plan_err :: error?)
        local upstream_plan, upstream_err = blocks.plan({block_id = id, def_node_id = "deliver", config = {}})
        assert(upstream_plan, upstream_err :: error?)
        local compiled = assert(compiler.compile({
            nodes = {
                {id = "prepare", kind = "block", ref = TOOL_NS .. "mail_preview", config = {
                    template = "notice", vars = {subject = "Status", message = "Ready"},
                }},
                {id = "deliver", kind = "block", ref = id, config = {to = input.message.to}},
            },
            edges = {{id = "message", source_id = "prepare", source_port = "result", target_id = "deliver"}},
        }, {blocks = catalog}))
        return {descriptor = descriptor, plan = plan, upstream_plan = upstream_plan, compiled = compiled}
    end
    if input.operation == "raw" then
        return open("kickside.mail:transport", "app.mail_harness:admitted")
    end
    if input.operation == "raw_send" then
        return funcs.call("app.mail_harness:send_first", input.message)
    end
    if input.operation == "driver_validation" then
        return funcs.call("kickside.mail.settings:validate_driver", {value = "app.mail_harness:admitted"})
    end
    local mailer, err = open("kickside.mail:mailer")
    if err then return nil, err end
    if input.operation == "list_templates" then return mailer:list_templates() end
    return mailer[input.operation](mailer, input.message)
end

local GROUP_BY_POLICY = {
    ["kickside.mail.security:send_access"] = "app:mail_senders",
    ["kickside.mail.security:library_access"] = "app.mail_api:library_capability_only",
    ["kickside.mail.security:log_admin"] = "app.mail_api:log_reader",
    ["kickside.mail.security:driver_admin"] = "app.mail_api:driver_only",
    ["kickside.users.security:directory_access"] = "app.mail_harness:principal_search",
}

local function caller(policy_ids, id, named_group)
    local groups = {"app:user"}
    local fixture_policies = {"app.mail_harness:caller"}
    if named_group then groups[#groups + 1] = named_group end
    for _, policy_id in ipairs(policy_ids) do
        local group = GROUP_BY_POLICY[policy_id]
        if group then
            groups[#groups + 1] = group
            if policy_id == "kickside.mail.security:library_access" then
                groups[#groups + 1] = "app:mail_editors"
            end
        elseif policy_id ~= "kickside.mail.security:module_access" then
            assert(policy_id:match("^app%.mail_harness:"), "Expected a public Mail capability")
            fixture_policies[#fixture_policies + 1] = policy_id
        end
    end

    id = id or uuid.v4()
    local db = assert(sql.get("app:db"))
    assert(db:execute([[INSERT INTO app_users (user_id,email,full_name,password_hash,status)
        VALUES ($1,$2,$1,'test-only','active') ON CONFLICT (user_id) DO NOTHING]], {id, id .. "@example.org"}))
    for _, group_id in ipairs(groups) do
        assert(db:execute([[INSERT INTO app_user_groups (user_id,group_id) VALUES ($1,$2)
            ON CONFLICT (user_id,group_id) DO NOTHING]], {id, group_id}))
    end
    assert(db:release())
    local actor = assert(security.new_actor(id, {security_groups = groups}))
    local scope = api_fixtures.role_scope(groups)
    for _, policy in ipairs(fixture_policies) do
        scope = scope:with(assert(security.policy(policy)))
    end
    return assert(funcs.new():with_actor(actor):with_scope(scope)), id
end

local function invoke(executor, operation, message)
    return executor:call("app.mail_harness:probe", {operation = operation, message = message})
end

local function await_message(executor, id, matches, seconds)
    return delivery_wait.until_state(function()
        return invoke(executor, "get_message", id)
    end, matches, tostring(seconds or 25) .. "s")
end

local function terminal(executor, queued)
    test.eq("queued", queued.status)
    return delivery_wait.terminal(function()
        return invoke(executor, "get_message", queued.message_id)
    end, "25s")
end

local function query(statement, args)
    local db = assert(sql.get("app:db"))
    local rows, err = db:query(statement, args)
    assert(db:release())
    return assert(rows, tostring(err))
end

local function persisted(id)
    return assert(query("SELECT * FROM mail_message WHERE id=$1", {id})[1])
end

local function no_body(id)
    local row = persisted(id)
    test.is_nil(row.html)
    test.is_nil(row.text)
    test.is_nil(row.actor_context)
    test.is_nil(row.next_check_at)
    test.is_nil(row.next_attempt_at)
end

local function await_job(id, status)
    local deadline = time.now():add(25 * time.SECOND):unix_nano()
    local state
    repeat
        state = assert(jobs.get_job(id))
        if state.status == status then return state end
        time.sleep("25ms")
    until time.now():unix_nano() >= deadline
    error("Unexpected Jobs state: " .. assert(json.encode(state)))
end

local function change(admin, key, value)
    return assert(admin:call("app.mail_harness:probe", {
        operation = value == nil and "unset" or "set", key = key, value = value,
    }))
end

local function body()
    return {to = {"reader@example.org"}, subject = "Status", text = "Ready"}
end

local function template_request()
    return {to = {"reader@example.org"}, template = "notice", vars = {subject = "Status & updates", message = "Ready"}}
end

local function capture_with(admin)
    assert(change(admin, "driver", "app.mail_harness:capture").success)
    assert(change(admin, "from_address", "mail@example.org").success)
end

local function refusal(value, err, kind, code, variable)
    test.is_nil(value)
    test.not_nil(err)
    test.eq(kind, err:kind(), tostring(err))
    test.is_false(err:retryable())
    if code then test.eq(code, (err:details() or {}).code) end
    if variable then test.eq(variable, err:details().variable) end
end

local function unconfigured(executor)
    local value, err = invoke(executor, "send", body())
    test.is_nil(value)
    test.eq("invalid_config", err:details().code)
    for key in pairs(err:details()) do test.eq("code", key) end
    test.is_false(err:retryable())
    return err
end

return {
    probe = probe,
    run = test.run_cases(function()
        test.describe("System-managed mailer", function()
            local actors = {}
            local state = {settlement_rows = {}}
            local ceiling = {namespace = "kickside.core.jobs", key = "proc.max_execution"}
            test.before_all(function()
                local settings = assert(open("kickside.settings:settings"))
                local configured = assert(settings:set({namespace = ceiling.namespace, key = ceiling.key, value = "3s"}))
                assert(configured.success, tostring(configured.error))
            end)
            test.after_all(function()
                local settings = assert(open("kickside.settings:settings"))
                local reset = assert(settings:unset(ceiling))
                assert(reset.success, tostring(reset.error))
            end)
            test.before_each(function()
                actors.admin = caller({}, nil, "app.mail_harness:settings_editor")
                actors.log_admin = caller({"kickside.mail.security:log_admin"})
                actors.denied = caller({})
                actors.editor = caller(READER_POLICIES)
                actors.sender, actors.sender_id = caller({


                    "kickside.mail.security:send_access",
                })
                for _, key in ipairs({"driver", "from_address", "from_name", "reply_to"}) do
                    local result = change(actors.admin, key)
                    test.is_true(result.success, result.error :: string?)
                end
            end)
            test.after_each(function()
                if #state.settlement_rows == 0 then return end
                assert(database.with_tx(function(tx)
                    for _, row in ipairs(state.settlement_rows) do
                        local _, mail_err = tx:execute("DELETE FROM mail_message WHERE id=$1", {row.id})
                        if mail_err then return nil, mail_err end
                    end
                    return true, nil
                end))
                state.settlement_rows = {}
            end)

            local cases = {
                test = test,
                actors = actors,
                now_ms = now_ms,
                caller = caller,
                invoke = invoke,
                await_message = await_message,
                terminal = terminal,
                query = query,
                persisted = persisted,
                no_body = no_body,
                await_job = await_job,
                change = change,
                body = body,
                template_request = template_request,
                capture_with = capture_with,
                refusal = refusal,
                unconfigured = unconfigured,
                state = state,
                ceiling = ceiling,
                TOOL_NS = TOOL_NS,
                READER_POLICIES = READER_POLICIES,
            }
            admission_cases.register(cases)
            delivery_retry_cases.register(cases)
            activity_cases.register(cases)
            delivery_retention_cases.register(cases)
            automation_cases.register(cases)
            settings_cases.register(cases)
            template_cases.register(cases)
            driver_example_cases.register(cases)

        end)
    end),
}
