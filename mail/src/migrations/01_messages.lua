-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local types = require("types")

local statements: {string} = {
    [[CREATE TABLE mail_message (
        id TEXT PRIMARY KEY NOT NULL,
        created_at BIGINT NOT NULL,
        status TEXT NOT NULL CHECK (status IN ('queued', 'sent', 'failed')),
        attempts INTEGER NOT NULL DEFAULT 0 CHECK (attempts >= 0),
        next_attempt_at BIGINT,
        next_check_at BIGINT,
        finished_at BIGINT,
        sent_at BIGINT,
        sender TEXT NOT NULL,
        actor_context TEXT,
        template TEXT,
        recipients TEXT NOT NULL,
        subject TEXT NOT NULL,
        html TEXT,
        text TEXT,
        from_address TEXT NOT NULL,
        from_name TEXT,
        reply_to TEXT,
        attachments TEXT NOT NULL,
        idempotency_key TEXT,
        content_hash TEXT,
        job_id TEXT,
        driver_id TEXT,
        provider_message_id TEXT,
        error_kind TEXT,
        error_code TEXT,
        error_message TEXT,
        provider_detail TEXT,
        CHECK ((idempotency_key IS NULL) = (content_hash IS NULL)),
        CHECK ((status = 'queued' AND next_attempt_at IS NOT NULL AND next_check_at IS NOT NULL
            AND actor_context IS NOT NULL AND finished_at IS NULL)
            OR (status <> 'queued' AND next_attempt_at IS NULL AND next_check_at IS NULL
            AND actor_context IS NULL AND finished_at IS NOT NULL AND html IS NULL AND text IS NULL)),
        CHECK ((status = 'sent') = (sent_at IS NOT NULL AND provider_message_id IS NOT NULL))
    )]],
    [[CREATE UNIQUE INDEX mail_message_idempotency ON mail_message(sender, idempotency_key)
        WHERE idempotency_key IS NOT NULL]],
    [[CREATE INDEX mail_message_sender_page ON mail_message(sender, created_at DESC, id DESC)]],
    [[CREATE INDEX mail_message_page ON mail_message(created_at DESC, id DESC)]],
    [[CREATE INDEX mail_message_sender_status_page ON mail_message(sender, status, created_at DESC, id DESC)]],
    [[CREATE INDEX mail_message_status_page ON mail_message(status, created_at DESC, id DESC)]],
    [[CREATE INDEX mail_message_check ON mail_message(next_check_at, id) WHERE status = 'queued']],
    [[CREATE INDEX mail_message_expiry ON mail_message(finished_at, id) WHERE finished_at IS NOT NULL]],
}

local function create(db: types.Executor, sqlite: boolean)
    for index, statement in ipairs(statements) do
        local query = statement :: string
        if sqlite and index == 1 then query = query:gsub("BIGINT", "INTEGER") .. " STRICT" end
        local _, err = db:execute(query)
        if err then error(err) end
    end
end

local function drop(db: types.Executor)
    local _, err = db:execute("DROP TABLE mail_message")
    if err then error(err) end
end

return require("migration").define(function()
    migration("01 mail messages", function()
        database("sqlite", function()
            up(function(db: types.Executor) create(db, true) end)
            down(drop)
        end)
        database("postgres", function()
            up(function(db: types.Executor) create(db, false) end)
            down(drop)
        end)
    end)
end)
