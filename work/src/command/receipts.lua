-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Idempotency and durability helpers of the write commands: request hashes, the receipts stored on events, the
-- external identity of a command's events and the wait for the projection to cover an append.
local hash = require("hash")
local consts = require("consts")
local funcs = require("funcs")
local values = require("values")
local domain = require("domain")
local types = require("types")

local store = require("store")
local trace = require("trace")
local guard = require("guard")
local clock = require("clock")
local policy = require("policy")
local uuid = require("uuid")
local M = {}

function M.trace(raw: domain.TraceContext?, kind: string): (domain.TraceContext?, error?)
    local context, err = trace.normalize(raw)
    if err then return nil, err end
    if not context then context = trace.begin(kind) end
    return context :: domain.TraceContext, nil
end

function M.command(board_id: string, key: string): (types.Durable?, error?)
    local days, derr = policy.event_days()
    if derr or not days then return nil, derr end
    local db, err = store.open()
    if not db then return nil, err end
    local rows, rerr = db:query("SELECT request_hash, principal, result, seq FROM kickside_work_receipt WHERE board_id = $1 AND command_key = $2 AND at >= $3", { board_id, key, clock.offset(-days * 86400) })
    db:release()
    if rerr then return nil, rerr end
    local row = rows and rows[1]
    if not row then return nil, nil end
    if row.principal ~= guard.actor_id() then
        return nil, errors.new({ kind = errors.PERMISSION_DENIED, message = "command key belongs to another principal", details = { code = "idempotency_principal_mismatch" } })
    end
    local decoded_1, decode_err = store.need_int(row, "seq")
    if decode_err then return nil, decode_err end
    local decoded_1 = decoded_1 :: integer
    local decoded_2, decode_err = store.stored(row.result, {} :: domain.JsonObject)
    if decode_err then return nil, decode_err end
    local decoded_2 = decoded_2 :: domain.JsonObject
    local decoded_3, decode_err = store.need(row, "request_hash")
    if decode_err then return nil, decode_err end
    local decoded_3 = decoded_3 :: string
    return { receipt = { request_hash = decoded_3, result = decoded_2 }, seq = decoded_1 }, nil
end

function M.claim(board_id: string, key: string, hashed: string, result: domain.JsonObject, head: integer): types.Write
    return { group = "command", events = { { type = consts.EVENTS.COMMAND_RECORDED,
        subject = "command", body = { command_key = key, receipt = { request_hash = hashed, result = result } } } },
        ops = {}, expect_head = head, caller_expect = false }
end

function M.request_hash(value: unknown): string
    return tostring(hash.sha256(values.canonical(value)))
end

-- durable returns the receipt stored by an earlier run of the same command, or nil.

-- covered waits until the projection reaches the thread head; a projection that
-- does not get there before the deadline is a retryable unavailability.
function M.covered(board_id: string, deadline: domain.Deadline): (integer?, error?)
    local result, err = funcs.call("kickside.work.service:sync", { board_id = board_id, deadline = deadline })
    if err then return nil, err end
    return result :: integer, nil
end

function M.conflict_of(): error
    return errors.new({ kind = errors.CONFLICT, message = "idempotency key reused with a different request", details = { code = "idempotency_conflict" } })
end

-- decorate fills the common body fields of a command's events.
function M.decorate(event: domain.Event, actor: string, at: string, source: string, origin: domain.JsonObject?, trace_context: domain.TraceContext?)
    event.trace_context = trace_context
    event.body.actor = actor
    event.body.at = at
    event.body.source = source
    event.body.origin = origin
end

-- mark gives every event of a command its external identity; the first also carries the receipt.
function M.mark(events: { domain.Event }, marker: string, receipt: domain.Receipt?, stored_key: string?)
    local delivery = uuid.v4()
    for n, event in ipairs(events) do
        event.external = { external_source = consts.EXTERNAL_SOURCE .. "/" .. delivery, external_id = n == 1 and marker or (marker .. "/" .. n) }
    end
    if receipt and events[1] then
        events[1].body.receipt = receipt
        events[1].body.command_key = stored_key or marker
    end
end

return M
