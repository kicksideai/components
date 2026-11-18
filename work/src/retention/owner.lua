-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local clock = require("clock")
local rows = require("rows")
local defaults = require("defaults")
local policy = require("policy")
local component = require("component")
local store = require("store")
local lifecycle = require("lifecycle")
local threads = require("threads")
local domain = require("domain")
local registry = require("registry")
local append = require("append")
local types = require("types")
local sql = require("sql")
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

local function retain(client: domain.ThreadClient, base: domain.Policy, board_id: string, limit: integer, after: string,
    expired: { domain.Row }, window: domain.EventWindow): (types.BoardPage?, error?)
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
    local pruned, perr = rows.prune(board_id, base, limit - spent, after, window)
    if perr or not pruned then return nil, perr end
    spent = spent + (pruned.spent or pruned.removed)
    local continuation: string? = nil
    if pruned.more then continuation = pruned.cursor or ""
    elseif spent > (pruned.examined or 0) then continuation = "" end
    return { removed = purged + pruned.removed, spent = spent, after = continuation }, nil
end

local function visit(client: domain.ThreadClient, base: domain.Policy, board_id: string, limit: integer, after: string): (types.BoardPage?, error?)
    local db, err = store.open()
    if not db then return nil, err end
    local board, berr = store.board(db, board_id)
    if berr or not board then db:release(); return { removed = 0, spent = 0 }, berr end
    local effective, eerr = policy.effective(base :: domain.JsonObject, board.compiled.policy_overrides)
    if eerr or not effective then db:release(); return nil, eerr end
    local window, werr = policy.event_window(db, board_id)
    if werr or not window then db:release(); return nil, werr end
    local boundary, boundary_err = client:prune_boundary({ thread_id = board_id })
    if boundary_err or not boundary then db:release(); return nil, boundary_err end
    if boundary.max_pruned_seq > board.tombstone_floor_seq then
        local floor_err = rows.record_floor(db, board_id, boundary.max_pruned_seq)
        if floor_err then db:release(); return nil, floor_err end
    end
    local expired, terr = rows.trash(db, board_id, effective.trash_days :: integer, limit)
    db:release()
    if terr then return nil, terr end
    local page, perr = retain(client, base, board_id, limit, after, expired or {}, window)
    if perr or not page then return nil, perr end
    db, err = store.open()
    if not db then return nil, err end
    local due, derr = rows.deadline(db, board_id, effective, window)
    db:release()
    if derr then return nil, derr end
    page.deadline_ms = due
    return page, nil
end

function M.run(_input: unknown): types.Result
    local settings, settings_err = limits.read()
    if settings_err or not settings then return { success = false, error = settings_err } end
    local db, err = store.open()
    if not db then return { success = false, error = err } end
    local orphans, qerr = lifecycle.orphans(db, settings.retention_batch)
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
    local more = #found == settings.retention_batch
    local advance_err = lifecycle.advance_orphans(more and found[#found].prefix or "~")
    if advance_err then return { success = false, error = advance_err } end
    local left = settings.retention_batch - #found
    if left == 0 then return { success = true, deleted = deleted, blocked = blocked, needs_continue = true } end
    local base, serr = defaults.read()
    if serr or not base then return { success = false, error = serr } end
    db, err = store.open()
    if not db then return { success = false, error = err } end
    local position, poserr = rows.position(db)
    if poserr or not position then db:release(); return { success = false, error = poserr } end
    local board_limit = math.min(left, settings.cleanup_batch)
    local boards, scan_err = rows.boards(db, position, board_limit + 1)
    db:release()
    if scan_err or not boards then return { success = false, error = scan_err } end

    local ids: { string } = {}
    for i = 1, math.min(#boards, board_limit) do
        local id, ierr = store.need(boards[i], "board_id")
        if ierr or not id then return { success = false, error = ierr } end
        ids[i] = id
    end
    local deleting: { [string]: boolean } = {}
    if #ids > 0 then
        local components, cerr = component.list_system({ component_ids = ids, include = { meta = false }, limit = #ids })
        if cerr then return { success = false, error = cerr } end
        for _, entry in ipairs(components or {}) do deleting[entry.component_id] = entry.deleting_at ~= nil end
    end

    more = #boards > board_limit
    local deadline = position.deadline_ms
    local checkpoints: { types.Checkpoint } = {}
    local visit_err: error? = nil
    for i, board_id in ipairs(ids) do
        if left < SLOT_BUDGET then more = true; break end
        local after = store.text(boards[i].retention_after)
        local page: types.BoardPage = { removed = 0, spent = 0 }
        if not deleting[board_id] then
            local collected, rerr = visit(client, base, board_id, left, after or "")
            if rerr or not collected then
                visit_err = rerr
                position.board_after, position.inclusive = board_id, 1
                more = true
                break
            end
            page = collected
        end
        if after ~= page.after then checkpoints[#checkpoints + 1] = { board_id = board_id, after = page.after } end
        if page.deadline_ms then deadline = deadline and math.min(deadline, page.deadline_ms) or page.deadline_ms end
        deleted, left = deleted + page.removed, left - page.spent
        position.board_after, position.inclusive = board_id, 0
        if position.board_scan == "pending" and page.removed > 0 then
            position.board_scan = "pending_then_all"
        end
    end

    if not visit_err then
        if position.board_scan == "all" then
            position.pending_page_budget = position.pending_page_budget + 1
        else
            position.pending_page_budget = math.max(0, position.pending_page_budget - 1)
        end
    end
    -- A deadline may fall behind the scan while we drain other boards.
    if not more and deadline and deadline <= clock.deadline(0).ns // 1000000 then
        deadline = nil
        more = true
        position.board_after, position.inclusive, position.board_scan = "", 0, "all"
        position.pending_page_budget = 0
    end
    position.deadline_ms = deadline
    local saved, pending = rows.advance(position, checkpoints, not more)
    if saved then return { success = false, error = saved } end
    return { success = visit_err == nil, error = visit_err, deleted = deleted, blocked = blocked,
        needs_continue = more or pending == true, deadline_ms = deadline }
end
return M
