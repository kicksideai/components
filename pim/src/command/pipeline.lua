-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local failure=require("failure")
-- The command pipeline: the single way PIM appends to a catalog thread. An
-- attempt is built against the projection at the thread's current position and
-- appended under the guard it names; losing that race rebuilds it until the
-- deadline. Success waits until the projection covers the append, so
-- callers read their own writes. An idempotent command marks its events with
-- external ids and stores a receipt, so a retry or a concurrent run replays the
-- first result.
local hash = require("hash")
local clock = require("clock")
local threads = require("threads")
local values = require("values")
local types = require("types")

local M = {}

-- Thread names a catalog thread: its id, the projection kind that folds
-- it, its external-id source.
type Thread = { id: string, kind: string, source: string }
-- Attempt is one try: the result to answer, the events to append, the append
-- guard, and the position the result reflects when nothing is appended.
type Attempt = { result: types.JsonObject, events: { types.Event }, expect: threads.Expect?, as_of: integer, receipt_after_fold: boolean? }
-- Build makes an attempt at the projection's position.
type Build = (integer) -> (Attempt?, error?)
type Command = {
    client: threads.Client, thread: Thread, actor: string, deadline_ms: integer, deadline: clock.Deadline?, fingerprint: unknown,
    reserve: ((string,string,integer,string) -> (boolean?,error?))?,
    noop: ((string,string,types.JsonObject,integer,string) -> (boolean?,error?))?,
    receipt: ((string) -> (types.Receipt?, integer?, error?))?, idempotency: types.Idempotency?, trace_context: types.TraceContext?, build: Build,
}
M.Thread = Thread
M.Attempt = Attempt
M.Build = Build
M.Command = Command

local function request_hash(value: unknown): string
    return tostring(hash.sha256(values.canonical(value)))
end

-- Identifies an apply request for receipt replay.
function M.apply_fingerprint(request: types.ApplyRequest): unknown
    return { op = "apply", items = request.items, mode = request.mode or "atomic", source = request.source or "",
        import = request.import == true or nil, expected_generation = request.expected_generation, origin = request.origin,
        provenance = request.provenance, approval_item_id = request.approval_item_id }
end

function M.marker(idempotency: types.Idempotency, actor: string): string
    return "r:" .. #idempotency.namespace .. ":" .. idempotency.namespace .. #idempotency.key .. ":" .. idempotency.key
        .. #actor .. ":" .. actor
end

-- covered waits until the projection reaches the thread head; missing the
-- deadline is a retryable unavailability.
local function covered(c: Command, deadline: clock.Deadline): (integer?, error?)
    local caught, err = threads.catch_up(c.client, c.thread.id, c.thread.kind, deadline)
    if err or not caught then return nil, err end
    local last_seq = caught.last_seq
    if not caught.done or not last_seq then
        return nil, errors.new({ details = { code = "projection_behind" }, kind = errors.UNAVAILABLE, retryable = true, message = "the projection did not reach the thread head" })
    end
    return last_seq, nil
end

local function stamp(result: types.JsonObject, seq: integer?, as_of: integer, replayed: boolean?): types.JsonObject
    result.seq = seq
    result.as_of = as_of
    result.replayed = replayed
    return result
end

-- replay answers from the receipt of an earlier run of the same command, or
-- nil when there is none. A receipt with another request hash means the key was
-- reused for a different request.
local function replay(c: Command, marker: string, hashed: string, as_of: integer, deadline: clock.Deadline): (types.JsonObject?, error?)
    local read_receipt = c.receipt
    if not read_receipt then return nil, failure.corrupt("idempotent command has no receipt reader") end
    local receipt, seq, ferr = read_receipt(marker)
    if ferr then return nil, ferr end
    if not receipt or not seq then return nil, nil end
    if receipt.request_hash ~= hashed then
        return nil, errors.new({ kind = errors.CONFLICT, message = "idempotency key reused with a different request",
            details = { code = "idempotency_conflict" } })
    end
    if receipt.event_count == 0 and not receipt.noop then return nil,nil end
    local stored = receipt.result
    if not stored then return nil, failure.corrupt("stored receipt has no result") end
    local count = type(receipt.event_count) == "number" and math.tointeger(receipt.event_count) or nil
    if not count or count < (receipt.noop and 0 or 1) then
        return nil, failure.corrupt("stored receipt has no valid event count")
    end
    local final_seq = not receipt.noop and seq + count - 1 or nil
    if (final_seq or seq) > as_of then
        local caught, cerr = covered(c, deadline)
        if cerr or not caught then return nil, cerr end
        as_of = caught
    end
    return stamp(stored, final_seq, as_of, true), nil
end

