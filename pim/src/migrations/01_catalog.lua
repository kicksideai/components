-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Fixed PIM tables. The fold creates each catalog's generated item tables
-- through kickside.pim.persist:layout.

local function run(db, statements)
    for _, statement in ipairs(statements) do
        local _, err = db:execute(statement)
        if err then error(err) end
    end
end

local POSTGRES = {
    [[CREATE TABLE kickside_pim_creation (
        catalog_id text NOT NULL, component_id text NOT NULL PRIMARY KEY, request text NOT NULL, token text NOT NULL, reserved_at text)]],
    [[CREATE INDEX kickside_pim_creation_expiry ON kickside_pim_creation(reserved_at,component_id) WHERE reserved_at IS NOT NULL]],
    [[CREATE INDEX kickside_pim_creation_catalog ON kickside_pim_creation(catalog_id,component_id)]],
    [[CREATE TABLE kickside_pim_receipt (
        catalog_id text NOT NULL, marker text NOT NULL, request_hash text NOT NULL,
        result text NOT NULL, first_seq bigint NOT NULL, event_count integer NOT NULL,
        noop integer NOT NULL, expires_at text NOT NULL, PRIMARY KEY(catalog_id, marker))]],
    [[CREATE INDEX kickside_pim_receipt_global_expiry ON kickside_pim_receipt(expires_at,catalog_id,marker)]],
    [[CREATE INDEX kickside_pim_receipt_expiry ON kickside_pim_receipt(catalog_id, expires_at, marker)]],
    [[CREATE TABLE kickside_pim_import_work (
        catalog_id text NOT NULL PRIMARY KEY,request_id text NOT NULL,storage_id text NOT NULL,path text NOT NULL,
        identity text NOT NULL,position text NOT NULL,batch text,job_id text NOT NULL,done integer NOT NULL,completed_at text)]],
    [[CREATE INDEX kickside_pim_import_expiry ON kickside_pim_import_work(catalog_id,completed_at) WHERE done=1]],
    [[CREATE TABLE kickside_pim_import_map (
        catalog_id text NOT NULL,old_id text NOT NULL,new_id text NOT NULL,sku text NOT NULL,refs text NOT NULL,
        PRIMARY KEY(catalog_id,old_id))]],
    [[CREATE TABLE kickside_pim_catalog (
        catalog_id text NOT NULL PRIMARY KEY,
        generation integer NOT NULL,
        plugin_after text NOT NULL DEFAULT '',
        retention_after text NOT NULL DEFAULT '{"archives":{}}',
        plugin_state text NOT NULL DEFAULT '{}',
        compiled text NOT NULL,
        digest text NOT NULL,
        layout_digest text NOT NULL,
        item_table text NOT NULL,
        applied_seq bigint NOT NULL,
        rebuild_after text,
        rebuild_seq bigint,
        rebuild_job text,
        pending_columns text,
        product_count bigint NOT NULL,
        item_count bigint NOT NULL,
        trashed_count bigint NOT NULL,
        tombstone_floor_seq bigint NOT NULL,
        created_at text NOT NULL,
        updated_at text NOT NULL)]],
    [[CREATE TABLE kickside_pim_generation (
        catalog_id text NOT NULL,
        generation integer NOT NULL,
        declaration text NOT NULL,
        compiled text NOT NULL,
        digest text NOT NULL,
        class text NOT NULL,
        actor text NOT NULL,
        applied_seq bigint NOT NULL,
        applied_at text NOT NULL,
        PRIMARY KEY (catalog_id, generation))]],
    [[CREATE INDEX kickside_pim_generation_expiry ON kickside_pim_generation(catalog_id,applied_at,generation)]],
    [[CREATE TABLE kickside_pim_term (
        catalog_id text NOT NULL,
        vocabulary text NOT NULL,
        code text NOT NULL,
        parent text,
        labels text NOT NULL,
        retired integer NOT NULL,
        retired_at text,
        updated_seq bigint NOT NULL,
        PRIMARY KEY (catalog_id, vocabulary, code))]],
    [[CREATE INDEX kickside_pim_term_expiry ON kickside_pim_term(catalog_id,retired_at,vocabulary,code) WHERE retired=1]],
    [[CREATE INDEX kickside_pim_term_parent ON kickside_pim_term(catalog_id,vocabulary,parent,code)]],
    [[CREATE TABLE kickside_pim_product (
        catalog_id text NOT NULL,
        product_id text NOT NULL,
        sku text NOT NULL,
        family text NOT NULL,
        parent_id text,
        root_id text NOT NULL,
        level integer NOT NULL,
        is_item integer NOT NULL,
        axis_key text,
        version bigint NOT NULL,
        status text NOT NULL,
        state text NOT NULL,
        state_at text,
        document text NOT NULL,
        source_seq text NOT NULL,
        release_id text,
        created_seq bigint NOT NULL,
        updated_seq bigint NOT NULL,
        PRIMARY KEY (catalog_id, product_id))]],
    [[CREATE INDEX kickside_pim_product_export ON kickside_pim_product(catalog_id,level,product_id) WHERE state='live']],
    [[CREATE INDEX kickside_pim_product_release ON kickside_pim_product(catalog_id,release_id) WHERE release_id IS NOT NULL]],
    [[CREATE UNIQUE INDEX kickside_pim_product_sku ON kickside_pim_product (catalog_id, sku) WHERE state = 'live']],
    [[CREATE UNIQUE INDEX kickside_pim_product_axis ON kickside_pim_product (catalog_id, parent_id, axis_key) WHERE state = 'live' AND axis_key IS NOT NULL]],
    [[CREATE INDEX kickside_pim_product_retention ON kickside_pim_product (catalog_id, state, state_at, product_id) WHERE state <> 'live']],
    [[CREATE INDEX kickside_pim_product_root ON kickside_pim_product (catalog_id, root_id)]],
    [[CREATE INDEX kickside_pim_product_changes ON kickside_pim_product (catalog_id, updated_seq, product_id)]],
    [[CREATE INDEX kickside_pim_product_parent ON kickside_pim_product (catalog_id, parent_id)]],
    [[CREATE TABLE kickside_pim_ref (
        catalog_id text NOT NULL,
        product_id text NOT NULL,
        attribute_id integer NOT NULL,
        ctx text NOT NULL,
        path text NOT NULL,
        kind text NOT NULL,
        target text NOT NULL,
        PRIMARY KEY (catalog_id, product_id, attribute_id, ctx, path))]],
    [[CREATE INDEX kickside_pim_ref_attribute ON kickside_pim_ref(catalog_id, attribute_id, product_id, ctx, path)]],
    [[CREATE INDEX kickside_pim_ref_target ON kickside_pim_ref (catalog_id, kind, target, product_id)]],
    [[CREATE TABLE kickside_pim_unique_value (
        catalog_id text NOT NULL,
        attribute_id integer NOT NULL,
        value_key text NOT NULL,
        product_id text NOT NULL,
        PRIMARY KEY (catalog_id, attribute_id, value_key))]],
    [[CREATE INDEX kickside_pim_unique_value_product ON kickside_pim_unique_value (catalog_id, product_id)]],
    [[CREATE TABLE kickside_pim_release (
        catalog_id text NOT NULL,
        release_id text NOT NULL,
        product_id text NOT NULL,
        version bigint NOT NULL,
        generation integer NOT NULL,
        snapshot text NOT NULL,
        hash text NOT NULL,
        channels text NOT NULL,
        seq bigint NOT NULL,
        created_at text NOT NULL,
        PRIMARY KEY (catalog_id, release_id))]],
    [[CREATE INDEX kickside_pim_release_product ON kickside_pim_release (catalog_id, product_id, seq)]],
    [[CREATE INDEX kickside_pim_release_expiry ON kickside_pim_release(catalog_id,created_at,release_id)]],
    [[CREATE INDEX kickside_pim_release_generation ON kickside_pim_release(catalog_id,generation)]],
    [[CREATE TABLE kickside_pim_publication (
        catalog_id text NOT NULL,
        channel text NOT NULL,
        product_id text NOT NULL,
        release_id text,
        state text NOT NULL,
        seq bigint NOT NULL,
        updated_at text NOT NULL,
        PRIMARY KEY (catalog_id, channel, product_id))]],
    [[CREATE INDEX kickside_pim_publication_product ON kickside_pim_publication(catalog_id,product_id,channel)]],
    [[CREATE INDEX kickside_pim_publication_published ON kickside_pim_publication(catalog_id,channel,product_id) WHERE state='published']],
    [[CREATE INDEX kickside_pim_publication_feed ON kickside_pim_publication (catalog_id, channel, seq, product_id)]],
    [[CREATE INDEX kickside_pim_publication_current ON kickside_pim_publication(catalog_id,release_id) WHERE state='published']],
    [[CREATE INDEX kickside_pim_publication_expiry ON kickside_pim_publication(catalog_id,updated_at,channel,product_id) WHERE state<>'published']],
    [[CREATE TABLE kickside_pim_publication_floor (
        catalog_id text NOT NULL,
        channel text NOT NULL,
        seq bigint NOT NULL,
        product_id text NOT NULL,
        PRIMARY KEY (catalog_id, channel))]],
    [[CREATE TABLE kickside_pim_proposal (
        catalog_id text NOT NULL,
        proposal_id text NOT NULL,
        source text,
        origin text NOT NULL,
        items text NOT NULL,
        base text NOT NULL,
        status text NOT NULL,
        result text,
        created_by text NOT NULL,
        created_at text NOT NULL,
        decided_by text,
        decided_at text,
        PRIMARY KEY (catalog_id, proposal_id),
        FOREIGN KEY (catalog_id) REFERENCES kickside_pim_catalog(catalog_id) ON DELETE CASCADE)]],
    [[CREATE INDEX kickside_pim_proposal_status ON kickside_pim_proposal (catalog_id, status, created_at)]],
    [[CREATE INDEX kickside_pim_proposal_expiry ON kickside_pim_proposal(catalog_id,created_at,proposal_id)]],
    [[CREATE TABLE kickside_pim_change (
        catalog_id text NOT NULL,
        seq bigint NOT NULL,
        n integer NOT NULL,
        subject text NOT NULL,
        kind text NOT NULL,
        attribute_id integer,
        ctx text,
        before text,
        after text,
        actor text NOT NULL,
        source text,
        origin text,
        at text NOT NULL,
        PRIMARY KEY (catalog_id, seq, n))]],
    [[CREATE INDEX kickside_pim_change_subject ON kickside_pim_change (catalog_id, subject, seq)]],
    [[CREATE INDEX kickside_pim_change_at ON kickside_pim_change (catalog_id, at, seq, n)]],
    [[CREATE TABLE kickside_pim_attribute_usage (
        catalog_id text NOT NULL,
        attribute_id integer NOT NULL,
        products bigint NOT NULL,
        PRIMARY KEY (catalog_id, attribute_id))]],
    [[CREATE INDEX kickside_pim_usage_zero ON kickside_pim_attribute_usage(catalog_id,attribute_id) WHERE products=0]],
    [[CREATE TABLE kickside_pim_merge (
        catalog_id text NOT NULL,
        vocabulary text NOT NULL,
        from_code text NOT NULL,
        into_code text NOT NULL,
        identity text NOT NULL,
        trace_context text,
        source text,
        requested_by text NOT NULL,
        created_at text NOT NULL,
        PRIMARY KEY (catalog_id, vocabulary, from_code))]],
    [[CREATE INDEX kickside_pim_merge_into ON kickside_pim_merge(catalog_id,vocabulary,into_code)]],
    [[CREATE TABLE kickside_pim_retention (
        owner_id text NOT NULL PRIMARY KEY, catalog_id text NOT NULL, inclusive integer NOT NULL, product_after text NOT NULL,
        deadline_ms bigint, pending integer NOT NULL DEFAULT 0, cleanup_turn integer NOT NULL DEFAULT 0)]],
    [[INSERT INTO kickside_pim_retention (owner_id, catalog_id, inclusive, product_after) VALUES ('pim', '', 0, '')]],
    [[CREATE TABLE kickside_pim_release_job (
        catalog_id text NOT NULL, request_id text NOT NULL, model_id text NOT NULL,
        root integer NOT NULL, identity text NOT NULL, channels text, job_id text NOT NULL, trace_context text, completed_at text, created_at text,
        after_product text NOT NULL, batch text, done integer NOT NULL,
        PRIMARY KEY (catalog_id, request_id))]],
    [[CREATE INDEX kickside_pim_release_job_abandoned ON kickside_pim_release_job(catalog_id,created_at,request_id) WHERE done=0]],
    [[CREATE INDEX kickside_pim_release_job_expiry ON kickside_pim_release_job(catalog_id,completed_at,request_id) WHERE done=1]],
    [[CREATE TABLE kickside_pim_schema_work (
        catalog_id text NOT NULL PRIMARY KEY, seq bigint NOT NULL)]],
    [[CREATE TABLE kickside_pim_cleanup (
        catalog_id text NOT NULL PRIMARY KEY, cleaned integer NOT NULL, attempted_at text NOT NULL DEFAULT '')]],
    [[CREATE INDEX kickside_pim_cleanup_attempt ON kickside_pim_cleanup(attempted_at,catalog_id)]],
}

