-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Cross-board pages merge at most one bounded keyset page from each board.
local component = require("component")
local consts = require("consts")
local locate = require("locate")
local query = require("query")
local store = require("store")
local predicates = require("predicates")
local rules = require("rules")
local pages = require("pages")
local domain = require("domain")
local types = require("types")
local values = require("values")
local budget = require("budget")
local M = {}

local function invalid(message: string, boards: { string }?): error
    return errors.new({ kind = errors.INVALID, message = message, details = { code = "invalid_query", cap = 50, boards = boards } })
end

local function boards_of(request: types.QueryRequest): ({ string }?, error?)
    if request.boards == "readable" then
        local boards, err = locate.readable(51)
        if err or not boards then return nil, err end
        if #boards > 50 then return nil, invalid("cross-board query cap is 50 boards") end
        local ids: { string } = {}
        for _, board in ipairs(boards) do ids[#ids + 1] = board.board_id end
        table.sort(ids)
        return ids, nil
    end
    if type(request.boards) ~= "table" then return nil, invalid("boards is an id list or readable") end
    local ids = request.boards :: { string }
    if #ids > 50 then return nil, invalid("cross-board query cap is 50 boards") end
    local unique: { [string]: boolean } = {}
    for _, id in ipairs(ids) do
        if id == "" or unique[id] then return nil, invalid("boards contains distinct exact ids") end
        unique[id] = true
    end
    if #ids == 0 then return {}, nil end
    local rows, err = component.query({ component_ids = ids, impl_ids = { consts.BOARD_IMPL }, access_mask = component.ACCESS.READ :: integer, limit = 50 })
    if err then return nil, err :: error end
    local admitted: { [string]: boolean } = {}
    for _, row in ipairs(rows or {}) do admitted[row.component_id] = true end
    for _, id in ipairs(ids) do
        if not admitted[id] then return nil, errors.new({ kind = errors.PERMISSION_DENIED, message = "board access denied", details = { code = "board_denied", board_id = id } }) end
    end
    local result: { string } = {}
    for _, id in ipairs(ids) do result[#result + 1] = id end
    table.sort(result)
    return result, nil
end

function M.query(request: types.QueryRequest): (types.QueryResult?, error?)
    local allowance, allowance_err = budget.start(request.budget)
    if allowance_err or not allowance then return nil, allowance_err end
    local ids, err = boards_of(request)
    if err or not ids then return nil, err end
    local limit = request.limit or 50
    if limit < 1 or limit > 200 then return nil, invalid("limit must be 1..200") end
    if request.after then return nil, invalid("cross-board pages use cross_after") end
    local cursor = request.cross_after
    if cursor then
        if #cursor.selection ~= #ids then return nil, invalid("cross_after belongs to the selected boards") end
        local selected: { [string]: boolean } = {}
        for i, id in ipairs(ids) do
            if cursor.selection[i] ~= id then return nil, invalid("cross_after belongs to the selected boards") end
            selected[id] = true
        end
        for id in pairs(cursor.boards) do if not selected[id] then return nil, invalid("cross_after names an unselected board") end end
    end
    local used: { [string]: boolean } = {}
    local _, ierr = predicates.inspect(request.where, used, 1)
    if ierr then return nil, ierr end
    local sort: domain.Sort = { field = "rank" }
    if request.order then
        if request.order.field then sort = request.order :: domain.Sort
        else
            local orders = request.order :: { domain.Sort }
            if #orders ~= 1 then return nil, invalid("order takes one indexed field") end
            sort = orders[1]
        end
    end
    used[sort.field] = true
    local forms: { [string]: string } = {}
    local origins: { [string]: string } = {}
    local context: types.ReadContext = { admitted = {}, holders = {}, allowance = allowance }
    for _, id in ipairs(ids) do context.admitted[id] = true end
    local function compatible(board: domain.Board): error?
        local id = board.board_id
        for code in pairs(used) do
            local field = board.model.fields[code]
            if field and not rules.field(board, field, "read") then return rules.denied(code) end
            local target, terr = predicates.targets(board.compiled)(code)
            if terr or not target then return invalid("field " .. code .. " is unavailable on board " .. id, { id }) end
            local options: { [string]: integer } = {}
            for _, option in ipairs(field and field.options or {}) do options[option.id] = option.order end
            local form = values.canonical({ form = field and field.form or target.shape.form, cardinality = field and field.cardinality or "one",
                kind = target.kind, config = field and field.config or target.shape.config, options = options })
            if forms[code] and forms[code] ~= form then return invalid("field " .. code .. " has different forms on boards " .. origins[code] .. " and " .. id, { origins[code] :: string, id }) end
            forms[code], origins[code] = form, id
        end
        return nil
    end
    local candidates: { types.ItemView } = {}
    local keys: { unknown } = {}
    local owners: { string } = {}
    local cursors: { domain.Cursor } = {}
    local positions: { [string]: types.ReadStamp } = {}
    local more, reindexing, incomplete = false, false, false
    local empty_cursors: { [string]: domain.Cursor } = {}
    local kind: string? = nil
    for _, id in ipairs(ids) do
        if budget.expired(allowance) then incomplete = true; more = true; break end
        local page, perr = query.page({ budget = request.budget, include = request.include, board_id = id, where = request.where, scopes = request.scopes, order = sort,
            after = cursor and cursor.boards[id], limit = limit, min_seq = request.min_seq, include_trashed = request.include_trashed }, context, compatible)
        if perr or not page then return nil, perr end
        reindexing = reindexing or page.reindexing
        positions[id] = { as_of = page.as_of, generation = page.generation }
        kind = page.kind
        more = more or page.after ~= nil
        incomplete = incomplete or page.incomplete == true
        if #page.items == 0 and page.after then empty_cursors[id] = page.after end
        for i, item in ipairs(page.items) do
            item.board_id = id
            candidates[#candidates + 1], owners[#owners + 1], cursors[#cursors + 1] = item, id, page.cursors[i]
            if page.cursors[i].v == nil then keys[#keys + 1] = false else keys[#keys + 1] = page.cursors[i].v end
        end
    end
    if reindexing then return { items = {}, positions = positions, reindexing = true }, nil end
    local db, derr = store.open()
    if not db then return nil, derr end
    local ordered, oerr = pages.order(db, keys, kind == "number", sort.dir == "desc", limit + 1)
    db:release()
    if oerr or not ordered then return nil, oerr end
    local out: { types.ItemView } = {}
    local next_cursor: types.CrossCursor = { id = "cross", boards = {}, selection = ids }
    for id, held in pairs(cursor and cursor.boards or {}) do next_cursor.boards[id] = held end
    for id, held in pairs(empty_cursors) do next_cursor.boards[id] = held end
    for i = 1, math.min(#ordered, limit) do
        local ordinal = ordered[i]
        out[#out + 1] = candidates[ordinal]
        next_cursor.boards[owners[ordinal]] = cursors[ordinal]
    end
    return { incomplete = incomplete, items = out, cross_after = (more or #ordered > limit) and next_cursor or nil, positions = positions, reindexing = false }, nil
end
return M
