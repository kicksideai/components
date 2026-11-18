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
    local format = dialect == sql.type.POSTGRES and sql.builder.dollar or sql.builder.question
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
    local function apply(base: sql.SelectBuilder, conditions: { domain.Condition }): sql.SelectBuilder
        for _, c in ipairs(conditions) do base = base:where(c.sql, table.unpack(c.args)) end
        return base
    end
    local function generated(columns: { string }, conditions: { domain.Condition }): sql.SelectBuilder
        return apply(sql.builder.select(table.unpack(columns)):from(names.item .. " i"), conditions)
    end
    -- LIMIT in the derived table keeps the optimizer from placing residual
    -- predicates ahead of the candidate allowance.
    local predicates_only: { domain.Condition } = {}
    for i = #board_conditions + 1, #clauses do predicates_only[#predicates_only + 1] = clauses[i] end
    local function bounded(walk: sql.SelectBuilder, outer: sql.SelectBuilder, cap: integer): (string, { unknown })
        local inner, args = walk:limit(cap):placeholder_format(sql.builder.question):to_sql()
        local statement, binds = outer:from("(" .. inner .. ") i"):placeholder_format(format):to_sql()
        for _, arg in ipairs(binds) do args[#args + 1] = arg end
        return statement, args
    end
    local counted: types.Count? = nil
    if q.count then
        local cap = math.min(q.count, q.scan or q.count)
        local inner, args = "", {} :: { unknown }
        local beyond: string?, beyond_args: { unknown }? = nil, nil
        if q.scan and residual then
            local walk = generated({ "i.*" }, board_conditions):order_by("i.item_id")
            inner, args = bounded(walk, apply(sql.builder.select("1"), predicates_only):limit(cap + 1), q.scan)
            beyond, beyond_args = generated({ "i.item_id" }, board_conditions):order_by("i.item_id")
                :offset(q.scan):limit(1):placeholder_format(format):to_sql()
        else
            inner, args = generated({ "1" }, clauses):limit(cap + 1):placeholder_format(format):to_sql()
        end
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
    local ranges: { domain.Condition } = { { sql = "1 = 1", args = {} } }
    if q.after then
        if #columns == 1 then
            local required = false
            for _, column in ipairs(t.system) do
                if "i." .. column.name == columns[1] then required = true; break end
            end
            ranges = window.ranges(columns[1], order[1].dir == "desc", q.after, required)
        else
            local condition, err = window.after(columns, order, q.after)
            if err or not condition then return nil, err end
            ranges = { condition }
        end
    end
    local take = q.groups and q.scan or math.min(limit, q.scan or limit)
    local pages: { sql.SelectBuilder } = {}
    local scans: { sql.SelectBuilder } = {}
    for i, range in ipairs(ranges) do
        local base = generated(selection, clauses):where(range.sql, table.unpack(range.args))
        pages[i] = window.order(base, columns, order)
        if q.scan and residual and not q.count then
            local walk = generated({ "i.*" }, board_conditions):where(range.sql, table.unpack(range.args))
            scans[i] = window.order(walk, columns, order)
        end
    end
    local first = table.remove(pages, 1)
    local plan: types.Plan = { query = first:limit(take + 1), tails = pages, count = counted, groups = #group_columns, take = take }
    if #scans > 0 then
        -- The walk already checked ownership and board visibility.
        local outer = window.order(apply(sql.builder.select(table.unpack(selection)), predicates_only), columns, order)
        plan.bounded = { scans = scans, scan = q.scan :: integer, dialect = dialect, order = order,
            statement = function(walk: sql.SelectBuilder, scan: integer, matches: integer): (string, { unknown })
                local statement, args = bounded(walk, outer:limit(matches), scan)
                return statement, args
            end }
    end
    return plan, nil
end

function M.statement(plan: types.Plan, dialect: string): (string, { unknown })
    if plan.bounded then
        local statement, args = plan.bounded.statement(plan.bounded.scans[1], plan.bounded.scan, plan.take + 1)
        return statement, args
    end
    local statement, args = plan.query:placeholder_format(dialect == sql.type.POSTGRES and sql.builder.dollar or sql.builder.question):to_sql()
    return statement, args
end

local function fetch(db: types.Executor, query: sql.SelectBuilder): ({ domain.Row }?, error?)
    local execution, err = query:run_with(db)
    if err or not execution then return nil, err end
    return execution:query()
end

local function bounded_rows(db: types.Executor, plan: types.BoundedPlan, take: integer): ({ domain.Row }?, error?, integer?, domain.Cursor?)
    local remaining = plan.scan
    local result: { domain.Row } = {}
    local last: domain.Cursor? = nil
    for _, walk in ipairs(plan.scans) do
        if remaining == 0 then
            local next_rows, err = fetch(db, walk:limit(1))
            if err then return nil, err end
            if #(next_rows or {}) > 0 then return result, nil, plan.scan, last end
        else
            local edge, err = fetch(db, walk:offset(remaining - 1):limit(2))
            if err then return nil, err end
            local scanned = remaining
            if not edge or not edge[1] then
                local format = plan.dialect == sql.type.POSTGRES and sql.builder.dollar or sql.builder.question
                local inner, args = walk:limit(remaining):placeholder_format(format):to_sql()
                local n, _, nerr = M.total(db, { statement = "SELECT count(*) AS n FROM (" .. inner .. ") candidates", args = args, cap = remaining })
                if nerr then return nil, nerr end
                scanned = n :: integer
            end
            if scanned > 0 then
                local statement, args = plan.statement(walk, scanned, take + 1 - #result)
                local matched, err = db:query(statement, args)
                if err then return nil, err end
                for _, row in ipairs(matched or {}) do result[#result + 1] = row end
                remaining = remaining - scanned
            end
            if #result > take then return result, nil, plan.scan - remaining, nil end
            if edge and edge[1] then
                last = window.cursor(edge[1], plan.order)
                if edge[2] then return result, nil, plan.scan, last end
            end
        end
    end
    return result, nil, plan.scan - remaining, nil
end

function M.rows(db: types.Executor, plan: types.Plan): ({ domain.Row }?, error?, integer?, domain.Cursor?)
    if plan.bounded then return bounded_rows(db, plan.bounded, plan.take) end
    local rows, rerr = fetch(db, plan.query)
    if rerr then return nil, rerr end
    local result: { domain.Row } = rows or {}
    for _, tail in ipairs(plan.tails) do
        local left = plan.take + 1 - #result
        if left == 0 then break end
        local page, perr = fetch(db, tail:limit(left))
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
