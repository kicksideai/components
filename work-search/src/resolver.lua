-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local ctx = require("ctx")
local security = require("security")
local time = require("time")
local board_client = require("board_client")
local reads = require("reads")
local storage = require("storage")
local types = require("types")

local PLUGIN = "kickside.work_search:plugin"
local PROJECTION = "kickside.work_search:items"
local TEXT = "kickside.work_search:text"
local KEY = "kickside.work_search:key"
local VERIFICATION_BATCH = 100
local VERIFICATION_LIMIT = 2000

local function pending(code: string, message: string): error
    return errors.new({ kind = errors.UNAVAILABLE, retryable = true, message = message, details = { code = code } })
end

local function resolve_ids(request: types.ResolverRequest): ({ ids: { string } }?, error?)
    local selected = ctx.get("work_search") :: types.Selection?
    if not security.can("kickside.work.search.resolve", "kickside.work:search_resolver")
        or not selected or selected.board_id ~= request.board_id or (selected.scope ~= TEXT and selected.scope ~= KEY)
        or not selected.generation or not selected.as_of then
        return nil, errors.new({ kind = errors.PERMISSION_DENIED, message = "Work Search requires an adopted Work query scope",
            details = { code = "search_path_required" } })
    end
    local board, open_err = board_client.open()
    if open_err or not board then return nil, open_err end
    local raw, err = assert(board.plugin_context)(board, { board_id = request.board_id, plugin = PLUGIN })
    if err or not raw then return nil, err end
    local context = raw :: reads.PluginContext
    local projection = context.projections[PROJECTION]
    if not context.attachment_id or context.lifecycle.state == "failed" or (projection and projection.parked) then
        return nil, errors.new({ kind = errors.UNAVAILABLE, message = "Work Search projection is unavailable",
            details = { code = "search_unavailable" } })
    end

    local deadline = time.now():utc():add(1500 * time.MILLISECOND):format(time.RFC3339NANO)
    local rows, index_err = storage.candidates(context.attachment_id, selected.generation, selected.scope, request.query, VERIFICATION_LIMIT)
    if index_err or not rows then return nil, index_err end
    local query = assert(board.query)
    local ids: { string } = {}
    for first = 1, #rows, VERIFICATION_BATCH do
        local last = math.min(#rows, first + VERIFICATION_BATCH - 1)
        local keys: { string } = {}
        for i = first, last do keys[#keys + 1] = rows[i].item_key end
        local raw_page, read_err = query(board, { board_id = request.board_id, min_seq = selected.as_of,
            where = { field = "key", op = "in", value = keys }, limit = #keys, budget = { deadline = deadline } })
        if read_err and read_err:kind() == errors.TIMEOUT then
            return nil, pending("search_verification_budget", "Work Search candidate verification reached its deadline")
        end
        if read_err or not raw_page then return nil, read_err end
        local page = raw_page :: reads.QueryResult
        if page.generation ~= selected.generation or page.as_of ~= selected.as_of then
            return nil, pending("search_snapshot_changed", "Work changed while verifying search candidates")
        end
        if page.reindexing or page.incomplete or page.after then
            return nil, pending("search_verification_pending", "Work Search could not verify its candidate page")
        end
        local current: { [string]: reads.ItemView } = {}
        for _, item in ipairs(page.items) do current[item.key] = item end
        for i = first, last do
            local row = rows[i]
            local item = current[row.item_key]
            if item and item.id == row.item_id and item.updated_seq == row.source_seq then
                if #ids == request.limit then
                    return nil, pending("search_verification_budget", "Work Search found too many visible matches")
                end
                ids[#ids + 1] = item.id
            end
        end
    end
    return { ids = ids }, nil
end

return { resolve_ids = resolve_ids }
