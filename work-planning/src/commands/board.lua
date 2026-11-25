-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local client = require("client")
local reads = require("reads")
local work = require("work")
local M = {}

M.PLUGIN = "kickside.work.planning:plugin"
M.SPRINT_FIELD = "current_sprint"

function M.problem(kind: string, code: string, message: string): error
    return errors.new({ kind = kind, message = message, details = { code = code } })
end

function M.stale(): error
    return M.problem(errors.CONFLICT, "planning_snapshot_stale", "The board changed during the Planning request.")
end

function M.active(board_id: string): (reads.SchemaView?, work.PluginView?, error?)
    local result, err = client.call("get_schema", { board_id = board_id })
    if err or not result then return nil, nil, err end
    local schema = result :: reads.SchemaView
    for _, plugin in ipairs(schema.plugins or {}) do
        if plugin.plugin == M.PLUGIN and plugin.active and plugin.attachment_id then return schema, plugin, nil end
    end
    return nil, nil, M.problem(errors.NOT_FOUND, "plugin_inactive", "Work Planning is inactive on this board.")
end

function M.get(board_id: string, item: string): (reads.GetResult?, error?)
    local result, err = client.call("get", { board_id = board_id, item = { id = item } })
    return result :: reads.GetResult?, err
end

function M.missing_sprint(): error
    return M.problem(errors.NOT_FOUND, "planning_sprint_unavailable", "Sprint not found on this board.")
end

function M.sprint(board_id: string, item: string, snapshot_seq: integer): (reads.GetResult?, error?)
    local result, err = M.get(board_id, item)
    if err or not result then return nil, err end
    if result.item.type ~= "sprint" or result.item.life ~= "live" then return nil, M.missing_sprint() end
    if result.snapshot_seq ~= snapshot_seq then return nil, M.stale() end
    return result, nil
end

return M
