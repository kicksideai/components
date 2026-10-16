-- Provider discovery. The set of SSO providers is registry-driven: each provider
-- ships as a `registry.entry` with `meta.type = sso.provider` carrying its display
-- metadata and connector descriptor (engine + endpoint resolution). Adding an IdP
-- is a single descriptor entry, no code change. Custom fields live under entry.data
-- (the registry.entry convention), so a descriptor is read off there.

local registry = require("registry")

local M = {}

M.META_TYPE = "sso.provider"

-- normalize maps a registry entry's descriptor fields to a stable shape with
-- defaults; returns nil for a descriptor without an id.
local function normalize(entry)
    local e = (type(entry.data) == "table") and entry.data or entry
    if type(e.id) ~= "string" or e.id == "" then return nil end
    return {
        id = e.id,
        label = (type(e.label) == "string" and e.label ~= "") and e.label or e.id,
        icon = e.icon,
        engine = (type(e.engine) == "string" and e.engine ~= "") and e.engine or "oidc",
        -- The namespace owning this provider's credential settings (enabled,
        -- client_id, client_secret, scopes, plus any extras). Each provider is a
        -- submodule; the descriptor points the config/admin readers at its own
        -- settings store. Falls back to the base sso namespace for a descriptor
        -- that does not declare one.
        settings_ns = (type(e.settings_ns) == "string" and e.settings_ns ~= "") and e.settings_ns or nil,
        -- Optional bespoke admin-card tag. Absent providers render with the shared
        -- kickside-sso-provider card (the shell's default).
        ui_component = (type(e.ui_component) == "string" and e.ui_component ~= "") and e.ui_component or nil,
        -- Declarative card presentation (accent, intro, docs) the shared card
        -- renders. The descriptor — not any code — owns a provider's look.
        ui = (type(e.ui) == "table") and e.ui or nil,
        endpoints = (type(e.endpoints) == "table") and e.endpoints or nil,
        issuer_template = (type(e.issuer_template) == "string") and e.issuer_template or nil,
        issuer_setting = (type(e.issuer_setting) == "string") and e.issuer_setting or nil,
        tenant_setting = (type(e.tenant_setting) == "string") and e.tenant_setting or nil,
        trust_email = e.trust_email == true,
        trust_email_setting = (type(e.trust_email_setting) == "string" and e.trust_email_setting ~= "")
            and e.trust_email_setting or nil,
        default_scopes = (type(e.default_scopes) == "table") and e.default_scopes or {},
        order = tonumber(e.order) or 1000,
    }
end

-- find_providers returns every sso.provider descriptor, sorted by order then id.
function M.find_providers()
    local entries, err = registry.find({ ["meta.type"] = M.META_TYPE })
    local out = {}
    if err or type(entries) ~= "table" then return out end
    for _, entry in ipairs(entries) do
        local d = normalize(entry)
        if d then out[#out + 1] = d end
    end
    table.sort(out, function(a, b)
        if a.order ~= b.order then return a.order < b.order end
        return a.id < b.id
    end)
    return out
end

-- get_provider returns the descriptor for one id, or nil.
function M.get_provider(id)
    if type(id) ~= "string" then return nil end
    for _, d in ipairs(M.find_providers()) do
        if d.id == id then return d end
    end
    return nil
end

-- is_known_provider reports whether a descriptor exists for id.
function M.is_known_provider(id)
    return M.get_provider(id) ~= nil
end

return M
