-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local contract = require("contract")
local fs = require("fs")
local funcs = require("funcs")
local http_client = require("http_client")
local json = require("json")
local sql = require("sql")
local registry = require("registry")
local security = require("security")
local system = require("system")
local uuid = require("uuid")
local test = require("test")

local TAB_ACCESS = "kickside.mail:library"

local function gateway(path: string): string
    local state = assert(system.supervisor.state("app:gateway"))
    local address = assert(state.details:match("^service listening on (127%.0%.0%.1:[1-9]%d*)$"), state.details)
    return "http://" .. address .. path
end

local function member(groups: {string}): (security.Actor, security.Scope)
    assert(funcs.call("kickside.security.binding:materialize_group_set", {groups = groups}))
    local id = uuid.v4()
    local actor = assert(security.new_actor(id, {user_id = id, security_groups = groups}))
    return actor, assert(security.named_scope(groups[1]))
end

-- A signed-in session with a bearer token, the way the pages call the API.
local function signed_in(groups: {string}): string
    local id = uuid.v4()
    local db = assert(sql.get("app:db"))
    assert(db:execute([[INSERT INTO app_users (user_id,email,full_name,password_hash,status)
        VALUES ($1,$2,'Mail admin fixture','test-only','active')]], {id, id .. "@example.org"}))
    for _, group in ipairs(groups) do
        assert(db:execute("INSERT INTO app_user_groups (user_id,group_id) VALUES ($1,$2)", {id, group}))
    end
    assert(db:release())
    assert(funcs.call("kickside.security.binding:materialize_group_set", {groups = groups}))
    local actor = assert(security.new_actor(id, {user_id = id, email = id .. "@example.org", security_groups = groups}))
    local tokens = assert(security.token_store("kickside.users.security:tokens"))
    local token = assert(tokens:create(actor, assert(security.named_scope(groups[1])), {expiration = "1h"}))
    tokens:close()
    return token
end

local function get(token: string, path: string): (integer, {[string]: unknown})
    local res = assert(http_client.request("GET", gateway("/api" .. path), {headers = {Authorization = "Bearer " .. token}}))
    local body = res.body ~= "" and json.decode(res.body) or {}
    return math.tointeger(res.status_code) or 0, body :: {[string]: unknown}
end

local function put(token: string, path: string, body: {[string]: unknown}): (integer, {[string]: unknown})
    local res = assert(http_client.request("PUT", gateway("/api" .. path), {
        headers = {Authorization = "Bearer " .. token, ["Content-Type"] = "application/json"}, body = json.encode(body)}))
    local decoded = res.body ~= "" and json.decode(res.body) or {}
    return math.tointeger(res.status_code) or 0, decoded :: {[string]: unknown}
end

local function allows(actor: security.Actor, scope: security.Scope, action: string, resource: string): boolean
    return scope:evaluate(actor, action, resource) == "allow"
end

