-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- The filter tree: the canonical JSON form of an item query's predicate,
-- compiled to one SQL fragment over a generated row. A node is exactly one of
-- { and = [node] }, { or = [node] }, { not = node } or a leaf
-- { field, ctx?, op, value }. Fields go through the query's resolver and every
-- value is bound; a value may be an operand (kickside.pim.persist:operands).
--
-- Each operator states which shapes it takes and how it treats an empty value:
-- neq and nin match empty values, and not is the exact complement of its node,
-- so every item lands on one side of a condition.
local failure = require("failure")
local values = require("values")
local operands = require("operands")
local types = require("types")

local M = {}

-- Fragment is compiled SQL and its arguments in placeholder order.
type Fragment = { sql: string, args: { unknown } }
-- Environment is what a tree compiles against: the reader, the generated set
-- table, the dialect's substring position function and the field resolver.
type Environment = { reader: types.Reader, set_table: string, position: string, resolve: types.Resolver }
-- Compilation is the environment with the leaves and values the tree may still use.
type Compilation = { reader: types.Reader, set_table: string, position: string, resolve: types.Resolver, leaves: integer, values: integer }

-- LIMITS bound one tree: nesting, leaves, and values across all leaves.
M.LIMITS = { depth = 6, leaves = 64, values = 500 }

local RANGE: { [string]: string } = { lt = "<", lte = "<=", gt = ">", gte = ">=" }
local LEAF_KEYS: { [string]: boolean } = { field = true, ctx = true, op = true, value = true }

local invalid = failure.invalid

local function marks(n: integer): string
    local out: { string } = {}
    for i = 1, n do out[i] = "?" end
    return table.concat(out, ", ")
end

-- stored turns a request value into the column's stored form: the order value
-- for number columns, the key for the others.
local function stored(target: types.Target, raw: unknown): (types.ColumnValue?, error?)
    local input = raw
    if target.coerce then input = target.coerce(raw) end
    local value, err = values.normalize({ form = target.shape.form, cardinality = "one", config = target.shape.config }, input)
    if err or value == nil then return nil, err end
    if target.kind == "number" and not target.set then return values.order(target.shape.form, values.scalar(value), target.shape.config) end
    return values.key(target.shape.form, values.scalar(value), target.shape.config)
end

local function one(c: Compilation, target: types.Target, label: string, raw: unknown): (types.ColumnValue?, error?)
    local resolved, oerr = operands.resolve(c.reader, raw)
    if oerr then return nil, oerr end
    if resolved == nil then return nil, invalid(label .. " needs a value") end
    if c.values < 1 then return nil, invalid("a filter tree holds at most " .. M.LIMITS.values .. " values") end
    c.values = c.values - 1
    local v, err = stored(target, resolved)
    if err then return nil, err end
    if v == nil then return nil, invalid(label .. " needs a value") end
    return v, nil
end

local function many(c: Compilation, target: types.Target, label: string, raw: unknown): ({ unknown }?, error?)
    if type(raw) ~= "table" or #(raw :: { unknown }) == 0 then return nil, invalid(label .. " needs a list of values") end
    local out: { unknown } = {}
    for i, item in ipairs(raw :: { unknown }) do
        local v, err = one(c, target, label, item)
        if err or v == nil then return nil, err end
        out[i] = v
    end
    return out, nil
end

-- text_operand checks a contains or starts_with operand: a non-empty string in
-- the field's own key form, so a case-insensitive field matches as it stores.
local function text_operand(c: Compilation, target: types.Target, label: string, raw: unknown): (types.ColumnValue?, error?)
    if target.set or target.kind ~= "key" or target.shape.form ~= "text" then return nil, invalid(label .. " applies to single text fields") end
    if type(raw) ~= "string" or raw == "" then return nil, invalid(label .. " needs non-empty text") end
    return one(c, target, label, raw)
end

