-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
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

local TAB_ACCESS = "kickside.mail.api:library_list.endpoint"

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
            test.not_nil(registry.get(TAB_ACCESS), "the tab access names a real Mail endpoint")

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
            test.is_true(#response.body > 1000, "the served bundle is the built component")
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

        test.it("lists installed delivery drivers with their settings views to delivery administrators only", function()
            local status, body = get(signed_in({"app:delivery", "app:user"}), "/mail-admin/drivers")
            test.eq(status, 200, json.encode(body))
            local items = (body.data :: {[string]: unknown}).items :: {{[string]: unknown}}
            local fixture
            for _, item in ipairs(items) do if item.id == "fixture" then fixture = item end end
            test.not_nil(fixture, json.encode(body))
            test.eq(fixture.label, "Fixture delivery")
            test.eq(fixture.settings_ns, "app.fixture")
            test.eq(fixture.settings_view, "app-fixture-settings")

            local denied = get(signed_in({"app:editor", "app:user"}), "/mail-admin/drivers")
            test.eq(denied, 403, "an editor without delivery administration never learns the services")
        end)

        test.it("declares the Mail settings block on the delivery component", function()
            local block = assert(registry.get("kickside.mail.admin:delivery_block"))
            test.eq(block.meta.type, "kickside.settings:block")
            test.eq(block.data.namespace, "kickside.mail")
            test.eq(block.data.component_tag, "kickside-mail-delivery")
            local view = assert(registry.get("kickside.mail.admin:delivery"))
            test.eq(view.meta.tag_name, "kickside-mail-delivery")
        end)
    end)
end

return {run = test.run_cases(cases)}
