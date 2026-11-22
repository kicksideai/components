-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Plugin configuration is validated at the attachment and recorded on the board thread.
local sql = require("sql")
local hash = require("hash")
local manifests = require("manifests")
local plugins = require("plugins")
local plugin_schema = require("plugin_schema")
local schema = require("schema")
local values = require("values")
local defaults = require("defaults")
local plugin_rows = require("plugin_rows")
local threads = require("threads")
local append = require("append")
local receipts = require("receipts")
local guard = require("guard")
local clock = require("clock")
local consts = require("consts")
local domain = require("domain")
local access = require("access")
local types = require("types")
local limits = require("limits")
local M = {}

function M.prepare_schema(db: sql.DB, board_id: string, generation: integer, snapshot: types.SchemaSnapshot,
    effective: domain.Declaration, request: types.SchemaRequest): ({ compiled: domain.Compiled, config_changes: { domain.SchemaChange } }?, error?)
    local current = snapshot.board and snapshot.board.compiled
    local configured, config_err = plugin_rows.list(db, board_id)
    if config_err then return nil, config_err end
    local config_changes: { domain.SchemaChange } = {}
    local configs: { [string]: domain.JsonObject } = {}
    local listed: { [string]: boolean } = {}
    for _, entry in ipairs(effective.plugins or {}) do listed[entry.use] = true end
    for _, row in ipairs(configured or {}) do
        if row.active then configs[row.plugin] = row.config end
    end
    for id, config in pairs(request.plugin_configs or {}) do
        if not listed[id] then return nil, guard.invalid("configuration names an unlisted plugin", { code = "plugin_unlisted" }) end
        if configs[id] and not values.equal(configs[id], config) then
            config_changes[#config_changes + 1] = { what = "plugin.config", class = "cosmetic", code = id }
        end
        configs[id] = config
    end
    if request.declaration.plugins ~= nil or next(request.plugin_configs or {}) ~= nil then
        local previous = snapshot.declaration
        local resolved, err = plugins.compile(effective.plugins, configs, board_id, previous and previous.plugins)
        if err then return nil, err end
        effective.plugins = resolved
        for _, plugin in ipairs(effective.plugins or {}) do plugin.attachment_kind = nil end
    end
    local removal_err = plugin_schema.check_removal(effective, current)
    if removal_err then return nil, removal_err end
    local composed, owners, compose_err = plugin_schema.compose(effective, current)
    if compose_err or not composed or not owners then return nil, compose_err end
    local settings, setting_err = defaults.read()
    if setting_err or not settings then return nil, setting_err end
    local built, cerr = schema.compile(current, composed, generation, configs, settings :: domain.JsonObject)
    if cerr or not built then return nil, cerr end
    plugin_schema.stamp(built, owners)
    for _, plugin in ipairs(built.plugins or {}) do
        local previous_plugin: domain.PluginDecl? = nil
        for _, old in ipairs(current and current.plugins or {}) do if old.use == plugin.use then previous_plugin = old end end
        if previous_plugin then plugin.attachment_id = previous_plugin.attachment_id
        else
            local digest = tostring(hash.sha256(board_id .. "\0" .. plugin.use .. "\0" .. generation))
            plugin.attachment_id = digest:sub(1, 8) .. "-" .. digest:sub(9, 12) .. "-5" .. digest:sub(14, 16) .. "-8" .. digest:sub(18, 20) .. "-" .. digest:sub(21, 32)
        end
    end
    return { compiled = built, config_changes = config_changes }, nil
end

function M.configure_plugin(request: types.ConfigureRequest): (types.ConfigureResult?, error?)
    local trace_context, trace_err = receipts.trace(request.trace_context, "work.configure")
    if trace_err then return nil, trace_err end
    local aerr = guard.require_access(request.board_id, guard.admin_access())
    if aerr then return nil, aerr end
    local manifest, merr = manifests.load(request.plugin)
    if merr or not manifest then return nil, merr end
    if request.config ~= nil then
        local _, cerr = plugins.effective(manifest, request.config)
        if cerr then return nil, cerr end
    end
    local snapshot, snapshot_err = access.with_snapshot(request.board_id, nil, function(tx: types.Executor, board: domain.Board, _dialect: string): (types.ConfigureSelection?, error?)
        local plugin, rerr = plugin_rows.active(tx, board.board_id, request.plugin)
        if rerr then return nil, rerr end
        if plugin then return { plugin = plugin, schema_version = board.schema_version }, nil end
        return nil, errors.new({ kind = errors.NOT_FOUND, message = "plugin is inactive", details = { code = "plugin_inactive", plugin = request.plugin } })
    end, { admitted = { [request.board_id] = true }, holders = {} })
    if snapshot_err or not snapshot then return nil, snapshot_err end
    local deadline, deadline_err = limits.deadline("command_deadline_ms")
    if deadline_err or not deadline then return nil, deadline_err end
    local selected = snapshot.plugin
    local client, oerr = threads.open()
    if oerr or not client then return nil, oerr end
    local event: domain.Event = { trace_context = trace_context, type = request.config ~= nil and consts.EVENTS.PLUGIN_CONFIGURED or consts.EVENTS.PLUGIN_REBUILD, subject = "plugin:" .. request.plugin,
        body = { plugin = request.plugin, config = request.config, attachment = selected.attachment_id,
            actor = guard.actor_id(), at = guard.stamp_now(), source = "api" } }
    local seq, err = append.writes(client, request.board_id, { { group = event.subject, events = { event }, ops = {}, expect_subject = "schema", expect_version = snapshot.schema_version, caller_expect = true } })
    if err then return nil, err end
    local as_of, perr = receipts.covered(request.board_id, deadline, seq)
    if perr then return nil, perr end
    return { attachment_id = selected.attachment_id, as_of = as_of, seq = seq }, nil
end
return M
