-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local clock = require("clock")
local rows = require("rows")
local defaults = require("defaults")
local component = require("component")
local store = require("store")
local lifecycle = require("lifecycle")
local threads = require("threads")
local domain = require("domain")
local registry = require("registry")
local append = require("append")
local types = require("types")
local security = require("security")
local operation_expiry = require("operation_expiry")

local limits = require("limits")
local M = {}

-- release appends the registry release of the claim the row records and removes the
-- row. A claim already released needs only the row removal. A version conflict leaves
-- the row for the next run.
local function release(c: domain.ThreadClient, prefix: string, claim_version: integer, board_id: string, at: string): (boolean, error?)
    local write, werr = registry.release(c, prefix, claim_version, board_id, at)
    if werr then return false, werr end
    if write then
        local _, aerr = append.writes(c, board_id, { write })
        if aerr then
            if threads.mismatch(aerr, "version_mismatch") then return false, nil end
            return false, errors.wrap(aerr, "prefix release failed")
        end
    end
    local db, err = store.open()
    if not db then return false, err end
    local derr = lifecycle.remove_prefix(db, prefix, board_id)
    db:release()
    if derr then return false, errors.wrap(derr, "prefix row delete failed") end
    return true, nil
end

-- A native slot page can remove 100 runs, its slot and the Work owner row.
local SLOT_BUDGET = 105

local function retain(client: domain.ThreadClient, board_id: string, limit: integer, after: string,
    expired: { domain.Row }, window: domain.EventWindow, cutoffs: types.Cutoffs): (types.BoardPage?, error?)
    local purged = 0
    for _, item in ipairs(expired) do
        local id, ierr = store.need(item, "item_id")
        if ierr or not id then return nil, ierr end
        local version, verr = store.need_int(item, "version")
        if verr or not version then return nil, verr end
        local subject = "i:" .. id
        local event: domain.Event = { type = "kickside.work.events:item.purged", subject = subject,
            body = { item = id, actor = "system:kickside.work.retention", at = clock.now(), source = "retention" } }
        local _, aerr = append.writes(client, board_id, { { group = subject, ops = {}, events = { event },
            expect_subject = subject, expect_version = version, caller_expect = false } })
        if aerr and not threads.mismatch(aerr, "version_mismatch") then return nil, aerr end
        if not aerr then purged = purged + 1 end
    end
    local spent = #expired
    if limit - spent < SLOT_BUDGET then return { removed = purged, spent = spent, after = after }, nil end
    if after == "" or after:sub(1, 11) == "operations:" then
        local operation_after = after:sub(12)
        local retired, rerr, next_after = operation_expiry.retire(board_id, nil, nil, operation_after, window)
        if rerr then return nil, rerr end
        if next_after then
            return { removed = purged + (retired and 1 or 0), spent = spent + (retired and SLOT_BUDGET or 2),
                after = "operations:" .. next_after }, nil
        end
        after = ""
    end
    local pruned, perr = rows.prune(board_id, limit - spent, after, cutoffs)
    if perr or not pruned then return nil, perr end
    spent = spent + (pruned.spent or pruned.removed)
    local continuation: string? = nil
    if pruned.more then continuation = pruned.cursor or ""
    elseif spent > (pruned.examined or 0) then continuation = "" end
    return { removed = purged + pruned.removed, spent = spent, after = continuation }, nil
end

local function visit(client: domain.ThreadClient, state: types.Visit, limit: integer,
    eligibility: types.Eligibility): (types.BoardPage?, error?)
    local board_id = state.board_id
    if not eligibility.due and not state.after and state.boundary <= state.floor then
        return { removed = 0, spent = 0, deadline_ms = eligibility.deadline_ms }, nil
    end
    local db, err = store.open()
    if not db then return nil, err end
    if state.boundary > state.floor then
        local floor_err = rows.record_floor(db, board_id, state.boundary)
        if floor_err then db:release(); return nil, floor_err end
    end
    local expired, trash_err = rows.trash(db, board_id, state.cutoffs.trash, limit)
    db:release()
    if trash_err then return nil, trash_err end
    local page, retain_err = retain(client, board_id, limit, state.after or "", expired or {},
        { before = state.cutoffs.event, ms = state.windows.event }, state.cutoffs)
    if retain_err or not page then return nil, retain_err end
    page.deadline_ms = eligibility.deadline_ms
    return page, nil
end

