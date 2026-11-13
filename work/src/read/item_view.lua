-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local gate = require("gate")
local access = require("access")
local fields = require("fields")
local store = require("store")
local rules = require("rules")
local access_rows = require("access_rows")
local domain = require("domain")
local types = require("types")
local M = {}

-- values_of renders held values under declared field codes.
local function item_view(board: domain.Board, item: domain.Item): (types.ItemView?, error?)
    local values: { [string]: unknown } = {}
    local states: { [string]: string } = {}
    local carried = board.model.item_types[item.type]
    for _, code in ipairs(carried and carried.fields or {}) do
        local f = board.model.fields[code]
        if f and rules.field(board, f, "read", item.document) then
            local cell = item.document[tostring(f.id)]
            states[code] = not cell and "absent" or cell.c == 1 and "cleared" or "provided"
            local value = fields.value(f, item)
            if f.type == "rank" then states[code] = value ~= nil and "provided" or "absent" end
            if value ~= nil then
                local surface, err = fields.surface(f, value)
                if err then return nil, err end
                values[code] = surface
            end
        end
    end
    return { board_id = board.board_id, id = item.item_id, key = store.key_of(board.key_prefix, item.number), type = item.type, state = item.work and item.work.regions or item.state, category = item.category, visit = item.visit,
        process_generation = item.process_generation, version = item.version,
        findings = item.findings or {}, parent = item.parent_id, rank = item.rank, life = item.life, values = values, value_states = states, created_seq = item.created_seq,
        updated_seq = item.updated_seq }
end

local function render(tx: types.Executor, board: domain.Board, item: domain.Item, include_gate: boolean?, include_awaiting: boolean?): (types.ItemView?, error?)
    local view, verr = item_view(board, item)
    if verr or not view then return nil, verr end
    if item.parent_id and board.compiled.visibility then
        local allowed, err = access_rows.permits(tx, board, item.parent_id)
        if err then return nil, err end
        if not allowed then view.parent = nil end
    end
    if include_awaiting == nil then include_awaiting = include_gate end
    if include_gate or include_awaiting then
        local current, waiting, gerr = gate.read(tx, board, item, include_gate, include_awaiting)
        if gerr then return nil, gerr end
        view.gate, view.awaiting = current, waiting
    end
    return view, nil
end

-- find resolves an item reference by id or key.
local function find(tx: types.Executor, board: domain.Board, ref: types.ItemRef): (domain.Item?, error?)
    if ref.id ~= nil and ref.id ~= "" then
        local allowed, aerr = access_rows.permits(tx, board, ref.id)
        if aerr or not allowed then return nil, aerr end
        local item, err = store.item(tx, board.board_id, ref.id)
        if item and not rules.visible(board, item.document) then return nil, nil end
        return item, err
    end
    if ref.key ~= nil and ref.key ~= "" then
        local item, err = store.item_by_key(tx, ref.key)
        if err or not item then return nil, err end
        if item.board_id ~= board.board_id then return nil, nil end
        local allowed, aerr = access_rows.permits(tx, board, item.item_id)
        if aerr or not allowed then return nil, aerr end
        return item, nil
    end
    return nil, access.invalid("item needs an id or a key")
end

M.render = render
M.find = find
return M
