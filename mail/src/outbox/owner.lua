-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local database = require("database")
local jobs = require("jobs")
local policy = require("policy")
local settings = require("settings")
local sql = require("sql")
local store = require("store")
local types = require("types")

local FAILED_JOB = {
    dead = "The delivery job ended before recording an outcome",
    cancelled = "The delivery job was cancelled",
    missing = "The delivery job is no longer available",
    done = "The delivery job completed without recording an outcome",
}

local function due(now: integer, input: types.OwnerInput): ({types.MessageRow}?, error?)
    local change = input.change
    local locator = change and change.owner_locator
    return database.read(function(db: sql.DB): ({types.MessageRow}?, error?)
        local rows, err = db:query([[SELECT id, job_id, next_check_at FROM mail_message
            WHERE status='queued' AND next_check_at<=$1 ORDER BY next_check_at,id LIMIT $2]], {now, policy.BATCH})
        if err then return nil, err end
        if locator and locator.kind == store.OWNER_KIND and change.kind == "lease_released" and change.job_id then
            local hinted, hint_err = db:query([[SELECT id, job_id, next_check_at FROM mail_message
                WHERE id=$1 AND job_id=$2 AND status='queued' AND next_check_at>$3]], {locator.id, change.job_id, now})
            if hint_err then return nil, hint_err end
            if hinted[1] then rows[#rows + 1] = hinted[1] end
        end
        return rows :: {types.MessageRow}, nil
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
    local _, write_err = database.transaction(function(tx: sql.Transaction, _dialect: string): (boolean?, error?)
        for _, row in ipairs(pending) do
            local status = states[row.job_id] or "missing"
            local reason = FAILED_JOB[status]
            local _, update_err
            if reason then
                _, update_err = store.finish(tx, row.id, row.job_id, now, nil,
                    {kind = errors.UNAVAILABLE, code = "delivery_job_" .. status, message = reason})
            elseif row.next_check_at <= now then
                _, update_err = tx:execute([[UPDATE mail_message SET next_check_at=$1
                    WHERE id=$2 AND status='queued' AND next_check_at=$3]],
                    {now + policy.RECHECK_MS, row.id, row.next_check_at})
            end
            if update_err then return nil, update_err end
        end
        return true, nil
    end)
    return write_err
end

local function sweep(now: integer, retention_ms: integer): (types.OwnerResult?, error?)
    return database.transaction(function(tx: sql.Transaction, _dialect: string): (types.OwnerResult?, error?)
        local result, delete_err = tx:execute([[DELETE FROM mail_message WHERE id IN (
            SELECT id FROM mail_message WHERE finished_at <= $1 ORDER BY finished_at,id LIMIT $2
        )]], {now - retention_ms, policy.BATCH})
        if delete_err then return nil, delete_err end
        local rows, read_err = tx:query([[SELECT
            (SELECT next_check_at FROM mail_message WHERE status='queued' ORDER BY next_check_at,id LIMIT 1) AS check_at,
            (SELECT finished_at FROM mail_message WHERE finished_at IS NOT NULL ORDER BY finished_at,id LIMIT 1) AS finished_at]])
        if read_err then return nil, read_err end
        local deadlines = rows[1]
        local next_check = deadlines.check_at :: integer?
        local earliest = deadlines.finished_at :: integer?
        if earliest then
            local expiry = earliest + retention_ms
            next_check = next_check and math.min(next_check, expiry) or expiry
        end
        return {success = true, deleted = result.rows_affected, deadline_ms = next_check,
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
    local now = policy.now()
    local err = reconcile(now, input)
    if err then return {success = false, error = err} end
    local result, sweep_err = sweep(now, days * policy.DAY_MS)
    if sweep_err then return {success = false, error = sweep_err} end
    return result :: types.OwnerResult
end

return {run = run}
