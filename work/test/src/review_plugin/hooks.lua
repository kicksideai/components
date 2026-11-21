-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local time = require("time")
local types = require("types")
local M = {}
local GUARD = "app.review_plugin:review"

local function fault(mode: unknown): (unknown, error?)
    if mode == "error" then error("review provider crashed") end
    if mode == "timeout" then
        return nil, errors.new({ kind = errors.TIMEOUT, message = "review lookup timed out" })
    end
    if mode == "never" then
        while true do time.sleep("1s") end
    end
    if mode == "wrong" then return true, nil end
    if mode == "large" then return string.rep("x", 65537), nil end
    return nil, nil
end

function M.guard(request: types.GuardRequest): (unknown, error?)
    local result, err = fault(request.item.values.title)
    if err then return nil, err end
    if type(result) == "string" then
        return { allow = false, findings = { { code = "review_required", message = result } } }, nil
    end
    if result ~= nil then return result, nil end
    local allowed = ((request.item.values.risk or 0) :: integer) >= 2
    return { allow = allowed, findings = allowed and {} or {
        { code = "review_required", message = "A reviewer must assign a risk score of at least two.", field = "risk" }
    } }, nil
end

function M.operand(request: types.OperandRequest): (unknown, error?)
    local result, err = fault(request.config.mode)
    if result ~= nil or err then return result, err end
    return request.config.value or 2, nil
end

function M.provide(request: { config: { threshold: integer? } }): (types.ProviderResult, error?)
    return { version = "risk-v1", fragment = {
        fields = { { code = "risk", type = "app.review_plugin:risk", index = "number",
            config = { range = { request.config.threshold or 1, 10 } } } },
        item_types = { { id = "change", title = "Operational change", process = "change_review", fields = { "title", "risk" } } },
        processes = { { id = "change_review", initial = "proposed",
            states = { { id = "proposed", category = "unstarted" }, { id = "approved", category = "completed", invariants = { GUARD } } },
            transitions = { { id = "approve", from = { "proposed" }, to = "approved", guards = { GUARD } } },
        } },
    } }, nil
end
return M
