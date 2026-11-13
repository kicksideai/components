-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local rules = require("rules")
local consts = require("consts")
local types = require("types")
local M = {}

local function invalid(code: string, message: string): error
    return errors.new({ kind = errors.INVALID, message = message, details = { code = code } })
end

function M.validate(source: types.PrincipalSource, fields: { [string]: types.Field }): error?
    if type(source) ~= "table" or next(source) == nil then return invalid("approval_from_required", "principal source is a nonempty principal list, group or field") end
    local object = source :: { [string]: unknown }
    if object.group ~= nil or object.field ~= nil then
        local key = object.group ~= nil and "group" or "field"
        local id = object[key]
        for name in pairs(source) do if name ~= key then return invalid("approval_from_invalid", "principal source names one group or field") end end
        if type(id) ~= "string" or id == "" then return invalid("approval_" .. key .. "_invalid", "principal source has an exact " .. key .. " id") end
        if key == "field" then
            local field = fields[id]
            if not field or field.type ~= "principal" then return invalid("approval_field_invalid", "principal source field holds principals") end
        end
        return nil
    end
    local seen: { [string]: boolean } = {}
    local list = source :: { types.PrincipalDecl }
    for index, principal in pairs(list) do
        if type(index) ~= "number" or math.tointeger(index) == nil or index < 1 or index > #list or type(principal) ~= "table" then
            return invalid("approval_from_invalid", "principal source is a dense list")
        end
        for key in pairs(principal) do if key ~= "kind" and key ~= "id" then return invalid("approval_principal_invalid", "principal is {kind,id}") end end
        if not consts.PRINCIPAL_KINDS[principal.kind] or type(principal.id) ~= "string" or principal.id == "" then return invalid("approval_principal_invalid", "principal is {kind,id}") end
        local key = principal.kind .. ":" .. principal.id
        if seen[key] then return invalid("approval_principal_duplicate", "principals are distinct") end
        seen[key] = true
    end
    return nil
end

function M.holders(source: types.PrincipalSource): { types.Holder }
    if source.group then return { { group = source.group } } end
    if source.field then return { { field = source.field } } end
    local holders: { types.Holder } = {}
    for _, principal in ipairs(source :: { types.PrincipalDecl }) do holders[#holders + 1] = { [principal.kind] = principal.id } end
    return holders
end

function M.groups(rule: types.Approvals): { string }
    local groups: { string } = {}
    for _, holder in ipairs(M.holders(rule.from)) do if holder.group then groups[#groups + 1] = holder.group end end
    return groups
end

function M.rule(state: types.State): types.Approvals?
    if state.kind == "gate" then return state.release_when and state.release_when.approvals end
    if state.awaiting then return { min = 1, from = state.awaiting } end
    return nil
end

function M.check(rule: types.Approvals, item: types.Item, actor: string, board: types.Board, model: types.Model): (types.Finding?, error?)
    if rule.prevent_self and item.work and item.work.entered_by == actor then
        return { code = "approval_self_prevented", message = "gate entrant cannot approve" }, nil
    end
    local caller = board.caller
    if not caller then return nil, errors.new({ kind = errors.INTERNAL, message = "caller authority is unresolved", details = { code = "caller_unresolved" } }) end
    if not rules.holds(board, caller, M.holders(rule.from), item.document, model.fields) then
        return { code = "approval_ineligible", message = "caller is outside the approver set" }, nil
    end
    return nil, nil
end

return M