local function set_leaf(c: Compilation, target: types.Target, op: string, label: string, raw: unknown): (Fragment?, error?)
    local rows = "SELECT 1 FROM " .. c.set_table .. " s WHERE s.product_id = i.product_id AND s.col = ?"
    if op == "is_null" then
        if type(raw) ~= "boolean" then return nil, invalid(label .. " takes true or false") end
        return { sql = ((raw :: boolean) and "NOT EXISTS (" or "EXISTS (") .. rows .. ")", args = { target.column } }, nil
    end
    local list: { unknown }
    if op == "has" then
        local v, err = one(c, target, label, raw)
        if err or v == nil then return nil, err end
        list = { v }
    elseif op == "in" or op == "nin" then
        local vs, err = many(c, target, label, raw)
        if err or not vs then return nil, err end
        list = vs
    else
        return nil, invalid(label .. ": sets filter by has, in, nin or is_null")
    end
    local args: { unknown } = { target.column }
    for _, v in ipairs(list) do args[#args + 1] = v end
    return { sql = (op == "nin" and "NOT EXISTS (" or "EXISTS (") .. rows .. " AND s.value_key IN (" .. marks(#list) .. "))", args = args }, nil
end

local function column_leaf(c: Compilation, target: types.Target, op: string, label: string, raw: unknown): (Fragment?, error?)
    local col = "i." .. target.column
    if op == "is_null" then
        if type(raw) ~= "boolean" then return nil, invalid(label .. " takes true or false") end
        return { sql = col .. ((raw :: boolean) and " IS NULL" or " IS NOT NULL"), args = {} }, nil
    elseif op == "eq" or op == "neq" then
        local v, err = one(c, target, label, raw)
        if err or v == nil then return nil, err end
        if op == "eq" then return { sql = col .. " = ?", args = { v } }, nil end
        return { sql = "(" .. col .. " IS NULL OR " .. col .. " <> ?)", args = { v } }, nil
    elseif op == "in" or op == "nin" then
        local vs, err = many(c, target, label, raw)
        if err or not vs then return nil, err end
        if op == "in" then return { sql = col .. " IN (" .. marks(#vs) .. ")", args = vs }, nil end
        return { sql = "(" .. col .. " IS NULL OR " .. col .. " NOT IN (" .. marks(#vs) .. "))", args = vs }, nil
    elseif RANGE[op] or op == "between" then
        if target.kind ~= "number" and target.shape.form ~= "time" then return nil, invalid(label .. " applies to ordered fields") end
        if op ~= "between" then
            local v, err = one(c, target, label, raw)
            if err or v == nil then return nil, err end
            return { sql = col .. " " .. RANGE[op] .. " ?", args = { v } }, nil
        end
        local vs, err = many(c, target, label, raw)
        if err or not vs then return nil, err end
        if #vs ~= 2 then return nil, invalid(label .. " takes [low, high]") end
        if (vs[1] :: types.ColumnValue) > (vs[2] :: types.ColumnValue) then return nil, invalid(label .. " takes [low, high] in order") end
        return { sql = "(" .. col .. " >= ? AND " .. col .. " <= ?)", args = vs }, nil
    elseif op == "starts_with" or op == "contains" then
        local v, err = text_operand(c, target, label, raw)
        if err or v == nil then return nil, err end
        return { sql = c.position .. "(" .. col .. ", ?) " .. (op == "starts_with" and "= 1" or "> 0"), args = { v } }, nil
    end
    return nil, invalid("unknown filter op " .. op)
end

local function leaf(c: Compilation, n: { [string]: unknown }): (Fragment?, error?)
    for k in pairs(n) do
        if not LEAF_KEYS[k] then return nil, invalid("filter leaf has unknown key " .. tostring(k)) end
    end
    local field, op = n.field, n.op
    if type(field) ~= "string" then return nil, invalid("filter leaf needs a field") end
    if type(op) ~= "string" then return nil, invalid("filter leaf on " .. field .. " needs an op") end
    if n.ctx ~= nil and type(n.ctx) ~= "table" then return nil, invalid("filter leaf on " .. field .. " takes ctx as an object") end
    if c.leaves < 1 then return nil, invalid("a filter tree holds at most " .. M.LIMITS.leaves .. " leaves") end
    c.leaves = c.leaves - 1
    local target, err = c.resolve(field, n.ctx :: { [string]: string }?)
    if err or not target then return nil, err or invalid("unknown field " .. field) end
    local label = field .. " " .. op
    if target.set then return set_leaf(c, target, op, label, n.value) end
    return column_leaf(c, target, op, label, n.value)
end

local node: (Compilation, unknown, integer) -> (Fragment?, error?)

function node(c: Compilation, raw: unknown, depth: integer): (Fragment?, error?)
    if depth > M.LIMITS.depth then return nil, invalid("a filter tree nests at most " .. M.LIMITS.depth .. " levels") end
    if type(raw) ~= "table" then return nil, invalid("a filter node must be an object") end
    local n = raw :: { [string]: unknown }
    local connective: string? = nil
    for _, name in ipairs({ "and", "or", "not" }) do
        if n[name] ~= nil then
            if connective or next(n, next(n)) ~= nil then return nil, invalid("a filter node holds one of and, or, not or a leaf") end
            connective = name
        end
    end
    if not connective then
        if next(n) == nil then return nil, invalid("a filter node holds one of and, or, not or a leaf") end
        return leaf(c, n)
    end
    if connective == "not" then
        local inner, err = node(c, n["not"], depth + 1)
        if err or not inner then return nil, err end
        return { sql = "((" .. inner.sql .. ") IS NOT TRUE)", args = inner.args }, nil
    end
    local list = n[connective]
    if type(list) ~= "table" or #(list :: { unknown }) == 0 then return nil, invalid(connective .. " needs a list of nodes") end
    local parts: { string } = {}
    local args: { unknown } = {}
    for i, child in ipairs(list :: { unknown }) do
        local inner, err = node(c, child, depth + 1)
        if err or not inner then return nil, err end
        parts[i] = inner.sql
        for _, a in ipairs(inner.args) do args[#args + 1] = a end
    end
    return { sql = "(" .. table.concat(parts, connective == "and" and " AND " or " OR ") .. ")", args = args }, nil
end

-- compile turns a tree into a fragment over alias i.
function M.compile(where: unknown, env: Environment): (Fragment?, error?)
    return node({ reader = env.reader, set_table = env.set_table, position = env.position, resolve = env.resolve,
        leaves = M.LIMITS.leaves, values = M.LIMITS.values }, where, 1)
end

return M
