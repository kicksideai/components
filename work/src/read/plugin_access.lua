-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Plugin services admit through active host intent and effective configuration.
local access = require("access")
local budget = require("budget")
local rows = require("rows")
local manifests = require("manifests")
local plugins = require("plugins")
local declarations = require("declarations")
local states = require("states")
local component = require("component")
local types = require("types")
local domain = require("domain")
local M = {}

function M.active(request: types.PluginContextRequest, context: types.ReadContext?): (types.PluginAdmission?, error?)
    local selected, err = access.with_snapshot(request.board_id, nil, function(tx: types.Executor, board: domain.Board): (types.PluginSelection?, error?)
        local row, rerr = rows.active(tx, board.board_id, request.plugin)
        if rerr then return nil, rerr end
        if row then return { state = row }, nil end
        return nil, errors.new({ kind = errors.NOT_FOUND, message = "plugin is inactive", details = { code = "plugin_inactive", plugin = request.plugin } })
    end, context)
    if err or not selected then return nil, err end
    local manifest, merr = manifests.load(request.plugin)
    if merr or not manifest then return nil, merr end
    local config, cerr = plugins.effective(manifest, selected.state.config)
    if cerr or not config then return nil, cerr end
    return { state = selected.state, manifest = manifest, config = config }, nil
end

function M.context(request: types.PluginContextRequest): (types.PluginContext?, error?)
    return budget.run(request, function(context: types.ReadContext): (types.PluginContext?, error?)
        local selected, err = M.active(request, context)
        if err or not selected then return nil, err end
        local state, manifest = selected.state, selected.manifest
        return { attachment_id = state.attachment_id, interface_version = manifest.interface_version, config = selected.config, lifecycle = state.lifecycle,
            projections = states.states(request.board_id, manifest) }, nil
    end)
end

function M.options(request: types.SchemaGetRequest): (types.PluginOptions?, error?)
    return budget.run(request, function(context: types.ReadContext): (types.PluginOptions?, error?)
        local result, err = access.with_snapshot(request.board_id, nil, function(tx: types.Executor, board: domain.Board, _dialect: string): (types.PluginOptions?, error?)
            local desired, derr = rows.list(tx, board.board_id)
            if derr then return nil, derr end
            local listed, lerr = plugins.list(board.board_id, desired or {}, board.compiled.plugins or {}, false, true)
            if lerr then return nil, lerr end
            local installed, terr = declarations.field_types()
            if terr then return nil, terr end
            return { plugins = listed, field_types = installed }, nil
        end, context, nil, nil, component.ACCESS.ADMIN :: integer)
        if err or not result then return nil, err end
        plugins.projections(request.board_id, result.plugins)
        return result, nil
    end)
end
return M
