-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local declaration = require("declaration")
local document = require("document")
local formula = require("formula")
-- Transient generated rows let the shared predicate compiler read a command document.
local sql = require("sql")
local tables = require("tables")
local values = require("values")
local domain = require("domain")
local M = {}

function M.links(links: { [string]: boolean }?): (domain.Condition?, error?)
    local params: { unknown } = {}
    local clauses: { string } = {}
    local changed: { string } = {}
    for key, present in pairs(links or {}) do
        local board_id, from, kind, to_board, to_id = key:match("^([^|]+)|([^|]+)|([^|]+)|([^|]+)|([^|]+)$")
        if not board_id then return nil, errors.new({ kind = errors.INTERNAL, message = "working link identity is malformed", details = { code = "row_corrupt" } }) end
        changed[#changed + 1] = "(CAST(? AS text),CAST(? AS text),CAST(? AS text),CAST(? AS text),CAST(? AS text),CAST(? AS bigint))"
        for _, value in ipairs({ board_id, from, kind, to_board, to_id }) do params[#params + 1] = value end
        params[#params + 1] = present and 1 or 0
    end
    if #changed > 0 then
        clauses[#clauses + 1] = "changed_links(board_id,from_id,type,to_board_id,to_id,present) AS (VALUES " .. table.concat(changed, ",") .. ")"
        clauses[#clauses + 1] = "working_links AS (SELECT board_id,from_id,type,to_board_id,to_id FROM changed_links WHERE present = 1 UNION ALL SELECT board_id,from_id,type,to_board_id,to_id FROM kickside_work_link l WHERE NOT EXISTS (SELECT 1 FROM changed_links c WHERE c.board_id = l.board_id AND c.from_id = l.from_id AND c.type = l.type AND c.to_board_id = l.to_board_id AND c.to_id = l.to_id))"
    else clauses[#clauses + 1] = "working_links AS (SELECT board_id,from_id,type,to_board_id,to_id FROM kickside_work_link)" end
    return { sql = table.concat(clauses, ", "), args = params }, nil
end

function M.compile(board: domain.Board, item: domain.Item, dialect: string, working: domain.WorkingState?): (domain.Condition?, error?)
    local items: { [string]: domain.Item } = {}
    for id, held in pairs(working and working.items or {}) do items[id] = held end
    items[item.item_id] = item
    local ids: { string } = {}
    for id in pairs(items) do ids[#ids + 1] = id end
    table.sort(ids)
    local params: { unknown } = {}
    local entries: { string } = {}
    local layout = tables.layout(board.compiled)
    local t = tables.of(board.board_id, layout)
    for _, id in ipairs(ids) do
        local virtual = declaration.copy(items[id] :: domain.Item)
        local patches = formula.evaluate(board, virtual)
        document.apply_patch(virtual.document, patches)
        local row, err = tables.row(board, virtual, layout)
        if err then return nil, err end
        entries[#entries + 1] = "(CAST(? AS text), CAST(? AS text))"
        params[#params + 1], params[#params + 2] = id, values.canonical(row)
    end
    local function extract(section: string, column: string, numeric: boolean): string
        local expression: string
        if dialect == sql.type.POSTGRES then expression = "(c.data::jsonb -> '" .. section .. "' ->> '" .. column .. "')"
        else expression = "json_extract(c.data, '$." .. section .. "." .. column .. "')" end
        return numeric and "CAST(" .. expression .. " AS bigint)" or expression
    end
    local columns: { string } = { "item_id" }
    local selected: { string } = { "c.item_id" }
    for _, column in ipairs(t.system) do
        columns[#columns + 1] = column.name
        selected[#selected + 1] = extract("system", column.name, column.kind == "int") .. " AS " .. column.name
    end
    for _, column in ipairs(layout.columns) do
        columns[#columns + 1] = column.column
        selected[#selected + 1] = extract("values", column.column, column.kind == "number") .. " AS " .. column.column
    end
    local projected: { string } = {}
    for _, column in ipairs(columns) do projected[#projected + 1] = "i." .. column end
    local sets: string
    if dialect == sql.type.POSTGRES then
        sets = "SELECT c.item_id, j.key AS col, k.value AS value_key FROM changed c CROSS JOIN LATERAL jsonb_each(c.data::jsonb -> 'sets') j CROSS JOIN LATERAL jsonb_array_elements_text(j.value) k(value)"
    else sets = "SELECT c.item_id, j.key AS col, k.value AS value_key FROM changed c, json_each(c.data, '$.sets') j, json_each(j.value) k" end
    local clauses = {
        "changed(item_id, data) AS (VALUES " .. table.concat(entries, ", ") .. ")",
        "working_items AS (SELECT " .. table.concat(selected, ", ") .. " FROM changed c UNION ALL SELECT " .. table.concat(projected, ", ") .. " FROM " .. t.names.item .. " i WHERE i.item_id NOT IN (SELECT item_id FROM changed))",
        "working_set AS (" .. sets .. " UNION ALL SELECT item_id, col, value_key FROM " .. t.names.set .. " WHERE item_id NOT IN (SELECT item_id FROM changed))",
    }
    local linked, lerr = M.links(working and working.links)
    if lerr or not linked then return nil, lerr end
    clauses[#clauses + 1] = linked.sql
    for _, value in ipairs(linked.args) do params[#params + 1] = value end
    return { sql = "WITH " .. table.concat(clauses, ", "), args = params }, nil
end

return M
