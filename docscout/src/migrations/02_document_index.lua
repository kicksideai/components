-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Processed documents become an indexed cache: one row per upload, owner and
-- processing settings, with chunks searchable by keyword and by vector through
-- kickside/search-index. Processed documents expire, so the earlier single-table
-- cache is dropped rather than converted.
local SQLITE = {
    [=[DROP TABLE IF EXISTS kickside_docscout_documents]=],
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
}
local POSTGRES = {
    [=[CREATE EXTENSION IF NOT EXISTS vector]=],
    [=[DROP TABLE IF EXISTS kickside_docscout_documents]=],
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
        search_vector tsvector GENERATED ALWAYS AS (to_tsvector('simple', regexp_replace(COALESCE(content, ''), '[^[:alnum:]]+', ' ', 'g'))) STORED)]=],
    [=[CREATE INDEX kickside_docscout_chunks_document ON kickside_docscout_chunks(document_id,ordinal)]=],
    [=[CREATE INDEX kickside_docscout_chunks_section ON kickside_docscout_chunks(document_id,section_id)]=],
    [=[CREATE INDEX kickside_docscout_chunks_fts ON kickside_docscout_chunks USING gin (search_vector)]=],
    [=[CREATE TABLE kickside_docscout_chunk_vectors (
        chunk_id TEXT PRIMARY KEY, document_id TEXT NOT NULL, embedding vector(512) NOT NULL)]=],
    [=[CREATE INDEX kickside_docscout_chunk_vectors_document ON kickside_docscout_chunk_vectors(document_id)]=],
    [=[CREATE INDEX kickside_docscout_chunk_vectors_hnsw ON kickside_docscout_chunk_vectors USING hnsw (embedding vector_cosine_ops)]=],
}
return require("migration").define(function()
    migration("Index processed documents for keyword and vector search", function()
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
