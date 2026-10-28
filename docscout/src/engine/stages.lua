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

local trim, lines, add, ordered, render, field_lines = shapes.trim, shapes.lines, shapes.add, shapes.ordered, shapes.render, shapes.field_lines

local M = {}

-- Region (chunk ordinals) a field searches within, or nil for the whole
-- document. Map selects a region for every "sections" field before any search.
local function region(run: any, field: any): { integer }?
    if field.search_within ~= "sections" then return nil end
    return assert(run.regions[field.name], "no region selected for " .. field.name)
end

-- Whether a field may read the chunk at this ordinal.
local function visible(run: any, field: any, ordinal: integer): boolean
    local r = region(run, field)
    if not r then return true end
    for _, n in ipairs(r) do if n == ordinal then return true end end
    return false
end

local function system(text: string): string return text .. "\n" .. shapes.DATA_RULE end

-- Map: outline from headings, or built by the model; then the sections each
-- "search within sections" field should read.
local function outline_schema(chunks: integer): any
    return { type = "object", additionalProperties = false, required = { "sections" }, properties = {
        sections = { type = "array", minItems = 1, maxItems = chunks, items = { type = "object", additionalProperties = false, required = { "title", "first_chunk" },
            properties = { title = { type = "string" }, first_chunk = { type = "integer", minimum = 1, maximum = chunks } } } } } }
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
    for _, f in ipairs(fields) do names[#names + 1] = f.name end
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
        local preview = {}
        for _, c in ipairs(chunks) do preview[#preview + 1] = "[C" .. c.ordinal .. "] " .. c.content:sub(1, 160):gsub("\n", " ") end
        local built, build_err = ai.structured(step.meter, cfg.model, outline_schema(#chunks),
            system("You divide a document into its logical sections. Give each section a short title and the chunk number where it starts, in order; the first section starts at chunk 1."),
            table.concat(preview, "\n"))
        if build_err then return build_err end
        -- One section per start chunk, in order; chunks before the first start form their own section.
        local by_start = {}
        for _, s in ipairs(built.sections) do
            local start = math.tointeger(s.first_chunk) :: integer
            if not by_start[start] then by_start[start] = trim(s.title) end
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
                local hits, err = doctools.search(ctx, mode, query, f.chunks, region(run, f))
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
-- drops only passages no field cites.
local function scout_schema(cfg: any, fields: { any }, pool: { any }): any
    local names, ordinals = {}, {}
    for _, f in ipairs(fields) do names[#names + 1] = f.name end
    for _, c in ipairs(pool) do ordinals[#ordinals + 1] = c.ordinal end
    local chunk = #ordinals > 0 and { type = "integer", enum = ordinals } or { type = "integer" }
    return { type = "object", additionalProperties = false, required = { "confidence", "evidence", "drop", "queries", "notes" }, properties = {
        confidence = { type = "number", minimum = 0, maximum = 1 },
        evidence = { type = "array", maxItems = #fields, items = { type = "object", additionalProperties = false, required = { "field", "chunks" },
            properties = { field = { type = "string", enum = names }, chunks = { type = "array", maxItems = #ordinals, items = chunk } } } },
        drop = { type = "array", maxItems = #ordinals, items = chunk },
        queries = { type = "array", maxItems = cfg.max_extra_queries, items = { type = "object", additionalProperties = false, required = { "field", "query" },
            properties = { field = { type = "string", enum = names }, query = { type = "string" } } } },
        notes = { type = "array", maxItems = #fields, items = { type = "object", additionalProperties = false, required = { "field", "note" },
            properties = { field = { type = "string", enum = names }, note = { type = "string" } } } } } }
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
        local answer, calls, err = ai.agent(step.meter, cfg.model,
            system("You read one document with the tools to find evidence for the fields below. Follow references to definitions and schedules. When you have enough, reply with short notes per field saying where each value is."),
            "Fields:\n" .. field_lines(fields) .. "\n\nEvidence so far:\n" .. render(ordered(run.pool)),
            tools, M.agent_budget(cfg),
            function(name: string, args: any): (string?, error?)
                local hits, text, call_err = doctools.call(ctx, name, args)
                if call_err then return nil, call_err end
                local before = run.pool.count
                add(run.pool, hits)
                found = found + (run.pool.count - before)
                return text, nil
            end, { max_tokens = cfg.max_tokens })
        if err then return err end
        if cfg.share_notes and answer and trim(answer) ~= "" then run.notes[#run.notes + 1] = trim(answer) end
        step.message = calls .. " tool calls added " .. found .. " passages"
        return nil
    end
    local rounds, queries_run = 0, {}
    while true do
        rounds = rounds + 1
        local result, err = ai.structured(step.meter, cfg.model, scout_schema(cfg, fields, ordered(run.pool)), SCOUT_SYSTEM,
            "Fields:\n" .. field_lines(fields) .. (#run.notes > 0 and ("\n\nEarlier notes:\n" .. table.concat(run.notes, "\n")) or "") ..
            "\n\nEvidence:\n" .. render(ordered(run.pool)), { max_tokens = cfg.max_tokens })
        if err then return err end
        run.confidence = tonumber(result.confidence) or 0
        if cfg.drop_noise then shapes.prune(run.pool, result.drop, result.evidence) end
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
        for _, c in ipairs(wide) do
            if not seen[c.ordinal] and #found < cfg.chunk_cap then seen[c.ordinal] = true; found[#found + 1] = c end
        end
        table.sort(found, function(a: any, b: any): boolean return a.ordinal < b.ordinal end)
    end
    add(run.pool, found)
    local analysis, analysis_err = ai.generate(step.meter, cfg.model,
        system("You analyse passages of one document for a single field and explain what its value is, quoting the decisive wording and citing chunk numbers. Say plainly when the passages do not settle it."),
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
local HIGHLIGHT_EXCERPTS = 4

local function highlight_schema(batch: integer): any
    return { type = "object", additionalProperties = false, required = { "passages" }, properties = {
        passages = { type = "array", maxItems = batch, items = { type = "object", additionalProperties = false, required = { "chunk", "excerpts" },
            properties = { chunk = { type = "integer" }, excerpts = { type = "array", maxItems = HIGHLIGHT_EXCERPTS, items = { type = "string" } } } } } } }
end
local HIGHLIGHT_BATCH = 12

function M.highlight(run: any, step: any): error?
    local model = run.config.retrieval.highlighter_model
    local chunks = ordered(run.pool)
    local kept, before = 0, #chunks
    for start = 1, #chunks, HIGHLIGHT_BATCH do
        local batch = {}
        for i = start, math.min(#chunks, start + HIGHLIGHT_BATCH - 1) do batch[#batch + 1] = chunks[i] end
        local result, err = ai.structured(step.meter, model, highlight_schema(#batch),
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

-- Extraction: one structured call per group of fields over the evidence pool.
local EXTRACT_SYSTEM = system([[You extract field values from passages of one document. Use only what the passages state.
For each field say whether the passages state it (found), give the value (any placeholder of the right type when not found), your confidence from 0 to 1, and evidence:
the chunk number and an exact quote copied character for character from that chunk.]])

function M.extract(run: any, step: any): error?
    local cfg = run.config.stages.extract
    local groups, order = {}, {}
    for _, f in ipairs(run.config.fields) do
        local g = trim(f.group) ~= "" and trim(f.group) or "Default"
        if not groups[g] then groups[g] = {}; order[#order + 1] = g end
        local list = groups[g]
        list[#list + 1] = f
    end
    local pool = ordered(run.pool)
    local calls = 0
    for _, g in ipairs(order) do
        local list = groups[g]
        for start = 1, #list, cfg.max_fields_per_call do
            local batch = {}
            for i = start, math.min(#list, start + cfg.max_fields_per_call - 1) do batch[#batch + 1] = list[i] end
            local context = {}
            for _, f in ipairs(batch) do if run.analyses[f.name] then context[#context + 1] = "Analysis of " .. f.name .. ":\n" .. run.analyses[f.name] end end
            local passages = {}
            for _, c in ipairs(pool) do
                for _, f in ipairs(batch) do if visible(run, f, c.ordinal) then passages[#passages + 1] = c; break end end
            end
            local evidence = render(passages)
            local user = "Fields:\n" .. field_lines(batch) ..
                (#run.notes > 0 and ("\n\nScout notes:\n" .. table.concat(run.notes, "\n")) or "") ..
                (#context > 0 and ("\n\n" .. table.concat(context, "\n\n")) or "") ..
                "\n\nPassages:\n" .. evidence
            local budget_err = ai.check_budget(cfg.model, EXTRACT_SYSTEM .. user, cfg.max_output_tokens)
            if budget_err then return budget_err end
            local schema = shapes.group_schema(batch)
            local result, err
            if cfg.structured_output then
                result, err = ai.structured(step.meter, cfg.model, schema, EXTRACT_SYSTEM, user, { max_tokens = cfg.max_output_tokens })
            else
                local textual, gen_err = ai.generate(step.meter, cfg.model, EXTRACT_SYSTEM .. "\nReply with only a JSON object keyed by field name, each {found, value, confidence, evidence:[{chunk, quote}]}.", user, { max_tokens = cfg.max_output_tokens })
                if gen_err then err = gen_err else result, err = shapes.json_object(textual) end
                if not err then
                    local valid, invalid_err = json.validate(schema, result)
                    if not valid then
                        err = errors.new({ kind = errors.UNAVAILABLE, retryable = true, message = "the extraction reply does not match the field schema: " .. tostring(invalid_err) })
                    end
                end
            end
            if err then return err end
            calls = calls + 1
            for _, f in ipairs(batch) do
                local item = result[f.name]
                local cited = {}
                for _, e in ipairs(item.evidence) do
                    local ordinal = math.tointeger(e.chunk)
                    -- A citation outside the field's region is not evidence for it.
                    if not ordinal or visible(run, f, ordinal) then
                        local chunk = ordinal and run.pool.by_ordinal[ordinal]
                        cited[#cited + 1] = { quote = e.quote, chunk = ordinal,
                            section = chunk and chunk.heading_path or "", page = chunk and chunk.page_start or nil, chunk_id = chunk and chunk.id or "" }
                    end
                end
                local entry: any = { name = f.name, confidence = 0, evidence = {}, verified = false, missing = true }
                if item.found then
                    entry.value = item.value
                    entry.confidence = item.confidence
                    entry.evidence = cited
                    entry.missing = false
                    if f.evidence_required and #cited == 0 then entry.reason = "No quote supports this value" end
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
local function support_schema(values: { any }): any
    local names = {}
    for _, v in ipairs(values) do names[#names + 1] = v.name end
    return { type = "object", additionalProperties = false, required = { "checks" }, properties = {
        checks = { type = "array", maxItems = #names, items = { type = "object", additionalProperties = false, required = { "field", "supported", "reason" },
            properties = { field = { type = "string", enum = names }, supported = { type = "boolean" }, reason = { type = "string" } } } } } }
end

function M.verify(run: any, step: any): error?
    local cfg = run.config.stages.verify
    local fields = {}
    for _, f in ipairs(run.config.fields) do fields[f.name] = f end
    if cfg.check_quotes then
        local chunks, err = store.all_chunks(run.document.id)
        if err then return err end
        local bodies, by_ordinal, order = {}, {}, {}
        for _, c in ipairs(chunks) do
            bodies[c.ordinal] = shapes.normalize(c.content); by_ordinal[c.ordinal] = c; order[#order + 1] = c.ordinal
        end
        for _, v in ipairs(run.values) do
            v.quotes_found = #v.evidence > 0
            for _, e in ipairs(v.evidence) do
                local candidates = {}
                for _, ordinal in ipairs(order) do if visible(run, fields[v.name], ordinal) then candidates[#candidates + 1] = ordinal end end
                local at = shapes.locate(e.quote, e.chunk, bodies, candidates)
                e.found = at ~= nil
                if at and at ~= e.chunk then
                    local c = by_ordinal[at]
                    e.chunk, e.chunk_id, e.section, e.page = at, c.id, c.heading_path, c.page_start
                end
                if not e.found then v.quotes_found = false end
            end
        end
    end
    local support = {}
    if cfg.check_support then
        local found, lines_out = {}, {}
        for _, v in ipairs(run.values) do
            if not v.missing then
                found[#found + 1] = v
                local quotes = {}
                for _, e in ipairs(v.evidence) do quotes[#quotes + 1] = "\"" .. e.quote .. "\"" end
                lines_out[#lines_out + 1] = "- " .. v.name .. " = " .. json.encode(v.value) .. "\n  quotes: " .. table.concat(quotes, " | ")
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
        if cfg.check_quotes and not v.missing and not v.quotes_found then reasons[#reasons + 1] = "A quote is not in the document" end
        if cfg.check_support and not v.missing then
            local check = support[v.name]
            if not check then reasons[#reasons + 1] = "The support check gave no verdict"
            elseif not check.supported then reasons[#reasons + 1] = check.reason end
        end
        v.verified = #reasons == 0
        v.reason = #reasons > 0 and table.concat(reasons, "; ") or nil
        if not v.verified then failed = failed + 1 end
    end
    step.message = failed == 0 and "All values check out" or (failed .. (failed == 1 and " value needs" or " values need") .. " review")
    return nil
end

return M
