-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Harness users with persisted rows so deferred projections resolve their principals.
local sql = require("sql")
local security = require("security")

local M = {}

M.MEMBER_GROUP = "app.security:work_test"
M.ADMIN_GROUP = "app.security:work_admin"
M.PLATFORM_MEMBERS = "kickside.security.groups:members"

local function persist(id: string, groups: { string }): security.Actor
    local db = assert(sql.get("app:db"))
    local _, user_err = db:execute([[INSERT INTO app_users (user_id, email, full_name, password_hash, status)
        VALUES ($1, $2, 'Work test user', 'test-only', 'active') ON CONFLICT (user_id) DO NOTHING]], { id, id .. "@work.test" })
    assert(not user_err, tostring(user_err))
    for _, group in ipairs(groups) do
        local _, group_err = db:execute([[INSERT INTO app_user_groups (user_id, group_id)
            VALUES ($1, $2) ON CONFLICT (user_id, group_id) DO NOTHING]], { id, group })
        assert(not group_err, tostring(group_err))
    end
    db:release()
    return security.new_actor(id, { user_id = id, status = "active", security_groups = groups })
end

-- make persists a harness user in the permissive member group and, unless member_only, in the
-- work administrator group the prefix registry grants WRITE to.
function M.make(id: string, member_only: boolean?): security.Actor
    local groups = { M.MEMBER_GROUP }
    if not member_only then groups[#groups + 1] = M.ADMIN_GROUP end
    return persist(id, groups)
end

-- real persists a user in the groups an installation assigns: the platform Members group and,
-- for a work administrator, the administration group. Neither carries a permissive harness policy.
function M.real(id: string, admin: boolean?): security.Actor
    local groups = { M.PLATFORM_MEMBERS }
    if admin then groups[#groups + 1] = M.ADMIN_GROUP end
    return persist(id, groups)
end

-- outsider persists a user that belongs to no group, so its scope holds no module policy.
function M.outsider(id: string): security.Actor
    return persist(id, {})
end

return M
