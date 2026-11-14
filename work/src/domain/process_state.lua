-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local consts = require("consts")
local durations = require("durations")
local types = require("types")
local approvals_rules = require("approvals")
local M = {}

local function invalid(code: string, message: string, details: types.JsonObject?): error
    local detail = details or {}
    detail.code = code
    return errors.new({ kind = errors.INVALID, message = message, details = detail })
end

local function keys(raw: unknown, allowed: { [string]: boolean }, code: string): error?
    if type(raw) ~= "table" then return invalid(code, "declaration is an object") end
    for key in pairs(raw :: { [string]: unknown }) do
        if not allowed[key] then return invalid(code, "unknown property " .. tostring(key)) end
    end
    return nil
end

local function duration(value: unknown): error?
    local _, err = durations.duration(value)
    return err
end

function M.compile(decl: types.StateDecl, fields: { [string]: types.Field }): error?
    local kind = decl.kind or "human"
    if decl.awaiting ~= nil then
        if kind == "automated" or kind == "gate" then return invalid("state_awaiting_kind", "awaiting belongs to manual states; gates use approvers") end
        local err = approvals_rules.validate(decl.awaiting, fields)
        if err then return err end
    end
    if decl.due ~= nil then
        if kind ~= "human" then return invalid("state_due_kind", "due belongs to human states") end
        local err = duration(decl.due)
        if err then return err end
    end
    if kind == "automated" then
        local run = decl.run
        local err = keys(run, consts.STAGE_KEYS, "stage_run_invalid")
        if err then return err end
        if type(run.stage) ~= "string" or run.stage == "" then return invalid("stage_required", "automated state declares run.stage") end
        if run.max_visits ~= nil and (math.type(run.max_visits) ~= "integer" or run.max_visits < 1) then
            return invalid("stage_max_visits_invalid", "max_visits is a positive integer")
        end
        if run.timeout ~= nil then local err = duration(run.timeout); if err then return err end end
        if run.retry then
            local err = keys(run.retry, consts.RETRY_KEYS, "stage_retry_invalid")
            if err then return err end
            if math.type(run.retry.max) ~= "integer" or run.retry.max < 1 then return invalid("stage_retry_max", "retry max is a positive attempt count") end
            local err = duration(run.retry.backoff)
            if err then return err end
        end
    elseif decl.run ~= nil then return invalid("state_run_kind", "run belongs to automated states") end
    if kind == "gate" then
        local release = decl.release_when
        local err = keys(release, consts.RELEASE_KEYS, "gate_release_invalid")
        if err then return err end
        if next(release) == nil then return invalid("gate_release_empty", "gate declares a release condition") end
        if release.wait then local err = duration(release.wait); if err then return err end end
        local approvals = release.approvals
        if approvals then
            local err = keys(approvals, consts.APPROVAL_KEYS, "gate_approvals_invalid")
            if err then return err end
            if math.type(approvals.min) ~= "integer" or approvals.min < 1 then return invalid("approval_min_invalid", "approval min is a positive integer") end
            if approvals.prevent_self ~= nil and type(approvals.prevent_self) ~= "boolean" then return invalid("approval_prevent_self_invalid", "prevent_self is boolean") end
            local err = approvals_rules.validate(approvals.from, fields)
            if err then return err end
            if not approvals.from.field and not approvals.from.group then
                local grouped = false
                for _, principal in ipairs(approvals.from :: { types.PrincipalDecl }) do grouped = grouped or principal.kind == "group" end
                if not grouped and approvals.min > #approvals.from then return invalid("approval_min_unreachable", "approval min exceeds its principal set") end
            end
        end
    elseif decl.release_when ~= nil then return invalid("state_release_kind", "release_when belongs to gates") end
    if kind == "parallel" then
        if type(decl.regions) ~= "table" or #decl.regions < 1 then return invalid("parallel_regions_empty", "parallel declares regions") end
        local seen: { [string]: boolean } = {}
        for _, region in ipairs(decl.regions) do
            local err = keys(region, consts.REGION_KEYS, "parallel_region_invalid")
            if err then return err end
            if type(region.id) ~= "string" or not region.id:match(consts.ID_PATTERN) or seen[region.id] then return invalid("parallel_region_id", "region ids are distinct") end
            seen[region.id] = true
        end
        if decl.join ~= "all" and decl.join ~= "any" and (math.type(decl.join) ~= "integer" or decl.join < 1 or decl.join > #decl.regions) then return invalid("parallel_join_invalid", "join is all, any or a region count") end
    elseif decl.regions ~= nil or decl.join ~= nil then return invalid("state_regions_kind", "regions and join belong to parallel states") end
    local seen: { [string]: boolean } = {}
    for _, timer in ipairs(decl.timers or {}) do
        local err = keys(timer, consts.TIMER_KEYS, "timer_invalid")
        if err then return err end
        if type(timer.id) ~= "string" or not timer.id:match(consts.ID_PATTERN) or seen[timer.id] then return invalid("timer_id_invalid", "timer ids are distinct") end
        seen[timer.id] = true
        if (timer.after == nil) == (timer.at_field == nil) then return invalid("timer_deadline_invalid", "timer declares after or at_field") end
        if timer.after then local err = duration(timer.after); if err then return err end end
        if timer.at_field then
            local f = fields[timer.at_field]
            if not f or f.form ~= "time" or f.cardinality ~= "one" then return invalid("timer_field_invalid", "at_field names a single time field") end
        end
        if timer.by then
            if not fields[timer.by] or type(timer.table) ~= "table" or next(timer.table) == nil then return invalid("timer_lookup_invalid", "timer by names a field and a duration table") end
            for _, value in pairs(timer.table) do local err = duration(value); if err then return err end end
        elseif timer.table then return invalid("timer_lookup_invalid", "timer table requires by") end
        if timer.interrupting ~= nil and type(timer.interrupting) ~= "boolean" then return invalid("timer_interrupting_invalid", "interrupting is boolean") end
        if timer["repeat"] then
            if timer.interrupting then return invalid("timer_repeat_interrupting", "only non-interrupting timers repeat") end
            local err = duration(timer["repeat"])
            if err then return err end
        end
        local effect = timer["then"] :: types.TimerEffect
        local err = keys(effect, consts.TIMER_EFFECT_KEYS, "timer_effect_invalid")
        if err then return err end
        if (effect.emit == nil) == (effect.transition == nil) then return invalid("timer_effect_invalid", "timer then emits or transitions") end
    end
    return nil
end
function M.acyclic(edges: { [string]: { types.Transition } }, code: string, label: string): error?
    local active: { [string]: boolean } = {}
    local done: { [string]: boolean } = {}
    local chain: { string } = {}
    local function visit(state: string): error?
        if active[state] then return invalid(code, label .. " cycle " .. table.concat(chain, " -> ") .. " -> " .. state, { state = state }) end
        if done[state] then return nil end
        active[state] = true
        chain[#chain + 1] = state
        for _, t in ipairs(edges[state] or {}) do
            local err = visit(t.to)
            if err then return err end
        end
        chain[#chain] = nil
        active[state], done[state] = nil, true
        return nil
    end
    for state in pairs(edges) do
        local err = visit(state)
        if err then return err end
    end
    return nil
end
return M
