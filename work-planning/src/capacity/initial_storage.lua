-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local migration_api = require("migration")

local function install(db, sqlite: boolean)
    local strict = sqlite and " STRICT" or ""
    local version = sqlite and "INTEGER" or "BIGINT"
    local amount = sqlite and "REAL" or "DOUBLE PRECISION"
    local function execute(statement: string)
        local _, err = db:execute(statement)
        if err then error(err) end
    end
    execute([[CREATE TABLE kickside_work_planning_sprint (
        attachment_id TEXT NOT NULL,
        board_id TEXT NOT NULL,
        sprint_id TEXT NOT NULL,
        unit TEXT NOT NULL CHECK (unit IN ('minutes', 'points')),
        version ]] .. version .. [[ NOT NULL CHECK (version > 0),
        PRIMARY KEY (attachment_id, sprint_id),
        FOREIGN KEY (board_id, sprint_id) REFERENCES kickside_work_item (board_id, item_id) ON DELETE CASCADE
    )]] .. strict)
    execute([[CREATE TABLE kickside_work_planning_capacity (
        attachment_id TEXT NOT NULL,
        sprint_id TEXT NOT NULL,
        person TEXT NOT NULL CHECK (person <> ''),
        amount ]] .. amount .. [[ NOT NULL CHECK (amount >= 0),
        PRIMARY KEY (attachment_id, sprint_id, person),
        FOREIGN KEY (attachment_id, sprint_id) REFERENCES kickside_work_planning_sprint (attachment_id, sprint_id) ON DELETE CASCADE
    )]] .. strict)
    execute([[CREATE INDEX kickside_work_planning_sprint_item
        ON kickside_work_planning_sprint (board_id, sprint_id)]])
    execute([[CREATE INDEX kickside_work_planning_capacity_person
        ON kickside_work_planning_capacity (attachment_id, person, sprint_id)]])
end

local function drop(db)
    for _, name in ipairs({ "kickside_work_planning_capacity", "kickside_work_planning_sprint" }) do
        local _, err = db:execute("DROP TABLE " .. name)
        if err then error(err) end
    end
end

return migration_api.define(function()
    migration("01 Work Planning capacity", function()
        database("sqlite", function()
            up(function(db) install(db, true) end)
            down(drop)
        end)
        database("postgres", function()
            up(function(db) install(db, false) end)
            down(drop)
        end)
    end)
end)
