-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local sql = require("sql")
local contract = require("contract")
local registry = require("registry")
local types = require("types")
local snapshot = require("snapshot")
local windows = require("windows")
local items = require("items")
local access = require("access")
local store = require("store")
local plugin_rows = require("plugin_rows")
local work = require("work")
local M = {}

local SCAN = 4096
local PAGE = 50
local WEEK_PROBES = 128
local PLANNING = "kickside.work.planning:plugin"
local CAPABILITY = "kickside.work.planning:sprint_reference"
type Sprint = { as_of: integer, items: { string }, unit: string, points_field: string? }

type Filter = { column: string, value: string? }
type Selection = { parts: { string }, args: { unknown }, residual: { string }, residual_args: { unknown } }

local function select_rows(ctx: types.Context, range: types.Window, filters: { Filter }): Selection
    local selection: Selection = {
        parts = { "attachment_id = ?", "work_date >= ?", "work_date <= ?" },
        args = { ctx.admission.attachment_id, range.from, range.to },
        residual = {}, residual_args = {},
    }
    -- One equality can lead the date index; check the other selectors inside
    -- the bounded window, with the same admission as Work item visibility.
    local leading = true
    for _, filter in ipairs(filters) do
        if filter.value then
            if leading then
                selection.parts[#selection.parts + 1] = filter.column .. " = ?"
                selection.args[#selection.args + 1] = filter.value
                leading = false
            else
                selection.residual[#selection.residual + 1] = " AND c." .. filter.column .. " = ?"
                selection.residual_args[#selection.residual_args + 1] = filter.value
            end
        end
    end
    return selection
end

local function joined(tx: sql.Transaction, ctx: types.Context, source: string, columns: string, selection: Selection,
    order: string, count: integer): ({ types.Row }?, error?)
    local args = selection.args
    args[#args + 1] = count
    snapshot.args(args, ctx.visibility.args)
    snapshot.args(args, selection.residual_args)
    return snapshot.query(tx, "WITH candidates AS (SELECT " .. columns .. " FROM " .. source .. " WHERE "
        .. table.concat(selection.parts, " AND ") .. " ORDER BY " .. order .. [[ LIMIT ?)
        SELECT c.*, CASE WHEN i.item_id IS NOT NULL THEN 1 ELSE 0 END AS visible
        FROM candidates c LEFT JOIN ]] .. ctx.names.item .. " i ON i.item_id = c.item_id AND i.life = 'live' AND ("
        .. ctx.visibility.sql .. ")" .. table.concat(selection.residual) .. " ORDER BY c." .. order:gsub(", ", ", c."), args)
end

local function admit_item(tx: sql.Transaction, ctx: types.Context, item: string?): error?
    if not item then return nil end
    local _, err = access.live_item(tx, ctx.board, item)
    return err
end

function M.list(request: types.Request): (types.Listing?, error?)
    local range, range_err = windows.resolve(request)
    if range_err or not range then return nil, range_err end
    return snapshot.run(request.board_id, function(tx: sql.Transaction, ctx: types.Context): (types.Listing?, error?)
        local denied = admit_item(tx, ctx, request.item)
        if denied then return nil, denied end
        local person, person_err = access.person_filter(ctx.admission, ctx.settings, request.person)
        if person_err then return nil, person_err end
        local matches = snapshot.matches(ctx, request, "list")
        local after, after_err = snapshot.open(request.cursor, matches)
        if after_err or not after then return nil, after_err end
        local selection = select_rows(ctx, range, {
            { column = "item_id", value = request.item }, { column = "person_id", value = person },
        })
        local newest = request.sort == "newest"
        if request.cursor then
            selection.parts[#selection.parts + 1] = newest and "(work_date, entry_id) < (?, ?)" or "(work_date, entry_id) > (?, ?)"
            selection.args[#selection.args + 1], selection.args[#selection.args + 2] = after.work_date, after.id
        end
        local limit = request.limit or PAGE
        local order = newest and "work_date DESC, entry_id DESC" or "work_date, entry_id"
        local rows, err = joined(tx, ctx, "kickside_work_time_worklog",
            "work_date, entry_id, item_id, person_id, sprint_id, minutes, version, note",
            selection, order, limit + 1)
        if err or not rows then return nil, err end

        local entries: { types.Worklog } = {}
        local scanned = math.min(limit, #rows)
        for idx = 1, scanned do
            local row = rows[idx]
            if tonumber(row.visible) == 1 then
                local author = row.person_id :: string
                entries[#entries + 1] = {
                    id = row.entry_id :: string, item = row.item_id :: string, person = author,
                    work_date = row.work_date :: string, sprint = row.sprint_id :: string?, note = row.note :: string?,
                    minutes = tonumber(row.minutes) :: integer, version = tonumber(row.version) :: integer,
                    can_edit = access.can_edit(ctx.admission, author),
                }
            end
        end
        local cursor: string?
        if scanned < #rows then
            local position = rows[scanned]
            local cursor_err
            cursor, cursor_err = snapshot.seal({ work_date = position.work_date, id = position.entry_id }, matches)
            if cursor_err then return nil, cursor_err end
        end
        return { entries = entries, cursor = cursor }, nil
    end)
end

local function daily(tx: sql.Transaction, ctx: types.Context, request: types.Request, range: types.Window, person: string?,
    count: integer): ({ types.Row }?, error?)
    local selection = select_rows(ctx, range, {
        { column = "person_id", value = person }, { column = "sprint_id", value = request.sprint },
        { column = "item_id", value = request.item },
    })
    return joined(tx, ctx, "kickside_work_time_daily", "work_date, item_id, person_id, sprint_id, minutes, entry_count",
        selection, "work_date, item_id, person_id, sprint_id", count)
end

local function add(group: types.Group, row: types.Row): error?
    local minutes, err = items.add(group.minutes, tonumber(row.minutes) :: integer)
    if err or not minutes then return err end
    local count, count_err = items.add(group.entry_count, tonumber(row.entry_count) :: integer)
    if count_err or not count then return count_err end
    group.minutes, group.entry_count = minutes, count
    return nil
end

local function overflow(): error
    return snapshot.limit("Time report exceeds its read budget. Select a narrower date range or one person.")
end

local function next_person(tx: sql.Transaction, ctx: types.Context, after: string): (string?, error?)
    local rows, err = snapshot.query(tx, [[SELECT person_id FROM kickside_work_time_daily
        WHERE attachment_id = ? AND person_id > ? ORDER BY person_id LIMIT 1]], { ctx.admission.attachment_id, after })
    return rows and rows[1] and rows[1].person_id :: string?, err
end

local function next_date(tx: sql.Transaction, ctx: types.Context, person: string, first: string, last: string): (string?, error?)
    local rows, err = snapshot.query(tx, [[SELECT work_date FROM kickside_work_time_daily
        WHERE attachment_id = ? AND person_id = ? AND work_date >= ? AND work_date <= ? ORDER BY work_date LIMIT 1]],
        { ctx.admission.attachment_id, person, first, last })
    return rows and rows[1] and rows[1].work_date :: string?, err
end

local function week_report(tx: sql.Transaction, ctx: types.Context, request: types.Request, range: types.Window, only_person: string?): (types.Report?, error?)
    local matches = snapshot.matches(ctx, request, "report")
    local after, after_err = snapshot.open(request.cursor, matches)
    if after_err or not after then return nil, after_err end
    local report: types.Report = { coverage = "complete", groups = {} }
    local groups = report.groups :: { types.Group }
    local first = (after.day :: string?) or range.from
    local person = (after.person :: string?) or only_person
    if not person then
        person, after_err = next_person(tx, ctx, "")
        if after_err then return nil, after_err end
    end
    local remaining = SCAN
    local limit = request.limit or PAGE
    for _ = 1, WEEK_PROBES do
        if not person then return report, nil end
        local day, err = next_date(tx, ctx, person, first, range.to)
        if err then return nil, err end
        if not day then
            if only_person then return report, nil end
            person, err = next_person(tx, ctx, person)
            if err then return nil, err end
            first = range.from
        else
            first = day
            if #groups == limit or remaining == 0 then break end
            local week = windows.monday(day)
            local last = windows.shift(week, 6)
            local rows, read_err = daily(tx, ctx, request, {
                from = day, to = range.to < last and range.to or last,
            }, person, remaining + 1)
            if read_err or not rows then return nil, read_err end
            if #rows > remaining then
                if remaining == SCAN then return nil, overflow() end
                break
            end
            remaining = remaining - #rows
            local group: types.Group = {
                board_id = ctx.board.board_id, person = person, week = week, sprint = request.sprint, entry_count = 0, minutes = 0,
            }
            for _, row in ipairs(rows) do
                if tonumber(row.visible) == 1 then
                    local sum_err = add(group, row)
                    if sum_err then return nil, sum_err end
                end
            end
            if group.entry_count > 0 then groups[#groups + 1] = group end
            first = windows.shift(last, 1)
        end
    end
    if person then
        local cursor, cursor_err = snapshot.seal({ person = person, day = first }, matches)
        if cursor_err then return nil, cursor_err end
        report.cursor = cursor
    end
    return report, nil
end

local function admit_sprint(tx: sql.Transaction, ctx: types.Context, sprint: string): error?
    local planning, err = plugin_rows.active(tx, ctx.board.board_id, PLANNING)
    if err then return err end
    if not planning then return snapshot.invalid("An active Planning attachment is required for a sprint report") end
    return admit_item(tx, ctx, sprint)
end

-- Planning owns membership and capacity units. Release Time's first snapshot
-- before querying Planning and verify the Work sequence when combining results.
local function sprint_context(request: types.Request): (Sprint?, error?)
    local compare, err = snapshot.run(request.board_id, function(tx: sql.Transaction, ctx: types.Context): (boolean?, error?)
        local denied = admit_sprint(tx, ctx, request.sprint :: string)
        if denied then return nil, denied end
        local person, person_err = access.person_filter(ctx.admission, ctx.settings, request.person)
        if person_err then return nil, person_err end
        return person == nil, nil
    end)
    if err or not compare then return nil, err end
    local entry, entry_err = registry.get(CAPABILITY)
    if entry_err and not errors.is(entry_err, errors.NOT_FOUND) then return nil, entry_err end
    if not entry then return nil, access.problem(errors.UNAVAILABLE, "planning_report_unavailable", "Planning sprint reports are unavailable") end
    local definition, definition_err = contract.get(CAPABILITY)
    if definition_err or not definition then return nil, definition_err end
    local client, open_err = definition:open("kickside.work.planning:sprint_reference_binding")
    if open_err or not client then return nil, open_err end
    local report, report_err = client:report({ board_id = request.board_id, sprint_id = request.sprint, limit = SCAN })
    if report_err then return nil, report_err end
    if report.coverage ~= "complete" or #report.items > SCAN then return nil, overflow() end
    return report :: Sprint, nil
end

local function compare(tx: sql.Transaction, ctx: types.Context, sprint: Sprint, attributed: { [string]: boolean },
    group: types.Group): error?
    -- Every position from snapshot_seq through applied_seq has the same Work content.
    if sprint.as_of < ctx.board.snapshot_seq or sprint.as_of > ctx.board.applied_seq then
        return errors.new({ kind = errors.UNAVAILABLE, retryable = true, message = "Sprint membership changed during the report",
            details = { code = "planning_snapshot_changed" } })
    end
    for _, id in ipairs(sprint.items) do attributed[id] = true end
    local ids: { string } = {}
    for id in pairs(attributed) do ids[#ids + 1] = id end
    local original, points = 0, 0
    local has_original = false
    -- Bounded batches leave enough SQL parameters for the Work visibility predicate.
    for start = 1, #ids, 200 do
        local batch: { string } = {}
        for index = start, math.min(#ids, start + 199) do batch[#batch + 1] = ids[index] end
        local visible, visible_err = items.visible(tx, ctx, batch)
        if visible_err or not visible then return visible_err end
        local point_ids: { string } = {}
        for _, item in ipairs(visible) do
            if sprint.unit ~= "points" and item.original_minutes then
                local total, sum_err = items.add(original, item.original_minutes)
                if sum_err or not total then return sum_err end
                original, has_original = total, true
            end
            point_ids[#point_ids + 1] = item.item
        end
        if sprint.unit == "points" and sprint.points_field and #point_ids > 0 then
            local records, err = store.items(tx, ctx.board.board_id, point_ids)
            if err or not records then return err end
            for _, item in ipairs(records :: { work.Item }) do
                points = points + (items.estimate(ctx.board, item, sprint.points_field) or 0)
            end
        end
    end
    if sprint.unit == "points" then group.points = points
    elseif has_original then group.original_minutes = original end
    return nil
end

function M.totals(request: types.Request): (types.Report?, error?)
    if request.item and not (request.from or request.to or request.person or request.sprint or request.group_by) then
        return snapshot.run(request.board_id, function(tx: sql.Transaction, ctx: types.Context)
            return items.subtree(tx, ctx, request)
        end)
    end
    local range, range_err = windows.resolve(request)
    if range_err or not range then return nil, range_err end
    if request.group_by == "sprint" and not request.sprint then
        return nil, snapshot.invalid("Select a sprint for a sprint report")
    end
    if request.cursor and request.group_by ~= "person_week" then
        return nil, snapshot.invalid("Only a person-by-week report takes a report cursor")
    end

    local sprint: Sprint?
    if request.sprint and not request.person and not request.item and request.group_by ~= "person_week" then
        local err
        sprint, err = sprint_context(request)
        if err then return nil, err end
    end
    return snapshot.run(request.board_id, function(tx: sql.Transaction, ctx: types.Context): (types.Report?, error?)
        local denied = admit_item(tx, ctx, request.item)
        if denied then return nil, denied end
        if request.sprint then
            local sprint_err = admit_sprint(tx, ctx, request.sprint)
            if sprint_err then return nil, sprint_err end
        end
        local person, person_err = access.person_filter(ctx.admission, ctx.settings, request.person)
        if person_err then return nil, person_err end
        if request.group_by == "person_week" then return week_report(tx, ctx, request, range, person) end

        local rows, err = daily(tx, ctx, request, range, person, SCAN + 1)
        if err or not rows then return nil, err end
        if #rows > SCAN then return nil, overflow() end
        local group: types.Group = { board_id = request.board_id, sprint = request.sprint, person = person, entry_count = 0, minutes = 0 }
        local attributed: { [string]: boolean } = {}
        for _, row in ipairs(rows) do
            if tonumber(row.visible) == 1 then
                local sum_err = add(group, row)
                if sum_err then return nil, sum_err end
                attributed[row.item_id :: string] = true
            end
        end
        if sprint and not person then
            local compare_err = compare(tx, ctx, sprint, attributed, group)
            if compare_err then return nil, compare_err end
        end
        return { coverage = "complete", groups = { group } }, nil
    end)
end

return M
