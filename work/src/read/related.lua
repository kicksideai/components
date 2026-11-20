-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local budget = require("budget")
local json = require("json")
-- Bounded relation and comment pages over a committed board snapshot.
local access = require("access")
local cursor_codec = require("cursor_codec")
local reader = require("reader")
local read_rows = require("read_rows")
local store = require("store")
local peers = require("peers")
local domain = require("domain")
local types = require("types")
local M = {}

local function list_links(request: types.LinksRequest, context: types.ReadContext): (types.LinksResult?, error?)
    local limit = request.limit or 50
    if limit < 1 or limit > 200 then return nil, access.invalid("limit must be 1..200") end
    if (request.item == nil) == (request.target == nil) then return nil, access.invalid("links takes item or target") end
    local direction = request.direction or "both"
    if direction ~= "both" and direction ~= "inward" and direction ~= "outward" then return nil, access.invalid("direction is inward, outward or both") end
    if request.target and request.target.board ~= request.board_id then
        local visible, verr = peers.visible(request.target.board, request.target.item)
        if verr then return nil, verr end
        if not visible then return nil, errors.new({ kind = errors.NOT_FOUND, message = "item not found", details = { code = "item_not_found" } }) end
    end
    local out, err = access.with_snapshot(request.board_id, request.min_seq, function(tx: types.Executor, board: domain.Board, _dialect: string): (types.LinksResult?, error?)
        local item: domain.Item? = nil
        if request.item then
            local found, ferr = reader.find(tx, board, request.item)
            if ferr then return nil, ferr end
            if not found then return nil, errors.new({ kind = errors.NOT_FOUND, message = "item not found", details = { code = "item_not_found" } }) end
            item = found
        end
        if request.target and request.target.board == board.board_id then
            local target, verr = reader.find(tx, board, { id = request.target.item })
            if verr then return nil, verr end
            if not target then return nil, errors.new({ kind = errors.NOT_FOUND, message = "item not found", details = { code = "item_not_found" } }) end
        end
        local selector = request.target and { "target", request.target.board, request.target.item }
            or { direction, (item :: domain.Item).item_id }
        local binding = "kickside.work.links.v1\0" .. board.board_id .. "\0" .. (store.encode(selector) :: string)
        local after: domain.LinkPosition? = nil
        if request.after then
            local decoded, derr = cursor_codec.open(request.after, binding)
            if derr and derr:kind() == errors.UNAVAILABLE then return nil, derr end
            if not decoded then return nil, access.invalid("after is a link page cursor") end
            local position, perr = json.decode(decoded)
            if perr or type(position) ~= "table" then return nil, access.invalid("after is a link page cursor") end
            after = position :: domain.LinkPosition
        end
        local rows, rerr = read_rows.links(tx, board.board_id, item and item.item_id, request.target, direction, after, limit + 1)
        if rerr or not rows then return nil, rerr end
        local links: { types.RelationView } = {}
        local next_cursor: string? = nil
        for i = 1, math.min(#rows, limit) do
            local row = rows[i]
            local from_id, decode_err = store.need(row, "from_id")
            if decode_err or from_id == nil then return nil, decode_err end

            local board_id, decode_err = store.need(row, "board_id")
            if decode_err or board_id == nil then return nil, decode_err end

            local source = { board = board_id, item = from_id }
            local to_id, decode_err = store.need(row, "to_id")
            if decode_err or to_id == nil then return nil, decode_err end

            local to_board_id, decode_err = store.need(row, "to_board_id")
            if decode_err or to_board_id == nil then return nil, decode_err end

            local target = { board = to_board_id, item = to_id }
            local at, decode_err = store.need(row, "at")
            if decode_err or at == nil then return nil, decode_err end

            local relation_type, decode_err = store.need(row, "type")
            if decode_err or relation_type == nil then return nil, decode_err end

            links[#links + 1] = { type = relation_type, source = source, target = target, at = at }
            if i == limit and #rows > limit then
                local seq, err = store.need_int(row, "seq")
                if err or not seq then return nil, err end
                local position: domain.LinkPosition = { seq = seq, board_id = board_id, from_id = from_id,
                    type = relation_type, to_board_id = to_board_id, to_id = to_id }
                local seal_err: error?
                next_cursor, seal_err = cursor_codec.seal(store.encode(position) :: string, binding)
                if seal_err then return nil, seal_err end
            end
        end
        return { links = links, after = next_cursor }, nil
    end, context)
    if err or not out then return nil, err end
    -- Component authority resolves outside the SQL snapshot.
    for _, link in ipairs(out.links) do
        for _, key in ipairs({ "source", "target" }) do
            local peer = key == "source" and link.source or link.target
            if peer.board and peer.item then
                local visible, perr = peers.visible(peer.board :: string, peer.item :: string)
                if perr then return nil, perr end
                if not visible then
                    if key == "source" then link.source = { unavailable = true } else link.target = { unavailable = true } end
                end
            end
        end
    end
    return out, nil
end

local function list_comments(request: types.CommentsRequest, context: types.ReadContext): (types.CommentsResult?, error?)
    local limit = request.limit or 50
    if limit < 1 or limit > 200 then return nil, access.invalid("limit must be 1..200") end
    local after: domain.CommentPosition? = nil
    if request.after then
        local cursor, err = json.decode(request.after)
        if err or type(cursor) ~= "table" or type(cursor.created_at) ~= "string" or cursor.created_at == ""
            or type(cursor.comment_id) ~= "string" or cursor.comment_id == "" then
            return nil, access.invalid("after is a comment page cursor")
        end
        after = { created_at = cursor.created_at, comment_id = cursor.comment_id }
    end
    return access.with_snapshot(request.board_id, request.min_seq, function(tx: types.Executor, board: domain.Board, _dialect: string): (types.CommentsResult?, error?)
        local item, ierr = reader.find(tx, board, request.item)
        if ierr then return nil, ierr end
        if not item then return nil, errors.new({ kind = errors.NOT_FOUND, message = "item not found", details = { code = "item_not_found" } }) end
        local rows, rerr = store.comments(tx, board.board_id, item.item_id, limit + 1, after)
        if rerr or not rows then return nil, rerr end
        local comments: { types.CommentView } = {}
        for i = 1, math.min(#rows, limit) do
            local row = rows[i]
            comments[i] = { id = row.comment_id, body = row.body, mentions = row.mentions, author = row.author, version = row.version,
                created_at = row.created_at, edited_at = row.edited_at }
        end
        local next_cursor: string? = nil
        if #rows > limit then
            local last = rows[limit]
            next_cursor = store.encode({ created_at = last.created_at, comment_id = last.comment_id }) :: string
        end
        return { comments = comments, after = next_cursor }, nil
    end, context)
end
function M.list_links(request: types.LinksRequest): (types.LinksResult?, error?)
    return budget.run(request, function(context: types.ReadContext): (types.LinksResult?, error?) return list_links(request, context) end)
end
function M.list_comments(request: types.CommentsRequest): (types.CommentsResult?, error?)
    return budget.run(request, function(context: types.ReadContext): (types.CommentsResult?, error?) return list_comments(request, context) end)
end

return M
