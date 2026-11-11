-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Synthetic page images: a valid grayscale PNG whose printed text is carried
-- in a tEXt chunk, so a fixture vision model can read the page.
local compress = require("compress")

local M = {}

local CRC: { [integer]: integer } = {}
for i = 0, 255 do
    local c = i
    for _ = 1, 8 do
        if c & 1 == 1 then c = 0xEDB88320 ~ (c >> 1) else c = c >> 1 end
    end
    CRC[i] = c
end

local function crc32(s: string): integer
    local c = 0xFFFFFFFF
    for i = 1, #s do c = CRC[(c ~ s:byte(i)) & 0xFF] ~ (c >> 8) end
    return c ~ 0xFFFFFFFF
end

local function be32(n: integer): string
    return string.char((n >> 24) & 255, (n >> 16) & 255, (n >> 8) & 255, n & 255)
end

local function chunk(kind: string, data: string): string
    return be32(#data) .. kind .. data .. be32(crc32(kind .. data))
end

-- A page image printing lines: one dark bar per line on a white page.
function M.page(lines: { string }): string
    local width, height = 64, 8 * math.max(1, #lines)
    local rows = {}
    for y = 0, height - 1 do
        local ink = y % 8 >= 2 and y % 8 <= 5
        rows[#rows + 1] = "\0" .. string.rep(ink and "\40" or "\255", width)
    end
    local idat = assert(compress.zlib.encode(table.concat(rows)))
    return "\137PNG\r\n\26\n" .. chunk("IHDR", be32(width) .. be32(height) .. "\8\0\0\0\0") ..
        chunk("tEXt", "Text\0" .. table.concat(lines, "\n")) .. chunk("IDAT", idat) .. chunk("IEND", "")
end

-- The printed text of a page image made by page, or nil.
function M.text(png: string): string?
    if png:sub(1, 8) ~= "\137PNG\r\n\26\n" then return nil end
    local at = 9
    while at + 7 <= #png do
        local a, b, c, d = png:byte(at, at + 3)
        local length = (a << 24) | (b << 16) | (c << 8) | d
        local kind = png:sub(at + 4, at + 7)
        if kind == "tEXt" then return (png:sub(at + 8, at + 7 + length):match("^Text%z(.*)$")) end
        at = at + 12 + length
    end
    return nil
end

return M
