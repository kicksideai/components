-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- The query compiler: one item query over a board's generated table set, compiled
-- into one SELECT with sql.builder. Identifiers come only from the layout and admitted
-- scope declarations; every value is a bound argument, and the builder writes the
-- dialect's placeholders. The generated table covers selection and ordering.
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
    local residual = false
    local item_row: { string } = { "r.board_id = ?", "r.item_id = i.item_id" }
    local item_args: { unknown } = { r.board_id }
    local board_conditions: { domain.Condition } = {}
    for _, c in ipairs(conditions) do
        if c.item_row then
            item_row[#item_row + 1] = c.sql
            for _, arg in ipairs(c.args) do item_args[#item_args + 1] = arg end
        else
            board_conditions[#board_conditions + 1] = c
        end
    end
    -- Keep the owning-row check a point lookup from the generated index order.
    -- An EXISTS join lets the planner start from the whole fixed item table.
    board_conditions[#board_conditions + 1] = { sql = "(SELECT 1 FROM kickside_work_item r WHERE "
        .. table.concat(item_row, " AND ") .. ") = 1", args = item_args }
    for _, c in ipairs(board_conditions) do clauses[#clauses + 1] = c end
    if q.where ~= nil then
        local fragment, err = filter.compile(q.where, { reader = r, item_table = names.item, set_table = names.set, dialect = dialect,
            relations = t.relations, resolve = resolve })
        if err or not fragment then return nil, err end
        clauses[#clauses + 1] = fragment
        residual = fragment.residual == true
    end
    for _, sq in ipairs(admitted) do
        local predicate, args, serr = scope_predicate(r, sq)
        if serr or not predicate or not args then return nil, serr end
        clauses[#clauses + 1] = { sql = predicate, args = args }
    end
    local function matching(columns: { string }): sql.SelectBuilder
        local base = sql.builder.select(table.unpack(columns))
            :from(names.item .. " i")
        for _, c in ipairs(clauses) do base = base:where(c.sql, table.unpack(c.args)) end
        return base
    end
    local counted: types.Count? = nil
    if q.count then
        local format = dialect == sql.type.POSTGRES and sql.builder.dollar or sql.builder.question
        local counting = matching({ "1" })
        local beyond: string?, beyond_args: { unknown }? = nil, nil
        if q.scan and residual then
            local walk = sql.builder.select("i.item_id"):from(names.item .. " i")
            for _, condition in ipairs(board_conditions) do walk = walk:where(condition.sql, table.unpack(condition.args)) end
            local edge, args = walk:order_by("i.item_id"):offset(q.scan - 1):limit(1):to_sql()
            counting = counting:where("i.item_id <= COALESCE((" .. edge .. "), i.item_id)", table.unpack(args))
            beyond, beyond_args = walk:order_by("i.item_id"):offset(q.scan):limit(1):placeholder_format(format):to_sql()
        end
        local cap = math.min(q.count, q.scan or q.count)
        local inner, args = counting:limit(cap + 1):placeholder_format(format):to_sql()
        counted = { statement = "SELECT count(*) AS n FROM (" .. inner .. ") matched", args = args, cap = cap, beyond = beyond, beyond_args = beyond_args }
    end
    local order: { domain.Sort } = q.sorts or {}
    local columns: { string } = {}
    for _, sort in ipairs(order) do
        local target, err = resolve(sort.field, sort.ctx)
        if err or not target then return nil, err or invalid("unknown sort field") end
        if target.set then return nil, invalid(sort.field .. " holds several values and cannot sort") end
        columns[#columns + 1] = "i." .. (target.order or target).column
    end
    local group_columns: { string } = {}
    local selection: { string } = { "i.item_id" }
    if q.groups then
        for i, field in ipairs(q.groups) do
            local target, err = resolve(field)
            if err or not target then return nil, err or invalid("unknown group field") end
            if target.set then return nil, invalid(field .. " holds several values and cannot group") end
            group_columns[i] = "i." .. target.column
            selection[#selection + 1] = group_columns[i] .. " AS group_" .. i
        end
    end
    local function from_cursor(built: sql.SelectBuilder): (sql.SelectBuilder?, error?)
        if not q.after then return built, nil end
        local condition, err = window.after(columns, order, q.after)
        if err or not condition then return nil, err end
        return built:where(condition.sql, table.unpack(condition.args)), nil
    end
    local take = q.groups and q.scan or math.min(limit, q.scan or limit)
    local base = matching(selection)
    local tails: { sql.SelectBuilder } = {}
    local query: sql.SelectBuilder
    if q.after and #columns == 1 and not residual then
        local required = false
        for _, column in ipairs(t.system) do
            if "i." .. column.name == columns[1] then required = true; break end
        end
        local ranges = window.ranges(columns[1], order[1].dir == "desc", q.after, required)
        local first = ranges[1]
        query = window.order(base:where(first.sql, table.unpack(first.args)), columns, order):limit(take + 1)
        for i = 2, #ranges do
            local range = ranges[i]
            tails[#tails + 1] = window.order(base:where(range.sql, table.unpack(range.args)), columns, order)
        end
    else
        local built, berr = from_cursor(base)
        if berr or not built then return nil, berr end
        query = window.order(built, columns, order):limit(take + 1)
    end
    local plan: types.Plan = { query = query, tails = tails, count = counted, groups = #group_columns, take = take, scan = q.scan }
    if q.scan and residual and not q.count then
        local walk = sql.builder.select("i.item_id"):from(names.item .. " i")
        for _, condition in ipairs(board_conditions) do walk = walk:where(condition.sql, table.unpack(condition.args)) end
        local walked, werr = from_cursor(walk)
        if werr or not walked then return nil, werr end
        plan.walk = window.order(walked, columns, order):offset(q.scan - 1):limit(2)
        local format = dialect == sql.type.POSTGRES and sql.builder.dollar or sql.builder.question
        local population, args = walked:limit(q.scan):placeholder_format(format):to_sql()
        plan.population = { statement = "SELECT COUNT(*) AS n FROM (" .. population .. ") scanned", args = args, cap = q.scan }
        local candidates, binds = window.order(walked, columns, order, false):limit(q.scan):to_sql()
        plan.query = query:where("i.item_id IN (" .. candidates .. ")", table.unpack(binds))
    end
    return plan, nil
end

function M.rows(db: types.Executor, plan: types.Plan): ({ domain.Row }?, error?)
    local executor, err = plan.query:run_with(db)
    if err or not executor then return nil, err end
    local rows, rerr = executor:query()
    if rerr then return nil, rerr end
    local result: { domain.Row } = rows or {}
    for _, tail in ipairs(plan.tails) do
        local left = plan.take + 1 - #result
        if left == 0 then break end
        local execution, err = tail:limit(left):run_with(db)
        if err or not execution then return nil, err end
        local page, perr = execution:query()
        if perr then return nil, perr end
        for _, row in ipairs(page or {}) do result[#result + 1] = row end
    end
    return result, nil
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
