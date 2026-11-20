-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Type functions: a kickside.pim.type may name a normalize and a validate
-- function. Both are pure and batched per attribute: { config, values[] } ->
-- { results[] }, one result per value in order. A command calls them once per
-- attribute, as the caller. An out-of-shape answer makes the command unavailable;
-- a function failure retains its native classification.
local funcs = require("funcs")
local types = require("types")

local shape = require("shape")
local M = {}

local function unavailable(fn: string, message: string, cause: error?): error
    if cause then return errors.wrap(cause, "type function " .. fn .. " " .. message) end
    return errors.new({ kind = errors.UNAVAILABLE, retryable = true, message = "type function " .. fn .. " " .. message,
        details = { code = "contract_unavailable" }, cause = cause })
end

-- results answers the results list of one call, checked to be a list of
-- tables as long as the values.
local function results(fn: string, config: types.JsonObject, values: { unknown }): ({ { [string]: unknown } }?, error?)
    local request: types.TypeFunctionRequest = { config = config, values = values }
    local out, err = funcs.new():call(fn, request)
    if err then return nil, unavailable(fn, "failed", err) end
    if type(out) ~= "table" or type((out :: { [string]: unknown }).results) ~= "table" then return nil, unavailable(fn, "answered no results list") end
    local list = (out :: { [string]: unknown }).results :: { unknown }
    if shape.array_length(list) ~= #values then return nil, unavailable(fn, "answered " .. #list .. " results for " .. #values .. " values") end
    local typed: { { [string]: unknown } } = {}
    for i, r in ipairs(list) do
        if type(r) ~= "table" then return nil, unavailable(fn, "answered a result that is not an object") end
        typed[i] = r :: { [string]: unknown }
    end
    return typed, nil
end

-- normalize refines values through fn: each result carries the refined value
-- or the error that refuses the value.
function M.normalize(fn: string, config: types.JsonObject, values: { unknown }): ({ types.Normalized }?, error?)
    local list, err = results(fn, config, values)
    if err or not list then return nil, err end
    local out: { types.Normalized } = {}
    for i, r in ipairs(list) do
        if r.error ~= nil and r.value ~= nil then return nil, unavailable(fn, "answered both a value and an error") end
        if r.error ~= nil then
            if type(r.error) ~= "string" or r.error == "" then return nil, unavailable(fn, "answered an error that is not a message") end
            out[i] = { error = r.error :: string }
        elseif r.value ~= nil then
            out[i] = { value = r.value }
        else
            return nil, unavailable(fn, "answered a result without a value or an error")
        end
    end
    return out, nil
end

-- validate answers the findings of each value through fn.
function M.validate(fn: string, config: types.JsonObject, values: { unknown }): ({ { types.TypeFinding } }?, error?)
    local list, err = results(fn, config, values)
    if err or not list then return nil, err end
    local out: { { types.TypeFinding } } = {}
    for i, r in ipairs(list) do
        if not shape.findings(r.findings) then return nil, unavailable(fn, "answered a result without a findings list") end
        local findings: { types.TypeFinding } = {}
        for _, f in ipairs(r.findings :: { unknown }) do
            if type(f) ~= "table" or type((f :: { [string]: unknown }).message) ~= "string" then return nil, unavailable(fn, "answered a finding without a message") end
            local t = f :: { [string]: unknown }
            if t.code ~= nil and type(t.code) ~= "string" then return nil, unavailable(fn, "answered a finding code that is not a string") end
            findings[#findings + 1] = { code = t.code :: string?, message = t.message :: string }
        end
        out[i] = findings
    end
    return out, nil
end

return M
