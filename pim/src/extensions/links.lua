-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Link targets (spec 3.3): a plugin that owns entities products point at binds
-- kickside.pim:link_target with meta.kind. PIM discovers kinds through the
-- contract's bindings, asks one binding which ids exist for the caller and
-- asks it to describe ids for release snapshots. Every call runs as the
-- caller; a binding failure keeps its native classification.
local contract = require("contract")
local registry = require("registry")
local security = require("security")
local types = require("types")

local M = {}

M.CONTRACT = "kickside.pim:link_target"

-- Target is one bound link kind.
type Target = { kind: string, binding: string, title: string? }
M.Target = Target

type Instance = {
    resolve: (self: Instance, request: types.JsonObject) -> (unknown, error?),
    describe: (self: Instance, request: types.JsonObject) -> (unknown, error?),
}

local function unavailable(kind: string, message: string, cause: error?): error
    if cause then return errors.wrap(cause, "link kind " .. kind .. ": " .. message) end
    return errors.new({ kind = errors.UNAVAILABLE, retryable = true, message = "link kind " .. kind .. ": " .. message,
        details = { code = "contract_unavailable" }, cause = cause })
end

-- kinds maps every bound link kind to its binding; a kind two bindings claim
-- is an error, since a reference could not say which owner it means.
function M.kinds(): ({ [string]: Target }?, error?)
    local bindings, err = contract.find_implementations(M.CONTRACT)
    if err then return nil, errors.wrap(err, "link target bindings unavailable") end
    local out: { [string]: Target } = {}
    for _, binding in ipairs(bindings or {}) do
        local id = tostring(binding)
        local entry, gerr = registry.get(id)
        if gerr then return nil, errors.wrap(gerr, "link target binding " .. id .. " lookup") end
        if not entry then return nil, errors.new({ kind = errors.INTERNAL, message = "link target binding " .. id .. " is unreadable", details = { code = "internal", binding = id } }) end
        local meta = type(entry.meta) == "table" and entry.meta :: { [string]: unknown } or {}
        local kind = meta.kind
        if type(kind) ~= "string" or kind == "" then return nil, errors.new({ kind = errors.INTERNAL, message = "link target binding " .. id .. " declares no kind", details = { code = "internal", binding = id } }) end
        if out[kind] then return nil, errors.new({ kind = errors.INTERNAL, retryable = false, message = "link kind " .. kind .. " is bound twice: " .. out[kind].binding .. ", " .. id, details = { code = "internal", kind = kind } }) end
        out[kind] = { kind = kind, binding = id, title = type(meta.title) == "string" and meta.title :: string or nil }
    end
    return out, nil
end

-- has_kind answers whether a link kind is bound.
function M.has_kind(kind: string): (boolean, error?)
    local all, err = M.kinds()
    if err or not all then return false, err end
    return all[kind] ~= nil, nil
end

local function open(kind: string): (Instance?, error?)
    local all, err = M.kinds()
    if err or not all then return nil, err end
    local target = all[kind]
    if not target then return nil, errors.new({ kind = errors.INVALID, message = "unknown link kind " .. kind, details = { code = "unknown_link_kind", kind = kind } }) end
    local def, derr = contract.get(M.CONTRACT)
    if derr then return nil, errors.wrap(derr, "link target contract unavailable") end
    if not def then return nil, errors.new({ kind = errors.UNAVAILABLE, message = "link target contract unavailable", details = { code = "contract_unavailable" } }) end
    local instance, oerr = def:with_actor(security.actor()):with_scope(security.scope()):open(target.binding)
    if oerr then return nil, unavailable(kind, "binding " .. target.binding .. " open failed", oerr) end
    if not instance then return nil, unavailable(kind, "binding " .. target.binding .. " open returned no client") end
    return instance :: Instance, nil
end

local function field(answer: unknown, name: string): unknown
    if type(answer) ~= "table" then return nil end
    return (answer :: { [string]: unknown })[name]
end

-- resolve answers which of ids exist and are visible to the caller.
function M.resolve(kind: string, catalog_id: string, ids: { string }): ({ [string]: boolean }?, error?)
    local instance, err = open(kind)
    if err or not instance then return nil, err end
    local answer, rerr = instance:resolve({ catalog_id = catalog_id, ids = ids })
    if rerr then return nil, unavailable(kind, "resolve failed", rerr) end
    local present = field(answer, "ids")
    if type(present) ~= "table" then return nil, unavailable(kind, "resolve answered without ids") end
    local out: { [string]: boolean } = {}
    for _, id in ipairs(present :: { unknown }) do
        if type(id) ~= "string" then return nil, unavailable(kind, "resolve answered a non-string id") end
        out[id] = true
    end
    return out, nil
end

-- describe answers the label and data of the ids the owner describes; an id it
-- leaves out is one it no longer knows.
function M.describe(kind: string, catalog_id: string, ids: { string }): ({ [string]: types.LinkTarget }?, error?)
    local instance, err = open(kind)
    if err or not instance then return nil, err end
    local answer, derr = instance:describe({ catalog_id = catalog_id, ids = ids })
    if derr then return nil, unavailable(kind, "describe failed", derr) end
    local targets = field(answer, "targets")
    if type(targets) ~= "table" then return nil, unavailable(kind, "describe answered without targets") end
    local out: { [string]: types.LinkTarget } = {}
    for id, raw in pairs(targets :: { [unknown]: unknown }) do
        if type(id) ~= "string" or type(raw) ~= "table" or type((raw :: { [string]: unknown }).label) ~= "string" then
            return nil, unavailable(kind, "describe answered a target without a label")
        end
        local t = raw :: { [string]: unknown }
        if t.data ~= nil and type(t.data) ~= "table" then return nil, unavailable(kind, "describe answered data that is not an object") end
        out[id] = { label = t.label :: string, data = t.data :: types.JsonObject? }
    end
    return out, nil
end

return M