local function cases()
    test.describe("Mail administration module", function()
        test.it("announces the Mail System tab and serves its bundle", function()
            local tab = assert(registry.get("kickside.mail.admin:settings_tab"))
            test.eq(tab.meta.type, "ui.settings_tab")
            test.eq(tab.data.key, "mail")
            test.eq(tab.data.label, "Mail")
            test.eq(tab.data.render, "component")
            test.eq(tab.data.component_tag, "kickside-mail-admin")
            test.eq(tab.data.access, TAB_ACCESS)
            test.eq("contract.definition", assert(registry.get(TAB_ACCESS)).kind, "the tab access names Mail's public library contract")

            local view = assert(registry.get("kickside.mail.admin:admin"))
            test.eq(view.meta.type, "view.component")
            test.eq(view.meta.tag_name, "kickside-mail-admin")
            test.is_true(view.meta.announced)
            test.is_true(view.meta.auto_register)
            local bundle = assert(fs.get("kickside.mail.admin:ui_fs"))
            local exists, exists_err = bundle:exists(view.meta.entry_point :: string)
            test.is_nil(exists_err, tostring(exists_err))
            test.is_true(exists)

            local response, err = http_client.request("GET", gateway("/kickside-mail-admin/" .. view.meta.entry_point))
            test.is_nil(err, tostring(err))
            test.eq(response.status_code, 200)
            test.not_nil(response.body:find("webComponent", 1, true), "the served entry is the built element")
            test.not_nil(response.body:find("import(\"./mount-", 1, true), "the entry loads its implementation on first connect")
        end)

        test.it("declares selectable module access", function()
            local policy = assert(registry.get("kickside.mail.admin.security:module_access"))
            test.eq(policy.meta.intent, "module_access")
        end)

        test.it("lets members load the bundle and shows the tab only to library editors", function()
            local actor, scope = member({"app:user"})
            test.is_true(allows(actor, scope, "access", "kickside.mail.admin:admin"))
            test.is_true(allows(actor, scope, "access", "kickside.mail.admin:ui_static"))
            test.is_true(allows(actor, scope, "registry.get", "kickside.mail.admin:settings_tab"))
            test.is_false(allows(actor, scope, "access", TAB_ACCESS), "a member without Edit mail library has no Mail tab")

            local editor, editor_scope = member({"app:editor", "app:user"})
            test.is_true(allows(editor, editor_scope, "access", TAB_ACCESS), "an editor sees the Mail tab")
            test.is_true(allows(editor, editor_scope, "access", "kickside.mail.admin:admin"))
            test.is_false(allows(editor, editor_scope, "access", "kickside.mail.api:activity_list.endpoint"),
                "Edit mail library alone does not reach Activity")
        end)

        test.it("lists admitted transport status and reads masked settings separately", function()
            local settings_contract = assert(assert(contract.get("kickside.settings:settings")):open())
            local written = assert(settings_contract:set({namespace = "app.fixture", key = "api_key", value = "fixture-key-private"}))
            assert(written.success, tostring(written.error))
            local status, body = get(signed_in({"app:delivery", "app:user"}), "/mail/delivery")
            local settings_status, listing = get(signed_in({"app:settings_admin", "app:user"}), "/settings?namespace=app.fixture")
            local cleared = assert(settings_contract:unset({namespace = "app.fixture", key = "api_key"}))
            assert(cleared.success, tostring(cleared.error))
            test.eq(200, status)
            local items = (body.data :: {[string]: unknown}).transports :: {{[string]: unknown}}
            local fixture = items[1]
            test.eq("app:fixture_binding", fixture.id)
            test.eq("Fixture delivery", fixture.title)
            test.eq("app.fixture", fixture.settings_ns)
            test.is_false(fixture.ready)
            test.eq("fixture_key_required", fixture.code)
            test.eq("Add a key for the fixture service.", fixture.reason)
            test.is_nil(fixture.settings)

            test.eq(200, settings_status)
            local settings = listing.settings :: {{[string]: unknown}}
            test.eq(2, #settings)
            local by_key = {}
            for _, row in ipairs(settings) do by_key[row.key] = row end
            test.is_true(by_key.api_key.is_secret)
            test.is_true(by_key.api_key.has_value)
            test.is_nil(by_key.api_key.value)
            test.is_nil(by_key.api_key.default)
            test.eq("us", by_key.region.value)
            local unconfigured_status, unconfigured = get(signed_in({"app:settings_admin", "app:user"}), "/settings?namespace=app.fixture")
            test.eq(200, unconfigured_status)
            local rows = unconfigured.settings :: {{[string]: unknown}}
            for _, row in ipairs(rows) do by_key[row.key] = row end
            test.is_false(by_key.api_key.has_value)

            local denied = get(signed_in({"app:editor", "app:user"}), "/mail/delivery")
            test.eq(403, denied, "an editor without delivery administration never learns the services")
        end)

        test.it("lists Mail's sender settings for the settings card and never the driver ID", function()
            local status, body = get(signed_in({"app:settings_admin", "app:user"}), "/settings?namespace=kickside.mail")
            test.eq(200, status, json.encode(body))
            local keys = {}
            for _, row in ipairs(body.settings :: {{[string]: unknown}}) do keys[row.key :: string] = true end
            test.is_true(keys.from_address and keys.from_name and keys.reply_to)
            test.is_nil(keys.driver, "the service is chosen from Mail's admitted transports, not typed")
        end)

        test.it("switches the delivery service only at the revision Mail reported", function()
            local token = signed_in({"app:settings_admin", "app:delivery", "app:user"})
            local _, before = get(token, "/mail/delivery")
            local read = (before.data :: {[string]: unknown}).driver_revision :: integer
            local chosen_status, chosen = put(token, "/settings", {namespace = "kickside.mail", key = "driver",
                value = "app:fixture_binding", expected_revision = read})
            local _, after = get(token, "/mail/delivery")
            local stale_status, stale = put(token, "/settings", {namespace = "kickside.mail", key = "driver",
                value = "app:fixture_binding", expected_revision = read})
            local settings_contract = assert(assert(contract.get("kickside.settings:settings")):open())
            local cleared = assert(settings_contract:unset({namespace = "kickside.mail", key = "driver"}))
            assert(cleared.success, tostring(cleared.error))

            test.eq(0, read)
            test.eq(200, chosen_status, json.encode(chosen))
            local written = (chosen.updated :: {{[string]: unknown}})[1]
            local current = after.data :: {[string]: unknown}
            test.eq(written.revision, current.driver_revision)
            test.eq("app:fixture_binding", (current.driver :: {[string]: unknown}).id)
            test.eq(409, stale_status, json.encode(stale))
            test.is_true(stale.conflict)
        end)

        test.it("declares the Mail settings block on the delivery component", function()
            local block = assert(registry.get("kickside.mail.admin:delivery_block"))
            test.eq(block.meta.type, "kickside.settings:block")
            test.eq(block.data.namespace, "kickside.mail")
            test.eq(block.data.component_tag, "kickside-mail-delivery")
            local view = assert(registry.get("kickside.mail.admin:delivery"))
            test.eq(view.meta.tag_name, "kickside-mail-delivery")
            test.is_false(view.meta.auto_register, "the Settings page registers the block editor when it opens")
            local exists = assert(fs.get("kickside.mail.admin:ui_fs")):exists(view.meta.entry_point :: string)
            test.is_true(exists)
            local status, body = get(signed_in({"app:settings_admin", "app:user"}), "/settings/blocks")
            test.eq(status, 200, json.encode(body))
            local count = 0
            local provider = 0
            for _, item in ipairs(body.blocks :: {{[string]: unknown}}) do
                if item.namespace == "app.fixture" then
                    provider = provider + 1
                    test.eq("app.fixture", item.key)
                    test.is_nil(item.component_tag)
                elseif item.namespace == "kickside.mail" then
                    count = count + 1
                    test.eq("Integrations", item.group)
                    test.eq("kickside-mail-delivery", item.component_tag)
                end
            end
            test.eq(1, count)
            test.eq(1, provider)
        end)
    end)
end

return {run = test.run_cases(cases)}
