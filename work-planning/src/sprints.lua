-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local board_client = require("board_client")
local codec = require("codec")
local commands = require("commands")
local consts = require("consts")
local funcs = require("funcs")
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
local CLOSE = "kickside.work.planning:prepare_close"
local FIELD = "current_sprint"

type PreviewRequest = { board_id: string, sprint_id: string, rollover_id: string? }
type Snapshot = PreviewRequest & { head: integer, generation: integer, sprint_version: integer, members: { reads.EditMember } }
type Preview = { snapshot: Snapshot, token: string }
type CloseRequest = Preview & { key: string }

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

local function can_close(schema: reads.SchemaView, source: reads.GetResult): boolean
    -- Work evaluates ordinary exits against the sprint's retained process
    -- and the caller's access. Older Planning boards use an ordinary close.
    for _, transition in ipairs(source.transitions or {}) do
        if transition.id == "close" and transition.to == "closed" and not transition.region then return true end
    end
    -- Work does not advertise command-owned exits in ordinary discovery.
    local item = source.item
    local compiled = schema.compiled :: work.Compiled
    local process_id: string? = nil
    for _, item_type in ipairs(compiled.item_types) do
        if item_type.id == item.type then process_id = item_type.process; break end
    end
    for _, process in ipairs(compiled.processes) do
        if process.id == process_id and process.generation == item.process_generation then
            for _, transition in ipairs(process.transitions) do
                if transition.id == "close" and transition.to == "closed" and transition.prepare_command == CLOSE then
                    if transition.any then return true end
                    for _, state in ipairs(transition.from) do if state == item.state then return true end end
                end
            end
        end
    end
    return false
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
    if source.as_of ~= schema.as_of or source.generation ~= schema.generation then return nil, stale() end
    if not can_close(schema, source) then
        return nil, problem(errors.PERMISSION_DENIED, "planning_close_denied", "The sprint cannot transition to closed.")
    end
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

function M.prepare_close(input: unknown): (commands.ApplyRequest?, error?)
    local invalid = requests.parse("close", input, CONTRACT)
    if invalid then return nil, invalid end
    local request = input :: CloseRequest
    local snapshot = request.snapshot
    local held, token_err = codec.open(request.token, token_context(snapshot.board_id))
    if token_err and token_err:kind() == errors.UNAVAILABLE then return nil, token_err end
    if held ~= digest(snapshot) then
        return nil, problem(errors.INVALID, "planning_snapshot_invalid", "This snapshot token does not match the caller and preview.")
    end
    local schema, schema_err = active_schema(snapshot.board_id)
    if schema_err or not schema then return nil, schema_err end

    -- A newer head can only match an existing receipt. Work handles both the
    -- replay and the precondition in the same command path.
    if schema.as_of == snapshot.head then
        if schema.generation ~= snapshot.generation then return nil, stale() end
        local selected, select_err = members(snapshot)
        if select_err or not selected then return nil, select_err end
        if snapshot.rollover_id then
            local target, target_err = get(snapshot.board_id, snapshot.rollover_id)
            if target_err and target_err:kind() ~= errors.NOT_FOUND then return nil, target_err end
            if not target then return nil, ineligible() end
        end
    end
    local ops: { commands.Op } = {}
    for _, member in ipairs(snapshot.members) do
        local op: commands.Op = { op = "set", item = member.item_id, expect_version = member.version }
        if snapshot.rollover_id then
            op.values = { [FIELD] = { board = snapshot.board_id, item = snapshot.rollover_id } }
        else
            op.clear = { FIELD }
        end
        ops[#ops + 1] = op
    end
    ops[#ops + 1] = { op = "transition", item = snapshot.sprint_id, transition = "close", expect_version = snapshot.sprint_version }
    return { board_id = snapshot.board_id, mode = "atomic",
        key = "planning-close/" .. request.key, expected_head = snapshot.head, ops = ops, source = "planning",
        origin = { close_key = request.key, sprint_id = snapshot.sprint_id, rollover_id = snapshot.rollover_id } }, nil
end

function M.close(input: unknown): (commands.ApplyResult?, error?)
    local result, err = funcs.call("kickside.work.service:transition_command", { command = CLOSE, input = input })
    if err and (err:details() or {}).code == "head_changed" then return nil, stale() end
    return result :: commands.ApplyResult?, err
end

return M
