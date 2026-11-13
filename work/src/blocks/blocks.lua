-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local types = require("types")
-- Function Blocks call one board contract method as the Flow's caller.
local board_client = require("board_client")
local M = {}


local function run(method: string, args: types.Args): (unknown, error?)
    local config = args.config or {}
    if not config.board_id or config.board_id == "" then
        return nil, errors.new({ kind = errors.INVALID, message = "config.board_id is required", details = { code = "invalid_config" } })
    end
    local input: types.Map = {}
    for key, value in pairs(args.input or {}) do input[key] = value end
    input.board_id = config.board_id
    return board_client.call(method, input)
end
function M.find(args: types.Args): (unknown, error?) return run("query", args) end
function M.get(args: types.Args): (unknown, error?) return run("get", args) end
function M.apply(args: types.Args): (unknown, error?) return run("apply", args) end
function M.report(args: types.Args): (unknown, error?) return run("report", args) end
function M.bulk(args: types.Args): (unknown, error?) return run("bulk", args) end
function M.bulk_status(args: types.Args): (unknown, error?) return run("bulk_status", args) end
function M.cancel_bulk(args: types.Args): (unknown, error?) return run("cancel_bulk", args) end
function M.plan_move(args: types.Args): (unknown, error?) return run("plan_move", args) end
function M.move(args: types.Args): (unknown, error?) return run("move", args) end
function M.move_status(args: types.Args): (unknown, error?) return run("move_status", args) end
return M
