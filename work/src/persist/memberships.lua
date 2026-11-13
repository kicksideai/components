-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Memberships resolve before a snapshot opens; predicate compilation uses the same live set on every path.
local funcs = require("funcs")
local security = require("security")
local store = require("store")
local tables = require("tables")
local domain = require("domain")
local predicates = require("predicates")
local storage = require("storage")
local clock = require("clock")
local M = {}

function M.prepare(db: storage.Executor, board: domain.Board, where: unknown, proposed: unknown?, deadline: domain.Deadline?, allowance: integer?): error?
    local limit = math.min(allowance or 1000, 1000)
    local function check(): error?
        if deadline and clock.passed(deadline) then
            return errors.new({ kind = errors.TIMEOUT, message = "membership resolution deadline passed", details = { code = "membership_deadline" } })
        end
        return nil
    end
    local function exceeded(): error
        return errors.new({ kind = errors.INVALID, message = "membership expansion exceeds its read allowance", details = { code = "membership_budget_exceeded", limit = limit } })
    end
    local used: { [string]: boolean } = {}
    local candidates: { [string]: boolean } = {}
    local function inspect(raw: unknown, depth: integer)
        if depth > 16 or type(raw) ~= "table" then return end
        local node = raw :: { [string]: unknown }
        if type(node.ref) == "table" then
            local ref = node.ref :: { string }
            if ref[1] == "principal" then candidates["principal:" .. ref[2]] = true end
        end
        if node.op == "member_of" and type(node.field) == "string" then used[node.field] = true end
        if type(node.kind) == "string" and type(node.id) == "string" then candidates["principal:" .. node.kind .. ":" .. node.id] = true end
        for _, value in pairs(node) do inspect(value, depth + 1) end
    end
    inspect(where, 1)
    inspect(board.compiled.processes, 1)
    inspect(proposed, 1)
    local pinned = false
    for _, process in ipairs(board.compiled.processes) do pinned = pinned or process.migration == "pin" end
    if pinned then
        local generations, err = db:query("SELECT DISTINCT process_generation FROM kickside_work_item WHERE board_id=$1 LIMIT " .. (limit + 1), { board.board_id })
        if err then return err end
        if #(generations or {}) > limit then return exceeded() end
        for _, row in ipairs(generations or {}) do
            local expired = check()
            if expired then return expired end
            local generation, derr = store.need_int(row, "process_generation")
            if derr then return derr end
            if generation ~= board.generation then
                local held, herr = store.generation(db, board.board_id, generation :: integer)
                if herr then return herr end
                if held then inspect(held.compiled.processes, 1) end
            end
        end
    end
    if not next(used) then return nil end
    local expired = check()
    if expired then return expired end
    local actor = security.actor()
    if actor then
        local principal = actor:id()
        candidates[principal:match("^principal:") and principal or "principal:user:" .. principal] = true
    end
    local names = tables.names(board.board_id)
    local resolve = predicates.targets(board.compiled)
    for code in pairs(used) do
        local field = board.model.fields[code]
        if field and field.type == "principal" then
            local target, terr = resolve(code)
            if terr or not target then return terr end
            local statement = target.set and "SELECT DISTINCT value_key AS principal FROM " .. names.set .. " WHERE col=$1"
                or "SELECT DISTINCT " .. target.column .. " AS principal FROM " .. names.item .. " WHERE " .. target.column .. " IS NOT NULL"
            local expired = check()
            if expired then return expired end
            local rows, err = db:query(statement .. " LIMIT " .. (limit + 1), target.set and { target.column } or {})
            if err then return errors.wrap(err, "predicate principals read failed") end
            if #(rows or {}) > limit then return exceeded() end
            for _, row in ipairs(rows or {}) do
                local principal, perr = store.need(row, "principal")
                if perr then return perr end
                candidates[principal :: string] = true
            end
        end
    end
    local input: { string } = {}
    for key in pairs(candidates) do input[#input + 1] = key end
    if #input > limit then return exceeded() end
    table.sort(input)
    local result, err = funcs.call("kickside.work.read:resolve_memberships", { principals = input, deadline = deadline })
    if err then return err end
    local expired = check()
    if expired then return expired end
    board.memberships = result :: domain.Memberships
    return nil
end
return M
