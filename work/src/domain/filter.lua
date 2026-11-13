-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- The filter tree: the canonical JSON form of an item query's predicate, compiled
-- to one SQL fragment over a generated row. A node is exactly one of { and = [node] },
-- { or = [node] }, { not = node }, a leaf { field, ctx?, op, value }, a history
-- condition (kickside.work.domain:filter_history) or a relation condition
-- (kickside.work.domain:filter_relation). Fields go through the board's resolver and
-- every value is bound; a value may be an operand (kickside.work.domain:operands).
--
-- Each operator states which shapes it takes and how it treats an empty value:
-- neq and nin match empty values, and not is the exact complement of its node,
-- so every item lands on one side of a condition.
local values = require("values")
local operands = require("operands")
local search = require("search")
local filter_history = require("filter_history")
local filter_relation = require("filter_relation")
local types = require("types")

local M = {}

-- LIMITS bound one tree: nesting, leaves, and values across all leaves.
M.LIMITS = { depth = 6, leaves = 64, values = 500 }

local RANGE: { [string]: string } = { lt = "<", lte = "<=", gt = ">", gte = ">=" }
local LEAF_KEYS: { [string]: boolean } = { field = true, ctx = true, op = true, value = true }

local function invalid(message: string): error
    return errors.new({ details = { code = "invalid_filter" }, kind = errors.INVALID, message = message })
end

local function marks(n: integer): string
    local out: { string } = {}
    for i = 1, n do out[i] = "?" end
    return table.concat(out, ", ")
end

-- stored turns a request value into the column's stored form: the order value
-- for number columns, the key for the others.
local function stored(target: types.ColumnTarget, raw: unknown): (types.ColumnValue?, error?)
    local input = raw
    if target.coerce then
        local coerced, cerr = target.coerce(raw)
        if cerr then return nil, cerr end
        input = coerced
    end
    local value, err = values.normalize({ form = target.shape.form, cardinality = "one", config = target.shape.config }, input)
    if err or value == nil then return nil, err end
    if target.kind == "number" then return values.order(target.shape.form, value :: types.Scalar, target.shape.config) end
    return values.key(target.shape.form, value :: types.Scalar, target.shape.config)
end

local function one(c: types.FilterCompilation, target: types.ColumnTarget, label: string, raw: unknown): (types.ColumnValue?, error?)
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

local function many(c: types.FilterCompilation, target: types.ColumnTarget, label: string, raw: unknown): ({ unknown }?, error?)
    local resolved, err = operands.resolve(c.reader, raw)
    if err then return nil, err end
    if type(resolved) ~= "table" or #(resolved :: { unknown }) == 0 then return nil, invalid(label .. " needs a list of values") end
    local out: { unknown } = {}
    for i, item in ipairs(resolved :: { unknown }) do
        local v, err = one(c, target, label, item)
        if err or v == nil then return nil, err end
        out[i] = v
    end
    return out, nil
end

-- text_operand checks a contains or starts_with operand: a non-empty string in
-- the field's own key form, so a case-insensitive field matches as it stores.
local function text_operand(c: types.FilterCompilation, target: types.ColumnTarget, label: string, raw: unknown): (types.ColumnValue?, error?)
    if target.set or target.kind ~= "key" or target.shape.form ~= "text" then return nil, invalid(label .. " applies to single text fields") end
    if type(raw) ~= "string" or raw == "" then return nil, invalid(label .. " needs non-empty text") end
    return one(c, target, label, raw)
end

local function set_leaf(c: types.FilterCompilation, target: types.ColumnTarget, op: string, label: string, raw: unknown): (types.Condition?, error?)
    local rows = "SELECT 1 FROM " .. c.set_table .. " s WHERE s.item_id = " .. c.alias .. ".item_id AND s.col = ?"
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

local function column_leaf(c: types.FilterCompilation, target: types.ColumnTarget, op: string, label: string, raw: unknown): (types.Condition?, error?)
    local col = c.alias .. "." .. target.column
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

