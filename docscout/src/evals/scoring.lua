-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Scores an extracted value against the expected one, from 0 to 1, by field
-- type. A case with no expected value scores 1 when the field is missing.
local shapes = require("shapes")

local M = {}

local function absent(v: any): boolean
    return v == nil or (type(v) == "string" and shapes.trim(v) == "")
end

-- Numbers as printed in documents: thousands separators, currency and spacing removed.
local function number_of(v: any): number?
    if type(v) == "number" then return v end
    if type(v) ~= "string" then return nil end
    local digits = v:gsub("[^%d%.%-]", "")
    return tonumber(digits)
end

local function same_number(a: number, b: number): boolean
    return math.abs(a - b) <= 1e-9 * math.max(1, math.abs(a), math.abs(b))
end

-- Dates compare by their digits so 2026-03-14 matches 2026/03/14.
local function date_of(v: any): string
    return (tostring(v):gsub("%D", ""))
end

local function words(s: string): { [string]: integer }
    local bag = {}
    for word in shapes.normalize(s):gmatch("%S+") do bag[word] = (bag[word] or 0) + 1 end
    return bag
end

-- Word-overlap F1 between two texts; identical texts score 1.
local function text_score(expected: string, got: string): number
    local e, g = words(expected), words(got)
    local overlap, ne, ng = 0, 0, 0
    for word, n in pairs(e) do ne = ne + n; overlap = overlap + math.min(n, g[word] or 0) end
    for _, n in pairs(g) do ng = ng + n end
    if ne == 0 or ng == 0 then return 0 end
    local precision, recall = overlap / ng, overlap / ne
    if precision + recall == 0 then return 0 end
    return 2 * precision * recall / (precision + recall)
end

local scalar

-- Mean score over the expected keys; extra keys in the extracted object do not count.
local function object_score(expected: any, got: any): number
    if type(got) ~= "table" then return 0 end
    local total, n = 0, 0
    for key, value in pairs(expected) do
        n = n + 1
        total = total + scalar(value, got[key])
    end
    if n == 0 then return 1 end
    return total / n
end

-- Type-inferred comparison for list items and object members.
scalar = function(expected: any, got: any): number
    if absent(expected) then return absent(got) and 1 or 0 end
    if absent(got) then return 0 end
    if type(expected) == "boolean" then return expected == got and 1 or 0 end
    if type(expected) == "number" then
        local n = number_of(got)
        return n ~= nil and same_number(expected, n) and 1 or 0
    end
    if type(expected) == "table" then
        if #expected > 0 then return M.list(expected, got, nil) end
        return object_score(expected, got)
    end
    return text_score(tostring(expected), tostring(got))
end

-- Order-free F1 over items: each extracted item pairs with the expected item it
-- matches best, and each expected item is used once.
function M.list(expected: any, got: any, item_type: string?): number
    if type(got) ~= "table" then return 0 end
    if #expected == 0 then return #got == 0 and 1 or 0 end
    if #got == 0 then return 0 end
    local used, matched = {}, 0
    for _, g in ipairs(got) do
        local best, best_i = 0, nil
        for i, e in ipairs(expected) do
            if not used[i] then
                local s = item_type and M.value(item_type, e, g, {}) or scalar(e, g)
                if s > best then best, best_i = s, i end
            end
        end
        if best_i then used[best_i] = true; matched = matched + best end
    end
    local precision, recall = matched / #got, matched / #expected
    if precision + recall == 0 then return 0 end
    return 2 * precision * recall / (precision + recall)
end

-- Score of one value of a field type. field supplies item_type for lists.
function M.value(kind: string, expected: any, got: any, field: any): number
    if absent(expected) then return absent(got) and 1 or 0 end
    if absent(got) then return 0 end
    if kind == "number" then
        local e, g = number_of(expected), number_of(got)
        return e ~= nil and g ~= nil and same_number(e, g) and 1 or 0
    end
    if kind == "boolean" then return expected == got and 1 or 0 end
    if kind == "date" then return date_of(expected) == date_of(got) and 1 or 0 end
    if kind == "enum" then return shapes.normalize(tostring(expected)) == shapes.normalize(tostring(got)) and 1 or 0 end
    if kind == "list" then
        if type(expected) ~= "table" then return 0 end
        return M.list(expected, got, field.item_type)
    end
    if kind == "object" then
        if type(expected) ~= "table" then return 0 end
        return object_score(expected, got)
    end
    return text_score(tostring(expected), tostring(got))
end

-- Scores every field of one case. values: the run's fields by name.
function M.case(fields: { any }, expected: any, values: { [string]: any }): { any }
    local out = {}
    for _, f in ipairs(fields) do
        local got = values[f.name]
        local value = nil
        if got and not got.missing then value = got.value end
        out[#out + 1] = {
            field = f.name, expected = expected[f.name], value = value,
            score = M.value(f.type, expected[f.name], value, f),
            verified = got ~= nil and got.verified == true,
        }
    end
    return out
end

-- Per-field accuracy over scored cases.
function M.metrics(fields: { any }, cases: { { any } }): { any }
    local out = {}
    for i, f in ipairs(fields) do
        local total, verified = 0, 0
        for _, scored in ipairs(cases) do
            total = total + scored[i].score
            if scored[i].verified then verified = verified + 1 end
        end
        local n = math.max(1, #cases)
        out[#out + 1] = { field = f.name, accuracy = total / n, verified = verified / n }
    end
    return out
end

return M
