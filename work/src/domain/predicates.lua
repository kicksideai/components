-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local tables = require("tables")
local types = require("types")
local filter = require("filter")

local M = {}

-- Field targets map public codes to generated columns.

local function target_invalid(code: string, field: string, message: string): error
    return errors.new({ kind = errors.INVALID, message = message, details = { code = code, field = field } })
end

local SYSTEM: { [string]: string } = { type = "type", state = "state", category = "category", parent = "parent_id", rank = "rank",
    number = "number", life = "life", created_seq = "created_seq", updated_seq = "updated_seq", created_at = "created_at", updated_at = "updated_at" }

function M.targets(compiled: types.Compiled, key: ((unknown) -> (unknown, error?))?, memberships: types.Memberships?): types.Resolver
    local l = tables.layout(compiled)
    local fields: { [string]: types.Field } = {}
    for _, f in ipairs(compiled.fields) do fields[f.code] = f end
    return function(code: string, ctx: { [string]: string }?): (types.ColumnTarget?, error?)
        if ctx and next(ctx) then return nil, target_invalid("field_context", code, "field " .. code .. " takes the empty context") end
        if code == "key" then
            return { column = "number", kind = "key", set = false, shape = { form = "int", cardinality = "one", config = {} },
                coerce = function(raw: unknown): (unknown, error?)
                    if type(raw) ~= "string" then return {} end
                    if key then return key(raw) end
                    return -1, nil
                end }, nil
        end
        if code == "path_under" then
            return { column = "path_under", kind = "key", set = true, shape = { form = "text", cardinality = "one", config = {} } }, nil
        end
        local column = SYSTEM[code]
        if column then
            local numeric = code == "number" or code == "created_seq" or code == "updated_seq"
            local moment = code == "created_at" or code == "updated_at"
            return { column = column, kind = numeric and "number" or "key", set = false,
                shape = { form = numeric and "int" or moment and "time" or "text", cardinality = "one", config = {} },
                intervals = code == "state" or code == "category", field_id = code == "state" and -1 or code == "category" and -2 or nil }, nil
        end
        local f = fields[code]
        if not f then return nil, target_invalid("unknown_field", code, "unknown or retired field " .. code) end
        for _, list in ipairs({ l.columns, l.sets }) do
            for _, c in ipairs(list) do
                if c.field_id == f.id and c.kind ~= "state" then
                    local target: types.ColumnTarget = { principal = f.type == "principal", memberships = memberships, column = c.column, kind = c.kind, set = f.cardinality ~= "one",
                        shape = { form = f.form, cardinality = "one", config = f.config },
                        coerce = function(raw: unknown): (unknown, error?) return tables.target(f, c, raw) end,
                        field_id = (f.track or f.intervals) and f.id or nil, intervals = f.intervals,
                        state_column = "f" .. f.id .. "_state" }
                    if f.type == "option" and f.index == "number" and f.cardinality == "one" then
                        local ordered: types.LayoutColumn = { field_id = f.id, kind = "number", column = "f" .. f.id .. "_number" }
                        target.order = { column = ordered.column, kind = "number", set = false,
                            shape = { form = "int", cardinality = "one", config = {} },
                            coerce = function(raw: unknown): (unknown, error?) return tables.target(f, ordered, raw) end }
                    end
                    return target, nil
                end
            end
        end
        return nil, target_invalid("field_unindexed", code, "field " .. code .. " is not indexed")
    end
end

-- Stored predicates compile through the filter tree at schema apply and execution.

local function invalid(code: string, message: string): error
    return errors.new({ kind = errors.INVALID, message = message, details = { code = code } })
end

-- inspect bounds traversal and identifies inputs that require projected peer rows.
function M.inspect(raw: unknown, fields: { [string]: boolean }, depth: integer): (boolean, error?, boolean?)
    if depth > 16 then return false, invalid("invalid_predicate", "predicate nesting exceeds the traversal limit") end
    if type(raw) ~= "table" then return false, nil end
    local peer, search = false, false
    for k, value in pairs(raw :: { [string]: unknown }) do
        if k == "field" and type(value) == "string" then fields[value] = true end
        if k == "rel" or k == "children" or k == "history" then peer = true end
        local nested, err, matching = M.inspect(value, fields, depth + 1)
        if err then return false, err end
        peer = peer or nested
        search = search or k == "match" or matching == true
    end
    return peer, nil, search
