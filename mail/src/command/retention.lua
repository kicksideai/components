-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local types = require("types")
local asset_file_repo = require("asset_file_repo")
local database = require("database")
local content = require("content")
local jobs = require("jobs")
local library_repo = require("library_repo")
local outbox = require("outbox")
local policy = require("policy")
local preview_repo = require("preview_repo")
local repo = require("message_repo")
local scratch = require("scratch")
local uploads = require("uploads")

local M = {}

local function collect(now_ms: integer, limit: integer, blocked_until: integer): (integer?, {types.BlockedAsset}?, error?)
    local ids, read_err = database.with_db(function(db: types.DB): ({string}?, error?)
        return asset_file_repo.due_unreferenced(db, now_ms, limit)
    end)
    if read_err then return nil, nil, read_err end
    local component_id = content.library_component_id()
    local removed: {string} = {}
    local deferred: {string} = {}
    local blocked: {types.BlockedAsset} = {}
    for _, id in ipairs(ids) do
        local err = uploads.reap(component_id, id)
        if err then
            deferred[#deferred + 1] = id
            blocked[#blocked + 1] = {component_id = component_id, error = err}
        else
            removed[#removed + 1] = id
        end
    end
    if #ids > 0 then
        local _, err = database.with_tx(function(tx: types.Transaction): (boolean?, error?)
            local _, forget_err = asset_file_repo.forget(tx, removed, now_ms)
            if forget_err then return nil, forget_err end
            return asset_file_repo.schedule(tx, deferred, blocked_until, now_ms)
        end)
        if err then return nil, nil, err end
    end
    return #removed, blocked, nil
end

local function reconcile(now: integer, input: types.OwnerInput): error?
    local change = input.change
    local pending, err = database.with_db(function(ex: types.Executor): ({types.DueRow}?, error?)
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
    local expiry, err = database.with_db(function(ex: types.Executor): (integer?, error?)
        return preview_repo.next_expiry(ex)
    end)
    if err or not expiry or expiry > now then return expiry, err end
    return database.with_tx(function(tx: types.Transaction, dialect: string): (integer?, error?)
        local _, lock_err = library_repo.lock(tx, dialect)
        if lock_err then return nil, lock_err end
        local ids, prune_err = preview_repo.prune(tx, now, policy.BATCH)
        if prune_err then return nil, prune_err end
        local _, clear_err = scratch.clear_expired(ids)
        if clear_err then return nil, clear_err end
        return preview_repo.next_expiry(tx)
    end)
end

local function earlier(deadline: integer?, candidate: integer?): integer?
    if not candidate then return deadline end
    return deadline and math.min(deadline, candidate) or candidate
end

local function prune_messages(now: integer, retention_ms: integer, preview_expiry: integer?): (types.OwnerResult?, error?)
    return database.with_tx(function(tx: types.Transaction): (types.OwnerResult?, error?)
        local cutoff = now - retention_ms
        local _, unlink_err = asset_file_repo.drop_expired_links(tx, cutoff, policy.BATCH, now)
        if unlink_err then return nil, unlink_err end
        local deleted, delete_err = repo.prune_finished(tx, cutoff, policy.BATCH)
        if delete_err then return nil, delete_err end
        local deadlines, read_err = repo.next_deadlines(tx)
        if read_err then return nil, read_err end
        local asset_due, asset_err = asset_file_repo.next_due(tx)
        if asset_err then return nil, asset_err end
        local next_check = earlier(deadlines.check_at, asset_due)
        next_check = earlier(next_check, deadlines.finished_at and deadlines.finished_at + retention_ms)
        next_check = earlier(next_check, preview_expiry and preview_expiry * 1000)
        return {success = true, deleted = deleted, deadline_ms = next_check,
            needs_continue = next_check ~= nil and next_check <= now}, nil
    end)
end

function M.sweep(now: integer, retention_ms: integer, input: types.OwnerInput): (types.OwnerResult?, error?)
    local reconcile_err = reconcile(now, input)
    if reconcile_err then return nil, reconcile_err end
    local collected, blocked, collect_err = collect(now, policy.BATCH, now + policy.RECHECK_MS)
    local preview_expiry, preview_err = prune_previews(now // 1000)
    if preview_err then return nil, preview_err end
    local result, sweep_err = prune_messages(now, retention_ms, preview_expiry)
    if sweep_err or collect_err then return nil, sweep_err or collect_err end
    local report = result :: types.OwnerResult
    report.blocked = blocked
    report.deleted = (report.deleted or 0) + (collected or 0)
    return report, nil
end

return M
