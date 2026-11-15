-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Catalog policy keys: deployment defaults come from the kickside.pim settings
-- namespace and a catalog overrides them in its declaration's policy section.
local types = require("types")

local M = {}

-- KEYS lists every policy key with its accepted values.
M.KEYS = {
    audit = { kind = "enum", values = { fields = true, off = true } },
    audit_days = { kind = "int", min = 0, max = 106751 },
    trash_days = { kind = "int", min = 1, max = 106751 },
    tombstone_days = { kind = "int", min = 1, max = 106751 },
    proposal_days = { kind = "int", min = 1, max = 3650 },
    completed_work_days = { kind = "int", min = 1, max = 3650 },
    abandoned_work_days = { kind = "int", min = 1, max = 3650 },
    import_days = { kind = "int", min = 1, max = 3650 },
    pending_creation_days = { kind = "int", min = 1, max = 3650 },
    proposal_count = { kind = "int", min = 1, max = 1000 },
    proposal_bytes = { kind = "int", min = 1024, max = 262144 },
    command_deadline_ms = { kind = "int", min = 100, max = 5000 },
    maintenance_rows = { kind = "int", min = 20, max = 500 },
    maintenance_catalogs = { kind = "int", min = 1, max = 10 },
    rebuild_rows = { kind = "int", min = 1, max = 500 },
    job_batches = { kind = "int", min = 1, max = 20 },
    import_rows = { kind = "int", min = 1, max = 200 },
}

-- check(key, value) returns an error message for a value key refuses.
function M.check(key: string, value: unknown): string?
    local spec = M.KEYS[key]
    if not spec then return "unknown policy key " .. tostring(key) end
    if spec.kind == "enum" then
        if type(value) ~= "string" or not spec.values[value] then return key .. " must be fields or off" end
        return nil
    end
    local n = type(value) == "number" and math.tointeger(value) or nil
    if n == nil or n < spec.min then return key .. " must be an integer of at least " .. spec.min end
    if spec.max and n > spec.max then return key .. " exceeds safe ceiling " .. spec.max end
    return nil
end

-- overrides(decl) checks a declared policy and returns its overrides, or a
-- message naming the first invalid key.
function M.overrides(decl: types.PolicyDecl?): (types.PolicyOverrides?, string?)
    local d: types.PolicyDecl = decl or {}
    local out: types.PolicyOverrides = {}
    for key, value in pairs(d) do
        if key == "pending_creation_days" or key == "maintenance_rows" or key == "maintenance_catalogs" then return nil, key .. " is deployment-wide" end
        local bad = M.check(key, value)
        if bad then return nil, bad end
    end
    if type(d.audit) == "string" then out.audit = d.audit end
    if type(d.audit_days) == "number" then out.audit_days = d.audit_days end
    if type(d.trash_days) == "number" then out.trash_days = d.trash_days end
    if type(d.tombstone_days) == "number" then out.tombstone_days = d.tombstone_days end
    if type(d.proposal_days) == "number" then out.proposal_days = d.proposal_days end
    if type(d.completed_work_days) == "number" then out.completed_work_days = d.completed_work_days end
    if type(d.abandoned_work_days) == "number" then out.abandoned_work_days = d.abandoned_work_days end
    if type(d.import_days) == "number" then out.import_days = d.import_days end
    if type(d.proposal_count) == "number" then out.proposal_count = d.proposal_count end
    if type(d.proposal_bytes) == "number" then out.proposal_bytes = d.proposal_bytes end
    if type(d.command_deadline_ms) == "number" then out.command_deadline_ms = d.command_deadline_ms end
    if type(d.rebuild_rows) == "number" then out.rebuild_rows = d.rebuild_rows end
    if type(d.job_batches) == "number" then out.job_batches = d.job_batches end
    if type(d.import_rows) == "number" then out.import_rows = d.import_rows end
    return out, nil
end

-- effective(defaults, overrides) applies a catalog's policy overrides.
function M.effective(defaults: types.Policy, overrides: types.PolicyOverrides?): types.Policy
    local o: types.PolicyOverrides = overrides or {}
    local audit_days = o.audit_days or defaults.audit_days
    -- Zero selects the same finite default as Work, including legacy policies.
    if audit_days == 0 then audit_days = 365 end
    return { audit = o.audit or defaults.audit, audit_days = audit_days,
        trash_days = o.trash_days or defaults.trash_days, tombstone_days = o.tombstone_days or defaults.tombstone_days,
        proposal_days = o.proposal_days or defaults.proposal_days,
        completed_work_days = o.completed_work_days or defaults.completed_work_days,
        abandoned_work_days = o.abandoned_work_days or defaults.abandoned_work_days,
        import_days = o.import_days or defaults.import_days,
        pending_creation_days = defaults.pending_creation_days,
        proposal_count = o.proposal_count or defaults.proposal_count,
        proposal_bytes = o.proposal_bytes or defaults.proposal_bytes,
        command_deadline_ms = o.command_deadline_ms or defaults.command_deadline_ms,
        maintenance_rows = defaults.maintenance_rows,
        maintenance_catalogs = defaults.maintenance_catalogs,
        rebuild_rows = o.rebuild_rows or defaults.rebuild_rows,
        job_batches = o.job_batches or defaults.job_batches,
        import_rows = o.import_rows or defaults.import_rows,
    }
end

return M
