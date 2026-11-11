-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- The extraction stages. Each takes the run context and its step record and
-- returns what the next stages need. Evidence is a pool of chunks keyed by
-- ordinal; the model sees chunks as [C<ordinal>].
local json = require("json")
local canonical_json = require("canonical_json")
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

-- Budget reductions are informational. They never add a rejection reason.
local function budget_cut(run: any, fields: { any })
    run.budget_dropped = run.budget_dropped or {}
    for _, f in ipairs(fields) do run.budget_dropped[shapes.path(f)] = true end
end

local function budget_failure(model: string, fits: any, system_text: string, user: string, schema: any?): error
    local _, estimated, available = fits(system_text, user, schema)
    return ai.budget_error(model, estimated, available)
end

-- Field citations, own searches, best retrieval rank, then document position.
-- Fields take passages in turns; a rejected passage never closes a queue.
function M.allocate(pool: any, passages: { any }, fields: { string }, fits: ({ any }) -> boolean): ({ any }, { [string]: integer })
    local kept, queues, lost = {}, {}, {}
    local function ordered_kept(extra: any?): { any }
        local out = {}
        for _, c in ipairs(passages) do if kept[c.ordinal] or c == extra then out[#out + 1] = c end end
        return out
    end
    if fits(passages) then return passages, lost end
    for i, path in ipairs(fields) do
        local list = {}
        for _, c in ipairs(passages) do
            if not pool.provenance[c.ordinal].excluded[path] then list[#list + 1] = c end
        end
        table.sort(list, function(a: any, b: any): boolean
            local pa, pb = pool.provenance[a.ordinal], pool.provenance[b.ordinal]
            if not not pa.cited[path] ~= not not pb.cited[path] then return pa.cited[path] == true end
            if not not pa.fields[path] ~= not not pb.fields[path] then return pa.fields[path] == true end
            if (pa.rank or math.huge) ~= (pb.rank or math.huge) then return (pa.rank or math.huge) < (pb.rank or math.huge) end
            return a.ordinal < b.ordinal
        end)
        queues[i] = { list = list, at = 1 }
    end
    local remaining = true
    while remaining do
        remaining = false
        for _, q in ipairs(queues) do
            while q.at <= #q.list do
                local c = q.list[q.at]
                q.at = q.at + 1
                if not kept[c.ordinal] and fits(ordered_kept(c)) then kept[c.ordinal] = true; remaining = true; break end
            end
        end
    end
    for i, path in ipairs(fields) do
        for _, c in ipairs(queues[i].list) do if not kept[c.ordinal] then lost[path] = (lost[path] or 0) + 1 end end
    end
    return ordered_kept(nil), lost
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
-- Version of the outlining prompt, schema and previews; a change to any of
-- them increments it, so outlines built before are built again.
local OUTLINE_PROMPT_VERSION = 1

-- Consecutive windows of chunk previews, each with its first and last ordinal.
function M.outline_windows(chunks: { any }, size: integer): { any }
    local windows = {}
    for start = 1, #chunks, size do
        local lines, sources = {}, {}
        local last = math.min(#chunks, start + size - 1)
        for i = start, last do
            local c = chunks[i]
            sources[#sources + 1] = c.ordinal
            lines[#lines + 1] = "[C" .. c.ordinal .. "] " .. c.content:sub(1, PREVIEW_CHARS):gsub("\n", " ")
        end
        windows[#windows + 1] = { first = chunks[start].ordinal, last = chunks[last].ordinal, sources = sources, preview = table.concat(lines, "\n") }
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

-- Sections the map model finds in a processed document, window by window.
local function build_outline(run: any, step: any, cfg: any, sampling: (string, { string }?, { integer }?) -> any): ({ any }?, error?)
    local chunks, err = store.all_chunks(run.document.id)
    if err then return nil, err end
    -- One section per start chunk, in order; chunks before the first start form their own section.
    local by_start, previous = {}, nil
    local outline_system = system("You divide a document into its logical sections. Give each section a short title and the chunk number where it starts, in order.")
    local fits, _, fit_err = ai.fitter(cfg.model, cfg.max_tokens)
    if fit_err then return nil, fit_err end
    local remaining = chunks
    while #remaining > 0 do
        local function request(batch: { any }): (any, string)
            local w = M.outline_windows(batch, #batch)[1]
            local carried = previous and ("The passages continue the section \"" .. previous .. "\" unless a new section starts at chunk " .. w.first .. ".\n\n") or ""
            return w, carried .. w.preview
        end
        local batches, rejected = shapes.batches(remaining, function(batch: { any }): boolean
            local w, body = request(batch)
            return fits(outline_system, body, outline_schema(w.first, w.last))
        end, OUTLINE_WINDOW)
        if #batches == 0 then
            local w, body = request({ remaining[1] })
            return nil, budget_failure(cfg.model, fits, outline_system, body, outline_schema(w.first, w.last))
        end
        local batch = batches[1]
        local w, body = request(batch)
        local built, build_err = ai.structured(step.meter, cfg.model, outline_schema(w.first, w.last), outline_system,
            body, sampling("outline", shapes.paths(run.config.fields), w.sources))
        if build_err then return nil, build_err end
        for _, section in ipairs(built.sections) do
            local first = math.tointeger(section.first_chunk) :: integer
            if not by_start[first] then by_start[first] = trim(section.title) end
        end
        for n = w.last, w.first, -1 do if by_start[n] then previous = by_start[n]; break end end
        local consumed, next_chunks = {}, {}
        for _, chunk in ipairs(batch) do consumed[chunk.ordinal] = true end
        for _, chunk in ipairs(rejected) do consumed[chunk.ordinal] = true end
        if #rejected > 0 then budget_cut(run, run.config.fields) end
        for _, chunk in ipairs(remaining) do if not consumed[chunk.ordinal] then next_chunks[#next_chunks + 1] = chunk end end
        remaining = next_chunks
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
    return sections, nil
end

function M.map(run: any, step: any): error?
    local cfg = run.config.stages.map
    local function sampling(stage: string, fields: { string }?, sources: { integer }?): any
        return { temperature = cfg.temperature, max_tokens = cfg.max_tokens, stage = stage, fields = fields, sources = sources }
    end
    local outline = run.document.outline
    -- A usable table of contents has at least three sections.
    local headed = #outline >= 3
    if cfg.outline == "build" or not headed then
        -- A built outline is kept on the processed copy under the identity of
        -- what built it; outline "build" builds it again.
        local card, card_err = ai.resolve(cfg.model)
        if card_err then return card_err end
        local identity, identity_err = canonical_json.hash({ model = card, requested_model = cfg.model, temperature = cfg.temperature,
            max_tokens = cfg.max_tokens, prompt = OUTLINE_PROMPT_VERSION, window = OUTLINE_WINDOW, preview_chars = PREVIEW_CHARS })
        if identity_err then return identity_err end
        local kept: { any }? = nil
        if cfg.outline ~= "build" then
            local found, kept_err = store.built_outline(run.document.id, identity :: string)
            if kept_err then return kept_err end
            kept = found
        end
        if kept then
            run.document.outline = kept
            step.message = "Reused the outline of " .. #kept .. " sections built for this copy"
        else
            local sections, build_err = build_outline(run, step, cfg, sampling)
            if build_err then return build_err end
            local keep_err = store.keep_built_outline(run.document.id, identity :: string, sections :: { any })
            if keep_err then return keep_err end
            run.document.outline = sections
            step.message = "Built an outline of " .. #(sections :: { any }) .. " sections"
        end
    else
        step.message = "Used " .. #outline .. " sections from the document's headings"
    end
    if cfg.section_summaries then
        local listing, sources, seen = {}, {}, {}
        for _, s in ipairs(run.document.outline) do
            local chunks, err = doctools.section({ document = run.document }, s.id)
            if err then return err end
            local body, length = {}, 0
            for _, c in ipairs(chunks) do
                if length < 1500 and not seen[c.ordinal] then
                    sources[#sources + 1], seen[c.ordinal] = c.ordinal, true
                end
                body[#body + 1] = c.content
                length = length + #c.content + 1
            end
            listing[#listing + 1] = "## " .. s.id .. " " .. s.path .. "\n" .. table.concat(body, "\n"):sub(1, 1500)
        end
        local summary_system = system("Summarize each section in one sentence, naming what it covers. Return one summary per section id.")
        local fits, _, fit_err = ai.fitter(cfg.model, cfg.max_tokens)
        if fit_err then return fit_err end
        local by_id = {}
        for i, section in ipairs(run.document.outline) do by_id[section.id] = listing[i] end
        local function body(batch: { any }): string
            local lines = {}
            for _, section in ipairs(batch) do lines[#lines + 1] = by_id[section.id] end
            return table.concat(lines, "\n\n")
        end
        local batches, rejected = shapes.batches(run.document.outline, function(batch: { any }): boolean return fits(summary_system, body(batch), M.summary_schema(batch)) end)
        if #rejected > 0 then budget_cut(run, run.config.fields) end
        if #batches == 0 and #rejected > 0 then return budget_failure(cfg.model, fits, summary_system, body({ rejected[1] }), M.summary_schema({ rejected[1] })) end
        for _, batch in ipairs(batches) do
            local batch_sources = {}
            for _, n in ipairs(sources) do
                for _, section in ipairs(batch) do
                    if n >= section.chunk_start and n <= section.chunk_end then batch_sources[#batch_sources + 1] = n; break end
                end
            end
            local result, err = ai.structured(step.meter, cfg.model, M.summary_schema(batch), summary_system, body(batch), sampling("summaries", shapes.paths(run.config.fields), batch_sources))
            if err then return err end
            for _, section in ipairs(batch) do
                local summary = trim(tostring(result[section.id] or ""))
                section.summary = summary ~= "" and summary or nil
            end
        end
    end
    local scoped = {}
    for _, f in ipairs(run.config.fields) do if f.search_within == "sections" then scoped[#scoped + 1] = f end end
    if #scoped > 0 then
        local select_system = system("You pick, for each field, the sections of the outline most likely to contain its value. Choose few but enough sections; include definitions or schedules a field depends on. Return section ordinals: the numbers after S in the outline labels, without the S.")
        local fits, _, fit_err = ai.fitter(cfg.model, cfg.max_tokens)
        if fit_err then return fit_err end
        local function body(fields: { any }, sections: { any }): string
            local listing = {}
            for n, section in ipairs(sections) do listing[#listing + 1] = "[S" .. n .. "] " .. doctools.outline_text({ section }) end
            return "Outline:\n" .. table.concat(listing, "\n") .. "\n\nFields:\n" .. field_lines(fields)
        end
        local function plan(fields: { any }): any
            local sections, lost = shapes.select(run.document.outline, function(batch: { any }): boolean return fits(select_system, body(fields, batch), select_schema(batch, fields)) end)
            return { sections = sections, lost = lost }
        end
        local batches, rejected = shapes.batches(scoped, function(fields: { any }): boolean return #plan(fields).sections > 0 end)
        local failure: error? = nil
        for _, f in ipairs(rejected) do
            failure = failure or budget_failure(cfg.model, fits, select_system, body({ f }, run.document.outline), select_schema(run.document.outline, { f }))
        end
        local picked = {}
        for _, batch in ipairs(batches) do
            local selected = plan(batch)
            if #selected.lost > 0 then budget_cut(run, batch) end
            local result, err = ai.structured(step.meter, cfg.model, select_schema(selected.sections, batch), select_system,
                body(batch, selected.sections), sampling("select", shapes.paths(batch)))
            if err then return err end
            for _, f in ipairs(batch) do
                local path, ids = shapes.path(f), {}
                for _, ordinal in ipairs(result[path]) do ids[#ids + 1] = selected.sections[ordinal].id end
                picked[#picked + 1] = path .. " → " .. table.concat(ids, ", ")
                run.regions[path] = shapes.ordinals_of(selected.sections, ids)
            end
        end
        step.queries = picked
        if failure then return failure end
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

local function paths(fields: { any }): { string }
    local out = {}
    for _, f in ipairs(fields) do out[#out + 1] = shapes.path(f) end
    return out
end

-- The structured scout's prompt: fields, earlier notes and the passages still visible to them.
function M.scout_input(run: any, fields: { any }, passages: { any }?): (string?, error?)
    local fields_text, err = scout_fields(run, fields)
    if err then return nil, err end
    return fields_text .. (#run.notes > 0 and ("\n\nEarlier notes:\n" .. table.concat(note_lines(run.notes), "\n")) or "") ..
        "\n\nEvidence:\n" .. render(passages or ordered(run.pool, paths(fields)))
end

local SCOUT_SYSTEM = system([[You review evidence gathered from one document before values are extracted.
Rate from 0 to 1 how confident you are that the passages contain every field's value. For each field, list the chunk numbers
whose passages state or help determine its value. List chunk numbers that serve no field as noise. Give every field an entry, empty
when no passage serves it. Propose focused search queries for fields whose evidence is missing or weak, and leave a short note per field
about where its value is or what to watch for (empty when there is nothing to note).
Do not extract values. Chunk numbers are the numbers after C, without the C.]] .. "\n" .. shapes.QUERY_RULE)

-- The built-in scout owns this conversation. Reassemble document-bearing
-- slots from their passage/section units while preserving tool call pairs.
local function scout_conversation(run: any, fields: { any }, initial: { any }, observations: any, base: string): any
    return function(messages: { any }, accepts: any): (any?, error?)
        local reduced = assert(json.decode(assert(json.encode(messages))))
        local slots = {}
        local marker = "[Docscout context truncated to fit the model's context budget.]"
        for _, message in ipairs(reduced) do
            if message.role == "user" then
                slots[#slots + 1] = { message = message, items = initial, initial = true, kept = {} }
                message.content = { { type = "text", text = base } }
            elseif message.role == "function_result" then
                local observation = observations[message.function_call_id]
                if observation and #observation.items > 0 then
                    slots[#slots + 1] = { message = message, items = observation.items, outline = observation.outline, kept = {} }
                    message.content = { { type = "text", text = assert(json.encode(marker)) } }
                end
            end
        end
        local function set(slot: any, items: { any })
            local text = slot.outline and doctools.outline_text(items) or render(items)
            if slot.initial then text = base .. text
            else text = assert(json.encode(text .. "\n\n" .. marker)) end
            slot.message.content = { { type = "text", text = text } }
        end
        local ok, estimated, available = accepts(reduced)
        if not ok then return nil, ai.budget_error(run.config.stages.scout.model, estimated, available) end
        local total, usable = 0, 0
        for _, slot in ipairs(slots) do
            total = total + #slot.items
            local function fits(items: { any }): boolean
                set(slot, items)
                return accepts(reduced)
            end
            local kept, rejected
            if slot.initial then
                local lost
                kept, lost = M.allocate(run.pool, slot.items, shapes.paths(fields), fits)
                rejected = {}
                for _, n in pairs(lost) do if n > 0 then rejected[1] = true end end
            else kept, rejected = shapes.select(slot.items, fits) end
            set(slot, kept)
            usable = usable + #kept
            if #rejected > 0 then budget_cut(run, fields) end
        end
        if total > 0 and usable == 0 then
            local _, estimated, available = accepts(messages)
            return nil, ai.budget_error(run.config.stages.scout.model, estimated, available)
        end
        return reduced, nil
    end
end

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
        local instruction = system("You read one document with the tools to find evidence for the fields below. Follow references to definitions and schedules. When you have enough, reply with short notes per field saying where each value is. " .. shapes.QUERY_RULE)
        local initial = ordered(run.pool)
        local base = fields_text .. "\n\nEvidence so far:\n"
        local input = base .. render(initial)
        local observations = {}
        local answer, calls, err
        if cfg.agent_id then
            answer, calls, err = user_agent.run(run, step, instruction, input)
        else
            answer, calls, err = ai.agent(step.meter, cfg.model, instruction, input,
                tools, M.agent_budget(cfg),
                function(name: string, args: any, id: string?): (string?, error?)
                    local hits, text, call_err = doctools.call(ctx, name, args)
                    step.tool_calls = step.tool_calls or {}
                    step.tool_calls[#step.tool_calls + 1] = { name = name, arguments = args,
                        result = { text = text, chunks = hits }, error = call_err and error_envelope.encode(call_err) or nil }
                    if call_err then return nil, call_err end
                    add(run.pool, hits)
                    if id then observations[id] = { items = name == "read_outline" and run.document.outline or hits, outline = name == "read_outline" } end
                    return text, nil
                end, { max_tokens = cfg.max_tokens, temperature = cfg.temperature, stage = "scout", fields = shapes.paths(fields) },
                scout_conversation(run, fields, initial, observations, base))
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
        local fits, _, fit_err = ai.fitter(cfg.model, cfg.max_tokens)
        if fit_err then return fit_err end
        local function plan(batch: { any }): any
            local pool = ordered(run.pool, shapes.paths(batch))
            local function accepts(chunks: { any }): boolean
                return fits(SCOUT_SYSTEM, assert(M.scout_input(run, batch, chunks)), M.scout_schema(cfg, batch, chunks))
            end
            local selected, lost = M.allocate(run.pool, pool, shapes.paths(batch), accepts)
            return { pool = selected, lost = lost, usable = (#pool == 0 or #selected > 0) and accepts(selected) }
        end
        local batches, rejected = shapes.batches(fields, function(batch: { any }): boolean return plan(batch).usable end)
        local result = { confidence = 1, evidence = {}, notes = {}, queries = {} }
        local failure: error? = nil
        for _, f in ipairs(rejected) do
            local pool = ordered(run.pool, { shapes.path(f) })
            failure = failure or budget_failure(cfg.model, fits, SCOUT_SYSTEM, assert(M.scout_input(run, { f }, pool)), M.scout_schema(cfg, { f }, pool))
        end
        for _, batch in ipairs(batches) do
            local prepared = plan(batch)
            local pool = prepared.pool
            for _, f in ipairs(batch) do if (prepared.lost[shapes.path(f)] or 0) > 0 then budget_cut(run, { f }) end end
            local reply, err = ai.structured(step.meter, cfg.model, M.scout_schema(cfg, batch, pool), SCOUT_SYSTEM,
                assert(M.scout_input(run, batch, pool)), { max_tokens = cfg.max_tokens, temperature = cfg.temperature, stage = "scout",
                    sources = shapes.ordinals(pool), fields = shapes.paths(batch) })
            if err then return err end
            result.confidence = math.min(result.confidence, tonumber(reply.confidence) or 0)
            for path, evidence in pairs(reply.evidence) do result.evidence[path] = evidence end
            for path, note in pairs(reply.notes) do result.notes[path] = note end
            for _, query in ipairs(reply.queries) do result.queries[#result.queries + 1] = query end
            if cfg.drop_noise then
                local selected = {}
                for _, f in ipairs(batch) do
                    local region, region_err = M.region(run, f)
                    if region_err then return region_err end
                    for _, n in ipairs(region or {}) do selected[#selected + 1] = n end
                end
                shapes.prune(run.pool, reply.drop, reply.evidence, selected)
            end
        end
        if failure then return failure end
        run.confidence = result.confidence
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
        ((step.uncited or 0) > 0 and (" · " .. step.uncited .. (step.uncited == 1 and " field" or " fields") .. " without cited evidence") or "")
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
            system("Write up to " .. room .. " varied search queries that would find passages stating this field's value, including synonyms and related clauses. " .. shapes.QUERY_RULE),
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
        table.sort(found, function(a: any, b: any): boolean return a.ordinal < b.ordinal end)
    end
    -- Deep fields keep their own evidence visible to themselves.
    add(run.pool, found, shapes.path(f))
    local analysis_system = system("You analyse passages of one document for a single field and explain what its value is, quoting the decisive wording and citing chunk numbers. Say plainly when the passages do not settle it.")
    local function body(chunks: { any }): string return field_lines({ f }) .. "\n\nPassages:\n" .. render(chunks) end
    local fits, _, fit_err = ai.fitter(cfg.model, cfg.max_tokens)
    if fit_err then return fit_err end
    local kept, rejected = shapes.select(found, function(chunks: { any }): boolean return fits(analysis_system, body(chunks)) end)
    if #rejected > 0 then budget_cut(run, { f }) end
    if #found > 0 and #kept == 0 then return budget_failure(cfg.model, fits, analysis_system, body({ found[1] })) end
    local analysis, analysis_err = ai.generate(step.meter, cfg.model, analysis_system, body(kept),
        { temperature = cfg.analysis_temperature, max_tokens = cfg.max_tokens, stage = "analysis", sources = shapes.ordinals(kept), fields = { shapes.path(f) } })
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

-- One required entry per passage, keyed by its chunk number; an empty list
-- says the passage holds nothing for the fields.
function M.highlight_schema(batch: { any }): any
    local keys = {}
    for _, c in ipairs(batch) do keys[#keys + 1] = tostring(c.ordinal) end
    return shapes.keyed(keys, { type = "array", maxItems = HIGHLIGHT_EXCERPTS, items = { type = "string" } })
end
local HIGHLIGHT_BATCH = 12

function M.highlight(run: any, step: any): error?
    local retrieval = run.config.retrieval
    local model = retrieval.highlighter_model
    local calls, call_err = M.extraction_calls(run)
    if call_err then return call_err end
    local chunks, seen = {}, {}
    for _, call in ipairs(calls) do
        for _, c in ipairs(call.passages) do
            if not seen[c.ordinal] then
                seen[c.ordinal] = true
                chunks[#chunks + 1] = c
            end
        end
    end
    table.sort(chunks, function(a: any, b: any): boolean return a.ordinal < b.ordinal end)
    local kept, before = 0, #chunks
    local highlight_system = system("For each passage, keyed by its chunk number without the C, copy word for word the sentences that state or help determine any field's value. Return an empty list for passages that do not.")
    local function body(batch: { any }): string return "Fields:\n" .. field_lines(run.config.fields) .. "\n\nPassages:\n" .. render(batch) end
    local fits, _, fit_err = ai.fitter(model, retrieval.highlighter_max_tokens)
    if fit_err then return fit_err end
    local batches, rejected = shapes.batches(chunks, function(batch: { any }): boolean return fits(highlight_system, body(batch), M.highlight_schema(batch)) end, HIGHLIGHT_BATCH)
    if #rejected > 0 then budget_cut(run, run.config.fields) end
    if #chunks > 0 and #batches == 0 then return budget_failure(model, fits, highlight_system, body({ chunks[1] }), M.highlight_schema({ chunks[1] })) end
    for _, batch in ipairs(batches) do
        local result, err = ai.structured(step.meter, model, M.highlight_schema(batch), highlight_system, body(batch),
            { temperature = retrieval.highlighter_temperature, max_tokens = retrieval.highlighter_max_tokens, stage = "highlight", sources = shapes.ordinals(batch), fields = shapes.paths(run.config.fields) })
        if err then return err end
        for _, c in ipairs(batch) do
            -- Only excerpts that occur in the passage replace it, each as its own paragraph.
            local source, genuine = shapes.normalize_literal(c.content), {}
            for _, excerpt in ipairs(result[tostring(c.ordinal)]) do
                local q = shapes.normalize_literal(excerpt)
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
    local output = run.config.stages.extract.max_output_tokens
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
        -- Fields fill a call up to "fields per call" and while their expected replies fit the output limit.
        local batches, current, expected = {}, {}, 0
        for _, f in ipairs(set.fields) do
            local cost = shapes.output_estimate(f)
            if #current > 0 and (#current >= limit or expected + cost > output) then
                batches[#batches + 1] = current; current, expected = {}, 0
            end
            current[#current + 1] = f; expected = expected + cost
        end
        if #current > 0 then batches[#batches + 1] = current end
        for _, batch in ipairs(batches) do
            local names, notes = {}, {}
            for _, f in ipairs(batch) do names[shapes.path(f)] = true end
            local passages = {}
            for _, c in ipairs(ordered(run.pool, paths(batch))) do
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

-- Build the same request for planning and dispatch.
local function extraction_input(run: any, batch: { any }, passages: { any }, notes: { string }): string
    local context = {}
    for _, f in ipairs(batch) do if run.analyses[shapes.path(f)] then context[#context + 1] = "Analysis of " .. shapes.path(f) .. ":\n" .. run.analyses[shapes.path(f)] end end
    return "Fields:\n" .. field_lines(batch) ..
        (#notes > 0 and ("\n\nScout notes:\n" .. table.concat(notes, "\n")) or "") ..
        (#context > 0 and ("\n\n" .. table.concat(context, "\n\n")) or "") ..
        "\n\nPassages:\n" .. render(passages)
end

local function extract_call(run: any, step: any, cfg: any, call: any): error?
    local batch, passages, notes = call.fields, call.passages, call.notes
    local result, err = ai.structured(step.meter, cfg.model, shapes.group_schema(batch, passages), EXTRACT_SYSTEM,
        extraction_input(run, batch, passages, notes),
        { max_tokens = cfg.max_output_tokens, temperature = cfg.temperature, stage = "extract", sources = shapes.ordinals(passages), fields = shapes.paths(batch) })
    if err then return err end
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
        elseif f.search_within == "sections" then
            entry.codes = { "missing_in_sections" }
        end
        if run.budget_dropped and run.budget_dropped[shapes.path(f)] then
            entry.codes = entry.codes or {}
            entry.codes[#entry.codes + 1] = "context_budget_partial"
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
    local fits: any = nil
    local planned = {}
    for _, call in ipairs(extraction_calls) do
        if #call.passages == 0 then planned[#planned + 1] = call
        else
            if not fits then
                local fit_err
                fits, _, fit_err = ai.fitter(cfg.model, cfg.max_output_tokens)
                if fit_err then return fit_err end
            end
            local function plan(batch: { any }): any
                local names, notes = {}, {}
                for _, f in ipairs(batch) do names[shapes.path(f)] = true end
                local whole = batch[1].search_within ~= "sections"
                for _, n in ipairs(run.notes) do
                    if (n.field and names[n.field]) or (not n.field and whole) then notes[#notes + 1] = n end
                end
                local lines = note_lines(notes)
                local candidates = {}
                for _, c in ipairs(call.passages) do
                    for _, f in ipairs(batch) do
                        if not run.pool.provenance[c.ordinal].excluded[shapes.path(f)] then candidates[#candidates + 1] = c; break end
                    end
                end
                local function accepts(chunks: { any }): boolean
                    return fits(EXTRACT_SYSTEM, extraction_input(run, batch, chunks, lines), shapes.group_schema(batch, chunks))
                end
                local kept, lost = M.allocate(run.pool, candidates, shapes.paths(batch), accepts)
                local usable = #kept > 0
                for _, f in ipairs(batch) do
                    local has, needed = false, false
                    for _, c in ipairs(candidates) do if not run.pool.provenance[c.ordinal].excluded[shapes.path(f)] then needed = true end end
                    for _, c in ipairs(kept) do if not run.pool.provenance[c.ordinal].excluded[shapes.path(f)] then has = true end end
                    if needed and not has then usable = false end
                end
                return { fields = batch, passages = kept, notes = lines, lost = lost, usable = usable,
                    error = not usable and budget_failure(cfg.model, fits, EXTRACT_SYSTEM,
                        extraction_input(run, batch, candidates, lines), shapes.group_schema(batch, candidates)) or nil }
            end
            local batches, rejected = shapes.batches(call.fields, function(batch: { any }): boolean return plan(batch).usable end)
            for _, batch in ipairs(batches) do
                local prepared = plan(batch)
                for _, f in ipairs(batch) do if (prepared.lost[shapes.path(f)] or 0) > 0 then budget_cut(run, { f }) end end
                planned[#planned + 1] = prepared
            end
            for _, f in ipairs(rejected) do
                local err = plan({ f }).error
                failed_field(run, f, err); failure = failure or err
            end
        end
    end
    extraction_calls = planned
    for _, call in ipairs(extraction_calls) do
        if #call.passages == 0 then
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

-- Verify: quotes must appear in the document; a model may also confirm each
-- quote supports its value. The reply holds one required verdict per field
-- path, so a constrained decoder cannot omit or repeat a field.
local function support_schema(values: { any }): any
    local paths = {}
    for _, v in ipairs(values) do paths[#paths + 1] = shapes.path(v) end
    return shapes.keyed(paths, { type = "object", additionalProperties = false, required = { "supported", "reason" },
        properties = { supported = { type = "boolean" }, reason = { type = "string" } } })
end

-- The optional policy judges support for the requested field and completeness
-- of text and lists. The default policy keeps its existing support contract.

-- Verdicts a support reply gives. A constrained decoder only admits these
-- strings, so the prompt names each one with its meaning.
local VERDICT = { supported = "supported", not_supported = "not_supported", insufficient = "insufficient_evidence" }
local COMPLETENESS = { complete = "complete", incomplete = "incomplete", insufficient = "insufficient_evidence" }

function M.support_system(): string
    return system("For each field, decide whether its cited text states this value for this field, as the field's description defines it.\n" ..
        "Reformatting (dates, numbers, case, spacing) is allowed; a quote that states a different value or another role's value does not support it.\n" ..
        "Give the verdict \"" .. VERDICT.supported .. "\" when the cited text states the value, \"" .. VERDICT.not_supported ..
        "\" when it states a different value or none, and \"" .. VERDICT.insufficient .. "\" when it cannot settle it.\n" ..
        "For fields that also ask for completeness, judge from the source text whether the value is complete for the requested output, including its format, filtering or summary instructions: \"" .. COMPLETENESS.complete ..
        "\", \"" .. COMPLETENESS.incomplete .. "\" when it leaves part out, or \"" .. COMPLETENESS.insufficient .. "\".\nReturn one check per field.")
end

-- Field types whose value can be cut short, so the support check also judges completeness.
local function completes(f: any): boolean return f.type == "text" or f.type == "list" end

-- The support check's reply: one required verdict per field path, so a
-- constrained decoder cannot omit or repeat a field; text and list fields
-- also get a completeness verdict.
function M.support_schema(values: { any }, complete_fields: { [string]: boolean }): any
    local properties, required = shapes.object(), {}
    for _, v in ipairs(values) do
        local path = shapes.path(v)
        required[#required + 1] = path
        local item = { type = "object", additionalProperties = false, required = { "verdict", "reason" }, properties = {
            verdict = { type = "string", enum = { VERDICT.supported, VERDICT.not_supported, VERDICT.insufficient } }, reason = { type = "string" } } }
        if complete_fields[path] then
            item.required = { "verdict", "complete", "reason" }
            item.properties.complete = { type = "string", enum = { COMPLETENESS.complete, COMPLETENESS.incomplete, COMPLETENESS.insufficient } }
        end
        properties[path] = item
    end
    return { type = "object", additionalProperties = false, required = required, properties = properties }
end

-- One value as the support check reads it: the field's path, type and
-- description, the value, its quotes and, when given, the source text around them.
function M.support_line(f: any, v: any, source: string?): string
    local quotes = {}
    for _, e in ipairs(v.evidence) do quotes[#quotes + 1] = "\"" .. e.quote .. "\"" end
    local t = f.type == "list" and ("list of " .. f.item.type) or f.type
    return "- " .. shapes.path(v) .. " (" .. t .. "): " .. (f.description ~= "" and f.description or "no description") ..
        "\n  contract: " .. json.encode(shapes.value_schema(f)) .. "\n  validation hints: " .. (f.validation_hints or "") ..
        "\n  value: " .. json.encode(v.value) .. "\n  quotes: " .. table.concat(quotes, " | ") ..
        (source and ("\n  source:\n  " .. source) or "")
end

-- Candidate source chunks stay inside the field's selected region. The
-- request shares chunks across fields and requires every selected region to fit.
local function source_region(run: any, f: any, v: any, by_ordinal: { [integer]: any }): ({ any }?, error?)
    local ordinals, seen = {}, {}
    local failure: error? = nil
    local function take(n: integer)
        if not by_ordinal[n] or seen[n] then return end
        local allowed, err = visible(run, f, n)
        if err then failure = failure or err; return end
        if allowed then seen[n] = true; ordinals[#ordinals + 1] = n end
    end
    local budget = run.config.retrieval and run.config.retrieval.section_budget or 0
    for _, e in ipairs(v.evidence) do
        local n = math.tointeger(e.chunk)
        if n then
            local section = nil
            for _, region in ipairs(run.document.outline or {}) do
                if region.chunk_start and n >= region.chunk_start and n <= region.chunk_end then section = region end
            end
            if section and (section.tokens or 0) <= budget then
                for k = section.chunk_start, section.chunk_end do take(k) end
            else take(n); take(n + 1) end
        end
    end
    if failure then return nil, failure end
    table.sort(ordinals)
    local chunks = {}
    for _, n in ipairs(ordinals) do chunks[#chunks + 1] = by_ordinal[n] end
    return chunks, nil
end

-- Chunks of an ordinal map in document order.
local function store_order(by_ordinal: { [integer]: any }): { any }
    local out = {}
    for _, c in pairs(by_ordinal) do out[#out + 1] = c end
    table.sort(out, function(a: any, b: any): boolean return a.ordinal < b.ordinal end)
    return out
end

function M.verify(run: any, step: any): error?
    local cfg = run.config.stages.verify
    local enhanced = cfg.check_completeness == true
    local field_aware = enhanced
    local fields = {}
    for _, f in ipairs(run.config.fields) do fields[shapes.path(f)] = f end
    local by_ordinal = {}
    local needs_source = false
    if enhanced and cfg.check_support then
        for _, v in ipairs(run.values) do
            if not v.missing and not v.failed and #v.evidence > 0 and completes(fields[shapes.path(v)]) then needs_source = true end
        end
    end
    if cfg.check_quotes or needs_source then
        local chunks, err = store.all_chunks(run.document.id)
        if err then
            if cfg.check_quotes then return err end
            field_aware = false
        else
            for _, c in ipairs(chunks) do by_ordinal[c.ordinal] = c end
        end
    end
    if cfg.check_quotes then
        local bodies, order = {}, {}
        for _, c in ipairs(store_order(by_ordinal)) do
            bodies[c.ordinal] = shapes.normalize(c.content); order[#order + 1] = c.ordinal
        end
        local quote_context = shapes.quote_context(store_order(by_ordinal), run.document.source)
        for _, v in ipairs(run.values) do
            if not v.missing and not v.failed then
                v.quotes_found = true
                for _, e in ipairs(v.evidence) do
                    local candidates = {}
                    for _, ordinal in ipairs(order) do
                        local allowed, region_err = visible(run, fields[shapes.path(v)], ordinal)
                        if region_err then return region_err end
                        if allowed then candidates[#candidates + 1] = ordinal end
                    end
                    local at, last = shapes.locate(e.quote, e.chunk, bodies, candidates, quote_context)
                    e.found = at ~= nil
                    if at then
                        local c = by_ordinal[at]
                        e.chunk, e.chunk_id, e.section = at, c.id, c.heading_path
                        local location = shapes.quote_location(c, e.quote)
                        if last ~= at then location = { page_start = c.page_start, page_end = by_ordinal[last].page_end or by_ordinal[last].page_start } end
                        e.page, e.page_start, e.page_end = location.page, location.page_start, location.page_end
                    end
                    if not e.found then v.quotes_found = false end
                end
            end
        end
    end
    local support, complete_fields = {}, {}
    local support_error: error? = nil
    if cfg.check_support then
        local found, lines, seen = {}, {}, {}
        local sources: { integer } = {}
        local context: { [integer]: any } = {}
        local support_system = ""
        local function prepare()
            found, lines, seen, sources, context, complete_fields = {}, {}, {}, {}, {}, {}
            for _, v in ipairs(run.values) do
                if not v.missing and not v.failed then
                    found[#found + 1] = v
                    local quotes = {}
                    for _, e in ipairs(v.evidence) do
                        quotes[#quotes + 1] = "\"" .. e.quote .. "\""
                        if e.chunk and not seen[e.chunk] then sources[#sources + 1], seen[e.chunk] = e.chunk, true end
                    end
                    lines[shapes.path(v)] = field_aware and M.support_line(fields[shapes.path(v)], v) or
                        ("- " .. shapes.path(v) .. " = " .. json.encode(v.value) .. "\n  quotes: " .. table.concat(quotes, " | "))
                end
            end
            support_system = field_aware and M.support_system() or system("For each field, decide whether its quotes support its value exactly. Return one check per field.")
        end
        prepare()
        local function body(): string
            local out = {}
            for _, v in ipairs(found) do out[#out + 1] = lines[shapes.path(v)] end
            if next(context) then out[#out + 1] = "Source passages:\n" .. render(store_order(context)) end
            return table.concat(out, "\n")
        end
        local function reply_schema(): any
            return field_aware and M.support_schema(found, complete_fields) or support_schema(found)
        end
        if #found > 0 then
            if field_aware then
                local fits, _, fit_err = ai.fitter(cfg.model, cfg.max_tokens)
                if fit_err or not (fits :: any)(support_system, body(), reply_schema()) then
                    field_aware = false
                else
                    for _, v in ipairs(found) do
                        local path, f = shapes.path(v), fields[shapes.path(v)]
                        if completes(f) then
                            local region, region_err = source_region(run, f, v, by_ordinal)
                            if region_err then field_aware = false; break end
                            if #(region :: { any }) > 0 then
                                local refs = {}
                                for _, chunk in ipairs(region :: { any }) do
                                    refs[#refs + 1] = "C" .. chunk.ordinal
                                    context[chunk.ordinal] = chunk
                                end
                                lines[path] = M.support_line(f, v, table.concat(refs, ", "))
                                complete_fields[path] = true
                                if not (fits :: any)(support_system, body(), reply_schema()) then
                                    field_aware = false
                                    break
                                end
                            end
                        end
                    end
                end
            end
            if not field_aware then prepare() end
            for ordinal in pairs(context) do
                if not seen[ordinal] then sources[#sources + 1], seen[ordinal] = ordinal, true end
            end
            table.sort(sources)
            local fits, _, fit_err = ai.fitter(cfg.model, cfg.max_tokens)
            if fit_err then return fit_err end
            local function batch_body(batch: { any }): string
                local out = {}
                for _, v in ipairs(batch) do out[#out + 1] = lines[shapes.path(v)] end
                if next(context) then out[#out + 1] = "Source passages:\n" .. render(store_order(context)) end
                return table.concat(out, "\n")
            end
            local function batch_schema(batch: { any }): any
                return field_aware and M.support_schema(batch, complete_fields) or support_schema(batch)
            end
            local batches, rejected = shapes.batches(found, function(batch: { any }): boolean return fits(support_system, batch_body(batch), batch_schema(batch)) end)
            if #rejected > 0 then support_error = budget_failure(cfg.model, fits, support_system, batch_body({ rejected[1] }), batch_schema({ rejected[1] })) end
            for _, batch in ipairs(batches) do
                local batch_sources = sources
                if #batches > 1 or #rejected > 0 then
                    batch_sources = {}
                    local used = {}
                    for _, v in ipairs(batch) do
                        for _, e in ipairs(v.evidence) do if e.chunk and not used[e.chunk] then used[e.chunk] = true; batch_sources[#batch_sources + 1] = e.chunk end end
                    end
                    for ordinal in pairs(context) do if not used[ordinal] then batch_sources[#batch_sources + 1] = ordinal end end
                    table.sort(batch_sources)
                end
                local result, err = ai.structured(step.meter, cfg.model, batch_schema(batch), support_system, batch_body(batch),
                    { temperature = cfg.temperature, max_tokens = cfg.max_tokens, stage = "support", fields = shapes.paths(batch), sources = batch_sources })
                if err then support_error = support_error or err
                else for path, verdict in pairs(result) do support[path] = verdict end end
            end
        end
    end
    local failed = 0
    for _, v in ipairs(run.values) do
        local reasons, codes, recorded = {}, {}, {}
        local function code(value: string) if not recorded[value] then codes[#codes + 1], recorded[value] = value, true end end
        local function reject(value: string, reason: string) reasons[#reasons + 1] = reason; code(value) end
        if v.reason then reasons[#reasons + 1] = v.reason end
        for _, value in ipairs(v.codes or {}) do code(value) end
        if run.budget_dropped and run.budget_dropped[shapes.path(v)] then code("context_budget_partial") end
        local found = not v.missing and not v.failed
        if found then
            local valid, shape_err = json.validate(shapes.value_schema(fields[shapes.path(v)]), v.value)
            if not valid then reject("shape_mismatch", "Value does not match its declared shape: " .. tostring(shape_err))
            else
                local issue = shapes.format_issue(fields[shapes.path(v)], v.value)
                if issue then reject("format_unverified", issue) end
            end
            if enhanced and #v.evidence == 0 and not recorded.no_quote then reject("no_quote", "No quote supports this value") end
        end
        if cfg.check_quotes and found and not v.quotes_found then reject("quote_not_found", "A quote is not in the document") end
        if cfg.check_support and found and (not enhanced or #v.evidence > 0) then
            local check = support[shapes.path(v)]
            if support_error then reject("support_no_verdict", "The support check gave no verdict: " .. tostring(support_error))
            elseif not check then reject("support_no_verdict", "The support check gave no verdict")
            elseif field_aware then
                if check.verdict == VERDICT.not_supported then reject("support_rejected", check.reason)
                elseif check.verdict == VERDICT.insufficient then reject("support_insufficient", "The cited text cannot settle the value: " .. check.reason) end
                v.complete = nil
                if completes(fields[shapes.path(v)]) then
                    if check.complete == COMPLETENESS.complete then v.complete = true
                    elseif check.complete == COMPLETENESS.incomplete then
                        v.complete = false; reject("incomplete", "The value leaves out part of its requested output: " .. check.reason)
                    elseif check.complete == COMPLETENESS.insufficient then
                        reject("support_insufficient", "The source cannot settle whether the value is complete: " .. check.reason)
                    else reject("support_insufficient", "The value's completeness is unknown because its source context does not fit") end
                end
            elseif not check.supported then reject("support_rejected", check.reason) end
        end
        if enhanced and v.missing and #codes == 0 then code("missing") end
        v.verified = not v.failed and (not enhanced or found) and #reasons == 0
        v.reason = #reasons > 0 and table.concat(reasons, "; ") or nil
        v.codes = codes
        if not v.verified then failed = failed + 1 end
    end
    step.message = failed == 0 and "All values check out" or (failed .. (failed == 1 and " value needs" or " values need") .. " review")
    return support_error
end

return M
