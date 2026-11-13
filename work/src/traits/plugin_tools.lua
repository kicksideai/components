-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local registry = require("registry")
local board_client = require("board_client")
local manifests = require("manifests")
local types = require("types")
local M = {}
local function build(context: types.Map, reads_only: boolean): (types.Contribution?, error?)
    local plugins: { string } = {}
    if context.board_id ~= nil then
        local schema, err = board_client.call("get_schema", { board_id = context.board_id })
        if err then
            if err:kind() == errors.PERMISSION_DENIED then return { tools = {} }, nil end
            return nil, err
        end
        for _, plugin in ipairs((schema :: { plugins: { { plugin: string, active: boolean, problem: unknown? } } }).plugins or {}) do
            if plugin.active and not plugin.problem then plugins[#plugins + 1] = plugin.plugin end
        end
    else
        local entries, err = registry.find({ [".kind"] = "registry.entry", ["meta.type"] = "kickside.work.plugin" })
        if err then return nil, err end
        for _, entry in ipairs(entries or {}) do
            if entry.meta.tools ~= nil then plugins[#plugins + 1] = tostring(entry.id) end
        end
    end
    table.sort(plugins)
    local tools: { types.Tool } = {}
    local problems: { [string]: { code: string, message: string } } = {}
    local seen: { [string]: boolean } = {}
    for _, id in ipairs(plugins) do
        local manifest, err = manifests.load(id)
        if err then
            if err:kind() ~= errors.INVALID then return nil, err end
            problems[id] = { code = err:details().code :: string, message = err:message() }
        end
        for _, tool_id in ipairs(manifest and manifest.tools or {}) do
            local entry, terr = registry.get(tool_id)
            if terr then return nil, terr end
            local scopes = entry.meta.mcp and entry.meta.mcp.required_scopes or {}
            if not seen[tool_id] and (not reads_only or (#scopes == 1 and scopes[1] == "state.read")) then
                seen[tool_id] = true
                tools[#tools + 1] = { id = tool_id }
            end
        end
    end
    return { tools = tools, problems = problems }, nil
end
function M.working(_prompt: string, context: types.Map): (types.Contribution?, error?) return build(context, false) end
function M.reads_only(_prompt: string, context: types.Map): (types.Contribution?, error?) return build(context, true) end
return M
