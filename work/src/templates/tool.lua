-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local ctx = require("ctx")
local client = require("client")
local types = require("types")
local catalog = require("catalog")
local M = {}

local function run(method: string, input: types.Map): (types.Map?, error?)
    local request: types.Map = {}
    for key, value in pairs(input) do request[key] = value end
    if request.board_id == nil then request.board_id = ctx.get("board_id") end
    local result, err = client.call(method, request, catalog.CONTRACT)
    if err then return nil, err end
    local answer = result :: types.Map
    answer.success = true
    return answer, nil
end

function M.list(input: types.Map): (types.Map?, error?) return run("list", input) end
function M.publish(input: types.Map): (types.Map?, error?) return run("publish", input) end
function M.archive(input: types.Map): (types.Map?, error?) return run("archive", input) end
function M.instantiate(input: types.Map): (types.Map?, error?) return run("instantiate", input) end

return M
