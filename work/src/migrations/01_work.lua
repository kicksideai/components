-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Fixed work tables: boards, schema generations, items, key prefixes, receipts, links,
-- change history, value intervals, comments, board jobs and template versions.
local operation_expiry = require("operation_expiry")

local function run(db, statements)
    for _, statement in ipairs(statements) do
        local _, err = db:execute(statement)
        if err then error(errors.wrap(err, "work migration failed")) end
    end
end

local POSTGRES = {
    [[CREATE TABLE kickside_work_board_meta (board_id text NOT NULL PRIMARY KEY, title text NOT NULL, description text NOT NULL, icon text NOT NULL, ui_app text NOT NULL, applied_seq bigint NOT NULL)]],
    [[CREATE TABLE kickside_work_operation (
        board_id text NOT NULL, operation_id text NOT NULL, kind text NOT NULL, key text, request_hash text NOT NULL,
        actor_id text NOT NULL, actor_context text NOT NULL, data text NOT NULL, status text NOT NULL,
        processed integer NOT NULL DEFAULT 0, counts text NOT NULL DEFAULT '{"applied":0,"unchanged":0,"invalid":0,"denied":0,"conflict":0,"unavailable":0}', error_code text, job_id text NOT NULL,
        PRIMARY KEY (board_id, operation_id), UNIQUE (board_id, kind, key))]],
    [[CREATE TABLE kickside_work_key_alias (
        board_id text NOT NULL, key text NOT NULL PRIMARY KEY, item_id text NOT NULL,
        to_board_id text NOT NULL, to_item_id text NOT NULL, at text NOT NULL)]],
    [[CREATE INDEX kickside_work_key_alias_expiry ON kickside_work_key_alias (board_id, at, key)]],
    [[CREATE TABLE kickside_work_retention (owner_id text NOT NULL PRIMARY KEY, orphan_after text NOT NULL, board_after text NOT NULL, inclusive integer NOT NULL, board_scan text NOT NULL CHECK (board_scan IN ('all','pending')), board_through text, discovery_turn integer NOT NULL DEFAULT 0, pending_page_budget bigint NOT NULL DEFAULT 0 CHECK (pending_page_budget >= 0))]],
    [[INSERT INTO kickside_work_retention (owner_id, orphan_after, board_after, inclusive, board_scan) VALUES ('work', '', '', 0, 'all')]],
    [[CREATE TABLE kickside_work_visibility (board_id text NOT NULL, item_id text NOT NULL, seq bigint NOT NULL, document text NOT NULL, at text NOT NULL DEFAULT '', PRIMARY KEY (board_id, item_id, seq))]],
    [[CREATE TABLE kickside_work_plugin (
        board_id text NOT NULL, plugin text NOT NULL, attachment_id text NOT NULL, impl_id text NOT NULL,
        config text NOT NULL, lifecycle text NOT NULL DEFAULT '{"state":"pending"}', progress text NOT NULL DEFAULT '{}', active integer NOT NULL, revision bigint NOT NULL, applied_revision bigint NOT NULL DEFAULT 0, PRIMARY KEY (board_id, plugin))]],
    [[CREATE TABLE kickside_work_board (
        board_id text NOT NULL PRIMARY KEY,
        key_prefix text NOT NULL,
        generation integer NOT NULL,
        schema_version bigint NOT NULL,
        compiled text NOT NULL,
        digest text NOT NULL,
        layout text,
        applied_seq bigint NOT NULL,
        counter bigint NOT NULL,
        tombstone_floor_seq bigint NOT NULL,
        retention_after text,
        retention_due_ms bigint,
        pack text,
        pack_version text,
        pack_digest text,
        pack_base text,
        created_at text NOT NULL,
        updated_at text NOT NULL)]],
    [[CREATE INDEX kickside_work_board_retention_due ON kickside_work_board (retention_due_ms, board_id) WHERE retention_due_ms IS NOT NULL]],
    [[CREATE TABLE kickside_work_prefix (
        prefix text NOT NULL PRIMARY KEY,
        board_id text NOT NULL,
        claimed_seq bigint NOT NULL,
        claim_version bigint NOT NULL)]],
    [[CREATE INDEX kickside_work_prefix_board ON kickside_work_prefix (board_id)]],
    [[CREATE TABLE kickside_work_receipt (
        board_id text NOT NULL, command_key text NOT NULL, request_hash text NOT NULL, principal text NOT NULL, at text NOT NULL, result text NOT NULL, seq bigint NOT NULL,
        PRIMARY KEY (board_id, command_key))]],
    [[CREATE INDEX kickside_work_receipt_expiry ON kickside_work_receipt (board_id, at, command_key)]],
    [[CREATE TABLE kickside_work_generation (
        board_id text NOT NULL,
        generation integer NOT NULL,
        declaration text NOT NULL,
        pack text,
        compiled text NOT NULL,
        maps text NOT NULL,
        digest text NOT NULL,
        class text NOT NULL,
        actor text NOT NULL,
        applied_seq bigint NOT NULL,
        applied_at text NOT NULL,
        PRIMARY KEY (board_id, generation))]],
    [[CREATE INDEX kickside_work_generation_expiry ON kickside_work_generation (board_id, applied_at, generation)]],
    [[CREATE TABLE kickside_work_item (
        board_id text NOT NULL,
        item_id text NOT NULL,
        number bigint NOT NULL,
        type text NOT NULL,
        state text NOT NULL,
        move_id text,
        process_data text NOT NULL DEFAULT '{}',
        findings text NOT NULL DEFAULT '[]',
        category text NOT NULL,
        process_generation integer NOT NULL,
        visit integer NOT NULL,
        parent_id text,
        path text NOT NULL,
        rank text,
        version bigint NOT NULL,
        life text NOT NULL,
        life_at text,
        document text NOT NULL,
        created_seq bigint NOT NULL,
        updated_seq bigint NOT NULL,
        created_at text NOT NULL,
        updated_at text NOT NULL,
        purge_pending integer NOT NULL DEFAULT 0,
        PRIMARY KEY (board_id, item_id))]],
    [[CREATE INDEX kickside_work_item_expiry ON kickside_work_item (board_id, life, life_at, item_id) WHERE life <> 'live']],
    [[CREATE TABLE kickside_work_approval (
        board_id text NOT NULL, item_id text NOT NULL, visit integer NOT NULL, actor text NOT NULL, decision text NOT NULL, at text NOT NULL,
        PRIMARY KEY (board_id, item_id, visit, actor))]],
    [[CREATE TABLE kickside_work_stage_run (
        board_id text NOT NULL, item_id text NOT NULL, visit integer NOT NULL, attempt integer NOT NULL, state text NOT NULL,
        started text NOT NULL, finished text, outcome text, outputs text, progress text, flow_run text,
        PRIMARY KEY (board_id, item_id, visit, attempt))]],
    [[CREATE TABLE kickside_work_field_usage (
        board_id text NOT NULL,
        field_id integer NOT NULL,
        items bigint NOT NULL,
        PRIMARY KEY (board_id, field_id))]],
    [[CREATE UNIQUE INDEX kickside_work_item_number ON kickside_work_item (board_id, number)]],
    [[CREATE INDEX kickside_work_item_changes ON kickside_work_item (board_id, updated_seq, item_id)]],
    [[CREATE INDEX kickside_work_item_parent ON kickside_work_item (board_id, parent_id)]],
    [[CREATE INDEX kickside_work_item_rank ON kickside_work_item (board_id, rank)]],
    [[CREATE TABLE kickside_work_link (
        board_id text NOT NULL,
        from_id text NOT NULL,
        type text NOT NULL,
        to_board_id text NOT NULL,
        to_id text NOT NULL,
        at text NOT NULL,
        seq bigint NOT NULL,
        PRIMARY KEY (board_id, from_id, type, to_board_id, to_id))]],
    [[CREATE INDEX kickside_work_link_target ON kickside_work_link (to_board_id, to_id, board_id, from_id, type)]],
    [[CREATE INDEX kickside_work_link_type ON kickside_work_link (board_id, type, from_id)]],
    [[CREATE INDEX kickside_work_link_outward_page ON kickside_work_link (board_id, from_id, seq, type, to_board_id, to_id)]],
    [[CREATE INDEX kickside_work_link_inward_page ON kickside_work_link (to_board_id, to_id, seq, board_id, from_id, type)]],
    [[CREATE INDEX kickside_work_link_target_page ON kickside_work_link (to_board_id, to_id, board_id, seq, from_id, type)]],
    [[CREATE TABLE kickside_work_change (
        board_id text NOT NULL,
        seq bigint NOT NULL,
        n integer NOT NULL,
        subject text NOT NULL,
        kind text NOT NULL,
        field_id integer,
        before text,
        after text,
        actor text NOT NULL,
        source text,
        origin text,
        at text NOT NULL,
        PRIMARY KEY (board_id, seq, n))]],
    [[CREATE INDEX kickside_work_change_subject ON kickside_work_change (board_id, subject, seq, n)]],
    [[CREATE INDEX kickside_work_change_at ON kickside_work_change (board_id, at, seq, n)]],
    [[CREATE TABLE kickside_work_interval (
        board_id text NOT NULL,
        item_id text NOT NULL,
        field_id text NOT NULL,
        start_seq bigint NOT NULL,
        value_key text NOT NULL,
        started_at text NOT NULL,
        actor text NOT NULL DEFAULT '',
        changed integer NOT NULL DEFAULT 0,
        before_key text,
        end_seq bigint,
        ended_by text,
        end_value text,
        ended_at text,
        PRIMARY KEY (board_id, item_id, field_id, start_seq))]],
    [[CREATE INDEX kickside_work_interval_expiry ON kickside_work_interval (board_id, ended_at, item_id, field_id, start_seq) WHERE ended_at IS NOT NULL]],
    [[CREATE TABLE kickside_work_comment (
        board_id text NOT NULL,
        comment_id text NOT NULL,
        item_id text NOT NULL,
        body text NOT NULL,
        mentions text NOT NULL,
        author text NOT NULL,
        version integer NOT NULL,
        deleted integer NOT NULL,
        created_at text NOT NULL,
        edited_at text,
        PRIMARY KEY (board_id, comment_id))]],
    [[CREATE INDEX kickside_work_comment_item ON kickside_work_comment (board_id, item_id, created_at, comment_id) WHERE deleted=0]],
    [[CREATE TABLE kickside_work_job (
        board_id text NOT NULL,
        job_id text NOT NULL,
        job_type text NOT NULL,
        key text NOT NULL,
        status text NOT NULL,
        error text,
        failed_at text,
        PRIMARY KEY (board_id, job_id))]],
    [[CREATE INDEX kickside_work_visibility_age ON kickside_work_visibility (board_id,at,seq)]],
    [[CREATE INDEX kickside_work_comment_page ON kickside_work_comment (board_id,item_id,deleted,comment_id)]],
    [[CREATE INDEX kickside_work_purge_pending ON kickside_work_item (board_id, life_at, item_id) WHERE purge_pending=1 AND life='purged']],
    [[CREATE INDEX kickside_work_approval_age ON kickside_work_approval (board_id, at, item_id, visit, actor)]],
    [[CREATE INDEX kickside_work_stage_run_age ON kickside_work_stage_run (board_id, COALESCE(finished, started), item_id, visit, attempt)]],
    [[CREATE INDEX kickside_work_job_failed ON kickside_work_job (board_id, failed_at, job_id) WHERE status='failed']],
    [[CREATE INDEX kickside_work_job_done ON kickside_work_job (board_id, job_id) WHERE status='done']],
    [[CREATE INDEX kickside_work_job_active ON kickside_work_job (board_id, status)]],
    [[CREATE INDEX kickside_work_item_generation ON kickside_work_item (board_id, life, process_generation)]],
    [[CREATE INDEX kickside_work_operation_lookup ON kickside_work_operation (operation_id)]],
    [[CREATE INDEX kickside_work_item_move ON kickside_work_item (board_id, move_id) WHERE move_id IS NOT NULL]],
    [[CREATE INDEX kickside_work_field_unused ON kickside_work_field_usage (board_id, field_id) WHERE items=0]],
    [[CREATE INDEX kickside_work_plugin_converged ON kickside_work_plugin (board_id, plugin) WHERE active=0 AND revision=applied_revision]],
    [[CREATE INDEX kickside_work_visibility_floor ON kickside_work_visibility (board_id, seq, item_id)]],
    [[CREATE INDEX kickside_work_comment_purge ON kickside_work_comment (board_id, item_id, comment_id)]],
    [[CREATE INDEX kickside_work_comment_deleted ON kickside_work_comment (board_id, edited_at, comment_id) WHERE deleted=1]],
    [[CREATE TABLE kickside_work_template_version (
        attachment_id text NOT NULL, template_id text NOT NULL, version text NOT NULL,
        record text NOT NULL, field_identities text NOT NULL, type_identity text NOT NULL,
        archived integer NOT NULL DEFAULT 0, expires_at text,
        PRIMARY KEY (attachment_id, template_id, version))]],
    [[CREATE INDEX kickside_work_template_active ON kickside_work_template_version
        (attachment_id, template_id, version) WHERE archived = 0]],
    [[CREATE INDEX kickside_work_template_expiry ON kickside_work_template_version
        (expires_at, attachment_id, template_id, version) WHERE expires_at IS NOT NULL]],
}

