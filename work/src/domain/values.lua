-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Canonical value forms, equality keys and order values. Key and order are
-- defined only by forms, so every board indexes and compares alike.
local json = require("json")
local types = require("types")

local M = {}

-- canonical renders a value as JSON with sorted object keys, so equal values
-- always produce equal text (hashing, digests, equality).
function M.canonical(v: unknown): string
    if type(v) ~= "table" then return json.encode(v) end
    local count = 0
    for _ in pairs(v) do count = count + 1 end
    if count == #v then
        local out: { string } = {}
        for i = 1, #v do out[i] = M.canonical(v[i]) end
        return "[" .. table.concat(out, ",") .. "]"
    end
    local keys: { string } = {}
    local by_name: { [string]: unknown } = {}
    for k in pairs(v) do
        local name = tostring(k)
        keys[#keys + 1] = name
        by_name[name] = k
    end
    table.sort(keys)
    local out: { string } = {}
    for _, name in ipairs(keys) do out[#out + 1] = json.encode(name) .. ":" .. M.canonical(v[by_name[name]]) end
    return "{" .. table.concat(out, ",") .. "}"
end

function M.equal(a: unknown, b: unknown): boolean
    return M.canonical(a) == M.canonical(b)
end

local MAX_SAFE = 9007199254740991
local MAX_KEY_BYTES = 256
local MAX_MEMBERS = 1000

local function invalid(message: string): error
    return errors.new({ details = { code = "invalid_value" }, kind = errors.INVALID, message = message })
end

-- valid_text accepts well-formed UTF-8, refusing overlongs, surrogates and NUL.
local function valid_text(s: string): boolean
    local i, n = 1, #s
    while i <= n do
        local c = s:byte(i)
        local len, min
        if c == 0 then return false
        elseif c < 0x80 then len, min = 1, 0
        elseif c >= 0xC2 and c <= 0xDF then len, min = 2, 0x80
        elseif c >= 0xE0 and c <= 0xEF then len, min = 3, 0x800
        elseif c >= 0xF0 and c <= 0xF4 then len, min = 4, 0x10000
        else return false end
        if i + len - 1 > n then return false end
        local cp = len == 1 and c or (c & (0x7F >> len))
        for k = 1, len - 1 do
            local b = s:byte(i + k)
            if b < 0x80 or b > 0xBF then return false end
            cp = (cp << 6) | (b & 0x3F)
        end
        if cp < min or cp > 0x10FFFF or (cp >= 0xD800 and cp <= 0xDFFF) then return false end
        i = i + len
    end
    return true
end

local function reduce_dec(m: integer, e: integer): (integer, integer)
    if m == 0 then return 0, 0 end
    while m % 10 == 0 do
        m = m // 10
        e = e + 1
    end
    return m, e
end

local function parse_dec(raw: unknown): (types.Dec?, error?)
    local m: integer?, e: integer?
    if type(raw) == "table" then
        local rm, re = (raw :: { [string]: unknown }).m, (raw :: { [string]: unknown }).e
        if type(rm) ~= "number" or type(re) ~= "number" then return nil, invalid("decimal must be {m, e} integers") end
        m, e = math.tointeger(rm), math.tointeger(re)
        if m == nil or e == nil then return nil, invalid("decimal must be {m, e} integers") end
    elseif type(raw) == "number" then
        local i = math.tointeger(raw)
        if i == nil then return nil, invalid("decimal numbers must be sent as strings or {m, e}") end
        m, e = i, 0
    elseif type(raw) == "string" then
        local sign, int, frac = raw:match("^([%-]?)(%d+)%.?(%d*)$")
        if not int then return nil, invalid("invalid decimal: " .. raw) end
        local digits = (int .. frac):gsub("^0+(%d)", "%1")
        m = math.tointeger(tonumber(digits))
        if m == nil then return nil, invalid("decimal out of range: " .. raw) end
        if sign == "-" then m = -m end
        e = -#frac
    else
        return nil, invalid("decimal value required")
    end
    m, e = reduce_dec(m, e)
    if math.abs(m) >= 1000000000000000 or e < -12 or e > 12 then
        return nil, invalid("decimal out of range")
    end
    return { m = m, e = e }, nil
end

local function dec_string(v: types.Dec): string
    local m, e = v.m, v.e
    if m == 0 then return "0" end
    local sign = m < 0 and "-" or ""
    local digits = tostring(math.abs(m))
    if e >= 0 then return sign .. digits .. string.rep("0", e) end
    local places = -e
    if #digits <= places then digits = string.rep("0", places - #digits + 1) .. digits end
    return sign .. digits:sub(1, #digits - places) .. "." .. digits:sub(#digits - places + 1)
end

local DAYS: { integer } = { 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 }

local function valid_date(y: integer, mo: integer, d: integer): boolean
    if mo < 1 or mo > 12 or d < 1 then return false end
    local leap = (y % 4 == 0 and y % 100 ~= 0) or y % 400 == 0
    local days = DAYS[mo]
    if not days then return false end
    local max = days + ((mo == 2 and leap) and 1 or 0)
    return d <= max
end

-- valid_time accepts a calendar date or an RFC3339 UTC instant.
local function valid_time(s: string): boolean
    local y, mo, d = s:match("^(%d%d%d%d)%-(%d%d)%-(%d%d)$")
    if y then return valid_date(math.tointeger(tonumber(y)) :: integer, math.tointeger(tonumber(mo)) :: integer, math.tointeger(tonumber(d)) :: integer) end
    local stem = s:match("^(.-)%.%d+Z$") or s:match("^(.-)Z$")
    local ty, tmo, td, h, mi, sec = (stem or ""):match("^(%d%d%d%d)%-(%d%d)%-(%d%d)T(%d%d):(%d%d):(%d%d)$")
    if not ty then return false end
    if not valid_date(math.tointeger(tonumber(ty)) :: integer, math.tointeger(tonumber(tmo)) :: integer, math.tointeger(tonumber(td)) :: integer) then
        return false
    end
    return (tonumber(h) :: number) < 24 and (tonumber(mi) :: number) < 60 and (tonumber(sec) :: number) < 60
end

local normalize_form

-- multiply two reduced decimals exactly; a product beyond int64 is an error.
local function dec_mul(a: types.Dec, b: types.Dec): (types.Dec?, error?)
    if a.m ~= 0 and math.abs(b.m) > math.maxinteger // math.abs(a.m) then
        return nil, invalid("quantity is out of range in the canonical unit")
    end
    local m, e = reduce_dec(a.m * b.m, a.e + b.e)
    return { m = m, e = e }, nil
end

-- canonical_quantity converts a quantity value to the field's canonical unit.
local function canonical_quantity(value: types.Quantity, config: types.FieldConfig): (types.Dec?, error?)
    local factor = (config.units or {})[value.u]
    if not factor then return nil, invalid("unknown unit " .. tostring(value.u)) end
    local f, err = parse_dec(factor)
    if err or not f then return nil, err end
    return dec_mul(value.v, f)
end

-- round_to rounds a decimal half-up to the given scale and returns the int64 order.
local function round_to(d: types.Dec, scale: integer): (integer?, error?)
    local m, shift = d.m, d.e + scale
    if shift >= 0 then
        for _ = 1, shift do
            if math.abs(m) > math.maxinteger // 10 then return nil, invalid("value exceeds the indexed range") end
            m = m * 10
        end
        return m, nil
    end
    local divisor = 1
    for _ = 1, -shift do
        if divisor > math.maxinteger // 10 then return 0, nil end
        divisor = divisor * 10
    end
    local q = math.abs(m) // divisor
    local r = math.abs(m) % divisor
    if r * 2 >= divisor then q = q + 1 end
    return m < 0 and -q or q, nil
end

-- time_key gives every instant nine fractional digits, so keys compare in time
-- order as text. A date stays a date.
local function time_key(text: string): string
    local stem, fraction = text:match("^(.-T%d%d:%d%d:%d%d)%.?(%d*)Z$")
    if not stem then return text end
    return stem .. "." .. (fraction .. "000000000"):sub(1, 9) .. "Z"
end


local function normalize_scalar(form: string, raw: unknown, config: types.FieldConfig): (types.Scalar?, error?)
    if form == "text" then
        if type(raw) ~= "string" then return nil, invalid("text value required") end
        if not valid_text(raw) then return nil, invalid("text must be valid UTF-8 without NUL") end
        return raw, nil
    elseif form == "int" then
        local i: integer? = nil
        if type(raw) == "number" then
            i = math.tointeger(raw)
        elseif type(raw) == "string" and (raw:match("^%-?%d+$") or raw:match("^%-?%d+%.0*$")) then
            i = math.tointeger(tonumber((raw:gsub("%.0*$", ""))))
        end
        if i == nil or i > MAX_SAFE or i < -MAX_SAFE then return nil, invalid("integer value required") end
        return i, nil
    elseif form == "dec" then
        return parse_dec(raw)
    elseif form == "bool" then
        if type(raw) ~= "boolean" then return nil, invalid("boolean value required") end
        return raw, nil
    elseif form == "time" then
        if type(raw) ~= "string" or not valid_time(raw) or #(raw:match("%.(%d+)Z$") or "") > 9 then return nil, invalid("date or RFC3339 UTC time required") end
        return time_key(raw), nil
    elseif form == "ref" then
        if type(raw) ~= "table" or type(raw.ref) ~= "table" then return nil, invalid("reference {ref: [kind, id]} required") end
        local kind, id = raw.ref[1], raw.ref[2]
        if type(kind) ~= "string" or kind == "" then return nil, invalid("reference kind required") end
        if not config.target then return nil, invalid("reference field declares no target") end
        if config.target ~= kind then return nil, invalid("reference must target " .. tostring(config.target)) end
        if type(id) ~= "string" or id == "" then return nil, invalid("reference id required") end
        return { ref = { kind, id } }, nil
    elseif form == "quantity" then
        local amount, unit
        if type(raw) == "string" then
            amount, unit = raw:match("^%s*([%-]?[%d%.]+)%s*(%S+)%s*$")
        elseif type(raw) == "table" then
            amount, unit = raw.value or raw.v, raw.unit or raw.u
        end
        if amount == nil or type(unit) ~= "string" then return nil, invalid("quantity needs an amount and a unit") end
        if not (config.units or {})[unit] then return nil, invalid("unknown unit " .. unit) end
        local d, derr = parse_dec(amount)
        if derr then return nil, derr end
        return { v = d, u = unit }, nil
    elseif form == "record" then
        if type(raw) ~= "table" then return nil, invalid("record value required") end
        local members = config.members
        if type(members) ~= "table" then return nil, invalid("record type declares no members") end
        local out: types.Record = {}
        for name, value in pairs(raw) do
            local member = members[name]
            if type(member) ~= "table" then return nil, invalid("unknown record member: " .. tostring(name)) end
            local v, err = normalize_form(member.form, member.cardinality or "one", value, member)
            if err then return nil, invalid(tostring(name) .. ": " .. tostring(err)) end
            out[name] = v
        end
        return out, nil
    end
    return nil, invalid("unknown form: " .. tostring(form))
end


function M.key(form: string, value: types.Scalar, config: types.FieldConfig?): (string?, error?)
    local cfg: types.FieldConfig = config or {}
    local key: string
    if form == "text" then
        local text = value :: string
        key = cfg.case == "insensitive" and text:lower() or text
    elseif form == "int" then
        key = tostring(value :: integer)
    elseif form == "dec" then
        key = dec_string(value :: types.Dec)
    elseif form == "bool" then
        key = (value :: boolean) and "true" or "false"
    elseif form == "time" then
        key = time_key(value :: string)
    elseif form == "ref" then
        local ref = (value :: types.Ref).ref
        key = ref[1] .. ":" .. ref[2]
    elseif form == "quantity" then
        local c, err = canonical_quantity(value :: types.Quantity, cfg)
        if err or not c then return nil, err end
        key = dec_string(c) .. " " .. tostring(cfg.canonical)
    else
        return nil, invalid("form " .. form .. " has no equality key")
    end
    if #key > MAX_KEY_BYTES then return nil, invalid("value exceeds the 256-byte key limit") end
    return key, nil
end

-- order returns the int64 order value at the field's declared scale.
function M.order(form: string, value: types.Scalar, config: types.FieldConfig?): (integer?, error?)
    local cfg: types.FieldConfig = config or {}
    local scale = cfg.scale or 0
    local m: integer, e: integer
    if form == "quantity" then
        local c, err = canonical_quantity(value :: types.Quantity, cfg)
        if err or not c then return nil, err end
        return round_to(c, scale)
    end
    if form == "int" then
        m, e = value :: integer, 0
    elseif form == "dec" then
        local d = value :: types.Dec
        m, e = d.m, d.e
    else
        return nil, invalid("form " .. form .. " has no order value")
    end
    local shift = e + scale
    local out = m
    if shift >= 0 then
        for _ = 1, shift do
            if math.abs(out) > math.maxinteger // 10 then return nil, invalid("value exceeds the indexed range") end
            out = out * 10
        end
    else
        for _ = 1, -shift do
            if out % 10 ~= 0 then return nil, invalid("value has more precision than the field scale") end
            out = out // 10
        end
    end
    local range = cfg.range
    if type(range) == "table" then
        local factor = 1
        for _ = 1, scale do factor = factor * 10 end
        if out < (range[1] :: integer) * factor or out > (range[2] :: integer) * factor then
            return nil, invalid("value is outside the field range")
        end
    end
    return out, nil
end

normalize_form = function(form: string, cardinality: string, raw: unknown, config: types.FieldConfig): (types.Value?, error?)
    if cardinality == "one" then return normalize_scalar(form, raw, config) end
    if type(raw) ~= "table" then return nil, invalid(cardinality .. " value must be an array") end
    if #raw > MAX_MEMBERS then return nil, invalid("too many members") end
    local out, keys = {}, {}
    for i = 1, #raw do
        local v, err = normalize_scalar(form, raw[i], config)
        if err then return nil, err end
        if cardinality == "set" then
            local k, kerr = M.key(form, v, config)
            if kerr then return nil, kerr end
            if keys[k] == nil then
                keys[k] = v
                out[#out + 1] = k
            end
        else
            out[#out + 1] = v
        end
    end
    if cardinality == "set" then
        table.sort(out)
        for i, k in ipairs(out) do out[i] = keys[k] end
    end
    return out, nil
end

-- normalize(shape, raw) returns the canonical value for a field of that shape.
function M.normalize(shape: types.ValueShape, raw: unknown): (types.Value?, error?)
    return normalize_form(shape.form, shape.cardinality, raw, shape.config or {})
end

-- members returns the scalar members of a value (one value, or each list/set member).
function M.members(shape: types.ValueShape, value: types.Value): { types.Scalar }
    if shape.cardinality == "one" then return { value :: types.Scalar } end
    return value :: { types.Scalar }
end

-- dec_string renders a canonical decimal as plain decimal text.
M.dec_string = dec_string

return M
