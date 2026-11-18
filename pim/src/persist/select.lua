-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- The query compiler: one item query over a catalog's generated table set,
-- compiled with sql.builder. Identifiers come only from the
-- layout and admitted scope declarations; every value is a bound argument, and
-- the builder writes the dialect's placeholders. The filter tree and sorts name
-- fields the resolver maps to generated columns; conditions add clauses over
-- aliases i (generated row) and r (product row).
local failure = require("failure")
local sql = require("sql")
local tree = require("tree")
local scopes = require("scopes")
local narrow = require("narrow")
local types = require("types")
local search = require("search")

local M = {}

type Statement = { statement: string, args: types.SqlParams }
type Count = Statement & { cap: integer, beyond: string? }
type Range = { condition: types.Condition?, direction: string? }
-- A filtered page spends one scan budget across all its ordered ranges.
type Plan = {
    sort_column: string?, tables: { string }, count: Count?, after: types.Cursor?, scan: integer?,
    ranges: (types.Cursor?) -> { Range }, page: (Range, integer?, integer) -> Statement,
}
M.Plan = Plan
M.Count = Count

local OPS = { eq = "=", lt = "<", lte = "<=", gt = ">", gte = ">=" }

local invalid = failure.invalid

local function marks(n: integer): string
    local out: { string } = {}
    for i = 1, n do out[i] = "?" end
    return table.concat(out, ", ")
end

