-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- The page images extraction reads when it reads pages. Uploads stores them as
-- artifacts of the upload: a rendered image of every page that needed OCR, a
-- doc2md-extracted scan that stands for a whole page, and the original of an
-- image upload. page_images is the definition of a page image the rasterizer
-- and OCR share. Neither page_images nor trusted_reader checks the caller: a
-- run reads them only for the upload whose content the content provider has
-- already admitted it to in the read step.
local page_images = require("page_images")
local trusted_reader = require("trusted_reader")

local M = {}

-- One page image: its artifact and type.
type PageImage = { artifact_id: string, mime_type: string }

-- The page images of one upload: count is the document's page count, by_page
-- the image of each page that has one, available and unavailable the page
-- numbers with and without an image, in order.
type Manifest = { upload_id: string, count: integer, by_page: { [integer]: PageImage }, available: { integer }, unavailable: { integer } }

local function page_of(image: any): integer?
    local n = type(image.metadata) == "table" and math.tointeger(tonumber(image.metadata.page)) or nil
    if n and n >= 1 then return n end
    return nil
end

-- The page images of an upload whose text has page_count pages. An image
-- without a page number cannot be placed on a page and is not used.
function M.manifest(upload_id: string, page_count: integer): (Manifest?, error?)
    local by_page: { [integer]: PageImage } = {}
    local count = page_count
    local images = page_images.page_set(upload_id, page_images.DEFAULT_MIN_PAGE_BYTES)
    for _, image in ipairs(images) do
        local n = page_of(image)
        if n and not by_page[n] then
            by_page[n] = { artifact_id = tostring(image.artifact_id), mime_type = tostring(image.mime_type or "") }
            if n > count then count = n end
        end
    end
    if next(by_page) == nil and count <= 1 then
        local original, err = trusted_reader.source_image(upload_id)
        if err then return nil, errors.wrap(err, "page images unavailable") end
        if original then
            by_page[1] = { artifact_id = original.artifact_id, mime_type = original.content_type }
            count = 1
        end
    end
    local available, unavailable = {}, {}
    for n = 1, count do
        if by_page[n] then available[#available + 1] = n else unavailable[#unavailable + 1] = n end
    end
    return { upload_id = upload_id, count = count, by_page = by_page, available = available, unavailable = unavailable }, nil
end

-- The bytes and type of one page's image.
function M.image(manifest: Manifest, page: integer): (string?, string?, error?)
    local entry = manifest.by_page[page]
    if not entry then
        return nil, nil, errors.new({ kind = errors.NOT_FOUND, message = "page " .. page .. " has no page image", details = { code = "page_image_unavailable" } })
    end
    local image, err = trusted_reader.image_bytes(manifest.upload_id, entry.artifact_id)
    if err or not image then
        if type(err) == "userdata" then return nil, nil, errors.wrap(err :: error, "page " .. page .. " image unreadable") end
        return nil, nil, errors.new({ kind = errors.UNAVAILABLE, retryable = true, message = "page " .. page .. " image unreadable: " .. tostring(err) })
    end
    return image.bytes, image.content_type, nil
end

-- The pages chunks hold text on, in order: the pages of their page spans,
-- which record the text between markers, else their page range.
function M.of_chunks(chunks: { any }): { integer }
    local seen, out = {}, {}
    local function take(n: integer?) if n and not seen[n] then seen[n] = true; out[#out + 1] = n end end
    for _, c in ipairs(chunks) do
        local spanned = false
        for _, span in ipairs(c.page_spans or {}) do
            local n = math.tointeger(span.page)
            if n then take(n); spanned = true end
        end
        local first = math.tointeger(c.page_start)
        if not spanned and first then
            for n = first, (math.tointeger(c.page_end) or first) :: integer do take(n) end
        end
    end
    table.sort(out)
    return out
end

-- Page numbers as a phrase: "page 3" or "pages 3, 5".
function M.phrase(numbers: { integer }): string
    local labels = {}
    for i, n in ipairs(numbers) do labels[i] = tostring(n) end
    return (#numbers == 1 and "page " or "pages ") .. table.concat(labels, ", ")
end

return M
