-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local receipts = require("receipts")
local sql = require("sql")
local M = {
    claim = receipts.claim, conflict_of = receipts.conflict_of, decorate = receipts.decorate,
    mark = receipts.mark, request_hash = receipts.request_hash, trace = receipts.trace,
}

M.key = "atomic-projected-prefix"
local base = "apply/" .. M.key
local cutoffs: { [string]: integer } = {}

local function open(): sql.DB
    local db = assert(sql.get("app:db"))
    assert(db:execute("CREATE TABLE IF NOT EXISTS work_receipt_probe (board_id TEXT PRIMARY KEY, seq BIGINT NOT NULL)"))
    return db
end

function M.project_prefix(board_id: string, seq: integer)
    local db = open()
    assert(db:execute("INSERT INTO work_receipt_probe (board_id, seq) VALUES ($1, $2)", { board_id, seq }))
    db:release()
end

function M.version(board_id, key, deadline)
    local version, err = receipts.version(board_id, key, deadline)
    if not err and key == base then
        local db = open()
        local found = assert(db:query("SELECT seq FROM work_receipt_probe WHERE board_id=$1", { board_id }))
        db:release()
        if found[1] then cutoffs[board_id] = assert(math.tointeger(tonumber(found[1].seq))) end
    end
    return version, err
end

-- Reproduce a winner projecting after the retry's claim-version sync. The retry can
-- see the committed prefix until its next catch-up covers the whole append.
function M.command(board_id, key)
    local hit, err = receipts.command(board_id, key)
    local cutoff = cutoffs[board_id]
    if hit and cutoff and hit.seq > cutoff then return nil, nil end
    return hit, err
end

function M.covered(board_id, deadline)
    local seq, err = receipts.covered(board_id, deadline)
    if not err and cutoffs[board_id] then
        local db = assert(sql.get("app:db"))
        assert(db:execute("DELETE FROM work_receipt_probe WHERE board_id=$1", { board_id }))
        db:release()
        cutoffs[board_id] = nil
    end
    return seq, err
end

return M
