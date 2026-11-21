-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0

local CREATE = [[CREATE TABLE kickside_pim_asset (
    catalog_id text NOT NULL,
    asset_id text NOT NULL,
    due_at text,
    reaping integer NOT NULL DEFAULT 0,
    adopting integer NOT NULL DEFAULT 1,
    PRIMARY KEY (catalog_id, asset_id))]]
local INDEXES = {
    [[CREATE INDEX kickside_pim_asset_due ON kickside_pim_asset(catalog_id, due_at, asset_id)
        WHERE due_at IS NOT NULL AND reaping=0]],
    [[CREATE INDEX kickside_pim_asset_reaping ON kickside_pim_asset(catalog_id, asset_id) WHERE reaping=1]],
}

local function execute(db, statement)
    local _, err = db:execute(statement)
    if err then error(err) end
end

local function create(db, table_sql)
    execute(db, table_sql)
    for _, statement in ipairs(INDEXES) do
        execute(db, statement)
    end
end

local function drop(db)
    execute(db, "DROP TABLE kickside_pim_asset")
end

return require("migration").define(function()
    migration("02 assets", function()
        database("postgres", function()
            up(function(db) create(db, CREATE) end)
            down(drop)
        end)
        database("sqlite", function()
            up(function(db) create(db, CREATE .. " STRICT") end)
            down(drop)
        end)
    end)
end)
