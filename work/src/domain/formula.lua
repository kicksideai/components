-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local expr = require("expr")
local fields = require("fields")
local values = require("values")
local document = require("document")
local types = require("types")
local M = {}

-- Dependency tokens exclude quoted text, comments and member names.
local function references(expression: string): { [string]: boolean }
    local out: { [string]: boolean } = {}
    local i, previous = 1, ""
    while i <= #expression do
        local c = expression:sub(i, i)
        if c == '"' or c == "'" or c == "`" then
            local quote = c
            i = i + 1
            while i <= #expression do
                c = expression:sub(i, i)
                i = i + 1
                if c == "\\" then i = i + 1 elseif c == quote then break end
            end
            previous = "value"
        elseif expression:sub(i, i + 1) == "//" then
            i = (expression:find("\n", i + 2, true) or #expression) + 1
        elseif expression:sub(i, i + 1) == "/*" then
            i = (expression:find("*/", i + 2, true) or #expression) + 2
        elseif c:match("[%a_]") then
            local name = expression:sub(i):match("^[%w_]+") :: string
            if previous == "$" and name == "env" then out["$env"] = true
            elseif previous ~= "." then out[name] = true end
            i, previous = i + #name, name
        else
            if not c:match("%s") then previous = c end
            i = i + 1
        end
    end
    return out
end

function M.compile(list: { types.Field }): error?
    local by_code: { [string]: types.Field } = {}
    for _, f in ipairs(list) do by_code[f.code] = f end
    for _, f in ipairs(list) do
        if f.formula then
            local expression = f.formula.expression
            if #expression == 0 or #expression > 4096 then
                return errors.new({ kind = errors.INVALID, message = "formula expression holds 1..4096 bytes", details = { code = "formula_invalid", field = f.code } })
            end
            local _, err = expr.compile(expression)
            if err then return errors.new({ kind = errors.INVALID, message = err:message(), details = { code = "formula_invalid", field = f.code } }) end
            local dependencies = references(expression)
            if dependencies["$env"] then
                return errors.new({ kind = errors.INVALID, message = "formula fields use direct names; environment access has no dependency admission",
                    details = { code = "formula_invalid", field = f.code } })
            end
            f.formula.depends = {}
            for name in pairs(dependencies) do
                local source = by_code[name]
                if source then f.formula.depends[#f.formula.depends + 1] = source.id end
            end
            table.sort(f.formula.depends)
        end
    end
    local visiting: { [integer]: boolean } = {}
    local done: { [integer]: boolean } = {}
    local by_id: { [integer]: types.Field } = {}
    for _, f in ipairs(list) do by_id[f.id] = f end
    local visit: (types.Field) -> error?
    function visit(f: types.Field): error?
        if done[f.id] or not f.formula then return nil end
        if visiting[f.id] then return errors.new({ kind = errors.INVALID, message = "formula dependency cycle", details = { code = "formula_cycle", field = f.code } }) end
        visiting[f.id] = true
        for _, id in ipairs(f.formula.depends) do
            local err = visit(by_id[id] :: types.Field)
            if err then return err end
        end
        visiting[f.id], done[f.id] = nil, true
        return nil
    end
    for _, f in ipairs(list) do
        local err = visit(f)
        if err then return err end
    end
    return nil
end

function M.evaluate(board: types.Board, item: types.Item): ({ types.PatchStep }, { types.Finding })
    local env: { [string]: unknown } = { type = item.type, state = item.state, category = item.category, number = item.number,
        rank = item.rank, parent = item.parent_id, created_at = item.created_at, updated_at = item.updated_at }
    local carried: { [string]: boolean } = {}
    for _, code in ipairs(board.model.item_types[item.type].fields) do carried[code] = true end
    for _, f in ipairs(board.compiled.fields) do
        if carried[f.code] and not f.formula then env[f.code] = fields.value(f, item) end
    end
    local patches: { types.PatchStep } = {}
    local findings: { types.Finding } = {}
    local done: { [integer]: boolean } = {}
    local evaluate: (types.Field) -> ()
    function evaluate(f: types.Field)
        if done[f.id] or not f.formula or not carried[f.code] then return end
        for _, id in ipairs(f.formula.depends) do evaluate(board.model.by_id[id] :: types.Field) end
        local raw, err = expr.eval(f.formula.expression, env)
        local value: types.Value? = nil
        if not err then value, err = values.normalize(fields.shape(f), raw) end
        if not err and value ~= nil then err = fields.validate(f, value) end
        if err then
            value = nil
            findings[#findings + 1] = { code = "formula_failed", field = f.code, message = err:message() }
        end
        env[f.code], done[f.id] = value, true
        local step: types.PatchStep? = nil
        if value ~= nil then step = document.set_step(item.document, f.id, value)
        else step = document.remove_step(item.document, f.id, "unset") end
        if step then patches[#patches + 1] = step end
    end
    for _, f in ipairs(board.compiled.fields) do evaluate(f) end
    return patches, findings
end
return M
