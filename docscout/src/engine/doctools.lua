-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Read operations over one processed document: keyword and semantic search,
-- reading a section, and reading the outline. The agent scout calls them as
-- tools; stages call them directly.
local store = require("store")
local ai = require("ai")

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

-- ctx: { document, retrieval, meter, region (ordinals or nil), pool (optional) }
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

-- Runs one tool call for the agent scout and returns chunks found plus a text result.
function M.call(ctx: any, name: string, args: any): (any, string)
    local hits, err
    if name == "keyword_search" then hits, err = M.search(ctx, "keyword", tostring(args.query or ""), math.tointeger(math.min(20, tonumber(args.limit) or 5)) or 5, ctx.region)
    elseif name == "semantic_search" then hits, err = M.search(ctx, "semantic", tostring(args.query or ""), math.tointeger(math.min(20, tonumber(args.limit) or 5)) or 5, ctx.region)
    elseif name == "read_section" then hits, err = M.section(ctx, tostring(args.section_id or ""))
    elseif name == "read_outline" then return {}, M.outline_text(ctx.document.outline)
    else return {}, "Unknown tool " .. tostring(name) end
    if err then return {}, "Error: " .. tostring(err) end
    local lines = {}
    for _, c in ipairs(hits or {}) do
        lines[#lines + 1] = "[C" .. c.ordinal .. "] " .. c.heading_path .. (c.page_start and (" (p." .. c.page_start .. ")") or "") .. "\n" .. c.content
    end
    return hits or {}, #lines > 0 and table.concat(lines, "\n\n") or "No passages found."
end

return M
