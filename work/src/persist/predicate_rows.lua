-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local store = require("store")
local sql = require("sql")
local domain = require("domain")
local component = require("component")
local security = require("security")
local predicates = require("predicates")
local tables = require("tables")

local access_rows = require("access_rows")
local working_rows = require("working_rows")
local guard = require("guard")
local M = {}

-- Key resolution adds retained prefixes to the shared field predicates.

function M.resolver(tx: sql.DB | sql.Transaction, board: domain.Board): domain.Resolver
    return predicates.targets(board.compiled, function(raw: unknown): (unknown, error?)
        if type(raw) ~= "string" then return {} end
        local item, err = store.item_by_key(tx, raw)
        if err then return nil, err end
        return item and item.board_id == board.board_id and item.number or -1
    end, board.memberships)
end

-- Predicate execution reads generated rows through a bound plan.

function M.writable(board_id: string): (boolean, error?)
    local _, err = component.validate_access(board_id, component.ACCESS.WRITE :: integer)
    return guard.authorization(err :: error?)
end

function M.actor(): string?
    local actor = security.actor()
    return actor and actor:id()
end

function M.compile(tx: sql.DB | sql.Transaction, board: domain.Board, where: unknown, actor: string?, dialect: string): (domain.Condition?, error?)
    return predicates.compile(board.compiled, board.board_id, actor, where, dialect, M.resolver(tx, board))
end

function M.matching(tx: sql.DB | sql.Transaction, board: domain.Board, items: { domain.Item }, where: unknown, actor: string?, dialect: string, working: domain.WorkingState?, deny_unreadable: boolean?): ({ [string]: boolean }?, error?)
    local matched: { [string]: boolean } = {}
    if #items == 0 then return matched, nil end
    local used: { [string]: boolean } = {}
    local _, ierr = predicates.inspect(where, used, 1)
    if ierr then return nil, ierr end
    local base = M.resolver(tx, board)
    local eligible: { string } = {}
    for _, item in ipairs(items) do
        local doc: domain.Document? = item.document
        if predicates.related(where) then doc = nil end
        local resolve = access_rows.resolver(board, base, doc)
        local allowed = true
        for code in pairs(used) do
            local _, err = resolve(code)
            if err and err:kind() == errors.PERMISSION_DENIED and not deny_unreadable then allowed = false
            elseif err then return nil, err end
        end
        if allowed then eligible[#eligible + 1] = item.item_id end
    end
    if #eligible == 0 then return matched, nil end
    local secured, serr = access_rows.where(board, where)
    if serr then return nil, serr end
    local fragment, err = predicates.compile(board.compiled, board.board_id, actor, secured, dialect, base)
    if err or not fragment then return nil, err end
    local working_items: { [string]: domain.Item } = {}
    for id, item in pairs(working and working.items or {}) do working_items[id] = item end
    for _, item in ipairs(items) do working_items[item.item_id] = item end
    local overlay, oerr = working_rows.compile(board, items[1], dialect, { items = working_items, links = working and working.links or {} })
    if oerr or not overlay then return nil, oerr end
    local names = tables.names(board.board_id)
    local predicate = fragment.sql:gsub(names.item, "working_items"):gsub(names.set, "working_set"):gsub("kickside_work_link", "working_links")
    local params: { unknown } = {}
    for _, value in ipairs(overlay.args) do params[#params + 1] = value end
    for _, value in ipairs(fragment.args) do params[#params + 1] = value end
    local marks: { string } = {}
    for _, id in ipairs(eligible) do marks[#marks + 1] = "?"; params[#params + 1] = id end
    local statement = overlay.sql .. " SELECT i.item_id FROM working_items i WHERE (" .. predicate .. ") AND i.item_id IN (" .. table.concat(marks, ",") .. ")"
    local n = 0
    statement = statement:gsub("%?", function(): string n = n + 1; return "$" .. n end)
    local rows, qerr = tx:query(statement, params)
    if qerr then return nil, qerr end
    for _, row in ipairs(rows or {}) do
        local id, derr = store.need(row, "item_id")
        if derr then return nil, derr end
        matched[id :: string] = true
    end
    return matched, nil
end

function M.point(tx: sql.DB | sql.Transaction, board: domain.Board, item: domain.Item, where: unknown, actor: string?, dialect: string, working: domain.WorkingState?): (boolean, error?)
    local matched, err = M.matching(tx, board, { item }, where, actor, dialect, working, true)
    if err or not matched then return false, err end
    return matched[item.item_id] == true, nil
end

function M.filter(tx: sql.Transaction, board: domain.Board, rows: { domain.Item }, where: unknown, dialect: string): ({ domain.Item }?, error?)
    local fragment, err = M.compile(tx, board, where, nil, dialect)
    if err or not fragment then return nil, err end
    local out: { domain.Item } = {}
    local matched: { [string]: boolean } = {}
    for first = 1, #rows, 100 do
        local marks: { string } = {}
        local args: { unknown } = {}
        for _, value in ipairs(fragment.args) do args[#args + 1] = value end
        for i = first, math.min(first + 99, #rows) do marks[#marks + 1] = "?"; args[#args + 1] = rows[i].item_id end
        local statement = "SELECT i.item_id FROM " .. tables.names(board.board_id).item .. " i WHERE (" .. fragment.sql .. ") AND i.item_id IN (" .. table.concat(marks, ",") .. ")"
        local n = 0
        statement = statement:gsub("%?", function(): string n = n + 1; return "$" .. n end)
        local found, ferr = tx:query(statement, args)
        if ferr then return nil, ferr end
        for _, row in ipairs(found or {}) do
            local decoded_1, decode_err = store.need(row, "item_id")
            if decode_err then return nil, decode_err end
            local decoded_1 = decoded_1 :: string
            matched[decoded_1] = true
        end
    end
    for _, row in ipairs(rows) do if matched[row.item_id] then out[#out + 1] = row end end
    return out, nil
end

return M
