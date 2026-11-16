-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Request parsing for the kickside.pim:catalog methods. Each method's input
-- schema in the contract definition (_index.yaml) is the single statement of
-- its request shape; parse checks a request against it before the method acts,
-- so a malformed request ends as invalid at the boundary.
local contract = require("contract")
local json = require("json")
local registry = require("registry")
local shape = require("shape")
local types = require("types")

local M = {}

local CONTRACT = "kickside.pim:catalog"

local function prepare(schema: types.JsonObject): types.JsonObject
    return shape.tolerant(schema)
end

type Cached = { version: integer, schema: types.JsonObject }
local cache: { [string]: { [string]: Cached } } = {}

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
            local chars: {string}={}
            for i = first, last do
                local byte = bytes[i]
                if math.type(byte) ~= "integer" or byte < 0 or byte > 255 then
                    return nil, errors.new({ kind = errors.INTERNAL, retryable = false, message = "definition contains an invalid byte", details = { code = "contract_schema_invalid" } })
                end
                chars[#chars+1]=string.char(byte)
            end
            chunks[#chunks + 1] = table.concat(chars)
        end
        text = table.concat(chunks)
    else
        return nil, errors.new({ kind = errors.INTERNAL, retryable = false, message = "definition is neither text nor bytes", details = { code = "contract_schema_invalid" } })
    end
    local trimmed = text:match("^%s*(.-)%s*$") or text
    if trimmed:sub(1, 1) == '"' then
        local inner, derr = json.decode(trimmed)
        if derr then return nil, errors.wrap(derr, "definition string literal is not JSON") end
        if type(inner) ~= "string" then return nil, errors.new({ kind = errors.INTERNAL, retryable = false, message = "definition literal holds no schema text", details = { code = "contract_schema_invalid" } }) end
        return inner :: string, nil
    end
    return trimmed, nil
end

local function definition(method: string, side: string): (types.JsonObject?, error?)
    local version, verr = registry.current_version()
    if verr then return nil, errors.wrap(verr, "contract registry version unavailable") end
    local revision = version:id()
    local methods = cache[CONTRACT]
    local key = method .. ":" .. side
    local cached = methods and methods[key]
    if cached and cached.version == revision then return cached.schema, nil end
    local def, err = contract.get(CONTRACT)
    if err then return nil, errors.wrap(err, "contract unavailable") end
    if not def then return nil, errors.new({ kind = errors.UNAVAILABLE, retryable = true, message = "contract unavailable", details = { code = "contract_unavailable" } }) end
    local m, merr = def:method(method)
    if merr then return nil, errors.wrap(merr, "contract has no method " .. method) end
    local schemas = m and m[side .. "_schemas"]
    local first = type(schemas) == "table" and (schemas :: { unknown })[1] or nil
    if type(first) ~= "table" then return nil, errors.new({ kind = errors.INTERNAL, retryable = false, message = method .. " declares no " .. side .. " schema", details = { code = "contract_schema_invalid" } }) end
    local text, terr = schema_text((first :: { [string]: unknown }).definition)
    if terr or not text then return nil, terr end
    local decoded, derr = json.decode(text)
    if derr then return nil, errors.wrap(derr, method .. " " .. side .. " schema is not JSON") end
    if type(decoded) ~= "table" then return nil, errors.new({ kind = errors.INTERNAL, retryable = false, message = method .. " " .. side .. " schema is not an object", details = { code = "contract_schema_invalid" } }) end
    local schema = side == "input" and prepare(decoded :: types.JsonObject) or decoded :: types.JsonObject
    if not methods then methods = {}; cache[CONTRACT] = methods end
    methods[key] = { version = revision, schema = schema }
    return schema, nil
end

-- parse checks input against the input schema of method.
function M.parse(method: string, input: unknown): error?
    local berr = shape.budget(input)
    if berr then return berr end
    local schema, err = definition(method, "input")
    if err or not schema then return err end
    local value: unknown = input
    if value == nil then value = {} end
    return shape.check(schema, value, method .. " request")
end

-- output preserves the JSON object fields declared by the contract answer.
function M.output<T>(method: string, output: T): (T?, error?)
    local schema, err = definition(method, "output")
    if err or not schema then return nil, err end
    return shape.objects(schema, output) :: T, nil
end

-- check_output checks a result against the output schema of method.
function M.check_output(method: string, output: unknown): error?
    local schema, err = definition(method, "output")
    if err or not schema then return err end
    return shape.check(shape.tolerant(schema), output, method .. " result")
end

return M
