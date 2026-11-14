-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local json = require("json")
-- types.Field kinds on top of the value forms: how a declared field turns a request
-- value into its canonical value, and a stored value into the shape readers see.
local document = require("document")
local consts = require("consts")
local values = require("values")
local types = require("types")

local function invalid(message: string): error
    return errors.new({ kind = errors.INVALID, message = message, details = { code = "invalid_value" } })
end

local M = {}

function M.config(form: string, config: types.FieldConfig, depth: integer?): error?
    local raw = config :: { [string]: unknown }
    local function bad(): error
        return errors.new({ kind = errors.INVALID, message = "invalid " .. tostring(form) .. " field configuration", details = { code = "invalid_field_config" } })
    end
    if type(config) ~= "table" or not consts.FORMS[form] or (depth or 1) > 6 then return bad() end
    if raw.cardinality ~= nil and not consts.CARDINALITIES[raw.cardinality] then return bad() end
    if form == "ref" and (type(raw.target) ~= "string" or raw.target == "") then return bad() end
    if raw.scale ~= nil and (type(raw.scale) ~= "number" or math.tointeger(raw.scale) == nil or raw.scale < 0 or raw.scale > 12) then return bad() end
    if raw.case ~= nil and raw.case ~= "sensitive" and raw.case ~= "insensitive" then return bad() end
    if raw.range ~= nil then
        if type(raw.range) ~= "table" or #raw.range ~= 2 then return bad() end
        local low, high = raw.range[1], raw.range[2]
        local bound = math.maxinteger // (10 ^ (config.scale or 0))
        if type(low) ~= "number" or type(high) ~= "number" or math.tointeger(low) == nil or math.tointeger(high) == nil
            or low > high or low < -bound or high > bound then return bad() end
    end
    if form == "quantity" then
        if type(raw.units) ~= "table" or type(raw.canonical) ~= "string" or raw.units[raw.canonical] == nil then return bad() end
        for unit, factor in pairs(raw.units) do
            if type(unit) ~= "string" or unit == "" then return bad() end
            local value, err = values.normalize({ form = "dec", cardinality = "one", config = {} }, factor)
            if err or not value or (value :: types.Dec).m <= 0 then return bad() end
        end
    end
    if form == "record" then
        if type(raw.members) ~= "table" then return bad() end
        for name, member in pairs(config.members or {}) do
            if type(name) ~= "string" or type(member) ~= "table" then return bad() end
            local err = M.config(member.form, member, (depth or 1) + 1)
            if err then return err end
        end
    end
    return nil
end

-- representation is the one index conversion used by acceptance and projection.
function M.representation(field: types.Field, value: types.Scalar, kind: string?): (types.ColumnValue?, error?)
    if (kind or field.index) == "number" and field.cardinality == "one" then
        if field.type == "option" then
            for _, option in ipairs(field.options or {}) do if option.id == value then return option.order, nil end end
            return nil, invalid("unknown option for " .. field.code)
        end
        return values.order(field.form, value, field.config)
    end
    return values.key(field.form, value, field.config)
end

function M.validate(field: types.Field, value: types.Value): error?
    if field.index == "none" then return nil end
    for _, member in ipairs(values.members({ form = field.form, cardinality = field.cardinality, config = field.config }, value)) do
        local _, err = M.representation(field, member)
        if err then return err end
        if field.type == "option" and field.index == "number" then
            local _, key_err = values.key("text", member, field.config)
            if key_err then return key_err end
        end
    end
    return nil
end

function M.document(compiled: types.Compiled, doc: types.Document): (string?, error?)
    for _, field in ipairs(compiled.fields) do
        local value = document.value(doc, field.id)
        if value ~= nil then
            local err = M.validate(field, value)
            if err then return field.code, err end
        end
    end
    return nil, nil
end



function M.shape(field: types.Field): types.ValueShape
    return { form = field.form, cardinality = field.cardinality, config = field.config }
end

local function option_known(field: types.Field, id: string): boolean
    for _, o in ipairs(field.options or {}) do
        if o.id == id then return true end
    end
    return false
end

-- principal_ref maps the surface principal {kind, id} onto its ref form value.
local function principal_ref(raw: unknown): (unknown, error?)
    if type(raw) ~= "table" then return nil, invalid("principal {kind, id} required") end
    local p = raw :: { [string]: unknown }
    if type(p.kind) ~= "string" or not consts.PRINCIPAL_KINDS[p.kind] then return nil, invalid("principal kind is user, group or service") end
    if type(p.id) ~= "string" or p.id == "" then return nil, invalid("principal id required") end
    return { ref = { consts.PRINCIPAL_TARGET, p.kind .. ":" .. p.id } }, nil
end

