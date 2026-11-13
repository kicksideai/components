-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local process = require("process")
local approval_rules = require("approval_rules")
local values = require("values")
local fields = require("fields")
-- Prepare reads one projection position before subject CAS appends the plan.
local sql = require("sql")
local component = require("component")
local items = require("items")
local store = require("store")
local domain = require("domain")
local types = require("types")
local policy = require("policy")
local principals = require("principals")
local memberships = require("memberships")
local guard = require("guard")
local references = require("references")
local M = {}

function M.board(tx: types.Executor, board_id: string, admitted: domain.Board?, settings: domain.Policy, dialect: string): (domain.Board?, error?)
    local board, err = store.board(tx, board_id)
    if err or not board then return nil, err end
    if not admitted or admitted.digest ~= board.digest then
        return nil, errors.new({ kind = errors.UNAVAILABLE, retryable = false, message = "board access rules changed during prepare", details = { code = "access_projection_changed" } })
    end
    local effective, eerr = policy.effective(settings :: domain.JsonObject, board.compiled.policy_overrides)
    if eerr or not effective then return nil, eerr end
    board.compiled.policy = effective
    board.caller, board.dialect, board.memberships = admitted.caller, dialect, admitted.memberships
    return board, nil
end

function M.read(db: sql.DB, board_id: string, ops: { types.Op }, indices: { integer }, actor: string, at: string, settings: domain.Policy, deadline: domain.Deadline?): (domain.Board?, { types.OpPlan }, error?)
    local access: { [string]: boolean } = {}
    local function cache(id: string, mask: integer): error?
        local key = id .. ":" .. mask
        if access[key] ~= nil then return end
        local _, err = component.validate_access(id, mask)
        local allowed, aerr = guard.authorization(err :: error?)
        if aerr then return aerr end
        access[key] = allowed
        return nil
    end
    local admitted, perr = store.board(db, board_id)
    if perr then return nil, {}, perr end
    local targets: { [string]: boolean } = {}
    local approval_groups: { string } = {}
    local proposed: { unknown } = { ops }
    local function canonical(value: domain.Value, field: domain.Field)
        for _, member in ipairs(values.members(fields.shape(field), value)) do
            local target = (member :: domain.Ref).ref[2]:match("^([^/]+)/")
            if target then targets[target] = true end
        end
    end
    if admitted then
        for _, i in ipairs(indices) do
            local op = ops[i]
            for code, raw in pairs(op.values or {}) do
                local field = admitted.model.fields[code]
                if field and field.type == "item" then
                    local value, err = fields.normalize(field, raw)
                    if not err and value ~= nil then canonical(value, field) end
                end
            end
            local referenced: { string } = {}
            if op.item then referenced[#referenced + 1] = op.item end
            if type(op.parent) == "string" then referenced[#referenced + 1] = op.parent end
            for _, id in ipairs(referenced) do
                local item, err = store.item(db, board_id, id :: string)
                if err then return nil, {}, err end
                if item then
                    proposed[#proposed + 1] = item.document
                    if op.op == "approve" and id == op.item then
                        local definition, derr = store.process(db, admitted, item)
                        if derr or not definition then return nil, {}, derr end
                        local target = op.visit and process.for_visit(item, op.visit, definition) or item
                        local state = target and process.state_of(definition, target.state)
                        local approvals = state and state.release_when and state.release_when.approvals
                        for _, group in ipairs(approvals and approval_rules.groups(approvals) or {}) do approval_groups[#approval_groups + 1] = group end
                    end
                    for _, field in ipairs(admitted.compiled.fields) do
                        local cell = item.document[tostring(field.id)]
                        if field.type == "item" and cell and cell.p ~= nil then canonical(cell.p, field) end
                    end
                end
            end
        end
        for _, process in ipairs(admitted.compiled.processes) do
            for _, transition in ipairs(process.transitions) do
                for _, effect in ipairs(transition.set) do
                    local field = admitted.model.fields[effect.field]
                    if field and field.type == "item" and effect.value ~= nil then canonical(effect.value, field) end
                end
            end
        end
    end
    for _, i in ipairs(indices) do
        local op = ops[i]
        if op.force then
            local err = cache(board_id, component.ACCESS.ADMIN :: integer)
            if err then return nil, {}, err end
        end
        if op.op == "delete" or op.op == "restore" then
            local err = cache(board_id, component.ACCESS.DELETE :: integer)
            if err then return nil, {}, err end
        end
        if op.op == "link" or op.op == "unlink" then
            local ref=references.target(op.target,board_id)
            if ref then
                local target, err = store.endpoint(db, ref)
                if err or not target then return nil, {}, err end
                op.target = target
                if target.board ~= board_id then targets[target.board] = true end
            end
        end
    end
    local peers: { [string]: domain.Board } = {}
    for id in pairs(targets) do
        if id ~= board_id then
            local err = cache(id, component.ACCESS.READ :: integer)
            if err then return nil, {}, err end
            if access[id .. ":" .. (component.ACCESS.READ :: integer)] then
                local peer, perr = store.board(db, id)
                if perr then return nil, {}, perr end
                if peer then
                    local aerr = principals.resolve(peer)
                    if aerr then return nil, {}, aerr end
                    peers[id] = peer
                end
            end
        end
    end
    if admitted then
        local merr = memberships.prepare(db, admitted, nil, proposed, deadline)
        if merr then return nil, {}, merr end
        local aerr = principals.resolve(admitted, nil, approval_groups)
        if aerr then return nil, {}, aerr end
    end
    local tx, err = db:begin()
    if err or not tx then return nil, {}, err end
    if db:type() == sql.type.POSTGRES then
        local ierr = store.read_snapshot(tx)
        if ierr then tx:rollback(); return nil, {}, ierr end
    end
    local board, berr = M.board(tx, board_id, admitted, settings, db:type())
    local plans: { types.OpPlan } = {}
    if board and not berr then
        local ctx = items.context(tx, board, actor, at, db:type())
        ctx.access = access
        ctx.peer_boards = peers
        for _, i in ipairs(indices) do if ops[i].moved_from then ctx.importing = true end end
        for _, i in ipairs(indices) do plans[i] = items.plan_op(ctx, ops[i]) end
        if ctx.importing then
            ctx.importing = nil
            for _, i in ipairs(indices) do
                for _, event in ipairs(plans[i].events) do
                    local refusal = references.patch(ctx, event.body.patch or {})
                    if refusal then plans[i] = refusal; break end
                end
            end
        end
    end
    tx:rollback()
    return board :: domain.Board?, plans, berr
end

return M
