-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local peers = require("peers")
local reference_page = require("reference_page")
local groups = require("groups")
local window = require("window")
local budget = require("budget")
local planner = require("planner")
local transitions = require("transitions")
-- The query compiler builds the predicate, ordering, keyset page and capped count.
local security = require("security")
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
local search = require("search")
local plugins = require("plugins")
local scopes = require("scopes")
local component = require("component")

local access_rows = require("access_rows")
local guard = require("guard")
local rules = require("rules")
local awaiting = require("awaiting")
local principals = require("principals")
local M = {}
local function includes(list: { string }?, name: string): boolean
    for _, value in ipairs(list or {}) do if value == name then return true end end
    return false
end
local QUERY_KEYS: { [string]: boolean } = { budget = true, include = true, group_by = true, sub_group_by = true, group_after = true,
    group_limit = true, measures = true, board_id = true, where = true, scopes = true, order = true, after = true, limit = true,
    min_seq = true, include_trashed = true }
local COUNT_KEYS: { [string]: boolean } = { budget = true, board_id = true, where = true, scopes = true, min_seq = true, include_trashed = true }
local BULK_SCAN_LIMIT = 200000

local function validate(request: types.QueryRequest, counted: boolean): error?
    local allowed = counted and COUNT_KEYS or QUERY_KEYS
    for key in pairs(request) do
        if not allowed[key] then return access.invalid("unsupported query option " .. tostring(key)) end
    end
    local group_err = groups.validate(request)
    if group_err then return group_err end
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

function M.order(order: types.Order?): ({ domain.Sort }?, error?)
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
        local sort, serr = M.order(request.order)
        if serr then return false, serr end
        for _, key in ipairs(sort or {}) do used[key.field] = true end
        if request.group_by then used[request.group_by] = true end
        if request.sub_group_by then used[request.sub_group_by] = true end
        for _, measure in ipairs(request.measures or {}) do used[measure.field] = true end
    end
    return job_rows.rebuilding(tx, board, used)
end

local function search_reader(board: domain.Board, grants: { [string]: boolean }?): domain.Reader
    local actor = security.actor()
    return { board_id = board.board_id, actor = actor and actor:id(), search = board.compiled.scopes,
        search_model = board.compiled, plugins = board.compiled.plugins,
        allows = function(level: string): boolean return level == "read" or (grants ~= nil and grants[level] == true) end }
end

local function with_query_snapshot<T: types.ReadStamp>(request: types.QueryRequest, grants: { [string]: boolean },
    fn: (types.Executor, domain.Board, string, domain.SearchResults?) -> (T?, error?), context: types.ReadContext?): (T?, error?)
    local matches: { [string]: boolean } = {}
    local _, inspect_err = predicates.inspect(request.where, {}, 1, matches)
    if inspect_err then return nil, inspect_err end
    local ids: domain.SearchResults? = nil
    local selected_seq: integer? = nil
    local prepare: types.SnapshotPreparation? = nil
    if next(matches) ~= nil then
        prepare = function(board: domain.Board): error?
            local reader = search_reader(board, grants)
            local min_seq = request.min_seq
            if min_seq and min_seq > 0 then
                local wanted = min_seq :: integer
                reader.scope_fence = function(projection: domain.ScopeProjection): error?
                    local db, err = store.open()
                    if err or not db then return err end
                    local pending = scopes.fence(db, board.board_id, projection, wanted)
                    db:release()
                    return pending
                end
            end
            local prepared, err = search.prepare(reader, board, matches)
            if err then return err end
            if prepared and next(prepared) ~= nil then
                ids, selected_seq = prepared, board.applied_seq
            end
            return nil
        end
    end
    return access.with_snapshot(request.board_id, request.min_seq, function(tx: types.Executor, board: domain.Board, dialect: string): (T?, error?)
        if selected_seq and selected_seq ~= board.applied_seq then
            return nil, errors.new({ kind = errors.UNAVAILABLE, retryable = true, message = "Work changed while resolving search candidates",
                details = { code = "search_snapshot_changed" } })
        end
        return fn(tx, board, dialect, ids)
    end, context, nil, request.where, nil, prepare)
end

