-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local sql = require("sql")
local access = require("access")
local snapshot = require("snapshot")
local store = require("store")
local document = require("document")
local rules = require("rules")
local values = require("values")
local work = require("work")
local types = require("types")
local M = {}

M.ORIGINAL = "time_original_minutes"
M.REMAINING = "time_remaining_minutes"
local SUBTREE_PAGE = 512

function M.estimate(board: work.Board, item: work.Item, code: string): number?
    local field = board.model.fields[code]
    if not field or not rules.field(board, field, "read", item.document) then return nil end
    local value = document.value(item.document, field.id)
    if type(value) == "number" then return value end
    if field.form == "dec" and field.cardinality == "one" and type(value) == "table" then
        return tonumber(values.dec_string(value :: work.Dec))
    end
    return nil
end

local function marks(ids: { string }): { string }
    local params: { string } = {}
    for _ in ipairs(ids) do params[#params + 1] = "?" end
    return params
end

-- The same bounded admission is used for requested cards and sprint estimate members.
function M.visible(tx: sql.Transaction, ctx: types.Context, ids: { string }): ({ types.Summary }?, error?)
    if #ids == 0 then return {}, nil end
    local args: { unknown } = { ctx.admission.attachment_id }
    snapshot.args(args, ids)
    snapshot.args(args, ctx.visibility.args)
    local result, err = snapshot.query(tx, "SELECT i.item_id, t.minutes, t.entry_count FROM " .. ctx.names.item .. [[ i
        LEFT JOIN kickside_work_time_total t ON t.attachment_id = ? AND t.item_id = i.item_id
        WHERE i.item_id IN (]] .. table.concat(marks(ids), ",") .. ") AND i.life = 'live' AND (" .. ctx.visibility.sql .. ")", args)
    if err or not result then return nil, err end
    local visible: { string } = {}
    local by_id: { [string]: types.Row } = {}
    for _, row in ipairs(result) do
        local id = row.item_id :: string
        visible[#visible + 1], by_id[id] = id, row
    end
    if #visible == 0 then return {}, nil end
    local values, value_err = store.items(tx, ctx.board.board_id, visible)
    if value_err or not values then return nil, value_err end
    local summaries: { [string]: types.Summary } = {}
    for _, item in ipairs(values) do
        local totals = by_id[item.item_id]
        local minutes = math.tointeger(tonumber(totals.minutes) or 0) :: integer
        local original = M.estimate(ctx.board, item, M.ORIGINAL)
        summaries[item.item_id] = {
            item = item.item_id, minutes = minutes, entry_count = tonumber(totals.entry_count) or 0,
            original_minutes = original, remaining_minutes = M.estimate(ctx.board, item, M.REMAINING),
            over_estimate = minutes > 0 and original ~= nil and minutes > original,
        }
    end
    local ordered: { types.Summary } = {}
    for _, id in ipairs(ids) do
        local summary = summaries[id]
        if summary then ordered[#ordered + 1], summaries[id] = summary, nil end
    end
    return ordered, nil
end

function M.summary(board_id: string, ids: { string }): ({ items: { types.Summary } }?, error?)
    return snapshot.run(board_id, function(tx: sql.Transaction, ctx: types.Context): ({ items: { types.Summary } }?, error?)
        local distinct: { string } = {}
        local seen: { [string]: boolean } = {}
        for _, id in ipairs(ids) do
            if not seen[id] then distinct[#distinct + 1], seen[id] = id, true end
        end
        local items, err = M.visible(tx, ctx, distinct)
        if err or not items then return nil, err end
        return { items = items }, nil
    end)
end

function M.add(a: integer, b: integer): (integer?, error?)
    if (b > 0 and a > math.maxinteger - b) or (b < 0 and a < math.mininteger - b) then
        return nil, snapshot.limit("Time total exceeds the supported integer range")
    end
    return a + b, nil
end

function M.subtree(tx: sql.Transaction, ctx: types.Context, request: types.Request): (types.Report?, error?)
    local root_id = request.item :: string
    local items, err = M.visible(tx, ctx, { root_id })
    if err or not items then return nil, err end
    local root = items[1]
    if not root then return nil, access.missing() end
    local matches = snapshot.matches(ctx, request, "subtree")
    local after, after_err = snapshot.open(request.cursor, matches)
    if after_err or not after then return nil, after_err end

    -- The path index selects each descendant once. Read an indexed page before
    -- applying visibility so even a mostly hidden subtree has bounded cost.
    local args: { unknown } = { root_id, after.item or "", SUBTREE_PAGE + 1 }
    snapshot.args(args, ctx.visibility.args)
    args[#args + 1] = ctx.admission.attachment_id
    local rows, query_err = snapshot.query(tx, "WITH candidates AS (SELECT item_id FROM " .. ctx.names.set .. [[
        WHERE col = 'path_under' AND value_key = ? AND item_id > ? ORDER BY item_id LIMIT ?)
        SELECT c.item_id, t.minutes FROM candidates c LEFT JOIN ]] .. ctx.names.item .. [[ i
          ON i.item_id = c.item_id AND i.life = 'live' AND (]] .. ctx.visibility.sql .. [[)
        LEFT JOIN kickside_work_time_total t ON t.attachment_id = ? AND t.item_id = i.item_id ORDER BY c.item_id]], args)
    if query_err or not rows then return nil, query_err end
    local minutes = (after.minutes :: integer?) or root.minutes
    local count = math.min(#rows, SUBTREE_PAGE)
    for i = 1, count do
        local total, sum_err = M.add(minutes, (tonumber(rows[i].minutes) or 0) :: integer)
        if sum_err or not total then return nil, sum_err end
        minutes = total
    end
    local cursor: string?
    if #rows > SUBTREE_PAGE then
        local cursor_err
        cursor, cursor_err = snapshot.seal({ item = rows[count].item_id, minutes = minutes }, matches)
        if cursor_err then return nil, cursor_err end
    end
    return { direct_minutes = root.minutes, subtree_minutes = minutes, entry_count = root.entry_count,
        original_minutes = root.original_minutes, remaining_minutes = root.remaining_minutes, over_estimate = root.over_estimate,
        coverage = cursor and "limited" or "complete", cursor = cursor }, nil
end

return M
