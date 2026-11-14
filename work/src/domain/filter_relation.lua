-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Relation quantifiers: { rel, dir?, q = some|every|none, where? } asks about the
-- items a typed link reaches. The range is the live items of the same board; a
-- link counts while its target is live. A link across boards reaches an item this
-- query cannot read, so every and none, which must account for all of the range,
-- answer false over one.
local types = require("types")

local M = {}

-- MAX_HOPS bounds how many relations one branch of a tree may cross.
M.MAX_HOPS = 3

local KEYS: { [string]: boolean } = { rel = true, dir = true, q = true, where = true, children = true }
local QUANTIFIERS: { [string]: boolean } = { some = true, every = true, none = true }

local function invalid(message: string): error
    return errors.new({ details = { code = "invalid_filter" }, kind = errors.INVALID, message = message })
end

local function quantified(s: types.RelationScope, raw: { [string]: unknown }, target: string, statement: string, args: { unknown }): (types.Condition?, error?)
    local q = raw.q
    if raw.where ~= nil then
        local inner, err = s.nested(raw.where, target)
        if err or not inner then return nil, err end
        statement = statement .. (q == "every" and " AND ((" .. inner.sql .. ") IS NOT TRUE)" or " AND (" .. inner.sql .. ")")
        for _, arg in ipairs(inner.args) do args[#args + 1] = arg end
    end
    return { sql = (q == "some" and "EXISTS (" or "NOT EXISTS (") .. statement .. ")", args = args }, nil
end

function M.compile(s: types.RelationScope, raw: { [string]: unknown }): (types.Condition?, error?)
    for k in pairs(raw) do
        if not KEYS[k] then return nil, invalid("relation condition has unknown key " .. tostring(k)) end
    end
    local q = raw.q
    if type(q) ~= "string" or not QUANTIFIERS[q] then return nil, invalid("graph condition takes q as some, every or none") end
    if q == "every" and raw.where == nil then return nil, invalid("every needs a where") end
    if s.hop >= M.MAX_HOPS then return nil, invalid("a filter tree crosses too many graph edges") end
    if raw.children ~= nil then
        if raw.children ~= true or raw.rel ~= nil or raw.dir ~= nil then return nil, invalid("children takes true and has no direction or relation") end
        local target = "t" .. (s.hop + 1)
        return quantified(s, raw, target, "SELECT 1 FROM " .. s.item_table .. " " .. target .. " WHERE " .. target .. ".parent_id = " .. s.alias .. ".item_id AND " .. target .. ".life = 'live'", {})
    end
    if type(raw.rel) ~= "string" then return nil, invalid("relation condition needs rel") end
    local relation = s.relations[raw.rel :: string]
    if not relation then return nil, invalid("unknown relation " .. tostring(raw.rel)) end
    local dir = raw.dir or "outward"
    if dir ~= "outward" and dir ~= "inward" then return nil, invalid("relation condition takes dir as outward or inward") end
    if relation.symmetric and raw.dir ~= nil then return nil, invalid("symmetric relation " .. relation.id .. " has no direction") end
    if s.hop >= M.MAX_HOPS then return nil, invalid("a filter tree crosses at most " .. M.MAX_HOPS .. " relations in one branch") end

    local me = s.alias .. ".item_id"
    local hop = s.hop + 1
    local l, target = "l" .. hop, "t" .. hop
    local board, from, to_board, to = l .. ".board_id", l .. ".from_id", l .. ".to_board_id", l .. ".to_id"
    local kind = l .. ".type"
    local id = s.reader.board_id

    -- local_links and foreign_links state which link rows touch this item,
    -- within the board and across boards; other is the item at the far end.
    local other: string, local_links: string, foreign_links: string
    local local_args: { unknown }, foreign_args: { unknown }
    if relation.symmetric then
        other = "CASE WHEN " .. from .. " = " .. me .. " THEN " .. to .. " ELSE " .. from .. " END"
        local_links = board .. " = ? AND " .. to_board .. " = ? AND (" .. from .. " = " .. me .. " OR " .. to .. " = " .. me .. ")"
        local_args = { id, id }
        foreign_links = "((" .. board .. " = ? AND " .. from .. " = " .. me .. " AND " .. to_board .. " <> ?) OR (" .. to_board .. " = ? AND " .. to .. " = " .. me .. " AND " .. board .. " <> ?))"
        foreign_args = { id, id, id, id }
    elseif dir == "outward" then
        other = to
        local_links = board .. " = ? AND " .. from .. " = " .. me .. " AND " .. to_board .. " = ?"
        local_args = { id, id }
        foreign_links = board .. " = ? AND " .. from .. " = " .. me .. " AND " .. to_board .. " <> ?"
        foreign_args = { id, id }
    else
        other = from
        local_links = to_board .. " = ? AND " .. to .. " = " .. me .. " AND " .. board .. " = ?"
        local_args = { id, id }
        foreign_links = to_board .. " = ? AND " .. to .. " = " .. me .. " AND " .. board .. " <> ?"
        foreign_args = { id, id }
    end

    local args: { unknown } = {}
    local function bind(list: { unknown })
        for _, a in ipairs(list) do args[#args + 1] = a end
    end
    local statement = "SELECT 1 FROM kickside_work_link " .. l .. " JOIN " .. s.item_table .. " " .. target .. " ON " .. target .. ".item_id = " .. other
        .. " WHERE " .. local_links .. " AND " .. kind .. " = ?"
    bind(local_args)
    bind({ relation.id })
    statement = statement .. " AND " .. target .. ".life = ?"
    bind({ "live" })
    local result, err = quantified(s, raw, target, statement, args)
    if err or not result then return nil, err end
    if q == "some" then return result, nil end
    local unknown_end = "SELECT 1 FROM kickside_work_link " .. l .. " WHERE " .. foreign_links .. " AND " .. kind .. " = ?"
    bind(foreign_args)
    bind({ relation.id })
    return { sql = "(" .. result.sql .. " AND NOT EXISTS (" .. unknown_end .. "))", args = args }, nil
end

return M
