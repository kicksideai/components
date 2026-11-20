-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local migration_api = require("migration")

local function create(db, sqlite: boolean)
    local function execute(statement: string)
        local _, err = db:execute(statement)
        if err then error(err) end
    end
    execute([[CREATE TABLE kickside_work_search_state (
        attachment_id TEXT PRIMARY KEY,
        board_id TEXT NOT NULL,
        state TEXT NOT NULL
    )]])
    local id = sqlite and "INTEGER PRIMARY KEY" or "BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY"
    local vector = sqlite and "" or [=[, search_vector tsvector GENERATED ALWAYS AS
        (setweight(to_tsvector('simple', regexp_replace(content, '[^[:alnum:]]+', ' ', 'g')), 'A') ||
         setweight(to_tsvector('simple', 'p' || encode(generation_id::bytea, 'hex') || '@scope.invalid'), 'D')) STORED]=]
    execute("CREATE TABLE kickside_work_search_row (row_id " .. id .. [[,
        generation_id TEXT NOT NULL, item_id TEXT NOT NULL, item_key TEXT NOT NULL,
        source_seq BIGINT NOT NULL, content TEXT NOT NULL,
        UNIQUE (generation_id, item_id), UNIQUE (generation_id, item_key)]] .. vector .. ")")
    if sqlite then
        execute([[CREATE VIRTUAL TABLE kickside_work_search_fts USING fts5(content, scope_token, tokenize='unicode61 remove_diacritics 2')]])
    else
        execute([[CREATE INDEX kickside_work_search_fts ON kickside_work_search_row USING gin (search_vector)]])
    end
end

local function drop(db, sqlite: boolean)
    if sqlite then
        local _, err = db:execute("DROP TABLE kickside_work_search_fts")
        if err then error(err) end
    end
    for _, name in ipairs({ "row", "state" }) do
        local _, err = db:execute("DROP TABLE kickside_work_search_" .. name)
        if err then error(err) end
    end
end

return migration_api.define(function()
    migration("01 create Work Search tables", function()
        database("sqlite", function()
            up(function(db) create(db, true) end)
            down(function(db) drop(db, true) end)
        end)
        database("postgres", function()
            up(function(db) create(db, false) end)
            down(function(db) drop(db, false) end)
        end)
    end)
end)
