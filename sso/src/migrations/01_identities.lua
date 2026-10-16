return require("migration").define(function()
    migration("Create app_user_identities table", function()
        database("postgres", function()
            up(function(db)
                local success, err = db:execute([[
                    CREATE TABLE IF NOT EXISTS app_user_identities (
                        id TEXT PRIMARY KEY,
                        provider TEXT NOT NULL,
                        subject TEXT NOT NULL,
                        user_id TEXT NOT NULL,
                        email TEXT,
                        email_verified BOOLEAN NOT NULL DEFAULT FALSE,
                        created_at TEXT NOT NULL DEFAULT (to_char(now() AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS"Z"')),
                        last_login_at TEXT,
                        UNIQUE (provider, subject),
                        FOREIGN KEY (user_id) REFERENCES app_users(user_id) ON DELETE CASCADE
                    )
                ]])
                if err then error("Failed to create app_user_identities table: " .. err) end

                success, err = db:execute("CREATE INDEX IF NOT EXISTS idx_app_user_identities_user_id ON app_user_identities(user_id)")
                if err then error("Failed to create user_id index: " .. err) end

                success, err = db:execute("CREATE INDEX IF NOT EXISTS idx_app_user_identities_email ON app_user_identities(email)")
                if err then error("Failed to create email index: " .. err) end
            end)

            down(function(db)
                local success, err = db:execute("DROP INDEX IF EXISTS idx_app_user_identities_email")
                if err then error("Failed to drop email index: " .. err) end

                success, err = db:execute("DROP INDEX IF EXISTS idx_app_user_identities_user_id")
                if err then error("Failed to drop user_id index: " .. err) end

                success, err = db:execute("DROP TABLE IF EXISTS app_user_identities")
                if err then error("Failed to drop app_user_identities table: " .. err) end
            end)
        end)

        database("sqlite", function()
            up(function(db)
                local success, err = db:execute([[
                    CREATE TABLE IF NOT EXISTS app_user_identities (
                        id TEXT PRIMARY KEY,
                        provider TEXT NOT NULL,
                        subject TEXT NOT NULL,
                        user_id TEXT NOT NULL,
                        email TEXT,
                        email_verified INTEGER NOT NULL DEFAULT 0,
                        created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),
                        last_login_at TEXT,
                        UNIQUE (provider, subject),
                        FOREIGN KEY (user_id) REFERENCES app_users(user_id) ON DELETE CASCADE
                    )
                ]])
                if err then error("Failed to create app_user_identities table: " .. err) end

                success, err = db:execute("CREATE INDEX IF NOT EXISTS idx_app_user_identities_user_id ON app_user_identities(user_id)")
                if err then error("Failed to create user_id index: " .. err) end

                success, err = db:execute("CREATE INDEX IF NOT EXISTS idx_app_user_identities_email ON app_user_identities(email)")
                if err then error("Failed to create email index: " .. err) end
            end)

            down(function(db)
                local success, err = db:execute("DROP INDEX IF EXISTS idx_app_user_identities_email")
                if err then error("Failed to drop email index: " .. err) end

                success, err = db:execute("DROP INDEX IF EXISTS idx_app_user_identities_user_id")
                if err then error("Failed to drop user_id index: " .. err) end

                success, err = db:execute("DROP TABLE IF EXISTS app_user_identities")
                if err then error("Failed to drop app_user_identities table: " .. err) end
            end)
        end)
    end)
end)
