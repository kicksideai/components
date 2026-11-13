-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local registry = require("registry")
local M = {}
function M.validate(input: unknown): (boolean?, error?)
    if type(input) ~= "table" then
        return nil, errors.new({ kind = errors.INVALID, message = "tool reference requires plugin and tool ids", details = { code = "plugin_tool_invalid" } })
    end
    local request = input :: { plugin: unknown, tool: unknown }
    if type(request.plugin) ~= "string" or type(request.tool) ~= "string" or request.tool == "" then
        return nil, errors.new({ kind = errors.INVALID, message = "tool reference requires plugin and tool ids", details = { code = "plugin_tool_invalid" } })
    end
    local entry, err = registry.get(request.tool)
    if err and err:kind() ~= errors.NOT_FOUND then return nil, errors.wrap(err, "plugin tool lookup") end
    if not entry or not entry.meta or entry.meta.type ~= "tool" then
        return nil, errors.new({ kind = errors.INVALID, message = "plugin tools must name registered tools", details = { code = "plugin_tool_invalid", plugin = request.plugin } })
    end
    return true, nil
end
return M
