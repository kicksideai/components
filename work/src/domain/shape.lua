-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Schema-directed parsing of decoded JSON. Lua has one empty table for both {}
-- and [], so an empty list may arrive where a schema expects an object and the
-- other way round. tolerant returns a copy of a schema in which every position
-- that admits an empty list also admits an empty object and every position that
-- admits an empty object also admits an empty list, and an empty schema node
-- (decoded from {}) reads as any value; check validates a value against it and
-- answers invalid with the path of the first mismatch.
local json = require("json")
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

-- check validates value against a tolerant schema; what names the value in the error.
function M.check(schema: types.JsonObject, value: unknown, what: string): error?
    local ok, err = json.validate(schema, value)
    if err or not ok then return errors.new({ details = { code = "invalid_shape" }, kind = errors.INVALID, message = what .. " is malformed: " .. tostring(err) }) end
    return nil
end

return M
