-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local types = require("types")
-- The command consistency boundary returns only the board's committed position.
local component = require("component")
local guard = require("guard")
local execution_identity = require("execution_identity")
local threads = require("threads")
local consts = require("consts")
local domain = require("domain")
local M = {}

function M.cover(input: types.SyncRequest): (integer?, error?)
    local _, werr = component.validate_access(input.board_id, component.ACCESS.WRITE :: integer)
    if werr then
        if werr:kind() ~= errors.PERMISSION_DENIED then return nil, werr :: error end
        local aerr = guard.require_access(input.board_id, component.ACCESS.ADMIN :: integer)
        if aerr then return nil, aerr end
    end
    local context, cerr = component.get_private_context(input.board_id)
    if cerr then return nil, cerr :: error end
    local identity = context and (context :: domain.JsonObject)[execution_identity.CONTEXT_KEY]
    if not identity then return nil, errors.new({ kind = errors.INTERNAL, message = "board execution identity is missing", details = { code = "row_corrupt" } }) end
    local result, err = execution_identity.run_as(identity, "kickside.work.service:sync_position", input,
        { execution_root = input.board_id, deferred_owner = "kickside.work.service:sync" })
    return result :: integer?, err :: error?
end

function M.position(input: types.SyncRequest): (integer?, error?)
    local client, err = threads.open()
    if err or not client then return nil, err end
    local caught, cerr = threads.catch_up(client, input.board_id, consts.PROJECTION_KIND, input.deadline)
    if cerr or not caught then return nil, cerr end
    if not caught.done or not caught.last_seq then
        return nil, errors.new({ kind = errors.UNAVAILABLE, retryable = true, message = "board projection has not reached its command position", details = { code = "projection_pending" } })
    end
    return caught.last_seq, nil
end
return M
