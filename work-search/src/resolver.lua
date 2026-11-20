-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local ctx = require("ctx")
local security = require("security")
local work = require("work")
local storage = require("storage")

local PLUGIN = "kickside.work_search:plugin"
local PROJECTION = "kickside.work_search:items"
local TEXT = "kickside.work_search:text"
local KEY = "kickside.work_search:key"
type Request = { board_id: string, query: string, limit: integer }
type Selection = { board_id: string, scope: string, generation: integer, as_of: integer }
type Projection = { parked: boolean, error: unknown? }
type Context = { attachment_id: string, lifecycle: { state: string }, projections: { [string]: Projection } }
local function resolve_ids(request: Request): ({ ids: { string } }?, error?)
    local selected = ctx.get("work_search") :: Selection?
    if not security.can("kickside.work.search.resolve", "kickside.work:search_resolver")
        or not selected or selected.board_id ~= request.board_id or (selected.scope ~= TEXT and selected.scope ~= KEY)
        or not selected.generation or not selected.as_of then
        return nil, errors.new({ kind = errors.PERMISSION_DENIED, message = "Work Search requires an adopted Work query scope",
            details = { code = "search_path_required" } })
    end
    local board, open_err = work.open()
    if open_err or not board then return nil, open_err end
    local raw, err = board:plugin_context({ board_id = request.board_id, plugin = PLUGIN })
    if err or not raw then return nil, err end
    local context = raw :: Context
    local projection = context.projections[PROJECTION]
    if context.lifecycle.state == "failed" or (projection and projection.parked) then
        return nil, errors.new({ kind = errors.UNAVAILABLE, message = "Work Search projection is unavailable",
            details = { code = "search_unavailable" } })
    end

    local rows, index_err = storage.candidates(context.attachment_id, selected.generation, selected.scope, request.query, request.limit)
    if index_err or not rows then return nil, index_err end
    local ids: { string } = {}
    for _, row in ipairs(rows) do ids[#ids + 1] = row.item_id end
    return { ids = ids }, nil
end

return { resolve_ids = resolve_ids }
