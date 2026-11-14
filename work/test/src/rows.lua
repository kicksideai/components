-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Row-level checks over the fixed work tables, read with the harness's own database access.
local store = require("store")

local M = {}

-- scalar runs a statement that returns one count and returns it.
function M.scalar(statement: string, params: { unknown }): integer
    local db = assert(store.open())
    local rows = assert(db:query(statement, params))
    db:release()
    return math.tointeger(tonumber(rows[1].n)) :: integer
end

-- stale counts the items of a board that still run an older definition of their process.
function M.stale(board_id: string): integer
    return M.scalar("SELECT COUNT(*) AS n FROM kickside_work_item WHERE board_id = $1 AND process_generation < (SELECT generation FROM kickside_work_board WHERE board_id = $1)",
        { board_id })
end

-- job returns the board's migration job row.
function M.job(board_id: string): { [string]: unknown }
    local db = assert(store.open())
    local rows = assert(db:query("SELECT * FROM kickside_work_job WHERE board_id = $1", { board_id }))
    db:release()
    return rows[1] :: { [string]: unknown }
end

-- held counts the rows that record a claim on a key prefix.
function M.held(prefix: string): integer
    return M.scalar("SELECT COUNT(*) AS n FROM kickside_work_prefix WHERE prefix = $1", { prefix })
end

return M
