-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Schema-directed parsing of decoded JSON. Lua has one empty table for both {}
-- and [], so an empty list may arrive where a schema expects an object and the
-- other way round. tolerant returns a copy of a schema in which every position
-- that admits an empty list also admits an empty object and every position that
-- admits an empty object also admits an empty list, and an empty schema node
-- (decoded from {}) reads as any value; check validates a value against it and
-- answers invalid with the path of the first mismatch.
local json = require("json")
local consts = require("consts")
local types = require("types")

local M = {}

local EMPTY_OBJECT: types.JsonObject = { type = "object", maxProperties = 0 }
local EMPTY_ARRAY: types.JsonObject = { type = "array", maxItems = 0 }

local function admits(t: unknown, kind: string): boolean
    if t == kind then return true end
    if type(t) == "table" then
        for _, v in ipairs(t :: { unknown }) do if v == kind then return true end end
    end
    return false
end

-- empty_list_allowed answers whether a list schema admits zero items.
local function empty_list_allowed(node: { [unknown]: unknown }): boolean
    local least = node.minItems
    return not (type(least) == "number" and least > 0)
end

-- empty_object_allowed answers whether an object schema admits zero keys.
local function empty_object_allowed(node: { [unknown]: unknown }): boolean
    local required = node.required
    if type(required) == "table" and next(required :: { [unknown]: unknown }) ~= nil then return false end
    local least = node.minProperties
    return not (type(least) == "number" and least > 0)
end

-- LISTS are the keywords whose value is a list of names;
-- MAPS are the keywords whose value maps names to schemas, where an empty map
-- constrains nothing.
local LISTS: { [string]: boolean } = { required = true, enum = true }
local MAPS: { [string]: boolean } = { properties = true, patternProperties = true, definitions = true, ["$defs"] = true,
    dependentSchemas = true }

local function copy(node: unknown, key: unknown): unknown
    if type(node) ~= "table" then return node end
    if next(node :: { [unknown]: unknown }) == nil and not LISTS[tostring(key)] then return true end
    local out: { [unknown]: unknown } = {}
    for k, v in pairs(node :: { [unknown]: unknown }) do
        if MAPS[tostring(k)] and type(v) == "table" and next(v :: { [unknown]: unknown }) == nil then
            out[k] = nil
        elseif MAPS[tostring(k)] and type(v) == "table" then
            local entries: { [unknown]: unknown } = {}
            for name, sub in pairs(v :: { [unknown]: unknown }) do entries[name] = copy(sub, name) end
            out[k] = entries
        else
            out[k] = copy(v, k)
        end
    end
    local list, object = admits(out.type, "array"), admits(out.type, "object")
    if list and not object and empty_list_allowed(out) then return { anyOf = { out, EMPTY_OBJECT } } end
    if object and not list and empty_object_allowed(out) then return { anyOf = { out, EMPTY_ARRAY } } end
    return out
end

-- tolerant returns a copy of schema that admits an empty table wherever it
-- admits an array.
function M.tolerant(schema: types.JsonObject): types.JsonObject
    return copy(schema, nil) :: types.JsonObject
end

-- budget bounds the complete caller input before recursive schema or domain work.
function M.budget(input: unknown): error?
    local remaining = consts.LIMITS.request_bytes
    local function charge(n: integer): boolean
        remaining = remaining - n
        return remaining >= 0
    end
    local function visit(value: unknown, depth: integer): boolean
        if type(value) ~= "table" then
            if type(value) == "string" and #value > remaining then return false end
            local encoded, err = json.encode(value)
            return not err and encoded ~= nil and charge(#encoded)
        end
        if depth > consts.LIMITS.request_depth or not charge(2) then return false end
        local node = value :: { [unknown]: unknown }
        local array = #value > 0
        local count = 0
        for key, child in pairs(node) do
            count = count + 1
            if count > consts.LIMITS.request_entries then return false end
            if count > 1 and not charge(1) then return false end
            if not array then
                if not visit(tostring(key), depth) or not charge(1) then return false end
            end
            if not visit(child, depth + 1) then return false end
        end
        return true
    end
    if not visit(input, 1) then
        return errors.new({ kind = errors.INVALID, retryable = false, message = "request exceeds its byte, nesting or collection budget",
            details = { code = "request_budget_exceeded" } })
    end
    return nil
end

-- check validates value against a tolerant schema; what names the value in the error.
function M.check(schema: types.JsonObject, value: unknown, what: string): error?
    local ok, err = json.validate(schema, value)
    if err or not ok then return errors.new({ details = { code = "invalid_request" }, kind = errors.INVALID, message = what .. " is malformed: " .. tostring(err) }) end
    return nil
end

-- array_length rejects object keys and holes instead of truncating at ipairs.
function M.array_length(value: unknown): integer?
    if type(value) ~= "table" then return nil end
    local count, maximum = 0, 0
    for key in pairs(value :: { [unknown]: unknown }) do
        if type(key) ~= "number" or math.tointeger(key) == nil or key < 1 then return nil end
        count = count + 1
        maximum = math.max(maximum, key)
    end
    if count ~= maximum then return nil end
    return count
end

-- findings validates the shared check/type finding envelope, including every entry.
function M.findings(value: unknown): boolean
    if M.array_length(value) == nil then return false end
    for _, raw in ipairs(value :: { unknown }) do
        if type(raw) ~= "table" then return false end
        local f = raw :: { [string]: unknown }
        if type(f.message) ~= "string" or f.message == "" then return false end
        for _, key in ipairs({ "code", "attribute", "context", "check", "set" }) do
            if f[key] ~= nil and type(f[key]) ~= "string" then return false end
        end
    end
    return true
end

return M
