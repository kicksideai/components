-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local board = require("board")
local bulk = require("bulk")
local identity = require("identity")
local lifecycle = require("lifecycle")
local sql = require("sql")
local storage = require("storage")
local work = require("work")
local M = {}

type Request = { board_id: string, sprint_id: string, expected_version: integer, unit: storage.Unit, rows: { storage.Row } }
type Result = { version: integer, unit: storage.Unit }
M.Request = Request
M.Result = Result

local CAPACITY_COLUMNS = { { name = "attachment_id" }, { name = "sprint_id" }, { name = "person" }, { name = "amount" } }

-- Seek one candidate on each primary key before checking its exact identity.
local UPSERT = [[
    INSERT INTO kickside_work_planning_sprint (attachment_id, board_id, sprint_id, unit, version)
    SELECT $1, $2, i.item_id, $3, $4
    FROM (
        SELECT board_id, item_id, type, life FROM kickside_work_item
        WHERE (board_id, item_id) >= ($2, $5) ORDER BY board_id, item_id LIMIT 1%s
    ) i
    JOIN (
        SELECT board_id, plugin, attachment_id, active FROM kickside_work_plugin
        WHERE (board_id, plugin) >= ($2, $6) ORDER BY board_id, plugin LIMIT 1%s
    ) p ON p.board_id = i.board_id AND p.plugin = $6 AND p.attachment_id = $1 AND p.active = 1
    JOIN kickside_work_board b ON b.board_id = i.board_id
    WHERE i.board_id = $2 AND i.item_id = $5 AND i.type = 'sprint' AND i.life = 'live'
      AND b.snapshot_seq = $7
      AND ($8 = 0 OR EXISTS (SELECT 1 FROM kickside_work_planning_sprint
          WHERE attachment_id = $1 AND sprint_id = $5))
    ON CONFLICT (attachment_id, sprint_id) DO UPDATE SET unit = excluded.unit, version = excluded.version
    WHERE kickside_work_planning_sprint.version = $8
    RETURNING version
]]

local function version_conflict(): error
    return board.problem(errors.CONFLICT, "planning_capacity_version_conflict", "Sprint capacity changed. Read its current version and try again.")
end

function M.set_capacity(request: Request): (Result?, error?)
    local seen: { [string]: boolean } = {}
    for _, row in ipairs(request.rows) do
        if row.person:find("\0", 1, true) or not identity.is_valid_id(row.person) then
            return nil, board.problem(errors.INVALID, "planning_capacity_person", "Capacity requires a canonical person ID.")
        end
        if seen[row.person] then
            return nil, board.problem(errors.INVALID, "planning_capacity_duplicate_person", "Set one capacity amount per person.")
        end
        seen[row.person] = true
    end

    local schema, plugin, err = board.active(request.board_id)
    if not schema or not plugin then return nil, err end
    local sprint, read_err = board.sprint(request.board_id, request.sprint_id, schema.snapshot_seq)
    if not sprint then return nil, read_err end
    if not sprint.access.write then
        return nil, board.problem(errors.PERMISSION_DENIED, "planning_write_required", "Sprint capacity requires board WRITE.")
    end
    local attachment = plugin.attachment_id :: string
    local expected = request.expected_version
    local next_version = expected + 1
    return lifecycle.transaction(function(tx: sql.Transaction, dialect: string): (Result?, error?)
        -- The admission and version check run in the first write statement. PostgreSQL
        -- holds the admitted attachment and sprint through the capacity replacement.
        local lock = dialect == sql.type.POSTGRES and " FOR SHARE" or ""
        local written, write_err = tx:query(UPSERT:format(lock, lock),
            { attachment, request.board_id, request.unit, next_version, request.sprint_id, board.PLUGIN, schema.snapshot_seq, expected })
        if write_err then return nil, write_err end
        if not written or not written[1] then return nil, version_conflict() end

        local _, delete_err = tx:execute(
            "DELETE FROM kickside_work_planning_capacity WHERE attachment_id = $1 AND sprint_id = $2",
            { attachment, request.sprint_id })
        if delete_err then return nil, delete_err end
        local rows: { work.SqlParams } = {}
        for i, row in ipairs(request.rows) do
            rows[i] = { attachment, request.sprint_id, row.person, row.amount }
        end
        local insert_err = bulk.insert(tx, "kickside_work_planning_capacity", CAPACITY_COLUMNS, rows)
        if insert_err then return nil, insert_err end
        return { version = next_version, unit = request.unit }, nil
    end)
end

return M
