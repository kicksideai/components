-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local search_text = require("search_text")
local registry_values = require("registry_values")
-- Activated search scopes return membership conditions under the caller's authority.
local registry = require("registry")
local contract = require("contract")
local plugins = require("plugins")
local scopes = require("scopes")
local types = require("types")
local rules = require("rules")
local M = {}

local function invalid(code: string, message: string): error
    return errors.new({ kind = errors.INVALID, message = message, details = { code = code } })
end

-- A shared lexical index may use only fields readable by every board reader.
local function validate_reads(compiled: types.Compiled, reads: { string }, adopting: boolean?): error?
    if #reads == 0 then return nil end
    local fields: { [string]: types.Field } = {}
    local by_id: { [integer]: types.Field } = {}
    for _, field in ipairs(compiled.fields) do
        fields[field.code], by_id[field.id] = field, field
    end
    local subject = { compiled = compiled, model = { fields = fields, by_id = by_id } } :: types.Board
    for _, code in ipairs(reads) do
        local field = fields[code]
        if not field then return invalid("search_field_unknown", "search reads unknown field " .. code) end
        if not rules.field(subject, field, "read", nil) then
            if not adopting then return rules.denied(code) end
            return invalid("search_field_restricted", "search input must be readable by every board reader: " .. code)
        end
    end
    return nil
end

function M.validate_scope(compiled: types.Compiled, id: string): error?
    local entry, err = registry.get(id)
    if err or not entry then return err end
    local meta = registry_values.canonical(entry.meta or {})
    if meta.resolve_ids == nil then return nil end
    if type(meta.resolve_ids) ~= "string" then return invalid("unknown_scope", "resolve_ids names a binding") end
    return validate_reads(compiled, (meta.reads or {}) :: { string }, true)
end

local function scope_meta(reader: types.Reader, id: string): ({ [string]: unknown }?, error?)
    local err = plugins.seam(id, reader.plugins, false, "scope")
    if err then return nil, err end
    local entry, rerr = registry.get(id)
    if rerr then return nil, rerr end
    local meta = registry_values.canonical(entry and entry.meta or {})
    if meta.type ~= scopes.TYPE then return nil, invalid("unknown_scope", id .. " is not a scope") end
    local access = meta.access or "read"
    if access ~= "read" and access ~= "write" and access ~= "admin" then
        return nil, invalid("unknown_scope", "search scope access is read, write or admin")
    end
    if not reader.allows(access :: string) then
        return nil, errors.new({ kind = errors.PERMISSION_DENIED, message = "search scope access denied", details = { code = "scope_access_denied" } })
    end
    if reader.scope_fence and (meta.resolve_ids ~= nil or meta.match ~= nil) then
        local projection, perr = scopes.projection(id, meta)
        if perr then return nil, perr end
        if projection then
            local pending = reader.scope_fence(projection)
            if pending then return nil, pending end
        end
    end
    return meta, nil
end

local function validate_resolver(reader: types.Reader, meta: { [string]: unknown }): error?
    if type(meta.resolve_ids) ~= "string" then return invalid("unknown_scope", "resolve_ids names a binding") end
    local reads = (meta.reads or {}) :: { string }
    if #reads == 0 then return nil end
    if not reader.search_model then return invalid("search_unavailable", "search needs the active schema") end
    return validate_reads(reader.search_model, reads)
end

local function folded_match(text: unknown): (string?, error?)
    if type(text) ~= "string" or #text == 0 or #text > 4096 then return nil, invalid("invalid_match", "match holds 1..4096 bytes") end
    local folded = search_text.fold(text)
    if not folded then return nil, invalid("invalid_match", "match is UTF-8 text without NUL bytes") end
    return folded, nil
end

