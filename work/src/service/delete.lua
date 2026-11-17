-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local component = require("component")
local sql = require("sql")
local service_types = require("service_types")
local automation_db = require("automation_db") :: service_types.AutomationDB
local command = require("automation_command")
local envelope = require("envelope")
local component_types = require("component_types")
local identifiers = require("identifiers")
local automations = require("automations")
local guard = require("guard")
local requests = require("requests")
local M = {}
-- Core refuses a board with live children before invoking its deletable callback.
-- Remove only the selected install whose receipt belongs to this board.
function M.delete(input: unknown): (unknown, error?)
    local invalid = requests.parse("delete", input)
    if invalid then return nil, invalid end
    local request = input :: { board_id: string }
    local board_id = request.board_id
    local denied = guard.require_access(board_id, component.ACCESS.DELETE)
    if denied then return nil, denied end
    local id, ierr = identifiers.uuid("kickside.work.launcher.v1\0" .. board_id)
    if ierr or not id then return nil, ierr end
    local found, ferr = component.query({ component_ids = { id }, access_mask = component.ACCESS.DELETE, include = { private_context = true, placement = true }, limit = 1 })
    if ferr then return nil, ferr :: error end
    local child = found and found[1]
    if child then
        local owned, oerr = automation_db.with_db(function(db: sql.DB): (unknown, error?)
            return command.read_op(db, id, "work/stage-launcher/v1")
        end)
        if oerr then return nil, oerr :: error end
        local context = child.private_context or {}
        local portable = context._portable_input
        if not owned or child.parent_id ~= board_id or child.impl_id ~= "kickside.sync:sync" or not portable
            or portable.sink_port ~= "kickside.work.sink:stage_launch_port" or not portable.sink_config or portable.sink_config.board_id ~= board_id
            or not portable.trigger or portable.trigger.config.thread_id ~= board_id then
            return nil, guard.invalid("launcher ownership differs", { code = "stage_launcher_mismatch" })
        end
        local _, uerr = automations.uninstall(id)
        if uerr then return nil, uerr :: error end
        return nil, errors.new({ kind = errors.CONFLICT, retryable = true, message = "owned launcher deletion is pending; retry board deletion",
            details = { code = "stage_launcher_delete_pending" } })
    end
    local service, serr = component.get_service()
    if serr or not service then return nil, serr :: error? end
    local result, derr = service:delete({ component_id = board_id })
    if derr then return nil, derr :: error end
    local failure = envelope.error_of(result :: component_types.ServiceEnvelope, "delete")
    if failure then return nil, failure end
    return result, nil
end
return M
