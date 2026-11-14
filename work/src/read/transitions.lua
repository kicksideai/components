-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Point reads and pages share one transition catalogue and batched predicate evaluation.
local store = require("store")
local process = require("process")
local seams = require("seams")
local conditions = require("conditions")
local domain = require("domain")
local types = require("types")
local M = {}



function M.list(tx: types.Executor, board: domain.Board, items: { domain.Item }, dialect: string, writable: boolean): ({ [string]: { types.TransitionView } }?, error?)
    local out: { [string]: { types.TransitionView } } = {}
    local definitions: { [string]: domain.Process } = {}
    local groups: { types.TransitionGroup } = {}
    local by_key: { [string]: types.TransitionGroup } = {}
    for _, item in ipairs(items) do
        out[item.item_id] = {}
        if writable and item.life == "live" and board.model.item_types[item.type] then
            local identity = item.type .. ":" .. item.process_generation
            local definition = definitions[identity]
            if not definition then
                local loaded, err = store.process(tx, board, item)
                if err or not loaded then return nil, err end
                definition = loaded
                definitions[identity] = loaded
            end
            local function leaving(active: domain.Item, region: string?)
                local state = process.state_of(definition :: domain.Process, active.state) :: domain.State
                for _, t in ipairs(process.people(definition :: domain.Process, active.state)) do
                    if not process.named_refusal(state, t) then
                        local key = identity .. ":" .. t.id .. ":" .. (region or "")
                        local group = by_key[key]
                        if not group then
                            group = { candidates = {}, items = {}, where = t.when }
                            by_key[key] = group
                            groups[#groups + 1] = group
                        end
                        group.items[#group.items + 1] = active
                        group.candidates[#group.candidates + 1] = { item = active, transition = t, region = region }
                    end
                end
            end
            leaving(item, nil)
            local state = process.state_of(definition, item.state) :: domain.State
            for _, region in ipairs(state.regions or {}) do leaving(process.region(item, region.id, definition), region.id) end
        end
    end
    for _, group in ipairs(groups) do
        local matches: { [string]: boolean }? = nil
        if group.where ~= nil then
            local selected, err = conditions.matching(tx, board, group.items, group.where, conditions.actor(), dialect)
            if err or not selected then return nil, err end
            matches = selected
        end
        for _, candidate in ipairs(group.candidates) do
            if not matches or matches[candidate.item.item_id] then
                local t = candidate.transition
                local admitted, _, err = seams.guard(board, candidate.item, t, t.guards)
                if err then return nil, err end
                local list = admitted and out[candidate.item.item_id] or {}
                list[#list + 1] = { id = t.id, name = t.name, to = t.to, require = t.require, region = candidate.region }
            end
        end
    end
    return out, nil
end
return M
