-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local peers = require("peers")
local window = require("window")
local budget = require("budget")
local planner = require("planner")
local transitions = require("transitions")
-- The query compiler builds the predicate, ordering, keyset page and capped count.
local security = require("security")
local sql = require("sql")
local access = require("access")
local tables = require("tables")
local store = require("store")
local read_rows = require("read_rows")
local job_rows = require("job_rows")
local select = require("select")
local resolve = require("resolve")
local item_view = require("item_view")
local domain = require("domain")
local types = require("types")
local predicates = require("predicates")
local plugins = require("plugins")
local scopes = require("scopes")
local component = require("component")

local access_rows = require("access_rows")
local guard = require("guard")
local awaiting = require("awaiting")
local M = {}
local function includes(list: { string }?, name: string): boolean
    for _, value in ipairs(list or {}) do if value == name then return true end end
    return false
end
local QUERY_KEYS: { [string]: boolean } = { budget = true, include = true, group_by = true, sub_group_by = true, board_id = true, where = true, scopes = true, order = true, after = true, limit = true, min_seq = true, include_trashed = true }
local COUNT_KEYS: { [string]: boolean } = { budget = true, board_id = true, where = true, scopes = true, min_seq = true, include_trashed = true }

local function validate(request: types.QueryRequest, counted: boolean): error?
    local allowed = counted and COUNT_KEYS or QUERY_KEYS
    for key in pairs(request) do
        if not allowed[key] then return access.invalid("unsupported query option " .. tostring(key)) end
    end
    if request.group_by and request.after then return access.invalid("group detail cursors are used with a query filtered to that group") end
    if request.include ~= nil then
        if type(request.include) ~= "table" then return access.invalid("query include takes gate, awaiting and transitions") end
        local seen: { [string]: boolean } = {}
        for _, name in ipairs(request.include) do
            if (name ~= "gate" and name ~= "transitions" and name ~= "awaiting") or seen[name] then return access.invalid("query include takes gate, awaiting and transitions once each") end
            seen[name] = true
        end
    end
    if request.after ~= nil then
        if type(request.after) ~= "table" or type(request.after.id) ~= "string" or request.after.id == "" then
            return access.invalid("after is a cursor from a previous page")
        end
        for key in pairs(request.after) do
            if key ~= "id" and key ~= "v" and key ~= "keys" then return access.invalid("after has unknown key " .. tostring(key)) end
        end
        if request.after.v ~= nil and type(request.after.v) ~= "string" and type(request.after.v) ~= "number" then
            return access.invalid("after holds a stored sort value")
        end
    end
    if request.limit ~= nil and (type(request.limit) ~= "number" or math.tointeger(request.limit) == nil) then return access.invalid("limit is an integer") end
    if request.min_seq ~= nil and (type(request.min_seq) ~= "number" or math.tointeger(request.min_seq) == nil or request.min_seq < 0) then
        return access.invalid("min_seq is a nonnegative integer")
    end
    if request.limit ~= nil and (request.limit < 1 or request.limit > 200) then return access.invalid("limit must be 1..200") end
    if request.include_trashed ~= nil and type(request.include_trashed) ~= "boolean" then return access.invalid("include_trashed is a boolean") end
    return nil
end

local function order_of(order: types.Order?): ({ domain.Sort }?, error?)
    if not order then return { { field = "rank" } }, nil end
    if type(order) ~= "table" then return nil, access.invalid("order takes up to three indexed fields") end
    local list = (order :: domain.Sort).field and { order :: domain.Sort } or order :: { domain.Sort }
    if #list < 1 or #list > 3 then return nil, access.invalid("order takes one to three fields") end
    for _, sort in ipairs(list) do
        if type(sort) ~= "table" or type(sort.field) ~= "string" or sort.field == "" then return nil, access.invalid("order needs a field") end
        for key in pairs(sort) do if key ~= "field" and key ~= "dir" and key ~= "ctx" then return nil, access.invalid("unknown order option") end end
        if sort.dir and sort.dir ~= "asc" and sort.dir ~= "desc" then return nil, access.invalid("order dir is asc or desc") end
    end
    return list, nil
