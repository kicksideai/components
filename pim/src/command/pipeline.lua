-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- An append uses the guard from its plan. A conflict rebuilds the plan, and success waits for the projection.
local clock = require("clock")
local receipts = require("receipts")
local threads = require("threads")
local types = require("types")

local M = {}

type Thread = { id: string, kind: string, source: string }
type Attempt = { result: types.JsonObject, events: { types.Event }, expect: threads.Expect?,
    as_of: integer, catalog_seq: integer, receipt_after_fold: boolean? }
type ReceiptPosition = receipts.Position
type Build = (integer) -> (Attempt?, error?)
type Command = receipts.Callbacks & {
    client: threads.Client, thread: Thread, actor: string, deadline_ms: integer, deadline: clock.Deadline?, fingerprint: unknown,
    idempotency: types.Idempotency?, trace_context: types.TraceContext?, build: Build,
}
M.Thread = Thread
M.Attempt = Attempt
M.ReceiptPosition = ReceiptPosition
M.Build = Build
M.Command = Command

M.apply_fingerprint = receipts.apply_fingerprint
M.marker = receipts.marker

-- Missing the requested projection position is a retryable unavailability.
local function covered(c: Command, deadline: clock.Deadline, target_seq: integer?): (integer?, error?)
    local caught, err = threads.catch_up(c.client, c.thread.id, c.thread.kind, deadline, target_seq)
    if err or not caught then return nil, err end
    local last_seq = caught.last_seq
    if not caught.done or not last_seq then
        local position = target_seq and "the target sequence" or "the thread head"
        return nil, errors.new({ details = { code = "projection_behind" }, kind = errors.UNAVAILABLE, retryable = true,
            message = "the projection did not reach " .. position })
    end
    return last_seq, nil
end

function M.run(c: Command): (types.JsonObject?, error?)
    local until_at = clock.deadline(c.deadline_ms)
    if c.deadline and c.deadline.ns < until_at.ns then until_at = c.deadline end
    local key, kerr = receipts.key(c.idempotency, c.actor, c.fingerprint)
    if kerr then return nil, kerr end
    local function cover(target: integer): (integer?, error?)
        return covered(c, until_at, target)
    end
    while not clock.passed(until_at) do
        if key and not c.receipt_requires_head then
            local replayed, rerr = receipts.replay(key, c.receipt, nil, cover)
            if rerr or replayed then return replayed, rerr end
        end
        local last_seq, cerr = covered(c, until_at)
        if cerr or not last_seq then return nil, cerr end
        if key then
            local replayed, rerr = receipts.replay(key, c.receipt, last_seq, cover)
            if rerr or replayed then return replayed, rerr end
        end
        local attempt, berr = c.build(last_seq)
        if berr or not attempt then
            if key then
                -- A winner can fold after the lookup and change the planner's inputs.
                local winner, rerr = receipts.replay(key, c.receipt, last_seq, cover)
                if rerr or winner then return winner, rerr end
            end
            return nil, berr
        end
        local position: receipts.Position = { catalog_seq = attempt.catalog_seq, as_of = attempt.as_of }
        local events = attempt.events
        if #events == 0 then
            local saved: boolean? = true
            if key then
                local replayed, rerr = receipts.replay(key, c.receipt, attempt.as_of, cover)
                if rerr or replayed then return replayed, rerr end
                if c.noop then
                    saved, rerr = receipts.save_noop(c.noop, key, attempt.result, position)
                    if rerr then return nil, rerr end
                end
            end
            if saved == true then return receipts.stamp(attempt.result, nil, attempt.as_of, nil), nil end
        else
            local at = clock.now()
            for _, event in ipairs(events) do
                local body = event.body :: types.JsonObject
                body.actor = c.actor
                body.at = at
            end
            if key then receipts.mark(events, key, c.thread.source, attempt.result, attempt.receipt_after_fold) end
            if c.trace_context then
                for _, event in ipairs(events) do event.trace_context = c.trace_context end
            end
            local reserved, rerr = true, nil :: error?
            if key and c.reserve then reserved, rerr = c.reserve(key.marker, key.request_hash, position, at) end
            if rerr then return nil, rerr end
            local max_seq: integer?
            local aerr: error?
            if reserved then
                max_seq, aerr = threads.append(c.client, c.thread.id, events, attempt.expect)
            else
                aerr = errors.new({ kind = errors.CONFLICT, message = "projection moved", details = { reason = "head_mismatch" } })
            end
            if aerr then
                if key and aerr:kind() == errors.CONFLICT then
                    if not c.receipt_requires_head then
                        local winner, werr = receipts.replay(key, c.receipt, nil, cover)
                        if werr or winner then return winner, werr end
                    end
                    local as_of, herr = covered(c, until_at)
                    if herr or not as_of then return nil, herr end
                    local winner, werr = receipts.replay(key, c.receipt, as_of, cover)
                    if werr or winner then return winner, werr end
                end
                if not threads.mismatch(aerr, "head_mismatch") and not threads.mismatch(aerr, "version_mismatch") then
                    return nil, errors.wrap(aerr, "append failed")
                end
            else
                local as_of, derr = covered(c, until_at, max_seq :: integer)
                if derr or not as_of then return nil, derr end
                return receipts.finish(key, c.receipt, attempt.result, max_seq, as_of, attempt.receipt_after_fold, cover)
            end
        end
    end
    return nil, errors.new({ kind = errors.UNAVAILABLE, retryable = true, message = "the thread is busy", details = { code = "busy" } })
end

return M
