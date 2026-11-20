-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Cross-board pages merge at most one bounded keyset page from each board.
local component = require("component")
local security = require("security")
local hash = require("hash")
local access = require("access")
local access_rows = require("access_rows")
local principals = require("principals")
local store = require("store")
local consts = require("consts")
local locate = require("locate")
local query = require("query")
local predicates = require("predicates")
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
    if request.group_by or request.sub_group_by or request.group_after or request.group_limit or request.measures then
        return nil, invalid("cross-board queries do not support grouping")
    end
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
        for id, edge in pairs(cursor.frontiers) do
            if not selected[id] then return nil, invalid("cross_after names an unselected board") end
            if edge ~= true then
                if type(edge) ~= "table" or (edge.v ~= nil and type(edge.v) ~= "string" and type(edge.v) ~= "number") then
                    return nil, invalid("cross_after holds stored sort values")
                end
            end
        end
    end
    local used: { [string]: boolean } = {}
    local _, ierr = predicates.inspect(request.where, used, 1)
    if ierr then return nil, ierr end
    local orders, sort_err = query.order(request.order)
    if sort_err or not orders then return nil, sort_err end
    if #orders ~= 1 then return nil, invalid("order takes one indexed field") end
    local sort = orders[1]
    used[sort.field] = true
    local forms: { [string]: string } = {}
    local origins: { [string]: string } = {}
    local admissions: { [string]: { generation: integer, digest: string, caller: domain.AccessCaller? } } = {}
    local context: types.ReadContext = { admitted = {}, holders = {}, allowance = allowance }
    local reference = false
    local db, db_err = store.open()
    if db_err or not db then return nil, db_err end
    local function admit(id: string): error?
        local board, err = store.board(db, id)
        if err then return err end
        if not board then
            return errors.new({ kind = errors.NOT_FOUND, message = "board has no schema", details = { code = "board_schema_missing" } })
        end
        local perr = principals.resolve(board, context)
        if perr then return perr end
        local resolve = access_rows.resolver(board, predicates.targets(board.compiled))
        for code in pairs(used) do
            local field = board.model.fields[code]
            local target, terr = resolve(code, code == sort.field and sort.ctx or nil)
            if terr and terr:kind() == errors.PERMISSION_DENIED then return terr end
            if terr or not target then return invalid("field " .. code .. " is unavailable on board " .. id, { id }) end
            if code == sort.field then
                if target.set then return invalid(code .. " holds several values and cannot sort", { id }) end
                reference = field ~= nil and field.type == "item"
            end
            local options: { [string]: integer } = {}
            for _, option in ipairs(field and field.options or {}) do options[option.id] = option.order end
            local form = values.canonical({ form = field and field.form or target.shape.form, cardinality = field and field.cardinality or "one",
                kind = target.kind, config = field and field.config or target.shape.config, options = options,
                reference = field ~= nil and field.type == "item" })
            if forms[code] and forms[code] ~= form then return invalid("field " .. code .. " has different forms on boards " .. origins[code] .. " and " .. id, { origins[code] :: string, id }) end
            forms[code], origins[code] = form, id
        end
        context.admitted[id] = true
        admissions[id] = { generation = board.generation, digest = board.digest, caller = board.caller }
        return nil
    end
    for _, id in ipairs(ids) do
        local aerr = admit(id)
        if aerr then db:release(); return nil, aerr end
    end
    db:release()
    local actor = security.actor()
    local admission, digest_err = hash.sha256(values.canonical({
        actor = actor and actor:id(), boards = admissions, where = request.where, scopes = request.scopes,
        order = { field = sort.field, dir = sort.dir or "asc" }, include_trashed = request.include_trashed == true,
    }))
    if digest_err or not admission then return nil, digest_err end
    if cursor and cursor.id ~= admission then return nil, invalid("cross_after belongs to the admitted query") end
    for id, held in pairs(cursor and cursor.boards or {}) do
        if (reference and held.phase ~= "keys" and held.phase ~= "nulls") or (not reference and held.phase ~= nil) then
            return nil, invalid("cross_after holds an invalid board position", { id })
        end
    end
    local function admitted(board: domain.Board): error?
        local expected = admissions[board.board_id]
        if board.generation ~= expected.generation or board.digest ~= expected.digest then
            return access.changed()
        end
        return nil
    end
    local function less(a: domain.Cursor, a_board: string, b: domain.Cursor, b_board: string): boolean
        if a.v ~= b.v then
            if a.v == nil then return false end
            if b.v == nil then return true end
            if type(a.v) ~= type(b.v) then return type(a.v) < type(b.v) end
            if sort.dir == "desc" then return b.v < a.v end
            return a.v < b.v
        end
        if a_board ~= b_board then return a_board < b_board end
        return a.id < b.id
    end

    local next_cursor: types.CrossCursor = { id = admission, boards = table.create(0, 1),
        frontiers = table.create(0, 1), selection = ids }
    for id, held in pairs(cursor and cursor.boards or {}) do next_cursor.boards[id] = held end
    for id, held in pairs(cursor and cursor.frontiers or {}) do next_cursor.frontiers[id] = held end
    local active: { string } = {}
    for _, id in ipairs(ids) do
        if next_cursor.frontiers[id] ~= true then active[#active + 1] = id end
    end
    table.sort(active, function(a: string, b: string): boolean
        local left, right = next_cursor.frontiers[a], next_cursor.frontiers[b]
        if left == nil then return right ~= nil or a < b end
        if right == nil then return false end
        return less(left :: domain.Cursor, a, right :: domain.Cursor, b)
    end)

    local candidates: { types.CrossCandidate } = {}
    local pages: { [string]: types.QueryPage } = {}
    local positions: { [string]: types.ReadStamp } = table.create(0, 1)
    local incomplete = false
    for i, id in ipairs(active) do
        if budget.expired(allowance) then incomplete = true; break end
        -- Reserve a row for each other board that can still establish a bound.
        local rows = math.max(1, allowance.remaining - (#active - i))
        local position = next_cursor.boards[id]
        local page, perr = query.page({ budget = { rows = rows }, include = request.include, board_id = id,
            where = request.where, scopes = request.scopes, order = sort, after = not reference and position or nil,
            limit = limit, min_seq = request.min_seq, include_trashed = request.include_trashed }, context, admitted,
            reference and { after = position, admission = admission } or nil)
        if perr or not page then return nil, perr end
        positions[id] = { as_of = page.as_of, generation = page.generation }
        if page.reindexing then return { items = {}, positions = positions, reindexing = true }, nil end
        if page.scanned ~= nil then
            pages[id] = page
            if reference then
                next_cursor.frontiers[id] = page.following or (not page.after and true or nil)
            else
                next_cursor.frontiers[id] = page.following or page.after or true
            end
            for n, item in ipairs(page.items) do
                candidates[#candidates + 1] = { board = id, index = n, key = page.cursors[n], item = item }
            end
        end
        incomplete = incomplete or page.incomplete == true
    end

    -- An unread board without a bound can precede every candidate. Otherwise
    -- the earliest remaining bound is the end of the globally ordered prefix.
    local blocked = false
    local boundary: domain.Cursor? = nil
    local owner: string? = nil
    for _, id in ipairs(active) do
        local bound = next_cursor.frontiers[id]
        if bound == nil then blocked = true; break end
        if type(bound) == "table" and (not boundary or less(bound, id, boundary, owner :: string)) then
            boundary, owner = bound :: domain.Cursor, id
        end
    end
    table.sort(candidates, function(a: types.CrossCandidate, b: types.CrossCandidate): boolean return less(a.key, a.board, b.key, b.board) end)
    local out: { types.ItemView } = {}
    local emitted: { [string]: integer } = {}
    if not blocked then
        for _, candidate in ipairs(candidates) do
            if #out == limit then break end
            if boundary and not less(candidate.key, candidate.board, boundary, owner :: string)
                and not (candidate.board == owner and candidate.key.id == boundary.id) then break end
            out[#out + 1] = candidate.item
            emitted[candidate.board] = candidate.index
            next_cursor.boards[candidate.board] = candidate.key
        end
    end

    local more = false
    for _, id in ipairs(active) do
        local page = pages[id]
        if page then
            local used = emitted[id] or 0
            if used < #page.items then
                next_cursor.frontiers[id] = page.cursors[used + 1]
            elseif page.after then
                next_cursor.boards[id] = page.after
            end
        end
        more = more or next_cursor.frontiers[id] ~= true
    end
    incomplete = incomplete or (more and #out < limit)
    return { incomplete = incomplete, items = out, cross_after = more and next_cursor or nil, positions = positions, reindexing = false }, nil
end
return M
