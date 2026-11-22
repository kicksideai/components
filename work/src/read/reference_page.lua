-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local access = require("access")
local cursor_codec = require("cursor_codec")
local domain = require("domain")
local predicates = require("predicates")
local types = require("types")

local M = {}

-- Reference order has two indexed passes. The first walks stored keys and
-- offers only readable targets. The second walks item IDs and offers the null
-- keys (missing and redacted references), in the same tie order.
local NULL_START = "!"

local function reference_context(board_id: string, admission: string, item_id: string): string
    return "kickside.work.reference.v1\0" .. board_id .. "\0" .. admission .. "\0" .. item_id
end

function M.nulls(position: types.ReferenceOrder?): boolean
    return position ~= nil and position.after ~= nil and position.after.phase == "nulls"
end

function M.conditions(board: domain.Board, request: types.QueryRequest, order: { domain.Sort },
    position: types.ReferenceOrder): ({ domain.Condition }?, error?)
    local held = position.after
    if held and held.phase == "nulls" then
        if held.id ~= NULL_START then request.after = { id = held.id } end
        return {}, nil
    end
    local target, err = predicates.targets(board.compiled)(order[1].field)
    if err or not target then return nil, err end
    if held then
        local key = held.v
        if held.position then
            local open_err: error?
            key, open_err = cursor_codec.open(held.position, reference_context(board.board_id, position.admission, held.id))
            if open_err then return nil, open_err end
        end
        if type(key) ~= "string" then return nil, access.invalid("reference order requires a position") end
        request.after = { id = held.id, v = key }
    end
    return { { sql = "i." .. target.column .. " IS NOT NULL", args = {} } }, nil
end

function M.filter(page: types.QueryPage, board_id: string, field: string, nulls: boolean, admission: string): error?
    local phase = nulls and "nulls" or "keys"
    local items: { types.ItemView } = {}
    local keys: { domain.Cursor } = {}
    for i, item in ipairs(page.items) do
        local value = item.values[field]
        local available = type(value) == "table" and value.unavailable ~= true
        if available ~= nulls then
            local key = page.cursors[i]
            key.phase = phase
            items[#items + 1], keys[#keys + 1] = item, key
        end
    end
    local raw = page.after
    page.after = raw and { id = raw.id, phase = phase } or nil
    if nulls then page.following = page.after
    elseif raw then
        local last = keys[#keys]
        page.following = last
        if last and last.id == raw.id then page.after = last
        else
            local token, err = cursor_codec.seal(raw.v :: string, reference_context(board_id, admission, raw.id))
            if err or not token then return err end
            page.after = { id = raw.id, phase = phase, position = token }
        end
    else
        page.after = { id = NULL_START, phase = "nulls" }
        page.following = page.after
    end
    page.items, page.cursors = items, keys
    return nil
end

return M
