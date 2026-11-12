-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local contract = require("contract")
local security = require("security")
local types = require("types")
local shapes = require("shapes")
local M = {}

function M.error(code: string, message: string): error
    return errors.new({kind = errors.INVALID, retryable = false, message = message, details = {code = code}})
end

local function open()
    local definition, err = contract.get("kickside.uploads:page_images")
    if err then return nil, err end
    local actor, scope = security.actor(), security.scope()
    if not actor then return nil, errors.new({kind = errors.UNAUTHENTICATED, message = "authentication required"}) end
    if not scope then return nil, errors.new({kind = errors.PERMISSION_DENIED, message = "authorization scope required"}) end
    local bound, actor_err = definition:with_actor(actor)
    if actor_err then return nil, actor_err end
    local scoped, scope_err = bound:with_scope(scope)
    if scope_err then return nil, scope_err end
    return scoped:open()
end

function M.discover(upload_id: string): (types.PageSet?, error?)
    local reader, err = open()
    if err then return nil, err end
    local info, info_err = reader:get_info({upload_id = upload_id})
    if info_err then return nil, info_err end
    if info.state ~= "paged" then return nil, M.error(info.state, "The upload has no readable physical page mapping") end
    if info.text_bound ~= true then return nil, M.error("page_text_revision_unbound", "Text is not bound to the page source revision") end
    local out: types.PageSet = {upload_id = upload_id, revision = info.revision, checksum = info.text.checksum,
        count = info.page_count, states = {}}
    while true do
        for _, page in ipairs(info.pages) do out.states[page.page] = page.state end
        if not info.next_cursor then break end
        info, info_err = reader:get_info({upload_id = upload_id, revision = out.revision, cursor = info.next_cursor})
        if info_err then return nil, info_err end
    end
    return out, nil
end

function M.read(source: types.PageSet, page: integer): (types.PageImage?, error?)
    if source.states[page] ~= "available" and source.states[page] ~= "renderable" then
        return nil, M.error("page_image_unavailable", "The requested physical page is unavailable")
    end
    local reader, err = open()
    if err then return nil, err end
    return reader:read_image({upload_id = source.upload_id, revision = source.revision, page = page})
end

-- Every chunk touching a scoped page must belong to the selected region. A
-- whole-page image cannot enforce a section boundary within that page.
function M.allowed(run: types.PageRun, field: types.Field, chunks: {types.Chunk}): ({integer}?, error?)
    local region = field.search_within == "sections" and run.regions[shapes.path(field)] or nil
    if field.search_within == "sections" and (not region or not run.config.retrieval.split_headings) then
        return nil, M.error("section_image_boundary_unavailable", "Physical page membership cannot isolate the selected sections")
    end
    local selected, pages, foreign = {}, {}, {}
    for _, ordinal in ipairs(region or {}) do selected[ordinal] = true end
    for _, chunk in ipairs(chunks) do
        for _, span in ipairs(chunk.page_spans) do
            if not span.page and region then
                return nil, M.error("section_image_boundary_unavailable", "A section has no proven physical page membership")
            end
            if span.page then
                if selected[chunk.ordinal] then pages[span.page] = true else foreign[span.page] = true end
            end
        end
    end
    local out = {}
    for page = 1, run.page_images.count do
        if (not run.page_range or (page >= run.page_range.first and page <= run.page_range.last)) and (not region or pages[page]) then
            if region and foreign[page] then
                return nil, M.error("section_image_boundary_unavailable", "The selected sections share a physical page with other sections")
            end
            out[#out + 1] = page
        end
    end
    if region and #out == 0 then
        return nil, M.error("section_image_boundary_unavailable", "The selected sections have no proven physical page membership")
    end
    return out, nil
end

return M
