-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local local_types = require("local_types")
local sql = require("sql")
local store = require("store")
local types = require("types")
local consts = require("consts")

local working_rows = require("working_rows")
local M = {}

-- Relation predicates propagate source changes through their declared hop depth.

local function hops(raw: unknown): integer
    if type(raw) ~= "table" then return 0 end
    local node = raw :: { [string]: unknown }
    local depth = 0
    for _, child in pairs(node) do depth = math.max(depth, hops(child)) end
    return depth + ((node.rel ~= nil or node.children ~= nil) and 1 or 0)
end


-- query preserves each event's identity while sharing its graph traversal statement.
local function query(tx: sql.DB | sql.Transaction, board: types.Board, changed: { local_types.Seed }, limit: integer?, links: { [string]: boolean }?): ({ types.Row }?, error?)
    local depth = 0
    for _, f in ipairs(board.compiled.fields) do
        if f.rollup then depth = math.max(depth, hops(f.rollup.where)) end
    end
    local seeds: { string } = {}
    local args: types.SqlParams = {}
    local prefix = ""
    if links then
        local overlay, err = working_rows.links(links)
        if err or not overlay then return nil, err end
        local n = 0
        prefix = overlay.sql:gsub("%?", function(): string n = n + 1; return "$" .. n end) .. ", "
        for _, value in ipairs(overlay.args) do args[#args + 1] = value end
    end
    for _, seed in ipairs(changed) do
        args[#args + 1] = seed.id
        local id = "$" .. #args
        args[#args + 1] = seed.seq
        seeds[#seeds + 1] = "(" .. seed.event_no .. ", CAST(" .. id .. " AS text), 0, CAST($" .. #args .. " AS bigint))"
    end
    if #seeds == 0 then return {}, nil end
    args[#args + 1] = board.board_id
    local owner = "$" .. #args
    args[#args + 1] = depth
    local hop_limit = "$" .. #args
    local symmetric: { string } = {}
    for _, relation in ipairs(board.compiled.relation_types) do
        if relation.symmetric then
            args[#args + 1] = relation.id
            symmetric[#symmetric + 1] = "$" .. #args
        end
    end
    local reverse = #symmetric > 0 and (" UNION ALL SELECT p.event_no, l.to_id, p.seq FROM peers p JOIN kickside_work_link l ON l.board_id = " .. owner
        .. " AND l.to_board_id = " .. owner .. " AND l.from_id = p.id WHERE l.type IN (" .. table.concat(symmetric, ",") .. ")") or ""
    local eligible = ""
    if limit then
        local carried: { [string]: boolean } = {}
        for _, field in ipairs(board.compiled.fields) do if field.rollup or field.formula then carried[field.code] = true end end
        local kinds: { string } = {}
        for _, kind in ipairs(board.compiled.item_types) do
            for _, code in ipairs(kind.fields) do
                if carried[code] then args[#args + 1] = kind.id; kinds[#kinds + 1] = "$" .. #args; break end
            end
        end
        eligible = " WHERE EXISTS (SELECT 1 FROM seed_rows s WHERE s.event_no = holders.event_no AND s.id = holders.id)"
        if #kinds > 0 then
            eligible = eligible .. " OR EXISTS (SELECT 1 FROM kickside_work_item i WHERE i.board_id = " .. owner
                .. " AND i.item_id = holders.id AND i.type IN (" .. table.concat(kinds, ",") .. "))"
        end
    end
    local statement = "seed_rows(event_no, id, hop, seq) AS (VALUES " .. table.concat(seeds, ",") .. "), edges(a, b) AS (SELECT from_id, to_id FROM kickside_work_link WHERE board_id = " .. owner .. " AND to_board_id = " .. owner
        .. " UNION ALL SELECT to_id, from_id FROM kickside_work_link WHERE board_id = " .. owner .. " AND to_board_id = " .. owner
        .. " UNION ALL SELECT item_id, parent_id FROM kickside_work_item WHERE board_id = " .. owner .. " AND parent_id IS NOT NULL"
        .. " UNION ALL SELECT parent_id, item_id FROM kickside_work_item WHERE board_id = " .. owner .. " AND parent_id IS NOT NULL), peers(event_no, id, hop, seq) AS (SELECT event_no, id, hop, seq FROM seed_rows " .. [[ UNION
        SELECT p.event_no, e.b, p.hop + 1, p.seq FROM peers p JOIN edges e ON e.a = p.id WHERE p.hop < ]] .. hop_limit .. [[), holders(event_no, id, seq) AS (
        SELECT event_no, id, seq FROM peers UNION ALL SELECT p.event_no, i.parent_id, p.seq FROM peers p JOIN kickside_work_item i
        ON i.board_id = ]] .. owner .. [[ AND i.item_id = p.id WHERE i.parent_id IS NOT NULL
        UNION ALL SELECT p.event_no, l.from_id, p.seq FROM peers p JOIN kickside_work_link l ON l.board_id = ]] .. owner
        .. " AND l.to_board_id = " .. owner .. " AND l.to_id = p.id" .. reverse .. ") "
    if limit then
        statement = statement .. "SELECT event_no FROM holders" .. eligible .. " GROUP BY event_no HAVING COUNT(DISTINCT id) > " .. limit .. " LIMIT 1"
    else statement = statement .. "SELECT id, MAX(seq) AS seq FROM holders GROUP BY id ORDER BY id" end
    if links then statement = statement:gsub("kickside_work_link", "working_links") end
    return tx:query("WITH RECURSIVE " .. prefix .. statement, args)
end

local function seeds(changed: { [string]: integer }, event_no: integer): { local_types.Seed }
    local ids: { string } = {}
    for id in pairs(changed) do ids[#ids + 1] = id end
    table.sort(ids)
    local out: { local_types.Seed } = {}
    for _, id in ipairs(ids) do out[#out + 1] = { id = id, seq = changed[id], event_no = event_no } end
    return out
end

function M.expand(tx: sql.DB | sql.Transaction, board: types.Board, changed: { [string]: integer }): ({ [string]: integer }?, error?)
    local all = seeds(changed, 1)
    local found: { [string]: integer } = {}
    for first = 1, #all, 100 do
        local batch: { local_types.Seed } = {}
        for i = first, math.min(first + 99, #all) do batch[#batch + 1] = all[i] end
        local rows, err = query(tx, board, batch)
        if err then return nil, err end
        for _, row in ipairs(rows or {}) do
            local id, ierr = store.need(row, "id")
            if ierr or not id then return nil, ierr end
            local seq, serr = store.need_int(row, "seq")
            if serr or not seq then return nil, serr end
            found[id] = math.max(found[id] or 0, seq)
        end
    end
    return found, nil
end

-- admit bounds each event independently in batches of one hundred event graphs.
function M.admit(tx: sql.DB | sql.Transaction, board: types.Board, events: { { [string]: integer } }, limit: integer, links: { [string]: boolean }): error?
    for first = 1, #events, 100 do
        local batch: { local_types.Seed } = {}
        for i = first, math.min(first + 99, #events) do
            for _, seed in ipairs(seeds(events[i], i)) do batch[#batch + 1] = seed end
        end
        local rows, err = query(tx, board, batch, limit, links)
        if err then return err end
        if rows and rows[1] then
            return errors.new({ kind = errors.INVALID, message = "event dependency fan-out exceeds " .. limit .. " items", details = { code = "event_fanout_limit", limit = limit } })
        end
    end
    return nil
end

-- Schema preparation checks existing child populations before activating rollups.

-- check_links refuses a relation rollup over an item already past the links bound.
local function check_links(db: sql.DB | sql.Transaction, board_id: string, compiled: types.Compiled): error?
    local seen: { [string]: boolean } = {}
    for _, f in ipairs(compiled.fields) do
        local of = f.rollup and f.rollup.of
        if of and of ~= "children" and not seen[of] then
            seen[of] = true
            local rows, err = db:query([[SELECT holder FROM (SELECT from_id AS holder FROM kickside_work_link WHERE board_id = $1 AND type = $2
                UNION ALL SELECT to_id AS holder FROM kickside_work_link WHERE board_id = $1 AND to_board_id = $1 AND type = $2) h
                GROUP BY holder HAVING COUNT(*) > $3 LIMIT 1]], { board_id, of, consts.LIMITS.rollup_links })
            if err then return err end
            if rows and rows[1] then
                return errors.new({ kind = errors.INVALID, message = "relation " .. of .. " exceeds the links limit", details = { code = "links_limit" } })
            end
        end
    end
    return nil
end

function M.check(db: sql.DB | sql.Transaction, board_id: string, compiled: types.Compiled): error?
    local link_err = check_links(db, board_id, compiled)
    if link_err then return link_err end
    local fields: { [string]: boolean } = {}
    for _, f in ipairs(compiled.fields) do if f.rollup then fields[f.code] = true end end
    local params: types.SqlParams = { board_id }
    local marks: { string } = {}
    for _, t in ipairs(compiled.item_types) do
        local carries = false
        for _, key in ipairs(t.fields) do if fields[key] then carries = true end end
        if carries then
            params[#params + 1] = t.id
            marks[#marks + 1] = "$" .. #params
        end
    end
    if #marks == 0 then return nil end
    params[#params + 1] = consts.LIMITS.rollup_children
    local rows, err = db:query([[SELECT p.item_id FROM kickside_work_item p JOIN kickside_work_item c ON c.board_id = p.board_id AND c.parent_id = p.item_id
        WHERE p.board_id = $1 AND p.type IN (]] .. table.concat(marks, ",") .. ") GROUP BY p.item_id HAVING COUNT(*) > $" .. #params .. " LIMIT 1", params)
    if err then return err end
    if rows and rows[1] then
        return errors.new({ kind = errors.INVALID, message = "rollup parent exceeds the children limit", details = { code = "children_limit" } })
    end
    return nil
end

return M
