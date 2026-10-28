-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Docscout's own tables. Processed documents are an expiring cache: one row per
-- upload, owner and processing settings, with chunks searchable by keyword and by
-- vector through kickside/search-index; both dialects index the chunk's context
-- with its text. Runs expire with the same window.
-- Evaluation cases, evaluations and their per-case results belong to the
-- extractor and go when it is deleted.
local SQLITE = {
    [=[CREATE TABLE kickside_docscout_documents (
        id TEXT PRIMARY KEY, owner_id TEXT NOT NULL, upload_id TEXT NOT NULL,
        content_checksum TEXT NOT NULL, processing_key TEXT NOT NULL,
        outline TEXT NOT NULL, page_count INTEGER NOT NULL DEFAULT 0, chunk_count INTEGER NOT NULL,
        tokens INTEGER NOT NULL DEFAULT 0, created_at TEXT NOT NULL, expires_at TEXT NOT NULL)]=],
    [=[CREATE UNIQUE INDEX kickside_docscout_documents_key ON kickside_docscout_documents(owner_id,upload_id,content_checksum,processing_key)]=],
    [=[CREATE INDEX kickside_docscout_documents_expiry ON kickside_docscout_documents(expires_at)]=],
    [=[CREATE TABLE kickside_docscout_chunks (
        id TEXT PRIMARY KEY, document_id TEXT NOT NULL, ordinal INTEGER NOT NULL,
        section_id TEXT NOT NULL, heading_path TEXT NOT NULL, page_start INTEGER, page_end INTEGER,
        content TEXT NOT NULL, context TEXT NOT NULL DEFAULT '')]=],
    [=[CREATE INDEX kickside_docscout_chunks_document ON kickside_docscout_chunks(document_id,ordinal)]=],
    [=[CREATE INDEX kickside_docscout_chunks_section ON kickside_docscout_chunks(document_id,section_id)]=],
    [=[CREATE VIRTUAL TABLE kickside_docscout_chunks_fts USING fts5(
        chunk_id UNINDEXED, content, tokenize = 'unicode61 remove_diacritics 2')]=],
    [=[CREATE VIRTUAL TABLE kickside_docscout_chunk_vectors USING vec0(
        chunk_id TEXT PRIMARY KEY, document_id TEXT PARTITION KEY, embedding float[512])]=],
    [=[CREATE TABLE kickside_docscout_runs (
        id TEXT PRIMARY KEY, component_id TEXT NOT NULL, user_id TEXT NOT NULL,
        upload_id TEXT NOT NULL, caller TEXT NOT NULL, status TEXT NOT NULL,
        config_revision BIGINT NOT NULL, result TEXT NOT NULL, trace TEXT NOT NULL,
        duration_ms BIGINT NOT NULL, tokens BIGINT NOT NULL,
        created_at TEXT NOT NULL, expires_at TEXT NOT NULL)]=],
    [=[CREATE INDEX kickside_docscout_runs_owner ON kickside_docscout_runs(component_id,created_at)]=],
    [=[CREATE INDEX kickside_docscout_runs_expiry ON kickside_docscout_runs(expires_at)]=],
    [=[CREATE TABLE kickside_docscout_cases (
        id TEXT PRIMARY KEY, component_id TEXT NOT NULL, upload_id TEXT NOT NULL,
        upload_name TEXT NOT NULL, expected_values TEXT NOT NULL, created_at TEXT NOT NULL)]=],
    [=[CREATE INDEX kickside_docscout_cases_owner ON kickside_docscout_cases(component_id)]=],
    [=[CREATE TABLE kickside_docscout_evals (
        id TEXT PRIMARY KEY, component_id TEXT NOT NULL, config_revision BIGINT NOT NULL, fields TEXT NOT NULL,
        status TEXT NOT NULL, actor_id TEXT NOT NULL, actor_context TEXT NOT NULL,
        case_count INTEGER NOT NULL, metrics TEXT, tokens BIGINT NOT NULL DEFAULT 0,
        duration_ms BIGINT NOT NULL DEFAULT 0, error TEXT, created_at TEXT NOT NULL, finished_at TEXT)]=],
    [=[CREATE INDEX kickside_docscout_evals_owner ON kickside_docscout_evals(component_id,created_at)]=],
    [=[CREATE TABLE kickside_docscout_eval_results (
        eval_id TEXT NOT NULL, case_id TEXT NOT NULL, upload_name TEXT NOT NULL, status TEXT NOT NULL,
        run_id TEXT, scores TEXT, tokens BIGINT NOT NULL DEFAULT 0, duration_ms BIGINT NOT NULL DEFAULT 0,
        error TEXT, finished_at TEXT, PRIMARY KEY (eval_id, case_id))]=],
}
local POSTGRES = {
    [=[CREATE EXTENSION IF NOT EXISTS vector]=],
    [=[CREATE TABLE kickside_docscout_documents (
        id TEXT PRIMARY KEY, owner_id TEXT NOT NULL, upload_id TEXT NOT NULL,
        content_checksum TEXT NOT NULL, processing_key TEXT NOT NULL,
        outline TEXT NOT NULL, page_count INTEGER NOT NULL DEFAULT 0, chunk_count INTEGER NOT NULL,
        tokens BIGINT NOT NULL DEFAULT 0, created_at TEXT NOT NULL, expires_at TEXT NOT NULL)]=],
    [=[CREATE UNIQUE INDEX kickside_docscout_documents_key ON kickside_docscout_documents(owner_id,upload_id,content_checksum,processing_key)]=],
    [=[CREATE INDEX kickside_docscout_documents_expiry ON kickside_docscout_documents(expires_at)]=],
    [=[CREATE TABLE kickside_docscout_chunks (
        id TEXT PRIMARY KEY, document_id TEXT NOT NULL, ordinal INTEGER NOT NULL,
        section_id TEXT NOT NULL, heading_path TEXT NOT NULL, page_start INTEGER, page_end INTEGER,
        content TEXT NOT NULL, context TEXT NOT NULL DEFAULT '',
        search_vector tsvector GENERATED ALWAYS AS (to_tsvector('simple', regexp_replace(COALESCE(context, '') || ' ' || COALESCE(content, ''), '[^[:alnum:]]+', ' ', 'g'))) STORED)]=],
    [=[CREATE INDEX kickside_docscout_chunks_document ON kickside_docscout_chunks(document_id,ordinal)]=],
    [=[CREATE INDEX kickside_docscout_chunks_section ON kickside_docscout_chunks(document_id,section_id)]=],
    [=[CREATE INDEX kickside_docscout_chunks_fts ON kickside_docscout_chunks USING gin (search_vector)]=],
    [=[CREATE TABLE kickside_docscout_chunk_vectors (
        chunk_id TEXT PRIMARY KEY, document_id TEXT NOT NULL, embedding vector(512) NOT NULL)]=],
    [=[CREATE INDEX kickside_docscout_chunk_vectors_document ON kickside_docscout_chunk_vectors(document_id)]=],
    [=[CREATE INDEX kickside_docscout_chunk_vectors_hnsw ON kickside_docscout_chunk_vectors USING hnsw (embedding vector_cosine_ops)]=],
    [=[CREATE TABLE kickside_docscout_runs (
        id TEXT PRIMARY KEY, component_id TEXT NOT NULL, user_id TEXT NOT NULL,
        upload_id TEXT NOT NULL, caller TEXT NOT NULL, status TEXT NOT NULL,
        config_revision BIGINT NOT NULL, result TEXT NOT NULL, trace TEXT NOT NULL,
        duration_ms BIGINT NOT NULL, tokens BIGINT NOT NULL,
        created_at TEXT NOT NULL, expires_at TEXT NOT NULL)]=],
    [=[CREATE INDEX kickside_docscout_runs_owner ON kickside_docscout_runs(component_id,created_at)]=],
    [=[CREATE INDEX kickside_docscout_runs_expiry ON kickside_docscout_runs(expires_at)]=],
    [=[CREATE TABLE kickside_docscout_cases (
        id TEXT PRIMARY KEY, component_id TEXT NOT NULL, upload_id TEXT NOT NULL,
        upload_name TEXT NOT NULL, expected_values TEXT NOT NULL, created_at TEXT NOT NULL)]=],
    [=[CREATE INDEX kickside_docscout_cases_owner ON kickside_docscout_cases(component_id)]=],
    [=[CREATE TABLE kickside_docscout_evals (
        id TEXT PRIMARY KEY, component_id TEXT NOT NULL, config_revision BIGINT NOT NULL, fields TEXT NOT NULL,
        status TEXT NOT NULL, actor_id TEXT NOT NULL, actor_context TEXT NOT NULL,
        case_count INTEGER NOT NULL, metrics TEXT, tokens BIGINT NOT NULL DEFAULT 0,
        duration_ms BIGINT NOT NULL DEFAULT 0, error TEXT, created_at TEXT NOT NULL, finished_at TEXT)]=],
    [=[CREATE INDEX kickside_docscout_evals_owner ON kickside_docscout_evals(component_id,created_at)]=],
    [=[CREATE TABLE kickside_docscout_eval_results (
        eval_id TEXT NOT NULL, case_id TEXT NOT NULL, upload_name TEXT NOT NULL, status TEXT NOT NULL,
        run_id TEXT, scores TEXT, tokens BIGINT NOT NULL DEFAULT 0, duration_ms BIGINT NOT NULL DEFAULT 0,
        error TEXT, finished_at TEXT, PRIMARY KEY (eval_id, case_id))]=],
}
return require("migration").define(function()
    migration("Create Docscout documents, runs and evaluations", function()
        for dialect, statements in pairs({ sqlite = SQLITE, postgres = POSTGRES }) do
            database(dialect, function()
                up(function(db)
                    for _, statement in ipairs(statements) do
                        local _, err = db:execute(statement)
                        if err then error(err) end
                    end
                end)
            end)
        end
    end)
end)
