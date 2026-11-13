-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local threads = require("threads")
local append = require("append")
local receipts = require("receipts")
local guard = require("guard")
local clock = require("clock")
local domain = require("domain")
local commands = require("commands")
local consts = require("consts")
local M = {}

-- A phase has one receipt, one event order and one append boundary.
function M.append(board_id: string, key: string, writes: { commands.Write }, result: domain.JsonObject, boundary: domain.Deadline?): (domain.JsonObject?, error?)
    local until_at = clock.deadline(consts.LIMITS.command_deadline_ms)
    if boundary and boundary.ns < until_at.ns then until_at = boundary end
    local head, cerr = receipts.covered(board_id, until_at)
    if cerr then return nil, cerr end
    local hit, herr = receipts.command(board_id, key)
    if herr then return nil, herr end
    if hit then return hit.receipt.result, nil end
    local claim = receipts.claim(board_id, key, receipts.request_hash(result), result, head :: integer)
    table.insert(writes, 1, claim)
    for _, write in ipairs(writes) do
        for _, event in ipairs(write.events) do receipts.decorate(event, guard.actor_id(), guard.stamp_now(), "work", nil, nil) end
    end
    local c, err = threads.open()
    if not c then return nil, err end
    local _, aerr = append.writes(c, board_id, writes)
    if aerr then
        local _, uerr = receipts.covered(board_id, until_at)
        if uerr then return nil, uerr end
        local replayed, rerr = receipts.command(board_id, key)
        if rerr then return nil, rerr end
        if replayed then return replayed.receipt.result, nil end
        return nil, aerr
    end
    local _, uerr = receipts.covered(board_id, until_at)
    if uerr then return nil, uerr end
    return result, nil
end

function M.progress(board_id: string, id: string, kind: string, processed: integer, total: integer, status: string, counts: { [string]: integer }, boundary: domain.Deadline?): error?
    local event: domain.Event = { type = "kickside.work.events:" .. kind .. ".progress", subject = kind .. ":" .. id,
        body = { operation_id = id, processed = processed, total = total, status = status, counts = counts } }
    local _, err = M.append(board_id, kind .. "/" .. id .. "/" .. status .. "/" .. processed,
        { { group = kind, events = { event }, ops = {}, caller_expect = false } }, {}, boundary)
    return err
end
return M
