-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Processes Markdown into sections, page spans, chunks, contexts and vectors.
local hash = require("hash")
local canonical_json = require("canonical_json")
local text = require("text")
local security = require("security")
local contract = require("contract")
local doc2md = require("doc2md")
local store = require("store")
local ai = require("ai")
local retention = require("retention")
local shapes = require("shapes")
local error_envelope = require("error_envelope")

local trim = shapes.trim

local M = {}

-- The splitter measures characters; configuration speaks in tokens.
M.CHARS_PER_TOKEN = 4
local CONTEXT_BATCH = 8
local PROVIDER_RESPONSE = "docscout_content_provider_response"

local function invalid(message: string): error
    return errors.new({ kind = errors.INVALID, message = message })
end


-- The uploads content provider for one upload, opened as the caller.
local function provider_for(upload_id: string): (any?, error?)
    local actor, scope = security.actor(), security.scope()
    if not actor then
        return nil, errors.new({ kind = errors.UNAUTHENTICATED, retryable = false, message = "authentication required" })
    end
    if not scope then
        return nil, errors.new({ kind = errors.PERMISSION_DENIED, retryable = false, message = "authorization scope required" })
    end
    local definition, get_err = contract.get("kickside.contract:content_provider")
    local wrapper, err = error_envelope.binding(definition, get_err, "with_actor", "content provider unavailable", PROVIDER_RESPONSE)
    if err then return nil, err end
    local actor_bound, actor_err = (wrapper :: any):with_actor(actor)
    wrapper, err = error_envelope.binding(actor_bound, actor_err, "with_scope", "content provider actor binding failed", PROVIDER_RESPONSE)
    if err then return nil, err end
    local scope_bound, scope_err = (wrapper :: any):with_scope(scope)
    wrapper, err = error_envelope.binding(scope_bound, scope_err, "with_context", "content provider scope binding failed", PROVIDER_RESPONSE)
    if err then return nil, err end
    local context_bound, context_err = (wrapper :: any):with_context({ upload_id = upload_id })
    wrapper, err = error_envelope.binding(context_bound, context_err, "open", "content provider context binding failed", PROVIDER_RESPONSE)
    if err then return nil, err end
    local provider, open_err = (wrapper :: any):open("kickside.uploads:content_provider")
    return error_envelope.binding(provider, open_err, nil, "upload content unavailable", PROVIDER_RESPONSE)
end

-- Reads upload metadata through the caller's content provider.
function M.info(upload_id: string): (any?, error?)
    local provider, err = provider_for(upload_id)
    if err then return nil, err end
    local info, info_err = (provider :: any):get_info({})
    if info_err then
        if type(info_err) == "userdata" then return nil, errors.wrap(info_err :: error, "upload unavailable") end
        return nil, errors.new({ kind = errors.NOT_FOUND, message = "upload unavailable: " .. tostring(info_err) })
    end
    if type(info) ~= "table" or info.success == false then
        return nil, errors.new({ kind = errors.NOT_FOUND, message = "upload unavailable: " .. tostring(info and info.error) })
    end
    return { filename = tostring(info.filename or "upload"), content_type = info.content_type }, nil
end

-- The upload's primary Markdown through the uploads content provider, read as the caller.
function M.content(upload_id: string): (any?, error?)
    local provider, err = provider_for(upload_id)
    if err then return nil, err end
    local content, content_err = (provider :: any):get_content({})
    if content_err then return nil, content_err end
    if type(content) ~= "table" or content.success == false or type(content.content) ~= "string" then
        return nil, (content and content.error) or invalid("upload has no readable content")
    end
    if type(content.artifact_id) ~= "string" or content.artifact_id == "" or content.content_type ~= "text/markdown" then
        return nil, errors.new({ kind = errors.UNAVAILABLE, retryable = true,
            message = "The upload needs an extracted Markdown artifact", details = { code = "markdown_artifact_required" } })
    end
    return {
        markdown = content.content,
        checksum = content.checksum or hash.sha256(content.content),
        filename = content.metadata and content.metadata.filename,
    }, nil
end

-- Settings that change the processed copy; reading settings stay out. Models
-- are named by the card a reference resolves to, so reassigning a class makes
-- a new copy.
function M.processing_key(retrieval: any, models: { [string]: string }): (string?, error?)
    local parts = {
        chunk_size = retrieval.chunk_size, overlap = retrieval.overlap,
        split_headings = retrieval.split_headings, keep_tables = retrieval.keep_tables,
        context = retrieval.context, embedding_model = models.embedding,
        context_model = retrieval.context == "generated" and models.context or "",
    }
    return canonical_json.hash(parts)
end

-- A heading section is always kept; the text before the first heading only
-- when it has content.
local function keep(section: any): boolean
    return section.level > 0 or trim(table.concat(section.lines, "\n")) ~= ""
end

