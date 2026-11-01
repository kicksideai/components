-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- The extraction stages. Each takes the run context and its step record and
-- returns what the next stages need. Evidence is a pool of chunks keyed by
-- ordinal; the model sees chunks as [C<ordinal>].
local json = require("json")
local ai = require("ai")
local store = require("store")
local doctools = require("doctools")
local process = require("process")
local shapes = require("shapes")
local error_envelope = require("error_envelope")
local user_agent = require("user_agent")

local trim, add, ordered, render, field_lines = shapes.trim, shapes.add, shapes.ordered, shapes.render, shapes.field_lines

local M = {}

local function failed_field(run: any, field: any, err: error)
    run.values[#run.values + 1] = { name = field.name, path = shapes.path(field), confidence = 0,
        evidence = {}, verified = false, missing = false, failed = true, error = error_envelope.encode(err) }
end

-- Region (chunk ordinals) a field searches within, or nil for the whole
-- document. Map selects a region for every "sections" field before any search.
function M.region(run: any, field: any): ({ integer }?, error?)
    if field.search_within ~= "sections" then return nil, nil end
    local selected = run.regions[shapes.path(field)]
    if not selected then return nil, errors.new({ kind = errors.INTERNAL, message = "no region selected for " .. shapes.path(field) }) end
    return selected, nil
end

-- Whether a field may read the chunk at this ordinal.
local function visible(run: any, field: any, ordinal: integer?): (boolean?, error?)
    local r, err = M.region(run, field)
    if err then return nil, err end
    if not r then return true end
    for _, n in ipairs(r) do if n == ordinal then return true end end
    return false
end

local function system(text: string): string return text .. "\n" .. shapes.DATA_RULE end

-- Map: outline from headings, or built by the model; then the sections each
-- "search within sections" field should read.
local function outline_schema(first: integer, last: integer): any
    return { type = "object", additionalProperties = false, required = { "sections" }, properties = {
        sections = { type = "array", minItems = 1, maxItems = last - first + 1, items = { type = "object", additionalProperties = false, required = { "title", "first_chunk" },
            properties = { title = { type = "string" }, first_chunk = { type = "integer", minimum = first, maximum = last } } } } } }
end

-- Chunks per outlining call, so a long document is outlined in several prompts.
local OUTLINE_WINDOW = 150
local PREVIEW_CHARS = 160

