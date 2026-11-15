-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Declared seams a catalog's schema names by id. A kickside.pim.type entry
-- declares an attribute type: its value form, the indexes it can take and, for
-- references, what it targets. A kickside.pim.check entry is a function PIM runs
-- over a product and turns into findings.
local failure = require("failure")
local registry = require("registry")
local types = require("types")

local M = {}

M.TYPE = "kickside.pim.type"
M.CHECK = "kickside.pim.check"

local invalid = failure.invalid

-- load_type reads and checks the type entry id.
function M.load_type(id: string): (types.TypeMeta?, error?)
    local entry, err = registry.get(id)
    if err and err:kind() ~= errors.NOT_FOUND then return nil, errors.wrap(err, "type lookup " .. id) end
    if not entry then return nil, invalid("unknown type " .. id, { code = "unknown_type", entry = id }) end
    local meta = entry.meta
    if type(meta) ~= "table" then return nil, invalid(id .. " is not an attribute type") end
    local m = meta :: { [string]: unknown }
    if m.type ~= M.TYPE or type(m.form) ~= "string" then return nil, invalid(id .. " is not an attribute type") end
    local indexes: { string }? = nil
    if type(m.indexes) == "table" then
        local list: { string } = {}
        for _, k in ipairs(m.indexes :: { unknown }) do
            if type(k) == "string" then list[#list + 1] = k end
        end
        indexes = list
    end
    local config_schema: types.JsonObject? = nil
    if m.config_schema ~= nil then
        if type(m.config_schema) ~= "table" or (m.config_schema :: { [string]: unknown }).type ~= "object" then
            return nil, invalid(id .. " config_schema must describe an object")
        end
        config_schema = m.config_schema :: types.JsonObject
    end
    local functions: types.TypeFunctions? = nil
    if m.functions ~= nil then
        if type(m.functions) ~= "table" then return nil, invalid(id .. " functions must name normalize and validate entries") end
        local f = m.functions :: { [string]: unknown }
        for _, name in ipairs({ "normalize", "validate" }) do
            if f[name] ~= nil and (type(f[name]) ~= "string" or f[name] == "") then return nil, invalid(id .. " functions." .. name .. " must be a function id") end
        end
        functions = { normalize = f.normalize :: string?, validate = f.validate :: string? }
    end
    return { type = M.TYPE, form = m.form :: string, indexes = indexes, target = type(m.target) == "string" and m.target :: string or nil,
        config_schema = config_schema, functions = functions }, nil
end

-- find_types lists every declared attribute type the caller may read, with
-- the title its entry carries, in id order. A declaration the engine refuses
-- is listed with its problem, so a broken module shows instead of vanishing.
function M.find_types(): ({ types.TypeOption }?, error?)
    local entries, err = registry.find({ [".kind"] = "registry.entry", ["meta.type"] = M.TYPE })
    if err then return nil, errors.wrap(err, "type lookup failed") end
    local out: { types.TypeOption } = {}
    for _, e in ipairs(entries or {}) do
        local id = tostring(e.id)
        local raw = type(e.meta) == "table" and e.meta :: { [string]: unknown } or {}
        local title = type(raw.title) == "string" and raw.title :: string or nil
        local meta, lerr = M.load_type(id)
        if lerr and lerr:kind() ~= errors.INVALID then return nil, lerr end
        if lerr or not meta then
            out[#out + 1] = { id = id, title = title, form = "", indexes = {}, problem = tostring(lerr) }
        else
            out[#out + 1] = { id = id, title = title, form = meta.form, indexes = meta.indexes or { "none" }, target = meta.target, config_schema = meta.config_schema }
        end
    end
    table.sort(out, function(a: types.TypeOption, b: types.TypeOption): boolean return a.id < b.id end)
    return out, nil
end

-- is_check reports whether id names a declared check.
function M.is_check(id: string): (boolean, error?)
    local entry, err = registry.get(id)
    if err then
        if err:kind() == errors.NOT_FOUND then return false, nil end
        return false, errors.wrap(err, "check lookup " .. id)
    end
    if not entry or type(entry.meta) ~= "table" then return false, nil end
    return (entry.meta :: { [string]: unknown }).type == M.CHECK, nil
end

return M
