-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Checked codecs for the module's SQL rows and JSON columns.
local sql = require("sql")
local json = require("json")
local types = require("types")
local error_envelope = require("error_envelope")
local policy = require("policy")
local M = {}

local function int(v: unknown): integer?
    if type(v) == "number" then return math.tointeger(v) end
    if type(v) == "string" then return math.tointeger(tonumber(v)) end
    return nil
end

-- text reads a nullable text column.
local function text(v: unknown): string?
    if type(v) == "string" then return v end
    return nil
end

local function corrupt(column: string): error
    return errors.new({ kind = errors.INTERNAL, message = "work row lacks " .. column, details = { code = "row_corrupt", column = column } })
end

-- need reads a required text column; a missing one means a corrupt row.
local function need(row: types.Row?, column: string): (string?, error?)
    local v = row and row[column]
    if type(v) ~= "string" then return nil, corrupt(column) end
    return v, nil
end

-- need_int reads a required integer column.
local function need_int(row: types.Row?, column: string): (integer?, error?)
    local v = row and int(row[column])
    if v == nil then return nil, corrupt(column) end
    return v, nil
end

-- stored decodes a JSON column the module owns.
local function stored<T>(v: unknown, default: T): (T?, error?)
    if v == nil or v == sql.NULL then return default, nil end
    if type(v) ~= "string" or v == "" then return nil, corrupt("json") end
    local value, err = json.decode(v)
    if err then return nil, error_envelope.wrap(err, "work row holds malformed JSON", { code = "row_corrupt" }) end
    if value == nil then return default, nil end
    return value :: T, nil
end

M.int, M.text, M.need, M.need_int, M.stored = int, text, need, need_int, stored

function M.object(row: types.Row, texts: { string }, integers: { string }, documents: { string }): (types.Row?, error?)
    local out: types.Row = {}
    for key, value in pairs(row) do out[key] = value end
    for _, name in ipairs(texts) do
        local value, err = need(row, name)
        if err then return nil, err end
        out[name] = value
    end
    for _, name in ipairs(integers) do
        local value, err = need_int(row, name)
        if err then return nil, err end
        out[name] = value
    end
    for _, name in ipairs(documents) do
        local value, err = stored(row[name], nil)
        if err then return nil, err end
        if type(value) ~= "table" then return nil, corrupt(name) end
        out[name] = value
    end
    return out, nil
end

-- compiled checks the stored schema collections before model construction.
function M.compiled(raw: unknown): (types.Compiled?, error?)
    local value, err = stored(raw, nil)
    if err then return nil, err end
    if type(value) ~= "table" then return nil, corrupt("compiled") end
    local object = value :: types.Row
    for _, name in ipairs({ "fields", "item_types", "relation_types", "processes" }) do
        if type(object[name]) ~= "table" then return nil, corrupt("compiled." .. name) end
        for _, entry in pairs(object[name] :: types.Row) do
            if type(entry) ~= "table" then return nil, corrupt("compiled." .. name) end
            local key = name == "fields" and "code" or "id"
            if type((entry :: types.Row)[key]) ~= "string" then return nil, corrupt("compiled." .. name .. "." .. key) end
            if name == "fields" and int((entry :: types.Row).id) == nil then return nil, corrupt("compiled.fields.id") end
        end
    end
    policy.upgrade(value :: types.Compiled)
    return value :: types.Compiled, nil
end

function M.item(row: types.Row): (types.Item?, error?)
    local checked, err = M.object(row,
        { "board_id", "item_id", "type", "state", "category", "path", "life" },
        { "number", "process_generation", "visit", "version", "created_seq", "updated_seq" }, { "document", "findings" })
    if err or not checked then return nil, err end
    for _, name in ipairs({ "move_id", "parent_id", "rank", "life_at", "created_at", "updated_at" }) do checked[name] = text(row[name]) end
    local work, werr = M.stored(row.process_data, {} :: types.ProcessData)
    if werr then return nil, werr end
    checked.work = work
    return checked :: types.Item, nil
end

function M.comment(row: types.Row): (types.CommentRow?, error?)
    local checked, err = M.object(row, { "comment_id", "item_id", "body", "author", "created_at" }, { "version", "deleted" }, { "mentions" })
    if err or not checked then return nil, err end
    checked.deleted = checked.deleted == 1
    checked.edited_at = text(row.edited_at)
    return checked :: types.CommentRow, nil
end

return M
