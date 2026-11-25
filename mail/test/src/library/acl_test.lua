-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local autoinit = require("autoinit")
local funcs = require("funcs")
local security = require("security")
local sql = require("sql")
local test = require("test")
local uuid = require("uuid")

local function reader(id, capability)
    local actor = assert(security.new_actor(id, {user_id = id}))
    local policies = {assert(security.policy("kickside.mail.security:library_calls"))}
    if capability then policies[#policies + 1] = assert(security.policy("kickside.mail.security:library_access")) end
    local scope = assert(security.new_scope(policies))
    return assert(funcs.new():with_actor(actor):with_scope(scope))
end

local function read_notice(executor)
    return executor:call("kickside.mail.library:get", {kind = "message", name = "notice"})
end

return {run = test.run_cases(function()
    test.describe("Mail library read authorization", function()
        local actor_id
        local grant_id

        test.before_each(function()
            actor_id = uuid.v4()
            grant_id = nil
        end)

        test.after_each(function()
            if not grant_id then return end
            local db = assert(sql.get("app:db"))
            assert(db:execute("DELETE FROM kickside_component_access WHERE access_id = $1", {grant_id}))
            assert(db:release())
        end)

        local function grant(mask)
            local db = assert(sql.get("app:db"))
            local component_id = autoinit.component_id(autoinit.SYSTEM_SCOPE_KEY, "kickside.mail.library")
            grant_id = uuid.v4()
            assert(db:execute([[INSERT INTO kickside_component_access
                (access_id, subject_id, component_id, source_component_id, access_mask, subject_type)
                VALUES ($1, $2, $3, $4, $5, 'user')]], {grant_id, actor_id, component_id, component_id, mask}))
            assert(db:release())
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
    end)
end)}
