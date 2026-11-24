-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local types = require("types")

local function add(db: types.Executor, number_type: string)
    local statements = {
        "ALTER TABLE mail_library_revision ADD COLUMN version " .. number_type,
        "ALTER TABLE mail_library_revision ADD COLUMN action TEXT",
        "ALTER TABLE mail_library_revision ADD COLUMN restored_from " .. number_type,
        [[WITH ordered AS (
            SELECT kind,name,revision,ROW_NUMBER() OVER (PARTITION BY kind,name ORDER BY revision) AS version
            FROM mail_library_revision
        )
        UPDATE mail_library_revision AS r SET version=ordered.version,
            action=CASE WHEN r.state='original' THEN 'reset' ELSE 'previous_change' END
        FROM ordered WHERE r.kind=ordered.kind AND r.name=ordered.name AND r.revision=ordered.revision
            AND r.version IS NULL]],
    }
    for _, statement in ipairs(statements) do
        local _, err = db:execute(statement)
        if err then error(err) end
    end
end

return require("migration").define(function()
    migration("09 mail library history actions", function()
        database("sqlite", function() up(function(db: types.Executor) add(db, "INTEGER") end) end)
        database("postgres", function() up(function(db: types.Executor) add(db, "BIGINT") end) end)
    end)
end)
