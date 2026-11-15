-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- The query compiler: one item query over a catalog's generated table set,
-- compiled into one SELECT with sql.builder. Identifiers come only from the
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

-- Plan is the built statement, the sort column its keyset cursor reads, and
-- the scope tables it reads, which the caller confirms exist.
-- Count is the statement that counts the matches up to cap + 1, before any page
-- or cursor applies. beyond, for a bounded scan, finds rows past the walk.
type Count = { statement: string, args: { unknown }, cap: integer, beyond: string? }
-- boundary, when set, finds the last row a bounded scan may walk; page rebuilds the
-- query to stop at that row.
type Plan = {
    query: sql.SelectBuilder, sort_column: string?, tables: { string }, count: Count?,
    boundary: sql.SelectBuilder?, page: (types.Cursor?) -> sql.SelectBuilder,
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
    return "i.product_id IN (SELECT " .. scope.product_column .. " FROM " .. scope.table .. " WHERE " .. table.concat(parts, " AND ") .. ")",
        args, nil
end

-- items builds the page query of q over t for reader r. returning names the
-- system columns to select besides product_id and sku; the query fetches
-- limit + 1 rows so the caller knows whether another page follows. q.count, when
-- set, is the cap of the count the plan also carries.
function M.items(r: types.Reader, t: types.Table, dialect: string, q: types.ItemQuery, resolve: types.Resolver,
    admitted: { types.AdmittedScope }, conditions: { types.Condition }, returning: { string }, limit: integer): (Plan?, error?)
    local names = t.names
    local selected: { string } = { "i.product_id" }
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
        local escaped = q.text:gsub("[\\%%_]", "\\%0")
        local like = dialect == sql.type.POSTGRES and "ILIKE" or "LIKE"
        local key_sql = "r.sku " .. like .. " ? ESCAPE '\\'"
        local key_arg = escaped .. "%"
        local tokens = search.tokens(q.text)
        if #t.layout.search == 0 or #tokens == 0 then
            clauses[#clauses + 1] = { sql = key_sql, args = { key_arg } }
        elseif dialect == sql.type.POSTGRES then
            clauses[#clauses + 1] = { sql = "(i.search @@ plainto_tsquery('simple', ?) OR " .. key_sql .. ")", args = { table.concat(tokens, " "), key_arg } }
        else
            local words: { string } = {}
            for i, token in ipairs(tokens) do words[i] = '"' .. token .. '"' end
            clauses[#clauses + 1] = { sql = "(i.product_id IN (SELECT product_id FROM " .. names.fts .. " WHERE " .. names.fts .. " MATCH ?) OR " .. key_sql .. ")",
                args = { table.concat(words, " AND "), key_arg } }
        end
    end
    local tables: { string } = {}
    for _, sq in ipairs(admitted) do
        local predicate, args, serr = scope_predicate(r, sq)
        if serr or not predicate or not args then return nil, serr end
        clauses[#clauses + 1] = { sql = predicate, args = args }
        tables[#tables + 1] = sq.scope.table
    end
    local function matching(columns: { string }): sql.SelectBuilder
        local base = sql.builder.select(table.unpack(columns))
            :from(names.item .. " i")
            :join("kickside_pim_product r ON r.catalog_id = ? AND r.product_id = i.product_id", r.catalog_id)
        for _, c in ipairs(clauses) do base = base:where(c.sql, table.unpack(c.args)) end
        return base
    end
    local query = matching(selected)
    local counted: Count? = nil
    if q.count then
        local format = dialect == sql.type.POSTGRES and sql.builder.dollar or sql.builder.question
        local within = matching({ "1" })
        local beyond: string? = nil
        if q.scan and #clauses > 0 then
            within = within:where("i.product_id <= COALESCE((SELECT product_id FROM " .. names.item .. " ORDER BY product_id LIMIT 1 OFFSET "
                .. math.tointeger(q.scan - 1) .. "), i.product_id)")
            beyond = "SELECT 1 AS present FROM " .. names.item .. " ORDER BY product_id LIMIT 1 OFFSET " .. math.tointeger(q.scan)
        end
        local inner, args = within:limit(q.count + 1):placeholder_format(format):to_sql()
        counted = { statement = "SELECT count(*) AS n FROM (" .. inner .. ") matched", args = args, cap = q.count, beyond = beyond }
    end
    local sort_column: string? = nil
    if q.sort then
        local target, err = resolve(q.sort.field, q.sort.ctx)
        if err or not target then return nil, err or invalid("unknown field " .. tostring(q.sort.field)) end
        if target.set then return nil, invalid(q.sort.field .. " holds several values and cannot sort") end
        sort_column = target.column
    end
    local desc = q.sort ~= nil and q.sort.dir == "desc"
    local c = sort_column and ("i." .. sort_column) or nil
    local function from_cursor(base: sql.SelectBuilder): sql.SelectBuilder
        local after = q.after
        if not after then return base end
        if not c then return base:where("i.product_id > ?", after.id) end
        if after.v == nil then return base:where("(" .. c .. " IS NULL AND i.product_id > ?)", after.id) end
        return base:where("((" .. c .. (desc and " < " or " > ") .. "?) OR (" .. c .. " = ? AND i.product_id > ?) OR " .. c .. " IS NULL)",
            after.v, after.v, after.id)
    end
    local function ordered(base: sql.SelectBuilder): sql.SelectBuilder
        if not c then return base:order_by("i.product_id") end
        return base:order_by("CASE WHEN " .. c .. " IS NULL THEN 1 ELSE 0 END", c .. (desc and " DESC" or " ASC"), "i.product_id")
    end
    local function page(through: types.Cursor?): sql.SelectBuilder
        local built = from_cursor(matching(selected))
        if c then built = built:columns(c .. " AS sort_value") end
        if through then
            if not c then
                built = built:where("i.product_id <= ?", through.id)
            elseif through.v == nil then
                built = built:where("(" .. c .. " IS NOT NULL OR i.product_id <= ?)", through.id)
            else
                built = built:where("(" .. c .. (desc and " > " or " < ") .. "? OR (" .. c .. " = ? AND i.product_id <= ?))",
                    through.v, through.v, through.id)
            end
        end
        return ordered(built):limit(limit + 1)
    end
    local plan: Plan = { query = page(nil), sort_column = sort_column, tables = tables, count = counted, page = page }
    -- A filter walks rows it may refuse, so its walk is bounded; a plain page reads only what it returns.
    if q.scan and #clauses > 0 then
        local walked = sql.builder.select("i.product_id")
            :from(names.item .. " i")
        if c then walked = walked:columns(c .. " AS sort_value") end
        plan.boundary = ordered(from_cursor(walked)):offset(q.scan - 1):limit(1)
    end
    return plan, nil
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
    local query = plan.query
    local stopped: types.Cursor? = nil
    if plan.boundary then
        local walk, werr = (plan.boundary :: sql.SelectBuilder):run_with(db)
        if werr or not walk then return nil, nil, werr or errors.new({ details = { code = "internal" }, kind = errors.INTERNAL, message = "scan boundary has no executor" }) end
        local edge, eerr = walk:query()
        if eerr then return nil, nil, eerr end
        if edge and edge[1] then
            stopped = M.cursor_of(edge[1], plan.sort_column)
            query = plan.page(stopped)
        end
    end
    local executor, xerr = query:run_with(db)
    if xerr or not executor then return nil, nil, xerr or errors.new({ details = { code = "internal" }, kind = errors.INTERNAL, message = "query has no executor" }) end
    local rows, err = executor:query()
    if err then return nil, nil, err end
    if not rows then return nil, nil, errors.new({ details = { code = "internal" }, kind = errors.INTERNAL, message = "query returned no rows" }) end
    if #rows > limit then stopped = nil end
    return rows, stopped, nil
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
