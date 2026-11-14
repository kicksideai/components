-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local policy = require("policy")
local shape = require("shape")
local declaration_shape = require("declaration_shape")
local types = require("types")

local M = {}

local function invalid(message: string): error
    return errors.new({ details = { code = "invalid_schema" }, kind = errors.INVALID, message = message })
end

function M.check(declaration: unknown): error?
    local definition, derr = declaration_shape.get()
    if derr or not definition then return derr end
    local err = shape.check(shape.tolerant(definition), declaration, "declaration")
    if err then return err end
    return policy.check((declaration :: types.Declaration).policy)
end

-- Effective declarations merge by name and carry stable field ids: named entries
-- replace theirs, omitted entries stay, and only an explicit removal destroys.

local function deep(v: unknown): unknown
    if type(v) ~= "table" then return v end
    local out: { [unknown]: unknown } = {}
    for k, x in pairs(v :: { [unknown]: unknown }) do out[k] = deep(x) end
    return out
end

-- copy returns a deep copy; a merged declaration owns its tables.
function M.copy<T>(v: T): T
    return deep(v) :: T
end

-- merge_list keeps base entries in order, replaces those named again in incoming and appends new ones.
function M.merge_list<T>(base: { T }?, incoming: { T }?, key: (T) -> string?): ({ T }?, error?)
    local order: { string } = {}
    local by: { [string]: T } = {}
    for _, item in ipairs(base or {}) do
        local k = key(item)
        if k and by[k] == nil then order[#order + 1] = k end
        if k then by[k] = item end
    end
    for _, item in ipairs(incoming or {}) do
        local k = key(item)
        if k then
            if by[k] == nil then order[#order + 1] = k end
            by[k] = item
        end
    end
    local list: { T } = {}
    for _, k in ipairs(order) do list[#list + 1] = by[k] end
    return list, nil
end

-- remove_from drops the entries named in names; a name that matches nothing is not_found.
function M.remove_from<T>(section: string, list: { T }?, names: { string }?, key: (T) -> string?): ({ T }?, error?)
    local out: { T } = list or {}
    for _, name in ipairs(names or {}) do
        local kept: { T } = {}
        local found = false
        for _, item in ipairs(out) do
            if key(item) == name then found = true else kept[#kept + 1] = item end
        end
        if not found then return nil, errors.new({ details = { code = "declaration_member_not_found" }, kind = errors.NOT_FOUND, message = section .. " removal target not found: " .. name }) end
        out = kept
    end
    return out, nil
end

-- merge_fields replaces fields by code, or by id when the entry carries one
-- (which renames the field when the code differs).
function M.merge_fields(prev: { types.FieldDecl }?, incoming: { types.FieldDecl }?): ({ types.FieldDecl }?, error?)
    local out: { types.FieldDecl } = {}
    local at_code: { [string]: integer } = {}
    local at_id: { [integer]: integer } = {}
    for _, a in ipairs(prev or {}) do
        out[#out + 1] = a
        at_code[a.code] = #out
        if a.id then at_id[a.id :: integer] = #out end
    end
    for _, a in ipairs(incoming or {}) do
        local id = a.id
        local slot = id and at_id[id :: integer] or at_code[a.code]
        if id and not at_id[id :: integer] then return nil, invalid("unknown field id " .. tostring(id) .. " for " .. a.code) end
        if slot then
            if at_code[a.code] and at_code[a.code] ~= slot then return nil, invalid("field code already used: " .. a.code) end
            at_code[out[slot].code] = nil
            out[slot] = a
            at_code[a.code] = slot
        else
            out[#out + 1] = a
            at_code[a.code] = #out
        end
    end
    return out, nil
end

local function field_code(f: types.FieldDecl): string? return f.code end
local function item_id(t: types.ItemTypeDecl): string? return t.id end
local function process_id(p: types.ProcessDecl): string? return p.id end
local function relation_id(r: types.RelationDecl): string? return r.id end

local function distinct<T>(list: { T }?, key: (T) -> string?): error?
    local seen: { [string]: boolean } = {}
    for _, entry in ipairs(list or {}) do
        local name = key(entry)
        if name and seen[name] then return errors.new({ details = { code = "duplicate_declaration" }, kind = errors.INVALID, message = "duplicate declaration entry " .. name }) end
        if name then seen[name] = true end
    end
    return nil
end

function M.check_entries(incoming: types.Declaration): error?
    local err = M.check(incoming)
    if not err then err = distinct(incoming.fields, field_code) end
    if not err then err = distinct(incoming.item_types, item_id) end
    if not err then err = distinct(incoming.processes, process_id) end
    if not err then err = distinct(incoming.relation_types, relation_id) end
    return err
end

-- merge keeps omitted entries and applies explicit removals after replacements.
function M.merge(prev: types.Declaration?, incoming: types.Declaration): (types.Declaration?, error?)
    local err = M.check_entries(incoming)
    if err then return nil, err end
    local base: types.Declaration = M.copy(prev or {})
    local named: types.Declaration = M.copy(incoming)
    local remove: types.RemoveDecl = named.remove or {}
    if not prev and named.remove ~= nil then
        return nil, errors.new({ details = { code = "invalid_schema" }, kind = errors.INVALID, message = "nothing to remove in a first schema" })
    end
    local out: types.Declaration = { visibility = named.visibility or base.visibility, key_prefix = named.key_prefix or base.key_prefix, policy = named.policy or base.policy,
        plugins = named.plugins or base.plugins, scopes = named.scopes or base.scopes }
    out.fields, err = M.merge_fields(base.fields, named.fields)
    if err then return nil, err end
    out.item_types, err = M.merge_list(base.item_types, named.item_types, item_id)
    if err then return nil, err end
    out.processes, err = M.merge_list(base.processes, named.processes, process_id)
    if err then return nil, err end
    out.relation_types, err = M.merge_list(base.relation_types, named.relation_types, relation_id)
    if err then return nil, err end
    out.fields, err = M.remove_from("fields", out.fields, remove.fields, field_code)
    if err then return nil, err end
    out.item_types, err = M.remove_from("item_types", out.item_types, remove.item_types, item_id)
    if err then return nil, err end
    out.processes, err = M.remove_from("processes", out.processes, remove.processes, process_id)
    if err then return nil, err end
    out.relation_types, err = M.remove_from("relation_types", out.relation_types, remove.relation_types, relation_id)
    if err then return nil, err end
    return out, nil
end

-- stamp records the compiled ids in the effective declaration.
function M.stamp(declaration: types.Declaration, compiled: types.Compiled)
    for _, p in ipairs(declaration.processes or {}) do p.map = nil end
    local ids: { [string]: integer } = {}
    for _, f in ipairs(compiled.fields) do ids[f.code] = f.id end
    for _, f in ipairs(declaration.fields or {}) do f.id = ids[f.code] end
end

return M
