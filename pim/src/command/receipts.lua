-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local clock = require("clock")
local failure = require("failure")
local hash = require("hash")
local types = require("types")
local values = require("values")

local M = {}

type Key = { marker: string, request_hash: string }
type Position = { catalog_seq: integer, as_of: integer }
type Read = (string) -> (types.Receipt?, integer?, error?)
type SaveNoop = (string, string, types.JsonObject, Position, string) -> (boolean?, error?)
type Callbacks = {
    reserve: ((string, string, Position, string) -> (boolean?, error?))?,
    noop: SaveNoop?, receipt: Read?, receipt_requires_head: boolean?,
}
type Cover = (integer) -> (integer?, error?)
M.Position = Position
M.Callbacks = Callbacks

function M.apply_fingerprint(request: types.ApplyRequest): unknown
    return { op = "apply", items = request.items, mode = request.mode or "atomic", source = request.source or "",
        import = request.import == true or nil, expected_generation = request.expected_generation, origin = request.origin,
        provenance = request.provenance, approval_item_id = request.approval_item_id }
end

function M.marker(idempotency: types.Idempotency, actor: string): string
    return "r:" .. #idempotency.namespace .. ":" .. idempotency.namespace .. #idempotency.key .. ":" .. idempotency.key
        .. #actor .. ":" .. actor
end

function M.key(idempotency: types.Idempotency?, actor: string, fingerprint: unknown): (Key?, error?)
    if not idempotency then return nil, nil end
    if idempotency.namespace == "" or idempotency.key == "" then
        return nil, errors.new({ details = { code = "idempotency_key_invalid" }, kind = errors.INVALID,
            message = "idempotency needs namespace and key" })
    end
    return { marker = M.marker(idempotency, actor),
        request_hash = tostring(hash.sha256(values.canonical({ actor = actor, command = fingerprint }))) }, nil
end

function M.stamp(result: types.JsonObject, seq: integer?, as_of: integer, replayed: boolean?): types.JsonObject
    result.seq = seq
    result.as_of = as_of
    result.replayed = replayed
    return result
end

function M.replay(key: Key, read: Read?, as_of: integer?, cover: Cover): (types.JsonObject?, error?)
    if not read then return nil, failure.corrupt("idempotent command has no receipt reader") end
    local receipt, seq, err = read(key.marker)
    if err then return nil, err end
    if not receipt or not seq then return nil, nil end
    if receipt.request_hash ~= key.request_hash then
        return nil, errors.new({ kind = errors.CONFLICT, message = "idempotency key reused with a different request",
            details = { code = "idempotency_conflict" } })
    end
    if receipt.event_count == 0 and not receipt.noop then return nil, nil end
    local stored = receipt.result
    if not stored then return nil, failure.corrupt("stored receipt has no result") end
    local count = type(receipt.event_count) == "number" and math.tointeger(receipt.event_count) or nil
    if not count or count < (receipt.noop and 0 or 1) then
        return nil, failure.corrupt("stored receipt has no valid event count")
    end
    local result_seq = not receipt.noop and seq + count - 1 or nil
    local target = result_seq or seq
    if not as_of or as_of < target then
        as_of, err = cover(target)
        if err or not as_of then return nil, err end
    end
    return M.stamp(stored, result_seq, as_of, true), nil
end

function M.mark(events: { types.Event }, key: Key, source: string, result: types.JsonObject, after_fold: boolean?)
    local marker = key.marker
    for n, event in ipairs(events) do
        event.external = { external_source = source, external_id = n == 1 and marker or ("e:" .. #marker .. ":" .. marker .. ":" .. n) }
    end
    local body = events[after_fold and #events or 1].body :: types.JsonObject
    body.receipt = { request_hash = key.request_hash, result = result, event_count = #events,
        marker = marker, noop = false, after_fold = after_fold or nil }
end

function M.save_noop(save: SaveNoop, key: Key, result: types.JsonObject, position: Position): (boolean?, error?)
    local outcomes = result.outcomes
    if type(outcomes) == "table" then
        for _, outcome in ipairs(outcomes :: { types.Outcome }) do
            if outcome.outcome ~= "unchanged" and outcome.outcome ~= "queued" then return true, nil end
        end
    elseif result.class ~= "unchanged" then
        return true, nil
    end
    return save(key.marker, key.request_hash, result, position, clock.now())
end

function M.finish(key: Key?, read: Read?, result: types.JsonObject, seq: integer?, as_of: integer, after_fold: boolean?,
    cover: Cover): (types.JsonObject?, error?)
    if key and after_fold then
        local projected, err = M.replay(key, read, as_of, cover)
        if err then return nil, err end
        if not projected then return nil, failure.corrupt("projected release receipt is missing") end
        result = projected
    end
    return M.stamp(result, seq, as_of, nil), nil
end

return M
