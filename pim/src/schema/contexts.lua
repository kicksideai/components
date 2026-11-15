-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Context validation, dimension compilation and bounded requirement expansion.
local consts = require("consts")
local types = require("types")
local failure = require("failure")
local M = {}
local L = consts.LIMITS
local CODE = "^[a-z][a-z0-9_]*$"
local invalid = failure.invalid
-- context_shape checks a request context is a map of dimension names to member
-- strings.
local function context_shape(ctx: unknown): error?
    if ctx == nil then return nil end
    if type(ctx) ~= "table" then return invalid("context must map dimensions to members") end
    for name, member in pairs(ctx :: { [unknown]: unknown }) do
        if type(name) ~= "string" or type(member) ~= "string" then return invalid("context must map dimensions to members") end
    end
    return nil
end

-- ctx_key renders a context tuple over the attribute's scope in declared dimension
-- order: "" for the empty scope, else "dim=member;dim=member" with "*" for all.
function M.ctx_key(dimensions: { types.Dimension }, scope: { string }, tuple: types.Ctx?): (string?, error?)
    local shape_err = context_shape(tuple)
    if shape_err then return nil, shape_err end
    local requested: types.Ctx = tuple or {}
    if #scope == 0 then
        for name in pairs(requested) do
            return nil, invalid("context names dimension outside the attribute scope: " .. tostring(name))
        end
        return "", nil
    end
    local in_scope: { [string]: boolean } = {}
    for _, d in ipairs(scope) do in_scope[d] = true end
    for name in pairs(requested) do
        if not in_scope[name] then return nil, invalid("context names dimension outside the attribute scope: " .. tostring(name)) end
    end
    local parts: { string } = {}
    for _, dim in ipairs(dimensions) do
        if in_scope[dim.name] then
            local member = requested[dim.name]
            if member == nil then return nil, invalid("context must set dimension " .. dim.name) end
            local members = dim.member_set or {}
            if member ~= "*" and not members[member] then
                return nil, invalid("unknown " .. dim.name .. " member: " .. tostring(member))
            end
            parts[#parts + 1] = dim.name .. "=" .. member
        end
    end
    return table.concat(parts, ";"), nil
end

function M.compile_dimensions(decl: { types.DimensionDecl }?): ({ types.Dimension }?, error?)
    local out: { types.Dimension } = {}
    local seen: { [string]: boolean } = {}
    if #(decl or {}) > L.dimensions then return nil, invalid("too many dimensions") end
    for _, d in ipairs(decl or {}) do
        if type(d.name) ~= "string" or not d.name:match(CODE) then return nil, invalid("invalid dimension name") end
        if seen[d.name] then return nil, invalid("duplicate dimension: " .. d.name) end
        seen[d.name] = true
        local members: { string } = {}
        local set: { [string]: boolean } = {}
        if type(d.members) ~= "table" or #d.members == 0 or #d.members > L.members then
            return nil, invalid("dimension " .. d.name .. " needs 1.." .. L.members .. " members")
        end
        for _, m in ipairs(d.members) do
            if type(m) ~= "string" or m == "" or m == "*" or m:find("[;=]") or set[m] then
                return nil, invalid("invalid or duplicate member in " .. d.name)
            end
            set[m] = true
            members[#members + 1] = m
        end
        local fallback: { [string]: { string } } = {}
        for member, chain in pairs(d.fallback or {}) do
            if not set[member] then return nil, invalid("fallback for unknown member " .. tostring(member)) end
            for _, f in ipairs(chain) do
                if not set[f] or f == member then return nil, invalid("invalid fallback of " .. member) end
            end
            fallback[member] = chain
        end
        local state: { [string]: string } = {}
        local function cyclic(m: string): boolean
            if state[m] == "open" then return true end
            if state[m] == "done" then return false end
            state[m] = "open"
            for _, f in ipairs(fallback[m] or {}) do
                if cyclic(f) then return true end
            end
            state[m] = "done"
            return false
        end
        for member in pairs(fallback) do
            if cyclic(member) then return nil, invalid("fallback cycle in " .. d.name) end
        end
        out[#out + 1] = { name = d.name, members = members, member_set = set, fallback = fallback }
    end
    return out, nil
end

-- chain(dim, member) is the resolution chain [member, fallbacks..., "*"].
function M.chain(dim: types.Dimension, member: string): { string }
    local out: { string } = {}
    local seen: { [string]: boolean } = {}
    local function walk(m: string)
        if seen[m] then return end
        seen[m] = true
        out[#out + 1] = m
        for _, f in ipairs(dim.fallback[m] or {}) do walk(f) end
    end
    if member ~= "*" then walk(member) end
    out[#out + 1] = "*"
    return out
end

-- check_context refuses a read context naming an unknown dimension or member.
function M.check_context(dimensions: { types.Dimension }, ctx: types.Ctx?): error?
    local shape_err = context_shape(ctx)
    if shape_err then return shape_err end
    for name, member in pairs(ctx or {}) do
        local dim: types.Dimension? = nil
        for _, d in ipairs(dimensions) do if d.name == name then dim = d end end
        if not dim then return invalid("unknown dimension " .. tostring(name)) end
        if member ~= "*" and not ((dim :: types.Dimension).member_set or {})[member] then
            return invalid("unknown " .. tostring(name) .. " member: " .. tostring(member))
        end
    end
    return nil
end

-- expand_context turns a requirement context into tuples: each dimension names a
-- member or "all" (every member); named dimensions alone are requested.
function M.expand_context(dims: { types.Dimension }, context: { [string]: string }): ({ types.Ctx }?, error?)
    local out: { types.Ctx } = { {} }
    for name in pairs(context) do
        local known = false
        for _, d in ipairs(dims) do if d.name == name then known = true end end
        if not known then return nil, invalid("unknown dimension " .. tostring(name)) end
    end
    for _, d in ipairs(dims) do
        local wanted = context[d.name]
        if wanted ~= nil then
            local members: { string } = {}
            if wanted == "all" then members = d.members
            elseif type(wanted) == "string" and (d.member_set or {})[wanted] then members = { wanted }
            else return nil, invalid("unknown " .. d.name .. " member " .. tostring(wanted)) end
            if #out * #members > 256 then return nil, invalid("served contexts exceed 256") end
            local next_out: { types.Ctx } = {}
            for _, base in ipairs(out) do
                for _, m in ipairs(members) do
                    local t: types.Ctx = {}
                    for k, v in pairs(base) do t[k] = v end
                    t[d.name] = m
                    next_out[#next_out + 1] = t
                end
            end
            out = next_out
        end
    end
    return out, nil
end

return M
