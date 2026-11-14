-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Reads use one committed snapshot and report its projection position.
local component = require("component")
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
        admin = (mask & component.ACCESS.ADMIN) ~= 0 }, nil
end

function M.effective(board_id: string): (domain.BoardAccess?, error?)
    local mask, err = component.validate_access(board_id, component.ACCESS.READ :: integer)
    if err then return nil, errors.wrap(err :: error, "board access denied") end
    return M.describe(mask)
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

-- admit checks that the ambient caller can read board_id.
function M.admit(board_id: string): error?
    if board_id == "" then return M.invalid("board_id required") end
    local _, err = M.effective(board_id)
    return err
end

-- with_snapshot runs fn for an admitted caller inside one read transaction over
-- the board. Context carries the selection's admission and live caller authority.
function M.with_snapshot<T: types.ReadStamp>(board_id: string, min_seq: integer?, fn: types.Snapshot<T>, context: types.ReadContext?, asked: types.ReadBudget?, where: unknown?): (T?, error?)
    local allowance = context and context.allowance
    if not allowance then
        local started, allowance_err = budget.start(asked)
        if allowance_err or not started then return nil, allowance_err end
        allowance = started
    end
    local aerr: error? = nil
    if not context or not context.admitted[board_id] then aerr = M.admit(board_id) end
    if aerr then return nil, aerr end
    local deadline_err = not (context and context.partial) and budget.check(allowance)
    if deadline_err then return nil, deadline_err end
    local db, err = store.open()
    if not db then return nil, err end
    local admitted, perr = store.board(db, board_id)
    if admitted and not perr then perr = memberships.prepare(db, admitted, where, nil, allowance.deadline, allowance.remaining) end
    db:release()
    if perr then return nil, perr end
    if not admitted then return nil, errors.new({ details = { code = "board_schema_missing" }, kind = errors.NOT_FOUND, message = "board has no schema" }) end
    local aerr = principals.resolve(admitted, context)
    if aerr then return nil, aerr end
    db, err = store.open()
    if not db then return nil, err end
    local tx, berr = db:begin()
    if berr then
        db:release()
        return nil, errors.wrap(berr, "read transaction begin failed")
    end
    if db:type() == sql.type.POSTGRES then
        local isolation_err = store.read_snapshot(tx, true)
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
    elseif board.digest ~= admitted.digest then
        ferr = errors.new({ kind = errors.UNAVAILABLE, retryable = false, message = "board access rules changed during the read", details = { code = "access_projection_changed" } })
    else
        board.caller, board.memberships = admitted.caller, admitted.memberships
        board.dialect = db:type()
        result, ferr = fn(tx, board, db:type())
    end
    tx:rollback()
    db:release()
    if ferr or not result or not board then return nil, ferr end
    if not (context and context.partial) then
        local expired = budget.check(allowance)
        if expired then return nil, expired end
    end
    result.as_of = board.applied_seq
    result.generation = board.generation
    return result, nil
end

return M
