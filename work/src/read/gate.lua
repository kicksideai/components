-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local store = require("store")
local process = require("process")
local approvals = require("approvals")
local fields = require("fields")
local rules = require("rules")
local identity = require("identity")
local security = require("security")
local domain = require("domain")
local types = require("types")
local durations = require("durations")
local M = {}

local function principals(source: domain.PrincipalSource, board: domain.Board, item: domain.Item, model: domain.Model): ({ domain.PrincipalDecl }?, error?)
    if source.group then return { { kind = "group", id = source.group } }, nil end
    if not source.field then return source :: { domain.PrincipalDecl }, nil end
    local field = model.fields[source.field]
    local current = board.model.by_id[field.id]
    if not current or not rules.field(board, current, "read", item.document) then return nil, nil end
    local value = fields.value(field, item)
    if value == nil then return {}, nil end
    local surfaced, err = fields.surface(field, value)
    if err then return nil, err end
    if field.cardinality == "one" then return { surfaced :: domain.PrincipalDecl }, nil end
    return surfaced :: { domain.PrincipalDecl }, nil
end

function M.read(tx: types.Executor, board: domain.Board, item: domain.Item, include_gate: boolean?, include_awaiting: boolean?): (types.GateView?, types.AwaitingView?, error?)
    local model, err = store.process_model(tx, board, item)
    if err or not model then return nil, nil, err end
    local definition = model.processes[model.item_types[item.type].process]
    local state = process.state_of(definition, item.state)
    if not state then return nil, nil, nil end
    local rule = approvals.rule(state)
    local work = item.work :: domain.ProcessData
    local can_act = false
    if rule then
        local actor = security.actor()
        local refusal, aerr = approvals.check(rule, item, actor:id(), board, model)
        if aerr then return nil, nil, aerr end
        can_act = item.life == "live" and refusal == nil
    end
    local waiting: types.AwaitingView? = nil
    if rule and include_awaiting then
        local awaited, aerr = principals(rule.from, board, item, model)
        if aerr then return nil, nil, aerr end
        waiting = { since = work.entered_at :: string, can_act = can_act, principals = awaited }
        if state.due then
            local deadline, derr = durations.after(work.entered_at :: string, state.due)
            if derr then return nil, nil, derr end
            waiting.by = deadline
        end
    end
    if state.kind ~= "gate" or not include_gate then return nil, waiting, nil end
    local entrant, eerr = identity.principal_of_key(work.entered_by :: string)
    if eerr or not entrant then return nil, nil, eerr :: error? end
    local out: types.GateView = { entered_by = entrant :: domain.PrincipalDecl, entered_at = work.entered_at :: string, approvals = {}, can_approve = can_act }
    local rows, rerr = tx:query([[SELECT actor,decision,at FROM kickside_work_approval
        WHERE board_id=$1 AND item_id=$2 AND visit=$3 ORDER BY at,actor]], { board.board_id, item.item_id, item.visit })
    if rerr then return nil, nil, errors.wrap(rerr, "current approvals read failed") end
    for _, row in ipairs(rows or {}) do
        local actor, aerr = store.need(row, "actor")
        if aerr then return nil, nil, aerr end
        local principal, perr = identity.principal_of_key(actor :: string)
        if perr or not principal then return nil, nil, perr :: error? end
        local decision, derr = store.need(row, "decision")
        if derr then return nil, nil, derr end
        local at, terr = store.need(row, "at")
        if terr then return nil, nil, terr end
        out.approvals[#out.approvals + 1] = { principal = principal :: domain.PrincipalDecl, decision = decision :: string, at = at :: string }
    end
    return out, waiting, nil
end
return M
