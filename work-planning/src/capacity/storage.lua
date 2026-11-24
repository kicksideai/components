-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local work_store = require("work_store")
local work_reads = require("work_reads")
local lifecycle = require("lifecycle")
local M = {}

local PLUGIN = "kickside.work.planning:plugin"
local BATCH = 100
M.MAX_PEOPLE = 200

type Unit = "minutes" | "points"
type Row = { person: string, amount: number }
type Capacity = { unit: Unit?, version: integer?, rows: { Row } }
M.Unit = Unit
M.Row = Row
M.Capacity = Capacity

-- Call only after Work has admitted the sprint to the current reader.
function M.read(board_id: string, attachment: string, sprint: string, as_of: integer): (Capacity?, error?)
    local db, err = work_store.open()
    if not db then return nil, err end
    -- Seek one candidate per key before checking identity and lifecycle.
    local rows, err = db:query([[
        WITH sprint AS (
            SELECT board_id, item_id, type, life FROM kickside_work_item
            WHERE (board_id, item_id) >= ($1, $2) ORDER BY board_id, item_id LIMIT 1
        ), planning AS (
            SELECT board_id, plugin, attachment_id, active FROM kickside_work_plugin
            WHERE (board_id, plugin) >= ($1, $3) ORDER BY board_id, plugin LIMIT 1
        )
        SELECT s.unit, s.version, c.person, c.amount
        FROM sprint i
        JOIN kickside_work_board b ON b.board_id = $1
        JOIN planning p ON p.board_id = b.board_id AND p.plugin = $3 AND p.attachment_id = $4 AND p.active = 1
        LEFT JOIN kickside_work_planning_sprint s ON s.attachment_id = p.attachment_id AND s.sprint_id = i.item_id AND s.board_id = b.board_id
        LEFT JOIN kickside_work_planning_capacity c ON c.attachment_id = s.attachment_id AND c.sprint_id = s.sprint_id
        WHERE i.board_id = b.board_id AND i.item_id = $2 AND i.type = 'sprint' AND i.life = 'live' AND b.applied_seq = $5
        ORDER BY c.person LIMIT $6
    ]], { board_id, sprint, PLUGIN, attachment, as_of, M.MAX_PEOPLE + 1 })
    local _, release_err = db:release()
    if err or release_err then return nil, err or release_err end
    if #(rows or {}) == 0 then
        return nil, errors.new({ kind = errors.CONFLICT, message = "The board changed during the Planning read.",
            details = { code = "planning_snapshot_stale" } })
    end
    local result: Capacity = { rows = {} }
    if #(rows or {}) > M.MAX_PEOPLE then
        return nil, errors.new({ kind = errors.INTERNAL, message = "Stored sprint capacity exceeds its person limit." })
    end
    for _, row in ipairs(rows or {}) do
        result.unit, result.version = row.unit :: Unit, work_store.int(row.version)
        if type(row.person) == "string" then
            local amount = tonumber(row.amount)
            if not amount then return nil, errors.new({ kind = errors.INTERNAL, message = "Stored capacity amount is invalid." }) end
            result.rows[#result.rows + 1] = { person = row.person, amount = amount }
        end
    end
    return result, nil
end

local function retire(tx: work_reads.Executor, board_id: string, attachment: string, sprint: string): error?
    local _, err = tx:execute([[
        DELETE FROM kickside_work_planning_sprint
        WHERE attachment_id = $1 AND sprint_id = $2 AND board_id = $3
          AND NOT EXISTS (SELECT 1 FROM kickside_work_item WHERE board_id = $3 AND item_id = $2 AND life IN ('live', 'trashed'))
    ]], { attachment, sprint, board_id })
    return err
end

type Fold = { after: string? }

-- The feed may emit deletes for trash or lost access. A retired item has no live
-- or restorable Work row. A reset also seeks through Planning's own sprint keys.
function M.fold(board_id: string, attachment: string, changes: { work_reads.ChangeItem }, after: string?): (Fold?, error?)
    return lifecycle.transaction(function(tx): (Fold?, error?)
        for _, change in ipairs(changes) do
            if change.op == "delete" then
                local err = retire(tx, board_id, attachment, change.item_id)
                if err then return nil, err end
            end
        end
        if not after then return {}, nil end
        local page, err = tx:query([[
            SELECT sprint_id FROM kickside_work_planning_sprint
            WHERE attachment_id = $1 AND sprint_id > $2 ORDER BY sprint_id LIMIT $3
        ]], { attachment, after, BATCH })
        if err then return nil, err end
        local last: string? = nil
        for _, row in ipairs(page or {}) do
            last = row.sprint_id :: string
            local err = retire(tx, board_id, attachment, last)
            if err then return nil, err end
        end
        return { after = #(page or {}) == BATCH and last or nil }, nil
    end)
end

function M.delete_attachment(attachment: string): (boolean?, error?)
    return lifecycle.transaction(function(tx): (boolean?, error?)
        local deleted, more, err = lifecycle.page(tx, "kickside_work_planning_sprint",
            "attachment_id, sprint_id", "attachment_id = $1", { attachment }, BATCH)
        if err or not deleted then return nil, err end
        return not more, nil
    end)
end

return M
