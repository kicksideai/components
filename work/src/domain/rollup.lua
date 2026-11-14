-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local document = require("document")
local types = require("types")
local values = require("values")
local predicates = require("predicates")
local consts = require("consts")

local M = {}

-- Decimal arithmetic keeps base-ten digits exact through aggregation and division.

local function trim(s: string): string
    local out = s:gsub("^0+", "")
    return out == "" and "0" or out
end

local function compare(a: string, b: string): integer
    if #a ~= #b then return #a < #b and -1 or 1 end
    if a == b then return 0 end
    return a < b and -1 or 1
end

local function plus(a: string, b: string): string
    local carry, out = 0, ""
    for i = 0, math.max(#a, #b) - 1 do
        local x = i < #a and (a:byte(#a - i) - 48) or 0
        local y = i < #b and (b:byte(#b - i) - 48) or 0
        local n = x + y + carry
        out, carry = tostring(n % 10) .. out, n // 10
    end
    return carry > 0 and tostring(carry) .. out or out
end

local function minus(a: string, b: string): string
    local borrow, out = 0, ""
    for i = 0, #a - 1 do
        local n = a:byte(#a - i) - 48 - borrow - (i < #b and (b:byte(#b - i) - 48) or 0)
        borrow = n < 0 and 1 or 0
        out = tostring(n % 10) .. out
    end
    return trim(out)
end

local function digits(v: types.Dec): string
    return trim(tostring(v.m):gsub("^%-", "") .. string.rep("0", v.e + 12))
end

function M.decimal_compare(a: types.Dec, b: types.Dec): integer
    if a.m < 0 and b.m >= 0 then return -1 end
    if b.m < 0 and a.m >= 0 then return 1 end
    return compare(digits(a), digits(b)) * (a.m < 0 and -1 or 1)
end

-- aggregate rounds division half away from zero to fifteen significant digits and twelve fractional places.
-- A result outside the form's range holds no value.
function M.aggregate(input: { types.Dec }, divisor: integer, form: string, rounded: boolean?): types.Value?
    local total, sign = "0", 1
    for _, v in ipairs(input) do
        local n, s = digits(v), v.m < 0 and -1 or 1
        if s == sign then total = plus(total, n)
        elseif compare(total, n) >= 0 then total = minus(total, n)
        else total, sign = minus(n, total), s end
    end
    local quotient, remainder = "", 0
    for i = 1, #total do
        local n = remainder * 10 + total:byte(i) - 48
        quotient, remainder = quotient .. tostring(n // divisor), n % divisor
    end
    quotient = trim(quotient)
    if rounded and #quotient > 15 then
        local extra = #quotient - 15
        local kept = quotient:sub(1, 15)
        if quotient:byte(16) >= 53 then kept = plus(kept, "1") end
        quotient = kept .. string.rep("0", extra)
    elseif remainder * 2 >= divisor then quotient = plus(quotient, "1") end
    if #quotient <= 12 then quotient = string.rep("0", 13 - #quotient) .. quotient end
    local text = (sign < 0 and "-" or "") .. quotient:sub(1, -13) .. "." .. quotient:sub(-12)
    local value, err = values.normalize({ form = form, cardinality = "one", config = {} }, form == "int" and text:sub(1, -14) or text)
    if err then return nil end
    return value
end

-- Rollup declarations resolve sources to stable field ids.

local FUNCTIONS = { count = true, sum = true, min = true, max = true, avg = true, earliest = true, latest = true, percent_done = true, latest_of = true, any = true, all = true }

local function invalid(message: string, unsupported: boolean?): error
    return errors.new({ kind = errors.INVALID, message = message, details = { code = unsupported and "rollup_unsupported" or "invalid_schema" } })
end

function M.compile(fields: { types.Field }, decl: types.Declaration, relations: { types.Relation }): error?
    local by_key: { [string]: types.Field } = {}
    local by_relation: { [string]: boolean } = { children = true }
    for _, f in ipairs(fields) do by_key[f.code] = f end
    for _, r in ipairs(relations) do by_relation[r.id] = true end
    for _, d in ipairs(decl.fields or {}) do
        local f = by_key[d.code]
        if f.type == "rollup" then
            if not d.fn or not FUNCTIONS[d.fn] then return invalid("unknown rollup function") end
            if not d.of or not by_relation[d.of] then return invalid("unknown rollup relation") end
            if f.track or f.intervals or f.cardinality ~= "one" then return invalid("rollups carry a single untracked result") end
            local source = d.field and by_key[d.field]
            local expected: string
            if d.fn == "any" or d.fn == "all" then
                if d.field ~= nil or d.where == nil then return invalid("any and all require where and use rows") end
                expected = "bool"
            elseif d.fn == "count" or d.fn == "percent_done" then
                if d.field ~= nil then return invalid("count and percent_done use rows and categories") end
                expected = d.fn == "count" and "int" or "dec"
            else
                if not source then return invalid("unknown rollup source") end
                if source.type == "rollup" or source.type == "formula" then return invalid("computed rollup sources are unsupported") end
                if source.cardinality ~= "one" then return invalid("rollup source must be scalar") end
                if d.fn == "latest_of" then
                    if d.by ~= "rank" and d.by ~= "time" then return invalid("latest_of orders by rank or time") end
                    expected = source.form
                elseif d.fn == "earliest" or d.fn == "latest" then
                    if source.form ~= "time" then return invalid("earliest and latest require time") end
                    expected = "time"
                else
                    if source.form ~= "int" and source.form ~= "dec" and source.type ~= "option" then return invalid("numeric rollup requires int, dec or option") end
                    expected = d.fn == "avg" and "dec" or source.type == "option" and "int" or source.form
                end
            end
            if d.by ~= nil and d.fn ~= "latest_of" then return invalid("by belongs to latest_of") end
            if f.form ~= expected then return invalid("rollup result form must be " .. expected) end
            local used: { [string]: boolean } = {}
            local _, err = predicates.inspect(d.where, used, 1)
            if err then return err end
            if source then used[source.code] = true end
            local reads: { integer } = {}
            for _, dependency in ipairs(fields) do
                if used[dependency.code] then reads[#reads + 1] = dependency.id end
            end
            f.rollup = { of = d.of, fn = d.fn, field = source and source.id, by = d.by, where = d.where, reads = reads }
        elseif d.of ~= nil or d.fn ~= nil or d.field ~= nil or d.by ~= nil or d.where ~= nil then
            return invalid("rollup settings require type rollup")
        end
    end
    return nil
end

local function carriers(compiled: types.Compiled, code: string): types.JsonObject
    local out: types.JsonObject = {}
    for _, t in ipairs(compiled.item_types) do
        for _, key in ipairs(t.fields) do if key == code then out[t.id] = true end end
    end
    return out
end

local function meaning(compiled: types.Compiled, f: types.Field): unknown
    local sources: { [integer]: types.Field } = {}
    for _, s in ipairs(compiled.fields) do sources[s.id] = s end
    local r = f.rollup :: types.Rollup
    local source = r.field and sources[r.field]
    local orders: types.JsonObject = {}
    for _, o in ipairs(source and source.options or {}) do orders[o.id] = o.order end
    local carried = carriers(compiled, f.code)
    local relation: unknown = nil
    for _, rel in ipairs(compiled.relation_types) do
        if rel.id == r.of then relation = { symmetric = rel.symmetric, cardinality = rel.cardinality } end
    end
    local categories: types.JsonObject = {}
    if r.fn == "percent_done" then
        for _, p in ipairs(compiled.processes) do
            local states: types.JsonObject = {}
            for _, state in ipairs(p.states) do states[state.id] = state.category end
            categories[p.id] = states
        end
    end
    local predicate_fields: { [string]: boolean } = {}
    local _, _err = predicates.inspect(r.where, predicate_fields, 1)
    local dependencies: types.JsonObject = {}
    for _, field in ipairs(compiled.fields) do
        if predicate_fields[field.code] then
            local dependency: types.JsonObject = {}
            for key, value in pairs(field :: types.JsonObject) do
                if key ~= "title" then dependency[key] = value end
            end
            dependencies[field.code] = dependency
        end
    end
    return { rollup = r, relation = relation, categories = categories, dependencies = dependencies,
        predicate_relations = r.where ~= nil and compiled.relation_types or nil, form = f.form, config = f.config, carriers = carried,
        source = source and { type = source.type, form = source.form, cardinality = source.cardinality, config = source.config, orders = orders } }
end

function M.changed(prev: types.Compiled?, next: types.Compiled): boolean
    if not prev then return false end
    local old: { [integer]: types.Field } = {}
    for _, f in ipairs(prev.fields) do old[f.id] = f end
    for _, f in ipairs(next.fields) do
        local previous = old[f.id]
        if f.formula and (not previous or not values.equal(previous.formula, f.formula) or previous.form ~= f.form or not values.equal(previous.config, f.config)
            or not values.equal(carriers(prev, previous.code), carriers(next, f.code))) then return true end
        if f.rollup then
            local before = old[f.id]
            if not before or not before.rollup or not values.equal(meaning(prev, before), meaning(next, f)) then return true end
        end
    end
    return false
end

-- Closed rollup functions evaluate live source rows in deterministic order.

local function numeric(source: types.Field, value: types.Value): types.Dec
    if source.type == "option" then
        for _, o in ipairs(source.options or {}) do if o.id == value then return { m = o.order, e = 0 } end end
    end
    if source.form == "dec" then return value :: types.Dec end
    return { m = value :: integer, e = 0 }
end

local function time_key(value: types.Value): string
    local text = value :: string
    if #text == 10 then return text .. "T00:00:00." end
    local fraction = (text:match("%.(%d+)Z$") or ""):gsub("0+$", "")
    return text:sub(1, 19) .. "." .. fraction
end

function M.evaluate(field: types.Field, model: types.Model, rows: { types.Item }): types.Value?
    local r = field.rollup :: types.Rollup
    if r.fn == "count" then return #rows end
    if r.fn == "percent_done" then
        local done = 0
        for _, item in ipairs(rows) do if consts.TERMINAL[item.category] then done = done + 1 end end
        return M.aggregate({ { m = done * 100, e = 0 } }, math.max(1, #rows), "dec", true)
    end
    local source = model.by_id[r.field :: integer]
    if r.fn == "latest_of" then
        local chosen: types.Item? = nil
        for _, item in ipairs(rows) do
            local key = r.by == "rank" and (item.rank or "") or string.format("%020d", item.created_seq)
            local held = chosen and (r.by == "rank" and (chosen.rank or "") or string.format("%020d", chosen.created_seq))
            if not chosen or key > (held :: string) or (key == held and item.item_id > chosen.item_id) then chosen = item end
        end
        return chosen and document.value(chosen.document, source.id)
    end
    local input: { types.Dec } = {}
    local best: types.Value? = nil
    local best_number: types.Dec? = nil
    for _, item in ipairs(rows) do
        local value = document.value(item.document, source.id)
        if value ~= nil then
            if r.fn == "earliest" or r.fn == "latest" then
                if best == nil or (r.fn == "earliest" and time_key(value) < time_key(best))
                    or (r.fn == "latest" and time_key(value) > time_key(best)) then best = value end
            else
                local n = numeric(source, value)
                input[#input + 1] = n
                if not best_number or (r.fn == "min" and M.decimal_compare(n, best_number) < 0)
                    or (r.fn == "max" and M.decimal_compare(n, best_number) > 0) then best_number = n end
            end
        end
    end
    if r.fn == "earliest" or r.fn == "latest" then return best end
    if r.fn == "min" or r.fn == "max" then
        if not best_number then return nil end
        return field.form == "dec" and best_number or best_number.m
    end
    if r.fn == "avg" and #input == 0 then return nil end
    return M.aggregate(input, r.fn == "avg" and #input or 1, field.form, r.fn == "avg")
end

return M
