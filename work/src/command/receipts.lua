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
local policy = require("policy")
local expiry = require("expiry")
local uuid = require("uuid")
local M = {}

function M.trace(raw: domain.TraceContext?, kind: string): (domain.TraceContext?, error?)
    local context, err = trace.normalize(raw)
    if err then return nil, err end
    if not context then context = trace.begin(kind) end
    return context :: domain.TraceContext, nil
end

function M.command(board_id: string, key: string): (types.Durable?, error?)
    local db, err = store.open()
    if not db then return nil, err end
    local window, werr = policy.event_window(db, board_id)
    if werr or not window then db:release(); return nil, werr end
    local params: domain.SqlParams = { board_id, key }
    local age = ""
    if window.before then
        params[3] = window.before
        age = " AND (at >= $3 OR " .. expiry.PROTECTED_RECEIPT .. ")"
    end
    local rows, rerr = db:query("SELECT request_hash, principal, result, seq FROM kickside_work_receipt WHERE board_id = $1 AND command_key = $2" .. age, params)
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

function M.subject(key: string): string
    -- A fixed shard set bounds Core subject rows independently of command-key cardinality.
    return "command:" .. tostring(hash.sha256(key)):sub(1, 2)
end

function M.claim(board_id: string, key: string, hashed: string, result: domain.JsonObject, head: integer?, version: integer?): types.Write
    return { group = "command", events = { { type = consts.EVENTS.COMMAND_RECORDED,
        subject = M.subject(key), body = { command_key = key, receipt = { request_hash = hashed, result = result } } } },
        ops = {}, expect_head = head, expect_subject = version and M.subject(key) or nil, expect_version = version, caller_expect = false }
end

function M.request_hash(value: unknown): string
    return tostring(hash.sha256(values.canonical(value)))
end

-- version reads the claim-shard append guard.
function M.version(board_id: string, key: string, deadline: domain.Deadline): (integer?, error?)
    local result, err = funcs.call("kickside.work.service:sync", { board_id = board_id, deadline = deadline, command_key = key })
    if err then return nil, err end
    return result :: integer, nil
end

-- covered waits for a committed sequence, or for the sampled head if omitted.
function M.covered(board_id: string, deadline: domain.Deadline, target_seq: integer?): (integer?, error?)
    local result, err = funcs.call("kickside.work.service:sync", { board_id = board_id, deadline = deadline, target_seq = target_seq })
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

