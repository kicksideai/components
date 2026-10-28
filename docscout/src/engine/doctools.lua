-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Read operations over one processed document: keyword and semantic search,
-- reading a section, and reading the outline. The agent scout calls them as
-- tools; stages call them directly.
local store = require("store")
local ai = require("ai")
local shapes = require("shapes")

local M = {}

M.TOOLS = {
    ["kickside.docscout.tools:keyword_search"] = {
        name = "keyword_search", description = "Find passages containing exact words, names or numbers.",
        schema = { type = "object", additionalProperties = false, required = { "query", "limit" },
            properties = { query = { type = "string" }, limit = { type = "integer", minimum = 1, maximum = 20 } } },
    },
    ["kickside.docscout.tools:semantic_search"] = {
        name = "semantic_search", description = "Find passages by meaning, even when the wording differs.",
        schema = { type = "object", additionalProperties = false, required = { "query", "limit" },
            properties = { query = { type = "string" }, limit = { type = "integer", minimum = 1, maximum = 20 } } },
    },
    ["kickside.docscout.tools:read_section"] = {
        name = "read_section", description = "Read a whole section by its id from the outline.",
        schema = { type = "object", additionalProperties = false, required = { "section_id" },
            properties = { section_id = { type = "string" } } },
    },
    ["kickside.docscout.tools:read_outline"] = {
        name = "read_outline", description = "List the document's sections with their ids, pages and sizes.",
        schema = { type = "object", additionalProperties = false, properties = { detail = { type = "string", enum = { "titles" } } }, required = { "detail" } },
    },
}

-- ctx: { document, retrieval, meter }. region, when given, keeps results inside those chunk ordinals.
function M.search(ctx: any, mode: string, query: string, limit: integer, region: { integer }?, min_similarity: number?): (any?, error?)
    local vector = nil
    if mode ~= "keyword" then
        local vectors, err = ai.embed(ctx.meter, ctx.retrieval.embedding_model, { query })
        if err then return nil, err end
        vector = vectors[1]
    end
    return store.search(ctx.document.id, { mode = mode, text = query, vector = vector, limit = limit, ordinals = region, min_similarity = min_similarity })
end

function M.section(ctx: any, section_id: string): (any?, error?)
    for _, s in ipairs(ctx.document.outline) do
        if s.id == section_id then
            local ordinals = {}
            for n = s.chunk_start, s.chunk_end do ordinals[#ordinals + 1] = n end
            return store.chunks_at(ctx.document.id, ordinals)
        end
    end
    return nil, errors.new({ kind = errors.NOT_FOUND, message = "no section " .. section_id })
end

function M.outline_text(outline: { any }): string
    local lines = {}
    for _, s in ipairs(outline) do
        local pages = s.page_start and (s.page_end and s.page_end ~= s.page_start and (" pp." .. s.page_start .. "-" .. s.page_end) or (" p." .. s.page_start)) or ""
        lines[#lines + 1] = string.rep("  ", math.max(0, (s.level or 1) - 1)) .. s.id .. " " .. s.title .. pages .. " (~" .. tostring(s.tokens or 0) .. " tokens)" .. (s.summary and (" — " .. s.summary) or "")
    end
    return table.concat(lines, "\n")
end

-- Runs one tool call for the agent scout: chunks found, their text for the model, or an error.
function M.call(ctx: any, name: string, args: any): (any, string?, error?)
    local limit = math.tointeger(args.limit) or 5
    local hits, err
    if name == "keyword_search" then hits, err = M.search(ctx, "keyword", tostring(args.query or ""), limit, nil)
    elseif name == "semantic_search" then hits, err = M.search(ctx, "semantic", tostring(args.query or ""), limit, nil)
    elseif name == "read_section" then
        hits, err = M.section(ctx, tostring(args.section_id or ""))
        -- An unknown section id is the model's mistake; it can correct it from the outline.
        if err and (err :: any):kind() == errors.NOT_FOUND then return {}, tostring(err), nil end
    elseif name == "read_outline" then return {}, M.outline_text(ctx.document.outline), nil
    else return nil, nil, errors.new({ kind = errors.INVALID, message = "unknown document tool " .. tostring(name) }) end
    if err then return nil, nil, err end
    if #hits == 0 then return hits, "No passages found.", nil end
    return hits, shapes.render(hits), nil
end

return M
