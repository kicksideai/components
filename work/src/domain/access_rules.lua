-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Holder rules share one grammar across item visibility and field access.
local document = require("document")
local types = require("types")
local values = require("values")
local fields = require("fields")
local M = {}
M.MAX_GROUPS = 100
M.MAX_LEVELS = 32
M.MAX_HOLDERS = 16

function M.denied(field: string): error
    return errors.new({ kind = errors.PERMISSION_DENIED, message = "field " .. field .. " is denied", details = { code = "field_denied", field = field } })
end

local function invalid(message: string): error
    return errors.new({ kind = errors.INVALID, message = message, details = { code = "invalid_access" } })
end

local function holders(list: { types.Holder }, by_code: { [string]: types.Field }): error?
    if #list > M.MAX_HOLDERS then return invalid("access holds at most 16 holders") end
    for _, holder in ipairs(list) do
        local count = 0
        for key, id in pairs(holder) do
            count = count + 1
            if key ~= "group" and key ~= "user" and key ~= "service" and key ~= "field" then return invalid("unknown holder " .. key) end
            if type(id) ~= "string" or id == "" then return invalid("holder needs an exact id") end
        end
        if count ~= 1 then return invalid("holder names one group, user, service or field") end
        if holder.field then
            local field = by_code[holder.field]
            if not field or field.type ~= "principal" then return invalid("holder field " .. holder.field .. " must be a principal") end
            if field.index == "none" then field.index = "key" end
        end
    end
    return nil
end

function M.validate(compiled: types.Compiled): error?
    local by_code: { [string]: types.Field } = {}
    for _, field in ipairs(compiled.fields) do by_code[field.code] = field end
    local rule = compiled.visibility
    if rule then
        local field = by_code[rule.field]
        if not field or field.form ~= "text" or field.cardinality ~= "one" or field.rollup then return invalid("visibility field must be a single text or option field") end
        if field.index == "number" or field.config.case == "insensitive" then return invalid("visibility field requires an exact key index") end
        if field.index == "none" then field.index = "key" end
        if rule.bypass ~= nil and rule.bypass ~= "admin" then return invalid("visibility bypass is admin") end
        if #rule.levels > M.MAX_LEVELS then return invalid("visibility declares at most 32 levels") end
        local seen: { [string]: boolean } = {}
        for _, level in ipairs(rule.levels) do
            if level.id == "" or seen[level.id] then return invalid("visibility levels have distinct nonempty ids") end
            seen[level.id] = true
            local err = holders(level.holders, by_code)
            if err then return err end
        end
    end
    for _, field in ipairs(compiled.fields) do
        if field.access then
            for _, list in pairs(field.access) do
                local err = holders(list, by_code)
                if err then return err end
            end
        end
    end
    local indexed = 0
    for _, field in ipairs(compiled.fields) do if field.index ~= "none" then indexed = indexed + 1 end end
    if indexed > 60 then return invalid("a board declares at most 60 indexed fields") end
    return nil
end

function M.fixed(holder: types.Holder, caller: types.AccessCaller): boolean
    if holder.group then return caller.groups[holder.group] == true end
    if holder.user then return caller.principal.kind == "user" and caller.principal.id == holder.user end
    if holder.service then return caller.principal.kind == "service" and caller.principal.id == holder.service end
    return false
end

function M.holds(board: types.Board, caller: types.AccessCaller, list: { types.Holder }?, doc: types.Document?, source_fields: { [string]: types.Field }?): boolean
    if not list then return true end
    for _, holder in ipairs(list) do
        if M.fixed(holder, caller) then return true end
        if holder.field and doc then
            local field = (source_fields or board.model.fields)[holder.field]
            local value = field and document.value(doc, field.id)
            if value ~= nil then
                for _, member in ipairs(values.members(fields.shape(field), value)) do
                    local ref = (member :: types.Ref).ref
                    if ref and ref[1] == "principal" then
                        if ref[2] == caller.principal.kind .. ":" .. caller.principal.id then return true end
                        local group = ref[2]:match("^group:(.+)$")
                        if group and caller.groups[group] then return true end
                    end
                end
            end
        end
    end
    return false
end

function M.visible(board: types.Board, doc: types.Document): boolean
    local rule, caller = board.compiled.visibility, board.caller
    if not rule then return true end
    if not caller then return false end
    if rule.bypass == "admin" and caller.admin then return true end
    local value = document.value(doc, (board.model.fields[rule.field] :: types.Field).id)
    if value == nil then return true end
    for _, level in ipairs(rule.levels) do
        if level.id == value then return M.holds(board, caller, level.holders, doc) end
    end
    return false
end

function M.field(board: types.Board, field: types.Field, mode: string, doc: types.Document?, checked: { [integer]: boolean }?): boolean
    local known = checked or {}
    local cached = known[field.id]
    if cached ~= nil then return cached end
    if mode == "read" and field.formula then
        for _, id in ipairs(field.formula.depends) do
            if not M.field(board, board.model.by_id[id] :: types.Field, mode, doc, known) then
                known[field.id] = false
                return false
            end
        end
    end
    if field.rollup and mode == "read" then
        for _, id in ipairs(field.rollup.reads) do
            if not M.field(board, board.model.by_id[id] :: types.Field, mode, nil) then
                known[field.id] = false
                return false
            end
        end
    end
    local caller = board.caller
    if field.rollup and board.compiled.visibility and mode == "read" then
        if not caller or not caller.admin or board.compiled.visibility.bypass ~= "admin" then known[field.id] = false; return false end
    end
    local list: { types.Holder }? = nil
    if field.access then
        if mode == "write" then list = field.access.write else list = field.access.read end
    end
    local allowed = not list or (caller ~= nil and M.holds(board, caller, list, doc))
    known[field.id] = allowed
    return allowed
end

return M
