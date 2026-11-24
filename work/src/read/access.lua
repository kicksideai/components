-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Reads use one committed snapshot and report its projection position.
local component = require("component")
local component_types = require("component_types")
local envelope = require("envelope")
local consts = require("consts")
local sql = require("sql")
local store = require("store")
local types = require("types")
local principals = require("principals")
local memberships = require("memberships")
local domain = require("domain")

local budget = require("budget")
local M = {}

function M.describe(raw: unknown): (domain.BoardAccess?, error?)
    local mask = type(raw) == "number" and math.tointeger(raw) or nil
    if not mask or mask < 0 then
        return nil, errors.new({ kind = errors.INTERNAL, message = "component access mask is malformed", details = { code = "row_corrupt" } })
    end
    return { read = (mask & component.ACCESS.READ) ~= 0, write = (mask & component.ACCESS.WRITE) ~= 0,
        delete = (mask & component.ACCESS.DELETE) ~= 0, admin = (mask & component.ACCESS.ADMIN) ~= 0 }, nil
end

function M.effective(board_id: string, required_access: integer?): (domain.BoardAccess?, error?)
    if board_id == "" then return nil, M.invalid("board_id required") end
    local service, service_err = component.get_service()
    if not service then return nil, service_err :: error? end
    local result, call_err = service:get_access_context({
        component_id = board_id, access_mask = required_access or component.ACCESS.READ, include_context = false,
    })
    local err = call_err :: error? or envelope.error_of(result :: component_types.ServiceEnvelope, "get_access_context")
    if err then return nil, errors.wrap(err, "board access denied") end
    local row = result :: component_types.AccessContextResult
    if row.impl_id ~= consts.BOARD_IMPL then
        return nil, errors.new({ details = { code = "board_not_found" }, kind = errors.NOT_FOUND, message = "component is not a Work board" })
    end
    return M.describe(row.access_level)
end

function M.invalid(message: string): error
    return errors.new({ details = { code = "invalid_request" }, kind = errors.INVALID, message = message })
end

function M.non_item(request: unknown): error?
    if type(request) ~= "table" then return M.invalid("read takes an object") end
    local input = request :: { [string]: unknown }
    for _, name in ipairs({ "where", "conditions", "boards", "group_by" }) do
        if input[name] ~= nil then return M.invalid("unsupported read option " .. name) end
    end
    return nil
end

function M.changed(): error
    return errors.new({ kind = errors.UNAVAILABLE, retryable = false, message = "board access rules changed during the read",
        details = { code = "access_projection_changed" } })
end

-- admit checks the component kind and the ambient caller's required capability.
function M.admit(board_id: string, required_access: integer?): error?
    local _, err = M.effective(board_id, required_access)
    return err
end

local function snapshot<T: types.ReadStamp>(board_id: string, min_seq: integer?, fn: types.Snapshot<T>,
    allowance: types.ReadAllowance, partial: boolean?, admitted: domain.Board?): (T?, error?)
    local db, err = store.open()
    if not db then return nil, err end
    local tx, berr = db:begin()
    if berr then
        db:release()
        return nil, errors.wrap(berr, "read transaction begin failed")
    end
    if db:type() == sql.type.POSTGRES then
        local isolation_err = store.read_snapshot(tx, allowance.deadline)
        if isolation_err then tx:rollback(); db:release(); return nil, isolation_err end
    end
    local board, cerr = store.board(tx, board_id)
    local result: T?
    local ferr: error?
    if cerr then ferr = cerr
    elseif not board then ferr = errors.new({ details = { code = "board_schema_missing" }, kind = errors.NOT_FOUND, message = "board has no schema" })
    elseif min_seq and board.applied_seq < min_seq then
        ferr = errors.new({ kind = errors.UNAVAILABLE, retryable = true, message = "board has not reached seq " .. min_seq,
            details = { code = "projection_pending", min_seq = min_seq, applied_seq = board.applied_seq } })
    elseif admitted and board.digest ~= admitted.digest then
        ferr = M.changed()
    else
        if admitted then board.caller, board.memberships = admitted.caller, admitted.memberships end
        board.dialect = db:type()
        result, ferr = fn(tx, board, db:type())
    end
    tx:rollback()
    db:release()
    if ferr or not result or not board then return nil, ferr end
    if not partial then
        local expired = budget.check(allowance)
        if expired then return nil, expired end
    end
    result.as_of = board.applied_seq
    result.generation = board.generation
    return result, nil
end

-- The projection reader validates the attachment and registration inside this snapshot.
function M.projection_snapshot<T: types.ReadStamp>(board_id: string, allowance: types.ReadAllowance, fn: types.Snapshot<T>): (T?, error?)
    return snapshot(board_id, nil, fn, allowance)
end

-- with_snapshot runs fn for an admitted caller inside one read transaction over
-- the board. Context carries the selection's admission and live caller authority.
function M.with_snapshot<T: types.ReadStamp>(board_id: string, min_seq: integer?, fn: types.Snapshot<T>, context: types.ReadContext?, asked: types.ReadBudget?, where: unknown?, required_access: integer?, prepare: types.SnapshotPreparation?): (T?, error?)
    local allowance = context and context.allowance
    if not allowance then
        local started, allowance_err = budget.start(asked)
        if allowance_err or not started then return nil, allowance_err end
        allowance = started
    end
    local aerr: error? = nil
    if required_access or not context or not context.admitted[board_id] then aerr = M.admit(board_id, required_access) end
    if aerr then return nil, aerr end
    local deadline_err = not (context and context.partial) and budget.check(allowance)
    if deadline_err then return nil, deadline_err end
    local db, err = store.open()
    if not db then return nil, err end
    local admitted, perr = store.board(db, board_id)
    if admitted and not perr and not (context and context.partial and budget.expired(allowance)) then
        perr = memberships.prepare(db, admitted, where, nil, allowance.deadline, allowance.remaining)
    end
    if perr then db:release(); return nil, perr end
    if not admitted then db:release(); return nil, errors.new({ details = { code = "board_schema_missing" }, kind = errors.NOT_FOUND, message = "board has no schema" }) end
    local aerr = principals.resolve(admitted, context)
    if aerr then db:release(); return nil, aerr end
    -- Partial query/count callbacks return their empty incomplete result when
    -- exhausted. Admission metadata supplies its position without opening a
    -- data snapshot whose statement timeout could no longer be enabled.
    if context and context.partial and budget.expired(allowance) then
        if min_seq and admitted.applied_seq < min_seq then
            db:release()
            return nil, errors.new({ kind = errors.UNAVAILABLE, retryable = true, message = "board has not reached seq " .. min_seq,
                details = { code = "projection_pending", min_seq = min_seq, applied_seq = admitted.applied_seq } })
        end
        local result, err = fn(db, admitted, db:type())
        db:release()
        if err or not result then return nil, err end
        result.as_of, result.generation = admitted.applied_seq, admitted.generation
        return result, nil
    end
    db:release()
    if prepare then
        local err = prepare(admitted)
        if err then return nil, err end
    end
    return snapshot(board_id, min_seq, fn, allowance, context and context.partial, admitted)
end

return M
