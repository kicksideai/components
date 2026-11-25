-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local sql = require("sql")

local tables: {string} = {
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
        origin_kind TEXT,
        origin_id TEXT,
        origin_label TEXT,
        failed_html TEXT,
        failed_text TEXT,
        resend_of TEXT,
        CHECK ((idempotency_key IS NULL) = (content_hash IS NULL)),
        CHECK ((status = 'queued' AND next_attempt_at IS NOT NULL AND next_check_at IS NOT NULL
            AND actor_context IS NOT NULL AND finished_at IS NULL)
            OR (status <> 'queued' AND next_attempt_at IS NULL AND next_check_at IS NULL
            AND actor_context IS NULL AND finished_at IS NOT NULL AND html IS NULL AND text IS NULL)),
        CHECK ((status = 'sent') = (sent_at IS NOT NULL)),
        CHECK (status = 'sent' OR provider_message_id IS NULL)
    )]],
    [[CREATE TABLE mail_library (
        revision BIGINT NOT NULL DEFAULT 0,
        kind TEXT NOT NULL CHECK (kind IN ('base', 'message', 'part')),
        name TEXT NOT NULL,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        html TEXT NOT NULL,
        text TEXT NOT NULL,
        subject TEXT,
        base TEXT,
        schema_json TEXT NOT NULL,
        samples_json TEXT NOT NULL,
        state TEXT NOT NULL CHECK (state IN ('created', 'customized')),
        origin TEXT,
        origin_label TEXT,
        last_seq BIGINT NOT NULL DEFAULT 0,
        author TEXT NOT NULL,
        created_at BIGINT NOT NULL,
        updated_at BIGINT NOT NULL,
        archived @boolean@ NOT NULL DEFAULT FALSE CHECK (archived IN (FALSE, TRUE)),
        UNIQUE (kind, name),
        CHECK ((kind = 'message') = (subject IS NOT NULL AND base IS NOT NULL)),
        CHECK ((subject IS NULL) = (base IS NULL)),
        CHECK ((state = 'customized') = (origin IS NOT NULL))
    )]],
    [[CREATE TABLE mail_asset_file (
        upload_id TEXT PRIMARY KEY NOT NULL,
        reserved_at BIGINT NOT NULL DEFAULT 0,
        due_at BIGINT,
        state TEXT NOT NULL DEFAULT 'held' CHECK (state IN ('held','reaping')),
        hold_seq BIGINT,
        hold_id TEXT,
        restore_command_id TEXT,
        restore_author TEXT,
        restore_reserved_at BIGINT,
        restore_check_at BIGINT,
        CHECK ((hold_seq IS NULL) = (hold_id IS NULL)),
        CHECK ((restore_command_id IS NULL) = (restore_author IS NULL)),
        CHECK ((restore_command_id IS NULL) = (restore_reserved_at IS NULL)),
        CHECK (restore_command_id IS NULL OR hold_id IS NOT NULL),
        CHECK (restore_check_at IS NULL OR restore_reserved_at IS NOT NULL)
    )]],
    [[CREATE TABLE mail_library_asset (
        revision BIGINT NOT NULL,
        name TEXT PRIMARY KEY NOT NULL,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        origin TEXT,
        origin_label TEXT,
        author TEXT NOT NULL,
        created_at BIGINT NOT NULL,
        updated_at BIGINT NOT NULL,
        upload_id TEXT NOT NULL,
        filename TEXT NOT NULL,
        content_type TEXT NOT NULL,
        size_bytes BIGINT NOT NULL,
        last_seq BIGINT NOT NULL DEFAULT 0
    )]],
    [[CREATE TABLE mail_library_history (
        seq BIGINT PRIMARY KEY NOT NULL,
        kind TEXT NOT NULL,
        name TEXT NOT NULL,
        version BIGINT NOT NULL,
        action TEXT NOT NULL,
        author TEXT NOT NULL,
        note TEXT,
        restored_from BIGINT,
        at BIGINT NOT NULL
    )]],
    [[CREATE TABLE mail_library_upload_ref (
        upload_id TEXT PRIMARY KEY NOT NULL,
        asset TEXT NOT NULL,
        live @boolean@ NOT NULL CHECK (live IN (FALSE, TRUE)),
        last_seq BIGINT NOT NULL
    )]],
    [[CREATE TABLE mail_library_live (
        id BIGINT PRIMARY KEY NOT NULL CHECK (id = 1),
        projected_seq BIGINT NOT NULL,
        template_seq BIGINT NOT NULL
    )]],
    [[CREATE TABLE mail_library_reference (
        from_kind TEXT NOT NULL,
        from_name TEXT NOT NULL,
        to_kind TEXT NOT NULL,
        to_name TEXT NOT NULL,
        PRIMARY KEY (from_kind,from_name,to_kind,to_name)
    )]],
    [[CREATE TABLE mail_library_preview (
        id TEXT PRIMARY KEY NOT NULL,
        actor TEXT NOT NULL,
        operation TEXT NOT NULL,
        digest TEXT NOT NULL,
        expected_json TEXT NOT NULL,
        expires_at BIGINT NOT NULL
    )]],
    [[CREATE TABLE mail_message_asset (
        message_id TEXT NOT NULL REFERENCES mail_message(id) ON DELETE CASCADE,
        name TEXT NOT NULL,
        content_id TEXT NOT NULL,
        original TEXT,
        upload_id TEXT REFERENCES mail_asset_file(upload_id),
        PRIMARY KEY (message_id,name),
        CHECK ((original IS NULL) <> (upload_id IS NULL))
    )]],
}