end

function M.related(raw: unknown, depth: integer?): boolean
    if (depth or 1) > 16 or type(raw) ~= "table" then return false end
    local node = raw :: { [string]: unknown }
    if node.rel ~= nil or node.children ~= nil then return true end
    for _, value in pairs(node) do if M.related(value, (depth or 1) + 1) then return true end end
    return false
end

local function deterministic(raw: unknown, depth: integer): error?
    if depth > 16 then return invalid("invalid_predicate", "predicate nesting exceeds the traversal limit") end
    if type(raw) ~= "table" then return nil end
    if (raw :: { op: string? }).op == "member_of" then return invalid("rollup_operand", "rollup where requires replay-stable operands; member_of depends on live groups") end
    for key, value in pairs(raw :: { [string]: unknown }) do
        if key == "$actor" or key == "$now" or key == "$operand" then
            return invalid("rollup_operand", "rollup where requires replay-stable operands; " .. key .. " depends on the caller or clock")
        end
        local err = deterministic(value, depth + 1)
        if err then return err end
    end
    return nil
end

function M.bounds(raw: unknown, hops: integer?, depth: integer?): error?
    local level, traversed = depth or 1, hops or 0
    if level > 16 then return invalid("invalid_predicate", "predicate nesting exceeds the traversal limit") end
    if type(raw) ~= "table" then return nil end
    local node = raw :: { [string]: unknown }
    if node.rel ~= nil or node.children ~= nil then traversed = traversed + 1 end
    if traversed > 2 then return invalid("relation_depth", "a work predicate crosses at most 2 relations in one branch") end
    for _, child in pairs(node) do
        local err = M.bounds(child, traversed, level + 1)
        if err then return err end
    end
    return nil
end

function M.compile(compiled: types.Compiled, board_id: string, actor: string?, where: unknown, dialect: string,
    resolver: types.Resolver?): (types.Condition?, error?)
    local berr = M.bounds(where)
    if berr then return nil, berr end
    local relations: { [string]: types.Relation } = {}
    for _, r in ipairs(compiled.relation_types) do relations[r.id] = r end
    local t = tables.of(board_id, tables.layout(compiled), relations)
    return filter.compile(where, { reader = { board_id = board_id, actor = actor, search = compiled.scopes, plugins = compiled.plugins, allows = function(level: string): boolean return level == "read" end },
        item_table = t.names.item, set_table = t.names.set, position = dialect == "postgres" and "strpos" or "instr",
        relations = t.relations, resolve = resolver or M.targets(compiled) })
end

function M.validate(compiled: types.Compiled): error?
    local function check(where: unknown, rollup: boolean): error?
        if where == nil then return nil end
        if rollup then
            local err = deterministic(where, 1)
            if err then return err end
            local used: { [string]: boolean } = {}
            local _, ierr = M.inspect(where, used, 1)
            if ierr then return ierr end
            for _, f in ipairs(compiled.fields) do
                if used[f.code] and (f.rollup or f.formula) then return invalid("rollup_computed_predicate", "rollup where names computed field " .. f.code) end
            end
        end
        local _, err = M.compile(compiled, "schema", "00000000-0000-0000-0000-000000000001", where, "sqlite", M.targets(compiled, nil, {}))
        return err
    end
    for _, p in ipairs(compiled.processes) do
        for _, state in ipairs(p.states) do
            local err = check(state.release_when and state.release_when.when, false)
            if err then return err end
        end
        for _, t in ipairs(p.transitions) do
            local err = check(t.when, false)
            if err then return err end
        end
    end
    for _, f in ipairs(compiled.fields) do
        if f.rollup then
            local err = check(f.rollup.where, true)
            if err then return err end
        end
    end
    return nil
end

return M