-- scope_predicate builds the membership test one admitted scope query adds:
-- the item is among the scope table's rows matching every named filter.
local function scope_predicate(r: types.Reader, sq: types.AdmittedScope): (string?, { unknown }?, error?)
    local scope = sq.scope
    local parts: { string } = { scope.catalog_column .. " = ?" }
    local args: { unknown } = { r.catalog_id }
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
    parts[#parts + 1] = scope.product_column .. " = i.product_id"
    return "EXISTS (SELECT 1 FROM " .. scope.table .. " WHERE " .. table.concat(parts, " AND ") .. ")",
        args, nil
end

-- A sort always breaks ties by ascending product ID and puts nulls last.
-- An ascending tuple seeks both keys. Descending mixes directions, so it
-- seeks the remainder of the tie and the following values separately.
local function ranges(column: string?, direction: string, after: types.Cursor?): { Range }
    if not column then
        return { { condition = after and { sql = "i.product_id > ?", args = { after.id } } or nil } }
    end
    local c = column :: string
    local out: { Range } = {}
    if after and after.v ~= nil then
        if direction == "DESC" then
            out[#out + 1] = { condition = { sql = c .. " = ? AND i.product_id > ?", args = { after.v, after.id } } }
            out[#out + 1] = { direction = direction, condition = { sql = c .. " < ?", args = { after.v } } }
        else
            out[#out + 1] = { direction = direction,
                condition = { sql = "(" .. c .. ", i.product_id) > (?, ?)", args = { after.v, after.id } } }
        end
    elseif not after then
        out[#out + 1] = { direction = direction, condition = { sql = c .. " IS NOT NULL", args = {} } }
    end
    local nulls: types.Condition = { sql = c .. " IS NULL", args = {} }
    if after and after.v == nil then
        nulls = { sql = c .. " IS NULL AND i.product_id > ?", args = { after.id } }
    end
    out[#out + 1] = { condition = nulls }
    return out
end

local function order(range: Range, reverse: boolean): string
    local id = reverse and "product_id DESC" or "product_id ASC"
    if range.direction == nil then return id end
    local descending = range.direction == "DESC"
    return ("sort_value " .. (descending ~= reverse and "DESC" or "ASC") .. ", " .. id)
end

local function restrict(base: sql.SelectBuilder, range: Range): sql.SelectBuilder
    local condition = range.condition
    if not condition then return base end
    return base:where(condition.sql, table.unpack(condition.args))
end

-- items builds the page query of q over t for reader r. returning names the
-- system columns to select besides product_id and sku. q.count, when
-- set, is the cap of the count the plan also carries.
function M.items(r: types.Reader, t: types.Table, dialect: string, q: types.ItemQuery, resolve: types.Resolver,
    admitted: { types.AdmittedScope }, conditions: { types.Condition }, returning: { string }): (Plan?, error?)
    local names = t.names
    local selected: { string } = { "i.product_id AS product_id" }
    for _, name in ipairs(returning) do selected[#selected + 1] = "i." .. name end
    selected[#selected + 1] = "r.sku"
    local clauses: { types.Condition } = {}
    for _, c in ipairs(conditions) do clauses[#clauses + 1] = c end
    if q.where ~= nil then
        local position = dialect == sql.type.POSTGRES and "strpos" or "instr"
        local fragment, err = tree.compile(q.where, { reader = r, set_table = names.set, position = position, resolve = resolve })
        if err or not fragment then return nil, err end
        clauses[#clauses + 1] = fragment
    end
    if type(q.text) == "string" and q.text ~= "" then
        -- Free text finds items whose sku starts with it or whose searchable
        -- values contain its words.
        local key_arg = search.fold(q.text)
        local position = dialect == sql.type.POSTGRES and "strpos" or "instr"
        local key_sql = position .. "(i.sku_fold, ?) = 1"
        local tokens = #t.layout.search > 0 and search.tokens(q.text) or {}
        if #tokens == 0 then
            clauses[#clauses + 1] = { sql = key_sql, args = { key_arg } }
        elseif dialect == sql.type.POSTGRES then
            clauses[#clauses + 1] = { sql = "(i.search @@ plainto_tsquery('simple', ?) OR " .. key_sql .. ")", args = { table.concat(tokens, " "), key_arg } }
        else
            clauses[#clauses + 1] = { sql = "(EXISTS (SELECT 1 FROM " .. names.fts .. " WHERE rowid = i.rowid AND " .. names.fts .. " MATCH ?) OR "
                .. key_sql .. ")", args = { table.concat(tokens, " AND "), key_arg } }
        end
    end
    local tables: { string } = {}
    for _, sq in ipairs(admitted) do
        local predicate, args, serr = scope_predicate(r, sq)
        if serr or not predicate or not args then return nil, serr end
        clauses[#clauses + 1] = { sql = predicate, args = args }
        tables[#tables + 1] = sq.scope.table
    end
    local sort_column: string? = nil
    if q.sort then
        local target, err = resolve(q.sort.field, q.sort.ctx)
        if err or not target then return nil, err or invalid("unknown field " .. tostring(q.sort.field)) end
        if target.set then return nil, invalid(q.sort.field .. " holds several values and cannot sort") end
        sort_column = target.column
    end
    local sort_sql = sort_column and "i." .. sort_column or nil
    local sort_value = (sort_sql or "NULL") .. " AS sort_value"
    local direction = q.sort and q.sort.dir == "desc" and "DESC" or "ASC"
    local pg = dialect == sql.type.POSTGRES
    local format = pg and sql.builder.dollar or sql.builder.question
    local scan = #clauses > 0 and q.scan or nil

    local function matching(columns: { string }, source: string, keys_only: boolean): sql.SelectBuilder
        local base = sql.builder.select(table.concat(columns, ", "))
        if pg then
            if keys_only then
                base = base:from(source .. " w"):join("LATERAL (SELECT * FROM " .. names.item
                    .. " WHERE product_id = w.product_id OFFSET 0) i ON TRUE")
            else
                base = base:from(source .. " i")
            end
            base = base:join("LATERAL (SELECT sku, parent_id FROM kickside_pim_product "
                .. "WHERE catalog_id = ? AND product_id = i.product_id OFFSET 0) r ON TRUE", r.catalog_id)
        else
            local from = source .. " i"
            if keys_only then from = source .. " w CROSS JOIN " .. names.item .. " i ON i.product_id = w.product_id" end
            base = base:from(from .. " CROSS JOIN kickside_pim_product r")
                :where("r.catalog_id = ? AND r.product_id = i.product_id", r.catalog_id)
        end
        for _, c in ipairs(clauses) do
            -- Keep correlated scope and publication checks on the candidate row.
            base = base:where("CASE WHEN " .. c.sql .. " THEN 1 ELSE 0 END = 1", table.unpack(c.args))
        end
        return base
    end

    local function candidate(range: Range, size: integer): sql.SelectBuilder
        return restrict(sql.builder.select("i.product_id", sort_value):from(names.item .. " i"), range)
            :order_by(order(range, false)):limit(size)
    end

    local function compiled(outer: sql.SelectBuilder, first: types.SqlParams, second: types.SqlParams): Statement
        for _, arg in ipairs(second) do first[#first + 1] = arg end
        local statement = outer:placeholder_format(format):to_sql()
        return { statement = statement, args = first }
    end

    local counted: Count? = nil
    if q.count then
        local source = names.item
        local beyond: string? = nil
        if scan then
            -- The count can stream its item rows from the primary index and
            -- apply the filters without a second item lookup for every key.
            local candidates = sql.builder.select("i.*"):from(names.item .. " i")
            if not pg then candidates = candidates:columns("i.rowid AS rowid") end
            local walk = candidates:order_by("i.product_id"):limit(scan):to_sql()
            source = "(" .. walk .. ")"
            beyond = "SELECT 1 AS present FROM " .. names.item .. " ORDER BY product_id LIMIT 1 OFFSET " .. scan
        end
        local within, args = matching({ "1" }, source, false):limit(q.count + 1):to_sql()
        local built = compiled(sql.builder.select("count(*) AS n"):from("(" .. within .. ") matched"), {}, args)
        counted = { statement = built.statement, args = built.args, cap = q.count, beyond = beyond }
    end

    local function page(range: Range, size: integer?, wanted: integer): Statement
        if not size then
            local query, args = restrict(matching(selected, names.item, false):columns(sort_value), range)
                :order_by(order(range, false)):limit(wanted):placeholder_format(format):to_sql()
            return { statement = query, args = args }
        end
        local walk, keys = candidate(range, size):to_sql()
        local hits, args = matching(selected, "candidates", true):columns("w.sort_value", "0 AS walk_count")
            :order_by(order(range, false)):limit(wanted):to_sql()
        -- Include the last candidate independently of whether it matched, so
        -- even an empty page can resume without revisiting rejected items.
        local empty = string.rep(", NULL", #selected - 1)
        local statement = "WITH candidates AS MATERIALIZED (" .. walk .. ") "
            .. "SELECT * FROM (" .. hits .. ") matched UNION ALL "
            .. "SELECT product_id" .. empty .. ", sort_value, (SELECT count(*) FROM candidates) AS walk_count "
            .. "FROM (SELECT product_id, sort_value FROM candidates ORDER BY " .. order(range, true) .. " LIMIT 1) edge"
        local outer = sql.builder.select("*"):from("(" .. statement .. ") page"):order_by("walk_count", order(range, false))
        return compiled(outer, keys, args)
    end

    return { sort_column = sort_column, tables = tables, count = counted, after = q.after, scan = scan,
        ranges = function(after: types.Cursor?): { Range } return ranges(sort_sql, direction, after) end, page = page }, nil
end

-- cursor_of reads a row's position as a keyset cursor.
function M.cursor_of(row: types.Row, sort_column: string?): types.Cursor
    local v: types.ColumnValue? = nil
    if sort_column then
        local raw = row.sort_value
        if type(raw) == "number" then v = math.tointeger(raw) elseif type(raw) == "string" then v = raw end
    end
    return { id = tostring(row.product_id), v = v }
end

-- rows runs the plan's page under its scan bound. When the walk ends before the
-- page fills it answers the cursor to continue from.
function M.rows(db: types.Executor, plan: Plan, limit: integer): ({ types.Row }?, types.Cursor?, error?)
    local hits: { types.Row } = {}
    local after, remaining = plan.after, plan.scan
    local wanted = limit + 1
    local batch = wanted
    while true do
        local resume: types.Cursor? = nil
        for _, range in ipairs(plan.ranges(after)) do
            local size = remaining and math.tointeger(math.min(remaining, batch)) or nil
            local page = plan.page(range, size, wanted - #hits)
            local rows, err = db:query(page.statement, page.args)
            if err then return nil, nil, err end
            if not rows then return nil, nil, errors.new({ details = { code = "internal" }, kind = errors.INTERNAL, message = "query returned no rows" }) end
            if not size then
                for _, row in ipairs(rows) do hits[#hits + 1] = row end
            elseif #rows > 0 then
                local edge = rows[#rows]
                for i = 1, #rows - 1 do hits[#hits + 1] = rows[i] end
                if #hits >= wanted then return hits, nil, nil end
                local used = narrow.int(edge.walk_count) :: integer
                remaining = (remaining :: integer) - used
                if remaining == 0 then return hits, M.cursor_of(edge, plan.sort_column), nil end
                if used == size then
                    resume = M.cursor_of(edge, plan.sort_column)
                    break
                end
            end
            if #hits >= wanted then return hits, nil, nil end
        end
        if not resume then return hits, nil, nil end
        after = resume
        -- Probe a modest prefix before spending the rest of the budget in one
        -- pass. Sparse pages still need only a few database round trips.
        batch = batch < 2048 and 2048 or (remaining :: integer)
    end
end

-- total runs the plan's count: the exact number of matches up to its cap. Past the
-- cap, or past a bounded scan, it answers what it counted with estimated set.
function M.total(db: types.Executor, count: Count): (integer?, boolean?, error?)
    local rows, err = db:query(count.statement, count.args)
    if err then return nil, nil, err end
    local n = rows and rows[1] and narrow.int(rows[1].n)
    if not n then return nil, nil, errors.new({ details = { code = "internal" }, kind = errors.INTERNAL, message = "count returned no number" }) end
    if n > count.cap then return count.cap, true, nil end
    if count.beyond then
        local past, perr = db:query(count.beyond :: string, {})
        if perr then return nil, nil, perr end
        if past and past[1] then return n, true, nil end
    end
    return n, false, nil
end

return M