-- run executes a command and returns its result with seq, as_of and, for a
-- replay, replayed. An idempotent command looks for its receipt on every
-- attempt and before answering that nothing changed: a concurrent run of the
-- same command may have appended since the last look, and both answer alike.
function M.run(c: Command): (types.JsonObject?, error?)
    local until_at = clock.deadline(c.deadline_ms)
    if c.deadline and c.deadline.ns < until_at.ns then until_at = c.deadline end
    local marker: string? = nil
    local hashed: string? = nil
    local idempotency = c.idempotency
    if idempotency then
        if idempotency.namespace == "" or idempotency.key == "" then
            return nil, errors.new({ details = { code = "idempotency_key_invalid" }, kind = errors.INVALID, message = "idempotency needs namespace and key" })
        end
        marker = M.marker(idempotency, c.actor)
        hashed = request_hash({ actor = c.actor, command = c.fingerprint })
    end
    while not clock.passed(until_at) do
        local last_seq, cerr = covered(c, until_at)
        if cerr or not last_seq then return nil, cerr end
        if marker and hashed then
            local replayed, rerr = replay(c, marker, hashed, last_seq, until_at)
            if rerr then return nil, rerr end
            if replayed then return replayed, nil end
        end
        local attempt, berr = c.build(last_seq)
        if berr or not attempt then
            if marker and hashed then
                -- A winner can fold after the lookup and change the planner's inputs.
                local winner, rerr = replay(c, marker, hashed, last_seq, until_at)
                if rerr or winner then return winner, rerr end
            end
            return nil, berr
        end
        local events: {types.Event} = attempt.events
        local noop = #events == 0
        if noop and marker and hashed then
            local replayed, rerr = replay(c, marker, hashed, attempt.as_of, until_at)
            if rerr then return nil, rerr end
            if replayed then return replayed, nil end
        end
        if #events == 0 then
            local retry=false
            if marker and hashed and c.noop then
                local successful=attempt.result.class=="unchanged"
                if type(attempt.result.outcomes)=="table" then
                    successful=true
                    for _,outcome in ipairs(attempt.result.outcomes :: {types.Outcome}) do
                        if outcome.outcome ~= "unchanged" and outcome.outcome ~= "queued" then successful = false end
                    end
                end
                if successful then
                    local saved,err=c.noop(marker,hashed,attempt.result,attempt.as_of,clock.now())
                    if err then return nil,err end
                    retry=saved~=true
                end
            end
            if not retry then return stamp(attempt.result,nil,attempt.as_of,nil),nil end
        else
        local at = clock.now()
        for n, event in ipairs(events) do
            if marker then
                event.external = { external_source = c.thread.source, external_id = n == 1 and marker or ("e:" .. #marker .. ":" .. marker .. ":" .. n) }
            end
            local body = event.body :: { [string]: unknown }
            body.actor = c.actor
            body.at = at
        end
        if marker then
            local body = events[attempt.receipt_after_fold and #events or 1].body :: types.JsonObject
            body.receipt = { request_hash = hashed, result = attempt.result, event_count = #events,
                marker = marker, noop = noop, after_fold = attempt.receipt_after_fold or nil }
        end
        if c.trace_context then
            for _, event in ipairs(events) do event.trace_context = c.trace_context end
        end
        local reserved,rerr=true,nil :: error?
        if marker and hashed and c.reserve then reserved,rerr=c.reserve(marker,hashed,attempt.as_of,at) end
        if rerr then return nil,rerr end
        local max_seq: integer?
        local aerr: error?
        if reserved then max_seq,aerr=threads.append(c.client,c.thread.id,events,attempt.expect)
        else aerr=errors.new({kind=errors.CONFLICT,message="projection moved",details={reason="head_mismatch"}}) end
        if aerr then
            if marker and hashed and aerr:kind()==errors.CONFLICT then
                local as_of,cerr=covered(c,until_at)
                if cerr or not as_of then return nil,cerr end
                local winner,werr=replay(c,marker,hashed,as_of,until_at)
                if werr then return nil,werr end
                if winner then return winner,nil end
            end
            if not threads.mismatch(aerr, "head_mismatch") and not threads.mismatch(aerr, "version_mismatch") then
                return nil, errors.wrap(aerr, "append failed")
            end
        else
            local as_of, derr = covered(c, until_at)
            if derr or not as_of then return nil, derr end
            if marker and hashed and attempt.receipt_after_fold then
                local result, rerr = replay(c, marker, hashed, as_of, until_at)
                if rerr then return nil, rerr end
                if not result then return nil, failure.corrupt("projected release receipt is missing") end
                return stamp(result, max_seq, as_of, nil), nil
            end
            local result_seq = max_seq
            if noop then result_seq = nil end
            return stamp(attempt.result, result_seq, as_of, nil), nil
        end
        end
    end
    return nil, errors.new({ kind = errors.UNAVAILABLE, retryable = true, message = "the thread is busy", details = { code = "busy" } })
end

return M
