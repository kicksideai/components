-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local contract = require("contract")
local funcs = require("funcs")
local registry = require("registry")
local security = require("security")
local test = require("test")
local config = require("config")

local CONTRACT = "kickside.mail:transport"
local ADMITTED = "kickside.mail.harness:admitted"
local REFUSED = "kickside.mail.harness:refused"
local LATE = "kickside.mail.harness:late"
local LATE_POLICY = "kickside.mail.harness:late_open"

local function call_without_group()
    local actor = assert(security.new_actor("mail-harness-transport-caller"))
    local policy = assert(security.policy("kickside.mail.harness:transport_probe_call"))
    local scope = assert(security.new_scope({policy}))
    local executor = assert(funcs.new():with_actor(actor):with_scope(scope))
    return executor:call("kickside.mail.harness:transport_probe", ADMITTED)
end

local function probe(id: string)
    local definition, err = contract.get(CONTRACT)
    if err then return nil, err end
    local _, open_err = definition:open(id)
    if open_err then return nil, open_err end
    return true, nil
end

local function invoke(operation, message, policy_ids, groups)
    local actor = assert(security.new_actor("mail-harness-transport-caller", {security_groups = groups}))
    local policies = {assert(security.policy("kickside.mail.harness:caller"))}
    for _, id in ipairs(policy_ids) do policies[#policies + 1] = assert(security.policy(id)) end
    local scope = assert(security.new_scope(policies))
    local executor = assert(funcs.new():with_actor(actor):with_scope(scope))
    return executor:call("kickside.mail.harness:probe", {operation = operation, message = message})
end

local function catalog()
    local current = assert(invoke("delivery_status", nil, {
        "kickside.mail.security:module_runtime", "kickside.mail.security:log_admin",
    }))
    local catalog = {}
    for _, status in ipairs(current.transports) do catalog[status.id] = status end
    return catalog
end

local function implementations()
    local ids = {}
    for _, id in ipairs(assert(contract.find_implementations(CONTRACT))) do ids[id] = true end
    return ids
end

local function apply(add: {registry.Entry}?, remove: {string}?)
    local changes = assert(registry.snapshot()):changes()
    for _, entry in ipairs(add or {}) do changes:create(entry) end
    if remove then changes:delete(remove) end
    local _, err = changes:apply()
    assert(not err, tostring(err))
end

local function admission(id: string): registry.Entry
    return {id = LATE_POLICY, kind = "security.policy", meta = {private = true}, data = {
        groups = {"kickside.mail.security:transports"},
        policy = {resources = {id}, actions = {"contract.open"}, effect = "allow"},
    }}
end

local function change_driver(value)
    local actor = assert(security.new_actor("mail-harness:transport-admin"))
    local scope = assert(security.new_scope({assert(security.policy("kickside.mail.harness:caller")),
        assert(security.policy("kickside.mail.harness:admin"))}))
    local executor = assert(funcs.new():with_actor(actor):with_scope(scope))
    return assert(executor:call("kickside.mail.harness:probe", {
        operation = value and "set" or "unset", key = "driver", value = value,
    }))
end

local function define_tests()
    test.describe("Driver endpoint URLs", function()
        local endpoints = "kickside.mail.harness:endpoints"

        test.it("accepts HTTPS origins, exact delivery URLs, and policy prefixes", function()
            test.eq("https://example.org:443", assert(config.endpoint(endpoints, "origin")))
            test.eq("https://example.org/v3/mail/send", assert(config.endpoint(endpoints, "exact", "exact")))
            test.eq("https://example.org/v3", assert(config.endpoint(endpoints, "prefix", "prefix")))
        end)

        test.it("rejects insecure or ambiguous URLs and mixed modes", function()
            for _, region in ipairs({"local_http", "other_http", "traversal", "userinfo", "malformed_port", "prefix", "missing"}) do
                local value, err = config.endpoint(endpoints, region, "exact")
                test.is_nil(value)
                test.eq(errors.INVALID, assert(err):kind())
                test.eq("provider_endpoint_invalid", err:details().code)
            end
            local value, err = config.endpoint(endpoints, "local_http")
            test.is_nil(value)
            test.eq("provider_endpoint_invalid", assert(err):details().code)
        end)
    end)

    test.describe("Transport catalog", function()
        test.it("lists admitted binding IDs with status display data", function()
            local status = assert(catalog()[ADMITTED], "admitted binding missing from Mail catalog")
            test.eq("First", status.title)
            test.eq("lucide:mail", status.icon)
            test.eq("First test transport.", status.description)
            test.eq("kickside.mail.harness.first", status.settings_ns)
            test.is_true(status.ready)
            test.is_false(status.idempotent)
        end)

        test.it("discovers refused bindings but excludes them from Mail status", function()
            test.is_true(implementations()[REFUSED])
            local found = catalog()
            test.not_nil(found[ADMITTED])
            test.is_nil(found[REFUSED])
        end)

        test.it("does not grant admission to a frame without the transports group", function()
            local opened, err = call_without_group()
            test.is_nil(opened)
            test.eq(errors.PERMISSION_DENIED, err:kind())
        end)

        test.it("reports the stored driver revision so a settings write can check it", function()
            local selected = change_driver(ADMITTED)
            local current = invoke("delivery_status", nil, {
                "kickside.mail.security:module_runtime", "kickside.mail.security:log_admin",
            })
            local cleared = change_driver()
            local unset = invoke("delivery_status", nil, {
                "kickside.mail.security:module_runtime", "kickside.mail.security:log_admin",
            })
            test.is_true(selected.success, selected.error :: string?)
            test.is_true(selected.revision > 0)
            test.eq(selected.revision, current.driver_revision)
            test.is_true(cleared.success, cleared.error :: string?)
            test.eq(0, unset.driver_revision)
        end)

        test.it("rejects a refused ID in the driver setting", function()
            local result = change_driver(REFUSED)
            test.is_false(result.success)
            test.eq("The active mail driver is not admitted", result.error)
        end)

        test.it("accepts the empty default to clear the driver selection", function()
            assert(change_driver(ADMITTED).success)
            local cleared = change_driver("")
            local status = invoke("delivery_status", nil, {
                "kickside.mail.security:module_runtime", "kickside.mail.security:log_admin",
            })
            assert(change_driver().success)
            test.is_true(cleared.success, cleared.error :: string?)
            test.is_false(status.ready)
        end)

        test.it("refuses sends after an active binding loses admission", function()
            apply({admission(REFUSED)})
            local selected = change_driver(REFUSED)
            apply(nil, {LATE_POLICY})
            local sent, err
            if selected.success then
                sent, err = invoke("send", {to = {"reader@example.org"}, subject = "Transport admission", text = "Ready"}, {
                    "kickside.mail.security:module_runtime", "kickside.mail.security:send_access",
                }, {"app:mail_senders"})
                assert(change_driver().success)
            end
            test.is_true(selected.success, selected.error :: string?)
            test.is_nil(sent)
            test.eq(errors.INVALID, err:kind())
            test.eq("driver_not_admitted", err:details().code)
        end)

        test.it("includes a late binding without restart and removes it from Mail status on revocation", function()
            test.is_nil(implementations()[LATE])
            apply({{id = LATE, kind = "contract.binding", meta = {}, data = {contracts = {{contract = CONTRACT,
                methods = {send = "kickside.mail.harness:send_first", status = "kickside.mail.harness:status_first"},
            }}}}, admission(LATE)})
            local admitted = catalog()[LATE]
            apply(nil, {LATE_POLICY})
            local revoked = catalog()[LATE]
            local installed = implementations()[LATE]
            apply(nil, {LATE})
            test.not_nil(admitted)
            test.is_nil(revoked)
            test.is_true(installed)
        end)
    end)
end

return {probe = probe, run = test.run_cases(define_tests)}
