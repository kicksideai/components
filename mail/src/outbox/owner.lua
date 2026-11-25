-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local database = require("database")
local jobs = require("jobs")
local policy = require("policy")
local time = require("time")
local settings = require("settings")
local store = require("store")
local types = require("types")
local realtime = require("realtime")
local asset_store = require("asset_store")
local asset_file_repo = require("asset_file_repo")
local repo = require("message_repo")

local INTERRUPTED = {dead = true, cancelled = true, missing = true, done = true}

local function due(now: integer, input: types.OwnerInput): ({types.DueRow}?, error?)
    local change = input.change
    local locator = change and change.owner_locator
    return database.with_db(function(ex: types.Executor): ({types.DueRow}?, error?)
        local rows, err = repo.due_checks(ex, now, policy.BATCH)
        if err then return nil, err end
        if locator and locator.kind == store.OWNER_KIND and change.kind == "lease_released" and change.job_id then
            local hinted, hint_err = repo.hinted(ex, locator.id, change.job_id, now)
            if hint_err then return nil, hint_err end
            if hinted then rows[#rows + 1] = hinted end
        end
        return rows, nil
    end)
end

local function reconcile(now: integer, input: types.OwnerInput): error?
    local pending, err = due(now, input)
    if err then return err end
    if #pending == 0 then return nil end
    local ids = {}
    for index, row in ipairs(pending) do ids[index] = row.job_id end
    local states, status_err = jobs.get_job_statuses(ids)
    if status_err then return status_err end
    local changed, write_err = database.with_tx(function(tx: types.Transaction): ({string}?, error?)
        local failed: {string} = {}
        for _, row in ipairs(pending) do
            local status = states[row.job_id] or "missing"
            local _, update_err
            if INTERRUPTED[status] then
                local settled
                settled, update_err = store.finish(tx, row.id, row.job_id, now, nil, {
                    kind = errors.UNAVAILABLE, code = "delivery_interrupted",
                    message = "Delivery was interrupted; the email may have been sent",
                })
                if settled then failed[#failed + 1] = row.id end
            elseif row.next_check_at <= now then
                _, update_err = repo.recheck(tx, row.id, row.next_check_at, now + policy.RECHECK_MS)
            end
            if update_err then return nil, update_err end
        end
        return failed, nil
    end)
    if write_err then return write_err end
    for _, id in ipairs(changed) do realtime.message(id, "failed") end
    return nil
end

local function sweep(now: integer, retention_ms: integer): (types.OwnerResult?, error?)
    return database.with_tx(function(tx: types.Transaction): (types.OwnerResult?, error?)
        local unlink_err = asset_store.drop_expired_links(tx, now - retention_ms, policy.BATCH, now)
        if unlink_err then return nil, unlink_err end
        local deleted, delete_err = repo.prune_finished(tx, now - retention_ms, policy.BATCH)
        if delete_err then return nil, delete_err end
        local deadlines, read_err = repo.next_deadlines(tx)
        if read_err then return nil, read_err end
        local asset_due, asset_err = asset_file_repo.next_due(tx)
        if asset_err then return nil, asset_err end
        local next_check = deadlines.check_at
        local earliest = deadlines.finished_at
        if asset_due then next_check = next_check and math.min(next_check, asset_due) or asset_due end
        if earliest then
            local expiry = earliest + retention_ms
            next_check = next_check and math.min(next_check, expiry) or expiry
        end
        return {success = true, deleted = deleted, deadline_ms = next_check,
            needs_continue = next_check ~= nil and next_check <= now}, nil
    end)
end

local function run(input: types.OwnerInput): types.OwnerResult
    local config, config_err = settings.read("kickside.mail")
    if config_err then return {success = false, error = config_err} end
    local days = policy.retention_days(config.log_retention_days)
    if not days then
        return {success = false, error = settings.missing("Mail delivery log retention days are invalid")}
    end
    local now = time.now():unix_nano() // 1000000
    local err = reconcile(now, input)
    if err then return {success = false, error = err} end
    local collected, blocked, collect_err = asset_store.collect(now, policy.BATCH, now + policy.RECHECK_MS)
    local result, sweep_err = sweep(now, days * policy.DAY_MS)
    if sweep_err or collect_err then return {success = false, error = sweep_err or collect_err} end
    local report = result :: types.OwnerResult
    report.blocked = blocked
    report.deleted = (report.deleted or 0) + (collected or 0)
    return report
end

return {run = run}
