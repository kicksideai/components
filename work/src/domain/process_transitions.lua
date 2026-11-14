-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local types = require("types")
local M = {}

function M.named_refusal(state: types.State, transition: types.Transition): types.Finding?
    if state.kind == "gate" and transition.id ~= "reject" then
        return { code = "gate_release_required", message = "gate leaves by release, rejection or administrator force" }
    elseif state.kind == "parallel" then
        return { code = "parallel_join_required", message = "parallel state leaves when its join holds" }
    end
    return nil
end

-- leaving lists the transitions that leave state, in declared order.
function M.leaving(p: types.Process, state: string, auto: boolean?): { types.Transition }
    local out: { types.Transition } = {}
    local positions: { [string]: integer } = {}
    for i, t in ipairs(p.transitions) do
        positions[t.id] = i
        if auto == nil or t.auto == auto then
            local from = t.any
            for _, s in ipairs(t.from) do
                if s == state then from = true end
            end
            if from then out[#out + 1] = t end
        end
    end
    table.sort(out, function(a: types.Transition, b: types.Transition): boolean
        return a.order < b.order or (a.order == b.order and positions[a.id] < positions[b.id])
    end)
    return out
end

-- People see ordinary exits and explicitly shared automation routes.
function M.people(p: types.Process, state: string): { types.Transition }
    local targets: { [string]: boolean } = {}
    for _, held in ipairs(p.states) do
        for _, key in ipairs({ "on_pass", "on_fail", "on_cancel", "on_exhausted" }) do
            local route = held.run and (held.run :: types.JsonObject)[key]
            if type(route) == "string" then targets[route] = true end
        end
    end
    local out: { types.Transition } = {}
    for _, transition in ipairs(M.leaving(p, state, nil)) do
        if transition.people == true or (transition.people ~= false and not transition.auto and not targets[transition.id]) then
            out[#out + 1] = transition
        end
    end
    return out
end
return M