-- Consecutive windows of chunk previews, each with its first and last ordinal.
function M.outline_windows(chunks: { any }, size: integer): { any }
    local windows = {}
    for start = 1, #chunks, size do
        local lines = {}
        local last = math.min(#chunks, start + size - 1)
        for i = start, last do
            local c = chunks[i]
            lines[#lines + 1] = "[C" .. c.ordinal .. "] " .. c.content:sub(1, PREVIEW_CHARS):gsub("\n", " ")
        end
        windows[#windows + 1] = { first = chunks[start].ordinal, last = chunks[last].ordinal, preview = table.concat(lines, "\n") }
    end
    return windows
end

local function section_ids(outline: { any }): { string }
    local ids = {}
    for _, s in ipairs(outline) do ids[#ids + 1] = s.id end
    return ids
end

local function summary_schema(outline: { any }): any
    return { type = "object", additionalProperties = false, required = { "summaries" }, properties = {
        summaries = { type = "array", maxItems = #outline, items = { type = "object", additionalProperties = false, required = { "section_id", "summary" },
            properties = { section_id = { type = "string", enum = section_ids(outline) }, summary = { type = "string" } } } } } }
end

-- Exactly one selection per field, each with at least one existing section.
local function select_schema(outline: { any }, fields: { any }): any
    local names = {}
    for _, f in ipairs(fields) do names[#names + 1] = shapes.path(f) end
    return { type = "object", additionalProperties = false, required = { "fields" }, properties = {
        fields = { type = "array", minItems = #fields, maxItems = #fields, items = { type = "object", additionalProperties = false, required = { "field", "section_ids" },
            properties = { field = { type = "string", enum = names },
                section_ids = { type = "array", minItems = 1, maxItems = #outline, items = { type = "string", enum = section_ids(outline) } } } } } } }
end

function M.map(run: any, step: any): error?
    local cfg = run.config.stages.map
    local outline = run.document.outline
    -- A usable table of contents has at least three sections.
    local headed = #outline >= 3
    if cfg.outline == "build" or not headed then
        local chunks, err = store.all_chunks(run.document.id)
        if err then return err end
        -- One section per start chunk, in order; chunks before the first start form their own section.
        local by_start, previous = {}, nil
        for _, w in ipairs(M.outline_windows(chunks, OUTLINE_WINDOW)) do
            local carried = previous and ("The passages continue the section \"" .. previous .. "\" unless a new section starts at chunk " .. w.first .. ".\n\n") or ""
            local built, build_err = ai.structured(step.meter, cfg.model, outline_schema(w.first, w.last),
                system("You divide a document into its logical sections. Give each section a short title and the chunk number where it starts, in order."),
                carried .. w.preview)
            if build_err then return build_err end
            for _, s in ipairs(built.sections) do
                local start = math.tointeger(s.first_chunk) :: integer
                if not by_start[start] then by_start[start] = trim(s.title) end
            end
            for n = w.last, w.first, -1 do if by_start[n] then previous = by_start[n]; break end end
        end
        if not by_start[1] then by_start[1] = "Start of document" end
        local sections = {}
        for start = 1, #chunks do
            if by_start[start] then
                sections[#sections + 1] = { id = "g" .. (#sections + 1), level = 1, title = by_start[start], path = by_start[start], chunk_start = start, tokens = 0 }
            end
        end
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
        local result, err = ai.structured(step.meter, cfg.model, summary_schema(run.document.outline),
            system("Summarize each section in one sentence, naming what it covers. Return one summary per section id."), table.concat(listing, "\n\n"))
        if err then return err end
        for _, item in ipairs(result.summaries) do
            for _, s in ipairs(run.document.outline) do if s.id == item.section_id then s.summary = trim(item.summary) end end
        end
    end
    local scoped = {}
    for _, f in ipairs(run.config.fields) do if f.search_within == "sections" then scoped[#scoped + 1] = f end end
    if #scoped > 0 then
        local result, err = ai.structured(step.meter, cfg.model, select_schema(run.document.outline, scoped),
            system("You pick, for each field, the sections of the outline most likely to contain its value. Choose few but enough sections; include definitions or schedules a field depends on."),
            "Outline:\n" .. doctools.outline_text(run.document.outline) .. "\n\nFields:\n" .. field_lines(scoped))
        if err then return err end
        local seen = {}
        for _, item in ipairs(result.fields) do
            if seen[item.field] then
                return errors.new({ kind = errors.UNAVAILABLE, retryable = true, message = "the section choice names " .. item.field .. " twice and leaves a field out" })
            end
            seen[item.field] = true
        end
        local picked = {}
        for _, item in ipairs(result.fields) do
            run.regions[item.field] = shapes.ordinals_of(run.document.outline, item.section_ids)
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
            for _, query in ipairs(shapes.field_queries(f)) do
                local region, region_err = M.region(run, f)
                if region_err then return region_err end
                local hits, err = doctools.search(ctx, mode, query, f.chunks, region)
                if err then return err end
                add(run.pool, hits); queries[#queries + 1] = query
            end
        end
    end
    step.queries = queries
    step.message = run.pool.count .. " passages in the evidence pool"
    return nil
end

-- The scout names, per field, the passages holding its evidence; the engine
-- retains passages cited by a field.
local function scout_schema(cfg: any, fields: { any }, pool: { any }): any
    local names = {}
    for _, f in ipairs(fields) do names[#names + 1] = shapes.path(f) end
    local chunk = shapes.passage_ref(pool)
    return { type = "object", additionalProperties = false, required = { "confidence", "evidence", "drop", "queries", "notes" }, properties = {
        confidence = { type = "number", minimum = 0, maximum = 1 },
        evidence = { type = "array", maxItems = #fields, items = { type = "object", additionalProperties = false, required = { "field", "chunks" },
            properties = { field = { type = "string", enum = names }, chunks = { type = "array", maxItems = #pool, items = chunk } } } },
        drop = { type = "array", maxItems = #pool, items = chunk },
        queries = { type = "array", maxItems = cfg.max_extra_queries, items = { type = "object", additionalProperties = false, required = { "field", "query" },
            properties = { field = { type = "string", enum = names }, query = { type = "string" } } } },
        notes = { type = "array", maxItems = #fields, items = { type = "object", additionalProperties = false, required = { "field", "note" },
            properties = { field = { type = "string", enum = names }, note = { type = "string" } } } } } }
end

-- Notes as prompt lines. A note names its field, or covers the document as a
-- whole when an agent scout wrote it.
local function note_lines(notes: { any }): { string }
    local out = {}
    for _, n in ipairs(notes) do out[#out + 1] = n.field and (n.field .. ": " .. n.text) or ("agent: " .. n.text) end
    return out
end

-- The fields a scout serves, with the chunks each sections field may read, so
-- the scout cites a field's evidence where extraction lets it read.
local function scout_fields(run: any, fields: { any }): (string?, error?)
    local limits = {}
    for _, f in ipairs(fields) do
        local region, region_err = M.region(run, f)
        if region_err then return nil, region_err end
        if region then
            local labels = {}
            for i, n in ipairs(region) do labels[i] = "C" .. n end
            limits[#limits + 1] = "- " .. shapes.path(f) .. " reads only " .. table.concat(labels, ", ")
        end
    end
    return "Fields:\n" .. field_lines(fields) ..
        (#limits > 0 and ("\n\nSome fields read only their own chunks; cite their evidence there:\n" .. table.concat(limits, "\n")) or "")
end

-- The structured scout's prompt: fields, earlier notes and the evidence pool.
function M.scout_input(run: any, fields: { any }): (string?, error?)
    local fields_text, err = scout_fields(run, fields)
    if err then return nil, err end
    return fields_text .. (#run.notes > 0 and ("\n\nEarlier notes:\n" .. table.concat(note_lines(run.notes), "\n")) or "") ..
        "\n\nEvidence:\n" .. render(ordered(run.pool))
end

local SCOUT_SYSTEM = system([[You review evidence gathered from one document before values are extracted.
Rate from 0 to 1 how confident you are that the passages contain every field's value. For each field, list the chunk numbers
whose passages state or help determine its value. List chunk numbers that serve no field as noise. Propose focused search
queries for fields whose evidence is missing or weak, and leave short notes about where each value is or what to watch for.
Do not extract values. Chunk numbers are the numbers after C, without the C.]])

-- Tool calls an agent scout may make: queries per round over its rounds.
function M.agent_budget(cfg: any): integer
    return cfg.max_rounds * cfg.max_extra_queries
end

function M.scout(run: any, step: any): error?
    local cfg = run.config.stages.scout
    local fields = {}
    for _, f in ipairs(run.config.fields) do if f.strategy ~= "deep" or not run.config.stages.deep.enabled then fields[#fields + 1] = f end end
    if #fields == 0 then step.message = "No fields to scout"; return nil end
    local ctx = { document = run.document, retrieval = run.config.retrieval, meter = step.meter }
    if cfg.mode == "agent" then
        local tools = {}
        for _, id in ipairs(cfg.tools) do tools[#tools + 1] = doctools.TOOLS[id] end
        local found = 0
        local fields_text, fields_err = scout_fields(run, fields)
        if fields_err then return fields_err end
        local before = run.pool.count
        local instruction = system("You read one document with the tools to find evidence for the fields below. Follow references to definitions and schedules. When you have enough, reply with short notes per field saying where each value is.")
        local input = fields_text .. "\n\nEvidence so far:\n" .. render(ordered(run.pool))
        local answer, calls, err
        if cfg.agent_id then
            answer, calls, err = user_agent.run(run, step, instruction, input)
        else
            answer, calls, err = ai.agent(step.meter, cfg.model, instruction, input,
                tools, M.agent_budget(cfg),
                function(name: string, args: any): (string?, error?)
                    local hits, text, call_err = doctools.call(ctx, name, args)
                    step.tool_calls = step.tool_calls or {}
                    step.tool_calls[#step.tool_calls + 1] = { name = name, arguments = args,
                        result = { text = text, chunks = hits }, error = call_err and error_envelope.encode(call_err) or nil }
                    if call_err then return nil, call_err end
                    add(run.pool, hits)
                    return text, nil
                end, { max_tokens = cfg.max_tokens })
        end
        found = run.pool.count - before
        if err then return err end
        if cfg.share_notes and answer and trim(answer) ~= "" then run.notes[#run.notes + 1] = { text = trim(answer) } end
        step.message = calls .. " tool calls added " .. found .. " passages"
        return nil
    end
    local rounds, queries_run, by_name = 0, {}, {}
    for _, f in ipairs(fields) do by_name[shapes.path(f)] = f end
    while true do
        rounds = rounds + 1
        local scout_text, scout_err = M.scout_input(run, fields)
        if scout_err then return scout_err end
        local result, err = ai.structured(step.meter, cfg.model, scout_schema(cfg, fields, ordered(run.pool)), SCOUT_SYSTEM,
            scout_text :: string, { max_tokens = cfg.max_tokens })
        if err then return err end
        run.confidence = tonumber(result.confidence) or 0
        if cfg.drop_noise then
            local selected = {}
            for _, f in ipairs(fields) do
                local region, region_err = M.region(run, f)
                if region_err then return region_err end
                for _, n in ipairs(region or {}) do selected[#selected + 1] = n end
            end
            shapes.prune(run.pool, result.drop, result.evidence, selected)
        end
        if cfg.share_notes then for _, note in ipairs(result.notes) do run.notes[#run.notes + 1] = { field = note.field, text = note.note } end end
        if rounds > cfg.max_rounds or run.confidence >= cfg.target_confidence or #result.queries == 0 then break end
        for i, q in ipairs(result.queries) do
            if i > cfg.max_extra_queries then break end
            -- The schema limits q.field to the scouted fields.
            local field = by_name[q.field]
            local region, region_err = M.region(run, field)
            if region_err then return region_err end
            local hits, search_err = doctools.search(ctx, run.config.retrieval.search_mode, q.query, field.chunks, region)
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
local function queries_schema(limit: integer): any
    return { type = "object", additionalProperties = false, required = { "queries" },
        properties = { queries = { type = "array", maxItems = limit, items = { type = "string" } } } }
end

local function analyse(run: any, step: any, ctx: any, f: any, all_queries: { string }): error?
    local cfg = run.config.stages.deep
    local own = shapes.field_queries(f)
    local queries = {}
    for _, q in ipairs(own) do if #queries < cfg.max_queries then queries[#queries + 1] = q end end
    local room = cfg.max_queries - #queries
    if room > 0 then
        local generated, err = ai.structured(step.meter, cfg.query_model, queries_schema(room),
            system("Write up to " .. room .. " varied search queries that would find passages stating this field's value, including synonyms and related clauses."),
            field_lines({ f }) .. (f.search_hints ~= "" and ("\nHints: " .. f.search_hints) or ""), { temperature = cfg.query_temperature })
        if err then return err end
        for _, q in ipairs(generated.queries) do if #queries < cfg.max_queries then queries[#queries + 1] = q end end
    end
    local seen, found = {}, {}
    for _, q in ipairs(queries) do
        local region, region_err = M.region(run, f)
        if region_err then return region_err end
        local hits, search_err = doctools.search(ctx, run.config.retrieval.search_mode, q, cfg.chunks_per_query, region, cfg.min_similarity)
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
        for _, c in ipairs(wide) do
            if not seen[c.ordinal] and #found < cfg.chunk_cap then seen[c.ordinal] = true; found[#found + 1] = c end
        end
        table.sort(found, function(a: any, b: any): boolean return a.ordinal < b.ordinal end)
    end
    -- Deep fields retain their own evidence through scout pruning.
    shapes.admit(run.pool, found)
    local analysis, analysis_err = ai.generate(step.meter, cfg.model,
        system("You analyse passages of one document for a single field and explain what its value is, quoting the decisive wording and citing chunk numbers. Say plainly when the passages do not settle it."),
        field_lines({ f }) .. "\n\nPassages:\n" .. render(found), { temperature = cfg.analysis_temperature })
    if analysis_err then return analysis_err end
    run.analyses[shapes.path(f)] = analysis
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
                results:send({ name = shapes.path(f), err = analyse(run, step, ctx, f, all_queries) })
            end
        end)
    end
    for _, f in ipairs(fields) do work:send(f) end
    work:close()
    run.field_errors = run.field_errors or {}
    local failed = 0
    for _ = 1, #fields do
        local outcome = results:receive()
        if outcome.err then run.field_errors[outcome.name] = outcome.err; failed = failed + 1 end
    end
    step.status = failed == #fields and "failed" or (failed > 0 and "partial" or "completed")
    step.queries = all_queries
    step.message = #fields .. (#fields == 1 and " field" or " fields") .. " analysed · " .. run.pool.count .. " passages" .. (step.long_sections and " · long sections read as chunks" or "")
    return nil
end

-- Highlighter: a small model keeps only the sentences each passage holds for
-- the fields, so extraction reads less and cites tighter quotes.
local HIGHLIGHT_EXCERPTS = 4

function M.highlight_schema(batch: { any }): any
    return { type = "object", additionalProperties = false, required = { "passages" }, properties = {
        passages = { type = "array", maxItems = #batch, items = { type = "object", additionalProperties = false, required = { "chunk", "excerpts" },
            properties = { chunk = shapes.passage_ref(batch), excerpts = { type = "array", maxItems = HIGHLIGHT_EXCERPTS, items = { type = "string" } } } } } } }
end
local HIGHLIGHT_BATCH = 12

function M.highlight(run: any, step: any): error?
    local model = run.config.retrieval.highlighter_model
    local chunks = ordered(run.pool)
    local kept, before = 0, #chunks
    for start = 1, #chunks, HIGHLIGHT_BATCH do
        local batch = {}
        for i = start, math.min(#chunks, start + HIGHLIGHT_BATCH - 1) do batch[#batch + 1] = chunks[i] end
        local result, err = ai.structured(step.meter, model, M.highlight_schema(batch),
            system("For each passage, copy word for word the sentences that state or help determine any field's value. Return no excerpts for passages that do not."),
            "Fields:\n" .. field_lines(run.config.fields) .. "\n\nPassages:\n" .. render(batch))
        if err then return err end
        local excerpts = {}
        for _, p in ipairs(result.passages) do excerpts[math.tointeger(tonumber(p.chunk)) or -1] = p.excerpts end
        for _, c in ipairs(batch) do
            -- Only excerpts that occur in the passage replace it, each as its own paragraph.
            local source, genuine = shapes.normalize(c.content), {}
            for _, excerpt in ipairs(excerpts[c.ordinal] or {}) do
                local q = shapes.normalize(excerpt)
                if q ~= "" and source:find(q, 1, true) then genuine[#genuine + 1] = trim(excerpt) end
            end
            if #genuine > 0 then
                c.content = table.concat(genuine, "\n\n")
                kept = kept + 1
            else
                shapes.drop(run.pool, c.ordinal)
            end
        end
    end
    step.message = "Kept " .. kept .. " of " .. before .. " passages"
    return nil
end

-- A grounded quote with its document location.
type Citation = { quote: string, chunk: integer?, section: string, page: integer?, chunk_id: string, found: boolean? }

-- One field's extracted value and evidence status.
type Value = { name: string, path: string, value: any?, confidence: number, evidence: { Citation }, verified: boolean, missing: boolean,
    reason: string?, quotes_found: boolean? }

-- Extraction: structured calls over the evidence pool, each for fields that share a group and a region.
local EXTRACT_SYSTEM = system([[You extract field values from passages of one document. Use only what the passages state.
For each field say whether the passages state it (found), give the value (any placeholder of the right type when not found), your confidence from 0 to 1, and evidence:
the chunk number and an exact quote copied character for character from that chunk.]])

-- Extraction calls: fields grouped by their group, then by the region they read,
-- in at most "fields per call" per call. Every passage in a call is one each of
-- its fields may read; a call gets its own fields' notes, and document-wide
-- notes only when its fields read the whole document.
function M.extraction_calls(run: any): ({ any }?, error?)
    local limit = run.config.stages.extract.max_fields_per_call
    local sets, order = {}, {}
    for _, f in ipairs(run.config.fields) do
        if run.field_errors and run.field_errors[shapes.path(f)] then goto continue_field end
        local region, region_err = M.region(run, f)
        if region_err then return nil, region_err end
        local reads = "*"
        if region then
            local sorted = {}
            for i, n in ipairs(region) do sorted[i] = n end
            table.sort(sorted)
            reads = table.concat(sorted, ",")
        end
        local key = f.group .. "\0" .. reads
        if not sets[key] then sets[key] = { fields = {}, whole = region == nil }; order[#order + 1] = key end
        local set = sets[key]
        set.fields[#set.fields + 1] = f
        ::continue_field::
    end
    local pool, calls = ordered(run.pool), {}
    for _, key in ipairs(order) do
        local set = sets[key]
        local passages = {}
        for _, c in ipairs(pool) do
            local allowed, err = visible(run, set.fields[1], c.ordinal)
            if err then return nil, err end
            if allowed then passages[#passages + 1] = c end
        end
        for start = 1, #set.fields, limit do
            local batch = {}
            local names, notes = {}, {}
            for i = start, math.min(#set.fields, start + limit - 1) do
                batch[#batch + 1] = set.fields[i]; names[shapes.path(set.fields[i])] = true
            end
            for _, n in ipairs(run.notes) do
                if (n.field and names[n.field]) or (not n.field and set.whole) then notes[#notes + 1] = n end
            end
            calls[#calls + 1] = { fields = batch, passages = passages, notes = note_lines(notes) }
        end
    end
    return calls
end

-- One extraction call: prompt, model reply and a value per field.
local function extract_call(run: any, step: any, cfg: any, call: any): error?
    local batch, passages, notes = call.fields, call.passages, call.notes
    local context = {}
    for _, f in ipairs(batch) do if run.analyses[shapes.path(f)] then context[#context + 1] = "Analysis of " .. shapes.path(f) .. ":\n" .. run.analyses[shapes.path(f)] end end
    local evidence = render(passages)
    local user = "Fields:\n" .. field_lines(batch) ..
        (#notes > 0 and ("\n\nScout notes:\n" .. table.concat(notes, "\n")) or "") ..
        (#context > 0 and ("\n\n" .. table.concat(context, "\n\n")) or "") ..
        "\n\nPassages:\n" .. evidence
    local result, err = ai.structured(step.meter, cfg.model, shapes.group_schema(batch, passages), EXTRACT_SYSTEM, user, { max_tokens = cfg.max_output_tokens })
    if err then
        -- The llm module refuses a prompt larger than the model's window before calling it.
        if errors.is(err, errors.INVALID) and ((err :: any):details() or {}).error_type == "context_window" then
            return errors.new({ kind = errors.INVALID, details = (err :: any):details(),
                message = tostring(err) .. "; lower passages per field, Deep chunk cap or fields per call" })
        end
        return err
    end
    local entries = {}
    for _, f in ipairs(batch) do
        local item = shapes.get(result, shapes.path(f))
        local cited = {}
        for _, e in ipairs(item.evidence) do
            local ordinal = math.tointeger(e.chunk)
            -- Citations stay inside the field's selected region.
            local allowed, region_err = visible(run, f, ordinal)
            if region_err then return region_err end
            if not ordinal or allowed then
                local chunk = ordinal and run.pool.by_ordinal[ordinal]
                local location = shapes.quote_location(chunk, e.quote)
                cited[#cited + 1] = { quote = e.quote, chunk = ordinal,
                    section = chunk and chunk.heading_path or "", page = location.page, page_start = location.page_start, page_end = location.page_end, chunk_id = chunk and chunk.id or "" }
            end
        end
        local entry: Value = { name = f.name, path = shapes.path(f), confidence = 0, evidence = {}, verified = false, missing = true, failed = false }
        if item.found then
            entry.value = item.value
            entry.confidence = item.confidence
            entry.evidence = cited
            entry.missing = false
            if f.evidence_required and #cited == 0 then entry.reason = "No quote supports this value" end
        end
        entries[#entries + 1] = entry
    end
    for _, entry in ipairs(entries) do run.values[#run.values + 1] = entry end
    return nil
end

function M.extract(run: any, step: any): error?
    local cfg = run.config.stages.extract
    local calls, successes = 0, 0
    local failure: error? = nil
    local extraction_calls, calls_err = M.extraction_calls(run)
    if calls_err then return calls_err end
    for _, f in ipairs(run.config.fields) do
        local err = run.field_errors and run.field_errors[shapes.path(f)]
        if err then failed_field(run, f, err); failure = failure or err end
    end
    for _, call in ipairs(extraction_calls) do
        if #call.passages == 0 then
            -- Empty passage sets produce missing fields.
            for _, f in ipairs(call.fields) do
                run.values[#run.values + 1] = { name = f.name, path = shapes.path(f), confidence = 0, evidence = {}, verified = false, missing = true, failed = false,
                    reason = f.search_within == "sections" and "No passage from its sections reached extraction" or "No passage reached extraction" }
            end
        else
            local err = extract_call(run, step, cfg, call)
            if err then
                failure = failure or err
                for _, f in ipairs(call.fields) do failed_field(run, f, err) end
            else successes = successes + 1 end
            calls = calls + 1
        end
    end
    local position = {}
    for i, f in ipairs(run.config.fields) do position[shapes.path(f)] = i end
    table.sort(run.values, function(a: any, b: any): boolean return position[shapes.path(a)] < position[shapes.path(b)] end)
    step.message = calls .. (calls == 1 and " call" or " calls") .. " · " .. #run.values .. " values"
    local failed = 0
    for _, v in ipairs(run.values) do if v.failed then failed = failed + 1 end end
    step.status = failed == #run.config.fields and "failed" or (failed > 0 and "partial" or "completed")
    if failure and successes == 0 and failed == #run.config.fields then return failure end
    return nil
end

-- Verify: quotes must appear in the document; a model may also confirm each
-- quote supports its value.
local function support_schema(values: { any }): any
    local names = {}
    for _, v in ipairs(values) do names[#names + 1] = shapes.path(v) end
    return { type = "object", additionalProperties = false, required = { "checks" }, properties = {
        checks = { type = "array", maxItems = #names, items = { type = "object", additionalProperties = false, required = { "field", "supported", "reason" },
            properties = { field = { type = "string", enum = names }, supported = { type = "boolean" }, reason = { type = "string" } } } } } }
end

function M.verify(run: any, step: any): error?
    local cfg = run.config.stages.verify
    local fields = {}
    for _, f in ipairs(run.config.fields) do fields[shapes.path(f)] = f end
    if cfg.check_quotes then
        local chunks, err = store.all_chunks(run.document.id)
        if err then return err end
        local bodies, by_ordinal, order = {}, {}, {}
        for _, c in ipairs(chunks) do
            bodies[c.ordinal] = shapes.normalize(c.content); by_ordinal[c.ordinal] = c; order[#order + 1] = c.ordinal
        end
        for _, v in ipairs(run.values) do
            v.quotes_found = true
            for _, e in ipairs(v.evidence) do
                local candidates = {}
                for _, ordinal in ipairs(order) do
                    local allowed, region_err = visible(run, fields[shapes.path(v)], ordinal)
                    if region_err then return region_err end
                    if allowed then candidates[#candidates + 1] = ordinal end
                end
                local at = shapes.locate(e.quote, e.chunk, bodies, candidates)
                e.found = at ~= nil
                if at then
                    local c = by_ordinal[at]
                    e.chunk, e.chunk_id, e.section = at, c.id, c.heading_path
                    local location = shapes.quote_location(c, e.quote)
                    e.page, e.page_start, e.page_end = location.page, location.page_start, location.page_end
                end
                if not e.found then v.quotes_found = false end
            end
        end
    end
    local support = {}
    if cfg.check_support then
        local found, lines_out = {}, {}
        for _, v in ipairs(run.values) do
            if not v.missing and not v.failed then
                found[#found + 1] = v
                local quotes = {}
                for _, e in ipairs(v.evidence) do quotes[#quotes + 1] = "\"" .. e.quote .. "\"" end
                lines_out[#lines_out + 1] = "- " .. shapes.path(v) .. " = " .. json.encode(v.value) .. "\n  quotes: " .. table.concat(quotes, " | ")
            end
        end
        if #found > 0 then
            local result, err = ai.structured(step.meter, cfg.model, support_schema(found),
                system("For each field, decide whether its quotes support its value exactly. Return one check per field."),
                table.concat(lines_out, "\n"))
            if err then return err end
            for _, c in ipairs(result.checks) do support[c.field] = c end
        end
    end
    local failed = 0
    for _, v in ipairs(run.values) do
        local reasons = {}
        if v.reason then reasons[#reasons + 1] = v.reason end
        if not v.missing and not v.failed then
            local valid, shape_err = json.validate(shapes.value_schema(fields[shapes.path(v)]), v.value)
            if not valid then reasons[#reasons + 1] = "Value does not match its declared shape: " .. tostring(shape_err) end
        end
        if cfg.check_quotes and not v.missing and not v.failed and not v.quotes_found then reasons[#reasons + 1] = "A quote is not in the document" end
        if cfg.check_support and not v.missing and not v.failed then
            local check = support[shapes.path(v)]
            if not check then reasons[#reasons + 1] = "The support check gave no verdict"
            elseif not check.supported then reasons[#reasons + 1] = check.reason end
        end
        v.verified = not v.failed and #reasons == 0
        v.reason = #reasons > 0 and table.concat(reasons, "; ") or nil
        if not v.verified then failed = failed + 1 end
    end
    step.message = failed == 0 and "All values check out" or (failed .. (failed == 1 and " value needs" or " values need") .. " review")
    return nil
end

return M
