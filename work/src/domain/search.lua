-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local registry_values = require("registry_values")
-- Activated search scopes return membership conditions under the caller's authority.
local registry = require("registry")
local contract = require("contract")
local security = require("security")
local plugins = require("plugins")
local scopes = require("scopes")
local types = require("types")
local M = {}

local function invalid(code: string, message: string): error
    return errors.new({ kind = errors.INVALID, message = message, details = { code = code } })
end

function M.compile(reader: types.Reader, alias: string, text: unknown, position: string, resolve: types.Resolver): (types.Condition?, error?)
    if type(text) ~= "string" or #text == 0 or #text > 4096 then return nil, invalid("invalid_match", "match holds 1..4096 bytes") end
    local parts: { string } = {}
    local args: { unknown } = {}
    for _, id in ipairs(reader.search or {}) do
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
        for _, code in ipairs((meta.reads or {}) :: { string }) do
            local _, ferr = resolve(code)
            if ferr then return nil, ferr end
        end
        if meta.resolve_ids ~= nil then
            if type(meta.resolve_ids) ~= "string" then return nil, invalid("unknown_scope", "resolve_ids names a binding") end
            local def, derr = contract.get("kickside.work:search_resolver")
            if derr then return nil, derr end
            if not def then return nil, invalid("search_unavailable", "search resolver contract is unavailable") end
            local client, cerr = def:with_actor(security.actor()):with_scope(security.scope()):open(meta.resolve_ids)
            if cerr or not client then return nil, cerr end
            local answer, aerr = client:resolve_ids({ board_id = reader.board_id, query = text, limit = 1000 })
            if aerr then return nil, errors.wrap(aerr :: error, "search " .. id) end
            if type(answer) ~= "table" or type(answer.ids) ~= "table" or #answer.ids > 1000 then
                return nil, invalid("search_result_invalid", "search returns at most 1000 ids")
            end
            local marks: { string } = {}
            for _, item in ipairs(answer.ids) do
                if type(item) ~= "string" or #item == 0 or #item > 256 then return nil, invalid("search_result_invalid", "search returns item ids") end
                marks[#marks + 1] = "?"
                args[#args + 1] = item
            end
            parts[#parts + 1] = #marks == 0 and "1 = 0" or alias .. ".item_id IN (" .. table.concat(marks, ",") .. ")"
        elseif meta.match ~= nil then
            local scope, serr = scopes.load(id)
            if serr or not scope then return nil, serr end
            if type(meta.match) ~= "table" or #meta.match == 0 or #meta.match > 16 then return nil, invalid("unknown_scope", "match declares 1..16 text columns") end
            local columns: { string } = {}
            args[#args + 1] = reader.board_id
            for _, raw in ipairs(meta.match) do
                local column = scopes.identifier(raw)
                if not column then return nil, invalid("unknown_scope", "match columns are identifiers") end
                columns[#columns + 1] = position .. "(lower(s." .. column .. "), lower(?)) > 0"
                args[#args + 1] = text
            end
            parts[#parts + 1] = "EXISTS (SELECT 1 FROM " .. scope.table .. " s WHERE s." .. scope.board_column .. " = ? AND s." .. scope.item_column .. " = " .. alias .. ".item_id AND (" .. table.concat(columns, " OR ") .. "))"
        end
    end
    if #parts == 0 then return nil, invalid("search_unavailable", "board declares no activated search scope") end
    return { sql = "(" .. table.concat(parts, " OR ") .. ")", args = args }, nil
end
return M
