-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local sql = require("sql")
local json = require("json")
local time = require("time")
local access = require("access")
local storage = require("storage")
local store = require("store")
local job_rows = require("job_rows")
local layout = require("layout")
local values = require("values")
local cursor_codec = require("cursor_codec")
local access_rows = require("access_rows")
local types = require("types")
local M = {}

type Executor = sql.DB | sql.Transaction
type Read<T> = (sql.Transaction, types.Context) -> (T?, error?)

function M.invalid(message: string): error
    return access.problem(errors.INVALID, "invalid_time_query", message)
end

function M.limit(message: string): error
    return access.problem(errors.INVALID, "time_read_limit", message)
end

local function read<T>(tx: sql.Transaction, admitted: access.Admission, fn: Read<T>): (T?, error?)
    local board, settings, err = access.current(tx, admitted)
    if err or not board or not settings then return nil, err end
    local policy = board.compiled.visibility
    if policy then
        local rebuilding, rebuild_err = job_rows.rebuilding(tx, board, { [policy.field] = true })
        if rebuild_err then return nil, rebuild_err end
        if rebuilding then
            return nil, errors.new({ kind = errors.UNAVAILABLE, retryable = true, message = "Work visibility index is rebuilding",
                details = { code = "reindex_pending" } })
        end
    end
    local visibility, visibility_err = access_rows.condition(board, board.dialect :: string)
    if visibility_err or not visibility then return nil, visibility_err end
    return fn(tx, { admission = admitted, settings = settings, board = board,
        names = layout.names(board.board_id), visibility = visibility })
end

function M.run<T>(board_id: string, fn: Read<T>): (T?, error?)
    local db, err = storage.open()
    if err or not db then return nil, err end
    local admitted, denied = access.admit(db, board_id, "read")
    if denied or not admitted then db:release(); return nil, denied end
    local tx, begin_err = db:begin()
    if begin_err or not tx then db:release(); return nil, begin_err end
    local failure: error?
    local result: T?
    if db:type() == sql.type.POSTGRES then
        failure = store.read_snapshot(tx, { at = "", ns = (time.now():unix_nano() + 10 * time.SECOND) :: integer })
    end
    if not failure then result, failure = read(tx, admitted, fn) end
    local _, rollback_err = tx:rollback()
    local _, release_err = db:release()
    if failure or rollback_err or release_err then return nil, failure or rollback_err or release_err end
    return result, nil
end

function M.query(db: Executor, template: string, args: { unknown }): ({ types.Row }?, error?)
    local count = 0
    local statement = template:gsub("%?", function(): string
        count = count + 1
        return "$" .. count
    end)
    return db:query(statement, args)
end

function M.args(dst: { unknown }, src: { unknown })
    for _, arg in ipairs(src) do dst[#dst + 1] = arg end
end

function M.matches(context: types.Context, query: types.Request, mode: string): string
    return values.canonical({
        mode = mode, board = context.board.board_id, attachment = context.admission.attachment_id,
        actor = context.admission.person_id, schema = context.board.digest, caller = context.board.caller,
        access = context.admission.grants, visibility = context.settings.entry_visibility,
        item = query.item, from = query.from, to = query.to, person = query.person,
        sprint = query.sprint, group_by = query.group_by,
        hierarchy_seq = mode == "subtree" and context.board.applied_seq or nil,
    })
end

function M.open(position: string?, context: string): (types.Row?, error?)
    if not position then return {}, nil end
    local value, err = cursor_codec.open(position, context, 4096)
    if err or not value then return nil, err end
    local decoded, decode_err = json.decode(value)
    if decode_err or type(decoded) ~= "table" then return nil, M.invalid("Malformed Time cursor") end
    return decoded :: types.Row, nil
end

function M.seal(position: types.Row, context: string): (string?, error?)
    return cursor_codec.seal(json.encode(position), context)
end

return M
