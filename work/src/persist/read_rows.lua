-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Durable change-feed and history pages.
local sql = require("sql")
local domain = require("domain")
local M = {}

function M.changes(tx: sql.DB | sql.Transaction, board: domain.Board, seq: integer, item_id: string, limit: integer): ({ domain.Row }?, error?)
    return tx:query([[SELECT * FROM kickside_work_item WHERE board_id = $1 AND updated_seq <= $2
        AND (updated_seq > $3 OR (updated_seq = $4 AND item_id > $5)) ORDER BY updated_seq, item_id LIMIT $6]],
        { board.board_id, board.applied_seq, seq, seq, item_id, limit })
end

function M.history(tx: sql.DB | sql.Transaction, board_id: string, subject: string?, before_seq: integer?, before_n: integer?, limit: integer): ({ domain.Row }?, error?)
    local params: domain.SqlParams = { board_id }
    local where = "board_id = $1 AND kind <> 'query_value'"
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
function M.links(tx: sql.DB | sql.Transaction, board_id: string, item_id: string?, target: domain.Target?, direction: string, offset: integer, limit: integer): ({ domain.Row }?, error?)
    local params: domain.SqlParams = { board_id }
    local where: string
    if target then
        where = "board_id = $1 AND to_board_id = $2 AND to_id = $3"
        params[2], params[3] = target.board, target.item
    else
        params[2] = item_id
        local outward = "(board_id = $1 AND from_id = $2)"
        local inward = "(to_board_id = $1 AND to_id = $2)"
        where = direction == "inward" and inward or direction == "outward" and outward or ("(" .. outward .. " OR " .. inward .. ")")
    end
    params[#params + 1] = limit
    local take = #params
    params[#params + 1] = offset
    return tx:query("SELECT * FROM kickside_work_link WHERE " .. where .. " ORDER BY seq, board_id, from_id, type, to_board_id, to_id LIMIT $" .. take .. " OFFSET $" .. #params, params)
end

function M.stage_run(tx: sql.DB | sql.Transaction, board_id: string, item_id: string, visit: integer, attempt: integer): (domain.Row?, error?)
    local rows, err = tx:query("SELECT outcome FROM kickside_work_stage_run WHERE board_id = $1 AND item_id = $2 AND visit = $3 AND attempt = $4 AND outcome IS NOT NULL", { board_id, item_id, visit, attempt })
    if err or not rows then return nil, err end
    return rows[1], nil
end

function M.stage_runs(tx: sql.DB | sql.Transaction, board_id: string, item_id: string, limit: integer, visit: integer?, attempt: integer?, visits: { integer }?): ({ domain.Row }?, error?)
    local params: domain.SqlParams = { board_id, item_id }
    local where = "board_id = $1 AND item_id = $2"
    if visit and attempt then
        params[3], params[4] = visit, attempt
        where = where .. " AND (visit < $3 OR (visit = $3 AND attempt < $4))"
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
