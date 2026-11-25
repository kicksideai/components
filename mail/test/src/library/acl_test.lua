-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local autoinit = require("autoinit")
local funcs = require("funcs")
local fixtures = require("fixtures")
local security = require("security")
local test = require("test")
local uuid = require("uuid")

local function reader(id, capability)
    local actor = assert(security.new_actor(id, {user_id = id}))
    local policies = {assert(security.policy("kickside.mail.security:library_runtime")),
                assert(security.policy("app.mail_library:invoke_access"))}
    if capability then policies[#policies + 1] = assert(security.policy("kickside.mail.security:library_access")) end
    local scope = assert(security.new_scope(policies))
    return assert(funcs.new():with_actor(actor):with_scope(scope))
end

local function read_notice(executor)
    return fixtures.call(executor, "get", {kind = "message", name = "notice"})
end

return {run = test.run_cases(function()
    test.describe("Mail library read authorization", function()
        local actor_id
        local granted
        local component_id = autoinit.component_id(autoinit.SYSTEM_SCOPE_KEY, "kickside.mail.library")
        local actor = assert(security.new_actor("system:lifecycle", {system = true, groups = {"system", "lifecycle"}}))
        local owner = assert(funcs.new():with_actor(actor):with_scope(assert(security.named_scope("wippy.security:process"))))

        local function share(method, mask)
            local result = assert(owner:call("kickside.component.binding:" .. method .. "_subtree_func", {
                root_component_id = component_id,
                subject = {subject_id = tostring(actor_id), subject_type = "user"}, access_mask = mask,
            }))
            assert(result.success, tostring(result.error))
        end

        test.before_each(function()
            actor_id = uuid.v4()
            granted = false
        end)

        test.after_each(function()
            if granted then share("revoke") end
        end)

        local function grant(mask)
            share("grant", mask)
            granted = true
        end

        test.it("refuses the Mail capability with only component WRITE", function()
            grant(2)
            local resource, err = read_notice(reader(actor_id, true))
            test.is_true(resource == nil, "A component WRITE grant must not authorize a library read")
            test.eq(errors.PERMISSION_DENIED, assert(err):kind())
            test.eq("mail_library_read_denied", err:details().code)
        end)

        test.it("refuses component READ without the Mail capability", function()
            grant(1)
            local resource, err = read_notice(reader(actor_id, false))
            test.is_nil(resource)
            test.eq(errors.PERMISSION_DENIED, assert(err):kind())
            test.eq("mail_library_denied", err:details().code)
        end)

        test.it("reads a saved resource with both grants", function()
            grant(1)
            local resource, err = read_notice(reader(actor_id, true))
            assert(resource, tostring(err))
            test.eq("notice", resource.name)
        end)

        test.it("requires component READ to render a draft without a write review", function()
            local editor = reader(actor_id, true)
            local preview, err = fixtures.call(editor, "preview", {message = "notice"})
            test.is_nil(preview)
            test.eq(errors.PERMISSION_DENIED, assert(err):kind())
            test.eq("mail_library_read_denied", err:details().code)
            grant(1)
            test.not_nil(assert(fixtures.call(editor, "preview", {message = "notice"})).html)
        end)
    end)
end)}
