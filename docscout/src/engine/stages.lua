-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- The extraction stages. Each takes the run context and its step record and
-- returns what the next stages need. Evidence is a pool of chunks keyed by
-- ordinal; the model sees chunks as [C<ordinal>].
local json = require("json")
local ai = require("ai")
local store = require("store")
local doctools = require("doctools")
local process = require("process")
local pages = require("pages")
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

-- Whether extraction reads page images; the text stages then only choose
-- pages. The read step loads the page images exactly when the extractor reads pages.
local function reads_pages(run: any): boolean return run.page_images ~= nil end

-- The processed copy's chunks by ordinal, read once per run.
local function document_chunks(run: any): ({ [integer]: any }?, error?)
    if run.chunks then return run.chunks, nil end
    local chunks, err = store.all_chunks(run.document.id)
    if err then return nil, err end
    local by_ordinal = {}
    for _, c in ipairs(chunks) do by_ordinal[c.ordinal] = c end
    run.chunks = by_ordinal
    return by_ordinal, nil
end

-- The pages chunks lie on. In a one-page document every chunk lies on page 1,
-- with or without a page marker.
local function pages_of(run: any, chunks: { any }): { integer }
    if run.page_images.count == 1 then return #chunks > 0 and { 1 } or {} end
    return pages.of_chunks(chunks)
end

