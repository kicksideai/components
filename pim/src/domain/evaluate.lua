-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- The single evaluator (spec 2.7): requirement presence and the authored rule
-- over an item's resolved values. Readiness, release and reads all call it.
local resolve = require("resolve")
local snapshot = require("snapshot")
local types = require("types")

local M = {}

type Readiness = { [string]: { types.Finding } }
-- Runner calls one check function; an error makes the check fail closed.
type Runner = (string, types.CheckInput) -> ({ types.Finding }?, error?)
M.Readiness = Readiness
M.Runner = Runner

-- run_check appends one check's findings over the item's view of what it
-- reads; a check that cannot run yields check_unavailable.
local function run_check(compiled: types.Compiled, item: types.Product, lineage: types.Lineage, run: Runner?, check: types.Check,
    findings: { types.Finding }, previous_status: string?, proposed_status: string?)
    if not run then
        findings[#findings + 1] = { code = "check_unavailable", check = check.fn, message = "check runner unavailable" }
        return
    end
    local out, err = run(check.fn, { config = check.config, view = snapshot.values_for(compiled, item, lineage, check.reads),
        product = { product_id = item.product_id, sku = item.sku, family = item.family, level = item.level },
        previous_status = previous_status, proposed_status = proposed_status })
    if err or not out then
        findings[#findings + 1] = { code = "check_unavailable", check = check.fn, message = err and tostring(err) or "check returned no findings" }
        return
    end
    for _, f in ipairs(out) do
        f.check = check.fn
        findings[#findings + 1] = f
    end
end

-- checks runs the family checks admitted at this cost ("interactive" runs
-- interactive checks; "release" runs all) and returns their view-wide findings.
function M.checks(compiled: types.Compiled, item: types.Product, lineage: types.Lineage, run: Runner?, cost: string): { types.Finding }
    local findings: { types.Finding } = {}
    local family = compiled.families[item.family]
    for _, check in ipairs(family and family.checks or {}) do
        if check.cost == "interactive" or cost == "release" then run_check(compiled, item, lineage, run, check, findings) end
    end
    return findings
end

-- enforced runs the family checks that enforce writes at the item's level and
-- returns their findings; any finding rejects the write.
function M.enforced(compiled: types.Compiled, item: types.Product, lineage: types.Lineage, run: Runner?, previous_status: string?): { types.Finding }
    local findings: { types.Finding } = {}
    local family = compiled.families[item.family]
    for _, check in ipairs(family and family.checks or {}) do
        if check.enforce and check.level == item.level then
            run_check(compiled, item, lineage, run, check, findings, previous_status, item.status)
        end
    end
    return findings
end

local function label(ctx: types.Ctx): string
    local keys: { string } = {}
    for k in pairs(ctx) do keys[#keys + 1] = k end
    table.sort(keys)
    local parts: { string } = {}
    for _, k in ipairs(keys) do parts[#parts + 1] = k .. "=" .. ctx[k] end
    return table.concat(parts, ";")
end

-- requirement returns the findings of one requirement set for an item.
function M.requirement(compiled: types.Compiled, item: types.Product, lineage: types.Lineage, req: types.Requirement): { types.Finding }
    local findings: { types.Finding } = {}
    for _, ctx in ipairs(req.contexts) do
        for _, code in ipairs(req.require) do
            local attr = compiled.attributes[code]
            local r = attr and resolve.resolve(compiled, item, lineage, attr, ctx)
            if not r or r.value == nil then
                findings[#findings + 1] = { code = "missing", attribute = code, context = label(ctx) }
            end
        end
        for _, code in ipairs(req.authored) do
            local attr = compiled.attributes[code]
            local r = attr and resolve.resolve(compiled, item, lineage, attr, ctx)
            if not r or r.value == nil or r.fallback or r.state == "default" then
                findings[#findings + 1] = { code = "not_authored", attribute = code, context = label(ctx) }
            end
        end
    end
    return findings
end

-- item returns findings per requirement set of the item's family; view-wide
-- check findings belong to every set.
function M.item(compiled: types.Compiled, item: types.Product, lineage: types.Lineage, run: Runner?, cost: string): Readiness
    local out: Readiness = {}
    local family = compiled.families[item.family]
    local view_wide = M.checks(compiled, item, lineage, run, cost)
    for _, req in ipairs(family and family.requirements or {}) do
        local findings = M.requirement(compiled, item, lineage, req)
        for _, f in ipairs(view_wide) do findings[#findings + 1] = f end
        out[req.id] = findings
    end
    return out
end

-- channel returns the findings that keep an item from a channel, and nil for an
-- item outside the families the channel carries.
function M.channel(compiled: types.Compiled, item: types.Product, lineage: types.Lineage, channel: types.Channel,
    view_wide: { types.Finding }): { types.Finding }?
    if channel.families then
        local carried = false
        for _, f in ipairs(channel.families) do if f == item.family then carried = true end end
        if not carried then return nil end
    end
    local findings: { types.Finding } = {}
    local family = compiled.families[item.family]
    local by_id: { [string]: types.Requirement } = {}
    for _, req in ipairs(family and family.requirements or {}) do by_id[req.id] = req end
    for _, id in ipairs(channel.requirements) do
        local req = by_id[id]
        if not req then
            findings[#findings + 1] = { code = "no_requirement_set", set = id }
        else
            for _, f in ipairs(M.requirement(compiled, item, lineage, req)) do
                f.set = id
                findings[#findings + 1] = f
            end
        end
    end
    for _, f in ipairs(view_wide) do findings[#findings + 1] = f end
    return findings
end

return M