-- mark gives every event its external identity and records the receipt at the write's final sequence.
function M.mark(events: { domain.Event }, marker: string, receipt: domain.Receipt?, stored_key: string?)
    local delivery = uuid.v4()
    for n, event in ipairs(events) do
        event.external = { external_source = consts.EXTERNAL_SOURCE .. "/" .. delivery, external_id = n == 1 and marker or (marker .. "/" .. n) }
    end
    local last = events[#events]
    if receipt and last then
        last.body.receipt = receipt
        last.body.command_key = stored_key or marker
    end
end

function M.apply_outcomes(found: types.Durable): { types.Outcome }
    local result = found.receipt.result :: { outcomes: { types.Outcome }? }
    return result.outcomes or {}
end

function M.apply_hash(request: types.ApplyRequest, mode: string, ops: { types.Op }, source: string): string
    return M.request_hash({ op = "apply", mode, ops, source, origin = request.origin, expected_head = request.expected_head })
end

function M.legacy_apply(ctx: types.ApplyContext, provider: types.AtomicProvider?): (types.Durable?, error?)
    local key = ctx.request.key
    if not provider or not provider.legacy_ops or not key then return nil, nil end
    local hit, err = M.command(ctx.board_id, "apply/" .. provider.namespace .. "/" .. key)
    if err or not hit then return nil, err end
    -- Legacy keys share the WorkApply namespace, so validate the resolved operation.
    local ops, oerr = provider.legacy_ops()
    if oerr then return nil, oerr end
    if not ops or hit.receipt.request_hash ~= M.apply_hash(ctx.request, "atomic", ops, ctx.source) then
        return nil, M.conflict_of()
    end
    local outcomes = M.apply_outcomes(hit)
    if #outcomes ~= 1 or outcomes[1].status ~= "applied" then return nil, M.conflict_of() end
    return hit, nil
end

local function read_claim(reads: { command: (string, string) -> (types.Durable?, error?) }, ctx: types.ApplyContext, key: string): (types.Durable?, error?)
    local command, err = reads.command(ctx.board_id, key)
    if err then return nil, err end
    if command and command.receipt.request_hash ~= ctx.hashed then return nil, M.conflict_of() end
    return command, nil
end

function M.atomic_apply(ctx: types.ApplyContext, reads: {
    version: (string, string, domain.Deadline) -> (integer?, error?),
    command: (string, string) -> (types.Durable?, error?),
    covered: (string, domain.Deadline, integer?) -> (integer?, error?),
}?): (types.Durable?, error?)
    local key = ctx.base
    if not key then return nil, nil end
    local lookup = reads or M
    local version, version_err = lookup.version(ctx.board_id, key, ctx.until_at)
    if version_err or not version then return nil, version_err end
    ctx.claim_version = version
    local command, err = read_claim(lookup, ctx, key)
    if err or command then return command, err end
    local _, cover_err = lookup.covered(ctx.board_id, ctx.until_at)
    if cover_err then return nil, cover_err end
    return read_claim(lookup, ctx, key)
end

-- Independent commands leave one receipt per committed group.
local function read_groups(ctx: types.ApplyContext, key: string, groups: { string }): ({ [string]: types.Durable }?, boolean, error?)
    local found: { [string]: types.Durable } = {}
    local command, err = read_claim(M, ctx, key)
    if err then return nil, false, err end
    ctx.claimed = command ~= nil
    if not command then return found, false, nil end
    ctx.generation = command.receipt.result.generation :: string
    local complete = true
    for _, group in ipairs(groups) do
        local hit, ferr = M.command(ctx.board_id, key .. "/" .. ctx.generation .. "/" .. group)
        if ferr then return nil, false, ferr end
        if hit then found[group] = hit else complete = false end
    end
    return found, complete, nil
end

function M.group_receipts(ctx: types.ApplyContext, groups: { string }): ({ [string]: types.Durable }?, error?)
    local key = ctx.base
    if not key then return {}, nil end
    local version, version_err = M.version(ctx.board_id, key, ctx.until_at)
    if version_err or not version then return nil, version_err end
    ctx.claim_version = version
    local found, complete, err = read_groups(ctx, key, groups)
    if err or complete then return found, err end
    -- Cover commits that could have advanced the shard before we sampled its guard.
    local _, cover_err = M.covered(ctx.board_id, ctx.until_at)
    if cover_err then return nil, cover_err end
    local covered, _, read_err = read_groups(ctx, key, groups)
    return covered, read_err
end

local function claim_write(ctx: types.ApplyContext, result: domain.JsonObject): types.Write
    local write = M.claim(ctx.board_id, ctx.base :: string, ctx.hashed, result, nil, ctx.claim_version)
    M.decorate(write.events[1], guard.actor_id(), guard.stamp_now(), ctx.source, ctx.request.origin, ctx.request.trace_context)
    return write
end

function M.seal_group(ctx: types.ApplyContext, write: types.Write, outcomes: { types.Outcome }, free: boolean): ({ types.Write }, boolean)
    if not ctx.base then return { write }, false end
    M.mark(write.events, ctx.base .. "/" .. write.group, {
        request_hash = ctx.hashed, result = { outcomes = outcomes } :: domain.JsonObject,
    }, ctx.base .. "/" .. ctx.generation .. "/" .. write.group)
    -- Free groups still need the claim because they have no subject guard.
    if not ctx.claimed or free then return { claim_write(ctx, { generation = ctx.generation }), write }, true end
    return { write }, false
end

function M.seal_atomic(ctx: types.ApplyContext, writes: { types.Write }, outcomes: { types.Outcome })
    if not ctx.base then return end
    for _, write in ipairs(writes) do
        M.mark(write.events, ctx.base .. "/" .. write.group)
    end
    -- The claim is the only receipt. Projection can publish it only after every group.
    writes[#writes + 1] = claim_write(ctx, { outcomes = outcomes } :: domain.JsonObject)
end

return M
