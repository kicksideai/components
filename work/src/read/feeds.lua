-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local budget = require("budget")
local feed_cursor = require("feed_cursor")
local peers = require("peers")
-- The changes feed: cursor-resumable pages over durable state, so a consumer can
-- build its read model from cursor zero at any time and follow it.
local access = require("access")
local consts = require("consts")
local store = require("store")
local read_rows = require("read_rows")
local thread_reader = require("thread_reader")
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
-- position. Trashed items are deletes. A cursor below the durable floor gets a
-- gap: the consumer resyncs from zero.
local function access_stamp(board: domain.Board, selection: unknown?): string
    if board.caller == nil and selection == nil then return board.key_prefix end
    local actor = security.actor()
    return tostring(hash.sha256(values.canonical({ board.digest, board.caller, key_prefix = board.key_prefix,
        memberships = board.memberships, selection = selection, actor = selection and actor and actor:id() or nil })))
end

local function feed_floor(tx: types.Executor, board: domain.Board): (integer?, error?)
    local boundary, err = thread_reader.prune_boundary(tx, board.board_id)
    if err or not boundary then return nil, err end
    return math.max(board.tombstone_floor_seq, boundary.max_pruned_seq :: integer), nil
end

local function page(tx: types.Executor, board: domain.Board, dialect: string, request: types.ChangesRequest,
    allowance: types.ReadAllowance, projection: boolean?): (types.ChangesResult?, error?)
    local limit = math.min(request.limit or consts.LIMITS.page, allowance.remaining)
    local cursor: types.ChangesCursor = request.cursor or { seq = 0, item_id = "" }
    local stamp = projection and ("plugin-state:" .. board.key_prefix) or access_stamp(board, request.selection)
    if cursor.seq > 0 and stamp ~= cursor.access then
        return { items = {}, next = { seq = 0, item_id = "", access = stamp }, has_more = false, gap = { floor = board.applied_seq } }, nil
    end
    local floor, floor_err = feed_floor(tx, board)
    if floor_err or not floor then return nil, floor_err end
    if cursor.seq > 0 and cursor.seq < floor and (cursor.floor or 0) < floor then
        return { items = {}, next = cursor, has_more = false, gap = { floor = floor } }, nil
    end
    local anchor, anchor_err = feed_cursor.anchor(board.board_id, cursor)
    if anchor_err or anchor == nil then return nil, anchor_err end
    local rows, err = read_rows.changes(tx, board, cursor.seq, anchor, limit + 1)
    if err then return nil, errors.wrap(err, "changes read failed") end
    local inspected = math.min(#(rows or {}), limit)
    allowance.remaining = allowance.remaining - inspected
    local selected: { [string]: boolean }? = nil
    if request.selection then
        local ids: { string } = {}
        for i = 1, inspected do
            local id, decode_err = store.need(rows[i], "item_id")
            if decode_err then return nil, decode_err end
            ids[i] = id :: string
        end
        local select_err: error?
        selected, select_err = query.matching(tx, board, dialect, request.selection, ids)
        if select_err then return nil, select_err end
    end
    local items: { types.ChangeItem } = {}
    local processed = 0
    local disclosed = false
    local comments_left = 10000
    for i = 1, inspected do
        processed = i
        local r = rows[i] :: domain.Row
        local decoded_3, decode_err = store.need(r, "item_id")
        if decode_err then return nil, decode_err end
        local decoded_3 = decoded_3 :: string
        local held, herr = store.item(tx, board.board_id, decoded_3)
        if herr or not held then return nil, herr end
        local visible, previous = true, false
        if not projection then
            local aerr, perr: error?
            visible, aerr = access_rows.permits(tx, board, held.item_id)
            if aerr then return nil, aerr end
            previous, perr = access_rows.previous(tx, board, held, math.max(cursor.seq, cursor.floor or 0))
            if perr then return nil, perr end
        end
        if visible or previous then
            local live = held.life == "live" and visible and (not selected or selected[held.item_id] == true)
            local item: types.ChangeItem = { item_id = held.item_id, op = live and "upsert" or "delete",
                updated_seq = held.updated_seq }
            if visible then item.key = store.key_of(board.key_prefix, held.number); item.type = held.type; item.version = held.version end
            if live then
                local view, verr = item_view.render(tx, board, held, not projection, nil, projection)
                if verr or not view then return nil, verr end
                item.state, item.category, item.parent, item.values = view.state, view.category, view.parent, view.values
                item.rank = view.rank
                item.visit, item.process_generation = view.visit, view.process_generation
                item.value_states, item.gate, item.awaiting = view.value_states, view.gate, view.awaiting
                local comments, cerr = read_rows.comment_page(tx, board.board_id, held.item_id, "", 10001)
                if cerr then return nil, cerr end
                if #(comments or {}) > 10000 then
                    table.remove(comments :: { domain.CommentRow })
                    item.comments_truncated = true
                end
                -- A version is always a complete document. Defer the whole
                -- next item if it would exceed this response's comment cap.
                if #(comments or {}) > comments_left then processed = i - 1; break end
                comments_left = comments_left - #(comments or {})
                item.comments = {}
                for _, comment in ipairs(comments or {}) do
                    item.comments[#item.comments + 1] = {
                        comment_id = comment.comment_id, item_id = comment.item_id,
                        body = comment.body, mentions = comment.mentions, author = comment.author,
                        version = comment.version, deleted = comment.deleted,
                        created_at = comment.created_at, edited_at = comment.edited_at,
                    }
                end
            end
            items[#items + 1] = item
        end
        disclosed = visible or previous
        if comments_left == 0 then break end
    end
    local last = rows and rows[processed]
    local next_cursor: types.ChangesCursor = { seq = cursor.seq, item_id = cursor.item_id, position = cursor.position,
        access = stamp, floor = floor }
    if last then
        local item_id, id_err = store.need(last, "item_id")
        if id_err or not item_id then return nil, id_err end
        local seq, seq_err = store.need_int(last, "updated_seq")
        if seq_err or not seq then return nil, seq_err end
        next_cursor.seq = seq
        if disclosed and not projection then next_cursor.item_id, next_cursor.position = item_id, nil
        else
            local conceal_err = feed_cursor.conceal(board.board_id, next_cursor, item_id)
            if conceal_err then return nil, conceal_err end
        end
    elseif cursor.position and (cursor.floor or 0) ~= next_cursor.floor then
        local conceal_err = feed_cursor.conceal(board.board_id, next_cursor, anchor)
        if conceal_err then return nil, conceal_err end
    end
    return { items = items, next = next_cursor, has_more = #(rows or {}) > processed }, nil
end

function M.list_changes(request: types.ChangesRequest): (types.ChangesResult?, error?)
    local filter_err = selection(request.selection, 1)
    if filter_err then return nil, filter_err end
    local unsupported = access.non_item(request)
    if unsupported then return nil, unsupported end
    local limit = request.limit or consts.LIMITS.page
    if limit < 1 or limit > consts.LIMITS.page then return nil, access.invalid("limit must be 1.." .. consts.LIMITS.page) end
    return budget.run(request, function(context: types.ReadContext): (types.ChangesResult?, error?)
        local catalog: { [string]: domain.Field } = {}
        local result, read_err = access.with_snapshot(request.board_id, request.min_seq,
            function(tx: types.Executor, board: domain.Board, dialect: string): (types.ChangesResult?, error?)
                catalog = peers.catalog(board)
                return page(tx, board, dialect, request, context.allowance :: types.ReadAllowance)
            end, context, nil, request.selection)
        if read_err or not result then return nil, read_err end
        local err = peers.items(result.items, peers.redactor(catalog))
        if err then return nil, err end
        return result, nil
    end)
end

function M.projection_page(tx: types.Executor, board: domain.Board, dialect: string, cursor: types.ChangesCursor?,
    limit: integer, allowance: types.ReadAllowance): (types.ChangesResult?, error?)
    local result, read_err = page(tx, board, dialect, { board_id = board.board_id, cursor = cursor, limit = limit }, allowance, true)
    if read_err or not result then return nil, read_err end
    local err = peers.items(result.items, peers.redactor(peers.catalog(board), board.board_id))
    if err then return nil, err end
    return result, nil
end

function M.head(tx: types.Executor, board: domain.Board): (types.ChangesCursor?, error?)
    local floor, err = feed_floor(tx, board)
    if err or not floor then return nil, err end
    return { seq = board.applied_seq, item_id = "", access = access_stamp(board), floor = floor }, nil
end

return M
