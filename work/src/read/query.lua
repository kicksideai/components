-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local peers = require("peers")
local cursor_codec = require("cursor_codec")
local json = require("json")
local rollup = require("rollup")
local values = require("values")
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
local GROUP_CURSOR_LIMIT = 8192

local function validate(request: types.QueryRequest, counted: boolean): error?
    local allowed = counted and COUNT_KEYS or QUERY_KEYS
    for key in pairs(request) do
        if not allowed[key] then return access.invalid("unsupported query option " .. tostring(key)) end
    end
    if request.group_by and request.after then return access.invalid("group detail cursors are used with a query filtered to that group") end
    if not request.group_by and (request.sub_group_by or request.group_after or request.group_limit or request.measures) then
        return access.invalid("sub_group_by, group_after, group_limit and measures require group_by")
    end
    local group_after, group_limit = request.group_after, request.group_limit
    if group_after ~= nil and (type(group_after) ~= "string" or #group_after == 0 or #group_after > GROUP_CURSOR_LIMIT) then
        return access.invalid("group_after is a group continuation from a previous page")
    end
    if group_limit ~= nil and (type(group_limit) ~= "number" or math.tointeger(group_limit) == nil or group_limit < 1 or group_limit > 200) then
        return access.invalid("group_limit must be 1..200")
    end
    if request.measures ~= nil then
        if type(request.measures) ~= "table" or #request.measures < 1 or #request.measures > 4 then
            return access.invalid("measures takes one to four sums")
        end
        local ids: { [string]: boolean } = {}
        for _, measure in ipairs(request.measures) do
            if type(measure) ~= "table" or type(measure.id) ~= "string" or measure.id == "" or
                measure.op ~= "sum" or type(measure.field) ~= "string" or measure.field == "" or ids[measure.id] then
                return access.invalid("each sum needs a unique id and a field")
            end
            ids[measure.id] = true
        end
    end
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
    return select.items(caller, tables.of(board.board_id, tables.layout(board.compiled), board.model.relations), dialect,
        { scan = scan or (request.budget and request.budget.rows or 200000), groups = groups, measures = request.measures, where = request.where, sorts = order or sort,
            after = request.after, count = counted and 10000 or nil, peer_visibility = visible }, access_rows.resolver(board, resolve.resolver(tx, board)), admitted,
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

local function group_less(left: types.GroupKey?, right: types.GroupKey?): boolean
    return left ~= nil and (right == nil or left < right)
end

local function group_context(board: domain.Board, request: types.QueryRequest): string
    local actor = security.actor()
    return "kickside.work.groups.v1\0" .. values.canonical({
        board = board.board_id, actor = actor and actor:id(), generation = board.generation,
        group_by = request.group_by, sub_group_by = request.sub_group_by, where = request.where,
        scopes = request.scopes, include_trashed = request.include_trashed == true,
    })
end

local function add_group(groups: { types.GroupBucket }, by_key: { [domain.ColumnValue]: types.GroupBucket },
    key: types.GroupKey?, row: domain.Row, limit: integer, measures: { types.MeasureColumn }?): types.GroupBucket
    local identity = key or false
    local group: types.GroupBucket? = by_key[identity]
    if not group then
        local created: types.GroupBucket = { key = key, count = 0, rows = {}, totals = measures and {} or nil }
        by_key[identity] = created
        groups[#groups + 1] = created
        group = created
    end
    local held = group :: types.GroupBucket
    held.count = held.count + 1
    if #held.rows < limit then held.rows[#held.rows + 1] = row end
    local totals = held.totals
    if totals then
        for i, measure in ipairs(measures or {}) do
            local value = row["measure_" .. i] :: string?
            if value ~= nil then
                if measure.decimal_key then
                    local sign, whole, fraction = value:match("^([%-]?)(%d+)%.?(%d*)$")
                    local magnitude = (whole .. fraction .. string.rep("0", measure.scale - #fraction)):gsub("^0+", "")
                    value = magnitude == "" and "0" or sign .. magnitude
                end
                totals[i] = rollup.add(totals[i] or "0", value)
            end
        end
    end
    return held
end

local function group_rows(rows: { domain.Row }, plan: types.Plan, limit: integer, group_limit: integer,
    after: types.GroupPosition?): ({ types.GroupBucket }, types.GroupPosition?)
    local parents: { types.GroupBucket } = {}
    local by_key: { [domain.ColumnValue]: types.GroupBucket } = {}
    local children: { [types.GroupBucket]: { [domain.ColumnValue]: types.GroupBucket } } = {}
    for _, row in ipairs(rows) do
        local key, child = row.group_1 :: types.GroupKey?, row.group_2 :: types.GroupKey?
        if not after or group_less(after.parent, key) or (plan.groups == 2 and after.parent == key) then
            local parent = add_group(parents, by_key, key, row, limit, plan.measures)
            if plan.groups == 2 and (not after or after.parent ~= key or group_less(after.child, child)) then
                local siblings = children[parent]
                if not siblings then
                    siblings = {}
                    children[parent] = siblings
                    parent.children = {}
                end
                add_group(parent.children :: { types.GroupBucket }, siblings, child, row, limit, plan.measures)
            end
        end
    end
    local function less(left: types.GroupBucket, right: types.GroupBucket): boolean
        return group_less(left.key, right.key)
    end
    table.sort(parents, less)
    local page: { types.GroupBucket } = {}
    local remaining, edge = group_limit, nil :: types.GroupPosition?
    for _, parent in ipairs(parents) do
        if plan.groups == 1 then
            if remaining == 0 then return page, edge end
            page[#page + 1] = parent
            remaining, edge = remaining - 1, { parent = parent.key }
        elseif parent.children then
            if remaining == 0 then return page, edge end
            local siblings = parent.children :: { types.GroupBucket }
            table.sort(siblings, less)
            local selected: { types.GroupBucket } = {}
            for i = 1, math.min(remaining, #siblings) do selected[i] = siblings[i] end
            parent.children = selected
            page[#page + 1] = parent
            local last = selected[#selected]
            edge = { parent = parent.key, child = last.key }
            remaining = remaining - #selected
            if #selected < #siblings then return page, edge end
        end
    end
    return page, nil
end

local function read_page(tx: types.Executor, board: domain.Board, plan: types.Plan, allowance: types.ReadAllowance,
    order: { domain.Sort }, request: types.QueryRequest, listing: boolean?): (types.QueryPage?, error?)
    local limit = request.limit or 50
    if budget.check(allowance) then return { items = {}, cursors = {}, reindexing = false, incomplete = true }, nil end
    local position: types.GroupPosition? = nil
    if request.group_after then
        local raw, err = cursor_codec.open(request.group_after, group_context(board, request), GROUP_CURSOR_LIMIT)
        if err or not raw then return nil, err end
        local decoded, decode_err = json.decode(raw)
        if decode_err then return nil, decode_err end
        position = decoded :: types.GroupPosition
    end
    local rows, qerr, inspected, stopped = select.rows(tx, plan)
    if qerr or not rows then return nil, qerr end
    local clipped = #rows > plan.take
    local admitted = math.min(#rows, plan.take)
    local scanned = inspected or admitted
    allowance.remaining = allowance.remaining - scanned

    local flat: { domain.Row } = {}
    for i = 1, math.min(admitted, limit) do flat[i] = rows[i] end
    local buckets: { types.GroupBucket }? = nil
    local group_after: string? = nil
    if plan.groups > 0 and not clipped and not stopped then
        local edge: types.GroupPosition?
        buckets, edge = group_rows(rows, plan, limit, request.group_limit or 200, position)
        if edge then
            local err: error?
            group_after, err = cursor_codec.seal(json.encode(edge), group_context(board, request))
            if err then return nil, err end
        end
    end
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
    for _, bucket in ipairs(buckets or {}) do
        include(bucket.rows)
        for _, child in ipairs(bucket.children or {}) do include(child.rows) end
    end
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
    local function detail(bucket: types.GroupBucket, field: string): types.QueryGroup
        local items = views(bucket.rows)
        local value: unknown = bucket.key
        if board.model.fields[field] then value = items[1].values[field] end
        local measures: { [string]: types.MeasureValue }? = nil
        if bucket.totals then
            measures = {}
            for i, measure in ipairs(plan.measures or {}) do
                local total = bucket.totals[i]
                -- Wippy's JSON encoder emits null for non-finite values.
                measures[measure.id] = total and rollup.decimal_text(total, measure.scale) or math.huge
            end
        end
        return { field = field, value = value, count = bucket.count, items = items,
            after = #items < bucket.count and window.cursor(bucket.rows[#items], order) or nil, measures = measures }
    end
    local groups: { types.QueryGroup }? = nil
    if buckets then
        groups = {}
        for _, bucket in ipairs(buckets) do
            local group = detail(bucket, request.group_by :: string)
            if bucket.children then
                local children: { types.QueryGroupRow } = {}
                for _, child in ipairs(bucket.children) do children[#children + 1] = detail(child, request.sub_group_by :: string) end
                group.groups = children
            end
            groups[#groups + 1] = group
        end
    end
    local cursors: { domain.Cursor } = {}
    for i, row in ipairs(flat) do cursors[i] = window.cursor(row, order) end
    local following = rows[#flat + 1] and window.cursor(rows[#flat + 1], order)
    local after = following and cursors[#flat] or stopped
    return { items = views(flat), groups = groups, group_after = group_after, cursors = cursors, after = after, following = following,
        reindexing = false, scanned = scanned, incomplete = (stopped ~= nil and (plan.groups > 0 or not following))
            or (clipped and (plan.groups > 0 or plan.take < limit)) }, nil
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
    local rows, read_err = select.rows(tx, plan)
    if read_err then return nil, read_err end
    local selected: { [string]: boolean } = {}
    for _, row in ipairs(rows or {}) do
        local id, decode_err = store.need(row, "item_id")
        if decode_err then return nil, decode_err end
        selected[id :: string] = true
    end
    return selected, nil
end

-- Reference order has two indexed passes. The first walks stored keys and
-- offers only readable targets. The second walks item IDs and offers the null
-- keys (missing and redacted references), in the same tie order.
local NULL_START = "!"

local function reference_context(board_id: string, admission: string, item_id: string): string
    return "kickside.work.reference.v1\0" .. board_id .. "\0" .. admission .. "\0" .. item_id
end

local function reference_plan(board: domain.Board, request: types.QueryRequest, order: { domain.Sort },
    position: types.ReferenceOrder): ({ domain.Condition }?, error?)
    local held = position.after
    if held and held.phase == "nulls" then
        if held.id ~= NULL_START then request.after = { id = held.id } end
        return {}, nil
    end
    local target, err = predicates.targets(board.compiled)(order[1].field)
    if err or not target then return nil, err end
    if held then
        local key = held.v
        if held.position then
            local open_err: error?
            key, open_err = cursor_codec.open(held.position, reference_context(board.board_id, position.admission, held.id))
            if open_err then return nil, open_err end
        end
        if type(key) ~= "string" then return nil, access.invalid("reference order requires a position") end
        request.after = { id = held.id, v = key }
    end
    return { { sql = "i." .. target.column .. " IS NOT NULL", args = {} } }, nil
end

local function reference_result(page: types.QueryPage, request: types.QueryRequest, field: string, nulls: boolean, admission: string): error?
    local phase = nulls and "nulls" or "keys"
    local items: { types.ItemView } = {}
    local keys: { domain.Cursor } = {}
    for i, item in ipairs(page.items) do
        local value = item.values[field]
        local available = type(value) == "table" and value.unavailable ~= true
        if available ~= nulls then
            local key = page.cursors[i]
            key.phase = phase
            items[#items + 1], keys[#keys + 1] = item, key
        end
    end
    local raw = page.after
    page.after = raw and { id = raw.id, phase = phase } or nil
    if nulls then page.following = page.after
    elseif raw then
        local last = keys[#keys]
        page.following = last
        if last and last.id == raw.id then page.after = last
        else
            local token, err = cursor_codec.seal(raw.v :: string, reference_context(request.board_id, admission, raw.id))
            if err or not token then return err end
            page.after = { id = raw.id, phase = phase, position = token }
        end
    else
        page.after = { id = NULL_START, phase = "nulls" }
        page.following = page.after
    end
    page.items, page.cursors = items, keys
    return nil
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
    local nulls = reference ~= nil and reference.after ~= nil and reference.after.phase == "nulls"
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
            extra, ref_err = reference_plan(board, request, order, reference)
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
        local err = reference_result(result, request, order[1].field, nulls, reference.admission)
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
            local total, capped, total_err = select.total(tx, raw.count)
            if total_err then return nil, total_err end
            if capped then return nil, restricted() end
            local visible, visible_err = compile(tx, dialect, board, all, true)
            if visible_err or not visible or not visible.count then return nil, visible_err end
            local admitted, _, count_err = select.total(tx, visible.count)
            if count_err then return nil, count_err end
            if total ~= admitted then return nil, restricted() end
        end
        local plan, plan_err = compile(tx, dialect, board, request, false)
        if plan_err or not plan then return nil, plan_err end
        local rows, rows_err, _, stopped = select.rows(tx, plan)
        if rows_err or not rows then return nil, rows_err end
        if stopped then return nil, restricted() end
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
        local population, nerr = job_rows.work_population(tx, board.board_id)
        if nerr then return nil, nerr end
        if population and population > 200000 then return nil, errors.new({ kind = errors.INVALID, message = "bulk selection exceeds its scan budget", details = { code = "bulk_selection_limit" } }) end
        request.limit = 200000
        local plan, cerr = compile(tx, dialect, board, request, false, grants, nil, nil, nil, nil, search_ids)
        if cerr or not plan then return nil, cerr end
        local rows, rerr = select.rows(tx, plan)
        if rerr then return nil, rerr end
        local ids: { string } = {}
        for _, row in ipairs(rows or {}) do
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
    return { incomplete = page.incomplete, items = page.items, groups = page.groups, group_after = page.group_after,
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
        local total, estimated, cerr = select.total(tx, plan.count)
        if cerr then return nil, cerr end
        local incomplete = estimated or budget.expired(allowance)
        return { total = total, estimated = incomplete, incomplete = incomplete, reindexing = false }, nil
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
        local statement, args = select.statement(plan, dialect)
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

-- Check a saved query against the next schema before its tables and rows exist.
function M.validate_definition(request: types.QueryRequest, compiled: domain.Compiled, model: domain.Model): error?
    local verr = validate(request, false)
    if verr then return verr end
    local grants, gerr = scope_grants(request)
    if gerr or not grants then return gerr end
    local board = { board_id = request.board_id, key_prefix = compiled.key_prefix, compiled = compiled, model = model,
        memberships = {} } :: domain.Board
    local aerr = principals.resolve(board)
    if aerr then return aerr end
    local db, derr = store.open()
    if derr or not db then return derr end
    board.dialect = db:type()
    local _, err = compile(db, db:type(), board, request, false, grants, nil, nil, nil, true)
    db:release()
    return err
end

return M
