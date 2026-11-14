-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- The generated table of a board: its system columns, indexed fields and row values.
local document = require("document")
local hash = require("hash")
local values = require("values")
local types = require("types")

local fields = require("fields")
local M = {}
local SYSTEM: { types.SystemColumn } = {
    { name = "type", kind = "text" }, { name = "state", kind = "text" }, { name = "category", kind = "text" },
    { name = "path", kind = "text" }, { name = "rank", kind = "text" },
    { name = "number", kind = "int" }, { name = "life", kind = "text" }, { name = "version", kind = "int" },
    { name = "created_seq", kind = "int" }, { name = "updated_seq", kind = "int" },
    { name = "created_at", kind = "text" }, { name = "updated_at", kind = "text" },
}

-- names returns the table names of a board's generated table set; a layout change
-- alters the set in place, so a board keeps one set for its lifetime.
function M.names(board_id: string): types.GeneratedNames
    local base = "work_" .. tostring(hash.sha256(board_id)):gsub("[^a-fA-F0-9]", ""):lower():sub(1, 16)
    return { base = base, item = base .. "_item", set = base .. "_set" }
end

function M.layout(compiled: types.Compiled): types.Layout
    local out: types.Layout = { columns = {}, sets = {} }
    for _, f in ipairs(compiled.fields) do
        if f.index ~= "none" then
            local set = f.cardinality ~= "one"
            local c: types.LayoutColumn = { field_id = f.id, kind = set and "key" or f.index,
                column = "f" .. f.id .. "_" .. (set and "set" or f.index) }
            local list = set and out.sets or out.columns
            if f.type == "option" and not set and f.index == "number" then
                out.columns[#out.columns + 1] = { field_id = f.id, kind = "key", column = "f" .. f.id .. "_key" }
            end
            list[#list + 1] = c
            out.columns[#out.columns + 1] = { field_id = f.id, kind = "state", column = "f" .. f.id .. "_state" }
        end
    end
    out.columns[#out.columns + 1] = { field_id = -3, kind = "key", column = "parent_id" }
    out.sets[#out.sets + 1] = { field_id = -4, kind = "key", column = "path_under" }
    return out
end

function M.of(board_id: string, l: types.Layout, relations: { [string]: types.Relation }?): types.GeneratedTable
    return { names = M.names(board_id), layout = l, system = SYSTEM,
        indexes = { { "life", "rank", "item_id" }, { "type", "state" }, { "parent_id" }, { "number" }, { "updated_seq" } },
        relations = relations or {} }
end

function M.signature(compiled: types.Compiled): string
    local indexed: types.JsonObject = { visibility = compiled.visibility :: types.Json }
    for _, f in ipairs(compiled.fields) do
        if f.index ~= "none" then
            local options: types.JsonObject = {}
            for _, o in ipairs(f.options or {}) do options[o.id] = o.order end
            indexed[tostring(f.id)] = { form = f.form, cardinality = f.cardinality, index = f.index,
                config = f.config :: types.Json, options = options }
        end
    end
    return values.canonical(indexed)
end

-- unbuilt names indexed fields whose generated representation changes.
function M.unbuilt(previous: types.Compiled?, current: types.Compiled): { string }
    local before: { [integer]: types.Field } = {}
    for _, f in ipairs(previous and previous.fields or {}) do before[f.id] = f end
    local out: { string } = {}
    for _, f in ipairs(current.fields) do
        if f.index ~= "none" then
            local old = before[f.id]
            local prior: types.Compiled = { fields = old and { old } or {} } :: types.Compiled
            local next: types.Compiled = { fields = { f } } :: types.Compiled
            if M.signature(prior) ~= M.signature(next) then out[#out + 1] = f.code end
        end
    end
    return out
end

function M.target(field: types.Field, c: types.LayoutColumn, raw: unknown): (unknown, error?)
    if field.type == "option" and c.kind == "number" then
        for _, o in ipairs(field.options or {}) do if o.id == raw then return o.order end end
        return raw
    end
    if field.type == "item" then return fields.item_ref(raw) end
    if field.type == "principal" then
        if type(raw) == "string" then return { ref = { "principal", "user:" .. raw } } end
        if type(raw) == "table" then
            local p = raw :: { [string]: unknown }
            if type(p.kind) == "string" and type(p.id) == "string" then return { ref = { "principal", p.kind .. ":" .. p.id } } end
        end
    end
    return raw
end

function M.row(board: types.Board, item: types.Item, prepared: types.Layout?): (types.IndexRow?, error?)
    local row: types.IndexRow = { id = item.item_id, system = {
        type = item.type, state = item.state, category = item.category, parent_id = item.parent_id or "", path = item.path,
        rank = item.rank or "", number = item.number, life = item.life, version = item.version,
        created_seq = item.created_seq, updated_seq = item.updated_seq, created_at = item.created_at or "", updated_at = item.updated_at or "",
    }, values = {}, sets = {} }
    if item.parent_id then row.values.parent_id = item.parent_id end
    row.sets.path_under = {}
    for ancestor in item.path:gmatch("/([^/]+)") do
        if ancestor ~= item.item_id then row.sets.path_under[#row.sets.path_under + 1] = ancestor end
    end
    for _, name in ipairs({ "created_at", "updated_at" }) do
        local raw = row.system[name]
        if type(raw) == "string" and raw ~= "" then
            local key, err = values.key("time", raw, {})
            if err then return nil, err end
            row.system[name] = key or ""
        end
    end
    local l = prepared or M.layout(board.compiled)
    for _, list in ipairs({ l.columns, l.sets }) do
        for _, c in ipairs(list) do
            local f = board.model.by_id[c.field_id]
            local value = f and fields.value(f, item)
            if f and c.kind == "state" then
                row.values[c.column] = f.type == "rank" and (item.rank and "provided" or "absent") or document.state(item.document, f.id)
            elseif f and value ~= nil then
                if f.cardinality ~= "one" then
                    local keys: { string } = {}
                    for _, member in ipairs(values.members({ form = f.form, cardinality = f.cardinality, config = f.config }, value)) do
                        local key, err = fields.representation(f, member)
                        if err then return nil, err end
                        if key then keys[#keys + 1] = key end
                    end
                    row.sets[c.column] = keys
                else
                    local v, err = fields.representation(f, value :: types.Scalar, c.kind)
                    if err then return nil, err end
                    if v ~= nil then row.values[c.column] = v end
                end
            end
        end
    end
    return row, nil
end

return M