end


local function pending(tx: types.Executor, board: domain.Board, request: types.QueryRequest, counted: boolean): (boolean, error?)
    local used: { [string]: boolean } = {}
    if board.compiled.visibility then used[board.compiled.visibility.field] = true end
    local _, ierr = predicates.inspect(request.where, used, 1)
    if ierr then return false, ierr end
    if not counted then
        local sort, serr = order_of(request.order)
        if serr then return false, serr end
        for _, key in ipairs(sort or {}) do used[key.field] = true end
        if request.group_by then used[request.group_by] = true end
        if request.sub_group_by then used[request.sub_group_by] = true end
    end
    local rows, err = job_rows.rebuilds(tx, board.board_id)
    if err then return false, err end
    for _, row in ipairs(rows or {}) do
        local blocked = false
        if row.job_type == "reindex" then
            local decoded_4, decode_err = store.stored(row.key, {} :: domain.JsonObject)
            if decode_err then return false, decode_err end
            local decoded_4 = decoded_4 :: domain.JsonObject
            local state = decoded_4
            if state.fields == nil then blocked = true
            else
                for _, code in ipairs(state.fields :: { string }) do if used[code] then blocked = true end end
            end
        else
            for _, f in ipairs(board.compiled.fields) do if (f.rollup or f.formula) and used[f.code] then blocked = true end end
        end
        if blocked then
            if row.status == "failed" then
                return false, errors.new({ kind = errors.UNAVAILABLE, retryable = false, message = store.text(row.error) or "board rebuild failed",
                    details = { code = "rebuild_failed" } })
            end
            return true, nil
        end
    end
    return false, nil
end