local function principal_surface(ref: types.Value): types.JsonObject
    local pair = (ref :: { ref: { string } }).ref[2]
    local kind, id = pair:match("^([^:]+):(.+)$")
    return { kind = kind, id = id }
end

function M.item_ref(value: unknown): (types.Ref?, error?)
    if type(value) ~= "table" then return nil, invalid("item reference requires board and item") end
    local ref = value :: { [string]: unknown }
    if type(ref.board) ~= "string" or ref.board == "" or type(ref.item) ~= "string" or ref.item == "" then return nil, invalid("item reference requires board and item") end
    for key in pairs(ref) do if key ~= "board" and key ~= "item" then return nil, invalid("item reference has unknown key " .. key) end end
    return { ref = { consts.ITEM_TARGET, ref.board .. "/" .. ref.item } }, nil
end

-- normalize returns the canonical value of raw for field; a counter field is
-- assigned by the fold, so a request never writes it.
function M.normalize(field: types.Field, raw: unknown): (types.Value?, error?)
    if field.type == "rollup" or field.type == "formula" or field.type == "rank" then return nil, errors.new({ kind = errors.INVALID, message = "field is computed", details = { code = "read_only" } }) end
    if field.type == "counter" then return nil, invalid("field " .. field.code .. " is assigned by the board") end
    local input: unknown = raw
    if field.type == "rich_text" then
        if type(raw) ~= "table" or type((raw :: { [string]: unknown }).type) ~= "string" then return nil, invalid("rich_text requires a document object with a type") end
        local _, err = json.encode(raw)
        if err then return nil, err end
        input = values.canonical(raw)
    end
    if field.type == "item" then
        if field.cardinality == "one" then
            local ref, err = M.item_ref(raw)
            if err then return nil, err end
            input = ref
        else
            if type(raw) ~= "table" then return nil, invalid("item reference list required") end
            local refs: { types.Ref } = {}
            for _, member in ipairs(raw :: { unknown }) do
                local ref, err = M.item_ref(member)
                if err or not ref then return nil, err end
                refs[#refs + 1] = ref
            end
            input = refs
        end
    end
    if field.type == "principal" then
        if field.cardinality == "one" then
            local ref, perr = principal_ref(raw)
            if perr then return nil, perr end
            input = ref
        else
            if type(raw) ~= "table" then return nil, invalid("principal list required") end
            local mapped: { unknown } = {}
            for i, p in ipairs(raw :: { unknown }) do
                local ref, perr = principal_ref(p)
                if perr then return nil, perr end
                mapped[i] = ref
            end
            input = mapped
        end
    end
    local value, err = values.normalize(M.shape(field), input)
    if err or value == nil then return nil, err end
    if field.type == "option" then
        for _, m in ipairs(values.members(M.shape(field), value)) do
            if not option_known(field, m :: string) then return nil, invalid("unknown option " .. tostring(m) .. " for " .. field.code) end
        end
    end
    local ierr = M.validate(field, value)
    if ierr then return nil, ierr end
    return value, nil
end

local function surface_scalar(form: string, v: types.Value): unknown
    if form == "dec" then return values.dec_string(v :: types.Dec) end
    if form == "quantity" then
        local q = v :: types.Quantity
        return { v = values.dec_string(q.v), u = q.u }
    end
    if form == "ref" then
        local r = (v :: types.Ref).ref
        return { ref = { r[1], r[2] } }
    end
    return v
end

-- surface renders a canonical value for readers: decimals as text, principals
-- as {kind, id}.
function M.value(field: types.Field, item: types.Item): types.Value?
    if field.type == "rank" then return item.rank end
    return document.value(item.document, field.id)
end

function M.surface(field: types.Field, value: types.Value): (unknown, error?)
    if field.type == "rich_text" then return json.decode(value :: string) end
    if field.type == "item" then
        local function reference(raw: types.Value): types.JsonObject
            local board, item = (raw :: types.Ref).ref[2]:match("^([^/]+)/(.+)$")
            return { board = board, item = item }
        end
        if field.cardinality == "one" then return reference(value) end
        local out: { types.JsonObject } = {}
        for _, member in ipairs(value :: { types.Value }) do out[#out + 1] = reference(member) end
        return out
    end
    if field.type == "principal" then
        if field.cardinality == "one" then return principal_surface(value) end
        local out: { types.JsonObject } = {}
        for i, p in ipairs(value :: { types.Value }) do out[i] = principal_surface(p) end
        return out
    end
    if field.cardinality == "one" then return surface_scalar(field.form, value) end
    local out: { unknown } = {}
    for i, m in ipairs(value :: { types.Value }) do out[i] = surface_scalar(field.form, m) end
    return out
end

return M