local SQLITE = {}
for _, statement in ipairs(POSTGRES) do
    local s = statement:gsub("bigint", "INTEGER"):gsub("integer", "INTEGER"):gsub(" text", " TEXT")
    if s:find("^CREATE TABLE") then s = s .. " STRICT" end
    SQLITE[#SQLITE + 1] = s
end

for dialect, statements in pairs({ postgres = POSTGRES, sqlite = SQLITE }) do
    local interval_value = dialect == "postgres" and "md5(value_key)" or "value_key"
    statements[#statements + 1] = "CREATE INDEX kickside_work_interval_value ON kickside_work_interval (board_id, field_id, " ..
        interval_value .. ", started_at)"
    statements[#statements + 1] = "CREATE INDEX kickside_work_operation_expiry ON kickside_work_operation (board_id, " ..
        operation_expiry.at(dialect) .. ", operation_id) WHERE " .. operation_expiry.TERMINAL
end

local DROP = {
    "DROP TABLE kickside_work_template_version",
    "DROP TABLE kickside_work_board_meta",
    "DROP TABLE kickside_work_key_alias",
    "DROP TABLE kickside_work_operation",
    "DROP TABLE kickside_work_approval",
    "DROP TABLE kickside_work_stage_run",
    "DROP TABLE kickside_work_retention",
    "DROP TABLE kickside_work_receipt",
    "DROP TABLE kickside_work_visibility",
    "DROP TABLE kickside_work_plugin",
    "DROP TABLE kickside_work_job",
    "DROP TABLE kickside_work_comment",
    "DROP TABLE kickside_work_interval",
    "DROP TABLE kickside_work_change",
    "DROP TABLE kickside_work_link",
    "DROP TABLE kickside_work_field_usage",
    "DROP TABLE kickside_work_item",
    "DROP TABLE kickside_work_prefix",
    "DROP TABLE kickside_work_generation",
    "DROP TABLE kickside_work_board",
}

return require("migration").define(function()
    migration("01 work", function()
        database("postgres", function()
            up(function(db) run(db, POSTGRES) end)
            down(function(db) run(db, DROP) end)
        end)
        database("sqlite", function()
            up(function(db) run(db, SQLITE) end)
            down(function(db) run(db, DROP) end)
        end)
    end)
end)
