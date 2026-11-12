-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local ai = require("ai")
local shapes = require("shapes")
local pages = require("pages")
local types = require("types")
local M = {}

function M.numbers(candidates: {types.PageCandidate}): {integer}
    local out = {}
    for _, candidate in ipairs(candidates) do out[#out + 1] = candidate.ordinal end
    return out
end

function M.bytes(candidates: {types.PageCandidate}): integer
    local count = 0
    for _, candidate in ipairs(candidates) do count = count + assert(candidate.image).size end
    return count
end

function M.message(candidates: {types.PageCandidate}, text: string): types.UserContent
    local out: {types.TextPart | types.ImagePart} = {}
    for _, candidate in ipairs(candidates) do
        out[#out + 1] = ai.text_part("[Page " .. candidate.ordinal .. "]")
        out[#out + 1] = ai.image_part(assert(candidate.image).mime_type, assert(candidate.image).bytes)
    end
    out[#out + 1] = ai.text_part(text)
    return out
end

-- Page candidates retain the existing fair allocator's field provenance.
-- Short regions are read whole; longer ones use retrieved pages as candidates.
function M.candidates(run: types.PageRun, call: types.PageCall, allowed: {integer})
    local eligible, provenance, offered = {}, {}, {}
    local whole = #allowed <= run.config.stages.extract.max_pages
    for _, page in ipairs(allowed) do
        eligible[page] = true
        provenance[page] = {fields = {}, cited = {}, excluded = {}}
        offered[page] = whole
    end
    for _, chunk in ipairs(call.passages) do
        local origin = run.pool.provenance[chunk.ordinal]
        for _, span in ipairs(chunk.page_spans) do
            if eligible[span.page] then
                offered[span.page] = true
                local target = provenance[span.page]
                for path, yes in pairs(origin.fields) do if yes then target.fields[path] = true end end
                for path, yes in pairs(origin.cited) do if yes then target.cited[path] = true end end
                target.rank = math.min(target.rank or math.huge, origin.rank or math.huge)
            end
        end
    end
    local candidates = {}
    for _, page in ipairs(allowed) do if offered[page] then candidates[#candidates + 1] = {ordinal = page} end end
    return candidates, {provenance = provenance}
end

function M.load(source: types.PageSet, candidates: {types.PageCandidate}): error?
    for _, candidate in ipairs(candidates) do
        local image, err = pages.read(source, candidate.ordinal)
        if err then return err end
        candidate.image = image
    end
    return nil
end

return M