local function member_of(c: types.FilterCompilation, target: types.ColumnTarget, label: string, raw: unknown): (types.Condition?, error?)
    if not target.principal then return nil, invalid(label .. " applies to principal fields") end
    local resolved, err = operands.resolve(c.reader, raw)
    if err then return nil, err end
    local groups = type(resolved) == "string" and { resolved } or resolved
    if type(groups) ~= "table" or #(groups :: { unknown }) == 0 then return nil, invalid(label .. " takes a group id or a nonempty list") end
    local wanted: { [string]: boolean } = {}
    local count = 0
    for key, group in pairs(groups :: { [unknown]: unknown }) do
        if type(key) ~= "number" or math.tointeger(key) == nil or key < 1 or key > #(groups :: { unknown }) or type(group) ~= "string" or group == "" then
            return nil, invalid(label .. " takes a dense list of group ids")
        end
        wanted[group] = true
        count = count + 1
    end
    if count > c.values then return nil, invalid("a filter tree holds at most " .. M.LIMITS.values .. " values") end
    c.values = c.values - count
    if not target.memberships then return nil, errors.new({ kind = errors.INTERNAL, message = "predicate memberships are unresolved", details = { code = "memberships_unresolved" } }) end
    local keys: { unknown } = {}
    for principal, memberships in pairs(target.memberships) do
        for group in pairs(wanted) do
            if memberships[group] then keys[#keys + 1] = principal; break end
        end
    end
    if #keys == 0 then return { sql = "1=0", args = {} }, nil end
    table.sort(keys :: { string })
    if target.set then
        local args: { unknown } = { target.column }
        for _, key in ipairs(keys) do args[#args + 1] = key end
        return { sql = "EXISTS (SELECT 1 FROM " .. c.set_table .. " s WHERE s.item_id=" .. c.alias .. ".item_id AND s.col=? AND s.value_key IN (" .. marks(#keys) .. "))", args = args }, nil
    end
    return { sql = c.alias .. "." .. target.column .. " IN (" .. marks(#keys) .. ")", args = keys }, nil
end

local function leaf(c: types.FilterCompilation, n: { [string]: unknown }): (types.Condition?, error?)
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
    if op == "member_of" then return member_of(c, target, label, n.value) end
    if op == "is_state" then
        if not target.state_column then return nil, invalid(label .. " requires a declared indexed field") end
        if n.value ~= "absent" and n.value ~= "cleared" and n.value ~= "provided" then return nil, invalid(label .. " takes absent, cleared or provided") end
        return { sql = c.alias .. "." .. target.state_column .. " = ?", args = { n.value } }, nil
    end
    if (RANGE[op] or op == "between") and target.order then target = target.order end
    if target.set then return set_leaf(c, target, op, label, n.value) end
    return column_leaf(c, target, op, label, n.value)
end

local node: (types.FilterCompilation, unknown, integer) -> (types.Condition?, error?)

function node(c: types.FilterCompilation, raw: unknown, depth: integer): (types.Condition?, error?)
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
        if n.awaiting ~= nil then
            if n.awaiting ~= true or next(n, next(n)) ~= nil then return nil, invalid("awaiting stands alone and takes true") end
            if c.leaves < 1 then return nil, invalid("too many filter leaves") end
            c.leaves = c.leaves - 1
            if not c.reader.awaiting then return nil, invalid("awaiting requires an item query") end
            return c.reader.awaiting(c.alias)
        end
        if n.match ~= nil then
            if next(n, next(n)) ~= nil then return nil, invalid("match stands alone in its node") end
            if c.leaves < 1 then return nil, invalid("too many filter leaves") end
            c.leaves = c.leaves - 1
            return search.compile(c.reader, c.alias, n.match, c.position, c.resolve)
        end
        if n.history ~= nil then
            if next(n, next(n)) ~= nil then return nil, invalid("a history condition stands alone in its node") end
            if c.leaves < 1 then return nil, invalid("a filter tree holds at most " .. M.LIMITS.leaves .. " leaves") end
            c.leaves = c.leaves - 1
            return filter_history.compile(c.reader, c.alias, c.resolve, n.history)
        end
        if n.rel ~= nil or n.children ~= nil then
            if c.leaves < 1 then return nil, invalid("a filter tree holds at most " .. M.LIMITS.leaves .. " leaves") end
            c.leaves = c.leaves - 1
            local alias, hop = c.alias, c.hop
            local out, err = filter_relation.compile({ reader = c.reader, alias = alias, hop = hop, item_table = c.item_table,
                relations = c.relations, nested = function(where: unknown, target: string): (types.Condition?, error?)
                    c.alias, c.hop = target, hop + 1
                    local inner, ierr = node(c, where, depth + 1)
                    c.alias, c.hop = alias, hop
                    return inner, ierr
                end }, n)
            return out, err
        end
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
function M.compile(where: unknown, env: types.FilterEnvironment): (types.Condition?, error?)
    return node({ reader = env.reader, item_table = env.item_table, set_table = env.set_table, position = env.position,
        relations = env.relations, resolve = env.resolve, leaves = M.LIMITS.leaves, values = M.LIMITS.values,
        alias = "i", hop = 0 }, where, 1)
end

return M
