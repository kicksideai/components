-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local receipts = require("receipts")
local sql = require("sql")
local M = {
    apply_hash = receipts.apply_hash, apply_outcomes = receipts.apply_outcomes,
    decorate = receipts.decorate, group_receipts = receipts.group_receipts, legacy_apply = receipts.legacy_apply,
    request_hash = receipts.request_hash, seal_atomic = receipts.seal_atomic, seal_group = receipts.seal_group,
    trace = receipts.trace,
}

M.key = "atomic-projected-prefix"
local base = "apply/" .. M.key
local cutoffs: { [string]: { seq: integer, hidden: boolean } } = {}

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

function M.version(board_id: string, key: string, deadline: { at: string, ns: integer })
    local version, err = receipts.version(board_id, key, deadline)
    if not err and key == base then
        local db = open()
        local found = assert(db:query("SELECT seq FROM work_receipt_probe WHERE board_id=$1", { board_id }))
        db:release()
        if found[1] then
            cutoffs[board_id] = { seq = assert(math.tointeger(tonumber(found[1].seq))), hidden = false }
        end
    end
    return version, err
end

-- Reproduce a winner projecting after the retry samples the claim version. The retry can
-- see the committed prefix until its next catch-up covers the whole append.
function M.command(board_id: string, key: string)
    local hit, err = receipts.command(board_id, key)
    local cutoff = cutoffs[board_id]
    if hit and cutoff and hit.seq > cutoff.seq then
        cutoff.hidden = true
        return nil, nil
    end
    return hit, err
end

function M.covered(board_id: string, deadline: { at: string, ns: integer }, target_seq: integer?)
    local seq, err = receipts.covered(board_id, deadline, target_seq)
    local cutoff = cutoffs[board_id]
    if not err and cutoff then
        assert(cutoff.hidden, "catch-up follows a receipt read at the projected prefix")
        local db = assert(sql.get("app:db"))
        assert(db:execute("DELETE FROM work_receipt_probe WHERE board_id=$1", { board_id }))
        db:release()
        cutoffs[board_id] = nil
    end
    return seq, err
end

function M.atomic_apply(ctx)
    return receipts.atomic_apply(ctx, M)
end

return M
