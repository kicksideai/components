-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Access conditions compile through the filter tree and stay bound at every SQL boundary.
local rules = require("rules")
local predicates = require("predicates")
local domain = require("domain")
local store = require("store")
local values = require("values")
local sql = require("sql")
local M = {}

local function tree_for(board: domain.Board): unknown
    local rule, caller = board.compiled.visibility, board.caller
    if not rule or (caller and caller.admin and rule.bypass == "admin") then return nil end
    local options: { unknown } = { { field = rule.field, op = "is_null", value = true } }
    if not caller then return { ["and"] = { { field = rule.field, op = "is_null", value = true }, { field = rule.field, op = "is_null", value = false } } } end
    local principals: { unknown } = { caller.principal }
    for group in pairs(caller.groups) do principals[#principals + 1] = { kind = "group", id = group } end
    for _, level in ipairs(rule.levels) do
        local holders: { unknown } = {}
        local fixed = false
        for _, holder in ipairs(level.holders) do
            if rules.fixed(holder, caller) then fixed = true end
            if holder.field then holders[#holders + 1] = { field = holder.field, op = "in", value = principals } end
        end
        local held = { field = rule.field, op = "eq", value = level.id }
        if fixed then options[#options + 1] = held
        elseif #holders > 0 then options[#options + 1] = { ["and"] = { held, #holders == 1 and holders[1] or { ["or"] = holders } } } end
    end
    return #options == 1 and options[1] or { ["or"] = options }
end

local function unavailable(message: string): error
    return errors.new({ kind = errors.UNAVAILABLE, retryable = false, message = message, details = { code = "contract_unavailable" } })
end

-- The host visibility clause has its own bound across the root and graph peers.
function M.visibility(board: domain.Board, dialect: string): domain.VisibilityCondition
    local tree = tree_for(board)
    local actor = board.caller and board.caller.principal.id
    local remaining = 4096
    local function compile(raw: unknown, alias: string): (domain.Condition?, error?)
        local node = raw :: { [string]: unknown }
        local connective = node["or"] and "or" or node["and"] and "and" or nil
        if not connective then
            local leaf, err = predicates.compile(board.compiled, board.board_id, actor, raw, dialect, nil, { alias = alias })
            if err or not leaf then return nil, unavailable("visibility cannot compile") end
            remaining = remaining - #leaf.args
            if remaining < 0 then return nil, unavailable("visibility exceeds its bound of 4096 parameters") end
            return leaf, nil
        end
        local parts: { string } = {}
        local args: { unknown } = {}
        for _, child in ipairs(node[connective] :: { unknown }) do
            local fragment, err = compile(child, alias)
            if err or not fragment then return nil, err end
            parts[#parts + 1] = "(" .. fragment.sql .. ")"
            for _, value in ipairs(fragment.args) do args[#args + 1] = value end
        end
        return { sql = "(" .. table.concat(parts, connective == "or" and " OR " or " AND ") .. ")", args = args }, nil
    end
    return function(alias: string): (domain.Condition?, error?)
        if tree == nil then return { sql = "1 = 1", args = {} }, nil end
        return compile(tree, alias)
    end
end

function M.condition(board: domain.Board, dialect: string): (domain.Condition?, error?)
    return M.visibility(board, dialect)("i")
end

function M.holders_condition(board: domain.Board, list: { domain.Holder }, alias: string, fields: { [string]: domain.Field }): (domain.Condition?, error?)
    local caller = board.caller
    if not caller then return nil, errors.new({ kind = errors.INTERNAL, message = "caller authority is unresolved", details = { code = "caller_unresolved" } }) end
    local args: { unknown } = {}
    local postgres = board.dialect == sql.type.POSTGRES
    local principals: { string } = { caller.principal.kind .. ":" .. caller.principal.id }
    for group in pairs(caller.groups) do principals[#principals + 1] = "group:" .. group end
    local function held(field: domain.Field): string
        local prefix: string
        if field.cardinality == "one" then
            if postgres then
                args[#args + 1] = tostring(field.id)
                args[#args + 1] = tostring(field.id)
                prefix = "((" .. alias .. ".document::jsonb -> ? -> 'p' -> 'ref' ->> 0) = 'principal' AND (" .. alias .. ".document::jsonb -> ? -> 'p' -> 'ref' ->> 1) IN ("
            else
                args[#args + 1] = "$." .. field.id .. ".p.ref[0]"
                args[#args + 1] = "$." .. field.id .. ".p.ref[1]"
                prefix = "(json_extract(" .. alias .. ".document, ?) = 'principal' AND json_extract(" .. alias .. ".document, ?) IN ("
            end
        else
            args[#args + 1] = postgres and tostring(field.id) or ("$." .. field.id .. ".p")
            prefix = postgres and "EXISTS (SELECT 1 FROM jsonb_array_elements(COALESCE(" .. alias .. ".document::jsonb -> ? -> 'p', '[]'::jsonb)) h WHERE h.value -> 'ref' ->> 0 = 'principal' AND h.value -> 'ref' ->> 1 IN ("
                or "EXISTS (SELECT 1 FROM json_each(json_extract(" .. alias .. ".document, ?)) h WHERE json_extract(h.value, '$.ref[0]') = 'principal' AND json_extract(h.value, '$.ref[1]') IN ("
        end
        local marks: { string } = {}
        for _, principal in ipairs(principals) do marks[#marks + 1] = "?"; args[#args + 1] = principal end
        return prefix .. table.concat(marks, ",") .. "))"
    end
    local parts: { string } = {}
    for _, holder in ipairs(list) do
        if rules.fixed(holder, caller) then return { sql = "1=1", args = {} }, nil end
        if holder.field then parts[#parts + 1] = held(fields[holder.field] :: domain.Field) end
    end
    return { sql = #parts > 0 and "(" .. table.concat(parts, " OR ") .. ")" or "1=0", args = args }, nil
end

-- Point conditions read canonical documents while an index rebuild is pending.
function M.permits(tx: sql.DB | sql.Transaction, board: domain.Board, id: string): (boolean, error?)
    local rule, caller = board.compiled.visibility, board.caller
    if not rule then return true, nil end
    if not caller then return false, errors.new({ kind = errors.UNAVAILABLE, retryable = false, message = "caller authority is unavailable", details = { code = "contract_unavailable" } }) end
    if caller.admin and rule.bypass == "admin" then
        local rows, err = tx:query("SELECT 1 AS allowed FROM kickside_work_item WHERE board_id = $1 AND item_id = $2", { board.board_id, id })
        return rows ~= nil and rows[1] ~= nil, err
    end
    local args: { unknown } = { board.board_id, id }
    local postgres = board.dialect == sql.type.POSTGRES
    local function value(field: domain.Field): string
        args[#args + 1] = postgres and tostring(field.id) or ("$." .. field.id .. ".p")
        return postgres and "(r.document::jsonb -> ? ->> 'p')" or "json_extract(r.document, ?)"
    end
    local parts: { string } = { value(board.model.fields[rule.field]) .. " IS NULL" }
    for _, level in ipairs(rule.levels) do
        local level_sql = value(board.model.fields[rule.field]) .. " = ?"
        args[#args + 1] = level.id
        local holders, err = M.holders_condition(board, level.holders, "r", board.model.fields)
        if err or not holders then return false, err end
        for _, arg in ipairs(holders.args) do args[#args + 1] = arg end
        parts[#parts + 1] = "(" .. level_sql .. " AND (" .. holders.sql .. "))"
    end
    if #args > 4096 then return false, errors.new({ kind = errors.UNAVAILABLE, retryable = false, message = "visibility exceeds its bound of 4096 parameters", details = { code = "contract_unavailable" } }) end
    local statement = "SELECT 1 AS allowed FROM kickside_work_item r WHERE r.board_id = ? AND r.item_id = ? AND (" .. table.concat(parts, " OR ") .. ")"
    local n = 0
    statement = statement:gsub("%?", function(): string n = n + 1; return "$" .. n end)
    local rows, err = tx:query(statement, args)
    return rows ~= nil and rows[1] ~= nil, err
end

function M.resolver(board: domain.Board, base: domain.Resolver, doc: domain.Document?, bound: boolean?): domain.Resolver
    return function(code: string, ctx: { [string]: string }?): (domain.ColumnTarget?, error?)
        local visibility = board.compiled.visibility
        if (code == "parent" or code == "path_under") and visibility and not (visibility.bypass == "admin" and board.caller and board.caller.admin) then return nil, rules.denied(code) end
        local id = bound and predicates.field_id(code) or nil
        local field = id and board.model.by_id[id] or (not (bound and predicates.builtin(code)) and board.model.fields[code] or nil)
        if field and not rules.field(board, field, "read", doc) then return nil, rules.denied(field.code) end
        return base(code, ctx)
    end
end

-- Durable visibility versions let a feed retract an item it previously exposed.
function M.record(tx: sql.Transaction, board: domain.Board, item: domain.Item): error?
    local doc: domain.Document = {}
    local rule = board.compiled.visibility
    if not rule then return nil end
    local fields: { [string]: boolean } = { [rule.field] = true }
    for _, level in ipairs(rule.levels) do
        for _, holder in ipairs(level.holders) do if holder.field then fields[holder.field] = true end end
    end
    for code in pairs(fields) do
        local key = tostring(board.model.fields[code].id)
        doc[key] = item.document[key]
    end
    local encoded = values.canonical(doc)
    local previous, perr = tx:query("SELECT document FROM kickside_work_visibility WHERE board_id = $1 AND item_id = $2 ORDER BY seq DESC LIMIT 1", { board.board_id, item.item_id })
    if perr then return perr end
    if previous and previous[1] then
        local document, derr = store.stored(previous[1].document, {} :: domain.Document)
        if derr then return derr end
        if values.canonical(document) == encoded then return nil end
    end
    local _, err = tx:execute("INSERT INTO kickside_work_visibility (board_id, item_id, seq, document, at) VALUES ($1,$2,$3,$4,$5) ON CONFLICT (board_id, item_id, seq) DO UPDATE SET document = excluded.document, at = excluded.at",
        { board.board_id, item.item_id, item.updated_seq, encoded, item.updated_at })
    return err
end

function M.previous(tx: sql.DB | sql.Transaction, board: domain.Board, item: domain.Item, seq: integer): (boolean, error?)
    if seq == 0 or item.created_seq > seq then return false, nil end
    if not board.compiled.visibility then return true, nil end
    local rows, err = tx:query("SELECT document FROM kickside_work_visibility WHERE board_id = $1 AND item_id = $2 AND seq <= $3 ORDER BY seq DESC LIMIT 1", { board.board_id, item.item_id, seq })
    if err then return false, err end
    if not rows or not rows[1] then return false, nil end
    local decoded_1, decode_err = store.stored(rows[1].document, {} :: domain.Document)
    if decode_err then return false, decode_err end
    local decoded_1 = decoded_1 :: domain.Document
    return rules.visible(board, decoded_1), nil
end
return M
