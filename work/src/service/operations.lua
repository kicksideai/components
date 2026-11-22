-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local requests = require("requests")
local locate = require("locate")
local bulk = require("bulk")
local move = require("move")
local types = require("types")
local M = {}
local function run<Request, Result>(method: string, input: unknown, call: (Request) -> (Result?, error?)): (Result?, error?)
    local err = requests.parse(method, input)
    if err then return nil, err end
    local request = input :: types.Map
    local id, lerr = locate.resolve(request.board_id :: string?)
    if lerr or not id then return nil, lerr end
    request.board_id = id
    return call(request :: Request)
end

function M.bulk(input: unknown): (types.Status?, error?)
    return run("bulk", input, bulk.start)
end

function M.bulk_status(input: unknown): (types.Status?, error?)
    return run("bulk_status", input, bulk.status)
end

function M.cancel_bulk(input: unknown): (types.Status?, error?)
    return run("cancel_bulk", input, bulk.cancel)
end

function M.plan_move(input: unknown): (types.MovePlan?, error?)
    return run("plan_move", input, move.plan)
end

function M.move(input: unknown): (types.Status?, error?)
    return run("move", input, move.start)
end

function M.move_status(input: unknown): (types.Status?, error?)
    return run("move_status", input, move.status)
end
return M
