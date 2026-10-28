-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Turns an upload's Markdown into a processed document: sections from its
-- headings, chunks that keep tables whole and never cross a heading when the
-- configuration says so, page or slide locators from Doc2MD markers, a context
-- line per chunk, and one vector per chunk. A processed copy is reused while it
-- is fresh for the same owner, content and processing settings.
local hash = require("hash")
local text = require("text")
local security = require("security")
local contract = require("contract")
local doc2md = require("doc2md")
local store = require("store")
local ai = require("ai")
local retention = require("retention")
local shapes = require("shapes")

local trim = shapes.trim

local M = {}

-- The splitter measures characters; configuration speaks in tokens.
M.CHARS_PER_TOKEN = 4
local CONTEXT_BATCH = 8

local function invalid(message: string): error
    return errors.new({ kind = errors.INVALID, message = message })
end


-- The upload's primary Markdown through the uploads content provider, read as the caller.
function M.content(upload_id: string): (any?, error?)
    local definition, err = contract.get("kickside.contract:content_provider")
    if err or not definition then
        return nil, errors.new({ kind = errors.UNAVAILABLE, message = "content provider unavailable: " .. tostring(err) })
    end
    local provider, open_err = (definition :: any):with_actor(security.actor()):with_scope(security.scope())
        :with_context({ upload_id = upload_id }):open("kickside.uploads:content_provider")
    if open_err or not provider then
        return nil, errors.new({ kind = errors.UNAVAILABLE, message = "upload content unavailable: " .. tostring(open_err) })
    end
    local content, content_err = provider:get_content({})
    if content_err then return nil, content_err end
    if type(content) ~= "table" or content.success == false or type(content.content) ~= "string" then
        return nil, (content and content.error) or invalid("upload has no readable content")
    end
    -- Extracted text arrives as Markdown; an upload without it serves its original bytes.
    if type(content.content_type) ~= "string" or not content.content_type:match("^text/") then
        return nil, errors.new({ kind = errors.UNAVAILABLE, retryable = true,
            message = "the upload has no extracted text yet (" .. tostring(content.content_type) .. ")" })
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
function M.processing_key(retrieval: any, models: { [string]: string }): string
    local parts = {
        chunk_size = retrieval.chunk_size, overlap = retrieval.overlap,
        split_headings = retrieval.split_headings, keep_tables = retrieval.keep_tables,
        context = retrieval.context, embedding_model = models.embedding,
        context_model = retrieval.context == "generated" and models.context or "",
    }
    local keys = {}
    for k in pairs(parts) do keys[#keys + 1] = k end
    table.sort(keys)
    local line = {}
    for _, k in ipairs(keys) do line[#line + 1] = k .. "=" .. tostring(parts[k]) end
    return hash.sha256(table.concat(line, ";"))
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

local function split(input: string, retrieval: any): { string }
    if trim(input) == "" then return {} end
    local splitter, err = text.splitter.markdown({
        chunk_size = retrieval.chunk_size * M.CHARS_PER_TOKEN,
        chunk_overlap = retrieval.overlap * M.CHARS_PER_TOKEN,
        code_blocks = true,
        join_table_rows = retrieval.keep_tables,
    })
    if err or not splitter then error(errors.new({ kind = errors.INTERNAL, message = "text splitter unavailable: " .. tostring(err) })) end
    local raw, split_err = splitter:split_text(input)
    if split_err then error(errors.new({ kind = errors.INTERNAL, message = "text split failed: " .. tostring(split_err) })) end
    local out = {}
    for _, c in ipairs(raw or {}) do if type(c) == "string" and trim(c) ~= "" then out[#out + 1] = c end end
    return out
end

-- Chunks with section, heading path and page or slide range, markers removed.
function M.chunk(markdown: string, retrieval: any): ({ any }, { any }, integer)
    local sections = M.sections(markdown)
    local pieces: { any } = {}
    if retrieval.split_headings then
        for _, s in ipairs(sections) do
            for _, c in ipairs(split(s.text, retrieval)) do pieces[#pieces + 1] = { section = s, text = c } end
        end
    else
        local by_line: { any } = {}
        for _, c in ipairs(split(markdown, retrieval)) do
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
                ordinal = #chunks + 1, section_id = piece.section.id, heading_path = piece.section.path, content = content,
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
    return chunks, kept, pages
end

local function context_schema(count: integer): any
    return {
        type = "object", additionalProperties = false, required = { "contexts" },
        properties = { contexts = { type = "array", minItems = count, maxItems = count, items = { type = "string" } } },
    }
end
local CONTEXT_SYSTEM = [[You place passages of one document in context for search.
For each passage write one or two sentences that say where it sits in the document and what it is about,
naming the parties, figures or terms it concerns. Do not repeat the passage. Return exactly one context per passage, in order.]]

local function contexts(meter: any, retrieval: any, chunks: { any }, filename: string?): error?
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
        local result, err = ai.structured(meter, retrieval.context_model, context_schema(#batch), CONTEXT_SYSTEM, table.concat(lines, "\n"))
        if err then return err end
        if #result.contexts ~= #batch then
            return errors.new({ kind = errors.UNAVAILABLE, retryable = true, message = "context model returned " .. #result.contexts .. " contexts for " .. #batch .. " passages" })
        end
        for i, c in ipairs(batch) do c.context = c.heading_path .. " — " .. trim(tostring(result.contexts[i])) end
    end
    return nil
end

-- Returns the processed document for this upload and settings, building it
-- when no fresh copy exists. trace receives the read step.
function M.ensure(owner_id: string, upload_id: string, retrieval: any, step: any): (any?, error?)
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
    local key = M.processing_key(retrieval, models)
    local existing, find_err = store.find(owner_id, upload_id, content.checksum, key)
    if find_err then return nil, find_err end
    if existing then
        step.message = "Reused the processed copy (" .. existing.chunk_count .. " chunks)"
        return existing, nil
    end
    local chunks, outline, pages = M.chunk(content.markdown, retrieval)
    if #chunks == 0 then return nil, invalid("the upload has no text to read") end
    local context_err = contexts(step.meter, retrieval, chunks, content.filename)
    if context_err then return nil, context_err end
    local texts = {}
    for i, c in ipairs(chunks) do texts[i] = (c.context and c.context ~= "" and (c.context .. "\n\n") or "") .. c.content end
    local vectors, embed_err = ai.embed(step.meter, retrieval.embedding_model, texts)
    if embed_err then return nil, embed_err end
    for i, c in ipairs(chunks) do c.vector = vectors[i] end
    local expires_at, expiry_err = retention.expires_at()
    if expiry_err then return nil, expiry_err end
    local tokens = 0
    for _, c in ipairs(chunks) do tokens = tokens + math.ceil(#c.content / M.CHARS_PER_TOKEN) end
    local id, save_err = store.save({
        owner_id = owner_id, upload_id = upload_id, checksum = content.checksum, processing_key = key,
        outline = outline, page_count = pages, tokens = tokens, expires_at = expires_at,
    }, chunks)
    if save_err then return nil, save_err end
    step.message = "Processed " .. #chunks .. " chunks in " .. #outline .. " sections" .. (pages > 0 and (" over " .. pages .. " pages") or "")
    return { id = id, outline = outline, page_count = pages, chunk_count = #chunks, tokens = tokens }, nil
end

return M