function M.run(_input: unknown): types.Result
    local settings, settings_err = limits.read()
    if settings_err or not settings then return { success = false, error = settings_err } end
    if not security.can("threads.prune_boundary.read", "work.board") then
        return { success = false, error = errors.new({ kind = errors.PERMISSION_DENIED, message = "Work board prune boundary read denied" }) }
    end
    local db, err = store.open()
    if not db then return { success = false, error = err } end
    -- Reserve a board visit even when prefix discovery has a full page.
    local orphan_limit = settings.retention_batch - SLOT_BUDGET
    local orphans, qerr = lifecycle.orphans(db, orphan_limit)
    db:release()
    if qerr then return { success = false, error = qerr } end
    local client, cerr = threads.open()
    if cerr or not client then return { success = false, error = cerr } end
    local found, deleted = orphans or {}, 0
    local blocked: { types.Blocked } = {}
    for _, row in ipairs(found) do
        local done, rerr = false, nil
        if not row.present then done,rerr=release(client, row.prefix, row.claim_version, row.board_id, clock.now()) end
        if rerr then blocked[#blocked + 1] = { component_id = row.board_id, prefix = row.prefix, error = rerr }
        elseif done then deleted = deleted + 1 end
    end
    local orphan_more = #found == orphan_limit
    local advance_err = lifecycle.advance_orphans(orphan_more and found[#found].prefix or "~")
    if advance_err then return { success = false, error = advance_err } end
    local left = settings.retention_batch - #found
    local base, serr = defaults.read()
    if serr or not base then return { success = false, error = serr } end
    db, err = store.open()
    if not db then return { success = false, error = err } end
    local position, poserr = rows.position(db)
    if poserr or not position then db:release(); return { success = false, error = poserr } end
    if position.board_scan == "pending" and position.pending_page_budget == 0 then position.board_scan = "all" end
    local scanning = position.board_scan == "all"
    if scanning and not position.board_through then
        local bound, bound_err = rows.end_key(db)
        if bound_err then db:release(); return { success = false, error = bound_err } end
        position.board_through = bound
    end
    local now = clock.deadline(0)
    local board_limit = math.min(left, settings.cleanup_batch)
    local ready_limit = scanning and math.max(1, board_limit // 2) or board_limit
    local ready, ready_err = rows.ready(db, now.ns // 1000000, ready_limit)
    if ready_err or not ready then db:release(); return { success = false, error = ready_err } end
    local directory: { domain.Row } = {}
    if scanning and position.board_through then
        local available, read_err = rows.boards(db, position, board_limit + 1)
        if read_err or not available then db:release(); return { success = false, error = read_err } end
        directory = available
    end
    db:release()

    local ids: { string } = {}
    local selected: { [string]: domain.Row } = {}
    local function add(page: { domain.Row }, limit: integer)
        for i = 1, math.min(#page, limit) do
            local row = page[i]
            local id = row.board_id :: string
            if not selected[id] and #ids < board_limit then
                ids[#ids + 1] = id
                selected[id] = row
            end
        end
    end
    -- A ready board goes first. If that consumed the board/mutation
    -- allowance without moving discovery, its next callback leads with discovery.
    local discovery_first = position.discovery_turn == 1
    if discovery_first then add(directory, math.max(1, board_limit - ready_limit)) end
    add(ready, ready_limit)
    add(directory, board_limit)

    local deleting: { [string]: boolean } = {}
    if #ids > 0 then
        local components, list_err = component.list_system({ component_ids = ids, include = { meta = false }, limit = #ids })
        if list_err then return { success = false, error = list_err } end
        for _, entry in ipairs(components or {}) do deleting[entry.component_id] = entry.deleting_at ~= nil end
    end
    local visits: { types.Visit } = {}
    local states: { [string]: types.Visit } = {}
    local cached: { [integer]: string } = {}
    for _, id in ipairs(ids) do
        if not deleting[id] then
            local state, state_err = rows.prepare(selected[id] :: domain.Row, base, now, cached)
            if state_err or not state then return { success = false, error = state_err } end
            visits[#visits + 1], states[id] = state, state
        end
    end
    local eligibility: { [string]: types.Eligibility } = {}
    if #visits > 0 then
        db, err = store.open()
        if not db then return { success = false, error = err } end
        local found, read_err = rows.eligibility(db, visits)
        db:release()
        if read_err or not found then return { success = false, error = read_err } end
        eligibility = found
    end

    local checkpoints: { types.Checkpoint } = {}
    local served: { [string]: boolean } = {}
    local visit_err: error? = nil
    for _, id in ipairs(ids) do
        if left < SLOT_BUDGET then break end
        local state = states[id]
        local row = selected[id]
        local page: types.BoardPage = { removed = 0, spent = 0 }
        if state then
            local collected, rerr = visit(client, state, left, eligibility[id] :: types.Eligibility)
            if rerr or not collected then visit_err = rerr; break end
            page = collected
        end
        local due = page.deadline_ms
        if page.after then
            local again = clock.deadline(0).ns // 1000000
            due = due and math.min(due, again) or again
        end
        if store.text(row.retention_after) ~= page.after or store.int(row.retention_due_ms) ~= due then
            checkpoints[#checkpoints + 1] = { board_id = id, applied_seq = row.applied_seq :: integer, after = page.after, due_ms = due }
        end
        deleted, left = deleted + page.removed, left - page.spent
        served[id] = true
    end

    local advanced = 0
    for _, row in ipairs(directory) do
        local id = row.board_id :: string
        if not served[id] then break end
        position.board_after, position.inclusive = id, 0
        advanced = advanced + 1
    end
    local discovery_more = scanning and advanced < #directory
    if scanning then
        if advanced > 0 then position.pending_page_budget = position.pending_page_budget + 1 end
        position.discovery_turn = not discovery_first and discovery_more
            and ((advanced == 0 and #ready > 0) or left < SLOT_BUDGET) and 1 or 0
        if not discovery_more then
            position.board_after, position.inclusive, position.board_through = "", 0, nil
            position.board_scan = "pending"
        end
    else
        position.pending_page_budget = math.max(0, position.pending_page_budget - 1)
    end
    local saved, deadline = rows.advance(position, checkpoints, not discovery_more, orphan_more)
    if saved then return { success = false, error = saved } end
    local due_now = deadline ~= nil and deadline <= clock.deadline(0).ns // 1000000
    return { success = visit_err == nil, error = visit_err, deleted = deleted, blocked = blocked,
        needs_continue = orphan_more or discovery_more or due_now, deadline_ms = deadline }
end
return M
