-- GET /api/sso/providers (public) — the providers the login UI should offer:
-- those that are enabled and credentialed. Display metadata (label, icon) comes
-- from the registry descriptors; the list and order are registry-driven. Returns
-- only display metadata and the start URL; never any secret.

local http = require("http")
local config = require("sso_config")
local providers_registry = require("sso_providers_registry")

local function handler()
    local res = http.response()
    res:set_content_type(http.CONTENT.JSON)

    local base = config.global().public_base_path

    local enabled = {}
    for _, id in ipairs(config.enabled_providers()) do
        enabled[id] = true
    end

    local out = {}
    for _, d in ipairs(providers_registry.find_providers()) do
        if enabled[d.id] then
            out[#out + 1] = {
                id = d.id,
                label = d.label,
                icon = d.icon,
                start = base .. "/" .. d.id .. "/start",
            }
        end
    end

    res:set_status(http.STATUS.OK)
    res:write_json({ success = true, providers = out })
end

return { handler = handler }
