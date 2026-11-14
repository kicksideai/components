-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local requests = require("requests")
local locate = require("locate")
local bulk = require("bulk")
local move = require("move")
local types = require("types")
local M = {}
local function run(method: string, input: unknown, call: (unknown) -> (unknown, error?)): (unknown, error?)
    local err = requests.parse(method, input)
    if err then return nil, err end
    local request = input :: types.Map
    local id, lerr = locate.resolve(request.board_id :: string?)
    if lerr or not id then return nil, lerr end
    request.board_id = id
    return call(request)
end
function M.bulk(input: unknown): (unknown, error?) return run("bulk", input, function(v: unknown): (unknown, error?) return bulk.start(v :: types.BulkRequest) end) end
function M.bulk_status(input: unknown): (unknown, error?) return run("bulk_status", input, function(v: unknown): (unknown, error?) return bulk.status(v :: types.Locator) end) end
function M.cancel_bulk(input: unknown): (unknown, error?) return run("cancel_bulk", input, function(v: unknown): (unknown, error?) return bulk.cancel(v :: types.Locator) end) end
function M.plan_move(input: unknown): (unknown, error?) return run("plan_move", input, function(v: unknown): (unknown, error?) return move.plan(v :: types.MoveRequest) end) end
function M.move(input: unknown): (unknown, error?) return run("move", input, function(v: unknown): (unknown, error?) return move.start(v :: types.MoveRequest) end) end
function M.move_status(input: unknown): (unknown, error?) return run("move_status", input, function(v: unknown): (unknown, error?) return move.status(v :: types.Locator) end) end
return M
