-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local types = require("types")
local ctx = require("ctx")
local board_client = require("board_client")
local M = {}

local function run(contract_id: string, method: string, args: types.Map, board_context: boolean): (types.Map?, error?)
    local input: types.Map = {}
    for key, value in pairs(args) do input[key] = value end
    if board_context and input.board_id == nil then input.board_id = ctx.get("board_id") end
    local out, err = board_client.call(method, input, contract_id)
    if err then return nil, err end
    local result = out :: types.Map
    result.success = true
    return result, nil
end
function M.list_boards(args: types.Map): (types.Map?, error?) return run("kickside.work:board", "list", args, false) end
function M.get_schema(args: types.Map): (types.Map?, error?) return run("kickside.work:board", "get_schema", args, true) end
function M.find_items(args: types.Map): (types.Map?, error?) return run("kickside.work:board", "query", args, true) end
function M.get_item(args: types.Map): (types.Map?, error?) return run("kickside.work:board", "get", args, true) end
function M.count(args: types.Map): (types.Map?, error?) return run("kickside.work:board", "count", args, true) end
function M.explain(args: types.Map): (types.Map?, error?) return run("kickside.work:board", "explain", args, true) end
function M.list_history(args: types.Map): (types.Map?, error?) return run("kickside.work:board", "list_history", args, true) end
function M.get_time_in_state(args: types.Map): (types.Map?, error?) return run("kickside.work:board", "get_time_in_state", args, true) end
function M.list_links(args: types.Map): (types.Map?, error?) return run("kickside.work:board", "list_links", args, true) end
function M.list_stage_runs(args: types.Map): (types.Map?, error?) return run("kickside.work:board", "list_stage_runs", args, true) end
function M.list_comments(args: types.Map): (types.Map?, error?) return run("kickside.work:board", "list_comments", args, true) end
function M.list_changes(args: types.Map): (types.Map?, error?) return run("kickside.work:board", "list_changes", args, true) end
function M.bulk_status(args: types.Map): (types.Map?, error?) return run("kickside.work:board", "bulk_status", args, true) end
function M.move_status(args: types.Map): (types.Map?, error?) return run("kickside.work:board", "move_status", args, true) end
function M.list_packs(args: types.Map): (types.Map?, error?) return run("kickside.work:board", "list_packs", args, false) end
function M.list_views(args: types.Map): (types.Map?, error?) return run("kickside.work:view", "list", args, true) end
function M.get_view(args: types.Map): (types.Map?, error?) return run("kickside.work:view", "get", args, false) end
function M.run_view(args: types.Map): (types.Map?, error?) return run("kickside.work:view", "run", args, false) end
function M.apply(args: types.Map): (types.Map?, error?) return run("kickside.work:board", "apply", args, true) end
function M.transition(args: types.Map): (types.Map?, error?) return run("kickside.work:board", "apply", args, true) end
function M.comment(args: types.Map): (types.Map?, error?) return run("kickside.work:board", "apply", args, true) end
function M.approve(args: types.Map): (types.Map?, error?) return run("kickside.work:board", "approve", args, true) end
function M.report(args: types.Map): (types.Map?, error?) return run("kickside.work:board", "report", args, true) end
function M.bulk(args: types.Map): (types.Map?, error?) return run("kickside.work:board", "bulk", args, true) end
function M.cancel_bulk(args: types.Map): (types.Map?, error?) return run("kickside.work:board", "cancel_bulk", args, true) end
function M.create_view(args: types.Map): (types.Map?, error?) return run("kickside.work:view", "create", args, true) end
function M.save_view(args: types.Map): (types.Map?, error?) return run("kickside.work:view", "save", args, false) end
function M.rename_view(args: types.Map): (types.Map?, error?) return run("kickside.work:view", "rename", args, false) end
function M.delete_view(args: types.Map): (types.Map?, error?) return run("kickside.work:view", "delete", args, false) end
function M.create_board(args: types.Map): (types.Map?, error?) return run("kickside.work:board", "create", args, false) end
function M.update_board(args: types.Map): (types.Map?, error?) return run("kickside.work:board", "update", args, true) end
function M.plan_schema(args: types.Map): (types.Map?, error?) return run("kickside.work:board", "plan_schema", args, true) end
function M.apply_schema(args: types.Map): (types.Map?, error?) return run("kickside.work:board", "apply_schema", args, true) end
function M.pack_plan(args: types.Map): (types.Map?, error?) return run("kickside.work:board", "pack_plan", args, true) end
function M.pack_apply(args: types.Map): (types.Map?, error?) return run("kickside.work:board", "pack_apply", args, true) end
function M.configure_plugin(args: types.Map): (types.Map?, error?) return run("kickside.work:board", "configure_plugin", args, true) end
function M.plan_move(args: types.Map): (types.Map?, error?) return run("kickside.work:board", "plan_move", args, true) end
function M.move(args: types.Map): (types.Map?, error?) return run("kickside.work:board", "move", args, true) end
return M
