-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- History predicates read durable audit changes and declared value intervals.
local values = require("values")
local operands = require("operands")
local types = require("types")

local M = {}

local KEYS: { [string]: boolean } = { field = true, ctx = true, was = true, changed = true, from = true, to = true, by = true, during = true }

local function invalid(message: string): error
    return errors.new({ details = { code = "invalid_filter" }, kind = errors.INVALID, message = message })
end

-- comparable reports whether a value's stored JSON identifies it: a field whose
-- equality folds case or converts units stores values that differ and compare equal.
local function comparable(target: types.ColumnTarget): boolean
    if target.set then return false end
    if target.shape.form == "quantity" then return false end
    return target.shape.config.case ~= "insensitive"
end

-- moment preserves an inclusive bound in the stored instant representation.
local function moment(reader: types.Reader, raw: unknown): (string?, error?)
    local v, err = operands.resolve(reader, raw)
    if err then return nil, err end
    local normal, nerr = values.normalize({ form = "time", cardinality = "one", config = {} }, v)
    if nerr or type(normal) ~= "string" then return nil, invalid("during takes timestamps") end
    local stem = (normal :: string):match("^(.-T%d%d:%d%d:%d%d)%.?%d*Z$")
    if not stem then return nil, invalid("during takes timestamps, not dates") end
    return values.key("time", normal, {})
end

local function parse(reader: types.Reader, resolve: types.Resolver, raw: unknown): (types.HistoryAsked?, error?)
    if type(raw) ~= "table" then return nil, invalid("history takes an object") end
    local h = raw :: { [string]: unknown }
    for k in pairs(h) do
        if not KEYS[k] then return nil, invalid("history has unknown key " .. tostring(k)) end
    end
    if type(h.field) ~= "string" then return nil, invalid("history needs a field") end
    if h.ctx ~= nil and type(h.ctx) ~= "table" then return nil, invalid("history takes ctx as an object") end
    local target, terr = resolve(h.field :: string, h.ctx :: { [string]: string }?)
    if terr or not target then return nil, terr or invalid("unknown field " .. tostring(h.field)) end
    if target.field_id == nil then return nil, invalid(tostring(h.field) .. " keeps no history") end

    local by: string? = nil
    if h.by ~= nil then
        if type(h.by) == "table" and (h.by :: { [string]: unknown })["$actor"] == nil then return nil, invalid("by takes an actor id") end
        local v, err = operands.resolve(reader, h.by)
        if err then return nil, err end
        if type(v) ~= "string" or v == "" then return nil, invalid("by takes an actor id") end
        by = v :: string
    end
    local from: string?, to: string? = nil, nil
    if h.during ~= nil then
        local d = h.during
        if type(d) ~= "table" or #(d :: { unknown }) ~= 2 then return nil, invalid("during takes [from, to]") end
        local list = d :: { unknown }
        local a, aerr = moment(reader, list[1])
        if aerr or not a then return nil, aerr or invalid("during takes timestamps") end
        local b, berr = moment(reader, list[2])
        if berr or not b then return nil, berr or invalid("during takes timestamps") end
        if a > b then return nil, invalid("during takes [from, to] in order") end
        from, to = a, b
    end
    if h.changed ~= nil and h.changed ~= true then return nil, invalid("changed takes true") end
    if (h.from ~= nil or h.to ~= nil) and h.changed ~= true then return nil, invalid("from and to require changed") end
    if h.was ~= nil and h.changed ~= nil then return nil, invalid("was and changed are separate history predicates") end
    local function encoded(raw: unknown): (string?, error?)
        if raw == nil then return nil, nil end
        if not comparable(target :: types.ColumnTarget) then return nil, invalid(tostring(h.field) .. " cannot compare history values") end
        local value, err = operands.resolve(reader, raw)
        if err then return nil, err end
        local input = value
        if target.coerce then
            local coerced, cerr = target.coerce(value)
            if cerr then return nil, cerr end
            input = coerced
        end
        local normal, nerr = values.normalize({ form = target.shape.form, cardinality = "one", config = target.shape.config }, input)
        if nerr or normal == nil then return nil, nerr or invalid("history requires a value") end
        return values.canonical(normal), nil
    end
    local held, herr = encoded(h.was)
    if herr then return nil, herr end
    local before, berr = encoded(h.from)
    if berr then return nil, berr end
    local after, aerr = encoded(h.to)
    if aerr then return nil, aerr end
    return { target = target, by = by, from = from, to = to, held = held, before = before, after = after }, nil
end

