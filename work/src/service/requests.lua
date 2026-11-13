-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Each contract method declares the request shape checked before the method acts.
local contract = require("contract")
local json = require("json")
local registry = require("registry")
local shape = require("shape")
local types = require("types")
local M = {}
local unpack_bytes = table.unpack :: ({ integer }, integer, integer) -> integer
local CONTRACT = "kickside.work:board"
local cache: { [string]: { [string]: { version: integer, schema: types.JsonObject } } } = {}

-- Definitions arrive as JSON text or byte integers, including JSON string literals.
local function schema_text(raw: unknown): (string?, error?)
    local text: string
    if type(raw) == "string" then
        text = raw
    elseif type(raw) == "table" then
        local bytes = raw :: { integer }
        local chunks: { string } = {}
        for first = 1, #bytes, 4096 do
            local last = math.min(first + 4095, #bytes)
            for i = first, last do
                local byte = bytes[i]
                if math.type(byte) ~= "integer" or byte < 0 or byte > 255 then
                    return nil, errors.new({ kind = errors.INTERNAL, message = "definition contains an invalid byte", details = { code = "contract_schema_invalid" } })
                end
            end
            chunks[#chunks + 1] = string.char(unpack_bytes(bytes, first, last))
        end
        text = table.concat(chunks)
    else
        return nil, errors.new({ kind = errors.INTERNAL, message = "definition is neither text nor bytes", details = { code = "contract_schema_invalid" } })
    end
    local trimmed = text:match("^%s*(.-)%s*$") or text
    if trimmed:sub(1, 1) == '"' then
        local inner, derr = json.decode(trimmed)
        if derr then return nil, errors.wrap(derr, "definition string literal is not JSON") end
        if type(inner) ~= "string" then return nil, errors.new({ kind = errors.INTERNAL, message = "definition literal holds no schema text", details = { code = "contract_schema_invalid" } }) end
        return inner :: string, nil
    end
    return trimmed, nil
end

local function definition(method: string, contract_id: string?): (types.JsonObject?, error?)
    local id = contract_id or CONTRACT
    local version, verr = registry.current_version()
    if verr then return nil, errors.wrap(verr, "contract registry version unavailable") end
    local revision = version:id()
    local methods = cache[id]
    local cached = methods and methods[method]
    if cached and cached.version == revision then return cached.schema, nil end
    local def, err = contract.get(id)
    if err then return nil, errors.wrap(err, "contract unavailable") end
    if not def then return nil, errors.new({ kind = errors.INTERNAL, message = "contract unavailable", details = { code = "internal" } }) end
    local m, merr = def:method(method)
    if merr then return nil, errors.wrap(merr, "contract has no method " .. method) end
    local schemas = m and m.input_schemas
    local first = type(schemas) == "table" and (schemas :: { unknown })[1] or nil
    if type(first) ~= "table" then return nil, errors.new({ kind = errors.INTERNAL, message = method .. " declares no input schema", details = { code = "contract_schema_invalid" } }) end
    local text, terr = schema_text((first :: { [string]: unknown }).definition)
    if terr or not text then return nil, terr end
    local decoded, derr = json.decode(text)
    if derr then return nil, errors.wrap(derr, method .. " input schema is not JSON") end
    if type(decoded) ~= "table" then return nil, errors.new({ kind = errors.INTERNAL, message = method .. " input schema is not an object", details = { code = "contract_schema_invalid" } }) end
    local schema = shape.tolerant(decoded :: types.JsonObject)
    if not methods then methods = {}; cache[id] = methods end
    methods[method] = { version = revision, schema = schema }
    return schema, nil
end

function M.parse(method: string, input: unknown, contract_id: string?): error?
    local schema, err = definition(method, contract_id)
    if err or not schema then return err end
    return shape.check(schema, input, method .. " request")
end
return M
