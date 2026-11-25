-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local types = require("types")
local asset_file_repo = require("asset_file_repo")
local database = require("database")
local content = require("content")
local jobs = require("jobs")
local outbox = require("outbox")
local policy = require("policy")
local preview_repo = require("preview_repo")
local repo = require("message_repo")
local scratch = require("scratch")
local uploads = require("uploads")
local upload_refs = require("upload_ref_repo")
local history = require("history_repo")
local live = require("live")
local live_repo = require("live_repo")
local thread_events = require("thread_events")
local thread_commands = require("thread_commands")
local events = require("events")

local M = {}

local function release_stranded_restores(threads: types.LibraryThreads, now: integer): error?
    local reservations, err = database.with_db(function(ex: database.Executor): ({types.RestoreReservation}?, error?)
        return asset_file_repo.due_restores(ex, now, policy.BATCH)
    end)
    if err then return err end
    for _, row in ipairs(reservations) do
        local event, lookup_err = thread_commands.find_command(threads, row.restore_author, "restore",
            row.restore_command_id, events.ASSET_RESTORED)
        if lookup_err then return lookup_err end
        local update = event and asset_file_repo.confirm_restore or asset_file_repo.release_hold
        local _, update_err = database.with_tx(function(tx: database.Transaction): (boolean?, error?)
            return update(tx, row.upload_id, row.hold_id)
        end)
        if update_err then return update_err end
    end
    return nil
end