local indexes: {string} = {
    [[CREATE UNIQUE INDEX mail_message_idempotency ON mail_message(sender, idempotency_key)
        WHERE idempotency_key IS NOT NULL]],
    [[CREATE INDEX mail_message_sender_page ON mail_message(sender, created_at DESC, id DESC)]],
    [[CREATE INDEX mail_message_page ON mail_message(created_at DESC, id DESC)]],
    [[CREATE INDEX mail_message_sender_status_page ON mail_message(sender, status, created_at DESC, id DESC)]],
    [[CREATE INDEX mail_message_status_page ON mail_message(status, created_at DESC, id DESC)]],
    [[CREATE INDEX mail_message_check ON mail_message(next_check_at, id) WHERE status = 'queued']],
    [[CREATE INDEX mail_message_expiry ON mail_message(finished_at, id) WHERE finished_at IS NOT NULL]],
    [[CREATE INDEX mail_message_template_page ON mail_message(template, created_at DESC, id DESC)
        WHERE template IS NOT NULL]],
    [[CREATE INDEX mail_message_failed_at ON mail_message(finished_at, sender) WHERE status = 'failed']],
    [[CREATE INDEX mail_library_state ON mail_library(state, kind, name)]],
    [[CREATE INDEX mail_library_base ON mail_library(base, name) WHERE kind = 'message']],
    [[CREATE INDEX mail_asset_file_due ON mail_asset_file(due_at, upload_id) WHERE due_at IS NOT NULL]],
    [[CREATE INDEX mail_asset_restore_check ON mail_asset_file(restore_check_at, upload_id)
        WHERE state='held' AND restore_check_at IS NOT NULL]],
    [[CREATE INDEX mail_library_asset_upload ON mail_library_asset(upload_id)]],
    [[CREATE INDEX mail_library_history_page ON mail_library_history(kind,name,seq DESC)]],
    [[CREATE UNIQUE INDEX mail_library_history_version ON mail_library_history(kind,name,version)]],
    [[CREATE INDEX mail_library_upload_ref_reap ON mail_library_upload_ref(live,last_seq)]],
    [[CREATE INDEX mail_library_reference_to ON mail_library_reference(to_kind,to_name,from_kind,from_name)]],
    [[CREATE INDEX mail_library_preview_expiry ON mail_library_preview(expires_at,id)]],
    [[CREATE INDEX mail_message_asset_upload ON mail_message_asset(upload_id) WHERE upload_id IS NOT NULL]],
}

local function execute(db: sql.DB | sql.Transaction, statement: string)
    local _, err = db:execute(statement)
    if err then error(err) end
end

local function create(db: sql.DB | sql.Transaction, sqlite: boolean)
    local boolean_type = sqlite and "INTEGER" or "BOOLEAN"
    for _, statement in ipairs(tables) do
        if sqlite then statement = statement:gsub("BIGINT", "INTEGER") .. " STRICT" end
        statement = statement:gsub("@boolean@", boolean_type)
        execute(db, statement)
    end
    for _, statement in ipairs(indexes) do
        execute(db, statement)
    end
    if not sqlite then
        execute(db, [[CREATE INDEX mail_library_page ON mail_library(kind COLLATE "C", name COLLATE "C")]])
        execute(db, [[CREATE INDEX mail_library_asset_page ON mail_library_asset(name COLLATE "C") WHERE upload_id IS NOT NULL]])
    end
end

local function drop(db: sql.DB | sql.Transaction)
    for _, name in ipairs({
        "mail_library_live", "mail_library_upload_ref", "mail_library_history",
        "mail_library_preview", "mail_library_reference", "mail_message_asset", "mail_library_asset",
        "mail_asset_file", "mail_library", "mail_message",
    }) do
        execute(db, "DROP TABLE " .. name)
    end
end

return require("migration").define(function()
    migration("01 mail schema", function()
        database("sqlite", function()
            up(function(db: sql.DB | sql.Transaction) create(db, true) end)
            down(drop)
        end)
        database("postgres", function()
            up(function(db: sql.DB | sql.Transaction) create(db, false) end)
            down(drop)
        end)
    end)
end)
