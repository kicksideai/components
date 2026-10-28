-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Processed documents: one row per owner, upload, content and processing
-- settings, with ordered chunks indexed for keyword and vector search.
local sql = require("sql")
local registry = require("registry")
local json = require("json")
local time = require("time")
local index = require("index")
local uuid = require("uuid")

local M = {}

local COLUMNS = { "ordinal", "section_id", "heading_path", "page_start", "page_end", "content", "context" }
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

-- Database failures: a native error keeps its classification; a driver
-- message is an unavailable database.
local function failed(message: string, cause: any): error
    if type(cause) == "userdata" then return errors.wrap(cause, message) end
    return errors.new({ kind = errors.UNAVAILABLE, message = message .. ": " .. tostring(cause), retryable = true })
end

local function open(): (any?, boolean, error?)
    local entry, err = registry.get("kickside.docscout:db_config")
    if err then return nil, false, failed("docscout database configuration is unavailable", err) end
    local db, db_err = sql.get((entry :: any).meta.db_id)
    if db_err or not db then return nil, false, failed("docscout database is unavailable", db_err) end
    local sqlite, type_err = index.is_sqlite(db)
    if type_err then db:release(); return nil, false, failed("docscout database type is unavailable", type_err) end
    return db, sqlite == true, nil
end

local function now(): string return time.now():utc():format(time.RFC3339) end

local function decode_chunk(row: any): any
    row.ordinal = math.tointeger(tonumber(row.ordinal)) or 0
    row.page_start = row.page_start and math.tointeger(tonumber(row.page_start)) or nil
    row.page_end = row.page_end and math.tointeger(tonumber(row.page_end)) or nil
    row.similarity = row.similarity and tonumber(row.similarity) or nil
    return row
end

-- A fresh processed copy for this owner, upload, content and settings, or nil.
function M.find(owner_id: string, upload_id: string, checksum: string, processing_key: string): (any?, error?)
    local db, _, err = open()
    if err then return nil, err end
    local rows, query_err = db:query([[SELECT id, outline, page_count, chunk_count, tokens, expires_at FROM kickside_docscout_documents
        WHERE owner_id=$1 AND upload_id=$2 AND content_checksum=$3 AND processing_key=$4 AND expires_at > $5]],
        { owner_id, upload_id, checksum, processing_key, now() })
    db:release()
    if query_err then return nil, failed("processed document lookup failed", query_err) end
    local row = rows and rows[1]
    if not row then return nil, nil end
    local outline, decode_err = json.decode(row.outline)
    if decode_err then return nil, failed("processed document outline is unreadable", decode_err) end
    row.outline = outline
    row.chunk_count = math.tointeger(tonumber(row.chunk_count)) or 0
    row.page_count = math.tointeger(tonumber(row.page_count)) or 0
    return row, nil
end

