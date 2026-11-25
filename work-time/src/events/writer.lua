-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local append = require("append")
local hash = require("hash")
local sql = require("sql")

local M = {}
local CHANGED = "kickside.work.time.events:worklog.changed"
local OVER = "kickside.work.time.events:time.over_estimate"

local function append_facts(tx: sql.Transaction, attachment: string, board: string, kind: string,
    identity: string, event_types: { string }): error?
    local digest, err = hash.sha256(identity)
    if err then return err end
    local events = {}
    for _, event_type in ipairs(event_types) do
        events[#events + 1] = {
            event_type = event_type,
            payload = { board_id = board, change_kind = kind },
            external_identity = { source = "kickside.work.time", id = tostring(digest) },
        }
    end
    local _, append_err = append.append_tx(tx, { thread_id = attachment, events = events })
    return append_err
end

function M.mutation(tx: sql.Transaction, attachment: string, board: string, kind: string,
    entry: string, version: integer, crossed: boolean): error?
    local events = crossed and { CHANGED, OVER } or { CHANGED }
    return append_facts(tx, attachment, board, kind, "worklog/" .. entry .. "/" .. version, events)
end

-- Estimate projections supply a stable Work item identity and source sequence.
function M.estimate(tx: sql.Transaction, attachment: string, board: string, item: string, seq: integer): error?
    return append_facts(tx, attachment, board, "estimate", "estimate/" .. item .. "/" .. seq, { OVER })
end

return M
