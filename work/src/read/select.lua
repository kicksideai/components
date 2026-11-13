-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- The query compiler: one item query over a board's generated table set, compiled
-- into one SELECT with sql.builder. Identifiers come only from the layout and admitted
-- scope declarations; every value is a bound argument, and the builder writes the
-- dialect's placeholders. The filter tree and sorts name fields the resolver maps to
-- generated columns; conditions add clauses over aliases i (generated row) and
-- r (item row).
local sql = require("sql")
local filter = require("filter")
local scopes = require("scopes")
local store = require("store")
local domain = require("domain")
local types = require("types")

local window = require("window")
local M = {}

local OPS = { eq = "=", lt = "<", lte = "<=", gt = ">", gte = ">=" }

local function invalid(message: string): error
    return errors.new({ details = { code = "invalid_query" }, kind = errors.INVALID, message = message })
end

local function marks(n: integer): string
    local out: { string } = {}
    for i = 1, n do out[i] = "?" end
    return table.concat(out, ", ")
end

-- scope_predicate builds the membership test one admitted scope query adds:
-- the item is among the scope table's items matching every named filter.
local function scope_predicate(r: domain.Reader, sq: domain.AdmittedScope): (string?, { unknown }?, error?)
    local scope = sq.scope
    local parts: { string } = { scope.board_column .. " = ?" }
    local args: { unknown } = { r.board_id }
    local names: { string } = {}
    for name in pairs(sq.where or {}) do names[#names + 1] = name end
    table.sort(names)
    for _, name in ipairs(names) do
        local f = scope.filters[name]
        if not f then return nil, nil, invalid("scope " .. scope.id .. " has no filter " .. tostring(name)) end
        local ops = sq.where[name]
        if type(ops) ~= "table" then return nil, nil, invalid("scope filter " .. name .. " takes { op = value }") end
        local op_names: { string } = {}
        for op in pairs(ops) do op_names[#op_names + 1] = op end
        table.sort(op_names)
        for _, op in ipairs(op_names) do
            if not f.ops[op] then return nil, nil, invalid("scope filter " .. name .. " does not take " .. tostring(op)) end
            local raw = ops[op]
            local list: { unknown }
            if op == "in" then
                list = type(raw) == "table" and raw :: { unknown } or {}
            else
                list = { raw }
            end
            if #list == 0 then return nil, nil, invalid("scope filter " .. name .. " " .. op .. " needs a value") end
            for _, item in ipairs(list) do
                local v = scopes.value(f, item)
                if v == nil then return nil, nil, invalid("scope filter " .. name .. " takes " .. f.type .. " values") end
                args[#args + 1] = v
            end
            if op == "in" then
                parts[#parts + 1] = f.column .. " IN (" .. marks(#list) .. ")"
            else
                parts[#parts + 1] = f.column .. " " .. OPS[op] .. " ?"
            end
        end
    end
    return "i.item_id IN (SELECT " .. scope.item_column .. " FROM " .. scope.table .. " WHERE " .. table.concat(parts, " AND ") .. ")",
        args, nil
end

-- items builds the page query of q over t for reader r; the query fetches limit + 1
-- rows so the caller knows whether another page follows. q.count, when set, is the
-- cap of the count the plan also carries.
function M.items(r: domain.Reader, t: domain.GeneratedTable, dialect: string, q: domain.ItemQuery, resolve: domain.Resolver,
    admitted: { domain.AdmittedScope }, conditions: { domain.Condition }, limit: integer): (types.Plan?, error?)
    local names = t.names
    local clauses: { domain.Condition } = {}
    for _, c in ipairs(conditions) do clauses[#clauses + 1] = c end
    if q.where ~= nil then
        local position = dialect == sql.type.POSTGRES and "strpos" or "instr"
        local fragment, err = filter.compile(q.where, { reader = r, item_table = names.item, set_table = names.set, position = position,
            relations = t.relations, resolve = resolve })
        if err or not fragment then return nil, err end
        clauses[#clauses + 1] = fragment
    end
    for _, sq in ipairs(admitted) do
        local predicate, args, serr = scope_predicate(r, sq)
        if serr or not predicate or not args then return nil, serr end
        clauses[#clauses + 1] = { sql = predicate, args = args }
    end
    local function matching(columns: { string }): sql.SelectBuilder
        local base = sql.builder.select(table.unpack(columns))
            :from(names.item .. " i")
            :join("kickside_work_item r ON r.board_id = ? AND r.item_id = i.item_id", r.board_id)
        for _, c in ipairs(clauses) do base = base:where(c.sql, table.unpack(c.args)) end
        return base
    end
    local counted: types.Count? = nil
    if q.count then
        local format = dialect == sql.type.POSTGRES and sql.builder.dollar or sql.builder.question
        local counting = matching({ "1" })
        local beyond: string?, beyond_args: { unknown }? = nil, nil
        if q.scan then
            local walk = sql.builder.select("i.item_id"):from(names.item .. " i")
                :join("kickside_work_item r ON r.board_id = ? AND r.item_id = i.item_id", r.board_id)
            for _, condition in ipairs(conditions) do walk = walk:where(condition.sql, table.unpack(condition.args)) end
            local edge, args = walk:order_by("i.item_id"):offset(q.scan - 1):limit(1):to_sql()
            counting = counting:where("i.item_id <= COALESCE((" .. edge .. "), i.item_id)", table.unpack(args))
            beyond, beyond_args = walk:order_by("i.item_id"):offset(q.scan):limit(1):placeholder_format(format):to_sql()
        end
        local inner, args = counting:limit(q.count + 1):placeholder_format(format):to_sql()
        counted = { statement = "SELECT count(*) AS n FROM (" .. inner .. ") matched", args = args, cap = q.count, beyond = beyond, beyond_args = beyond_args }
    end
    local order: { domain.Sort } = q.sorts or {}
    local columns: { string } = {}
    for _, sort in ipairs(order) do
        local target, err = resolve(sort.field, sort.ctx)
        if err or not target then return nil, err or invalid("unknown sort field") end
        if target.set then return nil, invalid(sort.field .. " holds several values and cannot sort") end
        columns[#columns + 1] = "i." .. (target.order or target).column
    end
    local grouped: sql.SelectBuilder? = nil
    local group_columns: { string } = {}
    if q.groups then
        local selections: { string } = { "COUNT(*) AS group_count" }
        for i, field in ipairs(q.groups) do
            local target, err = resolve(field)
            if err or not target then return nil, err or invalid("unknown group field") end
            if target.set then return nil, invalid(field .. " holds several values and cannot group") end
            group_columns[i] = "i." .. target.column
            selections[#selections + 1] = group_columns[i] .. " AS group_" .. i
        end
        grouped = matching(selections)
        for _, column in ipairs(group_columns) do grouped = grouped:group_by(column) end
        for _, column in ipairs(group_columns) do grouped = grouped:order_by("CASE WHEN " .. column .. " IS NULL THEN 1 ELSE 0 END", column) end
        grouped = grouped:limit(201)
    end
    local function from_cursor(built: sql.SelectBuilder): (sql.SelectBuilder?, error?)
        if not q.after then return built, nil end
        local condition, err = window.after(columns, order, q.after)
        if err or not condition then return nil, err end
        return built:where(condition.sql, table.unpack(condition.args)), nil
    end
    local built, berr = from_cursor(matching({ "i.item_id" }))
    if berr or not built then return nil, berr end
    local query = window.order(built, columns, order):limit(limit + 1)
    local plan: types.Plan = { query = query, count = counted, grouped = grouped, group_columns = group_columns, order = order, scan = q.scan }
    if q.scan then
        local walk = sql.builder.select("i.item_id"):from(names.item .. " i")
            :join("kickside_work_item r ON r.board_id = ? AND r.item_id = i.item_id", r.board_id)
        for _, condition in ipairs(conditions) do walk = walk:where(condition.sql, table.unpack(condition.args)) end
        local walked, werr = from_cursor(walk)
        if werr or not walked then return nil, werr end
        plan.walk = window.order(walked, columns, order):offset(q.scan - 1):limit(2)
        local format = dialect == sql.type.POSTGRES and sql.builder.dollar or sql.builder.question
        local population, args = walked:limit(q.scan):placeholder_format(format):to_sql()
        plan.population = { statement = "SELECT COUNT(*) AS n FROM (" .. population .. ") scanned", args = args, cap = q.scan }
        plan.through = function(edge: domain.Cursor): (sql.SelectBuilder?, error?)
            local condition, err = window.after(columns, order, edge)
            if err or not condition then return nil, err end
            return query:where("(" .. condition.sql .. ") IS NOT TRUE", table.unpack(condition.args)), nil
        end
    end
    return plan, nil
end

-- total runs the plan's count: the exact number of matches up to its cap. Past the
-- cap it answers the cap with estimated set.
function M.total(db: types.Executor, count: types.Count): (integer?, boolean?, error?)
    local rows, err = db:query(count.statement, count.args)
    if err then return nil, nil, err end
    local n = rows and rows[1] and store.int(rows[1].n)
    if not n then return nil, nil, errors.new({ details = { code = "internal" }, kind = errors.INTERNAL, message = "count returned no number" }) end
    if n > count.cap then return count.cap, true, nil end
    if count.beyond then
        local rows, err = db:query(count.beyond, count.beyond_args)
        if err then return nil, nil, err end
        if rows and rows[1] then return n, true, nil end
    end
    return n, false, nil
end

return M
