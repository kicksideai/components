-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local funcs = require("funcs")
local sql = require("sql")
local shape = require("shape")
local schemas = require("schemas")
local types = require("types")
local work = require("work")
local items = require("items")
local reports = require("reports")
local snapshot = require("snapshot")
local names = require("names")
local M = {}

function M.validate(method: string, input: unknown): error?
    return shape.check(schemas[method].input :: work.JsonObject, input, "Time " .. method .. " request")
end

local function mutation(method: string, input: unknown): (unknown, error?)
    local err = M.validate(method, input)
    if err then return nil, err end
    return funcs.call("kickside.work.time.worklogs:" .. method, input)
end

function M.create(input: unknown): (unknown, error?) return mutation("create", input) end
function M.edit(input: unknown): (unknown, error?) return mutation("edit", input) end
function M.delete(input: unknown): (unknown, error?) return mutation("delete", input) end

function M.list(input: unknown): (types.Listing?, error?)
    local err = M.validate("list", input)
    if err then return nil, err end
    local result, failure = reports.list(input :: types.Request)
    if failure or not result then return nil, failure end
    local name_err = names.attach(result.entries)
    if name_err then return nil, name_err end
    return result, nil
end

function M.totals(input: unknown): (types.Report?, error?)
    local err = M.validate("totals", input)
    if err then return nil, err end
    local result, failure = reports.totals(input :: types.Request)
    if failure or not result then return nil, failure end
    if result.groups then
        local name_err = names.attach(result.groups)
        if name_err then return nil, name_err end
    end
    return result, nil
end

function M.summary(input: unknown): ({ items: { types.Summary } }?, error?)
    local err = M.validate("summary", input)
    if err then return nil, err end
    local request = input :: { board_id: string, items: { string } }
    return items.summary(request.board_id, request.items)
end

function M.estimate_fields(input: unknown): ({ original: string, remaining: string }?, error?)
    local err = M.validate("estimate_fields", input)
    if err then return nil, err end
    local request = input :: { board_id: string }
    return snapshot.run(request.board_id, function(_: sql.Transaction, _: types.Context)
        return { original = items.ORIGINAL, remaining = items.REMAINING }, nil
    end)
end

return M
