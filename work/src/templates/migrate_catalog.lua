-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local CATALOG = [[CREATE TABLE IF NOT EXISTS kickside_work_template_version (
    attachment_id TEXT NOT NULL, template_id TEXT NOT NULL, version TEXT NOT NULL,
    record TEXT NOT NULL, field_identities TEXT NOT NULL, type_identity TEXT NOT NULL,
    archived INTEGER NOT NULL DEFAULT 0, expires_at TEXT,
    PRIMARY KEY (attachment_id, template_id, version))]]

local function initialize(db, suffix)
    local statements = {
        CATALOG .. suffix,
        [[CREATE INDEX IF NOT EXISTS kickside_work_template_active ON kickside_work_template_version
            (attachment_id, template_id, version) WHERE archived = 0]],
        [[CREATE INDEX IF NOT EXISTS kickside_work_template_expiry ON kickside_work_template_version
            (expires_at, attachment_id, template_id, version) WHERE expires_at IS NOT NULL]],
    }
    for _, statement in ipairs(statements) do
        local _, err = db:execute(statement)
        if err then error(err) end
    end
end

return require("migration").define(function()
    migration("initialize Work Templates catalog", function()
        database("postgres", function()
            up(function(db) initialize(db, "") end)
            -- Keep versions available to earlier Work releases on rollback.
            down(function(_db) end)
        end)
        database("sqlite", function()
            up(function(db) initialize(db, " STRICT") end)
            down(function(_db) end)
        end)
    end)
end)
