-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Durable change-feed and history pages.
local sql = require("sql")
local domain = require("domain")
local M = {}
local LINK_ORDER = "seq, board_id, from_id, type, to_board_id, to_id"

function M.changes(tx: sql.DB | sql.Transaction, board: domain.Board, seq: integer, item_id: string, limit: integer): ({ domain.Row }?, error?)
    return tx:query([[SELECT updated_seq, item_id FROM kickside_work_item WHERE board_id = $1 AND updated_seq <= $2
        AND (updated_seq, item_id) > ($3, $4) ORDER BY updated_seq, item_id LIMIT $5]],
        { board.board_id, board.applied_seq, seq, item_id, limit })
end

function M.history(tx: sql.DB | sql.Transaction, board_id: string, subject: string?, before_seq: integer?, before_n: integer?, limit: integer): ({ domain.Row }?, error?)
    local params: domain.SqlParams = { board_id }
    local where = "board_id = $1"
    if subject then
        params[#params + 1] = subject
        where = where .. " AND subject = $" .. #params
    end
    if before_seq and before_n then
        params[#params + 1] = before_seq
        local a = #params
        params[#params + 1] = before_n
        where = where .. " AND (seq < $" .. a .. " OR (seq = $" .. a .. " AND n < $" .. #params .. "))"
    end
    params[#params + 1] = limit
    return tx:query("SELECT * FROM kickside_work_change WHERE " .. where .. " ORDER BY seq DESC, n DESC LIMIT $" .. #params, params)
end

function M.life_condition(trashed: boolean?): domain.Condition
    return { sql = trashed and "i.life IN (?, ?)" or "i.life = ?", args = trashed and { "live", "trashed" } or { "live" } }
end

-- links pages the source rows for an item or a target in a stable total order.
function M.links(tx: sql.DB | sql.Transaction, board_id: string, item_id: string?, target: domain.Target?, direction: string, after: domain.LinkPosition?, limit: integer): ({ domain.Row }?, error?)
    local params: domain.SqlParams = target and { board_id, target.board, target.item } or { board_id, item_id }
    local function bind(value: unknown): string
        params[#params + 1] = value
        return "$" .. #params
    end
    local function seek(columns: string, comparison: string, position: domain.SqlParams): string
        local markers: { string } = {}
        for _, value in ipairs(position) do markers[#markers + 1] = bind(value) end
        return " AND (" .. columns .. ") " .. comparison .. " (" .. table.concat(markers, ", ") .. ")"
    end
    local function page(scope: string, order: string): string
        return "SELECT * FROM kickside_work_link WHERE " .. scope .. " ORDER BY " .. order .. " LIMIT " .. bind(limit)
    end
    if target then
        local order = "seq, from_id, type"
        local scope = "board_id = $1 AND to_board_id = $2 AND to_id = $3"
        if after then scope = scope .. seek(order, ">", { after.seq, after.from_id, after.type }) end
        return tx:query(page(scope, order), params)
    end
    local position = after and { after.seq, after.board_id, after.from_id, after.type, after.to_board_id, after.to_id }
    local outward: string?
    local inward: string?
    if direction ~= "inward" then
        local order = "seq, type, to_board_id, to_id"
        local scope = "board_id = $1 AND from_id = $2"
        if after and position then
            if after.board_id == board_id and after.from_id == item_id then
                scope = scope .. seek(order, ">", { after.seq, after.type, after.to_board_id, after.to_id })
            else
                -- Include the anchor's sequence only when this source sorts after its source.
                local seq, board, item = bind(after.seq), bind(after.board_id), bind(after.from_id)
                scope = scope .. " AND seq > CAST(" .. seq .. " AS bigint) - CASE WHEN ($1, $2) > (" .. board .. ", " .. item .. ") THEN 1 ELSE 0 END"
            end
        end
        outward = page(scope, order)
    end
    if direction ~= "outward" then
        local order = "seq, board_id, from_id, type"
        local scope = "to_board_id = $1 AND to_id = $2"
        if after and position then
            local same_target = after.to_board_id == board_id and after.to_id == item_id
            scope = scope .. seek(order, same_target and ">" or ">=", { after.seq, after.board_id, after.from_id, after.type })
            if not same_target then scope = scope .. seek(LINK_ORDER, ">", position) end
        end
        inward = page(scope, order)
    end
    if outward and inward then
        -- Each side has its own ordered seek. Commands forbid self-links, so the sides are disjoint.
        return tx:query("SELECT * FROM (SELECT * FROM (" .. outward .. ") AS outgoing UNION ALL SELECT * FROM (" .. inward
            .. ") AS incoming) AS links ORDER BY " .. LINK_ORDER .. " LIMIT " .. bind(limit), params)
    end
    return tx:query((outward or inward) :: string, params)
end

function M.stage_run(tx: sql.DB | sql.Transaction, board_id: string, item_id: string, visit: integer, attempt: integer): (domain.Row?, error?)
    local rows, err = tx:query("SELECT outcome FROM kickside_work_stage_run WHERE board_id = $1 AND item_id = $2 AND visit = $3 AND attempt = $4", { board_id, item_id, visit, attempt })
    if err or not rows then return nil, err end
    return rows[1], nil
end

function M.stage_runs(tx: sql.DB | sql.Transaction, board_id: string, item_id: string, limit: integer, visit: integer?, attempt: integer?, visits: { integer }?): ({ domain.Row }?, error?)
    local params: domain.SqlParams = { board_id, item_id }
    local where = "board_id = $1 AND item_id = $2"
    if visit and attempt then
        params[3], params[4] = visit, attempt
        where = where .. " AND (visit, attempt) < ($3, $4)"
    end
    if visits then
        local markers: { string } = {}
        for _, v in ipairs(visits) do
            params[#params + 1] = v
            markers[#markers + 1] = "$" .. #params
        end
        where = where .. " AND visit IN (" .. table.concat(markers, ",") .. ")"
    end
    params[#params + 1] = limit
    return tx:query("SELECT * FROM kickside_work_stage_run WHERE " .. where .. " ORDER BY visit DESC, attempt DESC LIMIT $" .. #params, params)
end

return M