local function compile(tx: types.Executor, dialect: string, board: domain.Board, request: types.QueryRequest, counted: boolean, grants: { [string]: boolean }?, additional: { domain.Condition }?, scan: integer?, order: { domain.Sort }?,
    definition_only: boolean?, ids: domain.SearchResults?, unfiltered: boolean?): (types.Plan?, error?)
    local berr = predicates.bounds(request.where)
    if berr then return nil, berr end
    local sort, serr = M.order(request.order)
    if serr then return nil, serr end
    local actor = security.actor()
    local caller = search_reader(board, grants)
    caller.search_definition, caller.search_ids = definition_only, ids
    local min_seq = request.min_seq
    if min_seq and min_seq > 0 and not definition_only then
        local checked: { [string]: { [string]: boolean } } = {}
        caller.scope_fence = function(projection: domain.ScopeProjection): error?
            local kinds = checked[projection.plugin] or {}
            if kinds[projection.kind] then return nil end
            local err = scopes.fence(tx, board.board_id, projection, min_seq)
            if err then return err end
            kinds[projection.kind], checked[projection.plugin] = true, kinds
            return nil
        end
    end
    caller.awaiting = function(alias: string): (domain.Condition?, error?)
        if definition_only then return { sql = "1=0", args = {} }, nil end
        return awaiting.condition(tx, board, actor:id(), alias)
    end
    for _, scope in ipairs(request.scopes or {}) do
        local err = plugins.seam(scope.id, board.compiled.plugins, false, "scope")
        if err then return nil, err end
    end
    local admitted, admission_err = scopes.admit(caller, request.scopes)
    if admission_err or not admitted then return nil, admission_err end
    local visible = access_rows.visibility(board, dialect)
    local visibility, verr = visible("i")
    if verr or not visibility then return nil, verr end
    local conditions: { domain.Condition } = { read_rows.life_condition(request.include_trashed) }
    if not unfiltered then conditions[#conditions + 1] = visibility end
    for _, condition in ipairs(additional or {}) do conditions[#conditions + 1] = condition end
    local groups: { string }? = nil
    if request.group_by then groups = { request.group_by } end
    if groups and request.sub_group_by then groups[2] = request.sub_group_by end
    local resolver = definition_only and predicates.targets(board.compiled, nil, {}) or resolve.resolver(tx, board)
    return select.items(caller, tables.of(board.board_id, tables.layout(board.compiled), board.model.relations), dialect,
        { scan = scan or (request.budget and request.budget.rows or 200000), live_only = not request.include_trashed, groups = groups, measures = request.measures, where = request.where, sorts = order or sort,
            after = request.after, count = counted and 10000 or nil, peer_visibility = visible }, access_rows.resolver(board, resolver), admitted,
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

local function read_page(tx: types.Executor, board: domain.Board, plan: types.Plan, allowance: types.ReadAllowance,
    order: { domain.Sort }, request: types.QueryRequest, listing: boolean?): (types.QueryPage?, error?)
    local limit = request.limit or 50
    if budget.check(allowance) then return { items = {}, cursors = {}, reindexing = false, incomplete = true }, nil end
    local position, cursor_err = groups.position(board, request)
    if cursor_err then return nil, cursor_err end
    local selected, qerr = select.rows(tx, plan)
    if qerr or not selected then return nil, qerr end
    local rows, stopped = selected.rows, selected.scan_cursor
    local clipped = #rows > plan.take
    local admitted = math.min(#rows, plan.take)
    local scanned = selected.inspected or admitted
    -- The seek budgets group candidates independently of the ordinary, capped item page.
    if not plan.group_seek then allowance.remaining = allowance.remaining - scanned end

    local flat: { domain.Row } = {}
    for i = 1, math.min(admitted, limit) do flat[i] = rows[i] end
    local grouped, gerr = groups.collect(tx, board, request, plan, allowance, order, position, rows, clipped or stopped ~= nil)
    if gerr or not grouped then return nil, gerr end
    scanned = scanned + grouped.scanned
    local ids: { string } = {}
    local included: { [string]: boolean } = {}
    local function include(list: { domain.Row })
        for _, row in ipairs(list) do
            local id = row.item_id :: string
            if not included[id] then
                included[id] = true
                ids[#ids + 1] = id
            end
        end
    end
    include(flat)
    groups.include_rows(grouped, include)
    local by_id: { [string]: types.ItemView } = {}
    local include_gate, include_awaiting = includes(request.include, "gate"), includes(request.include, "awaiting")
    -- Group pages can select more than one ordinary page of documents.
    for first = 1, #ids, 200 do
        local batch: { string } = {}
        for i = first, math.min(first + 199, #ids) do batch[#batch + 1] = ids[i] end
        local loaded, lerr = store.items(tx, board.board_id, batch)
        if lerr or not loaded then return nil, lerr end
        for _, item in ipairs(loaded) do
            local view, verr = item_view.render(tx, board, item, include_gate, include_awaiting)
            if verr or not view then return nil, verr end
            by_id[item.item_id] = view
        end
        if #loaded ~= #batch then
            return nil, errors.new({ details = { code = "internal" }, kind = errors.INTERNAL, message = "query index names a missing item" })
        end
        if listing ~= nil then
            local listed, err = transitions.list(tx, board, loaded, board.dialect :: string, listing)
            if err then return nil, err end
            for _, item in ipairs(loaded) do by_id[item.item_id].transitions = listed[item.item_id] end
        end
    end
    local function views(list: { domain.Row }): { types.ItemView }
        local result: { types.ItemView } = {}
        for i, row in ipairs(list) do result[i] = by_id[row.item_id :: string] end
        return result
    end
    local rendered = groups.render(grouped, board, request, plan, order, views)
    local cursors: { domain.Cursor } = {}
    for i, row in ipairs(flat) do cursors[i] = window.cursor(row, order) end
    local following = rows[#flat + 1] and window.cursor(rows[#flat + 1], order)
    local after = following and cursors[#flat] or stopped
    return { items = views(flat), groups = rendered, group_after = grouped.after, cursors = cursors, after = after, following = following,
        reindexing = false, scanned = scanned, group_limited = grouped.limited or nil,
        incomplete = grouped.limited or (stopped ~= nil and not following) or (clipped and plan.take < limit) }, nil
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
    local page, read_err = select.rows(tx, plan)
    if read_err or not page then return nil, read_err end
    local selected: { [string]: boolean } = {}
    for _, row in ipairs(page.rows) do
        local id, decode_err = store.need(row, "item_id")
        if decode_err then return nil, decode_err end
        selected[id :: string] = true
    end
    return selected, nil
end

function M.page(request: types.QueryRequest, context: types.ReadContext?, check: types.PageCheck?, reference: types.ReferenceOrder?): (types.QueryPage?, error?)
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
    local grants, gerr = scope_grants(request)
    if gerr or not grants then return nil, gerr end
    local order, serr = M.order(request.order)
    if serr or not order then return nil, serr end
    local nulls = reference_page.nulls(reference)
    local sort = nulls and {} or order
    local catalog: { [string]: domain.Field } = {}
    local result, read_err = with_query_snapshot(request, grants, function(tx: types.Executor, board: domain.Board, dialect: string, search_ids: domain.SearchResults?): (types.QueryPage?, error?)
        if budget.expired(allowance) then return { items = {}, cursors = {}, reindexing = false, incomplete = true }, nil end
        catalog = peers.catalog(board)
        if check then
            local cerr = check(board)
            if cerr then return nil, cerr end
        end
        local extra: { domain.Condition }? = nil
        if reference then
            local ref_err: error?
            extra, ref_err = reference_page.conditions(board, request, order, reference)
            if ref_err then return nil, ref_err end
        end
        local plan, err = compile(tx, dialect, board, request, false, grants, extra, scan, sort, nil, search_ids)
        if err or not plan then return nil, err end
        local rebuilding, perr = pending(tx, board, request, false)
        if perr then return nil, perr end
        if rebuilding then return { items = {}, cursors = {}, reindexing = true }, nil end
        return read_page(tx, board, plan, allowance, sort, request, listing)
    end, shared)
    if read_err or not result then return nil, read_err end
    local err = peers.page(result, peers.redactor(catalog))
    if err then return nil, err end
    if reference and result.scanned ~= nil then
        local err = reference_page.filter(result, request.board_id, order[1].field, nulls, reference.admission)
        if err then return nil, err end
    end
    if budget.check(allowance) then
        result.incomplete, result.groups, result.group_after = true, nil, nil
    end
    return result :: types.QueryPage, nil
end

local function restricted(): error
    return errors.new({ kind = errors.PERMISSION_DENIED, message = "Selection is unavailable under the caller's access.",
        details = { code = "selection_restricted" } })
end

-- An edit can affect a subset of a scope, while visibility must cover the whole
-- scope. Both filters use the ordinary indexed query compiler in one snapshot.
function M.select_for_edit(request: types.QueryRequest, scope: domain.Where, field_code: string): (types.EditSelection?, error?)
    local err = validate(request, false)
    if err then return nil, err end
    local mask = (component.ACCESS.READ :: integer) | (component.ACCESS.WRITE :: integer)
    return access.with_snapshot(request.board_id, request.min_seq, function(tx: types.Executor, board: domain.Board, dialect: string): (types.EditSelection?, error?)
        local field = board.model.fields[field_code]
        if not field or not rules.field(board, field, "read") then return nil, restricted() end
        local rebuilding, rerr = pending(tx, board, request, false)
        if rerr then return nil, rerr end
        if rebuilding then
            return nil, errors.new({ kind = errors.UNAVAILABLE, retryable = true, message = "Selection awaits its indexes.",
                details = { code = "projection_pending" } })
        end
        local visibility = board.compiled.visibility
        if visibility and not (visibility.bypass == "admin" and board.caller and board.caller.admin) then
            local all: types.QueryRequest = { board_id = board.board_id, where = scope }
            local raw, raw_err = compile(tx, dialect, board, all, true, nil, nil, nil, nil, nil, nil, true)
            if raw_err or not raw or not raw.count then return nil, raw_err end
            local total, total_err = select.total(tx, raw.count)
            if total_err or not total then return nil, total_err end
            if total.estimated then return nil, restricted() end
            local visible, visible_err = compile(tx, dialect, board, all, true)
            if visible_err or not visible or not visible.count then return nil, visible_err end
            local admitted, count_err = select.total(tx, visible.count)
            if count_err or not admitted then return nil, count_err end
            if total.total ~= admitted.total then return nil, restricted() end
        end
        local plan, plan_err = compile(tx, dialect, board, request, false)
        if plan_err or not plan then return nil, plan_err end
        local page, rows_err = select.rows(tx, plan)
        if rows_err or not page then return nil, rows_err end
        if page.scan_cursor then return nil, restricted() end
        local rows = page.rows
        if #rows > plan.take then return { members = {}, over_limit = true }, nil end
        local ids: { string } = {}
        for _, row in ipairs(rows) do ids[#ids + 1] = row.item_id :: string end
        local items, items_err = store.items(tx, board.board_id, ids)
        if items_err or not items then return nil, items_err end
        if #items ~= #ids then
            return nil, errors.new({ kind = errors.INTERNAL, message = "Selection index names a missing item.", details = { code = "row_corrupt" } })
        end
        local by_id: { [string]: integer } = {}
        for _, item in ipairs(items) do
            if not rules.field(board, field, "write", item.document) then return nil, restricted() end
            by_id[item.item_id] = item.version
        end
        local members: { types.EditMember } = table.create(0, 1)
        for _, id in ipairs(ids) do members[#members + 1] = { item_id = id, version = by_id[id] } end
        return { members = members }, nil
    end, nil, request.budget, request.where, mask)
end

function M.freeze(request: types.QueryRequest): ({ string }?, error?)
    local err = validate(request, true)
    if err then return nil, err end
    local grants, gerr = scope_grants(request)
    if gerr or not grants then return nil, gerr end
    local frozen, ferr = with_query_snapshot(request, grants, function(tx: types.Executor, board: domain.Board, dialect: string, search_ids: domain.SearchResults?): ({ ids: { string }, as_of: integer?, generation: integer? }?, error?)
        local rebuilding, perr = pending(tx, board, request, true)
        if perr then return nil, perr end
        if rebuilding then return nil, errors.new({ kind = errors.UNAVAILABLE, message = "bulk selection awaits indexes", details = { code = "projection_pending" } }) end
        request.limit = BULK_SCAN_LIMIT
        local plan, cerr = compile(tx, dialect, board, request, false, grants, nil, BULK_SCAN_LIMIT, {}, nil, search_ids)
        if cerr or not plan then return nil, cerr end
        local page, rerr = select.rows(tx, plan)
        if rerr or not page then return nil, rerr end
        if page.scan_cursor or #page.rows > BULK_SCAN_LIMIT then
            return nil, errors.new({ kind = errors.INVALID, message = "bulk selection exceeds its scan budget", details = { code = "bulk_selection_limit" } })
        end
        local ids: { string } = {}
        for _, row in ipairs(page.rows) do
            local id, derr = store.need(row, "item_id")
            if derr then return nil, derr end
            ids[#ids + 1] = id :: string
        end
        table.sort(ids)
        return { ids = ids }, nil
    end, nil)
    if ferr or not frozen then return nil, ferr end
    return frozen.ids, nil
end

function M.query(request: types.QueryRequest): (types.QueryResult?, error?)
    local page, err = M.page(request)
    if err or not page then return nil, err end
    return { incomplete = page.incomplete, group_limited = page.group_limited, items = page.items, groups = page.groups, group_after = page.group_after,
        after = page.after, reindexing = page.reindexing, as_of = page.as_of, generation = page.generation }, nil
end

function M.count(request: types.QueryRequest): (types.CountResult?, error?)
    local verr = validate(request, true)
    if verr then return nil, verr end
    local allowance, allowance_err = budget.start(request.budget)
    if allowance_err or not allowance then return nil, allowance_err end
    local grants, gerr = scope_grants(request)
    if gerr or not grants then return nil, gerr end
    return with_query_snapshot(request, grants, function(tx: types.Executor, board: domain.Board, dialect: string, search_ids: domain.SearchResults?): (types.CountResult?, error?)
        if budget.expired(allowance) then return { total = 0, estimated = true, incomplete = true, reindexing = false }, nil end
        local plan, err = compile(tx, dialect, board, request, true, grants, nil, nil, nil, nil, search_ids)
        if err or not plan or not plan.count then return nil, err end
        local rebuilding, perr = pending(tx, board, request, true)
        if perr then return nil, perr end
        if rebuilding then return { reindexing = true }, nil end
        local count, cerr = select.total(tx, plan.count)
        if cerr or not count then return nil, cerr end
        local incomplete = count.estimated or budget.expired(allowance)
        return { total = count.total, estimated = incomplete, incomplete = incomplete, reindexing = false }, nil
    end, { allowance = allowance, partial = true, admitted = {}, holders = {} })
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
    local result, rerr = with_query_snapshot(request, grants, function(tx: types.Executor, board: domain.Board, dialect: string, search_ids: domain.SearchResults?): (types.ExplainResult?, error?)
        local plan, err = compile(tx, dialect, board, request, false, grants, nil, nil, nil, nil, search_ids)
        if err or not plan then return nil, err end
        local statement, args = "", {} :: { unknown }
        if plan.group_seek then
            local grouped_statement, grouped_args, err = groups.statement(plan.group_seek, board, request, allowance)
            if err or not grouped_statement or not grouped_args then return nil, err end
            statement, args = grouped_statement, grouped_args
        else
            statement, args = select.statement(plan, dialect)
        end
        local indexes, ierr = planner.indexes(tx, dialect, statement, args)
        if ierr or not indexes then return nil, ierr end
        local admitted: { string } = {}
        for _, scope in ipairs(request.scopes or {}) do admitted[#admitted + 1] = scope.id end
        return { access = access_grants, plan = { statement = statement, args = args, indexes = indexes }, scopes = admitted, visibility = { life = not request.include_trashed } }, nil
    end, { allowance = allowance, admitted = {}, holders = {} })
    if rerr or not result then return nil, rerr end
    local usage, uerr = budget.usage(allowance)
    if uerr or not usage then return nil, uerr end
    result.budget = usage
    return result :: types.ExplainResult, nil
end

-- Check a query without reading its candidates or resolving operands against items.
function M.validate_admitted(db: types.Executor, board: domain.Board, dialect: string, request: types.QueryRequest): error?
    local verr = validate(request, false)
    if verr then return verr end
    local grants, gerr = scope_grants(request)
    if gerr or not grants then return gerr end
    local _, err = compile(db, dialect, board, request, false, grants, nil, nil, nil, true)
    return err
end

-- Check a saved query against the next schema before its tables and rows exist.
function M.validate_definition(request: types.QueryRequest, compiled: domain.Compiled, model: domain.Model): error?
    local board = { board_id = request.board_id, key_prefix = compiled.key_prefix, compiled = compiled, model = model,
        memberships = {} } :: domain.Board
    local aerr = principals.resolve(board)
    if aerr then return aerr end
    local db, derr = store.open()
    if derr or not db then return derr end
    board.dialect = db:type()
    local err = M.validate_admitted(db, board, db:type(), request)
    db:release()
    return err
end

return M