-- predicate writes the SQL of a parsed condition over the row at alias.
local function predicate(reader: types.Reader, alias_of_item: string, asked: types.HistoryAsked): types.Condition
    local target, by, from, to, held = asked.target, asked.by, asked.from, asked.to, asked.held
    local args: { unknown } = {}
    -- rows opens the change rows of this field of this item under alias.
    local function rows(alias: string): string
        args[#args + 1] = reader.board_id
        args[#args + 1] = "i:"
        args[#args + 1] = target.field_id
        return "SELECT 1 FROM kickside_work_change " .. alias .. " WHERE " .. alias .. ".board_id = ? AND " .. alias
            .. ".subject = (? || " .. alias_of_item .. ".item_id) AND " .. alias .. ".field_id = ?"
    end
    local function bind(text: string, value: unknown): string
        args[#args + 1] = value
        return text
    end
    local parts: { string } = {}
    if held and target.intervals then
        local field = target.field_id == -1 and "state" or target.field_id == -2 and "category" or tostring(target.field_id)
        local q = "SELECT 1 FROM kickside_work_interval v WHERE v.board_id = ? AND v.item_id = " .. alias_of_item .. ".item_id AND v.field_id = ? AND v.value_key = ?"
        local identity = (target.field_id == -1 or target.field_id == -2) and held:sub(2, -2) or held
        args = { reader.board_id, field, identity }
        if from then q = q .. bind(" AND v.started_at <= ?", to) .. bind(" AND (v.ended_at IS NULL OR v.ended_at > ?)", from) end
        if by then q = q .. bind(" AND v.actor = ?", by) end
        return { sql = "EXISTS (" .. q .. ")", args = args }
    elseif not held then
        if target.intervals then
            local field = target.field_id == -1 and "state" or target.field_id == -2 and "category" or tostring(target.field_id)
            local function identity(value: string): string
                return (target.field_id == -1 or target.field_id == -2) and value:sub(2, -2) or value
            end
            args = { reader.board_id, field }
            local q = [[SELECT 1 FROM (
                SELECT board_id,item_id,field_id,before_key AS before_value,value_key AS after_value,actor,started_at AS at
                FROM kickside_work_interval WHERE changed=1
                UNION ALL
                SELECT board_id,item_id,field_id,value_key AS before_value,end_value AS after_value,ended_by AS actor,ended_at AS at
                FROM kickside_work_interval WHERE end_seq IS NOT NULL
            ) v WHERE v.board_id=? AND v.item_id=]] .. alias_of_item .. ".item_id AND v.field_id=?"
            if asked.after then q = q .. bind(" AND v.after_value=?", identity(asked.after)) end
            if asked.before then q = q .. bind(" AND v.before_value=?", identity(asked.before)) end
            if by then q = q .. bind(" AND v.actor=?", by) end
            if from then q = q .. bind(" AND v.at>=?", from) .. bind(" AND v.at<=?", to) end
            return { sql = "EXISTS (" .. q .. ")", args = args }
        end
        local q = rows("h")
        if asked.before then q = q .. bind(" AND h.before = ?", asked.before) end
        if asked.after then q = q .. bind(" AND h.after = ?", asked.after) end
        if by then q = q .. bind(" AND h.actor = ?", by) end
        if from then q = q .. bind(" AND h.at >= ?", from) .. bind(" AND h.at <= ?", to) end
        parts[1] = "EXISTS (" .. q .. ")"
    elseif not from then
        local q = rows("h") .. bind(" AND h.after = ?", held)
        if by then q = q .. bind(" AND h.actor = ?", by) end
        parts[1] = "EXISTS (" .. q .. ")"
        if not by then
            parts[2] = "EXISTS (" .. rows("h") .. bind(" AND h.before = ?", held) .. ")"
        end
    else
        local set = rows("h") .. bind(" AND h.after = ?", held) .. bind(" AND h.at <= ?", to)
        if by then set = set .. bind(" AND h.actor = ?", by) end
        local later = rows("n") .. " AND (n.seq > h.seq OR (n.seq = h.seq AND n.n > h.n))" .. bind(" AND n.at < ?", from)
        parts[1] = "EXISTS (" .. set .. " AND NOT EXISTS (" .. later .. "))"
        if not by then
            local ended = rows("h") .. bind(" AND h.before = ?", held) .. bind(" AND h.at >= ?", from)
            local earlier = rows("n") .. " AND (n.seq < h.seq OR (n.seq = h.seq AND n.n < h.n))" .. bind(" AND n.at > ?", to)
            parts[2] = "EXISTS (" .. ended .. " AND NOT EXISTS (" .. earlier .. "))"
        end
    end
    return { sql = "(" .. table.concat(parts, " OR ") .. ")", args = args }
end

-- compile builds the condition's fragment over the row at alias_of_item.
function M.compile(reader: types.Reader, alias_of_item: string, resolve: types.Resolver, raw: unknown): (types.Condition?, error?)
    local asked, err = parse(reader, resolve, raw)
    if err or not asked then return nil, err end
    return predicate(reader, alias_of_item, asked), nil
end

return M
