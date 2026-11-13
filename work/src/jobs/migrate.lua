-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Follow migration (spec 4.7). A schema apply that changes the definition of a follow process starts a board
-- job under the execution identity the board component holds. Each batch moves up to 500 items that run an older
-- definition: one item.migrated event per item, appended with the item's version as the expectation, which
-- stamps the item's process generation in the fold. An item that changed meanwhile is read again by the next batch.
local security = require("security")
local sql = require("sql")
local time = require("time")
local component = require("component")
local consts = require("consts")
local store = require("store")
local job_rows = require("job_rows")
local deadline = require("deadline")
local threads = require("threads")
local append = require("append")
local types = require("types")
local domain = require("domain")
local process = require("process")
local flow = require("flow")
local prepare = require("prepare_context")
local when = require("when")
local principals = require("principals")

local receipts = require("receipts")
local M = {}

local STAMP = "2006-01-02T15:04:05.000000000Z"

-- route composes each intervening generation from the item's recorded definition.
local function route_state(db: sql.DB | sql.Transaction, board: domain.Board, item: domain.Item, p: domain.Process, state: string,
    generations: { [integer]: { compiled: domain.Compiled, maps: domain.StateMaps } }): (string?, error?)
    for generation = item.process_generation + 1, p.generation do
        local row = generations[generation]
        if not row then
            local found, err = store.generation(db, board.board_id, generation)
            if err then return nil, err end
            if not found then return nil, errors.new({ kind = errors.INTERNAL, message = "migration generation is absent", details = { code = "process_generation_missing" } }) end
            row = found
            generations[generation] = row
        end
        local definition: domain.Process? = nil
        for _, candidate in ipairs(row.compiled.processes) do if candidate.id == p.id then definition = candidate end end
        if not definition then return nil, errors.new({ kind = errors.INVALID, message = "migration process is absent", details = { code = "migration_process_missing" } }) end
        local declared = false
        for _, candidate in ipairs(definition.states) do if candidate.id == state then declared = true end end
        if not declared then
            local mapped = (row.maps[p.id] or {})[state]
            if not mapped then return nil, nil end
            state = mapped
        end
    end
    return state, nil
end

local function route(db: sql.DB, board: domain.Board, item: domain.Item, p: domain.Process,
    generations: { [integer]: { compiled: domain.Compiled, maps: domain.StateMaps } }): ({ [string]: string }?, error?)
    local state_map: { [string]: string } = {}
    local state, err = route_state(db, board, item, p, item.state, generations)
    if err or not state then return nil, err end
    if state ~= item.state then state_map[item.state] = state; return state_map, nil end
    for _, held in pairs(item.work and item.work.regions or {}) do
        local target, rerr = route_state(db, board, item, p, held, generations)
        if rerr or not target then return nil, rerr end
        if target ~= held then state_map[held] = target end
    end
    return state_map, nil
end

local function migrated_event(item: domain.Item, p: domain.Process, state_map: { [string]: string }, actor: string, at: string, trace_context: domain.TraceContext?): domain.Event
    return { trace_context = trace_context, type = consts.EVENTS.ITEM_MIGRATED, subject = "i:" .. item.item_id, body = { item = item.item_id, from_generation = item.process_generation,
        to_generation = p.generation, state_map = state_map, actor = actor, at = at, source = "migration" } }
end

