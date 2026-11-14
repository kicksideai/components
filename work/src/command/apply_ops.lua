-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- The item command path. Item commands validate against the projection and append with one expectation per
-- existing item (the subject version), so edits to different items never conflict. Success waits until the
-- projection covers the append, so callers read their own writes.
local consts = require("consts")
local uuid = require("uuid")
local clock = require("clock")
local store = require("store")
local threads = require("threads")
local append = require("append")
local items = require("items")
local guard = require("guard")
local receipts = require("receipts")
local domain = require("domain")
local prepare_snapshot = require("prepare_snapshot")
local types = require("types")

local defaults = require("defaults")
local principals = require("principals")
local rules = require("rules")
local M = {}

-- status_of maps an append failure onto the outcome status that names it.
local function status_of(err: error): string
    local kind = err:kind()
    if kind == errors.PERMISSION_DENIED then return "denied" end
    if kind == errors.INVALID then return "invalid" end
    return "unavailable"
end

local function outcome_of(i: integer, plan: types.OpPlan): types.Outcome
    return { op = i, status = plan.status, item = plan.item, version = plan.version, comment = plan.comment, findings = plan.findings }
end

local function stored_outcomes(found: types.Durable): { types.Outcome }
    local result = found.receipt.result :: { outcomes: { types.Outcome }? }
    return result.outcomes or {}
end

