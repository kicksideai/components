-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local fs = require("fs")
local funcs = require("funcs")
local http_client = require("http_client")
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
    end)
end

return {run = test.run_cases(cases)}
