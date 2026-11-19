-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local board_client = require("board_client")
local codec = require("codec")
local consts = require("consts")
local hash = require("hash")
local query = require("query")
local reads = require("reads")
local requests = require("requests")
local security = require("security")
local values = require("values")
local work = require("work")

local M = {}
local CONTRACT = "kickside.work.planning:sprints"
local PLUGIN = "kickside.work.planning:plugin"
local FIELD = "current_sprint"

type PreviewRequest = { board_id: string, sprint_id: string, rollover_id: string? }
type Snapshot = PreviewRequest & { head: integer, generation: integer, sprint_version: integer, members: { reads.EditMember } }
type Preview = { snapshot: Snapshot, token: string }

local function problem(kind: string, code: string, message: string): error
    return errors.new({ kind = kind, message = message, details = { code = code } })
end

local function stale(): error
    return problem(errors.CONFLICT, "planning_snapshot_stale", "The board changed. Preview sprint closure again.")
end

local function ineligible(): error
    return problem(errors.INVALID, "planning_rollover_ineligible", "Choose a different planned or active sprint on this board.")
end

local function token_context(board_id: string): string
    return "work-planning/close/" .. board_id .. "/" .. security.actor():id()
end

local function digest(snapshot: Snapshot): string
    return tostring(hash.sha256(values.canonical(snapshot)))
end

local function active_schema(board_id: string): (reads.SchemaView?, error?)
    local data, err = board_client.call("get_schema", { board_id = board_id })
    if err or not data then return nil, err end
    local schema = data :: reads.SchemaView
    for _, plugin in ipairs(schema.plugins or {}) do
        if plugin.plugin == PLUGIN and plugin.active then return schema, nil end
    end
    return nil, problem(errors.NOT_FOUND, "plugin_inactive", "Work Planning is inactive on this board.")
end

local function members(request: PreviewRequest): (reads.EditSelection?, error?)
    local membership: work.Where = { field = FIELD, op = "eq", value = { board = request.board_id, item = request.sprint_id } }
    return query.select_for_edit({ board_id = request.board_id, limit = consts.LIMITS.ops - 1, order = { field = FIELD },
        where = { ["and"] = { membership, { field = "category", op = "in", value = { "triage", "backlog", "unstarted", "started" } } } } },
        membership, FIELD)
end

local function get(board_id: string, item_id: string, transitions: boolean?): (reads.GetResult?, error?)
    local result, err = board_client.call("get", { board_id = board_id, item = { id = item_id },
        include = transitions and { "transitions" } or nil })
    return result :: reads.GetResult?, err
end

function M.plan_close(input: unknown): (Preview?, error?)
    local invalid = requests.parse("plan_close", input, CONTRACT)
    if invalid then return nil, invalid end
    local request = input :: PreviewRequest
    local schema, schema_err = active_schema(request.board_id)
    if schema_err or not schema then return nil, schema_err end
    local source, source_err = get(request.board_id, request.sprint_id, true)
    if source_err or not source then return nil, source_err end
    if not source.access.write then
        return nil, problem(errors.PERMISSION_DENIED, "planning_write_required", "Sprint closure requires board WRITE.")
    end
    if source.item.type ~= "sprint" or source.item.state ~= "active" or source.item.life ~= "live" then
        return nil, problem(errors.INVALID, "planning_sprint_inactive", "Choose an active sprint.")
    end
    local can_close = false
    for _, transition in ipairs(source.transitions or {}) do
        if transition.id == "close" and transition.to == "closed" then can_close = true end
    end
    if not can_close then
        return nil, problem(errors.PERMISSION_DENIED, "planning_close_denied", "The sprint cannot transition to closed.")
    end
    if source.as_of ~= schema.as_of or source.generation ~= schema.generation then return nil, stale() end
    if request.rollover_id then
        if request.rollover_id == request.sprint_id then return nil, ineligible() end
        local target, target_err = get(request.board_id, request.rollover_id)
        if target_err and target_err:kind() ~= errors.NOT_FOUND then return nil, target_err end
        if not target or target.item.type ~= "sprint" or target.item.life ~= "live"
            or (target.item.state ~= "planned" and target.item.state ~= "active") then return nil, ineligible() end
        if target.as_of ~= source.as_of or target.generation ~= source.generation then return nil, stale() end
    end
    local selected, select_err = members(request)
    if select_err or not selected then return nil, select_err end
    if selected.as_of ~= source.as_of or selected.generation ~= source.generation then return nil, stale() end
    if selected.over_limit then
        return nil, problem(errors.INVALID, "planning_rollover_limit", "Use Work bulk to reduce unfinished membership to 199 issues, then preview again.")
    end
    local snapshot: Snapshot = { board_id = request.board_id, sprint_id = request.sprint_id, rollover_id = request.rollover_id,
        head = source.as_of :: integer, generation = source.generation :: integer, sprint_version = source.item.version, members = selected.members }
    local token, token_err = codec.seal(digest(snapshot), token_context(snapshot.board_id))
    if token_err or not token then return nil, token_err end
    return { snapshot = snapshot, token = token }, nil
end

return M
