-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local migration_api = require("migration")

local UP: { string } = {
    -- Fences outlive empty aggregates and remain available to serialize teardown.
    [[CREATE TABLE kickside_work_time_attachment (
        attachment_id TEXT NOT NULL PRIMARY KEY,
        board_id TEXT NOT NULL,
        retired_at_ms BIGINT,
        drained INTEGER NOT NULL DEFAULT 0 CHECK (drained IN (0, 1))
    )]],
    [[CREATE INDEX kickside_work_time_attachment_retired ON kickside_work_time_attachment (retired_at_ms, attachment_id)
        WHERE retired_at_ms IS NOT NULL AND drained = 0]],
    [[CREATE TABLE kickside_work_time_item (
        attachment_id TEXT NOT NULL,
        item_id TEXT NOT NULL,
        retired_at_ms BIGINT,
        drained INTEGER NOT NULL DEFAULT 0 CHECK (drained IN (0, 1)),
        PRIMARY KEY (attachment_id, item_id)
    )]],
    [[CREATE INDEX kickside_work_time_item_retired ON kickside_work_time_item (retired_at_ms, attachment_id, item_id)
        WHERE retired_at_ms IS NOT NULL AND drained = 0]],
    [[CREATE TABLE kickside_work_time_worklog (
        attachment_id TEXT NOT NULL,
        board_id TEXT NOT NULL,
        item_id TEXT NOT NULL,
        person_id TEXT NOT NULL,
        entry_id TEXT NOT NULL,
        version BIGINT NOT NULL CHECK (version > 0),
        minutes BIGINT NOT NULL CHECK (minutes > 0),
        work_date TEXT NOT NULL,
        sprint_id TEXT,
        note TEXT,
        PRIMARY KEY (attachment_id, entry_id)
    )]],
    [[CREATE INDEX kickside_work_time_worklog_item_date ON kickside_work_time_worklog (attachment_id, item_id, work_date, entry_id)]],
    [[CREATE INDEX kickside_work_time_worklog_person_date ON kickside_work_time_worklog (attachment_id, person_id, work_date, entry_id)]],
    [[CREATE INDEX kickside_work_time_worklog_board_date ON kickside_work_time_worklog (attachment_id, work_date, entry_id)]],
    [[CREATE INDEX kickside_work_time_worklog_expiry ON kickside_work_time_worklog (work_date, attachment_id, entry_id)]],
    [[CREATE TABLE kickside_work_time_receipt (
        attachment_id TEXT NOT NULL,
        person_id TEXT NOT NULL,
        request_key TEXT NOT NULL,
        request_hash TEXT NOT NULL,
        item_id TEXT NOT NULL,
        entry_id TEXT NOT NULL,
        creation_version BIGINT NOT NULL CHECK (creation_version > 0),
        created_on TEXT NOT NULL,
        expires_on TEXT,
        PRIMARY KEY (attachment_id, person_id, request_key),
        UNIQUE (attachment_id, entry_id)
    )]],
    [[CREATE INDEX kickside_work_time_receipt_item ON kickside_work_time_receipt (attachment_id, item_id, entry_id)]],
    [[CREATE INDEX kickside_work_time_receipt_expiry ON kickside_work_time_receipt (expires_on, attachment_id, entry_id)
        WHERE expires_on IS NOT NULL]],
    [[CREATE TABLE kickside_work_time_total (
        attachment_id TEXT NOT NULL,
        board_id TEXT NOT NULL,
        item_id TEXT NOT NULL,
        minutes BIGINT NOT NULL CHECK (minutes > 0),
        entry_count BIGINT NOT NULL CHECK (entry_count > 0),
        over_estimate INTEGER NOT NULL DEFAULT 0 CHECK (over_estimate IN (0, 1)),
        PRIMARY KEY (attachment_id, item_id)
    )]],
    [[CREATE INDEX kickside_work_time_total_board_item ON kickside_work_time_total (board_id, item_id)]],
    -- An empty sprint id makes unallocated time a single upsertable bucket.
    [[CREATE TABLE kickside_work_time_daily (
        attachment_id TEXT NOT NULL,
        item_id TEXT NOT NULL,
        person_id TEXT NOT NULL,
        sprint_id TEXT NOT NULL DEFAULT '',
        work_date TEXT NOT NULL,
        minutes BIGINT NOT NULL CHECK (minutes > 0),
        entry_count BIGINT NOT NULL CHECK (entry_count > 0),
        PRIMARY KEY (attachment_id, item_id, work_date, person_id, sprint_id)
    )]],
    [[CREATE INDEX kickside_work_time_daily_person_date ON kickside_work_time_daily (attachment_id, person_id, work_date, item_id, sprint_id)]],
    [[CREATE INDEX kickside_work_time_daily_sprint_date ON kickside_work_time_daily (attachment_id, sprint_id, work_date, item_id, person_id)]],
    [[CREATE INDEX kickside_work_time_daily_board_date ON kickside_work_time_daily (attachment_id, work_date, item_id, person_id, sprint_id)]],
}

local function execute(db, statement: string)
    local _, err = db:execute(statement)
    if err then error(errors.wrap(err, "Work Time storage migration")) end
end

local function create(db, sqlite: boolean)
    for _, statement in ipairs(UP) do
        if sqlite and statement:find("^CREATE TABLE ") then
            execute(db, statement:gsub("BIGINT", "INTEGER") .. " STRICT")
        else
            execute(db, statement)
        end
    end
end

local function drop(db)
    for _, name in ipairs({ "daily", "total", "receipt", "worklog", "item", "attachment" }) do
        execute(db, "DROP TABLE kickside_work_time_" .. name)
    end
end

return migration_api.define(function()
    migration("01 create Work Time tables", function()
        database("sqlite", function()
            up(function(db) create(db, true) end)
            down(drop)
        end)
        database("postgres", function()
            up(function(db) create(db, false) end)
            down(drop)
        end)
    end)
end)
