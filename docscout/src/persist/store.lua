-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Processed documents: one row per extractor, owner, upload, content and processing
-- settings, with ordered chunks indexed for keyword and vector search.
local sql = require("sql")
local database = require("database")
local persisted_json = require("persisted_json")
local canonical_json = require("canonical_json")
local index = require("index")
local uuid = require("uuid")

local M = {}

local COLUMNS = { "ordinal", "section_id", "heading_path", "page_start", "page_end", "content", "context", "page_spans" }
local SPEC = {
    vectors = "kickside_docscout_chunk_vectors",
    vector_key = "chunk_id",
    rows = "kickside_docscout_chunks",
    row_key = "id",
    partition = "document_id",
    columns = COLUMNS,
    fts = "kickside_docscout_chunks_fts",
    fts_key = "chunk_id",
    tsvector = "search_vector",
}

local now, failed = database.now, database.failed

local function decode_chunk(row: any): (any?, error?)
    row.ordinal = math.tointeger(tonumber(row.ordinal)) or 0
    row.page_start = row.page_start and math.tointeger(tonumber(row.page_start)) or nil
    row.page_end = row.page_end and math.tointeger(tonumber(row.page_end)) or nil
    local spans, spans_err = persisted_json.decode_table(row.page_spans, "chunk page spans")
    if spans_err then return nil, spans_err end
    row.page_spans = spans
    row.similarity = row.similarity and tonumber(row.similarity) or nil
    return row
end

-- A fresh processed copy for this owner, upload, content and settings, or nil.
function M.find(component_id: string, owner_id: string, upload_id: string, checksum: string, processing_key: string): (any?, error?)
    return database.with_db(function(db: any): (any?, error?)
        local rows, query_err = db:query([[SELECT id, outline, page_count, chunk_count, tokens, expires_at FROM kickside_docscout_documents
            WHERE component_id=$1 AND owner_id=$2 AND upload_id=$3 AND content_checksum=$4 AND processing_key=$5 AND expires_at > $6]],
            { component_id, owner_id, upload_id, checksum, processing_key, now() })
        if query_err then return nil, failed("processed document lookup failed", query_err) end
        local row = rows and rows[1]
        if not row then return nil, nil end
        local outline, decode_err = persisted_json.decode_table(row.outline, "document outline")
        if decode_err then return nil, decode_err end
        row.outline = outline
        row.chunk_count = math.tointeger(tonumber(row.chunk_count)) or 0
        row.page_count = math.tointeger(tonumber(row.page_count)) or 0
        return row, nil
    end)
end

