-- GET /api/sso/connections (authenticated) — the current user's linked provider
-- identities, for the account "connected logins" panel. Returns no secrets.

local http = require("http")
local security = require("security")
local identities_repo = require("identities_repo")

local function handler()
    local res = http.response()
    res:set_content_type(http.CONTENT.JSON)

    local actor = security.actor()
    if not actor then
        res:set_status(http.STATUS.UNAUTHORIZED)
        res:write_json({ success = false, error = "Not authenticated" })
        return
    end

    local list, err = identities_repo.list_by_user(actor:id())
    if err then
        res:set_status(http.STATUS.INTERNAL_ERROR)
        res:write_json({ success = false, error = err })
        return
    end

    local out = {}
    for _, r in ipairs(list or {}) do
        out[#out + 1] = {
            provider = r.provider,
            email = r.email,
            created_at = r.created_at,
            last_login_at = r.last_login_at,
        }
    end

    res:set_status(http.STATUS.OK)
    res:write_json({ success = true, connections = out })
end

return { handler = handler }