-- Sections in document order from ATX headings outside fenced code. Text
-- before the first heading is its own section.
function M.sections(markdown: string): { any }
    local sections: { any } = {}
    local stack: { any } = {}
    local current: any = { id = "s0", level = 0, title = "Start of document", path = "Start of document", lines = {} }
    local fenced = false
    for line in (markdown .. "\n"):gmatch("(.-)\n") do
        if line:match("^%s*```") or line:match("^%s*~~~") then fenced = not fenced end
        local hashes, title = nil, nil
        if not fenced then hashes, title = line:match("^(#+)%s+(.-)%s*#*%s*$") end
        if hashes and #hashes <= 6 and title ~= "" then
            if keep(current) then sections[#sections + 1] = current end
            local level = #hashes
            while #stack > 0 and stack[#stack].level >= level do table.remove(stack) end
            local names = {}
            for _, s in ipairs(stack) do names[#names + 1] = s.title end
            names[#names + 1] = title
            current = { id = "s" .. tostring(#sections + 1), level = level, title = title, path = table.concat(names, " › "), lines = { line } }
            stack[#stack + 1] = { level = level, title = title }
        else
            current.lines[#current.lines + 1] = line
        end
    end
    if keep(current) then sections[#sections + 1] = current end
    for _, s in ipairs(sections) do s.text = table.concat(s.lines, "\n"); s.lines = nil end
    return sections
end

local function split(input: string, retrieval: any): ({ string }?, error?)
    if trim(input) == "" then return {}, nil end
    local splitter, err = text.splitter.markdown({
        chunk_size = retrieval.chunk_size * M.CHARS_PER_TOKEN,
        chunk_overlap = retrieval.overlap * M.CHARS_PER_TOKEN,
        code_blocks = true,
        join_table_rows = retrieval.keep_tables,
    })
    if err then return nil, errors.wrap(err, "text splitter unavailable") end
    local raw, split_err = splitter:split_text(input)
    if split_err then return nil, errors.wrap(split_err, "text split failed") end
    local out = {}
    for _, c in ipairs(raw or {}) do if type(c) == "string" and trim(c) ~= "" then out[#out + 1] = c end end
    return out, nil
end

-- Chunks with section, heading path and page or slide range, markers removed.
function M.chunk(markdown: string, retrieval: any): (any?, error?)
    local sections = M.sections(markdown)
    local pieces: { any } = {}
    if retrieval.split_headings then
        for _, s in ipairs(sections) do
            local split_chunks, err = split(s.text, retrieval)
            if err then return nil, err end
            for _, c in ipairs(split_chunks) do pieces[#pieces + 1] = { section = s, text = c } end
        end
    else
        local by_line: { any } = {}
        local split_chunks, err = split(markdown, retrieval)
        if err then return nil, err end
        for _, c in ipairs(split_chunks) do
            local owner = sections[1]
            local probe = c:sub(1, 80)
            for _, s in ipairs(sections) do if s.text:find(probe, 1, true) then owner = s; break end end
            by_line[#by_line + 1] = { section = owner, text = c }
        end
        pieces = by_line
    end
    local chunks: { any } = {}
    local current: any = nil
    local pages = 0
    for _, piece in ipairs(pieces) do
        local found = doc2md.markers(piece.text)
        local spans, offset, page = {}, 1, current and current.number or nil
        for _, marker in ipairs(found) do
            local body = trim(doc2md.strip_markers(piece.text:sub(offset, marker.start - 1)))
            if body ~= "" then spans[#spans + 1] = { page = page, text = body } end
            offset, page = marker.start, marker.number
        end
        local tail = trim(doc2md.strip_markers(piece.text:sub(offset)))
        if tail ~= "" then spans[#spans + 1] = { page = page, text = tail } end
        local first, last = current, current
        if #found > 0 then
            if first == nil or trim(piece.text:sub(1, found[1].start - 1)) == "" then first = found[1] end
            last = found[#found]
            current = last
            for _, m in ipairs(found) do if m.number > pages then pages = m.number end end
        end
        local content = trim(doc2md.strip_markers(piece.text))
        if content ~= "" then
            chunks[#chunks + 1] = {
                page_spans = spans, ordinal = #chunks + 1, section_id = piece.section.id, heading_path = piece.section.path, content = content,
                page_start = first and first.number or nil, page_end = last and last.number or nil,
            }
        end
    end
    local outline: { any } = {}
    local by_id: { [string]: any } = {}
    for _, s in ipairs(sections) do
        local entry = { id = s.id, level = s.level, title = s.title, path = s.path, tokens = math.ceil(#s.text / M.CHARS_PER_TOKEN) }
        outline[#outline + 1] = entry
        by_id[s.id] = entry
    end
    for _, c in ipairs(chunks) do
        local entry = by_id[c.section_id]
        entry.chunk_start = entry.chunk_start or c.ordinal
        entry.chunk_end = c.ordinal
        if c.page_start then entry.page_start = entry.page_start or c.page_start end
        if c.page_end then entry.page_end = c.page_end end
    end
    local kept = {}
    for _, entry in ipairs(outline) do if entry.chunk_start then kept[#kept + 1] = entry end end
    return { chunks = chunks, outline = kept, page_count = pages }, nil
end

local function context_schema(count: integer): any
    return {
        type = "object", additionalProperties = false, required = { "contexts" },
        properties = { contexts = { type = "array", minItems = count, maxItems = count, items = { type = "string" } } },
    }
end
local CONTEXT_SYSTEM = [[You place passages of one document in context for search.
For each passage write one or two sentences that say where it sits in the document and what it is about,
naming the parties, figures or terms it concerns. Do not repeat the passage. Return exactly one context per passage, in order.
]] .. shapes.DATA_RULE

local function contexts(meter: any, retrieval: any, models: { [string]: string }, chunks: { any }, filename: string?): error?
    if retrieval.context == "none" then return nil end
    if retrieval.context == "headings" then
        for _, c in ipairs(chunks) do c.context = c.heading_path end
        return nil
    end
    for start = 1, #chunks, CONTEXT_BATCH do
        local batch, lines = {}, { "Document: " .. tostring(filename or "untitled") }
        for i = start, math.min(#chunks, start + CONTEXT_BATCH - 1) do
            batch[#batch + 1] = chunks[i]
            lines[#lines + 1] = "\n## Passage " .. tostring(#batch) .. " (section: " .. chunks[i].heading_path .. ")\n" .. chunks[i].content
        end
        local result, err = ai.structured(meter, models.context :: string, context_schema(#batch), CONTEXT_SYSTEM, table.concat(lines, "\n"))
        if err then return err end
        if #result.contexts ~= #batch then
            return errors.new({ kind = errors.UNAVAILABLE, retryable = true, message = "context model returned " .. #result.contexts .. " contexts for " .. #batch .. " passages" })
        end
        for i, c in ipairs(batch) do c.context = c.heading_path .. " — " .. trim(tostring(result.contexts[i])) end
    end
    return nil
end

-- Builds or reuses the processed document and updates the read-step state.
function M.ensure(component_id: string, owner_id: string, upload_id: string, retrieval: any, step: any): (any?, error?)
    local content, err = M.content(upload_id)
    if err then return nil, err end
    local models = {}
    local embedder, embed_lookup_err = ai.resolve(retrieval.embedding_model)
    if embed_lookup_err then return nil, embed_lookup_err end
    models.embedding = tostring(embedder.name)
    if retrieval.context == "generated" then
        local writer, context_lookup_err = ai.resolve(retrieval.context_model)
        if context_lookup_err then return nil, context_lookup_err end
        models.context = tostring(writer.name)
    end
    local key, key_err = M.processing_key(retrieval, models)
    if key_err then return nil, key_err end
    local existing, find_err = store.find(component_id, owner_id, upload_id, content.checksum, key :: string)
    if find_err then return nil, find_err end
    if existing then
        step.message = "Reused the processed copy (" .. existing.chunk_count .. " chunks)"
        existing.embedding_model = models.embedding
        return existing, nil
    end
    local chunked, chunk_err = M.chunk(content.markdown, retrieval)
    if chunk_err then return nil, chunk_err end
    local chunks, outline, pages = chunked.chunks, chunked.outline, chunked.page_count
    if #chunks == 0 then return nil, invalid("the upload has no text to read") end
    local context_err = contexts(step.meter, retrieval, models, chunks, content.filename)
    if context_err then return nil, context_err end
    local texts = {}
    for i, c in ipairs(chunks) do texts[i] = (c.context and c.context ~= "" and (c.context .. "\n\n") or "") .. c.content end
    local vectors, embed_err = ai.embed(step.meter, models.embedding, texts)
    if embed_err then return nil, embed_err end
    for i, c in ipairs(chunks) do c.vector = vectors[i] end
    local expires_at, expiry_err = retention.expires_at()
    if expiry_err then return nil, expiry_err end
    local tokens = 0
    for _, c in ipairs(chunks) do tokens = tokens + math.ceil(#c.content / M.CHARS_PER_TOKEN) end
    local id, save_err = store.save({
        component_id = component_id, owner_id = owner_id, upload_id = upload_id, checksum = content.checksum, processing_key = key,
        outline = outline, page_count = pages, tokens = tokens, expires_at = expires_at,
    }, chunks)
    if save_err then return nil, save_err end
    step.message = "Processed " .. #chunks .. " chunks in " .. #outline .. " sections" .. (pages > 0 and (" over " .. pages .. " pages") or "")
    return { id = id, outline = outline, page_count = pages, chunk_count = #chunks, tokens = tokens, embedding_model = models.embedding }, nil
end

return M