local SQLITE = {}
for _, statement in ipairs(POSTGRES) do
    local s = statement:gsub("bigint", "INTEGER"):gsub("integer", "INTEGER"):gsub(" text", " TEXT")
    if s:find("^CREATE TABLE") then s = s .. " STRICT" end
    SQLITE[#SQLITE + 1] = s
end

local DROP = {
    "DROP TABLE kickside_pim_import_map",
    "DROP TABLE kickside_pim_import_work",
    "DROP TABLE kickside_pim_creation",
    "DROP TABLE kickside_pim_receipt",
    "DROP TABLE kickside_pim_cleanup",
    "DROP TABLE kickside_pim_schema_work",
    "DROP TABLE kickside_pim_release_job",
    "DROP TABLE kickside_pim_retention",
    "DROP TABLE kickside_pim_merge",
    "DROP TABLE kickside_pim_change",
    "DROP TABLE kickside_pim_proposal",
    "DROP TABLE kickside_pim_publication_floor",
    "DROP TABLE kickside_pim_publication",
    "DROP TABLE kickside_pim_release",
    "DROP TABLE kickside_pim_attribute_usage",
    "DROP TABLE kickside_pim_unique_value",
    "DROP TABLE kickside_pim_ref",
    "DROP TABLE kickside_pim_product",
    "DROP TABLE kickside_pim_term",
    "DROP TABLE kickside_pim_generation",
    "DROP TABLE kickside_pim_catalog",
}

return require("migration").define(function()
    migration("01 catalog", function()
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
