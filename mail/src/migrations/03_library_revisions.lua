-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local types = require("types")

local columns = [[kind,name,revision,title,description,html,text,subject,base,schema_json,samples_json,
    state,origin,author,created_at,updated_at]]

local function create(db: types.Executor, sqlite: boolean)
    local schema = [[CREATE TABLE IF NOT EXISTS mail_library_revision (
        kind TEXT NOT NULL,
        name TEXT NOT NULL,
        revision BIGINT NOT NULL,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        html TEXT NOT NULL,
        text TEXT NOT NULL,
        subject TEXT,
        base TEXT,
        schema_json TEXT NOT NULL,
        samples_json TEXT NOT NULL,
        state TEXT NOT NULL CHECK (state IN ('original', 'created', 'customized')),
        origin TEXT,
        author TEXT NOT NULL,
        created_at BIGINT NOT NULL,
        updated_at BIGINT NOT NULL,
        note TEXT,
        PRIMARY KEY (kind, name, revision)
    )]]
    if sqlite then schema = schema:gsub("BIGINT", "INTEGER") .. " STRICT" end
    local _, create_err = db:execute(schema)
    if create_err then error(create_err) end
    local _, seed_err = db:execute("INSERT INTO mail_library_revision (" .. columns .. ") SELECT "
        .. columns .. " FROM mail_library WHERE 1=1 ON CONFLICT (kind,name,revision) DO NOTHING")
    if seed_err then error(seed_err) end
end

return require("migration").define(function()
    migration("03 mail library revisions", function()
        database("sqlite", function()
            up(function(db: types.Executor) create(db, true) end)
        end)
        database("postgres", function()
            up(function(db: types.Executor) create(db, false) end)
        end)
    end)
end)
