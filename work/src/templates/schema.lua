-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local statements = {
        [[CREATE TABLE kickside_work_template_version (
                attachment_id TEXT NOT NULL, template_id TEXT NOT NULL, version TEXT NOT NULL,
                record TEXT NOT NULL, field_identities TEXT NOT NULL, type_identity TEXT NOT NULL,
                archived INTEGER NOT NULL DEFAULT 0, expires_at TEXT,
                PRIMARY KEY (attachment_id, template_id, version)) ]],
        [[CREATE INDEX kickside_work_template_active ON kickside_work_template_version
                (attachment_id, template_id, version) WHERE archived = 0 ]],
        [[CREATE INDEX kickside_work_template_expiry ON kickside_work_template_version
                (expires_at, attachment_id, template_id, version) WHERE expires_at IS NOT NULL ]],
}

local function create(db)
    for _, statement in ipairs(statements) do
        local _, err = db:execute(statement)
        if err then error(err) end
    end
end

local function drop(db)
    local _, err = db:execute("DROP TABLE kickside_work_template_version")
    if err then error(err) end
end

return require("migration").define(function()
    migration("01 work templates catalog", function()
        for _, engine in ipairs({ "postgres", "sqlite" }) do
            database(engine, function()
                up(create)
                down(drop)
            end)
        end
    end)
end)
