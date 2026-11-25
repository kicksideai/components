-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local base64 = require("base64")
local json = require("json")
local types = require("types")

local M = {}

local function content_type_header(headers: {[string]: string | {string}}): string?
    for name, value in pairs(headers) do
        if name:lower() == "content-type" then
            if type(value) == "string" then return value end
            return value[1]
        end
    end
    return nil
end

local function text_only(value: string): string
    return (value:gsub("[\r\n\t]+", " "):gsub("%c", ""):gsub("<[^>]*>", " ")
        :gsub("[\194][\128-\159]", ""):gsub("\226\128[\139-\143\170-\174]", "")
        :gsub("\226\129[\160-\175]", ""))
end

local WORD = "[%w_\128-\255]+"

local function redact_message(value: string, content: types.Rendered): string
    local text = value:gsub("[^%s<>()%[%],;]+@[^%s<>()%[%],;]+", "[redacted]")
    local words: {[string]: boolean} = {}
    for word in text:gmatch(WORD) do words[word:lower()] = false end
    for _, part in ipairs({content.subject, content.text or "", content.html or ""}) do
        for word in text_only(part):gmatch(WORD) do
            local key = word:lower()
            if words[key] == false then words[key] = true end
        end
    end
    return (text:gsub(WORD, function(word: string): string
        return words[word:lower()] and "[redacted]" or word
    end))
end

function M.clean_detail(value: unknown, content: types.Rendered?): string?
    if type(value) ~= "string" or not utf8.len(value) then return nil end
    local text = text_only(value):match("^%s*(.-)%s*$") :: string
    if content then text = redact_message(text, content) end
    if text == "" then return nil end
    if #text <= 512 then return text end
    local cut = utf8.offset(text, 0, 513) :: integer
    return text:sub(1, cut - 1)
end

local function redact(value: string, secret: string): string
    return (value:gsub(secret:gsub("(%W)", "%%%1"), "[redacted]"))
end

function M.response_detail(response: types.HttpResponse, credential: string, basic_user: string?): string?
    local content_type = content_type_header(response.headers) or ""
    local value
    local decoded, decode_err = json.decode(response.body)
    if not decode_err and type(decoded) == "table" then
        value = decoded.message
        if type(value) ~= "string" and type(decoded.errors) == "table" and type(decoded.errors[1]) == "table" then
            value = decoded.errors[1].message
        end
    elseif content_type:lower():match("^text/plain") or (content_type == "" and not response.body:match("^%s*[<{%[]")) then
        value = response.body
    end
    if type(value) ~= "string" then return nil end
    local text = redact(text_only(redact(value, credential)), credential)
    if basic_user then
        local encoded, err = base64.encode(basic_user .. ":" .. credential)
        if err then return nil end
        text = redact(text, encoded :: string)
    end
    text = text:gsub("([Bb][Ee][Aa][Rr][Ee][Rr]%s+)[^%s,;]+", "%1[redacted]")
        :gsub("([Bb][Aa][Ss][Ii][Cc]%s+)[^%s,;]+", "%1[redacted]")
        :gsub("(://)[^%s/@]+:[^%s/@]+@", "%1[redacted]@")
    return M.clean_detail(text)
end

return M
