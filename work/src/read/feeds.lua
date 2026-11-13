-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local budget = require("budget")
local peers = require("peers")
-- The changes feed: cursor-resumable pages over durable state, so a consumer can
-- build its read model from cursor zero at any time and follow it.
local access = require("access")
local consts = require("consts")
local store = require("store")
local read_rows = require("read_rows")
local domain = require("domain")
local types = require("types")

local access_rows = require("access_rows")
local item_view = require("item_view")
local values = require("values")
local hash = require("hash")
local security = require("security")
local query = require("query")
local M = {}

-- A resumable selection changes only when its own item changes.
local function selection(raw: unknown, depth: integer): error?
    if depth > 16 then return access.invalid("source selection nests at most 16 levels") end
    if type(raw) ~= "table" then return nil end
    local node = raw :: { [string]: unknown }
    if node.rel ~= nil or node.children ~= nil or node.history ~= nil or node["$now"] ~= nil
        or node["$operand"] ~= nil or node.match ~= nil then
        return errors.new({ kind = errors.INVALID, message = "source filters use item-local fields and fixed operands",
            details = { code = "source_filter_unsupported" } })
    end
    for _, value in pairs(node) do
        local err = selection(value, depth + 1)
        if err then return err end
    end
    return nil
end

-- changes pages items in (updated_seq, item_id) order up to the projection
-- position. Trashed items are deletes. A cursor below the tombstone floor gets a
-- gap: the consumer resyncs from zero.
local function list_changes(request: types.ChangesRequest, context: types.ReadContext): (types.ChangesResult?, error?)
    local filter_err = selection(request.selection, 1)
    if filter_err then return nil, filter_err end
    local unsupported = access.non_item(request)
    if unsupported then return nil, unsupported end
    local limit = request.limit or consts.LIMITS.page
    if limit < 1 or limit > consts.LIMITS.page then return nil, access.invalid("limit must be 1.." .. consts.LIMITS.page) end
    local cursor: types.ChangesCursor = request.cursor or { seq = 0, item_id = "" }
    local catalog: { [string]: domain.Field } = {}
    local result, read_err = access.with_snapshot(request.board_id, request.min_seq, function(tx: types.Executor, board: domain.Board, dialect: string): (types.ChangesResult?, error?)
        catalog = peers.catalog(board)
        local stamp: string? = nil
        if board.caller or request.selection then
            local actor = security.actor()
            stamp = tostring(hash.sha256(values.canonical({ board.digest, board.caller, memberships = board.memberships, selection = request.selection,
                actor = request.selection and actor and actor:id() or nil })))
        end
        if cursor.seq > 0 and stamp ~= cursor.access then
            return { items = {}, next = { seq = 0, item_id = "", access = stamp }, has_more = false, gap = { floor = board.applied_seq } }, nil
        end
        if cursor.seq > 0 and cursor.seq < board.tombstone_floor_seq then
            return { items = {}, next = cursor, has_more = false, gap = { floor = board.tombstone_floor_seq } }, nil
        end
        local rows, err = read_rows.changes(tx, board, cursor.seq, cursor.item_id, limit + 1)
        if err then return nil, errors.wrap(err, "changes read failed") end
        local selected: { [string]: boolean }? = nil
        if request.selection then
            local ids: { string } = {}
            for i = 1, math.min(#(rows or {}), limit) do
                local id, decode_err = store.need(rows[i], "item_id")
                if decode_err then return nil, decode_err end
                ids[i] = id :: string
            end
            local select_err: error?
            selected, select_err = query.matching(tx, board, dialect, request.selection, ids)
            if select_err then return nil, select_err end
        end
        local items: { types.ChangeItem } = {}
        for i = 1, math.min(#(rows or {}), limit) do
            local r = rows[i] :: domain.Row
            local decoded_3, decode_err = store.need(r, "item_id")
            if decode_err then return nil, decode_err end
            local decoded_3 = decoded_3 :: string
            local held, herr = store.item(tx, board.board_id, decoded_3)
            if herr or not held then return nil, herr end
            local visible, aerr = access_rows.permits(tx, board, held.item_id)
            if aerr then return nil, aerr end
            local previous, perr = access_rows.previous(tx, board, held, cursor.seq)
            if perr then return nil, perr end
            if visible or previous then
                local live = held.life == "live" and visible and (not selected or selected[held.item_id] == true)
                local item: types.ChangeItem = { item_id = held.item_id, op = live and "upsert" or "delete",
                    updated_seq = held.updated_seq }
                if visible then item.key = store.key_of(board.key_prefix, held.number); item.type = held.type; item.version = held.version end
                if live then
                    local view, verr = item_view.render(tx, board, held, true)
                    if verr or not view then return nil, verr end
                    item.state, item.category, item.parent, item.values = view.state, view.category, view.parent, view.values
                    item.visit, item.process_generation = view.visit, view.process_generation
                    item.value_states, item.gate, item.awaiting = view.value_states, view.gate, view.awaiting
                    local comments, cerr = store.comments(tx, board.board_id, held.item_id, 10001, 0)
                    if cerr then return nil, cerr end
                    if #(comments or {}) > 10000 then
                        return nil, errors.new({ kind = errors.UNAVAILABLE, message = "comment document exceeds the read bound", details = { code = "comments_limit" } })
                    end
                    item.comments = comments
                end
                items[#items + 1] = item
            end
        end
        local last = rows and rows[math.min(#rows, limit)]
        local next_cursor: types.ChangesCursor = { seq = cursor.seq, item_id = cursor.item_id }
        if last then
        local decoded_1, decode_err = store.need(last, "item_id")
        if decode_err then return nil, decode_err end
        local decoded_1 = decoded_1 :: string
        local decoded_2, decode_err = store.need_int(last, "updated_seq")
        if decode_err then return nil, decode_err end
        local decoded_2 = decoded_2 :: integer
            next_cursor.seq, next_cursor.item_id = decoded_2, decoded_1
        end
        next_cursor.access = stamp
        return { items = items, next = next_cursor, has_more = #(rows or {}) > limit }, nil
    end, context, nil, request.selection)
    if read_err or not result then return nil, read_err end
    local err = peers.items(result.items, peers.redactor(catalog))
    if err then return nil, err end
    return result, nil
end

function M.list_changes(request: types.ChangesRequest): (types.ChangesResult?, error?)
    return budget.run(request, function(context: types.ReadContext): (types.ChangesResult?, error?) return list_changes(request, context) end)
end

return M