-- Stores a processed document with its chunks and vectors in one transaction
-- and returns its id. A fresh copy saved meanwhile by another run under the
-- same key is kept and its id returned; an expired copy is replaced.
function M.save(doc: any, chunks: { any }): (string?, error?)
    local db, sqlite, err = open()
    if err then return nil, err end
    local tx, tx_err = db:begin()
    if tx_err then db:release(); return nil, failed("processed document transaction could not begin", tx_err) end
    local function abort(message: string, cause: any): (nil, error)
        tx:rollback(); db:release()
        return nil, failed(message, cause)
    end
    local existing, lookup_err = tx:query([[SELECT id, expires_at FROM kickside_docscout_documents
        WHERE owner_id=$1 AND upload_id=$2 AND content_checksum=$3 AND processing_key=$4]],
        { doc.owner_id, doc.upload_id, doc.checksum, doc.processing_key })
    if lookup_err then return abort("processed document lookup failed", lookup_err) end
    for _, row in ipairs(existing or {}) do
        if row.expires_at > now() then
            local _, rollback_err = tx:rollback(); db:release()
            if rollback_err then return nil, failed("processed document transaction could not end", rollback_err) end
            return row.id, nil
        end
        local remove_err = M.remove_tx(tx, sqlite, row.id)
        if remove_err then return abort("expired processed document could not be removed", remove_err) end
    end
    local outline, encode_err = json.encode(doc.outline)
    if encode_err then return abort("processed document outline could not be encoded", encode_err) end
    local id = uuid.v7()
    local created = now()
    local _, insert_err = tx:execute([[INSERT INTO kickside_docscout_documents
        (id, owner_id, upload_id, content_checksum, processing_key, outline, page_count, chunk_count, tokens, created_at, expires_at)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)]],
        { id, doc.owner_id, doc.upload_id, doc.checksum, doc.processing_key, outline, doc.page_count, #chunks, doc.tokens, created, doc.expires_at })
    if insert_err then
        -- Another run stored the same copy between the lookup and this insert; use it.
        tx:rollback()
        local winner, winner_err = db:query([[SELECT id FROM kickside_docscout_documents
            WHERE owner_id=$1 AND upload_id=$2 AND content_checksum=$3 AND processing_key=$4 AND expires_at > $5]],
            { doc.owner_id, doc.upload_id, doc.checksum, doc.processing_key, now() })
        db:release()
        if not winner_err and winner and winner[1] then return winner[1].id, nil end
        return nil, failed("processed document could not be stored", insert_err)
    end
    local rows, vectors = {}, {}
    for _, chunk in ipairs(chunks) do
        local chunk_id = id .. ":" .. tostring(chunk.ordinal)
        local context = chunk.context or ""
        rows[#rows + 1] = { chunk_id, id, chunk.ordinal, chunk.section_id, chunk.heading_path,
            chunk.page_start or sql.as.null(), chunk.page_end or sql.as.null(), chunk.content, context }
        vectors[#vectors + 1] = { chunk_id, id, index.vector_literal(chunk.vector) }
        if sqlite then
            local _, fts_err = tx:execute("INSERT INTO kickside_docscout_chunks_fts (chunk_id, content) VALUES ($1, $2)",
                { chunk_id, (context ~= "" and (context .. "\n") or "") .. chunk.content })
            if fts_err then return abort("chunk keyword index could not be written", fts_err) end
        end
    end
    local rows_err = index.insert_rows_tx(tx, "kickside_docscout_chunks",
        { "id", "document_id", "ordinal", "section_id", "heading_path", "page_start", "page_end", "content", "context" }, rows)
    if rows_err then return abort("chunks could not be stored", rows_err) end
    local vec_err = index.insert_rows_tx(tx, "kickside_docscout_chunk_vectors", { "chunk_id", "document_id", "embedding" }, vectors)
    if vec_err then return abort("chunk vectors could not be stored", vec_err) end
    local _, commit_err = tx:commit()
    db:release()
    if commit_err then return nil, failed("processed document could not be committed", commit_err) end
    return id, nil
end

function M.remove_tx(tx: any, sqlite: boolean, document_id: string): any?
    if sqlite then
        local _, fts_err = tx:execute([[DELETE FROM kickside_docscout_chunks_fts WHERE chunk_id IN
            (SELECT id FROM kickside_docscout_chunks WHERE document_id=$1)]], { document_id })
        if fts_err then return fts_err end
    end
    for _, statement in ipairs({
        "DELETE FROM kickside_docscout_chunk_vectors WHERE document_id=$1",
        "DELETE FROM kickside_docscout_chunks WHERE document_id=$1",
        "DELETE FROM kickside_docscout_documents WHERE id=$1",
    }) do
        local _, err = tx:execute(statement, { document_id })
        if err then return err end
    end
    return nil
end

-- Removes processed documents past their expiry, in batches.
function M.expire(limit: integer): (integer?, error?)
    local db, sqlite, err = open()
    if err then return nil, err end
    local rows, query_err = db:query("SELECT id FROM kickside_docscout_documents WHERE expires_at <= $1 ORDER BY expires_at LIMIT $2", { now(), limit })
    if query_err then db:release(); return nil, failed("expired documents could not be listed", query_err) end
    local removed = 0
    for _, row in ipairs(rows or {}) do
        local tx, tx_err = db:begin()
        if tx_err then db:release(); return nil, failed("retention transaction could not begin", tx_err) end
        local remove_err = M.remove_tx(tx, sqlite, row.id)
        if remove_err then tx:rollback(); db:release(); return nil, failed("expired document could not be removed", remove_err) end
        local _, commit_err = tx:commit()
        if commit_err then db:release(); return nil, failed("expired document removal could not commit", commit_err) end
        removed = removed + 1
    end
    db:release()
    return removed, nil
end

-- Searches one processed document. mode is keyword, semantic or hybrid;
-- ordinals, when given, keeps results inside that region of the document,
-- and an empty region holds nothing.
function M.search(document_id: string, opts: any): (any?, error?)
    if opts.ordinals and #opts.ordinals == 0 then return {}, nil end
    local db, _, err = open()
    if err then return nil, err end
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
    db:release()
    if search_err then return nil, failed("document search failed", search_err) end
    local hits = {}
    for _, row in ipairs(rows or {}) do
        local hit = decode_chunk(row)
        if opts.min_similarity == nil or hit.similarity == nil or hit.similarity >= opts.min_similarity then hits[#hits + 1] = hit end
    end
    return hits, nil
end

-- Chunks at the given ordinals, in document order.
function M.chunks_at(document_id: string, ordinals: { integer }): (any?, error?)
    if #ordinals == 0 then return {}, nil end
    local db, _, err = open()
    if err then return nil, err end
    local params: { any } = { document_id }
    for _, n in ipairs(ordinals) do params[#params + 1] = n end
    local rows, query_err = db:query("SELECT id, " .. table.concat(COLUMNS, ", ") ..
        " FROM kickside_docscout_chunks WHERE document_id=$1 AND ordinal IN (" .. index.placeholders(#ordinals, 2) .. ") ORDER BY ordinal", params)
    db:release()
    if query_err then return nil, failed("chunks could not be read", query_err) end
    local out = {}
    for _, row in ipairs(rows or {}) do out[#out + 1] = decode_chunk(row) end
    return out, nil
end

-- Every chunk of a document in order, for exact quote checks.
function M.all_chunks(document_id: string): (any?, error?)
    local db, _, err = open()
    if err then return nil, err end
    local rows, query_err = db:query("SELECT id, " .. table.concat(COLUMNS, ", ") ..
        " FROM kickside_docscout_chunks WHERE document_id=$1 ORDER BY ordinal", { document_id })
    db:release()
    if query_err then return nil, failed("document chunks could not be read", query_err) end
    local out = {}
    for _, row in ipairs(rows or {}) do out[#out + 1] = decode_chunk(row) end
    return out, nil
end

return M