local function resolve_ids(board: string, id: string, binding: string, text: string, snapshot: types.Board?): ({ string }?, error?)
    local def, derr = contract.get("kickside.work:search_resolver")
    if derr then return nil, derr end
    if not def then return nil, invalid("search_unavailable", "search resolver contract is unavailable") end
    local context = snapshot and {
        work_search = { board_id = board, scope = id, generation = snapshot.generation, as_of = snapshot.applied_seq },
    }
    local client, cerr = def:open(binding, context)
    if cerr or not client then return nil, cerr end
    local answer, aerr = client:resolve_ids({ board_id = board, query = text, limit = 1000 })
    if aerr then return nil, errors.wrap(aerr :: error, "search " .. id) end
    if type(answer) ~= "table" or type(answer.ids) ~= "table" or #answer.ids > 1000 then
        return nil, invalid("search_result_invalid", "search returns at most 1000 ids")
    end
    local ids: { string } = {}
    for _, item in ipairs(answer.ids) do
        if type(item) ~= "string" or #item == 0 or #item > 256 then return nil, invalid("search_result_invalid", "search returns item ids") end
        ids[#ids + 1] = item
    end
    return ids, nil
end

-- A resolver can call Work under the caller, so resolve before holding the read transaction.
function M.prepare(reader: types.Reader, snapshot: types.Board, matches: { [string]: boolean }): (types.SearchResults?, error?)
    local prepared: types.SearchResults = {}
    for _, id in ipairs(reader.search or {}) do
        local meta, err = scope_meta(reader, id)
        if err or not meta then return nil, err end
        if meta.resolve_ids ~= nil then
            local err = validate_resolver(reader, meta)
            if err then return nil, err end
            local by_match: { [string]: { string } } = {}
            for text in pairs(matches) do
                local _, match_err = folded_match(text)
                if match_err then return nil, match_err end
                local ids, err = resolve_ids(reader.board_id, id, meta.resolve_ids :: string, text, snapshot)
                if err or not ids then return nil, err end
                by_match[text] = ids
            end
            prepared[id] = by_match
        end
    end
    return prepared, nil
end

function M.compile(reader: types.Reader, alias: string, text: unknown, position: string, resolve: types.Resolver): (types.Condition?, error?)
    local folded, ferr = folded_match(text)
    if ferr then return nil, ferr end
    local residual = false
    local parts: { string } = {}
    local args: { unknown } = {}
    for _, id in ipairs(reader.search or {}) do
        local meta, err = scope_meta(reader, id)
        if err or not meta then return nil, err end
        if meta.resolve_ids ~= nil then
            local err = validate_resolver(reader, meta)
            if err then return nil, err end
            local ids: { string } = {}
            if not reader.search_definition then
                local by_match = reader.search_ids and reader.search_ids[id]
                if reader.search_ids then
                    local prepared = by_match and by_match[text :: string]
                    if not prepared then
                        return nil, invalid("search_unavailable", "search inputs changed during compilation")
                    end
                    ids = prepared
                else
                    local resolved, rerr = resolve_ids(reader.board_id, id, meta.resolve_ids :: string, text :: string, nil)
                    if rerr or not resolved then return nil, rerr end
                    ids = resolved
                end
            end
            local marks: { string } = {}
            for _, item in ipairs(ids) do
                marks[#marks + 1] = "?"
                args[#args + 1] = item
            end
            parts[#parts + 1] = #marks == 0 and "1 = 0" or alias .. ".item_id IN (" .. table.concat(marks, ",") .. ")"
        elseif meta.match ~= nil then
            for _, code in ipairs((meta.reads or {}) :: { string }) do
                local _, ferr = resolve(code)
                if ferr then return nil, ferr end
            end
            local scope, serr = scopes.load(id)
            if serr or not scope then return nil, serr end
            residual = true
            local columns: { string } = {}
            args[#args + 1] = reader.board_id
            for _, column in ipairs(scope.match) do
                columns[#columns + 1] = position .. "(s." .. column .. ", ?) > 0"
                args[#args + 1] = folded
            end
            parts[#parts + 1] = "EXISTS (SELECT 1 FROM " .. scope.table .. " s WHERE s." .. scope.board_column .. " = ? AND s." .. scope.item_column .. " = " .. alias .. ".item_id AND (" .. table.concat(columns, " OR ") .. "))"
        end
    end
    if #parts == 0 then return nil, invalid("search_unavailable", "board declares no activated search scope") end
    return { sql = "(" .. table.concat(parts, " OR ") .. ")", args = args, residual = residual }, nil
end
return M
