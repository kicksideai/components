-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local security = require("security")
local json = require("json")
local access = require("access")
local budget = require("budget")
local cursor_codec = require("cursor_codec")
local rollup = require("rollup")
local values = require("values")
local window = require("window")
local domain = require("domain")
local types = require("types")

local M = {}
local GROUP_CURSOR_LIMIT = 8192
local GROUP_BATCH = 256

function M.validate(request: types.QueryRequest): error?
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
    return nil
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

function M.position(board: domain.Board, request: types.QueryRequest): (types.GroupPosition?, error?)
    if not request.group_after then return nil, nil end
    local raw, err = cursor_codec.open(request.group_after, group_context(board, request), GROUP_CURSOR_LIMIT)
    if err or not raw then return nil, err end
    local decoded, decode_err = json.decode(raw)
    return decoded :: types.GroupPosition?, decode_err
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

local function seek_groups(tx: types.Executor, seek: types.GroupSeek, allowance: types.ReadAllowance,
    position: types.GroupPosition?, order: { domain.Sort }, limit: integer): ({ domain.Row }?, boolean?, error?)
    local rows: { domain.Row } = {}
    if position and position.parent == nil then return rows, false, nil end
    local current: types.GroupKey? = nil
    local groups = 0
    local function walk(nulls: boolean): (boolean, error?)
        local key = not nulls and position and position.parent or nil
        local id: string? = nil
        while true do
            local deadline_err = budget.check(allowance)
            if deadline_err then return false, deadline_err end
            local take = math.min(GROUP_BATCH, allowance.remaining)
            local statement, args = seek(nulls, key, id, take + 1)
            local batch, err = tx:query(statement, args)
            if err or not batch then return false, err end
            allowance.remaining = allowance.remaining - math.min(#batch, take)
            for index, row in ipairs(batch) do
                local value = row.group_1 :: types.GroupKey?
                if row.group_match == 1 and groups == limit and value ~= current then return true, nil end
                if index > take then
                    if allowance.remaining > 0 then break end
                    if groups < limit or value == current then rows = {} end
                    return true, nil
                end
                if row.group_match == 1 then
                    if groups == 0 or value ~= current then
                        current, groups = value, groups + 1
                    end
                    rows[#rows + 1] = row
                end
                key, id = value, row.item_id :: string
            end
            if #batch <= take then return false, nil end
        end
    end
    local more, err = walk(false)
    if not err and not more then more, err = walk(true) end
    if err then return nil, nil, err end
    -- Each group is now complete, so order only its admitted rows for item detail.
    table.sort(rows, function(a: domain.Row, b: domain.Row): boolean
        for i, sort in ipairs(order) do
            local column = i == 1 and "sort_value" or "sort_value_" .. i
            local x, y = a[column] :: types.GroupKey?, b[column] :: types.GroupKey?
            if x ~= y then
                if x == nil then return false end
                if y == nil then return true end
                if sort.dir == "desc" then return x > y end
                return x < y
            end
        end
        return (a.item_id :: string) < (b.item_id :: string)
    end)
    return rows, more, nil
end

function M.statement(seek: types.GroupSeek, board: domain.Board, request: types.QueryRequest, allowance: types.ReadAllowance): (string?, { unknown }?, error?)
    local position, err = M.position(board, request)
    if err then return nil, nil, err end
    local statement, args = seek(false, position and position.parent, nil, math.min(GROUP_BATCH, allowance.remaining) + 1)
    return statement, args, nil
end

function M.collect(tx: types.Executor, board: domain.Board, request: types.QueryRequest, plan: types.Plan,
    allowance: types.ReadAllowance, order: { domain.Sort }, position: types.GroupPosition?,
    rows: { domain.Row }, limited: boolean): (types.GroupPage?, error?)
    local limit = request.limit or 50
    local scanned = 0
    local buckets: { types.GroupBucket }? = nil
    local group_after: string? = nil
    local group_limited = false
    local edge: types.GroupPosition? = nil
    if plan.group_seek then
        local before = allowance.remaining
        local group_limit = request.group_limit or 200
        local selected, more, err = seek_groups(tx, plan.group_seek, allowance, position, order, group_limit)
        if err or not selected then return nil, err end
        scanned = scanned + before - allowance.remaining
        if more and #selected == 0 then group_limited = true
        else
            local page = group_rows(selected, plan, limit, group_limit, nil)
            buckets = page
            if more then edge = { parent = page[#page].key } end
        end
    elseif plan.groups > 0 then
        if limited then group_limited = true
        else buckets, edge = group_rows(rows, plan, limit, request.group_limit or 200, position) end
    end
    if edge then
        local err: error?
        group_after, err = cursor_codec.seal(json.encode(edge), group_context(board, request))
        if err then return nil, err end
    end
    return { buckets = buckets, after = group_after, limited = group_limited, scanned = scanned }, nil
end

function M.include_rows(page: types.GroupPage, include: ({ domain.Row }) -> ())
    for _, bucket in ipairs(page.buckets or {}) do
        include(bucket.rows)
        for _, child in ipairs(bucket.children or {}) do include(child.rows) end
    end
end

function M.render(page: types.GroupPage, board: domain.Board, request: types.QueryRequest, plan: types.Plan,
    order: { domain.Sort }, views: ({ domain.Row }) -> { types.ItemView }): { types.QueryGroup }?
    local buckets = page.buckets
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
    return groups
end

return M
