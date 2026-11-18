-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Point reads and pages share one transition catalogue and batched predicate evaluation.
local store = require("store")
local process = require("process")
local seams = require("seams")
local conditions = require("conditions")
local predicates = require("predicates")
local domain = require("domain")
local types = require("types")
local M = {}



function M.list(tx: types.Executor, board: domain.Board, items: { domain.Item }, dialect: string, writable: boolean): ({ [string]: { types.TransitionView } }?, error?)
    local out: { [string]: { types.TransitionView } } = {}
    local definitions: { [string]: { process: domain.Process, model: domain.Model } } = {}
    local groups: { types.TransitionGroup } = {}
    local by_key: { [string]: types.TransitionGroup } = {}
    for _, item in ipairs(items) do
        out[item.item_id] = {}
        if writable and item.life == "live" and board.model.item_types[item.type] then
            local identity = item.type .. ":" .. item.process_generation
            local recorded = definitions[identity]
            if not recorded then
                local definition, err, model = store.process(tx, board, item)
                if err or not definition or not model then return nil, err end
                recorded = { process = definition, model = model }
                definitions[identity] = recorded
            end
            local definition, model = recorded.process, recorded.model
            local function leaving(active: domain.Item, region: string?): error?
                local state = process.state_of(definition :: domain.Process, active.state) :: domain.State
                for _, t in ipairs(process.people(definition :: domain.Process, active.state)) do
                    if not process.named_refusal(state, t) then
                        local key = identity .. ":" .. t.id .. ":" .. (region or "")
                        local group = by_key[key]
                        if not group then
                            local where, err = predicates.rebind(t.when, model, board.model)
                            if err then return err end
                            local required: { string } = {}
                            for _, code in ipairs(t.require) do
                                local field = board.model.by_id[model.fields[code].id]
                                required[#required + 1] = field and field.code or code
                            end
                            group = { candidates = {}, items = {}, where = where, require = required }
                            by_key[key] = group
                            groups[#groups + 1] = group
                        end
                        group.items[#group.items + 1] = active
                        group.candidates[#group.candidates + 1] = { item = active, transition = t, region = region }
                    end
                end
                return nil
            end
            local err = leaving(item, nil)
            if err then return nil, err end
            local state = process.state_of(definition, item.state) :: domain.State
            for _, region in ipairs(state.regions or {}) do
                local err = leaving(process.region(item, region.id, definition), region.id)
                if err then return nil, err end
            end
        end
    end
    for _, group in ipairs(groups) do
        local matches: { [string]: boolean }? = nil
        if group.where ~= nil then
            local selected, err = conditions.matching(tx, board, group.items, group.where, conditions.actor(), dialect, nil, nil, true)
            if err or not selected then return nil, err end
            matches = selected
        end
        for _, candidate in ipairs(group.candidates) do
            if not matches or matches[candidate.item.item_id] then
                local t = candidate.transition
                local admitted, _, err = seams.guard(board, candidate.item, t, t.guards)
                if err then return nil, err end
                local list = admitted and out[candidate.item.item_id] or {}
                list[#list + 1] = { id = t.id, name = t.name, to = t.to, require = group.require, region = candidate.region }
            end
        end
    end
    return out, nil
end
return M