local function collect(now_ms: integer, boundary: integer, limit: integer, retry_at: integer): (integer?, {types.BlockedAsset}?, error?)
    local claimed, claim_err = database.with_tx(function(tx: database.Transaction, dialect: string): ({types.Record}?, error?)
        local mark, lock_err = live_repo.lock_existing(tx, dialect)
        if lock_err then return nil, lock_err end
        local projected = mark and mark.projected_seq or 0
        local _, settle_err = asset_file_repo.settle_adoptions(tx, now_ms, projected, limit)
        if settle_err then return nil, settle_err end
        local rows, err = asset_file_repo.claim_due(tx, projected, now_ms, limit, retry_at)
        if err or #rows == limit then return rows, err end
        local retired, retired_err = asset_file_repo.claim_retired(tx, projected, boundary, limit - #rows, retry_at)
        if retired_err then return nil, retired_err end
        for _, row in ipairs(retired) do rows[#rows + 1] = row end
        return rows :: {types.Record}, nil
    end)
    if claim_err then return nil, nil, claim_err end
    local component_id = content.library_component_id()
    local removed = 0
    local blocked: {types.BlockedAsset} = {}
    for _, row in ipairs(claimed) do
        local id = row.upload_id :: string
        local err = uploads.reap(component_id, id)
        if err then
            blocked[#blocked + 1] = {component_id = component_id, error = err}
        else
            local _, forget_err = database.with_tx(function(tx: database.Transaction): (boolean?, error?)
                local _, ref_err = upload_refs.forget_retired(tx, id)
                if ref_err then return nil, ref_err end
                return asset_file_repo.forget(tx, id)
            end)
            if forget_err then return nil, nil, forget_err end
            removed = removed + 1
        end
    end
    return removed, blocked, nil
end

local function reconcile(now: integer, input: types.OwnerInput): error?
    local change = input.change
    local pending, err = database.with_db(function(ex: database.Executor): ({types.DueRow}?, error?)
        local rows, read_err = repo.due_checks(ex, now, policy.BATCH)
        if read_err then return nil, read_err end
        local locator = change and change.owner_locator
        if locator and locator.kind == "mail-message" and change.kind == "lease_released" and change.job_id then
            local hinted, hint_err = repo.hinted(ex, locator.id, change.job_id, now)
            if hint_err then return nil, hint_err end
            if hinted then rows[#rows + 1] = hinted end
        end
        return rows, nil
    end)
    if err then return err end
    if #pending == 0 then return nil end
    local ids: {string} = {}
    for i, row in ipairs(pending) do ids[i] = row.job_id end
    local statuses, status_err = jobs.get_job_statuses(ids)
    if status_err then return status_err end
    return outbox.interrupt(pending, statuses :: {[string]: string}, now)
end

local function prune_previews(now: integer): (integer?, error?)
    local ids, err = database.with_db(function(ex: database.Executor): ({string}?, error?)
        return preview_repo.expired(ex, now, policy.BATCH)
    end)
    if err then return nil, err end
    if #ids > 0 then
        local _, clear_err = scratch.clear_expired(ids)
        if clear_err then return nil, clear_err end
        local _, prune_err = database.with_tx(function(tx: database.Transaction): (boolean?, error?)
            return preview_repo.prune(tx, ids)
        end)
        if prune_err then return nil, prune_err end
    end
    return database.with_db(preview_repo.next_expiry)
end

local function earlier(deadline: integer?, candidate: integer?): integer?
    if not candidate then return deadline end
    return deadline and math.min(deadline, candidate) or candidate
end

local function prune_messages(now: integer, retention_ms: integer, preview_expiry: integer?): (types.OwnerResult?, error?)
    return database.with_tx(function(tx: database.Transaction): (types.OwnerResult?, error?)
        local cutoff = now - retention_ms
        local _, unlink_err = asset_file_repo.drop_expired_links(tx, cutoff, policy.BATCH)
        if unlink_err then return nil, unlink_err end
        local deleted, delete_err = repo.prune_finished(tx, cutoff, policy.BATCH)
        if delete_err then return nil, delete_err end
        local deadlines, read_err = repo.next_deadlines(tx)
        if read_err then return nil, read_err end
        local next_check = deadlines.check_at
        next_check = earlier(next_check, deadlines.finished_at and deadlines.finished_at + retention_ms)
        next_check = earlier(next_check, preview_expiry and preview_expiry * 1000)
        return {success = true, deleted = deleted, deadline_ms = next_check,
            needs_continue = next_check ~= nil and next_check <= now}, nil
    end)
end

function M.sweep(now: integer, retention_ms: integer, input: types.OwnerInput): (types.OwnerResult?, error?)
    local change = input.change
    local locator = change and change.owner_locator
    local check_library = true
    if locator and locator.kind == "mail-library" and change.kind == "lease_released" and change.job_id then
        local job, err = jobs.get_job(change.job_id)
        if err then return nil, err end
        -- Skip early failures and completion to avoid waking on every sync lease.
        check_library = job ~= nil and job.status == "dead" and job.attempts == job.max_attempts
    end
    if check_library then
        local _, err = live.reconcile()
        if err then return nil, err end
    end
    local reconcile_err = reconcile(now, input)
    if reconcile_err then return nil, reconcile_err end
    local threads, open_err = thread_events.open()
    if open_err then return nil, open_err end
    local boundary, boundary_err = thread_events.prune_boundary(threads :: types.LibraryThreads)
    if boundary_err and not errors.is(boundary_err, errors.NOT_FOUND) then return nil, boundary_err end
    local seq = boundary and boundary.max_pruned_seq or 0
    local release_err = release_stranded_restores(threads :: types.LibraryThreads, now)
    if release_err then return nil, release_err end
    local history_deleted, history_err = database.with_tx(function(tx: database.Transaction): (integer?, error?)
        return history.prune_below(tx, seq, policy.BATCH)
    end)
    if history_err then return nil, history_err end
    local preview_expiry, preview_err = prune_previews(now // 1000)
    if preview_err then return nil, preview_err end
    local result, sweep_err = prune_messages(now, retention_ms, preview_expiry)
    if sweep_err then return nil, sweep_err end
    local collected, blocked, collect_err = collect(now, seq, policy.BATCH, now + policy.RECHECK_MS)
    if collect_err then return nil, collect_err end
    local asset_due, asset_err = database.with_db(function(ex: database.Executor): (integer?, error?)
        local mark, mark_err = live_repo.get(ex)
        if mark_err then return nil, mark_err end
        local due, due_err = asset_file_repo.next_due(ex, mark.projected_seq :: integer)
        if due_err then return nil, due_err end
        local restore_check, restore_err = asset_file_repo.next_restore_check(ex)
        if restore_err then return nil, restore_err end
        return earlier(due, restore_check), nil
    end)
    if asset_err then return nil, asset_err end
    local report = result :: types.OwnerResult
    report.deadline_ms = earlier(report.deadline_ms, asset_due)
    report.needs_continue = report.needs_continue or history_deleted == policy.BATCH
        or (collected or 0) + #blocked == policy.BATCH or (asset_due ~= nil and asset_due <= now)
    report.blocked = blocked
    report.deleted = (report.deleted or 0) + (collected or 0) + (history_deleted or 0)
    return report, nil
end

return M
