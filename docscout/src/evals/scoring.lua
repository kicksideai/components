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

-- Words for overlap scoring: punctuation separates words here, unlike quote matching.
local function words(s: string): { [string]: integer }
    local bag = {}
    for word in shapes.normalize(s):gmatch("[^%s%p]+") do bag[word] = (bag[word] or 0) + 1 end
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

-- Objects score every declared property, including properties absent from the case.
local function object_score(field: any, expected: any, got: any): number
    if type(expected) ~= "table" or type(got) ~= "table" then return 0 end
    local total, n = 0, 0
    for _, p in ipairs(field.properties) do
        n = n + 1
        total = total + M.value(p.type, expected[p.name], got[p.name], p)
    end
    return n == 0 and 1 or total / n
end

-- Largest total weight of a one-to-one pairing between rows and columns of
-- weights (each in 0..1), by the Hungarian method on a square cost matrix.
-- u, v, p, way and minv hold an entry for every index 0..n before use.
local function best_pairing(weights: { { number } }, rows: integer, cols: integer): number
    local n = math.max(rows, cols)
    local function cost(i: integer, j: integer): number
        if i > rows or j > cols then return 1 end
        return 1 - weights[i][j]
    end
    local u: { [integer]: number }, v: { [integer]: number } = {}, {}
    local p: { [integer]: integer }, way: { [integer]: integer } = {}, {}
    for i = 0, n do u[i], v[i], p[i], way[i] = 0, 0, 0, 0 end
    for i = 1, n do
        p[0] = i
        local j0 = 0
        local minv: { [integer]: number }, used: { [integer]: boolean } = {}, {}
        for j = 0, n do minv[j], used[j] = math.huge, false end
        repeat
            used[j0] = true
            local i0, delta, j1 = p[j0], math.huge, 0
            for j = 1, n do
                if not used[j] then
                    local cur = cost(i0, j) - (u[i0] :: number) - (v[j] :: number)
                    if cur < (minv[j] :: number) then minv[j], way[j] = cur, j0 end
                    if (minv[j] :: number) < delta then delta, j1 = minv[j] :: number, j end
                end
            end
            for j = 0, n do
                if used[j] then u[p[j]] = (u[p[j]] :: number) + delta; v[j] = (v[j] :: number) - delta else minv[j] = (minv[j] :: number) - delta end
            end
            j0 = j1
        until p[j0] == 0
        repeat
            local j1 = way[j0]
            p[j0] = p[j1]
            j0 = j1
        until j0 == 0
    end
    local total = 0
    for j = 1, n do
        local i = p[j]
        if i >= 1 and i <= rows and j <= cols then total = total + weights[i][j] end
    end
    return total
end

-- Order-free F1 over items: expected and extracted items pair one to one so
-- that the summed item scores are as large as possible.
function M.list(expected: any, got: any, item: any): number
    if type(got) ~= "table" then return 0 end
    if #expected == 0 then return #got == 0 and 1 or 0 end
    if #got == 0 then return 0 end
    local weights: { { number } } = {}
    for i, e in ipairs(expected) do
        local row: { number } = {}
        for j, g in ipairs(got) do row[j] = M.value(item.type, e, g, item) end
        weights[i] = row
    end
    local matched = best_pairing(weights, #expected, #got)
    local precision, recall = matched / #got, matched / #expected
    if precision + recall == 0 then return 0 end
    return 2 * precision * recall / (precision + recall)
end

-- Score of one value using its declared recursive shape.
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
        return M.list(expected, got, field.item)
    end
    if kind == "object" then
        if type(expected) ~= "table" then return 0 end
        return object_score(field, expected, got)
    end
    return text_score(tostring(expected), tostring(got))
end

-- Scores every field of one case. values: the run's fields by full path. A field
-- the case leaves out is correct only when the run reports it missing.
function M.case(fields: { any }, expected: any, values: { [string]: any }): { any }
    local out = {}
    for _, f in ipairs(fields) do
        local path = shapes.path(f)
        local wanted = shapes.get(expected, path)
        local got = values[path]
        local found = got ~= nil and not got.missing
        local value = nil
        if found then value = got.value end
        local score
        if got and got.failed then score = 0
        elseif wanted == nil then score = found and 0 or 1
        elseif not found then score = 0
        else score = M.value(f.type, wanted, value, f) end
        out[#out + 1] = { field = path, expected = wanted, value = value, score = score, verified = got ~= nil and not got.failed and got.verified == true, failed = got ~= nil and got.failed == true, error = got and got.error }
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
        out[#out + 1] = { field = shapes.path(f), accuracy = total / n, verified = verified / n }
    end
    return out
end

return M