local function migration_events(db: sql.DB, board: domain.Board, item: domain.Item, p: domain.Process, state_map: { [string]: string },
    actor: string, at: string, trace_context: domain.TraceContext?): ({ domain.Event }?, error?)
    local events = { migrated_event(item, p, state_map, actor, at, trace_context) }
    local work = flow.copy(item)
    work.process_generation, work.version = p.generation, work.version + 1
    local state = state_map[item.state] or item.state
    if state ~= item.state then
        local target = process.state_of(p, state) :: domain.State
        work.state, work.category, work.visit = state, target.category, work.visit + 1
        flow.initialize(work, target, actor, at, p)
        local finding = flow.entry(board, target, work.document, p)
        if finding then return nil, errors.new({ kind = errors.INVALID, message = finding.message, details = { code = finding.code, field = finding.field } }) end
    else
        local entered, rerr = process.migrate_regions(work, p, state_map, actor, at, true)
        if rerr then return nil, rerr end
        for _, region in ipairs(entered or {}) do
            local target = process.state_of(p, work.work.regions[region]) :: domain.State
            local finding = flow.entry(board, target, work.document, p)
            if finding then return nil, errors.new({ kind = errors.INVALID, message = finding.message, details = { code = finding.code, field = finding.field } }) end
        end
    end
    work.category = process.category(p, work)
    local ctx = prepare.context(db, board, actor, at, db:type())
    ctx.items[item.item_id], ctx.base[item.item_id] = work, item.version
    local settled, finding, err = flow.settle(board, work, actor, at, when.check(ctx), p, ctx.auto)
    if err then return nil, err end
    if finding then return nil, errors.new({ kind = errors.INVALID, message = finding.message, details = { code = finding.code, field = finding.field } }) end
    for _, event in ipairs(settled or {}) do
        event.body.actor, event.body.at, event.body.source = actor, at, "migration"
        event.trace_context = trace_context
        events[#events + 1] = event
    end
    return events, nil
end

-- batch moves the next stale items of the board's follow processes; it runs as the board identity.
function M.batch(request: types.BatchRequest): (types.BatchResult?, error?)
    local trace_context, trace_err = receipts.trace(request.trace_context, "work.migrate")
    if trace_err then return nil, trace_err end
    local board_id = request.board_id
    local _, access_err = component.validate_access(board_id, (component.ACCESS.ADMIN :: integer))
    if access_err then return nil, errors.wrap(access_err :: error, "board access denied") end
    local until_at, deadline_err = deadline.bound(request.deadline)
    if deadline_err or not until_at then return nil, deadline_err end
    local c, cerr = threads.open()
    if not c then return nil, cerr end
    local caught, uerr = threads.catch_up(c, board_id, consts.PROJECTION_KIND, until_at)
    if uerr or not caught or not caught.done then
        return nil, uerr or errors.new({ details = { code = "contract_unavailable" },  kind = errors.UNAVAILABLE, retryable = true, message = "board projection did not reach the thread head" })
    end
    local db, derr = store.open()
    if not db then return nil, derr end
    local board, berr = store.board(db, board_id)
    if berr or not board then
        db:release()
        return nil, berr or errors.new({ kind = errors.NOT_FOUND, message = "board has no schema", details = { code = "resource_not_found" } })
    end
    local principal_err = principals.resolve(board)
    if principal_err then db:release(); return nil, principal_err end
    local generations: { [integer]: { compiled: domain.Compiled, maps: domain.StateMaps } } = {}
    local actor = (security.actor() :: security.Actor):id()
    local at = time.now():utc():format(STAMP)
    local result: types.BatchResult = { candidates = 0, moved = 0, stranded = 0 }
    local writes: { domain.Write } = {}
    local room = consts.LIMITS.migration_batch
    for _, p in ipairs(board.compiled.processes) do
        if p.migration == "follow" and room > 0 then
            local found, serr = job_rows.stale(db, board, p, room, db:type())
            if serr or not found then
                db:release()
                return nil, serr
            end
            for _, item in ipairs(found) do
                local state, rerr = route(db, board, item, p, generations)
                if rerr then db:release(); return nil, rerr end
                if state then
                    local events, eerr = migration_events(db, board, item, p, state, actor, at, trace_context)
                    if eerr or not events then db:release(); return nil, eerr end
                    writes[#writes + 1] = { group = "i:" .. item.item_id, events = events, ops = {}, caller_expect = false,
                        expect_subject = "i:" .. item.item_id, expect_version = item.version }
                else result.stranded = result.stranded + 1 end
            end
            room = room - #found
        end
    end
    db:release()
    result.candidates = #writes
    while #writes > 0 do
        local _, aerr = append.writes(c, board_id, writes)
        if not aerr then
            result.moved = #writes
            break
        end
        local subject = threads.mismatch(aerr, "version_mismatch") and (aerr:details() or {}).subject or nil
        if type(subject) ~= "string" then return nil, errors.wrap(aerr, "migration append failed") end
        local kept: { domain.Write } = {}
        for _, w in ipairs(writes) do
            if w.expect_subject ~= subject then kept[#kept + 1] = w end
        end
        if #kept == #writes then return nil, errors.wrap(aerr, "migration append failed") end
        writes = kept
    end
    return result, nil
end

M.kind = "migration"
M.batch_id = "kickside.work.jobs:migrate_batch"
M.owner = consts.MIGRATION_OWNER
M.batches = consts.LIMITS.migration_batches_per_run
return M
