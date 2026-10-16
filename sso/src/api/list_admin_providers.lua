-- GET /api/v1/sso/providers (authenticated, admin-only) — the full SSO config the
-- admin panel renders. The SSO settings are declared visible:false (so they stay
-- out of the generic Settings tab); the owning admin UI reads/writes them through
-- this dedicated endpoint instead. Global settings live in the base kickside.sso
-- namespace; each provider is a submodule owning its credentials in its own
-- namespace (descriptor.settings_ns). Returns:
--   providers: every discovered descriptor (enabled or not) + its settings
--              namespace and the ordered local field keys it owns.
--   settings:  per-field metadata (value_type, schema, description, has_value) and
--              the current value, keyed by "<namespace>|<key>" — except secrets,
--              which return has_value only.
-- Admin authz is enforced by the router firewall (this endpoint is absent from the
-- user allowlist, like the settings writer); the actor is read only to reject the
-- unauthenticated case. Never returns a secret value.

local http = require("http")
local security = require("security")
local registry = require("registry")
local contract = require("contract")
local consts = require("sso_consts")
local providers_registry = require("sso_providers_registry")

local DEFINITION_TYPE = "kickside.settings:definition"

-- cid builds the composite key the UI addresses a setting by: namespace + key.
local function cid(ns, key) return ns .. "|" .. key end

-- namespaces returns the global namespace plus every provider submodule's settings
-- namespace (ordered list + lookup set), deduped.
local function namespaces()
    local list = { consts.SETTINGS_NS }
    local set = { [consts.SETTINGS_NS] = true }
    for _, d in ipairs(providers_registry.find_providers()) do
        local ns = d.settings_ns or consts.SETTINGS_NS
        if not set[ns] then
            set[ns] = true
            list[#list + 1] = ns
        end
    end
    return list, set
end

-- read_definitions returns field metadata for every settings definition in the SSO
-- namespaces, keyed by composite key. Definition custom fields live under entry.data.
local function read_definitions(ns_set)
    local out = {}
    local entries, err = registry.find({ ["meta.type"] = DEFINITION_TYPE })
    if err or type(entries) ~= "table" then return out end
    for _, entry in ipairs(entries) do
        local e = (type(entry.data) == "table") and entry.data or entry
        if type(e.namespace) == "string" and ns_set[e.namespace] and type(e.key) == "string" then
            out[cid(e.namespace, e.key)] = {
                namespace = e.namespace,
                key = e.key,
                value_type = e.value_type,
                schema = e.schema,
                description = e.description,
                is_secret = e.value_type == "secret",
            }
        end
    end
    return out
end

-- read_values returns the effective value of every SSO setting through the settings
-- contract's get_namespace (which, unlike list, does not exclude visible:false),
-- keyed by composite key. Secret plaintexts are present here and dropped by the
-- caller; they never leave this function's reach.
local function read_values(ns_list)
    local out = {}
    local def = contract.get(consts.SETTINGS_CONTRACT)
    if not def then return out end
    local inst = def:open()
    if not inst then return out end
    for _, ns in ipairs(ns_list) do
        local r = inst:get_namespace({ namespace = ns })
        if r and r.success and type(r.values) == "table" then
            for k, v in pairs(r.values) do out[cid(ns, k)] = v end
        end
    end
    return out
end

-- ordered_fields lists the local setting keys a descriptor owns: the per-provider
-- base four (enabled, client_id, client_secret, scopes), then any descriptor-declared
-- extras (Microsoft tenant, generic-OIDC issuer).
local function ordered_fields(d)
    local fields = {
        consts.PKEY.ENABLED,
        consts.PKEY.CLIENT_ID,
        consts.PKEY.CLIENT_SECRET,
        consts.PKEY.SCOPES,
    }
    if d.tenant_setting then fields[#fields + 1] = d.tenant_setting end
    if d.issuer_setting then fields[#fields + 1] = d.issuer_setting end
    if d.trust_email_setting then fields[#fields + 1] = d.trust_email_setting end
    return fields
end

-- is_present reports whether a value counts as set: a non-empty string/table.
local function is_present(v)
    if v == nil then return false end
    if v == "" then return false end
    if type(v) == "table" and next(v) == nil then return false end
    return true
end

local function handler()
    local res = http.response()
    res:set_content_type(http.CONTENT.JSON)

    if not security.actor() then
        res:set_status(http.STATUS.UNAUTHORIZED)
        res:write_json({ success = false, error = "authentication required" })
        return
    end

    local ns_list, ns_set = namespaces()
    local meta = read_definitions(ns_set)
    local values = read_values(ns_list)

    local settings = {}
    for id, m in pairs(meta) do
        local entry = {
            namespace = m.namespace,
            key = m.key,
            value_type = m.value_type,
            schema = m.schema,
            description = m.description,
            has_value = is_present(values[id]),
        }
        -- Never surface a secret's plaintext; report only whether one is stored.
        if not m.is_secret then
            entry.value = values[id]
        end
        settings[id] = entry
    end

    local providers = {}
    for _, d in ipairs(providers_registry.find_providers()) do
        providers[#providers + 1] = {
            id = d.id,
            label = d.label,
            icon = d.icon,
            engine = d.engine,
            namespace = d.settings_ns or consts.SETTINGS_NS,
            ui_component = d.ui_component,
            ui = d.ui,
            fields = ordered_fields(d),
        }
    end

    res:set_status(http.STATUS.OK)
    res:write_json({
        success = true,
        providers = providers,
        settings = settings,
        global_namespace = consts.SETTINGS_NS,
    })
end

return { handler = handler }