-- Stores a processed document with its chunks and vectors in one transaction
-- and returns its id. A fresh copy saved meanwhile by another run under the
-- same key is kept and its id returned; an expired copy is replaced.
function M.save(doc: any, chunks: { any }): (string?, error?)
    return database.transaction(doc.component_id, function(tx: any, db: any): (any?, error?)
        local sqlite, type_err = index.is_sqlite(db)
        if type_err then return nil, type_err end
        local function abort(message: string, cause: error): (nil, error)
            return nil, errors.wrap(cause, message)
        end
        local existing, lookup_err = tx:query([[SELECT id, expires_at FROM kickside_docscout_documents
            WHERE component_id=$1 AND owner_id=$2 AND upload_id=$3 AND content_checksum=$4 AND processing_key=$5]],
            { doc.component_id, doc.owner_id, doc.upload_id, doc.checksum, doc.processing_key })
        if lookup_err then return abort("processed document lookup failed", lookup_err) end
        for _, row in ipairs(existing or {}) do
            if row.expires_at > now() then
                return row.id, nil
            end
            local remove_err = M.remove_tx(tx, sqlite, { row.id })
            if remove_err then return abort("expired processed document could not be removed", remove_err) end
        end
        local outline, encode_err = canonical_json.encode(doc.outline)
        if encode_err then return abort("processed document outline could not be encoded", encode_err) end
        local id = uuid.v7()
        local created = now()
        local inserted, insert_err = tx:execute([[INSERT INTO kickside_docscout_documents
            (id, component_id, owner_id, upload_id, content_checksum, processing_key, outline, page_count, chunk_count, tokens, created_at, expires_at)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
            ON CONFLICT (component_id,owner_id,upload_id,content_checksum,processing_key) DO NOTHING]],
            { id, doc.component_id, doc.owner_id, doc.upload_id, doc.checksum, doc.processing_key, outline, doc.page_count, #chunks, doc.tokens, created, doc.expires_at })
        if insert_err then return abort("processed document could not be stored", insert_err) end
        if inserted.rows_affected == 0 then
            local winner, winner_err = tx:query([[SELECT id FROM kickside_docscout_documents
                WHERE component_id=$1 AND owner_id=$2 AND upload_id=$3 AND content_checksum=$4 AND processing_key=$5]],
                { doc.component_id, doc.owner_id, doc.upload_id, doc.checksum, doc.processing_key })
            if winner_err then return nil, winner_err end
            return winner[1].id, nil
        end
        local rows, vectors = {}, {}
        for _, chunk in ipairs(chunks) do
            local chunk_id = id .. ":" .. tostring(chunk.ordinal)
            local context = chunk.context or ""
            local spans, spans_err = canonical_json.encode(chunk.page_spans or {})
            if spans_err then return nil, spans_err end
            rows[#rows + 1] = { chunk_id, id, chunk.ordinal, chunk.section_id, chunk.heading_path,
                chunk.page_start or sql.as.null(), chunk.page_end or sql.as.null(), chunk.content, context, spans }
            vectors[#vectors + 1] = { chunk_id, id, index.vector_literal(chunk.vector) }
            if sqlite then
                local _, fts_err = tx:execute("INSERT INTO kickside_docscout_chunks_fts (chunk_id, content) VALUES ($1, $2)",
                    { chunk_id, (context ~= "" and (context .. "\n") or "") .. chunk.content })
                if fts_err then return abort("chunk keyword index could not be written", fts_err) end
            end
        end
        local rows_err = index.insert_rows_tx(tx, "kickside_docscout_chunks",
            { "id", "document_id", "ordinal", "section_id", "heading_path", "page_start", "page_end", "content", "context", "page_spans" }, rows)
        if rows_err then return abort("chunks could not be stored", rows_err) end
        local vec_err = index.insert_rows_tx(tx, "kickside_docscout_chunk_vectors", { "chunk_id", "document_id", "embedding" }, vectors)
        if vec_err then return abort("chunk vectors could not be stored", vec_err) end
        return id, nil
    end)
end

function M.remove_tx(tx: any, sqlite: boolean, document_ids: { string }): error?
    if #document_ids == 0 then return nil end
    local selected = " IN (" .. index.placeholders(#document_ids) .. ")"
    if sqlite then
        local _, fts_err = tx:execute("DELETE FROM kickside_docscout_chunks_fts WHERE chunk_id IN (SELECT id FROM kickside_docscout_chunks WHERE document_id" .. selected .. ")", document_ids)
        if fts_err then return fts_err end
    end
    for _, statement in ipairs({
        "DELETE FROM kickside_docscout_chunk_vectors WHERE document_id",
        "DELETE FROM kickside_docscout_chunks WHERE document_id",
        "DELETE FROM kickside_docscout_documents WHERE id",
    }) do
        local _, err = tx:execute(statement .. selected, document_ids)
        if err then return err end
    end
    return nil
end

function M.remove_component_tx(tx: any, db: any, component_id: string): error?
    local sqlite, type_err = index.is_sqlite(db)
    if type_err then return type_err end
    local rows, err = tx:query("SELECT id FROM kickside_docscout_documents WHERE component_id=$1", { component_id })
    if err then return err end
    local ids = {}
    for _, row in ipairs(rows) do ids[#ids + 1] = row.id end
    return M.remove_tx(tx, sqlite, ids)
end

-- Removes processed documents past their expiry, in batches.
function M.expire(limit: integer): (integer?, error?)
    return database.transaction(nil, function(tx: any, db: any): (any?, error?)
        local sqlite, type_err = index.is_sqlite(db)
        if type_err then return nil, type_err end
        local rows, query_err = tx:query("SELECT id FROM kickside_docscout_documents WHERE expires_at <= $1 ORDER BY expires_at LIMIT $2", { now(), limit })
        if query_err then return nil, query_err end
        local ids = {}
        for _, row in ipairs(rows) do ids[#ids + 1] = row.id end
        local remove_err = M.remove_tx(tx, sqlite, ids)
        if remove_err then return nil, remove_err end
        return #rows, nil
    end)
end

-- Searches one processed document. mode is keyword, semantic or hybrid;
-- ordinals, when given, keeps results inside that region of the document,
-- and an empty region produces an empty result.
function M.search(document_id: string, opts: any): (any?, error?)
    if opts.ordinals and #opts.ordinals == 0 then return {}, nil end
    return database.with_db(function(db: any): (any?, error?)
        local filters: { any } = {}
        if opts.ordinals then filters[1] = { column = "ordinal", values = opts.ordinals } end
        local search_opts: any = { partition = document_id, limit = math.tointeger(opts.limit) or 10, filters = filters, query_text = opts.text }
        local rows, search_err
        if opts.mode == "keyword" then
            rows, search_err = index.lexical_search(db, SPEC, opts.text, search_opts)
        elseif opts.mode == "semantic" then
            search_opts.query_text = nil
            rows, search_err = index.dense_search(db, SPEC, opts.vector, search_opts)
        else
            rows, search_err = index.search(db, SPEC, opts.vector, search_opts)
        end
        if search_err then return nil, failed("document search failed", search_err) end
        local hits = {}
        for _, row in ipairs(rows or {}) do
            local hit, decode_err = decode_chunk(row)
            if decode_err then return nil, decode_err end
            if opts.min_similarity == nil or hit.similarity == nil or hit.similarity >= opts.min_similarity then hits[#hits + 1] = hit end
        end
        return hits, nil
    end)
end

-- Chunks at the given ordinals, in document order.
function M.chunks_at(document_id: string, ordinals: { integer }): (any?, error?)
    if #ordinals == 0 then return {}, nil end
    return database.with_db(function(db: any): (any?, error?)
        local params: { any } = { document_id }
        for _, n in ipairs(ordinals) do params[#params + 1] = n end
        local rows, query_err = db:query("SELECT id, " .. table.concat(COLUMNS, ", ") ..
            " FROM kickside_docscout_chunks WHERE document_id=$1 AND ordinal IN (" .. index.placeholders(#ordinals, 2) .. ") ORDER BY ordinal", params)
        if query_err then return nil, failed("chunks could not be read", query_err) end
        local out = {}
        for _, row in ipairs(rows or {}) do
            local chunk, decode_err = decode_chunk(row)
            if decode_err then return nil, decode_err end
            out[#out + 1] = chunk
        end
        return out, nil
    end)
end

-- Every chunk of a document in order, for exact quote checks.
function M.all_chunks(document_id: string): (any?, error?)
    return database.with_db(function(db: any): (any?, error?)
        local rows, query_err = db:query("SELECT id, " .. table.concat(COLUMNS, ", ") ..
            " FROM kickside_docscout_chunks WHERE document_id=$1 ORDER BY ordinal", { document_id })
        if query_err then return nil, failed("document chunks could not be read", query_err) end
        local out = {}
        for _, row in ipairs(rows or {}) do
            local chunk, decode_err = decode_chunk(row)
            if decode_err then return nil, decode_err end
            out[#out + 1] = chunk
        end
        return out, nil
    end)
end

return M
