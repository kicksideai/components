-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local ctx = require("ctx")
local json = require("json")
local client = require("client")
local consts = require("consts")
local materializer = require("materializer")
local store = require("store")
local work = require("work")
local M = {}

local function rebuild(board_id: string, through: string)
    local db = assert(store.open())
    local tx = assert(db:begin())
    local board = assert(store.board(tx, board_id, db:type()))
    assert(tx:execute([[INSERT INTO kickside_work_job (board_id, job_id, job_type, key, status)
        VALUES ($1, 'sprint-reference-rebuild', 'reindex', $2, 'pending')]],
        { board_id, json.encode({ generation = board.generation, after = "" }) }))
    local seq = board.applied_seq + 1
    assert(materializer.fold(tx, db:type(), board_id, { { seq = seq, type = consts.EVENTS.INDEX_REBUILT,
        body = { recompute = { after = "", through = through, generation = board.generation } } } }, seq, 5000))
    local job = assert(tx:query("SELECT key FROM kickside_work_job WHERE board_id = $1 AND job_type = 'reindex'", { board_id }))[1]
    assert(json.decode(job.key).after == through)
    assert(assert(store.board(tx, board_id)).applied_seq == seq)
    assert(tx:commit())
    db:release()
end

-- Interleave precisely after Planning reads the schema and before it reads the item.
function M.call(method: string, input: work.Row): (unknown, error?)
    local result, err = client.call(method, input)
    if not result or err or method ~= "get_schema" then return result, err end
    local board_id = input.board_id :: string
    local through = ctx.get("sprint_reference_rebuild_through")
    if type(through) == "string" then rebuild(board_id, through) end
    local sprint = ctx.get("sprint_reference_edit_sprint")
    if type(sprint) == "string" then
        local written, write_err = client.call("apply", { board_id = board_id, key = "interleaved-date", mode = "atomic",
            ops = { { op = "set", item = sprint, values = { planning_end = "2026-11-05" } } } })
        assert(written, tostring(write_err))
        assert(written.outcomes[1].status == "applied")
    end
    return result, nil
end

return M