-- fill_keys sets the item key on every outcome that names an item, from the
-- projection the command waited for.
local function fill_keys(board_id: string, outcomes: { types.Outcome }, replayed: boolean?): error?
    local ids: { string } = {}
    local seen: { [string]: boolean } = {}
    for _, o in ipairs(outcomes) do
        if o.item and not seen[o.item] then
            seen[o.item] = true
            ids[#ids + 1] = o.item
        end
    end
    if #ids == 0 then return nil end
    local db, err = store.open()
    if not db then return err end
    local board, berr = store.board(db, board_id)
    local rows, rerr
    if board then rows, rerr = store.items(db, board_id, ids) end
    db:release()
    if board and not berr and not rerr then berr = principals.resolve(board) end
    if berr or not board then return berr end
    if rerr or not rows then return rerr end
    local keys: { [string]: string } = {}
    for _, it in ipairs(rows) do
        if it.life ~= "purged" and rules.visible(board, it.document) then keys[it.item_id] = store.key_of(board.key_prefix, it.number) end
    end
    for _, o in ipairs(outcomes) do
        if o.item then
            if keys[o.item] then o.key = keys[o.item]
            else
                o.item, o.version, o.key, o.comment = nil, nil, nil, nil
                if replayed then
                    o.status = "invalid"
                    o.findings = { { code = "unknown_item", message = "item is unavailable" } }
                end
            end
        end
    end
    return nil
end

local function mismatch_subject(err: error): string?
    if not threads.mismatch(err, "version_mismatch") then return nil end
    local subject = (err:details() or {}).subject
    return type(subject) == "string" and subject or nil
end

-- roll_back marks an outcome as not applied because the command did not land.
local function roll_back(outcome: types.Outcome)
    outcome.status = "unchanged"
    outcome.rolled_back = true
end

local function conflict_outcomes(outcomes: { types.Outcome }, write: types.Write, plans: { types.OpPlan })
    for _, i in ipairs(write.ops) do
        local o = outcome_of(i, plans[i] :: types.OpPlan)
        o.status = "conflict"
        o.version = nil
        o.findings = { { code = "version_mismatch", message = "item changed since the command read it" } }
        outcomes[i] = o
    end
end

local function finish(ctx: types.ApplyContext, outcomes: { [integer]: types.Outcome }, applied: boolean, seq: integer?, replayed: boolean?): (types.ApplyResult?, error?)
    local as_of, cu_err = receipts.covered(ctx.board_id, ctx.until_at)
    if cu_err or not as_of then return nil, cu_err end
    local list: { types.Outcome } = {}
    for i = 1, #ctx.ops do list[i] = outcomes[i] end
    local kerr = fill_keys(ctx.board_id, list, replayed)
    if kerr then return nil, kerr end
    return { outcomes = list, applied = applied, seq = seq, as_of = as_of, replayed = replayed }, nil
end

-- groups_of partitions op indices by the write group they join, in order of first appearance.
local function groups_of(ops: { types.Op }, indices: { integer }): ({ string }, { [string]: { integer } })
    local groups: { [string]: { integer } } = {}
    local order: { string } = {}
    for _, i in ipairs(indices) do
        local g = items.group_of(ops[i])
        if not groups[g] then
            groups[g] = {}
            order[#order + 1] = g
        end
        table.insert(groups[g], i)
    end
    return order, groups
end

-- stored looks up the receipts earlier runs of this keyed command left, one per
-- write group, and refuses a key reused for a different request.
local function stored(ctx: types.ApplyContext, indices: { integer }): ({ [string]: types.Durable }?, error?)
    local found: { [string]: types.Durable } = {}
    if not ctx.base then return found, nil end
    local _, cerr = receipts.covered(ctx.board_id, ctx.until_at)
    if cerr then return nil, cerr end
    local command, err = receipts.command(ctx.board_id, ctx.base)
    if err then return nil, err end
    ctx.claimed = command ~= nil
    if command and command.receipt.request_hash ~= ctx.hashed then return nil, receipts.conflict_of() end
    if not command then return found, nil end
    ctx.generation = command.receipt.result.generation :: string
    local order = groups_of(ctx.ops, indices)
    for _, g in ipairs(order) do
        local hit, ferr = receipts.command(ctx.board_id, ctx.base .. "/" .. ctx.generation .. "/" .. g)
        if ferr then return nil, ferr end
        if hit then found[g] = hit end
    end
    return found, nil
end

local function claim(ctx: types.ApplyContext, writes: { types.Write }, head: integer)
    if ctx.base and not ctx.claimed and #writes > 0 then
        local write = receipts.claim(ctx.board_id, ctx.base, ctx.hashed, { generation = ctx.generation }, head)
        receipts.decorate(write.events[1], guard.actor_id(), guard.stamp_now(), ctx.source, ctx.request.origin, ctx.request.trace_context)
        table.insert(writes, 1, write)
    end
end

-- seal marks each write's events with the command key and its group, and gives
-- the first event of every write the receipt of the command.
local function seal(ctx: types.ApplyContext, writes: { types.Write }, result_of: (types.Write) -> domain.JsonObject)
    local base = ctx.base
    if not base then return end
    for _, w in ipairs(writes) do
        receipts.mark(w.events, base .. "/" .. w.group, { request_hash = ctx.hashed, result = result_of(w) }, base .. "/" .. ctx.generation .. "/" .. w.group)
    end
end

local function run_atomic(ctx: types.ApplyContext): (types.ApplyResult?, error?)
    local all: { integer } = {}
    for i = 1, #ctx.ops do all[i] = i end
    for _ = 1, consts.LIMITS.prepare_retries + 1 do
        if clock.passed(ctx.until_at) then break end
        local found, ferr = stored(ctx, all)
        if ferr or not found then return nil, ferr end
        for _, hit in pairs(found) do
            local by_op: { [integer]: types.Outcome } = {}
            for _, o in ipairs(stored_outcomes(hit)) do by_op[o.op] = o end
            return finish(ctx, by_op, true, hit.seq, true)
        end
        local last_seq, cu_err = receipts.covered(ctx.board_id, ctx.until_at)
        if cu_err or not last_seq then return nil, cu_err end
        local db, derr = store.open()
        if not db then return nil, derr end
        local actor, at = guard.actor_id(), guard.stamp_now()
        local board, plans, berr = prepare_snapshot.read(db, ctx.board_id, ctx.ops, all, actor, at, ctx.settings, ctx.until_at)
        db:release()
        if berr then return nil, berr end
        if not board then return nil, errors.new({ details = { code = "board_schema_missing" }, kind = errors.NOT_FOUND, message = "board has no schema" }) end
        local outcomes: { types.Outcome } = {}
        local failed = false
        for i = 1, #ctx.ops do
            outcomes[i] = outcome_of(i, plans[i] :: types.OpPlan)
            if plans[i].status ~= "applied" and plans[i].status ~= "unchanged" then failed = true end
        end
        local recovered, recovery_err = stored(ctx, all)
        if recovery_err then return nil, recovery_err end
        for _, hit in pairs(recovered or {}) do
            local by_op: { [integer]: types.Outcome } = {}
            for _, o in ipairs(stored_outcomes(hit)) do by_op[o.op] = o end
            return finish(ctx, by_op, true, hit.seq, true)
        end
        if failed then
            for i = 1, #ctx.ops do
                if plans[i].status == "applied" or plans[i].status == "unchanged" then roll_back(outcomes[i]) end
            end
            return finish(ctx, outcomes, false, nil, nil)
        end
        local writes: { types.Write } = items.writes(plans, all, ctx.ops)
        if #writes == 0 then return finish(ctx, outcomes, false, nil, nil) end
        for _, w in ipairs(writes) do
            -- The covered cursor includes sibling outputs the item projection skips.
            if w.expect_head and (not w.thread_id or w.thread_id == ctx.board_id) then
                w.expect_head = math.max(w.expect_head, last_seq)
            end
            for _, raw in ipairs(w.events) do
                local event = raw :: domain.Event
                receipts.decorate(event, actor, at, ctx.source, ctx.request.origin, ctx.request.trace_context)
                event.body.audit = board.compiled.policy.audit
            end
        end
        seal(ctx, writes, function(_: types.Write): domain.JsonObject return { outcomes = outcomes } end)
        if ctx.base then for _, write in ipairs(writes) do write.expect_head = last_seq end end
        claim(ctx, writes, last_seq)
        local max_seq, aerr = append.writes(ctx.c, ctx.board_id, writes)
        if not aerr then
            local found, ferr = stored(ctx, all)
            if ferr then return nil, ferr end
            for _, hit in pairs(found or {}) do
                local by_op: { [integer]: types.Outcome } = {}
                for _, o in ipairs(stored_outcomes(hit)) do by_op[o.op] = o end
                return finish(ctx, by_op, true, max_seq, nil)
            end
            return finish(ctx, outcomes, true, max_seq, nil)
        end
        local found, ferr = stored(ctx, all)
        if ferr then return nil, ferr end
        for _, hit in pairs(found or {}) do
            local by_op: { [integer]: types.Outcome } = {}
            for _, o in ipairs(stored_outcomes(hit)) do by_op[o.op] = o end
            return finish(ctx, by_op, true, hit.seq, true)
        end
        local subject = mismatch_subject(aerr)
        if not subject and not threads.mismatch(aerr, "head_mismatch") then return nil, errors.wrap(aerr, "board append failed") end
        for _, w in ipairs(writes) do
            if w.expect_subject == subject and w.caller_expect then
                for i = 1, #ctx.ops do roll_back(outcomes[i]) end
                conflict_outcomes(outcomes, w, plans)
                return finish(ctx, outcomes, false, nil, nil)
            end
        end
    end
    return nil, guard.busy()
end

local function run_independent(ctx: types.ApplyContext): (types.ApplyResult?, error?)
    local pending: { integer } = {}
    for i = 1, #ctx.ops do pending[i] = i end
    local outcomes: { types.Outcome } = {}
    local last_append: integer? = nil
    local replayed = false
    local wrote = false
    local function recover(): error?
        local found, err = stored(ctx, pending)
        if err or not found then return err end
        local order, groups = groups_of(ctx.ops, pending)
        local remaining: { integer } = {}
        for _, group in ipairs(order) do
            local hit = found[group]
            if hit then
                for _, outcome in ipairs(stored_outcomes(hit)) do outcomes[outcome.op] = outcome end
                if not last_append or hit.seq > last_append then last_append = hit.seq end
                replayed = true
            else
                for _, i in ipairs(groups[group]) do remaining[#remaining + 1] = i end
            end
        end
        table.sort(remaining)
        pending = remaining
        return nil
    end
    for _ = 1, consts.LIMITS.prepare_retries + 1 do
        if #pending == 0 or clock.passed(ctx.until_at) then break end
        local recovery_err = recover()
        if recovery_err then return nil, recovery_err end
        if #pending == 0 then break end
        local last_seq, cu_err = receipts.covered(ctx.board_id, ctx.until_at)
        if cu_err or not last_seq then return nil, cu_err end
        local db, derr = store.open()
        if not db then return nil, derr end
        local actor, at = guard.actor_id(), guard.stamp_now()
        local board, plans, berr = prepare_snapshot.read(db, ctx.board_id, ctx.ops, pending, actor, at, ctx.settings, ctx.until_at)
        db:release()
        if berr then return nil, berr end
        if not board then return nil, errors.new({ details = { code = "board_schema_missing" }, kind = errors.NOT_FOUND, message = "board has no schema" }) end
        local recovery_err = recover()
        if recovery_err then return nil, recovery_err end
        if #pending == 0 then break end
        local writes: { types.Write } = items.writes(plans, pending, ctx.ops)
        local in_write: { [integer]: boolean } = {}
        for _, w in ipairs(writes) do
            for _, i in ipairs(w.ops) do in_write[i] = true end
        end
        local retry: { integer } = {}
        for _, i in ipairs(pending) do
            if not in_write[i] then outcomes[i] = outcome_of(i, plans[i] :: types.OpPlan) end
        end
        for _, raw_write in ipairs(writes) do
            local w = raw_write :: types.Write
            local w_outcomes: { types.Outcome } = {}
            for _, i in ipairs(w.ops) do w_outcomes[#w_outcomes + 1] = outcome_of(i, plans[i] :: types.OpPlan) end
            for _, raw in ipairs(w.events) do
                local event = raw :: domain.Event
                receipts.decorate(event, actor, at, ctx.source, ctx.request.origin, ctx.request.trace_context)
                event.body.audit = board.compiled.policy.audit
            end
            seal(ctx, { w }, function(_: types.Write): domain.JsonObject return { outcomes = w_outcomes } end)
            if ctx.base then w.expect_head = last_seq end
            local batch: { types.Write } = { w }
            claim(ctx, batch, last_seq)
            local max_seq, aerr = append.writes(ctx.c, ctx.board_id, batch)
            if aerr and ctx.base then
                local found, ferr = stored(ctx, w.ops)
                if ferr then return nil, ferr end
                if found and found[w.group] then
                    local hit = found[w.group]
                    w_outcomes = stored_outcomes(hit)
                    max_seq, aerr = hit.seq, nil
                end
            end
            if not aerr then
                if ctx.base then ctx.claimed = true end
                for _, o in ipairs(w_outcomes) do outcomes[o.op] = o end
                last_seq = max_seq :: integer
                wrote = true
                if not last_append or (max_seq :: integer) > last_append then last_append = max_seq end
            elseif threads.mismatch(aerr, "head_mismatch") or (mismatch_subject(aerr) and (not w.caller_expect or mismatch_subject(aerr) ~= w.expect_subject)) then
                for _, i in ipairs(w.ops) do retry[#retry + 1] = i end
            elseif mismatch_subject(aerr) then
                conflict_outcomes(outcomes, w, plans)
            else
                local status = status_of(aerr)
                for _, i in ipairs(w.ops) do
                    outcomes[i] = { op = i, status = status, findings = { { code = status, message = aerr:message() } } }
                end
            end
        end
        table.sort(retry)
        pending = retry
    end
    for _, i in ipairs(pending) do
        outcomes[i] = { op = i, status = "conflict", findings = { { code = "busy", message = "item kept changing while the command ran" } } }
    end
    return finish(ctx, outcomes, wrote or replayed, last_append, (replayed and not wrote) and true or nil)
end

-- apply(request) runs item ops. Needs WRITE; deleting and restoring also need DELETE.
function M.apply(request: types.ApplyRequest, boundary: domain.Deadline?): (types.ApplyResult?, error?)
    local context, trace_err = receipts.trace(request.trace_context, "work.apply")
    if trace_err then return nil, trace_err end
    request.trace_context = context
    local board_id = request.board_id
    local access_err = guard.require_access(board_id, guard.write_access())
    if access_err then return nil, access_err end
    local mode = request.mode or "atomic"
    if mode ~= "atomic" and mode ~= "independent" then return nil, guard.invalid("mode must be atomic or independent") end
    if #request.ops == 0 then return nil, guard.invalid("ops required") end
    if #request.ops > consts.LIMITS.ops then return nil, guard.invalid("an apply takes at most " .. consts.LIMITS.ops .. " ops") end
    local key = request.key
    if key ~= nil and (key == "" or #key > 255) then return nil, guard.invalid("key is 1 to 255 characters") end
    local settings, serr = defaults.read()
    if serr or not settings then return nil, serr end
    local c, cerr = threads.open()
    if not c then return nil, cerr end
    local source = request.source or "api"
    local until_at = clock.deadline(consts.LIMITS.command_deadline_ms)
    if boundary and boundary.ns < until_at.ns then until_at = boundary end
    local ctx: types.ApplyContext = {
        settings = settings, c = c, board_id = board_id, request = request, ops = request.ops, source = source,
        hashed = receipts.request_hash({ op = "apply", mode, request.ops, source, origin = request.origin }), base = key and ("apply/" .. key) or nil,
        until_at = until_at, generation = uuid.v4(),
    }
    if mode == "atomic" then return run_atomic(ctx) end
    return run_independent(ctx)
end

return M