local function compile(tx: types.Executor, dialect: string, board: domain.Board, request: types.QueryRequest, counted: boolean, grants: { [string]: boolean }?, additional: { domain.Condition }?, scan: integer?): (types.Plan?, error?)
    local berr = predicates.bounds(request.where)
    if berr then return nil, berr end
    local sort, serr = order_of(request.order)
    if serr then return nil, serr end
    local actor = security.actor()
    local caller: domain.Reader = { board_id = board.board_id, actor = actor and actor:id(), search = board.compiled.scopes, plugins = board.compiled.plugins, allows = function(level: string): boolean return level == "read" or (grants ~= nil and grants[level] == true) end }
    caller.awaiting = function(alias: string): (domain.Condition?, error?) return awaiting.condition(tx, board, actor:id(), alias) end
    for _, scope in ipairs(request.scopes or {}) do
        local err = plugins.seam(scope.id, board.compiled.plugins, false, "scope")
        if err then return nil, err end
    end
    local admitted, admission_err = scopes.admit(caller, request.scopes)
    if admission_err or not admitted then return nil, admission_err end
    local visibility, verr = access_rows.condition(board, dialect)
    if verr or not visibility then return nil, verr end
    local where, werr = access_rows.where(board, request.where)
    if werr then return nil, werr end
    local conditions: { domain.Condition } = { read_rows.life_condition(request.include_trashed), visibility }
    for _, condition in ipairs(additional or {}) do conditions[#conditions + 1] = condition end
    local groups: { string }? = nil
    if request.group_by then groups = { request.group_by } end
    if request.sub_group_by then
        if not groups then return nil, access.invalid("sub_group_by requires group_by") end
        groups[#groups + 1] = request.sub_group_by
    end
    return select.items(caller, tables.of(board.board_id, tables.layout(board.compiled), board.model.relations), dialect,
        { scan = scan or (request.budget and request.budget.rows or 200000), groups = groups, where = where, sorts = sort, after = request.after, count = counted and 10000 or nil }, access_rows.resolver(board, resolve.resolver(tx, board)), admitted,
        conditions,
        request.limit or 50)
end

local function scope_grants(request: types.QueryRequest): ({ [string]: boolean }?, error?)
    local out: { [string]: boolean } = { read = true }
    local _, err, matching = predicates.inspect(request.where, {}, 1)
    if err then return nil, err end
    if #(request.scopes or {}) == 0 and not matching then return out end
    for level, mask in pairs({ write = component.ACCESS.WRITE, admin = component.ACCESS.ADMIN }) do
        local _, err = component.validate_access(request.board_id, mask)
        local allowed, aerr = guard.authorization(err :: error?)
        if aerr then return nil, aerr end
        out[level] = allowed
    end
    return out
end

local function read_page(tx: types.Executor, board: domain.Board, plan: types.Plan, allowance: types.ReadAllowance, order: { domain.Sort }, limit: integer, listing: boolean?, include_gate: boolean?, include_awaiting: boolean?): (types.QueryPage?, error?)
    if budget.expired(allowance) then return { items = {}, cursors = {}, reindexing = false, incomplete = true }, nil end
    local built = plan.query
    local stopped: domain.Cursor? = nil
    local scanned = 0
    if plan.walk then
        local walk, err = plan.walk:run_with(tx)
        if err or not walk then return nil, err end
        local edge, eerr = walk:query()
        if eerr then return nil, eerr end
        if edge and #edge == 1 then scanned = plan.scan :: integer
        elseif not edge or #edge == 0 then
            local n, _, err = select.total(tx, plan.population :: types.Count)
            if err or not n then return nil, err end
            scanned = n
        end
        if edge and #edge > 1 then
            stopped = window.cursor(edge[1], order)
            local bounded, berr = (plan.through :: (domain.Cursor) -> (sql.SelectBuilder?, error?))(stopped)
            if berr or not bounded then return nil, berr end
            built = bounded
            scanned = plan.scan :: integer
        end
    end
    local deadline_err = budget.check(allowance)
    if deadline_err then return { items = {}, cursors = {}, reindexing = false, incomplete = true }, nil end
    local executor, xerr = built:run_with(tx)
    if xerr or not executor then return nil, xerr end
    local rows, qerr = executor:query()
    if qerr then return nil, qerr end
    local ids: { string } = {}
    for i = 1, math.min(#(rows or {}), limit) do
        local decoded_3, decode_err = store.need(rows[i], "item_id")
        if decode_err then return nil, decode_err end
        local decoded_3 = decoded_3 :: string
        ids[i] = decoded_3
    end
    local loaded, lerr = store.items(tx, board.board_id, ids)
    if lerr or not loaded then return nil, lerr end
    local by_id: { [string]: domain.Item } = {}
    for _, item in ipairs(loaded) do by_id[item.item_id] = item end
    local items: { types.ItemView } = {}
    for _, id in ipairs(ids) do
        local item = by_id[id]
        if not item then return nil, errors.new({ details = { code = "internal" }, kind = errors.INTERNAL, message = "query index names a missing item" }) end
        local view, verr = item_view.render(tx, board, item, include_gate, include_awaiting)
        if verr or not view then return nil, verr end
        items[#items + 1] = view
    end
    if listing ~= nil then
        local listed, err = transitions.list(tx, board, loaded, board.dialect :: string, listing)
        if err or not listed then return nil, err end
        for _, item in ipairs(items) do item.transitions = listed[item.id] end
    end
    local after: domain.Cursor? = nil
    if #(rows or {}) > limit then after = window.cursor(rows[limit], order); stopped = nil
    elseif stopped then after = stopped end
    local cursors: { domain.Cursor } = {}
    for i = 1, #items do cursors[i] = window.cursor(rows[i], order) end
    allowance.remaining = allowance.remaining - math.max(scanned, #items)
    return { items = items, cursors = cursors, after = after, reindexing = false, scanned = math.max(scanned, #items), incomplete = stopped ~= nil or budget.expired(allowance) }, nil
end

-- matching evaluates a feed selection in its existing committed snapshot.
function M.matching(tx: types.Executor, board: domain.Board, dialect: string, where: domain.Where, ids: { string }): ({ [string]: boolean }?, error?)
    local request: types.QueryRequest = { board_id = board.board_id, where = where, limit = math.max(1, #ids) }
    local rebuilding, pending_err = pending(tx, board, request, false)
    if pending_err then return nil, pending_err end
    if rebuilding then
        return nil, errors.new({ kind = errors.UNAVAILABLE, retryable = true, message = "source selection awaits its indexes",
            details = { code = "projection_pending" } })
    end
    local marks: { string } = {}
    local args: domain.SqlParams = {}
    for i, id in ipairs(ids) do marks[i] = "?"; args[i] = id end
    local plan, err = compile(tx, dialect, board, request, false, { read = true },
        { { sql = #ids == 0 and "1 = 0" or "i.item_id IN (" .. table.concat(marks, ",") .. ")", args = args } })
    if err or not plan then return nil, err end
    local execution, exec_err = plan.query:run_with(tx)
    if exec_err or not execution then return nil, exec_err end
    local rows, read_err = execution:query()
    if read_err then return nil, read_err end
    local selected: { [string]: boolean } = {}
    for _, row in ipairs(rows or {}) do
        local id, decode_err = store.need(row, "item_id")
        if decode_err then return nil, decode_err end
        selected[id :: string] = true
    end
    return selected, nil
end

function M.page(request: types.QueryRequest, context: types.ReadContext?, check: types.PageCheck?): (types.QueryPage?, error?)
    local verr = validate(request, false)
    if verr then return nil, verr end
    local listing: boolean? = nil
    if includes(request.include, "transitions") then
        local writable, err = resolve.writable(request.board_id)
        if err then return nil, err end
        listing = writable
    end
    local shared: types.ReadContext = context or ({ admitted = {}, holders = {} } :: types.ReadContext)
    local allowance = shared.allowance
    if not allowance then
        local started, allowance_err = budget.start(request.budget)
        if allowance_err or not started then return nil, allowance_err end
        allowance = started
    end
    shared.allowance, shared.partial = allowance, true
    local scan = math.max(1, math.min(allowance.remaining, request.budget and request.budget.rows or 200000))
    local limit = request.limit or 50
    if limit < 1 or limit > 200 then return nil, access.invalid("limit must be 1..200") end
    local grants, gerr = scope_grants(request)
    if gerr or not grants then return nil, gerr end
    local catalog: { [string]: domain.Field } = {}
    local result, read_err = access.with_snapshot(request.board_id, request.min_seq, function(tx: types.Executor, board: domain.Board, dialect: string): (types.QueryPage?, error?)
        if budget.expired(allowance) then return { items = {}, cursors = {}, reindexing = false, incomplete = true }, nil end
        catalog = peers.catalog(board)
        if check then
            local cerr = check(board)
            if cerr then return nil, cerr end
        end
        local plan, err = compile(tx, dialect, board, request, false, grants, nil, scan)
        if err or not plan then return nil, err end
        local rebuilding, perr = pending(tx, board, request, false)
        if perr then return nil, perr end
        if rebuilding then return { items = {}, cursors = {}, reindexing = true }, nil end
        local order = order_of(request.order) :: { domain.Sort }
        local result, rerr = read_page(tx, board, plan, allowance, order, limit, listing, includes(request.include, "gate"), includes(request.include, "awaiting"))
        if rerr or not result then return nil, rerr end
        local target, target_err = resolve.resolver(tx, board)(order[1].field)
        if target_err then return nil, target_err end
        if target and target.order then target = target.order end
        local groups: { types.QueryGroup }? = nil
        if plan.grouped and not result.incomplete and not budget.expired(allowance) then
            if request.after then return nil, access.invalid("group detail cursors are used with a query filtered to that group") end
            local execution, xerr = plan.grouped:run_with(tx)
            if xerr or not execution then return nil, xerr end
            local grouped, gerr = execution:query()
            if gerr then return nil, gerr end
            if #(grouped or {}) > 200 then return nil, access.invalid("a grouped page holds at most 200 groups") end
            groups = {}
            local parents: { [string]: types.QueryGroup } = {}
            for _, row in ipairs(grouped or {}) do
                local extra: { domain.Condition } = {}
                for i, column in ipairs(plan.group_columns or {}) do
                    local value = row["group_" .. i]
                    local present = type(value) == "string" or type(value) == "number" or type(value) == "boolean"
                    extra[#extra + 1] = { sql = column .. (present and " = ?" or " IS NULL"), args = present and { value } or {} }
                end
                local page, perr = compile(tx, dialect, board, request, false, grants, extra, scan)
                if perr or not page then return nil, perr end
                local detail, derr = read_page(tx, board, page, allowance, order, limit, listing, includes(request.include, "gate"), includes(request.include, "awaiting"))
                if derr or not detail then return nil, derr end
                local decoded_1, decode_err = store.need_int(row, "group_count")
                if decode_err then return nil, decode_err end
                local decoded_1 = decoded_1 :: integer
                local field = request.sub_group_by or request.group_by :: string
                local first = detail.items[1]
                local raw = request.sub_group_by and row.group_2 or row.group_1
                local value: unknown = raw
                if first and board.model.fields[field] then value = first.values[field] end
                local group: types.QueryGroup = { field = field, value = value, count = decoded_1, items = detail.items, after = detail.after }
                if request.sub_group_by then
                    local identity = type(row.group_1) .. ":" .. tostring(row.group_1)
                    local parent = parents[identity]
                    if not parent then
                        local parent_plan, perr = compile(tx, dialect, board, request, false, grants, { extra[1] }, scan)
                        if perr or not parent_plan then return nil, perr end
                        local parent_page, perr = read_page(tx, board, parent_plan, allowance, order, limit, listing, includes(request.include, "gate"), includes(request.include, "awaiting"))
                        if perr or not parent_page then return nil, perr end
                        local parent_value: unknown = row.group_1
                        local first = parent_page.items[1]
                        if first and board.model.fields[request.group_by :: string] then parent_value = first.values[request.group_by :: string] end
                        parent = { field = request.group_by :: string, value = parent_value, count = 0, items = parent_page.items, after = parent_page.after, groups = {} }
                        parents[identity] = parent
                        groups[#groups + 1] = parent
                    end
                    parent.count = parent.count + group.count
                    table.insert(parent.groups :: { types.QueryGroupRow }, group)
                else groups[#groups + 1] = group end
            end
        end
        return { incomplete = result.incomplete, scanned = result.scanned, items = result.items, cursors = result.cursors, after = result.after, groups = groups,
            reindexing = false, form = target and target.shape.form, kind = target and target.kind }, nil
    end, shared, nil, request.where)
    if read_err or not result then return nil, read_err end
    local err = peers.page(result, peers.redactor(catalog))
    if err then return nil, err end
    if budget.expired(allowance) then result.incomplete = true end
    return result :: types.QueryPage, nil
end

function M.freeze(request: types.QueryRequest): ({ string }?, error?)
    local err = validate(request, true)
    if err then return nil, err end
    local grants, gerr = scope_grants(request)
    if gerr or not grants then return nil, gerr end
    local frozen, ferr = access.with_snapshot(request.board_id, request.min_seq, function(tx: types.Executor, board: domain.Board, dialect: string): ({ ids: { string }, as_of: integer?, generation: integer? }?, error?)
        local rebuilding, perr = pending(tx, board, request, true)
        if perr then return nil, perr end
        if rebuilding then return nil, errors.new({ kind = errors.UNAVAILABLE, message = "bulk selection awaits indexes", details = { code = "projection_pending" } }) end
        local population, nerr = job_rows.population(tx, board.board_id)
        if nerr then return nil, nerr end
        if population and population > 200000 then return nil, errors.new({ kind = errors.INVALID, message = "bulk selection exceeds its scan budget", details = { code = "bulk_selection_limit" } }) end
        request.limit = 200000
        local plan, cerr = compile(tx, dialect, board, request, false, grants)
        if cerr or not plan then return nil, cerr end
        local execution, xerr = plan.query:run_with(tx)
        if xerr or not execution then return nil, xerr end
        local rows, rerr = execution:query()
        if rerr then return nil, rerr end
        local ids: { string } = {}
        for _, row in ipairs(rows or {}) do
            local id, derr = store.need(row, "item_id")
            if derr then return nil, derr end
            ids[#ids + 1] = id :: string
        end
        table.sort(ids)
        return { ids = ids }, nil
    end, nil, nil, request.where)
    if ferr or not frozen then return nil, ferr end
    return frozen.ids, nil
end

function M.query(request: types.QueryRequest): (types.QueryResult?, error?)
    local page, err = M.page(request)
    if err or not page then return nil, err end
    return { incomplete = page.incomplete, items = page.items, groups = page.groups, after = page.after, reindexing = page.reindexing, as_of = page.as_of, generation = page.generation }, nil
end

function M.count(request: types.QueryRequest): (types.CountResult?, error?)
    local verr = validate(request, true)
    if verr then return nil, verr end
    local allowance, allowance_err = budget.start(request.budget)
    if allowance_err or not allowance then return nil, allowance_err end
    local grants, gerr = scope_grants(request)
    if gerr or not grants then return nil, gerr end
    return access.with_snapshot(request.board_id, request.min_seq, function(tx: types.Executor, board: domain.Board, dialect: string): (types.CountResult?, error?)
        if budget.expired(allowance) then return { total = 0, estimated = true, incomplete = true, reindexing = false }, nil end
        local plan, err = compile(tx, dialect, board, request, true, grants)
        if err or not plan or not plan.count then return nil, err end
        local rebuilding, perr = pending(tx, board, request, true)
        if perr then return nil, perr end
        if rebuilding then return { reindexing = true }, nil end
        local total, estimated, cerr = select.total(tx, plan.count)
        if cerr then return nil, cerr end
        local incomplete = estimated or budget.expired(allowance)
        return { total = total, estimated = incomplete, incomplete = incomplete, reindexing = false }, nil
    end, { allowance = allowance, partial = true, admitted = {}, holders = {} }, nil, request.where)
end

function M.explain(request: types.QueryRequest): (types.ExplainResult?, error?)
    local verr = validate(request, false)
    if verr then return nil, verr end
    local allowance, allowance_err = budget.start(request.budget)
    if allowance_err or not allowance then return nil, allowance_err end
    local grants, gerr = scope_grants(request)
    if gerr or not grants then return nil, gerr end
    local access_grants, aerr = access.effective(request.board_id)
    if aerr or not access_grants then return nil, aerr end
    local result, rerr = access.with_snapshot(request.board_id, request.min_seq, function(tx: types.Executor, board: domain.Board, dialect: string): (types.ExplainResult?, error?)
        local plan, err = compile(tx, dialect, board, request, false, grants)
        if err or not plan then return nil, err end
        local format = dialect == sql.type.POSTGRES and sql.builder.dollar or sql.builder.question
        local statement, args = plan.query:placeholder_format(format):to_sql()
        local indexes, ierr = planner.indexes(tx, dialect, statement, args)
        if ierr or not indexes then return nil, ierr end
        local admitted: { string } = {}
        for _, scope in ipairs(request.scopes or {}) do admitted[#admitted + 1] = scope.id end
        return { access = access_grants, plan = { statement = statement, args = args, indexes = indexes }, scopes = admitted, visibility = { life = not request.include_trashed } }, nil
    end, { allowance = allowance, admitted = {}, holders = {} }, nil, request.where)
    if rerr or not result then return nil, rerr end
    local usage, uerr = budget.usage(allowance)
    if uerr or not usage then return nil, uerr end
    result.budget = usage
    return result :: types.ExplainResult, nil
end

return M
