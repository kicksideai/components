-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Harness users with persisted rows so deferred projections resolve their principals.
local sql = require("sql")
local security = require("security")

local M = {}

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

-- member persists a user of the platform Members group, which carries no
-- permissive harness policy.
function M.member(id: string): security.Actor
    return persist(id, { M.PLATFORM_MEMBERS })
end

-- outsider persists a user of no group.
function M.outsider(id: string): security.Actor
    return persist(id, {})
end

function M.admin(id: string): security.Actor
    return persist(id, { M.PLATFORM_MEMBERS, "app.security:work_admin" })
end

return M