-- Passages for fields that fit a request. Each field ranks the passages still
-- visible to it: those it cited first, then those its own searches found,
-- then by best search rank and position. Fields take their next passage in
-- turns while fits(kept passages in document order) holds. Returns the kept
-- passages in document order and, per field path, how many of its visible
-- passages were cut.
function M.allocate(pool: any, passages: { any }, paths: { string }, fits: ({ any }) -> boolean): ({ any }, { [string]: integer })
    local lists, cut = {}, {}
    local function provenance(c: any): any return pool.provenance[c.ordinal] or { fields = {}, cited = {}, excluded = {} } end
    for i, path in ipairs(paths) do
        local list = {}
        for _, c in ipairs(passages) do if not provenance(c).excluded[path] then list[#list + 1] = c end end
        table.sort(list, function(a: any, b: any): boolean
            local pa, pb = provenance(a), provenance(b)
            local ca, cb = pa.cited[path] and 0 or 1, pb.cited[path] and 0 or 1
            if ca ~= cb then return ca < cb end
            local fa, fb = pa.fields[path] and 0 or 1, pb.fields[path] and 0 or 1
            if fa ~= fb then return fa < fb end
            local ra, rb = pa.rank or math.huge, pb.rank or math.huge
            if ra ~= rb then return ra < rb end
            return a.ordinal < b.ordinal
        end)
        lists[i] = list
    end
    local kept, next_at, open = {}, {}, {}
    local function in_order(extra: any?): { any }
        local out = {}
        for _, c in ipairs(passages) do if kept[c.ordinal] or c == extra then out[#out + 1] = c end end
        return out
    end
    for i = 1, #paths do next_at[i], open[i] = 1, true end
    local progressed = true
    while progressed do
        progressed = false
        for i = 1, #paths do
            if open[i] then
                local list = lists[i]
                while next_at[i] <= #list and kept[list[next_at[i]].ordinal] do next_at[i] = next_at[i] + 1 end
                local c = list[next_at[i]]
                if not c or not fits(in_order(c)) then open[i] = false
                else kept[c.ordinal] = c; next_at[i] = next_at[i] + 1; progressed = true end
            end
        end
    end
    for i, path in ipairs(paths) do
        local lost = 0
        for _, c in ipairs(lists[i]) do if not kept[c.ordinal] then lost = lost + 1 end end
        cut[path] = lost
    end
    return in_order(nil), cut
end

-- Ordinals of passages not in kept.
local function excluded(passages: { any }, kept: { any }): { integer }
    local in_kept, out = {}, {}
    for _, c in ipairs(kept) do in_kept[c.ordinal] = true end
    for _, c in ipairs(passages) do if not in_kept[c.ordinal] then out[#out + 1] = c.ordinal end end
    return out
end

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

local function preview_text(chunks: { any }): string
    local lines = {}
    for _, c in ipairs(chunks) do lines[#lines + 1] = "[C" .. c.ordinal .. "] " .. c.content:sub(1, PREVIEW_CHARS):gsub("\n", " ") end
    return table.concat(lines, "\n")
end

-- Consecutive windows of chunk previews, each with its first and last ordinal:
-- at most size chunks, for which fits(window chunks) holds when given.
function M.outline_windows(chunks: { any }, size: integer, fits: (({ any }) -> boolean)?): { any }
    local windows = {}
    for _, batch in ipairs(shapes.batches(chunks, fits or function(_: { any }): boolean return true end, size)) do
        windows[#windows + 1] = { first = batch[1].ordinal, last = batch[#batch].ordinal, preview = preview_text(batch) }
    end
    return windows
end

local function section_ids(outline: { any }): { string }
    local ids = {}
    for _, s in ipairs(outline) do ids[#ids + 1] = s.id end
    return ids
end


-- One required summary per section id, so a constrained decoder cannot leave a section out.
function M.summary_schema(outline: { any }): any
    return shapes.keyed(section_ids(outline), { type = "string" })
end

-- One required property per field path, each a list of at least one existing
-- section. Keying the choice by field leaves a constrained decoder no way to
-- name a field twice or leave one out; uniqueness across array items is not
-- enforced by guided decoding.
local function select_schema(outline: { any }, fields: { any }): any
    local required, properties = {}, {}
    for _, f in ipairs(fields) do
        local path = shapes.path(f)
        required[#required + 1] = path
        properties[path] = { type = "array", minItems = 1, maxItems = #outline, items = { type = "integer", minimum = 1, maximum = #outline } }
    end
    return { type = "object", additionalProperties = false, required = required, properties = properties }
end

function M.map(run: any, step: any): error?
    local cfg = run.config.stages.map
    local function sampling(stage: string, fields: { string }?): any
        return { temperature = cfg.temperature, max_tokens = cfg.max_tokens, stage = stage, fields = fields }
    end
    local outline = run.document.outline
    -- A usable table of contents has at least three sections.
    local headed = #outline >= 3
    if cfg.outline == "build" or not headed then
        local chunks, err = store.all_chunks(run.document.id)
        if err then return err end
        -- One section per start chunk, in order; chunks before the first start form their own section.
        local by_start, previous = {}, nil
        local outline_system = system("You divide a document into its logical sections. Give each section a short title and the chunk number where it starts, in order.")
        local fits, _, fit_err = ai.fitter(cfg.model, cfg.max_tokens)
        if fit_err then return fit_err end
        local function window_fits(batch: { any }): boolean
            -- The carried-over sentence names a section title; it counts at its longest.
            return (fits :: any)(outline_system, string.rep(" ", 400) .. preview_text(batch), outline_schema(batch[1].ordinal, batch[#batch].ordinal))
        end
        for _, w in ipairs(M.outline_windows(chunks, OUTLINE_WINDOW, window_fits)) do
            local carried = previous and ("The passages continue the section \"" .. previous .. "\" unless a new section starts at chunk " .. w.first .. ".\n\n") or ""
            local built, build_err = ai.structured(step.meter, cfg.model, outline_schema(w.first, w.last), outline_system,
                carried .. w.preview, sampling("outline"))
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
                    s.tokens = s.tokens + shapes.tokens(c.content)
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
        -- Summaries are asked for in windows of sections that fit the model's window.
        local listing = {}
        for _, s in ipairs(run.document.outline) do
            local chunks, err = doctools.section({ document = run.document }, s.id)
            if err then return err end
            local body = {}
            for _, c in ipairs(chunks) do body[#body + 1] = c.content end
            listing[s.id] = "## " .. s.id .. " " .. s.path .. "\n" .. table.concat(body, "\n"):sub(1, 1500)
        end
        local summary_system = system("Summarize each section in one sentence, naming what it covers. Return one summary per section id.")
        local fits, _, fit_err = ai.fitter(cfg.model, cfg.max_tokens)
        if fit_err then return fit_err end
        local function text(window: { any }): string
            local texts = {}
            for _, s in ipairs(window) do texts[#texts + 1] = listing[s.id] end
            return table.concat(texts, "\n\n")
        end
        local function window_fits(window: { any }): boolean return (fits :: any)(summary_system, text(window), M.summary_schema(window)) end
        for _, window in ipairs(shapes.batches(run.document.outline, window_fits)) do
            local result, err = ai.structured(step.meter, cfg.model, M.summary_schema(window), summary_system, text(window), sampling("summaries"))
            if err then return err end
            for _, s in ipairs(window) do
                local summary = trim(tostring(result[s.id] or ""))
                s.summary = summary ~= "" and summary or nil
            end
        end
    end
    local scoped = {}
    for _, f in ipairs(run.config.fields) do if f.search_within == "sections" then scoped[#scoped + 1] = f end end
    if #scoped > 0 then
        local listing = {}
        for n, section in ipairs(run.document.outline) do
            listing[#listing + 1] = "[S" .. n .. "] " .. doctools.outline_text({ section })
        end
        -- The outline goes to every call; fields are batched to fit the model's window.
        local select_system = system("You pick, for each field, the sections of the outline most likely to contain its value. Choose few but enough sections; include definitions or schedules a field depends on. Return section ordinals: the numbers after S in the outline labels, without the S.")
        local outline_text = "Outline:\n" .. table.concat(listing, "\n") .. "\n\nFields:\n"
        local fits, _, fit_err = ai.fitter(cfg.model, cfg.max_tokens)
        if fit_err then return fit_err end
        local function batch_fits(batch: { any }): boolean
            return (fits :: any)(select_system, outline_text .. field_lines(batch), select_schema(run.document.outline, batch))
        end
        local picked = {}
        for _, batch in ipairs(shapes.batches(scoped, batch_fits)) do
            local result, err = ai.structured(step.meter, cfg.model, select_schema(run.document.outline, batch), select_system,
                outline_text .. field_lines(batch), sampling("select", shapes.paths(batch)))
            if err then return err end
            for _, f in ipairs(batch) do
                local path = shapes.path(f)
                local ids = {}
                for _, ordinal in ipairs(result[path]) do ids[#ids + 1] = run.document.outline[ordinal].id end
                picked[#picked + 1] = path .. " → " .. table.concat(ids, ", ")
                run.regions[path] = shapes.ordinals_of(run.document.outline, ids)
            end
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
        add(run.pool, hits, nil, q.query); queries[#queries + 1] = q.query
    end
    for _, f in ipairs(run.config.fields) do
        if f.strategy ~= "deep" or not run.config.stages.deep.enabled then
            for _, query in ipairs(shapes.field_queries(f)) do
                local region, region_err = M.region(run, f)
                if region_err then return region_err end
                local hits, err = doctools.search(ctx, mode, query, f.chunks, region)
                if err then return err end
                add(run.pool, hits, shapes.path(f), query); queries[#queries + 1] = query
            end
        end
    end
    step.queries = queries
    step.message = run.pool.count .. " passages in the evidence pool"
    return nil
end

-- The scout names, per field, the passages holding its evidence; the engine
-- retains passages cited by a field. Evidence and notes hold one required
-- entry per field, so a constrained decoder cannot leave a field out; an
-- empty list or note says the scout found none for that field.
function M.scout_schema(cfg: any, fields: { any }, pool: { any }): any
    local names = {}
    for _, f in ipairs(fields) do names[#names + 1] = shapes.path(f) end
    local chunk = shapes.passage_ref(pool)
    return { type = "object", additionalProperties = false, required = { "confidence", "evidence", "drop", "queries", "notes" }, properties = {
        confidence = { type = "number", minimum = 0, maximum = 1 },
        evidence = shapes.keyed(names, { type = "array", maxItems = #pool, items = chunk }),
        drop = { type = "array", maxItems = #pool, items = chunk },
        queries = { type = "array", maxItems = cfg.max_extra_queries, items = { type = "object", additionalProperties = false, required = { "field", "query" },
            properties = { field = { type = "string", enum = names }, query = { type = "string" } } } },
        notes = shapes.keyed(names, { type = "string" }) } }
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

-- The structured scout's prompt: fields, earlier notes and the passages still visible to them.
-- passages default to every pool passage still visible to the fields.
function M.scout_input(run: any, fields: { any }, passages: { any }?): (string?, error?)
    local fields_text, err = scout_fields(run, fields)
    if err then return nil, err end
    return fields_text .. (#run.notes > 0 and ("\n\nEarlier notes:\n" .. table.concat(note_lines(run.notes), "\n")) or "") ..
        "\n\nEvidence:\n" .. render(passages or ordered(run.pool, shapes.paths(fields)))
end

local SCOUT_SYSTEM = system([[You review evidence gathered from one document before values are extracted.
Rate from 0 to 1 how confident you are that the passages contain every field's value. For each field, list the chunk numbers
whose passages state or help determine its value. List chunk numbers that serve no field as noise. Give every field an entry, empty
when no passage serves it. Propose focused search queries for fields whose evidence is missing or weak, and leave a short note per field
about where its value is or what to watch for (empty when there is nothing to note).
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
                end, { max_tokens = cfg.max_tokens, temperature = cfg.temperature, stage = "scout", fields = shapes.paths(fields) })
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
        -- The scout reviews the passages that fit the model's window, chosen per field.
        local paths = shapes.paths(fields)
        local fits, _, fit_err = ai.fitter(cfg.model, cfg.max_tokens)
        if fit_err then return fit_err end
        local function scout_fits(passages: { any }): boolean
            local text = M.scout_input(run, fields, passages)
            return (fits :: any)(SCOUT_SYSTEM, text or "", M.scout_schema(cfg, fields, passages))
        end
        if not scout_fits({}) then return ai.over_budget(cfg.model, "The scout prompt", "lower the number of fields or use a model with a larger window") end
        local visible = ordered(run.pool, paths)
        local pool = M.allocate(run.pool, visible, paths, scout_fits)
        local cut = excluded(visible, pool)
        step.cut = math.max(step.cut or 0, #cut)
        local scout_text, scout_err = M.scout_input(run, fields, pool)
        if scout_err then return scout_err end
        local result, err = ai.structured(step.meter, cfg.model, M.scout_schema(cfg, fields, pool), SCOUT_SYSTEM,
            scout_text :: string, { max_tokens = cfg.max_tokens, temperature = cfg.temperature, stage = "scout",
                sources = shapes.ordinals(pool), excluded = cut, fields = paths })
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
        local uncited = 0
        for _, f in ipairs(fields) do
            local path = shapes.path(f)
            if #result.evidence[path] == 0 then uncited = uncited + 1 end
            local note = trim(tostring(result.notes[path]))
            if cfg.share_notes and note ~= "" then run.notes[#run.notes + 1] = { field = path, text = note } end
        end
        step.uncited = uncited
        if rounds > cfg.max_rounds or run.confidence >= cfg.target_confidence or #result.queries == 0 then break end
        for i, q in ipairs(result.queries) do
            if i > cfg.max_extra_queries then break end
            -- The schema limits q.field to the scouted fields.
            local field = by_name[q.field]
            local region, region_err = M.region(run, field)
            if region_err then return region_err end
            local hits, search_err = doctools.search(ctx, run.config.retrieval.search_mode, q.query, field.chunks, region)
            if search_err then return search_err end
            add(run.pool, hits, q.field, q.query); queries_run[#queries_run + 1] = q.query
        end
    end
    step.queries = queries_run
    step.message = rounds .. (rounds == 1 and " round" or " rounds") .. " · confidence " .. math.floor(run.confidence * 100 + 0.5) .. "% · " .. run.pool.count .. " passages" ..
        ((step.uncited or 0) > 0 and (" · " .. step.uncited .. (step.uncited == 1 and " field" or " fields") .. " without cited evidence") or "") ..
        ((step.cut or 0) > 0 and (" · " .. step.cut .. " passages cut by budget") or "")
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
            field_lines({ f }) .. (f.search_hints ~= "" and ("\nHints: " .. f.search_hints) or ""),
            { temperature = cfg.query_temperature, stage = "queries", fields = { shapes.path(f) } })
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
    end
    -- Deep fields keep their own evidence visible to themselves.
    add(run.pool, found, shapes.path(f))
    -- Extraction that reads pages reads no analysis; the passages only choose its pages.
    if reads_pages(run) then return nil end
    -- The analysis reads the passages, in the order they were found, that fit the model's window.
    local analysis_system = system("You analyse passages of one document for a single field and explain what its value is, quoting the decisive wording and citing chunk numbers. Say plainly when the passages do not settle it.")
    local fixed = field_lines({ f }) .. "\n\nPassages:\n"
    local fits, _, fit_err = ai.fitter(cfg.model, cfg.max_tokens)
    if fit_err then return fit_err end
    local function read_fits(passages: { any }): boolean return (fits :: any)(analysis_system, fixed .. render(passages), nil) end
    if not read_fits({}) then return ai.over_budget(cfg.model, "The analysis prompt", "use a model with a larger window") end
    local read = {}
    for _, c in ipairs(found) do
        read[#read + 1] = c
        if not read_fits(read) then read[#read] = nil; break end
    end
    if #read < #found then step.cut = (step.cut or 0) + #found - #read end
    if cfg.read == "sections" then table.sort(read, function(a: any, b: any): boolean return a.ordinal < b.ordinal end) end
    local analysis, analysis_err = ai.generate(step.meter, cfg.model, analysis_system, fixed .. render(read),
        { temperature = cfg.analysis_temperature, stage = "analysis", sources = shapes.ordinals(read), excluded = excluded(found, read), fields = { shapes.path(f) } })
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
    step.message = #fields .. (#fields == 1 and " field" or " fields") .. " analysed · " .. run.pool.count .. " passages" .. (step.long_sections and " · long sections read as chunks" or "") ..
        ((step.cut or 0) > 0 and (" · " .. step.cut .. " passages cut by budget") or "")
    return nil
end

-- Highlighter: a small model keeps only the sentences each passage holds for
-- the fields, so extraction reads less and cites tighter quotes.
local HIGHLIGHT_EXCERPTS = 4

-- One required entry per passage, keyed by its chunk number; an empty list
-- says the passage holds nothing for the fields.
function M.highlight_schema(batch: { any }): any
    local keys = {}
    for _, c in ipairs(batch) do keys[#keys + 1] = tostring(c.ordinal) end
    return shapes.keyed(keys, { type = "array", maxItems = HIGHLIGHT_EXCERPTS, items = { type = "string" } })
end
local HIGHLIGHT_BATCH = 12

function M.highlight(run: any, step: any): error?
    local model = run.config.retrieval.highlighter_model
    local chunks = ordered(run.pool)
    local kept, before = 0, #chunks
    local highlight_system = system("For each passage, keyed by its chunk number without the C, copy word for word the sentences that state or help determine any field's value. Return an empty list for passages that do not.")
    local fixed = "Fields:\n" .. field_lines(run.config.fields) .. "\n\nPassages:\n"
    -- The reply copies excerpts of its passages, so the output reserve is the model's output limit.
    local fits, output, fit_err = ai.fitter(model, run.config.retrieval.highlighter_max_tokens)
    if fit_err then return fit_err end
    local function batch_fits(batch: { any }): boolean return (fits :: any)(highlight_system, fixed .. render(batch), M.highlight_schema(batch)) end
    for _, batch in ipairs(shapes.batches(chunks, batch_fits, HIGHLIGHT_BATCH)) do
        local result, err = ai.structured(step.meter, model, M.highlight_schema(batch), highlight_system, fixed .. render(batch),
            { stage = "highlight", sources = shapes.ordinals(batch), max_tokens = output })
        if err then return err end
        for _, c in ipairs(batch) do
            -- Only excerpts that occur in the passage replace it, each as its own paragraph.
            local source, genuine = shapes.normalize(c.content), {}
            for _, excerpt in ipairs(result[tostring(c.ordinal)]) do
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
-- codes name each cause of reason, for the run summary.
type Value = { name: string, path: string, value: any?, confidence: number, evidence: { Citation }, verified: boolean, missing: boolean,
    reason: string?, codes: { string }?, quotes_found: boolean? }

-- Extraction: structured calls over the evidence pool, each for fields that share a group and a region.
local EXTRACT_SYSTEM = system([[You extract field values from passages of one document. Use only what the passages state.
For each field say whether the passages state it (found), give the value (any placeholder of the right type when not found), your confidence from 0 to 1, and evidence:
the chunk number and an exact quote copied character for character from that chunk.]])

-- Extraction calls: fields grouped by their group, then by the region they read,
-- in at most "fields per call" per call. Every passage in a call lies in the
-- region its fields read and is still visible to at least one of them; a call gets its own fields' notes, and document-wide
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
    local calls = {}
    for _, key in ipairs(order) do
        local set = sets[key]
        for start = 1, #set.fields, limit do
            local batch = {}
            local names, notes = {}, {}
            for i = start, math.min(#set.fields, start + limit - 1) do
                batch[#batch + 1] = set.fields[i]; names[shapes.path(set.fields[i])] = true
            end
            local passages = {}
            for _, c in ipairs(ordered(run.pool, shapes.paths(batch))) do
                local allowed, err = visible(run, set.fields[1], c.ordinal)
                if err then return nil, err end
                if allowed then passages[#passages + 1] = c end
            end
            for _, n in ipairs(run.notes) do
                if (n.field and names[n.field]) or (not n.field and set.whole) then notes[#notes + 1] = n end
            end
            calls[#calls + 1] = { fields = batch, passages = passages, notes = note_lines(notes) }
        end
    end
    return calls
end

-- Records on a value why part of what its field could read did not reach extraction.
local function coverage_loss(entry: any, code: string, text: string)
    entry.reason = entry.reason and (entry.reason .. "; " .. text) or text
    entry.codes = entry.codes or {}
    entry.codes[#entry.codes + 1] = code
end

-- One extraction call: prompt, model reply and a value per field.
-- Records on a value that some passages its field could read were cut by the budget.
local function budget_loss(entry: any, cut: integer?, total: integer?)
    if not cut or cut == 0 then return end
    coverage_loss(entry, "budget_cut", cut .. " of " .. tostring(total) .. " passages cut by budget")
end

-- The llm module refuses a prompt larger than the model's window before
-- calling it; the error then names the settings that shrink the prompt.
local function refused_prompt(err: error, advice: string): error
    if errors.is(err, errors.INVALID) and ((err :: any):details() or {}).error_type == "context_window" then
        return errors.new({ kind = errors.INVALID, details = (err :: any):details(), message = tostring(err) .. "; " .. advice })
    end
    return err
end

local function extract_call(run: any, step: any, cfg: any, call: any): error?
    local batch, candidates, notes = call.fields, call.passages, call.notes
    local paths = shapes.paths(batch)
    local context = {}
    for _, f in ipairs(batch) do if run.analyses[shapes.path(f)] then context[#context + 1] = "Analysis of " .. shapes.path(f) .. ":\n" .. run.analyses[shapes.path(f)] end end
    local fixed = "Fields:\n" .. field_lines(batch) ..
        (#notes > 0 and ("\n\nScout notes:\n" .. table.concat(notes, "\n")) or "") ..
        (#context > 0 and ("\n\n" .. table.concat(context, "\n\n")) or "") ..
        "\n\nPassages:\n"
    -- Each field gets its share of the passages that fit the model's window.
    local fits, _, fit_err = ai.fitter(cfg.model, cfg.max_output_tokens)
    if fit_err then return fit_err end
    local function call_fits(passages: { any }): boolean
        return (fits :: any)(EXTRACT_SYSTEM, fixed .. render(passages), shapes.group_schema(batch, passages))
    end
    if not call_fits({}) then
        return ai.over_budget(cfg.model, "The extraction prompt without passages", "lower fields per call, scout notes or Deep analysis length")
    end
    local passages, cut = M.allocate(run.pool, candidates, paths, call_fits)
    local totals = {}
    for _, path in ipairs(paths) do
        local n = 0
        for _, c in ipairs(candidates) do
            local p = run.pool.provenance[c.ordinal]
            if not p or not p.excluded[path] then n = n + 1 end
        end
        totals[path] = n
    end
    if #passages == 0 then
        for _, f in ipairs(batch) do
            local path = shapes.path(f)
            local entry = { name = f.name, path = path, confidence = 0, evidence = {}, verified = false, missing = true, failed = false }
            budget_loss(entry, cut[path], totals[path])
            run.values[#run.values + 1] = entry
        end
        return nil
    end
    local user = fixed .. render(passages)
    local result, err = ai.structured(step.meter, cfg.model, shapes.group_schema(batch, passages), EXTRACT_SYSTEM, user,
        { max_tokens = cfg.max_output_tokens, temperature = cfg.temperature, stage = "extract", sources = shapes.ordinals(passages),
            excluded = excluded(candidates, passages), fields = paths })
    if err then return refused_prompt(err, "lower passages per field, Deep chunk cap or fields per call") end
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
            if f.evidence_required and #cited == 0 then entry.reason, entry.codes = "No quote supports this value", { "no_quote" } end
        end
        budget_loss(entry, cut[entry.path], totals[entry.path])
        entries[#entries + 1] = entry
    end
    for _, entry in ipairs(entries) do run.values[#run.values + 1] = entry end
    return nil
end

-- Extraction that reads pages: each call reads page images and no document
-- text. Text stages decide which pages a call reads, never what it reads.
local PAGES_EXTRACT_SYSTEM = system([[You extract field values from the page images of one document. Use only what the pages show.
For each field say whether the pages state it (found), give the value (any placeholder of the right type when not found), your confidence from 0 to 1, and evidence:
the page number given in the label before its image, and a quote that transcribes, character for character, the printed words stating the value on that page.]])

-- The pages a field may read: those holding a chunk of its region, or every
-- page of the document when it reads the whole document.
local function eligible_pages(run: any, field: any): ({ integer }?, error?)
    local region, err = M.region(run, field)
    if err then return nil, err end
    if not region then
        local all = {}
        for n = 1, run.page_images.count do all[n] = n end
        return all, nil
    end
    local by_ordinal, chunks_err = document_chunks(run)
    if chunks_err then return nil, chunks_err end
    local chunks = {}
    for _, n in ipairs(region) do if (by_ordinal :: any)[n] then chunks[#chunks + 1] = (by_ordinal :: any)[n] end end
    return pages_of(run, chunks), nil
end

-- The pages one extraction call reads, all of the same region. When its
-- fields' eligible pages with an image fit the page budget, the call reads
-- them all, passages or not. Otherwise each field ranks the passages visible
-- to it (cited, then found by its own searches, then by search rank) and
-- fields take passages in turns while their pages fit the budget.
-- Returns { pages, excluded, unavailable[path], cut[path] }: the pages sent,
-- the eligible pages with an image left out, per field the pages it needed
-- that have no image, and per field the count of its own pages when the
-- budget left out every one of them.
function M.call_pages(run: any, call: any, max_pages: integer): (any?, error?)
    local by_page = run.page_images.by_page
    local eligible, err = eligible_pages(run, call.fields[1])
    if err then return nil, err end
    local available, missing = {}, {}
    for _, n in ipairs(eligible :: { integer }) do
        if by_page[n] then available[#available + 1] = n else missing[#missing + 1] = n end
    end
    local paths = shapes.paths(call.fields)
    local out = { pages = {}, excluded = {}, unavailable = {}, cut = {} }
    if #available <= max_pages then
        out.pages = available
        for _, path in ipairs(paths) do out.unavailable[path] = missing end
        return out, nil
    end
    local function imaged(c: any): { integer }
        local list = {}
        for _, n in ipairs(pages_of(run, { c })) do if by_page[n] then list[#list + 1] = n end end
        return list
    end
    local function page_set(passages: { any }): ({ [integer]: boolean }, integer)
        local set, count = {}, 0
        for _, c in ipairs(passages) do
            for _, n in ipairs(imaged(c)) do if not set[n] then set[n] = true; count = count + 1 end end
        end
        return set, count
    end
    local candidates = {}
    for _, c in ipairs(call.passages) do if #imaged(c) > 0 then candidates[#candidates + 1] = c end end
    local kept = M.allocate(run.pool, candidates, paths, function(passages: { any }): boolean
        local _, count = page_set(passages)
        return count <= max_pages
    end)
    local sent = page_set(kept)
    for _, n in ipairs(available) do
        if sent[n] then out.pages[#out.pages + 1] = n else out.excluded[#out.excluded + 1] = n end
    end
    for _, path in ipairs(paths) do
        local own = {}
        for _, c in ipairs(call.passages) do
            local p = run.pool.provenance[c.ordinal]
            if p and not p.excluded[path] and (p.cited[path] or p.fields[path]) then
                for _, n in ipairs(pages_of(run, { c })) do own[n] = true end
            end
        end
        local gone, imaged_count, reached = {}, 0, 0
        for n in pairs(own) do
            if not by_page[n] then gone[#gone + 1] = n
            else
                imaged_count = imaged_count + 1
                if sent[n] then reached = reached + 1 end
            end
        end
        table.sort(gone)
        out.unavailable[path] = gone
        if imaged_count > 0 and reached == 0 then out.cut[path] = imaged_count end
    end
    return out, nil
end

-- Records on a value the pages its field needed that extraction could not
-- read: pages without an image make a missing value uncertain, and a field
-- none of whose own pages fit the page budget was not read at all.
local function page_loss(entry: any, selection: any, max_pages: integer)
    local gone = selection.unavailable[entry.path]
    if entry.missing and gone and #gone > 0 then
        coverage_loss(entry, "page_image_unavailable", pages.phrase(gone) .. (#gone == 1 and " has" or " have") .. " no page image")
    end
    local cut = selection.cut[entry.path]
    if cut then coverage_loss(entry, "page_budget_cut", "pages exceed the page budget: none of its " .. cut .. " pages fit in " .. max_pages) end
end

-- The heading path of the first chunk on each page.
local function page_sections(run: any): ({ [integer]: string }?, error?)
    if run.page_sections then return run.page_sections, nil end
    local by_ordinal, err = document_chunks(run)
    if err then return nil, err end
    local out, ordinals = {}, {}
    for n in pairs(by_ordinal :: any) do ordinals[#ordinals + 1] = n end
    table.sort(ordinals)
    for _, n in ipairs(ordinals) do
        local c = (by_ordinal :: any)[n]
        for _, page in ipairs(pages_of(run, { c })) do if not out[page] then out[page] = c.heading_path end end
    end
    run.page_sections = out
    return out, nil
end

-- Content parts for pages: each page's label, then its image, in page order.
local function page_parts(run: any, numbers: { integer }): ({ any }?, error?)
    local parts = {}
    for _, n in ipairs(numbers) do
        local bytes, mime, err = pages.image(run.page_images, n)
        if err then return nil, err end
        parts[#parts + 1] = ai.text_part("[Page " .. n .. "]")
        parts[#parts + 1] = ai.image_part(mime :: string, bytes :: string)
    end
    return parts, nil
end

-- One extraction call over page images. Returns whether a model call was made.
local function extract_pages_call(run: any, step: any, cfg: any, call: any): (boolean, error?)
    local batch = call.fields
    local selection, select_err = M.call_pages(run, call, cfg.max_pages)
    if select_err then return false, select_err end
    local function entry_for(f: any): Value
        return { name = f.name, path = shapes.path(f), confidence = 0, evidence = {}, verified = false, missing = true, failed = false }
    end
    if #selection.pages == 0 then
        for _, f in ipairs(batch) do
            local entry = entry_for(f)
            page_loss(entry, selection, cfg.max_pages)
            if not entry.codes then
                entry.reason = f.search_within == "sections" and "No page from its sections reached extraction" or "No page reached extraction"
                entry.codes = { "no_passage" }
            end
            run.values[#run.values + 1] = entry
        end
        return false, nil
    end
    local fields_text = "Fields:\n" .. field_lines(batch)
    local schema = shapes.page_group_schema(batch, selection.pages)
    local fits, _, fit_err = ai.fitter(cfg.model, cfg.max_output_tokens)
    if fit_err then return false, fit_err end
    if not (fits :: any)(PAGES_EXTRACT_SYSTEM, fields_text, schema) then
        return false, ai.over_budget(cfg.model, "The extraction prompt", "lower fields per call")
    end
    local sections, sections_err = page_sections(run)
    if sections_err then return false, sections_err end
    local parts, parts_err = page_parts(run, selection.pages)
    if parts_err then return false, parts_err end
    (parts :: { any })[#parts + 1] = ai.text_part(fields_text)
    local result, err = ai.structured(step.meter, cfg.model, schema, PAGES_EXTRACT_SYSTEM, parts :: { any },
        { max_tokens = cfg.max_output_tokens, temperature = cfg.temperature, stage = "extract", pages = selection.pages,
            excluded_pages = #selection.excluded > 0 and selection.excluded or nil, fields = shapes.paths(batch) })
    if err then return true, refused_prompt(err, "lower page images per call or fields per call") end
    for _, f in ipairs(batch) do
        local item = shapes.get(result, shapes.path(f))
        local entry = entry_for(f)
        if item.found then
            entry.value, entry.confidence, entry.missing = item.value, item.confidence, false
            for _, e in ipairs(item.evidence) do
                local page = math.tointeger(e.page)
                entry.evidence[#entry.evidence + 1] = { quote = e.quote, page = page, section = page and (sections :: any)[page] or "", chunk_id = "" }
            end
            if f.evidence_required and #entry.evidence == 0 then entry.reason, entry.codes = "No quote supports this value", { "no_quote" } end
        end
        page_loss(entry, selection, cfg.max_pages)
        run.values[#run.values + 1] = entry
    end
    return true, nil
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
    local by_pages = reads_pages(run)
    for _, call in ipairs(extraction_calls) do
        if by_pages then
            -- A call that reads pages reads them with or without passages.
            local called, err = extract_pages_call(run, step, cfg, call)
            if err then
                failure = failure or err
                for _, f in ipairs(call.fields) do failed_field(run, f, err) end
            elseif called then successes = successes + 1 end
            if called then calls = calls + 1 end
        elseif #call.passages == 0 then
            -- Empty passage sets produce missing fields.
            for _, f in ipairs(call.fields) do
                run.values[#run.values + 1] = { name = f.name, path = shapes.path(f), confidence = 0, evidence = {}, verified = false, missing = true, failed = false,
                    reason = f.search_within == "sections" and "No passage from its sections reached extraction" or "No passage reached extraction",
                    codes = { "no_passage" } }
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

-- Verify: only a found value can be verified. Its quotes must appear in the
-- document, and a model may also judge whether the cited text states the
-- value for its field and, for text and lists, whether the value is complete.

-- Verdicts a support reply gives. A constrained decoder only admits these
-- strings, so the prompt names each one with its meaning.
local VERDICT = { supported = "supported", not_supported = "not_supported", insufficient = "insufficient_evidence" }
local COMPLETENESS = { complete = "complete", incomplete = "incomplete", insufficient = "insufficient_evidence" }

function M.support_system(): string
    return system("For each field, decide whether its cited text states this value for this field, as the field's description defines it.\n" ..
        "Reformatting (dates, numbers, case, spacing) is allowed; a quote that states a different value or another role's value does not support it.\n" ..
        "Give the verdict \"" .. VERDICT.supported .. "\" when the cited text states the value, \"" .. VERDICT.not_supported ..
        "\" when it states a different value or none, and \"" .. VERDICT.insufficient .. "\" when it cannot settle it.\n" ..
        "For fields that also ask for completeness, judge from the source text whether the value is complete as printed: \"" .. COMPLETENESS.complete ..
        "\", \"" .. COMPLETENESS.incomplete .. "\" when it leaves part out, or \"" .. COMPLETENESS.insufficient .. "\".\nReturn one check per field.")
end

-- Field types whose value can be cut short, so the support check also judges completeness.
local function completes(f: any): boolean return f.type == "text" or f.type == "list" end

-- The support check's reply: one required verdict per field path, so a
-- constrained decoder cannot omit or repeat a field; text and list fields
-- also get a completeness verdict.
function M.support_schema(values: { any }, fields: { [string]: any }): any
    local properties, required = shapes.object(), {}
    for _, v in ipairs(values) do
        local path = shapes.path(v)
        required[#required + 1] = path
        local item = { type = "object", additionalProperties = false, required = { "verdict", "reason" }, properties = {
            verdict = { type = "string", enum = { VERDICT.supported, VERDICT.not_supported, VERDICT.insufficient } }, reason = { type = "string" } } }
        if completes(fields[path]) then
            item.required = { "verdict", "complete", "reason" }
            item.properties.complete = { type = "string", enum = { COMPLETENESS.complete, COMPLETENESS.incomplete, COMPLETENESS.insufficient } }
        end
        properties[path] = item
    end
    return { type = "object", additionalProperties = false, required = required, properties = properties }
end

-- One value as the support check reads it: the field's path, type and
-- description, the value, its quotes (with their cited pages when
-- cited_pages) and, when given, the source text around them.
function M.support_line(f: any, v: any, source: string?, cited_pages: boolean?): string
    local quotes = {}
    for _, e in ipairs(v.evidence) do
        quotes[#quotes + 1] = "\"" .. e.quote .. "\"" .. ((cited_pages and e.page) and (" (page " .. e.page .. ")") or "")
    end
    local t = f.type == "list" and ("list of " .. f.item.type) or f.type
    return "- " .. shapes.path(v) .. " (" .. t .. "): " .. (f.description ~= "" and f.description or "no description") ..
        "\n  value: " .. json.encode(v.value) .. "\n  quotes: " .. table.concat(quotes, " | ") ..
        (source and ("\n  source:\n  " .. source) or "")
end

-- The source text around a value's citations, for judging completeness: the
-- whole section of each cited chunk when it fits the section budget, else the
-- cited chunk and the one after it.
local function source_region(run: any, v: any, by_ordinal: { [integer]: any }): string
    local ordinals, seen = {}, {}
    local function take(n: integer) if by_ordinal[n] and not seen[n] then seen[n] = true; ordinals[#ordinals + 1] = n end end
    local budget = run.config.retrieval and run.config.retrieval.section_budget or 0
    for _, e in ipairs(v.evidence) do
        local n = math.tointeger(e.chunk)
        if n then
            local section = nil
            for _, s in ipairs(run.document.outline or {}) do
                if s.chunk_start and n >= s.chunk_start and n <= s.chunk_end then section = s end
            end
            if section and (section.tokens or 0) <= budget then
                for k = section.chunk_start, section.chunk_end do take(k) end
            else
                take(n); take(n + 1)
            end
        end
    end
    table.sort(ordinals)
    local texts = {}
    for _, n in ipairs(ordinals) do texts[#texts + 1] = by_ordinal[n].content end
    return table.concat(texts, "\n")
end

-- Chunks of an ordinal map in document order.
local function store_order(by_ordinal: { [integer]: any }): { any }
    local out = {}
    for _, c in pairs(by_ordinal) do out[#out + 1] = c end
    table.sort(out, function(a: any, b: any): boolean return a.ordinal < b.ordinal end)
    return out
end

-- Verification of values read from pages. The visual support check gates
-- verified: the verifier sees each value's cited pages (and the following
-- page for text and list values) with the field, value, quotes and pages.
-- Text agreement compares each quote with the processed text of its page; it
-- is recorded on the evidence and never gates verified.
local PAGE_CHECK = { yes = "yes", no = "no", unreadable = "unreadable" }

function M.page_support_system(): string
    return system("You check values read from the page images of one document. For each field, look at the pages its quotes cite.\n" ..
        "quote_on_page: \"" .. PAGE_CHECK.yes .. "\" when the quote's words are printed on its cited page, \"" .. PAGE_CHECK.no ..
        "\" when they are not, \"" .. PAGE_CHECK.unreadable .. "\" when that part of the page cannot be read.\n" ..
        "states_value: \"" .. PAGE_CHECK.yes .. "\" when the printed words state this value for this field, as the field's description defines it; \"" ..
        PAGE_CHECK.no .. "\" when they state a different value, another role's value or none; \"" .. PAGE_CHECK.unreadable .. "\" when the page cannot settle it.\n" ..
        "Reformatting (dates, numbers, case, spacing) is allowed.\n" ..
        "For fields that also ask for completeness, judge from the pages, reading on into the following page when it is shown, whether the value is complete as printed: \"" ..
        COMPLETENESS.complete .. "\", \"" .. COMPLETENESS.incomplete .. "\" when it leaves part out, or \"" .. COMPLETENESS.insufficient .. "\".\nReturn one check per field.")
end

-- The visual support check's reply: one required check per field path.
function M.page_support_schema(values: { any }, fields: { [string]: any }): any
    local properties, required = shapes.object(), {}
    local answer = { type = "string", enum = { PAGE_CHECK.yes, PAGE_CHECK.no, PAGE_CHECK.unreadable } }
    for _, v in ipairs(values) do
        local path = shapes.path(v)
        required[#required + 1] = path
        local item = { type = "object", additionalProperties = false, required = { "quote_on_page", "states_value", "reason" },
            properties = { quote_on_page = answer, states_value = answer, reason = { type = "string" } } }
        if completes(fields[path]) then
            item.required = { "quote_on_page", "states_value", "complete", "reason" }
            item.properties.complete = { type = "string", enum = { COMPLETENESS.complete, COMPLETENESS.incomplete, COMPLETENESS.insufficient } }
        end
        properties[path] = item
    end
    return { type = "object", additionalProperties = false, required = required, properties = properties }
end

-- A visual check as a support verdict: verified needs the quote on its page
-- and the quote stating the value.
function M.page_verdict(check: any): any
    local out: any = { complete = check.complete }
    if check.quote_on_page == PAGE_CHECK.unreadable or check.states_value == PAGE_CHECK.unreadable then
        out.verdict, out.code, out.reason = "unreadable", "support_unreadable", "The page cannot be read for this value: " .. tostring(check.reason)
    elseif check.quote_on_page ~= PAGE_CHECK.yes then
        out.verdict, out.code, out.reason = "quote_not_on_page", "quote_not_on_page", "The quote is not on its cited page: " .. tostring(check.reason)
    elseif check.states_value ~= PAGE_CHECK.yes then
        out.verdict, out.reason = VERDICT.not_supported, check.reason
    else
        out.verdict, out.reason = VERDICT.supported, check.reason
    end
    return out
end

-- Normalized processed text per page.
local function page_texts(run: any, by_ordinal: { [integer]: any }): { [integer]: string }
    local parts: { [integer]: { string } } = {}
    local function put(page: integer?, text: string)
        if not page then return end
        parts[page] = parts[page] or {}
        parts[page][#parts[page] + 1] = text
    end
    for _, c in ipairs(store_order(by_ordinal)) do
        if c.page_spans and #c.page_spans > 0 then
            for _, span in ipairs(c.page_spans) do put(span.page or (run.page_images.count == 1 and 1 or nil), span.text) end
        else
            local on = pages_of(run, { c })
            if #on == 1 then put(on[1], c.content) end
        end
    end
    local out = {}
    for page, texts in pairs(parts) do out[page] = shapes.normalize(table.concat(texts, "\n")) end
    return out
end

-- Records whether each quote agrees with the processed text of its page.
local function text_agreement(run: any): error?
    local by_ordinal, err = document_chunks(run)
    if err then return err end
    local texts = page_texts(run, by_ordinal :: any)
    for _, v in ipairs(run.values) do
        for _, e in ipairs(v.evidence) do
            local text = e.page and texts[e.page] or nil
            if not text or text == "" then e.text_agreement = "no_text"
            else
                local q = shapes.normalize(e.quote)
                e.text_agreement = (q ~= "" and text:find(q, 1, true)) and "agrees" or "differs"
            end
        end
    end
    return nil
end

-- The pages a value's check reads: its cited pages, then for text and list
-- values the page after each that has an image, within max_pages. Nil when its
-- cited pages alone exceed max_pages.
local function check_pages(run: any, f: any, v: any, max_pages: integer): { integer }?
    local seen, cited, extra = {}, {}, {}
    for _, e in ipairs(v.evidence) do
        if e.page and not seen[e.page] then seen[e.page] = true; cited[#cited + 1] = e.page end
    end
    if #cited > max_pages then return nil end
    if completes(f) then
        for _, n in ipairs(cited) do
            local next_page = n + 1
            if not seen[next_page] and run.page_images.by_page[next_page] then seen[next_page] = true; extra[#extra + 1] = next_page end
        end
    end
    table.sort(extra)
    for _, n in ipairs(extra) do if #cited < max_pages then cited[#cited + 1] = n end end
    table.sort(cited)
    return cited
end

-- The visual support check, batched so each call carries at most max_pages
-- page images and fits the model's window. Fills support by field path.
local function page_support(run: any, step: any, cfg: any, fields: { [string]: any }, support: { [string]: any }): error?
    local max_pages = run.config.stages.extract.max_pages
    local found, line, needs = {}, {}, {}
    for _, v in ipairs(run.values) do
        if not v.missing and not v.failed and #v.evidence > 0 then
            local path = shapes.path(v)
            local f = fields[path]
            local numbers = check_pages(run, f, v, max_pages)
            if not numbers then
                support[path] = { verdict = "not_checked", code = "page_budget_cut", reason = "The cited pages exceed the page budget of " .. max_pages }
            else
                found[#found + 1] = v
                needs[path] = numbers
                line[path] = M.support_line(f, v, nil, true)
            end
        end
    end
    local support_system = M.page_support_system()
    local fits, _, fit_err = ai.fitter(cfg.model, cfg.max_tokens)
    if fit_err then return fit_err end
    local function batch_pages(batch: { any }): { integer }
        local set, out = {}, {}
        for _, v in ipairs(batch) do
            for _, n in ipairs(needs[shapes.path(v)]) do if not set[n] then set[n] = true; out[#out + 1] = n end end
        end
        table.sort(out)
        return out
    end
    local function text(batch: { any }): string
        local lines_out = {}
        for _, v in ipairs(batch) do lines_out[#lines_out + 1] = line[shapes.path(v)] end
        return "Fields:\n" .. table.concat(lines_out, "\n")
    end
    local function batch_fits(batch: { any }): boolean
        return #batch_pages(batch) <= max_pages and (fits :: any)(support_system, text(batch), M.page_support_schema(batch, fields))
    end
    for _, batch in ipairs(shapes.batches(found, batch_fits)) do
        if #batch == 1 and not batch_fits(batch) then
            support[shapes.path(batch[1])] = { verdict = "not_checked", code = "budget_cut", reason = "The support check input exceeds the model's window" }
        else
            local numbers = batch_pages(batch)
            local parts, parts_err = page_parts(run, numbers)
            if parts_err then return parts_err end
            (parts :: { any })[#parts + 1] = ai.text_part(text(batch))
            local result, err = ai.structured(step.meter, cfg.model, M.page_support_schema(batch, fields), support_system, parts :: { any },
                { temperature = cfg.temperature, max_tokens = cfg.max_tokens, stage = "support", fields = shapes.paths(batch), pages = numbers })
            if err then return err end
            for _, v in ipairs(batch) do support[shapes.path(v)] = M.page_verdict(result[shapes.path(v)]) end
        end
    end
    return nil
end

-- Verification of values read from text: quotes must appear in the
-- document, and the support check judges the cited text. Fills support by field path.
local function text_checks(run: any, step: any, cfg: any, fields: { [string]: any }, support: { [string]: any }): error?
    -- Chunks are read for quote checks and for the source region of text and list values.
    local needs_source = false
    if cfg.check_support then
        for _, v in ipairs(run.values) do
            if not v.missing and not v.failed and #v.evidence > 0 and completes(fields[shapes.path(v)]) then needs_source = true end
        end
    end
    local by_ordinal = {}
    if cfg.check_quotes or needs_source then
        local chunks, err = store.all_chunks(run.document.id)
        if err then return err end
        for _, c in ipairs(chunks) do by_ordinal[c.ordinal] = c end
    end
    if cfg.check_quotes then
        local bodies, order = {}, {}
        for _, c in ipairs(store_order(by_ordinal)) do
            bodies[c.ordinal] = shapes.normalize(c.content); order[#order + 1] = c.ordinal
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
    if cfg.check_support then
        local found, line = {}, {}
        for _, v in ipairs(run.values) do
            if not v.missing and not v.failed and #v.evidence > 0 then
                found[#found + 1] = v
                local f = fields[shapes.path(v)]
                line[shapes.path(v)] = M.support_line(f, v, completes(f) and source_region(run, v, by_ordinal) or nil)
            end
        end
        -- Values are checked in batches that fit the model's window; a value too large alone gets no check.
        local support_system = M.support_system()
        local fits, _, fit_err = ai.fitter(cfg.model, cfg.max_tokens)
        if fit_err then return fit_err end
        local function text(v: any): string return line[shapes.path(v)] end
        local function batch_fits(batch: { any }): boolean
            local lines_out = {}
            for _, v in ipairs(batch) do lines_out[#lines_out + 1] = text(v) end
            return (fits :: any)(support_system, table.concat(lines_out, "\n"), M.support_schema(batch, fields))
        end
        for _, batch in ipairs(shapes.batches(found, batch_fits)) do
            if #batch == 1 and not batch_fits(batch) then
                support[shapes.path(batch[1])] = { verdict = "not_checked", code = "budget_cut", reason = "The support check input exceeds the model's window" }
            else
                local lines_out = {}
                for _, v in ipairs(batch) do lines_out[#lines_out + 1] = text(v) end
                local result, err = ai.structured(step.meter, cfg.model, M.support_schema(batch, fields), support_system,
                    table.concat(lines_out, "\n"), { temperature = cfg.temperature, max_tokens = cfg.max_tokens, stage = "support", fields = shapes.paths(batch) })
                if err then return err end
                for _, v in ipairs(batch) do support[shapes.path(v)] = result[shapes.path(v)] end
            end
        end
    end
    return nil
end

function M.verify(run: any, step: any): error?
    local cfg = run.config.stages.verify
    local fields = {}
    for _, f in ipairs(run.config.fields) do fields[shapes.path(f)] = f end
    local by_pages = reads_pages(run)
    local support = {}
    if by_pages then
        if cfg.check_quotes then
            local err = text_agreement(run)
            if err then return err end
        end
        if cfg.check_support then
            local err = page_support(run, step, cfg, fields, support)
            if err then return err end
        end
    else
        local err = text_checks(run, step, cfg, fields, support)
        if err then return err end
    end
    local failed, missing = 0, 0
    for _, v in ipairs(run.values) do
        local reasons, codes = {}, {}
        local function reject(code: string, reason: string) reasons[#reasons + 1] = reason; codes[#codes + 1] = code end
        local function has(code: string): boolean
            for _, c in ipairs(codes) do if c == code then return true end end
            return false
        end
        if v.reason then reasons[#reasons + 1] = v.reason end
        for _, code in ipairs(v.codes or {}) do codes[#codes + 1] = code end
        local found = not v.missing and not v.failed
        if found then
            local valid, shape_err = json.validate(shapes.value_schema(fields[shapes.path(v)]), v.value)
            if not valid then reject("shape_mismatch", "Value does not match its declared shape: " .. tostring(shape_err)) end
            if #v.evidence == 0 and not has("no_quote") then reject("no_quote", "No quote supports this value") end
        end
        -- Read from pages, a value is verified only by the visual support check.
        if by_pages and found and not cfg.check_support then reject("unchecked", "No visual support check ran") end
        if cfg.check_quotes and not by_pages and found and not v.quotes_found then reject("quote_not_found", "A quote is not in the document") end
        if cfg.check_support and found and #v.evidence > 0 then
            local check = support[shapes.path(v)]
            if not check then reject("support_no_verdict", "The support check gave no verdict")
            elseif check.verdict == VERDICT.not_supported then reject("support_rejected", check.reason)
            elseif check.verdict == VERDICT.insufficient then reject("support_insufficient", "The cited text cannot settle the value: " .. check.reason)
            elseif check.verdict ~= VERDICT.supported then reject(check.code or "support_no_verdict", check.reason) end
            if check and check.complete then
                v.complete = check.complete == COMPLETENESS.complete
                if check.complete == COMPLETENESS.incomplete then reject("incomplete", "The value leaves out part of the source: " .. check.reason)
                elseif check.complete == COMPLETENESS.insufficient then reject("support_insufficient", "The source cannot settle whether the value is complete: " .. check.reason) end
            end
        end
        if v.missing and #codes == 0 then codes[1] = "missing" end
        v.verified = found and #reasons == 0
        v.reason = #reasons > 0 and table.concat(reasons, "; ") or nil
        v.codes = codes
        if found and not v.verified then failed = failed + 1 end
        if v.missing then missing = missing + 1 end
    end
    local review = failed == 0 and "All found values check out" or (failed .. (failed == 1 and " value needs" or " values need") .. " review")
    step.message = review .. (missing > 0 and (" · " .. missing .. " missing") or "")
    return nil
end

return M
