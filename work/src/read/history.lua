-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local access = require("access")
local access_rows = require("access_rows")
local budget = require("budget")
local consts = require("consts")
local domain = require("domain")
local fields = require("fields")
local interval_views = require("interval_views")
local item_view = require("item_view")
local peers = require("peers")
local read_rows = require("read_rows")
local rules = require("rules")
local store = require("store")
local types = require("types")

local M = {}

local function has(include: { string }?, name: string): boolean
    for _, n in ipairs(include or {}) do
        if n == name then return true end
    end
    return false
end

local function cursor_of(text: string?): (integer?, integer?, error?)
    if not text then return nil, nil, nil end
    local seq, n = text:match("^(%d+):(%d+)$")
    if not seq or not n then return nil, nil, access.invalid("before is a cursor from a previous page") end
    return math.tointeger(tonumber(seq)), math.tointeger(tonumber(n)), nil
end

local function list_history(request: types.HistoryRequest, context: types.ReadContext): (types.HistoryResult?, error?)
    local unsupported = access.non_item(request)
    if unsupported then return nil, unsupported end
    local limit = request.limit or 50
    if limit < 1 or limit > consts.LIMITS.page then return nil, access.invalid("limit must be 1.." .. consts.LIMITS.page) end
    local before_seq, before_n, cerr = cursor_of(request.before)
    if cerr then return nil, cerr end
    local catalog: { [string]: domain.Field } = {}
    local result, read_err = access.with_snapshot(request.board_id, request.min_seq, function(tx: types.Executor, board: domain.Board, _dialect: string): (types.HistoryResult?, error?)
        local subject: string? = nil
        if request.item then
            local item, err = item_view.find(tx, board, request.item)
            if err then return nil, err end
            if not item then return nil, errors.new({ kind = errors.NOT_FOUND, message = "item not found", details = { code = "item_not_found" } }) end
            subject = "i:" .. item.item_id
        end
        catalog = peers.catalog(board)
        local rows, err = read_rows.history(tx, board.board_id, subject, before_seq, before_n, limit + 1)
        if err then return nil, errors.wrap(err, "history read failed") end
        local entries: { types.HistoryEntry } = {}
        for i = 1, math.min(#(rows or {}), limit) do
            local r = rows[i] :: domain.Row
            local field_id = store.int(r.field_id)
            local field = field_id and board.model.by_id[field_id] or nil
            local before, decode_err = store.stored(r.before, nil)
            if decode_err then return nil, decode_err end
            local after, decode_err = store.stored(r.after, nil)
            if decode_err then return nil, decode_err end
            if field then
                if before ~= nil then
                    local surface, err = fields.surface(field, before :: domain.Value)
                    if err then return nil, err end
                    before = surface :: domain.Json
                end
                if after ~= nil then
                    local surface, err = fields.surface(field, after :: domain.Value)
                    if err then return nil, err end
                    after = surface :: domain.Json
                end
            end
            local subject_text, decode_err = store.need(r, "subject")
            if decode_err or subject_text == nil then return nil, decode_err end

            local item_id = subject_text:match("^i:(.+)$")
            local visible = true
            local held: domain.Item? = nil
            if item_id then
                local herr: error?
                held, herr = store.item(tx, board.board_id, item_id)
                if herr then return nil, herr end
                visible = held ~= nil
                if held then
                    local allowed, aerr = access_rows.permits(tx, board, held.item_id)
                    if aerr then return nil, aerr end
                    visible = allowed
                end
            end
            if field_id and field_id > 0 and not field then visible = false end
            if field then visible = visible and rules.field(board, field, "read", held and held.document) end
            if visible and board.compiled.visibility then
                local kind, decode_err = store.need(r, "kind")
                if decode_err or kind == nil then return nil, decode_err end

                if kind == "link" or kind == "unlink" then
                    local target = type(after) == "table" and (after :: domain.JsonObject).target
                    if type(target) == "table" then
                        local ref = target :: { board: string?, item: string? }
                        if ref.board == board.board_id and ref.item then
                            local peer, perr = store.item(tx, board.board_id, ref.item)
                            if perr then return nil, perr end
                            if not peer or not rules.visible(board, peer.document) then after = nil end
                        end
                    end
                elseif kind == "parent" then
                    for _, side in ipairs({ "before", "after" }) do
                        local raw = side == "before" and before or after
                        if type(raw) == "string" then
                            local parent, perr = store.item(tx, board.board_id, raw)
                            if perr then return nil, perr end
                            if not parent or not rules.visible(board, parent.document) then
                                if side == "before" then before = nil else after = nil end
                            end
                        end
                    end
                elseif (kind == "created" or kind == "parent_refused") and type(after) == "table" then
                    local meta = after :: domain.JsonObject
                    if kind == "parent_refused" and type(before) == "string" then
                        local parent, perr = store.item(tx, board.board_id, before)
                        if perr then return nil, perr end
                        if not parent or not rules.visible(board, parent.document) then before = nil end
                    end
                    if type(meta.parent) == "string" then
                        local parent, perr = store.item(tx, board.board_id, meta.parent)
                        if perr then return nil, perr end
                        if not parent or not rules.visible(board, parent.document) then meta.parent = nil end
                    end
                end
            end
            if visible then
                local at, decode_err = store.need(r, "at")
                if decode_err or at == nil then return nil, decode_err end

                local actor, decode_err = store.need(r, "actor")
                if decode_err or actor == nil then return nil, decode_err end

                local kind, decode_err = store.need(r, "kind")
                if decode_err or kind == nil then return nil, decode_err end

                local subject, decode_err = store.need(r, "subject")
                if decode_err or subject == nil then return nil, decode_err end

                local count, decode_err = store.need_int(r, "n")
                if decode_err or count == nil then return nil, decode_err end

                local seq, decode_err = store.need_int(r, "seq")
                if decode_err or seq == nil then return nil, decode_err end

                entries[#entries + 1] = { seq = seq, n = count, subject = subject,
                    kind = kind, field = field and field.code or nil, before = before, after = after,
                    actor = actor, source = store.text(r.source), at = at }
            end
        end
        local last = rows and rows[math.min(#rows, limit)]
        local result: types.HistoryResult = { entries = entries }
        if #(rows or {}) > limit and last then
            local count, decode_err = store.need_int(last, "n")
            if decode_err or count == nil then return nil, decode_err end

            local seq, decode_err = store.need_int(last, "seq")
            if decode_err or seq == nil then return nil, decode_err end

            result.next = seq .. ":" .. count
        end
        if request.item and not request.before and has(request.include, "intervals") then
            local item, err = item_view.find(tx, board, request.item)
            if err or not item then return nil, err end
            local held, ierr = store.intervals(tx, board.board_id, item.item_id, nil, consts.LIMITS.page)
            if ierr or not held then return nil, ierr end
            local views, verr = interval_views.render(board, held, item.document)
            if verr or not views then return nil, verr end
            result.intervals = views
        end
        return result, nil
    end, context)
    if read_err or not result then return nil, read_err end
    local redact = peers.redactor(catalog)
    for _, entry in ipairs(result.entries) do
        if entry.field then
            local before, berr = redact(entry.field :: string, entry.before)
            if berr then return nil, berr end
            local after, aerr = redact(entry.field :: string, entry.after)
            if aerr then return nil, aerr end
            entry.before, entry.after = before :: domain.Json, after :: domain.Json
        end
        if (entry.kind == "link" or entry.kind == "unlink") and type(entry.after) == "table" then
            local body = entry.after :: domain.JsonObject
            if type(body.target) == "table" then
                local target = body.target :: { board: string?, item: string? }
                if target.board and target.item and target.board ~= request.board_id then
                    local visible, perr = peers.visible(target.board, target.item)
                    if perr then return nil, perr end
                    if not visible then body.target = { unavailable = true } end
                end
            end
        end
    end
    for _, entry in ipairs(result.entries) do
        if entry.kind == "moved_in" or entry.kind == "moved_out" then
            for _, side in ipairs({ "before", "after" }) do
                local raw = side == "before" and entry.before or entry.after
                if type(raw) == "table" then
                    local surface, err = peers.reference(raw)
                    if err then return nil, err end
                    if side == "before" then entry.before = surface :: domain.Json else entry.after = surface :: domain.Json end
                end
            end
        end
    end
    local ierr = interval_views.redact(result.intervals or {}, redact)
    if ierr then return nil, ierr end
    return result, nil
end

function M.list_history(request: types.HistoryRequest): (types.HistoryResult?, error?)
    return budget.run(request, function(context: types.ReadContext): (types.HistoryResult?, error?) return list_history(request, context) end)
end

return M
