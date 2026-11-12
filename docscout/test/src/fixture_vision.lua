-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- A vision fixture model. It reads the page images of a request (synthetic
-- PNGs whose text is in a tEXt chunk), each under its "[Page N]" label, and
-- answers extraction and visual support checks from what the pages print.
-- A field's value is the page line "<field name>: <value>". It refuses a
-- request whose text carries document text (marked DOCUMENT-TEXT), or that
-- puts a page after the field text. Other schemas go to the success fixture.
local base64 = require("base64")
local json = require("json")
local png = require("png")
local success = require("success")
local types = require("types")

local M = {}

local function pages_of(args: types.Args): ({ [integer]: string }?, string?, string?)
    local texts, current, after_fields, prose = {}, nil, false, {}
    for _, message in ipairs(args.messages) do
        if message.role == "user" then
            for _, part in ipairs(message.content or {}) do
                if part.type == "text" then
                    local label = part.text:match("^%[Page (%d+)%]$")
                    if label then
                        if after_fields then return nil, nil, "a page follows the field text" end
                        current = tonumber(label)
                    else
                        after_fields = true
                        prose[#prose + 1] = part.text
                    end
                    if part.text:find("DOCUMENT-TEXT", 1, true) then return nil, nil, "the request carries document text" end
                elseif part.type == "image" then
                    if not current then return nil, nil, "an image has no page label" end
                    local bytes = base64.decode(part.source.data)
                    texts[current] = png.text(bytes) or ""
                    current = nil
                end
            end
        end
    end
    return texts, table.concat(prose, "\n"), nil
end

local function line_of(texts: { [integer]: string }, name: string): (integer?, string?, string?)
    local numbers = {}
    for n in pairs(texts) do numbers[#numbers + 1] = n end
    table.sort(numbers)
    for _, n in ipairs(numbers) do
        for line in (texts[n] .. "\n"):gmatch("(.-)\n") do
            local value = line:match("^" .. name .. ": (.*)$")
            if value then return n, line, value end
        end
    end
    return nil, nil, nil
end

-- Walks the reply schema; leaf objects with found/evidence are extraction
-- items, those with quote_on_page are support checks.
local function answer(schema: types.Schema, path: string, texts: { [integer]: string }, prose: string): types.Json
    local props = schema.properties or {}
    if props.found and props.evidence then
        local name = path:match("([^.]+)$")
        local page, line, value = line_of(texts, name)
        if not page then return { found = false, value = props.value.type == "number" and 0 or "", confidence = 0, evidence = {} } end
        local typed: types.Json = value
        if props.value.type == "number" then typed = tonumber(value)
        elseif props.value.type == "boolean" then typed = value == "true"
        elseif props.value.type == "array" or props.value.type == "object" then typed = assert(json.decode(value)) end
        return { found = true, value = typed, confidence = 1, evidence = { { page = page, quote = line } } }
    end
    if props.quote_on_page then
        local block = prose:match("%- " .. path:gsub("%p", "%%%0") .. " %(.-\n  quotes: ([^\n]*)") or ""
        local on_page = "yes"
        for quote, page in block:gmatch("\"(.-)\" %(page (%d+)%)") do
            local text = texts[tonumber(page) :: integer]
            if not text then on_page = "unreadable" elseif not text:find(quote, 1, true) then on_page = "no" end
        end
        local out = { quote_on_page = on_page, states_value = path:find("rejected", 1, true) and "no" or "yes", reason = "Fixture check" }
        if path:find("unreadable", 1, true) then out.states_value = "unreadable" end
        if props.complete then out.complete = path:find("incomplete", 1, true) and props.complete.enum[2] or props.complete.enum[1] end
        return out
    end
    local out = {}
    for name, property in pairs(props) do out[name] = answer(property, path == "" and name or (path .. "." .. name), texts, prose) end
    return out
end

local function reads_pages(schema: types.Schema): boolean
    local encoded = tostring(json.encode(schema))
    return encoded:find('"quote_on_page"', 1, true) ~= nil or encoded:find('"page":{', 1, true) ~= nil
end

function M.structured(args: types.Args): (types.Reply?, error?)
    if args.options and args.options.reject_image then
        return nil, errors.new({kind = errors.INVALID, retryable = false, message = "Image request is rejected", details = {code = "fixture_image_rejected"}})
    end
    if not reads_pages(args.schema) then return success.structured(args) end
    local texts, prose, refusal = pages_of(args)
    if refusal then
        return nil, errors.new({ kind = errors.INVALID, retryable = false, message = "Vision fixture refuses: " .. refusal, details = { code = "fixture_vision_refusal" } })
    end
    local images = 0
    for _ in pairs(assert(texts)) do images = images + 1 end
    return { result = { data = answer(args.schema, "", assert(texts), assert(prose)) }, tokens = { prompt_tokens = 100 * images, completion_tokens = 10 } }, nil
end

M.generate, M.embed, M.status = success.generate, success.embed, success.status

return M
