-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Plugin configuration is validated at the attachment and recorded on the board thread.
local manifests = require("manifests")
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
local M = {}
function M.configure_plugin(request: types.ConfigureRequest): (types.ConfigureResult?, error?)
    local trace_context, trace_err = receipts.trace(request.trace_context, "work.configure")
    if trace_err then return nil, trace_err end
    local aerr = guard.require_access(request.board_id, guard.admin_access())
    if aerr then return nil, aerr end
    local manifest, merr = manifests.load(request.plugin)
    if merr or not manifest then return nil, merr end
    local app: domain.JsonObject = {}
    if manifest.settings then
        local values, verr = defaults.namespace(manifest.settings)
        if verr or not values then return nil, verr end
        app = values
    end
    local _, cerr = manifests.effective(manifest, app, request.config)
    if cerr then return nil, cerr end
    local snapshot, snapshot_err = access.with_snapshot(request.board_id, nil, function(tx: types.Executor, board: domain.Board, _dialect: string): (types.ConfigureSelection?, error?)
        local rows, rerr = plugin_rows.list(tx, board.board_id)
        if rerr then return nil, rerr end
        for _, row in ipairs(rows or {}) do
            if row.active and row.plugin == request.plugin then return { plugin = row, schema_version = board.schema_version }, nil end
        end
        return nil, errors.new({ kind = errors.NOT_FOUND, message = "plugin is inactive", details = { code = "plugin_inactive", plugin = request.plugin } })
    end, { admitted = { [request.board_id] = true }, holders = {} })
    if snapshot_err or not snapshot then return nil, snapshot_err end
    local selected = snapshot.plugin
    local client, oerr = threads.open()
    if oerr or not client then return nil, oerr end
    local event: domain.Event = { trace_context = trace_context, type = consts.EVENTS.PLUGIN_CONFIGURED, subject = "plugin:" .. request.plugin,
        body = { plugin = request.plugin, config = request.config, attachment = selected.attachment_id,
            actor = guard.actor_id(), at = guard.stamp_now(), source = "api" } }
    local seq, err = append.writes(client, request.board_id, { { group = event.subject, events = { event }, ops = {}, expect_subject = "schema", expect_version = snapshot.schema_version, caller_expect = true } })
    if err then return nil, err end
    local as_of, perr = receipts.covered(request.board_id, clock.deadline(consts.LIMITS.command_deadline_ms))
    if perr then return nil, perr end
    return { attachment_id = selected.attachment_id, as_of = as_of, seq = seq }, nil
end
return M
