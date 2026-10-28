-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- The extraction stages. Each takes the run context and its step record and
-- returns what the next stages need. Evidence is a pool of chunks keyed by
-- ordinal; the model sees chunks as [C<ordinal>].
local json = require("json")
local ai = require("ai")
local store = require("store")
local doctools = require("doctools")
local process = require("process")

local M = {}

local function trim(s: string): string return (s:gsub("^%s+", ""):gsub("%s+$", "")) end
local function lines(s: string): { string }
    local out = {}
    for line in (s .. "\n"):gmatch("(.-)\n") do if trim(line) ~= "" then out[#out + 1] = trim(line) end end
    return out
end

local function add(pool: any, chunks: { any })
    for _, c in ipairs(chunks or {}) do
        if not pool.dropped[c.ordinal] and not pool.by_ordinal[c.ordinal] then
            pool.by_ordinal[c.ordinal] = c
            pool.count = pool.count + 1
        end
    end
end

local function ordered(pool: any): { any }
    local out = {}
    for _, c in pairs(pool.by_ordinal) do out[#out + 1] = c end
    table.sort(out, function(a: any, b: any): boolean return a.ordinal < b.ordinal end)
    return out
end

local function render(chunks: { any }): string
    local out = {}
    for _, c in ipairs(chunks) do
        local pages = c.page_start and (c.page_end and c.page_end ~= c.page_start and (" pp." .. c.page_start .. "-" .. c.page_end) or (" p." .. c.page_start)) or ""
        out[#out + 1] = "[C" .. c.ordinal .. "] " .. c.heading_path .. pages .. "\n" .. c.content
    end
    return table.concat(out, "\n\n")
end

local function field_lines(fields: { any }): string
    local out = {}
    for _, f in ipairs(fields) do
        local t = f.type == "list" and ("list of " .. f.item_type) or f.type
        local parts = { "- " .. f.name .. " (" .. t .. (f.required and ", required" or "") .. "): " .. (f.description ~= "" and f.description or "no description") }
        if #f.enum_values > 0 then parts[#parts + 1] = "  allowed: " .. table.concat(f.enum_values, ", ") end
        if f.expected_format ~= "" then parts[#parts + 1] = "  format: " .. f.expected_format end
        if f.validation_hints ~= "" then parts[#parts + 1] = "  rules: " .. f.validation_hints end
        out[#out + 1] = table.concat(parts, "\n")
    end
    return table.concat(out, "\n")
end

-- Region (chunk ordinals) a field searches within, or nil for the whole document.
local function region(run: any, field: any): { integer }?
    if field.search_within ~= "sections" then return nil end
    return run.regions[field.name]
end

local function ordinals_of(outline: { any }, ids: { string }): { integer }
    local wanted, out = {}, {}
    for _, id in ipairs(ids) do wanted[id] = true end
    for _, s in ipairs(outline) do
        if wanted[s.id] then for n = s.chunk_start, s.chunk_end do out[#out + 1] = n end end
    end
    return out
end

-- Map: outline from headings, or built by the model; then the sections each
-- "search within sections" field should read.
local OUTLINE_SCHEMA = { type = "object", additionalProperties = false, required = { "sections" }, properties = {
    sections = { type = "array", items = { type = "object", additionalProperties = false, required = { "title", "first_chunk" },
        properties = { title = { type = "string" }, first_chunk = { type = "integer" } } } } } }
local SUMMARY_SCHEMA = { type = "object", additionalProperties = false, required = { "summaries" }, properties = {
    summaries = { type = "array", items = { type = "object", additionalProperties = false, required = { "section_id", "summary" },
        properties = { section_id = { type = "string" }, summary = { type = "string" } } } } } }
local SELECT_SCHEMA = { type = "object", additionalProperties = false, required = { "fields" }, properties = {
    fields = { type = "array", items = { type = "object", additionalProperties = false, required = { "field", "section_ids" },
        properties = { field = { type = "string" }, section_ids = { type = "array", items = { type = "string" } } } } } } }

function M.map(run: any, step: any): error?
    local cfg = run.config.stages.map
    local outline = run.document.outline
    -- A usable table of contents has at least three sections.
    local headed = #outline >= 3
    if cfg.outline == "build" or not headed then
        local chunks, err = store.all_chunks(run.document.id)
        if err then return err end
        local preview = {}
        for _, c in ipairs(chunks) do preview[#preview + 1] = "[C" .. c.ordinal .. "] " .. c.content:sub(1, 160):gsub("\n", " ") end
        local built, build_err = ai.structured(step.meter, cfg.model, OUTLINE_SCHEMA,
            "You divide a document into its logical sections. Give each section a short title and the chunk number where it starts, in order; the first section starts at chunk 1.",
            table.concat(preview, "\n"))
        if build_err then return build_err end
        local sections = {}
        for i, s in ipairs(built.sections) do
            local start = math.max(1, math.min(#chunks, math.tointeger(s.first_chunk) or 1))
            sections[#sections + 1] = { id = "g" .. i, level = 1, title = trim(s.title), path = trim(s.title), chunk_start = start, tokens = 0 }
        end
        table.sort(sections, function(a: any, b: any): boolean return a.chunk_start < b.chunk_start end)
        for i, s in ipairs(sections) do
            s.chunk_end = (sections[i + 1] and sections[i + 1].chunk_start - 1) or #chunks
            for n = s.chunk_start, s.chunk_end do
                local c = chunks[n]
                if c then
                    s.tokens = s.tokens + math.ceil(#c.content / process.CHARS_PER_TOKEN)
                    if c.page_start and not s.page_start then s.page_start = c.page_start end
                    if c.page_end then s.page_end = c.page_end end
                end
            end
        end
        run.document.outline = sections
        step.message = "Built an outline of " .. #sections .. " sections"
    else
        step.message = "Used " .. #outline .. " sections from the document's headings"
    end
    if cfg.section_summaries then
        local listing = {}
        for _, s in ipairs(run.document.outline) do
            local chunks, err = doctools.section({ document = run.document }, s.id)
            if err then return err end
            local body = {}
            for _, c in ipairs(chunks) do body[#body + 1] = c.content end
            listing[#listing + 1] = "## " .. s.id .. " " .. s.path .. "\n" .. table.concat(body, "\n"):sub(1, 1500)
        end
        local result, err = ai.structured(step.meter, cfg.model, SUMMARY_SCHEMA,
            "Summarize each section in one sentence, naming what it covers. Return one summary per section id.", table.concat(listing, "\n\n"))
        if err then return err end
        for _, item in ipairs(result.summaries) do
            for _, s in ipairs(run.document.outline) do if s.id == item.section_id then s.summary = trim(item.summary) end end
        end
    end
    local scoped = {}
    for _, f in ipairs(run.config.fields) do if f.search_within == "sections" then scoped[#scoped + 1] = f end end
    if #scoped > 0 then
        local result, err = ai.structured(step.meter, cfg.model, SELECT_SCHEMA,
            "You pick, for each field, the sections of the outline most likely to contain its value. Choose few but enough sections; include definitions or schedules a field depends on.",
            "Outline:\n" .. doctools.outline_text(run.document.outline) .. "\n\nFields:\n" .. field_lines(scoped))
        if err then return err end
        local picked = {}
        for _, item in ipairs(result.fields) do
            run.regions[item.field] = ordinals_of(run.document.outline, item.section_ids)
            picked[#picked + 1] = item.field .. " → " .. table.concat(item.section_ids, ", ")
        end
        step.queries = picked
    end
    return nil
end

-- Evidence: prefetch queries and field hints fill the pool; the scout then
-- judges it and looks for more, as a structured loop or as an agent with tools.
function M.prefetch(run: any, step: any): error?
    local mode = run.config.retrieval.search_mode
    local ctx = { document = run.document, retrieval = run.config.retrieval, meter = step.meter }
    local queries = {}
    for _, q in ipairs(run.config.stages.prefetch.queries) do
        local hits, err = doctools.search(ctx, mode, q.query, q.chunks, nil)
        if err then return err end
        add(run.pool, hits); queries[#queries + 1] = q.query
    end
    for _, f in ipairs(run.config.fields) do
        if f.strategy ~= "deep" or not run.config.stages.deep.enabled then
            for _, hint in ipairs(lines(f.search_hints)) do
                local hits, err = doctools.search(ctx, mode, hint, f.chunks, region(run, f))
                if err then return err end
                add(run.pool, hits); queries[#queries + 1] = hint
            end
        end
    end
    step.queries = queries
    step.message = run.pool.count .. " passages in the evidence pool"
    return nil
end

local SCOUT_SCHEMA = { type = "object", additionalProperties = false, required = { "confidence", "drop", "queries", "notes" }, properties = {
    confidence = { type = "number" },
    drop = { type = "array", items = { type = "integer" } },
    queries = { type = "array", items = { type = "object", additionalProperties = false, required = { "field", "query" },
        properties = { field = { type = "string" }, query = { type = "string" } } } },
    notes = { type = "array", items = { type = "object", additionalProperties = false, required = { "field", "note" },
        properties = { field = { type = "string" }, note = { type = "string" } } } } } }
local SCOUT_SYSTEM = [[You review evidence gathered from one document before values are extracted.
Rate from 0 to 1 how confident you are that the passages contain every field's value. List chunk numbers that are irrelevant noise
(only the number, without C). Propose focused search queries for fields whose evidence is missing or weak, and leave short notes
about where each value is or what to watch for. Do not extract values.]]

function M.scout(run: any, step: any): error?
    local cfg = run.config.stages.scout
    local fields = {}
    for _, f in ipairs(run.config.fields) do if f.strategy ~= "deep" or not run.config.stages.deep.enabled then fields[#fields + 1] = f end end
    if #fields == 0 then step.message = "No fields to scout"; return nil end
    local ctx = { document = run.document, retrieval = run.config.retrieval, meter = step.meter }
    if cfg.mode == "agent" then
        local tools = {}
        for _, id in ipairs(cfg.tools) do tools[#tools + 1] = doctools.TOOLS[id] end
        local budget = math.max(1, (cfg.max_rounds + 1) * math.max(1, cfg.max_extra_queries))
        local found = 0
        local answer, calls, err = ai.agent(step.meter, cfg.model,
            "You read one document with the tools to find evidence for the fields below. Follow references to definitions and schedules. When you have enough, reply with short notes per field saying where each value is.",
            "Fields:\n" .. field_lines(fields) .. "\n\nEvidence so far:\n" .. render(ordered(run.pool)),
            tools, budget,
            function(name: string, args: any): string
                local hits, text = doctools.call(ctx, name, args)
                local before = run.pool.count
                add(run.pool, hits)
                found = found + (run.pool.count - before)
                return text
            end, { max_tokens = cfg.max_tokens })
        if err then return err end
        if cfg.share_notes and answer and trim(answer) ~= "" then run.notes[#run.notes + 1] = trim(answer) end
        step.message = calls .. " tool calls added " .. found .. " passages"
        return nil
    end
    local rounds, queries_run = 0, {}
    while true do
        rounds = rounds + 1
        local result, err = ai.structured(step.meter, cfg.model, SCOUT_SCHEMA, SCOUT_SYSTEM,
            "Fields:\n" .. field_lines(fields) .. (#run.notes > 0 and ("\n\nEarlier notes:\n" .. table.concat(run.notes, "\n")) or "") ..
            "\n\nEvidence:\n" .. render(ordered(run.pool)), { max_tokens = cfg.max_tokens })
        if err then return err end
        run.confidence = tonumber(result.confidence) or 0
        if cfg.drop_noise then
            for _, n in ipairs(result.drop) do
                local ordinal = math.tointeger(tonumber(n))
                if ordinal and run.pool.by_ordinal[ordinal] then
                    run.pool.by_ordinal[ordinal] = nil; run.pool.dropped[ordinal] = true; run.pool.count = run.pool.count - 1
                end
            end
        end
        if cfg.share_notes then for _, note in ipairs(result.notes) do run.notes[#run.notes + 1] = note.field .. ": " .. note.note end end
        if rounds > cfg.max_rounds or run.confidence >= cfg.target_confidence or #result.queries == 0 then break end
        for i, q in ipairs(result.queries) do
            if i > cfg.max_extra_queries then break end
            local field = nil
            for _, f in ipairs(fields) do if f.name == q.field then field = f end end
            local hits, search_err = doctools.search(ctx, run.config.retrieval.search_mode, q.query, field and field.chunks or run.config.retrieval.top_results, field and region(run, field) or nil)
            if search_err then return search_err end
            add(run.pool, hits); queries_run[#queries_run + 1] = q.query
        end
    end
    step.queries = queries_run
    step.message = rounds .. (rounds == 1 and " round" or " rounds") .. " · confidence " .. math.floor(run.confidence * 100 + 0.5) .. "% · " .. run.pool.count .. " passages"
    return nil
end

-- Deep analysis: each deep field writes its own queries, reads what they find
-- (or the sections around it) and leaves an analysis for extraction.
local QUERIES_SCHEMA = { type = "object", additionalProperties = false, required = { "queries" },
    properties = { queries = { type = "array", items = { type = "string" } } } }

local function analyse(run: any, step: any, ctx: any, f: any, all_queries: { string }): error?
    local cfg = run.config.stages.deep
    local generated, err = ai.structured(step.meter, cfg.query_model, QUERIES_SCHEMA,
        "Write up to " .. cfg.max_queries .. " varied search queries that would find passages stating this field's value, including synonyms and related clauses.",
        field_lines({ f }) .. (f.search_hints ~= "" and ("\nHints: " .. f.search_hints) or ""), { temperature = cfg.query_temperature })
    if err then return err end
    local seen, found = {}, {}
    local queries = {}
    for _, h in ipairs(lines(f.search_hints)) do queries[#queries + 1] = h end
    for _, q in ipairs(generated.queries) do if #queries < cfg.max_queries then queries[#queries + 1] = q end end
    for _, q in ipairs(queries) do
        local hits, search_err = doctools.search(ctx, run.config.retrieval.search_mode, q, cfg.chunks_per_query, region(run, f), cfg.min_similarity)
        if search_err then return search_err end
        for _, c in ipairs(hits) do if not seen[c.ordinal] and #found < cfg.chunk_cap then seen[c.ordinal] = true; found[#found + 1] = c end end
        all_queries[#all_queries + 1] = q
    end
    if cfg.read == "sections" then
        local sections, budget, wide = {}, run.config.retrieval.section_budget, {}
        for _, c in ipairs(found) do
            for _, s in ipairs(run.document.outline) do
                if c.ordinal >= s.chunk_start and c.ordinal <= s.chunk_end and not sections[s.id] then
                    sections[s.id] = true
                    if (s.tokens or 0) <= budget then
                        local chunks, section_err = doctools.section(ctx, s.id)
                        if section_err then return section_err end
                        for _, sc in ipairs(chunks) do wide[#wide + 1] = sc end
                    else
                        step.long_sections = true
                    end
                end
            end
        end
        for _, c in ipairs(wide) do if not seen[c.ordinal] then seen[c.ordinal] = true; found[#found + 1] = c end end
        table.sort(found, function(a: any, b: any): boolean return a.ordinal < b.ordinal end)
    end
    add(run.pool, found)
    local analysis, analysis_err = ai.generate(step.meter, cfg.model,
        "You analyse passages of one document for a single field and explain what its value is, quoting the decisive wording and citing chunk numbers. Say plainly when the passages do not settle it.",
        field_lines({ f }) .. "\n\nPassages:\n" .. render(found), { temperature = cfg.analysis_temperature })
    if analysis_err then return analysis_err end
    run.analyses[f.name] = analysis
    return nil
end

-- Deep analysis runs as a worker pool: "fields at a time" workers take deep
-- fields from a channel, so their model calls overlap.
function M.deep(run: any, step: any): error?
    local cfg = run.config.stages.deep
    local ctx = { document = run.document, retrieval = run.config.retrieval, meter = step.meter }
    local fields = {}
    for _, f in ipairs(run.config.fields) do if f.strategy == "deep" then fields[#fields + 1] = f end end
    local all_queries = {}
    local work = channel.new(#fields)
    local results = channel.new(#fields)
    for _ = 1, math.min(cfg.parallel_fields, #fields) do
        coroutine.spawn(function()
            while true do
                local f, ok = work:receive()
                if not ok then return end
                results:send({ name = f.name, err = analyse(run, step, ctx, f, all_queries) })
            end
        end)
    end
    for _, f in ipairs(fields) do work:send(f) end
    work:close()
    local failure: error? = nil
    for _ = 1, #fields do
        local outcome = results:receive()
        if outcome.err and not failure then failure = outcome.err end
    end
    if failure then return failure end
    step.queries = all_queries
    step.message = #fields .. (#fields == 1 and " field" or " fields") .. " analysed" .. (step.long_sections and " · long sections read as chunks" or "")
    return nil
end

-- Highlighter: a small model keeps only the sentences each passage holds for
-- the fields, so extraction reads less and cites tighter quotes.
local HIGHLIGHT_SCHEMA = { type = "object", additionalProperties = false, required = { "passages" }, properties = {
    passages = { type = "array", items = { type = "object", additionalProperties = false, required = { "chunk", "excerpts" },
        properties = { chunk = { type = "integer" }, excerpts = { type = "array", items = { type = "string" } } } } } } }
local HIGHLIGHT_BATCH = 12

function M.highlight(run: any, step: any): error?
    local model = run.config.retrieval.highlighter_model
    local chunks = ordered(run.pool)
    local kept, before = 0, #chunks
    for start = 1, #chunks, HIGHLIGHT_BATCH do
        local batch = {}
        for i = start, math.min(#chunks, start + HIGHLIGHT_BATCH - 1) do batch[#batch + 1] = chunks[i] end
        local result, err = ai.structured(step.meter, model, HIGHLIGHT_SCHEMA,
            "For each passage, copy word for word the sentences that state or help determine any field's value. Return no excerpts for passages that do not.",
            "Fields:\n" .. field_lines(run.config.fields) .. "\n\nPassages:\n" .. render(batch))
        if err then return err end
        local excerpts = {}
        for _, p in ipairs(result.passages) do excerpts[math.tointeger(tonumber(p.chunk)) or -1] = p.excerpts end
        for _, c in ipairs(batch) do
            local found = excerpts[c.ordinal]
            if found and #found > 0 then
                c.content = table.concat(found, " … ")
                kept = kept + 1
            else
                run.pool.by_ordinal[c.ordinal] = nil
                run.pool.count = run.pool.count - 1
            end
        end
    end
    step.message = "Kept " .. kept .. " of " .. before .. " passages"
    return nil
end

-- Extraction: one structured call per group of fields over the evidence pool.
local JSON_TYPES = { text = "string", number = "number", boolean = "boolean", date = "string", enum = "string", object = "object" }

local function value_schema(f: any): any
    if f.type == "list" then
        local item: any = { type = JSON_TYPES[f.item_type] or "string" }
        if #f.enum_values > 0 then item = { type = "string", enum = f.enum_values } end
        if item.type == "object" then item.additionalProperties = true end
        return { type = "array", items = item }
    end
    if f.type == "enum" then return { type = "string", enum = f.enum_values } end
    if f.type == "object" then return { type = "object", additionalProperties = true } end
    return { type = JSON_TYPES[f.type] or "string" }
end

local function group_schema(fields: { any }): any
    local properties, required = {}, {}
    for _, f in ipairs(fields) do
        properties[f.name] = { type = "object", additionalProperties = false, required = { "found", "value", "confidence", "evidence" }, properties = {
            found = { type = "boolean" },
            value = value_schema(f),
            confidence = { type = "number" },
            evidence = { type = "array", items = { type = "object", additionalProperties = false, required = { "chunk", "quote" },
                properties = { chunk = { type = "integer" }, quote = { type = "string" } } } },
        } }
        required[#required + 1] = f.name
    end
    return { type = "object", additionalProperties = false, required = required, properties = properties }
end

local EXTRACT_SYSTEM = [[You extract field values from passages of one document. Use only what the passages state.
For each field say whether the passages state it (found), give the value (any placeholder of the right type when not found), your confidence from 0 to 1, and evidence:
the chunk number and an exact quote copied character for character from that chunk.]]

function M.extract(run: any, step: any): error?
    local cfg = run.config.stages.extract
    local groups, order = {}, {}
    for _, f in ipairs(run.config.fields) do
        local g = trim(f.group) ~= "" and trim(f.group) or "Default"
        if not groups[g] then groups[g] = {}; order[#order + 1] = g end
        local list = groups[g]
        list[#list + 1] = f
    end
    local evidence = render(ordered(run.pool))
    local calls = 0
    for _, g in ipairs(order) do
        local list = groups[g]
        for start = 1, #list, cfg.max_fields_per_call do
            local batch = {}
            for i = start, math.min(#list, start + cfg.max_fields_per_call - 1) do batch[#batch + 1] = list[i] end
            local context = {}
            for _, f in ipairs(batch) do if run.analyses[f.name] then context[#context + 1] = "Analysis of " .. f.name .. ":\n" .. run.analyses[f.name] end end
            local user = "Fields:\n" .. field_lines(batch) ..
                (#run.notes > 0 and ("\n\nScout notes:\n" .. table.concat(run.notes, "\n")) or "") ..
                (#context > 0 and ("\n\n" .. table.concat(context, "\n\n")) or "") ..
                "\n\nPassages:\n" .. evidence
            local result, err
            if cfg.structured_output then
                result, err = ai.structured(step.meter, cfg.model, group_schema(batch), EXTRACT_SYSTEM, user, { max_tokens = cfg.max_output_tokens })
            else
                local textual, gen_err = ai.generate(step.meter, cfg.model, EXTRACT_SYSTEM .. "\nReply with a JSON object keyed by field name, each {found, value, confidence, evidence:[{chunk, quote}]}.", user, { max_tokens = cfg.max_output_tokens })
                if gen_err then err = gen_err else
                    local body = textual:match("%b{}")
                    result, err = json.decode(body or "")
                end
            end
            if err then return err end
            calls = calls + 1
            for _, f in ipairs(batch) do
                local item = result[f.name] or {}
                local cited = {}
                for _, e in ipairs(item.evidence or {}) do
                    local chunk = run.pool.by_ordinal[math.tointeger(tonumber(e.chunk)) or -1]
                    cited[#cited + 1] = { quote = tostring(e.quote or ""), chunk = math.tointeger(tonumber(e.chunk)),
                        section = chunk and chunk.heading_path or "", page = chunk and chunk.page_start or nil, chunk_id = chunk and chunk.id or "" }
                end
                local entry: any = { name = f.name, confidence = 0, evidence = {}, verified = false, missing = true }
                if item.found == true then
                    entry.value = item.value
                    entry.confidence = tonumber(item.confidence) or 0
                    entry.evidence = cited
                    entry.missing = false
                end
                run.values[#run.values + 1] = entry
            end
        end
    end
    step.message = calls .. (calls == 1 and " call" or " calls") .. " · " .. #run.values .. " values"
    return nil
end

-- Verify: quotes must appear in the document; a model may also confirm each
-- quote supports its value.
local function normalize(s: string): string return (s:lower():gsub("[%s%p]+", " ")):gsub("^%s+", ""):gsub("%s+$", "") end

local SUPPORT_SCHEMA = { type = "object", additionalProperties = false, required = { "checks" }, properties = {
    checks = { type = "array", items = { type = "object", additionalProperties = false, required = { "field", "supported", "reason" },
        properties = { field = { type = "string" }, supported = { type = "boolean" }, reason = { type = "string" } } } } } }

function M.verify(run: any, step: any): error?
    local cfg = run.config.stages.verify
    local failed = 0
    if cfg.check_quotes then
        local chunks, err = store.all_chunks(run.document.id)
        if err then return err end
        local by_ordinal = {}
        for _, c in ipairs(chunks) do by_ordinal[c.ordinal] = normalize(c.content) end
        for _, v in ipairs(run.values) do
            v.quotes_found = #v.evidence > 0
            for _, e in ipairs(v.evidence) do
                local q = normalize(e.quote)
                local hay = e.chunk and by_ordinal[e.chunk]
                e.found = q ~= "" and hay ~= nil and hay:find(q, 1, true) ~= nil
                if not e.found then
                    for ordinal, body in pairs(by_ordinal) do
                        if q ~= "" and body:find(q, 1, true) then e.found = true; e.chunk = ordinal; break end
                    end
                end
                if not e.found then v.quotes_found = false end
            end
            if not v.missing and not v.quotes_found then failed = failed + 1 end
        end
    end
    local support = {}
    if cfg.check_support then
        local lines_out = {}
        for _, v in ipairs(run.values) do
            local quotes = {}
            for _, e in ipairs(v.evidence) do quotes[#quotes + 1] = "\"" .. e.quote .. "\"" end
            lines_out[#lines_out + 1] = "- " .. v.name .. " = " .. json.encode(v.value) .. "\n  quotes: " .. table.concat(quotes, " | ")
        end
        local result, err = ai.structured(step.meter, cfg.model, SUPPORT_SCHEMA,
            "For each field, decide whether its quotes support its value exactly. A null value is supported when no quote is given.",
            table.concat(lines_out, "\n"))
        if err then return err end
        for _, c in ipairs(result.checks) do support[c.field] = c end
    end
    for _, v in ipairs(run.values) do
        local quotes_ok = not cfg.check_quotes or v.missing or v.quotes_found
        local support_ok = not cfg.check_support or (support[v.name] and support[v.name].supported)
        v.verified = quotes_ok and support_ok and true or false
        if cfg.check_support and support[v.name] and not support[v.name].supported then
            v.reason = support[v.name].reason
            failed = failed + 1
        end
    end
    step.message = failed == 0 and "All values check out" or (failed .. " values need review")
    return nil
end

return M
