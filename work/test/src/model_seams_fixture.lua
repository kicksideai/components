-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local security = require("security")
local types = require("types")
local M = {}
function M.group_guard(request: types.GuardRequest): (types.GuardResult?, error?)
    for _, group in ipairs(request.actor.groups) do
        if group == "app.security:work_test" then return { allow = true, findings = {} }, nil end
    end
    return { allow = false, findings = { { code = "model_group_required", message = "caller belongs to the model group" } } }, nil
end
function M.guard(request: types.GuardRequest): (types.GuardResult?, error?)
    local actor = security.actor()
    if not actor or actor:id() ~= request.actor.id then
        return nil, errors.new({ kind = errors.UNAVAILABLE, message = "caller is missing", details = { code = "guard_caller_missing" } })
    end
    if request.item.values.estimate == -1 then return nil, errors.new({ kind = errors.UNAVAILABLE, message = "guard is offline", details = { code = "guard_offline" } }) end
    if request.item.values.estimate == 1000 then return ({ allow = true, findings = { invalid = true } } :: unknown) :: types.GuardResult, nil end
    if request.item.values.estimate == 0 then return { allow = false, findings = {} }, nil end
    local allowed = ((request.item.values.estimate or 0) :: number) >= 2
    return { allow = allowed, findings = allowed and {} or { { code = "estimate_required", message = "estimate is at least two" } } }, nil
end
function M.operand(request: types.OperandRequest): (types.OperandResult?, error?)
    local actor = security.actor()
    if not actor or actor:id() ~= request.actor.id then
        return nil, errors.new({ kind = errors.UNAVAILABLE, message = "caller is missing", details = { code = "operand_caller_missing" } })
    end
    local value = (request.config.value or 2) :: types.OperandResult
    if request.config.scalar then return value, nil end
    return { value }, nil
end
function M.resolve_ids(request: { [string]: unknown }): (unknown, error?)
    local actor = security.actor()
    if not actor then return nil, errors.new({ kind = errors.UNAVAILABLE, message = "caller is missing", details = { code = "search_caller_missing" } }) end
    if request.query == "unavailable" then return nil, errors.new({ kind = errors.UNAVAILABLE, message = "search is offline", details = { code = "search_offline" } }) end
    if request.limit ~= 1000 then return nil, errors.new({ kind = errors.INVALID, message = "search limit is required", details = { code = "search_limit_missing" } }) end
    return { ids = { request.query } }, nil
end
return M
